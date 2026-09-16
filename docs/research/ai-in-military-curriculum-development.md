# **Modernizing Marine Corps Curriculum Development: A Joint Systems Approach and AI Integration Strategy for MCCES**

## **Refinement Instructions Summary**

### **Understanding of Research Goals**

This report is designed to serve two primary functions for the leadership of the Marine Corps Communication-Electronics School (MCCES) and Training and Education Command (TECOM). First, it establishes an exhaustive baseline of the current "As-Is" curriculum development ecosystem, mapping the complex web of Joint, DoD, and Service-level regulations that govern how a Marine is trained. This section uses MCCES as the primary case study to illustrate the practical application of the Systems Approach to Training (SAT) and the ADDIE (Analyze, Design, Develop, Implement, Evaluate) model. Second, the report pivots to a forward-looking "To-Be" state, proposing a concrete, legally compliant playbook for integrating Generative AI (GenAI) into this lifecycle. The analysis balances the rigorous compliance requirements of **MCO 1553.1C** and **MCO 1553.2D** with the emerging opportunities presented by **NAVMC 5239.1** (Guidance on Generative AI).

### **Gaps, Limitations, and Handling of Sources**

* **Classification:** The report relies exclusively on open-source intelligence (OSINT). While MCCES deals heavily with classified cryptographic systems and electronic warfare (EW) tactics, this report focuses on the *process* of curriculum development using unclassified examples (e.g., generic radio operations). Specific classified workflows (e.g., JWICS-based curriculum management) are inferred based on standard information security practices but not explicitly detailed.  
* **Regulatory Currency:** The transition from legacy orders (1553.1B/2B) to current orders (1553.1C/2D) creates a landscape where some lower-level standing operating procedures (SOPs) may still reference outdated doctrine. This report prioritizes the **current signed orders** (1553.1C/2D) as the definitive authority, noting where legacy practices likely persist due to institutional inertia.  
* **Source Conflicts:** Where discrepancies exist between Joint doctrine (often theoretical) and Service execution (practical constraints), the report defaults to the specific USMC directives (**NAVMC 1553.1A** and **MCO 1553.2D**) which hold immediate jurisdiction over MCCES.

# ---

**Part I – Structured Report for Senior MCCES / USMC Leaders**

### **1\. Executive Summary**

This detailed analysis maps the regulatory and procedural landscape of curriculum development at the Marine Corps Communication-Electronics School (MCCES) and identifies strategic opportunities for Artificial Intelligence (AI) integration. Current as of December 2025, the report synthesizes guidance from the Department of Defense (DoD), Joint Chiefs of Staff (CJCS), and Headquarters Marine Corps (HQMC).

**Strategic Findings:**

* **Regulatory Pivot to Agility:** The Marine Corps has completed a significant doctrinal update with **MCO 1553.1C** (Training and Education System) and **MCO 1553.2D** (Formal School Management). These orders fundamentally shift authority from centralized headquarters to Major Subordinate Commands (MSCs) like Training Command, enabling faster curriculum validation. This delegation is the critical enabler for rapid AI adoption.  
* **The ADDIE Anchor:** Despite modernization efforts, the **Systems Approach to Training (SAT)**—codified in **NAVMC 1553.1A**—remains the legally required framework for all training. While robust, the manual execution of its five phases (Analyze, Design, Develop, Implement, Evaluate) is the primary source of latency, often requiring 12–18 months to fully update a Program of Instruction (POI) following a technical change.  
* **The Data Bottleneck:** The critical friction point in the MCCES lifecycle is the translation of unstructured data (Technical Manuals, T\&R Manuals, Fleet Feedback) into structured curriculum artifacts (Learning Objectives, Master Lesson Files, Assessment Items). This process is currently dependent on a shrinking pool of uniformed Subject Matter Experts (SMEs), creating a bottleneck that throttles readiness.  
* **AI as a Force Multiplier:** Current Generative AI technologies, specifically Large Language Models (LLMs), possess the capability to automate the "administrative friction" of the SAT process. AI tools can ingest unclassified technical data to draft Job Task Analyses, Learning Objectives, and Assessments, effectively shifting the SME’s role from "content creator" to "content validator."  
* **Governance and "Distrust":** The release of **NAVMC 5239.1** (December 2024\) establishes a "Distrust and Verify" doctrine for AI. This policy prohibits blind automation but explicitly authorizes and encourages the formation of **AI Task Forces** to pilot these technologies under strict human supervision. MCCES leadership must establish this governance structure immediately to legally leverage AI capabilities.

### ---

**2\. Joint and DoD-Level Curriculum Framework**

The curriculum development process at MCCES is not an isolated service activity; it is the downstream execution of a massive, interconnected Joint training architecture. Understanding the constraints placed on MCCES requires tracing the "DNA" of a lesson plan back to its DoD-level origins. The overriding philosophy is the **Systems Approach to Training (SAT)**, a methodology designed to ensure that every hour of instruction serves a validated military requirement.

#### **2.1 The Systems Approach to Training (SAT) and ADDIE**

The SAT is the comprehensive methodology mandated by the DoD to manage the total training lifecycle. It is realized through the **ADDIE model**, a cyclic process that provides the audit trail for all military training. If a Marine is injured due to poor training, or if a unit fails in combat, the ADDIE documentation provides the forensic evidence of what was taught, how it was validated, and why.

