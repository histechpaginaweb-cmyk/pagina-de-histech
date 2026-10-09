const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const express = require("express");
const { createCatalogRouter } = require("../../catalog/router");
const { makeService } = require("../../test-support/catalog");

const ADMIN = { "x-test-admin": "1" };
const JSON_HEADERS = { "content-type": "application/json" };

const png = Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), Buffer.alloc(32)]);
const pdf = Buffer.concat([Buffer.from("%PDF-1.7\n"), Buffer.alloc(32)]);

function fakeUploader({ configured = true } = {}) {
  const calls = [];
  return {
    calls,
    isConfigured: () => configured,
    uploadImage: async (buffer, mimetype) => {
      calls.push(["image", mimetype, buffer.length]);
      return "https://cdn.test/img-1.png";
    },
    uploadDocument: async (buffer, mimetype) => {
      calls.push(["document", mimetype, buffer.length]);
      return "https://cdn.test/doc-1.pdf";
    },
  };
}

// Minimal stand-in for the real admin middleware.
const requireAdmin = (req, res, next) =>
  req.headers["x-test-admin"] ? next() : res.status(401).json({ error: "No autenticado" });

async function startApp(options = {}) {
  const { service } = makeService();
  const uploader = options.uploader ?? fakeUploader();
  const app = express();
  app.use("/api", createCatalogRouter({ service, requireAdmin, uploader }));
  app.get("/api/other", (_req, res) => res.json({ other: true }));
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (method, path, { headers, body, raw } = {}) => {
    const res = await fetch(base + path, {
      method,
      headers: { ...(body !== undefined ? JSON_HEADERS : {}), ...headers },
      body: raw ?? (body !== undefined ? JSON.stringify(body) : undefined),
    });
    const text = await res.text();
    let json = null;
    try {
      json = JSON.parse(text);
    } catch {}
    return { status: res.status, json };
  };
  return { call, service, uploader, close: () => new Promise((resolve) => server.close(resolve)) };
}

async function withApp(fn, options) {
  const app = await startApp(options);
  try {
    await fn(app);
  } finally {
    await app.close();
  }
}

async function seed(call) {
  const cat = (await call("POST", "/api/admin/catalog/categories", { headers: ADMIN, body: { name: "Routers" } })).json;
  const brand = (await call("POST", "/api/admin/catalog/brands", { headers: ADMIN, body: { name: "Teltonika" } })).json;
  return { cat, brand };
}

test("routes outside the catalog fall through untouched", async () => {
  await withApp(async ({ call }) => {
    const res = await call("GET", "/api/other");
    assert.deepEqual(res.json, { other: true });
  });
});

test("every admin catalog route requires the admin middleware", async () => {
  await withApp(async ({ call }) => {
    const checks = [
      ["GET", "/api/admin/catalog/products"],
      ["POST", "/api/admin/catalog/products"],
      ["PUT", "/api/admin/catalog/products/x"],
      ["PATCH", "/api/admin/catalog/products/x"],
      ["DELETE", "/api/admin/catalog/products/x"],
      ["GET", "/api/admin/catalog/categories"],
      ["POST", "/api/admin/catalog/brands"],
      ["GET", "/api/admin/catalog/settings"],
      ["PUT", "/api/admin/catalog/settings"],
      ["POST", "/api/admin/catalog/upload/image"],
      ["POST", "/api/admin/catalog/upload/datasheet"],
    ];
    for (const [method, path] of checks) {
      const res = await call(method, path, method === "GET" ? {} : { body: {} });
      assert.equal(res.status, 401, `${method} ${path}`);
    }
  });
});

test("admin creates a product and it stays hidden publicly until published", async () => {
  await withApp(async ({ call }) => {
    const { cat, brand } = await seed(call);
    const created = await call("POST", "/api/admin/catalog/products", {
      headers: ADMIN,
      body: { name: "RUT956", categoryId: cat.id, brandId: brand.id, priceCop: 1200000 },
    });
    assert.equal(created.status, 201);
    assert.equal(created.json.slug, "rut956");
    assert.equal(created.json.status, "draft");

    assert.equal((await call("GET", "/api/catalog/products")).json.total, 0);
    assert.equal((await call("GET", "/api/catalog/products/rut956")).status, 404);

    const published = await call("PATCH", `/api/admin/catalog/products/${created.json.id}`, {
      headers: ADMIN,
      body: { status: "published", availability: "in_stock" },
    });
    assert.equal(published.status, 200);

    const list = await call("GET", "/api/catalog/products");
    assert.equal(list.json.total, 1);
    assert.equal(list.json.items[0].priceCop, 1200000);
    assert.equal(list.json.items[0].consultPrice, false);
    const detail = await call("GET", "/api/catalog/products/rut956");
    assert.equal(detail.status, 200);
    assert.deepEqual(detail.json.related, []);
  });
});

