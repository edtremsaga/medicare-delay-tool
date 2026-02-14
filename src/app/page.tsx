"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="mx-auto max-w-xl">
        <div className="rounded-3xl bg-white p-6 sm:p-10 shadow-sm ring-1 ring-zinc-200/70">
          <h1 className="mb-2 text-3xl font-bold text-zinc-900">
            Medicare Decision Tools
          </h1>
          <p className="mb-8 text-base leading-7 text-zinc-700">
            Clear, focused tools to help you make Medicare timing decisions with confidence.
          </p>

          <section className="mb-8">
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              Part B Delay Check
            </h2>
            <p className="mb-4 text-sm leading-6 text-zinc-700">
              Answer a few questions and get a clear, printable summary of what to confirm before
              you delay Part B — especially if you're working or covered by an employer plan.
            </p>
            <Link
              href="/part-b"
              className="inline-block rounded-2xl bg-zinc-900 px-7 py-3 text-sm font-medium text-white hover:opacity-90"
            >
              Open Part B tool
            </Link>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-zinc-900">
              Part D Coverage Check
            </h2>
            <p className="mb-4 text-sm leading-6 text-zinc-700">
              Check whether your drug coverage meets Medicare's requirements and when to enroll.
            </p>
            <Link
              href="/part-d"
              className="inline-block rounded-2xl bg-zinc-900 px-7 py-3 text-sm font-medium text-white hover:opacity-90"
            >
              Open Part D tool
            </Link>
          </section>
        </div>

        <div className="mt-6 sm:mt-8 rounded-3xl bg-white p-6 sm:p-10 shadow-sm ring-1 ring-zinc-200/50">
          <p className="mb-4 text-xs uppercase tracking-wide text-zinc-500">
            About
          </p>
          <p className="mb-6 text-sm leading-6 text-zinc-700">
            These tools are structured decision engines built from publicly documented Medicare enrollment rules.
            They are designed to make complex timing rules easier to reason about — not to replace Medicare or professional advice.
          </p>
          <h2 className="text-base font-semibold text-zinc-900">How these tools work</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-700">
            These tools ask a few structured questions, apply Medicare's published enrollment and penalty rules, and generate a printable checklist of what to confirm with Medicare, HR, or your plan.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a
                href="https://www.medicare.gov/basics/costs/medicare-costs/avoid-penalties"
                target="_blank"
                rel="noreferrer"
                className="underline text-zinc-900 hover:opacity-80"
              >
                Avoid late enrollment penalties (Medicare.gov)
              </a>
            </li>
            <li>
              <a
                href="https://www.medicare.gov/drug-coverage-part-d"
                target="_blank"
                rel="noreferrer"
                className="underline text-zinc-900 hover:opacity-80"
              >
                Prescription drug coverage (Part D) (Medicare.gov)
              </a>
            </li>
            <li>
              <a
                href="https://www.medicare.gov/basics/get-started-with-medicare"
                target="_blank"
                rel="noreferrer"
                className="underline text-zinc-900 hover:opacity-80"
              >
                Get started with Medicare (Medicare.gov)
              </a>
            </li>
          </ul>
        </div>
      </div>
      <span className="fixed bottom-3 right-4 text-[10px] text-zinc-400 no-print" aria-hidden="true">
        v1.0 — February 2026
      </span>
    </div>
  );
}
