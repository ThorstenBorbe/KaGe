import { useState } from "react";

const pageContainerStyle = {
  padding: "24px", // Abstand rund um die Seite: Innenabstand für den gesamten Content
  paddingBottom: "80px", // Extra Platz unten, damit der Footer-Bereich nicht zu nahe am Formular liegt
};

const formCardStyle = {
  background: "white", // Heller Hintergrund für die Karte, damit das Formular klar heraussticht
  borderRadius: "16px", // Rundung der Karte: groesser = weicher, kleiner = technischer Look
  padding: "24px", // Innenabstand innerhalb der Karte, damit die Inhalte nicht am Rand kleben
  boxShadow: "0 4px 10px rgba(0,0,0,0.08)", // Schatten fuer Tiefe und Abgrenzung vom Hintergrund
  maxWidth: "800px", // Maximale Breite, damit das Formular nicht zu breit wird
  marginBottom: "60px", // Abstand nach unten zu weiteren Seiteninhalten
};

const fieldGroupStyle = {
  marginBottom: "20px", // Abstand zwischen Formularabschnitten
};

const fieldLabelStyle = {
  display: "block", // Label immer als Block, damit es ueber dem Feld steht
  marginBottom: "8px", // Abstand zwischen Label und Eingabefeld
  fontWeight: "bold",
  fontSize: "18px", // Schriftgroesse des Labels
};

const inputControlStyle = {
  width: "100%", // Volle Breite im umgebenden Container
  padding: "12px", // Innenabstand im Eingabefeld, fuer gute Klick- und Touch-Fläche
  borderRadius: "10px", // Abgerundete Ecken fuer ein moderneres Erscheinungsbild
  border: "1px solid #d1d5db", // Standardrahmenfarbe, dezenter Grau-Ton
  fontSize: "18px", // Lesbare Schriftgroesse im Feld
  boxSizing: "border-box",
};

const textareaStyle = {
  ...inputControlStyle,
  resize: "vertical", // Textarea kann nur vertikal vergrößert werden
  fontFamily: "Century Gothic, Segoe UI, Roboto, sans-serif", // Einheitliche Schriftfamilie
  boxSizing: "border-box",
};

const counterTextStyle = {
  textAlign: "right", // Zeichenanzahl rechtsbündig zum Feldausgleich
  marginBottom: "20px",
  fontSize: "18px",
  color: "#6b7280",
};

const attachmentHintStyle = {
  marginTop: "8px",
  marginBottom: 0,
  fontSize: "14px",
  color: "#6b7280",
};

const uploadButtonStyle = {
  display: "inline-flex", // Button-Inhalt zentrieren
  alignItems: "center", // Vertikale Zentrierung innerhalb des Buttons
  justifyContent: "center", // Inhalt horizontal zentrieren
  background: "#f9fafb", // Hellgrauer Hintergrund fuer sekundäre Aktion
  color: "#111827",
  border: "1px solid #d1d5db", // Gleicher Rahmen wie die Eingabefelder
  borderRadius: "10px",
  padding: "12px", // Gleiches Innenpolster wie das Eingabefeld fuer optische Konsistenz
  cursor: "pointer",
  fontSize: "18px",
  fontWeight: 600,
  height: "48px", // Gleiche Höhe wie die Eingabefelder: sorgt für parallele Ausrichtung
  boxSizing: "border-box",
};

const hiddenFileInputStyle = {
  display: "none", // Verstecktes Native-Input, der Label-Button steuert die Auswahl
};

const selectedFileStyle = {
  marginTop: "10px",
  fontSize: "15px",
  color: "#374151",
};

const submitButtonStyle = {
  background: "#b91c1c",
  color: "white",
  border: "none",
  borderRadius: "10px",
  padding: "12px 20px",
  cursor: "pointer",
  fontSize: "18px",
  fontWeight: "bold",
};

