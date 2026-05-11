import { useEffect, useState } from "react";
import { useIsMobile } from "../hooks/useIsMobile";

const pageContainerStyle = (isMobile) => ({
  padding: isMobile ? "12px" : "24px",
});

const contentCardStyle = (isMobile, embedded) => ({
  background: "white",
  borderRadius: 16, // Kartenform: 0 = eckig, 12 = klassisch, 24 = weicher
  padding: isMobile ? 14 : 28, // Mobil kompakter, Desktop luftiger
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  maxWidth: embedded ? "100%" : 700,
  textAlign: "left",
  width: "100%",
  boxSizing: "border-box",
  marginBottom: embedded ? 0 : "60px",
  border: embedded ? "1px solid #f1f5f9" : "none",
});

const sectionTitleStyle = (isMobile) => ({
  fontSize: isMobile ? 16 : 18,
  fontWeight: 700,
  color: "#b91c1c", // Rot als Bereichsakzent; alternativ neutral "#111827"
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

const STATUS_OPTIONS = ["offen", "in Arbeit", "abgeschlossen"];

const STATUS_STYLE_BY_VALUE = {
  offen: {
    background: "#fee2e2",
    color: "#b91c1c",
    borderColor: "#fca5a5",
  },
  "in Arbeit": {
    background: "#fef3c7",
    color: "#b45309",
    borderColor: "#fcd34d",
  },
  abgeschlossen: {
    background: "#dcfce7",
    color: "#15803d",
    borderColor: "#86efac",
  },
};

const PHASE_BADGE_BY_TYPE = {
  Vorbereitung: {
    icon: "🧭",
    background: "#ede9fe",
    color: "#5b21b6",
  },
  Aufbau: {
    icon: "🔧",
    background: "#fef3c7",
    color: "#92400e",
  },
  Veranstaltung: {
    icon: "🎉",
    background: "#dcfce7",
    color: "#166534",
  },
  Abbau: {
    icon: "📦",
    background: "#e0f2fe",
    color: "#0c4a6e",
  },
};

const cardHeaderStyle = (typ) => {
  const phaseBadge = PHASE_BADGE_BY_TYPE[typ] ?? PHASE_BADGE_BY_TYPE.Aufbau;

  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 18,
    padding: "8px 14px", // Kopfmarkierung fuer die schnelle visuelle Trennung beider Karten
    borderRadius: 999,
    background: phaseBadge.background,
    color: phaseBadge.color,
    fontSize: 14,
    fontWeight: 700,
  };
};

export default function AufbauAbbauPage({ data, typ, embedded = false }) {
  const isMobile = useIsMobile(960);
  const details = data || {};
  const location = details.ort || "";
  const meetingTime = details.treffzeit || "";
  const isEventSection = typ === "Veranstaltung";
  const hasScheduleInfo = Boolean(details.datum || details.uhrzeit || location);
  const phaseBadge = PHASE_BADGE_BY_TYPE[typ] ?? PHASE_BADGE_BY_TYPE.Aufbau;
  const hasResponsibleInfo = Array.isArray(details.verantwortliche) && details.verantwortliche.length > 0;
  const hasTaskInfo = Array.isArray(details.aufgaben) && details.aufgaben.length > 0;
  const hasRemarks = Boolean(details.bemerkungen);

  const cardContent = (
    <div style={contentCardStyle(isMobile, embedded)}>
      <div style={cardHeaderStyle(typ)}>
        <span>{phaseBadge.icon}</span>
        <span>{typ}</span>
      </div>

      {hasScheduleInfo && (
        <>
          <InfoSection
            icon="🕒"
            title={isEventSection ? "Datum, Treffzeit, Ort & Beginn" : "Datum, Uhrzeit & Ort"}
            isMobile={isMobile}
          >
            <InfoRow label="Datum" value={details.datum} isMobile={isMobile} />
            {isEventSection ? (
              <>
                <InfoRow label="Treffzeit" value={meetingTime} isMobile={isMobile} />
                <InfoRow label="Ort" value={location} isMobile={isMobile} />
                <InfoRow label="Beginn" value={details.uhrzeit} isMobile={isMobile} />
              </>
            ) : (
              <>
                <InfoRow label="Uhrzeit" value={details.uhrzeit} isMobile={isMobile} />
                <InfoRow label="Ort" value={location} isMobile={isMobile} />
              </>
            )}
          </InfoSection>
        </>
      )}

      {hasScheduleInfo && (hasResponsibleInfo || hasTaskInfo || hasRemarks) && <Divider />}

      {hasResponsibleInfo && (
        <>
          <InfoSection icon="👤" title="Verantwortliche" isMobile={isMobile}>
            <ListSection items={details.verantwortliche} emptyText="Noch keine Verantwortlichen eingetragen." isMobile={isMobile} />
          </InfoSection>

          {(hasTaskInfo || hasRemarks) && <Divider />}
        </>
      )}

      {hasTaskInfo && (
        <>
          <InfoSection icon="✅" title="Aufgaben" isMobile={isMobile}>
            <ListSection items={details.aufgaben} emptyText="Noch keine Aufgaben eingetragen." isMobile={isMobile} />
          </InfoSection>

          {hasRemarks && <Divider />}
        </>
      )}

      {hasRemarks && (
        <InfoSection icon="📝" title="Bemerkungen" isMobile={isMobile}>
          <InfoRow label="Bemerkungen" value={details.bemerkungen} isMobile={isMobile} />
        </InfoSection>
      )}
    </div>
  );

  if (embedded) {
    return cardContent;
  }

  return <div style={pageContainerStyle(isMobile)}>{cardContent}</div>;
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

  const [statusByIndex, setStatusByIndex] = useState(() => buildStatusMap(items));

  useEffect(() => {
    setStatusByIndex(buildStatusMap(items));
  }, [items]);

  return (
    <ul style={{ margin: 0, paddingLeft: 20, fontSize: isMobile ? 14 : 18, color: "#111827" }}>
      {items.map((item, index) => {
        const responsible = getTaskResponsible(item);
        const hasStatusDropdown = isTaskItem(item);
        const currentStatus = statusByIndex[index] ?? "offen";
        const statusStyle = STATUS_STYLE_BY_VALUE[currentStatus] ?? STATUS_STYLE_BY_VALUE.offen;

        return (
          <li key={index} style={{ marginBottom: 8 }}>
            <div>{getTaskLabel(item)}</div>
            {responsible && (
              <div style={{ marginTop: 2, fontSize: isMobile ? 12 : 14, color: "#6b7280" }}>
                Verantwortlich: {responsible}
              </div>
            )}
            {hasStatusDropdown && (
              <label style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 8, fontSize: isMobile ? 12 : 14, color: "#374151" }}>
                <span>Status:</span>
                <select
                  value={currentStatus}
                  onChange={(event) => {
                    const nextStatus = event.target.value;
                    setStatusByIndex((prev) => ({ ...prev, [index]: nextStatus }));
                  }}
                  style={{
                    padding: isMobile ? "6px 8px" : "7px 10px",
                    borderRadius: 8,
                    border: `1px solid ${statusStyle.borderColor}`,
                    background: statusStyle.background,
                    color: statusStyle.color,
                    fontSize: isMobile ? 12 : 14,
                    fontWeight: 600,
                  }}
                >
                  {STATUS_OPTIONS.map((statusOption) => (
                    <option key={statusOption} value={statusOption}>
                      {statusOption}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function Divider() {
  return <hr style={dividerStyle} />;
}

function getTaskLabel(item) {
  if (typeof item === "string") return item;
  if (item && typeof item === "object") {
    return item.titel || item.aufgabe || item.text || "Ohne Bezeichnung";
  }
  return "Ohne Bezeichnung";
}

function getTaskResponsible(item) {
  if (!item || typeof item !== "object") return "";

  const responsible = item.verantwortlich ?? item.verantwortliche;
  if (Array.isArray(responsible)) {
    return responsible.filter(Boolean).join(", ");
  }
  return responsible || "";
}

function isTaskItem(item) {
  return Boolean(
    item &&
    typeof item === "object" &&
    (item.text || item.aufgabe || item.titel || item.status)
  );
}

function buildStatusMap(items) {
  return items.reduce((accumulator, item, index) => {
    if (isTaskItem(item)) {
      accumulator[index] = item.status || "offen";
    }
    return accumulator;
  }, {});
}
