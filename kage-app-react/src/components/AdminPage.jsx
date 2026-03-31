import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const BRAND_RED = "#b91c1c";

const ROLES = [
  // Zugriffsrollen
  { value: "pending",      label: "⏳ Ausstehend",           group: "Rollen" },
  { value: "gesperrt",     label: "🚫 Gesperrt",             group: "Rollen" },
  { value: "gast",         label: "👤 Gast",                 group: "Rollen" },
  { value: "mitglied",     label: "✅ Mitglied",             group: "Rollen" },
  { value: "vorstand",     label: "⭐ Vorstand",             group: "Rollen" },
  { value: "admin",        label: "🔑 Admin",                group: "Rollen" },
  // Gruppen
  { value: "rote-garde",   label: "Rote Garde",              group: "Gruppen" },
  { value: "blaue-garde",  label: "Blaue Garde",             group: "Gruppen" },
  { value: "gruene-garde", label: "Grüne Garde",             group: "Gruppen" },
  { value: "boeckli-garde",label: "Zeller Böckli",           group: "Gruppen" },
  { value: "boeck2beat",   label: "Böck2Beat",               group: "Gruppen" },
  { value: "maennerballett",label: "Zeller Böck Ballett",    group: "Gruppen" },
  { value: "zdl",          label: "Zeller Daller Lacker",    group: "Gruppen" },
  { value: "buettenredner",label: "Büttenredner",            group: "Gruppen" },
  { value: "elfinnen",     label: "11'n",                    group: "Gruppen" },
  { value: "elferraete",   label: "Elferräte",               group: "Gruppen" },
];

const ROLE_COLORS = {
  pending:       "#f97316",
  gast:          "#9ca3af",
  mitglied:      "#3b82f6",
  vorstand:      "#f59e0b",
  admin:         "#dc2626",
  gesperrt:      "#111827",
  "rote-garde":  "#dc2626",
  "blaue-garde": "#2563eb",
  "gruene-garde":"#16a34a",
  "boeckli-garde":"#92400e",
  "boeck2beat":  "#7c3aed",
  "maennerballett":"#db2777",
  "zdl":         "#0891b2",
  "buettenredner":"#ca8a04",
  "elfinnen":    "#059669",
  "elferraete":  "#6366f1",
};

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null); // uid der gerade gespeichert wird
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    const snap = await getDocs(collection(db, "users"));
    const list = snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
    list.sort((a, b) => (a.email ?? "").localeCompare(b.email ?? ""));
    setUsers(list);
    setLoading(false);
  }

  async function changeRole(uid, newRole) {
    setSaving(uid);
    await updateDoc(doc(db, "users", uid), { role: newRole });
    setUsers((prev) =>
      prev.map((u) => (u.uid === uid ? { ...u, role: newRole } : u))
    );
    setSaving(null);
  }

  async function deleteUser(uid, email) {
    if (!window.confirm(`Firestore-Eintrag von "${email ?? "Anonym"}" wirklich löschen?`)) return;
    await deleteDoc(doc(db, "users", uid));
    setUsers((prev) => prev.filter((u) => u.uid !== uid));
  }

  const pending = users.filter((u) => u.role === "pending");
  const filtered = users
    .filter((u) => u.role !== "pending")
    .filter((u) =>
    (u.email ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "24px", maxWidth: 800 }}>
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        <h2 style={{ color: BRAND_RED, marginTop: 0, marginBottom: 4 }}>
          Nutzerverwaltung
        </h2>
        <p style={{ color: "#6b7280", marginBottom: 20, fontSize: 14 }}>
          Hier kannst du die Rollen aller registrierten Nutzer verwalten.
        </p>

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
                  <button
                    onClick={() => changeRole(u.uid, "gast")}
                    disabled={saving === u.uid}
                    style={{
                      padding: "5px 12px",
                      background: "#9ca3af",
                      color: "white",
                      border: "none",
                      borderRadius: 6,
                      cursor: "pointer",
                      fontSize: 13,
                    }}
                  >
                    Gast
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Suche */}
        <input
          type="text"
          placeholder="Nach E-Mail suchen…"
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
          <p style={{ color: "#6b7280" }}>Lade Nutzer…</p>
        ) : filtered.length === 0 ? (
          <p style={{ color: "#6b7280" }}>Keine Nutzer gefunden.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #f3f4f6", textAlign: "left" }}>
                <th style={th}>E-Mail</th>
                <th style={th}>Rolle</th>
                <th style={{ ...th, width: 140 }}>Ändern</th>
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
                    {user.email ?? (
                      <span style={{ color: "#9ca3af", fontStyle: "italic" }}>
                        Anonym
                      </span>
                    )}
                  </td>
                  <td style={td}>
                    <span
                      style={{
                        background: ROLE_COLORS[user.role] ?? "#9ca3af",
                        color: "white",
                        borderRadius: 20,
                        padding: "2px 10px",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {user.role ?? "gast"}
                    </span>
                  </td>
                  <td style={td}>
                    <select
                      value={user.role ?? "gast"}
                      disabled={saving === user.uid}
                      onChange={(e) => changeRole(user.uid, e.target.value)}
                      style={{
                        padding: "6px 8px",
                        borderRadius: 6,
                        border: "1px solid #d1d5db",
                        fontSize: 13,
                        cursor: "pointer",
                        background: saving === user.uid ? "#f3f4f6" : "white",
                      }}
                    >
                      {["Rollen", "Gruppen"].map((grp) => (
                        <optgroup key={grp} label={grp}>
                          {ROLES.filter((r) => r.group === grp).map((r) => (
                            <option key={r.value} value={r.value}>{r.label}</option>
                          ))}
                        </optgroup>
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
                      onClick={() => deleteUser(user.uid, user.email)}
                      title="Aus Firestore löschen"
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
