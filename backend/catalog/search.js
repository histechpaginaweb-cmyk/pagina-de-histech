// Free-text product search shared by both repositories.
//
// Installers type part numbers as "RG-ES116G-L", "rges116gl" or "RG ES116G L".
// A query matches a field when it is a case-insensitive substring of it (the
// original behavior) OR when, after dropping everything that is not a letter or
// digit, it is a substring of the normalized field.

function normalizeSearch(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "");
}

function matchesSearch(fields, q) {
  const needle = String(q ?? "").trim().toLowerCase();
  const compact = normalizeSearch(needle);
  if (!compact) return false;
  return fields.some((field) => {
    if (field == null || field === "") return false;
    const text = String(field).toLowerCase();
    return text.includes(needle) || normalizeSearch(text).includes(compact);
  });
}

module.exports = { normalizeSearch, matchesSearch };
