const scrollBtns = document.querySelectorAll(".scroll-btn");
const scrollContainer = document.querySelector(".playlist-tabs-container");
scrollBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const scrollAmount = 150;
    if (btn.classList.contains("left")) {
      scrollContainer.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    } else {
      scrollContainer.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const defaultTab = document.querySelector('.tab-button[data-playlist="sys"]');
  if (defaultTab) defaultTab.click();
  // Forcer le scroll au tout début
  const tabsContainer = document.querySelector(".playlist-tabs-container");
  tabsContainer.scrollLeft = 0;
});
