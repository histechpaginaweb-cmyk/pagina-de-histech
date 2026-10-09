const test = require("node:test");
const assert = require("node:assert/strict");
const { sniffFileType, IMAGE_TYPES, DOCUMENT_TYPES } = require("../../catalog/uploads");

const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]);
const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 0x10, 0x4a, 0x46]);
const webp = Buffer.concat([Buffer.from("RIFF"), Buffer.from([1, 0, 0, 0]), Buffer.from("WEBPVP8 ")]);
const pdf = Buffer.from("%PDF-1.7\n%....");

test("sniffFileType recognizes allowed files by magic bytes", () => {
  assert.equal(sniffFileType(png), "image/png");
  assert.equal(sniffFileType(jpeg), "image/jpeg");
  assert.equal(sniffFileType(webp), "image/webp");
  assert.equal(sniffFileType(pdf), "application/pdf");
});

test("sniffFileType rejects scripts, svg and empty buffers", () => {
  assert.equal(sniffFileType(Buffer.from("<svg onload=alert(1)>")), null);
  assert.equal(sniffFileType(Buffer.from("<?php echo 1;")), null);
  assert.equal(sniffFileType(Buffer.alloc(0)), null);
});

test("allowed type lists separate images from documents", () => {
  assert.deepEqual([...IMAGE_TYPES].sort(), ["image/jpeg", "image/png", "image/webp"]);
  assert.deepEqual([...DOCUMENT_TYPES], ["application/pdf"]);
});
