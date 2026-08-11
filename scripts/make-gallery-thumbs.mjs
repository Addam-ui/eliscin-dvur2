/**
 * Vygeneruje náhledy pro pás fotogalerie a menší varianty pro lightbox.
 *
 * Použití (po přidání nových fotek do public/gallery/):
 *   npm run gallery:thumbs
 *
 * Galerie nepoužívá Next.js optimalizaci obrázků za běhu — u desítek fotek
 * najednou by první návštěvník čekal na zpracování každého unikátního
 * rozměru zvlášť. Všechny varianty jsou proto předgenerované předem jako
 * statické soubory, které se servírují okamžitě:
 *   - public/gallery/thumbs   — malé náhledy pro pás (800 px)
 *   - public/gallery/full     — zmenšené varianty pro lightbox (640/1280 px),
 *                               prohlížeč si přes `srcset` vybere tu, která
 *                               stačí na velikost obrazovky — mobil tak
 *                               nestahuje zbytečně velký soubor
 * Originál v public/gallery/ zůstává jako nejvyšší kvalita pro velké displeje.
 *
 * Skript přeskočí fotky, které už danou variantu mají a zdrojový soubor se
 * od posledního spuštění nezměnil — bezpečné spouštět opakovaně.
 */
import sharp from "sharp";
import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SRC_DIR = path.join(ROOT, "public/gallery");
const THUMBS_DIR = path.join(ROOT, "public/gallery/thumbs");
const FULL_DIR = path.join(ROOT, "public/gallery/full");

/** Každá varianta: kam se uloží, jak se pojmenuje soubor a jak se zpracuje. */
const variants = [
  {
    outDir: THUMBS_DIR,
    fileName: (base) => `${base}.jpg`,
    resize: { width: 800 },
    quality: 72,
  },
  {
    outDir: FULL_DIR,
    fileName: (base) => `${base}-640.jpg`,
    resize: { width: 640 },
    quality: 80,
  },
  {
    outDir: FULL_DIR,
    fileName: (base) => `${base}-1280.jpg`,
    resize: { width: 1280 },
    quality: 80,
  },
];

for (const v of variants) mkdirSync(v.outDir, { recursive: true });

const files = readdirSync(SRC_DIR).filter((f) => /\.(jpe?g|png)$/i.test(f));

let generated = 0;
let skipped = 0;

for (const file of files) {
  const srcPath = path.join(SRC_DIR, file);
  const base = file.replace(/\.(jpe?g|png)$/i, "");
  const srcMtime = statSync(srcPath).mtimeMs;

  for (const v of variants) {
    const outPath = path.join(v.outDir, v.fileName(base));

    if (existsSync(outPath) && statSync(outPath).mtimeMs > srcMtime) {
      skipped++;
      continue;
    }

    await sharp(srcPath)
      .resize({ ...v.resize, withoutEnlargement: true })
      .jpeg({ quality: v.quality, mozjpeg: true })
      .toFile(outPath);

    console.log(`vygenerováno: ${path.relative(ROOT, outPath)}`);
    generated++;
  }
}

console.log(`\nHotovo — ${generated} nových souborů, ${skipped} přeskočeno (už existovaly).`);
