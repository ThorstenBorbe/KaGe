import { useState } from "react";

const appTree = [
  { key: "dashboard", label: "Dashboard" },
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
      { key: "seniorenheim", label: "Seniorenheim" },
    ],
  },
  {
    key: "gruppen",
    label: "Gruppen",
    children: [
      { key: "rote-garde", label: "Rote Garde" },
      { key: "blaue-garde", label: "Blaue Garde" },
      { key: "gruene-garde", label: "Grüne Garde" },
      { key: "beat2boeck", label: "Beat2Böck" },
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
  { key: "einstellungen", label: "Einstellungen (nur Vorstand)" },
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
  const [active, setActive] = useState("dashboard");
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
        <h2 style={{ marginTop: 0 }}>🎭 KaGe Zell</h2>
        <p style={{ fontSize: "14px", opacity: 0.9 }}>
          Vereinsportal für Organisation, Termine und Gruppen
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

        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <p>
            Hier entsteht der Bereich <strong>{activeLabel}</strong>.
          </p>
        </div>
      </main>
    </div>
  );
}