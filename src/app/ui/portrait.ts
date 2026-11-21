import { Component, computed, input } from '@angular/core';
import { CHARACTER_MAP, Faction } from '../data/characters';

const FACTION_COLOR: Record<Faction, { bg: string; fg: string }> = {
  saray: { bg: '#8c1c13', fg: '#f3e9d2' },
  harem: { bg: '#7a2e5a', fg: '#f6e4ee' },
  divan: { bg: '#1f3b73', fg: '#e6ecf7' },
  carsi: { bg: '#6b3e1f', fg: '#f3e2cc' },
  yabanci: { bg: '#2a7f7a', fg: '#e1f4f2' },
  ordu: { bg: '#3b3b36', fg: '#ecebe4' },
};

/**
 * Geçici portre: hizbe göre renklenen, tezhipli bir madalyon içinde baş harfler.
 * Gerçek portreler geldiğinde src/assets/portraits/<id>.webp eklenip burada gösterilecek.
 */
@Component({
  selector: 'app-portrait',
  template: `
    <svg
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 64 64"
      role="img"
      [attr.aria-label]="name()"
    >
      <circle cx="32" cy="32" r="31" [attr.fill]="colors().bg" />
      <circle cx="32" cy="32" r="27" fill="none" [attr.stroke]="'#e8c36a'" stroke-width="1.2" />
      <circle
        cx="32"
        cy="32"
        r="29.2"
        fill="none"
        [attr.stroke]="'#e8c36a'"
        stroke-width="0.6"
        stroke-dasharray="1.5 2.2"
      />
      <text
        x="32"
        y="40"
        text-anchor="middle"
        [attr.fill]="colors().fg"
        font-family="Cormorant Garamond, serif"
        font-size="24"
        font-weight="600"
      >
        {{ initials() }}
      </text>
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
      flex-shrink: 0;
    }
  `,
})
export class Portrait {
  readonly id = input.required<string>();
  readonly size = input(44);

  private readonly character = computed(() => CHARACTER_MAP.get(this.id()));
  protected readonly name = computed(() => this.character()?.name ?? this.id());
  protected readonly colors = computed(() => FACTION_COLOR[this.character()?.faction ?? 'saray']);
  protected readonly initials = computed(() => {
    const words = this.name()
      .replace(/^(II?\.|V\.)\s*/, '')
      .split(/\s+/);
    return words.length > 1 && words[1][0] === words[1][0].toUpperCase()
      ? (words[0][0] + words[1][0]).toLocaleUpperCase('tr')
      : words[0].slice(0, 1).toLocaleUpperCase('tr');
  });
}
