import { Injectable, computed, inject, signal } from '@angular/core';
import { Story } from 'inkjs';
import { LETTERS, Letter } from '../data/letters';
import { WHISPERS, Whisper } from '../data/whispers';
import { CHARACTERS, CHARACTER_MAP, Character } from '../data/characters';
import { SaveService } from './save.service';
import { ACTORS } from '../data/actors';

export type LineKind = 'narration' | 'speech' | 'thought' | 'pov';

export interface StoryLine {
  id: number;
  kind: LineKind;
  text: string;
  speaker?: string;
}

export interface StoryChoice {
  /** -1: sahne geçişi için yapay "Devam" seçeneği */
  index: number;
  text: string;
}

export const CONTINUE_CHOICE: StoryChoice = { index: -1, text: 'Devam ›' };

export interface SceneMeta {
  chapter: string;
  date: string;
  scene: string;
  pov: string;
  /** Sahnede boy boy duran canlandırılmış karakter (data/actors.ts) */
  actor?: string;
}

export interface StatDelta {
  key: StatKey;
  delta: number;
}

export interface Toast {
  id: number;
  icon: 'letter' | 'whisper' | 'person';
  text: string;
}

export const STAT_KEYS = ['hazine', 'yeniceri', 'divan', 'harem', 'halk'] as const;
export type StatKey = (typeof STAT_KEYS)[number];
export const STAT_LABEL: Record<StatKey, string> = {
  hazine: 'Hazine',
  yeniceri: 'Yeniçeri',
  divan: 'Divan',
  harem: 'Harem',
  halk: 'Halk',
};

interface SaveData {
  version: 1;
  storyFile: string;
  inkState: string;
  page: StoryLine[];
  meta: SceneMeta;
  met: string[];
  pending: { lines: StoryLine[]; meta: SceneMeta } | null;
  savedAt: string;
}

const STORY_FILE = 'story/giris.json';

/** UI'nin okuduğu ink değişkenleri. Yeni bir değişken eklersen buraya da ekle. */
const TRACKED_VARS = [
  ...STAT_KEYS,
  'rel_hafsa',
  'rel_ibrahim',
  'rel_piri',
  'rel_suleyman',
  'leonardo_kimde',
  'kopru_projesi',
  'macar_tutum',
  'adalet_unu',
  ...LETTERS.map((l) => l.var),
  ...WHISPERS.map((w) => w.var),
];

@Injectable({ providedIn: 'root' })
export class StoryService {
  private save = inject(SaveService);
  private story?: Story;
  private lineId = 0;
  private toastId = 0;
  /** Sahne değişince sayfa kesilir; yeni sahnenin ilk satırları burada bekler. */
  private pending: { lines: StoryLine[]; meta: SceneMeta } | null = null;

  readonly page = signal<StoryLine[]>([]);
  readonly choices = signal<StoryChoice[]>([]);
  readonly meta = signal<SceneMeta>({
    chapter: '',
    date: '',
    scene: 'eski-saray-gece',
    pov: 'nazende',
  });
  readonly stats = signal<Record<StatKey, number>>({
    hazine: 50,
    yeniceri: 50,
    divan: 50,
    harem: 50,
    halk: 50,
  });
  readonly deltas = signal<StatDelta[]>([]);
  readonly vars = signal<Record<string, unknown>>({});
  readonly met = signal<string[]>([]);
  readonly ended = signal(false);
  readonly toasts = signal<Toast[]>([]);
  readonly unreadLetters = signal(0);

  readonly letters = computed<Letter[]>(() => LETTERS.filter((l) => this.vars()[l.var] === true));
  readonly whispers = computed<Whisper[]>(() =>
    WHISPERS.filter((w) => this.vars()[w.var] === true),
  );
  readonly characters = computed<Character[]>(() => {
    const v = this.vars();
    const met = new Set(this.met());
    return CHARACTERS.filter((c) => met.has(c.id) || (c.unlockVar && v[c.unlockVar] === true));
  });

  async hasSave(): Promise<boolean> {
    return (await this.save.load<SaveData>()) !== null;
  }

