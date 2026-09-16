# **USMC Curriculum Authorization and Management: An Exhaustive Analysis for Automated Systems Design**

## **1\. Executive Overview**

### **The Strategic Architecture of Marine Corps Learning**

The United States Marine Corps (USMC) operates one of the most rigorous and standardized training enterprises in the world, governed by a methodology known as the **Systems Approach to Training and Education (SATE)**. This framework, codified in **MCO 1553.1C** 1, is not merely a pedagogical suggestion but a mandatory compliance architecture designed to ensure that every Marine, regardless of where they are trained, achieves a uniform level of combat readiness. The ultimate output of a USMC schoolhouse—whether it is the Marine Corps Communications-Electronics School (MCCES) in Twentynine Palms or the School of Infantry (SOI)—is a "Combat Ready Marine" certified to perform specific **Individual Training Standards (ITS)** and **Mission Essential Tasks (METs)**.

For the software architect or automation engineer, the USMC curriculum process functions as a complex supply chain of knowledge assets. "Raw materials"—such as Technical Manuals (TMs), Doctrine, and Training & Readiness (T\&R) Manuals—enter the system and are processed through strict phases of **Analysis, Design, Development, Implementation, and Evaluation (ADDIE)**. The output is a set of authorized "artifacts": the Program of Instruction (POI), the Master Lesson File (MLF), and student assessments. These artifacts form the legal and operational contract between the Training and Education Command (TECOM) and the operating forces.

However, a chasm exists between the idealized "Policy" view and the "Practice" reality. While directives mandate precision, the actual workflow is often manual, document-heavy, and reliant on disconnected legacy systems like the **Marine Corps Training Information Management System (MCTIMS)**.2 MCTIMS serves as the Authoritative Data Source (ADS), but its user experience often forces curriculum developers—typically non-commissioned officers (NCOs) who are subject matter experts rather than trained instructional designers—into administrative bottlenecks.4

### **The Automation Opportunity**

A "Curriculum Factory" software solution has the potential to bridge this gap by automating the compliance and administrative heavy-lifting. By ingesting source data (e.g., PDF manuals, T\&R XML feeds) and utilizing Large Language Models (LLMs) anchored in doctrine, a system can:

1. **Draft** high-fidelity artifacts (Learning Objectives, Lesson Plans) that trace directly to mandated standards.  
2. **Validate** outputs against strict rules (e.g., ammunition constraints, safety protocols for High Risk Training).  
3. **Sustain** the curriculum by watching for changes in source directives (e.g., a new version of a radio manual) and flagging impacted lessons automatically.

### **Lifecycle Quick Map**

The journey from a "need to train" to an "authorized course" follows a cyclical path:

1. **Trigger:** A requirement emerges from a new weapon system fielding or T\&R Manual update.6  
2. **Analysis & Design:** The schoolhouse defines the **Target Population**, derives **Learning Objectives**, and structures the **Program of Instruction (POI)**.7  
3. **Development:** Content is authored into **Master Lesson Files (MLFs)**, including Instructor Guides and Media.7  
4. **Validation:** Pilot courses test the material; feedback is captured.  
5. **Approval:** Formal signature by the Commanding General or delegated authority constitutes "Authorization".1  
6. **Sustainment:** The **Course Content Review Board (CCRB)** serves as the periodic governance mechanism (every 2-3 years) to re-validate the curriculum.10

### **Top 10 Compliance-Critical Checkpoints**

Software design must treat these ten checkpoints as "hard gates." Failure at any point renders the curriculum unauthorized or legally vulnerable.

| Checkpoint | Criticality | Description |
| :---- | :---- | :---- |
| **1\. T\&R Traceability** | **Critical** | Every **Terminal Learning Objective (TLO)** must trace directly to a **T\&R Event** (e.g., 2847-TRM-2002). "Orphan" objectives are unauthorized.12 |
| **2\. ORAW / Safety** | **Safety/Legal** | Every lesson involving physical activity or equipment usage must have an **Operational Risk Assessment Worksheet (ORAW)** signed by the appropriate authority.14 |
| **3\. Resource Validation** | **Logistics** | The POI cannot demand resources (ammunition, ranges, radios) that the schoolhouse does not possess or cannot forecast in the **Training Input Plan (TIP)**.6 |
| **4\. Time Accounting** | **Resource** | The POI must account for every minute of the training day, distinguishing **Academic Hours** (contact) from **Administrative Hours** (chow, transit, gear issue).9 |
| **5\. Target Population** | **Academic** | Prerequisites (rank, clearance, GT score) must align with the actual students arriving (e.g., reading grade level).17 |
| **6\. Assessment Validity** | **Academic** | Test items must measure the *exact* behavior described in the objective. No testing on un-taught material.7 |
| **7\. Copyright / IP** | **Legal** | Content must be cleared for release. Proprietary vendor materials cannot be blindly copied into government curriculum without rights. |
| **8\. Version Control** | **Compliance** | The "Authorized" POI in MCTIMS must match what is currently being taught in the classroom. "Desk drawer" deviations are inspection failures.9 |
| **9\. Bi-Annual Review** | **Governance** | A formal **Course Content Review Board (CCRB)** must be conducted every 2-3 years to validate currency.10 |
| **10\. Approval Chain** | **Authority** | The POI must be signed by the correct General Officer or delegated O-6. Local commanders cannot approve Major changes (e.g., adding days).9 |

## ---

**2\. Governing Directives and Authority Map**

The Marine Corps is a strict hierarchy where authority flows from the Commandant down. For software design, this means business rules are not arbitrary; they are derived from specific Orders. A system that enforces these rules protects the user from "unforced errors" during inspections.

### **The "Iron Triangle" of Curriculum Policy**

Three primary documents govern the vast majority of the workflow. These should be the "System Prompts" for any AI agent designed to assist in this domain:

1. **MCO 1553.1C (Marine Corps Training and Education System):** The strategic constitution of USMC training.1  
2. **MCO 1553.2D (Formal School Management Policy):** The operational bylaws for running a schoolhouse.9  
3. **NAVMC 1553.1A (Marine Corps Instructional Systems Design/Systems Approach to Training and Education Handbook):** The tactical "User Manual" for creating content.7

### **Directive Authority Table**

| Directive / Source | Scope / Domain | Key Requirements for Software Logic | Citation |
| :---- | :---- | :---- | :---- |
| **MCO 1553.1C** | **Strategic Policy** | Defines **SATE** (Systems Approach to Training) as the mandatory methodology. Establishes TECOM as the final authority on standards. Software must use SATE terminology (Analyze, Design, Develop). | 1 |
| **MCO 1553.2D** | **Schoolhouse Ops** | **Crucial:** Defines "Formal School" vs. "Training Detachment." Mandates **CCRB** frequency (3 years). Delegating POI approval to TRNGCMD/MAGTFTC. Defines "High Risk Training" approval levels. | 9 |
| **NAVMC 1553.1A** | **Practitioner Handbook** | **The Bible for Automation.** Provides detailed schemas for POIs, Lesson Plans, Concept Cards. Defines ADDIE steps in granular detail. Software forms should mirror the templates in this handbook. | 7 |
| **NAVMC 3500.14E** | **Aviation T\&R** | Standards for Air Wing personnel. Provides the source data (Core Skills, Mission Skills) for Aviation schools. Highly structured event codes (e.g., ACPM-8000). | 21 |
| **NAVMC 3500.66C** | **Ground Comms T\&R** | Standards for 06xx MOSs (MCCES). Provides source data for communications courses (e.g., Radio Operator). Lists required performance steps and conditions. | 23 |
| **MCO 1553.10** | **MCTIMS Policy** | Mandates **MCTIMS** as the "Authoritative Data Source." Software *must* push/pull from MCTIMS; local spreadsheets are not valid records. | 25 |
| **TECOM Order 5000.1** | **Academic SOP** | TECOM-level standardization. Often contains specific templates for **Academic Instruction Reports (AIRs)** and **After Action Reviews (AARs)**. | 27 |

**Ambiguity Analysis for System Design:**

* **"Approval Authority" vs. "Validation":** MCO 1553.2D delegates POI *approval* to Major Subordinate Commands (MSCs) like Training Command (TRNGCMD). However, TECOM often retains *validation* rights to ensure service-wide standardization. Software must distinguish between "Ready for Signature" (MSC level) and "Service Validated" (TECOM level).9  
* **Version Conflicts:** T\&R Manuals are updated every 3-4 years, while POIs are updated every 2-3 years. This creates a synchronization gap where a school might be teaching to an "old" standard because the "new" curriculum hasn't been approved yet. The software must handle "superseded but active" states without locking out the user.10

## ---

**3\. Roles, Offices, and Decision Rights (RACI-ready)**

In a Marine Corps schoolhouse (e.g., MCCES), roles are strictly defined by rank, billet, and access level within MCTIMS. Understanding the distinction between who *writes* the content and who *accepts the risk* is vital for designing the permission architecture.

### **The Players**

* **Commanding Officer (CO) / Director (O-5/O-6):** The ultimate risk owner. They sign the "Letter of Promulgation" for the curriculum. They are responsible for the safety and quality of training.9  
* **Academics Officer / Director of Training (DoT) (O-4/Civ):** The "Chief Architect." They ensure the curriculum meets the commander's intent and statutory requirements. They often chair the CCRB.10  
* **Curriculum Developer (CurrDev) (E-6/E-7/Civ):** The "Worker Bee." Often a Staff Sergeant or Gunnery Sergeant who is an SME in their MOS but may have limited formal ISD training. They utilize the **MCTIMS CMD Module** to input data. In smaller schools, the Instructor and CurrDev are often the same person.29  
* **Instructor (E-4 to E-6):** The end-user. They deliver the content in the classroom. They cannot change the authorized POI but can "redline" lesson plans for future review. They must be certified per MCO 1553.2D.31  
* **Subject Matter Expert (SME):** An external or internal expert (e.g., a representative from the device manufacturer or a seasoned Master Gunnery Sergeant) who validates technical accuracy.29  
* **TECOM / MSC Desk Officer:** The higher-headquarters reviewer who checks for compliance (e.g., "Did you include the required Sexual Assault Prevention classes?").19

### **RACI Matrix: POI and Lesson Plan Lifecycle**

| Activity | Curriculum Developer | Instructor | SME | Academics Officer / DoT | School CO / Director | TECOM / MSC (Higher HQ) |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| **Define Learning Objectives** | **R** (Drafts) | C | C | **A** | I | I |
| **Draft Lesson Plan** | **R** | C | C | I | I | \- |
| **Draft POI (Hours/Resources)** | **R** | I | I | **A** | I | I |
| **Safety Risk Assessment (ORAW)** | **R** | I | **C** | **A** | **A** (High Risk) | \- |
| **Technical Review** | I | I | **R** | I | \- | \- |
| **Standardization/Format Review** | **R** | \- | \- | **A** | \- | \- |
| **Approve Lesson Plan** | C | I | \- | **R** | **A** | \- |
| **Approve POI (Authorization)** | C | \- | \- | R | **R** | **A** |
| **Publish to MCTIMS** | **R** | \- | \- | A | I | I |

*Key: **R** \= Responsible (doer), **A** \= Accountable (signer), **C** \= Consulted (input), **I** \= Informed (FYI)*

### **Authority Distinctions**

* **Local Lesson Plan Change:** The School CO can approve minor tweaks to a lesson plan (e.g., updating a slide, changing a practical application scenario) *provided* it does not change the Learning Objectives or the Resource Requirements. This allows for agility in the classroom.7  
* **POI Change (Modification):** Any change to **Time** (adding hours), **Resources** (needing more ammo), or **Objectives** (changing the standard) requires **Formal Approval** from the MSC (General Officer level). This is a rigid constraint the software must enforce; a user cannot simply "add a day" to a course without triggering a major workflow.7