export default function BoeckFeedbackPage() {
  const [kategorie, setKategorie] = useState("");
  const [nachricht, setNachricht] = useState("");
  const [anhang, setAnhang] = useState(null);
  const [betrag, setBetrag] = useState("");

  const maxZeichen = 2000;

  const isRechnung = kategorie === "Rechnung";

  const handleKategorieChange = (event) => {
    const nextKategorie = event.target.value;
    setKategorie(nextKategorie);

    if (nextKategorie !== "Rechnung") {
      setAnhang(null);
      setBetrag("");
    }
  };

  const handleAttachmentChange = (event) => {
    const selectedFile = event.target.files?.[0] ?? null;
    setAnhang(selectedFile);
  };

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

    if (isRechnung && !betrag.trim()) {
      alert("Bitte gib den Betrag in € ein.");
      return;
    }

    const attachmentMessage = anhang ? `\nAnhang: ${anhang.name}` : "";
    const betragMessage = isRechnung ? `\nBetrag: ${betrag} €` : "";
    alert(`Deine Nachricht wurde abgesendet.${attachmentMessage}${betragMessage}`);

    setKategorie("");
    setNachricht("");
    setAnhang(null);
    setBetrag("");
  };

  return (
    <div style={pageContainerStyle}>


      <div style={formCardStyle}>
        <form onSubmit={handleSubmit}>
          <div style={fieldGroupStyle}>
            <label
              htmlFor="kategorie"
              style={fieldLabelStyle}
            >
              Betreff / Kategorie
            </label>

            <select
              id="kategorie"
              value={kategorie}
              onChange={handleKategorieChange}
              style={inputControlStyle}
            >
              <option value="">Bitte auswählen</option>
              <option value="Rechnung">Rechnung</option>
              <option value="Verbesserungsvorschlag">Verbesserungsvorschlag</option>
              <option value="Positives Feedback">Positives Feedback</option>
              <option value="Negatives Feedback">Negatives Feedback</option>
              <option value="Sonstiges">Sonstiges</option>
            </select>

            {isRechnung && (
              <div style={{ marginTop: "16px" }}>
                {/* Rechnungs-Layout: Zeile mit Betrag und Upload-Button nebeneinander */}
                <label htmlFor="betrag" style={fieldLabelStyle}>
                  Betrag (€) *
                </label>
                <p style={{ fontSize: "10px", color: "#6b7280", margin: "4px 0 8px 0" }}>Pflichtfeld</p>
                <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                  {/* Betrag und Button teilen den Platz gleichmäßig (beide flex: 1); Breite jedes Elements: halbe verfügbare Breite minus halbem Gap */}
                  <input
                    id="betrag"
                    type="number"
                    value={betrag}
                    onChange={(e) => setBetrag(e.target.value)}
                    placeholder="z.B. 50.00"
                    style={{ ...inputControlStyle, borderColor: betrag.trim() ? '#d1d5db' : 'red', flex: 1 }}
                    min="0"
                    step="0.01"
                  />
                  <label htmlFor="rechnung-anhang" style={{ ...uploadButtonStyle, flex: 1 }}>
                    Anhang auswählen
                  </label>
                </div>
                {/* Verstecktes Datei-Input-Element, das vom Label gesteuert wird */}
                <input
                  id="rechnung-anhang"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  onChange={handleAttachmentChange}
                  style={hiddenFileInputStyle}
                />
                <p style={attachmentHintStyle}>
                  Erlaubte Formate: PDF, JPG, PNG, BMP.
                </p>
                {anhang && <p style={selectedFileStyle}>Ausgewählt: {anhang.name}</p>}
              </div>
            )}
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label
              htmlFor="nachricht"
              style={fieldLabelStyle}
            >
              Nachricht
            </label>

            <textarea
              id="nachricht"
              value={nachricht}
              onChange={(e) => setNachricht(e.target.value.slice(0, maxZeichen))}
              maxLength={maxZeichen}
              rows={15}
              placeholder="Bitte schreibe hier deine Nachricht..."
              style={textareaStyle}
            />
          </div>

          <div style={counterTextStyle}>
            {nachricht.length} / {maxZeichen} Zeichen
          </div>

          <button
            type="submit"
            style={submitButtonStyle}
          >
            Absenden
          </button>
        </form>
      </div>
    </div>
  );
}