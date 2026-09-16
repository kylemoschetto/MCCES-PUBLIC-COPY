/**
 * Markdown Parser - Extract structured content from markdown files
 */
import * as fs from 'fs';
import * as path from 'path';
import { DocumentContent, DocumentSection } from '../types';

/**
 * Extract content from a markdown file
 */
export async function extractTextFromMarkdown(filePath: string): Promise<DocumentContent> {
  const absolutePath = path.resolve(filePath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`File not found: ${absolutePath}`);
  }

  const text = fs.readFileSync(absolutePath, 'utf-8');
  const title = extractTitleFromMarkdown(text, filePath);
  const sections = extractSectionsFromMarkdown(text);

  return {
    title,
    sourcePath: absolutePath,
    text,
    sections,
    metadata: {
      format: 'markdown',
      sectionCount: String(sections.length),
    },
  };
}

/**
 * Extract title from markdown (first H1 or filename)
 */
function extractTitleFromMarkdown(text: string, filePath: string): string {
  // Look for first H1 header
  const h1Match = text.match(/^#\s+(.+)$/m);
  if (h1Match) {
    return h1Match[1].trim();
  }

  // Fall back to filename
  return path.basename(filePath, path.extname(filePath));
}

/**
 * Extract sections from markdown based on headers
 */
function extractSectionsFromMarkdown(text: string): DocumentSection[] {
  const sections: DocumentSection[] = [];
  const lines = text.split('\n');

  let currentSection: DocumentSection | null = null;
  let currentContent: string[] = [];

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Check for standard markdown headers (# Header)
    const headerMatch = trimmedLine.match(/^(#{1,6})\s+(.+)$/);

    // Check for bold-only lines that look like section headers
    // Pattern: **Chapter X** or **SECTION TITLE** or **1-1. Section Name**
    const boldHeaderMatch = trimmedLine.match(/^\*\*([^*]+)\*\*\s*$/);

    let isHeader = false;
    let level = 2;
    let heading = '';

    if (headerMatch) {
      isHeader = true;
      level = headerMatch[1].length;
      heading = headerMatch[2].trim();
    } else if (boldHeaderMatch) {
      const boldText = boldHeaderMatch[1].trim();
      // Only treat as header if it looks like a chapter/section title
      // (all caps, starts with Chapter/Section/Appendix, or numbered like 1-1.)
      const isChapter = /^(Chapter|CHAPTER)\s+\d+/i.test(boldText);
      const isSection = /^(Section|SECTION)\s+[IVX\d]+/i.test(boldText);
      const isAppendix = /^(Appendix|APPENDIX)\s+[A-Z]/i.test(boldText);
      const isNumbered = /^\d+-\d+\.?\s+/.test(boldText);
      const isAllCaps = boldText === boldText.toUpperCase() && boldText.length > 5 && boldText.length < 60;
      const isTitleCase = /^[A-Z][a-z]+(\s+[A-Z][a-z]+)*$/.test(boldText) && boldText.length < 60;

      if (isChapter) {
        isHeader = true;
        level = 1;
        heading = boldText;
      } else if (isSection || isAppendix) {
        isHeader = true;
        level = 2;
        heading = boldText;
      } else if (isNumbered) {
        isHeader = true;
        level = 3;
        heading = boldText;
      } else if (isAllCaps || isTitleCase) {
        isHeader = true;
        level = 2;
        heading = boldText;
      }
    }

    if (isHeader && heading.length > 0) {
      // Save previous section
      if (currentSection) {
        currentSection.content = currentContent.join('\n').trim();
        if (currentSection.content.length > 0 || currentSection.heading) {
          sections.push(currentSection);
        }
      }

      currentSection = {
        heading,
        level,
        content: '',
      };
      currentContent = [];
    } else {
      // Add to current content
      currentContent.push(line);
    }
  }

  // Don't forget the last section
  if (currentSection) {
    currentSection.content = currentContent.join('\n').trim();
    sections.push(currentSection);
  }

  return sections;
}

/**
 * Extract specific sections by heading pattern
 */
export function extractSectionsByPattern(
  content: DocumentContent,
  pattern: RegExp
): DocumentSection[] {
  if (!content.sections) {
    return [];
  }

  return content.sections.filter((section) => pattern.test(section.heading));
}

/**
 * Get text between two section headings
 */
export function getTextBetweenSections(
  content: DocumentContent,
  startPattern: RegExp,
  endPattern: RegExp
): string {
  if (!content.sections) {
    return '';
  }

  let capturing = false;
  const captured: string[] = [];

  for (const section of content.sections) {
    if (startPattern.test(section.heading)) {
      capturing = true;
    }

    if (capturing) {
      if (endPattern.test(section.heading)) {
        break;
      }
      captured.push(section.heading);
      captured.push(section.content);
    }
  }

  return captured.join('\n\n');
}
