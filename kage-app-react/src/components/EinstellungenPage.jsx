import { useState } from "react";
import { supabase } from "../supabase/supabaseConfig";
import { useAuth } from "../context/useAuth";
import { useIsMobile } from "../hooks/useIsMobile";

export default function EinstellungenPage() {
  const isMobile = useIsMobile(960);
  const { currentUser, updateName } = useAuth();
  const user = currentUser;

  const [section, setSection] = useState(null); // "name" | "email" | "telefon" | "passwort"

  // Felder
  const [currentPw, setCurrentPw] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [telefon, setTelefon] = useState("");
  const [newPw, setNewPw] = useState("");
  const [newPw2, setNewPw2] = useState("");
  const [vorname, setVorname] = useState(currentUser?.vorname ?? "");
  const [nachname, setNachname] = useState(currentUser?.nachname ?? "");

  const [msg, setMsg] = useState({ text: "", error: false });
  const [busy, setBusy] = useState(false);

  function reset() {
    setCurrentPw(""); setNewEmail(""); setTelefon("");
    setNewPw(""); setNewPw2("");
    setMsg({ text: "", error: false });
  }

  function open(s) { reset(); setSection(s); }

  async function reauth() {
    const { error } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPw,
    });
    if (error) throw error;
  }

  async function handleName(e) {
    e.preventDefault();
    if (!vorname.trim()) {
      setMsg({ text: "Bitte mindestens den Vornamen eingeben.", error: true }); return;
    }
    setBusy(true);
    try {
      await updateName(vorname.trim(), nachname.trim());
      setMsg({ text: "Name erfolgreich gespeichert.", error: false });
    } catch {
      setMsg({ text: "Fehler beim Speichern des Namens.", error: true });
    } finally { setBusy(false); }
  }

  async function handleEmail(e) {
    e.preventDefault();
    if (!newEmail.trim() || !currentPw.trim()) {
      setMsg({ text: "Bitte alle Felder ausfüllen.", error: true }); return;
    }
    setBusy(true);
    try {
      await reauth();
      const { error: authError } = await supabase.auth.updateUser({ email: newEmail.trim() });
      if (authError) throw authError;

      const { error: profileError } = await supabase
        .from("users")
        .update({ email: newEmail.trim() })
        .eq("id", user.uid);
      if (profileError) throw profileError;

      setMsg({ text: "E-Mail-Änderung gestartet. Bitte Postfach bestätigen.", error: false });
      setCurrentPw(""); setNewEmail("");
    } catch (err) {
      setMsg({ text: supabaseAuthError(err), error: true });
    } finally { setBusy(false); }
  }

  async function handleTelefon(e) {
    e.preventDefault();
    if (!telefon.trim()) {
      setMsg({ text: "Bitte Telefonnummer eingeben.", error: true }); return;
    }
    setBusy(true);
    try {
      const { error } = await supabase
        .from("users")
        .update({ telefon: telefon.trim() })
        .eq("id", user.uid);
      if (error) throw error;
      setMsg({ text: "Telefonnummer erfolgreich gespeichert.", error: false });
      setTelefon("");
    } catch {
      setMsg({ text: "Fehler beim Speichern.", error: true });
    } finally { setBusy(false); }
  }

  async function handlePasswort(e) {
    e.preventDefault();
    if (!currentPw.trim() || !newPw.trim()) {
      setMsg({ text: "Bitte alle Felder ausfüllen.", error: true }); return;
    }
    if (newPw !== newPw2) {
      setMsg({ text: "Neue Passwörter stimmen nicht überein.", error: true }); return;
    }
    if (newPw.length < 6) {
      setMsg({ text: "Passwort muss mindestens 6 Zeichen haben.", error: true }); return;
    }
    setBusy(true);
    try {
      await reauth();
      const { error } = await supabase.auth.updateUser({ password: newPw });
      if (error) throw error;
      setMsg({ text: "Passwort erfolgreich geändert.", error: false });
      setCurrentPw(""); setNewPw(""); setNewPw2("");
    } catch (err) {
      setMsg({ text: supabaseAuthError(err), error: true });
    } finally { setBusy(false); }
  }

  return (
    <div style={{ padding: isMobile ? "12px" : "24px" }}>
      <div style={{ background: "white", borderRadius: 16, padding: isMobile ? 14 : 28, boxShadow: "0 4px 12px rgba(0,0,0,0.08)", marginBottom: "60px" }}>
        <p style={{ color: "#6b7280", fontSize: isMobile ? 14 : 18, marginTop: 0 }}>
          Angemeldet als: <strong>{user?.email}</strong>
        </p>

        {/* Kacheln */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <SettingsCard
            title="Name ändern"
            desc="Lege deinen Vor- und Nachnamen fest"
            open={section === "name"}
            onToggle={() => open(section === "name" ? null : "name")}
            isMobile={isMobile}
          >
            <form onSubmit={handleName}>
              <Field id="s-vorname" label="Vorname" value={vorname} onChange={setVorname} isMobile={isMobile} />
              <Field id="s-nachname" label="Nachname" value={nachname} onChange={setNachname} last isMobile={isMobile} />
              <Feedback msg={msg} isMobile={isMobile} />
              <Btn busy={busy} isMobile={isMobile}>Speichern</Btn>
            </form>
          </SettingsCard>
          <SettingsCard
            title="E-Mail-Adresse ändern"
            desc="Ändere deine Anmelde-E-Mail"
            open={section === "email"}
            onToggle={() => open(section === "email" ? null : "email")}
            isMobile={isMobile}
          >
            <form onSubmit={handleEmail}>
              <Field id="s-email-cur-pw" label="Aktuelles Passwort" type="password" value={currentPw} onChange={setCurrentPw} isMobile={isMobile} />
              <Field id="s-new-email" label="Neue E-Mail-Adresse" type="email" value={newEmail} onChange={setNewEmail} last isMobile={isMobile} />
              <Feedback msg={msg} isMobile={isMobile} />
              <Btn busy={busy} isMobile={isMobile}>Speichern</Btn>
            </form>
          </SettingsCard>

          <SettingsCard
            title="Telefonnummer ändern"
            desc="Hinterlege oder aktualisiere deine Nummer"
            open={section === "telefon"}
            onToggle={() => open(section === "telefon" ? null : "telefon")}
            isMobile={isMobile}
          >
            <form onSubmit={handleTelefon}>
              <Field id="s-tel" label="Telefonnummer" type="tel" value={telefon} onChange={setTelefon} placeholder="+49 123 456789" last isMobile={isMobile} />
              <Feedback msg={msg} isMobile={isMobile} />
              <Btn busy={busy} isMobile={isMobile}>Speichern</Btn>
            </form>
          </SettingsCard>

          <SettingsCard
            title="Passwort ändern"
            desc="Lege ein neues Passwort fest"
            open={section === "passwort"}
            onToggle={() => open(section === "passwort" ? null : "passwort")}
            isMobile={isMobile}
          >
            <form onSubmit={handlePasswort}>
              <Field id="s-cur-pw" label="Aktuelles Passwort" type="password" value={currentPw} onChange={setCurrentPw} isMobile={isMobile} />
              <Field id="s-new-pw" label="Neues Passwort" type="password" value={newPw} onChange={setNewPw} isMobile={isMobile} />
              <Field id="s-new-pw2" label="Neues Passwort wiederholen" type="password" value={newPw2} onChange={setNewPw2} last isMobile={isMobile} />
              <Feedback msg={msg} isMobile={isMobile} />
              <Btn busy={busy} isMobile={isMobile}>Speichern</Btn>
            </form>
          </SettingsCard>
        </div>
      </div>
    </div>
  );
}

