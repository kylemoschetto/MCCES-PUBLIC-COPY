/**
 * Word Document Export - Generate DOCX files from curriculum artifacts
 */
import * as fs from 'fs';
import * as path from 'path';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  TableCell,
  TableRow,
  Table,
  WidthType,
  AlignmentType,
  BorderStyle,
} from 'docx';
import { TREvent, TLO, ELO, QuizItem, COGNITIVE_LEVELS } from '../types';

/**
 * Export T&R events to Word document
 */
export async function exportTREventsToDocx(
  events: TREvent[],
  title: string,
  outputPath: string
): Promise<void> {
  const children: (Paragraph | Table)[] = [];

  // Title
  children.push(
    new Paragraph({
      text: `T&R Events: ${title}`,
      heading: HeadingLevel.TITLE,
    })
  );

  children.push(
    new Paragraph({
      text: `Generated: ${new Date().toLocaleDateString()}`,
      spacing: { after: 400 },
    })
  );

  // Events
  for (const event of events) {
    children.push(
      new Paragraph({
        text: `${event.id}: ${event.title}`,
        heading: HeadingLevel.HEADING_1,
      })
    );

    children.push(
      new Paragraph({
        text: 'Condition',
        heading: HeadingLevel.HEADING_2,
      })
    );
    children.push(new Paragraph({ text: event.condition }));

    children.push(
      new Paragraph({
        text: 'Standard',
        heading: HeadingLevel.HEADING_2,
      })
    );
    children.push(new Paragraph({ text: event.standard }));

    children.push(
      new Paragraph({
        text: 'Performance Steps',
        heading: HeadingLevel.HEADING_2,
      })
    );

    for (let i = 0; i < event.performanceSteps.length; i++) {
      children.push(
        new Paragraph({
          text: `${i + 1}. ${event.performanceSteps[i]}`,
        })
      );
    }

    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'Source: ', bold: true }),
          new TextRun({ text: event.sourceRef }),
        ],
        spacing: { after: 400 },
      })
    );
  }

  const doc = new Document({
    sections: [{ children }],
  });

  await writeDocxFile(doc, outputPath);
}

/**
 * Export TLO/ELO matrix to Word document
 */
export async function exportObjectiveMatrixToDocx(
  tlos: TLO[],
  elos: ELO[],
  title: string,
  outputPath: string
): Promise<void> {
  const children: (Paragraph | Table)[] = [];

  // Title
  children.push(
    new Paragraph({
      text: `Learning Objectives Matrix: ${title}`,
      heading: HeadingLevel.TITLE,
    })
  );

  children.push(
    new Paragraph({
      text: `Generated: ${new Date().toLocaleDateString()}`,
      spacing: { after: 400 },
    })
  );

  // Summary table
  children.push(
    new Paragraph({
      text: 'Summary',
      heading: HeadingLevel.HEADING_1,
    })
  );

  const tableRows: TableRow[] = [
    new TableRow({
      children: [
        createTableCell('ID', true),
        createTableCell('Type', true),
        createTableCell('Cognitive Level', true),
        createTableCell('Verb', true),
      ],
    }),
  ];

  for (const tlo of tlos) {
    tableRows.push(
      new TableRow({
        children: [
          createTableCell(tlo.id),
          createTableCell('TLO'),
          createTableCell(`${tlo.cognitiveLevel} - ${COGNITIVE_LEVELS[tlo.cognitiveLevel]}`),
          createTableCell(tlo.verb),
        ],
      })
    );
  }

  for (const elo of elos) {
    tableRows.push(
      new TableRow({
        children: [
          createTableCell(elo.id),
          createTableCell(`ELO (${elo.parentId})`),
          createTableCell(`${elo.cognitiveLevel} - ${COGNITIVE_LEVELS[elo.cognitiveLevel]}`),
          createTableCell(elo.verb),
        ],
      })
    );
  }

  children.push(
    new Table({
      rows: tableRows,
      width: { size: 100, type: WidthType.PERCENTAGE },
    })
  );

  // Detailed objectives
  children.push(
    new Paragraph({
      text: 'Detailed Objectives',
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400 },
    })
  );

  for (const tlo of tlos) {
    children.push(
      new Paragraph({
        text: `${tlo.id}: Terminal Learning Objective`,
        heading: HeadingLevel.HEADING_2,
      })
    );

    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'T&R Event: ', bold: true }),
          new TextRun({ text: tlo.trEventId }),
        ],
      })
    );

    children.push(
      new Paragraph({
        children: [new TextRun({ text: 'Condition:', bold: true })],
      })
    );
    children.push(
      new Paragraph({
        text: tlo.condition,
        indent: { left: 720 },
      })
    );

    children.push(
      new Paragraph({
        children: [new TextRun({ text: 'Behavior:', bold: true })],
      })
    );
    children.push(
      new Paragraph({
        text: tlo.behavior,
        indent: { left: 720 },
      })
    );

    children.push(
      new Paragraph({
        children: [new TextRun({ text: 'Standard:', bold: true })],
      })
    );
    children.push(
      new Paragraph({
        text: tlo.standard,
        indent: { left: 720 },
      })
    );

    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'Cognitive Level: ', bold: true }),
          new TextRun({ text: `${tlo.cognitiveLevel} - ${COGNITIVE_LEVELS[tlo.cognitiveLevel]}` }),
        ],
      })
    );

    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'Justification: ', bold: true }),
          new TextRun({ text: tlo.justification }),
        ],
      })
    );

    // Associated ELOs
    const tloElos = elos.filter((e) => e.parentId === tlo.id);
    if (tloElos.length > 0) {
      children.push(
        new Paragraph({
          text: 'Enabling Learning Objectives',
          heading: HeadingLevel.HEADING_3,
        })
      );

      for (const elo of tloElos) {
        children.push(
          new Paragraph({
            text: elo.id,
            heading: HeadingLevel.HEADING_4,
          })
        );

        children.push(
          new Paragraph({
            children: [new TextRun({ text: 'Condition: ', bold: true }), new TextRun({ text: elo.condition })],
          })
        );

        children.push(
          new Paragraph({
            children: [new TextRun({ text: 'Behavior: ', bold: true }), new TextRun({ text: elo.behavior })],
          })
        );

        children.push(
          new Paragraph({
            children: [new TextRun({ text: 'Standard: ', bold: true }), new TextRun({ text: elo.standard })],
          })
        );

        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: 'Cognitive Level: ', bold: true }),
              new TextRun({ text: `${elo.cognitiveLevel} - ${COGNITIVE_LEVELS[elo.cognitiveLevel]}` }),
            ],
            spacing: { after: 200 },
          })
        );
      }
    }
  }

  const doc = new Document({
    sections: [{ children }],
  });

  await writeDocxFile(doc, outputPath);
}

