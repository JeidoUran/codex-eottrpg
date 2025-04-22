const chestUrl = "https://s3.codex.eottrpg.memiroa.com/data/characters/chest.json";

fetch(`${chestUrl}?nocache=${Date.now()}`)
  .then(res => res.json())
  .then(json => {
    const inventoryDiv = document.getElementById("chest-inventory");
    const allItems = json.data.items || [];
    const gold = json.data.system.currency?.gp ?? 0;
    document.getElementById("gold-value").textContent = gold.toLocaleString("fr-FR");

    const allowedTypes = ["container", "consumable", "equipment", "tool", "weapon", "loot"];
    const sortOrder = [ "etr", "shield", "helmet", "clothing", "light", "medium", "heavy", "gloves", "boots", "amulets", "rings", "potion", "scroll", "food", "material", "resource", "treasure", "key", "" ];

    const sortByType = (a, b) => {
      const aType = a.system?.type?.value ?? "";
      const bType = b.system?.type?.value ?? "";
      return sortOrder.indexOf(aType) - sortOrder.indexOf(bType);
    };

    const renderItem = item => {
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
      .filter(item => allowedTypes.includes(item.type))
      .sort(sortByType);

    inventoryDiv.innerHTML = inventoryItems.length > 0
      ? inventoryItems.map(renderItem).join("")
      : "<em>Le coffre est vide.</em>";

    const updated = new Date(json._codexLastUpdate);
    document.querySelector(".timestamp").textContent = "Dernière mise à jour : " + updated.toLocaleString("fr-FR", {
      dateStyle: "short", timeStyle: "short"
    });
  })
  .catch(err => {
    document.getElementById("chest-inventory").innerHTML = "<em>Données indisponibles. Le fichier JSON est introuvable ou le serveur est hors ligne.</em>";
    document.querySelector(".timestamp").textContent = "";
    console.error("Erreur chargement coffre :", err);
  });