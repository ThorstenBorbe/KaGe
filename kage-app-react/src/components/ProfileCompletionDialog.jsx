import { useState } from "react";
import { useAuth } from "../context/useAuth";

const REQUIRED = ["geburtsdatum", "strasse", "postleitzahl", "wohnort", "telefonnummer"];

export default function ProfileCompletionDialog() {
  const { saveMitgliedProfil, skipProfileCompletion } = useAuth();
  const [form, setForm] = useState({
    geburtsdatum: "",
    strasse: "",
    postleitzahl: "",
    wohnort: "",
    telefonnummer: "",
    ansprechpartner: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v.trim()]));
    if (REQUIRED.some((key) => !trimmed[key])) {
      setError("Bitte alle Pflichtfelder (*) ausfüllen.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await saveMitgliedProfil(trimmed);
    } catch (err) {
      setError(`Speichern fehlgeschlagen: ${err?.message ?? "Unbekannter Fehler"}`);
    } finally {
      setBusy(false);
    }
  }

  const field = (id, label, key, props = {}, hint) => (
    <div style={{ marginBottom: "14px" }}>
      <label htmlFor={id} style={{ display: "block", marginBottom: "5px", fontSize: "13px", color: "#374151", fontWeight: 600 }}>
        {label}
      </label>
      <input
        id={id}
        value={form[key]}
        onChange={set(key)}
        style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px", boxSizing: "border-box" }}
        {...props}
      />
      {hint && <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "4px" }}>{hint}</div>}
    </div>
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-title"
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", zIndex: 1000 }}
    >
      <form
        onSubmit={handleSubmit}
        style={{ background: "white", borderRadius: "16px", padding: "28px 32px", width: "100%", maxWidth: "480px", maxHeight: "92vh", overflowY: "auto", boxSizing: "border-box", boxShadow: "0 6px 24px rgba(0,0,0,0.25)" }}
      >
        <h2 id="profile-title" style={{ margin: "0 0 8px", color: "#b91c1c", fontSize: "22px", textAlign: "center" }}>
          Bitte vervollständige deine Daten
        </h2>
        <p style={{ margin: "0 0 16px", fontSize: "13px", color: "#000" }}>
          Damit wir deine Daten in der Mitgliederliste speichern und dich erreichen können, trage bitte die folgenden Angaben ein.
        </p>
        {field("pc-geb", "Geburtsdatum *", "geburtsdatum", { type: "date", autoComplete: "bday" })}
        {field("pc-strasse", "Straße *", "strasse", { autoComplete: "street-address" })}
        {field("pc-plz", "Postleitzahl *", "postleitzahl", { autoComplete: "postal-code" })}
        {field("pc-ort", "Wohnort *", "wohnort", { autoComplete: "address-level2" })}
        {field("pc-tel", "Telefonnummer *", "telefonnummer", { type: "tel", autoComplete: "tel" }, "Wichtig für die Kontaktierung.")}
        {field("pc-ansp", "Ansprechpartner bei Notfällen (optional)", "ansprechpartner", { placeholder: "Name und Telefonnummer" })}

        {error && <p style={{ color: "#b91c1c", fontSize: "12px", margin: "0 0 12px" }}>{error}</p>}
        <button
          type="submit"
          disabled={busy}
          style={{ width: "100%", padding: "12px", background: busy ? "#e5e7eb" : "#b91c1c", color: busy ? "#9ca3af" : "white", border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: 700, cursor: busy ? "not-allowed" : "pointer" }}
        >
          {busy ? "Speichern …" : "Speichern"}
        </button>
        <div style={{ textAlign: "center", marginTop: "14px" }}>
          <button
            type="button"
            onClick={skipProfileCompletion}
            style={{ background: "none", border: "none", color: "#b91c1c", fontSize: "12px", cursor: "pointer", textDecoration: "underline" }}
          >
            Später
          </button>
        </div>
      </form>
    </div>
  );
}