/**
 * Export quiz to Word document
 */
export async function exportQuizToDocx(
  questions: QuizItem[],
  title: string,
  outputPath: string,
  includeAnswers: boolean = false
): Promise<void> {
  const children: (Paragraph | Table)[] = [];

  // Title
  children.push(
    new Paragraph({
      text: includeAnswers ? `Answer Key: ${title}` : `Assessment: ${title}`,
      heading: HeadingLevel.TITLE,
    })
  );

  children.push(
    new Paragraph({
      text: `Generated: ${new Date().toLocaleDateString()}`,
    })
  );

  if (!includeAnswers) {
    children.push(
      new Paragraph({
        text: 'Instructions: Select the best answer for each question.',
        spacing: { before: 200, after: 400 },
      })
    );
  }

  // Questions
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const correct = q.options.find((o) => o.isCorrect);

    children.push(
      new Paragraph({
        text: `${i + 1}. ${q.question}`,
        heading: HeadingLevel.HEADING_2,
      })
    );

    for (const opt of q.options) {
      const prefix = includeAnswers && opt.isCorrect ? '✓ ' : '   ';
      children.push(
        new Paragraph({
          text: `${prefix}${opt.label}. ${opt.text}`,
          indent: { left: 360 },
        })
      );
    }

    if (includeAnswers) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Correct Answer: ', bold: true }),
            new TextRun({ text: correct?.label || 'A' }),
          ],
          spacing: { before: 200 },
        })
      );

      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Explanation: ', bold: true }),
            new TextRun({ text: q.explanation }),
          ],
        })
      );

      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'ELO: ', bold: true }),
            new TextRun({ text: q.eloId }),
            new TextRun({ text: ' | Source: ', bold: true }),
            new TextRun({ text: q.sourceRef }),
          ],
          spacing: { after: 400 },
        })
      );
    } else {
      children.push(new Paragraph({ text: '', spacing: { after: 200 } }));
    }
  }

  const doc = new Document({
    sections: [{ children }],
  });

  await writeDocxFile(doc, outputPath);
}

/**
 * Helper: Create a table cell
 */
function createTableCell(text: string, isHeader: boolean = false): TableCell {
  return new TableCell({
    children: [
      new Paragraph({
        children: [new TextRun({ text, bold: isHeader })],
        alignment: AlignmentType.LEFT,
      }),
    ],
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1 },
      bottom: { style: BorderStyle.SINGLE, size: 1 },
      left: { style: BorderStyle.SINGLE, size: 1 },
      right: { style: BorderStyle.SINGLE, size: 1 },
    },
  });
}

/**
 * Write document to file
 */
async function writeDocxFile(doc: Document, outputPath: string): Promise<void> {
  const dir = path.dirname(outputPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);
}
