// Panel admin HISTECH — vanilla JS. Mismo origen que la API (cookies httpOnly).
const $ = (id) => document.getElementById(id);
const ICONS = [
  "ShieldCheck", "Cloud", "Workflow", "Server", "BrainCircuit", "Activity",
  "Network", "Cpu", "Layers", "Lightbulb", "Sparkles", "Settings2", "Shield",
  "Calculator", "TrendingUp", "Target", "Banknote", "Briefcase", "ShoppingBag",
  "HeartHandshake", "Award",
];
let textsLoaded = false; // los textos de páginas se cargan al abrir su pestaña
let blogLoaded = false; // las entradas del blog se cargan al abrir su pestaña
let casesLoaded = false; // los casos de éxito se cargan al abrir su pestaña

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
  casesLoaded = false;
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
    <input data-f="badge" placeholder="Categoría (badge)"
      style="text-transform:uppercase;letter-spacing:.06em;font-size:11px;font-weight:700;color:var(--purple);border-color:transparent;padding:4px 0;margin-top:12px;" />
    <div class="pv-title"><input data-f="title" placeholder="Título del producto" /></div>
    <div class="pv-fieldlabel">Texto breve</div>
    <textarea data-f="excerpt" placeholder="Descripción corta de la tarjeta"></textarea>

    <hr class="pv-divider" />
    <div class="pv-fieldlabel">Imagen (súbela o pega una URL)</div>
    <div class="row">
      <button class="ghost" data-act="upload" type="button">Subir imagen…</button>
      <input type="file" accept="image/*" class="hide" data-f="file" />
    </div>
    <input data-f="image" placeholder="https://…" style="margin-top:10px" />
    <div class="row">
      <div>
        <div class="pv-fieldlabel">Ícono (se usa si no hay imagen)</div>
        <input data-f="icon" list="iconlist" />
      </div>
      <div>
        <div class="pv-fieldlabel">Orden</div>
        <input data-f="position" type="number" />
      </div>
    </div>
    <div class="pv-fieldlabel">Enlace "Leer más" (opcional)</div>
    <input data-f="href" placeholder="/servicios" />
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
    $("tab-cases").classList.toggle("hide", tab !== "cases");
    $("tab-blog").classList.toggle("hide", tab !== "blog");
    if (tab === "texts" && !textsLoaded) {
      textsLoaded = true;
      loadServiceTexts();
    }
    if (tab === "cases" && !casesLoaded) {
      casesLoaded = true;
      loadCases();
    }
    if (tab === "blog" && !blogLoaded) {
      blogLoaded = true;
      loadBlog();
    }
  });
});

// ── CASOS DE ÉXITO ──
$("addCaseBtn").addEventListener("click", () => {
  $("casesGrid").prepend(
    renderCaseCard({
      slug: "", title: "", category: "", icon: "Target",
      challenge: "", solution: "", result: "", metric: "", metricLabel: "",
      tech: [], relatedServices: [],
    }),
  );
});

async function loadCases() {
  $("casesStatus").textContent = "Cargando…";
  try {
    const items = await api("/api/admin/cases");
    const grid = $("casesGrid");
    grid.innerHTML = "";
    items.forEach((c) => grid.appendChild(renderCaseCard(c)));
    $("casesStatus").textContent = `${items.length} caso(s). Usa "+ Nuevo caso de éxito" para agregar, o edita y guarda.`;
  } catch (err) {
    casesLoaded = false; // permitir reintento
    $("casesStatus").textContent = err.message;
  }
}

