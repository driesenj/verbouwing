/* ────────────────────────────────────────────────────────────────
   Inhoud. Alles wat op het speelveld gebeurt staat hier — pas gerust aan.
   ──────────────────────────────────────────────────────────────── */

// Zaterdag t/m zondag: één week plus twee weekends (Vlaamse herfstvakantie 2026).
const HERFSTVAKANTIE = { start: '2026-10-31', end: '2026-11-08' };

// Wens 1–4 zijn de hoeken van het speelveld; wens 5 is een richting (naar rechts).
const WISHES = [
  { n: 1, name: 'Mooi en proper afgewerkt', sub: 'Zoals op het moodboard.', tone: 'green' },
  { n: 2, name: 'Alle kamers klaar', sub: 'Slaapkamers, living, keuken, inkom.', tone: 'green' },
  { n: 3, name: 'Snel', sub: 'In de herfstvakantie: negen dagen.', tone: 'terra' },
  { n: 4, name: 'Goedkoop', sub: 'Veel zelf doen, weinig uitbesteden.', tone: 'terra' },
  { n: 5, name: 'Niet voor lang', sub: 'Een starterswoning, geen eindstation.', tone: 'ink' },
];

// Snel komt nooit boven dit plafond: het stucwerk moet drogen, ook met vakmensen.
const SNEL_PLAFOND = 0.85;

const ROOMS = ['Slaapkamers', 'Living', 'Inkom', 'Keuken', 'Badkamer'];

