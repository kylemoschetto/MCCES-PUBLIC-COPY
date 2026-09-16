# Changelog

Purpose: This file is a running log that tracks all notable changes, new features, and workflow updates for the project over time.
It also serves as a record of **completed beads issues** and significant workflow milestones.

> The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),  
> and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## Version Numbering Rules

We follow **Semantic Versioning (SemVer)** for all projects:

- **MAJOR (X.0.0):** Incompatible or breaking workflow or API changes.
- **MINOR (0.X.0):** New features, plan types, or template enhancements added in a backwards-compatible way.
- **PATCH (0.0.X):** Bug fixes, template corrections, or workflow refinements that don’t break existing functionality.

> For student or prototype projects:
>
> - Use **0.x.x** versions while iterating (pre-1.0).
> - Bump to **1.0.0** only when the core features are stable and production-ready.

---

## Issue Completion Logging

Significant beads issues should be recorded in the changelog when completed. Use this format:

---

### Issue Completion Entry Example

**Issue:** `AES-42`
**Type:** `feature`
**Status:** `closed`
**Summary:** Implemented secure login and registration flow with Firebase Auth.
**Commit Reference:** `feat: add login flow (Closes: AES-42)`
**Date:** 2025-10-24

---

This ensures transparency and traceability for all AI-executed workflows.

---

## [Unreleased]

_Nothing yet._

---

## [1.0.0] - 2026-09-16

Public release. The repository was rebuilt with a single clean commit so that no private material remains in history.

### Added

- Root `README.md` explaining the purpose of the project, how the pipeline works, and how to reproduce the sample run.
- `START-HERE.md`, a plain-language guide for readers new to coding: a no-install tour of the sample output, zero-to-running setup, how the pipeline works, and how the project was built with the Claude Code Starter Kit.
- `LICENSE` (MIT).
- ESLint 9 flat config (`eslint.config.js`), replacing the legacy `.eslintrc.js` that ESLint 9 no longer reads.
- `npm run typecheck`; `npm test` now runs the type-check and linter.
- `engines.node >= 20` in `package.json`.

### Changed

- Context files under `.claude/` (`infra.md`, `security.md`, `sbom.md`, `tests.md`, `README.md`) rewritten with real project details in place of template placeholders.
- Background research documents moved to `docs/research/`.
- Sample ingested content now records a relative source path instead of a developer machine path.
- Dependencies updated to clear all `npm audit` findings.
- Unused imports removed so the linter passes cleanly.

### Removed

- A private meeting transcript and personal Claude Code command files that were never intended for distribution.

---

## [0.9.0] - 2026-02-13

Pre-release development (January 24 to February 13, 2026). Everything below shipped in 1.0.0.

### Added

- WIIFM (What's In It For Me) instructor justification tool
  - New generation step (Step 5) between MLF and Quiz
  - 7 categories with 21 questions per TLO: Mission Relevance, Individual Marine Impact, Career & Professional Development, Time & Effort Justification, Operational Consequences, Immediate Application, Leader Credibility Check
  - One-line WIIFM formula for quick instructor reference
  - New WIIFM tab in HTML dashboard export
  - Updated flowchart documentation with WIIFM step
- `/howlong` development-time analysis skill (a personal Claude Code workflow helper; not included in the public release)
- Multi-provider AI support: OpenAI, Anthropic (Claude), and Google Gemini
- Provider adapter architecture in `src/ai/providers/`
- CLI flags `--provider` and `--model` for generate/pipeline commands
- Environment loading from `.env.local` via dotenv
- Comprehensive CBM documentation (`.claude/cbm-usage.md`)
- Updated `/gogogo` session-start skill to load CBM docs (personal workflow helper; not included in the public release)
- AI model logging: every AI call now logs provider/model to console with timestamp
- `AVAILABLE_MODELS` constant tracking all supported models per provider
- Config command now shows all available models with `--show` flag
- Interactive config now offers model selection based on chosen provider

### Changed

- Default AI provider changed from OpenAI to Google (Gemini)
- Default model changed to `gemini-3-flash-preview`
- Updated Anthropic models: `claude-sonnet-4-5-20250929`, `claude-opus-4-5-20251101`
- Updated Google models: `gemini-3-flash-preview` (default), `gemini-3-pro-preview`

### Changed

- Refactored `AIClient` to use adapter pattern with auto-fallback to available API keys
- Migrated from `.claude/implementation/` and `features.json` to beads (`bd`) for issue tracking.
- Updated `workflow.md` to use beads CLI commands for planning, execution, and status management.
- Clarified changelog role in tracking **issue completions** and **workflow milestones**.

### Added

- Introduced beads (`bd`) for centralized issue tracking with priorities, dependencies, and labels.
- Added branching strategy and PR workflow documentation to `workflow.md`.
- Enhanced multi-agent coordination with `--actor` and `--assignee` flags.

### Deprecated

- Removed `.claude/implementation/` directory structure — now handled by beads.

---

## [0.1.1] - 2025-09-15

### Added

- Introduced initial autonomous workflow logic:
  - Beads (`bd`) CLI for issue tracking
  - Issue types: bug, feature, task, epic, chore
  - Status management: open, in_progress, blocked, deferred, closed
- Updated `workflow.md` and `claude.md` to define issue-based planning and execution.

### Changed

- Revised `tests.md` to support automatic test execution after each feature step.
- Added changelog integration rules for issue completions.

---

## [0.1.0] - 2025-08-31

### Added

- Created initial set of Markdown context files (`claude.md`, `prd.md`, `infra.md`, `workflow.md`, `security.md`, `sbom.md`, `tests.md`).
- Added `changelog.md` to track project history.
- Added `first_prompt.md` as interactive setup guide for template population.
- Defined examples for both local Python applications and Next.js + Supabase applications to guide new students.

### Notes

- This is the first structured version of the project templates.
- Future releases will focus on workflow automation, changelog integration, and feature-based plan versioning.
