/* ────────────────────────────────────────────────────────────────
   Inhoud. Alles wat op het speelveld gebeurt staat hier — pas gerust aan.
   ──────────────────────────────────────────────────────────────── */

// Zaterdag t/m zondag: één week plus twee weekends (Vlaamse herfstvakantie 2026).
const HERFSTVAKANTIE = { start: '2026-10-31', end: '2026-11-08' };
const VAKANTIEDAGEN = 9;

// Wens 1–4 zijn de hoeken van het speelveld; wens 5 is een richting (naar rechts).
const WISHES = [
  { n: 1, name: 'Mooi en proper afgewerkt', sub: 'Zoals op het moodboard.', tone: 'green' },
  { n: 2, name: 'Alle kamers klaar', sub: 'Van inkomhal tot mezzanine.', tone: 'green' },
  { n: 3, name: 'Snel', sub: 'In de herfstvakantie: negen dagen.', tone: 'terra' },
  { n: 4, name: 'Goedkoop', sub: 'Veel zelf doen, weinig uitbesteden.', tone: 'terra' },
  { n: 5, name: 'Niet voor lang', sub: 'Een starterswoning, geen eindstation.', tone: 'ink' },
];

// Snel komt nooit boven dit plafond: het stucwerk moet drogen, ook met vakmensen.
const SNEL_PLAFOND = 0.85;

// De ruimtes, van beneden naar boven. De trap en de twee overlopen zitten samen.
//   staat  ruw = vloer of plafond nog OSB · werk = af, maar niet naar wens · project = een keten van klussen
//   prio   1 = nodig om erin te trekken · 2 = om te wonen · 3 = kan wachten
const ROOMS = [
  { id: 'inkom',  name: 'Inkomhal',                 staat: 'werk',    prio: 3 },
  { id: 'leef',   name: 'Ontvangstruimte & keuken', staat: 'werk',    prio: 3, noot: 'De keuken is ok.' },
  { id: 'trap',   name: 'Trap & overlopen',         staat: 'ruw',     prio: 2, noot: 'De trap zelf is ok. De overloop van de eerste en die van de tweede verdieping zijn hetzelfde werk, hier samengeteld.' },
  { id: 'bad',    name: 'Badkamer',                 staat: 'project', prio: 1 },
  { id: 'living', name: 'Living (1e verdiep)',      staat: 'ruw',     prio: 2 },
  { id: 'slk1',   name: 'Slaapkamer 1',             staat: 'ruw',     prio: 3, noot: 'Wordt een hobbykamer, dus niet superbelangrijk.' },
  { id: 'slk2',   name: 'Slaapkamer 2 & mezzanine', staat: 'ruw',     prio: 1 },
];
const STAAT = { ruw: 'Nog ruw: OSB', werk: 'Af, maar niet naar wens', project: 'Een project apart' };

