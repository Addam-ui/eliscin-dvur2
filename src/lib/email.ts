import { Resend } from "resend";
import { contact, pricing, site } from "./site";
import { formatDayCs, nightsBetween, parseDay } from "./reservations";

/**
 * E-mailová upozornění — novou poptávku majitelce a rozhodnutí hostovi.
 *
 * Bez nastaveného RESEND_API_KEY se e-maily jen tiše přeskočí (funkce
 * vrátí `false`, nic nespadne). Web tak funguje i před tím, než si
 * majitelka Resend založí — jen o poptávkách nedostává e-mail, musí
 * kontrolovat administraci ručně. Postup nastavení je v README.
 */

let client: Resend | null | undefined;

function getClient(): Resend | null {
  if (client !== undefined) return client;

  const apiKey = process.env.RESEND_API_KEY;
  client = apiKey ? new Resend(apiKey) : null;
  return client;
}

/** Odesílací adresa. Bez vlastní ověřené domény funguje Resend sandbox adresa. */
function getFromAddress(): string {
  return process.env.EMAIL_FROM || "Eliščin dvůr <onboarding@resend.dev>";
}

/** Základní ochrana proti vpašování HTML do e-mailu přes text hosta. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Společná obálka pro všechny e-maily — jednoduchá, ať se nerozbije v žádném klientovi. */
function emailShell(title: string, bodyHtml: string): string {
  return `
    <div style="background:#f3ebde;padding:32px 16px;font-family:Georgia,'Times New Roman',serif;">
      <div style="max-width:520px;margin:0 auto;background:#fbf8f2;border-radius:16px;overflow:hidden;border:1px solid #e6dac7;">
        <div style="background:#2c4a38;padding:24px 28px;">
          <span style="color:#fbf8f2;font-size:20px;font-weight:600;">Eliščin dvůr</span>
        </div>
        <div style="padding:28px;color:#1c1a17;font-size:15px;line-height:1.6;">
          <h1 style="font-size:19px;margin:0 0 16px;color:#1c1a17;">${title}</h1>
          ${bodyHtml}
        </div>
        <div style="padding:16px 28px;background:#f3ebde;color:#8b8377;font-size:12px;">
          ${escapeHtml(contact.person)} · ${escapeHtml(contact.street)}, ${escapeHtml(contact.zip)} ${escapeHtml(contact.city)}
        </div>
      </div>
    </div>
  `;
}

interface ReservationEmailData {
  name: string;
  email: string;
  phone: string;
  guests: number;
  message?: string | null;
  /** "YYYY-MM-DD" */
  arrival: string;
  /** "YYYY-MM-DD" */
  departure: string;
}

function rangeLabel(data: ReservationEmailData): string {
  const nights = nightsBetween(parseDay(data.arrival), parseDay(data.departure));
  const nightsWord = nights === 1 ? "noc" : nights < 5 ? "noci" : "nocí";
  return `${formatDayCs(data.arrival)} – ${formatDayCs(data.departure)} (${nights} ${nightsWord})`;
}

/**
 * Upozorní majitelku na novou poptávku z webu.
 *
 * Volá se hned po uložení poptávky do databáze. Chyba se jen zaloguje —
 * poptávka je uložená bez ohledu na to, jestli e-mail dorazí.
 */
