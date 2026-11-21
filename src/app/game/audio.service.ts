import { Injectable, signal } from '@angular/core';

export type AmbienceId =
  'gece' | 'kogus' | 'carsi' | 'hazine' | 'avlu' | 'bahce' | 'hasoda' | 'divan';

interface Layer {
  stop(): void;
}

const MUTE_KEY = 'konstantiniyye.muted';

/** Hicaz makamı (dügah = Re): Re Mi♭ Fa♯ Sol La Si♭ Do Re (yarım ses aralıkları). */
const HICAZ = [0, 1, 4, 5, 7, 8, 10, 12, 13, 16, 17];
const DUGAH = 293.66;

/** Sahnede ney çalsın mı? Çarşıda ve avluda kalabalık ile mehter var. */
const MUSIC: Record<AmbienceId, boolean> = {
  gece: true,
  kogus: true,
  carsi: false,
  hazine: true,
  avlu: false,
  bahce: true,
  hasoda: true,
  divan: false,
};

/**
 * Tamamen kodla üretilen ses: ortam katmanları (rüzgâr, cırcır böceği, kalabalık, fıskiye, mehter davulu…)
 * ve Hicaz makamında doğaçlama bir ney. Dosya gerekmez; gerçek kayıtlar gelince katmanlar değiştirilebilir.
 * Tarayıcılar sesi ancak bir dokunuştan sonra başlatır: unlock() bir tıklama içinden çağrılmalı.
 */
@Injectable({ providedIn: 'root' })
export class AudioService {
  readonly muted = signal(readMuted());

  private ctx?: AudioContext;
  private master?: GainNode;
  private ambBus?: GainNode;
  private musicBus?: GainNode;
  private reverb?: ConvolverNode;
  private noise?: { white: AudioBuffer; pink: AudioBuffer; brown: AudioBuffer };
  private layer?: Layer;
  private current?: AmbienceId;
  private musicTimer?: ReturnType<typeof setTimeout>;
  private musicOn = false;

