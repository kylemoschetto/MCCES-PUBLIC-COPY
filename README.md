# Curriculum Builder and Maintainer (CBM)

> **New to coding, or handed this at a hackathon?** Read [START-HERE.md](START-HERE.md) first. It explains the project in plain language, walks through the sample output with no installation, and gets you from zero to a running pipeline.

**An open example of using AI to turn a military technical manual into a full, standards-aligned curriculum package.**

CBM is a command-line tool that reads a source document (a technical manual, reference publication, or similar) and drafts the artifacts a Marine Corps schoolhouse needs under the Systems Approach to Training and Education (SATE): Training and Readiness events, Terminal and Enabling Learning Objectives, Master Lesson File sections, instructor justification checklists, and assessment items. A human subject-matter expert reviews and edits everything before it is exported to Word, Markdown, and an interactive HTML dashboard.

This repository is published so that other people working in military education can see what is already possible, borrow whatever is useful, and give time back to the service members who develop and maintain curriculum.

---

## Why this exists

Turning a new piece of equipment or an updated Training and Readiness (T&R) standard into a class that Marines can actually take is slow work. A curriculum developer, usually a staff non-commissioned officer with deep occupational expertise but little formal instructional-design training, has to:

1. Read the source manual, often more than a thousand pages, and identify every trainable task.
2. Write learning objectives in the required condition-behavior-standard format with an appropriate Bloom's Taxonomy verb.
3. Build the Master Lesson File, the lesson plan structure, and assessment items that trace back to each objective.
4. Package all of it in the formats the review board expects.

That cycle routinely takes twelve to eighteen months. By the time an update clears review, the equipment it describes may already have changed.

This project started as a question: how much of the structural, transcription-heavy part of that work could an AI model draft, so that the humans could spend their time on judgment instead of formatting? The answer turned out to be "most of the first draft." CBM does not replace the subject-matter expert or the review board. It plays the role of a very fast junior clerk that produces a structured, traceable first pass for humans to correct.

Everything here was built and tested against a single public source, the Marine Corps Antenna Handbook (MCRP 3-40.3C), so the whole pipeline can be shown end to end without touching anything sensitive.

---

## What it produces

| Artifact | What it is | Where it comes from |
| --- | --- | --- |
| **T&R Events** | Task, condition, standard, and performance steps in Training and Readiness manual style | Extracted tasks from the source document |
| **TLOs** | Terminal Learning Objectives in Mager format (given / behavior / standard) with an approved Bloom's verb | One per T&R event |
| **ELOs** | Enabling Learning Objectives, each mapped to exactly one TLO | Decomposition of each TLO |
| **MLF sections** | Master Lesson File content: introduction, main points, transitions, summary | TLOs, ELOs, and the source text |
| **WIIFM checklists** | "What's In It For Me" instructor justification: seven categories, twenty-one questions per TLO, so the instructor can answer "why does this matter?" | TLOs and MLF |
| **Quiz items** | Assessment questions with answer keys, each mapped to a TLO or ELO | Objectives and source text |
| **Exports** | Word documents, Markdown, and a self-contained HTML dashboard | All of the above |

All generated output is validated for structure (required fields present, verbs from the approved list, one-to-one objective mapping) before it reaches the human review step.

---

## See the results without an API key

The repository ships with a complete sample run against the Antenna Handbook so you can evaluate the output before installing anything.

- **Interactive dashboard:** open `output-v2/export/curriculum-dashboard.html` in a browser. It is a single self-contained file with tabs for every artifact type.
- **Raw artifacts:** `output-v2/pass1/` holds the generated JSON for T&R events, TLOs, ELOs, MLF, WIIFM, and quiz items. `output-v2/ingested/` holds the parsed source and extracted tasks.
- **From curriculum to classroom media:** `output-v2/notebooklm/` shows the next step. The first lesson's Master Lesson File content was handed to Google NotebookLM, which produced a twelve-page slide deck and a short narrated video overview. They are included as `lesson1-slides.pdf` and `lesson1-video.mp4` to demonstrate that the same generated content can feed multimedia tools with no additional authoring.

---

## Quick start

Requirements: Node.js 20 or newer and an API key for at least one supported provider (OpenAI, Anthropic, or Google Gemini).

```bash
git clone https://github.com/kylemoschetto/MCCES-PUBLIC-COPY.git
cd MCCES-PUBLIC-COPY
npm install
npm run build

# Put at least one key in .env.local (this file is git-ignored)
echo 'GOOGLE_API_KEY=...' > .env.local

# Run the whole pipeline against the included public manual
node dist/index.js pipeline "MCRP 3-40.3C.md" --fast --skip-review --format all --open
```

The `--fast` flag generates a smaller set of artifacts in parallel for a quick demonstration. Drop it, and drop `--skip-review`, for a full run with the interactive review step. See the [User Guide](docs/user-guide.md) for every command and option.

---

## How the pipeline works

```
 source manual (PDF or Markdown)
        |
        v
 [1] ingest    parse structure, extract trainable tasks
        |
        v
 [2] generate  Pass 1, autonomous:
               T&R events -> TLOs -> ELOs + MLF -> WIIFM -> quiz
        |
        v
 [3] review    Pass 2, human in the loop:
               accept, edit, or reject each artifact
        |
        v
 [4] export    Markdown, Word (.docx), HTML dashboard
```

