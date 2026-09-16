# Product Requirements Document: Curriculum Builder and Maintainer (CBM)

**Version:** 1.0
**Date:** January 24, 2026
**Status:** Draft for Review

---

## 1. The Big Picture

### Project Name
**Curriculum Builder and Maintainer (CBM)**

### One-Sentence Summary
An AI-powered tool that transforms technical manuals and documentation into USMC-compliant curriculum artifacts following the Systems Approach to Training (SAT).

### Who Is This For?
- **Primary Users:** Curriculum Developers at MCCES (typically E-6/E-7 NCOs with MOS expertise but limited formal instructional design training)
- **Secondary Users:** Directors of Training, Academics Officers who review and approve curriculum
- **Stakeholders:** TECOM, Training Command leadership evaluating AI integration

### Problem Statement
The current curriculum development lifecycle at MCCES faces critical friction:
1. **Manual Transcription Bottleneck:** Developers manually read 1,000+ page Technical Manuals to extract tasks, then re-type into curriculum formats - taking weeks of effort
2. **SME Scarcity:** Gunnery Sergeants with both MOS expertise AND instructional design skills are rare
3. **Verb Selection Complexity:** Proper Bloom's Taxonomy verb selection is a science, but SMEs often lack training
4. **12-18 Month Update Lag:** By the time curriculum updates clear CCRB, the technology is often outdated
5. **MCTIMS Rigidity:** The system of record is inflexible, discouraging minor updates

### What CBM Will Do
1. **Ingest** technical source material (PDFs, manuals, transcripts)
2. **Extract** tasks and procedures automatically using AI
3. **Generate** T&R-style events mapped to the content
4. **Create** TLOs/ELOs with proper Bloom's Taxonomy verbs
5. **Produce** Master Lesson File structure
6. **Build** assessment items (quizzes) mapped 1:1 to objectives
7. **Ask Questions** to refine outputs based on human expertise
8. **Export** deliverables in Markdown and Word formats

### What CBM Will NOT Do (MVP Scope)
- Integrate directly with MCTIMS (future phase)
- Handle classified materials (unclassified CUI only)
- Generate full POI with resource loading and time allocation (future phase)
- Replace human SME review and approval (AI is the "junior clerk," not the approver)
- Generate Operational Risk Assessment Worksheets (ORAW) - safety requires human judgment
- Create slide decks or multimedia content (future phase)

---

## 2. Domain Model: USMC Curriculum Framework

### Governing Directives (The "Iron Triangle")
| Document | Purpose |
|----------|---------|
| **MCO 1553.1C** | Strategic policy - defines SAT as mandatory methodology |
| **MCO 1553.2D** | Schoolhouse operations - CCRB, POI approval authority |
| **NAVMC 1553.1A** | The "Bible" - tactical how-to for ADDIE execution |

### The ADDIE Lifecycle
```
ANALYZE → DESIGN → DEVELOP → IMPLEMENT → EVALUATE
   ↑                                           |
   └───────────────────────────────────────────┘
```

### Key Artifacts and Their Relationships
```
T&R Manual (Source of Truth)
    ↓
T&R Events (Tasks Marines must perform)
    ↓
Terminal Learning Objectives (TLOs)
    ↓
Enabling Learning Objectives (ELOs)
    ↓
├── Master Lesson File (MLF)
│   ├── Concept Card
│   ├── Instructor Guide
│   └── Student Outline
└── Assessment Items
    ├── Written Tests
    └── Performance Checklists
```

### Learning Objective Structure (Mager Format)
Every TLO/ELO must contain:
- **Condition:** "Given a [equipment/scenario]..."
- **Behavior:** "[Action verb] the [object]..."
- **Standard:** "...within [time/accuracy], per [reference]"

### Bloom's Taxonomy Requirements
CBM must select verbs based on cognitive level:

| Level | Domain | Example Verbs | Use Case |
|-------|--------|---------------|----------|
| 1-Remember | Cognitive | Define, List, State, Identify | Facts, terminology |
| 2-Understand | Cognitive | Describe, Explain, Summarize | Concepts, principles |
| 3-Apply | Cognitive | Demonstrate, Perform, Calculate | Procedures, processes |
| 4-Analyze | Cognitive | Troubleshoot, Diagnose, Differentiate | Problem-solving |
| 5-Evaluate | Cognitive | Assess, Critique, Determine | Judgment calls |
| 6-Create | Cognitive | Design, Develop, Construct | Ill-structured problems |

