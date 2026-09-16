# Security Blueprint

Purpose: This file establishes the security rules for the project. It has the highest precedence of all context files (see `claude.md`).

## 0. Baseline Best Practices

- **Never Hardcode Secrets:** API keys are read only from environment variables (`src/ai/client.ts`). No key may appear in source, docs, sample output, or commit history.
- **Use a `.gitignore` file:** `.env`, `.env.local`, `cbm-config.json`, and `output/` are ignored so credentials and real runs are never committed.
- **Use Environment Variables:** Local development uses `.env.local`, loaded by `dotenv`.
- **Apply the Principle of Least Privilege:** Provider keys should be created for this tool alone, with spending limits set at the provider.

---

## 1. Data Sensitivity Level

- **My Project's Data is: Public / Unclassified only.** The tool sends source text to a commercial LLM API. Therefore:
  - Only material that is approved for public release may be processed. The committed sample uses MCRP 3-40.3C (Antenna Handbook), a publicly distributed Marine Corps reference publication.
  - Do not process Controlled Unclassified Information (CUI), For Official Use Only material, export-controlled technical data, or anything classified. Handling those requires an approved, accredited environment and is out of scope for this repository.
  - Do not commit meeting transcripts, personal notes, or anything that names or quotes individuals. Generated artifacts and sample outputs must be free of personally identifiable information.

---

## 2. Authentication & Authorization

- **Authentication Method: None.** The CLI runs locally under the operating-system user who launched it. Provider APIs authenticate with the user's own key.
- **Authorization Rules: N/A.** There is no multi-user surface.

---

## 3. Dependency & Supply Chain Security

- **How We Check Dependencies:** `npm audit` must report zero vulnerabilities before a release. Enable Dependabot or an equivalent scanner on the hosting repository.
- **Rule for Adding New Dependencies:** Add to `sbom.md` first, prefer well-maintained packages with a clear license, and pin with caret ranges in `package.json`. Provider SDKs are the only network-facing dependencies and must come directly from the vendor's official npm package.

---

## 4. Secrets Management & Best Practices

- **Where Secrets are Stored:** In a local `.env.local` file that is git-ignored. Nothing is stored in the repository or in `cbm-config.json`.
- **Who Has Access to Secrets:** Only the individual running the tool. Each user supplies their own provider key.
- **Before Publishing or Sharing:** Re-run a secrets scan across the working tree and full git history. If anything sensitive has ever been committed, rewrite history or start a fresh repository rather than relying on a later delete.
