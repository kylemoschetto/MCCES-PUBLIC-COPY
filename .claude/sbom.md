# Software Bill of Materials (SBOM)

Purpose: This file lists the approved technologies, libraries, and dependencies for the project. New dependencies are added here before they are installed.

---

## 0. Technology Stack Overview

| Category          | Component Name              | Version    | Rationale / Usage                                              |
| :---------------- | :-------------------------- | :--------- | :------------------------------------------------------------- |
| **Language**      | `TypeScript`                | `^5.7`     | Primary language; compiled with `tsc` to CommonJS.             |
| **Runtime**       | `Node.js`                   | `>=20`     | Execution environment for the CLI.                             |
| **CLI**           | `commander`                 | `^12.1`    | Command and option parsing.                                    |
| **CLI**           | `inquirer`                  | `^8.2`     | Interactive prompts for the Pass 2 review and config wizard.   |
| **CLI**           | `chalk`                     | `^4.1`     | Terminal color output (v4 kept for CommonJS compatibility).    |
| **AI Provider**   | `openai`                    | `^4.77`    | Official OpenAI SDK.                                           |
| **AI Provider**   | `@anthropic-ai/sdk`         | `^0.71`    | Official Anthropic SDK.                                        |
| **AI Provider**   | `@google/generative-ai`     | `^0.24`    | Official Google Gemini SDK.                                    |
| **Ingestion**     | `pdf-parse`                 | `^1.1`     | Text extraction from PDF technical manuals.                    |
| **Export**        | `docx`                      | `^8.5`     | Word document generation.                                      |
| **Config**        | `dotenv`                    | `^17.2`    | Loads provider keys from `.env.local`.                         |
| **Dev: Types**    | `@types/node`, `@types/inquirer`, `@types/pdf-parse` | current | Type definitions.                          |
| **Dev: Lint**     | `eslint`                    | `^9.18`    | Linting with flat config (`eslint.config.js`).                 |
| **Dev: Lint**     | `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin` | `^8.20` | TypeScript rules for ESLint.          |
| **Dev: Format**   | `prettier`                  | `^3.4`     | Code formatting.                                               |
| **Dev: Run**      | `ts-node`                   | `^10.9`    | Runs TypeScript directly during development.                   |

Exact resolved versions are recorded in `package-lock.json`.

---

## 1. Version Management & Updates

- **Update Strategy:** Dependencies are updated manually. Major version bumps require a full pipeline run against the sample manual before merging.
- **Security Scanning:** `npm audit` is run before every release and must report zero vulnerabilities. Enable automated dependency scanning on the hosting repository.
- **Model Names:** Supported LLM model identifiers live in `AVAILABLE_MODELS` in `src/ai/providers/`. Vendors retire models on their own schedule, so expect to update these more often than the packages.

---

## 2. Documentation & Resources

- **Node.js:** https://nodejs.org/docs/
- **TypeScript Handbook:** https://www.typescriptlang.org/docs/
- **commander:** https://github.com/tj/commander.js
- **OpenAI Node SDK:** https://github.com/openai/openai-node
- **Anthropic TypeScript SDK:** https://github.com/anthropics/anthropic-sdk-typescript
- **Google Generative AI SDK:** https://github.com/google-gemini/generative-ai-js
- **docx:** https://docx.js.org/
- **ESLint flat config:** https://eslint.org/docs/latest/use/configure/configuration-files