* **Analyze (The "Why"):** This phase determines the *need* for training. It begins with the **Job Task Analysis (JTA)**, where analysts dissect a specific job (e.g., MOS 0621 Transmissions System Operator) to identify every duty and task performed in the fleet. This phase distinguishes between tasks that must be taught in a formal school (MCCES) versus those learned on the job (Managed On-the-Job Training, or MOJT).  
  * *Key Output:* The **Task List**, which feeds the Training and Readiness (T\&R) Manual.  
* **Design (The "Blueprint"):** Once tasks are identified, the Design phase translates them into educational structures. This involves creating **Learning Objectives (LOs)**, which consist of a Condition, Behavior, and Standard (e.g., "Given a radio... establish communications... within 5 minutes"). It also defines the **Target Population Description (TPD)**—analyzing the entry-level skills of the students (e.g., ASVAB scores, math literacy) to tailor instruction.  
  * *Key Output:* The **Program of Instruction (POI)** and **Course Descriptive Data (CDD)**.  
* **Develop (The "Material"):** This is the production phase. Curriculum developers create the actual courseware: **Master Lesson Files (MLFs)**, **Student Handouts**, **Slide Decks**, **Practical Application (PracApp) Sheets**, and **Test Items**. This phase consumes the most man-hours, requiring deep SME involvement to ensure technical accuracy against Technical Manuals (TMs).  
  * *Key Output:* The complete **Lesson Package** ready for the podium.  
* **Implement (The "Delivery"):** The execution of training in the schoolhouse. This includes **Instructor Preparation**, **Pilot Courses** (for new curriculum), and the actual instruction. It is governed by strict standardization to ensure that Class 1-25 receives the exact same training standard as Class 2-25.  
  * *Key Output:* Trained Marines and **Student Academic Records**.  
* **Evaluate (The "Check"):** The quality assurance loop. It operates on three levels:  
  * *Internal:* Student surveys and test failure rates (Level 1 & 2).  
  * *External:* Feedback from the Fleet Marine Force (FMF) on how graduates perform in their units (Level 3).  
  * *Key Output:* **Course Content Review Board (CCRB)** minutes and **Validation Reports**.

#### **2.2 Key Joint Directives and Their Impact**

The following directives create the "ceiling and floor" for MCCES curriculum:

| Directive | Title | Issuing Authority | Current Status | Operational Impact on MCCES Curriculum |
| :---- | :---- | :---- | :---- | :---- |
| **DoDI 1322.26** | *Distributed Learning* | DoD (P\&R) | **Current** (w/ Change 1\) | Mandates the use of the **Total Learning Architecture (TLA)**. Requires MCCES to ensure all digital curriculum is interoperable (xAPI/SCORM standards). It pushes for training to be accessible "at the point of need," challenging the traditional "resident-only" model.1 |
| **DoDI 1322.20** | *Development and Management of Interactive Courseware (ICW)* | DoD (P\&R) | **Current** | Sets the standards for computer-based training (CBT) and simulations. Critical for MCCES as it relies heavily on virtual radio simulators (e.g., DVTE) to offset equipment shortages. |
| **CJCSI 1800.01F** | *Officer Professional Military Education Policy (OPMEP)* | CJCS | **Current** (2020/2024) | While focused on PME, it establishes **Joint Learning Areas (JLAs)**. For MCCES officers (0602s/5902s), this requires curriculum to explicitly link technical skills to **Joint Interoperability**. A Marine radio operator must understand how their network integrates with Army and Navy systems.3 |
| **CJCSM 3500.04** | *Universal Joint Task Manual (UJTL)* | CJCS | **Current** | The library of all Joint Tasks. MCCES curriculum tasks often map upstream to these UJTLs, ensuring that a Marine Communications Battalion can support a Joint Task Force commander. |

#### **2.3 The DoD-Standard Curriculum Lifecycle**

The lifecycle is a continuous feedback loop rather than a linear path.

1. **Trigger:** A change in Doctrine (e.g., EABO), Equipment (e.g., New MUOS Satellite), or Organization (e.g., Force Design).  
2. **Needs Assessment:** Is this a training problem? (Or is it bad gear/bad leadership?)  
3. **Analysis:** Define the gap. Update the Job Task List.  
4. **Resourcing:** The **Training Input Plan (TIP)** conference determines how many seats are needed and funding is allocated via the POM (Program Objective Memorandum).  
5. **Development (SAT/ADDIE):** Build the content.  
6. **Validation:** Test the content on a sample group.  
7. **Sustainment:** Routine reviews (Surveillance) to maintain currency.

### ---

**3\. USMC / TECOM Curriculum Development and MCCES’ Place in It**

While the DoD provides the framework, the **USMC Training and Education Command (TECOM)** provides the specific regulations and authority. The recent shift in USMC doctrine—driven by **Force Design** and the need for **21st Century Learning**—has fundamentally altered how schools are managed.

#### **3.1 Organizational Hierarchy and Governance**

MCCES occupies a specific node within the training enterprise:

