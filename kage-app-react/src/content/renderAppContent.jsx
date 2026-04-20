import GroupPage from "../components/GroupPage";
import ExterneVeranstaltungPage from "../components/ExterneVeranstaltungPage";
import FaschingszugPage from "../components/FaschingszugPage";
import AufbauAbbauPage from "../components/AufbauAbbauPage";
import VorstandsPage from "../components/VorstandsPage";
import BoeckFeedbackPage from "../components/BoeckFeedbackPage";
import FinanzPage from "../components/FinanzPage";
import ToDosPage from "../components/ToDosPage";
import ZugaengePage from "../components/ZugaengePage";
import KaGeCartaPage from "../components/KaGeCartaPage";
import AhndungPage from "../components/AhndungPage";
import AdminPage from "../components/AdminPage";
import KalenderPage from "../components/KalenderPage";
import MeineAufgabenPage from "../components/MeineAufgabenPage";
import EinstellungenPage from "../components/EinstellungenPage";
import EthikkommiteePage from "../components/EthikkommiteePage";
import MeldungPage from "../components/MeldungPage";
import DatenschutzPage from "../components/DatenschutzPage";
import AppDokumentationPage from "../components/AppDokumentationPage";
import CloudPage from "../components/CloudPage";
import ListenPage from "../components/ListenPage";
import NutzungPage from "../components/NutzungPage";

import roteGarde from "../data/roteGarde";
import blaueGarde from "../data/blaueGarde";
import grueneGarde from "../data/grueneGarde";
import boeckliGarde from "../data/boeckliGarde";
import boeck2Beat from "../data/boeck2Beat";
import maennerBallett from "../data/maennerBallett";
import buettenRedner from "../data/buettenRedner";
import elfInnen from "../data/elfInnen";
import elferRaete from "../data/elferRaete";
import zellerDallerLacker from "../data/zellerDallerLacker";
import externeVeranstaltungen from "../data/externeVeranstaltungen";
import interneVeranstaltungen from "../data/interneVeranstaltungen";

const GROUP_DATA_BY_KEY = {
  "rote-garde": roteGarde,
  "blaue-garde": blaueGarde,
  "gruene-garde": grueneGarde,
  "boeckli-garde": boeckliGarde,
  boeck2beat: boeck2Beat,
  maennerballett: maennerBallett,
  elfinnen: elfInnen,
  elferraete: elferRaete,
  buettenredner: buettenRedner,
  zdl: zellerDallerLacker,
};

const STATIC_PAGE_BY_KEY = {
  finanzen: FinanzPage,
  vorstand: VorstandsPage,
  kommitee: EthikkommiteePage,
  meldung: MeldungPage,
  kummerkasten: BoeckFeedbackPage,
  datenschutz: DatenschutzPage,
  "app-dokumentation": AppDokumentationPage,
  uebersicht: ToDosPage,
  zugaenge: ZugaengePage,
  kagezellcarta: KaGeCartaPage,
  ahndung: AhndungPage,
  nutzerverwaltung: AdminPage,
  cloud: CloudPage,
  listen: ListenPage,
  kalender: KalenderPage,
  "meine-aufgaben": MeineAufgabenPage,
  einstellungen: EinstellungenPage,
  nutzung: NutzungPage,
};

const EXTERNE_STANDARD_KEYS = new Set(["auswaerts-x", "auswaerts-y", "auswaerts-z", "seniorenheime"]);
const INTERNAL_EVENT_PHASES = [
  { key: "vorbereitung", label: "Vorbereitung" },
  { key: "aufbau", label: "Aufbau" },
  { key: "veranstaltung", label: "Veranstaltung" },
  { key: "abbau", label: "Abbau" },
];

const INTERNAL_EVENT_LABELS = {
  "11-11": "11.11. Jetzt geht los",
  "prunksitzung-1": "1. Prunksitzung",
  "prunksitzung-2": "2. Prunksitzung",
  "bunter-nachmittag": "Bunter Nachmittag",
  "beatbox-party": "Beat-Bocks-Party",
  kinderfasching: "Kinderfasching",
  kehraus: "Kehraus",
};

const internalEventPageStyle = {
  padding: "24px",
  paddingBottom: "60px",
  width: "100%",
  boxSizing: "border-box",
};

const internalEventHeaderStyle = {
  marginBottom: "20px",
  padding: "20px 24px",
  borderRadius: "20px", // Grosser Header-Block fuer klare optische Absetzung der Eventansicht
  background: "linear-gradient(135deg, #fff7ed 0%, #ffffff 100%)",
  border: "1px solid #fed7aa",
  boxShadow: "0 10px 24px rgba(185, 28, 28, 0.06)",
};

const internalEventGridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "20px",
  alignItems: "start",
};

export function renderAppContent(active) {
  const groupData = GROUP_DATA_BY_KEY[active];
  if (groupData) {
    return <GroupPage key={active} groupKey={active} group={groupData} />;
  }

  const internalEventData = interneVeranstaltungen[active];
  if (internalEventData) {
    const availablePhases = INTERNAL_EVENT_PHASES.filter(({ key }) => internalEventData[key]);

    return (
      <div style={internalEventPageStyle}>
        <div style={internalEventHeaderStyle}>
          <h2 style={{ margin: 0, color: "#9f1239" }}>{INTERNAL_EVENT_LABELS[active] || active}</h2>
          <p style={{ margin: "8px 0 0 0", color: "#6b7280", lineHeight: 1.5 }}>
            Die Bereiche werden in der Reihenfolge Vorbereitung, Aufbau, Veranstaltung und Abbau ueber die volle Breite dargestellt, damit Datum, Uhrzeit, Ort und Aufgaben schneller erfassbar sind.
          </p>
        </div>

        <div style={internalEventGridStyle}>
          {availablePhases.map((phase) => (
            <AufbauAbbauPage
              key={`${active}-${phase.key}`}
              data={internalEventData[phase.key]}
              typ={phase.label}
              embedded
            />
          ))}
        </div>
      </div>
    );
  }

  if (active.endsWith("-aufbau") || active.endsWith("-abbau")) {
    const typ = active.endsWith("-aufbau") ? "Aufbau" : "Abbau";
    const eventKey = active.slice(0, active.lastIndexOf("-"));
    const eventData = interneVeranstaltungen[eventKey];
    const details = eventData?.[typ.toLowerCase()];
    if (details) {
      return <AufbauAbbauPage key={active} data={details} typ={typ} />;
    }
    return <div>Keine {typ.toLowerCase()}-Daten für diesen Menüpunkt hinterlegt.</div>;
  }

  if (active === "faschingszug") {
    return <FaschingszugPage key={active} veranstaltung={externeVeranstaltungen[active]} />;
  }

  if (EXTERNE_STANDARD_KEYS.has(active)) {
    return <ExterneVeranstaltungPage key={active} veranstaltung={externeVeranstaltungen[active]} />;
  }

  const StaticPage = STATIC_PAGE_BY_KEY[active];
  if (StaticPage) {
    return <StaticPage />;
  }

  return <div>Übersicht</div>;
}
