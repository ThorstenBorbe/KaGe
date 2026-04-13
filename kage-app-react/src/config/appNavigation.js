export const appTree = [
  { key: "uebersicht", label: "ToDo's für die App" },
  { key: "kalender", label: "Kalender" },
  {
    key: "veranstaltungen",
    label: "Veranstaltungen",
    children: [
      {
        key: "interne",
        label: "Intern",
        children: [
          { key: "11-11", label: "11.11. Jetzt geht los", children: [{ key: "11-11-aufbau", label: "Aufbau" }, { key: "11-11-abbau", label: "Abbau" }] },
          { key: "prunksitzung-1", label: "1. Prunksitzung", children: [{ key: "prunksitzung-1-aufbau", label: "Aufbau" }, { key: "prunksitzung-1-abbau", label: "Abbau" }] },
          { key: "prunksitzung-2", label: "2. Prunksitzung", children: [{ key: "prunksitzung-2-aufbau", label: "Aufbau" }, { key: "prunksitzung-2-abbau", label: "Abbau" }] },
          { key: "bunter-nachmittag", label: "Bunter Nachmittag", children: [{ key: "bunter-nachmittag-aufbau", label: "Aufbau" }, { key: "bunter-nachmittag-abbau", label: "Abbau" }] },
          { key: "beatbox-party", label: "Beat-Bocks-Party", children: [{ key: "beatbox-party-aufbau", label: "Aufbau" }, { key: "beatbox-party-abbau", label: "Abbau" }] },
          { key: "kinderfasching", label: "Kinderfasching", children: [{ key: "kinderfasching-aufbau", label: "Aufbau" }, { key: "kinderfasching-abbau", label: "Abbau" }] },
          { key: "kehraus", label: "Kehraus", children: [{ key: "kehraus-aufbau", label: "Aufbau" }, { key: "kehraus-abbau", label: "Abbau" }] },
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
  { key: "zugaenge", label: "Zugänge & Anleitungen" },
  { key: "kummerkasten", label: "Böck-Feedback" },
  { key: "datenschutz", label: "Datenschutz" },
  { key: "app-dokumentation", label: "App-Dokumentation" },
  { key: "nutzerverwaltung", label: "Nutzerverwaltung" },
  { key: "cloud", label: "Cloud" },
];

export const MENU_ROLES = {
  finanzen: "vorstand",
  zugaenge: "vorstand",
  mitglieder: "mitglied",
  nutzerverwaltung: "admin",
  cloud: "vorstand",
  listen: "vorstand",
};

export const TOP_LEVEL = ["veranstaltungen", "verein"];
export const SUB_LEVEL = ["interne", "externe", "gruppen", "ethikKommitee"];
export const GRAND_LEVEL = ["11-11", "prunksitzung-1", "prunksitzung-2", "bunter-nachmittag", "beatbox-party", "kinderfasching", "kehraus"];
