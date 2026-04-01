import { useState } from "react";

export default function MeldungPage() {
  const [kategorie, setKategorie] = useState("");
  const [nachricht, setNachricht] = useState("");

  const maxZeichen = 2000;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!kategorie) {
      alert("Bitte wähle eine Kategorie aus.");
      return;
    }

    if (!nachricht.trim()) {
      alert("Bitte gib eine Nachricht ein.");
      return;
    }

    alert("Deine Meldung wurde abgesendet.");

    setKategorie("");
    setNachricht("");
  };

  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
          maxWidth: "800px",
        }}
      >
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="kategorie"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "bold",
              }}
            >
              Betreff / Kategorie
            </label>

            <select
              id="kategorie"
              value={kategorie}
              onChange={(e) => setKategorie(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #d1d5db",
                fontSize: "14px",
              }}
            >
              <option value="">Bitte auswählen</option>
              <option value="Verstoß gegen Verhaltensregeln">Verstoß gegen Verhaltensregeln</option>
              <option value="Konflikt zwischen Mitgliedern">Konflikt zwischen Mitgliedern</option>
              <option value="Verstoß gegen KaGe-Carta">Verstoß gegen KaGe-Carta</option>
              <option value="Sonstiges">Sonstiges</option>
            </select>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label
              htmlFor="nachricht"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "bold",
              }}
            >
              Nachricht
            </label>

            <textarea
              id="nachricht"
              value={nachricht}
              onChange={(e) => setNachricht(e.target.value.slice(0, maxZeichen))}
              maxLength={maxZeichen}
              rows={15}
              placeholder="Bitte beschreibe deinen Sachverhalt..."
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #d1d5db",
                fontSize: "14px",
                resize: "vertical",
                fontFamily: "Arial, sans-serif",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div
            style={{
              textAlign: "right",
              marginBottom: "20px",
              fontSize: "13px",
              color: "#6b7280",
            }}
          >
            {nachricht.length} / {maxZeichen} Zeichen
          </div>

          <button
            type="submit"
            style={{
              background: "#b91c1c",
              color: "white",
              border: "none",
              borderRadius: "10px",
              padding: "12px 20px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            Absenden
          </button>
        </form>
      </div>
    </div>
  );
}
