// Daten für interne Veranstaltungen – Vorbereitung, Aufbau, Veranstaltung & Abbau.
// Cloud-JSON kann Aufgaben entweder als String oder als Objekt speichern.
// Beispiel fuer eine Aufgabe mit Verantwortlichen:
// { text: "Getraenke bestellen", verantwortlich: ["Max Mueller", "Anna Schmidt"], status: "offen" }

function createPhase(withSchedule = true) {
  return {
    ...(withSchedule ? { datum: "", uhrzeit: "", ort: "" } : {}),
    verantwortliche: [],
    aufgaben: [],
    bemerkungen: "",
  };
}

function createInternalEvent(config) {
  return {
    vorbereitung: {
      ...createPhase(false),
      verantwortliche: config.preparationOwners,
      aufgaben: [
        { text: `${config.label}: Materialliste abstimmen`, verantwortlich: [config.preparationOwners[0]], status: "offen" },
        { text: `${config.label}: Dienstplan und Helfer final einteilen`, verantwortlich: config.preparationOwners, status: "in Arbeit" },
      ],
      bemerkungen: `Letzte Abstimmung fuer ${config.label} spaetestens drei Tage vorher einplanen.`,
    },
    aufbau: {
      ...createPhase(true),
      datum: config.setupDate,
      uhrzeit: config.setupTime,
      ort: config.location,
      verantwortliche: config.setupOwners,
      aufgaben: [
        { text: "Buehne und Technik vorbereiten", verantwortlich: [config.setupOwners[0]], status: "in Arbeit" },
        { text: "Bestuhlung, Deko und Beschilderung aufbauen", verantwortlich: config.setupOwners, status: "offen" },
      ],
      bemerkungen: `Bitte ${config.setupMeetingPoint} als Treffpunkt intern kommunizieren.`,
    },
    veranstaltung: {
      ...createPhase(true),
      datum: config.eventDate,
      uhrzeit: config.eventTime,
      ort: config.location,
      bemerkungen: config.eventNote,
    },
    abbau: {
      ...createPhase(true),
      datum: config.teardownDate,
      uhrzeit: config.teardownTime,
      ort: config.location,
      verantwortliche: config.teardownOwners,
      aufgaben: [
        { text: "Technik abbauen und sicher verpacken", verantwortlich: [config.teardownOwners[0]], status: "offen" },
        { text: "Saal reinigen und Material rueckfuehren", verantwortlich: config.teardownOwners, status: "offen" },
      ],
      bemerkungen: `Rueckgabe und Abschlusscheck direkt nach ${config.label} dokumentieren.`,
    },
  };
}

