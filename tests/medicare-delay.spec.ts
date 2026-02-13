import { test, expect } from "@playwright/test";

test.describe("Medicare Part B Delay Check", () => {
  test("Employer 20+ → Delay likely appropriate", async ({ page }) => {
    await page.goto("/");

    await page.getByTestId("wizard-start").click();

    await page.getByLabel("Your age").fill("67");
    await page.getByTestId("wizard-next").click();

    await page.getByRole("button", { name: "Yes" }).click();
    await page.getByTestId("wizard-next").click();

    await page.getByLabel("Where is your current health coverage from?").selectOption("Employer (self)");
    await page.getByTestId("wizard-next").click();

    await page.getByLabel("Does the employer have 20 or more employees?").selectOption("20 or more employees");
    await page.getByTestId("wizard-next").click();

    await page.getByRole("button", { name: "No" }).click();
    await page.getByTestId("wizard-see-result").click();

    await expect(page.getByText("Delay likely appropriate")).toBeVisible();
  });

  test("Employer <20 + HSA yes → Caution advised (edge case)", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("wizard-start").click();

    await page.getByLabel("Your age").fill("67");
    await page.getByTestId("wizard-next").click();

    await page.getByRole("button", { name: "Yes", exact: true }).click();
    await page.getByTestId("wizard-next").click();

    await page.getByLabel("Where is your current health coverage from?").selectOption("Employer (self)");
    await page.getByTestId("wizard-next").click();

    await page.getByLabel("Does the employer have 20 or more employees?").selectOption("Fewer than 20 employees");
    await page.getByTestId("wizard-next").click();

    await page.getByRole("button", { name: "Yes", exact: true }).click();
    await page.getByTestId("wizard-see-result").click();

    await expect(page.getByText("Caution advised")).toBeVisible();
    await expect(page.getByText("HSA")).toBeVisible();
  });

  test("Age step requires input before proceeding", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("wizard-start").click();

    await expect(page.getByLabel("Your age")).toBeVisible();

    const nextButton = page.getByRole("button", { name: "Next", exact: true });
    await expect(nextButton).toBeDisabled();
  });

  test("COBRA → Caution advised", async ({ page }) => {
    await page.goto("/");

    await page.getByTestId("wizard-start").click();

    await page.getByLabel("Your age").fill("66");
    await page.getByTestId("wizard-next").click();

    await page.getByRole("button", { name: "No" }).click();
    await page.getByTestId("wizard-next").click();

    await page.getByLabel("Where is your current health coverage from?").selectOption("COBRA");
    await page.getByTestId("wizard-next").click();

    await page.getByRole("button", { name: "No" }).click();
    await page.getByTestId("wizard-see-result").click();

    await expect(page.getByText("Caution advised")).toBeVisible();
  });

  test("Unknown coverage → Needs confirmation", async ({ page }) => {
    await page.goto("/");

    await page.getByTestId("wizard-start").click();

    await page.getByLabel("Your age").fill("70");
    await page.getByTestId("wizard-next").click();

    await page.getByRole("button", { name: "No" }).click();
    await page.getByTestId("wizard-next").click();

    await page.getByLabel("Where is your current health coverage from?").selectOption("Unknown");
    await page.getByTestId("wizard-next").click();

    await page.getByRole("button", { name: "No" }).click();
    await page.getByTestId("wizard-see-result").click();

    await expect(page.getByText("Needs confirmation")).toBeVisible();
  });

  test("Print or save as PDF button triggers window.print", async ({ page }) => {
    await page.addInitScript(() => {
      (window as any).__PRINT_CALLED__ = false;
      window.print = () => {
        (window as any).__PRINT_CALLED__ = true;
      };
    });

    await page.goto("/");

    await page.getByTestId("wizard-start").click();
    await page.getByLabel("Your age").fill("66");
    await page.getByTestId("wizard-next").click();
    await page.getByRole("button", { name: "No", exact: true }).click();
    await page.getByTestId("wizard-next").click();
    await page.getByLabel("Where is your current health coverage from?").selectOption("COBRA");
    await page.getByTestId("wizard-next").click();
    await page.getByRole("button", { name: "No", exact: true }).click();
    await page.getByTestId("wizard-see-result").click();

    await expect(page.getByText("Caution advised")).toBeVisible();

    await page.getByRole("button", { name: "Print or save as PDF", exact: true }).click();

    const printCalled = await page.evaluate(() => (window as any).__PRINT_CALLED__ === true);
    expect(printCalled).toBe(true);
  });
});
