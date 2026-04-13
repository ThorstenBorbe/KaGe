import { useFirebaseData } from "../hooks/useFirebaseData";

const loadingStateStyle = {
  padding: "24px",
  textAlign: "center",
};

const pageContainerStyle = {
  padding: "24px",
};

const errorBoxStyle = {
  background: "#fee2e2", // Fehlerhintergrund; alternativ dunkler fuer mehr Dringlichkeit
  color: "#991b1b",
  padding: 16,
  borderRadius: 8, // Fehlerbox-Form: 0 = eckig, 8 = Standard, 16 = weicher
  fontSize: 13,
};

const resultsContainerStyle = {
  padding: "24px",
  marginBottom: "60px",
};

const eventCardStyle = {
  background: "white",
  borderRadius: 12, // Kartenform: 6 = kompakter, 12 = ausgewogen, 20 = weicher
  padding: 20,
  marginBottom: 16,
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
};

const eventMetaStyle = {
  fontSize: 13,
};

/**
 * Beispiel-Komponente: Zeigt, wie man Daten von Firebase Storage lädt
 * 
 * Verwendung in App.jsx:
 * if (active === "externe-firebase") {
 *   return <ExterneVeranstaltungenDynamic />;
 * }
 */
export default function ExterneVeranstaltungenDynamic() {
  const { data, loading, error } = useFirebaseData("externeVeranstaltungen.json");

  if (loading) {
    return (
      <div style={loadingStateStyle}>
        <p>⏳ Lade Veranstaltungsdaten...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={pageContainerStyle}>
        <div style={errorBoxStyle}>
          ❌ Fehler beim Laden der Daten: {error}
          <br />
          <small>Stelle sicher, dass "externeVeranstaltungen.json" in Firebase Storage hochgeladen wurde.</small>
        </div>
      </div>
    );
  }

  if (!data) {
    return <div style={pageContainerStyle}><p>Keine Daten geladen.</p></div>;
  }

  return (
    <div style={resultsContainerStyle}>
      <h2>🌍 Externe Veranstaltungen (von Firebase)</h2>
      
      {Object.entries(data).map(([key, veranstaltung]) => (
        <div key={key} style={eventCardStyle}>
          <h3 style={{ marginTop: 0, color: "#b91c1c" }}>{veranstaltung.titel}</h3>
          
          <div style={eventMetaStyle}>
            <p><strong>📍 Treffpunkt:</strong> {veranstaltung.treffpunkt} - {veranstaltung.treffpunktUhrzeit}</p>
            <p><strong>🏠 Verein:</strong> {veranstaltung.verein.name}</p>
            <p><strong>📍 Adresse:</strong> {veranstaltung.verein.strasse}, {veranstaltung.verein.plz} {veranstaltung.verein.ort}</p>
            <p><strong>🎁 Geschenk:</strong> {veranstaltung.geschenk}</p>
            
            {veranstaltung.fahrer?.length > 0 && (
              <p><strong>🚗 Fahrer:</strong> {veranstaltung.fahrer.join(", ")}</p>
            )}
            
            {veranstaltung.teilnehmer?.length > 0 && (
              <p><strong>👥 Teilnehmer:</strong> {veranstaltung.teilnehmer.join(", ")}</p>
            )}
            
            {veranstaltung.auftritte?.length > 0 && (
              <p><strong>🎭 Auftritte:</strong> {veranstaltung.auftritte.join(", ")}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
