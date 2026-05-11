const pageContainerStyle = {
  padding: "24px",
  paddingBottom: "80px",
};

const cardStyle = {
  background: "white",
  borderRadius: "16px",
  padding: "28px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  maxWidth: "700px",
  marginBottom: "60px",
};

const headingStyle = {
  marginTop: 0,
  marginBottom: "16px",
  color: "#111827",
  fontSize: "20px",
  fontWeight: 700,
};

const textStyle = {
  color: "#4b5563",
  lineHeight: 1.6,
  marginBottom: "8px",
};

export default function ImpressumPage() {
  return (
    <div style={pageContainerStyle}>
      <div style={cardStyle}>
        <h2 style={headingStyle}>Impressum</h2>

        <p style={textStyle}>
          <strong>KaGe Zell e.V.</strong>
        </p>
        <p style={textStyle}>
          Hier folgen die Angaben gemäß § 5 TMG.
        </p>
        <p style={{ ...textStyle, fontStyle: "italic", color: "#9ca3af" }}>
          ⚠️ Dieser Bereich muss noch mit den offiziellen Vereinsdaten befüllt werden.
        </p>
      </div>
    </div>
  );
}
