/**
 * MLF Generator - Create Master Lesson File sections from TLOs and ELOs
 */
import { AIClient } from '../ai/client';
import { TLO, ELO, MLFSection, DocumentContent } from '../types';
import { MLF_SYSTEM_PROMPT, MLF_USER_PROMPT_TEMPLATE } from '../ai/prompts/mlf-prompt';
import { processBatches, ParallelOptions } from '../utils/parallel';

interface MLFGenerationResult {
  sections: Array<{
    title: string;
    tloId: string;
    introduction: {
      gainAttention: string;
      overview: string;
      objectives: string[];
    };
    body: {
      mainPoints: Array<{
        title: string;
        content: string;
        subPoints?: string[];
      }>;
    };
    practicalApplication: {
      scenario: string;
      steps: string[];
    };
    conclusion: {
      summary: string;
      closingStatement: string;
    };
  }>;
}

export interface GeneratedMLFSection extends MLFSection {
  /** Associated TLO */
  tlo: TLO;
  /** Supporting ELOs */
  elos: ELO[];
}

/**
 * Generate MLF sections from TLOs and ELOs
 */
export async function generateMLF(
  client: AIClient,
  tlos: TLO[],
  elos: ELO[],
  content: DocumentContent,
  options: ParallelOptions = {}
): Promise<GeneratedMLFSection[]> {
  // Build TLO-ELO associations
  const tloWithElos = tlos.map((tlo) => ({
    tlo,
    elos: elos.filter((e) => e.parentId === tlo.id),
  }));

  const batchSize = 2;

  const batchResults = await processBatches(
    tloWithElos,
    batchSize,
    async (batch, batchIndex) => {
      const tlosWithElosJson = JSON.stringify(
        batch.map(({ tlo, elos: tloElos }) => ({
          tlo: {
            id: tlo.id,
            condition: tlo.condition,
            behavior: tlo.behavior,
            standard: tlo.standard,
            verb: tlo.verb,
            cognitiveLevel: tlo.cognitiveLevel,
          },
          elos: tloElos.map((e) => ({
            id: e.id,
            condition: e.condition,
            behavior: e.behavior,
            standard: e.standard,
            verb: e.verb,
            cognitiveLevel: e.cognitiveLevel,
          })),
        })),
        null,
        2
      );

      const userPrompt = MLF_USER_PROMPT_TEMPLATE.replace('{{documentTitle}}', content.title)
        .replace('{{tlosWithElos}}', tlosWithElosJson)
        .replace('{{content}}', content.text.slice(0, 12000));

      try {
        const result = await client.promptJSON<MLFGenerationResult>(MLF_SYSTEM_PROMPT, userPrompt);

        const sections: GeneratedMLFSection[] = [];
        for (const section of result.sections) {
          const tloData = batch.find((b) => b.tlo.id === section.tloId);

          if (tloData) {
            sections.push({
              title: section.title,
              tloId: section.tloId,
              introduction: section.introduction,
              body: section.body,
              practicalApplication: section.practicalApplication,
              conclusion: section.conclusion,
              tlo: tloData.tlo,
              elos: tloData.elos,
            });
          }
        }
        return sections;
      } catch (error) {
        console.error(`Error generating MLF sections for batch ${batchIndex}:`, error);
        return [];
      }
    },
    options
  );

  return batchResults;
}

/**
 * Generate a complete MLF document structure
 */
export function buildMLFDocument(sections: GeneratedMLFSection[], docTitle: string): MLFDocument {
  return {
    title: docTitle,
    createdAt: new Date(),
    sections,
    tableOfContents: sections.map((s, i) => ({
      number: i + 1,
      title: s.title,
      tloId: s.tloId,
    })),
  };
}

export interface MLFDocument {
  title: string;
  createdAt: Date;
  sections: GeneratedMLFSection[];
  tableOfContents: Array<{
    number: number;
    title: string;
    tloId: string;
  }>;
}

/**
 * Format MLF section for display
 */
export function formatMLFSection(section: MLFSection): string {
  const lines: string[] = [];

  lines.push(`# ${section.title}`);
  lines.push(`TLO: ${section.tloId}`);
  lines.push('');

  // Introduction
  lines.push('## Introduction');
  lines.push('');
  lines.push('### Gain Attention');
  lines.push(section.introduction.gainAttention);
  lines.push('');
  lines.push('### Overview');
  lines.push(section.introduction.overview);
  lines.push('');
  lines.push('### Objectives');
  for (const obj of section.introduction.objectives) {
    lines.push(`- ${obj}`);
  }
  lines.push('');

  // Body
  lines.push('## Body');
  lines.push('');
  for (const point of section.body.mainPoints) {
    lines.push(`### ${point.title}`);
    lines.push(point.content);
    if (point.subPoints && point.subPoints.length > 0) {
      lines.push('');
      for (const sub of point.subPoints) {
        lines.push(`- ${sub}`);
      }
    }
    lines.push('');
  }

  // Practical Application
  lines.push('## Practical Application');
  lines.push('');
  lines.push('### Scenario');
  lines.push(section.practicalApplication.scenario);
  lines.push('');
  lines.push('### Steps');
  for (let i = 0; i < section.practicalApplication.steps.length; i++) {
    lines.push(`${i + 1}. ${section.practicalApplication.steps[i]}`);
  }
  lines.push('');

  // Conclusion
  lines.push('## Conclusion');
  lines.push('');
  lines.push('### Summary');
  lines.push(section.conclusion.summary);
  lines.push('');
  lines.push('### Closing Statement');
  lines.push(section.conclusion.closingStatement);

  return lines.join('\n');
}
