"use client";

import { DecisionResult, UserProfile } from "@/lib/decisionEngine/types";

interface Props {
  result: DecisionResult;
  profile: UserProfile;
  onReviewAnswers: () => void;
}

function humanizeCoverage(source: UserProfile["coverageSource"]) {
  switch (source) {
    case "employer_self":
      return "Employer plan (your job)";
    case "employer_spouse":
      return "Employer plan (spouse’s job)";
    case "cobra":
      return "COBRA continuation coverage";
    case "retiree":
      return "Retiree health plan";
    case "marketplace":
      return "Marketplace / ACA plan";
    case "medicaid":
      return "Medicaid";
    case "va":
      return "VA coverage";
    case "tricare":
      return "TRICARE";
    case "none":
      return "No current coverage";
    case "unknown":
    default:
      return "Unknown / not sure";
  }
}

function humanizeEmployerSize(band: UserProfile["employerSizeBand"]) {
  switch (band) {
    case "ge20":
      return "20 or more employees";
    case "lt20":
      return "Fewer than 20 employees";
    case "unknown":
      return "Not sure";
    default:
      return "Not sure";
  }
}

function statusUi(status: DecisionResult["status"]) {
  const isSafe = status === "likely_safe_to_delay";
  const isNotSafe = status === "likely_not_safe_to_delay";
  const isReview = status === "needs_human_review";

  const bandClass = isSafe
    ? "border-l-8 border-l-[#059669]"
    : isNotSafe
      ? "border-l-8 border-l-[#be123c]"
      : "border-l-8 border-l-[#d97706]";

  const bgClass = isSafe
    ? "bg-[#d1fae5]"
    : isNotSafe
      ? "bg-[#fee2e2]"
      : "bg-[#fef3c7]";

  const pillClass = isSafe
    ? "bg-[#059669] text-white"
    : isNotSafe
      ? "bg-[#be123c] text-white"
      : "bg-[#d97706] text-white";

  const label = isSafe
    ? "Delay likely appropriate"
    : isNotSafe
      ? "Caution advised"
      : "Needs confirmation";

  const summary = isSafe
    ? "Based on your answers, delaying Part B may be reasonable. Here's what to confirm to avoid surprises."
    : isNotSafe
      ? "Based on your answers, delaying Part B may expose you to late-enrollment penalties. Here's what to confirm before deciding."
      : "Your situation doesn’t fit a standard pattern. Here's what to gather and who to ask.";

  return { bandClass, bgClass, pillClass, label, summary };
}