// De lijst: één klus per regel, in de volgorde van hun lijstje.
//   gewicht  moet = anders kan je er niet in wonen · wil = wat ze willen · nice = nice to have
//   pro      ja = kan niet zonder vakman · liefst = kan zelf, een vakman doet het beter of sneller · (weg) = zelf
//   dagen    zelf, met twee, zonder droogtijd of wachten · mat = materiaal als je het zelf doet
//   vak      werkdagen van een vakman, zonder droogtijd
//   euro     laten doen, materiaal inbegrepen: richtprijzen 2026 voor standaardmateriaal, geen offertes
const TASKS = [
  // 1. Inkomhal (± 6 m²)
  { room: 'inkom', what: 'Voordeur vervangen', sub: 'Laat tocht door en te weinig licht.', trade: 'schrijnwerk', gewicht: 'wil', pro: 'ja', vak: 1, euro: [2500, 5000] },
  { room: 'inkom', what: 'Glazen deur + binnenraam', sub: 'Tussenmuur naar de ontvangstruimte, voor meer licht. Kan zelf, maar deur en raam blijven prijzig.', trade: 'schrijnwerk', gewicht: 'wil', dagen: 3, mat: 2500, vak: 2, euro: [3000, 6000] },
  { room: 'inkom', what: 'Latjesplafond eruit', trade: 'sloop', gewicht: 'wil', dagen: 0.5, mat: 50, vak: 0.5, euro: [150, 300] },
  { room: 'inkom', what: 'Nieuw plafond: gyproc + pleisteren', trade: 'stuc', gewicht: 'wil', pro: 'liefst', dagen: 1, mat: 120, vak: 1, euro: [500, 800] },
  { room: 'inkom', what: 'Plafond verven', trade: 'verf', gewicht: 'wil', dagen: 0.5, mat: 40, vak: 0.5, euro: [150, 250] },
  // 2. Ontvangstruimte + keuken (± 30 m²)
  { room: 'leef', what: 'Latjesplafond eruit', trade: 'sloop', gewicht: 'wil', dagen: 1, mat: 80, vak: 0.5, euro: [250, 450] },
  { room: 'leef', what: 'Nieuw plafond: gyproc + pleisteren', trade: 'stuc', gewicht: 'wil', pro: 'liefst', dagen: 2.5, mat: 600, vak: 1.5, euro: [1800, 2700] },
  { room: 'leef', what: 'Plafond verven', trade: 'verf', gewicht: 'wil', dagen: 1, mat: 90, vak: 1, euro: [400, 600] },
  { room: 'leef', what: 'Muren schuren en verven', trade: 'verf', gewicht: 'nice', dagen: 2, mat: 150, vak: 1.5, euro: [900, 1500] },
  // 3, 4 en 7. Trap en de twee overlopen (± 5 m² elk)
  { room: 'trap', what: 'Trap schuren en verven', sub: 'Opfrissen, eventueel.', trade: 'verf', gewicht: 'nice', dagen: 2, mat: 80, vak: 1.5, euro: [600, 1200] },
  { room: 'trap', what: 'Vloer OSB → lino of vinyl', sub: 'Beide overlopen.', trade: 'vloer', gewicht: 'moet', dagen: 1, mat: 300, vak: 0.5, euro: [400, 650] },
  { room: 'trap', what: 'Plafonds OSB → gyproc + pleisteren', sub: 'Beide overlopen.', trade: 'stuc', gewicht: 'wil', pro: 'liefst', dagen: 1.5, mat: 200, vak: 1, euro: [700, 1100] },
  { room: 'trap', what: 'Muren en plafonds verven', sub: 'Beide overlopen.', trade: 'verf', gewicht: 'wil', dagen: 1.5, mat: 120, vak: 1, euro: [500, 800] },
  { room: 'trap', what: 'Nieuwe plinten', sub: 'Beide overlopen, ± 20 m.', trade: 'vloer', gewicht: 'wil', dagen: 0.5, mat: 120, vak: 0.5, euro: [250, 450] },
  // 5. Badkamer (± 7 m²)
  { room: 'bad', what: 'Latjesplafond eruit', trade: 'sloop', gewicht: 'wil', dagen: 0.5, mat: 30, vak: 0.5, euro: [150, 300] },
  { room: 'bad', what: 'Plafond: gyproc + pleisteren', sub: 'Vochtwerende gyproc.', trade: 'stuc', gewicht: 'wil', pro: 'liefst', dagen: 1, mat: 180, vak: 1, euro: [600, 900] },
  { room: 'bad', what: 'Plafond verven', trade: 'verf', gewicht: 'wil', dagen: 0.5, mat: 40, vak: 0.5, euro: [150, 250] },
  { room: 'bad', what: 'Afvoer en water verleggen voor de wasmachine', sub: 'Vloer deels open en weer dicht.', trade: 'loodgieter', gewicht: 'wil', pro: 'ja', vak: 1, euro: [700, 1200] },
  { room: 'bad', what: 'Zwevend toilet + inbouwreservoir', sub: 'Afvoer licht verleggen, achterbak in gyproc.', trade: 'loodgieter', gewicht: 'wil', pro: 'liefst', dagen: 1.5, mat: 700, vak: 1, euro: [1200, 2000] },
  { room: 'bad', what: 'Douche: valse muur en oude tegels eruit', sub: 'De twee hoekwanden.', trade: 'sloop', gewicht: 'wil', dagen: 1, mat: 50, vak: 0.5, euro: [300, 600] },
  { room: 'bad', what: 'Douche: nieuwe douchebak', sub: 'Aansluiten op de afvoer.', trade: 'loodgieter', gewicht: 'wil', pro: 'ja', vak: 0.5, euro: [500, 1000] },
  { room: 'bad', what: 'Douche: douchebak verlagen', sub: 'Als de afvoer het toelaat.', trade: 'loodgieter', gewicht: 'nice', pro: 'ja', vak: 0.5, euro: [300, 800] },
  { room: 'bad', what: 'Douche: waterdichting + nieuwe tegels', sub: 'De twee hoekwanden, ± 10 m².', trade: 'tegels', gewicht: 'wil', pro: 'liefst', dagen: 2.5, mat: 500, vak: 2, euro: [900, 1600] },
  { room: 'bad', what: 'Douchewand + douchedeur', trade: 'montage', gewicht: 'wil', dagen: 0.5, mat: 600, vak: 0.5, euro: [700, 1500] },
  { room: 'bad', what: 'Tegels tussen douche en meubel weg, anders afwerken', sub: 'Pleisteren of een paneel. Misschien ook de andere tegels.', trade: 'stuc', gewicht: 'nice', pro: 'liefst', dagen: 1.5, mat: 100, vak: 1, euro: [400, 800] },
  { room: 'bad', what: 'Vloer: OSB + lino → tegels of vinyl', sub: 'Tegels vragen een stevige ondergrond op OSB.', trade: 'vloer', gewicht: 'wil', pro: 'liefst', dagen: 1.5, mat: 350, vak: 1, euro: [700, 1200] },
  { room: 'bad', what: 'Ventilatie naar buiten', trade: 'ventilatie', gewicht: 'nice', pro: 'liefst', dagen: 1, mat: 200, vak: 0.5, euro: [350, 700] },
  // 6. Living (± 28 m²)
  { room: 'living', what: 'Plafond OSB → gyproc + pleisteren', trade: 'stuc', gewicht: 'moet', pro: 'liefst', dagen: 2.5, mat: 550, vak: 1.5, euro: [1700, 2500] },
  { room: 'living', what: 'Plafond verven', trade: 'verf', gewicht: 'moet', dagen: 1, mat: 90, vak: 1, euro: [400, 600] },
  { room: 'living', what: 'Vloer OSB → laminaat of vinyl', sub: 'Parket is het dubbele.', trade: 'vloer', gewicht: 'moet', dagen: 1.5, mat: 700, vak: 1, euro: [1300, 2500] },
  // 8. Slaapkamer 1, de hobbykamer (± 14 m²)
  { room: 'slk1', what: 'Velux', sub: 'Laten plaatsen.', trade: 'ramen', gewicht: 'wil', pro: 'ja', vak: 1, euro: [2000, 3500] },
  { room: 'slk1', what: 'Plafond OSB → gyproc + pleisteren', trade: 'stuc', gewicht: 'wil', pro: 'liefst', dagen: 1.5, mat: 300, vak: 1, euro: [900, 1400] },
  { room: 'slk1', what: 'Plafond verven', trade: 'verf', gewicht: 'wil', dagen: 0.5, mat: 60, vak: 0.5, euro: [200, 350] },
  { room: 'slk1', what: 'Vloer OSB → laminaat of vinyl', trade: 'vloer', gewicht: 'wil', dagen: 1, mat: 350, vak: 0.5, euro: [650, 1100] },
  // 9. Slaapkamer 2 + mezzanine (± 18 m²)
  { room: 'slk2', what: 'Eerste velux', sub: 'Laten plaatsen.', trade: 'ramen', gewicht: 'moet', pro: 'ja', vak: 1, euro: [2000, 3500] },
  { room: 'slk2', what: 'Tweede velux', sub: 'Liefst twee, zeggen ze.', trade: 'ramen', gewicht: 'nice', pro: 'ja', vak: 0.5, euro: [1800, 3200] },
  { room: 'slk2', what: 'Plafond OSB → gyproc + pleisteren', trade: 'stuc', gewicht: 'moet', pro: 'liefst', dagen: 2, mat: 380, vak: 1, euro: [1100, 1700] },
  { room: 'slk2', what: 'Plafond verven', trade: 'verf', gewicht: 'moet', dagen: 1, mat: 80, vak: 0.5, euro: [300, 450] },
  { room: 'slk2', what: 'Vloer OSB → laminaat of vinyl', trade: 'vloer', gewicht: 'moet', dagen: 1, mat: 450, vak: 0.5, euro: [850, 1400] },
  { room: 'slk2', what: 'Mezzanine afwerken', sub: 'Vloer en afboording; wat precies is nog niet gezegd.', trade: 'montage', gewicht: 'wil', dagen: 1.5, mat: 350, vak: 1, euro: [800, 1500] },
];

