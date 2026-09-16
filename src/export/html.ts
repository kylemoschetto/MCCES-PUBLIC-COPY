/**
 * HTML Export - Generate MARADMIN-styled dashboard for curriculum artifacts
 * Design reference: Marines.mil MARADMIN pages
 */
import * as fs from 'fs';
import * as path from 'path';
import { TREvent, TLO, ELO, QuizItem, MLFSection, WIIFMChecklist, COGNITIVE_LEVELS } from '../types';
import { GeneratedTLO } from '../generation/tlo-generator';
import { GeneratedELO } from '../generation/elo-generator';
import { GeneratedMLFSection } from '../generation/mlf-generator';

/**
 * Get inline CSS styles (MARADMIN color scheme)
 */
export function getStyles(): string {
  return `
    :root {
      --color-bg-primary: #1a1a1a;
      --color-bg-card: #2d2d2d;
      --color-accent: #C8102E;
      --color-text-primary: #ffffff;
      --color-text-secondary: #b0b0b0;
      --color-border: #444444;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: var(--color-bg-primary);
      color: var(--color-text-primary);
      line-height: 1.6;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    /* Header */
    .header {
      border-bottom: 4px solid var(--color-accent);
      padding-bottom: 20px;
      margin-bottom: 30px;
    }

    .header-title {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 10px;
    }

    .header-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
    }

    .header-date {
      color: var(--color-text-secondary);
      font-size: 0.9rem;
    }

    .ai-watermark {
      background-color: var(--color-accent);
      color: white;
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    /* Tab Navigation */
    .tabs {
      display: flex;
      gap: 4px;
      margin-bottom: 30px;
      flex-wrap: wrap;
    }

    .tab {
      background-color: var(--color-bg-card);
      color: var(--color-text-secondary);
      border: none;
      padding: 12px 24px;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s ease;
      border-radius: 4px 4px 0 0;
    }

    .tab:hover {
      background-color: #3d3d3d;
      color: var(--color-text-primary);
    }

    .tab.active {
      background-color: var(--color-accent);
      color: white;
    }

    /* Content Sections */
    .content-section {
      display: none;
    }

    .content-section.active {
      display: block;
    }

    /* Cards */
    .card {
      background-color: var(--color-bg-card);
      border-left: 4px solid var(--color-accent);
      border-radius: 0 4px 4px 0;
      padding: 20px;
      margin-bottom: 20px;
    }

    .card-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 15px;
      color: var(--color-text-primary);
    }

    .card-subtitle {
      font-size: 1rem;
      font-weight: 500;
      color: var(--color-accent);
      margin-bottom: 10px;
    }

    .card-content {
      color: var(--color-text-secondary);
    }

    .card-content p {
      margin-bottom: 10px;
    }

    /* Badges */
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      margin-right: 8px;
      margin-bottom: 8px;
    }

    .badge-tlo {
      background-color: var(--color-accent);
      color: white;
    }

    .badge-elo {
      background-color: #555555;
      color: white;
    }

    .badge-level {
      background-color: #1e5631;
      color: white;
    }

    /* Lists */
    .step-list {
      list-style-type: decimal;
      padding-left: 20px;
      color: var(--color-text-secondary);
    }

    .step-list li {
      margin-bottom: 8px;
    }

    /* Tables */
    .data-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }

    .data-table th,
    .data-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid var(--color-border);
    }

    .data-table th {
      background-color: var(--color-bg-card);
      color: var(--color-text-primary);
      font-weight: 600;
    }

    .data-table td {
      color: var(--color-text-secondary);
    }

    .data-table tr:hover td {
      background-color: rgba(200, 16, 46, 0.1);
    }

    /* Quiz */
    .quiz-question {
      background-color: var(--color-bg-card);
      border-left: 4px solid var(--color-accent);
      border-radius: 0 4px 4px 0;
      padding: 20px;
      margin-bottom: 20px;
    }

    .quiz-question-number {
      color: var(--color-accent);
      font-weight: 700;
      margin-bottom: 10px;
    }

    .quiz-question-text {
      font-size: 1.1rem;
      margin-bottom: 15px;
    }

    .quiz-options {
      list-style: none;
    }

    .quiz-option {
      padding: 10px 15px;
      margin-bottom: 8px;
      background-color: rgba(255, 255, 255, 0.05);
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .quiz-option:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .quiz-option.correct {
      background-color: rgba(30, 86, 49, 0.5);
      border-left: 3px solid #28a745;
    }

    .quiz-answer {
      display: none;
      margin-top: 15px;
      padding: 15px;
      background-color: rgba(30, 86, 49, 0.2);
      border-radius: 4px;
    }

    .quiz-answer.visible {
      display: block;
    }

    .quiz-answer-label {
      color: #28a745;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .quiz-explanation {
      color: var(--color-text-secondary);
      font-style: italic;
    }

    .toggle-answers-btn {
      background-color: var(--color-accent);
      color: white;
      border: none;
      padding: 12px 24px;
      font-size: 1rem;
      cursor: pointer;
      border-radius: 4px;
      margin-bottom: 20px;
      transition: background-color 0.2s;
    }

    .toggle-answers-btn:hover {
      background-color: #a00d24;
    }

    /* MLF Sections */
    .mlf-section {
      margin-bottom: 40px;
    }

    .mlf-section-title {
      font-size: 1.5rem;
      color: var(--color-accent);
      border-bottom: 2px solid var(--color-accent);
      padding-bottom: 10px;
      margin-bottom: 20px;
    }

    .mlf-subsection {
      margin-bottom: 25px;
    }

    .mlf-subsection-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--color-text-primary);
      margin-bottom: 10px;
    }

    .mlf-content {
      color: var(--color-text-secondary);
      padding-left: 15px;
      border-left: 2px solid var(--color-border);
    }

    /* WIIFM Checklist Styles */
    .wiifm-checklist {
      margin-bottom: 40px;
    }

    .wiifm-checklist-title {
      font-size: 1.5rem;
      color: var(--color-accent);
      border-bottom: 2px solid var(--color-accent);
      padding-bottom: 10px;
      margin-bottom: 20px;
    }

    .wiifm-formula {
      background: linear-gradient(135deg, rgba(200, 16, 46, 0.1) 0%, rgba(200, 16, 46, 0.05) 100%);
      border-left: 4px solid var(--color-accent);
      padding: 20px;
      margin-bottom: 25px;
      border-radius: 0 8px 8px 0;
      font-size: 1.1rem;
      font-style: italic;
      color: var(--color-text-primary);
    }

    .wiifm-formula-label {
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      color: var(--color-accent);
      margin-bottom: 8px;
      font-style: normal;
    }

    .wiifm-category {
      background-color: var(--color-bg-card);
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 15px;
    }

    .wiifm-category-title {
      color: var(--color-accent);
      font-weight: 600;
      font-size: 1.1rem;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .wiifm-category-icon {
      font-size: 1.2rem;
    }

    .wiifm-qa {
      padding-left: 15px;
      border-left: 2px solid var(--color-border);
      margin-bottom: 12px;
    }

    .wiifm-question {
      color: var(--color-text-secondary);
      font-weight: 500;
      margin-bottom: 5px;
    }

    .wiifm-answer {
      color: var(--color-text-primary);
    }

    /* Footer */
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid var(--color-border);
      text-align: center;
      color: var(--color-text-secondary);
      font-size: 0.85rem;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .tabs {
        flex-direction: column;
      }

      .tab {
        border-radius: 4px;
      }

      .header-meta {
        flex-direction: column;
        align-items: flex-start;
      }

      .data-table {
        font-size: 0.85rem;
      }

      .data-table th,
      .data-table td {
        padding: 8px;
      }
    }

    /* Print Styles */
    @media print {
      body {
        background-color: white;
        color: black;
      }

      .tabs {
        display: none;
      }

      .content-section {
        display: block !important;
        page-break-before: always;
      }

      .content-section:first-of-type {
        page-break-before: avoid;
      }

      .card {
        background-color: white;
        border: 1px solid #ddd;
        border-left: 4px solid var(--color-accent);
        box-shadow: none;
      }

      .quiz-answer {
        display: block !important;
      }

      .toggle-answers-btn {
        display: none;
      }

      .header {
        border-bottom-color: black;
      }

      .ai-watermark {
        background-color: white;
        color: var(--color-accent);
        border: 1px solid var(--color-accent);
      }
    }
  `;
}

