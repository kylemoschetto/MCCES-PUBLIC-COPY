# Infrastructure Blueprint

Purpose: This file describes the project's technical foundation, including the programming language, how to run the code, coding standards, and where data lives.

---

## What We're Building

- **Programming Language:** TypeScript (compiled with `tsc` to CommonJS, Node.js 20+)
- **Main Framework/Tool:** None. A command-line application built on `commander`, with `inquirer` for interactive review.
- **A Quick Summary:** A local CLI that reads a technical manual (PDF or Markdown) and uses an LLM to draft USMC curriculum artifacts (T&R events, TLOs, ELOs, Master Lesson File sections, instructor WIIFM checklists, and quiz items), then exports them to Markdown, Word, and an HTML dashboard. See `prd.md` for the full feature set.

---

## How to Run it on Your Computer

- **Installation Command:** `npm install`
- **Build Command:** `npm run build` (outputs to `dist/`)
- **Startup Command:** `node dist/index.js --help` or `npx ts-node src/index.ts --help` during development
- **Quality Gates:** `npm test` runs the type-check and the linter. There is no browser UI and no local server.
- **Required Environment:** At least one provider key in `.env.local`: `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, or `GOOGLE_API_KEY`. See `cbm-usage.md`.

---

## Project Architecture & Conventions

- **Directory Structure:**
  - `src/index.ts` - CLI entry point; defines all commands and options.
  - `src/cli/commands/` - One module per command (`ingest`, `generate`, `review`, `export`, `config`).
  - `src/ingestion/` - PDF and Markdown parsing plus AI-assisted task extraction.
  - `src/generation/` - One generator per artifact type (T&R, TLO, ELO, MLF, WIIFM, quiz).
  - `src/ai/` - Provider-agnostic AI client. `providers/` holds one adapter per vendor; `prompts/` holds the prompt templates and the shared USMC system context; `validators.ts` checks generated output.
  - `src/export/` - Markdown, DOCX, and HTML exporters.
  - `src/types/` - Shared domain types for curriculum artifacts.
  - `scripts/` - One-off utilities that reuse the library (for example, regenerating WIIFM checklists from saved artifacts).
  - `docs/` - User guide, pipeline flowchart, and background research.
  - `output-v2/` - A committed sample run against the public MCRP 3-40.3C Antenna Handbook, kept so the repo demonstrates results without an API key.
- **Pipeline Shape:** `ingest` -> `generate` (Pass 1, autonomous) -> `review` (Pass 2, human in the loop) -> `export`. The `pipeline` command chains them.
- **Adding a Provider:** Implement `AIProviderAdapter` in `src/ai/providers/`, register it in `client.ts`, and add its models to `AVAILABLE_MODELS`.

---

## Code Generation Style Guide

- **Variable Naming:** `camelCase` for variables and functions; `PascalCase` for types and classes.
- **File Naming:** `kebab-case.ts` (for example `tlo-generator.ts`).
- **Constants:** `UPPER_SNAKE_CASE` for module-level constants.
- **Comments:** Brief JSDoc headers on exported functions; explain intent, not mechanics.
- **Linting and Formatting:** ESLint 9 flat config (`eslint.config.js`) and Prettier. Run `npm run lint` and `npm run format` before committing.
- **Errors:** Fail loudly with a clear message when a source file or API key is missing; never silently fall back to an empty artifact.

---

## Where it Lives on the Internet & Who its Friends Are

- **Hosting Provider:** None. This is a local tool run on the developer's or curriculum developer's own machine.
- **External Services:** The LLM provider APIs (OpenAI, Anthropic, Google Gemini). Source text is sent to whichever provider is configured, so only unclassified, publicly releasable material may be processed. See `security.md`.

---

## Where Your Data is Stored

- **Data Storage Method:** Plain files on disk. No database.
  - Ingested content: `output/ingested/*.json`
  - Generated artifacts (Pass 1): `output/pass1/*.json`
  - Reviewed artifacts (Pass 2): `output/final/*.json`
  - Exports: `output/export/` (`.md`, `.docx`, `.html`)
  - Local settings: `cbm-config.json` in the project root (git-ignored)
- **Important Notes:** `output/` is git-ignored so real runs are never committed by accident. `output-v2/` is the deliberately committed demonstration run.
- **Schema Details:** All artifact shapes are defined in `src/types/curriculum.ts`.
