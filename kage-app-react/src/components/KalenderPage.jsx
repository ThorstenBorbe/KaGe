import termine from "../data/termine";

const BRAND_RED = "#b91c1c";

const KATEGORIE_COLORS = {
  intern: "#b91c1c",
  extern: "#2563eb",
};

function formatDatum(datumStr) {
  const d = new Date(datumStr);
  return d.toLocaleDateString("de-DE", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function getNextTermine(alle, anzahl = 4) {
  const heute = new Date();
  heute.setHours(0, 0, 0, 0);
  return alle
    .filter((t) => new Date(t.datum) >= heute)
    .sort((a, b) => new Date(a.datum) - new Date(b.datum))
    .slice(0, anzahl);
}

export default function KalenderPage() {
  const naechste = getNextTermine(termine, 4);
  const alle = [...termine].sort((a, b) => new Date(a.datum) - new Date(b.datum));
  const heute = new Date();
  heute.setHours(0, 0, 0, 0);

  return (
    <div style={{ padding: "24px", maxWidth: 800 }}>

      {/* Nächste 4 Termine */}
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          marginBottom: 24,
        }}
      >
        <h2 style={{ color: BRAND_RED, marginTop: 0, marginBottom: 16, fontSize: 18 }}>
          📅 Nächste Termine
        </h2>

        {naechste.length === 0 ? (
          <p style={{ color: "#6b7280" }}>Keine bevorstehenden Termine.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {naechste.map((t, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "12px 16px",
                  background: "#f9fafb",
                  borderRadius: 10,
                  borderLeft: `4px solid ${KATEGORIE_COLORS[t.kategorie] ?? "#9ca3af"}`,
                }}
              >
                <div style={{ minWidth: 48, textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: BRAND_RED, lineHeight: 1 }}>
                    {new Date(t.datum).getDate()}
                  </div>
                  <div style={{ fontSize: 11, color: "#6b7280", textTransform: "uppercase" }}>
                    {new Date(t.datum).toLocaleDateString("de-DE", { month: "short" })}
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: "#111827", fontSize: 15 }}>{t.label}</div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>{formatDatum(t.datum)}</div>
                </div>
                <span
                  style={{
                    marginLeft: "auto",
                    background: KATEGORIE_COLORS[t.kategorie] ?? "#9ca3af",
                    color: "white",
                    borderRadius: 20,
                    padding: "2px 10px",
                    fontSize: 11,
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  {t.kategorie}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Alle Termine */}
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        <h2 style={{ color: "#374151", marginTop: 0, marginBottom: 16, fontSize: 18 }}>
          Alle Termine
        </h2>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #f3f4f6" }}>
              <th style={{ padding: "8px", textAlign: "left", color: "#6b7280", fontWeight: 600 }}>Datum</th>
              <th style={{ padding: "8px", textAlign: "left", color: "#6b7280", fontWeight: 600 }}>Veranstaltung</th>
              <th style={{ padding: "8px", textAlign: "left", color: "#6b7280", fontWeight: 600 }}>Art</th>
            </tr>
          </thead>
          <tbody>
            {alle.map((t, i) => {
              const vergangen = new Date(t.datum) < heute;
              return (
                <tr
                  key={i}
                  style={{
                    borderBottom: "1px solid #f3f4f6",
                    opacity: vergangen ? 0.4 : 1,
                  }}
                >
                  <td style={{ padding: "10px 8px", color: "#374151", whiteSpace: "nowrap" }}>
                    {new Date(t.datum).toLocaleDateString("de-DE", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </td>
                  <td style={{ padding: "10px 8px", color: "#111827", fontWeight: 500 }}>
                    {t.label}
                  </td>
                  <td style={{ padding: "10px 8px" }}>
                    <span
                      style={{
                        background: KATEGORIE_COLORS[t.kategorie] ?? "#9ca3af",
                        color: "white",
                        borderRadius: 20,
                        padding: "2px 8px",
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      {t.kategorie}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
