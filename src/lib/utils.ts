import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// -------------------------
//  BPM Formatting
// -------------------------
export function formatBpm(bpmStart: number, bpmEnd: number) {
  if (bpmStart == null || bpmEnd == null) return "";
  return bpmStart === bpmEnd ? bpmStart : `${bpmStart}-${bpmEnd}`;
}


/**
 * Format an integer amount in smallest currency unit to a readable currency string.
 * @param {number} amount - Amount in smallest unit (e.g., cents)
 * @param {string} currency - Currency code, default "USD"
 * @param {string} locale - Locale, default "en-US"
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount = 0, currency = "USD", locale = "en-US") {
  // Convert from cents (or smallest unit) to dollars
  const converted = Number(amount) / 100;

  return converted.toLocaleString(locale, {
    style: "currency",
    currency,
  });
}


/**
 * Returns the formatted track title with explicit label.
 * - If the title contains '(', explicit label is plain
 * - Otherwise, wraps the explicit label in parentheses
 *
 * @param {string} title - Track title
 * @param {boolean} isExplicit - Whether the track is explicit
 * @returns {string} Formatted title with explicit label
 */
export function formatTrackTitle(title: string | null | undefined = "", isExplicit = false) {
  const trimmedTitle = String(title).replaceAll('[CLEAN]', '')
                        .replaceAll('[DIRTY]', '')
                        .replaceAll(/\(\s+/g, '(')        // remove space AFTER (
                        .replaceAll(/\s+\)/g, ')')        // remove space BEFORE )
                        .replaceAll(/\(\(+/g, '(')        // (( -> (
                        .replaceAll(/\)+\)/g, ')')        // )) -> )
                        .replaceAll(/([^\s])\(/g, '$1 (') // ❗ ensure space BEFORE (
                        .trim();
  const hasOpenParenthesis = trimmedTitle.includes("(");
  const explicitLabel = isExplicit ? "Dirty" : "Clean";

  return `${trimmedTitle} ${hasOpenParenthesis ? explicitLabel : `(${explicitLabel})`}`;
}


export function formatDateShort(date: string | number | Date) {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateUTC(date: string | number | Date) {
  if (!date) return "";

  return new Date(date).toLocaleString("en-US", {
    timeZone: "UTC",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}


export function getRelatedCamelotKeyNames(name: string): string[] {
  const regex = /^(\d+)(A|B)$/;
  const match = regex.exec(name); // use exec() instead of match()
  if (!match) return [];

  const num = Number(match[1]);
  const letter = match[2];

  const prev = num === 1 ? 12 : num - 1;
  const next = num === 12 ? 1 : num + 1;
  const otherLetter = letter === 'A' ? 'B' : 'A';

  return [
    name,                 // include original key
    `${num}${otherLetter}`, // relative major/minor
    `${prev}${letter}`,     // step down
    `${next}${letter}`,     // step up
  ];
}


export function buildContentDisposition(
  filename: string,
  fallback = "download.mp3"
): string {
  // Prevent header injection and remove invisible/control characters.
  let unicodeName = filename
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
    .replace(/[\u202A-\u202E\u2066-\u2069]/g, "") // bidi controls
    .replace(/\\/g, "/")
    .split("/")
    .pop()!
    .normalize("NFC")
    .trim()
    .replace(/\s+/g, " ");

  // Avoid special filesystem names.
  if (
    !unicodeName ||
    unicodeName === "." ||
    unicodeName === ".."
  ) {
    unicodeName = fallback;
  }

  // Replace malformed UTF-16 so encodeURIComponent cannot throw.
  unicodeName = toWellFormedUnicode(unicodeName);

  // Keep filename* reasonably sized while retaining Unicode.
  unicodeName = truncateFilename(unicodeName, 180);

  // Create a separate ASCII fallback.
  let asciiName = unicodeName
    .normalize("NFKD")
    .replace(/[\u0300-\u036F]/g, "")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[^\x20-\x7E]/g, "")
    // Unsafe inside an HTTP quoted-string or troublesome in clients.
    .replace(/["\\;%]/g, "")
    // Avoid characters invalid on common filesystems.
    .replace(/[<>:|?*]/g, "_")
    .trim()
    .replace(/\s+/g, " ")
    // Windows does not accept trailing dots or spaces.
    .replace(/[. ]+$/g, "");

  if (!asciiName || asciiName === "." || asciiName === "..") {
    asciiName = fallback;
  }

  // Avoid reserved Windows device names.
  if (/^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(asciiName)) {
    asciiName = `_${asciiName}`;
  }

  asciiName = truncateFilename(asciiName, 180);

  const encodedName = encodeRFC5987Value(unicodeName);

  return (
    `attachment; filename="${asciiName}"; ` +
    `filename*=UTF-8''${encodedName}`
  );
}

function encodeRFC5987Value(value: string): string {
  return encodeURIComponent(value)
    .replace(/['()*]/g, character =>
      `%${character.charCodeAt(0).toString(16).toUpperCase()}`
    );
}

function truncateFilename(filename: string, maxLength: number): string {
  const characters = Array.from(filename);

  if (characters.length <= maxLength) {
    return filename;
  }

  // Preserve a short file extension when truncating.
  const dot = filename.lastIndexOf(".");
  const extension =
    dot > 0 && filename.length - dot <= 16 ? filename.slice(dot) : "";

  const extensionLength = Array.from(extension).length;
  return (
    characters.slice(0, Math.max(1, maxLength - extensionLength)).join("") +
    extension
  );
}

function toWellFormedUnicode(value: string): string {
  let result = "";

  for (let index = 0; index < value.length; index++) {
    const code = value.charCodeAt(index);

    if (code >= 0xd800 && code <= 0xdbff) {
      const next = value.charCodeAt(index + 1);

      if (next >= 0xdc00 && next <= 0xdfff) {
        result += value.charAt(index) + value.charAt(index + 1);
        index++;
      } else {
        result += "\uFFFD";
      }
    } else if (code >= 0xdc00 && code <= 0xdfff) {
      result += "\uFFFD";
    } else {
      result += value[index];
    }
  }

  return result;
}