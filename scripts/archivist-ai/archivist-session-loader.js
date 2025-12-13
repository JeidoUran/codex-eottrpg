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

  // Rend un bloc Markdown : liste "- " ou paragraphe
  function renderBlock(block, map) {
    const lines = block.split("\n");
    const isList = lines.every((l) => l.trim().startsWith("- "));

    if (isList) {
      const items = lines.map((l) => {
        const item = l.replace(/^\s*-\s?/, "• ").trim();
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

  /** Auto-load du JSON Archivist en fonction des data-session */
  async function loadSessions() {
    const containers = document.querySelectorAll("[data-session]");
    if (!containers.length) return; // page sans session : on ignore

    // Charger le linkMap global une seule fois
    const mapRes = await fetch("/assets/data/linkmap.json");
    const linkMap = await mapRes.json();

    for (const container of containers) {
      const slug = container.dataset.session;
      if (!slug) continue;

      const jsonUrl = `https://s3.codex.eottrpg.memiroa.com/data/archivist/sessions/${slug}.json`;

      try {
        const res = await fetch(jsonUrl, { cache: "no-cache" });
        if (!res.ok) {
          container.innerHTML = `<p>Erreur lors du chargement du résumé.</p>`;
          continue;
        }

        const data = await res.json();
        const html = renderArchivistText(data.summary, linkMap);
        container.innerHTML = html;
      } catch (err) {
        console.error(err);
        container.innerHTML = `<p>Erreur lors du chargement du résumé.</p>`;
      }
    }
  }

  loadSessions();
})();
