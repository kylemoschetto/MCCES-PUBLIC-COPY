# Start Here: A Guide for People New to Coding

This page is for you if you were handed this repository at a hackathon, a schoolhouse, or a unit, and you want to understand what it is and get something running today. It assumes no programming background. If you already write code, skip to the main [README](README.md).

**Estimated time:** 10 minutes to understand it, 30 to 45 minutes to run it yourself.

---

## 1. What this is, in one minute

Every time the military fields a new piece of gear or updates a training standard, somebody at a schoolhouse has to turn a thick technical manual into a course: learning objectives, lesson plans, tests. That person is usually a staff NCO who knows the equipment cold but was never trained as a curriculum designer. The work is mostly reading, extracting, and reformatting, and it takes a year or more.

This project is a small program that does the reading, extracting, and reformatting part with an AI model, then hands the draft to a human to correct. It reads a manual and produces:

| It produces | Plain English |
| --- | --- |
| **T&R Events** | "Here is a task a Marine must be able to do, under these conditions, to this standard." |
| **TLOs** (Terminal Learning Objectives) | The main thing a student can do at the end of a lesson. |
| **ELOs** (Enabling Learning Objectives) | The smaller skills that add up to the TLO. |
| **MLF** (Master Lesson File) | The lesson plan: introduction, main points, summary. |
| **WIIFM** ("What's In It For Me") | Talking points so the instructor can answer "why do I need to know this?" |
| **Quiz items** | Test questions, each tied to one objective, with answers. |

The AI is the junior clerk. The subject-matter expert is still the boss. Nothing goes to a review board without a human reading it.

It was built and tested entirely against one public document, the Marine Corps Antenna Handbook (MCRP 3-40.3C), so everything here can be shared openly.

---

## 2. Two ways to use this today

**Path A: Run it.** Follow section 4 to install and run the tool on the included manual, or on a public manual from your own community. You will have curriculum artifacts in under an hour.

**Path B: Copy the method.** You do not have to keep any of this code. Section 5 explains the approach in plain language, and section 7 shows how to build something like it for your own problem with an AI coding assistant. Most hackathon teams will want Path B with Path A as the working example.

Either way, start with section 3. It costs nothing and requires no installation.

---

## 3. Five-minute tour, no installation required

1. Download this repository (green **Code** button, then **Download ZIP**, then unzip it). Or clone it if you know how.
2. Open the folder `output-v2/export/` and double-click `curriculum-dashboard.html`. It opens in your browser. Nothing is sent anywhere; it is a plain file.
3. Click the **T&R Events** tab. Find `0621-ANT-0001`, "Categorize Radio Frequencies by Band." Note that it has a condition, a standard, performance steps, and a page reference back to the manual.
4. Click the **Objectives** tab and find `TLO-001`. Read it in three parts:
   - *Condition:* "Given a list of tactical frequencies and MCRP 3-40.3C."
   - *Behavior:* "Classify each frequency into the correct military radio frequency band (HF, VHF, or UHF)."
   - *Standard:* "Without error per Figure 1-1 of MCRP 3-40.3C."
   That three-part shape is called Mager format, and the verb "classify" was chosen deliberately from an approved list. Under it are `ELO-001` and `ELO-002`, the two smaller skills that add up to the TLO.
5. Click the **Quiz** tab and read **Question 1**, which asks for the HF band's frequency limits. It tests `ELO-001` specifically. Click **Show Answers** to see the correct choice, the explanation, and the figure in the manual it came from.
6. Click **WIIFM** to see the instructor talking points for the same lesson.
7. Now open `output-v2/notebooklm/`. The lesson content for `TLO-001` was pasted into Google NotebookLM, which produced `lesson1-slides.pdf` and `lesson1-video.mp4` with no further human authoring. Watch the video. That is a manual page becoming a narrated lesson with a chain of traceable steps in between.

You have now seen the whole idea: **source page -> task -> objective -> sub-objective -> test question -> classroom media**, every link recorded.

---

## 4. Running it yourself, from zero

### 4.1 Install the three tools you need

You need three free programs. Each installer is a normal "download, double-click, next, next, finish."

| Tool | What it is | Get it |
| --- | --- | --- |
| **Git** | Downloads and tracks code. | https://git-scm.com/downloads. On Windows, accept the defaults; it also installs **Git Bash**, which you should use as your terminal. On a Mac, Git may already be present; if not, the system will offer to install it the first time you type `git`. |
| **Node.js** | Runs the program. | https://nodejs.org. Choose the **LTS** version (20 or newer). |
| **A terminal** | A text window where you type commands. | Mac: open the **Terminal** app (press Cmd+Space, type Terminal). Windows: open **Git Bash** from the Start menu. |

