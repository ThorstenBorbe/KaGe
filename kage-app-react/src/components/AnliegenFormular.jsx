import { useState } from "react";

export default function AnliegenFormular() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const maxLength = 400;

  const handleSubmit = async () => {
    if (!message.trim()) {
      alert("Bitte ein Anliegen eingeben.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
      });

      if (response.ok) {
        alert("Anliegen wurde gesendet.");
        setMessage("");
        setOpen(false);
      } else {
        alert("Fehler beim Senden.");
      }
    } catch (error) {
      alert("Server nicht erreichbar.");
    }
  };

  return (
    <div>
      <button onClick={() => setOpen(true)}
      style={{
        padding: "10px 20px",
        fontSize: "16px",
        fontWeight: "bold",
        backgroundColor: "#ef4444",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
      }}

      >Anliegen melden</button>

      {open && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3>Anliegen einreichen</h3>

            <textarea
              value={message}
              maxLength={maxLength}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Bitte hier dein Anliegen eingeben..."
              style={styles.textarea}
            />

            <p>
              {message.length} / {maxLength}
            </p>

            <div style={styles.buttonRow}>
              <button onClick={handleSubmit}>Senden</button>
              <button onClick={() => setOpen(false)}>Abbrechen</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000
  },
  modal: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "12px",
    width: "90%",
    maxWidth: "500px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
  },
  textarea: {
    width: "100%",
    height: "140px",
    marginTop: "10px",
    padding: "10px",
    resize: "none",
    fontSize: "16px",
    boxSizing: "border-box"
  },
  buttonRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "15px"
  }
};