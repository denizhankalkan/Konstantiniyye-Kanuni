/**
 * Karakterlerin görünüşü: portre ve sahne figürleri bu tanımlardan çizilir.
 * Gerçek portre geldiğinde public/art/portraits/<id>.webp eklenip art-manifest.ts'e yazılır.
 */
export type Headgear =
  | 'sultan' // büyük yuvarlak kavuk, sorguç
  | 'kallavi' // vezir kavuğu, uzun
  | 'sarik' // sade sarık
  | 'hotoz' // valide başlığı, duvak
  | 'kalfa' // küçük fes, yemeni
  | 'rum' // yuvarlak koyu başlık
  | 'kizilbas' // Safevi tacı
  | 'venedik' // kırmızı bere
  | 'doc' // Venedik doçunun boynuzlu başlığı
  | 'sikke' // derviş külahı
  | 'ulak' // keçe börk
  | 'tac' // Avrupa tacı
  | 'ressam' // koyu bere
  | 'memluk'; // boynuzlu Memlük sarığı

export type Beard = 'none' | 'mustache' | 'short' | 'full' | 'long';

export interface Look {
  skin: string;
  hair: string;
  robe: string;
  trim: string;
  headgear: Headgear;
  beard: Beard;
  /** başlık ana rengi (beyaz sarık vb.) */
  cloth?: string;
}

const SKIN = { light: '#e9c6a1', mid: '#d8ad84', olive: '#c99b70', deep: '#a8774f' };

export const LOOKS: Record<string, Look> = {
  nazende: {
    skin: SKIN.light,
    hair: '#3a2416',
    robe: '#7a2e5a',
    trim: '#e8c36a',
    headgear: 'kalfa',
    beard: 'none',
    cloth: '#f1e4d0',
  },
  hafsa: {
    skin: SKIN.light,
    hair: '#4a3020',
    robe: '#3c2a5e',
    trim: '#e8c36a',
    headgear: 'hotoz',
    beard: 'none',
    cloth: '#f7efe2',
  },
  suleyman: {
    skin: SKIN.mid,
    hair: '#3b2a1c',
    robe: '#8c1c13',
    trim: '#e8c36a',
    headgear: 'sultan',
    beard: 'mustache',
    cloth: '#fbf8f0',
  },
  ibrahim: {
    skin: SKIN.olive,
    hair: '#2a1d14',
    robe: '#1f3b73',
    trim: '#e8c36a',
    headgear: 'sarik',
    beard: 'short',
    cloth: '#f4efe4',
  },
  piri: {
    skin: SKIN.mid,
    hair: '#b9b3a6',
    robe: '#2f4a46',
    trim: '#d4a22e',
    headgear: 'kallavi',
    beard: 'long',
    cloth: '#fbf8f0',
  },
  hazinedar: {
    skin: SKIN.mid,
    hair: '#7d7468',
    robe: '#5b4630',
    trim: '#d4a22e',
    headgear: 'sarik',
    beard: 'none',
    cloth: '#efe6d4',
  },
  yorgi: {
    skin: SKIN.olive,
    hair: '#2b2018',
    robe: '#3e5a3a',
    trim: '#c9b27a',
    headgear: 'rum',
    beard: 'full',
  },
  mirza: {
    skin: SKIN.olive,
    hair: '#1e1610',
    robe: '#2a7f7a',
    trim: '#e8c36a',
    headgear: 'kizilbas',
    beard: 'full',
    cloth: '#f4efe4',
  },
  marco: {
    skin: SKIN.light,
    hair: '#6b4a2b',
    robe: '#3a2a4a',
    trim: '#c9a85a',
    headgear: 'venedik',
    beard: 'none',
  },
  dervis: {
    skin: SKIN.deep,
    hair: '#1e1610',
    robe: '#6e5a3e',
    trim: '#a89070',
    headgear: 'sikke',
    beard: 'full',
  },
  ulak: {
    skin: SKIN.deep,
    hair: '#2b2018',
    robe: '#5a4a32',
    trim: '#8a7458',
    headgear: 'ulak',
    beard: 'short',
  },
  leonardo: {
    skin: SKIN.light,
    hair: '#e7e2d8',
    robe: '#5a3a2a',
    trim: '#a8865a',
    headgear: 'ressam',
    beard: 'long',
  },
  karl: {
    skin: SKIN.light,
    hair: '#6b4a2b',
    robe: '#1d1d1d',
    trim: '#d4a22e',
    headgear: 'tac',
    beard: 'none',
  },
  lajos: {
    skin: SKIN.light,
    hair: '#8a6a3a',
    robe: '#7a1a2a',
    trim: '#d4a22e',
    headgear: 'tac',
    beard: 'none',
  },
  loredan: {
    skin: SKIN.light,
    hair: '#d9d4c9',
    robe: '#c9a85a',
    trim: '#f3e9d2',
    headgear: 'doc',
    beard: 'short',
  },
  canberdi: {
    skin: SKIN.deep,
    hair: '#1e1610',
    robe: '#6b2a1a',
    trim: '#d4a22e',
    headgear: 'memluk',
    beard: 'full',
    cloth: '#f4efe4',
  },
};

export const DEFAULT_LOOK: Look = {
  skin: SKIN.mid,
  hair: '#2b2018',
  robe: '#5b4630',
  trim: '#d4a22e',
  headgear: 'sarik',
  beard: 'short',
  cloth: '#efe6d4',
};
