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
import EinstellungenPage from "../components/EinstellungenPage";
import EthikkommiteePage from "../components/EthikkommiteePage";
import MeldungPage from "../components/MeldungPage";
import DatenschutzPage from "../components/DatenschutzPage";
import AppDokumentationPage from "../components/AppDokumentationPage";
import CloudPage from "../components/CloudPage";
import ListenPage from "../components/ListenPage";

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
  einstellungen: EinstellungenPage,
};

const EXTERNE_STANDARD_KEYS = new Set(["auswaerts-x", "auswaerts-y", "auswaerts-z", "seniorenheime"]);

export function renderAppContent(active) {
  const groupData = GROUP_DATA_BY_KEY[active];
  if (groupData) {
    return <GroupPage key={active} groupKey={active} group={groupData} />;
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
