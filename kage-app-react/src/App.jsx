import { useEffect, useState, useRef } from "react";
import { useAuth } from "./context/AuthContext";
import kageLogo from "./assets/Logo/KaGe Zell Logo mit Schriftzug.png";
import { db } from "./firebase/firebaseConfig";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

const APP_VERSION = "v0.0.4";

{ /* hier die java imports */ }
import GroupPage from "./components/GroupPage";
import roteGarde from "./data/roteGarde";
import blaueGarde from "./data/blaueGarde";
import grueneGarde from "./data/grueneGarde";
import boeckliGarde from "./data/boeckliGarde";
import boeck2Beat from "./data/boeck2Beat";
import maennerBallett from "./data/maennerBallett";
import buettenRedner from "./data/buettenRedner";
import elfInnen from "./data/elfInnen";
import elferRaete from "./data/elferRaete";
import zellerDallerLacker from "./data/zellerDallerLacker";
import ethikKommitee from "./data/ethikKommitee";

import ExterneVeranstaltungPage from "./components/ExterneVeranstaltungPage";
import FaschingszugPage from "./components/FaschingszugPage";
import externeVeranstaltungen from "./data/externeVeranstaltungen";
import AufbauAbbauPage from "./components/AufbauAbbauPage";
import interneVeranstaltungen from "./data/interneVeranstaltungen";

{ /* hier die weiteren imports */ }
import VorstandsPage from "./components/VorstandsPage";
import BoeckFeedbackPage from "./components/BoeckFeedbackPage";
import FinanzPage from "./components/FinanzPage";
import UebersichtPage from "./components/UebersichtPage";
import ZugaengePage from "./components/ZugaengePage"; 
import KaGeCartaPage from "./components/KaGeCartaPage";
import AhndungPage from "./components/AhndungPage";
import AdminPage from "./components/AdminPage";
import KalenderPage from "./components/KalenderPage";
import LoginPage from "./components/LoginPage";
import EinstellungenPage from "./components/EinstellungenPage";
import EthikkommiteePage from "./components/EthikkommiteePage";
import MeldungPage from "./components/MeldungPage";
import PrivacyConsentPage from "./components/PrivacyConsentPage";
import DatenschutzPage from "./components/DatenschutzPage";


const appTree = [
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
    ],
  },
  { key: "finanzen", label: "Finanzen" },
  { key: "zugaenge", label: "Zugänge & Anleitungen" },
  { key: "kummerkasten", label: "Böck-Feedback" },
  { key: "datenschutz", label: "Datenschutz" },
  { key: "nutzerverwaltung", label: "Nutzerverwaltung" },
];

function findActiveLabel(items, activeKey) {
  for (const item of items) {
    if (item.key === activeKey) return item.label;
    if (item.children) {
      for (const child of item.children) {
        if (child.key === activeKey) return child.label;
        if (child.children) {
          for (const grand of child.children) {
            if (grand.key === activeKey) return grand.label;
            if (grand.children) {
              const gg = grand.children.find((g) => g.key === activeKey);
              if (gg) return gg.label;
            }
          }
        }
      }
    }
  }
  if (activeKey === "einstellungen") return "Persönliche Einstellungen";
  return activeKey;
}

// Welche Rollen dürfen welche Menüpunkte sehen:
// Einträge ohne "minRole" sind für alle eingeloggten Nutzer sichtbar.
const MENU_ROLES = {
  finanzen: "vorstand",
  zugaenge: "vorstand",
  mitglieder: "mitglied",
  nutzerverwaltung: "admin",
};

