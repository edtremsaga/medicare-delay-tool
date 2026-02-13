// src/lib/decisionEngine/types.ts

export type CoverageSource =
  | "employer_self"
  | "employer_spouse"
  | "cobra"
  | "retiree"
  | "marketplace"
  | "medicaid"
  | "va"
  | "tricare"
  | "none"
  | "unknown";

export type EmployerSizeBand = "lt20" | "ge20" | "unknown";

export interface UserProfile {
  /** Age in years (integer). */
  age: number;

  /** Are you currently working (or your spouse is working if coverage is through spouse)? */
  currentlyWorking: boolean;

  /** Where is your current health coverage coming from? */
  coverageSource: CoverageSource;

  /**
   * If coverage is from an employer plan (self or spouse), is the employer 20+ employees?
   * (For Medicare Part B delay decisions, this is a key threshold.)
   */
  employerSizeBand?: EmployerSizeBand;

  /** Are you currently contributing to an HSA? */
  contributingToHSA: boolean;
}

export type DecisionStatus = "likely_safe_to_delay" | "likely_not_safe_to_delay" | "needs_human_review";

export interface DecisionResult {
  status: DecisionStatus;

  /** One-sentence headline: the “answer.” */
  headline: string;

  /** Short explanation of why we reached this outcome. */
  rationale: string[];

  /** Concrete next steps (e.g., what to ask HR, what to do next). */
  nextSteps: string[];

  /** Soft warnings or edge cases to be aware of. */
  caveats?: string[];
}