// Vijf gebieden: vier zijden (elk twee wensen helemaal) en het midden.
// Per gebied staan naam, tagline, doorlooptijd, afwerking en note met de hand geschreven. `beslis` zegt per
// klus wat ermee gebeurt: { wat: 'doen' | 'later' | 'niet', wie: 'zelf' | 'vakman' }. Budget en handen worden
// daaruit opgeteld. Een klus met pro: 'ja' gaat altijd naar een vakman, wat de regel ook zegt.
// Overal geldt: sleutel net vóór de vakantie → vakantieweek = gyproc + stuc → 3 à 4 weken drogen → verf.
const ZONES = {
  top: {
    name: 'Het droomhuis',
    tagline: 'Mooi én alles. Zoals jullie het voor ogen hebben — en dat kost tijd én geld.',
    doorlooptijd: ['4 à 6 maanden', 'weekends, gespreid'],
    afwerking: ['Moodboard', 'tot in de details'],
    // Alles, ook de nice-to-haves. Een vakman waar die beter is, zelf wat zelf kan.
    beslis: (t) => ({ wat: 'doen', wie: t.pro ? 'vakman' : 'zelf' }),
    note: 'Wens 1 en 2 helemaal: de hele lijst, tot de laatste nice-to-have. Snel en goedkoop vallen weg — en voor een paar jaar wonen is dit veel.',
  },
  right: {
    name: 'De investering',
    tagline: 'Alles klaar, en snel: vakmensen voor het grote werk, vrienden voor de verf. Duurder, maar het komt bij verkoop terug.',
    doorlooptijd: ['5 à 6 weken', 'vakantie, drogen, schilder'],
    afwerking: ['Netjes en degelijk', 'vakwerk waar het telt'],
    // Alles wat ze willen, de nice-to-haves later. Zelf alleen slopen en verven.
    beslis: (t) => ({ wat: t.gewicht === 'nice' ? 'later' : 'doen', wie: ['sloop', 'verf'].includes(t.trade) ? 'zelf' : 'vakman' }),
    note: 'Wens 2 helemaal, wens 3 grotendeels (het stucwerk moet drogen). Hier wijst wens 5 naartoe: geld komt terug, weekends niet.',
  },
  bottom: {
    name: 'De sprint',
    tagline: 'Snel en goedkoop: negen dagen, iedereen tegelijk, alleen wat nodig is om erin te trekken.',
    doorlooptijd: ['9 dagen + droogtijd', 'de plafonds verven in december'],
    afwerking: ['Bewoonbaar', 'de rest komt later'],
    // Alleen wat moet, allemaal zelf. Wat ze willen komt later, de nice-to-haves niet.
    beslis: (t) => ({ wat: { moet: 'doen', wil: 'later', nice: 'niet' }[t.gewicht], wie: 'zelf' }),
    note: 'Wens 4 helemaal, wens 3 grotendeels. Mooi en alle kamers vallen weg: dit is intrekken, niet verbouwen. De badkamer blijft zoals ze is, en de hobbykamer ook.',
  },
  left: {
    name: 'Kamer per kamer',
    tagline: 'Mooi en goedkoop: zelf doen, één kamer per keer, in de weekends. Traag, en lang niet alles tegelijk.',
    doorlooptijd: ['4 à 6 maanden', 'één kamer per keer'],
    afwerking: ['Mooi, op termijn', 'moodboard, maar traag'],
    // Alles wat ze willen, zelf, één kamer per keer: eerst de slaapkamer en de badkamer, dan boven, dan beneden.
    // De nice-to-haves als er ooit tijd over is.
    beslis: (t) => ({ wat: t.gewicht === 'nice' ? 'later' : 'doen', wie: 'zelf' }),
    note: 'Wens 1 en 4 helemaal. Snel en alle kamers vallen weg. En dit vraagt de meeste vriendenweekends van allemaal — voor een huis waar jullie niet blijven.',
  },
  center: {
    name: 'Het kantelpunt',
    tagline: 'Van alles een beetje. Wat moet, doen we goed; wat mooi is, komt later — of niet.',
    doorlooptijd: ['6 à 8 weken', 'vakantie, drogen, dan verf'],
    afwerking: ['Netjes waar het telt', 'basic waar het mag'],
    // Wat moet, plus wat ze willen in de kamers die eerst nodig zijn (slaapkamer 2, badkamer).
    // Stukadoor, tegelzetter en loodgieter waar het telt; de rest zelf.
    beslis: (t, room) => ({
      wat: t.gewicht === 'moet' || (t.gewicht === 'wil' && room.prio === 1) ? 'doen' : t.gewicht === 'wil' ? 'later' : 'niet',
      wie: t.pro === 'liefst' && ['stuc', 'tegels', 'loodgieter'].includes(t.trade) ? 'vakman' : 'zelf',
    }),
    note: 'Elke wens een beetje, geen enkele helemaal. Het punt waar de meeste verbouwingen uitkomen.',
  },
};

