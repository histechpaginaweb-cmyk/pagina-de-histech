// Upload validation for catalog files. The declared MIME type is only a first
// filter; the real type is confirmed from the file's magic bytes so a script
// renamed to .png (or an SVG with embedded JS) never reaches public storage.

const IMAGE_TYPES = Object.freeze(["image/jpeg", "image/png", "image/webp"]);
const DOCUMENT_TYPES = Object.freeze(["application/pdf"]);

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB, same as the existing upload
const MAX_DATASHEET_BYTES = 10 * 1024 * 1024; // 10 MB

const startsWith = (buffer, bytes, offset = 0) =>
  buffer.length >= offset + bytes.length && bytes.every((b, i) => buffer[offset + i] === b);

/** Returns the MIME type detected from the content, or null if not allowed. */
function sniffFileType(buffer) {
  if (!Buffer.isBuffer(buffer)) return null;
  if (startsWith(buffer, [0xff, 0xd8, 0xff])) return "image/jpeg";
  if (startsWith(buffer, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "image/png";
  if (startsWith(buffer, [0x52, 0x49, 0x46, 0x46]) && startsWith(buffer, [0x57, 0x45, 0x42, 0x50], 8)) {
    return "image/webp";
  }
  if (startsWith(buffer, [0x25, 0x50, 0x44, 0x46, 0x2d])) return "application/pdf";
  return null;
}

module.exports = {
  IMAGE_TYPES,
  DOCUMENT_TYPES,
  MAX_IMAGE_BYTES,
  MAX_DATASHEET_BYTES,
  sniffFileType,
};
