# Part D Coverage Check — v1 Spec

A 4-question wizard that produces a memo-style result with one of three outcomes: **Delay likely appropriate**, **Caution advised**, or **Needs confirmation**. Tone: calm, structured, advisor-style; slightly firmer when penalty risk is present.

---

## Wizard screens (one question per screen)

### Step 1 — Eligibility (gate)

**Question:** Are you Medicare-eligible now?

**Helper microcopy:** This tool is for people 65 or older. (v1 simplification: 65+ only.)

**Choices:** Yes / No

**Behavior:** If **No**, show a short message: “This tool is for people 65 and older. If you’re under 65 and have Medicare due to disability or ESRD, a future version may cover your situation.” No result memo. If **Yes**, continue to Step 2.

---

### Step 2 — Current drug coverage

**Question:** Do you currently have prescription drug coverage?

**Helper microcopy:** This includes employer plans, VA, TRICARE, union plans, or other drug coverage—not just Medicare Part D.

**Choices:** Yes / No / Not sure

---

### Step 3 — Creditable status (only if Step 2 = Yes)

**Question:** Is your drug coverage “creditable”?

**Helper microcopy:** Creditable means your plan is expected to pay at least as much as Medicare’s standard Part D coverage. Your plan or employer should tell you in writing (e.g., a “creditable coverage” notice).

**Choices:** Yes / No / Not sure

**Behavior:** If Step 2 was **No** or **Not sure**, skip Step 3 and go to Step 4. (Step 4 still applies: 63+ day gap question.)

---

### Step 4 — 63+ day gap

**Question:** Have you gone 63 or more days in a row without creditable drug coverage since you first became eligible for Medicare?

**Helper microcopy:** A gap of 63+ consecutive days without creditable coverage can trigger a Part D late-enrollment penalty when you later join a Part D plan.

**Choices:** Yes / No / Not sure

---

## Decision table

Inputs:

- **Q2** = Do you have prescription drug coverage? → `yes` | `no` | `not_sure`
- **Q3** = Is it creditable? (only when Q2 = yes) → `yes` | `no` | `not_sure`
- **Q4** = 63+ days in a row without creditable coverage since eligible? → `yes` | `no` | `not_sure`

Outcomes:

- **A** = Delay likely appropriate (low penalty risk)
- **B** = Caution advised (penalty risk)
- **C** = Needs confirmation (uncertain creditable status or gap)

| Q2     | Q3       | Q4       | Outcome |
|--------|----------|----------|---------|
| no     | —        | —        | B       |
| not_sure | —      | —        | C       |
| yes    | no       | —        | B       |
| yes    | not_sure | —        | C       |
| yes    | yes      | yes      | B       |
| yes    | yes      | not_sure | C       |
| yes    | yes      | no       | A       |

*(— = not applicable or not used in that row.)*

---

## Outcome A: Delay likely appropriate

**When:** Has prescription drug coverage, coverage is creditable, and no 63+ consecutive days without creditable coverage since becoming eligible.

**Headline (example):** Your current drug coverage appears creditable with no penalty-triggering gap, so delaying Part D may be reasonable.

**Why this result (2–4 bullets):**

- You reported having prescription drug coverage and that it is creditable.
- You have not had 63 or more consecutive days without creditable coverage since you became eligible.
- Under Medicare’s rules, delaying Part D while you keep creditable coverage generally does not lead to a late-enrollment penalty when you enroll later.

**Recommended next steps:**

- Keep proof of creditable coverage (e.g., annual notice, plan documents).
- Re-check whenever your drug coverage changes or ends.
- When you lose creditable coverage, enroll in Part D within 63 days to avoid a penalty.

**What to confirm:**

- Your plan’s written “creditable coverage” notice is current and accurate.
- You understand when your coverage will end (e.g., retirement, job change) so you can enroll in Part D in time.

---

## Outcome B: Caution advised

**When:** No drug coverage; or coverage is not creditable; or has had 63+ consecutive days without creditable coverage since eligible.

**Headline (example):** Your answers suggest a risk of a Part D late-enrollment penalty. Confirm your situation before delaying Part D.

**Why this result (2–4 bullets):**

