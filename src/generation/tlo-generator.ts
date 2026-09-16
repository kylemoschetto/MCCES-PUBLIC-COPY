/**
 * TLO Generator - Create Terminal Learning Objectives from T&R events
 */
import { AIClient } from '../ai/client';
import { TREvent, TLO, CognitiveLevel, DocumentContent } from '../types';
import { TLO_SYSTEM_PROMPT, TLO_USER_PROMPT_TEMPLATE } from '../ai/prompts/tlo-prompt';
import { validateMagerFormat, ValidationResult } from '../ai/validators';
import { processBatches, ParallelOptions } from '../utils/parallel';

interface TLOGenerationResult {
  tlos: Array<{
    id: string;
    trEventId: string;
    condition: string;
    behavior: string;
    standard: string;
    cognitiveLevel: number;
    verb: string;
    justification: string;
    sourceRef: string;
  }>;
}

export interface GeneratedTLO extends TLO {
  validation: ValidationResult;
}

/**
 * Generate TLOs from T&R events
 */
export async function generateTLOs(
  client: AIClient,
  events: TREvent[],
  content: DocumentContent,
  options: ParallelOptions = {}
): Promise<GeneratedTLO[]> {
  const batchSize = 5;

  const batchResults = await processBatches(
    events,
    batchSize,
    async (batch, batchIndex) => {
      const eventsJson = JSON.stringify(
        batch.map((e) => ({
          id: e.id,
          title: e.title,
          condition: e.condition,
          standard: e.standard,
          performanceSteps: e.performanceSteps,
          sourceRef: e.sourceRef,
        })),
        null,
        2
      );

      const userPrompt = TLO_USER_PROMPT_TEMPLATE.replace('{{documentTitle}}', content.title).replace(
        '{{events}}',
        eventsJson
      );

      try {
        const result = await client.promptJSON<TLOGenerationResult>(TLO_SYSTEM_PROMPT, userPrompt);

        return result.tlos.map((tlo, tloIndex) => {
          const learningObj: TLO = {
            id: '', // Will be assigned after all batches complete
            type: 'TLO',
            trEventId: tlo.trEventId,
            condition: tlo.condition,
            behavior: tlo.behavior,
            standard: tlo.standard,
            cognitiveLevel: validateCognitiveLevel(tlo.cognitiveLevel),
            verb: tlo.verb,
            justification: tlo.justification,
            sourceRef: tlo.sourceRef,
          };

          const validation = validateMagerFormat(learningObj);
          return { ...learningObj, validation, _batchIndex: batchIndex, _tloIndex: tloIndex };
        });
      } catch (error) {
        console.error(`Error generating TLOs for batch ${batchIndex}:`, error);
        return [];
      }
    },
    options
  );

  // Assign sequential IDs after all batches complete
  return batchResults.map((tlo, index) => {
    const tloId = `TLO-${String(index + 1).padStart(3, '0')}`;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _batchIndex, _tloIndex, ...rest } = tlo as GeneratedTLO & { _batchIndex: number; _tloIndex: number };
    return { ...rest, id: tloId };
  });
}

/**
 * Validate and constrain cognitive level
 */
function validateCognitiveLevel(level: number): CognitiveLevel {
  if (level < 1) return 1;
  if (level > 6) return 6;
  return level as CognitiveLevel;
}

/**
 * Generate TLOs directly from content (for simpler workflows)
 */
export async function generateTLOsFromContent(
  client: AIClient,
  content: DocumentContent,
  maxTLOs: number = 10
): Promise<GeneratedTLO[]> {
  // Create a simplified prompt for direct generation
  const simplifiedPrompt = `${TLO_SYSTEM_PROMPT}

Analyze the document and create ${maxTLOs} Terminal Learning Objectives for the main skills described.`;

  const userPrompt = `Source Document: ${content.title}

Content:
${content.text.slice(0, 15000)}

Create up to ${maxTLOs} TLOs for the key skills in this document.
Return as JSON with a "tlos" array.`;

  try {
    const result = await client.promptJSON<TLOGenerationResult>(simplifiedPrompt, userPrompt);

    return result.tlos.map((tlo, index) => {
      const tloId = `TLO-${String(index + 1).padStart(3, '0')}`;

      const learningObj: TLO = {
        id: tloId,
        type: 'TLO',
        trEventId: tlo.trEventId || tloId,
        condition: tlo.condition,
        behavior: tlo.behavior,
        standard: tlo.standard,
        cognitiveLevel: validateCognitiveLevel(tlo.cognitiveLevel),
        verb: tlo.verb,
        justification: tlo.justification,
        sourceRef: tlo.sourceRef,
      };

      return {
        ...learningObj,
        validation: validateMagerFormat(learningObj),
      };
    });
  } catch (error) {
    console.error('Error generating TLOs:', error);
    throw error;
  }
}

/**
 * Filter TLOs by validation status
 */
export function filterValidTLOs(tlos: GeneratedTLO[]): GeneratedTLO[] {
  return tlos.filter((tlo) => tlo.validation.valid);
}

/**
 * Get TLOs with validation warnings
 */
export function getTLOsWithWarnings(tlos: GeneratedTLO[]): GeneratedTLO[] {
  return tlos.filter((tlo) => tlo.validation.warnings.length > 0);
}
