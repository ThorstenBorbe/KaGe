import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { MITGLIEDER_GRUPPEN } from "../config/mitgliederGruppen";

const EMPTY_FORM = {
  vorname: "",
  nachname: "",
  email: "",
};

function registerError(err) {
  const message = String(err?.message ?? "").toLowerCase();
  if (message.includes("already registered") || message.includes("already exists")) return "Diese E-Mail ist bereits registriert.";
  if (message.includes("password should be")) return "Passwort muss mindestens 6 Zeichen haben.";
  if (message.includes("invalid email") || message.includes("unable to validate email")) return "Ungültige E-Mail-Adresse.";
  if (message.includes("rate limit")) return "Zu viele Versuche. Bitte später erneut versuchen.";
  return `Ein Fehler ist aufgetreten: ${err?.message ?? "Unbekannter Fehler"}`;
}

export default function RegisterDialog({ onClose }) {
  const { register } = useAuth();
  const [form, setForm] = useState(EMPTY_FORM);
  const [gruppen, setGruppen] = useState({});
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [message, setMessage] = useState({ text: "", error: false });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const set = (key) => (value) => setForm((prev) => ({ ...prev, [key]: value }));

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v.trim()]));
    const required = ["vorname", "nachname", "email"];
    if (required.some((key) => !trimmed[key]) || !password) {
      setMessage({ text: "Bitte alle Pflichtfelder (*) ausfüllen.", error: true });
      return;
    }
    if (password !== password2) {
      setMessage({ text: "Passwörter stimmen nicht überein.", error: true });
      return;
    }
    setBusy(true);
    try {
      const result = await register({ ...trimmed, gruppen }, password);
      setDone(true);
      setMessage({
        text: (result.confirmationRequired
          ? "Registrierung erfolgreich. Bitte bestätige deine E-Mail-Adresse über den zugesandten Link. Schau auch im Spam-Ordner nach, falls die Bestätigungsmail nicht im Posteingang ankommt. "
          : "Registrierung erfolgreich. ")
          + "Anschließend muss dein Zugang noch von einem Administrator freigegeben werden.",
        error: false,
      });
    } catch (err) {
      setMessage({ text: registerError(err), error: true });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="register-title"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "28px 32px",
          width: "100%",
          maxWidth: "480px",
          maxHeight: "92vh",
          overflowY: "auto",
          boxSizing: "border-box",
          boxShadow: "0 6px 24px rgba(0,0,0,0.25)",
        }}
      >
        <h2 id="register-title" style={{ margin: "0 0 16px", color: "#b91c1c", fontSize: "22px", textAlign: "center" }}>
          KaGe Zell – Registrieren
        </h2>

        {done ? (
          <>
            <p style={{ color: "#000", fontSize: "14px" }}>{message.text}</p>
            <button type="button" onClick={onClose} style={buttonStyle(false)}>Schließen</button>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <Field id="reg-vorname" label="Vorname *" value={form.vorname} onChange={set("vorname")} autoComplete="given-name" />
            <Field id="reg-nachname" label="Nachname *" value={form.nachname} onChange={set("nachname")} autoComplete="family-name" />
            <Field id="reg-email" label="E-Mail-Adresse *" type="email" value={form.email} onChange={set("email")} autoComplete="email" hint="Du erhältst eine Bestätigungsmail. Schau bitte auch im Spam-Ordner nach." />
            <fieldset style={{ border: "1px solid #e5e7eb", borderRadius: "8px", margin: "0 0 14px", padding: "10px 12px" }}>
              <legend style={{ fontSize: "13px", fontWeight: 600, color: "#374151", padding: "0 6px" }}>
                In welcher Gruppe bist du aktiv ?
              </legend>
              {MITGLIEDER_GRUPPEN.map((g) => (
                <label key={g.column} style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "14px", padding: "3px 0" }}>
                  <input
                    type="checkbox"
                    checked={Boolean(gruppen[g.column])}
                    onChange={(e) => setGruppen((prev) => ({ ...prev, [g.column]: e.target.checked }))}
                  />
                  {g.label}
                </label>
              ))}
            </fieldset>
            <Field id="reg-pw" label="Passwort *" type={showPasswords ? "text" : "password"} value={password} onChange={setPassword} autoComplete="new-password" />
            <Field id="reg-pw2" label="Passwort wiederholen *" type={showPasswords ? "text" : "password"} value={password2} onChange={setPassword2} autoComplete="new-password" />
            <label style={{ display: "flex", gap: "6px", alignItems: "center", fontSize: "12px", color: "#6b7280", marginBottom: "14px" }}>
              <input type="checkbox" checked={showPasswords} onChange={(e) => setShowPasswords(e.target.checked)} />
              Passwörter anzeigen
            </label>

            {message.text && (
              <p style={{ color: message.error ? "#b91c1c" : "#000", fontSize: "12px", margin: "0 0 12px" }}>{message.text}</p>
            )}
            <button type="submit" disabled={busy} style={buttonStyle(busy)}>{busy ? "…" : "Registrieren"}</button>
            <div style={{ textAlign: "center", marginTop: "14px" }}>
              <button
                type="button"
                onClick={onClose}
                style={{ background: "none", border: "none", color: "#b91c1c", fontSize: "12px", cursor: "pointer", textDecoration: "underline" }}
              >
                Abbrechen
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ id, label, type = "text", value, onChange, placeholder, autoComplete, hint }) {
  return (
    <div style={{ marginBottom: "14px" }}>
      <label htmlFor={id} style={{ display: "block", marginBottom: "5px", fontSize: "13px", color: "#374151", fontWeight: 600 }}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        style={{
          width: "100%",
          padding: "9px 12px",
          borderRadius: "8px",
          border: "1px solid #d1d5db",
          fontSize: "14px",
          boxSizing: "border-box",
        }}
      />
      {hint && <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "4px" }}>{hint}</div>}
    </div>
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
