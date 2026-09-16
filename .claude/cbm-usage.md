# CBM Usage Guide

**Curriculum Builder and Maintainer** - AI-powered CLI for USMC curriculum development following NAVMC 1553.1A and SAT/ADDIE methodology.

---

## Quick Start

```bash
# 1. Set up your environment
cp .env.local.example .env.local
# Edit .env.local and add your API key(s)

# 2. Configure CBM
cbm config

# 3. Run the full pipeline on a source document
cbm pipeline "MCRP 3-40.3C.md" --skip-review
```

---

## Environment Setup

### API Keys

Create a `.env.local` file in the project root with your API keys:

```bash
# OpenAI (https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-...

# Anthropic Claude (https://console.anthropic.com/settings/keys)
ANTHROPIC_API_KEY=sk-ant-...

# Google Gemini (https://aistudio.google.com/app/apikey)
GOOGLE_API_KEY=AIza...
```

Only one API key is required. CBM will automatically use whichever provider has a key configured.

### Provider Selection Priority

1. CLI flag (`--provider`)
2. Config file (`cbm-config.json`)
3. First available key (openai → anthropic → google)

---

## CLI Command Reference

### `cbm config`

Configure CBM settings interactively or directly.

```bash
# Interactive configuration
cbm config

# Show current configuration
cbm config --show

# Set specific values
cbm config --set aiProvider=anthropic
cbm config --set aiModel=claude-sonnet-4-20250514
cbm config --set outputDir=./curriculum-output
cbm config --target-pop "0621 Field Radio Operators"
```

**Configuration Options:**
| Option | Values | Default |
|--------|--------|---------|
| `aiProvider` | `openai`, `anthropic`, `google` | `openai` |
| `aiModel` | Model ID string | Provider default |
| `outputDir` | Directory path | `./output` |
| `targetPopulation` | Description string | (not set) |
| `sourceDocument` | File path | (not set) |

**Default Models by Provider:**
| Provider | Default Model |
|----------|---------------|
| Google | `gemini-3-flash-preview` |
| Anthropic | `claude-sonnet-4-5-20250929` |
| OpenAI | `gpt-4o` |

**All Available Models:**
| Provider | Models |
|----------|--------|
| Google | `gemini-3-flash-preview` (default), `gemini-3-pro-preview`, `gemini-1.5-pro` |
| Anthropic | `claude-sonnet-4-5-20250929` (default), `claude-opus-4-5-20251101` |
| OpenAI | `gpt-4o` (default), `gpt-4o-mini`, `gpt-4-turbo` |

**Note:** Use `cbm config --show` to see all available models and current selection.

---

### `cbm ingest <file>`

Parse and ingest a source document (PDF or Markdown).

```bash
# Basic ingest
cbm ingest "MCRP 3-40.3C.md"

# Ingest with AI task extraction
cbm ingest "MCRP 3-40.3C.md" --tasks

# Custom output directory
cbm ingest "MCRP 3-40.3C.md" -t -o ./my-output/ingested
```

**Options:**
| Flag | Description | Default |
|------|-------------|---------|
| `-t, --tasks` | Extract trainable tasks using AI | `false` |
| `-o, --output <dir>` | Output directory | `./output/ingested` |

**Output Files:**
- `content.json` - Parsed document structure
- `tasks.json` - Extracted tasks (if `--tasks` used)

---

### `cbm generate`

Generate curriculum artifacts (Pass 1 - Autonomous).

```bash
# Basic generation
cbm generate

# With options
cbm generate -i ./output/ingested -o ./output/pass1 -q 30 -e 15

# Override AI provider for this run
cbm generate --provider anthropic --model claude-sonnet-4-20250514
```

**Options:**
| Flag | Description | Default |
|------|-------------|---------|
| `-i, --input <dir>` | Input directory with ingested content | `./output/ingested` |
| `-o, --output <dir>` | Output directory for artifacts | `./output/pass1` |
| `-q, --quiz-count <n>` | Number of quiz questions | `20` |
| `-e, --max-events <n>` | Maximum T&R events | `10` |
| `-p, --provider <name>` | AI provider override | (from config) |
| `-m, --model <name>` | AI model override | (from config) |

**Generated Artifacts:**
- `tr-events.json` - Training & Readiness Events
- `tlos.json` - Terminal Learning Objectives
- `elos.json` - Enabling Learning Objectives
- `mlf.json` - Master Lesson File sections
- `quiz.json` - Quiz questions

---

### `cbm review`

Interactive review of generated artifacts (Pass 2).

```bash
# Review Pass 1 output
cbm review

# Custom directories
cbm review -i ./output/pass1 -o ./output/final
```

