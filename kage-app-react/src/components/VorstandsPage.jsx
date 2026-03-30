import vorstand from "../data/vorstandSchaft";

export default function VorstandsPage() {
  return (
    <div style={{ padding: "24px" }}>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {vorstand.map((person) => (
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
                height: "320px",
                objectFit: "cover",
                borderRadius: "12px",
                marginBottom: "30px",
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