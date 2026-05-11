export default function ToDosPage() {
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


        <p style={{ marginTop: "12px", color: "#4b5563", lineHeight: 1.5, textAlign: "justify"  }}>
          Folgende Punkte müssen noch implementiert werden.
        </p>
        <p style={{ marginTop: "12px", color: "#4b5563", lineHeight: 1.5, textAlign: "justify" }}>
          1. Datenbank mit Mitgliedern und Gruppenzuordnung komplementieren
        </p>
        <p style={{ marginTop: "12px", color: "#4b5563", lineHeight: 1.5, textAlign: "justify" }}>
          2. Cloudspeicher reservieren und Daten dort ablegen (supabase Konto angelegt, da Deutscher Standort)
        </p>
        <p style={{ marginTop: "12px", color: "#4b5563", lineHeight: 1.5, textAlign: "justify" }}>
          3. Erstellung VMI Matrix (Verantwortlichkeiten, Mitwirkende, Informierte) für die verschiedenen Bereiche um die Zuständigkeiten zu klären
        </p>
        <p style={{ marginTop: "12px", color: "#4b5563", lineHeight: 1.5, textAlign: "justify" }}>
          4. Personalisierte Übersicht was für den einzelnen als nächstes ansteht
        </p>
        <p style={{ marginTop: "12px", color: "#4b5563", lineHeight: 1.5, textAlign: "justify" }}>
          5. Datenbank für verschiedene Termine anlegen und auf Cloud stellen, dass auch Bilder vom Aufbau eingesehen werden können
        </p>        
        <p style={{ marginTop: "12px", color: "#4b5563", lineHeight: 1.5, textAlign: "justify" }}>
          6. Nach Eintragung der Termin bei der Gema entrichtet werden muss, automatisiert eine Email zur Anmeldung verschicken
        </p>    
        <p style={{ marginTop: "12px", color: "#4b5563", lineHeight: 1.5, textAlign: "justify" }}>
          7. Protokolle über App jederzeit lesbar machen (Cloud)
        </p>
        <p style={{ marginTop: "12px", color: "#4b5563", lineHeight: 1.5, textAlign: "justify" }}>
          8. Ideen vom Workshop einholen und in die App einarbeiten
        </p>
        <p style={{ marginTop: "12px", color: "#4b5563", lineHeight: 1.5, textAlign: "justify" }}>
          9. Sessionsumschaltung über Cloud für die einzelnen Veranstaltungen umschalten
        </p>        <p style={{ marginTop: "12px", color: "#4b5563", lineHeight: 1.5, textAlign: "justify" }}>
          <br />

        </p>

        <div
          style={{
            marginTop: "20px",
            padding: "16px",
            borderRadius: "12px",
            background: "#f9fafb",
            border: "1px dashed #d1d5db",
            textAlign: "center",
            color: "#6b7280",
            fontStyle: "italic",
          }}
        >
          ⚠️ Das ist nur ein Merker für die noch notwendigen Aufgaben welche gemacht werden müssen.        </div>
      </div>
    </div>
  );
}
