// src/lib/decisionEngine/evaluate.ts

import { UserProfile, DecisionResult } from "./types";
import { applyCoreRules } from "./rules";

export function evaluate(profile: UserProfile): DecisionResult {
  // Ultra-light validation / normalization (v1)
  const normalized: UserProfile = {
    ...profile,
    age: Number.isFinite(profile.age) ? Math.floor(profile.age) : profile.age,
  };

  return applyCoreRules(normalized);
}