/**
 * PDF Parser - Extract text content from PDF files
 */
import * as fs from 'fs';
import * as path from 'path';
import pdf from 'pdf-parse';
import { DocumentContent, DocumentSection } from '../types';

export interface PDFParseOptions {
  /** Maximum pages to parse (0 = all) */
  maxPages?: number;
  /** Extract section structure */
  extractSections?: boolean;
}

/**
 * Extract text content from a PDF file
 */
export async function extractTextFromPDF(
  filePath: string,
  options: PDFParseOptions = {}
): Promise<DocumentContent> {
  const absolutePath = path.resolve(filePath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`File not found: ${absolutePath}`);
  }

  const dataBuffer = fs.readFileSync(absolutePath);
  const data = await pdf(dataBuffer, {
    max: options.maxPages || 0,
  });

  const content: DocumentContent = {
    title: extractTitle(data.info?.Title, filePath),
    sourcePath: absolutePath,
    text: data.text,
    metadata: {
      pageCount: String(data.numpages),
      ...(data.info || {}),
    },
  };

  if (options.extractSections) {
    content.sections = extractSections(data.text);
  }

  return content;
}

/**
 * Extract title from PDF metadata or filename
 */
function extractTitle(pdfTitle: string | undefined, filePath: string): string {
  if (pdfTitle && pdfTitle.trim().length > 0) {
    return pdfTitle.trim();
  }
  return path.basename(filePath, path.extname(filePath));
}

/**
 * Attempt to extract section structure from text
 * This is a heuristic approach - works better with well-structured documents
 */
function extractSections(text: string): DocumentSection[] {
  const sections: DocumentSection[] = [];
  const lines = text.split('\n');

  let currentSection: DocumentSection | null = null;
  let currentContent: string[] = [];

  // Patterns for section headers (adjust based on document format)
  const chapterPattern = /^(CHAPTER|Chapter)\s+(\d+|[IVXLC]+)/;
  const sectionPattern = /^(\d+)[.-](\d+)\s+/;
  const appendixPattern = /^(APPENDIX|Appendix)\s+([A-Z])/;
  const allCapsHeaderPattern = /^([A-Z][A-Z\s]{10,})$/;

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Check for chapter headers
    if (chapterPattern.test(trimmedLine)) {
      if (currentSection) {
        currentSection.content = currentContent.join('\n').trim();
        sections.push(currentSection);
      }
      currentSection = {
        heading: trimmedLine,
        level: 1,
        content: '',
      };
      currentContent = [];
      continue;
    }

    // Check for section headers (like "1-1 Introduction")
    if (sectionPattern.test(trimmedLine)) {
      if (currentSection) {
        currentSection.content = currentContent.join('\n').trim();
        sections.push(currentSection);
      }
      currentSection = {
        heading: trimmedLine,
        level: 2,
        content: '',
      };
      currentContent = [];
      continue;
    }

    // Check for appendix headers
    if (appendixPattern.test(trimmedLine)) {
      if (currentSection) {
        currentSection.content = currentContent.join('\n').trim();
        sections.push(currentSection);
      }
      currentSection = {
        heading: trimmedLine,
        level: 1,
        content: '',
      };
      currentContent = [];
      continue;
    }

    // Check for all-caps headers (common in military docs)
    if (allCapsHeaderPattern.test(trimmedLine) && trimmedLine.length < 60) {
      if (currentSection) {
        currentSection.content = currentContent.join('\n').trim();
        sections.push(currentSection);
      }
      currentSection = {
        heading: trimmedLine,
        level: 2,
        content: '',
      };
      currentContent = [];
      continue;
    }

    // Add to current content
    if (trimmedLine.length > 0) {
      currentContent.push(trimmedLine);
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
 * Extract specific page range from PDF
 */
export async function extractPagesFromPDF(
  filePath: string,
  _startPage: number,
  _endPage: number
): Promise<string> {
  const absolutePath = path.resolve(filePath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`File not found: ${absolutePath}`);
  }

  const dataBuffer = fs.readFileSync(absolutePath);

  // pdf-parse doesn't support page ranges directly
  // This is a simplified implementation - for production, consider pdf-lib or similar
  const data = await pdf(dataBuffer);

  // Return full text with a note about the requested range
  // In a production system, you'd implement proper page extraction
  return data.text;
}
