import { Component } from '@angular/core';

/** Has oda, gece: Haliç'e bakan pencere, sedir, mum ışığı, İbrahim'in kemanı. */
@Component({
  selector: 'scene-has-oda',
  template: `
    <svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="ho-night" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#121a36" />
          <stop offset="1" stop-color="#26355e" />
        </linearGradient>
        <radialGradient id="ho-candle" r="50%">
          <stop offset="0" stop-color="#ffd27a" stop-opacity="0.7" />
          <stop offset="0.45" stop-color="#e89a40" stop-opacity="0.2" />
          <stop offset="1" stop-color="#e89a40" stop-opacity="0" />
        </radialGradient>
        <pattern id="ho-tile" width="14" height="14" patternUnits="userSpaceOnUse">
          <rect width="14" height="14" fill="#e8e0cc" />
          <path d="M7 1Q3 7 7 13Q11 7 7 1Z" fill="#1d4a6e" />
          <path d="M1 7Q7 3 13 7Q7 11 1 7Z" fill="#2a7f7a" opacity="0.7" />
          <circle cx="7" cy="7" r="1.3" fill="#b3241a" />
        </pattern>
      </defs>
      <rect width="400" height="220" fill="url(#ho-tile)" />
      <rect width="400" height="220" fill="#1a1020" opacity="0.62" />
      <!-- pencere -->
      <path d="M140 150V72Q140 36 200 26Q260 36 260 72V150Z" fill="url(#ho-night)" />
      <circle cx="232" cy="60" r="8" fill="#f0e3b8" />
      <path d="M140 116Q200 108 260 116V150H140Z" fill="#1a2648" />
      @for (w of waves; track $index) {
        <path
          class="shimmer"
          [style.animation-delay.s]="w[2]"
          [attr.d]="'M' + w[0] + ' ' + w[1] + 'h14'"
          stroke="#f0e3b8"
          stroke-width="1"
          opacity="0.6"
        />
      }
      <rect x="160" y="104" width="6" height="12" fill="#0e1428" />
      <path d="M158 104L163 94L168 104Z" fill="#0e1428" />
      <path
        d="M140 150V72Q140 36 200 26Q260 36 260 72V150"
        fill="none"
        stroke="#5a4636"
        stroke-width="5"
      />
      <path d="M200 30V150M140 96H260" stroke="#5a4636" stroke-width="2" />
      <!-- sedir -->
      <rect y="150" width="400" height="26" fill="#6b1f18" />
      <rect y="146" width="400" height="6" fill="#8c2a20" />
      @for (x of [20, 66, 290, 336]; track x) {
        <rect [attr.x]="x" y="124" width="40" height="24" rx="7" fill="#c9a85a" />
      }
      <rect y="176" width="400" height="44" fill="#2a1810" />
      <!-- keman -->
      <g transform="translate(110 150) rotate(-24)">
        <path
          d="M0 0Q-7 4 -6 11Q-9 16 -6 22Q-4 28 4 28Q12 28 14 22Q17 16 14 11Q15 4 8 0Q4 -2 0 0Z"
          fill="#8a4a1e"
        />
        <rect x="2" y="-26" width="4" height="27" fill="#3a2010" />
        <circle cx="4" cy="-28" r="2.4" fill="#3a2010" />
      </g>
      <!-- mumlar -->
      @for (x of [90, 312]; track x) {
        <circle class="flicker" [attr.cx]="x" cy="130" r="50" fill="url(#ho-candle)" />
        <rect [attr.x]="x - 5" y="140" width="10" height="6" fill="#b8860b" />
        <rect [attr.x]="x - 2" y="126" width="4" height="14" fill="#efe6d4" />
        <path
          class="flame"
          [attr.d]="
            'M' +
            x +
            ' 117Q' +
            (x - 2.6) +
            ' 122 ' +
            x +
            ' 126Q' +
            (x + 2.6) +
            ' 122 ' +
            x +
            ' 117Z'
          "
          fill="#ffd27a"
        />
      }
    </svg>
  `,
})
export class SceneHasOda {
  protected readonly waves = [
    [160, 124, 0],
    [196, 132, 1.2],
    [226, 122, 0.6],
    [180, 142, 2],
    [232, 140, 1.6],
  ];
}
