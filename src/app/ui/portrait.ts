import { Component, computed, input } from '@angular/core';
import { CHARACTER_MAP, Faction } from '../data/characters';
import { DEFAULT_LOOK, LOOKS } from '../data/looks';
import { RASTER_PORTRAITS } from '../data/art-manifest';

const FACTION_BG: Record<Faction, string> = {
  saray: '#5e140e',
  harem: '#4f1e3b',
  divan: '#16294f',
  carsi: '#4a2b16',
  yabanci: '#1c5653',
  ordu: '#2c2c28',
};

let uid = 0;

/**
 * Minyatür üslubunda büst portre. Başlık, sakal ve kaftan rengi karakteri tanıtır.
 * public/art/portraits/<id>.webp varsa (art-manifest.ts) onun yerine resim gösterilir.
 */
@Component({
  selector: 'app-portrait',
  template: `
    @if (raster()) {
      <img
        [src]="'art/portraits/' + id() + '.webp'"
        [alt]="name()"
        [width]="size()"
        [height]="size()"
      />
    } @else {
      @let l = look();
      <svg
        [attr.width]="size()"
        [attr.height]="size()"
        viewBox="0 0 64 64"
        role="img"
        [attr.aria-label]="name()"
      >
        <defs>
          <clipPath [attr.id]="clip"><circle cx="32" cy="32" r="31" /></clipPath>
          <radialGradient [attr.id]="glow" cx="50%" cy="38%" r="60%">
            <stop offset="0" stop-color="#ffffff" stop-opacity="0.18" />
            <stop offset="1" stop-color="#000000" stop-opacity="0.25" />
          </radialGradient>
        </defs>
        <g [attr.clip-path]="'url(#' + clip + ')'">
          <rect width="64" height="64" [attr.fill]="bg()" />
          <rect width="64" height="64" [attr.fill]="'url(#' + glow + ')'" />

          @switch (l.headgear) {
            @case ('ressam') {
              <path d="M22 24Q19 40 21 52L26 50Q24 37 25 26Z" [attr.fill]="l.hair" />
              <path d="M42 24Q45 40 43 52L38 50Q40 37 39 26Z" [attr.fill]="l.hair" />
            }
            @case ('kalfa') {
              <path
                d="M21 27Q21 15 32 14Q43 15 43 27L46 50Q38 44 32 45Q26 44 18 50Z"
                [attr.fill]="l.cloth"
              />
              <path
                d="M24 27Q23 40 22 46"
                [attr.stroke]="l.hair"
                stroke-width="2.4"
                fill="none"
                stroke-linecap="round"
              />
              <path
                d="M40 27Q41 40 42 46"
                [attr.stroke]="l.hair"
                stroke-width="2.4"
                fill="none"
                stroke-linecap="round"
              />
            }
          }

          <path d="M4 66Q7 50 22 47L32 53L42 47Q57 50 60 66Z" [attr.fill]="l.robe" />
          <path d="M25.5 47.5L32 57L38.5 47.5Z" [attr.fill]="l.cloth ?? '#efe6d4'" opacity="0.9" />
          <path d="M22 47L32 60L42 47" [attr.stroke]="l.trim" stroke-width="1.4" fill="none" />
          <circle cx="32" cy="61" r="1.2" [attr.fill]="l.trim" />

          @if (l.headgear === 'hotoz') {
            <path d="M20 21Q13 40 10 66L54 66Q51 40 44 21Z" [attr.fill]="l.cloth" opacity="0.55" />
          }

          <rect x="28.5" y="38" width="7" height="11" rx="2" [attr.fill]="l.skin" />
          <rect x="28.5" y="40" width="7" height="3" fill="#000" opacity="0.08" />
          <ellipse cx="32" cy="32" rx="8.6" ry="10.6" [attr.fill]="l.skin" />
          <ellipse cx="23.6" cy="33" rx="1.3" ry="2.2" [attr.fill]="l.skin" />
          <ellipse cx="40.4" cy="33" rx="1.3" ry="2.2" [attr.fill]="l.skin" />

          <path
            d="M26 29Q28.5 27.6 31 28.7"
            [attr.stroke]="l.hair"
            stroke-width="0.9"
            fill="none"
            stroke-linecap="round"
          />
          <path
            d="M33 28.7Q35.5 27.6 38 29"
            [attr.stroke]="l.hair"
            stroke-width="0.9"
            fill="none"
            stroke-linecap="round"
          />
          <path d="M26.6 31.6Q28.6 30.1 30.6 31.6Q28.6 32.7 26.6 31.6Z" fill="#2b1d12" />
          <path d="M33.4 31.6Q35.4 30.1 37.4 31.6Q35.4 32.7 33.4 31.6Z" fill="#2b1d12" />
          <circle cx="29" cy="31.4" r="0.35" fill="#fff" opacity="0.8" />
          <circle cx="35.8" cy="31.4" r="0.35" fill="#fff" opacity="0.8" />
          <path
            d="M32.2 32.5Q31 36 32.6 37.2"
            stroke="#000"
            stroke-opacity="0.22"
            stroke-width="0.8"
            fill="none"
          />
          @if (l.beard === 'none') {
            <path
              d="M29.8 40Q32 41.3 34.2 40"
              stroke="#8a4a3a"
              stroke-width="0.9"
              fill="none"
              stroke-linecap="round"
            />
            <circle cx="27" cy="36.5" r="2" fill="#d46a6a" opacity="0.18" />
            <circle cx="37" cy="36.5" r="2" fill="#d46a6a" opacity="0.18" />
          }

          @switch (l.beard) {
            @case ('short') {
              <path
                d="M23.8 33Q24.6 44.5 32 45.5Q39.4 44.5 40.2 33Q38.5 41.4 32 41.6Q25.5 41.4 23.8 33Z"
                [attr.fill]="l.hair"
              />
            }
            @case ('full') {
              <path
                d="M23.4 32Q23.6 48 32 51Q40.4 48 40.6 32Q38.6 42 32 42.2Q25.4 42 23.4 32Z"
                [attr.fill]="l.hair"
              />
            }
            @case ('long') {
              <path
                d="M23.8 33Q23 53 32 60Q41 53 40.2 33Q38.4 42 32 42.2Q25.6 42 23.8 33Z"
                [attr.fill]="l.hair"
              />
              <path
                d="M30 46Q32 52 34 46"
                stroke="#000"
                stroke-opacity="0.12"
                stroke-width="0.7"
                fill="none"
              />
            }
          }
          @if (l.beard !== 'none') {
            <path d="M27.4 38.6Q32 36 36.6 38.6Q32 40.2 27.4 38.6Z" [attr.fill]="l.hair" />
          }

          @switch (l.headgear) {
            @case ('sultan') {
              <ellipse cx="32" cy="18" rx="15.5" ry="10.5" [attr.fill]="l.cloth" />
              <path
                d="M18 20Q32 12 46 20M17.5 16Q32 8 46.5 16M19 24Q32 17 45 24"
                stroke="#d6cdb8"
                stroke-width="0.8"
                fill="none"
              />
              <ellipse cx="32" cy="9.5" rx="6" ry="3" fill="#8c1c13" />
              <path d="M32.4 15C31 10 33 5 38 0.5C35.5 6 34.6 10 34 15Z" fill="#1c1a18" />
              <circle cx="32.6" cy="16" r="2.4" [attr.fill]="l.trim" />
              <circle cx="32.6" cy="16" r="1.1" fill="#b3241a" />
            }
            @case ('kallavi') {
              <path d="M20 26L22 7Q32 3 42 7L44 26Q32 29 20 26Z" [attr.fill]="l.cloth" />
              <path d="M21 22.5L43 9.5" [attr.stroke]="l.trim" stroke-width="2.4" />
              <path d="M27 7Q32 1 37 7Z" fill="#8c1c13" />
            }
            @case ('sarik') {
              <path d="M25 17Q32 5 39 17Z" [attr.fill]="l.robe" />
              <ellipse cx="32" cy="21" rx="12.5" ry="6.5" [attr.fill]="l.cloth" />
              <path
                d="M20.5 21Q32 15 43.5 21M21.5 24Q32 18.5 42.5 24"
                stroke="#d6cdb8"
                stroke-width="0.8"
                fill="none"
              />
            }
            @case ('hotoz') {
              <path d="M22 24L23.5 9Q32 3 40.5 9L42 24Z" [attr.fill]="l.robe" />
              <path d="M22.5 20H41.5" [attr.stroke]="l.trim" stroke-width="1.6" />
              <circle cx="27" cy="14" r="1.3" [attr.fill]="l.trim" />
              <circle cx="32" cy="11.5" r="1.6" fill="#b3241a" />
              <circle cx="37" cy="14" r="1.3" [attr.fill]="l.trim" />
              <path d="M24 24Q32 21.5 40 24" [attr.stroke]="l.hair" stroke-width="2" fill="none" />
            }
            @case ('kalfa') {
              <path
                d="M24.5 25Q32 20 39.5 25"
                [attr.stroke]="l.hair"
                stroke-width="2.2"
                fill="none"
              />
              <path d="M26.5 22L27.5 13.5Q32 12 36.5 13.5L37.5 22Z" fill="#8c1c13" />
              <path d="M32 13V9" stroke="#1c1a18" stroke-width="1" />
              <path d="M26.7 19.5H37.3" [attr.stroke]="l.trim" stroke-width="1" />
            }
            @case ('rum') {
              <path d="M23 25Q22.5 12 32 11.5Q41.5 12 41 25Q32 21.5 23 25Z" fill="#2b2b2b" />
            }
            @case ('kizilbas') {
              <rect x="29" y="3" width="6" height="17" rx="2" fill="#b3241a" />
              <ellipse cx="32" cy="21" rx="12.5" ry="6" [attr.fill]="l.cloth" />
              <path d="M21 21Q32 16 43 21" stroke="#d6cdb8" stroke-width="0.8" fill="none" />
            }
            @case ('venedik') {
              <path d="M21 22Q21 11 32 11Q43 11 44 20Q32 24.5 21 22Z" fill="#8c1c13" />
              <path d="M24 25Q32 22 40 25" [attr.stroke]="l.hair" stroke-width="2.2" fill="none" />
            }
            @case ('doc') {
              <path d="M23 25L24 13Q28 4 40 6Q42 13 41.5 25Z" fill="#c9a85a" />
              <path d="M23.4 21H41.6" stroke="#8a6a2a" stroke-width="1.4" />
              <path d="M28 12Q32 9 36 12" stroke="#8a6a2a" stroke-width="0.8" fill="none" />
            }
            @case ('sikke') {
              <path d="M24.5 25L26 2Q32 0 38 2L39.5 25Z" fill="#b89a72" />
              <path d="M25 21H39" stroke="#7a6446" stroke-width="1.4" />
            }
            @case ('ulak') {
              <path d="M22 25Q23.5 10 32 7Q40.5 10 42 25Q32 21.5 22 25Z" fill="#6b4a2b" />
              <path d="M22 25Q32 21.5 42 25" stroke="#3e2a16" stroke-width="1.6" fill="none" />
            }
            @case ('tac') {
              <path d="M24 25Q32 22 40 25" [attr.stroke]="l.hair" stroke-width="2.4" fill="none" />
              <path
                d="M22.5 23V12L26.5 16.5L29.5 9L32 15L34.5 9L37.5 16.5L41.5 12V23Z"
                [attr.fill]="l.trim"
              />
              <circle cx="32" cy="19.5" r="1.4" fill="#b3241a" />
              <circle cx="27" cy="20" r="1" fill="#1f3b73" />
              <circle cx="37" cy="20" r="1" fill="#1f3b73" />
            }
            @case ('ressam') {
              <path d="M24 25Q32 21 40 25" [attr.stroke]="l.hair" stroke-width="2.6" fill="none" />
              <path d="M19.5 21Q21.5 11 32 11Q44.5 11 45.5 18.5Q32 23.5 19.5 21Z" fill="#2a2220" />
            }
            @case ('memluk') {
              <path d="M22.5 19Q17 9 22.5 5Q23 12 26.5 17Z" [attr.fill]="l.cloth" />
              <path d="M41.5 19Q47 9 41.5 5Q41 12 37.5 17Z" [attr.fill]="l.cloth" />
              <ellipse cx="32" cy="21" rx="13" ry="6.5" [attr.fill]="l.cloth" />
              <path d="M26 17Q32 10 38 17Z" fill="#8c1c13" />
            }
          }
        </g>
        <circle cx="32" cy="32" r="30.6" fill="none" stroke="#e8c36a" stroke-width="1.1" />
        <circle
          cx="32"
          cy="32"
          r="28.6"
          fill="none"
          stroke="#e8c36a"
          stroke-width="0.5"
          stroke-dasharray="1.4 2"
          opacity="0.8"
        />
      </svg>
    }
  `,
  styles: `
    :host {
      display: inline-flex;
      flex-shrink: 0;
    }
    img {
      border-radius: 50%;
      border: 1.5px solid #e8c36a;
      object-fit: cover;
    }
  `,
})
export class Portrait {
  readonly id = input.required<string>();
  readonly size = input(44);

  protected readonly clip = `pclip${uid}`;
  protected readonly glow = `pglow${uid++}`;
  private readonly character = computed(() => CHARACTER_MAP.get(this.id()));
  protected readonly name = computed(() => this.character()?.name ?? this.id());
  protected readonly look = computed(() => LOOKS[this.id()] ?? DEFAULT_LOOK);
  protected readonly bg = computed(() => FACTION_BG[this.character()?.faction ?? 'saray']);
  protected readonly raster = computed(() => RASTER_PORTRAITS.has(this.id()));
}
