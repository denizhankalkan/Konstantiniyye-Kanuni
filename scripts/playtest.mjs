// Plays every compiled story many times with random choices and reports
// runtime errors, dead ends and the spread of final stats.
// Usage: node scripts/playtest.mjs [runs] [--print]
import { readdirSync, readFileSync } from 'node:fs';
import * as ink from 'inkjs/full';

const runs = Number(process.argv[2] ?? 300);
const print = process.argv.includes('--print');
const STATS = ['hazine', 'yeniceri', 'divan', 'harem', 'halk'];

for (const file of readdirSync('public/story').filter((f) => f.endsWith('.json'))) {
  const json = readFileSync(`public/story/${file}`, 'utf-8');
  const endings = new Map();
  let errors = 0;
  for (let i = 0; i < runs; i++) {
    const story = new ink.Story(json);
    story.onError = (msg) => {
      errors++;
      console.error(`✖ ${file} run ${i}: ${msg}`);
    };
    let steps = 0;
    while (steps++ < 500) {
      while (story.canContinue) {
        const line = story.Continue();
        if (print && i === 0)
          console.log(`${line.trim()}  ${story.currentTags.map((t) => '#' + t).join(' ')}`);
      }
      if (!story.currentChoices.length) break;
      const pick = Math.floor(Math.random() * story.currentChoices.length);
      if (print && i === 0) console.log(`  → [${story.currentChoices[pick].text}]`);
      story.ChooseChoiceIndex(pick);
    }
    const key = STATS.map((s) => story.variablesState[s]).join('/');
    endings.set(key, (endings.get(key) ?? 0) + 1);
  }
  console.log(
    `✔ ${file}: ${runs} runs, ${errors} errors, ${endings.size} distinct final states (${STATS.join('/')})`,
  );
}
