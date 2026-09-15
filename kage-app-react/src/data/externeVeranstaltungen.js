// Daten für externe Veranstaltungen
// Pflege hier alle Infos zu den Auswärtsterminen.
import vmiKindergartenData from "./JSON/VMI-Kindergärten.json";

const splitVmiPeople = (value) => String(value || "")
  .split(/[,\n]/)
  .map((person) => person.trim())
  .filter(Boolean);
const kindergartenOrganisation = vmiKindergartenData.find((item) => item.Bereich === "Organisation");
const kindergartenVerantwortliche = [
  ...splitVmiPeople(kindergartenOrganisation?.["V-Verantwortlich"]),
  ...splitVmiPeople(kindergartenOrganisation?.["M-Mitwirkend"]),
  ...splitVmiPeople(kindergartenOrganisation?.["I-Information"]),
];
const kindergartenAufgaben = vmiKindergartenData
  .filter((item) => item.Bereich !== "Organisation")
  .map((item) => ({
    text: `${item.Bereich}: ${item.Aufgabenbeschreibung || "Keine Aufgabenbeschreibung"}`,
    verantwortlich: [item["V-Verantwortlich"]].filter(Boolean),
    status: item.Status ? "offen" : "in Arbeit",
  }));

const externeVeranstaltungen = {
  "auswaerts-x": {
    titel: "1. Auswärtssitzung",
    treffpunkt: "Parkplatz Rathaus Zell",
    treffpunktUhrzeit: "18:00 Uhr",
    verein: {
      name: "",
      sitzungsbeginn: "",
      strasse: "",
      plz: "",
      ort: "",
    },
    geschenk: "",
    fahrer: [],
    teilnehmer: [],
    auftritte: [],
  },
  "auswaerts-y": {
    titel: "2. Auswärtssitzung",
    treffpunkt: "Parkplatz Rathaus Zell",
    treffpunktUhrzeit: "18:00 Uhr",
    verein: {
      name: "",
      sitzungsbeginn: "",
      strasse: "",
      plz: "",
      ort: "",
    },
    geschenk: "",
    fahrer: [],
    teilnehmer: [],
    auftritte: [],
  },
  "auswaerts-z": {
    titel: "3. Auswärtssitzung",
    treffpunkt: "Parkplatz Rathaus Zell",
    treffpunktUhrzeit: "18:00 Uhr",
    verein: {
      name: "",
      sitzungsbeginn: "",
      strasse: "",
      plz: "",
      ort: "",
    },
    geschenk: "",
    fahrer: [],
    teilnehmer: [],
    auftritte: [],
  },
  faschingszug: {
    titel: "Faschingszug",
    treffpunkt: "",
    treffpunktUhrzeit: "",
    fahrer: [],
    teilnehmer: [],
    wagenaufbau: "",
    wurfmaterial: "",
  },
  seniorenheime: {
    titel: "Seniorenheime",
    treffpunkt: "",
    treffpunktUhrzeit: "",
    verein: {
      name: "",
      sitzungsbeginn: "",
      strasse: "",
      plz: "",
      ort: "",
    },
    geschenk: "",
    fahrer: [],
    teilnehmer: [],
    auftritte: [],
  },
  kindergarten: {
    titel: "Kindergarten",
    treffpunkt: "",
    treffpunktUhrzeit: "",
    verein: {
      name: "",
      sitzungsbeginn: "",
      strasse: "",
      plz: "",
      ort: "",
    },
    geschenk: "",
    fahrer: [],
    teilnehmer: [],
    auftritte: [],
    verantwortliche: kindergartenVerantwortliche,
    aufgaben: kindergartenAufgaben,
  },
};

export default externeVeranstaltungen;