// Vijf gebieden: vier zijden (elk twee wensen helemaal) en het midden.
// Stats: [label, waarde, toelichting]. Plan: één regel per kamer, in de volgorde van ROOMS.
// Overal geldt: sleutel net vóór de vakantie → vakantieweek = gyproc + stuc → 3 à 4 weken drogen → verf.
const ZONES = {
  top: {
    name: 'Het droomhuis',
    tagline: 'Mooi én alles. Zoals jullie het voor ogen hebben — en dat kost tijd én geld.',
    stats: [
      ['Doorlooptijd', '4 à 6 maanden', 'weekends, gespreid'],
      ['Budget', '€€€€', 'stukadoor, maatwerk, materiaal'],
      ['Handen', '10+ weekends', 'hulp van vrienden'],
      ['Afwerking', 'Moodboard', 'tot in de details'],
    ],
    plan: [
      'Stukadoor voor gyproc en stucwerk in de vakantieweek (nu boeken). Drogen, dan primer, twee lagen, plinten en details zoals gepland.',
      'Volledig naar het moodboard: kleuren, verlichting én de grote ingrepen (vloer, maatwerk).',
      'Nieuwe afwerking, verlichting, opbergwand op maat.',
      'Grondig poetsen, dan de upgrades die jullie wensen: fronten, werkblad, greepjes.',
      'Grondig poetsen, voegen en kitwerk vernieuwen.',
    ],
    note: 'Wens 1 en 2 helemaal. Snel en goedkoop vallen weg — en voor een paar jaar wonen is dit veel.',
  },
  right: {
    name: 'De investering',
    tagline: 'Alles klaar, en snel: vakmensen voor het grote werk, vrienden voor de verf. Duurder, maar het komt bij verkoop terug.',
    stats: [
      ['Doorlooptijd', '5 à 6 weken', 'vakantie, drogen, schilder'],
      ['Budget', '€€€', 'vakmensen voor het grote werk'],
      ['Handen', 'Vakantie + 1 weekend', 'vooral verf'],
      ['Afwerking', 'Netjes en degelijk', 'vakwerk waar het telt'],
    ],
    plan: [
      'Stukadoor voor gyproc en stucwerk in de vakantieweek, een schilder in december. Nu boeken.',
      'Schilderen in de vakantieweek, met vrienden. Nieuwe verlichting als er ruimte is.',
      'Schilderen, kapstok. Klaar.',
      'Grondig poetsen. Klaar.',
      'Grondig poetsen. Klaar.',
    ],
    note: 'Wens 2 helemaal, wens 3 grotendeels (het stucwerk moet drogen). Hier wijst wens 5 naartoe: geld komt terug, weekends niet.',
  },
  bottom: {
    name: 'De sprint',
    tagline: 'Snel en goedkoop: negen dagen, iedereen tegelijk, alleen wat nodig is om erin te trekken.',
    stats: [
      ['Doorlooptijd', '9 dagen + droogtijd', 'de slaapkamer verven in december'],
      ['Budget', '€', 'materiaal, geen vakmensen'],
      ['Handen', '9 dagen, iedereen', 'alle hens aan dek'],
      ['Afwerking', 'Bewoonbaar', 'de rest komt later'],
    ],
    plan: [
      'Eén slaapkamer: gyproc en stucwerk zelf in de vakantieweek, verf in december. De andere twee: deur dicht.',
      'Poetsen, meubels erin. Eén laag verf als er tijd over is.',
      'Poetsen, kapstok ophangen.',
      'Poetsen.',
      'Poetsen.',
    ],
    note: 'Wens 4 helemaal, wens 3 grotendeels. Mooi en alle kamers vallen weg: dit is intrekken, niet verbouwen.',
  },
  left: {
    name: 'Kamer per kamer',
    tagline: 'Mooi en goedkoop: zelf doen, één kamer per keer, in de weekends. Traag, en lang niet alles tegelijk.',
    stats: [
      ['Doorlooptijd', '4 à 6 maanden', 'één kamer per keer'],
      ['Budget', '€ à €€', 'materiaal, geen vakmensen'],
      ['Handen', '12+ weekends', 'hulp van vrienden, veel'],
      ['Afwerking', 'Mooi, op termijn', 'moodboard, maar traag'],
    ],
    plan: [
      'Eerst de kamer die jullie nodig hebben: gyproc en stucwerk zelf in de vakantieweek, verf in december. De andere twee: één per keer, januari tot maart.',
      'Daarna, in de moodboardkleuren. Zolang: poetsen en meubels erin.',
      'Na de living.',
      'Grondig poetsen; upgrades later, stuk per stuk.',
      'Grondig poetsen.',
    ],
    note: 'Wens 1 en 4 helemaal. Snel en alle kamers vallen weg. En dit vraagt de meeste vriendenweekends van allemaal — voor een huis waar jullie niet blijven.',
  },
  center: {
    name: 'Het kantelpunt',
    tagline: 'Van alles een beetje. Wat moet, doen we goed; wat mooi is, komt later — of niet.',
    stats: [
      ['Doorlooptijd', '6 à 8 weken', 'vakantie, drogen, dan verf'],
      ['Budget', '€€', 'stucwerk, verder vooral verf'],
      ['Handen', 'Vakantie + 3 weekends', 'hulp van vrienden'],
      ['Afwerking', 'Netjes waar het telt', 'basic waar het mag'],
    ],
    plan: [
      'Gyproc en stucwerk in de vakantieweek — stukadoor als er nog een vrij is, anders zelf. Schilderen in de weekends zodra het droog is.',
      'Schilderen en verlichting, in de vakantieweek. Meer niet, voorlopig.',
      'Schilderen. Kapstok uit de winkel.',
      'Grondig poetsen. Dan kijken of er nog iets moet.',
      'Grondig poetsen, kit vernieuwen waar nodig.',
    ],
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

function renderFit(p) {
  fitAt(p).forEach((v, i) => {
    fitBars[i].bar.style.width = `${Math.round(v * 100)}%`;
    fitBars[i].word.textContent = fitWord(v);
  });
}

function renderZone(p) {
  const key = zoneAt(p);
  document.querySelectorAll('.field polygon').forEach((el) => el.classList.toggle('active', el.dataset.zone === key));
  document.querySelectorAll('.zone-label').forEach((el) => el.classList.toggle('active', el.textContent === ZONES[key].name));
  $('#zone-hint').hidden = !inCorner(p);
  if (key === currentZone) return;
  currentZone = key;
  const z = ZONES[key];

  $('#zone-name').textContent = z.name;
  $('#zone-tagline').textContent = z.tagline;
  $('#stats').innerHTML = z.stats.map(([k, v, s]) => `<div><dt>${k}</dt><dd>${v}<small>${s}</small></dd></div>`).join('');
  $('#plan').innerHTML = ROOMS.map((r, i) => `<li><b>${r}</b><span>${z.plan[i]}</span></li>`).join('');
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
  const fmt = (d) => d.toLocaleDateString('nl-BE', { day: 'numeric', month: 'long' });
  const days = Math.round((start - today) / 86400000);
  if (days > 0) {
    el.textContent = `Die loopt van ${fmt(start)} tot ${fmt(end)}: nog ${days} dagen.`;
  } else if (today <= end) {
    el.textContent = `Die is nu bezig (${fmt(start)} – ${fmt(end)}).`;
  } else {
    el.textContent = `Die liep van ${fmt(start)} tot ${fmt(end)}.`;
  }
}

renderStatic();
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
