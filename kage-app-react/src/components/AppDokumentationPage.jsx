export default function AppDokumentationPage() {
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
        <h2 style={{ marginTop: 0, color: "#b91c1c" }}>App-Dokumentation</h2>
        <p style={{ color: "#b91c1c", fontWeight: 700, marginTop: 0 }}>
          Dieser Bereich ist aktuell noch in der Planung.
        </p>
        <p style={{ color: "#4b5563", lineHeight: 1.6 }}>
          In diesem Bereich wird die technische Dokumentation der KaGe-App gebündelt dargestellt.
        </p>
        <p style={{ color: "#4b5563", lineHeight: 1.6 }}>
          Aktuell umfasst die App die Bereiche Authentifizierung, Rollen & Berechtigungen,
          Veranstaltungsplanung, Kalender, Gruppenverwaltung und Datenschutz.
        </p>
        <div
          style={{
            marginTop: "18px",
            padding: "14px",
            borderRadius: "12px",
            background: "#f9fafb",
            border: "1px dashed #d1d5db",
            color: "#6b7280",
            fontStyle: "italic",
          }}
        >
          ⚠️ Dieser Bereich kann bei Bedarf jederzeit um detaillierte Flows, Sequenzen und technische Details erweitert werden.
        </div>
      </div>
    </div>
  );
}
