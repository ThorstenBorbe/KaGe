import { useState } from "react";
import { useAuth } from "../context/useAuth";
import kageLogo from "../assets/Logo/KaGe Zell Logo mit Schriftzug.png";

// Nur im Entwicklungsmodus sichtbar
const IS_DEV = import.meta.env.DEV;

const VIEW = { LOGIN: "login", REGISTER: "register", FORGOT: "forgot" };

function withUiTimeout(promise, ms, timeoutMessage) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(timeoutMessage)), ms);
    }),
  ]);
}

export default function LoginPage() {
  const { login, register, resetPassword, devLogin } = useAuth();
  const [view, setView] = useState(VIEW.LOGIN);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPasswords, setShowRegisterPasswords] = useState(false);
  const [message, setMessage] = useState({ text: "", error: false });
  const [busy, setBusy] = useState(false);

  function resetFields() {
    setName(""); setEmail(""); setPassword(""); setPassword2("");
    setShowLoginPassword(false); setShowRegisterPasswords(false);
    setMessage({ text: "", error: false });
  }

  function switchTo(v) { resetFields(); setView(v); }

  async function handleLogin(e) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setMessage({ text: "Bitte E-Mail und Passwort eingeben.", error: true });
      return;
    }
    setBusy(true);
    try {
      await withUiTimeout(
        login(email.trim(), password),
        30000,
        "Anmeldung dauert zu lange (30s). Browser blockiert vermutlich Supabase-Verbindungen."
      );
    } catch (err) {
      console.error("[Login-Fehler] Code:", err.code, "| Message:", err.message);
      setMessage({ text: authError(err), error: true });
    } finally {
      setBusy(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setMessage({ text: "Bitte alle Felder ausfüllen.", error: true });
      return;
    }
    if (password !== password2) {
      setMessage({ text: "Passwörter stimmen nicht überein.", error: true });
      return;
    }
    setBusy(true);
    try {
      await register(name.trim(), email.trim(), password);
    } catch (err) {
      setMessage({ text: authError(err), error: true });
    } finally {
      setBusy(false);
    }
  }

  async function handleForgot(e) {
    e.preventDefault();
    if (!email.trim()) {
      setMessage({ text: "Bitte E-Mail-Adresse eingeben.", error: true });
      return;
    }
    setBusy(true);
    try {
      await resetPassword(email.trim());
      setMessage({ text: "E-Mail zum Zurücksetzen wurde gesendet.", error: false });
    } catch (err) {
      setMessage({ text: authError(err), error: true });
    } finally {
      setBusy(false);
    }
  }

  const titles = {
    [VIEW.LOGIN]: "KaGe Zell – Anmeldung",
    [VIEW.REGISTER]: "KaGe Zell – Registrieren",
    [VIEW.FORGOT]: "Passwort vergessen",
  };

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
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <img
            src={kageLogo}
            alt="KaGe Logo"
            style={{ width: "100px", marginBottom: "12px" }}
          />
          <h2 style={{ margin: 0, color: "#b91c1c", fontSize: "22px" }}>
            {titles[view]}
          </h2>
        </div>

        {/* ── ANMELDUNG ── */}
        {view === VIEW.LOGIN && (
          <form onSubmit={handleLogin}>
            <Field id="login-email" label="E-Mail" type="email" value={email} onChange={setEmail} placeholder="deine@email.de" autoComplete="email" />
            <Field
              id="login-pw"
              label="Passwort"
              type={showLoginPassword ? "text" : "password"}
              value={password}
              onChange={setPassword}
              placeholder="Dein Passwort"
              autoComplete="current-password"
              last
              rightControl={(
                <button
                  type="button"
                  onClick={() => setShowLoginPassword((prev) => !prev)}
                  style={{
                    border: "none",
                    background: "transparent",
                    color: "#6b7280",
                    cursor: "pointer",
                    fontSize: "12px",
                    padding: "0 2px",
                  }}
                  aria-label={showLoginPassword ? "Passwort verbergen" : "Passwort anzeigen"}
                >
                  {showLoginPassword ? "🙈 Verbergen" : "👁 Anzeigen"}
                </button>
              )}
            />
            <Feedback msg={message} />
            <Btn disabled={busy}>{busy ? "…" : "Anmelden"}</Btn>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "14px" }}>
              <LinkBtn onClick={() => switchTo(VIEW.FORGOT)}>Passwort vergessen?</LinkBtn>
              <LinkBtn onClick={() => switchTo(VIEW.REGISTER)}>Registrieren</LinkBtn>
            </div>
          </form>
        )}

        {/* ── REGISTRIEREN ── */}
        {view === VIEW.REGISTER && (
          <form onSubmit={handleRegister}>
            <Field id="reg-name" label="Name" value={name} onChange={setName} placeholder="Dein Name" autoComplete="username" />
            <Field id="reg-email" label="E-Mail" type="email" value={email} onChange={setEmail} placeholder="deine@email.de" autoComplete="email" />
            <Field
              id="reg-pw"
              label="Passwort"
              type={showRegisterPasswords ? "text" : "password"}
              value={password}
              onChange={setPassword}
              placeholder="Passwort wählen"
              autoComplete="new-password"
              rightControl={(
                <button
                  type="button"
                  onClick={() => setShowRegisterPasswords((prev) => !prev)}
                  style={{
                    border: "none",
                    background: "transparent",
                    color: "#6b7280",
                    cursor: "pointer",
                    fontSize: "12px",
                    padding: "0 2px",
                  }}
                  aria-label={showRegisterPasswords ? "Passwörter verbergen" : "Passwörter anzeigen"}
                >
                  {showRegisterPasswords ? "🙈 Verbergen" : "👁 Anzeigen"}
                </button>
              )}
            />
            <Field id="reg-pw2" label="Passwort wiederholen" type={showRegisterPasswords ? "text" : "password"} value={password2} onChange={setPassword2} placeholder="Passwort wiederholen" autoComplete="new-password" last />
            <Feedback msg={message} />
            <Btn disabled={busy}>{busy ? "…" : "Registrieren"}</Btn>
            <div style={{ textAlign: "center", marginTop: "14px" }}>
              <LinkBtn onClick={() => switchTo(VIEW.LOGIN)}>← Zurück zur Anmeldung</LinkBtn>
            </div>
          </form>
        )}

        {/* ── PASSWORT VERGESSEN ── */}
        {view === VIEW.FORGOT && (
          <form onSubmit={handleForgot}>
            <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "16px" }}>
              Gib deine E-Mail-Adresse ein. Du erhältst einen Link zum Zurücksetzen deines Passworts.
            </p>
            <Field id="forgot-email" label="E-Mail" type="email" value={email} onChange={setEmail} placeholder="deine@email.de" autoComplete="email" last />
            <Feedback msg={message} />
            <Btn disabled={busy}>{busy ? "…" : "Link senden"}</Btn>
            <div style={{ textAlign: "center", marginTop: "14px" }}>
              <LinkBtn onClick={() => switchTo(VIEW.LOGIN)}>← Zurück zur Anmeldung</LinkBtn>
            </div>
          </form>
        )}

        {/* ── ENTWICKLER-ANMELDUNG (nur im Entwicklungsmodus) ── */}
        {IS_DEV && (
          <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px dashed #e5e7eb" }}>
            <p style={{ fontSize: "11px", color: "#9ca3af", textAlign: "center", marginBottom: "8px" }}>
              🛠 Entwicklungsmodus
            </p>
            <button
              type="button"
              onClick={devLogin}
              style={{
                width: "100%",
                padding: "9px",
                background: "#f3f4f6",
                color: "#374151",
                border: "1px dashed #9ca3af",
                borderRadius: "8px",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              Als Admin einloggen (ohne Passwort)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Hilfs-Komponenten ──────────────────────────────────────────

function authError(err) {
  const code = err?.code ?? "";
  const message = String(err?.message ?? "").toLowerCase();
  const map = {
    invalid_credentials: "E-Mail oder Passwort falsch.",
    email_exists: "Diese E-Mail ist bereits registriert.",
  };
  if (map[code]) return map[code];
  if (message.includes("invalid login credentials")) return "E-Mail oder Passwort falsch.";
  if (message.includes("email not confirmed")) return "Bitte bestätige zuerst deine E-Mail-Adresse.";
  if (message.includes("already registered") || message.includes("already exists")) return "Diese E-Mail ist bereits registriert.";
  if (message.includes("password should be")) return "Passwort muss mindestens 6 Zeichen haben.";
  if (message.includes("invalid email")) return "Ungültige E-Mail-Adresse.";
  if (message.includes("rate limit")) return "Zu viele Versuche. Bitte später erneut versuchen.";
  if (message.includes("content security policy") || message.includes("script-src") || message.includes("unsafe-eval")) {
    return "Browser-Sicherheitsrichtlinie blockiert Supabase (CSP/script-src). Bitte Tracking-/Sicherheits-Erweiterungen für localhost deaktivieren.";
  }
  return `Ein Fehler ist aufgetreten: ${err?.message ?? "Unbekannter Fehler"}`;
}

function Field({ id, label, type = "text", value, onChange, placeholder, autoComplete, last, rightControl }) {
  return (
    <div style={{ marginBottom: last ? "24px" : "16px" }}>
      <label
        htmlFor={id}
        style={{ display: "block", marginBottom: "6px", fontSize: "13px", color: "#374151", fontWeight: 600 }}
      >
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          style={{
            width: "100%",
            padding: rightControl ? "10px 92px 10px 12px" : "10px 12px",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
            fontSize: "14px",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
        {rightControl && (
          <div
            style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            {rightControl}
          </div>
        )}
      </div>
    </div>
  );
}

function Btn({ children, disabled }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      style={{
        width: "100%",
        padding: "12px",
        background: disabled ? "#e5e7eb" : "#b91c1c",
        color: disabled ? "#9ca3af" : "white",
        border: "none",
        borderRadius: "8px",
        fontSize: "15px",
        fontWeight: 700,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {children}
    </button>
  );
}

function LinkBtn({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: "none",
        border: "none",
        color: "#b91c1c",
        fontSize: "12px",
        cursor: "pointer",
        padding: 0,
        textDecoration: "underline",
      }}
    >
      {children}
    </button>
  );
}

function Feedback({ msg }) {
  if (!msg.text) return null;
  return (
    <p style={{ color: msg.error ? "#b91c1c" : "#16a34a", fontSize: "12px", marginBottom: "12px", marginTop: "-8px" }}>
      {msg.text}
    </p>
  );
}
