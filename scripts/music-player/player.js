const audio = document.getElementById("audio");
const playlistData = {
  sys: [
    {
      src: "https://s3.codex.eottrpg.memiroa.com/audio/sys/eo3-title.mp3",
      fallbackCover: "cover-sys.jpg",
      context: "L'écran titre",
    },
  ],
  charamake: [
    {
      src: "https://s3.codex.eottrpg.memiroa.com/audio/guild/eo1u-guild.mp3",
      fallbackCover: "cover-sys.jpg",
      context: "La création de personnage",
    },
    {
      src: "https://s3.codex.eottrpg.memiroa.com/audio/guild/eo2u-guild.mp3",
      fallbackCover: "cover-sys.jpg",
      context: "La création de personnage",
    },
    {
      src: "https://s3.codex.eottrpg.memiroa.com/audio/guild/eo3-guild-arrange.mp3",
      fallbackCover: "cover-sys.jpg",
      context: "La création de personnage",
    },
    {
      src: "https://s3.codex.eottrpg.memiroa.com/audio/guild/eo4-guild.mp3",
      fallbackCover: "cover-sys.jpg",
      context: "La création de personnage",
    },
    {
      src: "https://s3.codex.eottrpg.memiroa.com/audio/guild/eo5-guild.mp3",
      fallbackCover: "cover-sys.jpg",
      context: "La création de personnage",
    },
    {
      src: "https://s3.codex.eottrpg.memiroa.com/audio/guild/eon-guild.mp3",
      fallbackCover: "cover-sys.jpg",
      context: "La création de personnage",
    },
  ],
  city: [
    {
      src: "https://s3.codex.eottrpg.memiroa.com/audio/city/eo3-city-day-concert.mp3",
      fallbackCover: "cover-explore.jpg",
      context: "Voarmur - Jour",
    },
    {
      src: "https://s3.codex.eottrpg.memiroa.com/audio/city/eo3-city-night-remix.mp3",
      fallbackCover: "cover-explore.jpg",
      context: "Voarmur - Nuit",
    },
    {
      src: "https://s3.codex.eottrpg.memiroa.com/audio/guild/eo3-guild-arrange.mp3",
      fallbackCover: "cover-sys.jpg",
      context: "Voarmur - Guilde des Aventuriers",
    },
    {
      src: "https://s3.codex.eottrpg.memiroa.com/audio/city/eo2u-palace.mp3",
      fallbackCover: "cover-sys.jpg",
      context: "Voarmur - Palais du Sénat",
    },
    {
      src: "https://s3.codex.eottrpg.memiroa.com/audio/city/eo3-harbor-remix.mp3",
      fallbackCover: "cover-sys.jpg",
      context: "Voarmur - Port d'Inver",
    },
    {
      src: "https://s3.codex.eottrpg.memiroa.com/audio/city/eo1u-house.mp3",
      fallbackCover: "cover-explore.jpg",
      context: "Voarmur - Bastion des Égarés",
    },
  ],
  events: [
    {
      src: "https://s3.codex.eottrpg.memiroa.com/audio/city/eo1u-house.mp3",
      fallbackCover: "cover-explore.jpg",
      context: "Préparations au Refuge des Vents Errants",
    },
    {
      src: "https://s3.codex.eottrpg.memiroa.com/audio/event/eo5-event-threat.mp3",
      fallbackCover: "cover-explore.jpg",
      context: "Menace inconnue",
    },
    {
      src: "https://s3.codex.eottrpg.memiroa.com/audio/event/eo1u-event-blue.mp3",
      fallbackCover: "cover-explore.jpg",
      context: "Interrogations",
    },
    {
      src: "https://s3.codex.eottrpg.memiroa.com/audio/event/eo2u-event-blossoms.mp3",
      fallbackCover: "cover-explore.jpg",
      context: "Rencontre avec la Princesse",
    },
  ],
  labyrinth: [
    {
      src: "https://s3.codex.eottrpg.memiroa.com/audio/dungeon/eo3-dungeon1-remix.mp3",
      fallbackCover: "cover-explore.jpg",
      context: "La 1ère Strate - Le Bois de la Cascade",
    },
    {
      src: "https://s3.codex.eottrpg.memiroa.com/audio/dungeon/eo3-dungeon2-remix.mp3",
      fallbackCover: "cover-explore.jpg",
      context: "La 2ème Strate - La Grotte Immergée",
    },
  ],
  battle: [
    {
      src: "https://s3.codex.eottrpg.memiroa.com/audio/battle/first/eo1u-battle-first.mp3",
      fallbackCover: "cover-explore.jpg",
      context: "Combat contre des monstres",
    },
    {
      src: "https://s3.codex.eottrpg.memiroa.com/audio/battle/first/eo2u-battle-first.mp3",
      fallbackCover: "cover-explore.jpg",
      context: "Combat contre des monstres",
    },
    {
      src: "https://s3.codex.eottrpg.memiroa.com/audio/battle/first/eo3-battle-first-remix.mp3",
      fallbackCover: "cover-explore.jpg",
      context: "Combat contre des monstres",
    },
    {
      src: "https://s3.codex.eottrpg.memiroa.com/audio/battle/first/eo4-battle-first.mp3",
      fallbackCover: "cover-explore.jpg",
      context: "Combat contre des monstres",
    },
    {
      src: "https://s3.codex.eottrpg.memiroa.com/audio/battle/first/eo5-battle-first.mp3",
      fallbackCover: "cover-explore.jpg",
      context: "Combat contre des monstres",
    },
    {
      src: "https://s3.codex.eottrpg.memiroa.com/audio/battle/first/eon-battle-first.mp3",
      fallbackCover: "cover-explore.jpg",
      context: "Combat contre des monstres",
    },
  ],
  foe: [
    {
      src: "https://s3.codex.eottrpg.memiroa.com/audio/battle/foe/eo1u-battle-foe.mp3",
      fallbackCover: "cover-explore.jpg",
      context: "Combat contre un F.O.E.",
    },
    {
      src: "https://s3.codex.eottrpg.memiroa.com/audio/battle/foe/eo2u-battle-foe.mp3",
      fallbackCover: "cover-explore.jpg",
      context: "Combat contre un F.O.E.",
    },
    {
      src: "https://s3.codex.eottrpg.memiroa.com/audio/battle/foe/eo3-battle-foe-remix.mp3",
      fallbackCover: "cover-explore.jpg",
      context: "Combat contre un F.O.E.",
    },
    {
      src: "https://s3.codex.eottrpg.memiroa.com/audio/battle/foe/eo4-battle-foe.mp3",
      fallbackCover: "cover-explore.jpg",
      context: "Combat contre un F.O.E.",
    },
    {
      src: "https://s3.codex.eottrpg.memiroa.com/audio/battle/foe/eo5-battle-foe.mp3",
      fallbackCover: "cover-explore.jpg",
      context: "Combat contre un F.O.E.",
    },
    {
      src: "https://s3.codex.eottrpg.memiroa.com/audio/battle/foe/eon-battle-foe.mp3",
      fallbackCover: "cover-explore.jpg",
      context: "Combat contre un F.O.E.",
    },
  ],
  boss: [
    {
      src: "https://s3.codex.eottrpg.memiroa.com/audio/battle/boss/eo2u-battle-boss.mp3",
      fallbackCover: "cover-explore.jpg",
      context: "Combat contre un boss mineur",
    },
    {
      src: "https://s3.codex.eottrpg.memiroa.com/audio/battle/boss/eo3-battle-boss-remix.mp3",
      fallbackCover: "cover-explore.jpg",
      context: "Combat contre un boss majeur",
    },
  ],
  unknown: [
    {
      src: "https://s3.codex.eottrpg.memiroa.com/audio/dungeon/eo1u-dungeon-extra.mp3",
      fallbackCover: "cover-explore.jpg",
      context: "?̷̡͍̙͚͈̲̻͇̖̿̆?̸̫͈̦͈̹̄̋̉̏?̶̢̢̧͕̘̠̆̾̈́̍̀͂̑?̴̠̺̝̈́͆͗͆̂̍̽́͘?̷͕̤̭́͛͘?̴̢͇̻̫̺́̒̓͂͑͠ ̷̘͍̝̖̉́̔̈́̌͗͘̚͝?̴̛͓͕̰̝͖̔̓̃͊̂̈́'̴͇̩̗̞̙̙̫̃?̸̞͖̏̂̊̀?̶̧̮͓͍̩͕̞̔̏͂̒̍͊͒͝͝͝ ̴̟́̇̂?̴̱̝̐̀̏̈̓͗̒͑̕?̵̡͖͓̣̙̄̈́̏?̷̧̻̞̾̈́?̷̠̘̆̈́̽̈́̿ͅ?̴̢̍̓̇͐͌̍?̵̧̞̬̄̍́͐̔͘͝?̷̡̢͈͙̲̞̩͇̟̲͊͑̍?̵̢̞̘̽̔̈́̽̍̊̇ ̴̨̧̛̰͔̌?̴̡͕̜͈̝̗̲͖̗̽̋̒͌̔͂̽̏̇̈́͜ͅ?̴̘͈̏̇̊͒̄͑̈́̎̊͆̚?̴̗͙̺̝̮̓͊̿̏͑͐̃̌̏͛?̶͚̪̜̫̱͓͖̞̣̐̐́̈́͜ͅ?̶̡̢̨̧̺̣̼͇͔̙̹́",
    },
    {
      src: "https://s3.codex.eottrpg.memiroa.com/audio/dungeon/eo1u-dungeon-extra-pulse.mp3",
      fallbackCover: "cover-explore.jpg",
      context: "?̶̧̛̩̱̻́̐͂̎̐͂̈́͝?̵̞̤̦̤̜̗̜̏̈̀͊̉̒̿́̈̚?̵͖͕̝̲̮͇̍͊̋͑͠?̷̱̟͚̙̙̟̘͇͇͒̑̂̏̌̈́͘?̵̡̤̠͓̜̖̮͈̥̔̀̆̎̒̊̌̍͑̕͜͜͠͝ͅ?̴̨̘̼̣̳̃͌̀͛ ̷̨͍̺̖̟̜̺̜̳̒̈́̃̽̾̀̿?̴̛̗̝̻̯͈̳̖̣̬͙̲͉̋̆͂'̷̨̨͉̪̫̙̦̪͓̩͖̲̫͒̐͆̍̌̌͝͠?̸̢̢̞͇̰̲͓̦̇̔̉̂̐̽͂̐͋̐̊͊̚?̵̢̳̜̬̥͙̘͚̤̝̓̋̽̈́͛͝ ̵̢̠͎̩̜͎̙͆̉̄͝?̸͍̼̤̀̈́̃̃̋?̶̬̩̠̭̓͑̐͑̚̚͝͝?̵̛̘̞̳̰̻̳͉̝͒̾̄̊̔̀̈́̓͌̉̍͠?̶̺̺̦͚̠̘̳̾͑͜ͅ?̸̻̹̲͔̒͛̓́̈́͠?̷̨̟̺̤͕̱̫̝͕͉̖͇̻̌̕?̴̢̨̧̙̯̺͉̻̥̻͊͊̑̅͜ͅ?̶̧̡̤͕̞͚͔̫͈͒̓̚͜ ̵̙͈͖͉̔̂̇̒̀͜͠?̵̨̢̡̛̙̱̱̬͖̅́́̿̀̚̚̚ͅ?̵̢̘̖̏͝?̶̤̣̻͇͚͕͙̮̣̙̒̔͝?̸̮̱͔̞͑͑̆̈́̈́̀͘?̴̭͇͗̀̄̈́̑̓̏͌͘͠",
    },
  ],
};
let trackElements = [];
let currentTrackIndex = 0;
let currentPlaylist = "sys";
const playlist = document.getElementById("playlist");
// Remplir la playlist dynamiquement
function loadPlaylist(playlistKey) {
  const tracks = playlistData[playlistKey];
  playlist.classList.remove("visible");
  setTimeout(() => {
    playlist.innerHTML = "";
    trackElements = [];
    currentPlaylist = playlistKey;
    const tracks = playlistData[playlistKey];
    if (!tracks) {
      console.warn(`Playlist "${playlistKey}" introuvable.`);
      return;
    }
    const tagReaders = tracks.map((track, index) => {
      return new Promise((resolve) => {
        window.jsmediatags.read(track.src, {
          onSuccess: function (tag) {
            const title = tag.tags.title || `Piste ${index + 1}`;
            const artist = tag.tags.artist || "Artiste inconnu";
            const album = tag.tags.album || "Album inconnu";
            let imageUrl = track.fallbackCover;
            if (tag.tags.picture) {
              const { data, format } = tag.tags.picture;
              const base64String = data
                .map((byte) => String.fromCharCode(byte))
                .join("");
              imageUrl = `data:${format};base64,${btoa(base64String)}`;
            }
            resolve({
              index,
              src: track.src,
              title,
              artist,
              album,
              imageUrl,
              context: track.context || "",
            });
          },
          onError: function (error) {
            console.warn("Erreur lecture des tags :", error);
            resolve({
              index,
              src: track.src,
              title: `Piste ${index + 1}`,
              artist: "Artiste inconnu",
              album: "Album inconnu",
              imageUrl: track.fallbackCover,
              context: track.context || "",
            });
          },
        });
      });
    });
    Promise.all(tagReaders).then((results) => {
      // Tri par index (juste au cas où)
      results.sort((a, b) => a.index - b.index);
      results.forEach((trackData, i) => {
        const li = document.createElement("li");
        li.dataset.src = trackData.src;
        li.dataset.title = trackData.title;
        li.dataset.artist = trackData.artist;
        li.dataset.album = trackData.album;
        li.dataset.cover = trackData.imageUrl;
        li.dataset.context = trackData.context;
        li.innerHTML = `

                              <img src="${trackData.imageUrl}" class="playlist-cover" alt=" ">
                                  <div class="playlist-info">
                                      <strong>${trackData.title}</strong>
                                      <br>
                                          <span>${trackData.artist}</span>
                                      </div>
`;
        li.addEventListener("click", () => {
          playTrack(i);
          document.getElementById("playPauseBtn").innerHTML =
            '<i class="fa-solid fa-pause"></i>';
        });
        playlist.appendChild(li);
        trackElements.push(li);
      });
      // fade-in après ajout
      setTimeout(() => {
        playlist.classList.add("visible");
      }, 50);
    });
  }, 300); // Attendre la transition fade-out
}
// Gestion des onglets
document.querySelectorAll(".tab-button").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".tab-button")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    loadPlaylist(btn.dataset.playlist);
  });
});
// Charger la playlist par défaut au démarrage
const trackTitle = document.getElementById("track-title");
const trackArtist = document.getElementById("track-artist");
const trackArt = document.getElementById("track-art");
const trackAlbum = document.getElementById("track-album");
const playBtn = document.getElementById("playPauseBtn");
const progressBar = document.getElementById("progressBar");
const timeDisplay = document.getElementById("timeDisplay");
const progressContainer = document.querySelector(".progress-container");

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${secs}`;
}
audio.addEventListener("timeupdate", () => {
  const progress = (audio.currentTime / audio.duration) * 100;
  progressBar.style.width = `${progress}%`;
  timeDisplay.textContent = formatTime(audio.currentTime);
});
playBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
  } else {
    audio.pause();
    playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
  }
});
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
// Récupère les pistes
const tracks = [...playlist.querySelectorAll("li")];
// let currentTrackIndex = tracks.findIndex(li => li.dataset.src === audio.src);
// Joue une piste donnée
function playTrack(index) {
  const totalTimeDisplay = document.getElementById("totalTimeDisplay");
  const track = trackElements[index];
  if (!track) return;
  const trackContext = document.getElementById("track-context");
  trackContext.textContent = track.dataset.context || "";
  currentTrackIndex = index;
  audio.src = track.dataset.src;
  // Attendre que les métadonnées soient chargées
  audio.addEventListener(
    "loadedmetadata",
    () => {
      totalTimeDisplay.textContent = formatTime(audio.duration);
    },
    {
      once: true,
    }
  ); // ⚠️ important : une seule fois, sinon ça s'empile !
  audio.play();
  // Mise à jour visuelle
  trackElements.forEach((t) => t.classList.remove("playing"));
  track.classList.add("playing");
  trackTitle.textContent = track.dataset.title || "Titre inconnu";
  trackArtist.textContent = track.dataset.artist || "Artiste inconnu";
  trackAlbum.textContent = track.dataset.album || "Album inconnu";
  trackArt.src = track.dataset.cover || "cover.jpg";
}

audio.addEventListener("ended", () => {
  if (isLooping) {
    playTrack(currentTrackIndex); // rejoue la même piste
  } else if (currentTrackIndex < trackElements.length - 1) {
    playTrack(currentTrackIndex + 1);
  } else {
    playTrack(0); // boucle à la première
  }
});

// Bouton précédent
prevBtn.addEventListener("click", () => {
  if (currentTrackIndex > 0) {
    playTrack(currentTrackIndex - 1);
  } else {
    playTrack(trackElements.length - 1); // Boucle en arrière
  }
});
// Bouton suivant
nextBtn.addEventListener("click", () => {
  if (currentTrackIndex < trackElements.length - 1) {
    playTrack(currentTrackIndex + 1);
  } else {
    playTrack(0); // Boucle au début
  }
});

// Quand une piste est cliquée dans la playlist
playlist.addEventListener("click", (e) => {
  const li = e.target.closest("li");
  if (!li || !playlist.contains(li)) return;
  const clickedIndex = trackElements.indexOf(li);
  playTrack(clickedIndex);
});
const volumeSlider = document.getElementById("volumeSlider");
const volumeIcon = document.getElementById("volumeIcon");
// Appliquer la valeur du slider au démarrage
window.addEventListener("DOMContentLoaded", () => {
  const initialVolume = parseFloat(volumeSlider.value || 1);
  audio.volume = initialVolume;
  // Met à jour l'icône si besoin
  if (initialVolume === 0) {
    volumeIcon.className = "fas fa-volume-xmark";
  } else if (initialVolume < 0.5) {
    volumeIcon.className = "fas fa-volume-low";
  } else {
    volumeIcon.className = "fas fa-volume-high";
  }
});
let lastVolume = volumeSlider.value;
volumeSlider.addEventListener("input", () => {
  audio.volume = volumeSlider.value;
  // Sauvegarde du volume si non nul
  if (volumeSlider.value > 0) lastVolume = volumeSlider.value;
  // Changement d’icône en fonction du volume
  if (audio.volume == 0) {
    volumeIcon.className = "fas fa-volume-xmark";
  } else if (audio.volume < 0.5) {
    volumeIcon.className = "fas fa-volume-low";
  } else {
    volumeIcon.className = "fas fa-volume-high";
  }
});
volumeIcon.addEventListener("click", () => {
  if (audio.volume > 0) {
    lastVolume = audio.volume;
    audio.volume = 0;
    volumeSlider.value = 0;
    volumeIcon.className = "fas fa-volume-xmark";
  } else {
    audio.volume = lastVolume || 1;
    volumeSlider.value = audio.volume;
    volumeIcon.className =
      audio.volume < 0.5 ? "fas fa-volume-low" : "fas fa-volume-high";
  }
});
progressContainer.addEventListener("click", (e) => {
  const rect = progressContainer.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const width = rect.width;
  const newTime = (clickX / width) * audio.duration;
  audio.currentTime = newTime;
});
playlist.addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    audio.src = e.target.dataset.src;
    audio.play();
    trackTitle.textContent = e.target.dataset.title || "Titre inconnu";
    trackArtist.textContent = e.target.dataset.artist || "Artiste inconnu";
    trackAlbum.textContent = e.target.dataset.album || "Album inconnu";
    trackArt.src = e.target.dataset.cover || "cover.jpg";
  }
});

const loopBtn = document.getElementById("loopBtn");
let isLooping = false;

loopBtn.addEventListener("click", () => {
  isLooping = !isLooping;
  loopBtn.classList.toggle("active", isLooping);
});
