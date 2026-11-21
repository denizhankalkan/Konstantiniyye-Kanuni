export type Faction = 'saray' | 'harem' | 'divan' | 'carsi' | 'yabanci' | 'ordu';

export interface Character {
  id: string;
  name: string;
  title: string;
  faction: Faction;
  /** true: gerçek tarihî kişi · false: oyun için yaratılmış özgün karakter */
  historical: boolean;
  bio: string;
  /** Rehberde görünmesi için gereken ink değişkeni (yoksa konuştuğu an açılır) */
  unlockVar?: string;
}

export const FACTION_LABEL: Record<Faction, string> = {
  saray: 'Saray',
  harem: 'Harem',
  divan: 'Divan',
  carsi: 'Çarşı',
  yabanci: 'Yabancı hükümdarlar',
  ordu: 'Ordu',
};

export const CHARACTERS: Character[] = [
  {
    id: 'nazende',
    name: 'Nazende',
    title: 'Kalfa, Eski Saray',
    faction: 'harem',
    historical: false,
    bio: 'Çocukken saraya gelmiş, Hafsa Hatun’un hizmetinde yetişmiş bir kalfa. Hem harem koğuşlarını hem çarşının ara sokaklarını bilir.',
  },
  {
    id: 'suleyman',
    name: 'Süleyman',
    title: 'Padişah',
    faction: 'saray',
    historical: true,
    bio: 'I. Selim’in oğlu. 30 Eylül 1520’de, yirmi altı yaşında tahta çıktı. Muhibbi mahlasıyla şiir yazar.',
  },
  {
    id: 'hafsa',
    name: 'Hafsa Hatun',
    title: 'Padişahın annesi',
    faction: 'harem',
    historical: true,
    bio: 'Süleyman’ın annesi. Oğlunun cülusuyla birlikte Osmanlı tarihinde “valide sultan” unvanını taşıyan ilk kadınlardan biri olacak.',
  },
  {
    id: 'ibrahim',
    name: 'İbrahim',
    title: 'Has odabaşı',
    faction: 'saray',
    historical: true,
    bio: 'Pargalı. Süleyman’ın Manisa’dan beri en yakın dostu. Rumca, İtalyanca ve Farsça bildiği, keman çaldığı söylenir.',
  },
  {
    id: 'piri',
    name: 'Piri Mehmed Paşa',
    title: 'Sadrazam',
    faction: 'divan',
    historical: true,
    bio: 'Yavuz Selim’in sadrazamı. Sultanın ölümünü, Süleyman İstanbul’a varana kadar ordudan gizledi.',
  },
  {
    id: 'hazinedar',
    name: 'Hazinedar Ağa',
    title: 'Hazine odası',
    faction: 'saray',
    historical: false,
    bio: 'Yeni Saray’ın hazine sandıklarını sayan yaşlı ağa. Her şeyi deftere yazar, hiçbir şeyi okumaz.',
  },
  {
    id: 'yorgi',
    name: 'Yorgi Usta',
    title: 'Rum kumaşçı, Bedesten',
    faction: 'carsi',
    historical: false,
    bio: 'Kışlanın kumaşını da o keser. Yeniçerinin nabzını, ağalardan önce bilir.',
  },
  {
    id: 'mirza',
    name: 'Mirza',
    title: 'Acem ipekçi',
    faction: 'carsi',
    historical: false,
    bio: 'Tebrizli tüccar. Sultan Selim’in ipek yasağından beri tezgâhı boş.',
  },
  {
    id: 'marco',
    name: 'Marco',
    title: 'Venedikli tüccar',
    faction: 'carsi',
    historical: false,
    bio: 'Venedik balyosunun çevresinden. Avrupa’nın dedikodusu onun kulağından geçer.',
  },
  {
    id: 'dervis',
    name: 'Yemenli derviş',
    title: 'Bedesten köşesi',
    faction: 'carsi',
    historical: false,
    bio: 'Gece zikirleri için kara ve acı bir içecek taşır: kahve.',
  },
  {
    id: 'ulak',
    name: 'Ulak',
    title: 'Şam yolundan',
    faction: 'ordu',
    historical: false,
    bio: 'Haftalarca at sürüp kötü haber getiren adam.',
  },
  {
    id: 'leonardo',
    name: 'Leonardo da Vinci',
    title: 'Floransalı ressam ve mühendis',
    faction: 'yabanci',
    historical: true,
    unlockVar: 'l_leonardo',
    bio: '1502’de Sultan II. Bayezid’e Haliç üzerine tek kemerli bir köprü teklif etti. 1519’da Fransa’da öldü.',
  },
  {
    id: 'karl',
    name: 'V. Karl',
    title: 'Habsburg, İspanya kralı',
    faction: 'yabanci',
    historical: true,
    unlockVar: 'f_karl_tac',
    bio: 'Ekim 1520’de Aachen’de taç giydi. Topraklarında güneş batmayan adam.',
  },
  {
    id: 'lajos',
    name: 'II. Lajos',
    title: 'Macaristan kralı',
    faction: 'yabanci',
    historical: true,
    unlockVar: 'l_macar_name',
    bio: 'Genç bir kral. Habsburglarla akraba, Osmanlı ile sınır komşusu.',
  },
  {
    id: 'loredan',
    name: 'Leonardo Loredan',
    title: 'Venedik Doçu',
    faction: 'yabanci',
    historical: true,
    unlockVar: 'l_venedik_tebrik',
    bio: 'Venedik Cumhuriyeti’nin yaşlı doçu. Osmanlı ile ticaret, Venedik için hayat demek.',
  },
  {
    id: 'canberdi',
    name: 'Canberdi Gazali',
    title: 'Şam beylerbeyi',
    faction: 'ordu',
    historical: true,
    unlockVar: 'f_canberdi',
    bio: 'Eski bir Memlük emiri. Selim’in ölümünü duyunca Şam’da kendini sultan ilan etti.',
  },
];

export const CHARACTER_MAP = new Map(CHARACTERS.map((c) => [c.id, c]));
