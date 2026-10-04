import { useState, useEffect } from "react";
import { supabase } from "../supabase/supabaseConfig";
import { useIsMobile } from "../hooks/useIsMobile";

// "Session 2026/2027" → Tabelle "Session_26_27"
function sessionToTable(session) {
  const m = session.match(/(\d{2})(\d{2})\s*\/\s*(\d{2})(\d{2})/);
  return m ? `Session_${m[2]}_${m[4]}` : session;
}

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

function KalenderPage({ sessionValue = "Session 2026/2027" }) {
  const isMobile = useIsMobile(960);
  const [termine, setTermine] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const tableName = sessionToTable(sessionValue);

        // Heutiges Datum als ISO-String (YYYY-MM-DD)
        const todayStr = new Date().toISOString().split("T")[0];

        // Kommende Termine aus der Session-Tabelle laden
        const { data, error: termineErr } = await supabase
          .from(tableName)
          .select("id, Wochentag, Datum, Uhrzeit, Adresse, PLZ, Ort, Veranstaltung, Intern, Gastgeschenk")
          .gte("Datum", todayStr)
          .order("Datum", { ascending: true })
          .limit(6);
        if (termineErr) throw termineErr;

        if (mounted) setTermine(data ?? []);
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => { mounted = false; };
  }, [sessionValue]); // neu laden wenn Session wechselt

  return (
    <div style={pageContainerStyle(isMobile)}>
      <div style={calendarCardStyle(isMobile)}>
        <h2 style={{ marginTop: 0, fontSize: isMobile ? "20px" : undefined }}>
          Kommende Termine
          {sessionValue && (
            <span style={{ fontWeight: 400, fontSize: "14px", color: "#6b7280", marginLeft: "10px" }}>
              {sessionValue}
            </span>
          )}
        </h2>

        {loading && (
          <p style={{ color: "#6b7280", fontSize: "14px" }}>Termine werden geladen…</p>
        )}
        {error && (
          <p style={{ color: "#b91c1c", fontSize: "14px" }}>
            Fehler beim Laden der Termine: {error}
          </p>
        )}
        {!loading && !error && termine.length === 0 && (
          <p style={{ color: "#6b7280", fontSize: "14px" }}>Keine kommenden Termine gefunden.</p>
        )}

        <div style={appointmentListStyle}>
          {termine.map((termin) => {
            const ortAnzeige = [termin.Adresse, termin.PLZ, termin.Ort].filter(Boolean).join(", ");
            const geschenk = String(termin.Gastgeschenk ?? "").trim();
            const hatGastgeschenk = geschenk !== "" && !/^[-–—]+$/.test(geschenk);

            return (
              <div key={termin.id} style={appointmentItemStyle(isMobile)}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontWeight: 700, color: "#111827", fontSize: isMobile ? "15px" : "16px", textAlign: "left" }}>
                      {termin.Veranstaltung}
                    </div>
                    <div style={{ marginTop: "4px", color: "#6b7280", fontSize: isMobile ? "12px" : "13px", fontWeight: 700 }}>
                      {termin.Wochentag ? `${termin.Wochentag}, ` : ""}{formatDate(termin.Datum)}
                      {termin.Uhrzeit ? `, ${String(termin.Uhrzeit).replace(/(\d{1,2}:\d{2}):\d{2}(\.\d+)?/g, "$1")} Uhr` : ""}
                    </div>
                  </div>
                </div>
                {ortAnzeige && (
                  <div style={{ marginTop: "8px", color: "#374151", fontSize: isMobile ? "12px" : "13px", textAlign: "left" }}>
                    📍 {ortAnzeige}
                  </div>
                )}
                {hatGastgeschenk && (
                  <div style={{ marginTop: "4px", color: "#6b7280", fontSize: isMobile ? "11px" : "12px", textAlign: "left" }}>
                    🎁 Gastgeschenk: {termin.Gastgeschenk}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function formatDate(dateString) {
  if (!dateString) return "";
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${dateString}T00:00:00`));
}

export default KalenderPage;
