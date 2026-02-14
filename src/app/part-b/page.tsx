"use client";

import { useState, useRef, useEffect } from "react";
import { evaluate } from "@/lib/decisionEngine/evaluate";
import type {
  UserProfile,
  CoverageSource,
  EmployerSizeBand,
  DecisionResult,
} from "@/lib/decisionEngine/types";
import ResultReport from "@/components/ResultReport";
import WizardShell from "@/components/WizardShell";

const COVERAGE_OPTIONS: { value: CoverageSource; label: string }[] = [
  { value: "employer_self", label: "Employer (self)" },
  { value: "employer_spouse", label: "Employer (spouse)" },
  { value: "cobra", label: "COBRA" },
  { value: "retiree", label: "Retiree" },
  { value: "marketplace", label: "Marketplace" },
  { value: "medicaid", label: "Medicaid" },
  { value: "va", label: "VA" },
  { value: "tricare", label: "TRICARE" },
  { value: "none", label: "None" },
  { value: "unknown", label: "Unknown" },
];

const EMPLOYER_SIZE_OPTIONS: { value: EmployerSizeBand; label: string }[] = [
  { value: "lt20", label: "Fewer than 20 employees" },
  { value: "ge20", label: "20 or more employees" },
  { value: "unknown", label: "Unknown" },
];

function buildProfile(
  age: number,
  currentlyWorking: boolean,
  coverageSource: CoverageSource,
  employerSizeBand: EmployerSizeBand | "",
  contributingToHSA: boolean
): UserProfile {
  const profile: UserProfile = {
    age,
    currentlyWorking,
    coverageSource,
    contributingToHSA,
  };

  if (coverageSource === "employer_self" || coverageSource === "employer_spouse") {
    profile.employerSizeBand =
      employerSizeBand === "" ? undefined : (employerSizeBand as EmployerSizeBand);
  }

  return profile;
}

