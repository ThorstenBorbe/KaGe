import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/useAuth";
import { useIsMobile } from "../hooks/useIsMobile";
import { EXCEL_LINKS, SUPABASE_LINKS } from "../config/excelLinks";
import { supabase } from "../supabase/supabaseConfig";

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
  background: "#f3f4f6",
  minHeight: isMobile ? "auto" : "100vh",
  fontFamily: "Century Gothic, Segoe UI, Roboto, sans-serif",
});

const listGridStyle = (isMobile) => ({
  display: "grid",
  gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(300px, 1fr))",
  gap: isMobile ? "12px" : "20px",
});

const listCardStyle = (isMobile) => ({
  background: "white",
  borderRadius: "18px",
  padding: isMobile ? "14px" : "24px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
});

const actionButtonStyle = (isMobile) => ({
  display: "inline-block",
  background: "#3ecf8e",
  color: "white",
  textDecoration: "none",
  padding: "12px 18px",
  borderRadius: "12px",
  fontWeight: "bold",
  fontSize: isMobile ? "14px" : "16px",
  fontFamily: "Century Gothic, Segoe UI, Roboto, sans-serif",
  border: "none",
  cursor: "pointer",
});

const popupOverlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(17, 24, 39, 0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
  zIndex: 1000,
};

const popupCardStyle = {
  width: "min(960px, 100%)",
  maxHeight: "85vh",
  overflowY: "auto",
  background: "white",
  borderRadius: "20px",
  boxShadow: "0 18px 60px rgba(0, 0, 0, 0.25)",
  padding: "0",
  color: "#1f2937",
};

const popupHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "20px 24px 16px",
  borderBottom: "1px solid #e5e7eb",
  position: "sticky",
  top: 0,
  background: "white",
  zIndex: 1,
};

const popupBodyStyle = {
  padding: "20px 24px 24px",
};

const closeButtonStyle = {
  border: "none",
  background: "#f3f4f6",
  color: "#111827",
  fontSize: "18px",
  width: "36px",
  height: "36px",
  borderRadius: "999px",
  cursor: "pointer",
};

const disabledLinkStyle = (isMobile) => ({
  display: "inline-block",
  background: "#e5e7eb",
  color: "#9ca3af",
  padding: "12px 18px",
  borderRadius: "12px",
  fontWeight: "bold",
  fontSize: isMobile ? "14px" : "16px",
});

function getObjectValue(record, candidates) {
  const lowerCandidates = candidates.map((candidate) => candidate.toLowerCase());
  for (const [key, value] of Object.entries(record ?? {})) {
    if (lowerCandidates.includes(key.toLowerCase())) {
      return value;
    }
  }
  return "";
}

function normalizeEhrensenatorenItem(item) {
  const firstName = getObjectValue(item, ["vorname", "Vorname", "VORNAME"]);
  const lastName = getObjectValue(item, ["nachname", "Nachname", "NACHNAME"]);
  const address = getObjectValue(item, ["adresse", "Adresse", "ADRESSE", "strasse", "Strasse"]);
  const postalCode = getObjectValue(item, ["plz", "PLZ", "postleitzahl", "Postleitzahl"]);
  const city = getObjectValue(item, ["ort", "Ort", "ORT", "wohnort", "Wohnort"]);
  const email = getObjectValue(item, ["email", "Email", "EMAIL"]);
  const phone = getObjectValue(item, ["telefon", "Telefon", "TELEFON", "telefonnummer", "Telefonnummer"]);
  const remark = getObjectValue(item, ["bemerkung", "Bemerkung", "BEMERKUNG"]);
  const birthDate = getObjectValue(item, ["geburtsdatum", "Geburtsdatum", "GEBURTSDATUM"]);

  return {
    id: item?.id ?? "",
    name: [firstName, lastName].filter(Boolean).join(" ") || "Unbekannt",
    address: address || "-",
    postalCode: postalCode ?? "-",
    city: city || "-",
    email: email || "-",
    phone: phone || "-",
    remark: remark || "-",
    birthDate: birthDate ? new Date(birthDate).toLocaleDateString("de-DE") : "-",
  };
}

