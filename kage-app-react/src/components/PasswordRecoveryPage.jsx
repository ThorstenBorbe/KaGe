import { useState } from "react";
import { useAuth } from "../context/useAuth";

export default function PasswordRecoveryPage() {
  const { updateRecoveredPassword, finishPasswordRecovery } = useAuth();
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [message, setMessage] = useState({ text: "", error: false });
  const [busy, setBusy] = useState(false);
  const [updated, setUpdated] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (password.length < 6) {
      setMessage({ text: "Das Passwort muss mindestens 6 Zeichen haben.", error: true });
      return;
    }
    if (password !== passwordAgain) {
      setMessage({ text: "Die Passwörter stimmen nicht überein.", error: true });
      return;
    }

    setBusy(true);
    try {
      await updateRecoveredPassword(password);
      setUpdated(true);
      setMessage({ text: "Dein Passwort wurde erfolgreich geändert.", error: false });
    } catch (error) {
      setMessage({
        text: `Passwort konnte nicht geändert werden: ${error?.message ?? "Unbekannter Fehler"}`,
        error: true,
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#b91c1c",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "40px 48px",
          boxShadow: "0 6px 24px rgba(0,0,0,0.12)",
          width: "100%",
          maxWidth: "380px",
          boxSizing: "border-box",
        }}
      >
        <h2 style={{ margin: "0 0 24px", color: "#b91c1c", fontSize: "22px", textAlign: "center" }}>
          Neues Passwort festlegen
        </h2>
        {!updated ? (
          <form onSubmit={handleSubmit}>
            <PasswordField id="recovery-password" label="Neues Passwort" value={password} onChange={setPassword} />
            <PasswordField id="recovery-password-again" label="Passwort wiederholen" value={passwordAgain} onChange={setPasswordAgain} />
            <Feedback message={message} />
            <button type="submit" disabled={busy} style={buttonStyle(busy)}>
              {busy ? "…" : "Passwort speichern"}
            </button>
          </form>
        ) : (
          <>
            <Feedback message={message} />
            <button type="button" onClick={finishPasswordRecovery} style={buttonStyle(false)}>
              Zur App
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function PasswordField({ id, label, value, onChange }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label htmlFor={id} style={{ display: "block", marginBottom: "6px", fontSize: "13px", color: "#374151", fontWeight: 600 }}>
        {label}
      </label>
      <input
        id={id}
        type="password"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete="new-password"
        required
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: "8px",
          border: "1px solid #d1d5db",
          fontSize: "14px",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

function Feedback({ message }) {
  if (!message.text) return null;
  return (
    <p style={{ color: message.error ? "#b91c1c" : "#16a34a", fontSize: "13px", marginBottom: "12px" }}>
      {message.text}
    </p>
  );
}

function buttonStyle(disabled) {
  return {
    width: "100%",
    padding: "12px",
    background: disabled ? "#e5e7eb" : "#b91c1c",
    color: disabled ? "#9ca3af" : "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: 700,
    cursor: disabled ? "not-allowed" : "pointer",
  };
}
