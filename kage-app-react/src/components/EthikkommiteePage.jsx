import ethikKommitee from "../data/ethikKommitee";

export default function EthikkommiteePage() {
  return (
    <div style={{ padding: "24px", paddingBottom: "80px" }}>

        <p style={{ marginTop: "8px", opacity: 0.9, textAlign: "justify" }}>
           Die Ethikkommission prüft, ob Vorhaben moralisch und rechtlich vertretbar sind.<br />
           Sie ist Ansprechpartner für alle Mitglieder, die sich in einer schwierigen Situation befinden oder ein Anliegen haben.<br />
           Alle Mitglieder sind verpflichtet, sich an die ethischen Richtlinien zu halten und bei Verstößen die Ethikkommission zu informieren.<br />
           Bei Verstößen werden geeignete Maßnahmen eingeleitet.
        </p>
 

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
          marginBottom: "60px",
        }}
      >
        <p><br /></p>
        <p><br /></p>
        {ethikKommitee.map((person) => (
          <div
            key={person.id}
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "16px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
            }}
          >
            <img
              src={person.bild}
              alt={person.name}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                borderRadius: "12px",
                marginBottom: "12px",
              }}
            />

            <div style={{ color: "#b91c1c", fontWeight: "bold" }}>
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