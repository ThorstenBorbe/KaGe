import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const BRAND_RED = "#b91c1c";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      return setError("Das Passwort muss mindestens 8 Zeichen lang sein.");
    }
    if (password !== confirm) {
      return setError("Die Passwörter stimmen nicht überein.");
    }

    setLoading(true);
    try {
      await register(email, password);
      setSuccess(true);
    } catch (err) {
      setError(mapError(err.code));
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <img
            src="https://www.tgzell.de/images/abteilungen/kage/kagezell.png"
            alt="KaGe Logo"
            style={{ width: 100, margin: "0 auto 16px", display: "block" }}
          />
          <h2 style={{ ...styles.title, color: "#16a34a" }}>Registrierung erfolgreich!</h2>
          <p style={{ color: "#374151", textAlign: "center", lineHeight: 1.6 }}>
            Dein Konto wurde erstellt. Ein Administrator wird dir die passende Rolle zuweisen.
          </p>
          <button
            onClick={() => navigate("/login")}
            style={{ ...styles.button, marginTop: 24 }}
          >
            Zum Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <img
          src="https://www.tgzell.de/images/abteilungen/kage/kagezell.png"
          alt="KaGe Logo"
          style={{ width: 100, margin: "0 auto 16px", display: "block" }}
        />
        <h2 style={styles.title}>Neues Konto erstellen</h2>

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

          <label style={styles.label}>Passwort (min. 8 Zeichen)</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ ...styles.input, width: "100%", boxSizing: "border-box", paddingRight: 40 }}
              autoComplete="new-password"
            />
            <button type="button" onClick={() => setShowPassword((v) => !v)} style={styles.eyeBtn} tabIndex={-1}>
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>

          <label style={styles.label}>Passwort bestätigen</label>
          <div style={{ position: "relative" }}>
            <input
              type={showConfirm ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              style={{ ...styles.input, width: "100%", boxSizing: "border-box", paddingRight: 40 }}
              autoComplete="new-password"
            />
            <button type="button" onClick={() => setShowConfirm((v) => !v)} style={styles.eyeBtn} tabIndex={-1}>
              {showConfirm ? "🙈" : "👁"}
            </button>
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Registrieren…" : "Registrieren"}
          </button>

          <p style={styles.hint}>
            Bereits ein Konto?{" "}
            <Link to="/login" style={styles.link}>
              Zum Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

function mapError(code) {
  switch (code) {
    case "auth/email-already-in-use":
      return "Diese E-Mail-Adresse ist bereits registriert.";
    case "auth/invalid-email":
      return "Ungültige E-Mail-Adresse.";
    case "auth/weak-password":
      return "Das Passwort ist zu schwach.";
    default:
      return "Registrierung fehlgeschlagen. Bitte erneut versuchen.";
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
    width: "100%",
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
