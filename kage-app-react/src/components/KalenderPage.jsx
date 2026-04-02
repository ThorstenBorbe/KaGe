import kalenderTermine from "../data/kalenderTermine";

function KalenderPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const nextSixTermine = kalenderTermine
    .map((termin) => ({
      ...termin,
      sortDate: new Date(`${termin.datum}T00:00:00`),
    }))
    .filter((termin) => termin.sortDate >= today)
    .sort((a, b) => a.sortDate - b.sortDate)
    .slice(0, 6);

  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
          maxWidth: "900px",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Kommende Termine</h2>

        <div style={{ display: "grid", gap: "12px" }}>
          {nextSixTermine.map((termin) => (
            <div
              key={termin.id}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                padding: "14px 16px",
                background: "#f9fafb",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontWeight: 700, color: "#111827", fontSize: "16px" }}>{termin.titel}</div>
                  <div style={{ marginTop: "4px", color: "#6b7280", fontSize: "13px" }}>
                    {formatDate(termin.datum)} um {termin.uhrzeit}
                  </div>
                </div>
                <span
                  style={{
                    background: termin.kategorie === "Extern" ? "#fee2e2" : "#e5e7eb",
                    color: termin.kategorie === "Extern" ? "#b91c1c" : "#374151",
                    borderRadius: "999px",
                    padding: "4px 10px",
                    fontSize: "12px",
                    fontWeight: 700,
                  }}
                >
                  {termin.kategorie}
                </span>
              </div>
              <div style={{ marginTop: "8px", color: "#374151", fontSize: "13px" }}>📍 {termin.ort}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat("de-DE", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${dateString}T00:00:00`));
}

export default KalenderPage;