/* ────────────────────────────────────────────────────────────────
   Logica
   ──────────────────────────────────────────────────────────────── */

const $ = (s) => document.querySelector(s);
const field = $('#field');
const pin = $('#pin');
const zoneCard = $('#zone-card');
const clamp = (v) => Math.max(0, Math.min(100, Math.round(v)));
let pos = { x: 50, y: 50 }; // procent, (0,0) = linksboven
let currentZone = null;
let fitBars = [];

const roomById = Object.fromEntries(ROOMS.map((r) => [r.id, r]));
const GEWICHT = { moet: 'moet', wil: 'willen', nice: 'nice to have' };
const fmt = (n) => n.toLocaleString('nl-BE');
const eur = (n) => `€${fmt(Math.round(n))}`;
const eurRange = ([a, b]) => `€${fmt(Math.round(a))}–${fmt(Math.round(b))}`;
const dagen = (n) => `${fmt(n)} ${n === 0 || n > 1 ? 'dagen' : 'dag'}`;
const rond = (n, stap) => Math.round(n / stap) * stap;
const grof = (n) => rond(n, n < 5000 ? 100 : 500); // bedragen: op 100 tot 5.000, daarboven op 500
const som = (arr, f) => arr.reduce((a, x) => a + (f(x) || 0), 0);
const somEuro = (tasks) => [som(tasks, (t) => t.euro[0]), som(tasks, (t) => t.euro[1])];

