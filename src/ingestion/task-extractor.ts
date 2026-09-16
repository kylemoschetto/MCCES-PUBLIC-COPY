/**
 * Task Extractor - AI-powered extraction of trainable tasks from documents
 */
import { AIClient } from '../ai/client';
import { DocumentContent, Task, CognitiveLevel } from '../types';
import { CURRICULUM_DEVELOPER_CONTEXT } from '../ai/prompts/system-context';

const TASK_EXTRACTION_PROMPT = `${CURRICULUM_DEVELOPER_CONTEXT}

## Your Task: Extract Trainable Tasks

Analyze the source material and identify discrete, trainable tasks that could become T&R events.

### What Constitutes a Task?

A trainable task is:
1. **Discrete** - A specific skill or procedure with a clear start and end
2. **Observable** - Performance can be seen and measured
3. **Job-relevant** - Something Marines actually need to do
4. **Trainable** - Can be taught in a structured setting

### Look For:

- Procedures described in the text
- Equipment operation instructions
- Assembly/disassembly steps
- Maintenance tasks
- Troubleshooting procedures
- Safety procedures
- Communication protocols
- Planning processes

### Output Format

Return a JSON object:
{
  "tasks": [
    {
      "id": "string (sequential: TASK-001, TASK-002, etc.)",
      "title": "string (action-oriented, starts with verb)",
      "description": "string (what the task involves)",
      "sourceRef": "string (page/section where found)",
      "suggestedLevel": 1-6 (Bloom's cognitive level estimate)
    }
  ]
}

### Guidelines

- Extract ACTUAL tasks mentioned in the material
- Do not invent tasks not in the source
- Focus on performance-based tasks
- Include safety-critical tasks
- Note the source location for each task`;

interface TaskExtractionResult {
  tasks: Array<{
    id: string;
    title: string;
    description: string;
    sourceRef: string;
    suggestedLevel?: number;
  }>;
}

/**
 * Extract trainable tasks from document content using AI
 */
export async function extractTasks(client: AIClient, content: DocumentContent): Promise<Task[]> {
  // For large documents, process in chunks
  const chunks = chunkContent(content.text, 15000);
  const allTasks: Task[] = [];
  let taskCounter = 1;

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const chunkRef = chunks.length > 1 ? ` (Part ${i + 1}/${chunks.length})` : '';

    const userPrompt = `Extract trainable tasks from the following content.

Source Document: ${content.title}${chunkRef}

Content:
${chunk}

Return the tasks as JSON with a "tasks" array.`;

    try {
      const result = await client.promptJSON<TaskExtractionResult>(
        TASK_EXTRACTION_PROMPT,
        userPrompt
      );

      // Convert to Task type with sequential IDs
      for (const task of result.tasks) {
        allTasks.push({
          id: `TASK-${String(taskCounter++).padStart(3, '0')}`,
          title: task.title,
          description: task.description,
          sourceRef: task.sourceRef,
          suggestedLevel: validateCognitiveLevel(task.suggestedLevel),
        });
      }
    } catch (error) {
      console.error(`Error extracting tasks from chunk ${i + 1}:`, error);
      // Continue with other chunks
    }
  }

  // Deduplicate similar tasks
  return deduplicateTasks(allTasks);
}

/**
 * Split content into chunks for processing
 */
function chunkContent(text: string, maxChunkSize: number): string[] {
  const chunks: string[] = [];

  if (text.length <= maxChunkSize) {
    return [text];
  }

  // Try to split on paragraph boundaries
  const paragraphs = text.split(/\n\n+/);
  let currentChunk = '';

  for (const para of paragraphs) {
    if (currentChunk.length + para.length + 2 > maxChunkSize) {
      if (currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
      }
      // Handle paragraphs larger than chunk size
      if (para.length > maxChunkSize) {
        // Split by sentences as fallback
        const sentences = para.match(/[^.!?]+[.!?]+/g) || [para];
        currentChunk = '';
        for (const sentence of sentences) {
          if (currentChunk.length + sentence.length > maxChunkSize) {
            chunks.push(currentChunk.trim());
            currentChunk = sentence;
          } else {
            currentChunk += sentence;
          }
        }
      } else {
        currentChunk = para;
      }
    } else {
      currentChunk += (currentChunk.length > 0 ? '\n\n' : '') + para;
    }
  }

  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

/**
 * Validate and constrain cognitive level to valid range
 */
function validateCognitiveLevel(level: number | undefined): CognitiveLevel | undefined {
  if (level === undefined) return undefined;
  if (level < 1) return 1;
  if (level > 6) return 6;
  return level as CognitiveLevel;
}

/**
 * Remove duplicate or very similar tasks
 */
function deduplicateTasks(tasks: Task[]): Task[] {
  const seen = new Set<string>();
  const result: Task[] = [];

  for (const task of tasks) {
    // Create a normalized key for comparison
    const key = task.title.toLowerCase().replace(/[^a-z0-9]/g, '');

    if (!seen.has(key)) {
      seen.add(key);
      result.push(task);
    }
  }

  return result;
}

/**
 * Filter tasks by suggested cognitive level
 */
export function filterTasksByLevel(
  tasks: Task[],
  minLevel: CognitiveLevel,
  maxLevel: CognitiveLevel
): Task[] {
  return tasks.filter((task) => {
    if (!task.suggestedLevel) return true;
    return task.suggestedLevel >= minLevel && task.suggestedLevel <= maxLevel;
  });
}
