/**
 * ELO Generator - Create Enabling Learning Objectives from TLOs
 */
import { AIClient } from '../ai/client';
import { TLO, ELO, CognitiveLevel, DocumentContent } from '../types';
import { ELO_SYSTEM_PROMPT, ELO_USER_PROMPT_TEMPLATE } from '../ai/prompts/elo-prompt';
import { validateMagerFormat, validateELOLevel, ValidationResult } from '../ai/validators';
import { processBatches, ParallelOptions } from '../utils/parallel';

interface ELOGenerationResult {
  elos: Array<{
    id: string;
    parentId: string;
    condition: string;
    behavior: string;
    standard: string;
    cognitiveLevel: number;
    verb: string;
    justification: string;
    sourceRef: string;
    sequenceOrder: number;
  }>;
}

export interface GeneratedELO extends ELO {
  validation: ValidationResult;
  sequenceOrder: number;
}

/**
 * Generate ELOs from TLOs
 */
export async function generateELOs(
  client: AIClient,
  tlos: TLO[],
  content: DocumentContent,
  options: ParallelOptions = {}
): Promise<GeneratedELO[]> {
  const batchSize = 3;

  const batchResults = await processBatches(
    tlos,
    batchSize,
    async (batch, batchIndex) => {
      const tlosJson = JSON.stringify(
        batch.map((t) => ({
          id: t.id,
          condition: t.condition,
          behavior: t.behavior,
          standard: t.standard,
          cognitiveLevel: t.cognitiveLevel,
          verb: t.verb,
          trEventId: t.trEventId,
        })),
        null,
        2
      );

      const userPrompt = ELO_USER_PROMPT_TEMPLATE.replace('{{documentTitle}}', content.title)
        .replace('{{tlos}}', tlosJson)
        .replace('{{content}}', content.text.slice(0, 10000));

      try {
        const result = await client.promptJSON<ELOGenerationResult>(ELO_SYSTEM_PROMPT, userPrompt);

        return result.elos.map((elo, eloIndex) => {
          // Find parent TLO for level validation
          const parentTLO = tlos.find((t) => t.id === elo.parentId);
          const cogLevel = validateCognitiveLevel(elo.cognitiveLevel);

          const learningObj: ELO = {
            id: '', // Will be assigned after sorting
            type: 'ELO',
            parentId: elo.parentId,
            trEventId: parentTLO?.trEventId || elo.parentId,
            condition: elo.condition,
            behavior: elo.behavior,
            standard: elo.standard,
            cognitiveLevel: cogLevel,
            verb: elo.verb,
            justification: elo.justification,
            sourceRef: elo.sourceRef,
          };

          // Validate the ELO
          const magerValidation = validateMagerFormat(learningObj);

          // Also validate ELO level against parent TLO
          if (parentTLO) {
            const levelValidation = validateELOLevel(cogLevel, parentTLO.cognitiveLevel);
            magerValidation.warnings.push(...levelValidation.warnings);
          }

          return {
            ...learningObj,
            validation: magerValidation,
            sequenceOrder: elo.sequenceOrder || 1,
            _batchIndex: batchIndex,
            _eloIndex: eloIndex,
          };
        });
      } catch (error) {
        console.error(`Error generating ELOs for batch ${batchIndex}:`, error);
        return [];
      }
    },
    options
  );

  // Sort by parent then sequence
  batchResults.sort((a, b) => {
    const parentA = a.parentId || '';
    const parentB = b.parentId || '';
    if (parentA !== parentB) {
      return parentA.localeCompare(parentB);
    }
    return a.sequenceOrder - b.sequenceOrder;
  });

  // Assign sequential IDs after sorting
  return batchResults.map((elo, index) => {
    const eloId = `ELO-${String(index + 1).padStart(3, '0')}`;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _batchIndex, _eloIndex, ...rest } = elo as GeneratedELO & { _batchIndex: number; _eloIndex: number };
    return { ...rest, id: eloId };
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
 * Get ELOs for a specific TLO
 */
export function getELOsForTLO(elos: GeneratedELO[], tloId: string): GeneratedELO[] {
  return elos
    .filter((elo) => elo.parentId === tloId)
    .sort((a, b) => a.sequenceOrder - b.sequenceOrder);
}

/**
 * Build TLO-ELO hierarchy
 */
export function buildObjectiveHierarchy(
  tlos: TLO[],
  elos: GeneratedELO[]
): Map<string, { tlo: TLO; elos: GeneratedELO[] }> {
  const hierarchy = new Map<string, { tlo: TLO; elos: GeneratedELO[] }>();

  for (const tlo of tlos) {
    hierarchy.set(tlo.id, {
      tlo,
      elos: getELOsForTLO(elos, tlo.id),
    });
  }

  return hierarchy;
}

/**
 * Validate learning sequence (knowledge before application)
 */
export function validateLearningSequence(elos: GeneratedELO[]): ValidationResult {
  const result: ValidationResult = { valid: true, errors: [], warnings: [] };

  // Group by parent
  const byParent = new Map<string, GeneratedELO[]>();
  for (const elo of elos) {
    const existing = byParent.get(elo.parentId) || [];
    existing.push(elo);
    byParent.set(elo.parentId, existing);
  }

  // Check each group
  for (const [parentId, children] of byParent) {
    const sorted = [...children].sort((a, b) => a.sequenceOrder - b.sequenceOrder);

    for (let i = 0; i < sorted.length - 1; i++) {
      const current = sorted[i];
      const next = sorted[i + 1];

      // Generally, lower cognitive levels should come before higher ones
      if (current.cognitiveLevel > next.cognitiveLevel && current.cognitiveLevel > 2) {
        result.warnings.push(
          `ELO sequence for ${parentId}: "${current.id}" (Level ${current.cognitiveLevel}) ` +
            `appears before "${next.id}" (Level ${next.cognitiveLevel}). ` +
            `Consider reordering so knowledge precedes application.`
        );
      }
    }
  }

  return result;
}
