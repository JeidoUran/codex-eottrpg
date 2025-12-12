// scripts/archivist-ai/render-archivist-text.js
(() => {
  "use strict";

  /** =========================================
   *  CONFIG
   *  ========================================= */
  // Mets ici l'URL de ton linkMap global (celui que tu utilises déjà sur tes pages Archivist)
  // Exemple: "https://s3.codex.eottrpg.memiroa.com/data/archivist/linkMap.json"
  const LINKMAP_URL =
    window.ARCHIVIST_LINKMAP_URL || "/assets/data/linkMap.json";

  /** =========================================
   *  STATE
   *  ========================================= */
  let linkMap = {};

  // Signal global : résolu une fois que linkMap est prêt
  let resolveReady;
  window.archivistReady =
    window.archivistReady ||
    new Promise((resolve) => {
      resolveReady = resolve;
    });

  /** =========================================
   *  HELPERS
   *  ========================================= */
  function escapeHtml(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function convertWikilinks(text, map) {
    const m = map || {};
    return text.replace(/\[\[([^\]]+)\]\]/g, (_match, raw) => {
      const label = String(raw).trim();

      const href = m[label];
      if (!href) {
        return `<span class="wikilink-missing">${escapeHtml(label)}</span>`;
      }

      return `<a class="wikilink" href="${href}">${escapeHtml(label)}</a>`;
    });
  }

  // Rend un bloc Markdown : liste "- " ou paragraphe
  function renderBlock(block, map) {
    const lines = block.split("\n");
    const isList = lines.every((l) => l.trim().startsWith("- "));

    if (isList) {
      const items = lines.map((l) => {
        const item = l.replace(/^\s*-\s?/, "").trim();
        return `<li>${convertWikilinks(item, map)}</li>`;
      });
      return `<ul>${items.join("")}</ul>`;
    }

    const withLineBreaks = block.replace(/\n/g, "<br>");
    return `<p>${convertWikilinks(withLineBreaks, map)}</p>`;
  }

  /** Rend le texte Archivist : paragraphes + listes + wikilinks */
  function renderArchivistText(text, map) {
    if (!text) return "";
    const safe = escapeHtml(text);
    const blocks = safe.split(/\n\s*\n/);
    return blocks.map((b) => renderBlock(b, map)).join("\n");
  }

  /** =========================================
   *  PUBLIC API
   *  ========================================= */

  // Rend dispo pour d'autres scripts si besoin
  window.renderArchivistText = renderArchivistText;

  /**
   * Applique les wikilinks aux éléments contenant du texte Archivist.
   * Stratégie :
   * - si data-raw existe : on rerend depuis data-raw (recommandé)
   * - sinon : on ne touche pas (évite d'écraser un HTML déjà rendu)
   */
  window.archivistApplyWikilinks = function (root = document) {
    const els = root.querySelectorAll(
      "[data-raw].moment-content, [data-raw].archivist-content, [data-raw].session-content"
    );

    for (const el of els) {
      const raw = el.getAttribute("data-raw");
      if (!raw) continue;

      el.innerHTML = renderArchivistText(raw, linkMap);
    }
  };

  /** =========================================
   *  INIT : charge linkMap puis applique sur la page
   *  ========================================= */
  async function loadLinkMap() {
    try {
      const r = await fetch(LINKMAP_URL, { cache: "no-store" });
      if (!r.ok) throw new Error(`linkMap HTTP ${r.status}`);
      const json = await r.json();
      if (json && typeof json === "object") linkMap = json;
    } catch (e) {
      console.warn("[Archivist] linkMap failed to load:", e);
      linkMap = {};
    } finally {
      // Important : on résout ready même si linkMap est vide
      if (typeof resolveReady === "function") resolveReady(true);
    }
  }

  (async () => {
    await loadLinkMap();

    // Applique automatiquement au chargement sur les éléments déjà présents
    window.archivistApplyWikilinks(document);
  })();
})();
