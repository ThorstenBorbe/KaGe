import { useIsMobile } from "../hooks/useIsMobile";

export default function AufbauAbbauPage({ data, typ }) {
  const isMobile = useIsMobile(960);
  const d = data || {};

  return (
    <div style={{ padding: isMobile ? "12px" : "24px" }}>
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: isMobile ? 14 : 28,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          maxWidth: 700,
          textAlign: "left",
          width: "100%",
          boxSizing: "border-box",
          marginBottom: "60px",
        }}
      >
        {/* Zeitraum & Treffpunkt */}
        <InfoSection icon={typ === "Aufbau" ? "🔧" : "📦"} title={typ} isMobile={isMobile}>
          <InfoRow label="Uhrzeit" value={d.uhrzeit} isMobile={isMobile} />
          <InfoRow label="Treffpunkt" value={d.treffpunkt} isMobile={isMobile} />
        </InfoSection>

        <Divider />

        {/* Verantwortliche */}
        <InfoSection icon="👤" title="Verantwortliche" isMobile={isMobile}>
          <ListSection items={d.verantwortliche} emptyText="Noch keine Verantwortlichen eingetragen." isMobile={isMobile} />
        </InfoSection>

        <Divider />

        {/* Aufgaben */}
        <InfoSection icon="✅" title="Aufgaben" isMobile={isMobile}>
          <ListSection items={d.aufgaben} emptyText="Noch keine Aufgaben eingetragen." isMobile={isMobile} />
        </InfoSection>

        <Divider />

        {/* Bemerkungen */}
        <InfoSection icon="📝" title="Bemerkungen" isMobile={isMobile}>
          <InfoRow label="Bemerkungen" value={d.bemerkungen} isMobile={isMobile} />
        </InfoSection>
      </div>
    </div>
  );
}

function InfoSection({ icon, title, children, isMobile }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <h3 style={{ fontSize: isMobile ? 16 : 18, fontWeight: 700, color: "#b91c1c", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
        <span>{icon}</span> {title}
      </h3>
      {children}
    </div>
  );
}

function InfoRow({ label, value, isMobile }) {
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 6, fontSize: isMobile ? 14 : 18, flexDirection: isMobile ? "column" : "row" }}>
      <span style={{ minWidth: isMobile ? 0 : 150, color: "#6b7280", fontWeight: 600 }}>{label}:</span>
      <span style={{ color: value ? "#111827" : "#d1d5db" }}>{value || "—"}</span>
    </div>
  );
}

function ListSection({ items, emptyText, isMobile }) {
  if (!items || items.length === 0) {
    return <p style={{ fontSize: isMobile ? 14 : 18, color: "#d1d5db", margin: 0 }}>{emptyText}</p>;
  }
  return (
    <ul style={{ margin: 0, paddingLeft: 20, fontSize: isMobile ? 14 : 18, color: "#111827" }}>
      {items.map((item, i) => (
        <li key={i} style={{ marginBottom: 4 }}>{item}</li>
      ))}
    </ul>
  );
}

function Divider() {
  return <hr style={{ border: "none", borderTop: "1px solid #f3f4f6", margin: "16px 0" }} />;
}
