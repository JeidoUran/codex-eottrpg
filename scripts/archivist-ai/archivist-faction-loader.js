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

  /** Auto-load du JSON Archivist en fonction des data-session */
  async function loadFactions() {
    const containers = document.querySelectorAll("[data-faction]");
    if (!containers.length) return; // page sans session : on ignore

    // Charger le linkMap global une seule fois
    const mapRes = await fetch("/assets/data/linkmap.json");
    const linkMap = await mapRes.json();

    for (const container of containers) {
      const slug = container.dataset.faction;
      if (!slug) continue;

      const jsonUrl = `https://s3.codex.eottrpg.memiroa.com/data/archivist/factions/${slug}.json`;

      try {
        const res = await fetch(jsonUrl, { cache: "no-cache" });
        if (!res.ok) {
          container.innerHTML = `<p>Erreur lors du chargement de la faction.</p>`;
          continue;
        }

        const data = await res.json();
        const html = renderArchivistText(data.summary, linkMap);
        container.innerHTML = html;
      } catch (err) {
        console.error(err);
        container.innerHTML = `<p>Erreur lors du chargement de la faction.</p>`;
      }
    }
  }

  loadFactions();
})();
