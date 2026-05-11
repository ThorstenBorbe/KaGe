import { useAuth } from "../context/useAuth";
import { useIsMobile } from "../hooks/useIsMobile";
import { EXCEL_LINKS } from "../config/excelLinks";

const LISTEN = [
  {
    key: "mitglieder",
    label: "Mitgliederliste",
    icon: "👥",
    beschreibung: "Vollständige Liste aller Vereinsmitglieder.",
  },
  {
    key: "sponsoren",
    label: "Sponsorenliste",
    icon: "🤝",
    beschreibung: "Übersicht aller aktuellen Sponsoren des Vereins.",
  },
  {
    key: "ehrensenatoren",
    label: "Ehrensenatoren",
    icon: "🏅",
    beschreibung: "Liste aller Ehrensenatoren der KaGe Zell.",
  },
];

const restrictedPageStyle = (isMobile) => ({
  padding: isMobile ? "12px" : "24px",
  fontFamily: "Century Gothic, Segoe UI, Roboto, sans-serif",
  color: "#374151",
});

const pageShellStyle = (isMobile) => ({
  padding: isMobile ? "12px" : "24px",
  background: "#f3f4f6", // Seitenhintergrund; alternativ weiss fuer ruhigeren Look oder getoenter fuer mehr Tiefe
  minHeight: isMobile ? "auto" : "100vh",
  fontFamily: "Century Gothic, Segoe UI, Roboto, sans-serif",
});

const listGridStyle = (isMobile) => ({
  display: "grid",
  gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(300px, 1fr))", // Kartenbreite leicht zentral anpassbar
  gap: isMobile ? "12px" : "20px",
});

const listCardStyle = (isMobile) => ({
  background: "white",
  borderRadius: "18px", // Kartenform: "0px" = eckig, "12px" = ausgewogen, "24px" = weicher
  padding: isMobile ? "14px" : "24px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
});

const openLinkButtonStyle = (isMobile) => ({
  display: "inline-block",
  background: "#b91c1c", // Primaerfarbe der Oeffnen-Schaltflaeche; alternativ "#111827" oder "#2563eb"
  color: "white",
  textDecoration: "none",
  padding: "12px 18px",
  borderRadius: "12px", // Schaltflaechenform: "6px" = sachlicher, "12px" = freundlich, "999px" = pillenartig
  fontWeight: "bold",
  fontSize: isMobile ? "14px" : "16px",
  fontFamily: "Century Gothic, Segoe UI, Roboto, sans-serif",
});

const disabledLinkStyle = (isMobile) => ({
  display: "inline-block",
  background: "#e5e7eb",
  color: "#9ca3af",
  padding: "12px 18px",
  borderRadius: "12px",
  fontWeight: "bold",
  fontSize: isMobile ? "14px" : "16px",
});

export default function ListenPage() {
  const { hasRole } = useAuth();
  const isMobile = useIsMobile(960);

  if (!hasRole("vorstand")) {
    return (
      <div style={restrictedPageStyle(isMobile)}>
        <h2>🔒 Kein Zugriff</h2>
        <p>Diese Seite ist nur für Vorstand und Admin zugänglich.</p>
      </div>
    );
  }

  return (
    <div style={pageShellStyle(isMobile)}>
      <h1 style={{ marginTop: 0, marginBottom: "24px", fontSize: isMobile ? "22px" : "28px" }}>
        📋 Listen &amp; Dokumente
      </h1>

      <div style={listGridStyle(isMobile)}>
        {LISTEN.map(({ key, label, icon, beschreibung }) => {
          const url = EXCEL_LINKS[key];
          return (
            <div
              key={key}
              style={listCardStyle(isMobile)}
            >
              <h2 style={{ marginTop: 0, fontSize: isMobile ? "18px" : "22px" }}>
                {icon} {label}
              </h2>
              <p style={{ color: "#4b5563", lineHeight: 1.6, marginBottom: "20px" }}>
                {beschreibung}
              </p>
              {url ? (
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  style={openLinkButtonStyle(isMobile)}
                >
                  Excel-Liste öffnen
                </a>
              ) : (
                <span
                  style={disabledLinkStyle(isMobile)}
                >
                  Link noch nicht hinterlegt
                </span>
              )}
            </div>
          );
        })}
      </div>

      <p
        style={{
          marginTop: "32px",
          fontSize: "13px",
          color: "#6b7280",
        }}
      >
        Die Links zu den Excel-Dateien werden zentral in{" "}
        <code>src/config/excelLinks.js</code> gepflegt.
      </p>
    </div>
  );
}
