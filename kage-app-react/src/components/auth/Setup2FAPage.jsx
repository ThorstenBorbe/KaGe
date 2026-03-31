import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const BRAND_RED = "#b91c1c";

/**
 * Seite, auf der eingeloggte Nutzer TOTP-2FA einrichten können.
 * Erreichbar z.B. über Profil-Einstellungen.
 */
export default function Setup2FAPage() {
  const { enroll2FA, finalize2FA } = useAuth();

  const [step, setStep] = useState("start"); // start | qr | done
  const [totpSecret, setTotpSecret] = useState(null);
  const [qrUrl, setQrUrl] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleStart() {
    setLoading(true);
    setError("");
    try {
      const secret = await enroll2FA();
      setTotpSecret(secret);
      // totpKey enthält die QR-Code URL (otpauth://…)
      setQrUrl(secret.generateQrCodeUrl("KaGe Zell", secret.secretKey));
      setStep("qr");
    } catch (err) {
      setError("Fehler beim Starten der 2FA-Einrichtung.");
    } finally {
      setLoading(false);
    }
  }

  async function handleFinalize(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await finalize2FA(totpSecret, code);
      setStep("done");
    } catch (err) {
      setError("Ungültiger Code. Bitte nochmal versuchen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>Zwei-Faktor-Authentifizierung einrichten</h2>

        {step === "start" && (
          <>
            <p style={styles.text}>
              Mit einer Authenticator-App (z.B. Google Authenticator, Authy)
              kannst du dein Konto zusätzlich absichern.
            </p>
            {error && <p style={styles.error}>{error}</p>}
            <button onClick={handleStart} disabled={loading} style={styles.button}>
              {loading ? "Bitte warten…" : "2FA einrichten"}
            </button>
          </>
        )}

        {step === "qr" && (
          <>
            <p style={styles.text}>
              Scanne diesen QR-Code mit deiner Authenticator-App:
            </p>
            {qrUrl && (
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrUrl)}`}
                alt="QR-Code für 2FA"
                style={{ display: "block", margin: "16px auto", borderRadius: 8 }}
              />
            )}
            <form onSubmit={handleFinalize} style={styles.form}>
              <label style={styles.label}>Code aus der App eingeben</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                required
                placeholder="123456"
                style={styles.input}
                autoComplete="one-time-code"
              />
              {error && <p style={styles.error}>{error}</p>}
              <button type="submit" disabled={loading} style={styles.button}>
                {loading ? "Prüfen…" : "2FA aktivieren"}
              </button>
            </form>
          </>
        )}

        {step === "done" && (
          <p style={{ color: "#16a34a", fontWeight: 600, textAlign: "center" }}>
            ✓ Zwei-Faktor-Authentifizierung ist jetzt aktiv!
          </p>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    padding: "32px 16px",
    maxWidth: 480,
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    background: "white",
    borderRadius: 16,
    padding: "32px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
  },
  title: { color: BRAND_RED, marginBottom: 16, fontSize: 20 },
  text: { color: "#374151", lineHeight: 1.6 },
  form: { display: "flex", flexDirection: "column", gap: 8, marginTop: 12 },
  label: { fontWeight: 600, fontSize: 14, color: "#374151" },
  input: {
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: 8,
    fontSize: 15,
  },
  button: {
    marginTop: 8,
    padding: "11px",
    background: BRAND_RED,
    color: "white",
    border: "none",
    borderRadius: 8,
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
  },
  error: { color: "#dc2626", fontSize: 13 },
};