  async newGame(): Promise<void> {
    await this.save.clear();
    await this.init();
    this.met.set(['nazende']);
    this.pending = null;
    this.page.set([]);
    this.ended.set(false);
    this.advance();
  }

  async continueGame(): Promise<boolean> {
    const data = await this.save.load<SaveData>();
    if (!data) return false;
    await this.init();
    this.story!.state.LoadJson(data.inkState);
    this.page.set(data.page);
    this.lineId = Math.max(0, ...data.page.map((l) => l.id)) + 1;
    this.meta.set(data.meta);
    this.met.set(data.met);
    this.pending = data.pending ?? null;
    this.syncVars(false);
    this.choices.set(this.readChoices());
    this.ended.set(!this.pending && !this.story!.canContinue && this.choices().length === 0);
    return true;
  }

  choose(index: number): void {
    if (!this.story) return;
    if (index === CONTINUE_CHOICE.index && this.pending) {
      const { lines, meta } = this.pending;
      this.pending = null;
      this.meta.set(meta);
      this.page.set(lines);
      this.advance();
      return;
    }
    this.story.ChooseChoiceIndex(index);
    this.page.set([]);
    this.advance();
  }

  dismissToast(id: number): void {
    this.toasts.update((t) => t.filter((x) => x.id !== id));
  }

  markLettersRead(): void {
    this.unreadLetters.set(0);
  }

  letterBody(letter: Letter): string {
    if (letter.variantVar && letter.variants) {
      const key = String(this.vars()[letter.variantVar] ?? '');
      return letter.variants[key] ?? Object.values(letter.variants)[0];
    }
    return letter.body;
  }

  private async init(): Promise<void> {
    const json = await (await fetch(STORY_FILE)).text();
    this.story = new Story(json);
    this.story.onError = (msg) => console.error('[ink]', msg);
    this.lineId = 0;
    this.syncVars(false);
  }

  /** Bir sonraki karar anına kadar hikâyeyi ilerletir. */
  private advance(): void {
    const story = this.story!;
    const before = { ...this.stats() };
    const lines: StoryLine[] = [...this.page()];
    let meta = { ...this.meta() };
    const met = new Set(this.met());

    while (story.canContinue) {
      const text = smartQuotes(story.Continue()?.trim() ?? '');
      const tags = this.parseTags(story.currentTags ?? []);

      // Yeni sahne: mevcut sayfayı kes, yeni sahneyi "Devam" ile aç.
      if (tags['scene'] && tags['scene'] !== meta.scene && lines.length) {
        const nextMeta = { ...meta };
        const nextLines: StoryLine[] = [];
        if (tags['chapter']) nextMeta.chapter = tags['chapter'];
        if (tags['date']) nextMeta.date = tags['date'];
        nextMeta.scene = tags['scene'];
        nextMeta.actor = undefined;
        if (tags['pov']) {
          nextMeta.pov = tags['pov'];
          met.add(nextMeta.pov);
        }
        if (text) {
          const line = this.makeLine(text, tags, nextMeta.pov, met);
          if (line.speaker && ACTORS[line.speaker]) nextMeta.actor = line.speaker;
          nextLines.push(line);
        }
        this.pending = { lines: nextLines, meta: nextMeta };
        break;
      }

      if (tags['chapter']) meta.chapter = tags['chapter'];
      if (tags['date']) meta.date = tags['date'];
      if (tags['scene'] && tags['scene'] !== meta.scene) {
        meta.scene = tags['scene'];
        meta.actor = undefined;
      }
      if (tags['actor']) meta.actor = tags['actor'] === 'none' ? undefined : tags['actor'];
      if (tags['pov'] && tags['pov'] !== meta.pov) {
        meta.pov = tags['pov'];
        met.add(meta.pov);
        if (lines.length) {
          lines.push({
            id: this.lineId++,
            kind: 'pov',
            text: CHARACTER_MAP.get(meta.pov)?.name ?? meta.pov,
          });
        }
      }
      if ('end_chapter' in tags) this.ended.set(true);
      if (!text) continue;
      const line = this.makeLine(text, tags, meta.pov, met);
      if (line.speaker && ACTORS[line.speaker]) meta.actor = line.speaker;
      lines.push(line);
    }

    this.page.set(lines);
    this.meta.set(meta);
    this.met.set([...met]);
    this.syncVars(true);
    this.choices.set(this.readChoices());
    if (!this.pending && !story.canContinue && this.choices().length === 0) this.ended.set(true);

    const after = this.stats();
    this.deltas.set(
      STAT_KEYS.map((key) => ({ key, delta: after[key] - before[key] })).filter(
        (d) => d.delta !== 0,
      ),
    );
    void this.persist();
  }

