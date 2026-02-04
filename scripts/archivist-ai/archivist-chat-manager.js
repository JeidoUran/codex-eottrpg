// assets/js/codex-archivist-chat.js
(() => {
  const ENDPOINT = "/api/archivist-chat";

  // ----------------------------
  // CSS
  // ----------------------------
  const style = document.createElement("style");
  style.textContent = `
  :root {
    --codex-chat-bg: rgba(14, 26, 35, 0.94);
    --codex-chat-panel: rgba(22, 36, 48, 0.97);
    --codex-chat-border: rgba(120, 155, 185, 0.22);
    --codex-chat-glow: rgba(90, 140, 190, 0.22);
    --codex-chat-text: rgba(232, 240, 248, 0.94);
    --codex-chat-muted: rgba(190, 205, 220, 0.65);
  }


  #codex-archivist-fab {
    position: fixed;
    right: var(--codex-chat-fab-offset);
    bottom: var(--codex-chat-fab-offset);
    width: var(--codex-chat-fab-size);
    height: var(--codex-chat-fab-size);
    border-radius: 999px;
    border: 1px solid var(--codex-chat-border);
    background: radial-gradient(circle at 30% 30%, rgba(110, 150, 185, 0.5), rgba(20, 20, 30, 0.65));
    color: var(--codex-chat-text);
    cursor: pointer;
    z-index: 999999;
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.06),
      0 10px 30px rgba(0,0,0,0.45),
      0 0 22px rgba(110,150,185,0.28);
    transition: transform 0.3s ease, background 0.3s ease;
  }
  #codex-archivist-fab:hover{ transform: scale(1.075); filter: brightness(1.25); }
  #codex-archivist-fab:active{ transform: translateY(0px) scale(0.98); }
  #codex-archivist-fab svg{ width: 24px; height: 24px; opacity: 0.95; }

  #codex-archivist-overlay{
    position: fixed;
    inset: 0;

    background: rgba(0, 0, 0, 0.45);
    backdrop-filter: blur(3px);

    z-index: 999998;

    display: block;
    opacity: 0;
    visibility: hidden;
    pointer-events: none;

    transition:
      opacity 0.25s ease,
      visibility 0s linear 0.25s;
  }

  #codex-archivist-overlay.is-open{
    opacity: 1;
    visibility: visible;
    pointer-events: auto;

    transition:
      opacity 0.25s ease,
      visibility 0s linear 0s;
  }

  #codex-archivist-modal{
    position: fixed;
    right: 18px;
    bottom: 118px;
    width: min(820px, calc(100vw - 36px));
    height: min(740px, calc(100vh - 140px));
    z-index: 999999;

    /* Toujours "présent" */
    display: flex;
    flex-direction: column;

    /* Etat fermé */
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transform: translateY(10px) scale(0.98);

    transition:
      opacity 0.25s ease,
      transform 0.25s ease,
      visibility 0s linear 0.25s;

    border-radius: 16px;
    border: 1px solid var(--codex-chat-border);
    background: var(--codex-chat-panel);
    box-shadow: 0 20px 60px rgba(0,0,0,0.55), 0 0 28px var(--codex-chat-glow);
    overflow:hidden;
  }

  #codex-archivist-modal.is-open{
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    transform: translateY(0) scale(1);

    /* visibilité immédiate à l'ouverture */
    transition:
      opacity 0.25s ease,
      transform 0.25s ease,
      visibility 0s linear 0s;
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
    flex: 1 1 auto;
    min-height: 0;     /* IMPORTANT: autorise le scroll dans un flex child */
    padding: 14px;
    overflow: auto;
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
    background: rgba(40, 140, 126, 0.25);
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
    flex: 0 0 auto;
    padding: 10px 12px;
    display: flex;
    gap: 10px;
    align-items: center;
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
    background: rgba(20, 20, 30, 0.65);
    transition: transform 0.3s ease, background 0.3s ease;
    color: var(--codex-chat-text);
    cursor:pointer;
    font-weight: 700;
  }

  .codex-chat-send:hover {
    background: rgba(40, 40, 60, 0.95);
    box-shadow: 0 0 12px rgba(136, 192, 169, 0.1);
    text-shadow: 0 0 4px #8bd1e3;
    text-decoration: none;
    cursor: pointer;
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
  fab.title = "Archivist AI – Poser une question";
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
    <div class="codex-chat-head">
      <div class="codex-chat-title">
        <div>
          Archivist AI
          <small>Questionnez la mémoire de la campagne</small>
        </div>
      </div>
      <button class="codex-chat-close" type="button" aria-label="Fermer">✕</button>
    </div>

    <div class="codex-chat-body" id="codex-chat-body"></div>

    <footer class="codex-chat-foot">
      <input class="codex-chat-input" id="codex-chat-input" placeholder="Écrivez votre question..." />
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
          "Besoin d’un rappel, d’un résumé, ou d’un détail de lore ? Demandez à Archivist AI !",
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

  function startThinkingDots(el) {
    // évite double timers
    stopThinkingDots(el);

    let i = 0;
    el.dataset.thinking = "1";
    el.__thinkingTimer = setInterval(() => {
      i = (i + 1) % 3; // 0,1,2
      el.textContent = ".".repeat(i + 1); // ".", "..", "..."
    }, 350);
  }

  function stopThinkingDots(el) {
    if (el && el.__thinkingTimer) {
      clearInterval(el.__thinkingTimer);
      el.__thinkingTimer = null;
    }
    if (el) delete el.dataset.thinking;
  }

  function openChat() {
    overlay.classList.add("is-open");
    modal.classList.add("is-open");
    setTimeout(() => input.focus(), 0);

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
    overlay.classList.remove("is-open");
    modal.classList.remove("is-open");
  }

  overlay.addEventListener("click", () => {
    if (modal.classList.contains("is-open")) {
      closeChat();
    } else {
      openChat();
    }
  });
  closeBtn.addEventListener("click", closeChat);
  fab.addEventListener("click", () => {
    if (modal.classList.contains("is-open")) {
      closeChat();
    } else {
      openChat();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) closeChat();
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

    let firstChunk = true;

    while (true) {
      if (firstChunk) {
        stopThinkingDots(botDiv);
        botDiv.classList.remove("meta");
        firstChunk = false;
      }

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
    const botDiv = appendMsg("bot", ".", "meta");
    startThinkingDots(botDiv);

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

      stopThinkingDots(botDiv);
      botDiv.classList.remove("meta");

      const finalText = await readArchivistResponse(res, botDiv);
      state.messages.push({ role: "assistant", content: finalText });
    } catch (err) {
      stopThinkingDots(botDiv);
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
