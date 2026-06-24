// Panel admin HISTECH — vanilla JS. Mismo origen que la API (cookies httpOnly).
const $ = (id) => document.getElementById(id);
const ICONS = [
  "ShieldCheck", "Cloud", "Workflow", "Server", "BrainCircuit", "Activity",
  "Network", "Cpu", "Layers", "Lightbulb", "Sparkles", "Settings2", "Shield",
];
let textsLoaded = false; // los textos de páginas se cargan al abrir su pestaña
let blogLoaded = false; // las entradas del blog se cargan al abrir su pestaña

async function api(path, opts = {}) {
  const res = await fetch(path, { credentials: "include", ...opts });
  if (res.status === 401) {
    showLogin();
    throw new Error("No autenticado");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Error en la solicitud");
  return data;
}

function showToast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2200);
}

function showLogin() {
  $("loginView").classList.remove("hide");
  $("panelView").classList.add("hide");
  textsLoaded = false; // forzar recarga de textos en la próxima sesión
  blogLoaded = false;
}
function showPanel() {
  $("loginView").classList.add("hide");
  $("panelView").classList.remove("hide");
}

// ── LOGIN ──
$("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  $("loginErr").textContent = "";
  try {
    await api("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: $("user").value, password: $("password").value }),
    });
    showPanel();
    loadProducts();
  } catch (err) {
    $("loginErr").textContent = err.message;
  }
});

$("logoutBtn").addEventListener("click", async () => {
  await api("/api/admin/logout", { method: "POST" }).catch(() => {});
  showLogin();
});

$("addBtn").addEventListener("click", () => {
  const grid = $("grid");
  grid.prepend(
    renderCard({ id: null, badge: "", title: "", excerpt: "", image: "", icon: "Sparkles", href: "", position: null }),
  );
});

// ── CARGA ──
async function loadProducts() {
  $("status").textContent = "Cargando…";
  try {
    const items = await api("/api/admin/products");
    const grid = $("grid");
    grid.innerHTML = "";
    items.forEach((p) => grid.appendChild(renderCard(p)));
    $("status").textContent = `${items.length} producto(s). Edita y pulsa Guardar en cada tarjeta.`;
  } catch (err) {
    $("status").textContent = err.message;
  }
}