// Wat een gebied met een klus doet. Een klus die niet zonder vakman kan, gaat altijd naar een vakman.
function verdict(zone, t) {
  const v = zone.beslis(t, roomById[t.room]);
  if (v.wat !== 'doen') return { t, wat: v.wat };
  return { t, wat: 'doen', wie: t.pro === 'ja' ? 'vakman' : v.wie };
}

// Het minimum (alles zelf, een vakman alleen voor wat niet anders kan) en het maximum (alles laten doen)
// van een stel klussen, in geld en in dagen.
function totalen(tasks) {
  const zelf = tasks.filter((t) => t.dagen != null);
  const verplicht = tasks.filter((t) => t.dagen == null);
  const mat = som(zelf, (t) => t.mat);
  const [a, b] = somEuro(verplicht);
  return {
    min: { dagen: som(zelf, (t) => t.dagen), vak: som(verplicht, (t) => t.vak), mat, euro: [mat + a, mat + b], verplicht: verplicht.length },
    max: { vak: som(tasks, (t) => t.vak), euro: somEuro(tasks) },
  };
}

// Hoe goed elke wens uitkomt. Hoeken: bilineair, ×2 zodat een zijde twee wensen helemaal geeft,
// en tot de macht SPREIDING zodat aandacht verdelen niet optelt: in het midden krijgt elke wens
// geen helft maar een derde. Wens 5 volgt de x-as (weekends ↔ geld) en piekt midden rechts.
const SPREIDING = 1.6;
function fitAt({ x, y }) {
  const u = x / 100, v = y / 100;
  const corner = (w) => Math.min(1, 2 * w) ** SPREIDING;
  return [
    corner((1 - u) * (1 - v)),                     // 1 mooi (linksboven)
    corner(u * (1 - v)),                           // 2 alle kamers (rechtsboven)
    Math.min(SNEL_PLAFOND, corner(u * v)),         // 3 snel (rechtsonder)
    corner((1 - u) * v),                           // 4 goedkoop (linksonder)
    u * (1 - 0.3 * Math.abs(2 * v - 1)),           // 5 niet voor lang
  ];
}