// ── Hilfs-Komponenten ──────────────────────────────

function SettingsCard({ title, desc, open, onToggle, children, isMobile }) {
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden" }}>
      <button
        type="button"
        onClick={onToggle}
        style={{
          width: "100%", padding: isMobile ? "11px 12px" : "14px 16px", background: open ? "#fef2f2" : "white", // Aufgeklapptes Hellrot als dezente Rueckmeldung; alternativ neutrales Grau
          border: "none", textAlign: "left", cursor: "pointer",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}
      >
        <div>
          <div style={{ fontWeight: 600, fontSize: isMobile ? 15 : 18, color: "#111827" }}>{title}</div>
          <div style={{ fontSize: isMobile ? 13 : 18, color: "#6b7280", marginTop: 2 }}>{desc}</div>
        </div>
        <span style={{ color: "#b91c1c", fontSize: isMobile ? 16 : 18 }}>{open ? "▴" : "▾"}</span>
      </button>
      {open && (
        <div style={{ padding: isMobile ? "12px" : "16px", borderTop: "1px solid #f3f4f6", background: "#fafafa" }}>
          {children}
        </div>
      )}
    </div>
  );
}

function Field({ id, label, type = "text", value, onChange, placeholder, last, isMobile }) {
  return (
    <div style={{ marginBottom: last ? "16px" : "12px" }}>
      <label htmlFor={id} style={{ display: "block", marginBottom: 5, fontSize: isMobile ? 14 : 18, color: "#374151", fontWeight: 600 }}>
        {label}
      </label>
      <input
        id={id} type={type} value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? ""}
        style={{
          width: "100%", padding: isMobile ? "8px 10px" : "9px 11px", borderRadius: 7, // Feldform: 0 = kantig, 7 = unaufdringlich, 14 = weicher
          border: "1px solid #d1d5db", fontSize: isMobile ? 14 : 18, outline: "none", boxSizing: "border-box",
        }}
      />
    </div>
  );
}

function Btn({ children, busy, isMobile }) {
  return (
    <button
      type="submit"
      disabled={busy}
      style={{
        padding: isMobile ? "8px 14px" : "9px 20px", background: busy ? "#e5e7eb" : "#b91c1c", // Rot = Primaeraktion; Grau = deaktiviert
        color: busy ? "#9ca3af" : "white", border: "none", borderRadius: 7, // Schaltflaechenform: 4 = sachlicher, 7 = Standard, 999 = pillenartig
        fontSize: isMobile ? 14 : 18, fontWeight: 700, cursor: busy ? "not-allowed" : "pointer",
      }}
    >
      {busy ? "…" : children}
    </button>
  );
}

function Feedback({ msg, isMobile }) {
  if (!msg.text) return null;
  return (
    <p style={{ color: msg.error ? "#b91c1c" : "#16a34a", fontSize: isMobile ? 13 : 18, marginBottom: 10, marginTop: -4 }}>
      {msg.text}
    </p>
  );
}

function supabaseAuthError(err) {
  const code = err?.code ?? "";
  const message = String(err?.message ?? "").toLowerCase();
  const map = {
    invalid_credentials: "Aktuelles Passwort falsch.",
    email_exists: "Diese E-Mail wird bereits verwendet.",
  };
  if (map[code]) return map[code];
  if (message.includes("invalid login credentials")) return "Aktuelles Passwort falsch.";
  if (message.includes("password should be")) return "Passwort muss mindestens 6 Zeichen haben.";
  if (message.includes("already registered") || message.includes("already exists")) return "Diese E-Mail wird bereits verwendet.";
  if (message.includes("invalid email")) return "Ungültige E-Mail-Adresse.";
  if (message.includes("rate limit")) return "Zu viele Versuche. Bitte später erneut versuchen.";
  return "Ein Fehler ist aufgetreten.";
}