export default function Home() {
  const [step, setStep] = useState(-1);

  const [age, setAge] = useState<string>("");
  const [currentlyWorking, setCurrentlyWorking] = useState<boolean | null>(null);
  const [coverageSource, setCoverageSource] = useState<CoverageSource | "">("");
  const [employerSizeBand, setEmployerSizeBand] = useState<EmployerSizeBand | "">("");
  const [contributingToHSA, setContributingToHSA] = useState<boolean | null>(null);

  const [result, setResult] = useState<DecisionResult | null>(null);

  const showEmployerStep =
    coverageSource === "employer_self" || coverageSource === "employer_spouse";

  const totalSteps = showEmployerStep ? 5 : 4;
  const stepQuestionRef = useRef<HTMLDivElement>(null);
  const workingYesRef = useRef<HTMLButtonElement>(null);
  const workingNoRef = useRef<HTMLButtonElement>(null);
  const hsaYesRef = useRef<HTMLButtonElement>(null);
  const hsaNoRef = useRef<HTMLButtonElement>(null);

  function getStepLabel(s: number, showEmployer: boolean): string {
    if (s === 0) return "Your age";
    if (s === 1) return "Working status";
    if (s === 2) return "Coverage source";
    if (s === 3) return showEmployer ? "Employer size" : "HSA contribution";
    if (s === 4) return "HSA contribution";
    return "";
  }

  useEffect(() => {
    if (step >= 0 && step <= 4) {
      stepQuestionRef.current?.focus();
    }
  }, [step]);

  // Step 0: age
  // Step 1: currentlyWorking
  // Step 2: coverageSource
  // Step 3: employerSizeBand (if employer) OR contributingToHSA (if not employer)
  // Step 4: contributingToHSA (only if employer)
  // Step 5: result

  const canNext = (() => {
    if (step === 0) return age !== "" && !isNaN(Number(age)) && Number(age) >= 0;
    if (step === 1) return currentlyWorking !== null;
    if (step === 2) return coverageSource !== "";
    if (step === 3 && showEmployerStep) return employerSizeBand !== "";
    if (step === 3 && !showEmployerStep) return contributingToHSA !== null;
    if (step === 4) return contributingToHSA !== null;
    return false;
  })();

  const goNext = () => {
    // If we're on the last question step, compute result
    if (step === 4 || (step === 3 && !showEmployerStep)) {
      const profile = buildProfile(
        Number(age),
        currentlyWorking!,
        coverageSource as CoverageSource,
        employerSizeBand,
        contributingToHSA!
      );
      setResult(evaluate(profile));
      setStep(5);
      return;
    }

    setStep(step + 1);
  };

  const resetToLanding = () => {
    setResult(null);
    setStep(-1);
    setAge("");
    setCurrentlyWorking(null);
    setCoverageSource("");
    setEmployerSizeBand("");
    setContributingToHSA(null);
  };

  const goBack = () => {
    if (step === 5) {
      // back from result goes to HSA step
      setResult(null);
      setStep(showEmployerStep ? 4 : 3);
      return;
    }

    if (step === 4) {
      setStep(3);
      return;
    }

    if (step === 3 && showEmployerStep) {
      setStep(2);
      return;
    }

    setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="mx-auto max-w-xl">
        {/* Screen reader announcement when step changes */}
        <div
          aria-live="polite"
          aria-atomic
          className="sr-only"
          role="status"
        >
          {step >= 0 && step <= 4
            ? `Step ${step + 1} of ${totalSteps}: ${getStepLabel(step, showEmployerStep)}`
            : ""}
        </div>

        {/* Landing Screen */}
        {step === -1 && (
          <div className="rounded-3xl bg-white p-10 shadow-sm ring-1 ring-zinc-200/70">
            <p className="mb-3 text-sm font-medium text-zinc-500">
              Medicare decision check (65+)
            </p>
            <h1 className="mb-4 text-3xl font-bold text-zinc-900">
              Should you delay Medicare Part B?
            </h1>
            <p className="mb-6 text-base leading-7 text-zinc-700">
              Answer a few questions and get a clear, printable summary of what to confirm before
              you delay — especially if you're working or covered by an employer plan.
            </p>
            <ul className="mb-8 space-y-2 text-sm text-zinc-700">
              <li className="flex items-start gap-2">
                <span className="mt-1 text-zinc-400">•</span>
                <span>Avoid late-enrollment penalties</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-zinc-400">•</span>
                <span>Understand when employer coverage counts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-zinc-400">•</span>
                <span>Know what to ask HR or Medicare</span>
              </li>
            </ul>
            <button
              type="button"
              data-testid="wizard-start"
              onClick={() => setStep(0)}
              className="rounded-2xl bg-zinc-900 px-7 py-3 text-sm font-medium text-white hover:opacity-90"
            >
              Start my check
            </button>
            <p className="mt-6 text-xs text-zinc-500">
              Educational guidance — not legal advice.
            </p>
          </div>
        )}

        {/* Step 0: Age */}
        {step === 0 && (
          <WizardShell ref={stepQuestionRef} step={0} totalSteps={totalSteps}>
            <label htmlFor="age" className="mb-2 block text-sm font-medium text-zinc-700">Your age</label>
            <input
              id="age"
              type="number"
              min={0}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full rounded border border-zinc-300 px-3 py-2 text-zinc-900"
            />
          </WizardShell>
        )}

        {/* Step 1: Working */}
        {step === 1 && (
          <WizardShell ref={stepQuestionRef} step={1} totalSteps={totalSteps}>
            <div
              role="radiogroup"
              aria-labelledby="q-working"
              tabIndex={0}
              className="flex flex-col gap-2 outline-none"
              onKeyDown={(e) => {
                if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                  e.preventDefault();
                  setCurrentlyWorking(false);
                  workingNoRef.current?.focus();
                } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                  e.preventDefault();
                  setCurrentlyWorking(true);
                  workingYesRef.current?.focus();
                }
              }}
            >
              <p id="q-working" className="mb-2 block text-sm font-medium text-zinc-700">
                Are you currently working (or is your spouse working if coverage is through them)?
              </p>
              <div className="flex gap-4">
                <button
                  ref={workingYesRef}
                  type="button"
                  role="radio"
                  aria-checked={currentlyWorking === true}
                  onClick={() => setCurrentlyWorking(true)}
                  className={`rounded border px-4 py-2 ${
                    currentlyWorking === true
                      ? "border-blue-600 bg-blue-50 text-blue-800"
                      : "border-zinc-300 bg-white text-zinc-700"
                  }`}
                >
                  Yes
                </button>
                <button
                  ref={workingNoRef}
                  type="button"
                  role="radio"
                  aria-checked={currentlyWorking === false}
                  onClick={() => setCurrentlyWorking(false)}
                  className={`rounded border px-4 py-2 ${
                    currentlyWorking === false
                      ? "border-blue-600 bg-blue-50 text-blue-800"
                      : "border-zinc-300 bg-white text-zinc-700"
                  }`}
                >
                  No
                </button>
              </div>
            </div>
          </WizardShell>
        )}

        {/* Step 2: Coverage Source */}
        {step === 2 && (
          <WizardShell ref={stepQuestionRef} step={2} totalSteps={totalSteps}>
            <label htmlFor="coverageSource" className="mb-2 block text-sm font-medium text-zinc-700">
              Where is your current health coverage from?
            </label>
            <select
              id="coverageSource"
              value={coverageSource}
              onChange={(e) => {
                const v = e.target.value as CoverageSource | "";
                setCoverageSource(v);

                // Prevent "sticky" employer size when switching away from employer coverage
                if (v !== "employer_self" && v !== "employer_spouse") {
                  setEmployerSizeBand("");
                }
              }}
              className="w-full rounded border border-zinc-300 px-3 py-2 text-zinc-900"
            >
              <option value="">Select...</option>
              {COVERAGE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </WizardShell>
        )}

        {/* Step 3: Employer Size (if employer coverage) */}
        {step === 3 && showEmployerStep && (
          <WizardShell ref={stepQuestionRef} step={3} totalSteps={totalSteps}>
            <label htmlFor="employerSize" className="mb-2 block text-sm font-medium text-zinc-700">
              Does the employer have 20 or more employees?
            </label>
            <select
              id="employerSize"
              value={employerSizeBand}
              onChange={(e) => setEmployerSizeBand(e.target.value as EmployerSizeBand)}
              className="w-full rounded border border-zinc-300 px-3 py-2 text-zinc-900"
            >
              <option value="">Select...</option>
              {EMPLOYER_SIZE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </WizardShell>
        )}

        {/* Step 3 (if NOT employer) OR Step 4 (if employer): HSA */}
        {((step === 3 && !showEmployerStep) || step === 4) && (
          <WizardShell ref={stepQuestionRef} step={step} totalSteps={totalSteps}>
            <div
              role="radiogroup"
              aria-labelledby="q-hsa"
              tabIndex={0}
              className="flex flex-col gap-2 outline-none"
              onKeyDown={(e) => {
                if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                  e.preventDefault();
                  setContributingToHSA(false);
                  hsaNoRef.current?.focus();
                } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                  e.preventDefault();
                  setContributingToHSA(true);
                  hsaYesRef.current?.focus();
                }
              }}
            >
              <p id="q-hsa" className="mb-2 block text-sm font-medium text-zinc-700">
                Are you currently contributing to an HSA?
              </p>
              <div className="flex gap-4">
                <button
                  ref={hsaYesRef}
                  type="button"
                  role="radio"
                  aria-checked={contributingToHSA === true}
                  onClick={() => setContributingToHSA(true)}
                  className={`rounded border px-4 py-2 ${
                    contributingToHSA === true
                      ? "border-blue-600 bg-blue-50 text-blue-800"
                      : "border-zinc-300 bg-white text-zinc-700"
                  }`}
                >
                  Yes
                </button>
                <button
                  ref={hsaNoRef}
                  type="button"
                  role="radio"
                  aria-checked={contributingToHSA === false}
                  onClick={() => setContributingToHSA(false)}
                  className={`rounded border px-4 py-2 ${
                    contributingToHSA === false
                      ? "border-blue-600 bg-blue-50 text-blue-800"
                      : "border-zinc-300 bg-white text-zinc-700"
                  }`}
                >
                  No
                </button>
              </div>
            </div>
          </WizardShell>
        )}

        {/* Step 5: Result */}
        {step === 5 && result && (
          <ResultReport
            result={result}
            profile={buildProfile(
              Number(age),
              currentlyWorking!,
              coverageSource as CoverageSource,
              employerSizeBand,
              contributingToHSA!
            )}
            onReviewAnswers={resetToLanding}
          />
        )}

        {/* Nav buttons */}
        {step >= 0 && (
          <div className="mt-10 flex gap-4">
            {step > 0 && step < 5 && (
              <button
                type="button"
                data-testid="wizard-back"
                onClick={goBack}
                className="rounded border border-zinc-300 bg-white px-4 py-2 text-zinc-700"
              >
                Back
              </button>
            )}
            {step < 5 && (
              <button
                type="button"
                data-testid={step === 4 || (step === 3 && !showEmployerStep) ? "wizard-see-result" : "wizard-next"}
                onClick={goNext}
                disabled={!canNext}
                className="rounded bg-zinc-900 px-4 py-2 text-white disabled:opacity-50"
              >
                {step === 4 || (step === 3 && !showEmployerStep) ? "See result" : "Next"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
