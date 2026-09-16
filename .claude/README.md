# AI Context Files

This directory holds the context documents that an AI coding assistant (Claude Code, or any tool that reads Markdown context) uses when working on this project. They were the working "brain" of the project while it was being built, and they are published here so others can see how the project was specified, constrained, and run.

The entry point is `claude.md`. It lists which files to read and how to resolve conflicts between them.

| File           | Purpose                                                                     |
| -------------- | --------------------------------------------------------------------------- |
| `claude.md`    | Master context and conflict-resolution order                                |
| `prd.md`       | Product requirements: the domain model, features, and acceptance criteria   |
| `infra.md`     | Runtime facts: language, how to run it, where data lives                    |
| `workflow.md`  | How work is planned and executed using beads (`bd`) issue tracking          |
| `security.md`  | Data sensitivity, secrets handling, and dependency rules                    |
| `sbom.md`      | Approved dependencies and versions                                          |
| `tests.md`     | Quality gates and what is (and is not) covered by automated checks          |
| `cbm-usage.md` | CLI reference and provider configuration for the CBM tool                   |
| `changelog.md` | Version history and notable changes                                         |

## Reusing this layout

The pattern is simple and portable:

1. Write the requirements first (`prd.md`) in plain language, including the domain vocabulary the assistant must use correctly.
2. Record the runtime facts (`infra.md`) so the assistant does not guess at commands or paths.
3. State the non-negotiables (`security.md`, `sbom.md`) and give them the highest precedence.
4. Point the assistant at all of it from one master file (`claude.md`).

The original templates these files grew from were written for students and indie developers. They have been filled in with this project's real details.
