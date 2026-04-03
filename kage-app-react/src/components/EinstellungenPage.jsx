import { useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import {
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updateProfile,
} from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../context/AuthContext";

export default function EinstellungenPage() {
  const { currentUser, updateName } = useAuth();
  const user = auth.currentUser;

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
    const cred = EmailAuthProvider.credential(user.email, currentPw);
    await reauthenticateWithCredential(user, cred);
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
      await updateEmail(user, newEmail.trim());
      await updateDoc(doc(db, "users", user.uid), { email: newEmail.trim() });
      setMsg({ text: "E-Mail erfolgreich geändert.", error: false });
      setCurrentPw(""); setNewEmail("");
    } catch (err) {
      setMsg({ text: firebaseError(err.code), error: true });
    } finally { setBusy(false); }
  }

  async function handleTelefon(e) {
    e.preventDefault();
    if (!telefon.trim()) {
      setMsg({ text: "Bitte Telefonnummer eingeben.", error: true }); return;
    }
    setBusy(true);
    try {
      await updateDoc(doc(db, "users", user.uid), { telefon: telefon.trim() });
      await updateProfile(user, { phoneNumber: telefon.trim() });
      setMsg({ text: "Telefonnummer erfolgreich gespeichert.", error: false });
      setTelefon("");
    } catch (err) {
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
      await updatePassword(user, newPw);
      setMsg({ text: "Passwort erfolgreich geändert.", error: false });
      setCurrentPw(""); setNewPw(""); setNewPw2("");
    } catch (err) {
      setMsg({ text: firebaseError(err.code), error: true });
    } finally { setBusy(false); }
  }

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ background: "white", borderRadius: 16, padding: 28, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
        <p style={{ color: "#6b7280", fontSize: 18, marginTop: 0 }}>
          Angemeldet als: <strong>{user?.email}</strong>
        </p>

        {/* Kacheln */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <SettingsCard
            title="Name ändern"
            desc="Lege deinen Vor- und Nachnamen fest"
            open={section === "name"}
            onToggle={() => open(section === "name" ? null : "name")}
          >
            <form onSubmit={handleName}>
              <Field id="s-vorname" label="Vorname" value={vorname} onChange={setVorname} />
              <Field id="s-nachname" label="Nachname" value={nachname} onChange={setNachname} last />
              <Feedback msg={msg} />
              <Btn busy={busy}>Speichern</Btn>
            </form>
          </SettingsCard>
          <SettingsCard
            title="E-Mail-Adresse ändern"
            desc="Ändere deine Anmelde-E-Mail"
            open={section === "email"}
            onToggle={() => open(section === "email" ? null : "email")}
          >
            <form onSubmit={handleEmail}>
              <Field id="s-email-cur-pw" label="Aktuelles Passwort" type="password" value={currentPw} onChange={setCurrentPw} />
              <Field id="s-new-email" label="Neue E-Mail-Adresse" type="email" value={newEmail} onChange={setNewEmail} last />
              <Feedback msg={msg} />
              <Btn busy={busy}>Speichern</Btn>
            </form>
          </SettingsCard>

          <SettingsCard
            title="Telefonnummer ändern"
            desc="Hinterlege oder aktualisiere deine Nummer"
            open={section === "telefon"}
            onToggle={() => open(section === "telefon" ? null : "telefon")}
          >
            <form onSubmit={handleTelefon}>
              <Field id="s-tel" label="Telefonnummer" type="tel" value={telefon} onChange={setTelefon} placeholder="+49 123 456789" last />
              <Feedback msg={msg} />
              <Btn busy={busy}>Speichern</Btn>
            </form>
          </SettingsCard>

          <SettingsCard
            title="Passwort ändern"
            desc="Lege ein neues Passwort fest"
            open={section === "passwort"}
            onToggle={() => open(section === "passwort" ? null : "passwort")}
          >
            <form onSubmit={handlePasswort}>
              <Field id="s-cur-pw" label="Aktuelles Passwort" type="password" value={currentPw} onChange={setCurrentPw} />
              <Field id="s-new-pw" label="Neues Passwort" type="password" value={newPw} onChange={setNewPw} />
              <Field id="s-new-pw2" label="Neues Passwort wiederholen" type="password" value={newPw2} onChange={setNewPw2} last />
              <Feedback msg={msg} />
              <Btn busy={busy}>Speichern</Btn>
            </form>
          </SettingsCard>
        </div>
      </div>
    </div>
  );
}

// ── Hilfs-Komponenten ──────────────────────────────

function SettingsCard({ title, desc, open, onToggle, children }) {
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden" }}>
      <button
        type="button"
        onClick={onToggle}
        style={{
          width: "100%", padding: "14px 16px", background: open ? "#fef2f2" : "white",
          border: "none", textAlign: "left", cursor: "pointer",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}
      >
        <div>
          <div style={{ fontWeight: 600, fontSize: 18, color: "#111827" }}>{title}</div>
          <div style={{ fontSize: 18, color: "#6b7280", marginTop: 2 }}>{desc}</div>
        </div>
        <span style={{ color: "#b91c1c", fontSize: 18 }}>{open ? "▴" : "▾"}</span>
      </button>
      {open && (
        <div style={{ padding: "16px", borderTop: "1px solid #f3f4f6", background: "#fafafa" }}>
          {children}
        </div>
      )}
    </div>
  );
}

function Field({ id, label, type = "text", value, onChange, placeholder, last }) {
  return (
    <div style={{ marginBottom: last ? "16px" : "12px" }}>
      <label htmlFor={id} style={{ display: "block", marginBottom: 5, fontSize: 18, color: "#374151", fontWeight: 600 }}>
        {label}
      </label>
      <input
        id={id} type={type} value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? ""}
        style={{
          width: "100%", padding: "9px 11px", borderRadius: 7,
          border: "1px solid #d1d5db", fontSize: 18, outline: "none", boxSizing: "border-box",
        }}
      />
    </div>
  );
}

function Btn({ children, busy }) {
  return (
    <button
      type="submit"
      disabled={busy}
      style={{
        padding: "9px 20px", background: busy ? "#e5e7eb" : "#b91c1c",
        color: busy ? "#9ca3af" : "white", border: "none", borderRadius: 7,
        fontSize: 18, fontWeight: 700, cursor: busy ? "not-allowed" : "pointer",
      }}
    >
      {busy ? "…" : children}
    </button>
  );
}

function Feedback({ msg }) {
  if (!msg.text) return null;
  return (
    <p style={{ color: msg.error ? "#b91c1c" : "#16a34a", fontSize: 18, marginBottom: 10, marginTop: -4 }}>
      {msg.text}
    </p>
  );
}

function firebaseError(code) {
  const map = {
    "auth/wrong-password": "Aktuelles Passwort falsch.",
    "auth/invalid-credential": "Aktuelles Passwort falsch.",
    "auth/email-already-in-use": "Diese E-Mail wird bereits verwendet.",
    "auth/invalid-email": "Ungültige E-Mail-Adresse.",
    "auth/requires-recent-login": "Bitte erneut anmelden und dann nochmal versuchen.",
    "auth/too-many-requests": "Zu viele Versuche. Bitte später erneut versuchen.",
  };
  return map[code] ?? "Ein Fehler ist aufgetreten.";
}
