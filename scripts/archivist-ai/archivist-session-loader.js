(async () => {
  /** Utility: escape HTML */
  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  /** Transforme les [[wikilinks]] grâce au linkMap */
  function convertWikilinks(text, linkMap) {
    return text.replace(/\[\[([^\]]+)\]\]/g, (match, rawLabel) => {
      const label = rawLabel.trim();
      const href = linkMap[label];

      if (!href) {
        return `<span class="wikilink-missing">${escapeHtml(label)}</span>`;
      }

      return `<a class="wikilink" href="${href}">${escapeHtml(label)}</a>`;
    });
  }

  /** Rend le texte Archivist en paragraphes + wikilinks cliquables */
  function renderArchivistText(text, linkMap) {
    if (!text) return "";

    let safe = escapeHtml(text);

    const paragraphs = safe.split(/\n\s*\n/);
    const htmlParagraphs = paragraphs.map((p) => {
      return `<p>${convertWikilinks(p, linkMap)}</p>`;
    });

    return htmlParagraphs.join("\n");
  }

  /** Auto-load du JSON Archivist en fonction du data-session */
  async function loadSession() {
    const container = document.querySelector("[data-session]");
    if (!container) return; // page sans session : on ignore

    const slug = container.dataset.session;
    if (!slug) return;

    // URL où tu stockes les JSON Archivist
    const jsonUrl = `https://s3.codex.eottrpg.memiroa.com/data/archivist/sessions/${slug}.json`;

    // Charger le linkMap global
    const mapRes = await fetch("/assets/data/linkmap.json");
    const linkMap = await mapRes.json();

    // Charger le JSON de la session
    const res = await fetch(jsonUrl, { cache: "no-cache" });
    if (!res.ok) {
      container.innerHTML = `<p>Erreur lors du chargement du résumé.</p>`;
      return;
    }

    const data = await res.json();
    const html = renderArchivistText(data.summary, linkMap);
    container.innerHTML = html;
  }

  loadSession();
})();