* **Commandant of the Marine Corps (CMC):** Ultimate authority for Service training.  
* **DC, Combat Development & Integration (CD\&I):** The "Requirements Owner." They decide *what* capabilities the Marine Corps needs (e.g., "We need to communicate securely in a GPS-denied environment"). They sponsor the **Occupational Fields (OccFlds)**.  
* **DC, Information (DC I):** The specific advocate for the Communications (06xx), Maintenance (28xx), and Cyber fields. They own the **Training and Readiness (T\&R) Manuals** relevant to MCCES.  
* **CG, TECOM (Training and Education Command):** The "Training Owner." Responsible for the policies and standards of the training system.  
* **CG, Training Command (TRNGCMD):** The "Schoolhouse Owner." Directly supervises MCCES. The MCCES Commanding Officer (O-6) reports to the CG, TRNGCMD (O-7/O-8).  
* **MCCES:** The execution arm. Divided into schools (e.g., Communication-Electronics Maintenance School, Operational Communications School) which are further divided into courses.

#### **3.2 The "Big Three" USMC Regulations**

Curriculum development at MCCES is governed by three primary documents. Understanding the interplay between these is essential for any modernization effort.

**1\. MCO 1553.1C: The Marine Corps Training and Education System (Dec 2024\)** 5

* **Core Concept:** This order defines the "Standards-Based" nature of USMC training. It mandates that *all* training, whether in a school or a unit, must be derived from a published **Training and Readiness (T\&R) Manual**.  
* **Impact:** MCCES cannot simply "invent" a class. Every lesson must trace back to a specific "Individual Training Standard" (ITS) or "Mission Essential Task" (MET) listed in the T\&R Manual. If it’s not in the T\&R, it shouldn't be in the POI.

**2\. MCO 1553.2D: Formal School Management Policy (2025)** 6

* **Core Concept:** This is the operating manual for schoolhouse commanders.  
* **Major Change:** The "D" version (and Admin Change 1\) significantly **delegates approval authority**. Previously, significant POI changes had to go up to TECOM. Now, the CG of Training Command (and in some cases, the MCCES CO) has the authority to approve POI changes to allow for faster adaptation to technology.  
* **Outcomes-Based Learning (OBL):** This order explicitly mandates a shift from "Industrial Age" training (rote memorization, lecture-heavy) to **Outcomes-Based Learning** (problem-solving, student-centric). It forces MCCES to redesign curriculum to focus on *cognitive agility*—teaching a Marine *how* to troubleshoot an unknown radio, not just which buttons to press on a specific radio.

**3\. NAVMC 1553.1A: Marine Corps Instructional Systems Design / SAT Handbook (2016)** 8

* **Core Concept:** The technical "How-To" manual for curriculum developers. It is the "bible" of the ADDIE process at the tactical level.  
* **Granularity:** It specifies the exact format of a **Concept Card**, the required fields in a **Master Lesson File**, and the statistical methods for validating test items.  
* **Constraint:** While thorough, this handbook is rigid. It is heavily paper/document-focused, creating a significant administrative burden that often slows down the update cycle.

#### **3.3 The MCCES Curriculum Lifecycle: A Narrative Walkthrough**

To illustrate the system in action, consider the lifecycle of a single course: **The Field Radio Operator Course (FROC).**

**Step 1: The Trigger (The T\&R Conference)**

* **Event:** A **T\&R Conference** is convened by the 06xx Occupational Field Sponsor (from DC I).  
* **Participants:** SMEs from the Fleet (Comm Battalions, Regiments), MCCES Instructors, and TECOM analysts.  
* **Action:** They review the **Job Task List**. They decide that "High Frequency (HF) Ale" is now a critical skill due to new threats. They add a new Task: *0621-OPS-2005: Establish HF Automatic Link Establishment.*  
* **Output:** A signed, updated **NAVMC 3500.56 (Communications T\&R Manual)**.

**Step 2: Analysis (The Gap)**

* **Action:** MCCES Curriculum Developers (Curric Devs) receive the new T\&R. They perform a **Gap Analysis**.  
* **Reasoning:** "Our current POI doesn't teach HF ALE deep enough. We need a new module."  
* **Target Population:** They review the **Target Population Description**. "These are Entry-Level Marines (Pvt-PFC). They have no prior RF knowledge. We must teach the theory before the buttons."

**Step 3: Design (The POI)**

* **Action:** Developers draft the **Terminal Learning Objective (TLO)**: *"Given an AN/PRC-150 and a frequency plan, establish an ALE network..."*  
* **Enabling Learning Objectives (ELOs):** Broken down steps: *"Identify antenna selection," "Program the preset," "Verify link establishment."*  
* **Assessment Strategy:** "We will test this via a performance evaluation (30%) and a written exam (70%)."  
* **Output:** The **Course Descriptive Data (CDD)** is updated in **MCTIMS** (Marine Corps Training Information Management System).

**Step 4: Development (The Grind)**

* **Action:** This is the heavy lift. Instructors and developers write the **Master Lesson File (MLF)**.  
  * *Concept Card:* The lesson "wrapper" (time, references, risk assessment).  
  * *Instructor Preparation Guide (IPG):* The script. "Show slide 4\. Ask: 'Why is the skywave important?'"  
  * *Student Handouts:* Detailed technical guides.  
  * *Slides:* Visual aids.  
  * *Tests:* Developing multiple-choice questions with valid distractors.  