export async function sendOwnerNewRequestEmail(data: ReservationEmailData): Promise<boolean> {
  const resend = getClient();
  if (!resend) return false;

  const adminUrl = `${site.url}/admin/kalendar`;

  const html = emailShell(
    "Nová poptávka na Eliščině dvoře",
    `
      <p style="margin:0 0 16px;">Přišla nová poptávka. Termín zatím jen čeká na vaše potvrzení
      v administraci — hostovi zatím nic potvrzené není.</p>
      <table style="width:100%;border-collapse:collapse;margin:0 0 20px;">
        <tr><td style="padding:4px 0;color:#8b8377;width:120px;">Termín</td><td style="padding:4px 0;font-weight:600;">${escapeHtml(rangeLabel(data))}</td></tr>
        <tr><td style="padding:4px 0;color:#8b8377;">Jméno</td><td style="padding:4px 0;">${escapeHtml(data.name)}</td></tr>
        <tr><td style="padding:4px 0;color:#8b8377;">Osob</td><td style="padding:4px 0;">${data.guests}</td></tr>
        <tr><td style="padding:4px 0;color:#8b8377;">Telefon</td><td style="padding:4px 0;">${escapeHtml(data.phone)}</td></tr>
        <tr><td style="padding:4px 0;color:#8b8377;">E-mail</td><td style="padding:4px 0;">${escapeHtml(data.email)}</td></tr>
      </table>
      ${
        data.message
          ? `<p style="margin:0 0 20px;padding:12px 16px;background:#f3ebde;border-radius:8px;">„${escapeHtml(data.message)}"</p>`
          : ""
      }
      <a href="${adminUrl}" style="display:inline-block;background:#2c4a38;color:#fbf8f2;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:600;">Otevřít správu rezervací</a>
    `,
  );

  const text = [
    "Přišla nová poptávka na Eliščině dvoře.",
    "",
    `Termín: ${rangeLabel(data)}`,
    `Jméno: ${data.name}`,
    `Osob: ${data.guests}`,
    `Telefon: ${data.phone}`,
    `E-mail: ${data.email}`,
    data.message ? `Zpráva: ${data.message}` : "",
    "",
    `Otevřít správu rezervací: ${adminUrl}`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    // Resend chyby API (např. neplatný klíč) nehází jako výjimku — vrací
    // je v `error` poli odpovědi. Try/catch samo o sobě by je přehlédlo.
    const { error } = await resend.emails.send({
      from: getFromAddress(),
      to: contact.email,
      subject: `Nová poptávka: ${formatDayCs(data.arrival)} — ${data.name}`,
      html,
      text,
    });

    if (error) {
      console.error("E-mail majitelce se nepodařilo odeslat:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("E-mail majitelce se nepodařilo odeslat:", error);
    return false;
  }
}

/**
 * Oznámí hostovi, že jeho rezervaci majitelka potvrdila nebo zamítla.
 *
 * Volá se z administrace při změně stavu. Stejně jako výše — chyba se
 * jen zaloguje, změna stavu v databázi proběhne bez ohledu na e-mail.
 */
export async function sendGuestStatusEmail(
  data: ReservationEmailData,
  status: "confirmed" | "rejected",
): Promise<boolean> {
  const resend = getClient();
  if (!resend) return false;

  const isConfirmed = status === "confirmed";

  const html = emailShell(
    isConfirmed ? "Rezervace je potvrzená" : "K vaší poptávce",
    isConfirmed
      ? `
        <p style="margin:0 0 16px;">Dobrý den ${escapeHtml(data.name)},</p>
        <p style="margin:0 0 16px;">vaše rezervace na Eliščině dvoře je potvrzená. Termín:</p>
        <p style="margin:0 0 20px;font-weight:600;font-size:17px;">${escapeHtml(rangeLabel(data))}</p>
        <p style="margin:0 0 16px;">Platba celého pobytu je splatná nejpozději v den příjezdu.
        V ceně máte energie, ložní prádlo, ručníky, závěrečný úklid a parkování v areálu.</p>
        <p style="margin:0;">Budete-li mít jakýkoli dotaz, ozvěte se — ${escapeHtml(contact.phones[0])}
        nebo ${escapeHtml(contact.email)}. Těšíme se na vás!<br>${escapeHtml(contact.person)}</p>
      `
      : `
        <p style="margin:0 0 16px;">Dobrý den ${escapeHtml(data.name)},</p>
        <p style="margin:0 0 16px;">bohužel vám pro termín <strong>${escapeHtml(rangeLabel(data))}</strong>
        nemůžeme vyhovět — je už obsazený.</p>
        <p style="margin:0 0 16px;">Napište nám prosím, pokud máte zájem o jiný termín, rádi
        pomůžeme najít volný.</p>
        <p style="margin:0;">${escapeHtml(contact.phones[0])} · ${escapeHtml(contact.email)}<br>${escapeHtml(contact.person)}</p>
      `,
  );

  const textConfirmed = [
    `Dobrý den ${data.name},`,
    "",
    "vaše rezervace na Eliščině dvoře je potvrzená.",
    `Termín: ${rangeLabel(data)}`,
    "",
    "Platba celého pobytu je splatná nejpozději v den příjezdu.",
    `V ceně máte: ${pricing.included.join(", ")}.`,
    "",
    `Kontakt: ${contact.phones[0]} · ${contact.email}`,
    `Těšíme se na vás! ${contact.person}`,
  ].join("\n");

  const textRejected = [
    `Dobrý den ${data.name},`,
    "",
    `bohužel vám pro termín ${rangeLabel(data)} nemůžeme vyhovět — je už obsazený.`,
    "Napište nám prosím, pokud máte zájem o jiný termín, rádi pomůžeme najít volný.",
    "",
    `Kontakt: ${contact.phones[0]} · ${contact.email}`,
    contact.person,
  ].join("\n");

  try {
    const { error } = await resend.emails.send({
      from: getFromAddress(),
      to: data.email,
      subject: isConfirmed
        ? `Rezervace potvrzena — Eliščin dvůr`
        : `K vaší poptávce — Eliščin dvůr`,
      html,
      text: isConfirmed ? textConfirmed : textRejected,
    });

    if (error) {
      console.error("E-mail hostovi se nepodařilo odeslat:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("E-mail hostovi se nepodařilo odeslat:", error);
    return false;
  }
}
