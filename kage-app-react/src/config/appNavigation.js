export const appTree = [
  // entfernt, jetzt unter Allgemein
  { key: "kalender", label: "Kalender" },
  { key: "meine-aufgaben", label: "Meine Aufgaben" },
  {
    key: "veranstaltungen",
    label: "Veranstaltungen",
    children: [
      {
        key: "interne",
        label: "Intern",
        children: [
          { key: "11-11", label: "11.11. Jetzt geht los" },
          { key: "prunksitzung-1", label: "1. Prunksitzung" },
          { key: "prunksitzung-2", label: "2. Prunksitzung" },
          { key: "bunter-nachmittag", label: "Bunter Nachmittag" },
          { key: "beatbox-party", label: "Beat-Bocks-Party" },
          { key: "kinderfasching", label: "Kinderfasching" },
          { key: "kehraus", label: "Kehraus" },
        ],
      },
      {
        key: "externe",
        label: "Extern",
        children: [
          { key: "auswaerts-x", label: "1. Auswärtssitzung (X)" },
          { key: "auswaerts-y", label: "2. Auswärtssitzung (Y)" },
          { key: "auswaerts-z", label: "3. Auswärtssitzung (Z)" },
          { key: "faschingszug", label: "Faschingszug" },
          { key: "seniorenheime", label: "Seniorenheime" },
        ],
      },
    ],
  },
  {
    key: "verein",
    label: "Verein",
    children: [
      { key: "vorstand", label: "Vorstandschaft" },
      {
        key: "gruppen",
        label: "Gruppen",
        children: [
          { key: "rote-garde", label: "Rote Garde" },
          { key: "blaue-garde", label: "Blaue Garde" },
          { key: "gruene-garde", label: "Grüne Garde" },
          { key: "boeckli-garde", label: "Zeller Böckli" },
          { key: "boeck2beat", label: "Böck2Beat" },
          { key: "maennerballett", label: "Zeller Böck Ballett" },
          { key: "zdl", label: "Zeller Daller Lacker" },
          { key: "buettenredner", label: "Büttenredner" },
          { key: "elfinnen", label: "11'n" },
          { key: "elferraete", label: "Elferräte" },
        ],
      },
      {
        key: "ethikKommitee",
        label: "Ethikkommitee",
        children: [
          { key: "kommitee", label: "Kommitee" },
          { key: "kagezellcarta", label: "KaGe-Carta" },
          { key: "ahndung", label: "Ahndung" },
          { key: "meldung", label: "Meldung" },
        ],
      },
      { key: "listen", label: "Listen & Dokumente" },
    ],
  },
  { key: "finanzen", label: "Finanzen" },
  // entfernt, jetzt unter Allgemein
  { key: "kummerkasten", label: "Böck-Feedback" },
  { key: "datenschutz", label: "Datenschutz" },
  {
    key: "allgemein",
    label: "Allgemein",
    children: [
      { key: "cloud", label: "Cloud" },
      { key: "nutzerverwaltung", label: "Nutzerverwaltung" },
      { key: "app-dokumentation", label: "App-Dokumentation" },
      { key: "uebersicht", label: "ToDo's für die App" },
      { key: "zugaenge", label: "Zugänge & Anleitungen" },
      { key: "nutzung", label: "Nutzung der App" },
    ],
  },
  // ...existing code...
];

export const MENU_ROLES = {
  finanzen: "vorstand",
  zugaenge: "vorstand",
  mitglieder: "mitglied",
  "meine-aufgaben": "mitglied",
  nutzerverwaltung: "admin",
  cloud: "vorstand",
  listen: "vorstand",
};

export const TOP_LEVEL = ["veranstaltungen", "verein", "allgemein"];
export const SUB_LEVEL = ["interne", "externe", "gruppen", "ethikKommitee"];
export const GRAND_LEVEL = [];
