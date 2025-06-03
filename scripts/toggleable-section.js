function toggleSection(button) {
  const content = button
    .closest("section")
    .querySelector(".collapsible-content");
  const isOpen = content.classList.contains("expanded");
  if (isOpen) {
    content.classList.remove("expanded");
    button.textContent = "▼";
  } else {
    content.classList.add("expanded");
    button.textContent = "▲";
  }
}
