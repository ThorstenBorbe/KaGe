import { useFirebaseData } from "../hooks/useFirebaseData";

/**
 * Beispiel-Komponente: Zeigt, wie man Aufbau/Abbau-Daten von Firebase Storage lädt
 * 
 * Verwendung in App.jsx:
 * if (active === "interne-firebase") {
 *   return <InterneVeranstaltungenDynamic />;
 * }
 */
export default function InterneVeranstaltungenDynamic() {
  const { data, loading, error } = useFirebaseData("interneVeranstaltungen.json");

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
          <small>Stelle sicher, dass "interneVeranstaltungen.json" in Firebase Storage hochgeladen wurde.</small>
        </div>
      </div>
    );
  }

  if (!data) {
    return <div style={{ padding: "24px" }}><p>Keine Daten geladen.</p></div>;
  }

  return (
    <div style={{ padding: "24px", marginBottom: "60px" }}>
      <h2>🎉 Interne Veranstaltungen (von Firebase)</h2>
      
      {Object.entries(data).map(([eventKey, veranstaltung]) => (
        <div key={eventKey} style={{
          background: "white",
          borderRadius: 12,
          padding: 20,
          marginBottom: 16,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}>
          <h3 style={{ marginTop: 0, color: "#b91c1c" }}>{eventKey}</h3>
          
          {/* Aufbau */}
          <details style={{ marginBottom: 12 }}>
            <summary style={{ cursor: "pointer", fontWeight: 600, fontSize: 14, marginBottom: 8 }}>
              🔧 Aufbau
            </summary>
            <div style={{ paddingLeft: 16, fontSize: 13 }}>
              <p><strong>Zeitraum:</strong> {veranstaltung.aufbau.zeitraum || "—"}</p>
              <p><strong>Treffpunkt:</strong> {veranstaltung.aufbau.treffpunkt || "—"}</p>
              {veranstaltung.aufbau.verantwortliche?.length > 0 && (
                <p><strong>Verantwortliche:</strong> {veranstaltung.aufbau.verantwortliche.join(", ")}</p>
              )}
              {veranstaltung.aufbau.aufgaben?.length > 0 && (
                <div>
                  <strong>Aufgaben:</strong>
                  <ul style={{ margin: "4px 0", paddingLeft: 20 }}>
                    {veranstaltung.aufbau.aufgaben.map((task, i) => (
                      <li key={i} style={{ fontSize: 12 }}>{task}</li>
                    ))}
                  </ul>
                </div>
              )}
              <p><strong>Bemerkungen:</strong> {veranstaltung.aufbau.bemerkungen || "—"}</p>
            </div>
          </details>

          {/* Abbau */}
          <details>
            <summary style={{ cursor: "pointer", fontWeight: 600, fontSize: 14, marginBottom: 8 }}>
              📦 Abbau
            </summary>
            <div style={{ paddingLeft: 16, fontSize: 13 }}>
              <p><strong>Zeitraum:</strong> {veranstaltung.abbau.zeitraum || "—"}</p>
              <p><strong>Treffpunkt:</strong> {veranstaltung.abbau.treffpunkt || "—"}</p>
              {veranstaltung.abbau.verantwortliche?.length > 0 && (
                <p><strong>Verantwortliche:</strong> {veranstaltung.abbau.verantwortliche.join(", ")}</p>
              )}
              {veranstaltung.abbau.aufgaben?.length > 0 && (
                <div>
                  <strong>Aufgaben:</strong>
                  <ul style={{ margin: "4px 0", paddingLeft: 20 }}>
                    {veranstaltung.abbau.aufgaben.map((task, i) => (
                      <li key={i} style={{ fontSize: 12 }}>{task}</li>
                    ))}
                  </ul>
                </div>
              )}
              <p><strong>Bemerkungen:</strong> {veranstaltung.abbau.bemerkungen || "—"}</p>
            </div>
          </details>
        </div>
      ))}
    </div>
  );
}