export default function App() {
  const {
    currentUser,
    userRole,
    logout,
    hasRole,
    privacyAccepted,
    privacyBusy,
    acceptPrivacyConsent,
    privacyPolicyStand,
  } = useAuth();

  if (!currentUser) return <LoginPage />;
  if (!privacyAccepted) {
    return (
      <PrivacyConsentPage
        onAccept={acceptPrivacyConsent}
        busy={privacyBusy}
        stand={privacyPolicyStand}
      />
    );
  }

  const [active, setActive] = useState("uebersicht");
  const [sessionValue, setSessionValue] = useState("Session 2026/2027");
  const [sessionSaving, setSessionSaving] = useState(false);
  const [openMenus, setOpenMenus] = useState({
    veranstaltungen: false,
    interne: false,
    externe: false,
    verein: false,
    gruppen: false,
    "11-11": false,
    "prunksitzung-1": false,
    "prunksitzung-2": false,
    "bunter-nachmittag": false,
    "beatbox-party": false,
    kinderfasching: false,
    kehraus: false,
  });

  const mainRef = useRef(null);

  const canEditSession = hasRole("vorstand");
  const SESSION_OPTIONS = [
    "Session 2026/2027",
    "Session 2027/2028",
    "Session 2028/2029",
    "Session 2029/2030",
  ];

  useEffect(() => {
    const sessionRef = doc(db, "appSettings", "session");
    const unsub = onSnapshot(sessionRef, (snap) => {
      const value = snap.data()?.activeSession;
      if (typeof value === "string" && value.trim()) {
        setSessionValue(value);
      }
    });
    return () => unsub();
  }, []);

  async function handleSessionChange(nextSession) {
    setSessionValue(nextSession);
    if (!canEditSession) return;
    setSessionSaving(true);
    try {
      await setDoc(
        doc(db, "appSettings", "session"),
        {
          activeSession: nextSession,
          updatedBy: currentUser?.uid ?? null,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } finally {
      setSessionSaving(false);
    }
  }

  function scrollToTop() {
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function navigate(key) {
    setActive(key);
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }

  const TOP_LEVEL = ["veranstaltungen", "verein"];
  const SUB_LEVEL = ["interne", "externe", "gruppen", "ethikKommitee"];
  const GRAND_LEVEL = ["11-11", "prunksitzung-1", "prunksitzung-2", "bunter-nachmittag", "beatbox-party", "kinderfasching", "kehraus"];

  const toggleMenu = (key) => {
    setOpenMenus((prev) => {
      const isOpen = prev[key];
      const updated = { ...prev };

      if (TOP_LEVEL.includes(key)) {
        // Andere Top-Level-Menüs und deren Kinder schließen
        TOP_LEVEL.forEach((k) => { updated[k] = false; });
        SUB_LEVEL.forEach((k) => { updated[k] = false; });
        GRAND_LEVEL.forEach((k) => { updated[k] = false; });
      } else if (SUB_LEVEL.includes(key)) {
        // Andere Sub-Menüs schließen
        SUB_LEVEL.forEach((k) => { updated[k] = false; });
        GRAND_LEVEL.forEach((k) => { updated[k] = false; });
      } else if (GRAND_LEVEL.includes(key)) {
        // Andere Veranstaltungs-Untermenüs schließen
        GRAND_LEVEL.forEach((k) => { updated[k] = false; });
      }

      updated[key] = !isOpen;
      return updated;
    });
  };

  const activeLabel = findActiveLabel(appTree, active);

  function renderContent() {
  if (active === "rote-garde") {
    return <GroupPage key={active} group={roteGarde} />;
  }
  if (active === "blaue-garde") {
    return <GroupPage key={active} group={blaueGarde} />;
  }
  if (active === "gruene-garde") {
    return <GroupPage key={active} group={grueneGarde} />;
  }
  if (active === "boeckli-garde") {
    return <GroupPage key={active} group={boeckliGarde} />;
  }
  if (active === "boeck2beat") {
    return <GroupPage key={active} group={boeck2Beat} />;
  }
  if (active === "maennerballett") {
    return <GroupPage key={active} group={maennerBallett} />;
  }
  if (active === "elfinnen") {
    return <GroupPage key={active} group={elfInnen} />;
  }
  if (active === "elferraete") {
    return <GroupPage key={active} group={elferRaete} />;
  }
  if (active === "buettenredner") {
    return <GroupPage key={active} group={buettenRedner} />;
  }
  if (active === "zdl") {
    return <GroupPage key={active} group={zellerDallerLacker} />;
  }
  if (active.endsWith("-aufbau") || active.endsWith("-abbau")) {
    const typ = active.endsWith("-aufbau") ? "Aufbau" : "Abbau";
    const eventKey = active.slice(0, active.lastIndexOf("-"));
    const eventData = interneVeranstaltungen[eventKey];
    if (eventData) {
      return <AufbauAbbauPage key={active} data={eventData[typ.toLowerCase()]} typ={typ} />;
    }
  }
  if (active === "faschingszug") {
    const data = externeVeranstaltungen[active];
    return <FaschingszugPage key={active} veranstaltung={data} />;
  }
  if (["auswaerts-x", "auswaerts-y", "auswaerts-z", "seniorenheime"].includes(active)) {
    const data = externeVeranstaltungen[active];
    return <ExterneVeranstaltungPage key={active} veranstaltung={data} />;
  }
  if (active === "finanzen") {
    return <FinanzPage />;
  }
  if (active === "vorstand") {
    return <VorstandsPage />
  }
  if (active === "kommitee") {
    return <EthikkommiteePage />;
  }
  if (active === "meldung") {
    return <MeldungPage />;
  }
  if (active === "kummerkasten") {
    return <BoeckFeedbackPage />;
  }
  if (active === "datenschutz") {
    return <DatenschutzPage />;
  }
  if (active === "uebersicht") {
    return <UebersichtPage />;
  }
  if (active === "zugaenge") {
    return <ZugaengePage />;
  }
  if (active === "kagezellcarta") {
    return <KaGeCartaPage />;
  }
  if (active === "ahndung") {
    return <AhndungPage />;
  }
  if (active === "nutzerverwaltung") {
    return <AdminPage />;
  }
  if (active === "kalender") {
    return <KalenderPage />;
  }
  if (active === "einstellungen") {
    return <EinstellungenPage />;
  }
  return <div>Übersicht</div>;
}

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Century Gothic, Segoe UI, Roboto, sans-serif" }}>
      <aside
        style={{
          width: "300px",
          background: "#b91c1c",
          color: "white",
          padding: "20px",
        }}
      >

    <div style={{ textAlign: "center", marginBottom: "10px" }}>
      <img
        src={kageLogo}
        alt="KaGe Logo"
        style={{ width: "120px" }}
/>
  
</div>

        <p style={{ fontSize: "18px", opacity: 0.9 }}>
          Alles rund um den Zeller Fasching
        </p>

        <div style={{ marginTop: "36px", marginBottom: "6px" }}>
          <select
            value={sessionValue}
            onChange={(e) => handleSessionChange(e.target.value)}
            disabled={!canEditSession || sessionSaving}
            style={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.35)",
              background: !canEditSession ? "rgba(255,255,255,0.08)" : "white",
              color: !canEditSession ? "white" : "#111",
              fontSize: "18px",
              textAlign: "center",
              cursor: !canEditSession ? "not-allowed" : "pointer",
              boxSizing: "border-box",
            }}
          >
            {SESSION_OPTIONS.map((session) => (
              <option key={session} value={session}>
                {session}
              </option>
            ))}
          </select>
          {!canEditSession && (
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.8)", marginTop: "6px", marginBottom: 0 }}>
              Nur Vorstand/Admin kann die Session ändern.
            </p>
          )}
        </div>

        <div style={{ marginTop: "20px" }}>
          {appTree.filter((item) => {
            const required = MENU_ROLES[item.key];
            return !required || hasRole(required);
          }).map((item) => (
            <div key={item.key} style={{ marginBottom: "8px" }}>
              <button
                onClick={() => {
                  if (item.children) {
                    toggleMenu(item.key);
                  } else {
                    navigate(item.key);
                  }
                }}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: active === item.key ? "white" : "transparent",
                  color: active === item.key ? "#111" : "white",
                  border: "none",
                  borderRadius: "10px",
                  textAlign: "left",
                  cursor: "pointer",
                  fontSize: "18px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>{item.label}</span>
                {item.children && <span>{openMenus[item.key] ? "▾" : "▸"}</span>}
              </button>

              {item.children && openMenus[item.key] && (
                <div style={{ marginTop: "6px", marginLeft: "14px" }}>
                  {item.children.map((child) => (
                    <div key={child.key}>
                      <button
                        onClick={() => {
                          if (child.children) {
                            toggleMenu(child.key);
                          } else {
                            navigate(child.key);
                          }
                        }}
                        style={{
                          width: "100%",
                          padding: "10px",
                          marginBottom: "6px",
                          background: active === child.key ? "#fca5a5" : "rgba(255,255,255,0.08)",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          textAlign: "left",
                          cursor: "pointer",
                          fontSize: "18px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span>{child.label}</span>
                        {child.children && <span>{openMenus[child.key] ? "▾" : "▸"}</span>}
                      </button>
                      {child.children && openMenus[child.key] && (
                        <div style={{ marginLeft: "12px", marginBottom: "4px" }}>
                          {child.children.map((grand) => (
                            <div key={grand.key}>
                              <button
                                onClick={() => {
                                  if (grand.children) toggleMenu(grand.key);
                                  else navigate(grand.key);
                                }}
                                style={{
                                  width: "100%",
                                  padding: "8px 10px",
                                  marginBottom: "4px",
                                  background: active === grand.key ? "#fca5a5" : "rgba(255,255,255,0.05)",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "6px",
                                  textAlign: "left",
                                  cursor: "pointer",
                                  fontSize: "18px",
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <span>{grand.label}</span>
                                {grand.children && <span>{openMenus[grand.key] ? "▾" : "▸"}</span>}
                              </button>
                              {grand.children && openMenus[grand.key] && (
                                <div style={{ marginLeft: "12px", marginBottom: "4px" }}>
                                  {grand.children.map((gg) => (
                                    <button
                                      key={gg.key}
                                      onClick={() => navigate(gg.key)}
                                      style={{
                                        width: "100%",
                                        padding: "7px 10px",
                                        marginBottom: "3px",
                                        background: active === gg.key ? "#fca5a5" : "rgba(255,255,255,0.04)",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "5px",
                                        textAlign: "left",
                                        cursor: "pointer",
                                        fontSize: "18px",
                                      }}
                                    >
                                      {gg.label}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Nutzerinfo + Logout */}
        <div style={{ marginTop: "auto", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.2)", marginTop: "32px" }}>

          <p style={{ textAlign: "center", fontSize: 10, color: "rgba(255,255,255,0.5)", margin: "0 0 10px 0" }}>
            Version: {APP_VERSION}
          </p>

          <button
            onClick={() => navigate("einstellungen")}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: 8,
              background: active === "einstellungen" ? "white" : "rgba(255,255,255,0.1)",
              color: active === "einstellungen" ? "#111" : "white",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 18,
              fontWeight: 400,
              textAlign: "center",
            }}
          >
            Persönliche Einstellungen
          </button>
          <button
            onClick={logout}
            style={{
              width: "100%",
              padding: "8px",
              background: "rgba(255,255,255,0.15)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 18,
              fontWeight: 400,
            }}
          >
            Abmelden
          </button>
        </div>
      </aside>

      <main ref={mainRef} style={{ flex: 1, padding: "24px", background: "#f3f4f6", overflowY: "auto", position: "relative" }}>
        <h1 style={{ marginTop: 0 }}>{activeLabel}</h1>
        {renderContent()}
        <button
          onClick={scrollToTop}
          title="Nach oben"
          style={{
            position: "fixed",
            bottom: 32,
            right: 32,
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "#b91c1c",
            color: "white",
            border: "none",
            fontSize: 20,
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ↑
        </button>
      </main>
    </div>
  );
}