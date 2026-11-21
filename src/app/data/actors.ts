/**
 * Sahnede boy boy görünen, canlandırılmış karakterler.
 *
 * Tek bir şeffaf arka planlı resim, WebGL'de bölgelere ayrılıp hareket ettirilir:
 * nefes (göğüs), baş (boyun ekseninde), çene (konuşma), göz kırpma, kol (dirsek ekseninde).
 * Bütün koordinatlar resmin kendi pikselleri cinsindendir (sol üst köşe 0,0).
 *
 * Yeni karakter eklemek için: şeffaf PNG → public/art/actors/<id>.webp, sonra aşağıya ölçüleri gir.
 * Ölçüleri bulmak için resmi bir görsel düzenleyicide açıp fareyle koordinatlara bakmak yeterli.
 */
export interface ActorRig {
  src: string;
  width: number;
  height: number;
  /** Boyun dönme ekseni; baş bunun etrafında sallanır */
  neck: [number, number];
  /** Baş bölgesinin bittiği yükseklik (yumuşak geçiş başlangıcı ve bitişi) */
  headFade: [number, number];
  /** Dudakların birleştiği çizgi ve çenenin alt sınırı (y) */
  mouthY: number;
  chinY: number;
  /** Çenenin yatay sınırları (x) */
  jawX: [number, number];
  /** Çene en fazla kaç piksel açılsın */
  jawAmp: number;
  /** Gözler: merkez x, merkez y, yarıçap x, yarıçap y */
  eyes: [number, number, number, number][];
  /** Nefeste yükselen üst gövde: üst ve alt sınır (y) */
  breath: [number, number];
  /** Hareket eden kol: dirsek ekseni ve etkilenen bölge [xMin, yMin, xMax, yMax] */
  arm?: { pivot: [number, number]; box: [number, number, number, number] };
  /** Sahnede en fazla ekran yüksekliğinin ne kadarı (0–1) */
  stageHeight: number;
}

export const ACTORS: Record<string, ActorRig> = {
  ibrahim: {
    src: 'art/actors/ibrahim.webp',
    width: 1199,
    height: 1312,
    neck: [640, 410],
    headFade: [392, 450],
    mouthY: 321,
    chinY: 392,
    jawX: [585, 725],
    jawAmp: 12,
    eyes: [
      [628, 234, 21, 10],
      [697, 240, 19, 10],
    ],
    breath: [430, 860],
    arm: { pivot: [905, 900], box: [872, 945, 1199, 1312] },
    stageHeight: 1,
  },
};
