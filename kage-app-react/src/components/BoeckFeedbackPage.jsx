import { useState } from "react";

const pageContainerStyle = {
  padding: "24px",
  paddingBottom: "80px",
};

const formCardStyle = {
  background: "white",
  borderRadius: "16px", // Kartenform: "0px" = eckig, "10px" = neutral, "24px" = weicher
  padding: "24px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
  maxWidth: "800px",
  marginBottom: "60px",
};

const fieldGroupStyle = {
  marginBottom: "20px",
};

const fieldLabelStyle = {
  display: "block",
  marginBottom: "8px",
  fontWeight: "bold",
  fontSize: "18px", // Beschriftungsgroesse; alternativ "16px" kompakter oder "20px" praegnenter
};

const inputControlStyle = {
  width: "100%",
  padding: "12px", // Eingabegroesse: "10px" kompakter, "14px" komfortabler
  borderRadius: "10px", // Feldform: "0px" = eckig, "8px" = Standard, "999px" = pillenartig
  border: "1px solid #d1d5db", // Alternativ dunkler fuer mehr Kontrast oder farbiger Akzent fuer Fokus
  fontSize: "18px",
  boxSizing: "border-box",
};

const textareaStyle = {
  ...inputControlStyle,
  resize: "vertical",
  fontFamily: "Century Gothic, Segoe UI, Roboto, sans-serif",
  boxSizing: "border-box",
};

const counterTextStyle = {
  textAlign: "right",
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
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#f9fafb", // Sekundaerfarbe fuer Upload-Aktion; alternativ weiss oder leicht getoentes Rot
  color: "#111827",
  border: "1px solid #d1d5db",
  borderRadius: "10px", // Buttonform: "4px" = technischer, "10px" = freundlich, "999px" = pillenfoermig
  padding: "12px 16px", // Klickflaeche fuer Desktop und Touch; alternativ "10px 14px" kompakter
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: 600,
};

const hiddenFileInputStyle = {
  display: "none",
};

const selectedFileStyle = {
  marginTop: "10px",
  fontSize: "15px",
  color: "#374151",
};

const submitButtonStyle = {
  background: "#b91c1c", // Primaerfarbe des Buttons; Alternativen z. B. "#111827" oder "#2563eb"
  color: "white",
  border: "none",
  borderRadius: "10px", // Buttonform: "4px" = technisch, "10px" = freundlich, "999px" = pillenfoermig
  padding: "12px 20px", // Hoehe und Breite des Buttons; alternativ "10px 16px" kompakter
  cursor: "pointer",
  fontSize: "18px",
  fontWeight: "bold",
};

export default function BoeckFeedbackPage() {
  const [kategorie, setKategorie] = useState("");
  const [nachricht, setNachricht] = useState("");
  const [anhang, setAnhang] = useState(null);
  const [betrag, setBetrag] = useState("");
  const [betragTouched, setBetragTouched] = useState(false);

  const maxZeichen = 2000;

  const isRechnung = kategorie === "Rechnung";
  const betragInvalid = isRechnung && (betragTouched || betrag === "") && (!betrag || isNaN(Number(betrag)) || Number(betrag) <= 0);

  const handleKategorieChange = (event) => {
    const nextKategorie = event.target.value;
    setKategorie(nextKategorie);

    if (nextKategorie !== "Rechnung") {
      setAnhang(null);
      setBetrag("");
      setBetragTouched(false);
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

    if (isRechnung && (!betrag || isNaN(Number(betrag)) || Number(betrag) <= 0)) {
      setBetragTouched(true);
      alert("Bitte gib einen gültigen Betrag in Euro ein.");
      return;
    }

    if (!nachricht.trim()) {
      alert("Bitte gib eine Nachricht ein.");
      return;
    }

    const attachmentMessage = anhang ? `\nAnhang: ${anhang.name}` : "";
    const betragMessage = isRechnung ? `\nBetrag: ${betrag} €` : "";
    alert(`Deine Nachricht wurde abgesendet.${betragMessage}${attachmentMessage}`);

    setKategorie("");
    setNachricht("");
    setAnhang(null);
    setBetrag("");
    setBetragTouched(false);
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
              <div style={{ display: "flex", gap: 24, alignItems: "flex-end", marginTop: 16 }}>
                <div style={{ flex: 1 }}>
                  <label htmlFor="betrag-euro" style={fieldLabelStyle}>
                    Betrag in € <span style={{ color: "#b91c1c" }}>*</span>
                  </label>
                  <input
                    id="betrag-euro"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={betrag}
                    onChange={e => { setBetrag(e.target.value); setBetragTouched(true); }}
                    onBlur={() => setBetragTouched(true)}
                    placeholder="z. B. 123.45"
                    style={{
                      ...inputControlStyle,
                      width: 170,
                      border: betragInvalid ? "2px solid #b91c1c" : inputControlStyle.border,
                      background: betragInvalid ? "#fff1f2" : undefined,
                    }}
                  />
                  {betragInvalid && (
                    <div style={{ color: "#b91c1c", fontSize: 14, marginTop: 4 }}>
                      Bitte gültigen Betrag eingeben
                    </div>
                  )}
                </div>
                <div>
                  <label htmlFor="rechnung-anhang" style={fieldLabelStyle}>
                    Anhang zur Rechnung
                  </label>
                  <label htmlFor="rechnung-anhang" style={uploadButtonStyle}>
                    Anhang auswählen
                  </label>
                  <input
                    id="rechnung-anhang"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                    onChange={handleAttachmentChange}
                    style={hiddenFileInputStyle}
                  />
                  <p style={attachmentHintStyle}>
                    Erlaubte Formate: PDF, JPG, PNG, BMP
                  </p>
                  {anhang && <p style={selectedFileStyle}>Ausgewählt: {anhang.name}</p>}
                </div>
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