- You either have no current drug coverage, your coverage is not creditable, or you have had 63+ consecutive days without creditable coverage since becoming eligible.
- Medicare charges a Part D late-enrollment penalty for each month you were without creditable coverage when you could have enrolled; the penalty is added to your premium for as long as you have Part D.
- Enrolling in Part D soon—or getting written confirmation that your current coverage is creditable—can help you avoid or limit the penalty.

**Recommended next steps:**

- If you have no coverage or it’s not creditable: compare Part D plans and consider enrolling during an open or special enrollment period.
- If you had a 63+ day gap: gather dates and proof of when you had or lost coverage; when you enroll, Medicare may use this to assess penalty.
- Get a written “creditable coverage” determination from your current plan or employer if you believe you have creditable coverage.

**What to confirm:**

- Exact dates of any period without creditable coverage.
- Whether you’re in a valid enrollment period (e.g., initial, open, or special enrollment period).

---

## Outcome C: Needs confirmation

**When:** Any “Not sure” that affects the outcome: not sure about having coverage, not sure if it’s creditable, or not sure about a 63+ day gap.

**Headline (example):** Your situation isn’t clear enough to say whether delaying Part D is safe. Gather a few details and confirm with your plan or Medicare.

**Why this result (2–4 bullets):**

- You indicated “Not sure” for at least one of: having drug coverage, whether it’s creditable, or whether you’ve had 63+ days without creditable coverage.
- The Part D penalty depends on creditable coverage and gaps; without clarity, we can’t tell if you’re at risk.
- A written creditable-coverage notice from your plan or employer, plus your own dates of coverage, will clarify next steps.

**Recommended next steps:**

- Request a written “creditable coverage” notice from your current drug plan or employer.
- If you had other coverage in the past, gather start/end dates to see if you had 63+ consecutive days without creditable coverage.
- Call Medicare (1-800-MEDICARE) or your State Health Insurance Assistance Program (SHIP) to discuss your specific dates and coverage.

**What to confirm:**

- Whether your current or past coverage meets Medicare’s definition of creditable.
- Whether you’ve ever had 63+ consecutive days without creditable coverage since you became eligible for Medicare.

---

## Memo sections (match Part B structure)

The result memo must include these sections, in order:

1. **Why this result** — Use the bullets defined for the outcome above.
2. **What this is based on** — Summary of the four answers (eligibility, has coverage, creditable, 63+ day gap).
3. **Questions to ask your plan or Medicare** — 3–4 short questions (e.g., “Is my drug coverage creditable?” “When does my coverage end?” “Do I have a special enrollment period?”).
4. **Documents to keep** — See list below.
5. **When to re-check** — See list below.
6. **Recommended next steps** — Use the next steps for the outcome, plus any caveats.
7. **Disclaimer** — See below.

---

## Documents to keep

- Written “creditable coverage” notice(s) from your plan or employer (current and past, if relevant).
- Proof of prescription drug coverage (plan name, ID, coverage dates).
- Any letters or notices from Medicare about Part D or penalties.
- Notes with dates if you had a period without drug coverage (start/end).

---

## When to re-check

- You lose or change your prescription drug coverage.
- Your plan or employer says your coverage is no longer creditable.
- You’re approaching 63 days without creditable coverage.
- You turn 65 or first become eligible for Medicare and don’t have drug coverage.
- You get a letter from Medicare about Part D or a penalty.

---

## Disclaimer text

Use the same tone as Part B; suggested wording:

**Screen:**  
This is educational guidance—not legal or medical advice. Always confirm enrollment and penalty questions with Medicare or a licensed advisor.

**Print footer:**  
Educational guidance — confirm with Medicare or a licensed advisor.

---

## Summary

- **Wizard:** 4 steps (eligibility gate → coverage → creditable [if yes] → 63+ day gap). One question per screen with exact text and helper microcopy above.
- **Decision table:** Q2 / Q3 / Q4 map to A, B, or C as in the table.
- **Outcomes:** A = Delay likely appropriate, B = Caution advised, C = Needs confirmation. Each has headline, “Why this result” bullets, next steps, and what to confirm.
- **Memo:** Same sections as Part B (Why this result, What this is based on, Questions to ask, Documents to keep, When to re-check, Recommended next steps, Disclaimer).
- **Tone:** Calm, advisor-style; slightly firmer in Outcome B when penalty risk is present.