Psychomotor domain uses Dave's taxonomy (Imitation → Manipulation → Precision → Articulation → Naturalization).

---

## 3. User Stories (MVP Features)

### Epic 1: Source Material Ingestion
**Story 1.1:** As a curriculum developer, I want to upload a PDF or markdown file of a Technical Manual so that CBM can extract the relevant content.
- Acceptance: Supports PDF, MD, TXT formats
- Acceptance: Extracts text while preserving structure (chapters, procedures)

**Story 1.2:** As a curriculum developer, I want CBM to identify and categorize all procedures and tasks in the source material so that I don't have to read the entire manual.
- Acceptance: Lists extracted tasks with source page/section references
- Acceptance: Categorizes tasks by type (Operation, Maintenance, Troubleshooting)

### Epic 2: T&R Event Generation
**Story 2.1:** As a curriculum developer, I want CBM to generate T&R-style event codes from extracted tasks so that my objectives trace back to requirements.
- Acceptance: Events follow format: `XXXX-TYPE-NNNN` (e.g., `0621-OPS-2001`)
- Acceptance: Each event includes: Title, Condition, Standard, Performance Steps

**Story 2.2:** As a curriculum developer, I want to review and approve generated T&R events before proceeding so that I maintain control over the curriculum foundation.
- Acceptance: Events presented for review in Pass 1
- Acceptance: I can accept, reject, or modify each event

### Epic 3: Learning Objective Creation
**Story 3.1:** As a curriculum developer, I want CBM to generate Terminal Learning Objectives (TLOs) from approved T&R events using proper Bloom's Taxonomy verbs.
- Acceptance: Each TLO includes Condition, Behavior, Standard
- Acceptance: Verb selection explained with cognitive level justification
- Acceptance: TLOs trace to specific T&R events

**Story 3.2:** As a curriculum developer, I want CBM to generate Enabling Learning Objectives (ELOs) that support each TLO.
- Acceptance: 2-5 ELOs per TLO
- Acceptance: ELOs are at equal or lower cognitive levels than parent TLO
- Acceptance: ELOs cover prerequisite knowledge, skills, attitudes (KSAs)

**Story 3.3:** As a curriculum developer, I want each learning objective to include a justification statement explaining the verb choice and cognitive level.
- Acceptance: Justification cites Bloom's taxonomy level
- Acceptance: Explains why this level is appropriate for the task

### Epic 4: Master Lesson File Generation
**Story 4.1:** As a curriculum developer, I want CBM to generate a structured MLF outline for each lesson.
- Acceptance: Includes standard sections: Introduction, Body, Practical Application, Conclusion
- Acceptance: Body organized around TLOs/ELOs
- Acceptance: Performance steps extracted from source material

**Story 4.2:** As a curriculum developer, I want the MLF to include suggested instructional methods based on the learning domain.
- Acceptance: Lecture for knowledge objectives
- Acceptance: Demonstration for skill objectives
- Acceptance: Discussion/case study for attitude objectives

### Epic 5: Assessment Generation
**Story 5.1:** As a curriculum developer, I want CBM to generate a 20-question quiz that maps to the learning objectives.
- Acceptance: Each question traces to a specific ELO
- Acceptance: Mix of question types (multiple choice, true/false)
- Acceptance: Plausible distractors based on common errors

**Story 5.2:** As a curriculum developer, I want an answer key with explanations for each question.
- Acceptance: Correct answer identified
- Acceptance: Explanation of why each distractor is wrong
- Acceptance: Reference to source material page/section

### Epic 6: Two-Pass Workflow
**Story 6.1:** As a curriculum developer, I want CBM to generate an initial draft autonomously (Pass 1).
- Acceptance: Complete first draft without interruption
- Acceptance: All artifacts generated with AI best-guess decisions

**Story 6.2:** As a curriculum developer, I want to review Pass 1 outputs and provide feedback for refinement (Pass 2).
- Acceptance: Can mark items for revision with comments
- Acceptance: Can approve items as-is
- Acceptance: CBM regenerates only marked items

