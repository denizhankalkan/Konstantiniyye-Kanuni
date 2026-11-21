import { Component, computed, input } from '@angular/core';
import { DEFAULT_SCENE, SCENES } from '../data/scenes';
import { RASTER_SCENES } from '../data/art-manifest';
import { SceneEskiSarayGece } from './scenes/eski-saray-gece';
import { SceneHaremKogus } from './scenes/harem-kogus';
import { SceneBedesten } from './scenes/bedesten';
import { SceneHazine } from './scenes/hazine';
import { SceneBabussaade } from './scenes/babussaade';
import { SceneBahce } from './scenes/bahce';
import { SceneHasOda } from './scenes/has-oda';
import { SceneDivan } from './scenes/divan';

/**
 * Sahnenin görsel bandı. Her mekân ayrı bir SVG çizimi (ui/scenes/).
 * public/art/scenes/<id>.webp varsa (art-manifest.ts) onun yerine resim gösterilir.
 */
@Component({
  selector: 'app-scene-banner',
  imports: [
    SceneEskiSarayGece,
    SceneHaremKogus,
    SceneBedesten,
    SceneHazine,
    SceneBabussaade,
    SceneBahce,
    SceneHasOda,
    SceneDivan,
  ],
  template: `
    @for (s of [scene()]; track s.id) {
      <div class="art">
        @if (raster()) {
          <img [src]="'art/scenes/' + s.id + '.webp'" alt="" />
        } @else {
          @switch (s.id) {
            @case ('harem-kogus') {
              <scene-harem-kogus />
            }
            @case ('bedesten') {
              <scene-bedesten />
            }
            @case ('hazine') {
              <scene-hazine />
            }
            @case ('babussaade') {
              <scene-babussaade />
            }
            @case ('bahce') {
              <scene-bahce />
            }
            @case ('has-oda') {
              <scene-has-oda />
            }
            @case ('divan') {
              <scene-divan />
            }
            @default {
              <scene-eski-saray-gece />
            }
          }
        }
        <div class="vignette" [class]="s.mood"></div>
        <div class="caption">
          <span class="name">{{ s.name }}</span>
          <span class="place">{{ s.place }}</span>
        </div>
      </div>
    }
  `,
  styles: `
    :host {
      display: block;
      position: relative;
      height: 32vh;
      min-height: 170px;
      max-height: 300px;
      overflow: hidden;
      background: #120d16;
    }
    .art {
      position: absolute;
      inset: 0;
      animation: scene-in 900ms ease both;
    }
    .art > *:not(.vignette):not(.caption),
    img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      display: block;
    }
    img {
      object-fit: cover;
    }
    :host ::ng-deep svg {
      width: 100%;
      height: 100%;
      display: block;
    }
    .vignette {
      position: absolute;
      inset: 0;
      pointer-events: none;
      background: radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(10, 6, 4, 0.55) 100%);
    }
    .vignette.night,
    .vignette.dark {
      background: radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(6, 4, 10, 0.7) 100%);
    }
    .vignette.dusk {
      background: radial-gradient(
        ellipse at 70% 40%,
        rgba(255, 180, 100, 0.12),
        transparent 50%,
        rgba(20, 8, 20, 0.5) 100%
      );
    }
    .caption {
      position: absolute;
      left: 16px;
      bottom: 10px;
      display: flex;
      flex-direction: column;
      color: #f3e9d2;
      text-shadow: 0 1px 8px rgba(0, 0, 0, 0.85);
      pointer-events: none;
    }
    .name {
      font-family: var(--font-display);
      font-size: 26px;
      font-weight: 600;
      line-height: 1;
    }
    .place {
      font-size: 13px;
      letter-spacing: 0.08em;
      opacity: 0.9;
    }
    @keyframes scene-in {
      from {
        opacity: 0;
        transform: scale(1.04);
      }
      to {
        opacity: 1;
        transform: none;
      }
    }
  `,
})
export class SceneBanner {
  readonly sceneId = input.required<string>();
  protected readonly scene = computed(() => SCENES[this.sceneId()] ?? DEFAULT_SCENE);
  protected readonly raster = computed(() => RASTER_SCENES.has(this.scene().id));
}
