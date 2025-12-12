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

const MOMENT_AMOUNT = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const SESSIONS_INDEX_URL =
  "https://s3.codex.eottrpg.memiroa.com/data/archivist/sessions/index.json";

let SESSION_NAME_BY_ID = null;
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

const grid = document.getElementById("moments-grid");
const btn = document.getElementById("moments-refresh");
const sessionSelect = document.getElementById("moments-session");
const categorySelect = document.getElementById("moments-category");
const amountSelect = document.getElementById("moments-amount");

let ALL_MOMENTS = null;

function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function setLoadingIcon(iconEl, isLoading) {
  if (!iconEl) return;

  if (isLoading) {
    iconEl.className = "fa-solid fa-spinner fa-spin refresh-moments";
    iconEl.style.pointerEvents = "none";
    iconEl.style.opacity = "0.7";
  } else {
    iconEl.className = "fa-solid fa-arrows-rotate refresh-moments";
    iconEl.style.pointerEvents = "";
    iconEl.style.opacity = "";
  }
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

  for (const a of MOMENT_AMOUNT) {
    const opt = document.createElement("option");
    opt.value = a;
    opt.textContent = a;
    amountSelect.appendChild(opt);
  }
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

function currentFilters() {
  return {
    session_id: sessionSelect.value || "",
    category: categorySelect.value || "",
    amount: amountSelect.value || 4,
  };
}

async function renderMoments() {
  grid.innerHTML = `<div class="moment-card">Chargement…</div>`;

  const moments = await loadAllMomentsOnce();
  await fillSessionSelectOnce(moments);

  const { session_id, category, amount } = currentFilters();

  let filtered = moments;
  if (session_id)
    filtered = filtered.filter((m) => m.session_id === session_id);
  if (category)
    filtered = filtered.filter(
      (m) => Array.isArray(m.categories) && m.categories.includes(category)
    );

  const picked = sampleUnique(filtered, amount);

  if (!picked.length) {
    grid.innerHTML = `<div class="moment-card">Aucun moment ne correspond à ces filtres.</div>`;
    return;
  }

  grid.innerHTML = picked
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

  // Re-apply wikilinks
  if (window.archivistReady) await window.archivistReady;
  window.archivistApplyWikilinks?.(grid);
}

async function refresh() {
  setLoadingIcon(btn, true);
  try {
    await renderMoments();
  } catch (e) {
    console.error(e);
    grid.innerHTML = `<div class="moment-card">Erreur: ${escapeHtml(e.message || String(e))}</div>`;
  } finally {
    setLoadingIcon(btn, false);
  }
}

// init
fillCategorySelectOnce();
fillAmountSelectOnce();
sessionSelect.addEventListener("change", refresh);
categorySelect.addEventListener("change", refresh);
amountSelect.addEventListener("change", refresh);
btn.addEventListener("click", refresh);

// chargement initial avec spinner
refresh();