/**
 * Get tab navigation JavaScript
 */
export function getScript(): string {
  return `
    document.addEventListener('DOMContentLoaded', function() {
      // Tab navigation
      const tabs = document.querySelectorAll('.tab');
      const sections = document.querySelectorAll('.content-section');

      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const target = tab.dataset.tab;

          // Update active tab
          tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');

          // Show target section
          sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === target) {
              section.classList.add('active');
            }
          });
        });
      });

      // Quiz answer toggle
      const toggleBtn = document.getElementById('toggle-answers');
      if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
          const answers = document.querySelectorAll('.quiz-answer');
          const isShowing = toggleBtn.textContent.includes('Hide');

          answers.forEach(answer => {
            answer.classList.toggle('visible', !isShowing);
          });

          toggleBtn.textContent = isShowing ? 'Show Answers' : 'Hide Answers';
        });
      }
    });
  `;
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Export T&R Events section to HTML
 */
export function exportTREventsSection(events: TREvent[]): string {
  if (events.length === 0) {
    return '<p>No T&R events available.</p>';
  }

  let html = '';

  for (const event of events) {
    html += `
      <div class="card">
        <div class="card-title">${escapeHtml(event.id)}: ${escapeHtml(event.title)}</div>
        <div class="card-content">
          <div class="card-subtitle">Condition</div>
          <p>${escapeHtml(event.condition)}</p>

          <div class="card-subtitle">Standard</div>
          <p>${escapeHtml(event.standard)}</p>

          <div class="card-subtitle">Performance Steps</div>
          <ol class="step-list">
            ${event.performanceSteps.map(step => `<li>${escapeHtml(step)}</li>`).join('')}
          </ol>

          <p style="margin-top: 15px; font-size: 0.85rem;">
            <strong>Source:</strong> ${escapeHtml(event.sourceRef)}
          </p>
        </div>
      </div>
    `;
  }

  return html;
}

/**
 * Export TLO/ELO Matrix section to HTML
 */
export function exportObjectivesSection(
  tlos: (TLO | GeneratedTLO)[],
  elos: (ELO | GeneratedELO)[]
): string {
  if (tlos.length === 0) {
    return '<p>No learning objectives available.</p>';
  }

  let html = '';

  // Summary table
  html += `
    <table class="data-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Type</th>
          <th>Cognitive Level</th>
          <th>Action Verb</th>
        </tr>
      </thead>
      <tbody>
  `;

  for (const tlo of tlos) {
    html += `
      <tr>
        <td>${escapeHtml(tlo.id)}</td>
        <td><span class="badge badge-tlo">TLO</span></td>
        <td>${tlo.cognitiveLevel} - ${COGNITIVE_LEVELS[tlo.cognitiveLevel]}</td>
        <td>${escapeHtml(tlo.verb)}</td>
      </tr>
    `;
  }

  // Sort ELOs by parentId for grouping, handling undefined parentId
  const sortedElos = [...elos].sort((a, b) => {
    const aParent = a.parentId ?? '';
    const bParent = b.parentId ?? '';
    return aParent.localeCompare(bParent);
  });

  for (const elo of sortedElos) {
    html += `
      <tr>
        <td>${escapeHtml(elo.id)}</td>
        <td><span class="badge badge-elo">ELO (${escapeHtml(elo.parentId ?? 'N/A')})</span></td>
        <td>${elo.cognitiveLevel} - ${COGNITIVE_LEVELS[elo.cognitiveLevel]}</td>
        <td>${escapeHtml(elo.verb)}</td>
      </tr>
    `;
  }

  html += `
      </tbody>
    </table>
  `;

  // Detailed view
  html += '<h3 style="margin: 30px 0 20px; color: var(--color-accent);">Detailed Objectives</h3>';

  for (const tlo of tlos) {
    html += `
      <div class="card">
        <div class="card-title">
          <span class="badge badge-tlo">TLO</span>
          <span class="badge badge-level">Level ${tlo.cognitiveLevel}: ${COGNITIVE_LEVELS[tlo.cognitiveLevel]}</span>
          ${escapeHtml(tlo.id)}
        </div>
        <div class="card-content">
          <p><strong>T&R Event:</strong> ${escapeHtml(tlo.trEventId)}</p>

          <div class="card-subtitle" style="margin-top: 15px;">Condition</div>
          <p>${escapeHtml(tlo.condition)}</p>

          <div class="card-subtitle">Behavior</div>
          <p>${escapeHtml(tlo.behavior)}</p>

          <div class="card-subtitle">Standard</div>
          <p>${escapeHtml(tlo.standard)}</p>

          <p style="margin-top: 15px;"><strong>Action Verb:</strong> ${escapeHtml(tlo.verb)}</p>
          <p><strong>Justification:</strong> ${escapeHtml(tlo.justification)}</p>
          <p><strong>Source:</strong> ${escapeHtml(tlo.sourceRef)}</p>
        </div>
      </div>
    `;

    // Associated ELOs
    const tloElos = elos.filter(e => e.parentId === tlo.id);
    if (tloElos.length > 0) {
      for (const elo of tloElos) {
        html += `
          <div class="card" style="margin-left: 30px;">
            <div class="card-title">
              <span class="badge badge-elo">ELO</span>
              <span class="badge badge-level">Level ${elo.cognitiveLevel}: ${COGNITIVE_LEVELS[elo.cognitiveLevel]}</span>
              ${escapeHtml(elo.id)}
            </div>
            <div class="card-content">
              <div class="card-subtitle">Condition</div>
              <p>${escapeHtml(elo.condition)}</p>

              <div class="card-subtitle">Behavior</div>
              <p>${escapeHtml(elo.behavior)}</p>

              <div class="card-subtitle">Standard</div>
              <p>${escapeHtml(elo.standard)}</p>

              <p style="margin-top: 15px;"><strong>Action Verb:</strong> ${escapeHtml(elo.verb)}</p>
              <p><strong>Justification:</strong> ${escapeHtml(elo.justification)}</p>
              <p><strong>Source:</strong> ${escapeHtml(elo.sourceRef)}</p>
            </div>
          </div>
        `;
      }
    }
  }

  return html;
}

/**
 * Export Master Lesson File section to HTML
 */
export function exportMLFSection(sections: (MLFSection | GeneratedMLFSection)[]): string {
  if (sections.length === 0) {
    return '<p>No lesson sections available.</p>';
  }

  let html = '';

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    html += `
      <div class="mlf-section">
        <div class="mlf-section-title">Lesson ${i + 1}: ${escapeHtml(section.title)}</div>
        <p style="margin-bottom: 20px;"><span class="badge badge-tlo">TLO: ${escapeHtml(section.tloId)}</span></p>

        <!-- Introduction -->
        <div class="mlf-subsection">
          <div class="mlf-subsection-title">Introduction</div>
          <div class="mlf-content">
            <p><strong>Gain Attention:</strong> ${escapeHtml(section.introduction.gainAttention)}</p>
            <p style="margin-top: 10px;"><strong>Overview:</strong> ${escapeHtml(section.introduction.overview)}</p>
            <p style="margin-top: 10px;"><strong>Objectives:</strong></p>
            <ul style="margin-left: 20px;">
              ${section.introduction.objectives.map(obj => `<li>${escapeHtml(obj)}</li>`).join('')}
            </ul>
          </div>
        </div>

        <!-- Body -->
        <div class="mlf-subsection">
          <div class="mlf-subsection-title">Body</div>
          <div class="mlf-content">
            ${section.body.mainPoints.map(point => `
              <div style="margin-bottom: 15px;">
                <p><strong>${escapeHtml(point.title)}</strong></p>
                <p>${escapeHtml(point.content)}</p>
                ${point.subPoints && point.subPoints.length > 0 ? `
                  <ul style="margin-left: 20px; margin-top: 5px;">
                    ${point.subPoints.map(sub => `<li>${escapeHtml(sub)}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Practical Application -->
        <div class="mlf-subsection">
          <div class="mlf-subsection-title">Practical Application</div>
          <div class="mlf-content">
            <p><strong>Scenario:</strong> ${escapeHtml(section.practicalApplication.scenario)}</p>
            <p style="margin-top: 10px;"><strong>Practice Steps:</strong></p>
            <ol class="step-list" style="margin-left: 20px;">
              ${section.practicalApplication.steps.map(step => `<li>${escapeHtml(step)}</li>`).join('')}
            </ol>
          </div>
        </div>

        <!-- Conclusion -->
        <div class="mlf-subsection">
          <div class="mlf-subsection-title">Conclusion</div>
          <div class="mlf-content">
            <p><strong>Summary:</strong> ${escapeHtml(section.conclusion.summary)}</p>
            <p style="margin-top: 10px;"><strong>Closing Statement:</strong> ${escapeHtml(section.conclusion.closingStatement)}</p>
          </div>
        </div>
      </div>
    `;
  }

  return html;
}

/**
 * Get category icon for WIIFM display
 */
function getWIIFMCategoryIcon(categoryName: string): string {
  const icons: Record<string, string> = {
    'Mission Relevance': '&#127919;', // Target
    'Individual Marine Impact': '&#128170;', // Flexed biceps
    'Career & Professional Development': '&#128200;', // Chart increasing
    'Time & Effort Justification': '&#9200;', // Alarm clock
    'Operational Consequences': '&#9888;&#65039;', // Warning
    'Immediate Application': '&#128295;', // Wrench
    'Leader Credibility Check': '&#11088;', // Star
  };
  return icons[categoryName] || '&#9679;'; // Default bullet
}

/**
 * Export WIIFM Checklists section to HTML
 */
export function exportWIIFMSection(checklists: WIIFMChecklist[]): string {
  if (checklists.length === 0) {
    return '<p>No WIIFM checklists available.</p>';
  }

  let html = `
    <p style="color: var(--color-text-secondary); margin-bottom: 25px;">
      <strong>About WIIFM:</strong> "What's In It For Me" checklists help instructors justify why training matters to Marines.
      Use these talking points to connect lesson content to real-world relevance.
    </p>
  `;

  for (let i = 0; i < checklists.length; i++) {
    const checklist = checklists[i];
    html += `
      <div class="wiifm-checklist">
        <div class="wiifm-checklist-title">Lesson ${i + 1}: ${escapeHtml(checklist.lessonTitle)}</div>
        <p style="margin-bottom: 20px;"><span class="badge badge-tlo">TLO: ${escapeHtml(checklist.tloId)}</span></p>

        <!-- One-Line Formula -->
        <div class="wiifm-formula">
          <div class="wiifm-formula-label">One-Line WIIFM</div>
          ${escapeHtml(checklist.formula)}
        </div>

        <!-- Categories -->
        ${checklist.categories.map(category => `
          <div class="wiifm-category">
            <div class="wiifm-category-title">
              <span class="wiifm-category-icon">${getWIIFMCategoryIcon(category.name)}</span>
              ${escapeHtml(category.name)}
            </div>
            ${category.questions.map(qa => `
              <div class="wiifm-qa">
                <div class="wiifm-question">Q: ${escapeHtml(qa.question)}</div>
                <div class="wiifm-answer">${escapeHtml(qa.answer)}</div>
              </div>
            `).join('')}
          </div>
        `).join('')}

        <p style="font-size: 0.85rem; color: var(--color-text-secondary);">
          <strong>Source:</strong> ${escapeHtml(checklist.sourceRef)}
        </p>
      </div>
    `;
  }

  return html;
}

/**
 * Export Quiz section to HTML with answer toggle
 */
export function exportQuizSection(questions: QuizItem[]): string {
  if (questions.length === 0) {
    return '<p>No quiz questions available.</p>';
  }

  let html = `
    <button id="toggle-answers" class="toggle-answers-btn">Show Answers</button>
    <p style="color: var(--color-text-secondary); margin-bottom: 20px;">
      <strong>Instructions:</strong> Select the best answer for each question.
    </p>
  `;

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const correctOption = q.options.find(o => o.isCorrect);

    html += `
      <div class="quiz-question">
        <div class="quiz-question-number">Question ${i + 1}</div>
        <div class="quiz-question-text">${escapeHtml(q.question)}</div>
        <ul class="quiz-options">
          ${q.options.map(opt => `
            <li class="quiz-option${opt.isCorrect ? ' correct' : ''}" style="${opt.isCorrect ? '' : ''}">
              <strong>${opt.label}.</strong> ${escapeHtml(opt.text)}
            </li>
          `).join('')}
        </ul>
        <div class="quiz-answer">
          <div class="quiz-answer-label">Correct Answer: ${correctOption?.label}. ${escapeHtml(correctOption?.text || '')}</div>
          <div class="quiz-explanation">${escapeHtml(q.explanation)}</div>
          <p style="margin-top: 10px; font-size: 0.85rem; color: var(--color-text-secondary);">
            <strong>ELO:</strong> ${escapeHtml(q.eloId)} | <strong>Source:</strong> ${escapeHtml(q.sourceRef)}
          </p>
        </div>
      </div>
    `;
  }

  return html;
}

/**
 * Export all curriculum artifacts to a single HTML dashboard
 */
export function exportCurriculumToHTML(
  title: string,
  trEvents: TREvent[],
  tlos: (TLO | GeneratedTLO)[],
  elos: (ELO | GeneratedELO)[],
  mlf: (MLFSection | GeneratedMLFSection)[],
  wiifm: WIIFMChecklist[],
  quiz: QuizItem[]
): string {
  const generatedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)} - Curriculum Dashboard</title>
  <style>${getStyles()}</style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <header class="header">
      <h1 class="header-title">${escapeHtml(title)}</h1>
      <div class="header-meta">
        <span class="header-date">Generated: ${generatedDate}</span>
        <span class="ai-watermark">AI-Generated Content</span>
      </div>
    </header>

    <!-- Tab Navigation -->
    <nav class="tabs">
      <button class="tab active" data-tab="tr-events">T&R Events</button>
      <button class="tab" data-tab="objectives">Objectives</button>
      <button class="tab" data-tab="mlf">Master Lesson File</button>
      <button class="tab" data-tab="wiifm">WIIFM</button>
      <button class="tab" data-tab="quiz">Quiz</button>
    </nav>

    <!-- T&R Events Section -->
    <section id="tr-events" class="content-section active">
      <h2 style="margin-bottom: 20px;">Training and Readiness Events</h2>
      ${exportTREventsSection(trEvents)}
    </section>

    <!-- Objectives Section -->
    <section id="objectives" class="content-section">
      <h2 style="margin-bottom: 20px;">Learning Objectives Matrix</h2>
      ${exportObjectivesSection(tlos, elos)}
    </section>

    <!-- MLF Section -->
    <section id="mlf" class="content-section">
      <h2 style="margin-bottom: 20px;">Master Lesson File</h2>
      ${exportMLFSection(mlf)}
    </section>

    <!-- WIIFM Section -->
    <section id="wiifm" class="content-section">
      <h2 style="margin-bottom: 20px;">What's In It For Me (WIIFM)</h2>
      ${exportWIIFMSection(wiifm)}
    </section>

    <!-- Quiz Section -->
    <section id="quiz" class="content-section">
      <h2 style="margin-bottom: 20px;">Assessment Quiz</h2>
      ${exportQuizSection(quiz)}
    </section>

    <!-- Footer -->
    <footer class="footer">
      <p>Curriculum Builder and Maintainer (CBM) v0.1.0</p>
      <p>AI-Powered USMC Curriculum Development</p>
    </footer>
  </div>

  <script>${getScript()}</script>
</body>
</html>`;
}

/**
 * Write HTML content to file
 */
export async function writeHTMLFile(content: string, filePath: string): Promise<void> {
  const dir = path.dirname(filePath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(filePath, content, 'utf-8');
}
