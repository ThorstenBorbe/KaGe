// Prozess-Schritte für das Ahndungsdiagramm
const ahndungSchritte = [
  {
    nr: 1,
    titel: "Meldung",
    text: "Mitglied oder Betreuer meldet Vorfall – anonym möglich",
    // Farbe: Orange
    farbe: "#D94F1E",
  },
  {
    nr: 2,
    titel: "Vorprüfung",
    text: "Präsidium prüft: Ist es relevant für die KaGe-Carta?",
    // Farbe: Blau
    farbe: "#1A5FAD",
  },
  {
    nr: 3,
    titel: "Anhörung",
    text: "Alle Beteiligten kommen zu Wort – vertraulich",
    // Farbe: Lila
    farbe: "#6B2D8B",
  },
  {
    nr: 4,
    titel: "Bewertung",
    text: "Präsidium bewertet anhand der KaGe-Carta",
    // Farbe: Dunkelrot
    farbe: "#8B1A1A",
  },
  {
    nr: 5,
    titel: "Maßnahme",
    text: "Gespräch / Verwarnung / Ausschluss",
    // Farbe: Dunkelgrün
    farbe: "#2D6B2D",
  },
  {
    nr: 6,
    titel: "Kommunikation",
    text: "Entscheidung wird dokumentiert und kommuniziert",
    // Farbe: Dunkelgrau
    farbe: "#4A4A4A",
  },
];

const pageContainerStyle = {
  padding: "24px",
  paddingBottom: "80px",
};

const contentCardStyle = {
  background: "white",
  borderRadius: "18px", // Kartenform: "0px" = eckig, "8px" = dezent rund, "24px" = weicher
  padding: "24px", // Innenabstand fuer lesbaren Fliesstext
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  maxWidth: "800px", // Begrenzt die Zeilenlaenge auf grossen Displays
  marginBottom: "60px",
};

const bodyTextStyle = {
  color: "#4b5563", // Ruhiges Grau fuer laengere Lesetexte
  lineHeight: 1.5,
};

const noticeStyle = {
  marginTop: "20px",
  padding: "16px", // Alternativ "20px" fuer mehr Luft in der Hinweisbox
  borderRadius: "12px", // Hinweisform: "0px" = sachlich, "12px" = freundlich, "999px" = markenartig
  background: "#f9fafb",
  border: "1px dashed #d1d5db", // Alternativen: "solid" fuer klarer, "none" fuer ruhiger
  textAlign: "center",
  color: "#6b7280",
  fontStyle: "italic",
};

export default function AhndungPage() {
  return (
    <div style={pageContainerStyle}>
      <div style={contentCardStyle}>


        {/* Ahndungsprozess-Diagramm: 6 Schritte untereinander, gleiche Größe */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            marginTop: "24px",
            marginBottom: "8px",
            maxWidth: "420px", // Breite der Diagrammspalte: "320px" = schmal, "420px" = mittel, "560px" = breit
            margin: "24px auto 8px", // zentriert die Diagrammspalte horizontal
          }}
        >
          {ahndungSchritte.map((schritt, idx) => (
            <div key={schritt.nr} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>

              {/* Verbindungspfeil – zentriert über dem rechten (weißen) Boxenfeld */}
              {idx > 0 && (
                <div style={{ display: "flex", width: "100%", marginBottom: "4px" }}>
                  {/* Platzhalter für den farbigen Streifen */}
                  <div style={{ width: "64px", flexShrink: 0 }} />
                  {/* Pfeil zentriert im rechten Bereich */}
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      justifyContent: "center",
                      color: "#9ca3af",
                      fontSize: "22px",
                      lineHeight: 1,
                    }}
                  >
                    ↓
                  </div>
                </div>
              )}

              {/* Schritt-Karte – minHeight damit alle ähnlich groß bleiben, auto für zweizeiligen Text */}
              <div
                style={{
                  width: "100%",
                  minHeight: "64px", // Mindesthöhe: "56px" = kompakt, "64px" = ausgewogen
                  height: "auto",
                  border: `2px solid ${schritt.farbe}`,
                  borderRadius: "6px", // Kartenform: "0px" = eckig, "6px" = leicht rund, "14px" = weich
                  overflow: "hidden",
                  display: "flex",
                }}
              >
                {/* Farbiger linker Streifen mit Nummer */}
                <div
                  style={{
                    width: "64px", // Breite des farbigen Streifens: "48px" = schmal, "64px" = ausgewogen
                    flexShrink: 0,
                    background: schritt.farbe,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ color: "white", fontWeight: 700, fontSize: "26px" }}>
                    {schritt.nr}
                  </span>
                </div>

                {/* Weißer rechter Bereich mit Titel und Beschreibung */}
                <div
                  style={{
                    flex: 1,
                    background: "white",
                    padding: "10px 14px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <div style={{ color: schritt.farbe, fontWeight: 700, fontSize: "14px" }}>
                    {schritt.titel}
                  </div>
                  <div style={{ color: "#6b7280", fontSize: "12px", lineHeight: 1.4, marginTop: "2px" }}>
                    {schritt.text}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}