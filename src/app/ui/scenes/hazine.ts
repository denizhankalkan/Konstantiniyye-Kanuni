import { Component } from '@angular/core';

/** Hazine odası: karanlık tonozlar, açık sandıklarda altın pırıltısı, fener ışığı, kaftanlar. */
@Component({
  selector: 'scene-hazine',
  template: `
    <svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id="hz-lamp" r="50%">
          <stop offset="0" stop-color="#ffcf70" stop-opacity="0.55" />
          <stop offset="0.5" stop-color="#d48a30" stop-opacity="0.18" />
          <stop offset="1" stop-color="#d48a30" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="hz-gold" r="50%">
          <stop offset="0" stop-color="#ffe08a" />
          <stop offset="1" stop-color="#b8860b" />
        </radialGradient>
        <radialGradient id="hz-paper" r="50%">
          <stop offset="0" stop-color="#fff3d0" stop-opacity="0.8" />
          <stop offset="1" stop-color="#fff3d0" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="220" fill="#1a120b" />
      @for (x of [0, 130, 260]; track x) {
        <path
          [attr.d]="
            'M' +
            x +
            ' 170V60Q' +
            x +
            ' 10 ' +
            (x + 70) +
            ' 8Q' +
            (x + 140) +
            ' 10 ' +
            (x + 140) +
            ' 60V170Z'
          "
          fill="#24180e"
          stroke="#3a2a1a"
          stroke-width="3"
        />
      }
      <!-- fener -->
      <path d="M200 0V30" stroke="#3a2a1a" stroke-width="1" />
      <circle class="flicker" cx="200" cy="44" r="120" fill="url(#hz-lamp)" />
      <path d="M192 30h16l-3 22h-10z" fill="#d4a22e" />
      <path d="M195 34h10l-2 14h-6z" fill="#ffe7a8" />
      <!-- askıda kaftanlar -->
      @for (k of kaftans; track k.x) {
        <path [attr.d]="'M' + k.x + ' 66h40'" stroke="#5a4630" stroke-width="2" />
        <path
          [attr.d]="
            'M' +
            (k.x + 4) +
            ' 68L' +
            (k.x + 36) +
            ' 68L' +
            (k.x + 42) +
            ' 150L' +
            (k.x - 2) +
            ' 150Z'
          "
          [attr.fill]="k.c"
        />
        <path
          [attr.d]="'M' + (k.x + 20) + ' 68V150'"
          stroke="#e8c36a"
          stroke-width="1"
          opacity="0.7"
        />
        @for (y of [86, 106, 126]; track y) {
          <circle [attr.cx]="k.x + 12" [attr.cy]="y" r="2.4" fill="#e8c36a" opacity="0.55" />
          <circle [attr.cx]="k.x + 28" [attr.cy]="y + 8" r="2.4" fill="#e8c36a" opacity="0.55" />
        }
      }
      <rect y="170" width="400" height="50" fill="#120c07" />
      <!-- sandıklar -->
      @for (c of chests; track c.x) {
        <rect [attr.x]="c.x" y="160" width="62" height="34" rx="2" fill="#5a3418" />
        <rect [attr.x]="c.x" y="168" width="62" height="3" fill="#b8860b" />
        <rect [attr.x]="c.x + 27" y="174" width="8" height="10" fill="#b8860b" />
        @if (c.open) {
          <path
            [attr.d]="
              'M' +
              c.x +
              ' 160L' +
              (c.x + 4) +
              ' 136L' +
              (c.x + 66) +
              ' 136L' +
              (c.x + 62) +
              ' 160Z'
            "
            fill="#3e2410"
          />
          <ellipse [attr.cx]="c.x + 31" cy="160" rx="28" ry="7" fill="url(#hz-gold)" />
        }
      }
      @for (g of glints; track $index) {
        <path
          class="glint"
          [style.animation-delay.s]="g[2]"
          [attr.transform]="'translate(' + g[0] + ',' + g[1] + ')'"
          d="M0 -4L1 -1L4 0L1 1L0 4L-1 1L-4 0L-1 -1Z"
          fill="#fff6d0"
        />
      }
      <!-- Nazende, elinde Leonardo'nun kâğıdı -->
      <circle class="flicker slow" cx="214" cy="160" r="14" fill="url(#hz-paper)" />
      <rect x="208" y="155" width="12" height="9" fill="#f3e2b8" transform="rotate(-12 214 160)" />
      <!-- hazinedar ağa -->
      <use href="#fig-vezir" x="330" y="140" width="22" height="55" style="color:#5b4630" />
    </svg>
  `,
})
export class SceneHazine {
  protected readonly kaftans = [
    { x: 20, c: '#8c1c13' },
    { x: 80, c: '#1f3b73' },
    { x: 290, c: '#2a7f7a' },
    { x: 346, c: '#c9a85a' },
  ];
  protected readonly chests = [
    { x: 40, open: true },
    { x: 116, open: false },
    { x: 250, open: true },
  ];
  protected readonly glints = [
    [60, 156, 0],
    [84, 158, 1.2],
    [268, 155, 0.6],
    [292, 158, 1.8],
    [72, 152, 2.4],
    [280, 152, 3],
  ];
}
