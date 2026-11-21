import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { StoryService } from '../game/story.service';
import { AudioService } from '../game/audio.service';

@Component({
  selector: 'app-title',
  template: `
    <div class="frame">
      <svg
        class="skyline"
        viewBox="0 0 400 140"
        preserveAspectRatio="xMidYMax slice"
        aria-hidden="true"
      >
        <g fill="#0b1020">
          <path d="M0 140V110h400v30z" />
          <path d="M140 110a60 48 0 0 1 120 0z" />
          <path d="M90 110a30 24 0 0 1 60 0zM250 110a30 24 0 0 1 60 0z" />
          <rect x="70" y="40" width="6" height="70" />
          <path d="M69 40l4-18 4 18z" />
          <rect x="324" y="40" width="6" height="70" />
          <path d="M323 40l4-18 4 18z" />
          <rect x="198" y="52" width="4" height="12" />
        </g>
      </svg>
      <div class="content">
        <p class="eyebrow">MDXX · 1520</p>
        <h1>Konstantiniyye</h1>
        <p class="subtitle">Kanuni’nin Yüzyılı</p>
        <div class="rule" aria-hidden="true"><span></span></div>
        <div class="actions">
          @if (hasSave()) {
            <button class="primary" (click)="resume()">Devam et</button>
            <button (click)="start()">Yeni oyun</button>
          } @else {
            <button class="primary" (click)="start()">Oyuna başla</button>
          }
        </div>
        <p class="note">
          Tarihî olaylardan esinlenmiş bir kurgu. Bazı karakterler oyun için yaratılmıştır.
        </p>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      height: 100dvh;
      background: var(--night);
      color: var(--parchment);
    }
    .frame {
      position: relative;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: calc(var(--safe-top) + 24px) 28px calc(var(--safe-bottom) + 24px);
      overflow: hidden;
    }
    .skyline {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 34%;
    }
    .frame::before {
      content: '';
      position: absolute;
      top: 14%;
      right: 18%;
      width: 46px;
      height: 46px;
      border-radius: 50%;
      box-shadow: 10px -6px 0 0 var(--gold-soft);
    }
    .content {
      position: relative;
      text-align: center;
      margin-bottom: 18vh;
    }
    .eyebrow {
      letter-spacing: 0.3em;
      font-size: 13px;
      color: var(--gold-soft);
      margin: 0 0 8px;
    }
    h1 {
      font-family: var(--font-display);
      font-weight: 600;
      font-size: clamp(44px, 13vw, 72px);
      margin: 0;
      line-height: 1;
      letter-spacing: 0.02em;
    }
    .subtitle {
      font-family: var(--font-display);
      font-size: 24px;
      font-style: italic;
      margin: 6px 0 0;
      color: #e9dcc0;
    }
    .rule {
      display: flex;
      justify-content: center;
      margin: 22px 0;
    }
    .rule span {
      width: 120px;
      height: 1px;
      background: var(--gold-soft);
      position: relative;
    }
    .rule span::after {
      content: '';
      position: absolute;
      left: 50%;
      top: -4px;
      width: 8px;
      height: 8px;
      margin-left: -4px;
      background: var(--gold-soft);
      transform: rotate(45deg);
    }
    .actions {
      display: flex;
      flex-direction: column;
      gap: 12px;
      align-items: center;
    }
    button {
      min-width: 220px;
      padding: 14px 20px;
      font-size: 19px;
      background: transparent;
      color: var(--parchment);
      border: 1px solid rgba(232, 195, 106, 0.6);
      border-radius: 2px;
    }
    button.primary {
      background: var(--crimson);
      border-color: var(--gold-soft);
    }
    button:active {
      transform: scale(0.98);
    }
    .note {
      margin-top: 28px;
      font-size: 13px;
      color: #a89a80;
      font-style: italic;
    }
  `,
})
export class TitleScreen implements OnInit {
  private story = inject(StoryService);
  private audio = inject(AudioService);
  private router = inject(Router);
  protected hasSave = signal(false);

  async ngOnInit() {
    this.hasSave.set(await this.story.hasSave());
  }

  async start() {
    this.audio.unlock();
    await this.story.newGame();
    await this.router.navigateByUrl('/oyun');
  }

  async resume() {
    this.audio.unlock();
    if (await this.story.continueGame()) await this.router.navigateByUrl('/oyun');
    else await this.start();
  }
}
