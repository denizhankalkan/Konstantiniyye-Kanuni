export interface Letter {
  /** ink değişkeni: true olduğunda mektup çekmeceye düşer */
  var: string;
  from: string;
  to: string;
  date: string;
  seal: string;
  /** Mührün rengi (CSS değişkeni) */
  sealColor: 'crimson' | 'gold' | 'lapis' | 'ink';
  body: string;
  /** Mektubun gövdesi bir değişkenin değerine göre değişiyorsa */
  variantVar?: string;
  variants?: Record<string, string>;
  note?: string;
  outgoing?: boolean;
}

export const LETTERS: Letter[] = [
  {
    var: 'l_piri_haber',
    from: 'Piri Mehmed Paşa',
    to: 'Hafsa Hatun',
    date: 'Sırt menzili, Eylül 1520',
    seal: 'P',
    sealColor: 'ink',
    body:
      'Devletlü Hatun hazretleri,\n\n' +
      'Hünkârımız Sultan Selim Han, sefer yolunda, Sırt köyünde Hakk’ın rahmetine kavuştu. ' +
      'Haber ordudan saklanmaktadır. Şehzade hazretlerine Manisa’ya ulak gitmiştir.\n\n' +
      'Şehzade İstanbul’a varıncaya dek bu sır sarayın duvarlarını aşmasın. Yeniçeri duyarsa fitne çıkar.\n\n' +
      'Bendeniz, Piri',
  },
  {
    var: 'l_leonardo',
    from: 'Floransalı Leonardo',
    to: 'Sultan II. Bayezid Han',
    date: 'Pera, 1502',
    seal: 'L',
    sealColor: 'lapis',
    body:
      'Ben, kulunuz, rüzgârla dönen ve su olmadan un öğüten değirmenler yapabilirim. ' +
      'Gemilerin içine dolan suyu ipsiz, çarksız boşaltan bir düzenek bilirim.\n\n' +
      'Duydum ki Galata’dan İstanbul’a bir köprü kurulmak istenir de, bunu yapacak usta bulunamaz. ' +
      'Ben, kulunuz, bu köprüyü yapabilirim: tek bir kemer, öyle yüksek ki altından yelkenli gemiler direk indirmeden geçebilir.\n\n' +
      'Bir de Anadolu yakasına, dilediğinde kaldırılıp indirilebilen bir köprü kurmak mümkündür.\n\n' +
      'Hünkârım bu işlere rağbet ederse, kulunuz hizmete hazırdır.',
    note:
      'Mektubun oyun için yeniden yazılmış hâlidir. Asıl mektup 1502 tarihlidir ve 1952’de Topkapı Sarayı arşivinde bulunmuştur. ' +
      'Haliç’e ilk köprü ancak 1845’te kurulacaktı.',
  },
  {
    var: 'l_venedik_tebrik',
    from: 'Leonardo Loredan, Venedik Doçu',
    to: 'Sultan Süleyman Han',
    date: 'Venedik, Ekim 1520',
    seal: 'V',
    sealColor: 'gold',
    body:
      'Şanlı ve kudretli hükümdar,\n\n' +
      'Cumhuriyetimiz, yüce babanızın vefatına derinden üzülmüş, Hazretinizin tahta çıkışını büyük sevinçle karşılamıştır.\n\n' +
      'Aramızdaki ahidnamenin ve ticaretin, Hazretinizin adaletiyle sürmesini Tanrı’dan dileriz. ' +
      'Balyosumuz, hediyelerimizle birlikte hizmetinize amadedir.',
  },
  {
    var: 'l_macar_name',
    from: 'Sultan Süleyman Han',
    to: 'II. Lajos, Macaristan kralı',
    date: 'Konstantiniyye, Ekim 1520',
    seal: 'S',
    sealColor: 'crimson',
    outgoing: true,
    body: '',
    variantVar: 'macar_tutum',
    variants: {
      harac:
        'Tahtımıza cülusumuz malumunuzdur. Babamız zamanındaki barışın süresi dolmuştur.\n\n' +
        'Çavuşumuz Behram ile haracınızı ve itaatinizi bildiresiniz. ' +
        'Bildirmezseniz, cevabımızı Budin kapısında alırsınız.',
      baris:
        'Tahtımıza cülusumuz malumunuzdur. Babamız zamanındaki barışı tazelemek dileğindeyiz.\n\n' +
        'Sınır boylarında tüccarlarımız serbestçe gidip gelsin, akınlar dursun. ' +
        'Dostluğa dostlukla, düşmanlığa kılıçla cevap veririz.',
    },
  },
];
