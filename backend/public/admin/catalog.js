// Panel admin HISTECH — sección "Tienda" (catálogo de productos).
// Vanilla JS, igual que app.js: usa sus utilidades globales ($, showToast, showLogin)
// y los helpers puros de catalog-utils.js (CatalogUtils). Todo el DOM se construye con
// textContent/value (sin innerHTML con datos) para no interpretar contenido del catálogo.
(function () {
  const U = window.CatalogUtils;
  const API = "/api/admin/catalog";
  const PAGE_SIZE = 20;
  const SEO_TITLE_IDEAL = 60;
  const SEO_DESC_IDEAL = 160;

  const state = {
    sub: "products",
    categories: [],
    brands: [],
    showPrices: true,
    list: { page: 1, q: "", status: "", category: "" },
  };

  // ── Utilidades ──
  function h(tag, props, ...children) {
    const node = document.createElement(tag);
    const late = {};
    for (const [key, val] of Object.entries(props || {})) {
      if (key === "class") node.className = val;
      else if (key === "value" || key === "checked") late[key] = val;
      else if (key.startsWith("on")) node.addEventListener(key.slice(2), val);
      else if (val === false || val === null || val === undefined) continue;
      else node.setAttribute(key, val === true ? "" : val);
    }
    for (const child of children.flat()) {
      if (child === null || child === undefined || child === false) continue;
      node.append(child.nodeType ? child : document.createTextNode(String(child)));
    }
    if ("value" in late) node.value = late.value ?? "";
    if ("checked" in late) node.checked = Boolean(late.checked);
    return node;
  }

  const field = (label, control, hint) =>
    h("div", { class: "cat-field" }, h("div", { class: "pv-fieldlabel" }, label), control, hint ? h("div", { class: "cat-hint" }, hint) : null);

  const select = (options, value, props) =>
    h("select", { ...props, value }, options.map(([val, text]) => h("option", { value: val }, text)));

  const availabilityOptions = () => Object.entries(U.AVAILABILITY_LABELS);
  const statusOptions = () => Object.entries(U.STATUS_LABELS);

  async function capi(path, opts) {
    const res = await fetch(API + path, { credentials: "include", ...(opts || {}) });
    if (res.status === 401) {
      showLogin();
      throw new Error("No autenticado");
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const detail = Array.isArray(data.details) && data.details[0] && data.details[0].message;
      throw new Error(detail ? (data.error || "Error") + ": " + detail : data.error || "Error en la solicitud");
    }
    return data;
  }

  const send = (method, path, body) =>
    capi(path, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

  async function uploadFile(kind, file) {
    const form = new FormData();
    form.append(kind === "image" ? "image" : "datasheet", file);
    const { url } = await capi("/upload/" + kind, { method: "POST", body: form });
    return url;
  }

  // Contador de caracteres en vivo para los campos SEO.
  function withCounter(control, ideal) {
    const counter = h("span", { class: "cat-counter" });
    const update = () => {
      const c = U.counterState(control.value, ideal);
      counter.textContent = c.text;
      counter.classList.toggle("over", c.level === "over");
    };
    control.addEventListener("input", update);
    update();
    return h("div", {}, control, counter);
  }

  async function loadTaxonomy() {
    const [categories, brands, settings] = await Promise.all([
      capi("/categories"),
      capi("/brands"),
      capi("/settings"),
    ]);
    state.categories = categories;
    state.brands = brands;
    state.showPrices = settings.showPrices;
  }

  // ── Sub-pestañas ──
  const SUBS = [
    ["products", "Productos"],
    ["categories", "Categorías"],
    ["brands", "Marcas"],
    ["settings", "Ajustes"],
  ];

  function renderSubtabs() {
    const bar = $("catSubtabs");
    bar.replaceChildren(
      ...SUBS.map(([key, label]) =>
        h(
          "button",
          {
            class: "subtab" + (state.sub === key ? " active" : ""),
            type: "button",
            onclick: () => {
              state.sub = key;
              renderSubtabs();
              renderPanel();
            },
          },
          label,
        ),
      ),
    );
  }

  function renderPanel() {
    const panel = $("catPanel");
    panel.replaceChildren();
    if (state.sub === "products") return renderProducts(panel);
    if (state.sub === "categories") return renderTaxonomy(panel, "categories");
    if (state.sub === "brands") return renderTaxonomy(panel, "brands");
    return renderSettings(panel);
  }

  // ── Productos: listado con edición rápida ──
  function renderProducts(panel) {
    const status = h("p", { class: "muted" }, "Cargando…");
    const tableHost = h("div", { class: "table-scroll" });
    const pager = h("div", { class: "row cat-pager" });
    let debounce;

    const search = h("input", {
      placeholder: "Buscar por nombre, modelo, SKU o marca",
      value: state.list.q,
      oninput: (e) => {
        clearTimeout(debounce);
        debounce = setTimeout(() => {
          state.list.q = e.target.value.trim();
          state.list.page = 1;
          loadList();
        }, 300);
      },
    });
    const statusFilter = select([["", "Todos los estados"], ...statusOptions()], state.list.status, {
      onchange: (e) => {
        state.list.status = e.target.value;
        state.list.page = 1;
        loadList();
      },
    });
    const categoryFilter = select(
      [["", "Todas las categorías"], ...state.categories.map((c) => [c.slug, c.name])],
      state.list.category,
      {
        onchange: (e) => {
          state.list.category = e.target.value;
          state.list.page = 1;
          loadList();
        },
      },
    );

    const toolbar = h(
      "div",
      { class: "cat-toolbar" },
      h("div", { class: "cat-search" }, search),
      statusFilter,
      categoryFilter,
      h(
        "button",
        { class: "primary", type: "button", onclick: () => openEditor(null) },
        "+ Nuevo producto",
      ),
    );

    panel.append(toolbar, status, tableHost, pager);

    async function loadList() {
      status.textContent = "Cargando…";
      const params = new URLSearchParams({ page: state.list.page, pageSize: PAGE_SIZE });
      if (state.list.q) params.set("q", state.list.q);
      if (state.list.status) params.set("status", state.list.status);
      if (state.list.category) params.set("category", state.list.category);
      try {
        const data = await capi("/products?" + params);
        const pages = Math.max(1, Math.ceil(data.total / data.pageSize));
        status.textContent = data.total + " producto(s). Edita precio y disponibilidad directamente en la fila.";
        tableHost.replaceChildren(productTable(data.items, loadList));
        pager.replaceChildren(
          h("button", { class: "ghost", type: "button", disabled: data.page <= 1, onclick: () => goTo(data.page - 1) }, "← Anterior"),
          h("span", { class: "muted", style: "text-align:center" }, "Página " + data.page + " de " + pages),
          h("button", { class: "ghost", type: "button", disabled: data.page >= pages, onclick: () => goTo(data.page + 1) }, "Siguiente →"),
        );
      } catch (err) {
        status.textContent = err.message;
      }
    }
    const goTo = (page) => {
      state.list.page = page;
      loadList();
    };

    loadList();
  }

  function productTable(items, reload) {
    if (!items.length) return h("p", { class: "muted" }, "No hay productos con estos filtros.");
    return h(
      "table",
      { class: "cat-table" },
      h(
        "thead",
        {},
        h(
          "tr",
          {},
          ["Producto", "Precio sin IVA (COP)", "Disponibilidad", "Estado", ""].map((t) => h("th", {}, t)),
        ),
      ),
      h("tbody", {}, items.map((p) => productRow(p, reload))),
    );
  }

  function productRow(p, reload) {
    const price = h("input", {
      class: "cat-price",
      inputmode: "numeric",
      placeholder: "Sin precio",
      "aria-label": "Precio sin IVA (COP)",
      value: p.priceCop ?? "",
    });
    const consult = h("input", { type: "checkbox", checked: p.consultPrice });
    const availability = select(availabilityOptions(), p.availability, { "aria-label": "Disponibilidad" });
    const save = h("button", { class: "primary", type: "button", disabled: true }, "Guardar");
    const dirty = () => {
      save.disabled = false;
    };
    [price, consult, availability].forEach((c) => c.addEventListener("input", dirty));

    save.addEventListener("click", async () => {
      const parsed = U.parsePriceInput(price.value);
      if (!parsed.ok) return showToast(parsed.error);
      save.disabled = true;
      try {
        await send("PATCH", "/products/" + p.id, {
          priceCop: parsed.value,
          consultPrice: consult.checked,
          availability: availability.value,
        });
        showToast("Guardado ✓");
        reload();
      } catch (err) {
        save.disabled = false;
        showToast(err.message);
      }
    });

    const published = p.status === "published";
    const toggle = h(
      "button",
      {
        class: "ghost",
        type: "button",
        onclick: async () => {
          try {
            await send("PATCH", "/products/" + p.id, { status: published ? "draft" : "published" });
            showToast(published ? "Despublicado" : "Publicado ✓");
            reload();
          } catch (err) {
            showToast(err.message);
          }
        },
      },
      published ? "Despublicar" : "Publicar",
    );

    const meta = [p.model, p.sku, p.brand && p.brand.name, p.category && p.category.name].filter(Boolean).join(" · ");
    return h(
      "tr",
      {},
      h(
        "td",
        {},
        h("div", { class: "text-slug" }, p.name),
        h("div", { class: "muted cat-meta" }, meta || "—"),
        h("div", { class: "muted cat-meta" }, "/tienda/producto/" + p.slug),
      ),
      h(
        "td",
        {},
        price,
        h("label", { class: "cat-check" }, consult, " Consultar precio"),
      ),
      h("td", {}, availability),
      h("td", {}, h("span", { class: "cat-badge " + p.status }, U.STATUS_LABELS[p.status]), toggle),
      h(
        "td",
        { class: "cat-actions" },
        save,
        h("button", { class: "ghost", type: "button", onclick: () => openEditor(p) }, "Editar"),
        h(
          "button",
          {
            class: "danger",
            type: "button",
            onclick: async () => {
              if (!confirm("¿Eliminar este producto?")) return;
              try {
                await capi("/products/" + p.id, { method: "DELETE" });
                showToast("Eliminado");
                reload();
              } catch (err) {
                showToast(err.message);
              }
            },
          },
          "Eliminar",
        ),
      ),
    );
  }

  // ── Productos: editor completo ──
  function openEditor(product) {
    const panel = $("catPanel");
    const isNew = !product;
    const f = {
      name: product ? product.name : "",
      slug: product ? product.slug : "",
      categoryId: product ? product.categoryId : state.categories[0] ? state.categories[0].id : "",
      brandId: product ? product.brandId || "" : "",
      model: product ? product.model || "" : "",
      sku: product ? product.sku || "" : "",
      shortDescription: product ? product.shortDescription || "" : "",
      description: product ? product.description || "" : "",
      priceCop: product && product.priceCop ? String(product.priceCop) : "",
      consultPrice: product ? product.consultPrice : false,
      availability: product ? product.availability : "on_request",
      status: product ? product.status : "draft",
      featured: product ? product.featured : false,
      seoTitle: product ? product.seoTitle || "" : "",
      seoDescription: product ? product.seoDescription || "" : "",
      datasheetUrl: product ? product.datasheetUrl || "" : "",
      specs: product ? product.specs.map((s) => ({ ...s })) : [],
      images: product ? product.images.map((i) => ({ ...i })) : [],
    };

    const bind = (key, control, event) => {
      control.addEventListener(event || "input", () => {
        f[key] = control.type === "checkbox" ? control.checked : control.value;
      });
      return control;
    };

    const err = h("div", { class: "err" });
    const slugPreview = h("span", { class: "muted" });
    const updateSlug = () => {
      slugPreview.textContent = "/tienda/producto/" + (f.slug.trim() || "(se genera del nombre al guardar)");
    };

    const nameInput = bind("name", h("input", { value: f.name, placeholder: "Nombre del producto" }));
    const slugInput = bind("slug", h("input", { value: f.slug, placeholder: "Se genera automáticamente" }));
    slugInput.addEventListener("input", updateSlug);
    updateSlug();

    const categorySelect = bind(
      "categoryId",
      select(
        state.categories.length ? state.categories.map((c) => [c.id, c.name]) : [["", "Crea una categoría primero"]],
        f.categoryId,
      ),
      "change",
    );
    const brandSelect = bind("brandId", select([["", "Sin marca"], ...state.brands.map((b) => [b.id, b.name])], f.brandId), "change");

    // Imágenes: lista ordenable con texto alternativo.
    const imagesHost = h("div", { class: "cat-list" });
    const renderImages = () => {
      imagesHost.replaceChildren(
        ...f.images.map((img, i) => {
          const thumb = h("img", { class: "cat-thumb", alt: "" });
          if (img.url) thumb.src = img.url;
          const url = h("input", {
            value: img.url,
            placeholder: "https://…",
            oninput: (e) => {
              img.url = e.target.value;
              thumb.src = img.url;
            },
          });
          const alt = h("input", {
            value: img.alt,
            placeholder: "Texto alternativo (describe la imagen)",
            oninput: (e) => {
              img.alt = e.target.value;
            },
          });
          return h(
            "div",
            { class: "cat-item" },
            thumb,
            h("div", { class: "cat-item-fields" }, url, alt),
            rowControls(f.images, i, renderImages),
          );
        }),
      );
      if (!f.images.length) imagesHost.append(h("p", { class: "muted" }, "Sin imágenes. La primera será la principal."));
    };

    const imageFile = h("input", {
      type: "file",
      accept: "image/jpeg,image/png,image/webp",
      multiple: true,
      class: "hide",
      onchange: async (e) => {
        const files = [...e.target.files];
        e.target.value = "";
        for (const file of files) {
          showToast("Subiendo " + file.name + "…");
          try {
            f.images.push({ url: await uploadFile("image", file), alt: "" });
            renderImages();
            showToast("Imagen subida ✓");
          } catch (e2) {
            showToast(e2.message);
          }
        }
      },
    });

    // Especificaciones: filas etiqueta/valor ordenables.
    const specsHost = h("div", { class: "cat-list" });
    const renderSpecs = () => {
      specsHost.replaceChildren(
        ...f.specs.map((spec, i) =>
          h(
            "div",
            { class: "cat-item" },
            h(
              "div",
              { class: "cat-item-fields cat-kv" },
              h("input", { value: spec.label, placeholder: "Característica (ej. Puertos LAN)", oninput: (e) => (spec.label = e.target.value) }),
              h("input", { value: spec.value, placeholder: "Valor (ej. 4 x Gigabit)", oninput: (e) => (spec.value = e.target.value) }),
            ),
            rowControls(f.specs, i, renderSpecs),
          ),
        ),
      );
      if (!f.specs.length) specsHost.append(h("p", { class: "muted" }, "Sin especificaciones."));
    };

    // Ficha técnica (PDF).
    const datasheetInput = bind("datasheetUrl", h("input", { value: f.datasheetUrl, placeholder: "https://…/ficha.pdf" }));
    const datasheetFile = h("input", {
      type: "file",
      accept: "application/pdf",
      class: "hide",
      onchange: async (e) => {
        const file = e.target.files[0];
        e.target.value = "";
        if (!file) return;
        showToast("Subiendo ficha técnica…");
        try {
          f.datasheetUrl = await uploadFile("datasheet", file);
          datasheetInput.value = f.datasheetUrl;
          showToast("Ficha técnica subida ✓");
        } catch (e2) {
          showToast(e2.message);
        }
      },
    });

    const seoTitle = bind("seoTitle", h("input", { value: f.seoTitle, placeholder: "Título para buscadores" }));
    const seoDescription = bind("seoDescription", h("textarea", { value: f.seoDescription, rows: 3, placeholder: "Descripción para buscadores" }));

    const save = h("button", { class: "primary", type: "button" }, isNew ? "Crear producto" : "Guardar cambios");
    save.addEventListener("click", async () => {
      err.textContent = "";
      const built = U.buildProductPayload(f);
      if (!built.ok) {
        err.textContent = built.error;
        return showToast(built.error);
      }
      save.disabled = true;
      try {
        if (isNew) await send("POST", "/products", built.payload);
        else await send("PUT", "/products/" + product.id, built.payload);
        showToast("Guardado ✓");
        closeEditor();
      } catch (e) {
        err.textContent = e.message;
        showToast(e.message);
      } finally {
        save.disabled = false;
      }
    });

    const closeEditor = () => renderPanel();

    const card = h(
      "div",
      { class: "card" },
      h("div", { class: "pv-eyebrow" }, isNew ? "Nuevo producto" : "Editar producto"),
      field("Nombre *", nameInput),
      h(
        "div",
        { class: "row" },
        field("Categoría *", categorySelect),
        field("Marca", brandSelect),
      ),
      h(
        "div",
        { class: "row" },
        field("Modelo", bind("model", h("input", { value: f.model }))),
        field("SKU (único)", bind("sku", h("input", { value: f.sku }))),
      ),
      field("URL del producto (slug)", slugInput, slugPreview),
      field("Descripción corta", bind("shortDescription", h("textarea", { value: f.shortDescription, rows: 2 }))),
      field(
        "Descripción completa (Markdown: ## Subtítulo, **negrita**, listas con -)",
        bind("description", h("textarea", { value: f.description, rows: 8 })),
      ),

      h("hr", { class: "pv-divider" }),
      h("div", { class: "pv-eyebrow" }, "Precio y disponibilidad"),
      h(
        "div",
        { class: "row" },
        field(
          "Precio sin IVA (COP)",
          bind("priceCop", h("input", { value: f.priceCop, inputmode: "numeric", placeholder: "Ej. 1500000 (vacío = sin precio)" })),
          "Entero en pesos colombianos, sin IVA ni decimales.",
        ),
        field("Disponibilidad", bind("availability", select(availabilityOptions(), f.availability), "change")),
        field("Estado", bind("status", select(statusOptions(), f.status), "change")),
      ),
      h(
        "div",
        { class: "cat-checks" },
        h("label", { class: "cat-check" }, bind("consultPrice", h("input", { type: "checkbox", checked: f.consultPrice }), "change"), " Consultar precio (no mostrar el precio al público)"),
        h("label", { class: "cat-check" }, bind("featured", h("input", { type: "checkbox", checked: f.featured }), "change"), " Producto destacado"),
      ),

      h("hr", { class: "pv-divider" }),
      h("div", { class: "pv-eyebrow" }, "Imágenes"),
      imagesHost,
      h(
        "div",
        { class: "card-actions" },
        h("button", { class: "ghost", type: "button", onclick: () => imageFile.click() }, "Subir imágenes…"),
        h("button", { class: "ghost", type: "button", onclick: () => { f.images.push({ url: "", alt: "" }); renderImages(); } }, "+ Agregar por URL"),
        imageFile,
      ),

      h("hr", { class: "pv-divider" }),
      h("div", { class: "pv-eyebrow" }, "Especificaciones técnicas"),
      specsHost,
      h("div", { class: "card-actions" }, h("button", { class: "ghost", type: "button", onclick: () => { f.specs.push({ label: "", value: "" }); renderSpecs(); } }, "+ Agregar especificación")),

      h("hr", { class: "pv-divider" }),
      h("div", { class: "pv-eyebrow" }, "Ficha técnica (PDF)"),
      field("URL de la ficha técnica", datasheetInput),
      h(
        "div",
        { class: "card-actions" },
        h("button", { class: "ghost", type: "button", onclick: () => datasheetFile.click() }, "Subir PDF…"),
        h("button", { class: "ghost", type: "button", onclick: () => { f.datasheetUrl = ""; datasheetInput.value = ""; } }, "Quitar"),
        datasheetFile,
      ),

      h("hr", { class: "pv-divider" }),
      h("div", { class: "pv-eyebrow" }, "SEO"),
      field("Título SEO (recomendado: hasta " + SEO_TITLE_IDEAL + " caracteres)", withCounter(seoTitle, SEO_TITLE_IDEAL)),
      field("Descripción SEO (recomendado: hasta " + SEO_DESC_IDEAL + " caracteres)", withCounter(seoDescription, SEO_DESC_IDEAL)),

      h("hr", { class: "pv-divider" }),
      err,
      h("div", { class: "card-actions" }, save, h("button", { class: "ghost", type: "button", onclick: closeEditor }, "Cancelar")),
    );

    renderImages();
    renderSpecs();
    panel.replaceChildren(h("button", { class: "ghost", type: "button", onclick: closeEditor }, "← Volver al listado"), card);
    card.scrollIntoView({ block: "start" });
  }

  // Botones ↑ ↓ Quitar para filas ordenables (modifican `list` en sitio).
  function rowControls(list, index, rerender) {
    const move = (delta) => {
      const next = U.moveItem(list, index, delta);
      list.splice(0, list.length, ...next);
      rerender();
    };
    return h(
      "div",
      { class: "cat-row-controls" },
      h("button", { class: "ghost", type: "button", title: "Subir", disabled: index === 0, onclick: () => move(-1) }, "↑"),
      h("button", { class: "ghost", type: "button", title: "Bajar", disabled: index === list.length - 1, onclick: () => move(1) }, "↓"),
      h("button", { class: "danger", type: "button", onclick: () => { list.splice(index, 1); rerender(); } }, "Quitar"),
    );
  }

  // ── Categorías y marcas ──
  const TAXONOMY = {
    categories: {
      path: "/categories",
      singular: "categoría",
      addLabel: "+ Nueva categoría",
      urlPrefix: "/tienda/",
      fields: [
        { key: "name", label: "Nombre *", type: "text", required: true },
        { key: "slug", label: "URL (slug)", type: "text", hint: "Déjalo vacío para generarlo del nombre." },
        { key: "description", label: "Descripción", type: "textarea" },
        { key: "sortOrder", label: "Orden", type: "number" },
        { key: "seoTitle", label: "Título SEO", type: "text", counter: SEO_TITLE_IDEAL },
        { key: "seoDescription", label: "Descripción SEO", type: "textarea", counter: SEO_DESC_IDEAL },
      ],
      blank: { name: "", slug: "", description: "", sortOrder: 0, seoTitle: "", seoDescription: "" },
    },
    brands: {
      path: "/brands",
      singular: "marca",
      addLabel: "+ Nueva marca",
      urlPrefix: "",
      fields: [
        { key: "name", label: "Nombre *", type: "text", required: true },
        { key: "slug", label: "URL (slug)", type: "text", hint: "Déjalo vacío para generarlo del nombre." },
        { key: "logoUrl", label: "Logo (URL o subir imagen)", type: "image" },
      ],
      blank: { name: "", slug: "", logoUrl: "" },
    },
  };

  function renderTaxonomy(panel, kind) {
    const cfg = TAXONOMY[kind];
    const grid = h("div", { class: "grid", style: "grid-template-columns:1fr" });
    const status = h("p", { class: "muted" });

    const refresh = async () => {
      state[kind] = await capi(cfg.path);
      grid.replaceChildren(...state[kind].map((item) => taxonomyCard(kind, cfg, item, refresh)));
      status.textContent = state[kind].length + " registro(s).";
    };

    panel.append(
      h("div", { class: "tabhead" }, h("button", { class: "ghost", type: "button", onclick: () => grid.prepend(taxonomyCard(kind, cfg, null, refresh)) }, cfg.addLabel)),
      status,
      grid,
    );
    refresh().catch((e) => (status.textContent = e.message));
  }

  function taxonomyCard(kind, cfg, item, refresh) {
    const values = item ? { ...item } : { ...cfg.blank };
    const controls = {};
    const rows = cfg.fields.map((spec) => {
      let control;
      if (spec.type === "textarea") control = h("textarea", { rows: 2, value: values[spec.key] ?? "" });
      else if (spec.type === "number") control = h("input", { type: "number", value: values[spec.key] ?? 0 });
      else control = h("input", { value: values[spec.key] ?? "" });
      controls[spec.key] = control;

      let body = spec.counter ? withCounter(control, spec.counter) : control;
      if (spec.type === "image") {
        const file = h("input", {
          type: "file",
          accept: "image/jpeg,image/png,image/webp",
          class: "hide",
          onchange: async (e) => {
            const picked = e.target.files[0];
            e.target.value = "";
            if (!picked) return;
            showToast("Subiendo imagen…");
            try {
              control.value = await uploadFile("image", picked);
              showToast("Imagen subida ✓");
            } catch (err) {
              showToast(err.message);
            }
          },
        });
        body = h("div", {}, control, h("div", { class: "card-actions" }, h("button", { class: "ghost", type: "button", onclick: () => file.click() }, "Subir imagen…"), file));
      }
      return field(spec.label, body, spec.hint);
    });

    const spin = h("span", { class: "spinner hide" }, "Guardando…");
    const save = h("button", { class: "primary", type: "button" }, "Guardar");
    const card = h(
      "div",
      { class: "card" },
      ...rows,
      h("hr", { class: "pv-divider" }),
      h(
        "div",
        { class: "card-actions" },
        save,
        h(
          "button",
          {
            class: "danger",
            type: "button",
            onclick: async () => {
              if (!confirm("¿Eliminar esta " + cfg.singular + "?")) return;
              if (!item) return card.remove();
              try {
                await capi(cfg.path + "/" + item.id, { method: "DELETE" });
                showToast("Eliminada");
                await refresh();
              } catch (err) {
                showToast(err.message);
              }
            },
          },
          "Eliminar",
        ),
        spin,
      ),
    );

    save.addEventListener("click", async () => {
      const payload = {};
      for (const spec of cfg.fields) {
        const raw = controls[spec.key].value;
        if (spec.type === "number") payload[spec.key] = raw === "" ? 0 : Number(raw);
        else if (spec.key === "slug") {
          if (raw.trim()) payload.slug = raw.trim();
        } else payload[spec.key] = raw.trim();
      }
      if (!payload.name) return showToast("El nombre es obligatorio");
      spin.classList.remove("hide");
      try {
        if (item) await send("PUT", cfg.path + "/" + item.id, payload);
        else await send("POST", cfg.path, payload);
        showToast("Guardado ✓");
        await refresh();
      } catch (err) {
        showToast(err.message);
      } finally {
        spin.classList.add("hide");
      }
    });
    return card;
  }

  // ── Ajustes globales ──
  function renderSettings(panel) {
    const toggle = h("input", { type: "checkbox", checked: state.showPrices });
    const save = h("button", { class: "primary", type: "button" }, "Guardar");
    save.addEventListener("click", async () => {
      save.disabled = true;
      try {
        const out = await send("PUT", "/settings", { showPrices: toggle.checked });
        state.showPrices = out.showPrices;
        showToast("Guardado ✓");
      } catch (err) {
        showToast(err.message);
      } finally {
        save.disabled = false;
      }
    });
    panel.append(
      h(
        "div",
        { class: "card" },
        h("div", { class: "pv-eyebrow" }, "Precios"),
        h("label", { class: "cat-check" }, toggle, " Mostrar precios en la tienda"),
        h(
          "p",
          { class: "muted" },
          "Los precios se publican siempre sin IVA. Si lo desactivas, todos los productos muestran «Consultar precio», aunque tengan un precio guardado.",
        ),
        h("div", { class: "card-actions" }, save),
      ),
    );
  }

  // ── Punto de entrada (lo llama app.js al abrir la pestaña) ──
  window.loadCatalog = async function loadCatalog() {
    const status = $("catStatus");
    status.textContent = "Cargando…";
    try {
      await loadTaxonomy();
      status.textContent = "";
      renderSubtabs();
      renderPanel();
    } catch (err) {
      catalogLoaded = false; // permitir reintento
      status.textContent = err.message;
    }
  };
})();