function fitWord(v) {
  if (v >= 0.9) return 'helemaal';
  if (v >= 0.7) return 'grotendeels';
  if (v >= 0.45) return 'half';
  if (v >= 0.25) return 'een beetje';
  return 'nauwelijks';
}

// In een hoek (beide assen ver van het midden) krijg je maar één wens.
function inCorner({ x, y }) {
  return Math.min(Math.abs(x - 50), Math.abs(y - 50)) > 30;
}

function zoneAt({ x, y }) {
  const dx = x - 50, dy = y - 50;
  if (Math.abs(dx) + Math.abs(dy) < 25) return 'center';
  if (-dy > Math.abs(dx)) return 'top';
  if (dx > Math.abs(dy)) return 'right';
  if (dy > Math.abs(dx)) return 'bottom';
  return 'left';
}

function renderStatic() {
  $('#wishes').innerHTML = WISHES.map((w) => `
    <li class="wish">
      <span class="num ${w.tone}">${w.n}</span>
      <div><b>${w.name}</b><small>${w.sub}</small></div>
    </li>`).join('');

  $('#fit').innerHTML = WISHES.map((w) => `
    <li class="${w.tone}">
      <div class="row"><span class="num ${w.tone}">${w.n}</span>${w.name}<span class="word"></span></div>
      <div class="bar"><i></i></div>
    </li>`).join('');
  fitBars = [...document.querySelectorAll('#fit li')].map((li) => ({ bar: li.querySelector('i'), word: li.querySelector('.word') }));
}

