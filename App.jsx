import { useState } from "react";

const appTree = [
  { key: "dashboard", label: "Dashboard" },
  { key: "kalender", label: "Kalender" },
  {
    key: "interne",
    label: "Interne Veranstaltungen",
    children: [
      "11.11. Jetzt geht los",
      "1. Prunksitzung",
      "2. Prunksitzung",
      "Bunter Nachmittag",
      "Beatbox Party",
      "Kinderfasching",
      "Kehraus",
    ],
  },
  {
    key: "externe",
    label: "Externe Veranstaltungen",
    children: [
      "1. Auswärtssitzung (X)",
      "2. Auswärtssitzung (Y)",
      "3. Auswärtssitzung (Z)",
      "Seniorenheim",
    ],
  },
  {
    key: "gruppen",
    label: "Gruppen",
    children: [
      "Rote Garde",
      "Blaue Garde",
      "Grüne Garde",
      "Beat2Böck",
      "Männerbalett",
      "Büttenredner",
      "Elfinnen",
      "Elferräte",
    ],
  },
  { key: "mitglieder", label: "Mitglieder" },
  { key: "news", label: "News" },
  { key: "vorstand", label: "Vorstandschaft" },
];

export default function App() {
  const [active, setActive] = useState("dashboard");

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Arial" }}>
      {/* Sidebar */}
      <aside style={{ width: "260px", background: "#b91c1c", color: "white", padding: "20px" }}>
        <h2>🎭 KaGe Zell</h2>

        {appTree.map((item) => (
          <div key={item.key} style={{ marginBottom: "10px" }}>
            <button
              onClick={() => setActive(item.key)}
              style={{
                width: "100%",
                padding: "10px",
                background: active === item.key ? "white" : "transparent",
                color: active === item.key ? "black" : "white",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              {item.label}
            </button>
          </div>
        ))}
      </aside>

      {/* Content */}
      <main style={{ padding: "20px", flex: 1 }}>
        <h1>{active}</h1>

        <p>Hier entsteht der Bereich <b>{active}</b></p>
      </main>
    </div>
  );
}