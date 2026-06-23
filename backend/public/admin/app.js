// Panel admin HISTECH — vanilla JS. Mismo origen que la API (cookies httpOnly).
const $ = (id) => document.getElementById(id);
const ICONS = [
  "ShieldCheck", "Cloud", "Workflow", "Server", "BrainCircuit", "Activity",
  "Network", "Cpu", "Layers", "Lightbulb", "Sparkles", "Settings2", "Shield",
];

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
