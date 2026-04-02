import { useFirebaseData } from "../hooks/useFirebaseData";

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
      <div style={{ padding: "24px", textAlign: "center" }}>
        <p>⏳ Lade Veranstaltungsdaten...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "24px" }}>
        <div style={{
          background: "#fee2e2",
          color: "#991b1b",
          padding: 16,
          borderRadius: 8,
          fontSize: 13,
        }}>
          ❌ Fehler beim Laden der Daten: {error}
          <br />
          <small>Stelle sicher, dass "externeVeranstaltungen.json" in Firebase Storage hochgeladen wurde.</small>
        </div>
      </div>
    );
  }

  if (!data) {
    return <div style={{ padding: "24px" }}><p>Keine Daten geladen.</p></div>;
  }

  return (
    <div style={{ padding: "24px" }}>
      <h2>🌍 Externe Veranstaltungen (von Firebase)</h2>
      
      {Object.entries(data).map(([key, veranstaltung]) => (
        <div key={key} style={{
          background: "white",
          borderRadius: 12,
          padding: 20,
          marginBottom: 16,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}>
          <h3 style={{ marginTop: 0, color: "#b91c1c" }}>{veranstaltung.titel}</h3>
          
          <div style={{ fontSize: 13 }}>
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
