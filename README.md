# Dokumentation

## Recap unseres Themas

In diesem Projekt geht es darum, Spotify-Daten mit einer räumlichen Ebene zu verknüpfen. Dabei haben wir die meistgestreamten Songs und Alben in jedem verfügbaren europäischen Land auf einer Webmap visualisiert.

## Aufbau der Website

Zuerst werden unsere Nutzer mit einer einfachen aber ansprechenden Landing-Page begrüßt, wo man auf den Start-Button drücken muss, um die Applikation zu starten. Man sieht hier unser selbst erstelltes Logo sowie den Namen unseres Projekts "SpatialMusicViewer". Außerdem ploppen hier immer wieder Musiknoten auf, welche eine zufällige Positionsgenerierung haben:

![alt text](<Bilder für Dokumentation/landingpage.png>)

Klickt man bei der Landing-Page auf "Start", wird man direkt zum Hauptaugenmerk unserer Website geleitet - nämlich zur interaktiven Webmap:

![alt text](<Bilder für Dokumentation/webmap.png>)

Hier gibt es viele interaktive Möglichkeiten. Es gibt:
- Zoom in/out
- Home Button
- Suchleiste
- Webmap mit Klickfunktion

Mit der _Zoom-Funktion_ kann man den Maßstab der Karte verändern. Wir uns hier extra dazu entschieden, ein minimales und maximales Zoom-Level einzuführen, da sich unsere Daten nur auf europäische Länder beziehen. Mit Hilfe des _Home-Buttons_ kann man zum ursprünglichen Anfangszustand der Karte springen. Bei der _Suchleiste_ kann man die einzelnen Länder mit Namen suchen, falls man nicht weiß, wo sich diese auf der Karte befinden. Gibt man hier beispielsweise "A" ein, kommen alle Länder mit Anfangsbuchstaben A. Man hat auch direkt die Möglichkeit, die Länder auf der Karte durch einen Linksklick zu selektieren. 

Selektiert man ein Land - egal, ob mit Linksklick auf das Land selbst oder durch die Suchleiste - wird auf der rechten Seite der Website ein Popup angezeigt. Folgender Screenshot zeigt das Popup am Beispiel des Landes Österreich:

![alt text](<Bilder für Dokumentation/popup.png>)

Hier sieht man auf einem Überblick die aktuell beliebtesten Songs in Österreich. Oben-links im Popup gibt es die Funktion zwischen Songs und Alben zu switchen:

![alt text](<Bilder für Dokumentation/switch.png>)

Klickt man auf einen Song-Container, wird man direkt zum jeweiligen Song auf Spotify weitergeleitet. Man kann nun entweder das Popup mit Hilfe des Kreuz-Symbols oben-rechts schließen oder man selektiert ein anderes Land. Je nachdem welches Land man selektiert hat, passt sich das Popup automatisch an. 

Ist ein Land selektiert, wird dieses farblich leicht hervorgehoben:

![alt text](<Bilder für Dokumentation/webmap_closeup.png>)

## Fußzeile

Bei der Fußzeile hat man die Möglichkeit folgende Unterseiten zu erreichen:
- About
- Datenschutz
- Quellen
- Impressum

![alt text](<Bilder für Dokumentation/footer.png>)

Geht man auf eine dieser Seiten, sieht man eine linksbündige Navigationsleiste. Diese beinhaltet die Möglichkeit, wieder zur Karte zurückzugehen, was durch das Kartensymbol visualisiert wird. Ebenso hat man hier die Möglichkeit zu den anderen Fußzeilen-Elementen zu wechseln:

![alt text](<Bilder für Dokumentation/sidebar.png>)

## Backend

Wir haben hier mit der Spotify-API gearbeitet, um die Daten für die Songs und Alben zu bekommen (siehe data_retrieval.py im Ordner Datenbeschaffung). Diese Daten haben wir dann in CSV-Dateien dargestellt. So sieht beispielsweise unsere CSV-Datei für die Top 10 Songs aus. 

![alt text](<Bilder für Dokumentation/csv_top10_songs.png>)

Wir hätten für die automatische Aktualisierung der CSV-Dateien ein Python Skript geschrieben, was man ganz unten in data_retrieval.py findet. Nachdem wir unsere Website aber nicht am Server hosten, bringt sich dieser Code leider nichts mehr:

![alt text](<Bilder für Dokumentation/backend_time.png>)
