#!/usr/bin/env node
/**
 * CBM - Curriculum Builder and Maintainer
 * AI-powered CLI for USMC curriculum development
 */
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') });
dotenv.config({ path: path.join(process.cwd(), '.env') });

import { Command } from 'commander';
import chalk from 'chalk';
import { ingest, loadIngestedContent } from './cli/commands/ingest';
import { generate } from './cli/commands/generate';
import { review } from './cli/commands/review';
import { exportArtifacts, ExportFormat } from './cli/commands/export';
import { configure, showConfig, setConfigValue } from './cli/commands/config';
import { AIProvider } from './ai/providers';

const program = new Command();

// Program metadata
program
  .name('cbm')
  .description('Curriculum Builder and Maintainer - AI-powered USMC curriculum development')
  .version('1.0.0');

// Ingest command
program
  .command('ingest <file>')
  .description('Parse and ingest a source document (PDF or Markdown)')
  .option('-t, --tasks', 'Extract trainable tasks using AI')
  .option('-o, --output <dir>', 'Output directory for ingested content', './output/ingested')
  .action(async (file: string, options: { tasks?: boolean; output: string }) => {
    try {
      await ingest(file, {
        extractTasks: options.tasks,
        outputDir: options.output,
      });
    } catch (error) {
      console.error(chalk.red(`Error: ${error}`));
      process.exit(1);
    }
  });

// Generate command
program
  .command('generate')
  .description('Generate curriculum artifacts (Pass 1 - Autonomous)')
  .option('-i, --input <dir>', 'Input directory with ingested content', './output/ingested')
  .option('-o, --output <dir>', 'Output directory for generated artifacts', './output/pass1')
  .option('-q, --quiz-count <n>', 'Number of quiz questions to generate', '20')
  .option('-e, --max-events <n>', 'Maximum T&R events to generate', '10')
  .option('-p, --provider <provider>', 'AI provider (openai, anthropic, google)')
  .option('-m, --model <model>', 'AI model to use')
  .option('--parallel', 'Enable parallel batch processing for faster generation')
  .option('--max-concurrency <n>', 'Maximum concurrent API calls (default: 5)', '5')
  .option('--fast', 'Fast/demo mode: fewer artifacts with parallel processing')
  .action(async (options: { input: string; output: string; quizCount: string; maxEvents: string; provider?: string; model?: string; parallel?: boolean; maxConcurrency?: string; fast?: boolean }) => {
    try {
      const { content, tasks } = loadIngestedContent(options.input);

      // Fast mode presets: fewer items + parallel processing
      const isFast = options.fast;
      const maxEvents = isFast ? 10 : parseInt(options.maxEvents, 10);
      const quizCount = isFast ? 10 : parseInt(options.quizCount, 10);
      const parallel = isFast || options.parallel;

      if (isFast) {
        console.log(chalk.cyan('\n  ⚡ Fast mode: generating fewer artifacts with parallel processing\n'));
      }

      await generate(content, tasks, {
        outputDir: options.output,
        quizCount,
        maxEvents,
        provider: options.provider as AIProvider | undefined,
        model: options.model,
        parallel,
        maxConcurrency: parseInt(options.maxConcurrency || '5', 10),
      });
    } catch (error) {
      console.error(chalk.red(`Error: ${error}`));
      process.exit(1);
    }
  });

// Review command
program
  .command('review')
  .description('Interactive review of generated artifacts (Pass 2)')
  .option('-i, --input <dir>', 'Input directory with Pass 1 artifacts', './output/pass1')
  .option('-o, --output <dir>', 'Output directory for reviewed artifacts', './output/final')
  .action(async (options: { input: string; output: string }) => {
    try {
      await review({
        inputDir: options.input,
        outputDir: options.output,
      });
    } catch (error) {
      console.error(chalk.red(`Error: ${error}`));
      process.exit(1);
    }
  });

// Export command
program
  .command('export')
  .description('Export artifacts to Markdown, Word, and/or HTML documents')
  .option('-i, --input <dir>', 'Input directory with artifacts', './output/final')
  .option('-o, --output <dir>', 'Output directory for exported files', './output/export')
  .option('-f, --format <format>', 'Export format: md, docx, html, both, or all', 'both')
  .option('-t, --title <title>', 'Document title')
  .option('--open', 'Open HTML dashboard in browser after export')
  .action(async (options: { input: string; output: string; format: string; title?: string; open?: boolean }) => {
    try {
      const format = options.format as ExportFormat;
      if (!['md', 'docx', 'html', 'both', 'all'].includes(format)) {
        throw new Error('Format must be: md, docx, html, both, or all');
      }
      await exportArtifacts({
        inputDir: options.input,
        outputDir: options.output,
        format,
        title: options.title,
        open: options.open,
      });
    } catch (error) {
      console.error(chalk.red(`Error: ${error}`));
      process.exit(1);
    }
  });

