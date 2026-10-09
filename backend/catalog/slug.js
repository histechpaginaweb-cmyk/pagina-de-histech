// Slug helpers: deterministic, URL-safe, unique within a collection.

const MAX_SLUG_LENGTH = 80;

function slugify(input, fallback = "item") {
  const slug = String(input ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, MAX_SLUG_LENGTH)
    .replace(/-+$/g, "");
  return slug || fallback;
}

/**
 * Builds a slug from `base` that `isTaken` reports as free. Collisions get the
 * lowest free numeric suffix (-2, -3, ...), keeping the total within the cap.
 */
async function uniqueSlug(base, isTaken, fallback = "item") {
  const root = slugify(base, fallback);
  if (!(await isTaken(root))) return root;
  for (let n = 2; ; n += 1) {
    const suffix = `-${n}`;
    const candidate = `${root.slice(0, MAX_SLUG_LENGTH - suffix.length).replace(/-+$/g, "")}${suffix}`;
    if (!(await isTaken(candidate))) return candidate;
  }
}

module.exports = { MAX_SLUG_LENGTH, slugify, uniqueSlug };
