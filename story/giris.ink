// ============================================================
//  KONSTANTİNİYYE: KANUNİ'NİN YÜZYILI
//  Giriş Bölümü — Cülus (Eylül–Kasım 1520)
//
//  Etiket sözleşmesi (UI bunları okur):
//    # chapter: <başlık>      bölüm başlığı
//    # date: <tarih>          sahne tarihi
//    # scene: <id>            arka plan (bkz. src/app/data/scenes.ts)
//    # pov: <karakter-id>     bakış açısı değişimi
//    # speaker: <karakter-id> bu satırı kim söylüyor
//    # thought                iç ses (italik)
//    # end_chapter            bölüm sonu ekranı
//
//  Envanter değişkenlerle tutulur:
//    f_*  fısıltılar   (src/app/data/whispers.ts)
//    l_*  mektuplar    (src/app/data/letters.ts)
// ============================================================

CONST KALFA = "Nazende"

// --- Devlet göstergeleri (0–100) ---
VAR hazine = 50
VAR yeniceri = 50
VAR divan = 50
VAR harem = 50
VAR halk = 50

// --- İlişkiler (−100…100) ---
VAR rel_hafsa = 0
VAR rel_ibrahim = 0
VAR rel_piri = 0
VAR rel_suleyman = 0

// --- Fısıltılar ---
VAR f_selim_oldu = false
VAR f_yeniceri_bahsis = false
VAR f_ipek_yasagi = false
VAR f_yemen_kahve = false
VAR f_karl_tac = false
VAR f_canberdi = false

// --- Mektuplar ---
VAR l_piri_haber = false
VAR l_leonardo = false
VAR l_venedik_tebrik = false
VAR l_macar_name = false

// --- Kalıcı kararlar (sonraki bölümler okur) ---
VAR leonardo_kimde = "yok"     // yok | kalfa | hazinedar | ibrahim
VAR kopru_projesi = false
VAR macar_tutum = "yok"        // harac | baris
VAR adalet_unu = 0

-> gece_haberi

=== function degis(ref v, d) ===
~ v = v + d
{ v > 100:
    ~ v = 100
}
{ v < 0:
    ~ v = 0
}

// ------------------------------------------------------------
=== gece_haberi ===
# chapter: Giriş · Cülus
# date: 23 Eylül 1520 · gece
# scene: eski-saray-gece
# pov: nazende
Eski Saray'da gece, mumların kokusuyla iner. Hamamın külhanı çoktan sönmüş, koğuşlarda kızlar uyumuş. Ben, {KALFA}, Hafsa Hatun'un kapısında nöbetteyim.
Avluda at sesi. Bu saatte gelen atlı, ya düğün haberi getirir ya ölüm.
Bir hadım ağası, mührü kırılmamış bir mektubu iki eliyle uzatıyor. Mühürde sadrazam Piri Mehmed Paşa'nın adı var.
Hafsa Hatun okuyor. Sonra mumu kendi eliyle söndürüyor.
"Kimse duymayacak, {KALFA}. Ne koğuşlar, ne çarşı, ne kendi gölgen." # speaker: hafsa
~ l_piri_haber = true
Elinden düşen mektubu yerden alırken bir satır gözüme çarpıyor: Sultan Selim, Sırt köyünde, sefer yolunda…
"Hünkâr… göçtü mü, Hatun'um?" diye soracak oluyorum. Dilimi ısırıyorum. # thought