  unlock(): void {
    if (!this.ctx) {
      const Ctx =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return;
      this.ctx = new Ctx();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted() ? 0 : 0.9;
      this.master.connect(this.ctx.destination);
      this.reverb = this.ctx.createConvolver();
      this.reverb.buffer = this.impulse(3.2);
      const wet = this.ctx.createGain();
      wet.gain.value = 0.5;
      this.reverb.connect(wet).connect(this.master);
      this.ambBus = this.ctx.createGain();
      this.ambBus.gain.value = 0.55;
      this.ambBus.connect(this.master);
      this.musicBus = this.ctx.createGain();
      this.musicBus.gain.value = 0.32;
      this.musicBus.connect(this.master);
      this.musicBus.connect(this.reverb);
      this.noise = {
        white: this.noiseBuffer('white'),
        pink: this.noiseBuffer('pink'),
        brown: this.noiseBuffer('brown'),
      };
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) void this.ctx?.suspend();
        else void this.ctx?.resume();
      });
      if (this.current) {
        const id = this.current;
        this.current = undefined;
        this.setAmbience(id);
      }
    }
    void this.ctx.resume();
  }

  toggleMute(): void {
    this.muted.update((m) => !m);
    try {
      localStorage.setItem(MUTE_KEY, this.muted() ? '1' : '0');
    } catch {
      /* yoksay */
    }
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(this.muted() ? 0 : 0.9, this.ctx.currentTime, 0.2);
    }
  }

  setAmbience(id: AmbienceId): void {
    if (id === this.current) return;
    this.current = id;
    if (!this.ctx) return;
    this.layer?.stop();
    this.layer = this.build(id);
    this.setMusic(MUSIC[id]);
  }

  /** Mühür kırılma, kâğıt hışırtısı gibi tek seferlik sesler */
  sfx(kind: 'seal' | 'choice' | 'page'): void {
    if (!this.ctx || !this.master) return;
    const t = this.ctx.currentTime;
    if (kind === 'seal') {
      this.burst(this.master, 'white', t, 0.12, 1800, 0.6, 2);
      this.tone(this.master, 140, t, 0.25, 0.25, 'triangle', 70);
    } else if (kind === 'page') {
      this.burst(this.master, 'pink', t, 0.35, 3000, 0.15, 0.8);
    } else {
      this.tone(this.master, 880, t, 0.5, 0.05, 'sine');
      this.tone(this.master, 1320, t + 0.02, 0.4, 0.025, 'sine');
    }
  }

  // ---------------------------------------------------------------- ortam

  private build(id: AmbienceId): Layer {
    const ctx = this.ctx!;
    const out = ctx.createGain();
    out.gain.value = 0;
    out.gain.setTargetAtTime(1, ctx.currentTime, 0.8);
    out.connect(this.ambBus!);
    out.connect(this.reverb!);
    const stops: (() => void)[] = [];
    const every = (min: number, max: number, fn: () => void) => {
      let timer: ReturnType<typeof setTimeout>;
      const loop = () => {
        fn();
        timer = setTimeout(loop, min + Math.random() * (max - min));
      };
      timer = setTimeout(loop, Math.random() * min);
      stops.push(() => clearTimeout(timer));
    };
    const bed = (
      kind: 'white' | 'pink' | 'brown',
      type: BiquadFilterType,
      freq: number,
      gain: number,
      q = 0.7,
      lfo = 0,
    ) => {
      const src = ctx.createBufferSource();
      src.buffer = this.noise![kind];
      src.loop = true;
      const f = ctx.createBiquadFilter();
      f.type = type;
      f.frequency.value = freq;
      f.Q.value = q;
      const g = ctx.createGain();
      g.gain.value = gain;
      src.connect(f).connect(g).connect(out);
      if (lfo) {
        const o = ctx.createOscillator();
        const d = ctx.createGain();
        o.frequency.value = lfo;
        d.gain.value = gain * 0.6;
        o.connect(d).connect(g.gain);
        o.start();
        stops.push(() => o.stop());
      }
      src.start(0, Math.random() * 3);
      stops.push(() => src.stop());
    };
    const t = () => ctx.currentTime;

    switch (id) {
      case 'gece':
        bed('brown', 'lowpass', 380, 0.09, 0.7, 0.07);
        every(900, 2600, () => this.crickets(out, t(), 4300 + Math.random() * 400));
        every(400, 1800, () => this.crackle(out, t()));
        break;
      case 'kogus':
        bed('pink', 'lowpass', 600, 0.03);
        every(1200, 4000, () => this.bird(out, t()));
        every(3000, 8000, () => this.burst(out, 'pink', t(), 0.5, 2500, 0.03, 0.8));
        break;
      case 'carsi':
        bed('pink', 'bandpass', 520, 0.18, 0.9, 0.13);
        bed('pink', 'bandpass', 1150, 0.07, 1.4, 0.21);
        every(700, 2400, () => this.clink(out, t()));
        every(2500, 6000, () => this.hammer(out, t()));
        break;
      case 'hazine':
        this.hum(out, 55, 0.04, stops);
        bed('brown', 'lowpass', 220, 0.06);
        every(2500, 7000, () => this.clink(out, t(), 0.06));
        every(1200, 3000, () => this.crackle(out, t()));
        break;
      case 'avlu':
        bed('brown', 'bandpass', 500, 0.08, 0.6, 0.05);
        every(1500, 5000, () => this.bird(out, t()));
        every(9000, 9001, () => this.mehter(out, t()));
        break;
      case 'bahce':
        bed('white', 'bandpass', 3200, 0.05, 0.6, 3.1);
        bed('brown', 'lowpass', 300, 0.05, 0.7, 0.05);
        every(1100, 3200, () => this.crickets(out, t(), 3900));
        every(2500, 6000, () => this.bird(out, t(), 0.5));
        break;
      case 'hasoda':
        bed('brown', 'lowpass', 260, 0.06, 0.7, 0.12);
        every(350, 1400, () => this.crackle(out, t()));
        break;
      case 'divan':
        bed('pink', 'bandpass', 400, 0.06, 0.8, 0.08);
        every(2000, 5000, () => this.burst(out, 'pink', t(), 0.3, 3200, 0.05, 1));
        every(4000, 9000, () => this.clink(out, t(), 0.03));
        break;
    }

    return {
      stop: () => {
        out.gain.setTargetAtTime(0, ctx.currentTime, 0.6);
        stops.forEach((s) => setTimeout(s, 2500));
        setTimeout(() => out.disconnect(), 2600);
      },
    };
  }

  private crickets(dest: AudioNode, at: number, freq: number) {
    const ctx = this.ctx!;
    const n = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < n; i++) {
      const s = at + i * 0.09;
      const o = ctx.createOscillator();
      o.frequency.value = freq;
      const am = ctx.createOscillator();
      am.frequency.value = 42;
      const amg = ctx.createGain();
      amg.gain.value = 0.5;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, s);
      g.gain.linearRampToValueAtTime(0.012, s + 0.01);
      g.gain.linearRampToValueAtTime(0, s + 0.06);
      am.connect(amg).connect(g.gain);
      o.connect(g).connect(dest);
      o.start(s);
      am.start(s);
      o.stop(s + 0.08);
      am.stop(s + 0.08);
    }
  }

  private bird(dest: AudioNode, at: number, vol = 1) {
    const ctx = this.ctx!;
    const base = 2200 + Math.random() * 1600;
    const n = 1 + Math.floor(Math.random() * 3);
    for (let i = 0; i < n; i++) {
      const s = at + i * 0.16;
      const o = ctx.createOscillator();
      o.frequency.setValueAtTime(base, s);
      o.frequency.exponentialRampToValueAtTime(base * (1.3 + Math.random() * 0.4), s + 0.06);
      o.frequency.exponentialRampToValueAtTime(base * 0.9, s + 0.12);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, s);
      g.gain.linearRampToValueAtTime(0.02 * vol, s + 0.02);
      g.gain.linearRampToValueAtTime(0, s + 0.13);
      o.connect(g).connect(dest);
      o.start(s);
      o.stop(s + 0.15);
    }
  }

  private crackle(dest: AudioNode, at: number) {
    this.burst(
      dest,
      'white',
      at,
      0.015 + Math.random() * 0.02,
      2500 + Math.random() * 3000,
      0.05 + Math.random() * 0.05,
      1.5,
    );
  }

  private clink(dest: AudioNode, at: number, vol = 0.05) {
    const f = 2400 + Math.random() * 2200;
    this.tone(dest, f, at, 0.35, vol, 'triangle');
    this.tone(dest, f * 1.51, at, 0.25, vol * 0.5, 'sine');
  }

  private hammer(dest: AudioNode, at: number) {
    for (let i = 0; i < 3; i++) {
      this.tone(dest, 1250, at + i * 0.32, 0.18, 0.03, 'triangle');
      this.burst(dest, 'white', at + i * 0.32, 0.02, 1800, 0.04, 1);
    }
  }

  /** Mehter davulu: ağır, iki vuruşlu bir usul */
  private mehter(dest: AudioNode, at: number) {
    const beats = [0, 0.75, 1.5, 2.6, 3.0];
    for (const b of beats) {
      this.tone(dest, 90, at + b, 0.5, 0.22, 'sine', 42);
      this.burst(dest, 'brown', at + b, 0.12, 300, 0.12, 1);
    }
  }

  private hum(dest: AudioNode, freq: number, vol: number, stops: (() => void)[]) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    o.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.value = vol;
    o.connect(g).connect(dest);
    o.start();
    stops.push(() => o.stop());
  }

  // ---------------------------------------------------------------- ney

  private setMusic(on: boolean) {
    if (on === this.musicOn) return;
    this.musicOn = on;
    clearTimeout(this.musicTimer);
    if (on) this.musicTimer = setTimeout(() => this.phrase(), 1500);
  }

  /** Hicaz'da bir cümle: neva civarından başlar, dolaşır, dügahta karar verir. */
  private phrase() {
    if (!this.ctx || !this.musicOn) return;
    let step = 4 + Math.floor(Math.random() * 3); // Sol, La, Si♭
    let at = this.ctx.currentTime + 0.1;
    const notes = 4 + Math.floor(Math.random() * 5);
    for (let i = 0; i < notes; i++) {
      const last = i === notes - 1;
      if (last) step = Math.random() < 0.7 ? 0 : 4;
      const dur = last ? 2.6 + Math.random() * 1.4 : 0.55 + Math.random() * 1.5;
      const freq = DUGAH * Math.pow(2, HICAZ[step] / 12);
      this.ney(
        freq,
        at,
        dur,
        i > 0 && Math.random() < 0.35
          ? DUGAH * Math.pow(2, HICAZ[Math.min(step + 1, HICAZ.length - 1)] / 12)
          : 0,
      );
      at += dur * 0.92;
      const move = Math.random() < 0.6 ? -1 : 1;
      step = Math.max(0, Math.min(HICAZ.length - 1, step + move * (Math.random() < 0.8 ? 1 : 2)));
    }
    const rest = (at - this.ctx.currentTime) * 1000 + 2500 + Math.random() * 5000;
    this.musicTimer = setTimeout(() => this.phrase(), rest);
  }

  private ney(freq: number, at: number, dur: number, grace: number) {
    const ctx = this.ctx!;
    const bus = this.musicBus!;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0, at);
    env.gain.linearRampToValueAtTime(0.16, at + 0.22);
    env.gain.setTargetAtTime(0.12, at + 0.3, 0.4);
    env.gain.setTargetAtTime(0, at + dur, 0.25);
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 2200;
    env.connect(lp).connect(bus);

    const o1 = ctx.createOscillator();
    const o2 = ctx.createOscillator();
    o2.type = 'triangle';
    const g2 = ctx.createGain();
    g2.gain.value = 0.18;
    const vib = ctx.createOscillator();
    vib.frequency.value = 4.8 + Math.random();
    const vibG = ctx.createGain();
    vibG.gain.setValueAtTime(0, at);
    vibG.gain.linearRampToValueAtTime(freq * 0.006, at + Math.min(dur, 0.9));
    vib.connect(vibG);
    for (const o of [o1, o2]) {
      if (grace) {
        o.frequency.setValueAtTime(grace, at);
        o.frequency.setTargetAtTime(freq, at + 0.06, 0.04);
      } else {
        o.frequency.setValueAtTime(freq * 0.985, at);
        o.frequency.setTargetAtTime(freq, at, 0.05);
      }
      vibG.connect(o.frequency);
    }
    o1.connect(env);
    o2.connect(g2).connect(env);

    // nefes
    const br = ctx.createBufferSource();
    br.buffer = this.noise!.white;
    const bf = ctx.createBiquadFilter();
    bf.type = 'bandpass';
    bf.frequency.value = freq * 2;
    bf.Q.value = 1.5;
    const bg = ctx.createGain();
    bg.gain.setValueAtTime(0, at);
    bg.gain.linearRampToValueAtTime(0.09, at + 0.08);
    bg.gain.setTargetAtTime(0.025, at + 0.15, 0.2);
    bg.gain.setTargetAtTime(0, at + dur, 0.2);
    br.connect(bf).connect(bg).connect(lp);

    const end = at + dur + 1.5;
    for (const n of [o1, o2, vib, br]) {
      n.start(at);
      n.stop(end);
    }
  }

  // ---------------------------------------------------------------- yardımcılar

  private tone(
    dest: AudioNode,
    freq: number,
    at: number,
    dur: number,
    vol: number,
    type: OscillatorType,
    slideTo = 0,
  ) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, at);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, at + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, at);
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    o.connect(g).connect(dest);
    o.start(at);
    o.stop(at + dur + 0.05);
  }

  private burst(
    dest: AudioNode,
    kind: 'white' | 'pink' | 'brown',
    at: number,
    dur: number,
    freq: number,
    vol: number,
    q: number,
  ) {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = this.noise![kind];
    const f = ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = freq;
    f.Q.value = q;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, at);
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    src.connect(f).connect(g).connect(dest);
    src.start(at, Math.random() * 2);
    src.stop(at + dur + 0.05);
  }

  private noiseBuffer(kind: 'white' | 'pink' | 'brown'): AudioBuffer {
    const ctx = this.ctx!;
    const len = ctx.sampleRate * 4;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    let b0 = 0,
      b1 = 0,
      b2 = 0,
      last = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      if (kind === 'white') d[i] = w;
      else if (kind === 'pink') {
        b0 = 0.99765 * b0 + w * 0.099046;
        b1 = 0.963 * b1 + w * 0.2965164;
        b2 = 0.57 * b2 + w * 1.0526913;
        d[i] = (b0 + b1 + b2 + w * 0.1848) * 0.2;
      } else {
        last = (last + 0.02 * w) / 1.02;
        d[i] = last * 3.5;
      }
    }
    return buf;
  }

  private impulse(seconds: number): AudioBuffer {
    const ctx = this.ctx!;
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
    }
    return buf;
  }
}

function readMuted(): boolean {
  try {
    return localStorage.getItem(MUTE_KEY) === '1';
  } catch {
    return false;
  }
}
