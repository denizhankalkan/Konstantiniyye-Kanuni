// Compiles every story/*.ink file into public/story/*.json.
// Usage: node scripts/compile-ink.mjs  (also runs before `npm start` / `npm run build`)
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, basename } from 'node:path';
import * as ink from 'inkjs/full';

const SRC = 'story';
const OUT = 'public/story';
mkdirSync(OUT, { recursive: true });

let failed = false;
for (const file of readdirSync(SRC).filter((f) => f.endsWith('.ink'))) {
  const source = readFileSync(join(SRC, file), 'utf-8');
  const compiler = new ink.Compiler(source);
  let story;
  try {
    story = compiler.Compile();
  } catch (e) {
    // errors are collected below
  }
  for (const w of compiler.warnings ?? []) console.warn(`⚠ ${file}: ${w}`);
  if (compiler.errors?.length || !story) {
    failed = true;
    for (const e of compiler.errors ?? []) console.error(`✖ ${file}: ${e}`);
    continue;
  }
  const out = join(OUT, basename(file, '.ink') + '.json');
  writeFileSync(out, story.ToJson());
  console.log(`✔ ${file} → ${out}`);
}
if (failed) process.exit(1);
