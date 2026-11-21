import type { AmbienceId } from '../game/audio.service';

export interface Scene {
  id: string;
  name: string;
  place: string;
  ambience: AmbienceId;
  /** Sayfa kâğıdının tonu: gece sahnelerinde mum ışığı gibi sıcaklaşır */
  mood: 'day' | 'night' | 'dusk' | 'dark';
}

export const SCENES: Record<string, Scene> = {
  'eski-saray-gece': {
    id: 'eski-saray-gece',
    name: 'Eski Saray',
    place: 'Harem koridoru · gece',
    ambience: 'gece',
    mood: 'night',
  },
  'harem-kogus': {
    id: 'harem-kogus',
    name: 'Kalfalar koğuşu',
    place: 'Eski Saray · şafak',
    ambience: 'kogus',
    mood: 'day',
  },
  bedesten: {
    id: 'bedesten',
    name: 'Cevahir Bedesteni',
    place: 'Çarşı',
    ambience: 'carsi',
    mood: 'day',
  },
  hazine: {
    id: 'hazine',
    name: 'Hazine odası',
    place: 'Yeni Saray',
    ambience: 'hazine',
    mood: 'dark',
  },
  babussaade: {
    id: 'babussaade',
    name: 'Babüssaade',
    place: 'Yeni Saray · cülus',
    ambience: 'avlu',
    mood: 'day',
  },
  bahce: {
    id: 'bahce',
    name: 'Hasbahçe',
    place: 'Yeni Saray · akşam',
    ambience: 'bahce',
    mood: 'dusk',
  },
  'has-oda': {
    id: 'has-oda',
    name: 'Has oda',
    place: 'Yeni Saray · gece',
    ambience: 'hasoda',
    mood: 'night',
  },
  divan: {
    id: 'divan',
    name: 'Kubbealtı',
    place: 'Divan-ı Hümayun',
    ambience: 'divan',
    mood: 'day',
  },
};

export const DEFAULT_SCENE = SCENES['eski-saray-gece'];
