import { Component } from '@angular/core';

/** Eski Saray, harem koridoru, gece: kemerler, çini kuşak, nişlerde mumlar, avluda ay. */
@Component({
  selector: 'scene-eski-saray-gece',
  template: `
    <svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="esg-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#121a36" />
          <stop offset="1" stop-color="#2a3560" />
        </linearGradient>
        <radialGradient id="esg-candle" cx="50%" cy="50%" r="50%">
          <stop offset="0" stop-color="#ffd27a" stop-opacity="0.75" />
          <stop offset="0.4" stop-color="#e8a040" stop-opacity="0.25" />
          <stop offset="1" stop-color="#e8a040" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="esg-moonlight" cx="50%" cy="100%" r="70%">
          <stop offset="0" stop-color="#a8bce8" stop-opacity="0.35" />
          <stop offset="1" stop-color="#a8bce8" stop-opacity="0" />
        </radialGradient>
        <pattern id="esg-tile" width="16" height="12" patternUnits="userSpaceOnUse">
          <rect width="16" height="12" fill="#1d4a6e" />
          <path d="M8 1Q5 6 8 11Q11 6 8 1Z" fill="#3a9a95" />
          <circle cx="0" cy="6" r="2" fill="#f3e9d2" opacity="0.8" />
          <circle cx="16" cy="6" r="2" fill="#f3e9d2" opacity="0.8" />
          <circle cx="8" cy="6" r="1" fill="#b3241a" />
        </pattern>
      </defs>

      <rect width="400" height="220" fill="#1e1828" />
      <!-- avluya açılan orta kemer -->
      <path d="M150 178V86Q150 52 200 40Q250 52 250 86V178Z" fill="url(#esg-sky)" />
      <circle class="twinkle" cx="176" cy="70" r="0.9" fill="#f3e9d2" />
      <circle class="twinkle d2" cx="228" cy="62" r="0.8" fill="#f3e9d2" />
      <circle class="twinkle d3" cx="212" cy="88" r="0.7" fill="#f3e9d2" />
      <circle cx="222" cy="78" r="9" fill="#f0e3b8" />
      <circle cx="226" cy="75" r="8" fill="#1c2546" />
      <use href="#fig-servi" x="162" y="104" width="16" height="74" style="color:#0c1020" />
      <use href="#fig-servi" x="226" y="96" width="18" height="82" style="color:#0c1020" />
      <rect x="150" y="160" width="100" height="18" fill="#141a30" />

      <!-- yan kemerler -->
      <path d="M28 178V98Q28 72 66 64Q104 72 104 98V178Z" fill="#141020" />
      <path d="M296 178V98Q296 72 334 64Q372 72 372 98V178Z" fill="#141020" />
      <path d="M0 0H400V40H0Z" fill="#17121f" />
      <path d="M0 40H400" stroke="#3a2c40" stroke-width="2" />
      <g fill="none" stroke="#5a4636" stroke-width="2.4">
        <path d="M150 178V86Q150 52 200 40Q250 52 250 86V178" />
        <path d="M28 178V98Q28 72 66 64Q104 72 104 98V178" />
        <path d="M296 178V98Q296 72 334 64Q372 72 372 98V178" />
      </g>

      <!-- çini kuşak -->
      <rect x="0" y="140" width="28" height="14" fill="url(#esg-tile)" />
      <rect x="104" y="140" width="46" height="14" fill="url(#esg-tile)" />
      <rect x="250" y="140" width="46" height="14" fill="url(#esg-tile)" />
      <rect x="372" y="140" width="28" height="14" fill="url(#esg-tile)" />

      <!-- zemin -->
      <path d="M0 178H400V220H0Z" fill="#120d16" />
      <path d="M150 178L120 220M250 178L280 220M200 178V220" stroke="#21182a" stroke-width="1" />
      <ellipse cx="200" cy="190" rx="70" ry="16" fill="url(#esg-moonlight)" />

      <!-- nişlerde mumlar -->
      @for (x of [127, 273]; track x) {
        <path
          [attr.d]="
            'M' +
            (x - 9) +
            ' 132V114Q' +
            (x - 9) +
            ' 104 ' +
            x +
            ' 101Q' +
            (x + 9) +
            ' 104 ' +
            (x + 9) +
            ' 114V132Z'
          "
          fill="#0e0a12"
        />
        <circle class="flicker" [attr.cx]="x" [attr.cy]="118" r="34" fill="url(#esg-candle)" />
        <rect [attr.x]="x - 2" y="120" width="4" height="11" fill="#efe6d4" />
        <path
          class="flame"
          [attr.d]="
            'M' +
            x +
            ' 111Q' +
            (x - 2.6) +
            ' 116 ' +
            x +
            ' 120Q' +
            (x + 2.6) +
            ' 116 ' +
            x +
            ' 111Z'
          "
          fill="#ffd27a"
        />
      }

      <!-- Nazende ve Hafsa Hatun -->
      <use href="#fig-kadin" x="92" y="134" width="20" height="50" style="color:#7a2e5a" />
      <use href="#fig-kadin" x="304" y="124" width="24" height="60" style="color:#3c2a5e" />
      <ellipse cx="316" cy="184" rx="12" ry="2.5" fill="#000" opacity="0.4" />
      <ellipse cx="102" cy="184" rx="10" ry="2" fill="#000" opacity="0.4" />
    </svg>
  `,
})
export class SceneEskiSarayGece {}
