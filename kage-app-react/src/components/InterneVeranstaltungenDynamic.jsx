import { useFirebaseData } from "../hooks/useFirebaseData";

const PHASE_ORDER = [
  { key: "vorbereitung", label: "Vorbereitung", icon: "🧭" },
  { key: "aufbau", label: "Aufbau", icon: "🔧" },
  { key: "veranstaltung", label: "Veranstaltung", icon: "🎉" },
  { key: "abbau", label: "Abbau", icon: "📦" },
];

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

          {PHASE_ORDER.filter((phase) => veranstaltung[phase.key]).map((phase) => (
            <details key={phase.key} style={{ marginBottom: 12 }}>
              <summary style={{ cursor: "pointer", fontWeight: 600, fontSize: 14, marginBottom: 8 }}>
                {phase.icon} {phase.label}
              </summary>
              <div style={{ paddingLeft: 16, fontSize: 13 }}>
                {renderPhaseMeta(veranstaltung[phase.key])}
                {veranstaltung[phase.key].verantwortliche?.length > 0 && (
                  <p><strong>Verantwortliche:</strong> {veranstaltung[phase.key].verantwortliche.join(", ")}</p>
                )}
                {veranstaltung[phase.key].aufgaben?.length > 0 && (
                  <div>
                    <strong>Aufgaben:</strong>
                    <ul style={{ margin: "4px 0", paddingLeft: 20 }}>
                      {veranstaltung[phase.key].aufgaben.map((task, index) => (
                        <li key={index} style={{ fontSize: 12 }}>
                          {getTaskLabel(task)}
                          {getTaskResponsible(task) && (
                            <span style={{ color: "#6b7280" }}>
                              {" "}
                              - Verantwortlich: {getTaskResponsible(task)}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {veranstaltung[phase.key].bemerkungen && (
                  <p><strong>Bemerkungen:</strong> {veranstaltung[phase.key].bemerkungen}</p>
                )}
              </div>
            </details>
          ))}
        </div>
      ))}
    </div>
  );
}

function renderPhaseMeta(phase) {
  const location = phase.ort || phase.treffpunkt;

  return (
    <>
      {phase.datum && <p><strong>Datum:</strong> {phase.datum}</p>}
      {phase.uhrzeit && <p><strong>Uhrzeit:</strong> {phase.uhrzeit}</p>}
      {location && <p><strong>Ort:</strong> {location}</p>}
    </>
  );
}

function getTaskLabel(task) {
  if (typeof task === "string") return task;
  return task?.text || task?.aufgabe || task?.titel || "Ohne Bezeichnung";
}

function getTaskResponsible(task) {
  if (!task || typeof task !== "object") return "";

  const responsible = task.verantwortlich ?? task.verantwortliche;
  if (Array.isArray(responsible)) {
    return responsible.join(", ");
  }
  return responsible || "";
}
