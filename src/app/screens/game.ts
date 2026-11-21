import {
  Component,
  ElementRef,
  OnInit,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { STAT_KEYS, STAT_LABEL, StoryService } from '../game/story.service';
import { AudioService } from '../game/audio.service';
import { DEFAULT_SCENE, SCENES } from '../data/scenes';
import { ACTORS } from '../data/actors';
import { CHARACTER_MAP, FACTION_LABEL, Faction } from '../data/characters';
import { Letter } from '../data/letters';
import { SceneBanner } from '../ui/scene-banner';
import { Portrait } from '../ui/portrait';
import { StatIcon } from '../ui/stat-icon';

type Sheet = 'letters' | 'whispers' | 'people' | 'menu' | null;

const LINE_DELAY_MS = 420;

@Component({
  selector: 'app-game',
  imports: [SceneBanner, Portrait, StatIcon],
  templateUrl: './game.html',
  styleUrl: './game.css',
})
export class GameScreen implements OnInit {
  protected story = inject(StoryService);
  protected audio = inject(AudioService);
  private router = inject(Router);
  private scroller = viewChild<ElementRef<HTMLElement>>('scroller');

  protected readonly statKeys = STAT_KEYS;
  protected readonly statLabel = STAT_LABEL;
  protected readonly factionLabel = FACTION_LABEL;
  protected readonly sheet = signal<Sheet>(null);
  protected readonly openLetter = signal<Letter | null>(null);
  protected readonly sealBroken = signal(false);
  protected readonly revealed = signal(false);
  protected readonly instant = signal(false);
  /** Sahnedeki karakterin konuşma aralıkları; çenesi bu sürelerde oynar */
  protected readonly talk = signal<[number, number][]>([]);
  protected readonly lineDelay = LINE_DELAY_MS;

  protected readonly mood = computed(() => (SCENES[this.story.meta().scene] ?? DEFAULT_SCENE).mood);
  protected readonly povName = computed(() => CHARACTER_MAP.get(this.story.meta().pov)?.name ?? '');
  protected readonly peopleByFaction = computed(() => {
    const groups = new Map<Faction, ReturnType<typeof this.story.characters>>();
    for (const c of this.story.characters()) {
      groups.set(c.faction, [...(groups.get(c.faction) ?? []), c]);
    }
    return [...groups.entries()];
  });
  protected readonly decisions = computed(() => {
    const v = this.story.vars();
    const out: string[] = [];
    const leo = v['leonardo_kimde'];
    if (leo === 'ibrahim')
      out.push(
        v['kopru_projesi']
          ? 'Leonardo’nun köprüsü mimarlara verildi.'
          : 'Leonardo’nun mektubu arşive geri döndü.',
      );
    if (leo === 'kalfa') out.push('Leonardo’nun mektubu hâlâ Nazende’nin koynunda.');
    if (leo === 'hazinedar')
      out.push('Leonardo’nun mektubu hazine defterine yazılıp sandığa kondu.');
    if (v['macar_tutum'] === 'harac') out.push('Budin’e haraç talebiyle Behram Çavuş gönderildi.');
    if (v['macar_tutum'] === 'baris') out.push('Macar kralına barış ve ticaret teklif edildi.');
    const adalet = Number(v['adalet_unu'] ?? 0);
    if (adalet >= 2) out.push('Sürgün zanaatkârlar döndü, Acem tüccarın ipekleri iade edildi.');
    else if (adalet === 1) out.push('Sürgün zanaatkârlar döndü, ipek yasağı sürüyor.');
    else out.push('Sultan Selim’in kararlarına dokunulmadı.');
    out.push(
      `${this.story.whispers().length} fısıltı, ${this.story.letters().length} mektup toplandı.`,
    );
    return out;
  });

  private revealTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    effect(() => {
      const lines = this.story.page();
      clearTimeout(this.revealTimer);
      this.revealed.set(false);
      this.instant.set(false);
      this.scroller()?.nativeElement.scrollTo({ top: 0 });
      this.revealTimer = setTimeout(
        () => this.revealed.set(true),
        lines.length * LINE_DELAY_MS + 250,
      );
    });
    effect(() => {
      this.audio.setAmbience((SCENES[this.story.meta().scene] ?? DEFAULT_SCENE).ambience);
    });
    effect(() => {
      const toasts = this.story.toasts();
      for (const t of toasts) setTimeout(() => this.story.dismissToast(t.id), 3200);
    });
  }

  async ngOnInit() {
    if (this.story.page().length === 0 && !(await this.story.continueGame())) {
      await this.router.navigateByUrl('/');
    }
  }

  protected skip() {
    if (this.revealed()) return;
    clearTimeout(this.revealTimer);
    this.instant.set(true);
    this.revealed.set(true);
  }

  protected async choose(index: number) {
    Haptics.impact({ style: ImpactStyle.Light }).catch(() => undefined);
    this.audio.unlock();
    this.audio.sfx('choice');
    this.story.choose(index);
  }

  protected speakerName(id?: string) {
    return id ? (CHARACTER_MAP.get(id)?.name ?? id) : '';
  }

  protected open(s: Sheet) {
    this.sheet.set(s);
    this.openLetter.set(null);
    if (s === 'letters') this.story.markLettersRead();
  }

  protected readLetter(l: Letter) {
    this.audio.sfx('page');
    this.openLetter.set(l);
    this.sealBroken.set(!!l.outgoing);
  }

  protected breakSeal() {
    Haptics.impact({ style: ImpactStyle.Medium }).catch(() => undefined);
    this.audio.sfx('seal');
    this.sealBroken.set(true);
  }

  protected async restart() {
    this.sheet.set(null);
    await this.story.newGame();
  }

  protected async toTitle() {
    this.sheet.set(null);
    await this.router.navigateByUrl('/');
  }

  protected statLevel(v: number) {
    return v >= 70 ? 'high' : v <= 30 ? 'low' : 'mid';
  }
}
