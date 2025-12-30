// tools/inject-global-script.js
// node tools/inject-global-script.js ./output
import fs from "node:fs";
import path from "node:path";

const root = process.argv[2] || ".";
const SNIPPET = `<script src="/scripts/codex-global.js" defer></script>`;

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p));
    else if (entry.isFile() && p.endsWith(".html")) out.push(p);
  }
  return out;
}

function inject(file) {
  const src = fs.readFileSync(file, "utf8");
  if (src.includes(SNIPPET) || src.includes("codex-global.js")) return false;

  if (src.includes("</body>")) {
    const patched = src.replace("</body>", `  ${SNIPPET}\n</body>`);
    fs.writeFileSync(file, patched, "utf8");
    return true;
  }

  // fallback: append at end
  fs.writeFileSync(file, `${src}\n${SNIPPET}\n`, "utf8");
  return true;
}

const files = walk(root);
let changed = 0;

for (const f of files) {
  if (inject(f)) changed++;
}

console.log(`Done. Modified ${changed}/${files.length} HTML files.`);