// Twee totaalregels (minimum en maximum) voor een kamer of het hele huis. stap: afronding van de bedragen.
function somRijen(tasks, label, stap) {
  const { min, max } = totalen(tasks);
  const r = (n) => rond(n, stap);
  return `
    <tr class="sum first">
      <th>Minimum${label}<small>zelf, een vakman alleen waar het moet</small></th>
      <td>${dagen(min.dagen)} zelf${min.vak ? `<small>+ ${dagen(min.vak)} vakman</small>` : ''}</td>
      <td>${min.verplicht ? `${eurRange(min.euro.map(r))}<small>waarvan ~${eur(rond(min.mat, 100))} materiaal</small>` : `~${eur(r(min.mat))}<small>alleen materiaal</small>`}</td>
    </tr>
    <tr class="sum">
      <th>Maximum${label}<small>alles laten doen</small></th>
      <td>${dagen(max.vak)} vakman</td>
      <td>${eurRange(max.euro.map(r))}</td>
    </tr>`;
}

// De lijst: per kamer de klussen, met wat ze zelf kosten (dagen + materiaal) en wat laten doen kost,
// en onder elke kamer het minimum en het maximum.
function renderList() {
  $('#task-count').textContent = TASKS.length;
  $('#tasks tbody').innerHTML = ROOMS.map((r) => {
    const tasks = TASKS.filter((t) => t.room === r.id);
    return `
    <tr class="room"><th colspan="3">
      <span class="kicker">${STAAT[r.staat]}</span><b>${r.name}</b>${r.noot ? `<small>${r.noot}</small>` : ''}
    </th></tr>
    ${tasks.map((t) => `
    <tr>
      <td><b>${t.what}</b><span class="tag ${t.gewicht}">${GEWICHT[t.gewicht]}</span>${t.sub ? `<small>${t.sub}</small>` : ''}</td>
      <td>${t.dagen == null ? '<span class="muted">niet zelf</span>' : `${dagen(t.dagen)}<small>+ ~${eur(t.mat)} materiaal</small>`}</td>
      <td>${eurRange(t.euro)}<small>${dagen(t.vak)} vakman${t.pro === 'ja' ? ' · kan niet zelf' : t.pro === 'liefst' ? ' · liefst een vakman' : ''}</small></td>
    </tr>`).join('')}
    ${somRijen(tasks, '', 100)}`;
  }).join('');
  $('#tasks tfoot').innerHTML = somRijen(TASKS, ', hele huis', 500);
}

function renderFit(p) {
  fitAt(p).forEach((v, i) => {
    fitBars[i].bar.style.width = `${Math.round(v * 100)}%`;
    fitBars[i].word.textContent = fitWord(v);
  });
}

function chip(v) {
  return `<span class="chip ${v.wat}${v.wie ? ` ${v.wie}` : ''}">${v.t.what}${v.wie === 'vakman' ? '<i>vakman</i>' : ''}</span>`;
}

