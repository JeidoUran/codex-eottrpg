// scripts/archivist-ai/archivist-moment-loader.js
(() => {
  "use strict";

  const MOMENTS_INDEX_URL =
    "https://s3.codex.eottrpg.memiroa.com/data/archivist/moments/index.json";

  const MOMENT_CATEGORIES = [
    "Alliance",
    "Badass",
    "Banter",
    "Betrayal",
    "Chaos",
    "Combat",
    "Conflict",
    "Corruption",
    "Defeat",
    "Despair",
    "Destiny",
    "Discovery",
    "Exploration",
    "Friendship",
    "Growth",
    "Heroism",
    "Hijinx",
    "Intrigue",
    "Loot",
    "Loss",
    "Mystery",
    "Negotiation",
    "Redemption",
    "Revelation",
    "Revenge",
    "Ritual",
    "Romance",
    "Sacred",
    "Sacrifice",
    "Suspense",
    "Victory",
  ];

  // DOM
  const grid = document.getElementById("moments-grid");
  const paginationEl = document.getElementById("moments-pagination");

  const refreshBtn = document.getElementById("moments-refresh"); // <i>
  const modeBtn = document.getElementById("moments-mode"); // <i>

  const sessionSelect = document.getElementById("moments-session");
  const categorySelect = document.getElementById("moments-category");
  const amountSelect = document.getElementById("moments-amount");

  // state
  let ALL_MOMENTS = null;

  // "ordered" par défaut
  let mode = "ordered"; // "ordered" | "random"
  let page = 1;

  function escapeHtml(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function sampleUnique(arr, n) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, Math.min(n, copy.length));
  }

  async function loadAllMomentsOnce() {
    if (ALL_MOMENTS) return ALL_MOMENTS;

    const r = await fetch(MOMENTS_INDEX_URL, { cache: "no-store" });
    if (!r.ok) throw new Error(`Moments JSON HTTP ${r.status}`);

    const data = await r.json();
    ALL_MOMENTS = Array.isArray(data.moments) ? data.moments : [];
    return ALL_MOMENTS;
  }

  let SESSIONS_INDEX = null;

  async function loadSessionsIndexOnce() {
    if (SESSIONS_INDEX) return SESSIONS_INDEX;

    const r = await fetch(
      "https://s3.codex.eottrpg.memiroa.com/data/archivist/sessions/index.json",
      { cache: "no-store" }
    );

    if (!r.ok) throw new Error("Impossible de charger l’index des sessions");

    SESSIONS_INDEX = await r.json();
    return SESSIONS_INDEX;
  }

  function fillCategorySelectOnce() {
    if (categorySelect.options.length > 1) return;
    for (const c of MOMENT_CATEGORIES) {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      categorySelect.appendChild(opt);
    }
  }

  function fillAmountSelectOnce() {
    if (amountSelect.options.length > 1) return;
    // valeurs par défaut
    const values = [5, 10, 15, 20];
    for (const v of values) {
      const opt = document.createElement("option");
      opt.value = String(v);
      opt.textContent = String(v);
      amountSelect.appendChild(opt);
    }
    // default 5
    amountSelect.value = "5";
  }

  async function fillSessionSelectOnce(moments) {
    if (sessionSelect.options.length > 1) return;

    // On récupère l’index des sessions (déjà trié côté Netlify)
    const sessionsIndex = await loadSessionsIndexOnce();

    for (const s of sessionsIndex.sessions) {
      const opt = document.createElement("option");
      opt.value = s.id;
      opt.textContent = s.title;
      sessionSelect.appendChild(opt);
    }
  }

  function keepPaginationInView() {
    if (!paginationEl) return;

    // Petit délai pour laisser le DOM se recalculer (hauteurs variables)
    requestAnimationFrame(() => {
      paginationEl.scrollIntoView({
        behavior: "smooth",
        block: "center", // centre la pagination dans la fenêtre
      });
    });
  }

  function currentFilters() {
    const amount = parseInt(amountSelect.value || "5", 10);
    return {
      session_id: sessionSelect.value || "",
      category: categorySelect.value || "",
      amount: Number.isFinite(amount) && amount > 0 ? amount : 5,
    };
  }

  function applyFilters(moments, { session_id, category }) {
    let filtered = moments;

    if (session_id)
      filtered = filtered.filter((m) => m.session_id === session_id);
    if (category)
      filtered = filtered.filter(
        (m) => Array.isArray(m.categories) && m.categories.includes(category)
      );

    return filtered;
  }

  function sortByIndexAsc(moments) {
    return moments.slice().sort((a, b) => {
      const ai = a.index ?? Number.POSITIVE_INFINITY;
      const bi = b.index ?? Number.POSITIVE_INFINITY;
      return ai - bi;
    });
  }

  function updateModeButtonUI() {
    if (!modeBtn) return;
    if (mode === "ordered") {
      modeBtn.className = "fa-solid fa-list moments-mode";
      modeBtn.title = "Mode ordonné";
    } else {
      modeBtn.className = "fa-solid fa-shuffle moments-mode";
      modeBtn.title = "Mode aléatoire";
    }

    const title = document.querySelector(".moments-head h2");
    if (title)
      title.textContent =
        mode === "ordered"
          ? "Moments (ordre chronologique)"
          : "Moments (aléatoires)";
  }

  function renderCards(list) {
    if (!list.length) {
      grid.innerHTML = `<div class="moment-card">Aucun moment ne correspond à ces filtres.</div>`;
      return;
    }

    grid.innerHTML = list
      .map((m) => {
        const cats =
          Array.isArray(m.categories) && m.categories.length
            ? m.categories.join(" • ")
            : "";
        return `
        <article class="moment-card">
          <h3>${escapeHtml(m.label)}</h3>
          <div class="moment-meta">${cats ? escapeHtml(cats) : ""}</div>
          <p class="moment-content" data-raw="${escapeHtml(m.content || "")}">
            ${escapeHtml(m.content || "(Pas de contenu)")}
          </p>
        </article>
      `;
      })
      .join("");
  }

  function renderPagination(totalItems, perPage) {
    if (!paginationEl) return;

    // pagination visible uniquement en mode ordonné
    if (mode !== "ordered") {
      paginationEl.innerHTML = "";
      return;
    }

    const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
    if (totalPages <= 1) {
      paginationEl.innerHTML = "";
      return;
    }

    const clamp = (x) => Math.max(1, Math.min(totalPages, x));
    page = clamp(page);

    const prevDisabled = page <= 1;
    const nextDisabled = page >= totalPages;

    paginationEl.innerHTML = `
      <i ${prevDisabled ? "disabled" : ""} data-page="prev" class="fa-solid fa-angle-left moments-pagination-button"></i>
      <span>Page ${page} / ${totalPages}</span>
      <i ${nextDisabled ? "disabled" : ""} data-page="next" class="fa-solid fa-angle-right moments-pagination-button"></i>
    `;

    paginationEl
      .querySelector('[data-page="prev"]')
      ?.addEventListener("click", () => {
        page = Math.max(1, page - 1);
        refresh(false);
        keepPaginationInView();
      });

    paginationEl
      .querySelector('[data-page="next"]')
      ?.addEventListener("click", () => {
        page = page + 1;
        refresh(false);
        keepPaginationInView();
      });
  }

  async function applyWikilinks() {
    if (window.archivistReady) await window.archivistReady;
    window.archivistApplyWikilinks?.(grid);
  }

  // refresh(shuffleIfRandom = true)
  async function refresh(shuffleIfRandom = true) {
    grid.innerHTML = `<div class="moment-card">Chargement…</div>`;
    if (paginationEl) paginationEl.innerHTML = "";

    const moments = await loadAllMomentsOnce();
    fillSessionSelectOnce(moments);

    const filters = currentFilters();
    let filtered = applyFilters(moments, filters);

    if (mode === "random") {
      const picked = shuffleIfRandom
        ? sampleUnique(filtered, filters.amount)
        : filtered.slice(0, filters.amount);
      renderCards(picked);
      renderPagination(filtered.length, filters.amount); // videra car mode random
      await applyWikilinks();
      return;
    }

    // mode ordonné
    const ordered = sortByIndexAsc(filtered);

    const totalPages = Math.max(1, Math.ceil(ordered.length / filters.amount));
    if (page > totalPages) page = totalPages;

    const start = (page - 1) * filters.amount;
    const slice = ordered.slice(start, start + filters.amount);

    renderCards(slice);
    renderPagination(ordered.length, filters.amount);
    await applyWikilinks();
  }

  // events
  function onFiltersChanged() {
    page = 1;
    refresh(true);
  }

  function onAmountChanged() {
    page = 1;
    refresh(true);
  }

  function onRefreshClicked() {
    // en random: re-shuffle
    // en ordered: juste rerender (même page)
    refresh(mode === "random");
  }

  function onToggleMode() {
    mode = mode === "ordered" ? "random" : "ordered";
    page = 1;
    updateModeButtonUI();
    refresh(true);
  }

  // init
  fillCategorySelectOnce();
  fillAmountSelectOnce();
  updateModeButtonUI();

  sessionSelect?.addEventListener("change", onFiltersChanged);
  categorySelect?.addEventListener("change", onFiltersChanged);
  amountSelect?.addEventListener("change", onAmountChanged);

  refreshBtn?.addEventListener("click", onRefreshClicked);
  modeBtn?.addEventListener("click", onToggleMode);

  // première charge
  refresh(true);
})();