## ---

**4\. End-to-End Process: "From Source Material to Authorized Curriculum"**

This section outlines the workflow a "Curriculum Factory" must support. It follows the **SAT (Systems Approach to Training)** model mandated by MCO 1553.1C, expanded with the practical realities of a schoolhouse like MCCES.

### **Phase 1: Analysis (The "Why" and "What")**

Purpose: Determine exactly what needs to be taught versus what is learned on the job.  
Input: T\&R Manuals (NAVMC 3500.xx) 12, Technical Manuals (TMs) 33, Fleet Feedback, New Equipment Fielding Plans.  
Activities:

1. **Trigger Identification:** A new system (e.g., Drone sUAS) is fielded, or a T\&R Manual is updated.34  
2. **Target Population Analysis (TPA):** Define the entering student. (e.g., "Pvt, 18-20 years old, basic rifleman skills, no prior comms knowledge"). This limits the reading grade level of materials.7  
3. **Job Task Analysis (JTA):** Review the T\&R Manual. Select specific "Events" (tasks) that the school is responsible for (coded as "Formal School" in the T\&R).  
   * *Example:* T\&R Event COMM-TRAN-1001: Operate a Radio.  
4. **Task-to-Objective Conversion:** Convert the T\&R Event into a **Terminal Learning Objective (TLO)**. The TLO must mirror the T\&R event but add the specific conditions of the schoolhouse (e.g., "Given a simulation environment...").

Output: Course Descriptive Data (CDD) or Training Course Control Document (TCCD) (Front matter).  
Automation Opportunity: AI can parse T\&R XML/PDFs and automatically draft TLOs, ensuring the "Condition, Standard, and Behavior" syntax is perfect.

### **Phase 2: Design (The "Structure")**

Purpose: Organize the content into a logical sequence and allocate resources.  
Activities:

1. **Sequencing:** Order lessons from simple to complex (e.g., "Intro to Radio Waves" before "Programming the PRC-117G").  
2. **Method & Media Selection:** Decide how to teach.  
   * *Knowledge:* Lecture, Reading.  
   * *Skill:* Demonstration, Practical Application (PracApp).9  
3. **Time Estimation:** Assign "Contact Hours" (instruction) and "Sustainment Hours" (homework/practice).  
4. **Resource Loading:** Map required gear (Radios, Batteries, Computers) to each hour of instruction. This is critical for the **Training Input Plan (TIP)**.6

**Output:** **Program of Instruction (POI)** (The skeleton structure).

### **Phase 3: Development (The "Content")**

Purpose: Create the actual materials used in the classroom.  
Activities:

1. **Lesson Plan Writing:** Draft the Instructor Guide (script).  
   * *Structure:* Gaining Attention \-\> Overview \-\> Body (Main Points) \-\> Interim Summaries \-\> Conclusion.7  
2. **Student Materials:** Create Student Outlines (handouts), Job Sheets (step-by-step guides), and Slide Decks.35  
3. **Assessment Design:** Create written exams and performance checklists (rubrics).  
   * *Constraint:* Test items must map 1:1 to Learning Objectives.

Output: Master Lesson Files (MLF) containing Lesson Plans, Slides, Assessments.  
Automation Opportunity: AI can ingest a Technical Manual (e.g., PRC-117G Manual 33\) and auto-generate the "Performance Steps" for the Instructor Guide, saving hours of typing.

### **Phase 4: Implementation (The "Pilot")**

Purpose: Validate the curriculum in a live environment.  
Activities:

1. **Pilot Course:** Teach the new material to a "validation class".34  
2. **Data Collection:** Record time taken vs. time planned. Collect student feedback (surveys) and instructor feedback.  
3. **Redlining:** Instructors mark up the Lesson Plans with real-time corrections.

**Output:** **Pilot Report** / **Validation Report**.

### **Phase 5: Evaluation (The "Loop")**

Purpose: Continuous improvement and governance.  
Activities:

1. **Course Content Review Board (CCRB):** A formal meeting (required every 2-3 years) to review all data and authorize changes.9  
2. **Sustainment:** Update references. If a Technical Manual changes, the Lesson Plan must be flagged for update.  
3. **Archiving:** Old versions must be retained for legal purposes (e.g., VA benefits verification).

**Output:** **Record of Proceedings (ROP)** from the CCRB.

## ---

**5\. Artifact Deep Dives**

This section provides the "schema" for the two most critical documents: the POI and the Lesson Plan. Software data models should map directly to these fields.

### **5A. Program of Instruction (POI) — Deep Detail**

**Definition:** The POI is the contracting document between the Schoolhouse and the Marine Corps. It authorizes the resources (time, money, people) required to train. It is a **governance document**, not a teaching document. It resides in MCTIMS.9

**Canonical POI Schema (Software Data Model):**

| Section | Fields / Data Elements | Description | Source Trace |
| :---- | :---- | :---- | :---- |
| **Identity** | CID (Course ID), Title, Date, Version | Unique identifier (e.g., M0925U1). | MCTIMS |
| **Preface** | Authority Statement, MCO References | Citations of MCO 1553.1C, etc. | MCO 1553.2D |
| **Course Data** | Purpose, Scope, Target Population, MOS Awarded | High-level mission statement and prerequisites. | NAVMC 1553.1A |
| **Capacity** | Min Class Size, Max Class Size, Optimum, Classes/Year | Defines throughput for TECOM planning. | TIP Guidance 6 |
| **Hours** | Academic Hours (Lec, Dem, PA, Exam), Admin Hours | Detailed breakdown of time. Total must equal Course Length. | NAVMC 1553.1A |
| **Curriculum** | Annexes (Units), Lessons (Titles & Hours) | The structural hierarchy of the course. | SATE |
| **Resources** | Equipment List, Ammo (DODIC), Facilities, Instructor Support | What is needed to teach. Critical for logistics. | TIP / T/E |
| **Safety** | High Risk Codes, Safety Officers Required | Identifies if the course requires special safety oversight. | MCO 5100.29 |

