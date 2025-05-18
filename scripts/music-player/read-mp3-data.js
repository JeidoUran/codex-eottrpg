function loadTagsFromUrl(mp3Url) {
  window.jsmediatags.read(mp3Url, {
    onSuccess: function (tag) {
      const picture = tag.tags.picture;
      if (picture) {
        const base64String = picture.data
          .map((byte) => String.fromCharCode(byte))
          .join("");
        const imageUrl = `data:${picture.format};base64,${btoa(base64String)}`;
        // Affiche la pochette
        document.getElementById("track-art").src = imageUrl;
      }
      if (tag.tags.title) {
        document.getElementById("track-title").textContent = tag.tags.title;
      }
      if (tag.tags.artist) {
        document.getElementById("track-artist").textContent = tag.tags.artist;
      }
    },
    onError: function (error) {
      console.warn("Erreur de lecture des tags :", error);
    },
  });
}
