/**
 * Generate Command - Create curriculum artifacts
 */
import * as path from 'path';
import * as fs from 'fs';
import chalk from 'chalk';
import { createAIClient, AIClientOptions } from '../../ai/client';
import { AIProvider } from '../../ai/providers';
import { DocumentContent, Task } from '../../types';
import { generateTREvents, generateTREventsFromContent, GeneratedTREvent } from '../../generation/tr-generator';
import { generateTLOs, GeneratedTLO } from '../../generation/tlo-generator';
import { generateELOs, GeneratedELO } from '../../generation/elo-generator';
import { generateMLF, GeneratedMLFSection } from '../../generation/mlf-generator';
import { generateWIIFM, GeneratedWIIFMChecklist } from '../../generation/wiifm-generator';
import { generateQuiz, GeneratedQuizItem } from '../../generation/quiz-generator';
import { ParallelOptions } from '../../utils/parallel';

export interface GenerateOptions {
  outputDir: string;
  quizCount?: number;
  maxEvents?: number;
  provider?: AIProvider;
  model?: string;
  /** Enable parallel batch processing for faster generation */
  parallel?: boolean;
  /** Maximum concurrent API calls when parallel is enabled */
  maxConcurrency?: number;
}

export interface GenerateResult {
  trEvents: GeneratedTREvent[];
  tlos: GeneratedTLO[];
  elos: GeneratedELO[];
  mlf: GeneratedMLFSection[];
  wiifm: GeneratedWIIFMChecklist[];
  quiz: GeneratedQuizItem[];
}

/**
 * Execute the generate command (Pass 1 - Autonomous)
 */
