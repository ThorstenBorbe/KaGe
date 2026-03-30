export default function GroupPage({ group }) {
  return (
    <div
      style={{
        padding: "24px",
        background: "#f3f4f6",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >


      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "20px",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "18px",
            padding: "20px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <h2 style={{ marginTop: 0 }}>👤 Ansprechpartner</h2>
          {group.ansprechpartner.map((person) => (
            <div
              key={person.email}
              style={{
                padding: "14px",
                borderRadius: "12px",
                background: "#f9fafb",
                marginBottom: "12px",
                border: "1px solid #e5e7eb",
              }}
            >
              <div style={{ fontWeight: "bold", fontSize: "18px" }}>{person.name}</div>
              <div style={{ marginTop: "6px", color: "#374151" }}>📞 {person.telefon}</div>
              <div style={{ marginTop: "4px", color: "#374151" }}>✉️ {person.email}</div>
            </div>
          ))}
        </div>

        <div
          style={{
            background: "white",
            borderRadius: "18px",
            padding: "20px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <h2 style={{ marginTop: 0 }}>🏋️ Trainingstermine</h2>
          {group.trainingstermine.map((termin, index) => (
            <div
              key={index}
              style={{
                padding: "14px",
                borderRadius: "12px",
                background: "#f9fafb",
                marginBottom: "12px",
                border: "1px solid #e5e7eb",
              }}
            >
              <div style={{ fontWeight: "bold", fontSize: "17px" }}>{termin.tag}</div>
              <div style={{ marginTop: "6px", color: "#374151" }}>🕒 {termin.uhrzeit}</div>
              <div style={{ marginTop: "4px", color: "#374151" }}>📍 {termin.ort}</div>
            </div>
          ))}
        </div>

        <div
          style={{
            background: "white",
            borderRadius: "18px",
            padding: "20px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
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
            }}
          >
            Terminplan öffnen
          </a>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: "18px",
            padding: "20px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <h2 style={{ marginTop: 0 }}>🎤 Nächste Auftritte</h2>
          {group.naechsteAuftritte.map((auftritt, index) => (
            <div
              key={index}
              style={{
                padding: "14px",
                borderRadius: "12px",
                background: "#f9fafb",
                marginBottom: "12px",
                border: "1px solid #e5e7eb",
              }}
            >
              <div style={{ fontWeight: "bold", fontSize: "17px" }}>
                {auftritt.veranstaltung}
              </div>
              <div style={{ marginTop: "6px", color: "#374151" }}>📅 {auftritt.datum}</div>
              <div style={{ marginTop: "4px", color: "#374151" }}>📍 {auftritt.ort}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}