// ── TARJETA EDITABLE ──
function renderCard(p) {
  const el = document.createElement("div");
  el.className = "card";

  el.innerHTML = `
    <img class="thumb ${p.image ? "" : "empty"}" alt="" />
    <div class="row" style="margin-top:10px">
      <button class="ghost" data-act="upload" type="button">Subir imagen…</button>
      <input type="file" accept="image/*" class="hide" data-f="file" />
    </div>
    <label>URL de imagen (o súbela arriba)</label>
    <input data-f="image" placeholder="https://…" />
    <div class="row">
      <div>
        <label>Categoría (badge)</label>
        <input data-f="badge" />
      </div>
      <div>
        <label>Ícono (placeholder si no hay imagen)</label>
        <input data-f="icon" list="iconlist" />
      </div>
    </div>
    <label>Título</label>
    <input data-f="title" />
    <label>Artículo breve</label>
    <textarea data-f="excerpt"></textarea>
    <div class="row">
      <div>
        <label>Enlace "Leer más" (opcional)</label>
        <input data-f="href" placeholder="/servicios" />
      </div>
      <div>
        <label>Orden</label>
        <input data-f="position" type="number" />
      </div>
    </div>
    <div class="card-actions">
      <button class="primary" data-act="save" type="button">Guardar</button>
      <button class="danger" data-act="delete" type="button">Eliminar</button>
      <span class="spinner hide" data-spin>Guardando…</span>
    </div>
  `;

  const f = (name) => el.querySelector(`[data-f="${name}"]`);
  const thumb = el.querySelector(".thumb");
  const setThumb = (url) => {
    if (url) {
      thumb.src = url;
      thumb.classList.remove("empty");
      thumb.alt = "preview";
    } else {
      thumb.removeAttribute("src");
      thumb.classList.add("empty");
      thumb.alt = "sin imagen";
    }
  };

  // poblar valores
  f("image").value = p.image || "";
  f("badge").value = p.badge || "";
  f("icon").value = p.icon || "";
  f("title").value = p.title || "";
  f("excerpt").value = p.excerpt || "";
  f("href").value = p.href || "";
  f("position").value = p.position ?? "";
  setThumb(p.image);
  el.dataset.id = p.id ?? "";

  f("image").addEventListener("input", () => setThumb(f("image").value.trim()));

  // subir imagen
  const fileInput = el.querySelector('[data-f="file"]');
  el.querySelector('[data-act="upload"]').addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", async () => {
    const file = fileInput.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("image", file);
    showToast("Subiendo imagen…");
    try {
      const { url } = await api("/api/admin/upload", { method: "POST", body: fd });
      f("image").value = url;
      setThumb(url);
      showToast("Imagen subida ✓");
    } catch (err) {
      showToast(err.message);
    }
  });

  // guardar
  el.querySelector('[data-act="save"]').addEventListener("click", async () => {
    const spin = el.querySelector("[data-spin]");
    const payload = {
      badge: f("badge").value.trim(),
      title: f("title").value.trim(),
      excerpt: f("excerpt").value.trim(),
      image: f("image").value.trim(),
      icon: f("icon").value.trim() || "Sparkles",
      href: f("href").value.trim(),
      position: f("position").value === "" ? null : Number(f("position").value),
    };
    if (!payload.title) return showToast("El título es obligatorio");
    spin.classList.remove("hide");
    try {
      const id = el.dataset.id;
      const saved = id
        ? await api(`/api/admin/products/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await api("/api/admin/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
      el.dataset.id = saved.id;
      f("position").value = saved.position ?? "";
      showToast("Guardado ✓");
    } catch (err) {
      showToast(err.message);
    } finally {
      spin.classList.add("hide");
    }
  });

  // eliminar
  el.querySelector('[data-act="delete"]').addEventListener("click", async () => {
    const id = el.dataset.id;
    if (!confirm("¿Eliminar este producto?")) return;
    if (!id) return el.remove(); // tarjeta nueva sin guardar
    try {
      await api(`/api/admin/products/${id}`, { method: "DELETE" });
      el.remove();
      showToast("Eliminado");
    } catch (err) {
      showToast(err.message);
    }
  });

  return el;
}

// datalist de íconos
const dl = document.createElement("datalist");
dl.id = "iconlist";
ICONS.forEach((n) => {
  const o = document.createElement("option");
  o.value = n;
  dl.appendChild(o);
});
document.body.appendChild(dl);

// ── PESTAÑAS (Productos / Textos / Blog) ──
document.querySelectorAll(".tab").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const tab = btn.dataset.tab;
    $("tab-products").classList.toggle("hide", tab !== "products");
    $("tab-texts").classList.toggle("hide", tab !== "texts");
    $("tab-blog").classList.toggle("hide", tab !== "blog");
    if (tab === "texts" && !textsLoaded) {
      textsLoaded = true;
      loadServiceTexts();
    }
    if (tab === "blog" && !blogLoaded) {
      blogLoaded = true;
      loadBlog();
    }
  });
});

// ── BLOG ──
$("addBlogBtn").addEventListener("click", () => {
  $("blogGrid").prepend(
    renderBlogCard({ slug: "", title: "", description: "", category: "", author: "Equipo HISTECH", date: new Date().toISOString().slice(0, 10), content: "" }),
  );
});

async function loadBlog() {
  $("blogStatus").textContent = "Cargando…";
  try {
    const items = await api("/api/admin/blog");
    const grid = $("blogGrid");
    grid.innerHTML = "";
    items.forEach((p) => grid.appendChild(renderBlogCard(p)));
    $("blogStatus").textContent = `${items.length} entrada(s). Usa "+ Nueva entrada" para agregar, o edita y guarda.`;
  } catch (err) {
    blogLoaded = false;
    $("blogStatus").textContent = err.message;
  }
}

function renderBlogCard(p) {
  const el = document.createElement("div");
  el.className = "card";
  el.dataset.slug = p.slug || "";
  el.innerHTML = `
    <div class="text-slug" data-url></div>
    <label>Título</label>
    <input data-f="title" />
    <label>Descripción (resumen corto para la tarjeta del blog)</label>
    <textarea data-f="description" rows="2"></textarea>
    <div class="row">
      <div>
        <label>Categoría</label>
        <input data-f="category" />
      </div>
      <div>
        <label>Autor</label>
        <input data-f="author" />
      </div>
      <div>
        <label>Fecha</label>
        <input data-f="date" type="date" />
      </div>
    </div>
    <label>Contenido (Markdown: <code>## Subtítulo</code>, <code>**negrita**</code>, listas con <code>-</code> o <code>1.</code>, <code>&gt; cita</code>, <code>[enlace](/ruta)</code>)</label>
    <textarea data-f="content" rows="14"></textarea>
    <div class="card-actions">
      <button class="primary" data-act="save" type="button">Guardar</button>
      <button class="danger" data-act="delete" type="button">Eliminar</button>
      <span class="spinner hide" data-spin>Guardando…</span>
    </div>
  `;

  const f = (n) => el.querySelector(`[data-f="${n}"]`);
  const urlEl = el.querySelector("[data-url]");
  const setUrl = () => {
    const slug = el.dataset.slug;
    urlEl.innerHTML = slug
      ? `<span class="muted">/blog/${slug}</span>`
      : `<span class="muted">Nueva entrada — la URL se generará del título al guardar</span>`;
  };
  f("title").value = p.title || "";
  f("description").value = p.description || "";
  f("category").value = p.category || "";
  f("author").value = p.author || "";
  f("date").value = (p.date || "").slice(0, 10);
  f("content").value = p.content || "";
  setUrl();

  // guardar (crear o actualizar)
  el.querySelector('[data-act="save"]').addEventListener("click", async () => {
    const spin = el.querySelector("[data-spin]");
    const payload = {
      title: f("title").value.trim(),
      description: f("description").value.trim(),
      category: f("category").value.trim(),
      author: f("author").value.trim(),
      date: f("date").value,
      content: f("content").value,
    };
    if (!payload.title) return showToast("El título es obligatorio");
    spin.classList.remove("hide");
    try {
      const slug = el.dataset.slug;
      const saved = slug
        ? await api(`/api/admin/blog/${slug}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
        : await api("/api/admin/blog", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      el.dataset.slug = saved.slug;
      setUrl();
      showToast("Guardado ✓");
    } catch (err) {
      showToast(err.message);
    } finally {
      spin.classList.add("hide");
    }
  });

  // eliminar
  el.querySelector('[data-act="delete"]').addEventListener("click", async () => {
    const slug = el.dataset.slug;
    if (!confirm("¿Eliminar esta entrada del blog?")) return;
    if (!slug) return el.remove(); // nueva sin guardar
    try {
      await api(`/api/admin/blog/${slug}`, { method: "DELETE" });
      el.remove();
      showToast("Eliminada");
    } catch (err) {
      showToast(err.message);
    }
  });

  return el;
}

// ── TEXTOS DE PÁGINAS DE SERVICIO ──
async function loadServiceTexts() {
  $("textsStatus").textContent = "Cargando…";
  try {
    const items = await api("/api/admin/service-texts");
    const grid = $("textsGrid");
    grid.innerHTML = "";
    items.forEach((s) => grid.appendChild(renderTextCard(s)));
    $("textsStatus").textContent = `${items.length} página(s). Edita el texto y pulsa Guardar en cada una.`;
  } catch (err) {
    textsLoaded = false; // permitir reintento
    $("textsStatus").textContent = err.message;
  }
}

function renderTextCard(s) {
  const el = document.createElement("div");
  el.className = "card";
  el.innerHTML = `
    <div class="text-slug">${s.name || s.slug} <span class="muted">/${s.slug}</span></div>
    <label>Título</label>
    <textarea data-f="title" rows="2"></textarea>
    <label>Subtítulo</label>
    <textarea data-f="subtitle" rows="3"></textarea>
    <label>Texto introductorio (párrafo de abajo)</label>
    <textarea data-f="intro" rows="5"></textarea>
    <div class="card-actions">
      <button class="primary" data-act="save" type="button">Guardar</button>
      <span class="spinner hide" data-spin>Guardando…</span>
    </div>
  `;
  const f = (n) => el.querySelector(`[data-f="${n}"]`);
  f("title").value = s.title || "";
  f("subtitle").value = s.subtitle || "";
  f("intro").value = s.intro || "";

  el.querySelector('[data-act="save"]').addEventListener("click", async () => {
    const spin = el.querySelector("[data-spin]");
    const payload = {
      title: f("title").value.trim(),
      subtitle: f("subtitle").value.trim(),
      intro: f("intro").value.trim(),
    };
    if (!payload.title) return showToast("El título es obligatorio");
    spin.classList.remove("hide");
    try {
      await api(`/api/admin/service-texts/${s.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      showToast("Guardado ✓");
    } catch (err) {
      showToast(err.message);
    } finally {
      spin.classList.add("hide");
    }
  });

  return el;
}

// ── INICIO: ¿hay sesión? ──
(async function init() {
  try {
    await api("/api/admin/me");
    showPanel();
    loadProducts();
  } catch {
    showLogin();
  }
})();
