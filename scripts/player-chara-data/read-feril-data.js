const ferilUrl = "https://s3.codex.eottrpg.memiroa.com/data/feril.json";
  
const url = new URL(ferilUrl);
url.searchParams.set("nocache", Date.now());
fetch(url)
  .then(res => res.json())
  .then(json => {
    const data = json.data;
    const abilities = data.system.abilities;
    const stats = document.getElementById("feril-stats");
    const inventoryDiv = document.getElementById("feril-inventory");
    const gold = json.data.system.currency?.gp ?? 0;
    const xp = data.system.details.xp?.value || 0;
    const levelTable = [
      0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000,
      85000, 100000, 120000, 140000, 165000, 195000, 225000, 265000, 305000
    ];
    const allItems = data.items || [];
    const allowedTypes = ["container", "consumable", "equipment", "tool", "weapon", "loot"];
    const sortOrder = [
        "etr",
        "shield",
        "tiara",
        "clothhat",
        "helmet",
        "heavyhelmet",
        "clothing",
        "light",
        "medium",
        "heavy",
        "gloves",
        "universalboots",
        "lightboots",
        "mediumboots",
        "heavyboots",
        "amulets",
        "rings",
        "essense",
        "potion",
        "thrown",
        "grenade",
        "ammo",
        "poison",
        "wand",
        "rod",
        "scroll",
        "food",
        "material",
        "resource",
        "treasure",
        "gem",
        "gear",
        "art",
        "furniture",
        "etrian",
        "trinket",
        "",
        "key"
      ];

      // Fonction de tri
      const sortByType = (a, b) => {
        const aType = a.system?.type?.value ?? "";
        const bType = b.system?.type?.value ?? "";
        const indexA = sortOrder.indexOf(aType);
        const indexB = sortOrder.indexOf(bType);
        return indexA - indexB;
      };

      const renderItem = item => {
        const match = item.img.match(/data\/assets\/(.+)/);
        const relativePath = match ? match[1] : "placeholder.png";
        const iconPath = `../../assets/images/foundry-icons/${relativePath}`;
        const quantity = item.system?.quantity;
        const rarity = item.system?.rarity ?? "common"; // fallback si manquant

        return `
          <div class="item rarity-${rarity}">
            <img src="${iconPath}" alt="${item.name}">
            ${quantity > 1 ? `<span class="quantity">${quantity}</span>` : ""}
            <div class="tooltip">${item.name}</div>
          </div>
        `;
      };
      
      const renderAbility = item => {
      const baseClassPage = "souverain";
      const baseRacePage = "brouni";
      const match = item.img.match(/data\/assets\/(.+)/);
      const relativePath = match ? match[1] : "placeholder.png";
      const iconPath = `../../assets/images/foundry-icons/${relativePath}`;
      const name = item.name;
      const level = item.system?.level ? ` (Niv. ${item.system.level})` : "";
      const cleanName = item.name.split(" - ")[0].split(" (")[0];
      const slug = cleanName
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

        let origin = item.system?.requirements?.split(" ")[0]
        ?.toLowerCase()
        ?.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        ?? null;

      let link = "#";
      let isLinkValid = false;
      if (origin && slug) {
        if (item.system?.type?.value === "race") {
          link = `../../regles/races/${baseRacePage}.html#${slug}`;
          isLinkValid = true;
        } else if (item.system?.type?.value === "class") {
          link = `../../regles/classes/${baseClassPage}.html#${slug}`;
          isLinkValid = true;
        } else if (item.system?.type?.value === "oppatk") {
          link = `../../regles/aptitudes-generales.html#${slug}`;
          isLinkValid = true;
        } else if (!item.system?.type?.value) {
          link = `../../regles/aptitudes-generales.html#${slug}`;
          isLinkValid = true;
        }
      }


      let cssClass = "feature-generic";
      if (item.system?.type?.value === "race") cssClass = "feature-race";
      else if (item.system?.type?.value === "class") cssClass = "feature-class";

      return `
      <div class="item">
        ${isLinkValid
          ? `<a href="${link}" title="${name}${level}" target="_blank">
              <img src="${iconPath}" alt="${name}" class="${cssClass}">
            </a>`
          : `<div class="disabled-icon" title="${name}${level}">
              <img src="${iconPath}" alt="${name}" class="${cssClass}">
            </div>`
        }
        <div class="tooltip">${name}${level}</div>
      </div>
    `;
    };

      const featuresDiv = document.getElementById("feril-features");
      const features = data.items?.filter(item =>
        (item.type === "feat" || item.type === "classFeature") &&
        item.img && item.name
      ) || [];

      featuresDiv.innerHTML = `
        <div class="inventory">
          ${features.map(renderAbility).join("")}
        </div>
      `;

      const equippedItems = allItems
        .filter(item => item.system?.equipped === true && allowedTypes.includes(item.type))
        .sort(sortByType);

      const inventoryItems = allItems
        .filter(item => item.system?.equipped !== true && allowedTypes.includes(item.type))
        .sort(sortByType);

    let html = `
        <div class="inventory-section">
          <li class="character-stats" style="display: flex; align-items: flex-start; gap: 0.75rem; list-style: none;"><img src="../../assets/images/notes-medium.png" class="image" style="width: 24px; height: 24px; flex-shrink: 0; margin-top: 2px;"><strong>Équipé :</strong></li>
          <div class="inventory equipped-inventory">
            ${equippedItems.length > 0 ? equippedItems.map(renderItem).join("") : "<em>Aucun objet équipé.</em>"}
          </div>
        </div>
        <div class="inventory-section">
          <li class="character-stats" style="display: flex; align-items: flex-start; gap: 0.75rem; list-style: none;"><img src="../../assets/images/notes-medium.png" class="image" style="width: 24px; height: 24px; flex-shrink: 0; margin-top: 2px;"><strong>Sac :</strong></li>
          <ul class="image-list">
          <li class="ental-block">
          <div class="tooltip-wrapper">
          <img id="ental-icon" src="../../assets/images/ental.webp" class="ental-glow">
          <div class="tooltip">Entals possédés</div>
          </div>
          <strong><span id="gold-value">…</span> en</strong></li></ul>
          <div class="inventory bag-inventory">
            ${inventoryItems.length > 0 ? inventoryItems.map(renderItem).join("") : "<em>Inventaire vide.</em>"}
          </div>
        </div>
      `;

    inventoryDiv.innerHTML = html;

    if (!data.system || !data.system.attributes || !data.system.abilities) {
      stats.innerHTML = "<em>Données de Féril incomplètes.</em>";
      return;
    }
    
    let level = 1;
    for (let i = 1; i < levelTable.length; i++) {
      if (xp < levelTable[i]) {
        level = i;
        break;
      }
    }

    const hasInspiration = data.system?.attributes?.inspiration;
    const inspirationImg = document.getElementById("inspiration-icon");
    const inspirationTooltip = inspirationImg.nextElementSibling;

    if (hasInspiration) {
      inspirationImg.src = "../../assets/images/inspiration-icons/inspiration-on.png";
      inspirationImg.className = "inspiration-icon inspiration-glow";
      inspirationTooltip.textContent = "Inspiration";
    } else {
      inspirationImg.src = "../../assets/images/inspiration-icons/inspiration-off.png";
      inspirationImg.className = "inspiration-icon inspiration-off";
      inspirationTooltip.textContent = "Pas d'inspiration";
    }

    document.getElementById("gold-value").textContent = gold.toLocaleString("fr-FR");

    // Mise à jour du niveau
    document.getElementById("level-value").textContent = level;

    // Mise à jour de la barre
    const xpMin = levelTable[level - 1];
    const xpMax = levelTable[level];
    const ratio = (xp - xpMin) / (xpMax - xpMin);
    document.getElementById("xp-bar-feril").style.width = `${Math.round(ratio * 100)}%`;
    document.getElementById("xp-text").textContent = `${xp} / ${xpMax}`;

    stats.innerHTML = `
      <li class="character-stats"><img src="../../assets/images/notes-medium.png" class="image"><strong>PV :</strong> ${data.system.attributes.hp.value ?? "?"}</li>
      <li class="character-stats"><img src="../../assets/images/notes-medium.png" class="image"><strong>Force :</strong> ${abilities.str.value ?? "?"}</li>
      <li class="character-stats"><img src="../../assets/images/notes-medium.png" class="image"><strong>Dextérité :</strong> ${abilities.dex.value ?? "?"}</li>
      <li class="character-stats"><img src="../../assets/images/notes-medium.png" class="image"><strong>Constitution :</strong> ${abilities.con.value ?? "?"}</li>
      <li class="character-stats"><img src="../../assets/images/notes-medium.png" class="image"><strong>Intelligence :</strong> ${abilities.int.value ?? "?"}</li>
      <li class="character-stats"><img src="../../assets/images/notes-medium.png" class="image"><strong>Sagesse :</strong> ${abilities.wis.value ?? "?"}</li>
      <li class="character-stats"><img src="../../assets/images/notes-medium.png" class="image"><strong>Charisme :</strong> ${abilities.cha.value ?? "?"}</li>
    `;

    const updated = new Date(json._codexLastUpdate);
    document.querySelectorAll(".last-updated").forEach(el => {
      el.textContent = "Dernière mise à jour : " + updated.toLocaleString("fr-FR", {
        dateStyle: "short",
        timeStyle: "short"
      });
    });
    }) // 👈 fermeture du .then
    .catch(err => {
      console.error("Erreur lors du chargement des données Féril :", err);
      document.getElementById("feril-stats").innerHTML =
        "<em>Données indisponibles. Le fichier JSON n'a pas été trouvé ou le serveur est hors ligne.</em>";
      document.querySelectorAll(".last-updated").forEach(el => el.textContent = "");
    });