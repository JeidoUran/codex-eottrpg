// scripts/codex-global.js
(() => {
  // évite double-load si tu te rates sur une page
  if (window.__CODEX_GLOBAL_LOADED__) return;
  window.__CODEX_GLOBAL_LOADED__ = true;

  // injecte le chat Archivist
  const s = document.createElement("script");
  s.src = "/scripts/archivist-ai/archivist-chat-manager.js";
  s.defer = true;
  document.head.appendChild(s);
})();
