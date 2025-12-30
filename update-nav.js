// update-nav.js
import fs from "fs";
import path from "path";

const rootDir = "./"; // mets ici le dossier où sont tes pages (ex: "./public" ou "./output")

// Ta nouvelle nav :
const newNav = `
<nav class="nav-bar">
  <a href="/">Accueil</a>
  <a href="/notes/">Patch Notes</a>
  <a href="/resumes/">Résumés</a>
  <a href="/moments.html">Moments</a>
  <a href="/univers/">Univers</a>
  <a href="/regles/">Règles</a>
  <a href="/musique.html">Musiques</a>
  <a href="/ressources/">Ressources</a>
  <a href="/credits.html">Crédits</a>
</nav>
`.trim();

// Regex qui capture l'ancien bloc nav-bar, peu importe ce qu'il y a dedans
const navRegex = /<nav class="nav-bar">[\s\S]*?<\/nav>/m;

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // si tu veux exclure des dossiers (ex: node_modules), tu peux faire un if ici
      walk(fullPath);
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      updateFile(fullPath);
    }
  }
}

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");

  if (!navRegex.test(content)) {
    // pas de nav-bar dans ce fichier => on skip
    return;
  }

  const updated = content.replace(navRegex, newNav);

  if (updated !== content) {
    fs.writeFileSync(filePath, updated, "utf8");
    console.log("Nav mise à jour :", filePath);
  }
}

walk(rootDir);
console.log("Terminé !");
