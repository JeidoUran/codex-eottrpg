window.addEventListener("scroll", () => {
  document
    .getElementById("backToTop")
    .classList.toggle("show", window.scrollY > 300);
});