Each step can be run on its own (`ingest`, `generate`, `review`, `export`) or chained with `pipeline`. Intermediate results are plain JSON files, so nothing is hidden and any step can be re-run or hand-edited. An animated walkthrough is in [docs/flowchart.html](docs/flowchart.html).

Design decisions that mattered:

- **Two passes, human in the middle.** The model drafts; a person decides. The review step is a first-class command, not an afterthought.
- **Everything traces back.** Every ELO points to a TLO, every quiz item points to an objective, every T&R event points to source text. Reviewers can follow the chain.
- **Validate before you trust.** Generated output is checked against the required structure and the approved verb list before it is shown to anyone.
- **Provider-agnostic.** One adapter per vendor behind a common interface. Swap models with a flag; the prompts and validators stay the same.
- **Files, not a platform.** Plain JSON and standard document formats. No database, no server, nothing to stand up.

---

## Adapting this to your own material

The Marine Corps specifics live in a small number of places, which makes the tool straightforward to re-point at another service, schoolhouse, or standard:

| What you want to change | Where to look |
| --- | --- |
| The doctrinal frame the model is told to follow | `src/ai/prompts/system-context.ts` |
| The shape and wording of each artifact | `src/ai/prompts/*.ts` (one file per artifact) |
| The approved verb list and structural checks | `src/ai/validators.ts` and `src/types/curriculum.ts` |
| Who the training is for | `cbm config --target-pop "..."` |
| The source document | Any PDF or Markdown file passed to `ingest` or `pipeline` |
| Output formats | `src/export/` |

Background reading that shaped the design is in `docs/research/`: one document on how Marine Corps curriculum authorization actually works (the orders, the review boards, the systems of record), and one on where AI can and cannot responsibly fit into that process.

---

## Repository layout

```
.
├── README.md                 this file
├── LICENSE                   MIT
├── MCRP 3-40.3C.md           public source manual used for the sample run
├── src/                      TypeScript source
│   ├── index.ts              CLI entry point
│   ├── cli/commands/         ingest, generate, review, export, config
│   ├── ingestion/            PDF and Markdown parsing, task extraction
│   ├── generation/           one generator per artifact type
│   ├── ai/                   provider adapters, prompts, validators
│   ├── export/               Markdown, DOCX, HTML exporters
│   └── types/                shared domain types
├── scripts/                  one-off utilities that reuse the library
├── docs/
│   ├── user-guide.md         installation, commands, troubleshooting, glossary
│   ├── flowchart.html        animated pipeline walkthrough
│   └── research/             background research on the curriculum process
├── output-v2/                committed sample run (see above)
└── .claude/                  AI-assistant context files used while building this
```

The `.claude/` directory is worth a look even if you do not use an AI coding assistant. It contains the product requirements document, the domain model, the security rules, and the workflow that produced this codebase, and it shows one workable way to keep an AI assistant inside the lines on a domain-heavy project. Those files began as templates from the open-source [Claude Code Starter Kit](https://github.com/kylemoschetto/vibe-md-templates); the same kit can be used to start a project of your own.

---

## Limitations and cautions

- **Unclassified, publicly releasable material only.** The tool sends source text to a commercial model API. Do not feed it Controlled Unclassified Information, export-controlled data, or anything classified. Doing that properly requires an accredited environment and is out of scope here.
- **Output is a draft.** The model will occasionally invent a step, pick a weak verb, or misread a table. That is exactly why the review pass exists. Treat generated artifacts the way you would treat a first draft from a new staff member.
- **No system-of-record integration.** CBM does not talk to MCTIMS or any other official system. It produces documents for humans to carry into the official process.
- **Models move.** Provider model names change often. If a run fails on a model lookup, check `cbm config --show` and the current list in `src/ai/providers/`.
- **This is a prototype.** It was built quickly to answer a question, not hardened for production. There are no automated tests beyond type-checking and linting yet; see `.claude/tests.md` for what should be covered first.

---

## Source material

The sample run uses **MCRP 3-40.3C, Antenna Handbook** (formerly MCRP 6-22D), a Marine Corps reference publication approved for public distribution and available from the Marine Corps doctrine library. It is included here in Markdown form purely as the worked example. No other government material is reproduced.

---

## Documentation

- [User Guide](docs/user-guide.md): installation, configuration, every command, output formats, troubleshooting, glossary
- [Pipeline Flowchart](docs/flowchart.html): visual walkthrough with token-usage estimates
- [CLI Reference](.claude/cbm-usage.md): concise command and provider reference
- [Product Requirements](.claude/prd.md): the domain model and the reasoning behind each feature
- [Research](docs/research/): how the curriculum process works and where AI fits
- [Start Here](START-HERE.md): the beginner's guide, including how this was built with an AI assistant

---

## Contributing

Issues and pull requests are welcome, especially from people adapting this to other services or training standards. The most useful contributions right now are unit tests for the validators and parsers, additional export formats that match specific review-board templates, and prompt improvements grounded in real reviewer feedback.

Please do not submit source material that is not approved for public release, and do not include names or quotes of individuals in issues, sample outputs, or documentation.

## License

MIT. See [LICENSE](LICENSE).
