// Repairs "mojibake": UTF-8 bytes that were decoded as Windows-1252 (e.g.
// "DiseÃ±o" -> "Diseño", "â„ƒ" -> "℃").
//
// Only runs that look like a garbled UTF-8 sequence are touched, so strings that
// mix correct text with broken fragments are repaired fragment by fragment and
// already-correct text is returned unchanged (idempotent).
//
// Known limit: when the continuation byte was lost on the way (e.g. "DifÃciles",
// where the soft hyphen 0xAD of "í" vanished) a lone "Ã" cannot be recovered with
// certainty, so it is left untouched. It is repaired only when the 0xAD soft
// hyphen char is actually present ("DifÃ­ciles" -> "Difíciles").

// cp1252 specials in 0x80-0x9F -> original byte. Everything else in 0x80-0xBF is latin1.
const CP1252_SPECIALS = {
  "€": 0x80, "‚": 0x82, "ƒ": 0x83, "„": 0x84, "…": 0x85, "†": 0x86, "‡": 0x87, "ˆ": 0x88,
  "‰": 0x89, "Š": 0x8a, "‹": 0x8b, "Œ": 0x8c, "Ž": 0x8e, "‘": 0x91, "’": 0x92, "“": 0x93,
  "”": 0x94, "•": 0x95, "–": 0x96, "—": 0x97, "˜": 0x98, "™": 0x99, "š": 0x9a, "›": 0x9b,
  "œ": 0x9c, "ž": 0x9e, "Ÿ": 0x9f,
};

const CONT = `[\u0080-\u00BF${Object.keys(CP1252_SPECIALS).join("")}]`;
// The lead byte fixes the sequence length: C2-DF -> 2 bytes, E0-EF -> 3, F0-F4 -> 4.
const RUN = new RegExp(
  `[\u00C2-\u00DF]${CONT}|[\u00E0-\u00EF]${CONT}{2}|[\u00F0-\u00F4]${CONT}{3}`,
  "g",
);

const decoder = new TextDecoder("utf-8", { fatal: true });

function repairRun(run) {
  const bytes = Uint8Array.from([...run], (ch) => CP1252_SPECIALS[ch] ?? ch.charCodeAt(0));
  try {
    return decoder.decode(bytes);
  } catch {
    return run;
  }
}

function fixMojibake(text) {
  if (typeof text !== "string") return text;
  return text.replace(RUN, repairRun);
}

const hasMojibake = (text) => typeof text === "string" && fixMojibake(text) !== text;

module.exports = { fixMojibake, hasMojibake };
