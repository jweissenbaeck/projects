document.addEventListener("DOMContentLoaded", function () {
  // Musiknote erstellen: 
  function createMusicNote() {
    const musicNote = document.createElement("div");
    musicNote.classList.add("music-note");
    musicNote.innerHTML = "&#9835;"; // Notensymbol 
    document.body.appendChild(musicNote);

    // Zufällige Position für die Musiknote auf dem Bildschirm
    const randomX = Math.random() * window.innerWidth;
    const randomY = Math.random() * window.innerHeight;
    musicNote.style.left = `${randomX}px`;
    musicNote.style.top = `${randomY}px`;

    // Entfernen der Note nach 3000ms 
    setTimeout(() => {
      musicNote.remove();
    }, 3000);
  }

  // Erzeuge alle paar Sekunden eine neue Musiknote
  setInterval(createMusicNote, 1000);
});
