/**
 * Review Command - Interactive review of generated artifacts (Pass 2)
 */
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { GeneratedTLO } from '../../generation/tlo-generator';
import { GeneratedELO } from '../../generation/elo-generator';
import { GeneratedQuizItem } from '../../generation/quiz-generator';
import { ReviewItem, ReviewStatus, COGNITIVE_LEVELS } from '../../types';

export interface ReviewOptions {
  inputDir: string;
  outputDir: string;
}

type ReviewableItem = GeneratedTLO | GeneratedELO | GeneratedQuizItem;

/**
 * Execute the review command (Pass 2 - Interactive)
 */
export async function review(options: ReviewOptions): Promise<void> {
  console.log(chalk.blue.bold('\n=== Pass 2: Interactive Review ===\n'));

  const inputDir = path.resolve(options.inputDir);
  const outputDir = path.resolve(options.outputDir);

  if (!fs.existsSync(inputDir)) {
    throw new Error(`Input directory not found: ${inputDir}`);
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Review TLOs
  const tlosPath = path.join(inputDir, 'tlos.json');
  if (fs.existsSync(tlosPath)) {
    console.log(chalk.blue('\nReviewing TLOs...\n'));
    const tlos = JSON.parse(fs.readFileSync(tlosPath, 'utf-8')) as GeneratedTLO[];
    const reviewedTLOs = await reviewItems(tlos, 'TLO', formatTLO);
    const finalTLOs = reviewedTLOs.filter((r) => r.status === 'accepted' || r.status === 'modified');
    saveReviewResult(outputDir, 'tlos.json', finalTLOs.map((r) => r.modifiedItem || r.item));
    console.log(chalk.green(`  ✓ ${finalTLOs.length}/${tlos.length} TLOs accepted`));
  }

  // Review ELOs
  const elosPath = path.join(inputDir, 'elos.json');
  if (fs.existsSync(elosPath)) {
    console.log(chalk.blue('\nReviewing ELOs...\n'));
    const elos = JSON.parse(fs.readFileSync(elosPath, 'utf-8')) as GeneratedELO[];
    const reviewedELOs = await reviewItems(elos, 'ELO', formatELO);
    const finalELOs = reviewedELOs.filter((r) => r.status === 'accepted' || r.status === 'modified');
    saveReviewResult(outputDir, 'elos.json', finalELOs.map((r) => r.modifiedItem || r.item));
    console.log(chalk.green(`  ✓ ${finalELOs.length}/${elos.length} ELOs accepted`));
  }

  // Review Quiz Questions
  const quizPath = path.join(inputDir, 'quiz.json');
  if (fs.existsSync(quizPath)) {
    console.log(chalk.blue('\nReviewing Quiz Questions...\n'));
    const quiz = JSON.parse(fs.readFileSync(quizPath, 'utf-8')) as GeneratedQuizItem[];
    const reviewedQuiz = await reviewItems(quiz, 'Question', formatQuizItem);
    const finalQuiz = reviewedQuiz.filter((r) => r.status === 'accepted' || r.status === 'modified');
    saveReviewResult(outputDir, 'quiz.json', finalQuiz.map((r) => r.modifiedItem || r.item));
    console.log(chalk.green(`  ✓ ${finalQuiz.length}/${quiz.length} questions accepted`));
  }

  // Copy non-reviewed files
  const filesToCopy = ['tr-events.json', 'mlf.json'];
  for (const file of filesToCopy) {
    const srcPath = path.join(inputDir, file);
    const destPath = path.join(outputDir, file);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
    }
  }

  console.log(chalk.blue.bold('\n=== Review Complete ===\n'));
  console.log(chalk.gray(`Final artifacts saved to: ${outputDir}`));
}

/**
 * Review a list of items interactively
 */
