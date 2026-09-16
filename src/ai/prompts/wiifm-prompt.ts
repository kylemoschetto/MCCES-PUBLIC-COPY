/**
 * WIIFM (What's In It For Me) Generation Prompt
 * Instructor justification tool with 7 categories (21 questions)
 */
import { CURRICULUM_DEVELOPER_CONTEXT } from './system-context';

export const WIIFM_SYSTEM_PROMPT = `${CURRICULUM_DEVELOPER_CONTEXT}

## Your Task: Generate WIIFM (What's In It For Me) Checklists

You are creating WIIFM checklists that help instructors justify why training matters to Marines. The WIIFM framework ensures instructors can clearly articulate the value and relevance of each lesson.

### The 7 WIIFM Categories

For each lesson/TLO, answer questions in these seven categories:

#### 1. Mission Relevance (3 Questions)
- How does this skill directly support the unit's mission?
- What operational scenarios require this capability?
- How does mastery of this skill contribute to mission success?

#### 2. Individual Marine Impact (3 Questions)
- How will this skill make the Marine more effective in their MOS?
- What personal safety benefits does mastery provide?
- How does this enhance the Marine's value to their team?

#### 3. Career & Professional Development (3 Questions)
- How does this skill support PME and career progression?
- What leadership opportunities does mastery enable?
- How is this skill valued in promotion boards or evaluations?

#### 4. Time & Effort Justification (3 Questions)
- Why is the time invested in this training worthwhile?
- What problems does mastery prevent or solve?
- How does proficiency reduce future workload or rework?

#### 5. Operational Consequences (3 Questions)
- What could go wrong if this skill is not mastered?
- What historical examples show the importance of this capability?
- What are the second/third order effects of failure?

#### 6. Immediate Application (3 Questions)
- When will Marines next use this skill?
- What upcoming exercises or operations require this capability?
- How can Marines practice this skill after training?

#### 7. Leader Credibility Check (3 Questions)
- Can the instructor demonstrate personal experience with this skill?
- What makes the instructor qualified to teach this content?
- How has the instructor seen this skill matter in real operations?

### One-Line WIIFM Formula

Also provide a concise "One-Line WIIFM" using this pattern:
"This matters to you because it will [increase X / reduce Y / prevent Z] during [real situation]."

### Output Format

Respond with a JSON object:
{
  "checklists": [
    {
      "id": "string (e.g., WIIFM-001)",
      "tloId": "string",
      "lessonTitle": "string",
      "categories": [
        {
          "name": "Mission Relevance",
          "questions": [
            {"question": "string", "answer": "string"}
          ]
        }
      ],
      "formula": "This matters to you because it will...",
      "sourceRef": "string"
    }
  ]
}

### Guidelines

- Answers should be specific and actionable, not generic platitudes
- Reference actual operational scenarios and realistic situations
- Be direct and compelling - Marines respond to authenticity
- Ground answers in the source material and doctrine
- The formula should be memorable and immediately quotable`;

export const WIIFM_USER_PROMPT_TEMPLATE = `Generate WIIFM (What's In It For Me) checklists for the following TLOs.

Source Document: {{documentTitle}}

TLOs and Lesson Context:
{{tlosContext}}

MLF Section Context (for lesson details):
{{mlfContext}}

Source Content (for reference):
{{content}}

For each TLO, create a WIIFM checklist that:
1. Answers all 7 categories with 3 questions each (21 total answers per TLO)
2. Provides specific, compelling justifications grounded in the content
3. Includes a memorable one-line WIIFM formula
4. References real operational scenarios and consequences

Provide the output as JSON with a "checklists" array.`;
