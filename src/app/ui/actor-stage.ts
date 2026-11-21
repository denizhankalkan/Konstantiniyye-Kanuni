import {
  Component,
  ElementRef,
  OnDestroy,
  effect,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { ACTORS, ActorRig } from '../data/actors';

const VERT = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = vec2(a_pos.x * 0.5 + 0.5, 0.5 - a_pos.y * 0.5);
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

/** Ters çarpıtma: her ekran pikseli için resmin neresinden okunacağını hesaplar. */
const FRAG = `
precision highp float;
varying vec2 v_uv;
uniform sampler2D u_tex;
uniform vec2 u_size;
uniform vec2 u_neck;
uniform vec2 u_headFade;
uniform float u_mouthY, u_chinY, u_jawAmp;
uniform vec2 u_jawX;
uniform vec4 u_eye0, u_eye1;
uniform vec2 u_breathY;
uniform vec2 u_armPivot;
uniform vec4 u_armBox;
uniform float u_jaw, u_blink, u_headAngle, u_nod, u_breath, u_arm;
uniform vec3 u_tint, u_rim;

vec2 rotateAround(vec2 p, vec2 c, float a) {
  float s = sin(a), co = cos(a);
  vec2 r = p - c;
  return c + vec2(co * r.x - s * r.y, s * r.x + co * r.y);
}

float eyeLid(vec2 p, vec4 e) {
  vec2 q = (p - e.xy) / e.zw;
  float t = 1.0 - dot(q, q);
  return t > 0.0 ? smoothstep(0.0, 0.55, t) * e.w * 1.25 : 0.0;
}

void main() {
  vec2 p = v_uv * u_size;
  vec2 src = p;

  // nefes: üst gövde ve baş hafifçe yükselir
  float wb = 1.0 - smoothstep(u_breathY.x, u_breathY.y, p.y);
  src.y += u_breath * 3.2 * wb;

  // baş: boyun ekseninde dönme ve başla onaylama
  float wh = 1.0 - smoothstep(u_headFade.x, u_headFade.y, p.y);
  src = mix(src, rotateAround(src, u_neck, -u_headAngle), wh);
  src.y -= u_nod * wh;

  // çene: dudak çizgisinin altı aşağı iner
  float wjx = smoothstep(u_jawX.x - 25.0, u_jawX.x + 15.0, p.x) * (1.0 - smoothstep(u_jawX.y - 15.0, u_jawX.y + 25.0, p.x));
  float wjy = smoothstep(u_mouthY - 3.0, u_mouthY + 9.0, p.y) * (1.0 - smoothstep(u_chinY, u_chinY + 40.0, p.y));
  src.y -= u_jaw * u_jawAmp * wjx * wjy;

  // göz kırpma: göz kapağının üstündeki deri aşağı çekilir
  src.y -= u_blink * (eyeLid(p, u_eye0) + eyeLid(p, u_eye1));

  // kol: dirsek ekseninde küçük bir jest
  float wa = smoothstep(u_armBox.x, u_armBox.x + 35.0, p.x) * smoothstep(u_armBox.y, u_armBox.y + 70.0, p.y);
  src = mix(src, rotateAround(src, u_armPivot, -u_arm), wa);

  vec2 uv = src / u_size;
  if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) { gl_FragColor = vec4(0.0); return; }
  vec4 c = texture2D(u_tex, uv);
  vec3 rgb = c.rgb * u_tint + u_rim * c.a * smoothstep(0.55, 1.0, v_uv.x) * 0.22;
  gl_FragColor = vec4(rgb, c.a);
}`;

/**
 * Canlandırılmış karakter: nefes alır, göz kırpar, başını oynatır, konuşurken çenesi ve eli hareket eder.
 * İlk girişte karşıdan oyuncuya doğru yürüyerek gelir.
 */
@Component({
  selector: 'app-actor-stage',
  template: `<div class="walker" #walker><canvas #canvas></canvas></div>`,
  styles: `
    :host {
      position: absolute;
      inset: 0;
      display: flex;
      justify-content: center;
      align-items: flex-end;
      pointer-events: none;
      overflow: hidden;
    }
    .walker {
      height: 100%;
      transform-origin: 50% 100%;
      will-change: transform;
    }
    canvas {
      height: 100%;
      display: block;
    }
  `,
})
export class ActorStage implements OnDestroy {
  readonly actorId = input.required<string>();
  /** Konuştuğu zaman aralıkları (performance.now() cinsinden [başlangıç, bitiş]) */
  readonly talk = input<[number, number][]>([]);
  /** true ise karşıdan yürüyerek gelir */
  readonly walkIn = input(true);
  /** Sahne ışığı: renk çarpanı ve kenar ışığı */
  readonly tint = input<[number, number, number]>([1, 1, 1]);
  readonly rim = input<[number, number, number]>([0, 0, 0]);
  readonly step = output<void>();

  private host = inject(ElementRef<HTMLElement>);
  private canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private walker = viewChild.required<ElementRef<HTMLDivElement>>('walker');
  private gl?: WebGLRenderingContext;
  private prog?: WebGLProgram;
  private uni: Record<string, WebGLUniformLocation | null> = {};
  private raf = 0;
  private rig?: ActorRig;
  private start = 0;
  private walkStart = 0;
  private lastStep = -1;
  private nextBlink = 0;
  private jaw = 0;
  private gesture = 0;
  private resize?: ResizeObserver;

  constructor() {
    effect(() => {
      const id = this.actorId();
      void this.load(id);
    });
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.raf);
    this.resize?.disconnect();
  }

  private async load(id: string) {
    const rig = ACTORS[id];
    if (!rig) return;
    this.rig = rig;
    const img = new Image();
    img.src = rig.src;
    await img.decode().catch(() => undefined);
    const canvas = this.canvas().nativeElement;
    canvas.style.aspectRatio = `${rig.width} / ${rig.height}`;
    const gl = canvas.getContext('webgl', {
      premultipliedAlpha: true,
      alpha: true,
      antialias: true,
    });
    if (!gl) {
      // WebGL yoksa düz resim göster
      canvas.replaceWith(Object.assign(img, { style: 'height:100%;display:block' }));
      return;
    }
    this.gl = gl;
    this.prog = this.program(gl);
    gl.useProgram(this.prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(this.prog, 'a_pos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    for (const n of [
      'u_size',
      'u_neck',
      'u_headFade',
      'u_mouthY',
      'u_chinY',
      'u_jawAmp',
      'u_jawX',
      'u_eye0',
      'u_eye1',
      'u_breathY',
      'u_armPivot',
      'u_armBox',
      'u_jaw',
      'u_blink',
      'u_headAngle',
      'u_nod',
      'u_breath',
      'u_arm',
      'u_tint',
      'u_rim',
    ]) {
      this.uni[n] = gl.getUniformLocation(this.prog, n);
    }
    gl.uniform2f(this.uni['u_size'], rig.width, rig.height);
    gl.uniform2f(this.uni['u_neck'], ...rig.neck);
    gl.uniform2f(this.uni['u_headFade'], ...rig.headFade);
    gl.uniform1f(this.uni['u_mouthY'], rig.mouthY);
    gl.uniform1f(this.uni['u_chinY'], rig.chinY);
    gl.uniform1f(this.uni['u_jawAmp'], rig.jawAmp);
    gl.uniform2f(this.uni['u_jawX'], ...rig.jawX);
    const eye = (i: number) => rig.eyes[i] ?? [-999, -999, 1, 1];
    gl.uniform4f(this.uni['u_eye0'], ...eye(0));
    gl.uniform4f(this.uni['u_eye1'], ...eye(1));
    gl.uniform2f(this.uni['u_breathY'], ...rig.breath);
    gl.uniform2f(this.uni['u_armPivot'], ...(rig.arm?.pivot ?? [0, 0]));
    gl.uniform4f(this.uni['u_armBox'], ...(rig.arm?.box ?? [1e6, 1e6, 0, 0]));

    this.fit();
    this.resize = new ResizeObserver(() => this.fit());
    this.resize.observe(this.host.nativeElement);
    this.start = performance.now();
    this.walkStart = this.walkIn() ? this.start : -1e9;
    this.nextBlink = this.start + 1500;
    cancelAnimationFrame(this.raf);
    this.raf = requestAnimationFrame((t) => this.frame(t));
  }

  private fit() {
    const canvas = this.canvas().nativeElement;
    const rig = this.rig!;
    const h = this.host.nativeElement.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.height = Math.round(h * dpr);
    canvas.width = Math.round(((h * rig.width) / rig.height) * dpr);
    this.gl?.viewport(0, 0, canvas.width, canvas.height);
  }

  private frame(now: number) {
    const gl = this.gl;
    if (!gl) return;
    const t = (now - this.start) / 1000;
    const u = this.uni;

    // yürüyüş: uzaktan yaklaşır, her adımda hafif sekme ve yalpalama
    const WALK = 2600;
    const STEPS = 5;
    const wp = Math.min(1, (now - this.walkStart) / WALK);
    const ease = 1 - Math.pow(1 - wp, 2.2);
    const phase = wp * STEPS;
    const stepIdx = Math.floor(phase);
    if (wp < 1 && stepIdx !== this.lastStep) {
      this.lastStep = stepIdx;
      this.step.emit();
    }
    const bob = wp < 1 ? Math.abs(Math.sin(phase * Math.PI)) * 10 * (1 - ease * 0.5) : 0;
    const sway = wp < 1 ? Math.sin(phase * Math.PI) * 1.4 * (stepIdx % 2 ? 1 : -1) : 0;
    const scale = 0.58 + 0.42 * ease;
    const x = (1 - ease) * 22;
    this.walker().nativeElement.style.transform = `translateX(${x}%) translateY(${-bob}px) rotate(${sway}deg) scale(${scale})`;
    this.walker().nativeElement.style.filter = wp < 1 ? `brightness(${0.7 + 0.3 * ease})` : '';

    // konuşma: hece hece açılıp kapanan çene, konuşurken baş ve el jesti
    const talking = this.talk().some(([a, b]) => now >= a && now < b);
    const syll = talking
      ? Math.max(0, Math.sin(t * 13.5) * 0.6 + Math.sin(t * 5.1 + 1.3) * 0.5 + 0.15)
      : 0;
    this.jaw += (Math.min(1, syll) - this.jaw) * 0.35;
    this.gesture += ((talking ? 1 : 0) - this.gesture) * 0.04;

    // göz kırpma
    let blink = 0;
    if (now > this.nextBlink) {
      const bt = (now - this.nextBlink) / 150;
      blink = bt < 1 ? 1 - Math.abs(bt * 2 - 1) : 0;
      if (bt >= 1) this.nextBlink = now + 2200 + Math.random() * 3500;
    }

    gl.uniform1f(u['u_jaw'], this.jaw);
    gl.uniform1f(u['u_blink'], blink);
    gl.uniform1f(
      u['u_headAngle'],
      0.012 * Math.sin(t * 0.7) + this.gesture * 0.018 * Math.sin(t * 2.3),
    );
    gl.uniform1f(u['u_nod'], this.gesture * 2.2 * Math.sin(t * 4.1));
    gl.uniform1f(u['u_breath'], 0.5 + 0.5 * Math.sin((t * Math.PI * 2) / 4.2));
    gl.uniform1f(
      u['u_arm'],
      0.012 * Math.sin(t * 0.9) + this.gesture * (0.035 + 0.025 * Math.sin(t * 1.7)),
    );
    gl.uniform3f(u['u_tint'], ...this.tint());
    gl.uniform3f(u['u_rim'], ...this.rim());

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    this.raf = requestAnimationFrame((n) => this.frame(n));
  }

  private program(gl: WebGLRenderingContext): WebGLProgram {
    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s));
      return s;
    };
    const p = gl.createProgram()!;
    gl.attachShader(p, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(p, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) console.error(gl.getProgramInfoLog(p));
    return p;
  }
}
