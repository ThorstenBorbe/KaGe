import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseConfig";
import { useIsMobile } from "../hooks/useIsMobile";

const BRAND_RED = "#b91c1c";
const ROLES = ["mitglied", "trainer", "vorstand", "admin", "gesperrt"];

const ROLE_COLORS = {
  pending: "#f97316",
  gast: "#9ca3af",
  mitglied: "#3b82f6",
  trainer: "#22c55e",
  vorstand: "#f59e0b",
  admin: "#dc2626",
  gesperrt: "#111827",
};

export default function AdminPage() {
  const isMobile = useIsMobile(960);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null); // uid der gerade gespeichert wird
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editorVorname, setEditorVorname] = useState("");
  const [editorNachname, setEditorNachname] = useState("");
  const [editorEmail, setEditorEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  function getDisplayName(user) {
    const fullName = [user?.vorname, user?.nachname]
      .map((value) => String(value ?? "").trim())
      .filter(Boolean)
      .join(" ");

    if (fullName) return fullName;

    const profileName = String(user?.name ?? "").trim();
    if (profileName) return profileName;

    const email = String(user?.email ?? "").trim();
    if (email) return email.split("@")[0];

    return "Unbekannt";
  }

  function getDisplaySubline(user) {
    const email = String(user?.email ?? "").trim();
    return email || "Keine E-Mail hinterlegt";
  }

  async function loadUsers() {
    setLoading(true);
    setError("");
    const { data, error: loadError } = await supabase
      .from("users")
      .select("*")
      .order("email", { ascending: true });

    if (loadError) {
      setError(`Nutzer konnten nicht geladen werden: ${loadError.message}`);
      setUsers([]);
      setLoading(false);
      return;
    }

    const list = (data ?? []).map((row) => ({ uid: row.id, ...row }));
    list.sort((a, b) => (a.email ?? "").localeCompare(b.email ?? ""));
    setUsers(list);
    setLoading(false);
  }

  async function changeRole(uid, newRole) {
    setSaving(uid);
    const { error: updateError } = await supabase
      .from("users")
      .update({ role: newRole })
      .eq("id", uid);

    if (updateError) {
      setError("Rolle konnte nicht gespeichert werden.");
      setSaving(null);
      return;
    }

    setUsers((prev) =>
      prev.map((u) => (u.uid === uid ? { ...u, role: newRole } : u))
    );
    setSaving(null);
  }

  function openEditor(user) {
    setEditingUser(user);
    setEditorVorname(user?.vorname ?? "");
    setEditorNachname(user?.nachname ?? "");
    setEditorEmail(user?.email ?? "");
  }

  function closeEditor() {
    setEditingUser(null);
    setEditorVorname("");
    setEditorNachname("");
    setEditorEmail("");
  }

  async function saveUserProfile() {
    if (!editingUser?.uid) return;

    const safeVorname = editorVorname.trim();
    const safeNachname = editorNachname.trim();
    const safeEmail = editorEmail.trim();
    const fullName = [safeVorname, safeNachname].filter(Boolean).join(" ");

    setSaving(editingUser.uid);
    const { error: updateError } = await supabase
      .from("users")
      .update({
        vorname: safeVorname,
        nachname: safeNachname,
        email: safeEmail,
        name: fullName,
      })
      .eq("id", editingUser.uid);

    if (updateError) {
      setError("Profil konnte nicht gespeichert werden.");
      setSaving(null);
      return;
    }

    setUsers((prev) =>
      prev.map((u) =>
        u.uid === editingUser.uid
          ? { ...u, vorname: safeVorname, nachname: safeNachname, email: safeEmail, name: fullName }
          : u
      )
    );

    setSaving(null);
    closeEditor();
  }

  async function deleteUser(uid, email) {
    if (!window.confirm(`Supabase-Eintrag von "${email ?? "Anonym"}" wirklich löschen?`)) return;
    const { error: deleteError } = await supabase.from("users").delete().eq("id", uid);
    if (deleteError) {
      setError("Nutzer konnte nicht gelöscht werden.");
      return;
    }
    setUsers((prev) => prev.filter((u) => u.uid !== uid));
  }

  const pending = users.filter((u) => u.role === "pending");
  const filtered = users
    .filter((u) => u.role !== "pending")
    .filter((u) =>
      [u.email, u.vorname, u.nachname, u.name]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "24px", maxWidth: 800 }}>
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          marginBottom: "60px",
        }}
      >
        <h2 style={{ color: BRAND_RED, marginTop: 0, marginBottom: 4 }}>
          Nutzerverwaltung
        </h2>
        <p style={{ color: "#6b7280", marginBottom: 20, fontSize: 14 }}>
          Hier kannst du die Rollen aller registrierten Nutzer verwalten.
        </p>

        {error && (
          <p style={{ color: "#b91c1c", marginBottom: 14, fontSize: 13 }}>{error}</p>
        )}

        {/* Ausstehende Freischaltungen */}
        {pending.length > 0 && (
          <div
            style={{
              background: "#fff7ed",
              border: "1px solid #f97316",
              borderRadius: 10,
              padding: "14px 16px",
              marginBottom: 20,
            }}
          >
            <p style={{ fontWeight: 700, color: "#c2410c", marginBottom: 10, fontSize: 14 }}>
              ⏳ Warten auf Freischaltung ({pending.length})
            </p>
            {pending.map((u) => (
              <div
                key={u.uid}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "6px 0",
                  borderBottom: "1px solid #fed7aa",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                <span style={{ fontSize: 14, color: "#374151" }}>{u.email}</span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => changeRole(u.uid, "mitglied")}
                    disabled={saving === u.uid}
                    style={{
                      padding: "5px 12px",
                      background: "#3b82f6",
                      color: "white",
                      border: "none",
                      borderRadius: 6,
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    ✓ Freischalten
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Suche */}
        <input
          type="text"
          placeholder="Nach Name oder E-Mail suchen…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 12px",
            border: "1px solid #d1d5db",
            borderRadius: 8,
            fontSize: 14,
            marginBottom: 16,
            boxSizing: "border-box",
            outline: "none",
          }}
        />

        {/* Legende */}
        <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          {ROLES.map((r) => (
            <span
              key={r}
              style={{
                background: ROLE_COLORS[r],
                color: "white",
                borderRadius: 20,
                padding: "2px 10px",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {r}
            </span>
          ))}
        </div>

        {loading ? (
          <div style={{ display: "grid", gap: 10 }}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="skeleton" style={{ height: 38, borderRadius: 8 }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p style={{ color: "#6b7280" }}>Keine Nutzer gefunden.</p>
        ) : isMobile ? (
          <div style={{ display: "grid", gap: 10 }}>
            {filtered.map((user) => (
              <div
                key={user.uid}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 10,
                  padding: 12,
                  background: "#fff",
                }}
              >
                <div style={{ display: "grid", gap: 8 }}>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>Name</div>
                  <div style={{ fontSize: 14, color: "#111827", fontWeight: 600 }}>
                    {getDisplayName(user)}
                  </div>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>
                    {getDisplaySubline(user)}
                  </div>

                  <div style={{ fontSize: 12, color: "#6b7280" }}>Rolle ändern</div>
                  <select
                    value={ROLES.includes(user.role) ? user.role : "mitglied"}
                    disabled={saving === user.uid}
                    onChange={(e) => changeRole(user.uid, e.target.value)}
                    style={{
                      padding: "8px 10px",
                      borderRadius: 8,
                      border: "1px solid rgba(0,0,0,0.15)",
                      fontSize: 13,
                      cursor: "pointer",
                      background: saving === user.uid ? "#f3f4f6" : (ROLE_COLORS[ROLES.includes(user.role) ? user.role : "mitglied"] ?? "#3b82f6"),
                      color: "white",
                      fontWeight: 600,
                      textAlign: "center",
                      textAlignLast: "center",
                    }}
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r} style={{ background: "white", color: "#111827" }}>
                        {r}
                      </option>
                    ))}
                  </select>

                  <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                    <button
                      onClick={() => openEditor(user)}
                      disabled={saving === user.uid}
                      style={{
                        flex: 1,
                        padding: "8px 10px",
                        borderRadius: 8,
                        border: "1px solid #d1d5db",
                        background: saving === user.uid ? "#f3f4f6" : "white",
                        cursor: saving === user.uid ? "not-allowed" : "pointer",
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      User bearbeiten
                    </button>
                    <button
                      onClick={() => deleteUser(user.uid, user.email)}
                      title="Aus Supabase löschen"
                      style={{
                        width: 42,
                        borderRadius: 8,
                        background: "#fff1f2",
                        border: "1px solid #fecdd3",
                        cursor: "pointer",
                        fontSize: 16,
                        color: "#dc2626",
                      }}
                    >
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #f3f4f6", textAlign: "left" }}>
                <th style={th}>Name</th>
                <th style={{ ...th, width: 150, textAlign: "center" }}>Rolle ändern</th>
                <th style={{ ...th, width: 130 }}>User bearbeiten</th>
                <th style={{ ...th, width: 80 }}>Aktion</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr
                  key={user.uid}
                  style={{ borderBottom: "1px solid #f3f4f6" }}
                >
                  <td style={td}>
                    <div style={{ color: "#6b7280", fontSize: 12, marginBottom: 4 }}>
                      Name
                    </div>
                    <div style={{ color: "#111827", fontSize: 14, fontWeight: 600 }}>
                      {getDisplayName(user)}
                    </div>
                    <div style={{ color: "#9ca3af", fontSize: 12 }}>
                      {getDisplaySubline(user)}
                    </div>
                  </td>
                  <td style={{ ...td, textAlign: "center" }}>
                    <select
                      value={ROLES.includes(user.role) ? user.role : "mitglied"}
                      disabled={saving === user.uid}
                      onChange={(e) => changeRole(user.uid, e.target.value)}
                      style={{
                        padding: "6px 8px",
                        borderRadius: 6,
                        border: "1px solid rgba(0,0,0,0.15)",
                        fontSize: 13,
                        cursor: "pointer",
                        background: saving === user.uid ? "#f3f4f6" : (ROLE_COLORS[ROLES.includes(user.role) ? user.role : "mitglied"] ?? "#3b82f6"),
                        color: "white",
                        fontWeight: 600,
                        textAlign: "center",
                        textAlignLast: "center",
                      }}
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r} style={{ background: "white", color: "#111827" }}>
                          {r}
                        </option>
                      ))}
                    </select>
                    {saving === user.uid && (
                      <span style={{ marginLeft: 8, color: "#9ca3af", fontSize: 12 }}>
                        …
                      </span>
                    )}
                  </td>
                  <td style={td}>
                    <button
                      onClick={() => openEditor(user)}
                      disabled={saving === user.uid}
                      style={{
                        padding: "6px 10px",
                        borderRadius: 6,
                        border: "1px solid #d1d5db",
                        background: saving === user.uid ? "#f3f4f6" : "white",
                        cursor: saving === user.uid ? "not-allowed" : "pointer",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      Bearbeiten
                    </button>
                  </td>
                  <td style={td}>
                    <button
                      onClick={() => deleteUser(user.uid, user.email)}
                      title="Aus Supabase löschen"
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: 16,
                        color: "#dc2626",
                        padding: "4px",
                      }}
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <button
          onClick={loadUsers}
          style={{
            marginTop: 20,
            padding: "8px 16px",
            background: "#f3f4f6",
            border: "1px solid #d1d5db",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          ↻ Aktualisieren
        </button>

        {editingUser && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.45)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
            }}
          >
            <div
              style={{
                width: "min(92vw, 520px)",
                background: "white",
                borderRadius: 14,
                padding: 20,
                boxShadow: "0 18px 40px rgba(0,0,0,0.22)",
              }}
            >
              <h3 style={{ marginTop: 0, marginBottom: 6, color: "#111827" }}>User bearbeiten</h3>
              <p style={{ marginTop: 0, marginBottom: 16, color: "#6b7280", fontSize: 13 }}>
                UID: {editingUser.uid}
              </p>

              <div style={{ display: "grid", gap: 10 }}>
                <label style={{ display: "grid", gap: 4, fontSize: 13, color: "#374151" }}>
                  Vorname
                  <input
                    value={editorVorname}
                    onChange={(e) => setEditorVorname(e.target.value)}
                    style={{
                      padding: "8px 10px",
                      borderRadius: 8,
                      border: "1px solid #d1d5db",
                      fontSize: 14,
                    }}
                  />
                </label>
                <label style={{ display: "grid", gap: 4, fontSize: 13, color: "#374151" }}>
                  Nachname
                  <input
                    value={editorNachname}
                    onChange={(e) => setEditorNachname(e.target.value)}
                    style={{
                      padding: "8px 10px",
                      borderRadius: 8,
                      border: "1px solid #d1d5db",
                      fontSize: 14,
                    }}
                  />
                </label>
                <label style={{ display: "grid", gap: 4, fontSize: 13, color: "#374151" }}>
                  E-Mail-Adresse
                  <input
                    type="email"
                    value={editorEmail}
                    onChange={(e) => setEditorEmail(e.target.value)}
                    style={{
                      padding: "8px 10px",
                      borderRadius: 8,
                      border: "1px solid #d1d5db",
                      fontSize: 14,
                    }}
                  />
                </label>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
                <button
                  onClick={closeEditor}
                  disabled={saving === editingUser.uid}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 8,
                    border: "1px solid #d1d5db",
                    background: "white",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  Abbrechen
                </button>
                <button
                  onClick={saveUserProfile}
                  disabled={saving === editingUser.uid}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 8,
                    border: "none",
                    background: "#b91c1c",
                    color: "white",
                    cursor: saving === editingUser.uid ? "not-allowed" : "pointer",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  {saving === editingUser.uid ? "Speichert..." : "Speichern"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const th = {
  padding: "10px 8px",
  color: "#374151",
  fontWeight: 700,
};

const td = {
  padding: "10px 8px",
  color: "#374151",
  verticalAlign: "middle",
};
