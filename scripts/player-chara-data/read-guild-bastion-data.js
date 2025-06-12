const bastionUrl =
  "https://s3.codex.eottrpg.memiroa.com/data/characters/bastion.json";

fetch(`${bastionUrl}?nocache=${Date.now()}`)
  .then((res) => res.json())
  .then((json) => {
    const inventoryDiv = document.getElementById("bastion-inventory");
    const allItems = json.data.items || [];

    const allowedTypes = ["facility"];

    const renderItem = (item) => {
      const match = item.img.match(/data\/assets\/(.+)/);
      const relativePath = match ? match[1] : "placeholder.png";
      const iconPath = `../assets/images/foundry-icons/${relativePath}`;
      const quantity = item.system?.quantity;
      const rarity = item.system?.rarity ?? "common";

      return `
        <div class="item rarity-${rarity}">
          <img src="${iconPath}" alt="${item.name}">
          ${quantity > 1 ? `<span class="quantity">${quantity}</span>` : ""}
          <div class="tooltip">${item.name}</div>
        </div>
      `;
    };

    const inventoryItems = allItems
      .filter((item) => allowedTypes.includes(item.type))
      .sort((a, b) => a.name.localeCompare(b.name));

    inventoryDiv.innerHTML =
      inventoryItems.length > 0
        ? inventoryItems.map(renderItem).join("")
        : "<em>Le coffre est vide.</em>";

    const updated = new Date(json._codexLastUpdate);
    document.querySelector(".timestamp").textContent =
      "Dernière mise à jour : " +
      updated.toLocaleString("fr-FR", {
        dateStyle: "short",
        timeStyle: "short",
      });
  })
  .catch((err) => {
    document.getElementById("bastion-inventory").innerHTML =
      "<em>Données indisponibles. Le fichier JSON est introuvable ou le serveur est hors ligne.</em>";
    document.querySelector(".timestamp").textContent = "";
    console.error("Erreur chargement coffre :", err);
  });