test("toggling showPrices hides prices in the public API", async () => {
  await withApp(async ({ call }) => {
    const { cat } = await seed(call);
    await call("POST", "/api/admin/catalog/products", {
      headers: ADMIN,
      body: { name: "P", categoryId: cat.id, priceCop: 5000, status: "published" },
    });
    assert.deepEqual((await call("GET", "/api/catalog/settings")).json, { showPrices: true });
    const put = await call("PUT", "/api/admin/catalog/settings", { headers: ADMIN, body: { showPrices: false } });
    assert.deepEqual(put.json, { showPrices: false });
    const item = (await call("GET", "/api/catalog/products")).json.items[0];
    assert.equal(item.consultPrice, true);
    assert.equal("priceCop" in item, false);
    assert.deepEqual((await call("GET", "/api/admin/catalog/settings", { headers: ADMIN })).json, { showPrices: false });
  });
});

test("validation errors return 400 with field details", async () => {
  await withApp(async ({ call }) => {
    const res = await call("POST", "/api/admin/catalog/products", { headers: ADMIN, body: { priceCop: -1 } });
    assert.equal(res.status, 400);
    assert.equal(typeof res.json.error, "string");
    assert.ok(res.json.details.some((d) => d.path === "name"));
    assert.ok(res.json.details.some((d) => d.path === "priceCop"));
  });
});

test("conflicts return 409, unknown ids return 404", async () => {
  await withApp(async ({ call }) => {
    const { cat } = await seed(call);
    const body = { name: "A", slug: "dup", categoryId: cat.id };
    assert.equal((await call("POST", "/api/admin/catalog/products", { headers: ADMIN, body })).status, 201);
    assert.equal((await call("POST", "/api/admin/catalog/products", { headers: ADMIN, body })).status, 409);
    assert.equal((await call("GET", "/api/admin/catalog/products/missing", { headers: ADMIN })).status, 404);
    assert.equal((await call("PATCH", "/api/admin/catalog/products/missing", { headers: ADMIN, body: { priceCop: 1 } })).status, 404);
    assert.equal((await call("DELETE", "/api/admin/catalog/products/missing", { headers: ADMIN })).status, 404);
  });
});

test("admin full update, list with status filter and delete", async () => {
  await withApp(async ({ call }) => {
    const { cat } = await seed(call);
    const p = (await call("POST", "/api/admin/catalog/products", { headers: ADMIN, body: { name: "A", categoryId: cat.id } })).json;
    const put = await call("PUT", `/api/admin/catalog/products/${p.id}`, {
      headers: ADMIN,
      body: { name: "A2", categoryId: cat.id, specs: [{ label: "Puertos", value: "4" }] },
    });
    assert.equal(put.status, 200);
    assert.equal(put.json.name, "A2");
    assert.equal(put.json.specs.length, 1);
    const drafts = await call("GET", "/api/admin/catalog/products?status=draft", { headers: ADMIN });
    assert.equal(drafts.json.total, 1);
    assert.deepEqual((await call("DELETE", `/api/admin/catalog/products/${p.id}`, { headers: ADMIN })).json, { ok: true });
  });
});

test("categories and brands: CRUD, public counts and in-use deletion guard", async () => {
  await withApp(async ({ call }) => {
    const { cat, brand } = await seed(call);
    await call("POST", "/api/admin/catalog/products", {
      headers: ADMIN,
      body: { name: "P", categoryId: cat.id, brandId: brand.id, status: "published" },
    });
    const cats = (await call("GET", "/api/catalog/categories")).json;
    assert.equal(cats[0].slug, "routers");
    assert.equal(cats[0].productCount, 1);
    const brands = (await call("GET", "/api/catalog/brands")).json;
    assert.equal(brands[0].productCount, 1);
    assert.equal((await call("DELETE", `/api/admin/catalog/categories/${cat.id}`, { headers: ADMIN })).status, 409);
    assert.equal((await call("DELETE", `/api/admin/catalog/brands/${brand.id}`, { headers: ADMIN })).status, 409);
    const upd = await call("PUT", `/api/admin/catalog/categories/${cat.id}`, { headers: ADMIN, body: { name: "Enrutadores" } });
    assert.equal(upd.json.name, "Enrutadores");
    assert.equal(upd.json.slug, "routers");
  });
});