function normalizeMitgliederItem(item) {
  return {
    id: item?.id ?? "",
    name: [item?.Vorname, item?.Nachname].filter(Boolean).join(" ") || "Unbekannt",
    adresse: item?.Strasse || item?.Adresse || "-",
    plz: item?.Postleitzahl || item?.PLZ || "-",
    ort: item?.Wohnort || item?.Ort || "-",
    telefon: item?.Telefonnummer || item?.Telefon || "-",
    email: item?.Email || "-",
    kontakt: item?.Ansprechpartner || "-",
    geburtsdatum: item?.Geburtsdatum ? new Date(item.Geburtsdatum).toLocaleDateString("de-DE") : "-",
  };
}

function isEhrensenator(item) {
  const value = getObjectValue(item, ["ehrensenator", "Ehrensenator", "EHRENSENATOR"]);
  return value === true || String(value).toLowerCase() === "true" || value === 1 || value === "1";
}

function normalizeSponsorenItem(item) {
  const firma = item?.Firma || "-";
  const vorname = item?.Vorname || "";
  const nachname = item?.Nachname || "";
  const name = [vorname, nachname].filter(Boolean).join(" ") || firma;

  return {
    id: item?.id ?? "",
    firma,
    name,
    adresse: item?.Adresse || "-",
    plz: item?.PLZ || "-",
    ort: item?.Ort || "-",
    telefon: item?.Telefon || "-",
    email: item?.Email || "-",
    letzteUnterstuetzung: item?.["Letzte Unterstützung"] || "-",
  };
}