export async function generate(
  content: DocumentContent,
  tasks: Task[] | undefined,
  options: GenerateOptions
): Promise<GenerateResult> {
  const clientOptions: AIClientOptions = {
    provider: options.provider,
    model: options.model,
  };
  const client = createAIClient(clientOptions);
  const result: GenerateResult = {
    trEvents: [],
    tlos: [],
    elos: [],
    mlf: [],
    wiifm: [],
    quiz: [],
  };

  // Parallel processing options
  const parallelOpts: ParallelOptions = {
    parallel: options.parallel || false,
    maxConcurrency: options.maxConcurrency || 5,
  };

  if (options.parallel) {
    console.log(chalk.cyan(`  🚀 Parallel mode enabled (max ${parallelOpts.maxConcurrency} concurrent requests)`));
  }

  // Ensure output directory exists
  const outputDir = path.resolve(options.outputDir);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(chalk.blue.bold('\n=== Pass 1: Autonomous Generation ===\n'));

  // Step 1: Generate T&R Events
  console.log(chalk.blue('Step 1: Generating T&R Events...'));
  try {
    if (tasks && tasks.length > 0) {
      // Limit tasks if maxEvents is specified (for --fast mode)
      const maxEvents = options.maxEvents || tasks.length;
      const limitedTasks = tasks.slice(0, maxEvents);
      if (limitedTasks.length < tasks.length) {
        console.log(chalk.cyan(`  📉 Limiting to ${limitedTasks.length} of ${tasks.length} tasks`));
      }
      result.trEvents = await generateTREvents(client, limitedTasks, content, parallelOpts);
    } else {
      result.trEvents = await generateTREventsFromContent(client, content, options.maxEvents || 10);
    }
    console.log(chalk.green(`  ✓ Generated ${result.trEvents.length} T&R events`));

    // Report validation issues
    const invalidEvents = result.trEvents.filter((e) => !e.validation.valid);
    if (invalidEvents.length > 0) {
      console.log(chalk.yellow(`  ⚠ ${invalidEvents.length} events have validation issues`));
    }

    saveArtifact(outputDir, 'tr-events.json', result.trEvents);
  } catch (error) {
    console.log(chalk.red(`  ✗ T&R generation failed: ${error}`));
  }

  // Step 2: Generate TLOs
  console.log(chalk.blue('Step 2: Generating TLOs...'));
  try {
    result.tlos = await generateTLOs(client, result.trEvents, content, parallelOpts);
    console.log(chalk.green(`  ✓ Generated ${result.tlos.length} TLOs`));

    const invalidTLOs = result.tlos.filter((t) => !t.validation.valid);
    if (invalidTLOs.length > 0) {
      console.log(chalk.yellow(`  ⚠ ${invalidTLOs.length} TLOs have validation issues`));
    }

    saveArtifact(outputDir, 'tlos.json', result.tlos);
  } catch (error) {
    console.log(chalk.red(`  ✗ TLO generation failed: ${error}`));
  }

  // Step 3 & 4: Generate ELOs and MLF
  // With parallel mode, we can run ELOs and MLF concurrently since MLF only needs TLOs
  if (options.parallel) {
    console.log(chalk.blue('Step 3-4: Generating ELOs and MLF in parallel...'));
    try {
      const [elos, mlf] = await Promise.all([
        generateELOs(client, result.tlos, content, parallelOpts),
        generateMLF(client, result.tlos, [], content, parallelOpts), // Run with empty ELOs initially
      ]);

      result.elos = elos;
      result.mlf = mlf;

      console.log(chalk.green(`  ✓ Generated ${result.elos.length} ELOs`));
      console.log(chalk.green(`  ✓ Generated ${result.mlf.length} MLF sections`));

      const invalidELOs = result.elos.filter((e) => !e.validation.valid);
      if (invalidELOs.length > 0) {
        console.log(chalk.yellow(`  ⚠ ${invalidELOs.length} ELOs have validation issues`));
      }

      saveArtifact(outputDir, 'elos.json', result.elos);
      saveArtifact(outputDir, 'mlf.json', result.mlf);
    } catch (error) {
      console.log(chalk.red(`  ✗ ELO/MLF generation failed: ${error}`));
    }
  } else {
    // Sequential mode: Run ELOs then MLF
    console.log(chalk.blue('Step 3: Generating ELOs...'));
    try {
      result.elos = await generateELOs(client, result.tlos, content, parallelOpts);
      console.log(chalk.green(`  ✓ Generated ${result.elos.length} ELOs`));

      const invalidELOs = result.elos.filter((e) => !e.validation.valid);
      if (invalidELOs.length > 0) {
        console.log(chalk.yellow(`  ⚠ ${invalidELOs.length} ELOs have validation issues`));
      }

      saveArtifact(outputDir, 'elos.json', result.elos);
    } catch (error) {
      console.log(chalk.red(`  ✗ ELO generation failed: ${error}`));
    }

    console.log(chalk.blue('Step 4: Generating MLF...'));
    try {
      result.mlf = await generateMLF(client, result.tlos, result.elos, content, parallelOpts);
      console.log(chalk.green(`  ✓ Generated ${result.mlf.length} MLF sections`));

      saveArtifact(outputDir, 'mlf.json', result.mlf);
    } catch (error) {
      console.log(chalk.red(`  ✗ MLF generation failed: ${error}`));
    }
  }

  // Step 5: Generate WIIFM Checklists
  console.log(chalk.blue('Step 5: Generating WIIFM Checklists...'));
  try {
    result.wiifm = await generateWIIFM(client, result.tlos, result.mlf, content, parallelOpts);
    console.log(chalk.green(`  ✓ Generated ${result.wiifm.length} WIIFM checklists`));

    saveArtifact(outputDir, 'wiifm.json', result.wiifm);
  } catch (error) {
    console.log(chalk.red(`  ✗ WIIFM generation failed: ${error}`));
  }

  // Step 6: Generate Quiz
  console.log(chalk.blue('Step 6: Generating Quiz...'));
  try {
    const quizCount = options.quizCount || 20;
    result.quiz = await generateQuiz(client, result.elos, content, quizCount, parallelOpts);
    console.log(chalk.green(`  ✓ Generated ${result.quiz.length} quiz questions`));

    const invalidQuestions = result.quiz.filter((q) => !q.validation.valid);
    if (invalidQuestions.length > 0) {
      console.log(chalk.yellow(`  ⚠ ${invalidQuestions.length} questions have validation issues`));
    }

    saveArtifact(outputDir, 'quiz.json', result.quiz);
  } catch (error) {
    console.log(chalk.red(`  ✗ Quiz generation failed: ${error}`));
  }

  // Summary
  console.log(chalk.blue.bold('\n=== Generation Complete ===\n'));
  console.log(chalk.white('Summary:'));
  console.log(chalk.white(`  T&R Events: ${result.trEvents.length}`));
  console.log(chalk.white(`  TLOs: ${result.tlos.length}`));
  console.log(chalk.white(`  ELOs: ${result.elos.length}`));
  console.log(chalk.white(`  MLF Sections: ${result.mlf.length}`));
  console.log(chalk.white(`  WIIFM Checklists: ${result.wiifm.length}`));
  console.log(chalk.white(`  Quiz Questions: ${result.quiz.length}`));
  console.log(chalk.gray(`\nArtifacts saved to: ${outputDir}`));

  return result;
}

/**
 * Save an artifact to the output directory
 */
function saveArtifact(outputDir: string, filename: string, data: unknown): void {
  const filePath = path.join(outputDir, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

/**
 * Load previously generated artifacts
 */
export function loadGeneratedArtifacts(outputDir: string): Partial<GenerateResult> {
  const result: Partial<GenerateResult> = {};

  const files = [
    { key: 'trEvents', file: 'tr-events.json' },
    { key: 'tlos', file: 'tlos.json' },
    { key: 'elos', file: 'elos.json' },
    { key: 'mlf', file: 'mlf.json' },
    { key: 'wiifm', file: 'wiifm.json' },
    { key: 'quiz', file: 'quiz.json' },
  ];

  for (const { key, file } of files) {
    const filePath = path.join(outputDir, file);
    if (fs.existsSync(filePath)) {
      (result as Record<string, unknown>)[key] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
  }

  return result;
}
