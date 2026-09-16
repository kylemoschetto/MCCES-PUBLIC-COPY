# CBM User Guide

**Curriculum Builder for Marines (CBM)** - AI-Powered Curriculum Development Tool

---

## Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Quick Start](#quick-start)
5. [Commands Reference](#commands-reference)
6. [The Pipeline](#the-pipeline)
7. [Understanding the Output](#understanding-the-output)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)
10. [Glossary](#glossary)

---

## Overview

### What is CBM?

CBM (Curriculum Builder for Marines) is an AI-powered command-line tool that transforms technical military manuals and documentation into USMC-compliant curriculum artifacts. It follows the Systems Approach to Training (SAT) and ADDIE methodology to generate:

- **T&R Events** - Training and Readiness event specifications
- **TLOs** - Terminal Learning Objectives (Mager format)
- **ELOs** - Enabling Learning Objectives
- **MLF** - Master Lesson File sections
- **Quiz Questions** - Assessment items with answer keys

### Why Use CBM?

Traditional curriculum development takes 12-18 months. CBM accelerates this by:

1. **Automating extraction** - Identifies trainable tasks from source documents
2. **Generating objectives** - Creates properly formatted learning objectives
3. **Maintaining compliance** - Follows NAVMC 1553.1A standards
4. **Supporting review** - Provides interactive validation and editing

### Requirements

- **Node.js 20+** - JavaScript runtime
- **API Key** - At least one of:
  - OpenAI API key
  - Anthropic API key
  - Google AI API key

---

## Installation

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/kylemoschetto/MCCES-PUBLIC-COPY.git
cd MCCES-PUBLIC-COPY

# Install dependencies
npm install

# Build the project
npm run build
```

### 2. Configure API Keys

Create a `.env.local` file in the project root:

```bash
# At least one key is required
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=AIza...
```

### 3. Verify Installation

```bash
# Run CBM to see available commands
npx cbm --help
```

---

## Configuration

### Interactive Configuration

Run the configuration wizard:

```bash
npx cbm config
```

This guides you through setting:
- AI provider (OpenAI, Anthropic, or Google)
- AI model
- Output directory
- Target population description
- Source document path

### Direct Configuration

Set values directly:

```bash
# View current configuration
npx cbm config --show

# Set specific values
npx cbm config --set aiProvider=anthropic
npx cbm config --set aiModel=claude-sonnet-4-5-20250929
npx cbm config --set outputDir=./my-output
npx cbm config --set "targetPopulation=0621 Field Radio Operators"
```

### Configuration File

Settings are saved to `cbm-config.json`:

```json
{
  "targetPopulation": "0621 Field Radio Operators",
  "sourceDocument": "./source/MCRP-3-40.3C.md",
  "outputDir": "./output",
  "aiProvider": "anthropic",
  "aiModel": "claude-sonnet-4-5-20250929"
}
```

### Available AI Providers and Models

| Provider | Default Model | Other Options |
|----------|---------------|---------------|
| `google` | `gemini-3-flash-preview` | `gemini-3-pro-preview`, `gemini-1.5-pro` |
| `anthropic` | `claude-sonnet-4-5-20250929` | `claude-opus-4-5-20251101` |
| `openai` | `gpt-4o` | `gpt-4o-mini`, `gpt-4-turbo` |

---

## Quick Start

### Option A: Full Pipeline (Fastest)

Run the entire workflow in one command:

```bash
npx cbm pipeline "source-document.pdf" --skip-review
```

This executes: Ingest → Generate → Export

### Option B: Full Pipeline with Review

Include human review of generated artifacts:

```bash
npx cbm pipeline "source-document.pdf"
```

This executes: Ingest → Generate → Review → Export

### Option C: Step-by-Step (Most Control)

Run each step individually:

```bash
# Step 1: Ingest the source document
npx cbm ingest "source-document.pdf" --tasks

# Step 2: Generate curriculum artifacts
npx cbm generate

# Step 3: Review and refine (interactive)
npx cbm review

# Step 4: Export to final formats
npx cbm export
```

### Output Location

All outputs are saved to the configured output directory (default: `./output/`):

```
output/
├── ingested/          # Parsed content and extracted tasks
├── pass1/             # AI-generated artifacts (unreviewed)
├── final/             # Reviewed/approved artifacts
└── export/            # Final documents (Markdown & Word)
```

---

## Commands Reference

### `cbm config` - Configuration Management

Manage CBM configuration settings.

```bash
# Interactive wizard
npx cbm config

# Show current configuration
npx cbm config --show

# Set a specific value
npx cbm config --set <key>=<value>

# Set target population
npx cbm config --target-pop "0621 Field Radio Operators"
```

**Configuration Keys:**
| Key | Description | Default |
|-----|-------------|---------|
| `aiProvider` | AI service provider | `google` |
| `aiModel` | Model identifier | (varies by provider) |
| `outputDir` | Output directory path | `./output` |
| `targetPopulation` | Learner description | (none) |
| `sourceDocument` | Source file path | (none) |

---

### `cbm ingest <file>` - Document Ingestion

Parse a source document and extract content.

```bash
npx cbm ingest "document.pdf" [options]
```

**Arguments:**
- `<file>` - Path to PDF or Markdown file

**Options:**
| Option | Description | Default |
|--------|-------------|---------|
| `-t, --tasks` | Extract trainable tasks using AI | (disabled) |
| `-o, --output <dir>` | Output directory | `./output/ingested` |

**Supported Formats:**
- PDF (`.pdf`) - Technical manuals, references
- Markdown (`.md`, `.markdown`) - Text documents

**Output Files:**
- `content.json` - Parsed document with sections and metadata
- `tasks.json` - Extracted tasks (if `--tasks` flag used)

**Example:**
```bash
# Ingest PDF and extract tasks
npx cbm ingest "MCRP-3-40.3C.pdf" --tasks

# Ingest Markdown to specific directory
npx cbm ingest "manual.md" -o ./data/ingested
```

---

### `cbm generate` - Artifact Generation (Pass 1)

Generate all curriculum artifacts from ingested content.

```bash
npx cbm generate [options]
```

**Options:**
| Option | Description | Default |
|--------|-------------|---------|
| `-i, --input <dir>` | Input directory with ingested content | `./output/ingested` |
| `-o, --output <dir>` | Output directory | `./output/pass1` |
| `-q, --quiz-count <n>` | Number of quiz questions | `20` |
| `-e, --max-events <n>` | Maximum T&R events | `10` |
| `-p, --provider <name>` | Override AI provider | (from config) |
| `-m, --model <id>` | Override AI model | (from config) |

**Generation Steps (in order):**
1. **T&R Events** - Training & Readiness event specifications
2. **TLOs** - Terminal Learning Objectives
3. **ELOs** - Enabling Learning Objectives
4. **MLF** - Master Lesson File sections
5. **Quiz** - Assessment questions

**Output Files:**
- `tr-events.json` - T&R event specifications
- `tlos.json` - Terminal Learning Objectives
- `elos.json` - Enabling Learning Objectives
- `mlf.json` - Master Lesson File sections
- `quiz.json` - Quiz questions with answers

**Example:**
```bash
# Generate with defaults
npx cbm generate

# Generate with more questions and events
npx cbm generate --quiz-count 30 --max-events 15

# Use specific provider and model
npx cbm generate -p anthropic -m claude-sonnet-4-5-20250929
```

---

### `cbm review` - Interactive Review (Pass 2)

Review and refine AI-generated artifacts interactively.

```bash
npx cbm review [options]
```

**Options:**
| Option | Description | Default |
|--------|-------------|---------|
| `-i, --input <dir>` | Input directory with Pass 1 artifacts | `./output/pass1` |
| `-o, --output <dir>` | Output directory for reviewed artifacts | `./output/final` |

**Review Process:**

For each TLO, ELO, and quiz question, you can:
- **[A]ccept** - Keep the item as-is
- **[R]eject** - Remove with feedback (for improvement tracking)
- **[M]odify** - Keep with modification notes
- **[S]kip remaining** - Accept all remaining items

**What Gets Reviewed:**
- Terminal Learning Objectives (TLOs)
- Enabling Learning Objectives (ELOs)
- Quiz questions

**What's Auto-Copied:**
- T&R Events (`tr-events.json`)
- MLF sections (`mlf.json`)

**Example:**
```bash
# Review with defaults
npx cbm review

# Review from custom location
npx cbm review -i ./my-artifacts -o ./reviewed
```

---

### `cbm export` - Export to Documents

Generate final deliverable documents in Markdown and/or Word format.

```bash
npx cbm export [options]
```

**Options:**
| Option | Description | Default |
|--------|-------------|---------|
| `-i, --input <dir>` | Input directory with artifacts | `./output/final` |
| `-o, --output <dir>` | Output directory | `./output/export` |
| `-f, --format <fmt>` | Export format: `md`, `docx`, or `both` | `both` |
| `-t, --title <title>` | Document title | (from source) |

**Generated Documents:**
| File | Description |
|------|-------------|
| `tr-events.md/.docx` | T&R Event specifications |
| `objectives-matrix.md/.docx` | TLO/ELO matrix |
| `master-lesson-file.md` | MLF sections (Markdown only) |
| `quiz-student.md/.docx` | Student quiz (no answers) |
| `quiz-instructor.md/.docx` | Instructor quiz (with answer key) |

**Example:**
```bash
# Export both formats (default)
npx cbm export

# Export only Word documents
npx cbm export --format docx

# Export with custom title
npx cbm export --title "OE-254 Antenna Training"
```

---

### `cbm pipeline <file>` - Full Pipeline

Run the complete workflow in one command.

```bash
npx cbm pipeline <file> [options]
```

**Arguments:**
- `<file>` - Path to source document (PDF or Markdown)

**Options:**
| Option | Description | Default |
|--------|-------------|---------|
| `-o, --output <dir>` | Base output directory | `./output` |
| `-q, --quiz-count <n>` | Number of quiz questions | `20` |
| `--skip-review` | Skip interactive review step | (disabled) |
| `-f, --format <fmt>` | Export format: `md`, `docx`, or `both` | `both` |
| `-p, --provider <name>` | Override AI provider | (from config) |
| `-m, --model <id>` | Override AI model | (from config) |

**Pipeline Steps:**
1. Ingest (with task extraction)
2. Generate (autonomous Pass 1)
3. Review (interactive Pass 2) - *skipped if `--skip-review`*
4. Export (to specified format)

**Example:**
```bash
# Full pipeline with review
npx cbm pipeline "manual.pdf"

# Quick pipeline (skip review)
npx cbm pipeline "manual.pdf" --skip-review

# Custom options
npx cbm pipeline "manual.pdf" -q 25 -f md --skip-review
```

---

## The Pipeline

### High-Level Flow

```
┌─────────────────┐
│ Source Document │  PDF or Markdown file
└────────┬────────┘
         ▼
┌─────────────────┐
│     INGEST      │  Parse document, extract tasks
└────────┬────────┘
         ▼
┌─────────────────┐
│    GENERATE     │  AI creates T&R, TLOs, ELOs, MLF, Quiz
│    (Pass 1)     │
└────────┬────────┘
         ▼
┌─────────────────┐
│     REVIEW      │  Human reviews and refines
│    (Pass 2)     │
└────────┬────────┘
         ▼
┌─────────────────┐
│     EXPORT      │  Generate Markdown and Word documents
└────────┬────────┘
         ▼
┌─────────────────┐
│ Final Documents │  Ready for SME review and CCRB
└─────────────────┘
```

### Generation Steps Detail

#### Step 1: Task Extraction (Ingest)

The AI analyzes source content to identify trainable tasks:
- Procedures and processes
- Equipment operations
- Assembly/disassembly sequences
- Maintenance tasks
- Troubleshooting procedures
- Safety procedures
- Communication protocols

Each task is tagged with:
- Source reference (page/section)
- Suggested cognitive level

#### Step 2: T&R Event Generation

Creates Training & Readiness events in NAVMC format:

```
Event ID: 0621-ANT-1001
Title: Assemble OE-254 Antenna
Condition: Given an OE-254 antenna kit and installation location...
Standard: Within 15 minutes, achieving 100% assembly accuracy...
Performance Steps:
  1. Inventory all components
  2. Select installation site
  3. Assemble base section
  ...
```

#### Step 3: TLO Generation

Creates Terminal Learning Objectives using Mager format:

```
TLO-001 (Cognitive Level 3 - Apply)
Condition: Given an OE-254 antenna kit and installation location
Behavior: Assemble the antenna system
Standard: Within 15 minutes, achieving 100% accuracy per MCRP 3-40.3C

Justification: Level 3 (Apply) because Marines must apply assembly
procedures to actual equipment in field conditions.
```

**Bloom's Taxonomy Levels:**
| Level | Name | Description |
|-------|------|-------------|
| 1 | Remember | Recall facts and basic concepts |
| 2 | Understand | Explain ideas or concepts |
| 3 | Apply | Use information in new situations |
| 4 | Analyze | Draw connections among ideas |
| 5 | Evaluate | Justify a decision or action |
| 6 | Create | Produce new or original work |

#### Step 4: ELO Generation

Creates Enabling Learning Objectives (prerequisites for each TLO):

```
ELO-001 (Parent: TLO-001, Cognitive Level 1)
Condition: Given diagrams and technical specifications
Behavior: Identify the components of the OE-254 antenna
Standard: 100% accuracy identifying all components per MCRP 3-40.3C

Sequence Order: 1 (First in learning sequence)
```

Each TLO has 2-5 supporting ELOs that:
- Have equal or lower cognitive level than the parent TLO
- Follow a logical learning sequence (knowledge before skills)
- Build toward the terminal objective

#### Step 5: MLF Generation

Creates Master Lesson File sections:

```
Lesson: Assembling OE-254 Antenna

INTRODUCTION
- Gain Attention: The OE-254 is critical for HF communications...
- Overview: In this lesson, you will learn to assemble...
- Objectives: TLO-001, ELO-001, ELO-002, ELO-003

BODY
- Main Point 1: Component Identification
  - Sub-point: Radiator elements
  - Sub-point: Support structure
- Main Point 2: Assembly Sequence
  ...

PRACTICAL APPLICATION
- Scenario: You have received an OE-254 kit for deployment...
- Steps: 1. Inventory, 2. Site selection, 3. Assembly...

CONCLUSION
- Summary: Key points covered
- Closing: Link to advanced training
```

#### Step 6: Quiz Generation

Creates assessment items aligned to ELOs:

```
Question 1 (ELO-001)
Which component connects the radiator elements to the feed line?

A. Ground plane bracket
B. Center connector assembly  ← Correct
C. Support mast collar
D. Guy wire anchor

Explanation: The center connector assembly (B) is correct because
it serves as the junction point between the radiator elements and
the coaxial feed line. Option A is incorrect because...
```

Quiz characteristics:
- Multiple choice (4 options each)
- One correct answer, three plausible distractors
- Mapped to specific ELOs
- Includes explanations for correct/incorrect answers

---

## Understanding the Output

### JSON Artifacts

All intermediate outputs are JSON files with consistent structure:

```json
{
  "id": "unique-identifier",
  "field1": "value",
  "field2": "value",
  "validation": {
    "valid": true,
    "errors": [],
    "warnings": ["Minor issue detected"]
  }
}
```

**Validation Results:**
- `valid: true` - Artifact meets all requirements
- `errors` - Critical issues that must be fixed
- `warnings` - Recommendations for improvement

### Directory Structure

```
output/
├── ingested/
│   ├── content.json      # Parsed document structure
│   └── tasks.json        # Extracted trainable tasks
│
├── pass1/                # AI-generated (unreviewed)
│   ├── tr-events.json    # T&R event specifications
│   ├── tlos.json         # Terminal Learning Objectives
│   ├── elos.json         # Enabling Learning Objectives
│   ├── mlf.json          # Master Lesson File sections
│   └── quiz.json         # Quiz questions
│
├── final/                # After human review
│   ├── tr-events.json    # (copied from pass1)
│   ├── tlos.json         # Reviewed TLOs
│   ├── elos.json         # Reviewed ELOs
│   ├── mlf.json          # (copied from pass1)
│   └── quiz.json         # Reviewed questions
│
└── export/               # Final documents
    ├── tr-events.md
    ├── tr-events.docx
    ├── objectives-matrix.md
    ├── objectives-matrix.docx
    ├── master-lesson-file.md
    ├── quiz-student.md
    ├── quiz-student.docx
    ├── quiz-instructor.md
    └── quiz-instructor.docx
```

### Document Outputs

**T&R Events Document** (`tr-events.md/.docx`)
- Complete T&R event specifications
- Formatted per NAVMC standards
- Ready for T&R Manual integration

**Objectives Matrix** (`objectives-matrix.md/.docx`)
- TLO/ELO hierarchy
- Cognitive levels and verbs
- Traceability to T&R events

**Master Lesson File** (`master-lesson-file.md`)
- Lesson plans for each TLO
- Introduction, body, practical application, conclusion
- Teaching points aligned to ELOs

**Student Quiz** (`quiz-student.md/.docx`)
- Questions only (no answers)
- For student assessment

**Instructor Quiz** (`quiz-instructor.md/.docx`)
- Questions with answer key
- Includes explanations
- For instructor reference

---

## Best Practices

### Source Document Preparation

1. **Use clear structure** - Documents with headings and sections work best
2. **Include procedures** - Step-by-step instructions extract better tasks
3. **Specify standards** - Documents with time/accuracy standards produce better objectives
4. **Remove noise** - Remove appendices, indexes, and administrative content if possible

### Configuration

1. **Set target population** - Helps AI generate appropriate cognitive levels
2. **Choose appropriate model** - Larger models produce higher quality but cost more
3. **Start small** - Test with a single chapter before processing entire manuals

### Generation

1. **Review T&R events first** - They form the foundation for all other artifacts
2. **Check cognitive levels** - Ensure TLO levels match job performance requirements
3. **Verify ELO sequences** - Learning progression should be logical

### Review Process

1. **Focus on accuracy** - Verify content matches source material
2. **Check standards** - Ensure standards are measurable and achievable
3. **Validate traceability** - Each artifact should trace to its source

### Quality Assurance

1. **Run validation** - Check all validation errors and warnings
2. **SME review** - Have subject matter experts review generated content
3. **Pilot test** - Test quiz questions with representative learners

---

## Troubleshooting

### Common Issues

**"No API key found"**
```
Solution: Add at least one API key to .env.local:
  OPENAI_API_KEY=sk-...
  ANTHROPIC_API_KEY=sk-ant-...
  GOOGLE_API_KEY=AIza...
```

**"Failed to parse PDF"**
```
Solution:
  - Ensure PDF is not encrypted or password-protected
  - Try converting to Markdown first
  - Check PDF contains extractable text (not scanned images)
```

**"Rate limit exceeded"**
```
Solution:
  - Wait a few minutes and retry
  - Use a smaller document or fewer quiz questions
  - Consider using a different provider
```

**"Invalid JSON in response"**
```
Solution:
  - Retry the generation step
  - Try a different AI model
  - Report persistent issues
```

**"No tasks extracted"**
```
Solution:
  - Ensure document contains procedural content
  - Try a larger portion of the document
  - Manually create tasks.json if needed
```

### Getting Help

1. Check the [flowchart visualization](./flowchart.html) for pipeline understanding
2. Review validation warnings in JSON output files
3. Consult the `.claude/cbm-usage.md` file for detailed CLI reference

---

## Glossary

| Term | Definition |
|------|------------|
| **ADDIE** | Analysis, Design, Development, Implementation, Evaluation - instructional design model |
| **Bloom's Taxonomy** | Framework for classifying learning objectives by cognitive level |
| **CBM** | Curriculum Builder for Marines |
| **ELO** | Enabling Learning Objective - prerequisite knowledge/skills for a TLO |
| **Mager Format** | Learning objective format: Condition, Behavior, Standard |
| **MLF** | Master Lesson File - detailed lesson plan structure |
| **NAVMC 1553.1A** | USMC Training and Education Development manual |
| **Pass 1** | Initial AI-generated artifacts (autonomous) |
| **Pass 2** | Human-reviewed and refined artifacts |
| **SAT** | Systems Approach to Training |
| **T&R** | Training and Readiness - USMC training standards |
| **TLO** | Terminal Learning Objective - high-level learning goal |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-01 | Initial release with multi-provider AI support |

---

*This documentation should be kept updated as CBM evolves. See [flowchart.html](./flowchart.html) for visual pipeline reference.*
