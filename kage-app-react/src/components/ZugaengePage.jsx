export default function ZugaengePage() {
  return (
    <div style={{ padding: "24px" }}>

      <div
        style={{
          background: "white",
          borderRadius: "18px",
          padding: "24px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          maxWidth: "800px",
          marginBottom: "60px",
        }}
      >


        <p style={{ marginTop: "12px", color: "#4b5563", lineHeight: 1.5, textAlign: "justify" }}>
          Alle Daten werden auf einer Cloud gespeichert, damit auch ohne Coding Änderungen vorgenommen werden können.
          Es muss nur die Excelliste aktualisiert werden, damit die Ansprechpartner immer aktuell sind.<br />
          Alle Termine müssen ebenfalls in den Excellisten gepflegt werden, damit sie in der App korrekt angezeigt werden können.<br /><br />
          In dieser Übersicht werden alle Zugänge und Anleitungen gesammelt.<br />

          Zugangsdaten der Cloud:
          <br />
          
        </p>
      
        <div
          style={{
            marginTop: "20px",
            padding: "16px",
            borderRadius: "12px",
            background: "#f9fafb",
            border: "1px dashed #d1d5db",
            textAlign: "justify",
            color: "#6b7280",
            fontStyle: "italic",
          }}
        >
          ⚠️ Das ist nur ein Merker für die noch notwendigen Aufgaben welche gemacht werden müssen.        </div>
      </div>
    </div>
  );
}