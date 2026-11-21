import { Component, input } from '@angular/core';
import { StatKey } from '../game/story.service';

@Component({
  selector: 'app-stat-icon',
  template: `
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      @switch (stat()) {
        @case ('hazine') {
          <ellipse cx="12" cy="6" rx="7" ry="2.5" />
          <path d="M5 6v4c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V6" />
          <path d="M5 10v4c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-4" />
          <path d="M5 14v4c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-4" />
        }
        @case ('yeniceri') {
          <path d="M4 10h16" />
          <path d="M5 10l1.5 8.5a2 2 0 0 0 2 1.5h7a2 2 0 0 0 2-1.5L19 10" />
          <path d="M8 10V7m8 3V7" />
          <path d="M7 7h10" />
        }
        @case ('divan') {
          <path d="M4 20h16" />
          <path d="M6 20v-6m12 6v-6" />
          <path d="M5 14a7 7 0 0 1 14 0z" />
          <path d="M12 7V4" />
        }
        @case ('harem') {
          <path d="M12 21v-8" />
          <path d="M12 13c-3 0-5-2.5-5-6 2 0 3.5 1 5 3 1.5-2 3-3 5-3 0 3.5-2 6-5 6z" />
          <path d="M12 10c-1-2-1-4 0-6 1 2 1 4 0 6" />
          <path d="M9 18c-2 0-3-1-3-2 2 0 3 .5 4 1.5" />
        }
        @case ('halk') {
          <circle cx="8" cy="8" r="2.5" />
          <circle cx="16" cy="8" r="2.5" />
          <path d="M3.5 19a4.5 4.5 0 0 1 9 0" />
          <path d="M11.5 19a4.5 4.5 0 0 1 9 0" />
        }
      }
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
    }
  `,
})
export class StatIcon {
  readonly stat = input.required<StatKey>();
}
