function toggleIntro() {
    const section = document.getElementById("intro");
    section.classList.toggle("expanded");
    const btn = section.querySelector("button");
    btn.textContent = section.classList.contains("expanded") ? "Réduire" : "Afficher la suite";
  }