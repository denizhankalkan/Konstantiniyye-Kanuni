import { Component } from '@angular/core';

/** Babüssaade önünde cülus: geniş saçaklı kapı, altın taht, sıra sıra vezirler ve yeniçeriler. */
@Component({
  selector: 'scene-babussaade',
  template: `
    <svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="bs-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#9fc0d8" />
          <stop offset="1" stop-color="#e6eef0" />
        </linearGradient>
        <linearGradient id="bs-sun" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#fff6d8" stop-opacity="0.4" />
          <stop offset="1" stop-color="#fff6d8" stop-opacity="0" />
        </linearGradient>
      </defs>
      <rect width="400" height="220" fill="url(#bs-sky)" />
      <g class="drift">
        <ellipse cx="80" cy="30" rx="34" ry="7" fill="#fff" opacity="0.7" />
        <ellipse cx="104" cy="26" rx="20" ry="6" fill="#fff" opacity="0.7" />
      </g>
      <g class="drift slow">
        <ellipse cx="300" cy="22" rx="28" ry="6" fill="#fff" opacity="0.6" />
      </g>
      <!-- servi ağaçları -->
      <use href="#fig-servi" x="14" y="40" width="26" height="110" style="color:#2f4a36" />
      <use href="#fig-servi" x="40" y="56" width="22" height="94" style="color:#26402e" />
      <use href="#fig-servi" x="356" y="44" width="26" height="106" style="color:#2f4a36" />
      <!-- kapı yapısı -->
      <rect x="110" y="76" width="180" height="78" fill="#e9e0cc" />
      <path d="M200 56Q186 58 184 70H216Q214 58 200 56Z" fill="#5b6a6e" />
      <rect x="198" y="48" width="4" height="9" fill="#b8860b" />
      <path d="M76 82L110 64H290L324 82Z" fill="#3e4c50" />
      <path d="M76 82H324" stroke="#2a3436" stroke-width="2" />
      @for (x of [118, 150, 238, 270]; track x) {
        <rect [attr.x]="x" y="84" width="8" height="70" fill="#d6cbb2" />
        <rect [attr.x]="x - 2" y="84" width="12" height="4" fill="#b8a888" />
      }
      <path d="M178 154V112Q178 94 200 90Q222 94 222 112V154Z" fill="#6b2018" />
      <path
        d="M178 112Q178 94 200 90Q222 94 222 112"
        stroke="#b8860b"
        stroke-width="2"
        fill="none"
      />
      <rect x="112" y="96" width="34" height="6" fill="#1d4a6e" />
      <rect x="254" y="96" width="34" height="6" fill="#1d4a6e" />
      <rect y="150" width="400" height="70" fill="#c9bfa6" />
      <path d="M0 150H400" stroke="#a89a7c" stroke-width="2" />
      <path class="shaft" d="M120 0L260 0L320 220L80 220Z" fill="url(#bs-sun)" />
      <!-- taht ve padişah -->
      <!-- vezirler -->
      @for (x of [118, 140, 162]; track x) {
        <use href="#fig-vezir" [attr.x]="x" y="146" width="22" height="56" style="color:#2f4a46" />
      }
      <use href="#fig-vezir" x="234" y="146" width="22" height="56" style="color:#5b4630" />
      <!-- yeniçeriler -->
      @for (x of [10, 34, 58, 82, 296, 320, 344, 368]; track x) {
        <use
          href="#fig-yeniceri"
          [attr.x]="x"
          y="156"
          width="22"
          height="56"
          style="color:#6b1f18"
        />
      }
    </svg>
  `,
})
export class SceneBabussaade {}
