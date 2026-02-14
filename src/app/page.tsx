"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="mx-auto max-w-xl">
        <div className="rounded-3xl bg-white p-10 shadow-sm ring-1 ring-zinc-200/70">
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
      </div>
    </div>
  );
}