Traceability Rule:  
Requirement (T\&R Event) → TLO (POI Level) → Lesson (POI Annex) → Evaluation.  
Every hour of instruction must account for a specific objective.  
**Revision Control:**

* **Major Change:** Change in Length (\>10%), Resources, or TLOs. **Requires General Officer Approval.**  
* **Minor Change:** Typo corrections, sequence adjustments within the same day. **Local CO Approval.**

### **5B. Lesson Plans / Instructor Guides — Deep Detail**

**Definition:** The "script" used by the instructor. It ensures standardization—so that Private Smith in Class A gets the exact same training as Private Jones in Class B. It is often referred to as the "Master Lesson File" (MLF).7

**Canonical Lesson Plan Schema (Software Data Model):**

1. **Header Data:**  
   * ID: (e.g., LP-COMM-101)  
   * Title: Descriptive name.  
   * Time: Allowed time (e.g., "2.0 Hours").  
   * Method: (e.g., "Lecture / Practical Application").  
   * References: (e.g., "TM 10515-0103").  
2. **Learning Objectives:**  
   * Terminal Learning Objective (TLO): Condition, Behavior, Standard.  
   * Enabling Learning Objectives (ELOs): Sub-steps required to master the TLO.  
3. **Administrative Instructions:**  
   * Instructor Prep: "Ensure batteries are charged."  
   * Media: "Slide Deck 101, Video Clip A."  
4. **Operational Risk Assessment (ORAW):**  
   * Hazards: (e.g., "Electrical Shock," "Heat Stress").  
   * Controls: (e.g., "Remove power source," "Hydration breaks").  
5. **Introduction (The "Gaining Attention"):**  
   * Gain Attention: A hook/story (often scripted).  
   * Overview: What we will cover.  
   * Safety/Cease Training: Emergency signals.  
6. **Body (The Content):**  
   * Main Point 1: Text content \+ Instructor Cues (e.g., "SHOW SLIDE 4").  
   * Transition: Linking sentence.  
   * Interim Summary: Quick recap.  
7. **Practical Application (The "Doing"):**  
   * Scenario: The prompt given to the student.  
   * Practice: Time allotted for students to work.  
   * Enforcement: Instructor actions (circulate and assist).  
8. **Conclusion:**  
   * Summary of Main Points.  
   * Closing Statement.  
   * Immediate Post-Check (quick questions).

### **5C. Nice-to-Have Artifact Summaries**

* **TCCD (Training Course Control Document):** Often synonymous with the front matter of the POI. Contains the "Task Analysis" data showing which tasks were selected for training and which were not (and why)..36  
* **Student Materials (Student Outline/SO):** A condensed version of the Lesson Plan for the student. Contains the "Need to Know" info without the instructor script. **Versioning:** Must match the Lesson Plan version exactly.  
* **Tests/Assessments:** Can be written (multiple choice) or performance (checklist). **Security:** Must be kept separate from student materials. Items must link to specific ELOs.

## ---

**6\. Policy vs. Practice Comparison**

This analysis is critical for software adoption. If the software enforces "Policy" too strictly, it will be rejected by users who are used to "Practice." The system must support the *reality* while guiding users toward *compliance*.

| Lifecycle Stage | Column A: Directive Requirement (Policy) | Column B: Schoolhouse Common Practice (Reality) | Software Design Risk/Implication |
| :---- | :---- | :---- | :---- |
| **Trigger** | Update curriculum immediately upon release of new T\&R Manual. | Schools wait for the formal **CCRB** (every 3 years) to do a bulk update to avoid constant paperwork.10 | **High.** Software should allow "Pending T\&R Update" flags without forcing immediate curriculum invalidation. |
| **SME Review** | Formal sign-off by external SMEs/Advocates. | Internal "SME" (usually a senior instructor) reviews it. External review is rare/skipped due to time. | **Medium.** Enable internal workflow routing but keep external review as an optional "Gold Standard" gate. |
| **Lesson Files** | Full "Master Lesson File" with script, cues, and detailed text.7 | Instructors teach from PowerPoint notes or "Tribal Knowledge." LPs are only updated for inspections. | **High.** **AI is critical here.** Use AI to auto-generate the boring "Script" part from the PPT content so LPs stay compliant with zero effort. |
| **TLO Derivation** | Rigorous JTA process mapping behaviors to standards. | "Copy/Paste" from the T\&R Manual directly, even if the T\&R isn't written as a learning objective. | **Medium.** Build a "T\&R Importer" that auto-formats T\&R tasks into TLO syntax (Condition/Standard). |
| **Approvals** | MSC/General Officer approval for POI changes.19 | Local CO "approves" changes via memo; formal MCTIMS update happens years later. | **Critical.** Create a "Local Modification" state that tracks changes *before* they are pushed to the formal MSC workflow. |
| **Resources** | POI lists exact ammo/gear requirements. | Resource lists are often outdated "wish lists" vs. what is actually in the supply room. | **Low.** Integrate with a "Resource Inventory" to show *Delta* between Required vs. On-Hand. |
| **MCTIMS Usage** | All data entered directly into MCTIMS modules. | Users work offline in Word/Excel and bulk-upload or manually type data at the last minute.5 | **Critical.** The software must act as a "Wrapper" or "IDE" for curriculum, exporting to MCTIMS only when finished. |

## ---

**7\. Automation Blueprint for AI Tooling**

This section translates the USMC domain into specific software requirements for an "AI Curriculum Factory."

### **7A. Workflow Model (State Machine)**

The software should model the curriculum artifact lifecycle as a state machine.

**States:**

