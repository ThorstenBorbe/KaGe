const pageContainerStyle = {
  padding: "24px",
  paddingBottom: "80px",
};

const overviewCardStyle = {
  background: "white",
  borderRadius: "18px", // Form der Hauptkarte: "0px" = eckig, "8px" = leicht rund, "999px" = pillenartig
  padding: "24px", // Innenabstand der Karte
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  maxWidth: "800px", // Breite der Inhaltskarte auf grossen Bildschirmen
  marginBottom: "60px",
};

const descriptionTextStyle = {
  color: "#4b5563", // Gut lesbares Grau fuer Fliesstext
  lineHeight: 1.5,
};

const statusNoticeStyle = {
  marginTop: "20px",
  padding: "16px", // Kompakte Hinweisbox; alternativ "20px" fuer luftigeres Layout
  borderRadius: "12px", // Form der Hinweisbox: "0px" = eckig, "6px" = sachlich, "24px" = weicher
  background: "#f9fafb", // Sehr helles Grau fuer dezenten Hinweis-Hintergrund
  border: "1px dashed #d1d5db", // Alternativen: "solid" fuer klarer, "none" fuer ruhiger, "2px dashed ..." fuer auffaelliger
  textAlign: "center",
  color: "#6b7280", // Etwas dunkler als der Hintergrund fuer gute Lesbarkeit
  fontStyle: "italic",
};

export default function FinanzPage() {
  return (
    <div style={pageContainerStyle}>
      <div style={overviewCardStyle}>
        <h2 style={{ marginTop: 0 }}>📊 Finanzübersicht</h2>

        <p style={{ marginTop: "12px", ...descriptionTextStyle }}>
          In diesem Bereich wird zukünftig die Finanzübersicht der Karnevalsgesellschaft dargestellt.
        </p>

        <p style={{ marginTop: "8px", ...descriptionTextStyle }}>
          Hier können Einnahmen, Ausgaben, Budgets sowie Auswertungen und Berichte eingesehen werden.
        </p>

        <div style={statusNoticeStyle}>
          ⚠️ Finanzübersicht wird aktuell noch entwickelt
        </div>
      </div>
    </div>
  );
}