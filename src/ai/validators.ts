/**
 * Validators for AI-generated curriculum content
 */
import { BLOOM_VERBS, CognitiveLevel, LearningObjective, TREvent, QuizItem } from '../types';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate that a verb is appropriate for the cognitive level
 */
export function validateBloomsVerb(verb: string, level: CognitiveLevel): ValidationResult {
  const result: ValidationResult = { valid: true, errors: [], warnings: [] };

  const approvedVerbs = BLOOM_VERBS[level];
  const normalizedVerb = verb.toLowerCase();

  // Check if verb is in approved list for this level
  const isApproved = approvedVerbs.some((v) => v.toLowerCase() === normalizedVerb);

  if (!isApproved) {
    // Check if it's approved for a different level
    for (const [lvl, verbs] of Object.entries(BLOOM_VERBS)) {
      if (verbs.some((v) => v.toLowerCase() === normalizedVerb)) {
        result.valid = false;
        result.errors.push(
          `Verb "${verb}" is a Level ${lvl} verb, but Level ${level} was specified. ` +
            `Approved verbs for Level ${level}: ${approvedVerbs.join(', ')}`
        );
        return result;
      }
    }

    // Verb not found in any level
    result.warnings.push(
      `Verb "${verb}" is not in the standard Bloom's Taxonomy verb list. ` +
        `Consider using one of: ${approvedVerbs.join(', ')}`
    );
  }

  return result;
}

/**
 * Validate Mager format for a learning objective
 */
export function validateMagerFormat(objective: LearningObjective): ValidationResult {
  const result: ValidationResult = { valid: true, errors: [], warnings: [] };

  // Check condition
  if (!objective.condition || objective.condition.trim().length < 10) {
    result.valid = false;
    result.errors.push('Condition is missing or too short. Must describe circumstances.');
  } else if (
    !objective.condition.toLowerCase().startsWith('given') &&
    !objective.condition.toLowerCase().includes('when')
  ) {
    result.warnings.push(
      'Condition should typically start with "Given..." or include "when" to describe circumstances.'
    );
  }

  // Check behavior
  if (!objective.behavior || objective.behavior.trim().length < 10) {
    result.valid = false;
    result.errors.push('Behavior is missing or too short. Must describe observable action.');
  }

  // Check that behavior starts with the verb
  if (objective.behavior && objective.verb) {
    const behaviorStart = objective.behavior.trim().split(' ')[0].toLowerCase();
    if (behaviorStart !== objective.verb.toLowerCase()) {
      result.warnings.push(
        `Behavior should start with the action verb "${objective.verb}". ` +
          `Currently starts with "${behaviorStart}".`
      );
    }
  }

  // Check standard
  if (!objective.standard || objective.standard.trim().length < 10) {
    result.valid = false;
    result.errors.push('Standard is missing or too short. Must describe measurable criteria.');
  }

  // Check for measurable elements in standard
  const hasMeasurable =
    /\d+/.test(objective.standard) || // Contains numbers (time, accuracy, etc.)
    objective.standard.toLowerCase().includes('per ') || // References doctrine
    objective.standard.toLowerCase().includes('iaw ') || // In accordance with
    objective.standard.toLowerCase().includes('according to');

  if (!hasMeasurable) {
    result.warnings.push(
      'Standard should include measurable criteria (time limits, accuracy percentages) ' +
        'or reference authoritative sources (per MCRP..., IAW TM...).'
    );
  }

  // Validate verb against cognitive level
  const verbResult = validateBloomsVerb(objective.verb, objective.cognitiveLevel);
  result.errors.push(...verbResult.errors);
  result.warnings.push(...verbResult.warnings);
  if (!verbResult.valid) {
    result.valid = false;
  }

  return result;
}

/**
 * Validate a T&R event
 */
export function validateTREvent(event: TREvent): ValidationResult {
  const result: ValidationResult = { valid: true, errors: [], warnings: [] };

  if (!event.id || event.id.trim().length === 0) {
    result.valid = false;
    result.errors.push('Event ID is required.');
  }

  if (!event.title || event.title.trim().length < 5) {
    result.valid = false;
    result.errors.push('Event title is required and must be descriptive.');
  }

  if (!event.condition || event.condition.trim().length < 20) {
    result.valid = false;
    result.errors.push('Condition must describe the circumstances for performance.');
  }

  if (!event.standard || event.standard.trim().length < 20) {
    result.valid = false;
    result.errors.push('Standard must describe measurable success criteria.');
  }

  if (!event.performanceSteps || event.performanceSteps.length < 2) {
    result.valid = false;
    result.errors.push('Performance steps must include at least 2 steps.');
  }

  if (!event.sourceRef || event.sourceRef.trim().length === 0) {
    result.warnings.push('Source reference is missing. Traceability may be compromised.');
  }

  return result;
}

/**
 * Validate a quiz item
 */
export function validateQuizItem(item: QuizItem): ValidationResult {
  const result: ValidationResult = { valid: true, errors: [], warnings: [] };

  if (!item.question || item.question.trim().length < 10) {
    result.valid = false;
    result.errors.push('Question text is required and must be substantive.');
  }

  if (!item.options || item.options.length !== 4) {
    result.valid = false;
    result.errors.push('Quiz items must have exactly 4 options (A, B, C, D).');
  } else {
    const correctCount = item.options.filter((o) => o.isCorrect).length;
    if (correctCount !== 1) {
      result.valid = false;
      result.errors.push(`Quiz items must have exactly 1 correct answer. Found ${correctCount}.`);
    }

    // Check for obvious patterns
    const lengths = item.options.map((o) => o.text.length);
    const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const hasOutlier = lengths.some((l) => Math.abs(l - avgLength) > avgLength * 0.5);
    if (hasOutlier) {
      result.warnings.push(
        'Option lengths vary significantly. Correct answer may be identifiable by length.'
      );
    }
  }

  if (!item.explanation || item.explanation.trim().length < 20) {
    result.warnings.push('Explanation should describe why the correct answer is right.');
  }

  if (!item.eloId) {
    result.warnings.push('Quiz item should map to a specific ELO for traceability.');
  }

  return result;
}

/**
 * Validate ELO cognitive level is at or below parent TLO
 */
export function validateELOLevel(
  eloLevel: CognitiveLevel,
  tloLevel: CognitiveLevel
): ValidationResult {
  const result: ValidationResult = { valid: true, errors: [], warnings: [] };

  if (eloLevel > tloLevel) {
    result.warnings.push(
      `ELO cognitive level (${eloLevel}) is higher than parent TLO level (${tloLevel}). ` +
        `ELOs typically should be at or below the TLO level.`
    );
  }

  return result;
}
