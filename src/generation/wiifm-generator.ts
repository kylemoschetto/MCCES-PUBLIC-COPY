/**
 * WIIFM Generator - Create What's In It For Me checklists from TLOs and MLF
 */
import { AIClient } from '../ai/client';
import { TLO, WIIFMChecklist, WIIFMCategory, DocumentContent } from '../types';
import { WIIFM_SYSTEM_PROMPT, WIIFM_USER_PROMPT_TEMPLATE } from '../ai/prompts/wiifm-prompt';
import { processBatches, ParallelOptions } from '../utils/parallel';
import { GeneratedMLFSection } from './mlf-generator';

interface WIIFMGenerationResult {
  checklists: Array<{
    id: string;
    tloId: string;
    lessonTitle: string;
    categories: WIIFMCategory[];
    formula: string;
    sourceRef: string;
  }>;
}

export interface GeneratedWIIFMChecklist extends WIIFMChecklist {
  /** Associated TLO */
  tlo: TLO;
}

/**
 * Generate WIIFM checklists from TLOs and MLF sections
 */
export async function generateWIIFM(
  client: AIClient,
  tlos: TLO[],
  mlfSections: GeneratedMLFSection[],
  content: DocumentContent,
  options: ParallelOptions = {}
): Promise<GeneratedWIIFMChecklist[]> {
  // Build TLO-MLF associations
  const tloWithMlf = tlos.map((tlo) => ({
    tlo,
    mlf: mlfSections.find((m) => m.tloId === tlo.id),
  }));

  const batchSize = 2;

  const batchResults = await processBatches(
    tloWithMlf,
    batchSize,
    async (batch, batchIndex) => {
      const tlosContextJson = JSON.stringify(
        batch.map(({ tlo }) => ({
          id: tlo.id,
          condition: tlo.condition,
          behavior: tlo.behavior,
          standard: tlo.standard,
          verb: tlo.verb,
          cognitiveLevel: tlo.cognitiveLevel,
          sourceRef: tlo.sourceRef,
        })),
        null,
        2
      );

      const mlfContextJson = JSON.stringify(
        batch
          .filter(({ mlf }) => mlf)
          .map(({ mlf }) => ({
            tloId: mlf!.tloId,
            title: mlf!.title,
            gainAttention: mlf!.introduction.gainAttention,
            overview: mlf!.introduction.overview,
            mainPoints: mlf!.body.mainPoints.map((p) => p.title),
            practicalScenario: mlf!.practicalApplication.scenario,
          })),
        null,
        2
      );

      const userPrompt = WIIFM_USER_PROMPT_TEMPLATE.replace('{{documentTitle}}', content.title)
        .replace('{{tlosContext}}', tlosContextJson)
        .replace('{{mlfContext}}', mlfContextJson)
        .replace('{{content}}', content.text.slice(0, 10000));

      try {
        const result = await client.promptJSON<WIIFMGenerationResult>(WIIFM_SYSTEM_PROMPT, userPrompt);

        const checklists: GeneratedWIIFMChecklist[] = [];
        for (const checklist of result.checklists) {
          const tloData = batch.find((b) => b.tlo.id === checklist.tloId);

          if (tloData) {
            checklists.push({
              id: checklist.id,
              tloId: checklist.tloId,
              lessonTitle: checklist.lessonTitle,
              categories: checklist.categories,
              formula: checklist.formula,
              sourceRef: checklist.sourceRef,
              tlo: tloData.tlo,
            });
          }
        }
        return checklists;
      } catch (error) {
        console.error(`Error generating WIIFM checklists for batch ${batchIndex}:`, error);
        return [];
      }
    },
    options
  );

  return batchResults;
}

/**
 * Format WIIFM checklist for display
 */
export function formatWIIFMChecklist(checklist: WIIFMChecklist): string {
  const lines: string[] = [];

  lines.push(`# WIIFM: ${checklist.lessonTitle}`);
  lines.push(`TLO: ${checklist.tloId}`);
  lines.push('');

  // Formula
  lines.push('## One-Line WIIFM');
  lines.push(`> ${checklist.formula}`);
  lines.push('');

  // Categories
  for (const category of checklist.categories) {
    lines.push(`## ${category.name}`);
    lines.push('');
    for (const qa of category.questions) {
      lines.push(`**Q:** ${qa.question}`);
      lines.push(`**A:** ${qa.answer}`);
      lines.push('');
    }
  }

  lines.push(`*Source: ${checklist.sourceRef}*`);

  return lines.join('\n');
}