* **SME Review:** A Senior SNCO validates the technical accuracy against the Technical Manual (TM).

**Step 5: Approval (The CCRB)**

* **Event:** A **Course Content Review Board (CCRB)** is convened.9  
* **Process:** The Course OIC presents the new lesson plan. They present data: "Pilot course showed 90% pass rate."  
* **Vote:** The Board votes to adopt the changes.  
* **Signature:** The MCCES CO (or CG TRNGCMD) signs the **Letter of Promulgation**.

**Step 6: Implementation & Evaluation**

* **Execution:** Instructors teach the new module.  
* **Feedback:** Students fill out **Level 1 Surveys** ("The lab was too short").  
* **Fleet Feedback:** 6 months later, the **Level 3 Survey** asks Unit Leaders: "Can your new Privates operate HF ALE?" If the answer is "No," the cycle begins again.

### ---

**4\. Comparative Joint Perspective**

Comparing MCCES to its sister services reveals shared challenges but distinct approaches to solving them.

#### **4.1 Navy (NETC / NAVEDTRA)**

* **The Shift:** The Navy is in the midst of a massive transformation from legacy **NAVEDTRA 130** (Task-Based) and **131** (PPP-Based) manuals to the new **NAVEDTRA 142 series** (Navy Training Process).10  
* **Concept:** This is driven by **Ready Relevant Learning (RRL)**. The Navy creates modularized, "chunked" content designed to be delivered at the point of need (e.g., on the ship) rather than just in the schoolhouse.  
* **Comparison:** MCCES is largely residence-based. The Navy's aggressive push into *virtual task trainers* and *mobile learning* exceeds current USMC implementation. MCCES could benchmark the Navy’s **NAVEDTRA 142.2 (Requirements Development)** for more agile methods of validating fleet needs without massive conferences.

#### **4.2 Army (TRADOC)**

* **Regulation:** **TRADOC Regulation 350-70** and **TP 350-70-14**.11  
* **The Machine:** The Army operates on a scale the USMC does not. Their **Critical Task Site Selection Boards (CTSSB)** are highly formalized and data-driven.  
* **Distributed Learning:** The Army’s **Distributed Learning Program (TADLP)** (TP 350-70-12) has established rigorous standards for mobile apps and self-paced courseware. MCCES often struggles to get "credit" for distributed training; the Army model offers a template for validating self-study.

#### **4.3 Air Force (AETC)**

* **Regulation:** **DAFI 36-2670** (formerly AFI 36-2201).  
* **Career Lifecycle:** The Air Force uses the **Career Field Education and Training Plan (CFETP)**. Unlike the USMC T\&R Manual (which is a list of tasks), the CFETP is a holistic lifecycle document that tracks a specific Airman’s progression from Apprentice to Journeyman to Master.  
* **Comparison:** This provides a clearer "cradle-to-grave" training picture than the USMC's disjointed "school vs. unit" model.

### ---

**5\. Constraints, Risks, and Pain Points in the Current Model**

Despite the robust doctrine, the MCCES ecosystem faces systemic friction that degrades readiness.

1. **The "Swivel Chair" Interface:** There is no digital bridge between the **Technical Manuals (TMs)** (produced by vendors like Harris or General Dynamics) and the **Training Systems (MCTIMS)**. Curriculum developers must literally read a PDF on one screen and re-type the tasks into a Word document or database on another. This manual transcription is slow, error-prone, and boring, leading to burnout.  
2. **SME Scarcity:** The system assumes a limitless supply of expert Gunnery Sergeants to write curriculum. In reality, these Marines are critically scarce. They are pulled between teaching, administrative duties, and collateral duties. Writing high-quality "Outcomes-Based" assessments requires deep pedagogical skill, which most SMEs lack.  
3. **The "Update Lag":** The rigorous ADDIE process creates latency. A new radio firmware might be released in January. The T\&R Conference isn't until June. The POI isn't updated until December. By the time the student graduates, they are trained on software that is 12 months out of date.  
4. **MCTIMS Rigidity:** **MCTIMS** is the system of record, but it is rigid. Changing a single Learning Objective can trigger a cascade of required approvals ("Red-Lines") that discourages instructors from making necessary minor updates.  
5. **Assessment Integrity:** Creating valid multiple-choice questions is hard. SMEs often write questions that are confusing or test trivial knowledge (e.g., "What is the weight of the radio?") rather than operational competence.

### ---

**6\. Summary of Regulatory Landscape**

