/**
 * Vygeneruje hash hesla do administrace.
 *
 * Použití:
 *   npm run admin:hash -- mojeTajneHeslo
 *
 * Vypíše řádek, který stačí zkopírovat do `.env`.
 */
import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error("Použití: npm run admin:hash -- <heslo>");
  process.exit(1);
}

if (password.length < 8) {
  console.error("Heslo by mělo mít alespoň 8 znaků.");
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);

// Base64 podoba nemá znak `$`, takže ji nerozbije expanze proměnných v .env.
const encoded = Buffer.from(hash, "utf8").toString("base64");

console.log("\n─────────────────────────────────────────────────────────────");
console.log("Vlož do souboru .env tento řádek:\n");
console.log(`ADMIN_PASSWORD_HASH="${encoded}"`);
console.log("\nStejnou hodnotu nastav i na Vercelu (Settings → Environment");
console.log("Variables). Funguje na obou místech beze změny.");
console.log("─────────────────────────────────────────────────────────────\n");
