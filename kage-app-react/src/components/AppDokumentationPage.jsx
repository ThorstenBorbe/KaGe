const pageContainerStyle = {
  padding: "24px",
  paddingBottom: "80px",
};

const documentationCardStyle = {
  background: "white",
  borderRadius: "16px", // Form der Hauptkarte: "0px" = eckig, "10px" = moderat, "24px" = weicher
  padding: "24px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
  maxWidth: "900px", // Etwas breiter fuer technische Inhalte und laengere Textbloecke
  marginBottom: "60px",
};

const accentTitleStyle = {
  marginTop: 0,
  color: "#b91c1c", // Rot als Akzentfarbe; Alternativen z. B. "#111827" fuer neutral oder "#2563eb" fuer technischer Look
};

const bodyTextStyle = {
  color: "#4b5563",
  lineHeight: 1.6,
};

const hintBoxStyle = {
  marginTop: "18px",
  padding: "14px", // Alternativ "18px" fuer mehr Innenraum
  borderRadius: "12px", // Hinweisform: "6px" = sachlicher, "20px" = weicher
  background: "#f9fafb",
  border: "1px dashed #d1d5db",
  color: "#6b7280",
  fontStyle: "italic",
};

export default function AppDokumentationPage() {
  return (
    <div style={pageContainerStyle}>
      <div style={documentationCardStyle}>
        <h2 style={accentTitleStyle}>App-Dokumentation</h2>
        <p style={{ color: "#b91c1c", fontWeight: 700, marginTop: 0 }}>
          Dieser Bereich ist aktuell noch in der Planung.
        </p>
        <p style={bodyTextStyle}>
          In diesem Bereich wird die technische Dokumentation der KaGe-App gebündelt dargestellt.
        </p>
        <p style={bodyTextStyle}>
          Aktuell umfasst die App die Bereiche Authentifizierung, Rollen & Berechtigungen,
          Veranstaltungsplanung, Kalender, Gruppenverwaltung und Datenschutz.
        </p>
        <div style={hintBoxStyle}>
          ⚠️ Dieser Bereich kann bei Bedarf jederzeit um detaillierte Flows, Sequenzen und technische Details erweitert werden.
        </div>
      </div>
    </div>
  );
}