### Epic 7: Export and Output
**Story 7.1:** As a curriculum developer, I want to export all deliverables in Markdown format.
- Acceptance: Clean, human-readable markdown
- Acceptance: Version-control friendly (no binary blobs)

**Story 7.2:** As a curriculum developer, I want to export deliverables in Microsoft Word format (.docx).
- Acceptance: Professional formatting
- Acceptance: Compatible with MCCES templates where possible

### Epic 8: Target Population Configuration
**Story 8.1:** As a curriculum developer, I want to specify the target population so CBM can tailor complexity.
- Acceptance: Capture: Rank range, education level, prerequisite MOS training
- Acceptance: Adjust reading level and assumed knowledge accordingly

---

## 4. The Look and Feel

### Overall Style
- **CLI-first:** Primary interface is command-line for integration with developer workflows
- **Clean outputs:** Generated documents should look professional and military-appropriate
- **Traceability visible:** Every generated element shows its source reference

### Key Screens/Outputs

**Screen 1: Source Ingestion**
```
CBM> Ingesting: MCRP_3-40.3C_Antenna_Handbook.pdf
     Extracted 8 chapters, 147 pages
     Found 23 procedures, 45 tasks
     Ready for T&R event generation.
```

**Screen 2: T&R Event Review (Pass 1)**
```
CBM> Generated 12 T&R Events from source material:

[1] 0621-ANT-1001: Identify Components of HF Antenna Systems
    Condition: Given diagrams and actual antenna components
    Standard: 100% accuracy, per MCRP 3-40.3C Ch. 2
    [A]ccept / [R]eject / [M]odify? _

[2] 0621-ANT-1002: Calculate Antenna Length for Operating Frequency
    ...
```

**Screen 3: TLO/ELO Generation**
```
CBM> TLO-1: Given an AN/PRC-104 radio and mission requirements,
            SELECT the appropriate HF antenna
            to establish reliable communications,
            per MCRP 3-40.3C Chapter 4.

     Cognitive Level: Apply (Level 3)
     Justification: Requires applying selection criteria to
                    specific tactical scenarios, not just recall.

     Supporting ELOs:
     └── ELO-1.1: Identify the characteristics of 8 HF antenna types
     └── ELO-1.2: Describe the relationship between antenna gain and range
     └── ELO-1.3: Calculate antenna length using the velocity formula
```

**Screen 4: Quiz Question Example**
```
Question 7 (Maps to ELO-1.3):
What is the wavelength in meters of a radio signal at 15 MHz?

A) 10 meters
B) 20 meters ✓
C) 30 meters
D) 45 meters

Explanation: Wavelength = 300,000,000 / 15,000,000 = 20 meters
Source: MCRP 3-40.3C, Page 1-3
```

---

## 5. Technical Approach

### Technology Stack
- **Runtime:** Node.js 20+ with TypeScript
- **AI Integration:** OpenAI API (GPT-4) or Anthropic Claude API
- **PDF Processing:** pdf-parse or pdf-lib for extraction
- **Document Generation:**
  - Markdown: Native string templates
  - Word: docx library (officegen or docx)
- **CLI Framework:** Commander.js or Inquirer.js for interactive prompts

### Architecture
```
┌─────────────────────────────────────────────────────────┐
│                      CBM CLI                            │
├─────────────────────────────────────────────────────────┤
│  Ingestion Module  │  Generation Module  │  Export      │
│  ├─ PDF Parser     │  ├─ T&R Generator   │  ├─ Markdown │
│  ├─ MD Parser      │  ├─ TLO Generator   │  └─ DOCX     │
│  └─ Task Extractor │  ├─ ELO Generator   │              │
│                    │  ├─ MLF Generator   │              │
│                    │  └─ Quiz Generator  │              │
├─────────────────────────────────────────────────────────┤
│                  AI Service Layer                       │
│  ├─ Prompt Templates (grounded in NAVMC 1553.1A)       │
│  ├─ RAG Context (MCO references)                       │
│  └─ Validation Rules (Bloom's taxonomy)                │
├─────────────────────────────────────────────────────────┤
│                  Document Store                         │
│  └─ Project folder with versioned outputs              │
└─────────────────────────────────────────────────────────┘
```

