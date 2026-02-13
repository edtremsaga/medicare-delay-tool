// src/lib/decisionEngine/rules.ts

import { UserProfile, DecisionResult } from "./types";

/**
 * Core rule evaluator.
 * v1: Simple, deterministic, no edge-case explosion.
 */
export function applyCoreRules(profile: UserProfile): DecisionResult {
  // Guardrail: under 65
  if (profile.age < 65) {
    return {
      status: "needs_human_review",
      headline: "You are not yet 65.",
      rationale: [
        "Medicare eligibility typically begins at age 65.",
        "This tool is designed for people who are 65 or older.",
      ],
      nextSteps: [
        "If you are approaching 65, review your enrollment timeline.",
        "Consider speaking with a Medicare advisor as you get closer to eligibility.",
      ],
    };
  }

  // COBRA is NOT considered creditable coverage for delaying Part B
  if (profile.coverageSource === "cobra") {
    return {
      status: "likely_not_safe_to_delay",
      headline: "COBRA coverage usually does not allow you to delay Part B safely.",
      rationale: [
        "COBRA is generally not considered active employer coverage for Medicare delay purposes.",
        "Delaying Part B while on COBRA can result in penalties.",
      ],
      nextSteps: [
        "Contact Medicare or a licensed advisor immediately.",
        "Confirm your Special Enrollment Period eligibility.",
      ],
    };
  }

  // Retiree coverage is NOT active employer coverage
  if (profile.coverageSource === "retiree") {
    return {
      status: "likely_not_safe_to_delay",
      headline: "Retiree coverage usually does not allow you to delay Part B safely.",
      rationale: [
        "Retiree health plans are not the same as active employer coverage.",
        "Delaying Part B under retiree coverage may result in penalties.",
      ],
      nextSteps: [
        "Speak with your benefits administrator.",
        "Confirm whether your coverage qualifies for a Special Enrollment Period.",
      ],
    };
  }

  // Active employer coverage (self or spouse)
  if (
    profile.coverageSource === "employer_self" ||
    profile.coverageSource === "employer_spouse"
  ) {
    if (profile.currentlyWorking && profile.employerSizeBand === "ge20") {
      return {
        status: "likely_safe_to_delay",
        headline: "You can likely delay Part B without penalty.",
        rationale: [
          "You are covered under active employer insurance.",
          "The employer has 20 or more employees, which is typically the threshold for delaying Part B.",
        ],
        nextSteps: [
          "Confirm with your HR department that your coverage is considered primary to Medicare.",
          "Keep documentation of your employer coverage.",
        ],
        caveats: [
          "Rules can vary in special circumstances.",
          "Always confirm before making a final enrollment decision.",
        ],
      };
    }

    if (profile.currentlyWorking && profile.employerSizeBand === "lt20") {
      return {
        status: "likely_not_safe_to_delay",
        headline: "You may not be able to delay Part B safely.",
        rationale: [
          "If the employer has fewer than 20 employees, Medicare may be primary.",
          "Delaying Part B in this situation can result in penalties.",
        ],
        nextSteps: [
          "Confirm employer size with HR.",
          "Contact Medicare to verify whether you must enroll in Part B.",
        ],
      };
    }
  }

  // If none of the above rules matched
  return {
    status: "needs_human_review",
    headline: "Your situation requires individual review.",
    rationale: [
      "Your coverage type or employment status does not clearly fit standard delay rules.",
    ],
    nextSteps: [
      "Contact Medicare directly.",
      "Speak with a licensed Medicare advisor.",
    ],
  };
}