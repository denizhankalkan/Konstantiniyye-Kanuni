/**
 * Gerçek çizimler/portreler geldiğinde buraya eklenir; yoksa vektör çizim kullanılır.
 *   Portre: public/art/portraits/<karakter-id>.webp  (kare, en az 512×512)
 *   Sahne:  public/art/scenes/<sahne-id>.webp         (en az 1600×880, 20:11)
 */
export const RASTER_PORTRAITS = new Set<string>(['ibrahim']);
export const RASTER_SCENES = new Set<string>([]);
