import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { useAuth } from "../../context/AuthContext";

const BRAND_RED = "#b91c1c";

export default function LoginPage() {
  const { login, resolve2FA, devLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [totpCode, setTotpCode] = useState("");
  const [mfaError, setMfaError] = useState(null); // gespeicherter MFA-Fehler
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  async function handleReset() {
    if (!email) {
      setError("Bitte zuerst die E-Mail-Adresse eingeben.");
      return;
    }
    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
      setError("");
    } catch (err) {
      setError("Reset fehlgeschlagen. Ist die E-Mail-Adresse korrekt?");
    } finally {
      setResetLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      if (err.code === "auth/multi-factor-auth-required") {
        // 2FA erforderlich → Code-Eingabe anzeigen
        setMfaError(err);
      } else {
        setError(mapError(err.code));
      }
    } finally {
      setLoading(false);
    }
  }

  async function handle2FA(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await resolve2FA(mfaError, totpCode);
      navigate("/");
    } catch (err) {
      setError("Ungültiger 2FA-Code. Bitte erneut versuchen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <img
          src="https://www.tgzell.de/images/abteilungen/kage/kagezell.png"
          alt="KaGe Logo"
          style={{ width: 100, margin: "0 auto 16px", display: "block" }}
        />
        <h2 style={styles.title}>KaGe Zell — Login</h2>

        {/* ── Schritt 1: E-Mail + Passwort ── */}
        {!mfaError && (
          <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.label}>E-Mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
              autoComplete="email"
            />

            <label style={styles.label}>Passwort</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ ...styles.input, width: "100%", boxSizing: "border-box", paddingRight: 40 }}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={styles.eyeBtn}
                tabIndex={-1}
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>

            {error && <p style={styles.error}>{error}</p>}
            {resetSent && (
              <p style={{ color: "#16a34a", fontSize: 13, margin: "4px 0 0" }}>
                ✓ Reset-E-Mail wurde gesendet. Bitte prüfe dein Postfach.
              </p>
            )}

            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? "Anmelden…" : "Anmelden"}
            </button>

            <p style={styles.hint}>
              Noch kein Konto?{" "}
              <Link to="/registrierung" style={styles.link}>
                Jetzt registrieren
              </Link>
            </p>
            <p style={{ ...styles.hint, marginTop: 4 }}>
              <button
                type="button"
                onClick={handleReset}
                disabled={resetLoading}
                style={{ background: "none", border: "none", color: BRAND_RED, cursor: "pointer", fontSize: 13, padding: 0, fontWeight: 600 }}
              >
                {resetLoading ? "Wird gesendet…" : "Passwort vergessen?"}
              </button>
            </p>

            {/* Nur sichtbar im lokalen Dev-Modus (npm run dev) */}
            {import.meta.env.DEV && (
              <button
                type="button"
                onClick={async () => { await devLogin(); navigate("/"); }}
                style={{
                  ...styles.button,
                  marginTop: 4,
                  background: "#374151",
                  fontSize: 13,
                }}
              >
                🛠 Entwickler-Zugang (nur lokal)
              </button>
            )}
          </form>
        )}

        {/* ── Schritt 2: 2FA-Code ── */}
        {mfaError && (
          <form onSubmit={handle2FA} style={styles.form}>
            <p style={{ color: "#374151", marginBottom: 12 }}>
              Bitte gib den 6-stelligen Code aus deiner Authenticator-App ein.
            </p>
            <label style={styles.label}>Zwei-Faktor-Code</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={totpCode}
              onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
              required
              style={styles.input}
              autoComplete="one-time-code"
              placeholder="123456"
            />
            {error && <p style={styles.error}>{error}</p>}
            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? "Prüfen…" : "Code bestätigen"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function mapError(code) {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "E-Mail oder Passwort falsch.";
    case "auth/too-many-requests":
      return "Zu viele Versuche. Bitte später erneut versuchen.";
    case "auth/user-disabled":
      return "Dieses Konto wurde deaktiviert.";
    default:
      return "Anmeldung fehlgeschlagen. Bitte erneut versuchen.";
  }
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f3f4f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    background: "white",
    borderRadius: 16,
    padding: "40px 32px",
    width: "100%",
    maxWidth: 400,
    boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
  },
  title: {
    textAlign: "center",
    color: BRAND_RED,
    marginBottom: 24,
    fontSize: 22,
  },
  form: { display: "flex", flexDirection: "column", gap: 8 },
  label: { fontWeight: 600, fontSize: 14, color: "#374151" },
  input: {
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: 8,
    fontSize: 15,
    outline: "none",
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
  error: { color: "#dc2626", fontSize: 13, margin: "4px 0 0" },
  hint: { textAlign: "center", fontSize: 13, color: "#6b7280", marginTop: 12 },
  link: { color: BRAND_RED, fontWeight: 600 },
  eyeBtn: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 16,
    padding: 0,
    lineHeight: 1,
  },
};