Check that they worked. Type each line into the terminal and press Enter. You should see version numbers, not error messages.

```bash
git --version
node --version
npm --version
```

### 4.2 Download and build the project

Copy each line into the terminal one at a time.

```bash
git clone https://github.com/kylemoschetto/MCCES-PUBLIC-COPY.git
cd MCCES-PUBLIC-COPY
npm install
npm run build
```

- `git clone` downloads the code.
- `cd` moves you into the folder.
- `npm install` downloads the libraries the program depends on. This takes a minute and prints a lot; that is normal.
- `npm run build` compiles it. It prints almost nothing when it succeeds.

Confirm it runs:

```bash
node dist/index.js --help
```

You should see a list of commands: `ingest`, `generate`, `review`, `export`, `config`, `pipeline`.

> The longer [User Guide](docs/user-guide.md) sometimes writes `npx cbm` where this page writes `node dist/index.js`. They do the same thing. If you want the short form, run `npm link` once inside the project folder and then `cbm --help` will work.

### 4.3 Get an API key

The program does not contain an AI model. It sends text to one over the internet, and for that you need an **API key**: a long password that ties usage to your account. You need exactly one of these three.

| Provider | Where to create a key | Notes for a hackathon |
| --- | --- | --- |
| **Google Gemini** | https://aistudio.google.com/app/apikey | Fastest to set up. Has a free usage tier at the time of writing. This is the default provider. |
| **Anthropic (Claude)** | https://console.anthropic.com/settings/keys | Requires adding a payment method. |
| **OpenAI** | https://platform.openai.com/api-keys | Requires adding a payment method. |

Two rules that matter:

- **Treat the key like a password.** Never paste it into a chat, a slide, a screenshot, or a file that gets shared. The file you put it in below is ignored by Git on purpose.
- **Set a spending limit** in the provider's billing settings before you run anything. Five or ten dollars is plenty for a whole hackathon.

**What does a run cost?** A full run of the pipeline on the Antenna Handbook uses roughly 70,000 to 125,000 tokens (a token is about three quarters of a word). On a fast, inexpensive model such as Gemini Flash that is well under one dollar. On a top-tier model it might be a few dollars. The `--fast` flag used below generates fewer artifacts and costs less still.

### 4.4 Save the key where the program will find it

In the project folder, create a file named exactly `.env.local` containing one line. The easiest way is from the terminal. Replace the dots with your real key and keep the quotes.

```bash
echo 'GOOGLE_API_KEY=your-key-goes-here' > .env.local
```

(Use `ANTHROPIC_API_KEY=` or `OPENAI_API_KEY=` instead if that is the provider you chose.)

### 4.5 Run the pipeline

```bash
node dist/index.js pipeline "MCRP 3-40.3C.md" --fast --skip-review --format all --open
```

What you will see: the program parses the manual, then prints "Step 1" through "Step 6" as it generates each artifact type, logging each AI call as it goes. A fast run takes a few minutes. When it finishes it opens a dashboard like the one from the tour, except this time you made it.

Your files are in `output/`:

```
output/
├── ingested/   what the program read from the manual, and the tasks it found
├── pass1/      the generated artifacts as JSON
└── export/     Word documents, Markdown, and the HTML dashboard
```

### 4.6 Next runs

- **Drop `--fast`** for the full artifact set (more events, more objectives, more questions).
- **Drop `--skip-review`** to get the interactive review step, where the program shows you each artifact and asks you to accept, edit, or reject it. This is the human-in-the-loop part, and it is the part that matters most in real use.
- **Try a different manual.** Any PDF or Markdown file works: `node dist/index.js pipeline "path/to/your-manual.pdf" --fast --skip-review --format all`. Use only material that is approved for public release. See section 8.
- **Tell it who the students are:** `node dist/index.js config --target-pop "0621 Field Radio Operators"`. The prompts use this to pitch the language and examples.

---

## 5. How it actually works, in plain language

There is no magic in here. The program is a chain of six carefully written instructions to an AI model, run in a fixed order, with a checker between each step.

**Step 0: Read the manual.** Ordinary code (no AI) splits the document into sections and keeps page numbers so everything downstream can cite its source.

**Step 1: Find the tasks.** The model is given chunks of the manual and asked: "What are the discrete things a person could be trained to do here?" Out comes a list of tasks with page references.

**Steps 2 to 6: Build each artifact from the previous one.** T&R events are built from the tasks. TLOs from the T&R events. ELOs and the lesson file from the TLOs. WIIFM from the TLOs and lesson file. Quiz questions from the ELOs. Each step is a separate prompt that receives the previous step's output.

