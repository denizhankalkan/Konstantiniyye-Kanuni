import { Component } from '@angular/core';

/** Cevahir Bedesteni: kubbe dizisi, tepe pencerelerinden ışık, asılı kumaşlar, yürüyen kalabalık. */
@Component({
  selector: 'scene-bedesten',
  template: `
    <svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="bd-shaft" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#fff0c8" stop-opacity="0.6" />
          <stop offset="1" stop-color="#fff0c8" stop-opacity="0" />
        </linearGradient>
        <radialGradient id="bd-lamp" r="50%">
          <stop offset="0" stop-color="#ffd27a" stop-opacity="0.6" />
          <stop offset="1" stop-color="#ffd27a" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="220" fill="#b98a55" />
      <!-- kubbeler ve kemerler -->
      @for (x of [0, 100, 200, 300]; track x) {
        <path
          [attr.d]="
            'M' + x + ' 70Q' + x + ' 8 ' + (x + 50) + ' 6Q' + (x + 100) + ' 8 ' + (x + 100) + ' 70Z'
          "
          fill="#9a6e40"
        />
        <path
          [attr.d]="
            'M' + x + ' 70Q' + x + ' 8 ' + (x + 50) + ' 6Q' + (x + 100) + ' 8 ' + (x + 100) + ' 70'
          "
          fill="none"
          stroke="#6b4626"
          stroke-width="3"
        />
        <circle [attr.cx]="x + 50" cy="16" r="5" fill="#fff6dc" />
        <path
          class="shaft"
          [style.animation-delay.s]="x / 100"
          [attr.d]="
            'M' + (x + 45) + ' 18L' + (x + 55) + ' 18L' + (x + 80) + ' 200L' + (x + 30) + ' 200Z'
          "
          fill="url(#bd-shaft)"
        />
      }
      <rect y="68" width="400" height="6" fill="#6b4626" />
      <!-- dükkânlar -->
      <rect y="74" width="400" height="80" fill="#7a5230" />
      @for (s of stalls; track s.x) {
        <path
          [attr.d]="
            'M' +
            s.x +
            ' 152V96Q' +
            s.x +
            ' 80 ' +
            (s.x + 30) +
            ' 78Q' +
            (s.x + 60) +
            ' 80 ' +
            (s.x + 60) +
            ' 96V152Z'
          "
          fill="#3e2614"
        />
        @for (c of s.cloth; track $index) {
          <path
            class="sway"
            [style.animation-delay.s]="$index * 0.7"
            [attr.d]="
              'M' + (s.x + 8 + $index * 15) + ' 90h11v' + (34 + $index * 5) + 'l-5.5 5l-5.5 -5z'
            "
            [attr.fill]="c"
          />
        }
        <rect [attr.x]="s.x - 2" y="136" width="64" height="16" fill="#5a3a20" />
      }
      <!-- asılı kandiller -->
      @for (x of [50, 150, 250, 350]; track x) {
        <path [attr.d]="'M' + x + ' 70V84'" stroke="#3e2614" stroke-width="0.8" />
        <circle class="flicker" [attr.cx]="x" cy="90" r="22" fill="url(#bd-lamp)" />
        <path [attr.d]="'M' + (x - 4) + ' 86h8l-2 8h-4z'" fill="#d4a22e" />
      }
      <!-- zemin -->
      <rect y="152" width="400" height="68" fill="#8a6440" />
      <path d="M0 152H400" stroke="#5a3a20" stroke-width="2" />
      <!-- Yorgi'nin tezgâhı -->
      <use href="#fig-tuccar" x="50" y="116" width="18" height="44" style="color:#3e5a3a" />
      <!-- kalabalık -->
      <g class="walk-r">
        <use href="#fig-yeniceri" x="-20" y="150" width="22" height="56" style="color:#6b1f18" />
      </g>
      <g class="walk-l">
        <use href="#fig-tuccar" x="400" y="156" width="20" height="50" style="color:#2a7f7a" />
      </g>
      <g class="walk-r slow">
        <use href="#fig-dervis" x="-30" y="148" width="22" height="56" style="color:#6e5a3e" />
      </g>
      <use href="#fig-kadin" x="200" y="146" width="24" height="60" style="color:#7a2e5a" />
      <use href="#fig-tuccar" x="300" y="152" width="22" height="54" style="color:#3a2a4a" />
      <ellipse cx="212" cy="205" rx="12" ry="2.5" fill="#000" opacity="0.25" />
    </svg>
  `,
})
export class SceneBedesten {
  protected readonly stalls = [
    { x: 20, cloth: ['#8c1c13', '#1f3b73', '#d4a22e'] },
    { x: 120, cloth: ['#2a7f7a', '#f1e4d0', '#7a2e5a'] },
    { x: 220, cloth: ['#c9762e', '#3c2a5e', '#8c1c13'] },
    { x: 320, cloth: ['#e8c36a', '#3e5a3a', '#b8443a'] },
  ];
}