1. **Draft:** Private to the author (AI or Human).  
2. **In Review:** Locked for editing; open for comments (SME, Safety, Standardization).  
3. **Validated:** Passed internal review (Schoolhouse Director).  
4. **Submitted:** Sent to Higher HQ (MSC/TECOM) for approval (MCTIMS integration point).  
5. **Authorized (Active):** Signed and legally teachable.  
6. **Superseded:** Replaced by a newer version (Archived).  
7. **Suspended:** Pulled due to safety incident or directive.

**Roles/Permissions:**

* *Editor (CurrDev):* Can move Draft → In Review.  
* *Reviewer (SME/Safety):* Can Comment; can move In Review → Draft (Reject) or Validated (Accept).  
* *Approver (Director/TECOM):* Can move Validated → Authorized.

### **7B. Data Model & Artifact Graph**

The system should utilize a graph database to maintain complex traceability.

**Entities:**

* **Course** (Attributes: CID, Title, Owner Unit)  
  * *Has Many:* **Versions**  
* **Version** (Attributes: Effective Date, Status)  
  * *Has One:* **POI**  
  * *Has Many:* **Units/Annexes**  
* **Lesson** (Attributes: Title, Hours, Method)  
  * *Has Many:* **Objectives** (TLO/ELO)  
  * *Has Many:* **Resources**  
  * *Has One:* **Risk Assessment (ORAW)**  
  * *Has One:* **Instructor Guide** (Blob/Text)  
* **T\&R Event** (Source of Truth)  
  * *Linked To:* **Objective** (Many-to-Many traceability)

**Traceability Logic:** If a T\&R Event is modified (via external API update), the system queries the graph for all linked Objectives and flags the parent Lesson and Course as "At Risk / Review Needed."

### **7C. RAG / Vector Database Strategy**

To enable an "AI Curriculum Assistant," populate the Vector Database with high-value source text.

**Embeddings:**

1. **Directives:** MCO 1553.1C, NAVMC 1553.1A, MCO 1553.2D (The Rules).  
2. **Source Material:** Technical Manuals, Field Manuals, T\&R Manuals (The Content).  
3. **Legacy Curriculum:** Old POIs/LPs (for style/structure mimicking).

**Chunking Strategy:**

* **Directives:** Chunk by Paragraph/Chapter. Metadata: Source: MCO 1553.1C, Topic: Safety.  
* **Tech Manuals:** Chunk by "Task" or "Procedure." Metadata: Equipment: PRC-117G, Action: Programming.  
* **Guardrails:** The AI must value **Primary Directives** (MCO) over **Practice** (Legacy LPs). If the Legacy LP says "Do X" but MCO says "Do Y", the AI must prioritize Y.

### **7D. AI Task Decomposition**

| Artifact Component | AI Capability | Human Requirement | Validation Check |
| :---- | :---- | :---- | :---- |
| **TLO/ELO Drafting** | **High.** Can parse T\&R event and generate Bloom's Taxonomy objectives. | Review for nuance/context. | Syntax check (Condition/Standard present?). |
| **Lesson Outline** | **High.** Can generate standard Intro/Body/Conclusion structure. | Verify flow and logic. | Time estimation check. |
| **Performance Steps** | **High.** Can extract steps directly from OCR'd Technical Manuals. | **Critical.** Verify accuracy against actual device. | Source citation check (Page \#). |
| **Safety/ORAW** | **Medium.** Can suggest common hazards based on keywords (e.g., "Electricity"). | **Mandatory.** A human must sign off on risk. AI cannot accept liability. | Check against "High Risk" list. |
| **Practical App Scenarios** | **Medium.** Can invent scenarios ("You are in a desert environment..."). | Refine for tactical realism. | Resource check (Do we have desert gear?). |
| **Test Items** | **High.** Can generate multiple choice questions from text. | Verify answer keys and lack of ambiguity. | Alignment check (Does Q match TLO?). |

## ---

**8\. Step-by-Step Example Walkthrough**

**Scenario:** Create a compliant Lesson Plan for the **PRC-117G Radio**, specifically the task "Program a Single Channel Frequency."

**1\. Trigger:**

* **Input:** NAVMC 3500.66 (Ground Electronics T\&R Manual).23  
* **Event Found:** 2847-TRM-2002: Perform Multiband Radio Operations.  
* **Technical Manual:** TM 10515-0103 (Harris PRC-117G Ops Manual).33

**2\. Analysis (AI Assisted):**

* *User Prompt:* "Create a Terminal Learning Objective (TLO) for T\&R Event 2847-TRM-2002 focusing on Single Channel programming."  
* *AI Output:*  
  * **TLO:** "Given a PRC-117G radio, a frequency assignment, and a fill device, program a single channel frequency to establish communications, within 5 minutes, in accordance with TM 10515-0103."  
  * *Analysis:* AI identifies "Condition" (Radio, Freq), "Behavior" (Program), "Standard" (5 mins, per TM).

**3\. Design (POI Level):**

* *Decision:* This is complex. Needs "Explanation" (Lecture), "Demonstration" (Instructor shows), and "Practical Application" (Student does).  
* *Time Allocation:*  
  * Lecture: 0.5 Hrs  
  * Demo: 0.5 Hrs  
  * Prac App: 1.0 Hrs  
  * **Total Lesson:** 2.0 Hrs.  
  * *Note:* Software ensures this 2.0 hrs is added to the "Academic Hours" bucket of the POI.

**4\. Development (Lesson Plan Generation):**

* *User Prompt:* "Draft a Lesson Plan Body for programming the PRC-117G using the provided Technical Manual PDF. Use 'Demonstration-Performance' method."  
* *AI Output (Draft):*  
  * **Main Point 1:** Power Up Procedures. (Source: TM pg 45).  
    * *Instructor Note:* Ensure battery is seated.  
  * **Main Point 2:** Menu Navigation. (Source: TM pg 48).  
    * *Step 1:* Press 'PGM'.  
    * *Step 2:* Select 'NORMAL'.  
    * *Step 3:* Enter Frequency.  
  * **Practical Application Setup:** "Assign students in pairs. Provide one radio per pair. Frequency to program: 35.500 MHz."

