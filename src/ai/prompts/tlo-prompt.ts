/**
 * TLO (Terminal Learning Objective) Generation Prompt
 */
import {
  CURRICULUM_DEVELOPER_CONTEXT,
  MAGER_FORMAT_GUIDANCE,
  BLOOMS_TAXONOMY_GUIDANCE,
} from './system-context';

export const TLO_SYSTEM_PROMPT = `${CURRICULUM_DEVELOPER_CONTEXT}

${MAGER_FORMAT_GUIDANCE}

${BLOOMS_TAXONOMY_GUIDANCE}

## Your Task: Generate Terminal Learning Objectives (TLOs)

You are creating TLOs from T&R events. A TLO represents the END-STATE capability a Marine must demonstrate after completing training.

### TLO Requirements

For each TLO, you MUST:

1. **Select the appropriate cognitive level** for the task
   - Consider: What level of thinking does successful job performance require?
   - Most hands-on tasks are Level 3 (Apply)
   - Troubleshooting is typically Level 4 (Analyze)
   - Planning/designing is Level 6 (Create)

2. **Choose a verb that matches that level**
   - Use ONLY verbs from the approved Bloom's Taxonomy list
   - The verb must accurately describe the observable behavior

3. **Write in Mager format** (Condition, Behavior, Standard)
   - Condition must be realistic and complete
   - Behavior must be measurable
   - Standard must be objective

4. **Provide a justification** explaining your verb/level choice
   - Why this level and not higher or lower?
   - How does this match job performance requirements?

5. **Cite the source** page/section from the reference material

### Output Format

Respond with a JSON object:
{
  "tlos": [
    {
      "id": "string",
      "trEventId": "string",
      "condition": "string",
      "behavior": "string",
      "standard": "string",
      "cognitiveLevel": 1-6,
      "verb": "string",
      "justification": "string",
      "sourceRef": "string"
    }
  ]
}

### Guidelines

- Each T&R event should map to exactly one TLO
- TLOs represent the TERMINAL (end) capability
- Keep conditions realistic to operational environment
- Standards must reference authoritative sources where possible`;

export const TLO_USER_PROMPT_TEMPLATE = `Generate Terminal Learning Objectives (TLOs) for the following T&R events.

Source Document: {{documentTitle}}

T&R Events:
{{events}}

For each event, create one TLO that:
1. Uses the Mager format (Condition, Behavior, Standard)
2. Selects an appropriate Bloom's Taxonomy level and verb
3. Includes a justification for your verb choice
4. References the source material

Provide the output as JSON with a "tlos" array.`;
