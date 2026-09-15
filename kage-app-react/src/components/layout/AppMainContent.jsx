import { useEffect, useMemo, useState } from "react";
import ContentErrorBoundary from "./ContentErrorBoundary";
import { theme } from "../../styles/theme";

const STORAGE_KEY = "kage-app-additions";

export default function AppMainContent({ mainRef, active, activeLabel, children, onScrollToTop, isMobile, onOpenMobileMenu }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [note, setNote] = useState("");
  const [type, setType] = useState("Einnahmen");
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setEntries(JSON.parse(saved));
      }
    } catch {
      setEntries([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const pageEntries = useMemo(
    () => entries.filter((entry) => entry.pageKey === active).slice(0, 8),
    [entries, active]
  );

  const handleSave = () => {
    const trimmedNote = note.trim();
    if (!trimmedNote) return;

    const newEntry = {
      id: Date.now(),
      pageKey: active,
      pageLabel: activeLabel,
      type,
      note: trimmedNote,
      createdAt: new Date().toISOString(),
    };

    setEntries((prev) => [newEntry, ...prev]);
    setNote("");
    setType("Einnahmen");
    setIsModalOpen(false);
  };

  return (
    <main
      ref={mainRef}
      style={{
        flex: 1,
        height: "100vh",
        padding: isMobile ? "12px" : "24px",
        paddingTop: isMobile ? "64px" : "24px",
        paddingBottom: isMobile ? "160px" : "120px",
        background: theme.colors.contentBg,
        overflowY: "auto",
        position: "relative",
      }}
    >
      {isMobile && (
        <button
          onClick={onOpenMobileMenu}
          title="Menü öffnen"
          style={{
            position: "fixed",
            top: 14,
            left: 14,
            zIndex: 850,
            width: 38,
            height: 38,
            borderRadius: 10,
            border: "none",
            background: theme.colors.danger,
            color: "white",
            fontSize: 20,
            cursor: "pointer",
            boxShadow: theme.shadow.floating,
            lineHeight: 1,
          }}
        >
          ☰
        </button>
      )}

      <h1 style={{ marginTop: 0, marginBottom: isMobile ? 12 : undefined }}>{activeLabel}</h1>

      <div style={{ marginBottom: 20 }}>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          style={{
            background: theme.colors.danger,
            color: "white",
            border: "none",
            borderRadius: 10,
            padding: "10px 16px",
            fontSize: 16,
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: theme.shadow.floating,
          }}
        >
          Hinzufügen
        </button>
      </div>

      {pageEntries.length > 0 && (
        <div
          style={{
            background: "white",
            borderRadius: 12,
            border: "1px solid rgba(15,23,42,0.08)",
            padding: 16,
            marginBottom: 20,
            boxShadow: "0 10px 24px rgba(15,23,42,0.04)",
          }}
        >
          <h3 style={{ margin: "0 0 12px 0" }}>Einträge</h3>
          <div style={{ display: "grid", gap: 10 }}>
            {pageEntries.map((entry) => (
              <div
                key={entry.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  padding: "10px 12px",
                  background: entry.type === "Einnahmen" ? "#ecfdf5" : "#fef2f2",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>{entry.type}</div>
                  <div>{entry.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ContentErrorBoundary resetKey={active}>{children}</ContentErrorBoundary>

      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1200,
            padding: 20,
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 480,
              background: "white",
              borderRadius: 16,
              padding: 24,
              boxShadow: "0 20px 40px rgba(15,23,42,0.2)",
            }}
          >
            <h2 style={{ marginTop: 0, marginBottom: 16 }}>Eintrag hinzufügen</h2>

            <label style={{ display: "block", marginBottom: 12, fontWeight: 600 }}>
              Vermerk
            </label>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={5}
              placeholder="z. B. Mitgliedsbeitrag, Spenden, ..."
              style={{
                width: "100%",
                boxSizing: "border-box",
                resize: "vertical",
                border: "1px solid #d1d5db",
                borderRadius: 10,
                padding: "10px 12px",
                fontSize: 15,
                marginBottom: 16,
              }}
            />

            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
              Typ
            </label>
            <select
              value={type}
              onChange={(event) => setType(event.target.value)}
              style={{
                width: "100%",
                boxSizing: "border-box",
                border: "1px solid #d1d5db",
                borderRadius: 10,
                padding: "10px 12px",
                fontSize: 15,
                marginBottom: 20,
              }}
            >
              <option value="Einnahmen">Einnahmen</option>
              <option value="Ausgaben">Ausgaben</option>
            </select>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: "#e5e7eb",
                  color: "#111827",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 14px",
                  cursor: "pointer",
                }}
              >
                Abbrechen
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!note.trim()}
                style={{
                  background: theme.colors.danger,
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 14px",
                  cursor: note.trim() ? "pointer" : "not-allowed",
                  opacity: note.trim() ? 1 : 0.6,
                }}
              >
                Speichern
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={onScrollToTop}
        title="Nach oben"
        style={{
          position: "fixed",
          bottom: isMobile ? 40 : 32,
          right: isMobile ? 18 : 32,
          width: isMobile ? 40 : 44,
          height: isMobile ? 40 : 44,
          borderRadius: "50%",
          background: theme.colors.danger,
          color: "white",
          border: "none",
          fontSize: isMobile ? 18 : 20,
          cursor: "pointer",
          boxShadow: theme.shadow.floating,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        ↑
      </button>
    </main>
  );
}
