const pageContainerStyle = {
  padding: "24px",
  paddingBottom: "80px",
};

const privacyCardStyle = {
  background: "white",
  borderRadius: 16, // Kartenform: 0 = eckig, 12 = klassisch, 24 = weicher
  padding: 28, // Mehr Innenabstand fuer lange Rechtstexte
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  maxWidth: 900,
  textAlign: "left",
  marginBottom: "60px",
};

const pageTitleStyle = {
  marginTop: 0,
  marginBottom: 10,
  color: "#b91c1c", // Rot markiert wichtige Ueberschriften; neutral waere z. B. "#111827"
  fontSize: "18px",
};

const metaTextStyle = {
  marginTop: 0,
  marginBottom: "18px",
  color: "#6b7280",
  fontSize: "18px",
};

const dataListStyle = {
  margin: "6px 0 0 18px",
  padding: 0,
};

const sectionStyle = {
  marginBottom: 14,
  fontSize: 18,
  color: "#111827",
  lineHeight: 1.5,
};

const sectionTitleStyle = {
  fontSize: 18,
  color: "#b91c1c",
  margin: "0 0 6px 0",
};

export default function DatenschutzPage() {
  return (
    <div style={pageContainerStyle}>
      <div style={privacyCardStyle}>
        <h1 style={pageTitleStyle}>
          Datenschutzhinweise
        </h1>
        <p style={metaTextStyle}>Stand: 10.05.2026</p>

        <Section title="1. Verantwortlicher">
          <p>Turngemeinde Zell von 1862 e.V. (Abteilung Karnevallsgesellschaft)</p>
          <p>Hauptstraße 134</p>
          <p>E-Mail: tbd@kagezell.de</p>
          <p>Telefon: 0178/12345678</p>
          <p>Vertreten durch: 1. Gesellschaftspräsident Thorsten Borbe</p>
        </Section>

        <Section title="2. Zweck der Verarbeitung">
          <p>Wir verarbeiten personenbezogene Daten, um den Zugang zur App zu ermöglichen, vereinsinterne Informationen bereitzustellen, Veranstaltungen zu organisieren und den sicheren Betrieb der App sicherzustellen.</p>
        </Section>

        <Section title="3. Verarbeitete Daten">
          <p>Je nach Nutzung der App verarbeiten wir insbesondere:</p>
          <ul style={dataListStyle}>
            <li>Stammdaten: Name, E-Mail-Adresse, Rolle/Funktion im Verein</li>
            <li>Nutzungsdaten: Login-Zeitpunkte, technische Protokolldaten</li>
            <li>Organisationsdaten: Zuordnungen zu Gruppen, Teilnahme- und Einsatzlisten</li>
            <li>Inhaltsdaten: Einträge zu Veranstaltungen (z. B. Fahrer, Auftritte, Treffpunkte)</li>
          </ul>
        </Section>

        <Section title="4. Rechtsgrundlagen">
          <p>Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, Art. 6 Abs. 1 lit. f DSGVO und soweit erforderlich Art. 6 Abs. 1 lit. a DSGVO.</p>
        </Section>

        <Section title="5. Empfänger und Dienstleister">
          <p>Zur Bereitstellung der App nutzen wir Google Firebase (Authentication, Firestore, Storage), Anbieter: Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland.</p>
          <p>Soweit eine Übermittlung in Drittländer erfolgt (z. B. USA), geschieht dies auf Basis geeigneter Garantien gemäß Art. 44 ff. DSGVO (z. B. EU-Standardvertragsklauseln).</p>
        </Section>

        <Section title="6. Speicherdauer">
          <p>Personenbezogene Daten werden nur so lange gespeichert, wie es für die genannten Zwecke erforderlich ist oder gesetzliche Aufbewahrungspflichten bestehen.</p>
        </Section>

        <Section title="7. Rechte der betroffenen Personen">
          <p>Betroffene Personen haben insbesondere folgende Rechte: Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit, Widerspruch, Widerruf von Einwilligungen sowie Beschwerde bei einer Datenschutzaufsichtsbehörde.</p>
        </Section>

        <Section title="8. Kontakt Datenschutz">
          <p>tbd@kagezell.de</p>
          <p>Turngemeinde Zell von 1862 e.V. (Abteilung Karnevallsgesellschaft), Hauptstraße 134</p>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section style={sectionStyle}>
      <h2 style={sectionTitleStyle}>{title}</h2>
      <div>{children}</div>
    </section>
  );
}
