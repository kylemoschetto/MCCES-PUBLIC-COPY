/**
 * Markdown Export - Generate markdown files from curriculum artifacts
 */
import * as fs from 'fs';
import * as path from 'path';
import { TREvent, TLO, ELO, QuizItem, MLFSection, COGNITIVE_LEVELS } from '../types';
import { GeneratedTLO } from '../generation/tlo-generator';
import { GeneratedELO } from '../generation/elo-generator';
import { GeneratedMLFSection } from '../generation/mlf-generator';

/**
 * Export T&R events to markdown
 */
export function exportTREventsToMarkdown(events: TREvent[], title: string): string {
  const lines: string[] = [];

  lines.push(`# T&R Events: ${title}`);
  lines.push('');
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push('');
  lines.push('---');
  lines.push('');

  for (const event of events) {
    lines.push(`## ${event.id}: ${event.title}`);
    lines.push('');
    lines.push('### Condition');
    lines.push(event.condition);
    lines.push('');
    lines.push('### Standard');
    lines.push(event.standard);
    lines.push('');
    lines.push('### Performance Steps');
    for (let i = 0; i < event.performanceSteps.length; i++) {
      lines.push(`${i + 1}. ${event.performanceSteps[i]}`);
    }
    lines.push('');
    lines.push(`**Source:** ${event.sourceRef}`);
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Export TLO/ELO matrix to markdown
 */
export function exportObjectiveMatrixToMarkdown(
  tlos: (TLO | GeneratedTLO)[],
  elos: (ELO | GeneratedELO)[],
  title: string
): string {
  const lines: string[] = [];

  lines.push(`# Learning Objectives Matrix: ${title}`);
  lines.push('');
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push('');
  lines.push('---');
  lines.push('');

  // Summary table
  lines.push('## Summary');
  lines.push('');
  lines.push('| ID | Type | Cognitive Level | Verb |');
  lines.push('|----|------|-----------------|------|');

  for (const tlo of tlos) {
    lines.push(
      `| ${tlo.id} | TLO | ${tlo.cognitiveLevel} - ${COGNITIVE_LEVELS[tlo.cognitiveLevel]} | ${tlo.verb} |`
    );
  }
  for (const elo of elos) {
    lines.push(
      `| ${elo.id} | ELO (${elo.parentId}) | ${elo.cognitiveLevel} - ${COGNITIVE_LEVELS[elo.cognitiveLevel]} | ${elo.verb} |`
    );
  }
  lines.push('');
  lines.push('---');
  lines.push('');

  // Detailed TLOs with their ELOs
  lines.push('## Detailed Objectives');
  lines.push('');

  for (const tlo of tlos) {
    lines.push(`### ${tlo.id}: Terminal Learning Objective`);
    lines.push('');
    lines.push(`**T&R Event:** ${tlo.trEventId}`);
    lines.push('');
    lines.push('**Condition:**');
    lines.push(`> ${tlo.condition}`);
    lines.push('');
    lines.push('**Behavior:**');
    lines.push(`> ${tlo.behavior}`);
    lines.push('');
    lines.push('**Standard:**');
    lines.push(`> ${tlo.standard}`);
    lines.push('');
    lines.push(
      `**Cognitive Level:** ${tlo.cognitiveLevel} - ${COGNITIVE_LEVELS[tlo.cognitiveLevel]}`
    );
    lines.push(`**Action Verb:** ${tlo.verb}`);
    lines.push('');
    lines.push('**Justification:**');
    lines.push(`> ${tlo.justification}`);
    lines.push('');
    lines.push(`**Source:** ${tlo.sourceRef}`);
    lines.push('');

    // Associated ELOs
    const tloElos = elos.filter((e) => e.parentId === tlo.id);
    if (tloElos.length > 0) {
      lines.push('#### Enabling Learning Objectives');
      lines.push('');
      for (const elo of tloElos) {
        lines.push(`##### ${elo.id}`);
        lines.push('');
        lines.push('**Condition:**');
        lines.push(`> ${elo.condition}`);
        lines.push('');
        lines.push('**Behavior:**');
        lines.push(`> ${elo.behavior}`);
        lines.push('');
        lines.push('**Standard:**');
        lines.push(`> ${elo.standard}`);
        lines.push('');
        lines.push(
          `**Cognitive Level:** ${elo.cognitiveLevel} - ${COGNITIVE_LEVELS[elo.cognitiveLevel]}`
        );
        lines.push(`**Action Verb:** ${elo.verb}`);
        lines.push('');
        lines.push('**Justification:**');
        lines.push(`> ${elo.justification}`);
        lines.push('');
        lines.push(`**Source:** ${elo.sourceRef}`);
        lines.push('');
      }
    }

    lines.push('---');
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Export MLF to markdown
 */
export function exportMLFToMarkdown(
  sections: (MLFSection | GeneratedMLFSection)[],
  title: string
): string {
  const lines: string[] = [];

  lines.push(`# Master Lesson File: ${title}`);
  lines.push('');
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push('');

  // Table of contents
  lines.push('## Table of Contents');
  lines.push('');
  for (let i = 0; i < sections.length; i++) {
    lines.push(`${i + 1}. [${sections[i].title}](#lesson-${i + 1})`);
  }
  lines.push('');
  lines.push('---');
  lines.push('');

  // Sections
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    lines.push(`<a name="lesson-${i + 1}"></a>`);
    lines.push(`## Lesson ${i + 1}: ${section.title}`);
    lines.push('');
    lines.push(`**TLO:** ${section.tloId}`);
    lines.push('');

    // Introduction
    lines.push('### Introduction');
    lines.push('');
    lines.push('#### Gain Attention');
    lines.push(section.introduction.gainAttention);
    lines.push('');
    lines.push('#### Overview');
    lines.push(section.introduction.overview);
    lines.push('');
    lines.push('#### Objectives');
    for (const obj of section.introduction.objectives) {
      lines.push(`- ${obj}`);
    }
    lines.push('');

    // Body
    lines.push('### Body');
    lines.push('');
    for (const point of section.body.mainPoints) {
      lines.push(`#### ${point.title}`);
      lines.push('');
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
    lines.push('### Practical Application');
    lines.push('');
    lines.push('#### Scenario');
    lines.push(section.practicalApplication.scenario);
    lines.push('');
    lines.push('#### Practice Steps');
    for (let j = 0; j < section.practicalApplication.steps.length; j++) {
      lines.push(`${j + 1}. ${section.practicalApplication.steps[j]}`);
    }
    lines.push('');

    // Conclusion
    lines.push('### Conclusion');
    lines.push('');
    lines.push('#### Summary');
    lines.push(section.conclusion.summary);
    lines.push('');
    lines.push('#### Closing Statement');
    lines.push(section.conclusion.closingStatement);
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Export quiz to markdown (student version)
 */
export function exportQuizToMarkdown(questions: QuizItem[], title: string): string {
  const lines: string[] = [];

  lines.push(`# Assessment: ${title}`);
  lines.push('');
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push('');
  lines.push('**Instructions:** Select the best answer for each question.');
  lines.push('');
  lines.push('---');
  lines.push('');

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    lines.push(`### ${i + 1}. ${q.question}`);
    lines.push('');
    for (const opt of q.options) {
      lines.push(`- [ ] **${opt.label}.** ${opt.text}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Export quiz answer key to markdown
 */
export function exportAnswerKeyToMarkdown(questions: QuizItem[], title: string): string {
  const lines: string[] = [];

  lines.push(`# Answer Key: ${title}`);
  lines.push('');
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push('');
  lines.push('---');
  lines.push('');

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const correct = q.options.find((o) => o.isCorrect);

    lines.push(`### ${i + 1}. ${q.question}`);
    lines.push('');
    lines.push(`**Correct Answer:** ${correct?.label}. ${correct?.text}`);
    lines.push('');
    lines.push(`**Explanation:** ${q.explanation}`);
    lines.push('');
    lines.push(`**ELO:** ${q.eloId} | **Source:** ${q.sourceRef}`);
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Write markdown content to file
 */
export async function writeMarkdownFile(content: string, filePath: string): Promise<void> {
  const dir = path.dirname(filePath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(filePath, content, 'utf-8');
}
