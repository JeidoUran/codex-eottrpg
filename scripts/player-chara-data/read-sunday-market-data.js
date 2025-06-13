const sundayMarketUrl =
  "https://s3.codex.eottrpg.memiroa.com/data/characters/sunday-market.json";

fetch(`${sundayMarketUrl}?nocache=${Date.now()}`)
  .then((res) => res.json())
  .then((json) => {
    const inventoryDiv = document.getElementById("sunday-market-inventory");
    const allItems = json.data.items || [];

    const allowedTypes = [
      "container",
      "consumable",
      "equipment",
      "tool",
      "weapon",
      "loot",
    ];
    const sortOrder = [
      "etr",
      "shield",
      "helmet",
      "clothing",
      "light",
      "medium",
      "heavy",
      "gloves",
      "boots",
      "amulets",
      "rings",
      "potion",
      "scroll",
      "food",
      "material",
      "resource",
      "treasure",
      "key",
      "furniture",
      "",
    ];

    const sortByType = (a, b) => {
      const aType = a.system?.type?.value ?? "";
      const bType = b.system?.type?.value ?? "";
      return sortOrder.indexOf(aType) - sortOrder.indexOf(bType);
    };

    const renderItem = (item) => {
      const match = item.img.match(/data\/assets\/(.+)/);
      const relativePath = match ? match[1] : "placeholder.png";
      const iconPath = `../assets/images/foundry-icons/${relativePath}`;
      const quantity = item.system?.quantity;
      const rarity = item.system?.rarity ?? "common";
      const description = item.system?.description?.value;
      const price = item.system?.price?.value ?? 0;
      const marketPrice = price * 2;
      const priceMultiplier =
        item.flags?.["item-piles"]?.item?.buyPriceModifier ?? 1;
      const quantityForPrice =
        item.flags?.["item-piles"]?.system?.quantityForPrice ?? 1;
      console.log("Rendered:", {
        name: item.name,
        marketPrice,
        quantityForPrice,
      });
      return `
      <div class="item rarity-${rarity}" data-name="${item.name}" data-description="${description}" data-marketprice="${marketPrice}" data-quantityforprice="${quantityForPrice}" data-pricemultiplier="${priceMultiplier}">
        <img src="${iconPath}" alt="${item.name}">
        ${quantity > 1 ? `<span class="quantity">${quantity}</span>` : ""}
        <div class="tooltip">${item.name}</div>
      </div>
      `;
    };

    const inventoryItems = allItems
      .filter((item) => allowedTypes.includes(item.type))
      .sort(sortByType);

    inventoryDiv.innerHTML =
      inventoryItems.length > 0
        ? inventoryItems.map(renderItem).join("")
        : "<em>Iskar n'a rien à vendre.</em>";
    document.querySelectorAll(".inventory .item").forEach((itemEl) => {
      itemEl.addEventListener("click", () => {
        const name = itemEl.dataset.name;
        const desc =
          itemEl.dataset.description?.trim() || "Aucune description.";
        const cleanedDesc = desc.replace(/@UUID\[[^\]]+]\{([^}]+)\}/g, "$1");
        const imgSrc = itemEl.querySelector("img")?.src;
        const marketPrice =
          itemEl.dataset.marketprice * itemEl.dataset.pricemultiplier;
        const quantityForPrice = itemEl.dataset.quantityforprice;

        const headerHTML = `
        <div class="item-modal-header">
          <img src="${imgSrc}" alt="${name}">
          <div class="modal-header-texts">
            <h3>${name}</h3>
          </div>
          <span class="item-modal-price">${marketPrice}en pour ${quantityForPrice}</span>
        </div>
      `;

        document.getElementById("item-modal-title").innerHTML = headerHTML;
        document.getElementById("item-modal-description").innerHTML =
          cleanedDesc;
        document.getElementById("item-modal").classList.remove("hidden");
      });
    });

    document.querySelector(".close-button").addEventListener("click", () => {
      document.getElementById("item-modal").classList.add("hidden");
    });
    const updated = new Date(json._codexLastUpdate);
    document.querySelector(".timestamp").textContent =
      "Dernière mise à jour : " +
      updated.toLocaleString("fr-FR", {
        dateStyle: "short",
        timeStyle: "short",
      });
  })
  .catch((err) => {
    document.getElementById("sunday-market-inventory").innerHTML =
      "<em>Données indisponibles. Le fichier JSON est introuvable ou le serveur est hors ligne.</em>";
    document.querySelector(".timestamp").textContent = "";
    console.error("Erreur chargement marché :", err);
  });
