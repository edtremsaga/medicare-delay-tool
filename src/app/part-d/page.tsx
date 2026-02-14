"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import WizardShell from "@/components/WizardShell";

type TriState = "yes" | "no" | "not_sure";
type PartDOutcome = "A" | "B" | "C";

function evaluatePartD(
  coverage: TriState,
  creditable: TriState | "skipped",
  gap: TriState
): PartDOutcome {
  if (coverage === "no") return "B";
  if (coverage === "not_sure") return "C";
  if (creditable === "no") return "B";
  if (creditable === "not_sure") return "C";
  if (gap === "yes") return "B";
  if (gap === "not_sure") return "C";
  return "A";
}

const DOCUMENTS_TO_KEEP = [
  "Written \"creditable coverage\" notice(s) from your plan or employer (current and past, if relevant).",
  "Proof of prescription drug coverage (plan name, ID, coverage dates).",
  "Any letters or notices from Medicare about Part D or penalties.",
  "Notes with dates if you had a period without drug coverage (start/end).",
];

const WHEN_TO_RECHECK = [
  "You lose or change your prescription drug coverage.",
  "Your plan or employer says your coverage is no longer creditable.",
  "You're approaching 63 days without creditable coverage.",
  "You turn 65 or first become eligible and don't have drug coverage.",
  "You get a letter from Medicare about Part D or a penalty.",
];

const QUESTIONS_TO_ASK = [
  "Is my drug coverage considered creditable for Medicare Part D?",
  "When does my current drug coverage end?",
  "Do I qualify for a special enrollment period if my coverage ends?",
  "Have you recorded any gaps in my creditable coverage history?",
];

function RadioGroupTri({
  id,
  value,
  onChange,
  refs,
}: {
  id: string;
  value: TriState | null;
  onChange: (v: TriState) => void;
  refs: React.RefObject<HTMLButtonElement | null>[];
}) {
  const options: TriState[] = ["yes", "no", "not_sure"];
  const labels = { yes: "Yes", no: "No", not_sure: "Not sure" };
  return (
    <div
      role="radiogroup"
      aria-labelledby={id}
      tabIndex={0}
      className="flex flex-col gap-2 outline-none"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          e.preventDefault();
          const i = value === null ? 0 : options.indexOf(value);
          const next = Math.min(i + 1, 2);
          onChange(options[next]);
          refs[next]?.current?.focus();
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          e.preventDefault();
          const i = value === null ? 0 : options.indexOf(value);
          const prev = Math.max(i - 1, 0);
          onChange(options[prev]);
          refs[prev]?.current?.focus();
        }
      }}
    >
      <div className="flex flex-wrap gap-4">
        {options.map((opt, i) => (
          <button
            key={opt}
            ref={refs[i] as React.RefObject<HTMLButtonElement>}
            type="button"
            role="radio"
            aria-checked={value === opt}
            onClick={() => onChange(opt)}
            className={`rounded border px-4 py-2 ${
              value === opt ? "border-blue-600 bg-blue-50 text-blue-800" : "border-zinc-300 bg-white text-zinc-700"
            }`}
          >
            {labels[opt]}
          </button>
        ))}
      </div>
    </div>
  );
}

function RadioGroupYesNo({
  value,
  onChange,
  yesRef,
  noRef,
}: {
  value: boolean | null;
  onChange: (v: boolean) => void;
  yesRef: React.RefObject<HTMLButtonElement | null>;
  noRef: React.RefObject<HTMLButtonElement | null>;
}) {
  return (
    <div
      role="radiogroup"
      aria-labelledby="q-eligible"
      tabIndex={0}
      className="flex flex-col gap-2 outline-none"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          e.preventDefault();
          onChange(false);
          noRef.current?.focus();
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          e.preventDefault();
          onChange(true);
          yesRef.current?.focus();
        }
      }}
    >
      <div className="flex gap-4">
        <button
          ref={yesRef}
          type="button"
          role="radio"
          aria-checked={value === true}
          onClick={() => onChange(true)}
          className={`rounded border px-4 py-2 ${
            value === true ? "border-blue-600 bg-blue-50 text-blue-800" : "border-zinc-300 bg-white text-zinc-700"
          }`}
        >
          Yes
        </button>
        <button
          ref={noRef}
          type="button"
          role="radio"
          aria-checked={value === false}
          onClick={() => onChange(false)}
          className={`rounded border px-4 py-2 ${
            value === false ? "border-blue-600 bg-blue-50 text-blue-800" : "border-zinc-300 bg-white text-zinc-700"
          }`}
        >
          No
        </button>
      </div>
    </div>
  );
}

