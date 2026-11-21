import { Component } from '@angular/core';

/** Kalfalar koğuşu, şafak: kafesli pencerelerden ışık huzmeleri, sedirler, uyanan kızlar. */
@Component({
  selector: 'scene-harem-kogus',
  template: `
    <svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="hk-shaft" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stop-color="#ffe2b0" stop-opacity="0.55" />
          <stop offset="1" stop-color="#ffe2b0" stop-opacity="0" />
        </linearGradient>
        <pattern
          id="hk-kafes"
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <rect width="6" height="6" fill="#f6d9a6" />
          <path d="M0 0H6V6" stroke="#5a3a22" stroke-width="1.6" fill="none" />
        </pattern>
        <pattern id="hk-kilim" width="20" height="10" patternUnits="userSpaceOnUse">
          <rect width="20" height="10" fill="#8c1c13" />
          <path d="M0 5L5 0L10 5L5 10Z M10 5L15 0L20 5L15 10Z" fill="#c9762e" />
          <path d="M3 5L5 3L7 5L5 7Z M13 5L15 3L17 5L15 7Z" fill="#1f3b73" />
        </pattern>
      </defs>
      <rect width="400" height="220" fill="#5a3e2a" />
      <rect y="0" width="400" height="26" fill="#3e2a1c" />
      @for (i of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]; track i) {
        <rect [attr.x]="i * 40" y="0" width="4" height="26" fill="#2b1d12" />
      }
      <!-- kafesli pencereler -->
      @for (x of [60, 180, 300]; track x) {
        <path
          [attr.d]="
            'M' +
            x +
            ' 96V60Q' +
            x +
            ' 44 ' +
            (x + 20) +
            ' 40Q' +
            (x + 40) +
            ' 44 ' +
            (x + 40) +
            ' 60V96Z'
          "
          fill="url(#hk-kafes)"
        />
        <path
          [attr.d]="
            'M' +
            x +
            ' 96V60Q' +
            x +
            ' 44 ' +
            (x + 20) +
            ' 40Q' +
            (x + 40) +
            ' 44 ' +
            (x + 40) +
            ' 60V96Z'
          "
          fill="none"
          stroke="#2b1d12"
          stroke-width="2.5"
        />
        <path
          class="shaft"
          [attr.d]="'M' + x + ' 60L' + (x + 40) + ' 60L' + (x + 90) + ' 190L' + (x + 30) + ' 190Z'"
          fill="url(#hk-shaft)"
        />
      }
      <!-- sedir ve yastıklar -->
      <rect x="0" y="150" width="400" height="22" fill="#7a2e2a" />
      <rect x="0" y="146" width="400" height="6" fill="#a8403a" />
      @for (x of [20, 70, 120, 230, 280, 330]; track x) {
        <rect [attr.x]="x" y="128" width="40" height="22" rx="6" fill="#c9a85a" />
        <path [attr.d]="'M' + (x + 4) + ' 139H' + (x + 36)" stroke="#8c1c13" stroke-width="2" />
      }
      <rect x="0" y="172" width="400" height="48" fill="url(#hk-kilim)" />
      <rect x="0" y="172" width="400" height="48" fill="#000" opacity="0.25" />
      <!-- uyanan kızlar -->
      <use href="#fig-kadin" x="150" y="122" width="22" height="55" style="color:#3e6a6a" />
      <use href="#fig-kadin" x="186" y="126" width="20" height="50" style="color:#7a2e5a" />
      <use href="#fig-kadin" x="250" y="118" width="22" height="58" style="color:#6b4a2b" />
      @for (d of dust; track $index) {
        <circle
          class="dust"
          [style.animation-delay.s]="d[2]"
          [attr.cx]="d[0]"
          [attr.cy]="d[1]"
          r="0.9"
          fill="#fff3d6"
        />
      }
    </svg>
  `,
})
export class SceneHaremKogus {
  protected readonly dust = [
    [90, 110, 0],
    [120, 140, 2],
    [210, 100, 1],
    [240, 150, 3],
    [330, 120, 1.5],
    [350, 160, 2.5],
    [100, 170, 4],
  ];
}
