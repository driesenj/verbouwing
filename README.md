# Kies er twee

Kleine statische site (HTML/CSS/JS, geen build) om samen te kiezen waar een verbouwing moet landen:
een speelveld met vier hoeken (mooi, alle kamers, snel, goedkoop) en een pin. Sleep de pin en zie per wens en
per kamer welke klussen van de lijst overblijven, wat dat kost en hoeveel dagen het vraagt.

## Publiceren op GitHub Pages

1. Push naar `main`.
2. Repo → **Settings → Pages → Build and deployment**: *Deploy from a branch*, branch `main`, folder `/ (root)`.
3. Na een minuut staat de site op `https://<gebruiker>.github.io/<repo>/`.

## Inhoud aanpassen

Alle inhoud staat bovenaan in [`app.js`](app.js):

- `HERFSTVAKANTIE` — begin en einde van de vakantie (voor de aftelling).
- `WISHES` — de vijf wensen (1–4 zijn de hoeken van het speelveld, 5 is de richting).
- `ROOMS` — de ruimtes, met `staat` (ruw / werk / project) en `prio` (1 = nodig om erin te trekken).
- `TASKS` — de lijst: één klus per regel, met `gewicht` (moet / wil / nice), `pro` (ja / liefst / weg),
  `dagen` en `mat` (zelf doen: dagen met twee, materiaal), `vak` (werkdagen van een vakman) en `euro` (laten doen: richtprijs min–max).
  De tabel onder "Waar staat het huis?" (met per kamer een minimum en een maximum) en de chips in de zonekaart komen allebei uit deze lijst.
- `ZONES` — de vijf gebieden: naam, tagline, doorlooptijd, afwerking en notitie met de hand; `beslis(klus, kamer)`
  zegt per klus of ze in dat gebied *doen*, *later* of *niet* is en of het *zelf* of met een *vakman* gebeurt.
  Budget en handen worden daaruit opgeteld.
- `fitAt()` — hoe goed elke wens uitkomt op een punt (bilineair over de hoeken; `SPREIDING` straft verdelen, `SNEL_PLAFOND` begrenst wens 3).

De vaste tekst (waarom kiezen, de feiten) staat gewoon in [`index.html`](index.html).