export default function PartDPage() {
  const [step, setStep] = useState(-1);
  const [eligible, setEligible] = useState<boolean | null>(null);
  const [coverage, setCoverage] = useState<TriState | null>(null);
  const [creditable, setCreditable] = useState<TriState | null>(null);
  const [gap, setGap] = useState<TriState | null>(null);

  const stepQuestionRef = useRef<HTMLDivElement>(null);
  const eligibleYesRef = useRef<HTMLButtonElement>(null);
  const eligibleNoRef = useRef<HTMLButtonElement>(null);
  const coverageRefs = [useRef<HTMLButtonElement>(null), useRef<HTMLButtonElement>(null), useRef<HTMLButtonElement>(null)];
  const creditableRefs = [useRef<HTMLButtonElement>(null), useRef<HTMLButtonElement>(null), useRef<HTMLButtonElement>(null)];
  const gapRefs = [useRef<HTMLButtonElement>(null), useRef<HTMLButtonElement>(null), useRef<HTMLButtonElement>(null)];

  const showCreditableStep = coverage === "yes";
  const totalSteps = showCreditableStep ? 4 : 3;
  const currentDisplayStep = showCreditableStep ? step : step === 3 ? 2 : step;

  function getStepLabel(s: number): string {
    if (s === 0) return "Eligibility";
    if (s === 1) return "Drug coverage";
    if (s === 2) return showCreditableStep ? "Creditable" : "63+ day gap";
    if (s === 3) return "63+ day gap";
    return "";
  }

  useEffect(() => {
    if (step >= 0 && step <= 3) {
      stepQuestionRef.current?.focus();
    }
  }, [step]);

  const canNext =
    step === 1 ? coverage !== null :
    step === 2 ? creditable !== null :
    step === 3 ? gap !== null : false;

  const goNext = () => {
    if (step === 0 && eligible === true) {
      setStep(1);
      return;
    }
    if (step === 1) {
      setStep(showCreditableStep ? 2 : 3);
      return;
    }
    if (step === 2) {
      setStep(3);
      return;
    }
    if (step === 3) {
      setStep(4);
      return;
    }
  };

  const goBack = () => {
    if (step === 4) setStep(3);
    else if (step === 3) setStep(showCreditableStep ? 2 : 1);
    else if (step === 2) setStep(1);
    else if (step === 1) setStep(0);
    else if (step === 0) setStep(-1);
  };

  const resetToLanding = () => {
    setStep(-1);
    setEligible(null);
    setCoverage(null);
    setCreditable(null);
    setGap(null);
  };

  const outcome: PartDOutcome | null =
    step === 4 && coverage !== null && gap !== null
      ? evaluatePartD(coverage, showCreditableStep ? (creditable ?? "not_sure") : "skipped", gap)
      : null;

  const isResultStep = step === 4 && outcome !== null;

  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="mx-auto max-w-xl">
        <div aria-live="polite" aria-atomic className="sr-only" role="status">
          {step >= 0 && step <= 3 ? `Step ${currentDisplayStep + 1} of ${totalSteps}: ${getStepLabel(step)}` : ""}
        </div>

        {/* Landing */}
        {step === -1 && (
          <div className="rounded-3xl bg-white p-10 shadow-sm ring-1 ring-zinc-200/70">
            <p className="mb-3 text-sm font-medium text-zinc-500">Part D coverage check (65+)</p>
            <h1 className="mb-4 text-3xl font-bold text-zinc-900">
              Should you delay Medicare Part D?
            </h1>
            <p className="mb-6 text-base leading-7 text-zinc-700">
              Answer a few questions to see whether delaying Part D may be reasonable or could lead to a late-enrollment penalty.
            </p>
            <button
              type="button"
              data-testid="wizard-start"
              onClick={() => setStep(0)}
              className="rounded-2xl bg-zinc-900 px-7 py-3 text-sm font-medium text-white hover:opacity-90"
            >
              Start my check
            </button>
            <p className="mt-6 text-xs text-zinc-500">Educational guidance — not legal advice.</p>
          </div>
        )}

        {/* Step 0: Eligibility */}
        {step === 0 && (
          <WizardShell ref={stepQuestionRef} step={0} totalSteps={totalSteps}>
            <p id="q-eligible" className="mb-2 block text-sm font-medium text-zinc-700">
              Are you Medicare-eligible now?
            </p>
            <p className="mb-3 text-xs text-zinc-500">
              This tool is for people 65 or older. (v1 simplification: 65+ only.)
            </p>
            <RadioGroupYesNo
              value={eligible}
              onChange={(v) => {
                setEligible(v);
                if (v) setStep(1);
              }}
              yesRef={eligibleYesRef}
              noRef={eligibleNoRef}
            />
            {eligible === false && (
              <div className="mt-6 rounded-xl bg-zinc-100 p-4 text-sm text-zinc-800">
                <p className="mb-4">
                  This tool is for people 65 and older. If you're under 65 and have Medicare due to disability or ESRD, a future version may cover your situation.
                </p>
                <Link
                  href="/"
                  className="inline-block rounded-xl bg-zinc-900 px-5 py-2 text-sm font-medium text-white hover:opacity-90"
                >
                  Back to tools
                </Link>
              </div>
            )}
          </WizardShell>
        )}

        {/* Step 1: Coverage */}
        {step === 1 && (
          <WizardShell ref={stepQuestionRef} step={1} totalSteps={totalSteps}>
            <p id="q-coverage" className="mb-2 block text-sm font-medium text-zinc-700">
              Do you currently have prescription drug coverage?
            </p>
            <p className="mb-3 text-xs text-zinc-500">
              This includes employer plans, VA, TRICARE, union plans, or other drug coverage—not just Medicare Part D.
            </p>
            <RadioGroupTri
              id="q-coverage"
              value={coverage}
              onChange={setCoverage}
              refs={coverageRefs}
            />
          </WizardShell>
        )}

        {/* Step 2: Creditable (only if coverage yes) */}
        {step === 2 && showCreditableStep && (
          <WizardShell ref={stepQuestionRef} step={2} totalSteps={totalSteps}>
            <p id="q-creditable" className="mb-2 block text-sm font-medium text-zinc-700">
              Is your drug coverage &quot;creditable&quot;?
            </p>
            <p className="mb-3 text-xs text-zinc-500">
              Creditable means your plan is expected to pay at least as much as Medicare's standard Part D coverage. Your plan or employer should tell you in writing (e.g., a &quot;creditable coverage&quot; notice).
            </p>
            <RadioGroupTri
              id="q-creditable"
              value={creditable}
              onChange={setCreditable}
              refs={creditableRefs}
            />
          </WizardShell>
        )}

        {/* Step 3: 63+ day gap */}
        {step === 3 && (
          <WizardShell ref={stepQuestionRef} step={currentDisplayStep} totalSteps={totalSteps}>
            <p id="q-gap" className="mb-2 block text-sm font-medium text-zinc-700">
              Have you gone 63 or more days in a row without creditable drug coverage since you first became eligible for Medicare?
            </p>
            <p className="mb-3 text-xs text-zinc-500">
              A gap of 63+ consecutive days without creditable coverage can trigger a Part D late-enrollment penalty when you later join a Part D plan.
            </p>
            <RadioGroupTri
              id="q-gap"
              value={gap}
              onChange={setGap}
              refs={gapRefs}
            />
          </WizardShell>
        )}

        {/* Result memo */}
        {isResultStep && outcome && (
          <PartDResultMemo
            outcome={outcome}
            eligible={eligible!}
            coverage={coverage!}
            creditable={showCreditableStep ? creditable! : "skipped"}
            gap={gap!}
            onReviewAnswers={resetToLanding}
          />
        )}

        {/* Nav */}
        {step >= 0 && step < 4 && (
          <div className="mt-10 flex gap-4">
            {step > 0 && (
              <button
                type="button"
                data-testid="wizard-back"
                onClick={goBack}
                className="rounded border border-zinc-300 bg-white px-4 py-2 text-zinc-700"
              >
                Back
              </button>
            )}
            {step >= 1 && step <= 3 && (
              <button
                type="button"
                data-testid={step === 3 ? "wizard-see-result" : "wizard-next"}
                onClick={goNext}
                disabled={!canNext}
                className="rounded bg-zinc-900 px-4 py-2 text-white disabled:opacity-50"
              >
                {step === 3 ? "See result" : "Next"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function PartDResultMemo({
  outcome,
  eligible,
  coverage,
  creditable,
  gap,
  onReviewAnswers,
}: {
  outcome: PartDOutcome;
  eligible: boolean;
  coverage: TriState;
  creditable: TriState | "skipped";
  gap: TriState;
  onReviewAnswers: () => void;
}) {
  const isA = outcome === "A";
  const isB = outcome === "B";
  const isC = outcome === "C";
  const bandClass = isA ? "border-l-8 border-l-[#059669]" : isB ? "border-l-8 border-l-[#be123c]" : "border-l-8 border-l-[#d97706]";
  const bgClass = isA ? "bg-[#d1fae5]" : isB ? "bg-[#fee2e2]" : "bg-[#fef3c7]";
  const pillClass = isA ? "bg-[#059669] text-white" : isB ? "bg-[#be123c] text-white" : "bg-[#d97706] text-white";
  const label = isA ? "Delay likely appropriate" : isB ? "Caution advised" : "Needs confirmation";
  const summary = isA
    ? "Based on your answers, delaying Part D may be reasonable. Here's what to confirm to avoid surprises."
    : isB
      ? "Based on your answers, delaying Part D may expose you to a late-enrollment penalty. Here's what to confirm before deciding."
      : "Your situation isn't clear enough from these answers. Here's what to gather and who to ask.";
  const headline = isA
    ? "Your current drug coverage appears creditable with no penalty-triggering gap, so delaying Part D may be reasonable."
    : isB
      ? "Your answers suggest a risk of a Part D late-enrollment penalty. Confirm your situation before delaying Part D."
      : "Your situation isn't clear enough to say whether delaying Part D is safe. Gather a few details and confirm with your plan or Medicare.";
  const rationale = isA
    ? [
        "You reported having prescription drug coverage and that it is creditable.",
        "You have not had 63 or more consecutive days without creditable coverage since you became eligible.",
        "Under Medicare's rules, delaying Part D while you keep creditable coverage generally does not lead to a late-enrollment penalty when you enroll later.",
      ]
    : isB
      ? [
          "You either have no current drug coverage, your coverage is not creditable, or you have had 63+ consecutive days without creditable coverage since becoming eligible.",
          "Medicare may charge a Part D late-enrollment penalty for months you were without creditable coverage when you could have enrolled; the penalty is added to your premium for as long as you have Part D.",
          "Enrolling in Part D soon—or getting written confirmation that your current coverage is creditable—can help you avoid or limit the penalty.",
        ]
      : [
          "You indicated \"Not sure\" for at least one of: having drug coverage, whether it's creditable, or whether you've had 63+ days without creditable coverage.",
          "The Part D penalty depends on creditable coverage and gaps; without clarity, we can't tell if you're at risk.",
          "A written creditable-coverage notice plus your coverage dates will clarify next steps.",
        ];
  const nextSteps = isA
    ? [
        "Keep proof of creditable coverage (e.g., annual notice, plan documents).",
        "Re-check whenever your drug coverage changes or ends.",
        "When you lose creditable coverage, enroll in Part D within 63 days to avoid a penalty.",
        "Confirm your plan's written \"creditable coverage\" notice is current and accurate.",
        "Confirm you understand when your coverage will end so you can enroll in Part D in time.",
      ]
    : isB
      ? [
        "If you have no coverage or it's not creditable: compare Part D plans and consider enrolling during an open or special enrollment period.",
        "If you had a 63+ day gap: gather dates and proof of when you had or lost coverage.",
        "Request a written \"creditable coverage\" determination from your current plan or employer if you believe your coverage is creditable.",
        "Confirm exact dates of any period without creditable coverage.",
        "Confirm whether you're in a valid enrollment period (initial, open, or special enrollment period).",
      ]
      : [
        "Request a written \"creditable coverage\" notice from your plan or employer.",
        "Gather start/end dates for any past drug coverage to see if you had 63+ consecutive days without creditable coverage.",
        "Call Medicare (1-800-MEDICARE) or your State Health Insurance Assistance Program (SHIP) to review your dates and coverage.",
        "Confirm whether your coverage meets Medicare's definition of creditable.",
        "Confirm whether you've ever had 63+ consecutive days without creditable coverage since you became eligible.",
      ];

  const creditableLabel = creditable === "skipped" ? "Skipped" : creditable === "yes" ? "Yes" : creditable === "no" ? "No" : "Not sure";
  const coverageLabel = coverage === "yes" ? "Yes" : coverage === "no" ? "No" : "Not sure";
  const gapLabel = gap === "yes" ? "Yes" : gap === "no" ? "No" : "Not sure";

  return (
    <div className="print-root mx-auto max-w-3xl space-y-8">
      <div className="print-only print-header">
        <h1>Medicare Part D Coverage Check</h1>
        <p>Generated: {new Date().toLocaleString()}</p>
      </div>
      <div className={`rounded-2xl shadow-sm ${bandClass} ${bgClass} p-7`}>
        <div>
          <div className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${pillClass}`}>
            {label}
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900">{headline}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-900">{summary}</p>
        </div>
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-zinc-900">Why this result</h3>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-sm leading-6 text-zinc-900">
            {rationale.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="no-print mt-6 flex justify-center gap-4">
        <button
          onClick={onReviewAnswers}
          className="rounded-xl bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:opacity-90"
        >
          Review or change my answers
        </button>
        <button
          onClick={() => window.print()}
          className="rounded-xl border border-zinc-300 bg-white px-6 py-3 text-sm font-medium text-zinc-900"
        >
          Print or save as PDF
        </button>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-zinc-200/70">
          <h3 className="relative pl-4 text-lg font-semibold text-zinc-900 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:rounded-full before:bg-zinc-300">
            What this is based on
          </h3>
          <div className="mt-4 grid gap-3 text-sm text-zinc-800 sm:grid-cols-2">
            <div className="flex gap-2 sm:col-span-2">
              <span className="text-zinc-500">Medicare-eligible now:</span>
              <span className="font-medium text-zinc-900">{eligible ? "Yes" : "No"}</span>
            </div>
            <div className="flex gap-2 sm:col-span-2">
              <span className="text-zinc-500">Current drug coverage:</span>
              <span className="font-medium text-zinc-900">{coverageLabel}</span>
            </div>
            <div className="flex gap-2 sm:col-span-2">
              <span className="text-zinc-500">Creditable:</span>
              <span className="font-medium text-zinc-900">{creditableLabel}</span>
            </div>
            <div className="flex gap-2 sm:col-span-2">
              <span className="text-zinc-500">63+ day gap:</span>
              <span className="font-medium text-zinc-900">{gapLabel}</span>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-zinc-200/70">
          <h3 className="relative pl-4 text-lg font-semibold text-zinc-900 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:rounded-full before:bg-blue-400">
            Questions to ask your plan or Medicare
          </h3>
          <ul className="mt-3 list-disc space-y-1 pl-6 text-sm leading-6 text-zinc-800">
            {QUESTIONS_TO_ASK.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-zinc-200/70">
          <h3 className="relative pl-4 text-lg font-semibold text-zinc-900 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:rounded-full before:bg-amber-400">
            Documents to keep
          </h3>
          <ul className="mt-3 list-disc space-y-1 pl-6 text-sm leading-6 text-zinc-800">
            {DOCUMENTS_TO_KEEP.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-zinc-200/70">
          <h3 className="relative pl-4 text-lg font-semibold text-zinc-900 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:rounded-full before:bg-purple-400">
            When to re-check
          </h3>
          <ul className="mt-3 list-disc space-y-1 pl-6 text-sm leading-6 text-zinc-800">
            {WHEN_TO_RECHECK.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-zinc-200/70">
        <h3 className="relative pl-4 text-lg font-semibold text-zinc-900 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:rounded-full before:bg-emerald-400">
          Recommended next steps
        </h3>
        <ul className="mt-3 list-disc space-y-1 pl-6 text-sm leading-6 text-zinc-800">
          {nextSteps.map((n, i) => (
            <li key={i}>{n}</li>
          ))}
        </ul>
      </div>
      <p className="mt-6 text-xs text-zinc-500">
        Method: Decision logic reflects Medicare's published guidance (see Medicare.gov links).
      </p>
      <div className="no-print pb-6 text-xs leading-5 text-zinc-500">
        This is educational guidance—not legal or medical advice. Always confirm enrollment and penalty questions with Medicare or a licensed advisor.
      </div>
      <div className="print-only print-footer">
        Educational guidance — confirm with Medicare or a licensed advisor.
      </div>
    </div>
  );
}
