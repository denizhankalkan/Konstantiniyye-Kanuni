import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

const KEY = 'konstantiniyye.save.v1';

/** Kayıt: iOS/Android'de Capacitor Preferences, tarayıcıda localStorage kullanır. */
@Injectable({ providedIn: 'root' })
export class SaveService {
  async store(data: unknown): Promise<void> {
    try {
      await Preferences.set({ key: KEY, value: JSON.stringify(data) });
    } catch (e) {
      console.warn('Kayıt yazılamadı', e);
    }
  }

  async load<T>(): Promise<T | null> {
    try {
      const { value } = await Preferences.get({ key: KEY });
      return value ? (JSON.parse(value) as T) : null;
    } catch {
      return null;
    }
  }

  async clear(): Promise<void> {
    try {
      await Preferences.remove({ key: KEY });
    } catch {
      /* yoksay */
    }
  }
}