| Identifier | Title | Authority | Status | Strategic Impact |
| :---- | :---- | :---- | :---- | :---- |
| **MCO 1553.1C** | *Marine Corps Training and Education System* | USMC / TECOM | **Current** (Dec 2024\) | Establishing the **T\&R Manual** as the single source of truth for all training requirements. |
| **MCO 1553.2D** | *Formal School Management Policy* | USMC / TECOM | **Current** (2025) | Delegating POI approval authority; mandating **Outcomes-Based Learning (OBL)**. |
| **NAVMC 1553.1A** | *MC Instructional Systems Design / SAT Handbook* | USMC / TECOM | **Current** (2016) | The "ADDIE Bible." Provides the mandatory templates and procedures for JTA, Design, and Development. |
| **NAVMC 5239.1** | *Guidance on Generative AI* | USMC / DC I | **Current** (Dec 2024\) | **New.** Establishes "Distrust and Verify" policy; authorizes **AI Task Forces**; mandates human validation.13 |
| **DoDI 1322.26** | *Distributed Learning* | DoD | **Current** | Mandates data interoperability (xAPI) and Total Learning Architecture compliance. |
| **NAVMC 3500.56** | *Communications T\&R Manual* | USMC / TECOM | **Current Series** | The specific list of tasks (METs/ITSs) for 06xx Marines. |
| **NAVEDTRA 142** | *Navy Training Process* | Navy (NETC) | **Current** (2025) | New Navy standard for agile content development; a benchmark for future MCCES agility. |

### ---

**7\. Implications for MCCES Leadership**

For the Commanding Officer and senior staff, the path forward requires navigating the tension between compliance and innovation.

* **You Have the Authority:** The shift to **MCO 1553.2D** empowers the schoolhouse to update curriculum faster than ever before. You do not need to wait for TECOM permission to modernize lesson content, provided it aligns with the T\&R.  
* **The AI "Permission Slip":** **NAVMC 5239.1** is the green light. It does not ban AI; it *regulates* it. It places the onus on the Commander to establish a governance structure (Task Force) to manage risk. Ignoring AI is now a risk to readiness; adopting it without governance is a risk to security.  
* **The Human Remains Central:** AI cannot replace the SME because AI cannot be held accountable under the UCMJ. The **Human-in-the-Loop (HITL)** is the non-negotiable safety valve. The goal is to free the SME from the "drudgery" of typing so they can focus on the "art" of instruction and validation.

# ---

**Part II – AI-Enabled Curriculum Development Playbook & Blueprint**

**To:** MCCES Leadership, Director of Academics, & Curriculum Modernization Task Force

**Subj:** OPERATIONALIZING GENERATIVE AI FOR ACCELERATED CURRICULUM DEVELOPMENT

### **1\. Overview and Assumptions**

This blueprint proposes a concrete, actionable workflow to integrate Generative AI (GenAI) into the MCCES curriculum lifecycle. It addresses the core operational challenge: *"How do we rapidly convert technical data into validated training content while maintaining strict compliance with USMC orders?"*

**Operational Assumptions:**

