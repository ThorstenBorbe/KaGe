const pageContainerStyle = {
  padding: "24px",
  paddingBottom: "80px",
};

const contentCardStyle = {
  background: "white",
  borderRadius: "18px", // Kartenform: "0px" = eckig, "8px" = dezent rund, "24px" = weicher
  padding: "24px", // Innenabstand fuer lesbaren Fliesstext
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  maxWidth: "800px", // Begrenzt die Zeilenlaenge auf grossen Displays
  marginBottom: "60px",
};

const bodyTextStyle = {
  color: "#4b5563", // Ruhiges Grau fuer laengere Lesetexte
  lineHeight: 1.5,
};

const noticeStyle = {
  marginTop: "20px",
  padding: "16px", // Alternativ "20px" fuer mehr Luft in der Hinweisbox
  borderRadius: "12px", // Hinweisform: "0px" = sachlich, "12px" = freundlich, "999px" = markenartig
  background: "#f9fafb",
  border: "1px dashed #d1d5db", // Alternativen: "solid" fuer klarer, "none" fuer ruhiger
  textAlign: "center",
  color: "#6b7280",
  fontStyle: "italic",
};

export default function AhndungPage() {
  return (
    <div style={pageContainerStyle}>
      <div style={contentCardStyle}>

        <p style={{ marginTop: "12px", textAlign: "justify", ...bodyTextStyle }}>
          Muss im Workshop gemeinsam definiert und festgelegt werden, damit es eine klare und transparente Handhabung gibt. 
          Es muss klar sein, welche Verstöße es gibt, wie sie geahndet werden und wer dafür zuständig ist. 
          Es muss auch ein Prozess definiert werden
        </p>

        <p style={{ marginTop: "12px", ...bodyTextStyle }}> 
         Test
        </p>
        <div style={noticeStyle}>
          ⚠️ Das ist nur ein Merker für die noch notwendigen Aufgaben welche gemacht werden müssen.        </div>
      </div>
    </div>
  );
}