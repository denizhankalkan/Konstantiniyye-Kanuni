import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CHARACTERS } from '../data/characters';
import { SCENES } from '../data/scenes';
import { Portrait } from '../ui/portrait';
import { SceneBanner } from '../ui/scene-banner';

/** Geliştirici galerisi (/galeri): tüm mekânlar ve portreler tek sayfada. Çizim gözden geçirmek için. */
@Component({
  selector: 'app-gallery',
  imports: [Portrait, SceneBanner, RouterLink],
  template: `
    <header>
      <a routerLink="/">‹ Ana ekran</a>
      <h1>Galeri</h1>
    </header>
    <h2>Mekânlar</h2>
    <div class="scenes">
      @for (s of scenes; track s.id) {
        <figure>
          <app-scene-banner [sceneId]="s.id" />
          <figcaption>{{ s.id }}</figcaption>
        </figure>
      }
    </div>
    <h2>Kişiler</h2>
    <div class="people">
      @for (c of characters; track c.id) {
        <figure>
          <app-portrait [id]="c.id" [size]="96" />
          <figcaption>{{ c.name }}</figcaption>
        </figure>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
      min-height: 100dvh;
      background: var(--parchment);
      padding: calc(var(--safe-top) + 12px) 16px 40px;
    }
    header {
      display: flex;
      align-items: baseline;
      gap: 16px;
    }
    a {
      color: var(--lapis);
    }
    h1,
    h2 {
      font-family: var(--font-display);
      font-weight: 600;
      margin: 8px 0;
    }
    .scenes {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 12px;
    }
    .people {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
      gap: 12px;
    }
    figure {
      margin: 0;
      text-align: center;
    }
    figcaption {
      font-size: 14px;
      color: var(--ink-soft);
      margin-top: 4px;
    }
  `,
})
export class GalleryScreen {
  protected readonly scenes = Object.values(SCENES);
  protected readonly characters = CHARACTERS;
}
