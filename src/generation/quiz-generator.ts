/**
 * Quiz Generator - Create assessment items from ELOs
 */
import { AIClient } from '../ai/client';
import { ELO, QuizItem, DocumentContent } from '../types';
import { QUIZ_SYSTEM_PROMPT, QUIZ_USER_PROMPT_TEMPLATE } from '../ai/prompts/quiz-prompt';
import { validateQuizItem, ValidationResult } from '../ai/validators';
import { processBatches, ParallelOptions } from '../utils/parallel';

interface QuizGenerationResult {
  questions: Array<{
    id: string;
    eloId: string;
    question: string;
    options: Array<{
      label: string;
      text: string;
      isCorrect: boolean;
    }>;
    explanation: string;
    sourceRef: string;
  }>;
}

export interface GeneratedQuizItem extends QuizItem {
  validation: ValidationResult;
}

/**
 * Generate quiz questions from ELOs
 */
export async function generateQuiz(
  client: AIClient,
  elos: ELO[],
  content: DocumentContent,
  questionCount: number = 20,
  options: ParallelOptions = {}
): Promise<GeneratedQuizItem[]> {
  // Calculate questions per ELO (distribute evenly)
  const questionsPerELO = Math.ceil(questionCount / elos.length);
  const batchSize = 5;

  // For parallel processing, we need to estimate questions per batch upfront
  const batchResults = await processBatches(
    elos,
    batchSize,
    async (batch, batchIndex) => {
      const elosJson = JSON.stringify(
        batch.map((e) => ({
          id: e.id,
          parentId: e.parentId,
          condition: e.condition,
          behavior: e.behavior,
          standard: e.standard,
          cognitiveLevel: e.cognitiveLevel,
          verb: e.verb,
        })),
        null,
        2
      );

      const batchQuestionCount = Math.min(batch.length * questionsPerELO, Math.ceil(questionCount / Math.ceil(elos.length / batchSize)));

      const userPrompt = QUIZ_USER_PROMPT_TEMPLATE.replace('{{count}}', String(batchQuestionCount))
        .replace('{{documentTitle}}', content.title)
        .replace('{{elos}}', elosJson)
        .replace('{{content}}', content.text.slice(0, 10000));

      try {
        const result = await client.promptJSON<QuizGenerationResult>(QUIZ_SYSTEM_PROMPT, userPrompt);

        return result.questions.map((question, qIndex) => {
          const quizItem: QuizItem = {
            id: '', // Will be assigned after all batches complete
            eloId: question.eloId,
            question: question.question,
            options: question.options,
            explanation: question.explanation,
            sourceRef: question.sourceRef,
          };

          const validation = validateQuizItem(quizItem);
          return { ...quizItem, validation, _batchIndex: batchIndex, _qIndex: qIndex };
        });
      } catch (error) {
        console.error(`Error generating quiz questions for batch ${batchIndex}:`, error);
        return [];
      }
    },
    options
  );

  // Limit to requested question count and assign IDs
  return batchResults.slice(0, questionCount).map((question, index) => {
    const questionId = `Q-${String(index + 1).padStart(3, '0')}`;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _batchIndex, _qIndex, ...rest } = question as GeneratedQuizItem & { _batchIndex: number; _qIndex: number };
    return { ...rest, id: questionId };
  });
}

/**
 * Generate an answer key from quiz items
 */
export function generateAnswerKey(questions: QuizItem[]): AnswerKey {
  return {
    generatedAt: new Date(),
    answers: questions.map((q) => {
      const correct = q.options.find((o) => o.isCorrect);
      return {
        questionId: q.id,
        correctAnswer: correct?.label || 'A',
        explanation: q.explanation,
        eloId: q.eloId,
      };
    }),
  };
}

export interface AnswerKey {
  generatedAt: Date;
  answers: Array<{
    questionId: string;
    correctAnswer: string;
    explanation: string;
    eloId: string;
  }>;
}

/**
 * Format quiz for display (without answers)
 */
export function formatQuizForStudent(questions: QuizItem[]): string {
  const lines: string[] = [];

  lines.push('# Assessment');
  lines.push('');
  lines.push('Instructions: Select the best answer for each question.');
  lines.push('');

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    lines.push(`**${i + 1}. ${q.question}**`);
    lines.push('');
    for (const opt of q.options) {
      lines.push(`   ${opt.label}. ${opt.text}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Format quiz with answers (instructor version)
 */
export function formatQuizForInstructor(questions: QuizItem[]): string {
  const lines: string[] = [];

  lines.push('# Assessment - Instructor Version');
  lines.push('');

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const correct = q.options.find((o) => o.isCorrect);

    lines.push(`**${i + 1}. ${q.question}**`);
    lines.push(`   (ELO: ${q.eloId}, Source: ${q.sourceRef})`);
    lines.push('');
    for (const opt of q.options) {
      const marker = opt.isCorrect ? '✓' : ' ';
      lines.push(`   ${marker} ${opt.label}. ${opt.text}`);
    }
    lines.push('');
    lines.push(`   **Correct Answer: ${correct?.label}**`);
    lines.push(`   **Explanation:** ${q.explanation}`);
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Get questions by ELO coverage
 */
export function getELOCoverage(questions: QuizItem[]): Map<string, number> {
  const coverage = new Map<string, number>();

  for (const q of questions) {
    const count = coverage.get(q.eloId) || 0;
    coverage.set(q.eloId, count + 1);
  }

  return coverage;
}

/**
 * Check for ELOs without questions
 */
export function findUncoveredELOs(elos: ELO[], questions: QuizItem[]): ELO[] {
  const covered = new Set(questions.map((q) => q.eloId));
  return elos.filter((e) => !covered.has(e.id));
}
