/**
 * Export Command - Generate output files in various formats
 */
import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';
import chalk from 'chalk';
import { TREvent, TLO, ELO, QuizItem, MLFSection, WIIFMChecklist } from '../../types';
import {
  exportTREventsToMarkdown,
  exportObjectiveMatrixToMarkdown,
  exportMLFToMarkdown,
  exportQuizToMarkdown,
  exportAnswerKeyToMarkdown,
  writeMarkdownFile,
} from '../../export/markdown';
import {
  exportTREventsToDocx,
  exportObjectiveMatrixToDocx,
  exportQuizToDocx,
} from '../../export/docx';
import {
  exportCurriculumToHTML,
  writeHTMLFile,
} from '../../export/html';

export type ExportFormat = 'md' | 'docx' | 'html' | 'both' | 'all';

export interface ExportOptions {
  inputDir: string;
  outputDir: string;
  format: ExportFormat;
  title?: string;
  open?: boolean;
}

/**
 * Execute the export command
 */
export async function exportArtifacts(options: ExportOptions): Promise<void> {
  const inputDir = path.resolve(options.inputDir);
  const outputDir = path.resolve(options.outputDir);
  const title = options.title || 'Curriculum Artifacts';

  if (!fs.existsSync(inputDir)) {
    throw new Error(`Input directory not found: ${inputDir}`);
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(chalk.blue.bold('\n=== Exporting Artifacts ===\n'));
  console.log(chalk.gray(`Format: ${options.format}`));
  console.log(chalk.gray(`Output: ${outputDir}\n`));

  const exportMd = options.format === 'md' || options.format === 'both' || options.format === 'all';
  const exportDocx = options.format === 'docx' || options.format === 'both' || options.format === 'all';
  const exportHtml = options.format === 'html' || options.format === 'all';

  // Export T&R Events
  const trEventsPath = path.join(inputDir, 'tr-events.json');
  if (fs.existsSync(trEventsPath)) {
    console.log(chalk.blue('Exporting T&R Events...'));
    const trEvents = JSON.parse(fs.readFileSync(trEventsPath, 'utf-8')) as TREvent[];

    if (exportMd) {
      const mdContent = exportTREventsToMarkdown(trEvents, title);
      await writeMarkdownFile(mdContent, path.join(outputDir, 'tr-events.md'));
      console.log(chalk.green('  ✓ tr-events.md'));
    }

    if (exportDocx) {
      await exportTREventsToDocx(trEvents, title, path.join(outputDir, 'tr-events.docx'));
      console.log(chalk.green('  ✓ tr-events.docx'));
    }
  }

  // Export TLO/ELO Matrix
  const tlosPath = path.join(inputDir, 'tlos.json');
  const elosPath = path.join(inputDir, 'elos.json');
  if (fs.existsSync(tlosPath) && fs.existsSync(elosPath)) {
    console.log(chalk.blue('Exporting Learning Objectives...'));
    const tlos = JSON.parse(fs.readFileSync(tlosPath, 'utf-8')) as TLO[];
    const elos = JSON.parse(fs.readFileSync(elosPath, 'utf-8')) as ELO[];

    if (exportMd) {
      const mdContent = exportObjectiveMatrixToMarkdown(tlos, elos, title);
      await writeMarkdownFile(mdContent, path.join(outputDir, 'objectives-matrix.md'));
      console.log(chalk.green('  ✓ objectives-matrix.md'));
    }

    if (exportDocx) {
      await exportObjectiveMatrixToDocx(tlos, elos, title, path.join(outputDir, 'objectives-matrix.docx'));
      console.log(chalk.green('  ✓ objectives-matrix.docx'));
    }
  }

  // Export MLF
  const mlfPath = path.join(inputDir, 'mlf.json');
  if (fs.existsSync(mlfPath)) {
    console.log(chalk.blue('Exporting Master Lesson File...'));
    const mlf = JSON.parse(fs.readFileSync(mlfPath, 'utf-8')) as MLFSection[];

    if (exportMd) {
      const mdContent = exportMLFToMarkdown(mlf, title);
      await writeMarkdownFile(mdContent, path.join(outputDir, 'master-lesson-file.md'));
      console.log(chalk.green('  ✓ master-lesson-file.md'));
    }

    // Note: DOCX export for MLF would be similar but is more complex
    // For MVP, we'll export MLF only to markdown
    if (exportDocx) {
      console.log(chalk.yellow('  ⚠ MLF DOCX export not yet implemented'));
    }
  }

  // Export Quiz
  const quizPath = path.join(inputDir, 'quiz.json');
  if (fs.existsSync(quizPath)) {
    console.log(chalk.blue('Exporting Quiz...'));
    const quiz = JSON.parse(fs.readFileSync(quizPath, 'utf-8')) as QuizItem[];

    if (exportMd) {
      // Student version (no answers)
      const studentMd = exportQuizToMarkdown(quiz, title);
      await writeMarkdownFile(studentMd, path.join(outputDir, 'quiz-student.md'));
      console.log(chalk.green('  ✓ quiz-student.md'));

      // Instructor version (with answers)
      const instructorMd = exportAnswerKeyToMarkdown(quiz, title);
      await writeMarkdownFile(instructorMd, path.join(outputDir, 'quiz-instructor.md'));
      console.log(chalk.green('  ✓ quiz-instructor.md'));
    }

    if (exportDocx) {
      // Student version
      await exportQuizToDocx(quiz, title, path.join(outputDir, 'quiz-student.docx'), false);
      console.log(chalk.green('  ✓ quiz-student.docx'));

      // Instructor version
      await exportQuizToDocx(quiz, title, path.join(outputDir, 'quiz-instructor.docx'), true);
      console.log(chalk.green('  ✓ quiz-instructor.docx'));
    }
  }

  // Export HTML Dashboard
  let htmlFilePath: string | undefined;
  if (exportHtml) {
    console.log(chalk.blue('Exporting HTML Dashboard...'));

    // Load all artifacts for the combined dashboard
    const trEventsPath = path.join(inputDir, 'tr-events.json');
    const tlosPath = path.join(inputDir, 'tlos.json');
    const elosPath = path.join(inputDir, 'elos.json');
    const mlfPath = path.join(inputDir, 'mlf.json');
    const wiifmPath = path.join(inputDir, 'wiifm.json');
    const quizPath = path.join(inputDir, 'quiz.json');

    const trEvents = fs.existsSync(trEventsPath)
      ? (JSON.parse(fs.readFileSync(trEventsPath, 'utf-8')) as TREvent[])
      : [];
    const tlos = fs.existsSync(tlosPath)
      ? (JSON.parse(fs.readFileSync(tlosPath, 'utf-8')) as TLO[])
      : [];
    const elos = fs.existsSync(elosPath)
      ? (JSON.parse(fs.readFileSync(elosPath, 'utf-8')) as ELO[])
      : [];
    const mlf = fs.existsSync(mlfPath)
      ? (JSON.parse(fs.readFileSync(mlfPath, 'utf-8')) as MLFSection[])
      : [];
    const wiifm = fs.existsSync(wiifmPath)
      ? (JSON.parse(fs.readFileSync(wiifmPath, 'utf-8')) as WIIFMChecklist[])
      : [];
    const quiz = fs.existsSync(quizPath)
      ? (JSON.parse(fs.readFileSync(quizPath, 'utf-8')) as QuizItem[])
      : [];

    const htmlContent = exportCurriculumToHTML(title, trEvents, tlos, elos, mlf, wiifm, quiz);
    htmlFilePath = path.join(outputDir, 'curriculum-dashboard.html');
    await writeHTMLFile(htmlContent, htmlFilePath);
    console.log(chalk.green('  ✓ curriculum-dashboard.html'));
  }

  console.log(chalk.blue.bold('\n=== Export Complete ===\n'));

  // Open in browser if requested
  if (options.open && htmlFilePath) {
    console.log(chalk.gray('Opening dashboard in browser...'));
    const openCommand = process.platform === 'darwin'
      ? 'open'
      : process.platform === 'win32'
        ? 'start'
        : 'xdg-open';

    exec(`${openCommand} "${htmlFilePath}"`, (error) => {
      if (error) {
        console.log(chalk.yellow(`  ⚠ Could not open browser: ${error.message}`));
      }
    });
  }
}