  private readChoices(): StoryChoice[] {
    if (this.pending) return [CONTINUE_CHOICE];
    return (this.story?.currentChoices ?? []).map((c) => ({
      index: c.index,
      text: smartQuotes(c.text),
    }));
  }

  private makeLine(
    text: string,
    tags: Record<string, string>,
    pov: string,
    met: Set<string>,
  ): StoryLine {
    let kind: LineKind = 'narration';
    let speaker = tags['speaker'];
    if ('thought' in tags) kind = 'thought';
    else if (speaker) kind = 'speech';
    else if (text.startsWith('“')) {
      kind = 'speech';
      speaker = pov;
    }
    if (speaker) met.add(speaker);
    return { id: this.lineId++, kind, text, speaker };
  }

  private parseTags(tags: string[]): Record<string, string> {
    const out: Record<string, string> = {};
    for (const raw of tags) {
      const i = raw.indexOf(':');
      if (i === -1) out[raw.trim()] = '';
      else out[raw.slice(0, i).trim()] = raw.slice(i + 1).trim();
    }
    return out;
  }

  /** ink değişkenlerini okur; yeni açılan mektup/fısıltı/kişi için bildirim üretir. */
  private syncVars(notify: boolean): void {
    const state = this.story!.variablesState;
    const prev = this.vars();
    const next: Record<string, unknown> = {};
    for (const name of TRACKED_VARS) {
      if (state.GlobalVariableExistsWithName(name)) next[name] = state[name];
    }
    const stats = {} as Record<StatKey, number>;
    for (const k of STAT_KEYS) stats[k] = Number(next[k] ?? 50);
    this.stats.set(stats);

    if (notify) {
      const fresh: Toast[] = [];
      for (const l of LETTERS) {
        if (next[l.var] === true && prev[l.var] !== true) {
          fresh.push({ id: this.toastId++, icon: 'letter', text: `Mektup: ${l.from}` });
          this.unreadLetters.update((n) => n + 1);
        }
      }
      for (const w of WHISPERS) {
        if (next[w.var] === true && prev[w.var] !== true) {
          fresh.push({ id: this.toastId++, icon: 'whisper', text: `Fısıltı: ${w.title}` });
        }
      }
      for (const c of CHARACTERS) {
        if (c.unlockVar && next[c.unlockVar] === true && prev[c.unlockVar] !== true) {
          fresh.push({ id: this.toastId++, icon: 'person', text: `Rehbere eklendi: ${c.name}` });
        }
      }
      if (fresh.length > 2) {
        const count = (icon: Toast['icon']) => fresh.filter((f) => f.icon === icon).length;
        const parts = [
          count('letter') && `${count('letter')} mektup`,
          count('whisper') && `${count('whisper')} fısıltı`,
          count('person') && `${count('person')} kişi`,
        ].filter(Boolean);
        fresh.splice(0, fresh.length, {
          id: this.toastId++,
          icon: 'letter',
          text: `Yeni: ${parts.join(', ')}`,
        });
      }
      if (fresh.length) this.toasts.update((t) => [...t, ...fresh]);
    }
    this.vars.set(next);
  }

  private async persist(): Promise<void> {
    if (!this.story) return;
    const data: SaveData = {
      version: 1,
      storyFile: STORY_FILE,
      inkState: this.story.state.toJson(),
      page: this.page(),
      meta: this.meta(),
      met: this.met(),
      pending: this.pending,
      savedAt: new Date().toISOString(),
    };
    await this.save.store(data);
  }
}

/** "düz tırnak" → “tipografik tırnak” */
function smartQuotes(text: string): string {
  return text.replace(/"([^"]*)"/g, '“$1”').replace(/'/g, '’');
}