### AI Prompt Strategy
Each generation task uses a structured prompt that includes:
1. **System context:** Role as Marine Corps curriculum developer, NAVMC 1553.1A requirements
2. **Domain rules:** Bloom's taxonomy, Mager format, verb lists
3. **Source material:** Relevant extracted content
4. **Output schema:** Expected structure with examples
5. **Citation requirement:** Always reference source page/section

### Validation Rules (Guardrails)
- Every TLO must have ≥1 ELO
- Every assessment item must map to exactly 1 ELO
- Verbs must match cognitive level (no "understand" for Apply-level objectives)
- No orphan objectives (must trace to T&R event)
- Source citations required for all factual claims

---

## 6. MVP Deliverables for Demonstration

Using **MCRP 3-40.3C (Antenna Handbook)** as source material, CBM will produce:

| Deliverable | Description | Format |
|-------------|-------------|--------|
| **T&R Events** | 10-15 simulated T&R events derived from the antenna manual | MD + DOCX |
| **TLO/ELO Matrix** | Full objective hierarchy with justifications | MD + DOCX |
| **Master Lesson File** | Structured lesson outline for 1 representative TLO | MD + DOCX |
| **20-Question Quiz** | Assessment items with answer key and mappings | MD + DOCX |

### Demo Narrative
1. Show the raw PDF input (Antenna Handbook)
2. Run CBM ingestion - show extracted tasks
3. Display generated T&R events, walk through one
4. Show TLO/ELO generation with Bloom's justification
5. Display MLF structure
6. Walk through quiz questions with traceability
7. Export to Word - "ready for SME review"

---

## 7. Future Phases (Out of MVP Scope)

### Phase 2: Complete Curriculum Package
- Full POI generation with time allocation
- Resource loading (equipment, ammunition, facilities)
- Student outline generation
- Slide deck generation (Markdown → PowerPoint)

### Phase 3: Lifecycle Management
- Version control integration (Git-based curriculum tracking)
- Change detection: "New TM version → flagged lessons"
- CCRB preparation automation
- Diff analysis between curriculum versions

### Phase 4: MCTIMS Integration
- API or RPA-based push to MCTIMS fields
- Validation against MCTIMS schema
- Status tracking for approval workflow

### Phase 5: Implementation Support
- Real-time transcription during instruction
- Coverage analysis: "You missed ELO 3.2"
- Student question capture and SME assist
- Redline suggestion automation

---

## 8. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Task extraction accuracy | >90% | SME validation of extracted tasks |
| TLO/ELO compliance | 100% | All objectives pass Mager format check |
| Verb appropriateness | >85% | SME agreement with Bloom's level |
| Quiz item validity | >90% | Items correctly test stated ELO |
| Time savings | 75% reduction | Compared to manual development |
| User satisfaction | >4/5 stars | Post-demo survey from MCCES staff |

---

## 9. Risks and Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| AI hallucination of facts | High | Medium | Mandatory source citations, human review pass |
| Incorrect verb selection | Medium | Medium | Explicit Bloom's justification, SME review |
| Overly complex for target users | Medium | Low | CLI with guided prompts, clear documentation |
| Copyright concerns with TMs | High | Low | Government training use case, SJA consultation |
| AI generates too much content | Medium | Medium | Configurable scope limits, chunked generation |

---

## 10. Compliance Checklist

Per **NAVMC 5239.1** (Guidance on Generative AI):
- [ ] All AI-generated content watermarked: "DRAFT - AI GENERATED - REQUIRES SME VALIDATION"
- [ ] Human-in-the-loop required for all approvals
- [ ] No classified material processed
- [ ] Citation of sources required for all factual content
- [ ] Numeric values (frequencies, distances) flagged for mandatory human verification

---

## 11. Glossary

| Term | Definition |
|------|------------|
| ADDIE | Analyze, Design, Develop, Implement, Evaluate |
| CCRB | Course Content Review Board |
| ELO | Enabling Learning Objective |
| KSA | Knowledge, Skills, Attitudes |
| MCTIMS | Marine Corps Training Information Management System |
| MLF | Master Lesson File |
| MOS | Military Occupational Specialty |
| ORAW | Operational Risk Assessment Worksheet |
| POI | Program of Instruction |
| SAT/SATE | Systems Approach to Training (and Education) |
| SME | Subject Matter Expert |
| TECOM | Training and Education Command |
| TLO | Terminal Learning Objective |
| T&R | Training and Readiness (Manual) |
