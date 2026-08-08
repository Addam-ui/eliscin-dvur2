/**
 * Načtení hesla do administrace z proměnných prostředí.
 *
 * Proč to není jen `process.env.ADMIN_PASSWORD_HASH`:
 * bcrypt hash vypadá jako `$2a$12$…` a Next.js v souborech `.env` expanduje
 * `$něco` jako proměnnou — z hashe by zbyl ohryzek a přihlášení by tiše
 * přestalo fungovat. Na Vercelu se naopak proměnné neexpandují a hash projde
 * v pořádku.
 *
 * Aby to fungovalo všude stejně, přijímáme obě podoby:
 *   - hash zapsaný přímo (`$2a$12$…`) — Vercel, escapovaný `.env`
 *   - hash v base64 — bez znaku `$`, takže ho nemá co rozbít
 */

const BCRYPT_PREFIX = /^\$2[aby]\$/;

export function getAdminPasswordHash(): string | null {
  const raw = process.env.ADMIN_PASSWORD_HASH?.trim();
  if (!raw) return null;

  if (BCRYPT_PREFIX.test(raw)) return raw;

  try {
    const decoded = Buffer.from(raw, "base64").toString("utf8");
    if (BCRYPT_PREFIX.test(decoded)) return decoded;
  } catch {
    // Spadneme do hlášky níž.
  }

  console.error(
    "ADMIN_PASSWORD_HASH nevypadá jako bcrypt hash. " +
      "V souboru .env musí být `$` escapované (\\$2a\\$12\\$…), nebo použij " +
      "base64 podobu, kterou vypíše `npm run admin:hash`.",
  );
  return null;
}