**Between every step: check the structure.** Ordinary code (again, no AI) verifies that every objective has a condition, a behavior, and a standard; that the verb is on the approved list for its cognitive level; that every ELO points to a real TLO; and that every quiz item points to a real objective. Anything that fails is flagged before a human ever sees it.

**Then: a human reviews.** The `review` command walks a person through the results. The person, not the model, decides what survives.

The single most important piece of text in the project is the instruction that every prompt starts with. Here is the heart of it, straight from `src/ai/prompts/system-context.ts`:

> You are a Marine Corps curriculum developer with expertise in the Systems Approach to Training (SAT), the ADDIE model, NAVMC 1553.1A, and T&R Manual standards.
>
> Your outputs must always be grounded in official USMC publications, follow standardized military writing conventions, include proper source citations, use approved terminology, and support traceability between artifacts (T&R -> TLO -> ELO -> Assessment).
>
> You maintain strict adherence to Mager format for learning objectives (Condition, Behavior, Standard) and Bloom's Taxonomy for cognitive level classification.
>
> You never invent information. All content must be traceable to source material.

Followed by a description of Mager format and the approved verb list for each Bloom's level. That is it. Everything the model does well, it does because those constraints were written down clearly and enforced by the checker. **If you take one lesson from this project, take that one:** the value is in knowing your domain's rules well enough to write them down, not in the code.

Why the design choices were made:

- **Two passes with a human in the middle**, because the model is good at structure and bad at judgment, and curriculum is ultimately a judgment product.
- **Everything traces back to a page**, because a reviewer who cannot check a claim will not trust it, and should not.
- **Plain files, no database, no server**, because a schoolhouse cannot stand up infrastructure, but anyone can open a folder.
- **Any of three AI providers**, because model availability and pricing change monthly and nobody should be locked in.

---

## 6. Vocabulary you will hear

| Term | Meaning |
| --- | --- |
| **SAT / SATE** | Systems Approach to Training (and Education). The Marine Corps' required method for building courses. |
| **ADDIE** | Analysis, Design, Development, Implementation, Evaluation. The five phases of SAT. |
| **T&R Manual** | Training and Readiness manual. The list of tasks a community must be able to perform, with conditions and standards. |
| **T&R Event** | One entry in that manual: a task, the conditions it is performed under, and the standard it must meet. |
| **TLO / ELO** | Terminal and Enabling Learning Objectives. What the student can do at the end of the lesson, and the pieces that build up to it. |
| **Mager format** | The condition / behavior / standard structure every objective must follow. |
| **Bloom's Taxonomy** | A ladder of thinking skills from Remember up to Create. Each level has approved verbs. "List" is low on the ladder; "design" is high. |
| **MLF** | Master Lesson File. The lesson plan and supporting material. |
| **POI** | Program of Instruction. The formal, approved course document. Not produced by this tool. |
| **CCRB** | Course Content Review Board. The body that approves curriculum changes. Humans only. |
| **MCTIMS** | The Marine Corps system of record for training. This tool does not connect to it. |
| **Token** | The unit AI providers bill by. About three quarters of an English word. |
| **API key** | Your personal password for an AI provider. Keep it secret. |

---

## 7. Building your own version with an AI coding assistant

This whole project was built in a few weeks by one person using **Claude Code**, an AI assistant that writes and edits code from plain-English instructions. That is realistic for a hackathon team too, and the pattern that made it work is worth copying even if you never touch this repository again.

### The pattern: write the context first

An AI assistant is only as good as what it knows about your project. Before writing any code, this project's author wrote a handful of short Markdown documents that described the project, and put them in a `.claude/` folder where the assistant reads them at the start of every session. You can see the real ones in this repository:

| File | What it told the assistant |
| --- | --- |
| [`.claude/claude.md`](.claude/claude.md) | "Read these files, in this order, and here is what wins when they conflict." |
| [`.claude/prd.md`](.claude/prd.md) | The product requirements: the problem, the users, the domain vocabulary, every artifact and what makes it valid. This is the most important one. |
| [`.claude/infra.md`](.claude/infra.md) | The language, how to run it, where files go. |
| [`.claude/security.md`](.claude/security.md) | What data is allowed, where secrets live. Highest priority. |
| [`.claude/sbom.md`](.claude/sbom.md) | The approved libraries. |
| [`.claude/workflow.md`](.claude/workflow.md) | How work is broken into issues and tracked. |
| [`.claude/tests.md`](.claude/tests.md) | What must keep working. |
| [`.claude/changelog.md`](.claude/changelog.md) | What changed and when. |