function renderCaseCard(c) {
  const el = document.createElement("div");
  el.className = "card";
  el.dataset.slug = c.slug || "";
  el.innerHTML = `
    <div class="pv-url" data-url></div>
    <div class="pv-head">
      <div class="pv-icon" title="Ícono">
        <input data-f="icon" list="iconlist" />
      </div>
      <div class="pv-grow">
        <input data-f="category" placeholder="Categoría (etiqueta)"
          style="text-transform:uppercase;letter-spacing:.06em;font-size:11px;font-weight:700;color:var(--purple);border-color:transparent;padding:4px 0;" />
        <div class="pv-title"><input data-f="title" placeholder="Título del caso" /></div>
      </div>
      <div class="pv-metricbox">
        <input data-f="metric" placeholder="+21.000" />
        <input data-f="metricLabel" placeholder="estaciones en 27 países" />
      </div>
    </div>

    <div class="pv-cols">
      <div class="pv-col">
        <h4>El reto</h4>
        <textarea data-f="challenge" placeholder="Problema / situación inicial"></textarea>
      </div>
      <div class="pv-col">
        <h4>La solución</h4>
        <textarea data-f="solution" placeholder="Qué hizo HISTECH, tecnología aplicada"></textarea>
      </div>
      <div class="pv-col result">
        <h4>El resultado</h4>
        <textarea data-f="result" placeholder="Impacto final medible"></textarea>
      </div>
    </div>

    <div class="pv-fieldlabel">Tecnologías (separadas por coma) — así se verán:</div>
    <input data-f="tech" placeholder="RPA, PostgreSQL, Next.js" />
    <div class="pv-chips" data-chips></div>

    <div class="pv-fieldlabel">Soluciones aplicadas (slugs de servicio, separados por coma)</div>
    <input data-f="relatedServices" placeholder="automatizacion-empresarial, ciberseguridad" />

    <hr class="pv-divider" />
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
      ? `Se verá en: <b>/casos-de-exito#${slug}</b>`
      : `Nuevo caso — la URL se generará del título al guardar`;
  };
  // Chips de tecnologías en vivo (se ven igual que en la web).
  const chipsEl = el.querySelector("[data-chips]");
  const renderChips = (val) => {
    const list = String(val || "")
      .split(/[,\n]/)
      .map((s) => s.trim())
      .filter(Boolean);
    chipsEl.innerHTML = list.map((t) => `<span class="pv-chip">${t}</span>`).join("");
  };

  f("title").value = c.title || "";
  f("category").value = c.category || "";
  f("icon").value = c.icon || "Target";
  f("challenge").value = c.challenge || "";
  f("solution").value = c.solution || "";
  f("result").value = c.result || "";
  f("metric").value = c.metric || "";
  f("metricLabel").value = c.metricLabel || "";
  f("tech").value = Array.isArray(c.tech) ? c.tech.join(", ") : (c.tech || "");
  f("relatedServices").value = Array.isArray(c.relatedServices)
    ? c.relatedServices.join(", ")
    : (c.relatedServices || "");
  renderChips(f("tech").value);
  f("tech").addEventListener("input", () => renderChips(f("tech").value));
  setUrl();

  el.querySelector('[data-act="save"]').addEventListener("click", async () => {
    const spin = el.querySelector("[data-spin]");
    const payload = {
      title: f("title").value.trim(),
      category: f("category").value.trim(),
      icon: f("icon").value.trim() || "Target",
      challenge: f("challenge").value.trim(),
      solution: f("solution").value.trim(),
      result: f("result").value.trim(),
      metric: f("metric").value.trim(),
      metricLabel: f("metricLabel").value.trim(),
      tech: f("tech").value,
      relatedServices: f("relatedServices").value,
    };
    if (!payload.title) return showToast("El título es obligatorio");
    spin.classList.remove("hide");
    try {
      const slug = el.dataset.slug;
      const saved = slug
        ? await api(`/api/admin/cases/${slug}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
        : await api("/api/admin/cases", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      el.dataset.slug = saved.slug;
      setUrl();
      showToast("Guardado ✓");
    } catch (err) {
      showToast(err.message);
    } finally {
      spin.classList.add("hide");
    }
  });

  el.querySelector('[data-act="delete"]').addEventListener("click", async () => {
    const slug = el.dataset.slug;
    if (!confirm("¿Eliminar este caso de éxito?")) return;
    if (!slug) return el.remove(); // nuevo sin guardar
    try {
      await api(`/api/admin/cases/${slug}`, { method: "DELETE" });
      el.remove();
      showToast("Eliminado");
    } catch (err) {
      showToast(err.message);
    }
  });

  return el;
}

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
    <div class="pv-url" data-url></div>
    <input data-f="category" placeholder="Categoría"
      style="text-transform:uppercase;letter-spacing:.06em;font-size:11px;font-weight:700;color:var(--purple);border-color:transparent;padding:4px 0;" />
    <div class="pv-title"><input data-f="title" placeholder="Título de la entrada" /></div>
    <div class="pv-fieldlabel">Descripción (resumen corto para la tarjeta del blog)</div>
    <textarea data-f="description" rows="2"></textarea>
    <div class="row">
      <div>
        <div class="pv-fieldlabel">Autor</div>
        <input data-f="author" />
      </div>
      <div>
        <div class="pv-fieldlabel">Fecha</div>
        <input data-f="date" type="date" />
      </div>
    </div>
    <div class="pv-fieldlabel">Contenido (Markdown: <code>## Subtítulo</code>, <code>**negrita**</code>, listas con <code>-</code> o <code>1.</code>, <code>&gt; cita</code>, <code>[enlace](/ruta)</code>)</div>
    <textarea data-f="content" rows="14"></textarea>
    <hr class="pv-divider" />
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
    <div class="pv-url">Página: <b>/${s.slug}</b></div>
    <div class="pv-eyebrow">${s.name || s.slug}</div>
    <div class="pv-fieldlabel">Título (encabezado grande de la página)</div>
    <textarea data-f="title" rows="2"></textarea>
    <div class="pv-fieldlabel">Subtítulo (frase de apoyo bajo el título)</div>
    <textarea data-f="subtitle" rows="3"></textarea>
    <div class="pv-fieldlabel">Texto introductorio (primer párrafo de la página)</div>
    <textarea data-f="intro" rows="5"></textarea>
    <hr class="pv-divider" />
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