* [Sessizce mektubu katlayıp Hatun'a uzat]
    Mektubu katlayıp iki elimle geri veriyorum. Gözlerimi yerden kaldırmıyorum.
    "İyi. Sen sır tutmayı bilirsin." # speaker: hafsa
    ~ rel_hafsa += 10
    ~ f_selim_oldu = true
* ["Manisa'ya haber gitti mi Hatun'um?" diye fısılda]
    Hatun bana uzun uzun bakıyor. Bir an kızacak sanıyorum.
    "Gitti. Oğlum yolda. Sekiz gün, {KALFA}. Sekiz gün bu saray nefesini tutacak." # speaker: hafsa
    "O güne kadar yeniçeri duyarsa, kazan kaldırır. Anladın mı?" # speaker: hafsa
    ~ rel_hafsa += 5
    ~ f_selim_oldu = true
    ~ f_yeniceri_bahsis = true
* [Koğuştaki usta kalfaya koşup haber ver]
    Sabaha karşı usta kalfanın kulağına eğiliyorum. O da bir başkasının kulağına…
    Öğleye kadar Eski Saray'ın yarısı ağlıyor, yarısı fısıldıyor. Hafsa Hatun beni çağırtmıyor bile. Bu, öfkesinden de beter.
    ~ rel_hafsa -= 20
    ~ degis(harem, -10)
    ~ f_selim_oldu = true
- -> carsi

// ------------------------------------------------------------
=== carsi ===
# date: 24 Eylül 1520 · sabah
# scene: bedesten
Sabah Hatun beni çarşıya gönderiyor. Görünürde yas için siyah çuha, gizlide başka bir şey için: tahta çıkacak bir şehzadeye yakışır kaftanlık kumaş.
Eski Saray'dan Bedesten'e üç yüz adım. Ama bu üç yüz adım, iki ayrı dünya.
Cevahir Bedesteni'nin kubbeleri altında Rum kumaşçılar, Yahudi attarlar, Venedikli tüccarlar, Acem ipekçiler… Öğle ezanına kadar vaktim var. Herkesle konuşamam.
-> carsi_secim

= carsi_secim
{ kumasci + ipekci + dervis + venedik >= 2: -> carsi_bitti }
* (kumasci) [Rum kumaşçı Yorgi'nin dükkânına gir]
    Yorgi Usta çuhayı açarken sesini alçaltıyor.
    "Kışlada bir hava var, kızım. Ocak ağaları cülus bahşişini şimdiden konuşuyor. Padişah değişir, bahşiş değişmez. Geç kalırsa, kazanlar ters döner." # speaker: yorgi
    ~ f_yeniceri_bahsis = true
    -> carsi_secim
* (ipekci) [Acem ipekçi Mirza'nın boş tezgâhına bak]
    Mirza'nın tezgâhında tek top ipek yok.
    "Merhum hünkâr… yani Sultan Selim, Tebriz ipeğini yasakladı, hanım. Mallarımıza el kondu. Yeni padişah adil biriyse, bizim için de bir kapı açılır belki." # speaker: mirza
    Ağzından kaçan "merhum" sözünü duymazdan geliyorum. Demek haber çarşıya da sızmış. # thought
    ~ f_ipek_yasagi = true
    -> carsi_secim
* (dervis) [Köşede kara bir içecek içen Yemenli dervişe yaklaş]
    Derviş bana bakır bir fincan uzatıyor. İçinde kapkara, acı, köz kokan bir şey.
    "Kahve derler buna. Gece zikrinde uykuyu kovar." # speaker: dervis
    Bir yudum alıyorum. Kalbim at gibi koşuyor. Bu şehirde bunu içen kaç kişi vardır, bilmem. Ama bir gün herkes içer gibi geliyor bana. # thought
    ~ f_yemen_kahve = true
    -> carsi_secim
* (venedik) [Venedikli tüccar Marco'nun söylediklerine kulak ver]
    Marco, balyosun adamlarından. Türkçesi bozuk ama kulağı keskin.
    "Avrupa'da da taht değişiyor, signora. Habsburg Karl, İspanya'nın da kralı, şimdi bir de Roma imparatoru olacak. Aachen'de taç giymesi yakın. Bir adam, yarım dünya." # speaker: marco
    ~ f_karl_tac = true
    -> carsi_secim
* -> carsi_bitti

= carsi_bitti
Öğle ezanı okunuyor. Kumaşları sırtlayıp Eski Saray'a dönüyorum. Kulağımda topladıklarım, kumaştan ağır.
-> arsiv

// ------------------------------------------------------------
=== arsiv ===
# date: 27 Eylül 1520
# scene: hazine
Hatun beni hazinedar ağayla birlikte Yeni Saray'ın hazine odasına yolluyor. Cülusta giyilecek kaftanlar orada, sandıklarda bekliyor.
Sandıkları açarken altta bir başka sandık görüyorum: merhum Sultan Bayezid'in, yeni padişahın dedesinin kâğıtları. Yarısı Rumca, yarısı Frenkçe.
Bir kâğıt elime takılıyor. Kenarında mürekkeple çizilmiş bir köprü. Tek bir kemer, sudan göğe kalkan bir yay gibi. Altından yelkenli bir gemi geçiyor.
Ne yazdığını okuyamıyorum. Ama sonunda bir imza var: "Leonardo".
~ l_leonardo = true
Hazinedar ağa öbür uçta kaftanları sayıyor. Beni görmüyor. # thought

* [Mektubu koynuna sakla]
    Kâğıdı dört katlayıp koynuma sokuyorum. Kalbim, Yemenli dervişin kahvesini içmişim gibi çarpıyor.
    ~ leonardo_kimde = "kalfa"
* [Hazinedar ağaya göster]
    "Ağam, bu ne ola?" # speaker: nazende
    Ağa kâğıda şöyle bir bakıyor.
    "Frenk işi. Bayezid Han zamanında nice Frenk mektup yollardı. Defterine yazarım, sandığına koyarım." # speaker: hazinedar
    Kâğıt sandığa geri dönüyor. Belki bir yüzyıl daha uyuyacak. # thought
    ~ leonardo_kimde = "hazinedar"
    ~ rel_hafsa += 5
* [Şehzadenin adamı İbrahim'e götürmeye karar ver. Frenkçe bildiği söylenir]
    İbrahim'i Manisa'dan tanıyan olmaz bu sarayda. Ama herkes bir şey bilir: Pargalıdır, Rumca, Frenkçe, Acemce konuşur, şehzadenin gölgesidir.
    Kâğıdı koynuma saklıyorum. Cülustan sonra, fırsatını bulursam… # thought
    ~ leonardo_kimde = "ibrahim"
- -> culus

// ------------------------------------------------------------
=== culus ===
# chapter: Giriş · Cülus
# date: 30 Eylül 1520
# scene: babussaade
# pov: suleyman
Babüssaade'nin önündeyim. Manisa'dan sekiz günde geldim. Atımın teri hâlâ üzerimde.
Yirmi altı yaşındayım. Babam Selim, ardında Mısır'ı, Şam'ı, Hicaz'ı ve korkuyu bıraktı. Bana düşen, bu korkuyu adalete çevirmek. # thought
Vezirler sırayla eteğimi öpüyor. En önde Piri Mehmed Paşa. Babamın ölümünü sekiz gün saklayan adam.
"Devletli hünkârım. Ordunuz, hazineniz, kalemleriniz emrinizde." # speaker: piri
Arkada, İbrahim duruyor. Gözleriyle bana bir şey söylüyor. Her zamanki gibi. # thought
-> bahsis

= bahsis
Kubbealtı'ndan yeniçeri ağasının haberi geliyor: Ocak, cülus bahşişini bekliyor.
{ f_yeniceri_bahsis:
    Annemin kalfasından, çarşıdan, kışladan aynı söz kulağıma ulaştı: Bahşiş gecikirse kazan kalkar. # thought
}
* [Bahşişi tam ve hemen dağıt]
    Hazineden akçeler sandık sandık çıkıyor. Ocak "Padişahım çok yaşa!" diye bağırıyor. Hazinedar sararıyor.
    ~ degis(yeniceri, 15)
    ~ degis(hazine, -15)
* [Bahşişi azalt. Babamın seferleri hazineyi yordu]
    Ocak susuyor. Bu susuş, bağırıştan daha tehlikeli.
    ~ degis(yeniceri, -20)
    ~ degis(hazine, 5)
* { f_yeniceri_bahsis } [Ocak ağalarını önceden çağır, bahşişi taksitle ve onurla ver]
    Ağaları tek tek huzuruma alıyorum. Kimine kaftan, kimine söz. Bahşiş üç parti dağıtılacak.
    Kimse ilk günden bir padişaha hayır diyemez. Hele adını bilen, derdini bilen bir padişaha. # thought
    ~ degis(yeniceri, 10)
    ~ degis(hazine, -5)
    ~ degis(divan, 5)
- -> adalet

= adalet
Piri Paşa iki defter açıyor.
"Hünkârım, babanızın zamanından kalma iki iş var. Tebriz'den, Kahire'den getirilen zanaatkârlar memleketlerine dönmek ister. Bir de Acem tüccarların el konan ipekleri." # speaker: piri
{ f_ipek_yasagi:
    Annemin kalfası, çarşıda Acem ipekçilerin boş tezgâhlarını anlatmış. # thought
}
* [İkisinde de adaleti seç: zanaatkârlar dönsün, ipekler sahiplerine iade edilsin]
    Ferman yazılıyor. Çarşıda Mirza gibi adamlar ilk kez yeni padişahın adını duaya katıyor.
    ~ degis(halk, 15)
    ~ degis(hazine, -10)
    ~ adalet_unu += 2
* [Zanaatkârlar dönsün ama ipek yasağı sürsün]
    Kahire'ye dönen ustalar adımı övüyor. Tebriz'den gelen kervanlar ise sınırda bekliyor.
    ~ degis(halk, 5)
    ~ adalet_unu += 1
* [Babamın kararlarına dokunma]
    "Babamın mührünü bozan, kendi mührünü de bozdurur." # speaker: suleyman
    Piri Paşa defteri kapatıyor. Yüzünde bir şey okunmuyor.
    ~ degis(hazine, 10)
    ~ degis(halk, -10)
- -> vezir

= vezir
Akşam, has odada yalnızız. İbrahim kemanını akort ediyor, ben pencereden Haliç'e bakıyorum.
"Piri Paşa yaşlı, hünkârım. Babanızın adamı. Sizin vezirleriniz, sizin seçtikleriniz olmalı." # speaker: ibrahim
* [Piri Paşa yerinde kalsın. Tecrübe, bu ilk yılda altından değerli]
    "Acele etmeyeceğiz, İbrahim. Ağaç önce kök salar."
    İbrahim gülümsüyor ama gözlerinde bir gölge var. # thought
    ~ degis(divan, 10)
    ~ rel_piri += 10
    ~ rel_ibrahim -= 5
* [İbrahim'i has odabaşı yap, Divan'da yanımda dursun]
    "Sen benim gözüm, kulağım olacaksın. Divan'da her söz sana da söylenecek."
    Paşalar bunu duyunca birbirine bakacak. Bakışsınlar. # thought
    ~ rel_ibrahim += 15
    ~ degis(divan, -10)
- -> leonardo_sahne

// ------------------------------------------------------------
=== leonardo_sahne ===
{ leonardo_kimde == "ibrahim": -> ibrahim_okur }
{ leonardo_kimde == "kalfa": -> kalfa_saklar }
-> yabancilar

= ibrahim_okur
# date: 5 Ekim 1520
# scene: has-oda
Ertesi hafta İbrahim elinde sararmış bir kâğıtla geliyor.
"Annenizin kalfası verdi, hünkârım. Hazinede, dedeniz Bayezid Han'ın sandığından çıkmış. İtalyanca." # speaker: ibrahim
Okuyor. Floransalı bir ressam ve mühendis, dedeme bir köprü teklif etmiş: Galata'dan İstanbul'a, Haliç'in üstünden tek kemer. O kadar yüksek ki, altından yelkenli gemiler geçecekmiş.
Bir de rüzgârla dönen değirmenler, gemilerin suyunu boşaltan düzenekler…
"Leonardo da Vinci. Duyduğuma göre geçen bahar Fransa'da öldü, hünkârım. Kral François'nın yanında." # speaker: ibrahim
~ rel_ibrahim += 10
* [Mimarlarımız bu çizimi incelesin. Belki bir gün bu köprüyü biz kurarız]
    "Dedem bu adama inanmamış. Ben belki inanırım."
    Kâğıdı mühürlü bir mahfazaya koyduruyorum.
    Bu kâğıdın bir gün bir mimarın eline geçeceğini bilmiyorum. Ama umuyorum. # thought
    ~ kopru_projesi = true
    ~ degis(hazine, -5)
* [Hayal. Arşive geri koy]
    "Haliç'in üstüne kemer… Allah'ın suyu üstüne insan inadı."
    İbrahim kâğıdı katlıyor. Bir şey söylemiyor.
    ~ rel_ibrahim -= 5
- -> yabancilar

= kalfa_saklar
# date: 5 Ekim 1520
# scene: eski-saray-gece
# pov: nazende
Leonardo'nun kâğıdı hâlâ koynumda. Geceleri mumun ışığında köprünün çizgisine bakıyorum.
Okuyamadığım bir dilde, okuyamadığım bir hayal. Ama ben bu saraydan çok şey okumayı öğrendim. Bir gün bunu da okuyacak birini bulacağım. # thought
-> yabancilar

// ------------------------------------------------------------
=== yabancilar ===
# date: Ekim 1520
# scene: divan
# pov: suleyman
Kubbealtı'nda elçilik kâğıtları birikiyor. Dünya, yeni padişahı tartıyor.
Venedik balyosu, Venedik Doçu'nun tebrik mektubunu getiriyor. Mühür altın, sözler bal.
~ l_venedik_tebrik = true
{ f_karl_tac:
    Balyosun adamlarından biri, çarşıda Habsburg Karl'ın taç giymek üzere olduğunu söylemiş. Venedik tatlı konuşuyor çünkü korkuyor. # thought
}
Sonra Macaristan meselesi. Babam zamanında yapılan barışın süresi doldu. Kral Lajos genç ve Habsburglara yakın.
"Hünkârım, Budin'e bir çavuş gönderelim. Haraç ve itaat isteyelim. Cevabına göre sefer düşünürüz." # speaker: piri
* [Haraç iste. Behram Çavuş'u Budin'e gönder]
    Name yazılıyor. Tuğram çekiliyor. Behram Çavuş yola çıkıyor.
    Bu mektubun cevabı mürekkeple mi gelir, kılıçla mı, yakında göreceğim. # thought
    ~ macar_tutum = "harac"
    ~ degis(yeniceri, 5)
* [Barış ve ticaret teklif et. Önce içeride düzen]
    Name yumuşak bir dille yazılıyor. Divan'daki eski kurtlar dudak büküyor.
    ~ macar_tutum = "baris"
    ~ degis(divan, -5)
    ~ degis(halk, 5)
- ~ l_macar_name = true
-> sam_haberi

// ------------------------------------------------------------
=== sam_haberi ===
# date: Kasım 1520
# scene: babussaade
Kasım'ın ilk soğuğu. Ulak, Şam'dan çamur içinde geliyor.
"Hünkârım… Şam beylerbeyi Canberdi Gazali, kendini sultan ilan etti. Babanızın ölümünü fırsat bildi." # speaker: ulak
~ f_canberdi = true
Taht, ilk sınavını veriyor. # thought
{ yeniceri < 40:
    Ve ordunun kalbi, bahşiş meselesinden beri soğuk. # thought
}
{ halk >= 60:
    Ama çarşı, adımı duaya katıyor. Bu, kılıçtan az şey değil. # thought
}
{ kopru_projesi:
    Has odanın rafında, mühürlü bir mahfazada Floransalının köprüsü bekliyor. # thought
}
-> giris_son

=== giris_son ===
# end_chapter
Giriş bölümü sona erdi. Sıradaki bölüm: Belgrad, 1521.
-> END