export default function ListenPage() {
  const { hasRole, currentUser } = useAuth();
  const isMobile = useIsMobile(960);
  const [selectedList, setSelectedList] = useState(null);
  const [mitglieder, setMitglieder] = useState([]);
  const [sponsoren, setSponsoren] = useState([]);
  const [ehrensenatoren, setEhrensenatoren] = useState([]);
  const [listenLoading, setListenLoading] = useState(true);
  const [listenError, setListenError] = useState(null);

  useEffect(() => {
    if (!currentUser?.uid || currentUser.uid === "dev") {
      setListenLoading(false);
      return;
    }

    let mounted = true;

    async function loadListen() {
      setListenLoading(true);
      setListenError(null);

      const query = Promise.all([
        supabase.from("Mitglieder").select("*"),
        supabase.from("Sponsoren").select("*"),
        supabase.from("Ehrensenatoren").select("*"),
      ]);
      const timeout = new Promise((resolve) => {
        setTimeout(() => resolve({ data: null, error: new Error("Zeitüberschreitung beim Laden aus Supabase.") }), 8000);
      });
      const result = await Promise.race([query, timeout]);

      if (!mounted) return;

      if (result.error) {
        console.error("Fehler beim Laden der Listen:", result.error);
        setListenError(result.error.message);
        setMitglieder([]);
        setSponsoren([]);
        setEhrensenatoren([]);
      } else {
        const [mitgliederResult, sponsorenResult, ehrensenatorenResult] = result;
        const firstError = [mitgliederResult, sponsorenResult, ehrensenatorenResult].find((item) => item.error);
        const mitgliederData = mitgliederResult.data ?? [];
        const ehrensenatorenData = ehrensenatorenResult.error
          ? mitgliederData.filter(isEhrensenator)
          : ehrensenatorenResult.data ?? [];

        if (firstError && !(ehrensenatorenResult.error && ehrensenatorenData.length > 0)) {
          console.error("Fehler beim Laden der Listen:", firstError.error);
          setListenError(firstError.error.message);
        }

        setMitglieder(mitgliederData.map(normalizeMitgliederItem));
        setSponsoren((sponsorenResult.data ?? []).map(normalizeSponsorenItem));
        setEhrensenatoren(ehrensenatorenData.map(normalizeEhrensenatorenItem));
      }

      setListenLoading(false);
    }

    loadListen();

    return () => {
      mounted = false;
    };
  }, [currentUser]);

  const listCards = useMemo(() => LISTEN, []);
  const currentList = useMemo(() => listCards.find((item) => item.key === selectedList) ?? null, [listCards, selectedList]);

  const modalEntries = useMemo(() => {
    if (selectedList === "ehrensenatoren") return ehrensenatoren;
    if (selectedList === "mitglieder") return mitglieder;
    if (selectedList === "sponsoren") return sponsoren;
    return [];
  }, [ehrensenatoren, mitglieder, selectedList, sponsoren]);

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
        {listCards.map(({ key, label, icon, beschreibung }) => {
          const hasData =
            key === "ehrensenatoren" ? !listenLoading && ehrensenatoren.length > 0 :
            key === "mitglieder" ? mitglieder.length > 0 :
            key === "sponsoren" ? sponsoren.length > 0 :
            false;
          const canOpen = hasData;

          return (
            <div key={key} style={listCardStyle(isMobile)}>
              <h2 style={{ marginTop: 0, fontSize: isMobile ? "18px" : "22px" }}>
                {icon} {label}
              </h2>
              <p style={{ color: "#4b5563", lineHeight: 1.6, marginBottom: "20px" }}>
                {beschreibung}
              </p>

              {listenLoading ? (
                <span style={disabledLinkStyle(isMobile)}>Daten werden geladen ...</span>
              ) : canOpen ? (
                <button
                  type="button"
                  onClick={() => setSelectedList(key)}
                  style={actionButtonStyle(isMobile)}
                >
                  Liste anzeigen
                </button>
              ) : (
                <span style={disabledLinkStyle(isMobile)}>
                  {listenError
                    ? "Daten konnten nicht geladen werden"
                    : "Noch keine Daten hinterlegt"}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {selectedList && currentList && (
        <div style={popupOverlayStyle} onClick={() => setSelectedList(null)}>
          <div style={popupCardStyle} onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
            <div style={popupHeaderStyle}>
              <h2 style={{ margin: 0, fontSize: isMobile ? "22px" : "28px" }}>
                {currentList.icon} {currentList.label}
              </h2>
              <button type="button" aria-label="Popup schließen" onClick={() => setSelectedList(null)} style={closeButtonStyle}>
                ×
              </button>
            </div>

            <div style={popupBodyStyle}>
              {listenError && (
                <div style={{ background: "#fee2e2", color: "#991b1b", borderRadius: "12px", padding: "16px" }}>
                  Listen konnten nicht geladen werden: {listenError}
                </div>
              )}
              {selectedList === "ehrensenatoren" && modalEntries.length > 0 ? (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                    <thead>
                      <tr style={{ background: "#eef2ff" }}>
                        <th style={{ textAlign: "left", padding: "10px 12px", borderBottom: "1px solid #dbeafe" }}>Name</th>
                        <th style={{ textAlign: "left", padding: "10px 12px", borderBottom: "1px solid #dbeafe" }}>Adresse</th>
                        <th style={{ textAlign: "left", padding: "10px 12px", borderBottom: "1px solid #dbeafe" }}>PLZ / Ort</th>
                        <th style={{ textAlign: "left", padding: "10px 12px", borderBottom: "1px solid #dbeafe" }}>Kontakt</th>
                        <th style={{ textAlign: "left", padding: "10px 12px", borderBottom: "1px solid #dbeafe" }}>Geburtsdatum</th>
                      </tr>
                    </thead>
                    <tbody>
                      {modalEntries.map((person) => (
                        <tr key={person.id || person.name}>
                          <td style={{ padding: "10px 12px", borderBottom: "1px solid #edf2f7", verticalAlign: "top" }}>{person.name}</td>
                          <td style={{ padding: "10px 12px", borderBottom: "1px solid #edf2f7", verticalAlign: "top" }}>{person.address}</td>
                          <td style={{ padding: "10px 12px", borderBottom: "1px solid #edf2f7", verticalAlign: "top" }}>{person.postalCode} {person.city}</td>
                          <td style={{ padding: "10px 12px", borderBottom: "1px solid #edf2f7", verticalAlign: "top" }}>
                            <div>{person.email}</div>
                            <div>{person.phone}</div>
                            {person.remark !== "-" && <div style={{ marginTop: "4px", color: "#6b7280" }}>{person.remark}</div>}
                          </td>
                          <td style={{ padding: "10px 12px", borderBottom: "1px solid #edf2f7", verticalAlign: "top" }}>{person.birthDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : selectedList === "mitglieder" && modalEntries.length > 0 ? (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                    <thead>
                      <tr style={{ background: "#eef2ff" }}>
                        <th style={{ textAlign: "left", padding: "10px 12px", borderBottom: "1px solid #dbeafe" }}>Name</th>
                        <th style={{ textAlign: "left", padding: "10px 12px", borderBottom: "1px solid #dbeafe" }}>Adresse</th>
                        <th style={{ textAlign: "left", padding: "10px 12px", borderBottom: "1px solid #dbeafe" }}>PLZ / Ort</th>
                        <th style={{ textAlign: "left", padding: "10px 12px", borderBottom: "1px solid #dbeafe" }}>Kontakt</th>
                        <th style={{ textAlign: "left", padding: "10px 12px", borderBottom: "1px solid #dbeafe" }}>Geburtsdatum</th>
                      </tr>
                    </thead>
                    <tbody>
                      {modalEntries.map((person) => (
                        <tr key={person.id || person.name}>
                          <td style={{ padding: "10px 12px", borderBottom: "1px solid #edf2f7", verticalAlign: "top" }}>{person.name}</td>
                          <td style={{ padding: "10px 12px", borderBottom: "1px solid #edf2f7", verticalAlign: "top" }}>{person.adresse}</td>
                          <td style={{ padding: "10px 12px", borderBottom: "1px solid #edf2f7", verticalAlign: "top" }}>{person.plz} {person.ort}</td>
                          <td style={{ padding: "10px 12px", borderBottom: "1px solid #edf2f7", verticalAlign: "top" }}>
                            <div>{person.email}</div>
                            <div>{person.telefon}</div>
                            {person.kontakt !== "-" && <div style={{ marginTop: "4px", color: "#6b7280" }}>{person.kontakt}</div>}
                          </td>
                          <td style={{ padding: "10px 12px", borderBottom: "1px solid #edf2f7", verticalAlign: "top" }}>{person.geburtsdatum}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : selectedList === "sponsoren" && modalEntries.length > 0 ? (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                    <thead>
                      <tr style={{ background: "#eef2ff" }}>
                        <th style={{ textAlign: "left", padding: "10px 12px", borderBottom: "1px solid #dbeafe" }}>Firma / Name</th>
                        <th style={{ textAlign: "left", padding: "10px 12px", borderBottom: "1px solid #dbeafe" }}>Adresse</th>
                        <th style={{ textAlign: "left", padding: "10px 12px", borderBottom: "1px solid #dbeafe" }}>PLZ / Ort</th>
                        <th style={{ textAlign: "left", padding: "10px 12px", borderBottom: "1px solid #dbeafe" }}>Kontakt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {modalEntries.map((person) => (
                        <tr key={person.id || person.name}>
                          <td style={{ padding: "10px 12px", borderBottom: "1px solid #edf2f7", verticalAlign: "top" }}>{person.firma} {person.name !== person.firma ? `- ${person.name}` : ""}</td>
                          <td style={{ padding: "10px 12px", borderBottom: "1px solid #edf2f7", verticalAlign: "top" }}>{person.adresse}</td>
                          <td style={{ padding: "10px 12px", borderBottom: "1px solid #edf2f7", verticalAlign: "top" }}>{person.plz} {person.ort}</td>
                          <td style={{ padding: "10px 12px", borderBottom: "1px solid #edf2f7", verticalAlign: "top" }}>
                            <div>{person.email}</div>
                            <div>{person.telefon}</div>
                            {person.letzteUnterstuetzung !== "-" && <div style={{ marginTop: "4px", color: "#6b7280" }}>{person.letzteUnterstuetzung}</div>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ background: "#f9fafb", borderRadius: "12px", padding: "20px", border: "1px solid #e5e7eb" }}>
                  <p style={{ margin: 0, color: "#4b5563" }}>
                    Für {currentList.label} sind derzeit noch keine Daten hinterlegt.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <p
        style={{
          marginTop: "32px",
          fontSize: "13px",
          color: "#6b7280",
        }}
      >
        Die Ehrensenatoren werden direkt aus Supabase geladen. Mitglieder und Sponsoren verwenden derzeit weiterhin die lokalen JSON-Dateien.
      </p>
    </div>
  );
}