const interneVeranstaltungen = {
  "11-11": createInternalEvent({
    label: "11.11. Jetzt geht los",
    location: "Narrhalla Zell",
    setupMeetingPoint: "Buehneneingang Narrhalla",
    setupDate: "08.11.2026",
    setupTime: "17:30 Uhr",
    eventDate: "11.11.2026",
    eventTime: "19:11 Uhr",
    teardownDate: "11.11.2026",
    teardownTime: "22:45 Uhr",
    preparationOwners: ["Lisa Becker", "Marco Schneider"],
    setupOwners: ["Marco Schneider", "Nina Keller"],
    teardownOwners: ["Jonas Hartmann", "Lena Vogel"],
    eventNote: "Sektempfang ab 18:30 Uhr, Programmstart puenktlich um 19:11 Uhr.",
  }),
  "prunksitzung-1": createInternalEvent({
    label: "1. Prunksitzung",
    location: "Stadthalle Zell",
    setupMeetingPoint: "Seiteneingang Halle",
    setupDate: "22.01.2027",
    setupTime: "14:00 Uhr",
    eventDate: "23.01.2027",
    eventTime: "19:33 Uhr",
    teardownDate: "24.01.2027",
    teardownTime: "09:30 Uhr",
    preparationOwners: ["Kathrin Maier", "Simon Braun"],
    setupOwners: ["Simon Braun", "David Wolf"],
    teardownOwners: ["David Wolf", "Tanja Kruse"],
    eventNote: "Einlass ab 18:30 Uhr, Orden und Programmhefte am Empfang bereitlegen.",
  }),
  "prunksitzung-2": createInternalEvent({
    label: "2. Prunksitzung",
    location: "Stadthalle Zell",
    setupMeetingPoint: "Buehneneingang Halle",
    setupDate: "29.01.2027",
    setupTime: "14:00 Uhr",
    eventDate: "30.01.2027",
    eventTime: "19:33 Uhr",
    teardownDate: "31.01.2027",
    teardownTime: "09:30 Uhr",
    preparationOwners: ["Miriam Roth", "Patrick Weiss"],
    setupOwners: ["Patrick Weiss", "Nadine Frank"],
    teardownOwners: ["Nadine Frank", "Oliver Kuhn"],
    eventNote: "Gaesteempfang am Haupteingang, Technikprobe bis spaetestens 18:15 Uhr abschliessen.",
  }),
  "bunter-nachmittag": createInternalEvent({
    label: "Bunter Nachmittag",
    location: "Pfarrsaal Zell",
    setupMeetingPoint: "Pfarrhof Innenhof",
    setupDate: "06.02.2027",
    setupTime: "10:00 Uhr",
    eventDate: "06.02.2027",
    eventTime: "14:11 Uhr",
    teardownDate: "06.02.2027",
    teardownTime: "18:30 Uhr",
    preparationOwners: ["Heike Sommer", "Tobias Graf"],
    setupOwners: ["Tobias Graf", "Mara Busch"],
    teardownOwners: ["Mara Busch", "Heike Sommer"],
    eventNote: "Kaffee und Kuchen ab 13:15 Uhr vorbereiten, Seniorengaeste bevorzugt platzieren.",
  }),
  "beatbox-party": createInternalEvent({
    label: "Beat-Bocks-Party",
    location: "KaGe Clubhalle",
    setupMeetingPoint: "Hinterer Hallenzugang",
    setupDate: "12.02.2027",
    setupTime: "16:00 Uhr",
    eventDate: "12.02.2027",
    eventTime: "20:00 Uhr",
    teardownDate: "13.02.2027",
    teardownTime: "11:00 Uhr",
    preparationOwners: ["Kevin Lang", "Laura Seitz"],
    setupOwners: ["Kevin Lang", "Tom Berger"],
    teardownOwners: ["Tom Berger", "Julia Hahn"],
    eventNote: "Soundcheck ab 18:00 Uhr, Sicherheitsdienst und Einlassband rechtzeitig abstimmen.",
  }),
  kinderfasching: createInternalEvent({
    label: "Kinderfasching",
    location: "Turnhalle Zell",
    setupMeetingPoint: "Turnhalleneingang",
    setupDate: "14.02.2027",
    setupTime: "09:00 Uhr",
    eventDate: "14.02.2027",
    eventTime: "14:00 Uhr",
    teardownDate: "14.02.2027",
    teardownTime: "18:00 Uhr",
    preparationOwners: ["Sandra Neumann", "Pia Lorenz"],
    setupOwners: ["Sandra Neumann", "Jan Richter"],
    teardownOwners: ["Jan Richter", "Pia Lorenz"],
    eventNote: "Kinderschminken, Spielecke und Getraenkestation vor Oeffnung pruefen.",
  }),
  kehraus: createInternalEvent({
    label: "Kehraus",
    location: "Narrhalla Zell",
    setupMeetingPoint: "Thekenbereich Narrhalla",
    setupDate: "16.02.2027",
    setupTime: "15:00 Uhr",
    eventDate: "16.02.2027",
    eventTime: "19:00 Uhr",
    teardownDate: "17.02.2027",
    teardownTime: "10:00 Uhr",
    preparationOwners: ["Daniela Fink", "Rene Scholz"],
    setupOwners: ["Rene Scholz", "Saskia Maurer"],
    teardownOwners: ["Saskia Maurer", "Daniela Fink"],
    eventNote: "Abschlussrunde mit Helfern nach Veranstaltungsende kurz einplanen.",
  }),
};

export default interneVeranstaltungen;
