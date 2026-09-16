/**
 * Ingest Command - Parse source documents
 */
import * as path from 'path';
import * as fs from 'fs';
import chalk from 'chalk';
import { extractTextFromPDF } from '../../ingestion/pdf-parser';
import { extractTextFromMarkdown } from '../../ingestion/md-parser';
import { extractTasks } from '../../ingestion/task-extractor';
import { createAIClient } from '../../ai/client';
import { DocumentContent, Task } from '../../types';

export interface IngestOptions {
  extractTasks?: boolean;
  outputDir?: string;
}

export interface IngestResult {
  content: DocumentContent;
  tasks?: Task[];
}

/**
 * Execute the ingest command
 */
export async function ingest(filePath: string, options: IngestOptions = {}): Promise<IngestResult> {
  const absolutePath = path.resolve(filePath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`File not found: ${absolutePath}`);
  }

  console.log(chalk.blue(`Ingesting: ${path.basename(absolutePath)}`));

  // Determine file type and parse
  const ext = path.extname(absolutePath).toLowerCase();
  let content: DocumentContent;

  if (ext === '.pdf') {
    console.log(chalk.gray('  Parsing PDF...'));
    content = await extractTextFromPDF(absolutePath, { extractSections: true });
  } else if (ext === '.md' || ext === '.markdown') {
    console.log(chalk.gray('  Parsing Markdown...'));
    content = await extractTextFromMarkdown(absolutePath);
  } else {
    throw new Error(`Unsupported file type: ${ext}. Supported: .pdf, .md`);
  }

  console.log(chalk.green(`  ✓ Parsed ${content.title}`));
  console.log(chalk.gray(`    - ${content.text.length} characters`));
  if (content.sections) {
    console.log(chalk.gray(`    - ${content.sections.length} sections`));
  }

  const result: IngestResult = { content };

  // Extract tasks if requested
  if (options.extractTasks) {
    console.log(chalk.blue('  Extracting tasks...'));
    try {
      const client = createAIClient();
      const tasks = await extractTasks(client, content);
      result.tasks = tasks;
      console.log(chalk.green(`  ✓ Extracted ${tasks.length} tasks`));
    } catch (error) {
      console.log(chalk.yellow(`  ⚠ Task extraction failed: ${error}`));
    }
  }

  // Save to output directory if specified
  if (options.outputDir) {
    const outputDir = path.resolve(options.outputDir);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Save content
    const contentPath = path.join(outputDir, 'content.json');
    fs.writeFileSync(contentPath, JSON.stringify(content, null, 2));
    console.log(chalk.gray(`  Saved content to ${contentPath}`));

    // Save tasks if extracted
    if (result.tasks) {
      const tasksPath = path.join(outputDir, 'tasks.json');
      fs.writeFileSync(tasksPath, JSON.stringify(result.tasks, null, 2));
      console.log(chalk.gray(`  Saved tasks to ${tasksPath}`));
    }
  }

  return result;
}

/**
 * Load previously ingested content
 */
export function loadIngestedContent(outputDir: string): IngestResult {
  const contentPath = path.join(outputDir, 'content.json');
  const tasksPath = path.join(outputDir, 'tasks.json');

  if (!fs.existsSync(contentPath)) {
    throw new Error(`No ingested content found at ${contentPath}`);
  }

  const content = JSON.parse(fs.readFileSync(contentPath, 'utf-8')) as DocumentContent;
  const result: IngestResult = { content };

  if (fs.existsSync(tasksPath)) {
    result.tasks = JSON.parse(fs.readFileSync(tasksPath, 'utf-8')) as Task[];
  }

  return result;
}
