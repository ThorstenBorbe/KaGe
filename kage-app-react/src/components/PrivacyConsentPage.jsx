import { useState } from "react";

export default function PrivacyConsentPage({ onAccept, busy, stand }) {
  const [checked, setChecked] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!checked || busy) return;
    await onAccept();
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "860px",
          background: "white",
          borderRadius: "16px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
          padding: "28px",
          textAlign: "left",
          marginBottom: "60px",
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: 10, color: "#b91c1c", fontSize: "18px" }}>
          Datenschutzhinweise
        </h1>
        <p style={{ marginTop: 0, marginBottom: "18px", color: "#6b7280", fontSize: "18px" }}>Stand: {stand}</p>

        <div style={{ maxHeight: "56vh", overflowY: "auto", paddingRight: "8px" }}>
          <Section title="1. Verantwortlicher">
            <p>Turngemeinde Zell von 1862 e.V. (Abteilung Karnevallsgesellschaft)</p>
            <p>Hauptstraße 134</p>
            <p>E-Mail: tbd@kagezell.de</p>
            <p>Telefon: 0178/12345678</p>
            <p>Vertreten durch: 1. Gesellschaftspräsident Thorsten Borbe</p>
          </Section>

          <Section title="2. Zweck der Verarbeitung">
            <p>Wir verarbeiten personenbezogene Daten, um den Zugang zur App zu ermöglichen, vereinsinterne Informationen bereitzustellen, Veranstaltungen zu organisieren und den sicheren Betrieb der App zu gewährleisten.</p>
          </Section>

          <Section title="3. Verarbeitete Daten">
            <p>Stammdaten (Name, E-Mail, Rolle), Nutzungsdaten (Login-Zeitpunkte), Organisationsdaten (Gruppen- und Einsatzlisten) sowie Inhaltsdaten zu Veranstaltungen.</p>
          </Section>

          <Section title="4. Rechtsgrundlagen">
            <p>Art. 6 Abs. 1 lit. b DSGVO, Art. 6 Abs. 1 lit. f DSGVO und soweit erforderlich Art. 6 Abs. 1 lit. a DSGVO.</p>
          </Section>

          <Section title="5. Empfänger und Dienstleister">
            <p>Für Betrieb und Speicherung nutzen wir Google Firebase (Google Ireland Limited, Dublin, Irland). Es kann zu Drittlandübermittlungen kommen; diese erfolgen auf Basis geeigneter Garantien nach Art. 44 ff. DSGVO.</p>
          </Section>

          <Section title="6. Speicherdauer">
            <p>Personenbezogene Daten werden nur so lange gespeichert, wie es für die genannten Zwecke erforderlich ist oder gesetzliche Pflichten bestehen.</p>
          </Section>

          <Section title="7. Rechte der betroffenen Personen">
            <p>Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit, Widerspruch, Widerruf von Einwilligungen sowie Beschwerderecht bei einer Aufsichtsbehörde.</p>
          </Section>

          <Section title="8. Kontakt Datenschutz">
            <p>tbd@kagezell.de</p>
          </Section>
        </div>

        <form onSubmit={handleSubmit} style={{ marginTop: "18px" }}>
          <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "18px", color: "#111827" }}>
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              style={{ marginTop: "3px" }}
            />
            <span>Ich habe die Datenschutzhinweise gelesen und akzeptiere die Verarbeitung meiner personenbezogenen Daten gemäß diesen Hinweisen.</span>
          </label>

          <button
            type="submit"
            disabled={!checked || busy}
            style={{
              marginTop: "14px",
              background: !checked || busy ? "#e5e7eb" : "#b91c1c",
              color: !checked || busy ? "#9ca3af" : "white",
              border: "none",
              borderRadius: "8px",
              padding: "11px 16px",
              fontWeight: 700,
              fontSize: "18px",
              cursor: !checked || busy ? "not-allowed" : "pointer",
            }}
          >
            {busy ? "Speichern..." : "Akzeptieren und fortfahren"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section style={{ marginBottom: "12px", fontSize: "18px", color: "#111827" }}>
      <h2 style={{ fontSize: "18px", color: "#b91c1c", margin: "0 0 6px 0" }}>{title}</h2>
      <div>{children}</div>
    </section>
  );
}