**5\. Safety Check (Automated Guardrail):**

* *System Scan:* Detects "Battery" and "Antenna".  
* *Alert:* "Safety Hazard Detected: RF Burns from Antenna. Please add 'RF Safety Warning' to ORAW and Lesson Plan Intro.".37

**6\. Approval & Logging:**

* **CurrDev** reviews the AI draft. Adjusts the "35.500 MHz" to a specific training frequency allowed on base range control.  
* **Academics Officer** reviews TLO alignment.  
* **Status:** "Validated."  
* **Log:** User: SgtMaj Smith | Action: Approved LP-COMM-101 | Date: 2026-01-07.

## ---

**9\. Citations, Evidence, and Confidence**

**Confidence Score:** **High**. The process described is grounded in primary directives (MCO 1553 series) which are publicly available and authoritative. The distinction between "Policy" and "Practice" is based on standard military instructional design constraints and documented user feedback from public forums.

### **Appendix: Key Source Documents**

* 1  
  *MCO 1553.1C*: Marine Corps Training and Education System. (Primary SAT Policy).  
* 9  
  *MCO 1553.2D*: Formal School Management Policy. (Schoolhouse governance).  
* 7  
  *NAVMC 1553.1A*: Marine Corps Instructional Systems Design/Systems Approach to Training and Education Handbook. (The "How-To" guide).  
* 25  
  *MCO 1553.10*: MCTIMS SOP. (IT System Policy).  
* 23  
  *NAVMC 3500.66C*: EOD/Comms T\&R Manual. (Source data for example).  
* 27  
  *TECOM Order 5000.1*: Academic SOP (Example of lower-level SOP).  
* 38  
  *xAPI Resources*: Advanced Distributed Learning (ADL) xAPI Overview. (Future state standards).

### **Glossary**

* **ADDIE:** Analyze, Design, Develop, Implement, Evaluate.  
* **CCRB:** Course Content Review Board.  
* **CID:** Course Identifier.  
* **ISR:** Instructor-to-Student Ratio.  
* **MCTIMS:** Marine Corps Training Information Management System.  
* **MLF:** Master Lesson File.  
* **POI:** Program of Instruction.  
* **SAT:** Systems Approach to Training.  
* **T\&R:** Training and Readiness.  
* **TLO/ELO:** Terminal/Enabling Learning Objective.

#### **Works cited**