// Config command
program
  .command('config')
  .description('Configure CBM settings')
  .option('--show', 'Show current configuration')
  .option('--set <key=value>', 'Set a configuration value')
  .option('--target-pop <value>', 'Set target population')
  .action(async (options: { show?: boolean; set?: string; targetPop?: string }) => {
    try {
      if (options.show) {
        showConfig();
      } else if (options.set) {
        const [key, value] = options.set.split('=');
        setConfigValue(key as 'outputDir' | 'aiProvider' | 'aiModel', value);
      } else if (options.targetPop) {
        setConfigValue('targetPopulation', options.targetPop);
      } else {
        await configure();
      }
    } catch (error) {
      console.error(chalk.red(`Error: ${error}`));
      process.exit(1);
    }
  });

// Pipeline command (run all steps)
program
  .command('pipeline <file>')
  .description('Run the full curriculum generation pipeline')
  .option('-o, --output <dir>', 'Base output directory', './output')
  .option('-q, --quiz-count <n>', 'Number of quiz questions', '20')
  .option('--skip-review', 'Skip interactive review (use Pass 1 output)')
  .option('-f, --format <format>', 'Export format: md, docx, html, both, or all', 'both')
  .option('-p, --provider <provider>', 'AI provider (openai, anthropic, google)')
  .option('-m, --model <model>', 'AI model to use')
  .option('--open', 'Open HTML dashboard in browser after export')
  .option('--parallel', 'Enable parallel batch processing for faster generation')
  .option('--max-concurrency <n>', 'Maximum concurrent API calls (default: 5)', '5')
  .option('--fast', 'Fast/demo mode: fewer artifacts with parallel processing')
  .action(async (file: string, options: { output: string; quizCount: string; skipReview?: boolean; format: string; provider?: string; model?: string; open?: boolean; parallel?: boolean; maxConcurrency?: string; fast?: boolean }) => {
    try {
      const baseOutput = options.output;

      // Fast mode presets: fewer items + parallel processing
      const isFast = options.fast;
      const maxEvents = isFast ? 10 : undefined; // Limit tasks in fast mode
      const quizCount = isFast ? 10 : parseInt(options.quizCount, 10);
      const parallel = isFast || options.parallel;

      if (isFast) {
        console.log(chalk.cyan('\n  ⚡ Fast mode: generating fewer artifacts with parallel processing\n'));
      }

      // Step 1: Ingest
      console.log(chalk.blue.bold('\n📥 Step 1: Ingesting source document...\n'));
      const ingestResult = await ingest(file, {
        extractTasks: true,
        outputDir: `${baseOutput}/ingested`,
      });

      // Step 2: Generate
      console.log(chalk.blue.bold('\n⚙️  Step 2: Generating curriculum artifacts...\n'));
      await generate(ingestResult.content, ingestResult.tasks, {
        outputDir: `${baseOutput}/pass1`,
        quizCount,
        maxEvents,
        provider: options.provider as AIProvider | undefined,
        model: options.model,
        parallel,
        maxConcurrency: parseInt(options.maxConcurrency || '5', 10),
      });

      // Step 3: Review (optional)
      let finalDir = `${baseOutput}/pass1`;
      if (!options.skipReview) {
        console.log(chalk.blue.bold('\n✅ Step 3: Interactive review...\n'));
        await review({
          inputDir: `${baseOutput}/pass1`,
          outputDir: `${baseOutput}/final`,
        });
        finalDir = `${baseOutput}/final`;
      }

      // Step 4: Export
      console.log(chalk.blue.bold('\n📤 Step 4: Exporting documents...\n'));
      await exportArtifacts({
        inputDir: finalDir,
        outputDir: `${baseOutput}/export`,
        format: options.format as ExportFormat,
        title: ingestResult.content.title,
        open: options.open,
      });

      console.log(chalk.green.bold('\n🎉 Pipeline complete!\n'));
      console.log(chalk.white(`Exported files are in: ${baseOutput}/export`));
    } catch (error) {
      console.error(chalk.red(`Error: ${error}`));
      process.exit(1);
    }
  });

// Display banner
function showBanner(): void {
  console.log(chalk.blue(`
   ██████╗██████╗ ███╗   ███╗
  ██╔════╝██╔══██╗████╗ ████║
  ██║     ██████╔╝██╔████╔██║
  ██║     ██╔══██╗██║╚██╔╝██║
  ╚██████╗██████╔╝██║ ╚═╝ ██║
   ╚═════╝╚═════╝ ╚═╝     ╚═╝
  `));
  console.log(chalk.gray('  Curriculum Builder and Maintainer v0.1.0'));
  console.log(chalk.gray('  AI-powered USMC curriculum development\n'));
}

// Parse arguments
if (process.argv.length === 2) {
  showBanner();
  program.help();
} else {
  program.parse(process.argv);
}
