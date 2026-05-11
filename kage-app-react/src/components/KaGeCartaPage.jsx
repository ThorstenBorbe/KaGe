const pageContainerStyle = {
  padding: "24px",
  paddingBottom: "80px",
};

const contentCardStyle = {
  background: "white",
  borderRadius: "18px", // Kartenform: "0px" = eckig, "10px" = moderat, "24px" = weicher
  padding: "24px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  maxWidth: "800px",
  marginBottom: "60px",
};

const charterListStyle = {
  marginTop: "12px",
  color: "#4b5563",
  lineHeight: 1.6,
  textAlign: "justify",
  paddingLeft: "20px", // Listen-Einzug: "16px" kompakter, "24px" grosszuegiger
};

const closingTextStyle = {
  marginTop: "20px",
  fontWeight: "bold",
  textAlign: "center",
};

export default function KaGeCartaPage() {
  return (
    <div style={pageContainerStyle}>
      <div style={contentCardStyle}>
        <p style={closingTextStyle}>
          Die KaGe Zell ist mehr als eine Abteilung – wir sind eine Gemeinschaft, die verbindet, schützt und begeistert. Wir sind eine Lebenseinstellung.
        </p>
      </div>
    </div>
  );
}