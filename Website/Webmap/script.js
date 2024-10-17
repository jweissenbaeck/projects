// Initialisiere die Karte und setze die Anfangsposition und den Zoom-Level
var mymap = L.map("map").setView([50, 10], 4);

// Füge die Tile-Layer von OpenStreetMap hinzu
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
}).addTo(mymap);

// URLs für GeoJSON-Daten und CSV-Dateien mit Songs und Alben
var geojsonUrl =
  "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson";
var songsUrl = "../../Datenbeschaffung/song_data.csv";
var albumsUrl = "../../Datenbeschaffung/album_data.csv";

// Arrays und Objekte zur Speicherung der verfügbaren Länder und Daten
var available_countries = [];
var songsDataMap = {}; 
var albumsDataMap = {};
var selectedCountry = "";

// Laden der Song-Daten aus der CSV-Datei
fetch(songsUrl)
  .then((response) => response.text())
  .then((data) => {
    Papa.parse(data, {
      header: true,
      complete: function (results) {
        results.data.forEach((row) => {
          var countryName = row.Country.trim();
          if (!available_countries.includes(countryName)) {
            available_countries.push(countryName);
          }
          if (!songsDataMap[countryName]) {
            songsDataMap[countryName] = [];
          }
          songsDataMap[countryName].push({
            rank: row.Rank,
            song: row.Song,
            artists: row.Artists,
            album: row.Album,
            cover: row.Cover,
            link: row.Link,
          });
        });

        // Lade die Album-Daten nach dem Einlesen der Songs
        loadAlbumData(); 
      },
    });
  });

// Laden der Album-Daten aus der CSV-Datei
function loadAlbumData() {
  fetch(albumsUrl)
    .then((response) => response.text())
    .then((data) => {
      Papa.parse(data, {
        header: true,
        complete: function (results) {
          results.data.forEach((row) => {
            var countryName = row.Country.trim();
            if (!available_countries.includes(countryName)) {
              available_countries.push(countryName);
            }
            if (!albumsDataMap[countryName]) {
              albumsDataMap[countryName] = [];
            }
            albumsDataMap[countryName].push({
              rank: row.Rank,
              name: row.Name,
              artists: row.Artists,
              cover: row.Cover,
              link: row.Link,
            });
          });

          // Erstelle die Karte nach dem Einlesen der Album-Daten
          createMap();
        },
      });
    });
}

// Funktion zur Erstellung der Karte und Hinzufügen der GeoJSON-Daten
function createMap() {
  // Definiere die Kartenbegrenzungen
  var southWest = L.latLng(30, -20),
    northEast = L.latLng(70, 40),
    bounds = L.latLngBounds(southWest, northEast);

  mymap.setMaxBounds(bounds);
  mymap.on("drag", function () {
    mymap.panInsideBounds(bounds, { animate: false });
  });

  // Füge die GeoJSON-Daten zur Karte hinzu
  fetch(geojsonUrl)
    .then((response) => response.json())
    .then((data) => {
      var geojsonLayer = L.geoJSON(data, {
        style: function (feature) {
          var countryName = feature.properties.ADMIN;
          return {
            color: getColor(countryName),
            weight: 1,
            fillOpacity: 0.6,
          };
        },
        onEachFeature: function (feature, layer) {
          var countryName = feature.properties.ADMIN;
          if (available_countries.includes(countryName)) {
            layer.on({
              click: function (e) {
                highlightCountry(layer);
                selectedCountry = countryName;
                updatePopupContent(countryName);
              },
            });
          }
        },
      }).addTo(mymap);

      // Füge die Suchfunktion zur Karte hinzu
      var searchControl = new L.Control.Search({
        layer: geojsonLayer,
        propertyName: "ADMIN",
        marker: false,
        moveToLocation: function (latlng, title, map) {
          var zoom = 5;
          map.setView(latlng, zoom);
        },
      });

      // Event-Handler für die Suchfunktion
      searchControl.on("search:locationfound", function (e) {
        if (e.layer) {
          highlightCountry(e.layer);
          selectedCountry = e.text; 
          updatePopupContent(selectedCountry);
          openPopup();
        }
      });

      mymap.addControl(searchControl); 
    });

  // Füge einen Home-Button zur Karte hinzu
  var HomeControl = L.Control.extend({
    options: {
      position: "topleft",
    },

    onAdd: function (map) {
      var homeButton = L.DomUtil.create(
        "div",
        "leaflet-bar leaflet-control leaflet-control-custom"
      );
      homeButton.innerHTML = '<button id="home-button">Home</button>';
      homeButton.onclick = function () {
        mymap.setView([50, 10], 4);
      };
      return homeButton;
    },
  });

  mymap.addControl(new HomeControl());
}

