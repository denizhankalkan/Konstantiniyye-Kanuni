export interface Scene {
  id: string;
  name: string;
  place: string;
  /** gökyüzü, silüet ve vurgu renkleri */
  sky: string;
  land: string;
  accent: string;
  night?: boolean;
  motif: 'domes' | 'gate' | 'window' | 'chest' | 'bazaar' | 'kubbealti';
}

export const SCENES: Record<string, Scene> = {
  'eski-saray-gece': {
    id: 'eski-saray-gece',
    name: 'Eski Saray',
    place: 'Bayezid',
    sky: '#1c2340',
    land: '#0e1222',
    accent: '#e8c36a',
    night: true,
    motif: 'domes',
  },
  bedesten: {
    id: 'bedesten',
    name: 'Cevahir Bedesteni',
    place: 'Çarşı',
    sky: '#e9c98f',
    land: '#6b3e1f',
    accent: '#8c1c13',
    motif: 'bazaar',
  },
  hazine: {
    id: 'hazine',
    name: 'Hazine odası',
    place: 'Yeni Saray',
    sky: '#3a2a1a',
    land: '#1d140c',
    accent: '#d4a22e',
    motif: 'chest',
  },
  babussaade: {
    id: 'babussaade',
    name: 'Babüssaade',
    place: 'Yeni Saray',
    sky: '#cfd9d6',
    land: '#2f4a46',
    accent: '#8c1c13',
    motif: 'gate',
  },
  'has-oda': {
    id: 'has-oda',
    name: 'Has oda',
    place: 'Yeni Saray',
    sky: '#2b3d63',
    land: '#15203a',
    accent: '#e8c36a',
    night: true,
    motif: 'window',
  },
  divan: {
    id: 'divan',
    name: 'Kubbealtı',
    place: 'Divan-ı Hümayun',
    sky: '#d9c7a3',
    land: '#3b2b1a',
    accent: '#1f3b73',
    motif: 'kubbealti',
  },
};

export const DEFAULT_SCENE = SCENES['eski-saray-gece'];
