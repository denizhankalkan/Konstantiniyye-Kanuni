import { Component } from '@angular/core';

/** Hasbahçe, akşam: Haliç'e inen gün batımı, karşıda Galata Kulesi, lale tarhları, fıskiye. */
@Component({
  selector: 'scene-bahce',
  template: `
    <svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="bh-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#3c3a6a" />
          <stop offset="0.55" stop-color="#d4785a" />
          <stop offset="1" stop-color="#f2c27a" />
        </linearGradient>
        <linearGradient id="bh-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#d48a62" />
          <stop offset="1" stop-color="#3a3a5a" />
        </linearGradient>
      </defs>
      <rect width="400" height="220" fill="url(#bh-sky)" />
      <circle cx="300" cy="92" r="16" fill="#ffd9a0" opacity="0.9" />
      <!-- Galata kıyısı -->
      <path d="M0 104Q60 92 120 98T260 94T400 100V112H0Z" fill="#4a3048" />
      <rect x="238" y="62" width="10" height="40" fill="#3a2440" />
      <path d="M235 62L243 48L251 62Z" fill="#3a2440" />
      <rect x="150" y="90" width="4" height="12" fill="#3a2440" />
      <rect x="320" y="88" width="4" height="14" fill="#3a2440" />
      <!-- Haliç -->
      <rect y="110" width="400" height="40" fill="url(#bh-water)" />
      @for (w of waves; track $index) {
        <path
          class="shimmer"
          [style.animation-delay.s]="w[2]"
          [attr.d]="'M' + w[0] + ' ' + w[1] + 'h' + 22"
          stroke="#ffd9a0"
          stroke-width="1.2"
          opacity="0.6"
        />
      }
      <path d="M90 128q8 -6 24 0z" fill="#2a1d24" />
      <path d="M101 128V112" stroke="#2a1d24" stroke-width="1" />
      <path d="M101 113l10 9h-10z" fill="#e8d4b0" opacity="0.8" />
      <!-- bahçe -->
      <path d="M0 146Q100 138 200 142T400 144V220H0Z" fill="#2f4a2e" />
      <use href="#fig-servi" x="10" y="40" width="30" height="120" style="color:#1c2e1e" />
      <use href="#fig-servi" x="360" y="50" width="28" height="110" style="color:#1c2e1e" />
      <!-- şadırvan -->
      <ellipse cx="200" cy="186" rx="44" ry="10" fill="#c9bfa6" />
      <ellipse cx="200" cy="184" rx="38" ry="7" fill="#5a7a8a" />
      <rect x="196" y="164" width="8" height="20" fill="#c9bfa6" />
      <path
        class="fountain"
        d="M200 164Q192 150 186 178M200 164Q208 150 214 178"
        stroke="#dfeef4"
        stroke-width="1.2"
        fill="none"
        opacity="0.8"
      />
      <!-- laleler -->
      @for (t of tulips; track $index) {
        <use
          href="#fig-lale"
          [attr.x]="t[0]"
          [attr.y]="t[1]"
          width="8"
          height="16"
          [style.color]="t[2]"
        />
      }
      <!-- Süleyman ve İbrahim -->
      @for (f of flies; track $index) {
        <circle
          class="firefly"
          [style.animation-delay.s]="f[2]"
          [attr.cx]="f[0]"
          [attr.cy]="f[1]"
          r="1.1"
          fill="#fff3a0"
        />
      }
    </svg>
  `,
})
export class SceneBahce {
  protected readonly waves = [
    [30, 120, 0],
    [130, 126, 1],
    [240, 118, 2],
    [330, 130, 0.5],
    [60, 138, 1.6],
    [280, 140, 2.6],
  ];
  protected readonly tulips = [
    [40, 190, '#b3241a'],
    [52, 194, '#e8c36a'],
    [64, 190, '#b3241a'],
    [76, 194, '#f1e4d0'],
    [300, 190, '#b3241a'],
    [312, 194, '#7a2e5a'],
    [324, 190, '#e8c36a'],
    [336, 194, '#b3241a'],
  ] as const;
  protected readonly flies = [
    [60, 160, 0],
    [150, 140, 1.5],
    [330, 158, 0.8],
    [220, 150, 2.2],
  ];
}