// Funktion zur Bestimmung der Farbe eines Landes basierend auf der Verfügbarkeit von Daten
function getColor(countryName) {
  return available_countries.includes(countryName) ? "green" : "gray";
}

// Funktion zur Hervorhebung eines ausgewählten Landes
function highlightCountry(layer) {
  mymap.eachLayer(function (l) {
    if (l.feature && l.feature.properties.ADMIN) {
      l.setStyle({
        color: getColor(l.feature.properties.ADMIN),
        weight: 1,
        fillOpacity: 0.6,
      });
    }
  });

  layer.setStyle({ color: "#00660f", weight: 2 });
}

// Funktion zur Aktualisierung des Inhalts des Popups basierend auf dem ausgewählten Land und dem aktiven Tab (Songs oder Alben)
function updatePopupContent(countryName) {
  var activeTab = document
    .querySelector(".popup-nav-item.active")
    .getAttribute("data-page");
  var dataMap = activeTab === "songs" ? songsDataMap : albumsDataMap;
  var data = dataMap[selectedCountry];
  var popupContent = "";

  if (!data || data.length === 0) {
    popupContent = `<h3>Keine Daten für ${countryName} verfügbar</h3>`;
  } else {
    if (activeTab === "songs") {
      popupContent = `<h3>Top 10 Songs in ${countryName}</h3><div class="song-list">`;
      data.forEach((song) => {
        popupContent += `
                    <a href="${song.link}" target="_blank" class="song-item">
                        <img src="${song.cover}" alt="${song.song}" class="song-cover">
                        <div class="song-info">
                            <strong>${song.rank}. ${song.song}</strong><br>
                            Artist: ${song.artists}<br>
                            Album: ${song.album}<br>
                        </div>
                    </a>`;
      });
    } else {
      popupContent = `<h3>Top 5 Alben in ${countryName}</h3><div class="album-list">`;
      data.forEach((album) => {
        popupContent += `
                    <a href ="${album.link}" target="_blank" class="song-item">
                        <img src="${album.cover}" alt="${album.name}" class="song-cover">
                        <div class="album-info">
                            <strong>${album.rank}. ${album.name}</strong><br>
                            Artist: ${album.artists}<br>
                        </div>
                    </a>`;
      });
    }
    popupContent += `</div>`;
  }

  document.getElementById("popup-content").innerHTML = popupContent;

  if (data && data.length > 0) {
    openPopup();
  }
}

// Funktion zum Öffnen des Popups
function openPopup() {
  document.getElementById("map-popup").style.display = "block";
}

// Funktion zum Schließen des Popups und Zurücksetzen der Länderfarben
function closePopup() {
  mymap.eachLayer(function (l) {
    if (l.feature && l.feature.properties.ADMIN) {
      l.setStyle({
        color: getColor(l.feature.properties.ADMIN),
        weight: 1,
        fillOpacity: 0.6,
      });
    }
  });

  document.getElementById("map-popup").style.display = "none";
}

// Event-Listener zum Schließen des Popups beim Klicken auf das Schließen-Symbol
document.getElementById("close-popup").addEventListener("click", function () {
  closePopup();
});

// Event-Listener zur Aktualisierung des Popups bei Navigation zwischen Songs und Alben
document.querySelectorAll(".popup-nav-item").forEach((item) => {
  item.addEventListener("click", function () {
    document.querySelectorAll(".popup-nav-item").forEach((navItem) => {
      navItem.classList.remove("active");
    });
    this.classList.add("active");
    updatePopupContent(selectedCountry);
  });
});

// Setze die maximalen und minimalen Zoom-Level der Karte
mymap.setMaxZoom(5);
mymap.setMinZoom(4);
