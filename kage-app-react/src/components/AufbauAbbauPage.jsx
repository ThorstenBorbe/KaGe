export default function AufbauAbbauPage({ data, typ }) {
  const d = data;

  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: 28,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          maxWidth: 700,
        }}
      >
        {/* Zeitraum & Treffpunkt */}
        <InfoSection icon={typ === "Aufbau" ? "🔧" : "📦"} title={`${typ} – Zeitraum & Treffpunkt`}>
          <InfoRow label="Zeitraum" value={d.zeitraum} />
          <InfoRow label="Treffpunkt" value={d.treffpunkt} />
        </InfoSection>

        <Divider />

        {/* Verantwortliche */}
        <InfoSection icon="👤" title="Verantwortliche">
          <ListSection items={d.verantwortliche} emptyText="Noch keine Verantwortlichen eingetragen." />
        </InfoSection>

        <Divider />

        {/* Aufgaben */}
        <InfoSection icon="✅" title="Aufgaben">
          <ListSection items={d.aufgaben} emptyText="Noch keine Aufgaben eingetragen." />
        </InfoSection>

        <Divider />

        {/* Bemerkungen */}
        <InfoSection icon="📝" title="Bemerkungen">
          <InfoRow label="Bemerkungen" value={d.bemerkungen} />
        </InfoSection>
      </div>
    </div>
  );
}

function InfoSection({ icon, title, children }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <h3 style={{ fontSize: 14, fontWeight: 700, color: "#b91c1c", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
        <span>{icon}</span> {title}
      </h3>
      {children}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 6, fontSize: 13 }}>
      <span style={{ minWidth: 150, color: "#6b7280", fontWeight: 600 }}>{label}:</span>
      <span style={{ color: value ? "#111827" : "#d1d5db" }}>{value || "—"}</span>
    </div>
  );
}

function ListSection({ items, emptyText }) {
  if (!items || items.length === 0) {
    return <p style={{ fontSize: 13, color: "#d1d5db", margin: 0 }}>{emptyText}</p>;
  }
  return (
    <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: "#111827" }}>
      {items.map((item, i) => (
        <li key={i} style={{ marginBottom: 4 }}>{item}</li>
      ))}
    </ul>
  );
}

function Divider() {
  return <hr style={{ border: "none", borderTop: "1px solid #f3f4f6", margin: "16px 0" }} />;
}