async function reviewItems<T extends ReviewableItem>(
  items: T[],
  itemType: string,
  formatter: (item: T) => string
): Promise<ReviewItem<T>[]> {
  const reviewed: ReviewItem<T>[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    console.log(chalk.white(`\n--- ${itemType} ${i + 1}/${items.length} ---\n`));
    console.log(formatter(item));

    // Show validation issues if any
    if ('validation' in item && item.validation) {
      const validation = item.validation as { valid: boolean; errors: string[]; warnings: string[] };
      if (!validation.valid) {
        console.log(chalk.red('\nValidation Errors:'));
        for (const err of validation.errors) {
          console.log(chalk.red(`  • ${err}`));
        }
      }
      if (validation.warnings.length > 0) {
        console.log(chalk.yellow('\nWarnings:'));
        for (const warn of validation.warnings) {
          console.log(chalk.yellow(`  • ${warn}`));
        }
      }
    }

    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'Action:',
        choices: [
          { name: '[A]ccept', value: 'accepted' },
          { name: '[R]eject', value: 'rejected' },
          { name: '[M]odify', value: 'modified' },
          { name: '[S]kip remaining (accept all)', value: 'skip' },
        ],
      },
    ]);

    if (action === 'skip') {
      // Accept all remaining
      for (let j = i; j < items.length; j++) {
        reviewed.push({ item: items[j], status: 'accepted' });
      }
      break;
    }

    const reviewItem: ReviewItem<T> = {
      item,
      status: action as ReviewStatus,
    };

    if (action === 'rejected') {
      const { feedback } = await inquirer.prompt([
        {
          type: 'input',
          name: 'feedback',
          message: 'Reason for rejection:',
        },
      ]);
      reviewItem.feedback = feedback;
    }

    if (action === 'modified') {
      console.log(chalk.gray('(Modification will be noted for regeneration)'));
      const { feedback } = await inquirer.prompt([
        {
          type: 'input',
          name: 'feedback',
          message: 'What should be changed:',
        },
      ]);
      reviewItem.feedback = feedback;
      // In a full implementation, you would regenerate with feedback
      // For now, we'll just note the feedback and keep the original
      reviewItem.modifiedItem = item;
    }

    reviewed.push(reviewItem);
  }

  return reviewed;
}

/**
 * Format TLO for display
 */
function formatTLO(tlo: GeneratedTLO): string {
  return [
    chalk.bold(`ID: ${tlo.id}`),
    chalk.gray(`T&R Event: ${tlo.trEventId}`),
    '',
    chalk.cyan('Condition:'),
    `  ${tlo.condition}`,
    '',
    chalk.cyan('Behavior:'),
    `  ${tlo.behavior}`,
    '',
    chalk.cyan('Standard:'),
    `  ${tlo.standard}`,
    '',
    chalk.cyan(`Cognitive Level: ${tlo.cognitiveLevel} - ${COGNITIVE_LEVELS[tlo.cognitiveLevel]}`),
    chalk.cyan(`Verb: ${tlo.verb}`),
    '',
    chalk.cyan('Justification:'),
    chalk.gray(`  ${tlo.justification}`),
    '',
    chalk.gray(`Source: ${tlo.sourceRef}`),
  ].join('\n');
}

/**
 * Format ELO for display
 */
function formatELO(elo: GeneratedELO): string {
  return [
    chalk.bold(`ID: ${elo.id}`),
    chalk.gray(`Parent TLO: ${elo.parentId}`),
    '',
    chalk.cyan('Condition:'),
    `  ${elo.condition}`,
    '',
    chalk.cyan('Behavior:'),
    `  ${elo.behavior}`,
    '',
    chalk.cyan('Standard:'),
    `  ${elo.standard}`,
    '',
    chalk.cyan(`Cognitive Level: ${elo.cognitiveLevel} - ${COGNITIVE_LEVELS[elo.cognitiveLevel]}`),
    chalk.cyan(`Verb: ${elo.verb}`),
    '',
    chalk.gray(`Source: ${elo.sourceRef}`),
  ].join('\n');
}

/**
 * Format quiz item for display
 */
function formatQuizItem(item: GeneratedQuizItem): string {
  const correct = item.options.find((o) => o.isCorrect);
  const lines = [
    chalk.bold(`ID: ${item.id}`),
    chalk.gray(`ELO: ${item.eloId}`),
    '',
    chalk.cyan('Question:'),
    `  ${item.question}`,
    '',
    chalk.cyan('Options:'),
  ];

  for (const opt of item.options) {
    const marker = opt.isCorrect ? chalk.green('✓') : ' ';
    lines.push(`  ${marker} ${opt.label}. ${opt.text}`);
  }

  lines.push('');
  lines.push(chalk.cyan(`Correct Answer: ${correct?.label}`));
  lines.push(chalk.cyan('Explanation:'));
  lines.push(chalk.gray(`  ${item.explanation}`));
  lines.push('');
  lines.push(chalk.gray(`Source: ${item.sourceRef}`));

  return lines.join('\n');
}

/**
 * Save review result to file
 */
function saveReviewResult(outputDir: string, filename: string, items: unknown[]): void {
  const filePath = path.join(outputDir, filename);
  fs.writeFileSync(filePath, JSON.stringify(items, null, 2));
}
