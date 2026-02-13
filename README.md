# Medicare Part B Delay Check

A focused web tool that helps people approaching or at age 65 understand whether they can safely delay enrolling in Medicare Part B based on their current coverage and employment situation.

## Overview

Medicare Part B Delay Check guides users through a short set of questions (age, employment, coverage source, employer size when relevant, and HSA contribution) and produces a clear, printable summary. The result explains whether delaying Part B is likely appropriate, warrants caution, or needs confirmation with Medicare or an advisor. The tool does not collect or store personal data; it runs entirely in the browser.

## Who It's For

- People who are close to 65 or already 65 and deciding when to enroll in Part B
- Anyone with employer or other group coverage who wants to understand delay rules
- Users who want a concise, advisor-style summary to take to HR or Medicare

## What It Does

- **Landing page** — Introduces the tool and invites users to start the check
- **Step-by-step wizard** — Asks: age, currently working, coverage source, employer size (if applicable), and HSA contribution
- **Decision result** — Shows a status (e.g. Delay likely appropriate, Caution advised, Needs confirmation), headline, rationale, and recommended next steps
- **Structured guidance** — Sections include: what the result is based on, questions to ask HR or Medicare, documents to keep, when to re-check, and caveats when relevant

## Print Output

The result screen includes a "Print or save as PDF" action. The print view is designed as a two-page advisor-style memo: black-on-white, no buttons or interactive UI, with a document header (title and generated date) and footer. Page margins, typography, and spacing are tuned for readability. Orphan heading rules help keep section titles with their content across page breaks.

## Disclaimer

This tool provides educational guidance only. It is not legal or medical advice. Users should confirm enrollment decisions with Medicare or a licensed advisor before acting.

## Live Demo

*A live demo link can be added here when the app is deployed.*

## Local Development

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app runs entirely client-side for the wizard and decision logic; no backend or environment variables are required for basic use.

## Tech Stack

- **Next.js** (App Router) — React framework and routing
- **TypeScript** — Type-safe UI and decision logic
- **Tailwind CSS v4** — Styling and print-specific CSS
- **No external UI or state libraries** — Minimal dependencies, plain React state

Decision rules live in `src/lib/decisionEngine/` (e.g. `evaluate`, `rules`, `types`). The main UI is in `src/app/page.tsx` and `src/components/ResultReport.tsx`.

## Design Philosophy

- **One question per screen** — Reduces cognitive load and keeps the flow clear
- **Advisor tone** — Calm, structured, and reassuring; avoids alarmist language
- **Print-first result** — The outcome is designed to be shared or saved as a PDF for use with HR or Medicare
- **No accounts or storage** — No sign-in, no saved answers, no analytics in the base implementation

## Future Enhancements

- Optional link to official Medicare or CMS resources
- Accessibility improvements (e.g. ARIA, keyboard navigation, screen reader testing)
- Optional localization or plain-language tweaks for specific audiences
- Deployment and live demo URL
