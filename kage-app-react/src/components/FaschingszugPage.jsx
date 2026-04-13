import { useIsMobile } from "../hooks/useIsMobile";

const pageContainerStyle = (isMobile) => ({
  padding: isMobile ? "12px" : "24px",
});

const contentCardStyle = (isMobile) => ({
  background: "white",
  borderRadius: 16, // Kartenform: 0 = eckig, 12 = standard, 24 = weicher
  padding: isMobile ? 14 : 28,
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  maxWidth: 700,
  textAlign: "left",
  width: "100%",
  boxSizing: "border-box",
  marginBottom: "60px",
});

const sectionTitleStyle = (isMobile) => ({
  fontSize: isMobile ? 16 : 18,
  fontWeight: 700,
  color: "#b91c1c",
  marginBottom: 10,
  display: "flex",
  alignItems: "center",
  gap: 6,
});

const rowStyle = (isMobile) => ({
  display: "flex",
  gap: 8,
  marginBottom: 6,
  fontSize: isMobile ? 14 : 18,
  flexDirection: isMobile ? "column" : "row",
});

const dividerStyle = {
  border: "none",
  borderTop: "1px solid #f3f4f6",
  margin: "16px 0",
};

export default function FaschingszugPage({ veranstaltung }) {
  const isMobile = useIsMobile(960);
  const v = veranstaltung;

  return (
    <div style={pageContainerStyle(isMobile)}>
      <div style={contentCardStyle(isMobile)}>
        <InfoSection icon="📍" title="Treffpunkt & Uhrzeit" isMobile={isMobile}>
          <InfoRow label="Treffpunkt" value={v.treffpunkt} isMobile={isMobile} />
          <InfoRow label="Uhrzeit" value={v.treffpunktUhrzeit} isMobile={isMobile} />
        </InfoSection>

        <Divider />

        <InfoSection icon="🚗" title="Fahrer" isMobile={isMobile}>
          <ListSection items={v.fahrer} emptyText="Noch kein Fahrer eingetragen." isMobile={isMobile} />
        </InfoSection>

        <Divider />

        <InfoSection icon="👥" title="Teilnehmer" isMobile={isMobile}>
          <ListSection items={v.teilnehmer} emptyText="Noch keine Teilnehmer eingetragen." isMobile={isMobile} />
        </InfoSection>

        <Divider />

        <InfoSection icon="🚚" title="Wagenaufbau" isMobile={isMobile}>
          <InfoRow label="Status / Info" value={v.wagenaufbau} isMobile={isMobile} />
        </InfoSection>

        <Divider />

        <InfoSection icon="🎊" title="Besorgung Wurfmaterial" isMobile={isMobile}>
          <InfoRow label="Status / Info" value={v.wurfmaterial} isMobile={isMobile} />
        </InfoSection>
      </div>
    </div>
  );
}

function InfoSection({ icon, title, children, isMobile }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <h3 style={sectionTitleStyle(isMobile)}>
        <span>{icon}</span> {title}
      </h3>
      {children}
    </div>
  );
}

function InfoRow({ label, value, isMobile }) {
  return (
    <div style={rowStyle(isMobile)}>
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
  return <hr style={dividerStyle} />;
}
