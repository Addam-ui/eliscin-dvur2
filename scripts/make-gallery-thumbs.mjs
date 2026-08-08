/**
 * Vygeneruje malé náhledy pro pás fotogalerie.
 *
 * Použití (po přidání nových fotek do public/gallery/):
 *   npm run gallery:thumbs
 *
 * Galerie v pásu nepoužívá Next.js optimalizaci obrázků za běhu — u desítek
 * fotek najednou by první návštěvník čekal na zpracování každého unikátního
 * rozměru zvlášť. Náhledy jsou proto předgenerované předem jako malé
 * statické soubory v public/gallery/thumbs, které se servírují okamžitě.
 * Plná kvalita fotky se pořád použije v lightboxu po rozkliknutí.
 *
 * Skript přeskočí fotky, které už náhled mají a zdrojový soubor se
 * od posledního spuštění nezměnil — bezpečné spouštět opakovaně.
 */
import sharp from "sharp";
import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SRC_DIR = path.join(ROOT, "public/gallery");
const OUT_DIR = path.join(ROOT, "public/gallery/thumbs");

const WIDTH = 800;
const QUALITY = 72;

mkdirSync(OUT_DIR, { recursive: true });

const files = readdirSync(SRC_DIR).filter((f) => /\.(jpe?g|png)$/i.test(f));

let generated = 0;
let skipped = 0;

for (const file of files) {
  const srcPath = path.join(SRC_DIR, file);
  const outPath = path.join(OUT_DIR, file);

  if (existsSync(outPath) && statSync(outPath).mtimeMs > statSync(srcPath).mtimeMs) {
    skipped++;
    continue;
  }

  await sharp(srcPath)
    .resize({ width: WIDTH, withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toFile(outPath);

  console.log(`vygenerováno: ${file}`);
  generated++;
}

console.log(`\nHotovo — ${generated} nových náhledů, ${skipped} přeskočeno (už existovaly).`);
