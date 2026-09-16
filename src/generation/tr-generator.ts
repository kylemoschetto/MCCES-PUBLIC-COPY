/**
 * T&R Event Generator - Create Training & Readiness events from tasks
 */
import { AIClient } from '../ai/client';
import { Task, TREvent, DocumentContent } from '../types';
import { TR_SYSTEM_PROMPT, TR_USER_PROMPT_TEMPLATE } from '../ai/prompts/tr-prompt';
import { validateTREvent, ValidationResult } from '../ai/validators';
import { processBatches, ParallelOptions } from '../utils/parallel';

interface TRGenerationResult {
  events: Array<{
    id: string;
    title: string;
    condition: string;
    standard: string;
    performanceSteps: string[];
    sourceRef: string;
  }>;
}

export interface GeneratedTREvent extends TREvent {
  validation: ValidationResult;
}

/**
 * Generate T&R events from extracted tasks
 */
export async function generateTREvents(
  client: AIClient,
  tasks: Task[],
  content: DocumentContent,
  options: ParallelOptions = {}
): Promise<GeneratedTREvent[]> {
  const batchSize = 5;

  const batchResults = await processBatches(
    tasks,
    batchSize,
    async (batch, batchIndex) => {
      const taskList = batch
        .map((t, i) => `${i + 1}. ${t.title}\n   Description: ${t.description}\n   Source: ${t.sourceRef}`)
        .join('\n\n');

      // Get relevant content for these tasks
      const relevantContent = extractRelevantContent(content, batch);

      const userPrompt = TR_USER_PROMPT_TEMPLATE.replace('{{documentTitle}}', content.title).replace(
        '{{content}}',
        relevantContent
      );

      try {
        const result = await client.promptJSON<TRGenerationResult>(
          TR_SYSTEM_PROMPT,
          userPrompt.replace('{{content}}', taskList + '\n\nRelevant Source Content:\n' + relevantContent)
        );

        return result.events.map((event, eventIndex) => {
          const trEvent: TREvent = {
            id: '', // Will be assigned after all batches complete
            title: event.title,
            condition: event.condition,
            standard: event.standard,
            performanceSteps: event.performanceSteps,
            sourceRef: event.sourceRef,
          };

          const validation = validateTREvent(trEvent);
          return { ...trEvent, validation, _batchIndex: batchIndex, _eventIndex: eventIndex };
        });
      } catch (error) {
        console.error(`Error generating T&R events for batch ${batchIndex}:`, error);
        return [];
      }
    },
    options
  );

  // Assign sequential IDs after all batches complete
  return batchResults.map((event, index) => {
    const eventId = `0621-ANT-${String(index + 1).padStart(4, '0')}`;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _batchIndex, _eventIndex, ...rest } = event as GeneratedTREvent & { _batchIndex: number; _eventIndex: number };
    return { ...rest, id: eventId };
  });
}

/**
 * Extract content relevant to the given tasks
 */
function extractRelevantContent(content: DocumentContent, tasks: Task[]): string {
  // If we have sections, try to find relevant ones
  if (content.sections && content.sections.length > 0) {
    const relevantSections: string[] = [];

    for (const task of tasks) {
      // Look for sections that might relate to this task
      const keywords = task.title.toLowerCase().split(' ').filter((w) => w.length > 3);

      for (const section of content.sections) {
        const sectionText = (section.heading + ' ' + section.content).toLowerCase();
        const matches = keywords.filter((kw) => sectionText.includes(kw));

        if (matches.length >= 2) {
          relevantSections.push(`## ${section.heading}\n${section.content}`);
        }
      }
    }

    if (relevantSections.length > 0) {
      // Limit to avoid token overflow
      return relevantSections.slice(0, 5).join('\n\n').slice(0, 10000);
    }
  }

  // Fallback: return beginning of document (limited)
  return content.text.slice(0, 8000);
}

/**
 * Generate T&R events directly from document content (without pre-extracted tasks)
 */
export async function generateTREventsFromContent(
  client: AIClient,
  content: DocumentContent,
  maxEvents: number = 10
): Promise<GeneratedTREvent[]> {
  const userPrompt = TR_USER_PROMPT_TEMPLATE.replace('{{documentTitle}}', content.title).replace(
    '{{content}}',
    content.text.slice(0, 15000)
  );

  const fullPrompt = userPrompt + `\n\nGenerate up to ${maxEvents} T&R events.`;

  try {
    const result = await client.promptJSON<TRGenerationResult>(TR_SYSTEM_PROMPT, fullPrompt);

    return result.events.map((event, index) => {
      const eventId = `0621-ANT-${String(index + 1).padStart(4, '0')}`;

      const trEvent: TREvent = {
        id: eventId,
        title: event.title,
        condition: event.condition,
        standard: event.standard,
        performanceSteps: event.performanceSteps,
        sourceRef: event.sourceRef,
      };

      return {
        ...trEvent,
        validation: validateTREvent(trEvent),
      };
    });
  } catch (error) {
    console.error('Error generating T&R events:', error);
    throw error;
  }
}
