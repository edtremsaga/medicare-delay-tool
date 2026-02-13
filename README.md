# Medicare Part B Delay Check

A web tool for people at or near 65 who need to decide whether to enroll in Medicare Part B now or delay. It asks a few questions about coverage and employment, then produces a printable, advisor-style memo with a clear recommendation and next steps. No sign-in or data storage; everything runs in the browser.

## Overview

Users answer five questions: age, current employment, coverage source, employer size (when applicable), and HSA contribution. The tool returns one of three outcomes—delay likely appropriate, caution advised, or needs confirmation—with rationale and actionable guidance. All logic runs client-side; nothing is sent to a server.

## Who It's For

- People 65 or approaching 65 who are weighing Part B enrollment timing
- Those with employer or other group coverage who need to understand delay rules and penalties
- Anyone who wants a concise summary to bring to HR or a Medicare advisor

## What It Does

- **Landing** — Brief intro and a single CTA to start the check
- **Wizard** — One question per screen: age, working status, coverage source, employer size (if relevant), HSA contribution
- **Result** — Status, headline, rationale, next steps, and sections on what to ask, what to keep on file, and when to re-check
- **Print** — One action to print or save as PDF; output is a clean two-page memo

## Print Output

The result screen offers "Print or save as PDF." The print layout is designed as an intentional two-page document: white background, black text, no UI chrome. A header shows the title and generation date; a footer carries the disclaimer. Margins, type size, and spacing are set for readability; heading and list rules reduce awkward breaks between pages.

## Disclaimer

This tool is for educational use only and does not constitute legal or medical advice. Always confirm enrollment decisions with Medicare or a licensed advisor before acting.

## Live Demo

*A live demo link can be added here when the app is deployed.*

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No backend or environment variables are required.

## Tech Stack

- **Next.js** (App Router) — Routing and React framework
- **TypeScript** — Types for UI and decision engine
- **Tailwind CSS v4** — Layout, styling, and print CSS
- **No extra UI or state libraries** — React state only

Decision logic: `src/lib/decisionEngine/` (`evaluate`, `rules`, `types`). UI: `src/app/page.tsx`, `src/components/ResultReport.tsx`.

## Design Philosophy

- **One question per screen** — Keeps the flow clear and reduces cognitive load
- **Advisor tone** — Calm, structured, and reassuring; no alarmist language
- **Print-first result** — The output is meant to be saved or shared with HR or Medicare
- **No accounts or storage** — No sign-in, no saved answers, no analytics by default

## Future Enhancements

- Links to official Medicare or CMS resources
- Accessibility improvements (ARIA, keyboard nav, screen reader testing)
- Localization or plain-language variants
- Deployed demo URL