Read `prd.md` in particular. Notice that most of it is about the *domain* (what a TLO is, which verbs are allowed, what the review board expects), not about software. That is what let the assistant produce something a curriculum developer would recognize.

### The starter kit

Those files started life as blank templates from a small open-source kit called the **Claude Code Starter Kit** (also known as the Vibe MD templates):

**https://github.com/kylemoschetto/vibe-md-templates**

The kit gives you the empty templates, a set of slash commands for common workflows (`/gogogo` to start a session, `/wrapup` to end one, `/story` to add a user story, `/create-prompt` to build a good prompt), lightweight issue tracking, and a one-paste setup prompt that has the assistant lay it all out for you and then interview you to fill in the requirements document. Its README explains installation of Claude Code and the kit in detail; follow that rather than anything reproduced here, since the steps change over time.

### A hackathon recipe

1. **Pick a public source document** from your own community. A field manual, a maintenance manual, an SOP that is approved for release. Never anything sensitive (section 8).
2. **Decide what artifacts you want out** and, for each one, write down what makes it correct. Which fields are required. Which words are allowed. What it must link to. This is the hard part and it is not a coding task. Do it as a team, on a whiteboard, before anyone opens a laptop.
3. **Set up the starter kit** and let the assistant interview you to turn step 2 into `prd.md`.
4. **Ask the assistant to build the pipeline** one step at a time: read the document, extract tasks, generate the first artifact, validate it. Run it after every step. Point at this repository as a worked example when you get stuck.
5. **Keep a human review step.** Always. Judges and future users will trust the tool more, not less.
6. **Export to whatever your review board already reads.** A Word document that matches the existing template will get adopted. A new web app will not.

If you want to adapt *this* code instead of starting fresh, the Marine Corps specifics are concentrated in a few files:

| To change | Edit |
| --- | --- |
| The doctrinal frame and approved verbs | `src/ai/prompts/system-context.ts` |
| The shape of each artifact | `src/ai/prompts/` (one file per artifact) |
| The structural checks | `src/ai/validators.ts` and `src/types/curriculum.ts` |
| The output formats | `src/export/` |

Ask your AI assistant to walk you through any of them. Paste in the file and say "explain what this does to someone who has never programmed." It will.

---

## 8. Rules of the road

- **Unclassified, publicly releasable material only.** This tool sends text to a commercial AI service. Do not feed it CUI, FOUO, export-controlled technical data, or anything classified. If your real use case involves that material, the answer is an accredited environment, not this repository.
- **No names, no personal information** in anything you commit, share, or put in a sample output.
- **AI output is a draft.** It will sometimes pick a weak verb, invent a step, or misread a table. That is why the review step exists. Read everything before it goes anywhere official.
- **Your API key is a secret.** It lives in `.env.local` and nowhere else. If you think you exposed one, go to the provider's site and revoke it. It takes ten seconds.
- **This is a prototype, not a system of record.** It produces documents for humans to carry into the official process.

---

## 9. When something goes wrong

| You see | It means | Do this |
| --- | --- | --- |
| `command not found: git` or `node` | The tool is not installed or the terminal was opened before installing. | Reinstall from section 4.1, then close and reopen the terminal. |
| `No API key found. Set one of: OPENAI_API_KEY, ANTHROPIC_API_KEY, or GOOGLE_API_KEY` | The program cannot see your key. | Make sure `.env.local` is in the project folder (not your home folder), is spelled exactly, and has no spaces around the `=`. |
| `Rate limit exceeded` | You are sending requests faster than the free tier allows. | Wait a minute and retry, or run without `--parallel`. |
| `Failed to parse PDF` | The PDF is scanned images, not text. | Run it through an OCR tool first, or find a text version. |
| Model name errors | Providers retire models. | Run `node dist/index.js config --show` and pick a current model with `--model`. |
| Long pauses with no output | Normal during big AI calls. | Each step logs when it starts and finishes. Give it a few minutes before assuming it is stuck. |

The full troubleshooting list is in the [User Guide](docs/user-guide.md#troubleshooting).

---

## 10. Where to go next

- [README.md](README.md): the overview for developers, the design decisions, and the repository layout.
- [docs/user-guide.md](docs/user-guide.md): every command and option, with examples.
- [docs/flowchart.html](docs/flowchart.html): an animated view of the pipeline with token estimates per step.
- [docs/research/](docs/research/): two background papers, one on how Marine Corps curriculum approval actually works and one on where AI responsibly fits.
- [Claude Code Starter Kit](https://github.com/kylemoschetto/vibe-md-templates): the templates and workflow used to build this.

If you build something with this, in any service, the author would like to hear about it. Open an issue on the repository and say what you made.
