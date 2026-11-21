import { Component, computed, input, output } from '@angular/core';
import { ActorStage } from './actor-stage';
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
    ActorStage,
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
      <div class="art" [class.focus]="!!actor()">
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
        @if (actor(); as a) {
          <app-actor-stage
            [actorId]="a"
            [talk]="talk()"
            [tint]="light().tint"
            [rim]="light().rim"
            (step)="step.emit()"
          />
        }
        <div class="vignette" [class]="s.mood"></div>
        <div class="caption">
          <span class="name">{{ s.name }}</span>
          <span class="place">{{ s.place }}</span>
        </div>
      </div>
    }
  `,
  host: { '[class.with-actor]': '!!actor()' },
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
    .art > *:not(.vignette):not(.caption):not(app-actor-stage),
    img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      display: block;
      transition: filter 900ms ease;
    }
    .art.focus > *:not(.vignette):not(.caption):not(app-actor-stage) {
      filter: blur(2.5px) brightness(0.78) saturate(0.9);
    }
    :host(.with-actor) {
      height: 47vh;
      max-height: 560px;
    }
    :host {
      transition: height 700ms ease;
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
  readonly actor = input<string | undefined>();
  readonly talk = input<[number, number][]>([]);
  readonly step = output<void>();
  protected readonly scene = computed(() => SCENES[this.sceneId()] ?? DEFAULT_SCENE);
  protected readonly raster = computed(() => RASTER_SCENES.has(this.scene().id));
  /** Karakteri mekânın ışığıyla boya: gün batımında sıcak, mum ışığında turuncu kenar, karanlıkta loş */
  protected readonly light = computed<{
    tint: [number, number, number];
    rim: [number, number, number];
  }>(() => {
    switch (this.scene().mood) {
      case 'dusk':
        return { tint: [1.03, 0.9, 0.8], rim: [1, 0.55, 0.25] };
      case 'night':
        return { tint: [0.8, 0.78, 0.9], rim: [1, 0.7, 0.35] };
      case 'dark':
        return { tint: [0.78, 0.68, 0.56], rim: [1, 0.7, 0.3] };
      default:
        return { tint: [1, 0.98, 0.95], rim: [0, 0, 0] };
    }
  });
}
