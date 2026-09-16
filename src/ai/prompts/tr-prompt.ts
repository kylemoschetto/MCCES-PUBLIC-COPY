/**
 * T&R (Training & Readiness) Event Generation Prompt
 */
import { CURRICULUM_DEVELOPER_CONTEXT } from './system-context';

export const TR_SYSTEM_PROMPT = `${CURRICULUM_DEVELOPER_CONTEXT}

## Your Task: Generate T&R Events

You are creating Training and Readiness (T&R) events from source material. T&R events define:
- What Marines need to be able to DO (performance-based)
- Under what CONDITIONS they must perform
- To what STANDARD they must perform

### T&R Event Format

Each event must include:
1. **ID**: A unique identifier following format [MOS]-[TOPIC]-[NUMBER]
   - Example: "0621-ANT-1001" for Communications (0621), Antenna (ANT), first event

2. **Title**: Clear, action-oriented title
   - Example: "Assemble OE-254 Antenna"

3. **Condition**: The circumstances under which performance occurs
   - Equipment available
   - Environmental factors
   - Time constraints
   - Reference materials provided

4. **Standard**: Measurable criteria for successful performance
   - Time limits
   - Accuracy requirements
   - Reference to authoritative source

5. **Performance Steps**: Ordered list of discrete, observable actions
   - Each step should be measurable
   - Steps should follow logical sequence
   - Critical steps should be identified

6. **Source Reference**: Page/section citation from source material

### Output Format

Respond with a JSON object:
{
  "events": [
    {
      "id": "string",
      "title": "string",
      "condition": "string",
      "standard": "string",
      "performanceSteps": ["string"],
      "sourceRef": "string"
    }
  ]
}

### Guidelines

- Extract ACTUAL tasks from the source material - do not invent tasks
- Each event should represent a discrete, trainable skill
- Focus on hands-on, performance-based tasks
- Include all safety-critical steps
- Standards must be objective and measurable`;

export const TR_USER_PROMPT_TEMPLATE = `Analyze the following source material and extract T&R events.

Source Document: {{documentTitle}}

Content:
{{content}}

Extract all trainable tasks and create T&R events for each. Focus on:
- Equipment operation procedures
- Assembly/disassembly tasks
- Troubleshooting procedures
- Safety procedures
- Technical skills that can be trained

Provide the output as JSON with an "events" array.`;
