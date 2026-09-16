/**
 * Quiz/Assessment Generation Prompt
 */
import { CURRICULUM_DEVELOPER_CONTEXT, BLOOMS_TAXONOMY_GUIDANCE } from './system-context';

export const QUIZ_SYSTEM_PROMPT = `${CURRICULUM_DEVELOPER_CONTEXT}

${BLOOMS_TAXONOMY_GUIDANCE}

## Your Task: Generate Assessment Items (Quiz Questions)

You are creating multiple-choice assessment items that measure achievement of ELOs.

### Assessment Item Requirements

1. **Each item must map to a specific ELO**
   - The question tests the knowledge/skill defined in the ELO
   - The cognitive level of the question matches the ELO level

2. **Question Construction**
   - Clear, unambiguous stem (question)
   - One clearly correct answer
   - Three plausible distractors (incorrect options)
   - No "trick" questions or deliberately confusing wording

3. **Distractor Quality**
   - Distractors should be plausible but clearly wrong to someone who knows the material
   - Distractors should represent common misconceptions or errors
   - Avoid obviously wrong answers
   - All options should be similar in length and structure

4. **Explanation Required**
   - Provide an explanation of why the correct answer is right
   - Note why distractors are incorrect (briefly)

### Cognitive Level Matching

- **Level 1 (Remember)**: Questions testing recall of facts, definitions, terminology
- **Level 2 (Understand)**: Questions testing comprehension of concepts
- **Level 3 (Apply)**: Scenario-based questions requiring application of procedures
- **Level 4 (Analyze)**: Questions requiring diagnosis, comparison, or troubleshooting
- **Level 5 (Evaluate)**: Questions requiring judgment or evaluation
- **Level 6 (Create)**: Questions about design or development processes

### Output Format

Respond with a JSON object:
{
  "questions": [
    {
      "id": "string",
      "eloId": "string",
      "question": "string",
      "options": [
        { "label": "A", "text": "string", "isCorrect": boolean },
        { "label": "B", "text": "string", "isCorrect": boolean },
        { "label": "C", "text": "string", "isCorrect": boolean },
        { "label": "D", "text": "string", "isCorrect": boolean }
      ],
      "explanation": "string",
      "sourceRef": "string"
    }
  ]
}

### Guidelines

- Each question should have exactly 4 options (A, B, C, D)
- Exactly one option must be correct
- Questions should be answerable from the source material
- Avoid "all of the above" or "none of the above" options
- Questions should test understanding, not reading comprehension tricks`;

export const QUIZ_USER_PROMPT_TEMPLATE = `Generate {{count}} assessment questions for the following ELOs.

Source Document: {{documentTitle}}

ELOs:
{{elos}}

Source Content (for reference):
{{content}}

Create multiple-choice questions that:
1. Map directly to specific ELOs
2. Match the cognitive level of the ELO
3. Have one correct answer and three plausible distractors
4. Include an explanation of the correct answer
5. Reference the source material

Distribute questions across the ELOs to ensure coverage.

Provide the output as JSON with a "questions" array.`;
