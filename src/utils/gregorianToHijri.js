/**
 * Gregorian → Hijri (Umm al-Qura) via Intl.DateTimeFormat.
 * UTC-safe. Invalid / empty / already-Hijri values are returned as-is.
 */

function parseDateParts(dateStr) {
  const s = String(dateStr).trim();

  let match = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (match) {
    return { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) };
  }

  match = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (match) {
    return { year: Number(match[3]), month: Number(match[2]), day: Number(match[1]) };
  }

  return null;
}

function isAlreadyHijri(year) {
  return year >= 1300 && year <= 1600;
}

export function gregorianToHijri(dateStr) {
  if (dateStr == null || dateStr === "") return dateStr;

  const parts = parseDateParts(dateStr);
  if (!parts) return dateStr;

  const { year, month, day } = parts;
  if (isAlreadyHijri(year)) return dateStr;

  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return dateStr;
  }

  const formatter = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
    timeZone: "UTC",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const formatted = formatter.formatToParts(date);
  const hy = formatted.find((p) => p.type === "year")?.value;
  const hm = formatted.find((p) => p.type === "month")?.value;
  const hd = formatted.find((p) => p.type === "day")?.value;
  if (!hy || !hm || !hd) return dateStr;

  const hijriYear = String(hy).replace(/\D/g, "");
  return `${hijriYear}-${String(hm).padStart(2, "0")}-${String(hd).padStart(2, "0")}`;
}
