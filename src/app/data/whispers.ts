export interface Whisper {
  var: string;
  title: string;
  text: string;
  source: string;
}

export const WHISPERS: Whisper[] = [
  {
    var: 'f_selim_oldu',
    title: 'Hünkâr göçtü',
    text: 'Sultan Selim, sefer yolunda, Sırt köyünde öldü. Haber ordudan saklanıyor.',
    source: 'Hafsa Hatun’un kapısında',
  },
  {
    var: 'f_yeniceri_bahsis',
    title: 'Kazanlar ters dönebilir',
    text: 'Yeniçeri ocağı cülus bahşişini bekliyor. Gecikirse kazan kaldırırlar.',
    source: 'Kışla ve çarşı',
  },
  {
    var: 'f_ipek_yasagi',
    title: 'Boş tezgâhlar',
    text: 'Sultan Selim’in Tebriz ipeği yasağı Acem tüccarları batırdı. Malları hâlâ el konmuş durumda.',
    source: 'Mirza, Bedesten',
  },
  {
    var: 'f_yemen_kahve',
    title: 'Kara içecek',
    text: 'Yemenli dervişler gece uyanık kalmak için “kahve” denen acı bir içecek içiyor. Şehirde bilen az.',
    source: 'Bedesten köşesi',
  },
  {
    var: 'f_karl_tac',
    title: 'Yarım dünya bir elde',
    text: 'Habsburg Karl, İspanya kralı. Aachen’de Roma imparatoru olarak taç giymek üzere.',
    source: 'Marco, Venedikli tüccar',
  },
  {
    var: 'f_canberdi',
    title: 'Şam’da isyan',
    text: 'Şam beylerbeyi Canberdi Gazali kendini sultan ilan etti.',
    source: 'Şam’dan gelen ulak',
  },
];
