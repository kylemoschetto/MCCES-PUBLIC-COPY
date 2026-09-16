/**
 * Core curriculum type definitions for CBM
 * Based on NAVMC 1553.1A and SAT/ADDIE methodology
 */

/** Bloom's Taxonomy cognitive levels */
export type CognitiveLevel = 1 | 2 | 3 | 4 | 5 | 6;

/** Cognitive level names for reference */
export const COGNITIVE_LEVELS: Record<CognitiveLevel, string> = {
  1: 'Remember',
  2: 'Understand',
  3: 'Apply',
  4: 'Analyze',
  5: 'Evaluate',
  6: 'Create',
};

/** Approved verbs by cognitive level (Bloom's Taxonomy) */
export const BLOOM_VERBS: Record<CognitiveLevel, string[]> = {
  1: ['Define', 'List', 'State', 'Identify', 'Recall', 'Name', 'Recognize'],
  2: ['Describe', 'Explain', 'Summarize', 'Classify', 'Discuss', 'Interpret'],
  3: ['Demonstrate', 'Perform', 'Calculate', 'Apply', 'Execute', 'Implement', 'Use'],
  4: ['Troubleshoot', 'Diagnose', 'Differentiate', 'Analyze', 'Compare', 'Contrast', 'Examine'],
  5: ['Assess', 'Critique', 'Determine', 'Evaluate', 'Judge', 'Justify', 'Recommend'],
  6: ['Design', 'Develop', 'Construct', 'Create', 'Formulate', 'Plan', 'Produce'],
};

/** Training and Readiness Event */
export interface TREvent {
  /** Unique identifier (e.g., "0621-ANT-1001") */
  id: string;
  /** Event title */
  title: string;
  /** Condition statement */
  condition: string;
  /** Standard to be achieved */
  standard: string;
  /** Ordered list of performance steps */
  performanceSteps: string[];
  /** Source reference (page/section citation) */
  sourceRef: string;
}

/** Learning Objective (TLO or ELO) in Mager format */
export interface LearningObjective {
  /** Unique identifier */
  id: string;
  /** Type of objective */
  type: 'TLO' | 'ELO';
  /** For ELOs, links to parent TLO */
  parentId?: string;
  /** Condition: "Given [equipment/scenario]..." */
  condition: string;
  /** Behavior: "[Action verb] the [object]..." */
  behavior: string;
  /** Standard: "...within [time/accuracy], per [reference]" */
  standard: string;
  /** Bloom's Taxonomy cognitive level (1-6) */
  cognitiveLevel: CognitiveLevel;
  /** Action verb used in the behavior */
  verb: string;
  /** Justification for verb/level selection */
  justification: string;
  /** Source reference (page/section citation) */
  sourceRef: string;
  /** Link to associated T&R Event for traceability */
  trEventId: string;
}

/** Terminal Learning Objective */
export type TLO = LearningObjective & { type: 'TLO' };

/** Enabling Learning Objective */
export type ELO = LearningObjective & { type: 'ELO'; parentId: string };

/** Quiz question option */
export interface QuizOption {
  /** Option label (A, B, C, D) */
  label: string;
  /** Option text */
  text: string;
  /** Whether this is the correct answer */
  isCorrect: boolean;
}

/** Quiz item (multiple choice question) */
export interface QuizItem {
  /** Unique identifier */
  id: string;
  /** Maps to specific ELO */
  eloId: string;
  /** Question text */
  question: string;
  /** Answer options */
  options: QuizOption[];
  /** Explanation of correct answer */
  explanation: string;
  /** Source reference (page/section citation) */
  sourceRef: string;
}

/** Main point in MLF body */
export interface MainPoint {
  /** Point title */
  title: string;
  /** Content/explanation */
  content: string;
  /** Supporting details or sub-points */
  subPoints?: string[];
}

/** Master Lesson File section structure */
export interface MLFSection {
  /** Section title */
  title: string;
  /** Associated TLO ID */
  tloId: string;
  /** Introduction section */
  introduction: {
    /** Gain attention statement */
    gainAttention: string;
    /** Lesson overview */
    overview: string;
    /** Learning objectives to cover */
    objectives: string[];
  };
  /** Body section */
  body: {
    /** Main teaching points */
    mainPoints: MainPoint[];
  };
  /** Practical application section */
  practicalApplication: {
    /** Scenario description */
    scenario: string;
    /** Steps for hands-on practice */
    steps: string[];
  };
  /** Conclusion section */
  conclusion: {
    /** Summary of key points */
    summary: string;
    /** Closing statement */
    closingStatement: string;
  };
}

/** WIIFM Question and Answer */
export interface WIIFMQuestion {
  question: string;
  answer: string;
}

/** WIIFM Category (7 total) */
export interface WIIFMCategory {
  name: string;
  questions: WIIFMQuestion[];
}

/** WIIFM Checklist for a TLO/Lesson */
export interface WIIFMChecklist {
  id: string;
  tloId: string;
  lessonTitle: string;
  categories: WIIFMCategory[];
  formula: string;
  sourceRef: string;
}

/** Extracted task from source material */
export interface Task {
  /** Task identifier */
  id: string;
  /** Task title/description */
  title: string;
  /** Detailed description */
  description: string;
  /** Source reference */
  sourceRef: string;
  /** Suggested cognitive level */
  suggestedLevel?: CognitiveLevel;
}

/** Document content after parsing */
export interface DocumentContent {
  /** Document title */
  title: string;
  /** Source file path */
  sourcePath: string;
  /** Full text content */
  text: string;
  /** Structured sections if available */
  sections?: DocumentSection[];
  /** Document metadata */
  metadata?: Record<string, string>;
}

/** Document section */
export interface DocumentSection {
  /** Section heading */
  heading: string;
  /** Section level (1 = top level) */
  level: number;
  /** Section content */
  content: string;
  /** Page reference if available */
  pageRef?: string;
}

/** Project configuration */
export interface ProjectConfig {
  /** Target population description */
  targetPopulation?: string;
  /** Source document path */
  sourceDocument?: string;
  /** Output directory */
  outputDir: string;
  /** AI provider (openai, anthropic, or google) */
  aiProvider: 'openai' | 'anthropic' | 'google';
  /** AI model to use */
  aiModel: string;
}

/** Generation result with metadata */
export interface GenerationResult<T> {
  /** Generated items */
  items: T[];
  /** Generation timestamp */
  timestamp: Date;
  /** Source document reference */
  sourceDocument: string;
  /** Any warnings or notes */
  warnings?: string[];
}

/** Review status for two-pass workflow */
export type ReviewStatus = 'pending' | 'accepted' | 'rejected' | 'modified';

/** Review item wrapper */
export interface ReviewItem<T> {
  /** Original generated item */
  item: T;
  /** Review status */
  status: ReviewStatus;
  /** User feedback if rejected/modified */
  feedback?: string;
  /** Modified version if changed */
  modifiedItem?: T;
}
