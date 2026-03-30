import { act, useState } from "react";
import GroupPage from "./components/GroupPage";
import roteGarde from "./data/roteGarde";
import blaueGarde from "./data/blaueGarde";
import grueneGarde from "./data/grueneGarde";
import boeckliGarde from "./data/boeckliGarde";
import boeck2Beat from "./data/boeck2Beat";
import maennerBalett from "./data/maennerBalett";
import buettenRedner from "./data/buettenRedner";
import elfInnen from "./data/elfInnen";
import elferRaete from "./data/elferRaete";
import zellerDallerLacker from "./data/zellerDallerLacker";
import EthikkommissionPage from "./components/EthikkommissionsPage";
import VorstandsPage from "./components/VorstandsPage";
import KummerKastenPage from "./components/KummerKastenPage";
import FinanzPage from "./components/FinanzPage";
import UebersichtPage from "./components/UebersichtPage";

const appTree = [
  { key: "uebersicht", label: "Übersicht" },
  { key: "kalender", label: "Kalender" },
  {
    key: "interne",
    label: "Interne Veranstaltungen",
    children: [
      { key: "11-11", label: "11.11. Jetzt geht los" },
      { key: "prunksitzung-1", label: "1. Prunksitzung" },
      { key: "prunksitzung-2", label: "2. Prunksitzung" },
      { key: "bunter-nachmittag", label: "Bunter Nachmittag" },
      { key: "beatbox-party", label: "Beatbox Party" },
      { key: "kinderfasching", label: "Kinderfasching" },
      { key: "kehraus", label: "Kehraus" },
    ],
  },
  {
    key: "externe",
    label: "Externe Veranstaltungen",
    children: [
      { key: "auswaerts-x", label: "1. Auswärtssitzung (X)" },
      { key: "auswaerts-y", label: "2. Auswärtssitzung (Y)" },
      { key: "auswaerts-z", label: "3. Auswärtssitzung (Z)" },
      { key: "seniorenheime", label: "Seniorenheime" },
    ],
  },
  {
    key: "gruppen",
    label: "Gruppen",
    children: [
      { key: "rote-garde", label: "Rote Garde" },
      { key: "blaue-garde", label: "Blaue Garde" },
      { key: "gruene-garde", label: "Grüne Garde" },
      { key: "boeckli-garde", label: "Böckli" },
      { key: "boeck2beat", label: "Böck2Beat" },
      { key: "maennerbalett", label: "Männerbalett" },
      { key: "buettenredner", label: "Büttenredner" },
      { key: "elfinnen", label: "Elfinnen" },
      { key: "elferraete", label: "Elferräte" },
      { key: "zdl", label: "ZDL" },
    ],
  },
  { key: "mitglieder", label: "Mitglieder" },
  { key: "news", label: "News" },
  { key: "vorstand", label: "Vorstandschaft" },
  { key: "ethikkommission", label: "Ethikkommission" },
  { key: "finanzen", label: "Finanzen" },
  { key: "einstellungen", label: "Einstellungen (nur Vorstand)" },
  { key: "kummerkasten", label: "Kummerkasten" },
];

function findActiveLabel(items, activeKey) {
  for (const item of items) {
    if (item.key === activeKey) return item.label;
    if (item.children) {
      const child = item.children.find((c) => c.key === activeKey);
      if (child) return child.label;
    }
  }
  return activeKey;
}

export default function App() {
  const [active, setActive] = useState("Übersicht");
  const [openMenus, setOpenMenus] = useState({
    interne: false,
    externe: false,
    gruppen: false,
  });

  const toggleMenu = (key) => {
    setOpenMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
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
  if (active === "maennerbalett") {
    return <GroupPage key={active} group={maennerBalett} />;
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
  if (active === "finanzen") {
    return <FinanzPage />;
  }
  if (active === "vorstand") {
    return <VorstandsPage />
  }
  if (active === "ethikkommission") {
    return <EthikkommissionPage />;
  }
  if (active === "kummerkasten") {
    return <KummerKastenPage />;
  }
  if (active === "uebersicht") {
    return <UebersichtPage />;
  }
  return <div>Übersicht</div>;
}

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
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
        src="https://www.tgzell.de/images/abteilungen/kage/kagezell.png"
        alt="KaGe Logo"
        style={{ width: "120px" }}
/>
  
</div>

        <p style={{ fontSize: "18px", opacity: 0.9 }}>
          Alles rund um den Zeller Fasching
        </p>

        <div style={{ marginTop: "20px" }}>
          {appTree.map((item) => (
            <div key={item.key} style={{ marginBottom: "8px" }}>
              <button
                onClick={() => {
                  if (item.children) {
                    toggleMenu(item.key);
                  } else {
                    setActive(item.key);
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
                  fontSize: "14px",
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
                    <button
                      key={child.key}
                      onClick={() => setActive(child.key)}
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
                        fontSize: "13px",
                      }}
                    >
                      {child.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>

      <main style={{ flex: 1, padding: "24px", background: "#f3f4f6" }}>
        <h1 style={{ marginTop: 0 }}>{activeLabel}</h1>
        {renderContent()}
      </main>
    </div>
  );
}