1. MCO 1553.1C\_Final Signed \- Marines.mil, accessed January 7, 2026, [https://www.marines.mil/Portals/1/Publications/MCO%201553.1C%20(SECURED).pdf?ver=zeU9C00UDkX47qLV7vl1Dg%3D%3D](https://www.marines.mil/Portals/1/Publications/MCO%201553.1C%20\(SECURED\).pdf?ver=zeU9C00UDkX47qLV7vl1Dg%3D%3D)  
2. Marine Corps Mctims \- Latest Viral News, accessed January 7, 2026, [https://a11y.pearson.com/news/marine-corps-mctims](https://a11y.pearson.com/news/marine-corps-mctims)  
3. MCTIMS | USMC Officer, accessed January 7, 2026, [https://www.usmcofficer.com/mctims](https://www.usmcofficer.com/mctims)  
4. What is MCTIMS and how can it fuck me over? : r/USMCboot \- Reddit, accessed January 7, 2026, [https://www.reddit.com/r/USMCboot/comments/zpt58r/what\_is\_mctims\_and\_how\_can\_it\_fuck\_me\_over/](https://www.reddit.com/r/USMCboot/comments/zpt58r/what_is_mctims_and_how_can_it_fuck_me_over/)  
5. Using MCTIMS comes at a price : r/USMC \- Reddit, accessed January 7, 2026, [https://www.reddit.com/r/USMC/comments/1fxh5a7/using\_mctims\_comes\_at\_a\_price/](https://www.reddit.com/r/USMC/comments/1fxh5a7/using_mctims_comes_at_a_price/)  
6. GUIDANCE FOR FISCAL YEAR 2027 \- 2031 TRAINING INPUT PLAN DEVELOPMENT CYCLE \> United States Marine Corps Flagship \> Messages Display, accessed January 7, 2026, [https://www.marines.mil/News/Messages/Messages-Display/Article/3965388/guidance-for-fiscal-year-2027-2031-training-input-plan-development-cycle/](https://www.marines.mil/News/Messages/Messages-Display/Article/3965388/guidance-for-fiscal-year-2027-2031-training-input-plan-development-cycle/)  
7. navmc 1553.1a \- Marines.mil, accessed January 7, 2026, [https://www.marines.mil/portals/1/Publications/NAVMC%201553.1A.pdf?ver=2017-01-09-072054-373](https://www.marines.mil/portals/1/Publications/NAVMC%201553.1A.pdf?ver=2017-01-09-072054-373)  
8. navedtra m-142.3 \- Naval Education and Training Command \- NETC, accessed January 7, 2026, [https://www.netc.navy.mil/Portals/46/NETC/manual/M1423.pdf?ver=c\_9Fpq2qj0iQ4xekqYRM8g%3D%3D](https://www.netc.navy.mil/Portals/46/NETC/manual/M1423.pdf?ver=c_9Fpq2qj0iQ4xekqYRM8g%3D%3D)  
9. MCO 1553.2D Admin CH-1 (SECURED) \- Marines.mil, accessed January 7, 2026, [https://www.marines.mil/Portals/1/Publications/MCO%201553.2D%20Admin%20CH-1%20(SECURED).pdf?ver=jnKJycREO4iil5GxCxaryg%3D%3D](https://www.marines.mil/Portals/1/Publications/MCO%201553.2D%20Admin%20CH-1%20\(SECURED\).pdf?ver=jnKJycREO4iil5GxCxaryg%3D%3D)  
10. Curriculum Review Process Functional Lead: VPAA Division: ASD Responsible Office \- Marine Corps University, accessed January 7, 2026, [https://www.usmcu.edu/Portals/218/SchoolFiles/New%20Regs%202020/Curriculum%20and%20Assessment/03-Curriculum%20Review%20Process.pdf](https://www.usmcu.edu/Portals/218/SchoolFiles/New%20Regs%202020/Curriculum%20and%20Assessment/03-Curriculum%20Review%20Process.pdf)  
11. Curriculum Review Process Functional Lead: Provost Division: Academic Support Division Responsible Office \- Marine Corps University, accessed January 7, 2026, [https://www.usmcu.edu/Portals/218/11%20Curriculum%20Review%20Process.pdf](https://www.usmcu.edu/Portals/218/11%20Curriculum%20Review%20Process.pdf)  
12. NAVMC 3500.36A OPERATIONS AND TACTICS INSTRUCTOR TRAINING AND READINESS MANUAL (SHORT TITLE \- Marines.mil, accessed January 7, 2026, [https://www.marines.mil/portals/1/Publications/NAVMC%203500.36A.pdf?ver=2012-10-11-164000-827](https://www.marines.mil/portals/1/Publications/NAVMC%203500.36A.pdf?ver=2012-10-11-164000-827)  
13. NAVMC 3500.106A.pdf \- Marines.mil, accessed January 7, 2026, [https://www.marines.mil/Portals/1/Publications/NAVMC%203500.106A.pdf?ver=lXA7C1WsQPHCSgjJB\_96AA%3D%3D](https://www.marines.mil/Portals/1/Publications/NAVMC%203500.106A.pdf?ver=lXA7C1WsQPHCSgjJB_96AA%3D%3D)  
14. INSTRUCTOR GUIDE \- Training Command, accessed January 7, 2026, [https://www.trngcmd.marines.mil/Portals/207/Docs/wtbn/MPMS/0300-M16-1013\_DEMONSTRATE\_SHORT\_RANGE\_ENGAGEMENT\_SKILLS\_DAY.pdf?ver=2015-06-15-121453-077](https://www.trngcmd.marines.mil/Portals/207/Docs/wtbn/MPMS/0300-M16-1013_DEMONSTRATE_SHORT_RANGE_ENGAGEMENT_SKILLS_DAY.pdf?ver=2015-06-15-121453-077)  
15. MCO 1553.2B \- Training and Education Command \- Marines.mil, accessed January 7, 2026, [https://www.tecom.marines.mil/Portals/90/EEIC/EEIC%20CCRB/CCRB\_1341/MCO%201553.2B%20sign%2020Apr2011.doc.pdf](https://www.tecom.marines.mil/Portals/90/EEIC/EEIC%20CCRB/CCRB_1341/MCO%201553.2B%20sign%2020Apr2011.doc.pdf)  
16. GUIDANCE FOR FISCAL YEAR 2028 \- 2032 TRAINING INPUT PLAN DEVELOPMENT CYCLE \> United States Marine Corps Flagship \> Messages Display, accessed January 7, 2026, [https://www.marines.mil/News/Messages/Messages-Display/Article/4326697/guidance-for-fiscal-year-2028-2032-training-input-plan-development-cycle/](https://www.marines.mil/News/Messages/Messages-Display/Article/4326697/guidance-for-fiscal-year-2028-2032-training-input-plan-development-cycle/)  
17. Mco 1553.1B PDF | PDF | United States Marine Corps | Recruit Training \- Scribd, accessed January 7, 2026, [https://www.scribd.com/document/215026473/MCO-1553-1B-pdf](https://www.scribd.com/document/215026473/MCO-1553-1B-pdf)  
18. STUDENT OUTLINE \- Officer Candidates School, accessed January 7, 2026, [https://www.ocs.marines.mil/Portals/243/OCS%20Student%20Outline.pdf?ver=6KZluTYgC-8SJpS4pIKZ\_g%3D%3D](https://www.ocs.marines.mil/Portals/243/OCS%20Student%20Outline.pdf?ver=6KZluTYgC-8SJpS4pIKZ_g%3D%3D)  
19. navmc 1553.2a tecom psd \- Marines.mil, accessed January 7, 2026, [https://www.marines.mil/Portals/1/Publications/NAVMC%201553.2A.pdf?ver=uSnDpz2KbftlhC8Fk0OzOA%3D%3D](https://www.marines.mil/Portals/1/Publications/NAVMC%201553.2A.pdf?ver=uSnDpz2KbftlhC8Fk0OzOA%3D%3D)  
20. NAVMC 1553.1A \> United States Marine Corps Flagship \> Electronic Library Display, accessed January 7, 2026, [https://www.marines.mil/News/Publications/MCPEL/Electronic-Library-Display/Article/1044650/navmc-15531a-cancels-navmc-15531/](https://www.marines.mil/News/Publications/MCPEL/Electronic-Library-Display/Article/1044650/navmc-15531a-cancels-navmc-15531/)  
21. NAVMC 3500.14E Change 1.pdf \- Marines.mil, accessed January 7, 2026, [https://www.marines.mil/Portals/1/Publications/NAVMC%203500.14E%20Change%201.pdf](https://www.marines.mil/Portals/1/Publications/NAVMC%203500.14E%20Change%201.pdf)  
22. Aircrew Training Program, accessed January 7, 2026, [https://media.defense.gov/2022/Feb/11/2002938059/-1/-1/0/AIRCREW%20TRAINING%20PROGRAM%20(3500.14)%202025.DOCX](https://media.defense.gov/2022/Feb/11/2002938059/-1/-1/0/AIRCREW%20TRAINING%20PROGRAM%20\(3500.14\)%202025.DOCX)  
23. NAVMC 3500.66C \> United States Marine Corps Flagship \> Electronic Library Display, accessed January 7, 2026, [https://www.marines.mil/News/Publications/MCPEL/Electronic-Library-Display/Article/1462265/navmc-350066c/](https://www.marines.mil/News/Publications/MCPEL/Electronic-Library-Display/Article/1462265/navmc-350066c/)  
24. DEPARTMENT OF THE NAVY NAVMC 3500.66C C 466 12 Jul 17 NAVMC 3500.66C From: Commandant of the Marine Corps To, accessed January 7, 2026, [https://www.marines.mil/portals/1/Publications/NAVMC%203500.66C%20canx%203500.66B.pdf?ver=2018-03-09-105125-070](https://www.marines.mil/portals/1/Publications/NAVMC%203500.66C%20canx%203500.66B.pdf?ver=2018-03-09-105125-070)  
25. MCO 1553.10 \> United States Marine Corps Flagship \> Electronic Library Display, accessed January 7, 2026, [https://www.marines.mil/News/Publications/MCPEL/Electronic-Library-Display/Article/900395/mco-155310/](https://www.marines.mil/News/Publications/MCPEL/Electronic-Library-Display/Article/900395/mco-155310/)  
26. MARINE CORPS TRAINING INFORMATION MANAGEMENT SYSTEM (MCTIMS) STANDING OPERATING PROCEDURES (SOP), accessed January 7, 2026, [https://www.marines.mil/portals/1/Publications/MCO%201553.10.pdf](https://www.marines.mil/portals/1/Publications/MCO%201553.10.pdf)  
27. Sexual Assault Prevention and Response SOP \- Training and Education Command, accessed January 7, 2026, [https://www.tecom.marines.mil/Portals/90/HQBN/Directives/Sexual%20Assault%20Prevention%20and%20Response%20SOP-18%20May%2022.pdf](https://www.tecom.marines.mil/Portals/90/HQBN/Directives/Sexual%20Assault%20Prevention%20and%20Response%20SOP-18%20May%2022.pdf)  
28. Policy Letters & Statements \- Training and Education Command, accessed January 7, 2026, [https://www.tecom.marines.mil/Units/Headquarters-Battalion/Policy-Letters-Statements/](https://www.tecom.marines.mil/Units/Headquarters-Battalion/Policy-Letters-Statements/)  
29. Curriculum Developer (Contingent Upon Contract Award) at ARETUM Holdings LLC | Jobs and Employment | JobTarget, accessed January 7, 2026, [https://www.jobtarget.com/jobs/jt-s08sqdl9gb/curriculum-developer-contingent-upon-contract-award-bethesda-maryland](https://www.jobtarget.com/jobs/jt-s08sqdl9gb/curriculum-developer-contingent-upon-contract-award-bethesda-maryland)  
30. Curriculum Developer Job Description \- AJAC: Advanced Manufacturing Apprenticeships, accessed January 7, 2026, [http://www.ajactraining.org/wp-content/uploads/AJAC-Curriculum-Developer-Job-Description.pdf](http://www.ajactraining.org/wp-content/uploads/AJAC-Curriculum-Developer-Job-Description.pdf)  
31. 0952 \- Formal School Officer Instructor \- MOS roadmap, accessed January 7, 2026, [https://mosroadmap.com/mos/0952/](https://mosroadmap.com/mos/0952/)  
32. 0961 \- Staff Noncommissioned Officer Academy Faculty Advisor \- MOS roadmap, accessed January 7, 2026, [https://mosroadmap.com/mos/0961/](https://mosroadmap.com/mos/0961/)  
33. Manual Harris AN \- PRC-117G \- English | PDF \- Scribd, accessed January 7, 2026, [https://www.scribd.com/document/705708177/Manual-Harris-AN-PRC-117G-English](https://www.scribd.com/document/705708177/Manual-Harris-AN-PRC-117G-English)  
34. USMC Releases Message Regarding Approved Training Requirements for Small Unmanned Aerial Systems, accessed January 7, 2026, [https://soldiersystems.net/2026/01/01/usmc-releases-message-regarding-approved-training-requirements-for-small-unmanned-aerial-systems/](https://soldiersystems.net/2026/01/01/usmc-releases-message-regarding-approved-training-requirements-for-small-unmanned-aerial-systems/)  
35. Instructions for using the Training Resource Module in MCTIMS, accessed January 7, 2026, [https://www.trngcmd.marines.mil/Portals/207/Docs/wtbn/Instructions%20for%20using%20the%20Training%20Resource%20Module.pdf](https://www.trngcmd.marines.mil/Portals/207/Docs/wtbn/Instructions%20for%20using%20the%20Training%20Resource%20Module.pdf)  
36. TRAINING COURSE CONTROL DOCUMENT FOR GENERAL SHIPBOARD FIRE FIGHTING (SCBA) A-495-0416 PREPARED FOR SWOSCOLCOM NEWPORT, RI PREPA \- AWS, accessed January 7, 2026, [https://imlive.s3.amazonaws.com/Federal%20Government/ID188385991803087867845069046010487785895/Attachment%206%20(TCCD)%20A-495-0416.pdf](https://imlive.s3.amazonaws.com/Federal%20Government/ID188385991803087867845069046010487785895/Attachment%206%20\(TCCD\)%20A-495-0416.pdf)  
37. AN/PRC-117G, accessed January 7, 2026, [http://www.radiomanual.info/schemi/Surplus\_NATO/AN-PRC-117G\_Harris\_user\_2014.pdf](http://www.radiomanual.info/schemi/Surplus_NATO/AN-PRC-117G_Harris_user_2014.pdf)  
38. Accelerating the Development of Small Unit Decision Making (ADSUDM) \- SAM.gov, accessed January 7, 2026, [https://sam.gov/opp/470bd8ee891494c97dc98738b470fac0/view](https://sam.gov/opp/470bd8ee891494c97dc98738b470fac0/view)  
39. xAPI (Experience API) Overview, accessed January 7, 2026, [https://xapi.com/overview/](https://xapi.com/overview/)