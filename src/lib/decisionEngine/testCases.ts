// src/lib/decisionEngine/testCases.ts

import { evaluate } from "./evaluate";
import { UserProfile } from "./types";

type NamedCase = {
  name: string;
  profile: UserProfile;
};

export const TEST_CASES: NamedCase[] = [
  {
    name: "A) 67, still working, employer coverage, 20+ employees → likely safe",
    profile: {
      age: 67,
      currentlyWorking: true,
      coverageSource: "employer_self",
      employerSizeBand: "ge20",
      contributingToHSA: false,
    },
  },
  {
    name: "B) 66, on COBRA → likely NOT safe",
    profile: {
      age: 66,
      currentlyWorking: false,
      coverageSource: "cobra",
      contributingToHSA: false,
    },
  },
  {
    name: "C) 65, retiree coverage → likely NOT safe",
    profile: {
      age: 65,
      currentlyWorking: false,
      coverageSource: "retiree",
      contributingToHSA: false,
    },
  },
  {
    name: "D) 65, spouse working, spouse employer 20+ → likely safe",
    profile: {
      age: 65,
      currentlyWorking: true,
      coverageSource: "employer_spouse",
      employerSizeBand: "ge20",
      contributingToHSA: false,
    },
  },
  {
    name: "E) 65, still working, employer <20 → likely NOT safe",
    profile: {
      age: 65,
      currentlyWorking: true,
      coverageSource: "employer_self",
      employerSizeBand: "lt20",
      contributingToHSA: false,
    },
  },
  {
    name: "F) 64 (guardrail) → needs human review",
    profile: {
      age: 64,
      currentlyWorking: true,
      coverageSource: "employer_self",
      employerSizeBand: "ge20",
      contributingToHSA: false,
    },
  },
  {
    name: "G) 70, unknown coverage → needs human review",
    profile: {
      age: 70,
      currentlyWorking: false,
      coverageSource: "unknown",
      contributingToHSA: false,
    },
  },
];

export function runTestCases() {
  for (const tc of TEST_CASES) {
    const result = evaluate(tc.profile);
    // eslint-disable-next-line no-console
    console.log(`\n=== ${tc.name} ===`);
    // eslint-disable-next-line no-console
    console.log(`Status:   ${result.status}`);
    // eslint-disable-next-line no-console
    console.log(`Headline: ${result.headline}`);
    // eslint-disable-next-line no-console
    console.log(`Rationale:\n- ${result.rationale.join("\n- ")}`);
    // eslint-disable-next-line no-console
    console.log(`Next Steps:\n- ${result.nextSteps.join("\n- ")}`);
    if (result.caveats?.length) {
      // eslint-disable-next-line no-console
      console.log(`Caveats:\n- ${result.caveats.join("\n- ")}`);
    }
  }
}