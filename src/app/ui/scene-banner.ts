import { Component, computed, input } from '@angular/core';
import { DEFAULT_SCENE, SCENES } from '../data/scenes';

/** Sahnenin üst bandı: İstanbul silüeti + sahneye özgü motif. Gerçek çizimler gelene kadar vektör. */
@Component({
  selector: 'app-scene-banner',
  template: `
    @let s = scene();
    <svg viewBox="0 0 400 160" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <rect width="400" height="160" [attr.fill]="s.sky" />
      @if (s.night) {
        <circle cx="330" cy="38" r="14" [attr.fill]="s.accent" opacity="0.9" />
        <circle cx="336" cy="34" r="12" [attr.fill]="s.sky" />
        @for (st of stars; track $index) {
          <circle [attr.cx]="st[0]" [attr.cy]="st[1]" r="0.9" fill="#f3e9d2" opacity="0.7" />
        }
      }
      <g [attr.fill]="s.land">
        @switch (s.motif) {
          @case ('gate') {
            <path d="M0 160V118h400v42z" />
            <path d="M120 118V70h160v48z" opacity="0.85" />
            <path d="M100 72h200l-14-14H114z" />
            <path d="M176 118V92a24 24 0 0 1 48 0v26z" [attr.fill]="s.accent" opacity="0.8" />
          }
          @case ('window') {
            <path d="M0 0h400v160H0z M150 140V60a50 50 0 0 1 100 0v80z" fill-rule="evenodd" />
            <path d="M150 140h100v6H150z" [attr.fill]="s.accent" opacity="0.6" />
            <path d="M160 125q20-6 40 0t40 0v15h-80z" fill="#2b3d63" opacity="0.9" />
            <circle cx="200" cy="110" r="4" [attr.fill]="s.accent" />
          }
          @case ('chest') {
            <path d="M0 160V96q50-40 100 0q50-40 100 0q50-40 100 0q50-40 100 0v64z" />
            <rect
              x="150"
              y="112"
              width="100"
              height="40"
              rx="3"
              [attr.fill]="s.accent"
              opacity="0.85"
            />
            <path d="M150 112q50-26 100 0z" [attr.fill]="s.accent" />
            <rect x="196" y="124" width="8" height="10" [attr.fill]="s.land" />
          }
          @case ('bazaar') {
            <path d="M0 160V112h400v48z" />
            @for (x of [20, 80, 140, 200, 260, 320, 380]; track x) {
              <path [attr.d]="'M' + (x - 26) + ' 112a26 22 0 0 1 52 0z'" />
              <rect [attr.x]="x - 1" y="84" width="2" height="8" />
            }
            <rect x="0" y="128" width="400" height="5" [attr.fill]="s.accent" opacity="0.7" />
          }
          @case ('kubbealti') {
            <path d="M0 160V120h400v40z" />
            <path d="M130 120a70 54 0 0 1 140 0z" />
            <rect x="196" y="58" width="8" height="12" />
            <rect x="300" y="40" width="34" height="80" />
            <path d="M296 40l21-22 21 22z" />
            <rect x="0" y="124" width="400" height="3" [attr.fill]="s.accent" opacity="0.7" />
          }
          @default {
            <path d="M0 160V122h400v38z" />
            <path d="M120 122a60 46 0 0 1 120 0z" />
            <path d="M60 122a30 24 0 0 1 60 0zM240 122a30 24 0 0 1 60 0z" />
            <rect x="42" y="52" width="6" height="70" />
            <path d="M41 52l4-16 4 16z" />
            <rect x="312" y="60" width="6" height="62" />
            <path d="M311 60l4-16 4 16z" />
            <rect x="178" y="96" width="4" height="8" [attr.fill]="s.accent" />
          }
        }
      </g>
    </svg>
    <div class="caption">
      <span class="name">{{ scene().name }}</span>
      <span class="place">{{ scene().place }}</span>
    </div>
  `,
  styles: `
    :host {
      display: block;
      position: relative;
      height: 22vh;
      min-height: 120px;
      max-height: 210px;
      overflow: hidden;
    }
    svg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      display: block;
    }
    .caption {
      position: absolute;
      left: 16px;
      bottom: 10px;
      display: flex;
      flex-direction: column;
      color: #f3e9d2;
      text-shadow: 0 1px 6px rgba(0, 0, 0, 0.6);
    }
    .name {
      font-family: var(--font-display);
      font-size: 24px;
      font-weight: 600;
      line-height: 1;
    }
    .place {
      font-size: 13px;
      letter-spacing: 0.08em;
      opacity: 0.85;
    }
  `,
})
export class SceneBanner {
  readonly sceneId = input.required<string>();
  protected readonly scene = computed(() => SCENES[this.sceneId()] ?? DEFAULT_SCENE);
  protected readonly stars = [
    [30, 20],
    [70, 44],
    [110, 16],
    [160, 34],
    [210, 12],
    [250, 40],
    [290, 18],
    [370, 26],
    [390, 60],
    [12, 64],
  ];
}
