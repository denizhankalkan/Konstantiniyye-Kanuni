import { Component } from '@angular/core';

/** Kubbealtı: kubbe, sedirde oturan vezirler, yukarıda padişahın dinlediği altın kafesli pencere. */
@Component({
  selector: 'scene-divan',
  template: `
    <svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="dv-shaft" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#fff0c8" stop-opacity="0.45" />
          <stop offset="1" stop-color="#fff0c8" stop-opacity="0" />
        </linearGradient>
        <pattern id="dv-grid" width="5" height="5" patternUnits="userSpaceOnUse">
          <rect width="5" height="5" fill="#2a1a0c" />
          <path d="M0 2.5H5M2.5 0V5" stroke="#d4a22e" stroke-width="1" />
        </pattern>
        <pattern id="dv-kalem" width="24" height="12" patternUnits="userSpaceOnUse">
          <rect width="24" height="12" fill="#c9a87a" />
          <path d="M0 6Q6 0 12 6T24 6" stroke="#8c1c13" stroke-width="1.2" fill="none" />
          <circle cx="12" cy="6" r="1.4" fill="#1f3b73" />
        </pattern>
      </defs>
      <rect width="400" height="220" fill="#e4d4b2" />
      <!-- kubbe -->
      <path d="M40 92Q40 6 200 2Q360 6 360 92Z" fill="#d8c49c" />
      <path d="M40 92Q40 6 200 2Q360 6 360 92" fill="none" stroke="#8a6a3a" stroke-width="3" />
      <rect x="40" y="88" width="320" height="10" fill="url(#dv-kalem)" />
      @for (x of [110, 160, 210, 260]; track x) {
        <path
          [attr.d]="
            'M' +
            (x + 4) +
            ' 70V52Q' +
            (x + 4) +
            ' 44 ' +
            (x + 10) +
            ' 42Q' +
            (x + 16) +
            ' 44 ' +
            (x + 16) +
            ' 52V70Z'
          "
          fill="#fff6dc"
        />
      }
      <path d="M200 6V30" stroke="#5a4630" stroke-width="1" />
      <circle cx="200" cy="34" r="5" fill="#d4a22e" />
      <!-- altın kafesli pencere (Kasr-ı Adl) -->
      <path d="M176 136V112Q176 100 200 96Q224 100 224 112V136Z" fill="url(#dv-grid)" />
      <path
        d="M176 136V112Q176 100 200 96Q224 100 224 112V136"
        fill="none"
        stroke="#b8860b"
        stroke-width="2.5"
      />
      <path class="shaft" d="M180 136L220 136L260 220L140 220Z" fill="url(#dv-shaft)" />
      <!-- duvar ve sedir -->
      <rect y="98" width="400" height="6" fill="#8a6a3a" />
      <rect x="0" y="104" width="170" height="60" fill="#d2bf98" />
      <rect x="230" y="104" width="170" height="60" fill="#d2bf98" />
      <rect y="164" width="400" height="18" fill="#8c1c13" />
      <rect y="160" width="400" height="6" fill="#a8403a" />
      <rect y="182" width="400" height="38" fill="#6b4a2b" />
      @for (v of vezirs; track v.x) {
        <use href="#fig-oturan" [attr.x]="v.x" y="128" width="40" height="45" [style.color]="v.c" />
      }
      <!-- kâtipler -->
      <use href="#fig-oturan" x="170" y="172" width="32" height="36" style="color:#5b4630" />
      <rect x="200" y="196" width="18" height="4" fill="#efe6d4" />
      <use href="#fig-yeniceri" x="372" y="150" width="22" height="58" style="color:#6b1f18" />
    </svg>
  `,
})
export class SceneDivan {
  protected readonly vezirs = [
    { x: 20, c: '#2f4a46' },
    { x: 60, c: '#3c2a5e' },
    { x: 100, c: '#5b4630' },
    { x: 250, c: '#1f3b73' },
    { x: 290, c: '#6b2a1a' },
  ];
}
