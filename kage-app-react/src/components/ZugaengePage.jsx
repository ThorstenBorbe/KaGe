const pageContainerStyle = {
  padding: "24px",
};

const contentCardStyle = {
  background: "white",
  borderRadius: "18px", // Kartenform: "0px" = eckig, "8px" = dezent, "24px" = weicher
  padding: "24px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  maxWidth: "800px",
  marginBottom: "60px",
};

const bodyTextStyle = {
  marginTop: "12px",
  color: "#4b5563",
  lineHeight: 1.5,
  textAlign: "justify",
};

const reminderBoxStyle = {
  marginTop: "20px",
  padding: "16px", // Alternativ "12px" kompakter oder "20px" luftiger
  borderRadius: "12px", // Form schnell aenderbar: "0px", "8px", "20px"
  background: "#f9fafb",
  border: "1px dashed #d1d5db",
  textAlign: "justify",
  color: "#6b7280",
  fontStyle: "italic",
};

export default function ZugaengePage() {
  return (
    <div style={pageContainerStyle}>

      <div style={contentCardStyle}>


        <p style={bodyTextStyle}>
          Alle Daten werden auf einer Cloud gespeichert, damit auch ohne Coding Änderungen vorgenommen werden können.
          Es muss nur die Excelliste aktualisiert werden, damit die Ansprechpartner immer aktuell sind.<br />
          Alle Termine müssen ebenfalls in den Excellisten gepflegt werden, damit sie in der App korrekt angezeigt werden können.<br /><br />
          In dieser Übersicht werden alle Zugänge und Anleitungen gesammelt.<br />

          Zugangsdaten der Cloud:
          <br />
          
        </p>
      
        <div style={reminderBoxStyle}>
          ⚠️ Das ist nur ein Merker für die noch notwendigen Aufgaben welche gemacht werden müssen.        </div>
      </div>
    </div>
  );
}