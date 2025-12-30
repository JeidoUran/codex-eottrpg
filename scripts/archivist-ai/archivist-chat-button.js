// assets/js/codex-archivist-chat.js
(() => {
  const ENDPOINT = "/.netlify/functions/archivist-chat";

  // ----------------------------
  // CSS
  // ----------------------------
  const style = document.createElement("style");
  style.textContent = `
  :root{
    --codex-chat-bg: rgba(12, 16, 24, 0.92);
    --codex-chat-panel: rgba(22, 30, 46, 0.96);
    --codex-chat-border: rgba(120, 180, 255, 0.25);
    --codex-chat-glow: rgba(60, 180, 255, 0.25);
    --codex-chat-text: rgba(235, 245, 255, 0.92);
    --codex-chat-muted: rgba(235, 245, 255, 0.65);
  }

  #codex-archivist-fab{
    position: fixed;
    left: 18px;
    bottom: 18px;
    width: 54px;
    height: 54px;
    border-radius: 999px;
    border: 1px solid var(--codex-chat-border);
    background: radial-gradient(circle at 30% 30%, rgba(80,170,255,.35), rgba(20,30,50,.9));
    color: var(--codex-chat-text);
    cursor: pointer;
    z-index: 999999;
    box-shadow: 0 0 0 1px rgba(255,255,255,0.06), 0 10px 30px rgba(0,0,0,0.45), 0 0 24px var(--codex-chat-glow);
    display:flex;
    align-items:center;
    justify-content:center;
    transition: transform .12s ease, filter .12s ease;
    user-select:none;
  }
  #codex-archivist-fab:hover{ transform: translateY(-1px); filter: brightness(1.08); }
  #codex-archivist-fab:active{ transform: translateY(0px) scale(0.98); }
  #codex-archivist-fab svg{ width: 24px; height: 24px; opacity: 0.95; }

  #codex-archivist-overlay{
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.45);
    backdrop-filter: blur(3px);
    z-index: 999998;
    display:none;
  }

  #codex-archivist-modal{
    position: fixed;
    left: 18px;
    bottom: 86px;
    width: min(520px, calc(100vw - 36px));
    height: min(640px, calc(100vh - 140px));
    z-index: 999999;
    display:none;
    border-radius: 16px;
    border: 1px solid var(--codex-chat-border);
    background: var(--codex-chat-panel);
    box-shadow: 0 20px 60px rgba(0,0,0,0.55), 0 0 28px var(--codex-chat-glow);
    overflow:hidden;
  }

  .codex-chat-head{
    display:flex;
    align-items:center;
    justify-content:space-between;
    padding: 12px 14px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    background: linear-gradient(to bottom, rgba(255,255,255,0.04), rgba(255,255,255,0.01));
  }
  .codex-chat-title{
    display:flex; gap:10px; align-items:center;
    color: var(--codex-chat-text);
    font-weight: 700;
    letter-spacing: 0.4px;
  }
  .codex-chat-title small{
    display:block;
    font-weight: 500;
    color: var(--codex-chat-muted);
    letter-spacing: 0px;
    margin-top: 2px;
  }
  .codex-chat-close{
    border: 1px solid rgba(255,255,255,0.10);
    background: rgba(0,0,0,0.25);
    color: var(--codex-chat-text);
    border-radius: 10px;
    width: 34px;
    height: 34px;
    cursor:pointer;
  }

  .codex-chat-body{
    height: calc(100% - 58px - 60px);
    padding: 14px;
    overflow:auto;
    background: var(--codex-chat-bg);
  }
  .codex-msg{
    max-width: 92%;
    margin: 10px 0;
    padding: 10px 12px;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.08);
    color: var(--codex-chat-text);
    line-height: 1.35;
    white-space: pre-wrap;
  }
  .codex-msg.user{
    margin-left:auto;
    background: rgba(40, 90, 140, 0.25);
    border-color: rgba(120, 180, 255, 0.22);
  }
  .codex-msg.bot{
    margin-right:auto;
    background: rgba(255,255,255,0.04);
  }
  .codex-msg.meta{
    font-size: 0.9em;
    color: var(--codex-chat-muted);
    background: rgba(255,255,255,0.02);
  }

  .codex-chat-foot{
    height: 60px;
    display:flex;
    gap: 10px;
    align-items:center;
    padding: 10px 12px;
    border-top: 1px solid rgba(255,255,255,0.06);
    background: rgba(0,0,0,0.18);
  }
  .codex-chat-input{
    flex:1;
    height: 40px;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.10);
    background: rgba(0,0,0,0.25);
    color: var(--codex-chat-text);
    padding: 0 12px;
    outline: none;
  }
  .codex-chat-send{
    height: 40px;
    padding: 0 14px;
    border-radius: 12px;
    border: 1px solid rgba(120, 180, 255, 0.25);
    background: rgba(60, 160, 255, 0.22);
    color: var(--codex-chat-text);
    cursor:pointer;
    font-weight: 700;
  }
  .codex-chat-send:disabled{ opacity: 0.55; cursor:not-allowed; }

  @media (max-width: 560px){
    #codex-archivist-modal{
      left: 10px;
      right: 10px;
      bottom: 80px;
      width: auto;
      height: min(70vh, 620px);
    }
  }
  `;
  document.head.appendChild(style);

  // ----------------------------
  // HTML
  // ----------------------------
  const fab = document.createElement("button");
  fab.id = "codex-archivist-fab";
  fab.type = "button";
  fab.title = "Archivist – Poser une question";
  fab.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 22c5.523 0 10-4.03 10-9s-4.477-9-10-9S2 8.03 2 13c0 2.04.77 3.92 2.06 5.37L3 22l3.9-1.3A11.5 11.5 0 0 0 12 22Z" stroke="currentColor" stroke-width="1.6" opacity="0.9"/>
      <path d="M7.5 13h9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M7.5 9.7h6.2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" opacity="0.85"/>
    </svg>
  `;

  const overlay = document.createElement("div");
  overlay.id = "codex-archivist-overlay";

  const modal = document.createElement("section");
  modal.id = "codex-archivist-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.innerHTML = `
    <header class="codex-chat-head">
      <div class="codex-chat-title">
        <div>
          Archivist
          <small>Questionne la mémoire de campagne</small>
        </div>
      </div>
      <button class="codex-chat-close" type="button" aria-label="Fermer">✕</button>
    </header>

    <div class="codex-chat-body" id="codex-chat-body"></div>

    <footer class="codex-chat-foot">
      <input class="codex-chat-input" id="codex-chat-input" placeholder="Écris ta question..." />
      <button class="codex-chat-send" id="codex-chat-send" type="button">Envoyer</button>
    </footer>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(modal);
  document.body.appendChild(fab);

  const body = modal.querySelector("#codex-chat-body");
  const input = modal.querySelector("#codex-chat-input");
  const sendBtn = modal.querySelector("#codex-chat-send");
  const closeBtn = modal.querySelector(".codex-chat-close");

  const state = {
    messages: [
      {
        role: "assistant",
        content:
          "Besoin d’un rappel, d’un résumé, ou d’un détail de lore ? Demandez à Archivist !",
      },
    ],
    busy: false,
  };

  function appendMsg(role, text, extraClass = "") {
    const div = document.createElement("div");
    div.className = `codex-msg ${role} ${extraClass}`.trim();
    div.textContent = text;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
    return div;
  }

  function openChat() {
    overlay.style.display = "block";
    modal.style.display = "block";

    // hydrate initial message once
    if (!body.dataset.init) {
      body.dataset.init = "1";
      state.messages.forEach((m) =>
        appendMsg(m.role === "user" ? "user" : "bot", m.content)
      );
    }

    setTimeout(() => input.focus(), 0);
  }

  function closeChat() {
    overlay.style.display = "none";
    modal.style.display = "none";
  }

  overlay.addEventListener("click", closeChat);
  closeBtn.addEventListener("click", closeChat);
  fab.addEventListener("click", () => {
    if (modal.style.display === "block") closeChat();
    else openChat();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.style.display === "block") closeChat();
  });

  // ----------------------------
  // STREAM TEXT READER (Archivist: text/plain + chunked)
  // ----------------------------
  async function readArchivistResponse(res, botDiv) {
    const ct = (res.headers.get("content-type") || "").toLowerCase();

    // Non-stream fallback
    if (!res.body) {
      if (ct.includes("application/json")) {
        const obj = await res.json();
        const text =
          obj?.answer ??
          obj?.content ??
          obj?.message?.content ??
          obj?.choices?.[0]?.message?.content ??
          JSON.stringify(obj, null, 2);
        botDiv.textContent = text;
        return text;
      }

      const text = await res.text();
      botDiv.textContent = text;
      return text;
    }

    // Stream chunks (text/plain; transfer-encoding: chunked)
    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let full = "";

    botDiv.textContent = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      if (!chunk) continue;

      full += chunk;
      botDiv.textContent = full;
      body.scrollTop = body.scrollHeight;
    }

    return full.trim() || "(Réponse vide)";
  }

  async function sendMessage() {
    const q = (input.value || "").trim();
    if (!q || state.busy) return;

    input.value = "";
    appendMsg("user", q);
    state.messages.push({ role: "user", content: q });

    state.busy = true;
    sendBtn.disabled = true;

    // placeholder bot
    const botDiv = appendMsg("bot", "…", "meta");

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: state.messages,
          stream: true, // Archivist renvoie du text/plain chunked
        }),
      });

      if (!res.ok) {
        const errTxt = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} ${errTxt}`.trim());
      }

      botDiv.classList.remove("meta");

      const finalText = await readArchivistResponse(res, botDiv);
      state.messages.push({ role: "assistant", content: finalText });
    } catch (err) {
      botDiv.classList.add("meta");
      botDiv.textContent = `Erreur: ${err?.message || err}`;
    } finally {
      state.busy = false;
      sendBtn.disabled = false;
      input.focus();
    }
  }

  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });
})();
