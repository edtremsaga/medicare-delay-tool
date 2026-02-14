"use client";

import React from "react";

interface WizardShellProps {
  children: React.ReactNode;
  step: number;
  totalSteps: number;
}

const WizardShell = React.forwardRef<HTMLDivElement, WizardShellProps>(
  function WizardShell({ children, step, totalSteps }, ref) {
    return (
      <div
        ref={ref}
        tabIndex={-1}
        className="rounded-3xl bg-white p-6 sm:p-10 shadow-sm ring-1 ring-zinc-200/70 outline-none"
      >
        <p className="mb-1 text-sm font-medium text-zinc-500">
          Step {step + 1} of {totalSteps}
        </p>
        {children}
      </div>
    );
  }
);

export default WizardShell;