export default function ResultReport({ result, profile, onReviewAnswers }: Props) {
  const employerRelated =
    profile.coverageSource === "employer_self" ||
    profile.coverageSource === "employer_spouse";

  const ui = statusUi(result.status);
  const generatedDate = new Date().toLocaleString();

  return (
    <div className="print-root mx-auto max-w-3xl space-y-8">
      {/* Print-only header */}
      <div className="print-only print-header">
        <h1>Medicare Part B Delay Check</h1>
        <p>Generated: {generatedDate}</p>
      </div>
      {/* Executive Summary */}
      <div className={`rounded-2xl shadow-sm ${ui.bandClass} ${ui.bgClass} p-7`}>
        <div>
          <div
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${ui.pillClass}`}
          >
            {ui.label}
          </div>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900">
            {result.headline}
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-900">
            {ui.summary}
          </p>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-zinc-900">Why this result</h3>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-sm leading-6 text-zinc-900">
            {result.rationale.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* CTA Buttons */}
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

      {/* Lower sections grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* What this is based on */}
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-zinc-200/70">
          <h3 className="relative pl-4 text-lg font-semibold text-zinc-900 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:rounded-full before:bg-zinc-300">
            What this is based on
          </h3>

          <div className="mt-4 grid gap-3 text-sm text-zinc-800 sm:grid-cols-2">
            <div className="flex gap-2">
              <span className="text-zinc-500">Age:</span>
              <span className="font-medium text-zinc-900">{profile.age}</span>
            </div>

            <div className="flex gap-2">
              <span className="text-zinc-500">Currently working:</span>
              <span className="font-medium text-zinc-900">
                {profile.currentlyWorking ? "Yes" : "No"}
              </span>
            </div>

            <div className="flex gap-2 sm:col-span-2">
              <span className="text-zinc-500">Coverage:</span>
              <span className="font-medium text-zinc-900">
                {humanizeCoverage(profile.coverageSource)}
              </span>
            </div>

            {employerRelated && (
              <div className="flex gap-2 sm:col-span-2">
                <span className="text-zinc-500">Employer size:</span>
                <span className="font-medium text-zinc-900">
                  {humanizeEmployerSize(profile.employerSizeBand)}
                </span>
              </div>
            )}

            <div className="flex gap-2 sm:col-span-2">
              <span className="text-zinc-500">Contributing to an HSA:</span>
              <span className="font-medium text-zinc-900">
                {profile.contributingToHSA ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </div>

        {/* Questions to ask */}
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-zinc-200/70">
          <h3 className="relative pl-4 text-lg font-semibold text-zinc-900 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:rounded-full before:bg-blue-400">
            Questions to ask HR or Medicare
          </h3>
          <ul className="mt-3 list-disc space-y-1 pl-6 text-sm leading-6 text-zinc-800">
            {employerRelated ? (
              <>
                <li>Is our employer plan considered primary to Medicare at my age?</li>
                <li>Will you complete CMS Form L564 if I delay Part B?</li>
                <li>What happens to my coverage when I retire or stop working?</li>
              </>
            ) : (
              <>
                <li>Does this coverage qualify me for a Special Enrollment Period?</li>
                <li>When does my enrollment window begin and end?</li>
                <li>What documentation will Medicare require from me?</li>
              </>
            )}
          </ul>
        </div>

        {/* Documents to keep */}
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-zinc-200/70">
          <h3 className="relative pl-4 text-lg font-semibold text-zinc-900 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:rounded-full before:bg-amber-400">
            Documents to keep
          </h3>
          <ul className="mt-3 list-disc space-y-1 pl-6 text-sm leading-6 text-zinc-800">
            {employerRelated ? (
              <>
                <li>Proof of employer coverage (plan documents, ID card, or confirmation letter)</li>
                <li>Employer size confirmation (20+ threshold)</li>
                <li>Coverage start date</li>
                <li>HR contact information</li>
              </>
            ) : (
              <>
                <li>COBRA / retiree plan documents</li>
                <li>Coverage start and termination dates</li>
                <li>Any Medicare correspondence</li>
              </>
            )}
          </ul>
        </div>

        {/* When to re-evaluate */}
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-zinc-200/70">
          <h3 className="relative pl-4 text-lg font-semibold text-zinc-900 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:rounded-full before:bg-purple-400">
            When to re-check
          </h3>
          <ul className="mt-3 list-disc space-y-1 pl-6 text-sm leading-6 text-zinc-800">
            <li>If you stop working</li>
            <li>If employer size changes</li>
            <li>If you drop employer coverage</li>
            <li>If you begin receiving Social Security</li>
          </ul>
        </div>
      </div>

      {/* Next steps - full width */}
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-zinc-200/70">
        <h3 className="relative pl-4 text-lg font-semibold text-zinc-900 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:rounded-full before:bg-emerald-400">
          Recommended next steps
        </h3>
        <ul className="mt-3 list-disc space-y-1 pl-6 text-sm leading-6 text-zinc-800">
          {result.nextSteps.map((n, i) => (
            <li key={i}>{n}</li>
          ))}
        </ul>

        {result.caveats?.length ? (
          <div className="mt-5 rounded-xl bg-[#fef3c7] p-4">
            <h4 className="text-sm font-semibold text-zinc-900">Caveats</h4>
            <ul className="mt-2 list-disc space-y-1 pl-6 text-sm leading-6 text-zinc-900">
              {result.caveats.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      {/* Official resources */}
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-zinc-200/70">
        <h3 className="relative pl-4 text-lg font-semibold text-zinc-900 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:rounded-full before:bg-slate-400">
          Official resources
        </h3>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-6 text-zinc-800">
          <li>
            <a
              href="https://www.medicare.gov/basics/get-started-with-medicare/sign-up/when-can-i-sign-up-for-medicare"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-700 underline hover:text-blue-800"
            >
              When can I sign up for Medicare?
            </a>
            <span className="block text-zinc-600">
              Medicare.gov — explains initial and special enrollment periods.
            </span>
          </li>
          <li>
            <a
              href="https://www.medicare.gov/basics/costs/medicare-costs/avoid-penalties"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-700 underline hover:text-blue-800"
            >
              Avoid late enrollment penalties
            </a>
            <span className="block text-zinc-600">
              Medicare.gov — how to avoid extra costs from signing up late.
            </span>
          </li>
          <li>
            <a
              href="https://www.medicare.gov/basics/get-started-with-medicare/medicare-basics/working-past-65/cobra-coverage"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-700 underline hover:text-blue-800"
            >
              COBRA coverage
            </a>
            <span className="block text-zinc-600">
              Medicare.gov — how COBRA works with Medicare and enrollment timing.
            </span>
          </li>
          <li>
            <a
              href="https://www.medicare.gov/publications/10050-medicare-and-you.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-700 underline hover:text-blue-800"
            >
              Medicare &amp; You 2026 (PDF)
            </a>
            <span className="block text-zinc-600">
              Official handbook — benefits, costs, and your rights.
            </span>
          </li>
          <li>
            <a
              href="https://www.medicare.gov/publications/11036-Enrolling-Part-A-Part-B.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-700 underline hover:text-blue-800"
            >
              Enrolling in Medicare Part A &amp; Part B (PDF)
            </a>
            <span className="block text-zinc-600">
              Step-by-step enrollment guide and special situations.
            </span>
          </li>
          <li>
            <a
              href="https://www.ssa.gov/medicare/sign-up/part-b-only"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-700 underline hover:text-blue-800"
            >
              Sign up for Part B only
            </a>
            <span className="block text-zinc-600">
              SSA — add Part B when you already have Part A.
            </span>
          </li>
        </ul>
      </div>

      <p className="mt-6 text-xs text-zinc-500">
        Method: Decision logic reflects Medicare's published guidance (see Medicare.gov links).
      </p>

      {/* Screen-only disclaimer */}
      <div className="no-print pb-6 text-xs leading-5 text-zinc-500">
        This is educational guidance—not legal or medical advice. Always confirm enrollment
        decisions with Medicare or a licensed advisor.
      </div>

      {/* Print-only footer */}
      <div className="print-only print-footer">
        Educational guidance — confirm with Medicare or a licensed advisor.
      </div>
    </div>
  );
}