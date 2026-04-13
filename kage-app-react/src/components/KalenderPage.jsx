import kalenderTermine from "../data/kalenderTermine";
import { useIsMobile } from "../hooks/useIsMobile";

const pageContainerStyle = (isMobile) => ({
  padding: isMobile ? "12px" : "24px",
});

const calendarCardStyle = (isMobile) => ({
  background: "white",
  borderRadius: "16px", // Hauptkartenform: "0px" = eckig, "8px" = sachlich, "16px" = freundlich
  padding: isMobile ? "14px" : "24px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
  maxWidth: "900px",
  width: "100%",
  boxSizing: "border-box",
  marginBottom: "60px",
});

const appointmentListStyle = {
  display: "grid",
  gap: "12px",
};

const appointmentItemStyle = (isMobile) => ({
  border: "1px solid #e5e7eb",
  borderRadius: "12px", // Einzelkartenform: "6px" = kompakter, "12px" = ausgewogen, "20px" = weicher
  padding: isMobile ? "12px" : "14px 16px",
  background: "#f9fafb", // Leicht getoenter Hintergrund zur Trennung der Termine
});

const categoryBadgeStyle = (isMobile, isExternal) => ({
  background: isExternal ? "#fee2e2" : "#e5e7eb",
  color: isExternal ? "#b91c1c" : "#374151",
  borderRadius: "999px", // Badgeform: pillenartig; alternativ "10px" fuer weniger rund
  padding: isMobile ? "3px 9px" : "4px 10px",
  fontSize: "12px",
  fontWeight: 700,
});

function KalenderPage() {
  const isMobile = useIsMobile(960);
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
    <div style={pageContainerStyle(isMobile)}>
      <div style={calendarCardStyle(isMobile)}>
        <h2 style={{ marginTop: 0, fontSize: isMobile ? "20px" : undefined }}>Kommende Termine</h2>

        <div style={appointmentListStyle}>
          {nextSixTermine.map((termin) => (
            <div
              key={termin.id}
              style={appointmentItemStyle(isMobile)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontWeight: 700, color: "#111827", fontSize: isMobile ? "15px" : "16px" }}>{termin.titel}</div>
                  <div style={{ marginTop: "4px", color: "#6b7280", fontSize: isMobile ? "12px" : "13px" }}>
                    {formatDate(termin.datum)} um {termin.uhrzeit}
                  </div>
                </div>
                <span
                  style={categoryBadgeStyle(isMobile, termin.kategorie === "Extern")}
                >
                  {termin.kategorie}
                </span>
              </div>
              <div style={{ marginTop: "8px", color: "#374151", fontSize: isMobile ? "12px" : "13px" }}>📍 {termin.ort}</div>
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
