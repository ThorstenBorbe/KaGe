import { useAuth } from "../context/AuthContext";
import { useIsMobile } from "../hooks/useIsMobile";
import { EXCEL_LINKS } from "../config/excelLinks";

export default function GroupPage({ group, groupKey }) {
  const isMobile = useIsMobile(960);
  const { hasRole } = useAuth();
  const isSessionGroup = group.name === "11'n" || group.name === "Elferräte";
  const canCancelSessionOrTraining = hasRole("vorstand");
  const canSeeExcel = hasRole("vorstand");
  const excelUrl = EXCEL_LINKS.gruppen?.[groupKey] ?? "";

  return (
    <div
      style={{
        padding: isMobile ? "12px" : "24px",
        background: "#f3f4f6",
        minHeight: isMobile ? "auto" : "100vh",
        fontFamily: "Century Gothic, Segoe UI, Roboto, sans-serif",
      }}
    >


      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(320px, 1fr))",
          gap: isMobile ? "12px" : "20px",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "18px",
            padding: isMobile ? "14px" : "20px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            marginBottom: "60px",
          }}
        >
          <h2 style={{ marginTop: 0 }}>👤 Ansprechpartner</h2>
          {group.ansprechpartner.map((person) => (
            <div
              key={person.email}
              style={{
                padding: isMobile ? "11px" : "14px",
                borderRadius: "12px",
                background: "#f9fafb",
                marginBottom: "12px",
                border: "1px solid #e5e7eb",
              }}
            >
              <div style={{ fontWeight: "bold", fontSize: isMobile ? "16px" : "18px" }}>{person.name}</div>
              <div style={{ marginTop: "6px", color: "#374151", fontSize: isMobile ? "13px" : "16px" }}>📞 {person.telefon}</div>
              <div style={{ marginTop: "4px", color: "#374151", fontSize: isMobile ? "13px" : "16px" }}>✉️ {person.email}</div>
            </div>
          ))}
        </div>

        <div
          style={{
            background: "white",
            borderRadius: "18px",
            padding: isMobile ? "14px" : "20px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            marginBottom: "60px",
          }}
        >
          <h2 style={{ marginTop: 0 }}>
            {isSessionGroup ? "📅 Sitzungstermine" : "🏋️ Trainingstermine"}
          </h2>
          {group.trainingstermine.map((termin, index) => (
            <div
              key={index}
              style={{
                padding: isMobile ? "11px" : "14px",
                borderRadius: "12px",
                background: "#f9fafb",
                marginBottom: "12px",
                border: "1px solid #e5e7eb",
              }}
            >
              <div style={{ fontWeight: "bold", fontSize: isMobile ? "15px" : "17px" }}>{termin.tag}</div>
              <div style={{ marginTop: "6px", color: "#374151", fontSize: isMobile ? "13px" : "16px" }}>🕒 {termin.uhrzeit}</div>
              <div style={{ marginTop: "4px", color: "#374151", fontSize: isMobile ? "13px" : "16px" }}>📍 {termin.ort}</div>
            </div>
          ))}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "4px", justifyContent: "center" }}>
            {canCancelSessionOrTraining && (
              <button
                type="button"
                style={{
                  background: "#b91c1c",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  padding: "10px 16px",
                  width: isMobile ? "100%" : "220px",
                  minHeight: "44px",
                  fontWeight: "bold",
                  fontSize: isMobile ? "14px" : "16px",
                  fontFamily: "Century Gothic, Segoe UI, Roboto, sans-serif",
                  cursor: "pointer",
                }}
              >
                {isSessionGroup ? "Sitzung fällt aus" : "Training fällt aus"}
              </button>
            )}
            <button
              type="button"
              style={{
                background: "#b91c1c",
                color: "white",
                border: "none",
                borderRadius: "12px",
                padding: "10px 16px",
                width: isMobile ? "100%" : "220px",
                minHeight: "44px",
                fontWeight: "bold",
                fontSize: isMobile ? "14px" : "16px",
                fontFamily: "Century Gothic, Segoe UI, Roboto, sans-serif",
                cursor: "pointer",
              }}
            >
              Verhindert
            </button>
          </div>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: "18px",
            padding: isMobile ? "14px" : "20px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            marginBottom: "60px",
          }}
        >
          <h2 style={{ marginTop: 0 }}>📄 Terminplan</h2>
          <p><br /></p>
          <p style={{ color: "#4b5563", lineHeight: 1.5, textAlign: "justify" }}>
            Den aktuellen Terminplan Deiner Gruppe kannst Du hier direkt als PDF öffnen.
          </p>
          <a
            href={group.terminplanPdf}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-block",
              marginTop: "12px",
              background: "#b91c1c",
              color: "white",
              textDecoration: "none",
              padding: "12px 18px",
              borderRadius: "12px",
              fontWeight: "bold",
              fontSize: isMobile ? "14px" : "16px",
              fontFamily: "Century Gothic, Segoe UI, Roboto, sans-serif",
            }}
          >
            Terminplan öffnen
          </a>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: "18px",
            padding: isMobile ? "14px" : "20px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            marginBottom: "60px",
          }}
        >
          <h2 style={{ marginTop: 0 }}>🎤 Nächste Auftritte</h2>
          {group.naechsteAuftritte.map((auftritt, index) => (
            <div
              key={index}
              style={{
                padding: isMobile ? "11px" : "14px",
                borderRadius: "12px",
                background: "#f9fafb",
                marginBottom: "12px",
                border: "1px solid #e5e7eb",
              }}
            >
              <div style={{ fontWeight: "bold", fontSize: "17px" }}>
                {auftritt.veranstaltung}
              </div>
              <div style={{ marginTop: "6px", color: "#374151", fontSize: isMobile ? "13px" : "16px" }}>📅 {auftritt.datum}</div>
              <div style={{ marginTop: "4px", color: "#374151", fontSize: isMobile ? "13px" : "16px" }}>📍 {auftritt.ort}</div>
            </div>
          ))}
        </div>
      </div>

      {canSeeExcel && (
        <div
          style={{
            background: "white",
            borderRadius: "18px",
            padding: isMobile ? "14px" : "24px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            marginTop: isMobile ? "12px" : "20px",
            marginBottom: "60px",
          }}
        >
          <h2 style={{ marginTop: 0 }}>📊 Mitgliederliste (Excel)</h2>
          <p style={{ color: "#4b5563", lineHeight: 1.6 }}>
            Hier kannst du die Mitgliederliste dieser Gruppe als Excel-Datei öffnen.
          </p>
          {excelUrl ? (
            <a
              href={excelUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-block",
                marginTop: "8px",
                background: "#b91c1c",
                color: "white",
                textDecoration: "none",
                padding: "12px 18px",
                borderRadius: "12px",
                fontWeight: "bold",
                fontSize: isMobile ? "14px" : "16px",
                fontFamily: "Century Gothic, Segoe UI, Roboto, sans-serif",
              }}
            >
              Excel-Liste öffnen
            </a>
          ) : (
            <span
              style={{
                display: "inline-block",
                marginTop: "8px",
                background: "#e5e7eb",
                color: "#9ca3af",
                padding: "12px 18px",
                borderRadius: "12px",
                fontWeight: "bold",
                fontSize: isMobile ? "14px" : "16px",
              }}
            >
              Link noch nicht hinterlegt
            </span>
          )}
        </div>
      )}
    </div>
  );
}