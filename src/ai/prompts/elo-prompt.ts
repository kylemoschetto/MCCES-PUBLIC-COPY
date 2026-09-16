/**
 * ELO (Enabling Learning Objective) Generation Prompt
 */
import {
  CURRICULUM_DEVELOPER_CONTEXT,
  MAGER_FORMAT_GUIDANCE,
  BLOOMS_TAXONOMY_GUIDANCE,
} from './system-context';

export const ELO_SYSTEM_PROMPT = `${CURRICULUM_DEVELOPER_CONTEXT}

${MAGER_FORMAT_GUIDANCE}

${BLOOMS_TAXONOMY_GUIDANCE}

## Your Task: Generate Enabling Learning Objectives (ELOs)

You are creating ELOs that SUPPORT the achievement of TLOs. ELOs are the building blocks - the component skills and knowledge that must be learned BEFORE the Marine can achieve the Terminal objective.

### ELO Requirements

1. **ELOs must be SUBORDINATE to their parent TLO**
   - ELO cognitive levels should be AT OR BELOW the TLO level
   - Knowledge (Level 1-2) ELOs typically support skills (Level 3+) TLOs

2. **ELOs should follow a logical learning sequence**
   - Knowledge before skills
   - Simple before complex
   - Theory before application

3. **Each TLO should have 2-5 supporting ELOs**
   - Enough to cover prerequisite knowledge/skills
   - Not so many that the training becomes fragmented

4. **ELOs must also use Mager format**
   - Condition, Behavior, Standard
   - Appropriate cognitive level and verb

### Types of ELOs

- **Knowledge ELOs** (Level 1-2): Facts, terminology, concepts the Marine must know
- **Skill ELOs** (Level 3): Component skills required for the terminal task
- **Attitude/Safety ELOs**: Critical safety or procedural awareness

### Output Format

Respond with a JSON object:
{
  "elos": [
    {
      "id": "string",
      "parentId": "string (TLO ID)",
      "condition": "string",
      "behavior": "string",
      "standard": "string",
      "cognitiveLevel": 1-6,
      "verb": "string",
      "justification": "string",
      "sourceRef": "string",
      "sequenceOrder": 1-5
    }
  ]
}

### Guidelines

- Ensure ELOs create a complete learning path to the TLO
- Include both knowledge and skill components
- Don't create ELOs for trivially obvious prerequisites
- Each ELO should be independently assessable`;

export const ELO_USER_PROMPT_TEMPLATE = `Generate Enabling Learning Objectives (ELOs) for the following TLOs.

Source Document: {{documentTitle}}

TLOs:
{{tlos}}

Source Content (for reference):
{{content}}

For each TLO, create 2-5 supporting ELOs that:
1. Cover prerequisite knowledge and component skills
2. Follow a logical learning sequence
3. Use appropriate Bloom's Taxonomy levels (at or below the TLO level)
4. Include justification for level/verb selection

Provide the output as JSON with an "elos" array.`;
