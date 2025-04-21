const bounds = [[0,0], [4096, 3524]];
const maxBounds = [[-50, -50], [4146, 3574]];

const map = L.map('map', {
  crs: L.CRS.Simple,
  zoomControl: true,
  inertia: true,
  center: [ 1816.215, 1742.337 ],
  noWrap: true,
  maxBounds: maxBounds,
  maxBoundsViscosity: 0.5,
  dragging: true,
  tap: false,
  attributionControl: false,
  zoom: -1,
  zoomSnap: 0.25,
  minZoom: -2,
  maxZoom: 0.25
});

const image = L.imageOverlay('../assets/images/maps/carte-voarmur.png', bounds).addTo(map);
map.fitBounds(bounds);
map.setView([1706.904, 1742.337], -1.25); // <-- Position et zoom initiaux

const lieux = [
{
  name: "Voarmur",
  coords: [1706.904, 1742.337],
  url: "/univers/regions/voarmur.html",
  description: "La cité océane, partiellement engloutie depuis un ancien séisme, demeure le point de départ des Égarés."
},
{
  name: "Ougarit",
  coords: [2147.849, 576],
  url: "/univers/regions/ougarit.html",
  description: "Ville portuaire ancienne, Ougarit s’impose comme un carrefour marchand et culturel à l’ouest de Voarmur."
},
{
  name: "Labyrinthe d’Yggdrasil",
  coords: [1816.215, 1742.337],
  url: "/univers/regions/labyrinthe.html",
  description: "Un réseau mystique et changeant, témoin d’épreuves oubliées et de secrets enfouis sous les racines."
},
{
  name: "Damavand",
  coords: [3606.684, 2126],
  url: "/univers/regions/damavand.html",
  description: "Cité draconique bâtie sur les reliques d’un pouvoir ancien, jadis bénie par un dragon scellé."
},
{
  name: "Saba",
  coords: [3623.078, 774.989],
  url: "/univers/regions/saba.html",
  description: "Forteresse côtière recluse, craintive des remous océaniques, retranchée du monde depuis le Désastre."
},
{
  name: "Batavia",
  coords: [1547.894, 2794.299],
  url: "/univers/regions/batavia.html",
  description: "Carrefour commercial disputé, autrefois rival de Voarmur dans les échanges avec l’extérieur."
},
{
  name: "Ééa",
  coords: [3183.115, 1053.589],
  url: "/univers/regions/eea.html",
  description: "Ville nordique baignée de mystères, dirigée par la reine Circé et célèbre pour son chocolat enchanté."
},
{
  name: "Ayutthaya",
  coords: [3091.247, 2572.454],
  url: "/univers/regions/ayutthaya.html",
  description: "Ancien royaume prospère aux traditions navales, port majeur et escale prisée des grands voyageurs."
}
];

lieux.forEach(lieu => {
const marker = L.divIcon({
  className: "custom-marker",
  iconSize: [16, 16]
});

L.marker(lieu.coords, { icon: marker })
  .addTo(map)
  .bindTooltip(lieu.name, {
    className: "codex-tooltip",
    direction: "top"
  })
  .bindPopup(`
    <div class="popup-codex">
      <h3>${lieu.name}</h3>
      <p>${lieu.description}</p>
      <a href="${lieu.url}"><i class="fa-solid fa-arrow-right"></i> Page dédiée</a>
    </div>
  `);
});

const sidebar = document.getElementById("lieux-list");

lieux.forEach(lieu => {
const li = document.createElement("li");
li.textContent = lieu.name;
li.addEventListener("click", () => {
  map.flyTo(lieu.coords, 0, {
    animate: true,
    duration: 1.2
  });
});
sidebar.appendChild(li);
});

map.on("popupopen", function(e) {
const wrapper = e.popup._container.querySelector(".leaflet-popup-content-wrapper");
if (wrapper) {
  wrapper.classList.add("codex-popup-wrapper");
}
});