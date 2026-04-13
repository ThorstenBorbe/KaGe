import ethikKommitee from "../data/ethikKommitee";

const pageContainerStyle = {
  padding: "24px",
  paddingBottom: "80px",
};

const introTextStyle = {
  marginTop: "8px",
  opacity: 0.9,
  textAlign: "justify",
};

const committeeGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", // Kartenbreite: 260px = kompakter, 300px = ausgewogen, 360px = grosszuegiger
  gap: "20px",
  marginBottom: "60px",
};

const memberCardStyle = {
  background: "white",
  borderRadius: "16px", // Kartenform der Personenboxen: "0px", "8px", "16px"
  padding: "16px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
};

const memberImageStyle = {
  width: "100%",
  height: "200px", // Bildhoehe: "160px" kompakter, "200px" ausgewogen, "240px" bildstarker
  objectFit: "cover",
  borderRadius: "12px", // Bildform kann unabhaengig von der Karte angepasst werden
  marginBottom: "12px",
};

const roleLabelStyle = {
  color: "#b91c1c", // Rot als Rollenakzent; neutral waere "#374151"
  fontWeight: "bold",
};

export default function EthikkommiteePage() {
  return (
    <div style={pageContainerStyle}>

        <p style={introTextStyle}>
           Die Ethikkommission prüft, ob Vorhaben moralisch und rechtlich vertretbar sind.<br />
           Sie ist Ansprechpartner für alle Mitglieder, die sich in einer schwierigen Situation befinden oder ein Anliegen haben.<br />
           Alle Mitglieder sind verpflichtet, sich an die ethischen Richtlinien zu halten und bei Verstößen die Ethikkommission zu informieren.<br />
           Bei Verstößen werden geeignete Maßnahmen eingeleitet.
        </p>
 

      <div style={committeeGridStyle}>
        <p><br /></p>
        <p><br /></p>
        {ethikKommitee.map((person) => (
          <div
            key={person.id}
            style={memberCardStyle}
          >
            <img
              src={person.bild}
              alt={person.name}
              style={memberImageStyle}
            />

            <div style={roleLabelStyle}>
              {person.rolle}
            </div>

            <h2>{person.name}</h2>
            <p>✉️ {person.email}</p>
            <p><br /></p>
            <p>📱 {person.mobil}</p>
            <p><br /></p>
            <p>📍 {person.adresse.strasse} {person.adresse.hausnummer}<br />
                  {person.adresse.plz} {person.adresse.ort}</p>
          </div>
        ))}
      </div>

    </div>
  );
}