function renderZone(p) {
  const key = zoneAt(p);
  document.querySelectorAll('.field polygon').forEach((el) => el.classList.toggle('active', el.dataset.zone === key));
  document.querySelectorAll('.zone-label').forEach((el) => el.classList.toggle('active', el.textContent === ZONES[key].name));
  $('#zone-hint').hidden = !inCorner(p);
  if (key === currentZone) return;
  currentZone = key;
  const z = ZONES[key];

  const verdicts = TASKS.map((t) => verdict(z, t));
  const doen = verdicts.filter((v) => v.wat === 'doen');
  const vakman = doen.filter((v) => v.wie === 'vakman');
  const zelf = doen.filter((v) => v.wie === 'zelf');
  const later = verdicts.filter((v) => v.wat === 'later').length;
  const niet = verdicts.filter((v) => v.wat === 'niet').length;

  // Budget: vakmensen (richtprijs) plus het materiaal van wat ze zelf doen.
  const [vMin, vMax] = somEuro(vakman.map((v) => v.t));
  const mat = rond(som(zelf, (v) => v.t.mat), 100);
  const budget = vakman.length
    ? [eurRange([grof(vMin + mat), grof(vMax + mat)]), `vakmensen ${eurRange([grof(vMin), grof(vMax)])} · materiaal ~${eur(mat)}`]
    : [`~${eur(mat)}`, 'alleen materiaal, geen vakmensen'];

  // Handen: dagen zelf, met twee, afgezet tegen de negen dagen vakantie.
  const d = som(zelf, (v) => v.t.dagen);
  const extra = Math.ceil((d - VAKANTIEDAGEN) / 2);
  const handen = [`~${Math.round(d)} dagen`, d <= VAKANTIEDAGEN ? 'met twee · past in de vakantieweek' : `met twee · vakantieweek + ${extra} weekend${extra > 1 ? 's' : ''}`];

  $('#zone-name').textContent = z.name;
  $('#zone-tagline').textContent = z.tagline;
  $('#stats').innerHTML = [['Doorlooptijd', ...z.doorlooptijd], ['Budget', ...budget], ['Handen', ...handen], ['Afwerking', ...z.afwerking]]
    .map(([k, v, s]) => `<div><dt>${k}</dt><dd>${v}<small>${s}</small></dd></div>`).join('');
  $('#plan').innerHTML = ROOMS.map((r) => `<li><b>${r.name}</b><div class="chips">${verdicts.filter((v) => v.t.room === r.id).map(chip).join('')}</div></li>`).join('');
  $('#tally').textContent = `${doen.length} van de ${TASKS.length} klussen in dit plan, ${vakman.length} met een vakman · ${later} later · ${niet} vallen weg.`;
  $('#zone-note').textContent = z.note;

  zoneCard.classList.remove('swap');
  void zoneCard.offsetWidth; // herstart de animatie
  zoneCard.classList.add('swap');
}

function setPos(p) {
  pos = { x: clamp(p.x), y: clamp(p.y) };
  pin.style.left = `${pos.x}%`;
  pin.style.top = `${pos.y}%`;
  document.querySelectorAll('.zone-label').forEach((el) => {
    const near = Math.hypot(parseFloat(el.style.left) - pos.x, parseFloat(el.style.top) - pos.y) < 13;
    el.classList.toggle('under', near);
  });
  renderFit(pos);
  renderZone(pos);
}

function posFromPointer(e) {
  const r = field.getBoundingClientRect();
  return { x: (e.clientX - r.left) / r.width * 100, y: (e.clientY - r.top) / r.height * 100 };
}

function renderCountdown() {
  const el = $('#countdown');
  const start = new Date(`${HERFSTVAKANTIE.start}T00:00:00`);
  const end = new Date(`${HERFSTVAKANTIE.end}T00:00:00`);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const fmtDate = (d) => d.toLocaleDateString('nl-BE', { day: 'numeric', month: 'long' });
  const days = Math.round((start - today) / 86400000);
  if (days > 0) {
    el.textContent = `Die loopt van ${fmtDate(start)} tot ${fmtDate(end)}: nog ${days} dagen.`;
  } else if (today <= end) {
    el.textContent = `Die is nu bezig (${fmtDate(start)} – ${fmtDate(end)}).`;
  } else {
    el.textContent = `Die liep van ${fmtDate(start)} tot ${fmtDate(end)}.`;
  }
}

renderStatic();
renderList();
renderCountdown();

field.classList.add('nudge');
setPos({ x: 50, y: 50 });

field.addEventListener('pointerdown', (e) => {
  field.setPointerCapture(e.pointerId);
  field.classList.add('dragging');
  setPos(posFromPointer(e));
});
field.addEventListener('pointermove', (e) => {
  if (field.classList.contains('dragging')) setPos(posFromPointer(e));
});
const release = () => field.classList.remove('dragging');
field.addEventListener('pointerup', release);
field.addEventListener('pointercancel', release);
field.addEventListener('keydown', (e) => {
  const step = e.shiftKey ? 10 : 2;
  const d = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
  if (!d) return;
  e.preventDefault();
  setPos({ x: pos.x + d[0], y: pos.y + d[1] });
});
