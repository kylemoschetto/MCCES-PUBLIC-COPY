# Testing Strategy

Purpose: This file states what automated checks exist, what they cover, and what still relies on human review.

---

## 1. Our Testing Philosophy

- **Overall Goal:** Keep the pipeline runnable end to end and keep generated artifacts structurally valid. This is a prototype whose most important "test" is a subject-matter expert reviewing the output, so automation focuses on the parts a machine can judge: types compile, lint passes, and generated JSON matches the expected schema.

---

## 2. Types of Tests We Will Write

- **Unit Tests:** Not yet. The highest-value candidates are the pure functions in `src/ai/validators.ts` (schema and Bloom's-verb checks) and the parsers in `src/ingestion/`. Contributions here are welcome.
- **Integration Tests:** Not yet. A future test could run `generate` against the committed `output-v2/ingested/` content with a mocked provider adapter, which avoids spending API credits.
- **End-to-End (E2E) Tests:** Manual. The committed `output-v2/` run is the reference result; a full `cbm pipeline` run against `MCRP 3-40.3C.md` should produce artifacts of the same shape.

---

## 3. Testing Frameworks & Tools

- **Main Testing Tool(s):** TypeScript compiler (`tsc --noEmit`) and ESLint. No test runner is configured yet; when one is added, prefer `vitest` for its native TypeScript support.
- **How to Run Tests (Command):** `npm test` (runs `npm run typecheck` then `npm run lint`).

---

## 4. Key Test Scenarios

These are the behaviors that must keep working. Today they are verified by hand against the sample run.

- **Scenario 1:** Ingesting a Markdown manual produces `content.json` with section structure preserved and `tasks.json` with at least one trainable task.
- **Scenario 2:** Every generated TLO has a condition, a behavior with an approved Bloom's verb, and a standard, and every ELO maps to exactly one TLO.
- **Scenario 3:** Every quiz item maps to an existing TLO or ELO, and the answer key matches one of the offered choices.
- **Scenario 4:** `export --format all` writes Markdown, DOCX, and a self-contained HTML dashboard that opens offline.
- **Scenario 5:** Running with no API key exits with a clear message naming the three supported environment variables.