**Options:**
| Flag | Description | Default |
|------|-------------|---------|
| `-i, --input <dir>` | Input directory with Pass 1 artifacts | `./output/pass1` |
| `-o, --output <dir>` | Output directory for reviewed artifacts | `./output/final` |

---

### `cbm export`

Export artifacts to Markdown and/or Word documents.

```bash
# Export reviewed artifacts
cbm export

# Export to specific format
cbm export -f md
cbm export -f docx
cbm export -f both

# Custom directories
cbm export -i ./output/final -o ./export --title "Radio Operator Curriculum"
```

**Options:**
| Flag | Description | Default |
|------|-------------|---------|
| `-i, --input <dir>` | Input directory with artifacts | `./output/final` |
| `-o, --output <dir>` | Output directory for exports | `./output/export` |
| `-f, --format <fmt>` | Export format: `md`, `docx`, `both` | `both` |
| `-t, --title <title>` | Document title | (from source) |

---

### `cbm pipeline <file>`

Run the full curriculum generation pipeline.

```bash
# Full pipeline with review
cbm pipeline "MCRP 3-40.3C.md"

# Skip interactive review
cbm pipeline "MCRP 3-40.3C.md" --skip-review

# Full options
cbm pipeline "MCRP 3-40.3C.md" \
  -o ./curriculum \
  -q 25 \
  --skip-review \
  -f docx \
  --provider anthropic
```

**Options:**
| Flag | Description | Default |
|------|-------------|---------|
| `-o, --output <dir>` | Base output directory | `./output` |
| `-q, --quiz-count <n>` | Number of quiz questions | `20` |
| `--skip-review` | Skip interactive review | `false` |
| `-f, --format <fmt>` | Export format | `both` |
| `-p, --provider <name>` | AI provider override | (from config) |
| `-m, --model <name>` | AI model override | (from config) |

---

## Workflow Walkthrough

### Complete Curriculum Development Workflow

```
Source Document → Ingest → Generate → Review → Export
     (PDF/MD)       ↓         ↓         ↓        ↓
                 content   artifacts  refined   MD/DOCX
                 + tasks   (Pass 1)   (Pass 2)  documents
```

### Step-by-Step

**1. Configure your environment**
```bash
cbm config
```

**2. Ingest source material**
```bash
cbm ingest "MCRP 3-40.3C.md" --tasks
```

**3. Generate curriculum artifacts**
```bash
cbm generate
```

**4. Review and refine (interactive)**
```bash
cbm review
```

**5. Export final documents**
```bash
cbm export -f both
```

### One-Command Pipeline

For faster iteration, use the pipeline command:

```bash
# Development (skip review)
cbm pipeline "source.md" --skip-review

# Production (with review)
cbm pipeline "source.md"
```

---

## Generated Artifact Types

### T&R Events
Training and Readiness Events per NAVMC 1553.1A format:
- Unique ID (e.g., "0621-ANT-1001")
- Title, Condition, Standard
- Performance Steps
- Source Reference

### Learning Objectives (TLO/ELO)
Mager-format objectives with:
- Condition: "Given [equipment/scenario]..."
- Behavior: "[Action verb] the [object]..."
- Standard: "...within [time/accuracy], per [reference]"
- Bloom's Taxonomy level (1-6)
- Justification for verb selection

### Master Lesson File (MLF)
Lesson structure including:
- Introduction (gain attention, overview, objectives)
- Body (main teaching points)
- Practical Application (scenario, steps)
- Conclusion (summary, closing)

### Quiz Items
Multiple-choice questions with:
- ELO mapping
- Distractors based on common misconceptions
- Source-cited explanations

---

## Troubleshooting

### "No API key found"
```bash
# Check your .env.local file exists and has at least one key
cat .env.local

# Verify environment variable is set
echo $OPENAI_API_KEY
```

### Provider-specific errors

**OpenAI:**
- Check rate limits at https://platform.openai.com/usage
- Verify API key permissions

**Anthropic:**
- Check rate limits at https://console.anthropic.com
- Ensure sufficient credits

**Google:**
- Check quota at https://console.cloud.google.com
- Verify Gemini API is enabled

### Build errors
```bash
# Rebuild the project
npm run build

# Clear and reinstall dependencies
rm -rf node_modules dist
npm install
npm run build
```

---

## Project Structure

```
.
├── src/
│   ├── index.ts              # CLI entry point
│   ├── ai/
│   │   ├── client.ts         # Multi-provider AI client
│   │   └── providers/        # Provider adapters
│   ├── cli/commands/         # CLI command implementations
│   ├── generation/           # Artifact generators
│   └── types/                # TypeScript definitions
├── .env.local                # API keys (git-ignored)
├── cbm-config.json           # Project configuration
└── output/                   # Generated artifacts
```
