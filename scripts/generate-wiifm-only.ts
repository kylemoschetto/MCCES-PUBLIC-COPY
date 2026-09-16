/**
 * Script to generate WIIFM checklists from existing artifacts
 * Run with: npx ts-node scripts/generate-wiifm-only.ts
 */
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

import { createAIClient } from '../src/ai/client';
import { generateWIIFM } from '../src/generation/wiifm-generator';
import { DocumentContent } from '../src/types';
import { GeneratedTLO } from '../src/generation/tlo-generator';
import { GeneratedMLFSection } from '../src/generation/mlf-generator';

async function main() {
  const inputDir = path.resolve('./output-v2/pass1');
  const ingestedDir = path.resolve('./output-v2/ingested');

  console.log('Loading existing artifacts...');

  // Load content
  const content = JSON.parse(
    fs.readFileSync(path.join(ingestedDir, 'content.json'), 'utf-8')
  ) as DocumentContent;

  // Load TLOs and MLF
  const tlos = JSON.parse(
    fs.readFileSync(path.join(inputDir, 'tlos.json'), 'utf-8')
  ) as GeneratedTLO[];

  const mlf = JSON.parse(
    fs.readFileSync(path.join(inputDir, 'mlf.json'), 'utf-8')
  ) as GeneratedMLFSection[];

  console.log(`Loaded ${tlos.length} TLOs and ${mlf.length} MLF sections`);

  // Create AI client
  const client = createAIClient({});

  console.log('Generating WIIFM checklists...');
  const wiifm = await generateWIIFM(client, tlos, mlf, content, { parallel: true, maxConcurrency: 3 });

  console.log(`Generated ${wiifm.length} WIIFM checklists`);

  // Save to pass1 directory
  const outputPath = path.join(inputDir, 'wiifm.json');
  fs.writeFileSync(outputPath, JSON.stringify(wiifm, null, 2));
  console.log(`Saved to ${outputPath}`);
}

main().catch(console.error);