test("image upload validates content and returns the stored url", async () => {
  await withApp(async ({ call, uploader }) => {
    const form = new FormData();
    form.append("image", new Blob([png], { type: "image/png" }), "a.png");
    const ok = await call("POST", "/api/admin/catalog/upload/image", { headers: ADMIN, raw: form });
    assert.equal(ok.status, 200);
    assert.deepEqual(ok.json, { url: "https://cdn.test/img-1.png" });
    assert.deepEqual(uploader.calls[0].slice(0, 2), ["image", "image/png"]);

    const fake = new FormData();
    fake.append("image", new Blob([Buffer.from("<svg onload=alert(1)>")], { type: "image/png" }), "x.png");
    const bad = await call("POST", "/api/admin/catalog/upload/image", { headers: ADMIN, raw: fake });
    assert.equal(bad.status, 400);

    const pdfAsImage = new FormData();
    pdfAsImage.append("image", new Blob([pdf], { type: "application/pdf" }), "x.pdf");
    assert.equal((await call("POST", "/api/admin/catalog/upload/image", { headers: ADMIN, raw: pdfAsImage })).status, 400);

    assert.equal((await call("POST", "/api/admin/catalog/upload/image", { headers: ADMIN, raw: new FormData() })).status, 400);
    assert.equal(uploader.calls.length, 1, "rejected files never reach storage");
  });
});

test("image upload enforces the 5 MB limit", async () => {
  await withApp(async ({ call, uploader }) => {
    const big = Buffer.concat([png, Buffer.alloc(5 * 1024 * 1024)]);
    const form = new FormData();
    form.append("image", new Blob([big], { type: "image/png" }), "big.png");
    const res = await call("POST", "/api/admin/catalog/upload/image", { headers: ADMIN, raw: form });
    assert.equal(res.status, 400);
    assert.equal(uploader.calls.length, 0);
  });
});

test("datasheet upload accepts only real PDFs", async () => {
  await withApp(async ({ call, uploader }) => {
    const form = new FormData();
    form.append("datasheet", new Blob([pdf], { type: "application/pdf" }), "ds.pdf");
    const ok = await call("POST", "/api/admin/catalog/upload/datasheet", { headers: ADMIN, raw: form });
    assert.equal(ok.status, 200);
    assert.deepEqual(ok.json, { url: "https://cdn.test/doc-1.pdf" });
    assert.deepEqual(uploader.calls[0].slice(0, 2), ["document", "application/pdf"]);

    const fake = new FormData();
    fake.append("datasheet", new Blob([png], { type: "application/pdf" }), "ds.pdf");
    assert.equal((await call("POST", "/api/admin/catalog/upload/datasheet", { headers: ADMIN, raw: fake })).status, 400);

    const wrongMime = new FormData();
    wrongMime.append("datasheet", new Blob([pdf], { type: "text/html" }), "ds.html");
    assert.equal((await call("POST", "/api/admin/catalog/upload/datasheet", { headers: ADMIN, raw: wrongMime })).status, 400);
    assert.equal(uploader.calls.length, 1);
  });
});

test("uploads report a clear error when storage is not configured", async () => {
  await withApp(
    async ({ call }) => {
      const form = new FormData();
      form.append("image", new Blob([png], { type: "image/png" }), "a.png");
      const res = await call("POST", "/api/admin/catalog/upload/image", { headers: ADMIN, raw: form });
      assert.equal(res.status, 500);
      assert.match(res.json.error, /R2/);
    },
    { uploader: fakeUploader({ configured: false }) },
  );
});

test("unexpected errors return a generic 500 without leaking internals", async () => {
  await withApp(async ({ call, service }) => {
    service.listPublicCategories = async () => {
      throw new Error("db password is hunter2");
    };
    const original = console.error;
    console.error = () => {};
    try {
      const res = await call("GET", "/api/catalog/categories");
      assert.equal(res.status, 500);
      assert.equal(JSON.stringify(res.json).includes("hunter2"), false);
    } finally {
      console.error = original;
    }
  });
});