* **Unclassified Baseline:** This playbook focuses on **Unclassified** (CUI) content, which constitutes the majority of entry-level training (e.g., basic electronics, radio theory, unclassified administrative systems). Classified workflows require air-gapped systems (e.g., SIPR-based LLMs) which are evolving separately.  
* **Tool Agnosticism:** The workflow assumes access to a DoD-approved LLM environment (e.g., "NIPR-GPT," "Oswego," or a secured instance of Claude/GPT-4 via the DoD CDAO's hierarchies).  
* **The "Co-Pilot" Model:** AI is treated as a "Junior Clerk" or "Staff Assistant." It drafts content; it *never* approves content. The Marine SME retains 100% of the approval authority.  
* **Compliance:** All activities adhere to **NAVMC 5239.1**, specifically the requirement to "distrust and verify" and to watermark AI-generated materials.

### **2\. Curriculum Development Decomposed into AI-Amenable Tasks**

The Systems Approach to Training (SAT) defined in **NAVMC 1553.1A** is highly structured, making it an ideal candidate for AI automation. We can map AI capabilities directly to the friction points in the ADDIE model.

| SAT Phase | Current Human Friction Point | AI Augmentation Opportunity | Value Proposition |
| :---- | :---- | :---- | :---- |
| **Analyze** | Manually reading 1,000+ page Technical Manuals (TMs) to find "operator tasks" vs. "maintainer tasks." | **Semantic Extraction:** AI ingests the PDF TM. It extracts all "Procedures" and categorizes them by role (Operator/Maintainer) based on keywords. | Reduces weeks of reading to minutes of reviewing. |
| **Design** | Writing Terminal Learning Objectives (TLOs) that adhere to strict formatting (Condition, Behavior, Standard). | **Structural Drafting:** AI converts extracted tasks into compliant TLOs/ELOs using Bloom's Taxonomy verbs mapped to MCO 1553.2D standards. | Ensures 100% format compliance; eliminates "blank page syndrome." |
| **Develop** | Creating realistic scenarios and valid "distractors" (wrong answers) for multiple-choice tests. | **Synthetic Content Gen:** AI generates 50 variations of a test question, creating plausible distractors based on common errors found in the TM. Generates "Troubleshooting Scenarios." | massive increase in assessment bank depth; reduces test compromise. |
| **Implement** | Updating Instructor Guides (IPGs) when a TM is updated (e.g., Change 2 to Change 3). | **Diff Analysis:** AI compares "Old TM" vs. "New TM," identifies the delta, and flags exactly which slides/lessons need updating. | Rapid currency updates; prevents "negative training" on old procedures. |
| **Evaluate** | analyzing thousands of free-text student comments from Level 1 surveys. | **Sentiment Analysis:** AI summarizes survey data to identify cluster trends (e.g., "35% of students are confused by the Antenna Lab instructions"). | Turns "noise" into actionable data for the CCRB. |

### **3\. Example AI-Augmented Workflow (Step-by-Step)**

**Scenario:** MCCES needs to create a **New Equipment Training (NET)** package for a fielded handheld radio, the **AN/PRC-Generic**, based on a new Technical Manual (TM).

#### **Step 1: Ingest and Task Extraction (The "Analyze" Phase)**

* **Input:** The Curriculum Developer uploads the unclassified PDF of the *AN/PRC-Generic Technical Manual* and the relevant section of **NAVMC 3500.56** (Comms T\&R) into the secure AI environment.  
* **Prompt Engineering:**"Act as a Marine Corps Curriculum Developer. Analyze the attached Technical Manual. Extract all procedures identified as 'Operation' or 'Troubleshooting.' Cross-reference these with the T\&R Manual to identify which T\&R Events these tasks support. Output as a table."  
* **AI Output:** A structured list mapping TM chapters to T\&R codes.  
  * *Task 1:* Load COMSEC (Maps to: 0621-OPS-2001).  
  * *Task 2:* Program Frequency Hop Preset (Maps to: 0621-OPS-2005).  
* **Human Action (SME):** Review the list. *Action:* "Delete Task 4; that is depot-level maintenance, not operator level. Approve the rest."

#### **Step 2: Objective Drafting (The "Design" Phase)**

* **Input:** The validated Task List.  
* **Prompt Engineering:**"For each validated task, draft a Terminal Learning Objective (TLO) and 3 Enabling Learning Objectives (ELOs). Use the Mager format: Condition, Behavior, Standard. Ensure verbs align with Bloom's Taxonomy Level 3 (Application)."  
* **AI Output:**  
  * *Draft TLO:* "Given an AN/PRC-Generic, a fill device, and a frequency plan, **load COMSEC keying material**... within 3 minutes, per TM Chapter 4."  
  * *Draft ELO 1:* "Identify the correct fill port on the chassis."  
  * *Draft ELO 2:* "Navigate the menu to the Security/Fill submenu."  
* **Human Action (SME):** Verify the standard. *Correction:* "Change '3 minutes' to '2 minutes' to align with the new SOP."

#### **Step 3: Content & Assessment Generation (The "Develop" Phase)**

* **Input:** The TLOs and TM Chapter 4\.  
* **Prompt A (Lesson Plan):**"Create a detailed outline for a 2-hour lecture and lab on 'Programming Frequency Hopping.' Include a 15-minute practical application scenario involving a jamming threat."  
* **Prompt B (Assessment):**"Generate 10 multiple-choice questions for this TLO. Ensure the 'distractors' (wrong answers) represent common operator errors found in the TM troubleshooting table. Mark the correct answer."  
* **AI Output:** A draft Lesson Plan outline and a bank of 10 quiz questions.  
* **Human Action (SME):** **CRITICAL SAFETY CHECK.** The SME verifies that the practical application does not violate safety norms (e.g., RF exposure). The SME checks the quiz keys. *Correction:* "Question 3 is ambiguous; delete it."

#### **Step 4: Packaging and Integration**

* **Action:** The Curriculum Developer copies the valid text into the official **Master Lesson File (MLF)** Word templates and **MCTIMS** fields.  
* **Future State:** Using an API or "Robotic Process Automation" (RPA) bot to auto-fill the MCTIMS forms from the AI output.

### **4\. Compliance, Risk, and Governance Considerations**

**NAVMC 5239.1** mandates a specific governance posture. To deploy this workflow legally, MCCES must establish the following guardrails:

1. **The AI Task Force:** The MCCES Commander must appoint an "AI Integration Officer" (likely the Director of Academics or a designated restricted officer) to oversee the program. This officer is responsible for registering the use case with HQMC.  
2. **The "Sandbox" Environment:** Establish a designated workstation or cloud enclave for curriculum development that is **physically or logically separated** from the live student network. AI tools should not be running on the same machine used to grade official exams until the workflow is matured.  
3. **Watermarking and Attribution:** Any document drafted by AI must be watermarked: **"DRAFT \- AI GENERATED \- REQUIRES SME VALIDATION."** This watermark persists until the CCRB Chair signs the final approval.  
4. **Traceability (The "Citation" Rule):** The AI prompt must always require citations.  
   * *Bad Prompt:* "How do I zero the radio?"  
   * *Good Prompt:* "How do I zero the radio? **Cite the specific page number and paragraph from the attached TM.**"  
   * *Why:* This allows the SME to instantly verify accuracy without re-reading the whole manual.  
5. **Hallucination Mitigation:** AI is notoriously poor at specific numbers (e.g., frequencies, weights, voltage tolerances). SMEs must be trained to **never trust a number** generated by an LLM.

### **5\. Phased Implementation Roadmap for MCCES**

**Phase 1: The "Co-Pilot" Pilot (Months 1–6)**

* **Objective:** Low-risk efficiency gains.  
* **Scope:** Select *one* specific course (e.g., Basic Radio Operator Course). Equip 2–3 Senior Instructors with access to the approved AI tool.  
* **Activity:** Use AI primarily for **Analysis** (summarizing TMs) and **Evaluation** (summarizing student surveys). No direct student-facing content is generated.  
* **Metric:** Time saved in administrative tasks.

**Phase 2: The "Drafting" Pilot (Months 6–12)**

* **Objective:** Content generation.  
* **Scope:** Expand to the Maintenance School.  
* **Activity:** Use AI to draft **Assessment Items** (quizzes) and **Lesson Plan Outlines**.  
* **Control:** All AI-generated tests must be reviewed by *two* SMEs before being used.  
* **Metric:** Increase in the size of the test question bank (reducing test compromise).

**Phase 3: The "Diff" Pilot (Year 1+)**

* **Objective:** Lifecycle sustainment.  
* **Activity:** Use AI to perform **Diff Analysis** on updated Technical Manuals. The AI flags changes and suggests specific edits to the existing POI.  
* **Metric:** Reduction in "Time to Market" for curriculum updates (Target: 50% reduction).

### **6\. Demo Workflow Design for Leadership Briefing**

**Scenario:** Presenting to the Commanding General, Training Command.

**Goal:** Prove that AI is safe, effective, and compliant.

**The Demo Script:**

1. **The Setup:** Display a split screen. Left side: An unclassified, dense PDF Technical Manual. Right side: A blank "Lesson Plan Template."  
2. **The Action:** "Sir, usually a Gunnery Sergeant spends 3 days reading this manual to outline a class. Watch this."  
   * *Copy-Paste* a complex troubleshooting section into the AI tool.  
   * *Prompt:* "Convert this text into a 5-step Student Practical Application Checklist. Include safety warnings."  
3. **The Result:** The AI generates a clean, numbered checklist in 10 seconds.  
4. **The Verification (The "Money Shot"):** The briefer highlights a specific step in the AI output. "Now, Sir, here is the most important part. I am the SME. I am checking step 3 against the manual." (Briefer visibly checks the PDF). "It is accurate. I approve it."  
5. **The Assessment:** "Now, I need a test question." *Prompt:* "Write a scenario-based test question for this checklist where the student skips step 2\. What is the consequence?"  
6. **The Closing Argument:** "We are not replacing the Marine Instructor. We are giving them a digital staff to handle the paperwork, so they can focus on the Marines. This aligns with **MCO 1553.2D**'s mandate for Outcomes-Based Learning by allowing us to generate unlimited scenarios."

### **7\. Open Questions and Future Research**

* **Integration with MCTIMS:** Currently, there is no API to push AI data directly into MCTIMS. This "air gap" necessitates manual data entry. Future research should explore **Robotic Process Automation (RPA)** to bridge this gap safely.  
* **The Classified Frontier:** How do we handle Secret-level TMs (e.g., for EW systems)? Research is needed into **SIPR-hosted LLMs** that can ingest classified TMs within a secure facility (SCIF).  
* **Intellectual Property (IP):** When using commercial TMs (from vendors like L3Harris), does the DoD have the right to ingest them into an AI model for training generation? A legal review by the Staff Judge Advocate (SJA) is recommended to clarify "Fair Use" for government training.

### ---

**Citations & References**

* 5 **MCO 1553.1C**, *Marine Corps Training and Education System* (Dec 2024).  
* 6 **MCO 1553.2D**, *Formal School Management Policy* (2025).  
* 8 **NAVMC 1553.1A**, *Marine Corps Instructional Systems Design/SAT Handbook* (2016).  
* 13 **NAVMC 5239.1**, *Guidance on Generative AI* (Dec 2024).  
* 1 **DoDI 1322.26**, *Distributed Learning*.  
* 10 **NAVEDTRA 142**, *Navy Training Process* (July 2025).  
* 16 MCCES Mission and Organization.  
* 18 ADDIE Model Definition.  
* 9 Course Content Review Board (CCRB) Process.

#### **Works cited**

1. Advanced Distributed Learning \- Wikipedia, accessed December 11, 2025, [https://en.wikipedia.org/wiki/Advanced\_Distributed\_Learning](https://en.wikipedia.org/wiki/Advanced_Distributed_Learning)  
2. DoDI 1322.26 DL Implementation References \- ADL, accessed December 11, 2025, [https://www.adlnet.gov/assets/uploads/DoDI%20FY22%20FR%20Update\_Fall%202022\_Vote%20Version.pdf](https://www.adlnet.gov/assets/uploads/DoDI%20FY22%20FR%20Update_Fall%202022_Vote%20Version.pdf)  
3. Joint Education \- Joint Chiefs of Staff, accessed December 11, 2025, [https://www.jcs.mil/Doctrine/Joint-Education/](https://www.jcs.mil/Doctrine/Joint-Education/)  
4. CJCSI 1800.01F, Officer Professional Military Education Policy, accessed December 11, 2025, [https://www.dmi-ida.org/knowledge-base-detail/cjcsi-1800-01f-officer-professional-military-education-policy](https://www.dmi-ida.org/knowledge-base-detail/cjcsi-1800-01f-officer-professional-military-education-policy)  
5. MCO 1553.1C \> United States Marine Corps Flagship \> Electronic Library Display, accessed December 11, 2025, [https://www.marines.mil/News/Publications/MCPEL/Electronic-Library-Display/Article/898851/mco-15531c/](https://www.marines.mil/News/Publications/MCPEL/Electronic-Library-Display/Article/898851/mco-15531c/)  
6. MCO 1553.2D W/ADMIN CH-1 \> United States Marine Corps Flagship \> Electronic Library Display, accessed December 11, 2025, [https://www.marines.mil/News/Publications/MCPEL/Electronic-Library-Display/Article/2668291/mco-15532d-wadmin-ch-1/](https://www.marines.mil/News/Publications/MCPEL/Electronic-Library-Display/Article/2668291/mco-15532d-wadmin-ch-1/)  
7. MCO 1553.2D Admin CH-1 (SECURED) \- Marines.mil, accessed December 11, 2025, [https://www.marines.mil/Portals/1/Publications/MCO%201553.2D%20Admin%20CH-1%20(SECURED).pdf?ver=jnKJycREO4iil5GxCxaryg%3D%3D](https://www.marines.mil/Portals/1/Publications/MCO%201553.2D%20Admin%20CH-1%20\(SECURED\).pdf?ver=jnKJycREO4iil5GxCxaryg%3D%3D)  
8. navmc 1553.1a \- Marines.mil, accessed December 11, 2025, [https://www.marines.mil/portals/1/Publications/NAVMC%201553.1A.pdf](https://www.marines.mil/portals/1/Publications/NAVMC%201553.1A.pdf)  
9. Communication Training Battalion \- Marine Corps Association, accessed December 11, 2025, [https://www.mca-marines.org/wp-content/uploads/Communication-Training-Battalion.pdf](https://www.mca-marines.org/wp-content/uploads/Communication-Training-Battalion.pdf)  
10. NETC Launches NAVEDTRA 142 Series, Modernizes Navy Training Process, accessed December 11, 2025, [https://www.netc.navy.mil/Media-Center/News-Stories/News-Stories-Display/Article/4248648/netc-launches-navedtra-142-series-modernizes-navy-training-process/](https://www.netc.navy.mil/Media-Center/News-Stories/News-Stories-Display/Article/4248648/netc-launches-navedtra-142-series-modernizes-navy-training-process/)  
11. Department of the Army \*TRADOC Regulation 350-70 Headquarters, United States Army Training and Doctrine Command Fort Eustis,, accessed December 11, 2025, [https://adminpubs.tradoc.army.mil/regulations/TR350-70.pdf](https://adminpubs.tradoc.army.mil/regulations/TR350-70.pdf)  
12. Department of the Army \*TRADOC Pamphlet 350-70-14 Headquarters, U.S. Army Training and Doctrine Command Fort Eustis, Virgini, accessed December 11, 2025, [https://adminpubs.tradoc.army.mil/pamphlets/TP350-70-14.pdf](https://adminpubs.tradoc.army.mil/pamphlets/TP350-70-14.pdf)  
13. NAVMC 5239.1 (SECURED) \- Marines.mil, accessed December 11, 2025, [https://www.marines.mil/Portals/1/Publications/NAVMC%205239.1%20(SECURED).pdf?ver=vRB-vsWK\_v82H-CDXblK8A%3D%3D](https://www.marines.mil/Portals/1/Publications/NAVMC%205239.1%20\(SECURED\).pdf?ver=vRB-vsWK_v82H-CDXblK8A%3D%3D)  
14. MCO 1553.1C\_Final Signed \- Marines.mil, accessed December 11, 2025, [https://www.marines.mil/Portals/1/Publications/MCO%201553.1C%20(SECURED).pdf?ver=zeU9C00UDkX47qLV7vl1Dg%3D%3D](https://www.marines.mil/Portals/1/Publications/MCO%201553.1C%20\(SECURED\).pdf?ver=zeU9C00UDkX47qLV7vl1Dg%3D%3D)  
15. 'Distrust and verify': Marines warily embrace generative AI with new guidance, task forces, accessed December 11, 2025, [https://breakingdefense.com/2025/01/distrust-and-verify-marines-warily-embrace-generative-ai-with-new-guidance-task-forces/](https://breakingdefense.com/2025/01/distrust-and-verify-marines-warily-embrace-generative-ai-with-new-guidance-task-forces/)  
16. Marine Corps Communication Electronics School \- Wikipedia, accessed December 11, 2025, [https://en.wikipedia.org/wiki/Marine\_Corps\_Communication\_Electronics\_School](https://en.wikipedia.org/wiki/Marine_Corps_Communication_Electronics_School)  
17. Marine Corps Communication-Electronics School, accessed December 11, 2025, [https://www.mcces.marines.mil/](https://www.mcces.marines.mil/)  
18. ADDIE model \- Wikipedia, accessed December 11, 2025, [https://en.wikipedia.org/wiki/ADDIE\_model](https://en.wikipedia.org/wiki/ADDIE_model)  
19. CD0002 \- Training Command, accessed December 11, 2025, [https://www.trngcmd.marines.mil/Portals/207/Docs/MCCSSS/T3S/Systems%20Approach%20to%20Training%20(SAT).doc?ver=za85Tn7PVwHvdy6smyo0fA%3D%3D](https://www.trngcmd.marines.mil/Portals/207/Docs/MCCSSS/T3S/Systems%20Approach%20to%20Training%20\(SAT\).doc?ver=za85Tn7PVwHvdy6smyo0fA%3D%3D)