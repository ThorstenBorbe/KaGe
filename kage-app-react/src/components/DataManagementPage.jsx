import { useState } from "react";
import { ref, uploadBytes, listAll, getBytes, deleteObject } from "firebase/storage";
import { storage } from "../firebase/firebaseConfig";

export default function DataManagementPage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", error: false });

  // Dateien aus Storage laden
  const loadFiles = async () => {
    try {
      setLoading(true);
      const listRef = ref(storage, "daten/");
      const res = await listAll(listRef);
      setFiles(res.items.map((item) => item.name));
      setMessage({ text: "Dateien geladen", error: false });
    } catch (err) {
      setMessage({ text: `Fehler: ${err.message}`, error: true });
    } finally {
      setLoading(false);
    }
  };

  // Datei hochladen
  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".json")) {
      setMessage({ text: "Nur JSON-Dateien erlaubt", error: true });
      return;
    }

    try {
      setLoading(true);
      const fileRef = ref(storage, `daten/${file.name}`);
      await uploadBytes(fileRef, file);
      setMessage({ text: `✅ ${file.name} hochgeladen!`, error: false });
      await loadFiles();
    } catch (err) {
      setMessage({ text: `Fehler beim Upload: ${err.message}`, error: true });
    } finally {
      setLoading(false);
    }
  };

  // Datei löschen
  const deleteFile = async (filename) => {
    if (!window.confirm(`${filename} wirklich löschen?`)) return;
    try {
      setLoading(true);
      const fileRef = ref(storage, `daten/${filename}`);
      await deleteObject(fileRef);
      setMessage({ text: `✅ ${filename} gelöscht!`, error: false });
      await loadFiles();
    } catch (err) {
      setMessage({ text: `Fehler: ${err.message}`, error: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ background: "white", borderRadius: 16, padding: 28, boxShadow: "0 4px 12px rgba(0,0,0,0.08)", marginBottom: "60px" }}>
        <h2 style={{ marginTop: 0, color: "#b91c1c" }}>📁 Datenverwaltung (Firebase Storage)</h2>

        {/* Feedback */}
        {message.text && (
          <div style={{
            padding: 12,
            borderRadius: 8,
            marginBottom: 16,
            background: message.error ? "#fee2e2" : "#dcfce7",
            color: message.error ? "#991b1b" : "#166534",
            fontSize: 13,
          }}>
            {message.text}
          </div>
        )}

        {/* Upload-Bereich */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: 14 }}>
            📤 JSON-Datei hochladen:
          </label>
          <input
            type="file"
            accept=".json"
            onChange={handleUpload}
            disabled={loading}
            style={{
              padding: 10,
              border: "1px solid #d1d5db",
              borderRadius: 8,
              cursor: "pointer",
              width: "100%",
              boxSizing: "border-box",
            }}
          />
          <p style={{ fontSize: 12, color: "#6b7280", margin: "8px 0 0 0" }}>
            💡 Tipp: Dateien sollten <code>daten/externeVeranstaltungen.json</code> oder <code>daten/interneVeranstaltungen.json</code> heißen
          </p>
        </div>

        {/* Dateien-Liste */}
        <div>
          <button
            onClick={loadFiles}
            disabled={loading}
            style={{
              padding: "8px 16px",
              marginBottom: 16,
              background: "#b91c1c",
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            {loading ? "⏳ Lädt..." : "🔄 Dateien aktualisieren"}
          </button>

          {files.length > 0 ? (
            <div>
              <h3 style={{ fontSize: 14, marginTop: 0 }}>Geladen in Firebase Storage:</h3>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {files.map((file) => (
                  <li key={file} style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13 }}>{file}</span>
                    <button
                      onClick={() => deleteFile(file)}
                      style={{
                        padding: "4px 8px",
                        fontSize: 11,
                        background: "#fca5a5",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer",
                      }}
                    >
                      Löschen
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p style={{ fontSize: 13, color: "#d1d5db" }}>Noch keine Dateien hochgeladen.</p>
          )}
        </div>

        {/* Anleitung */}
        <div style={{ marginTop: 24, padding: 16, background: "#f9fafb", borderRadius: 8, fontSize: 12 }}>
          <h4 style={{ marginTop: 0, color: "#111827" }}>📚 Wie es funktioniert:</h4>
          <ol style={{ margin: "8px 0", paddingLeft: 16 }}>
            <li>Du erstellst eine JSON-Datei mit deinen Veranstaltungsdaten</li>
            <li>Lädst sie hier hoch</li>
            <li>Die App lädt sie automatisch und zeigt die Daten an</li>
            <li>Keine neuen App-Builds nötig!</li>
          </ol>

          <h4 style={{ marginTop: 16, color: "#111827" }}>📄 Beispiel-JSON für externe Veranstaltungen:</h4>
          <pre style={{
            background: "#111827",
            color: "#10b981",
            padding: 12,
            borderRadius: 6,
            fontSize: 11,
            overflow: "auto",
          }}>
{`{
  "auswaerts-x": {
    "titel": "1. Auswärtssitzung",
    "treffpunkt": "Parkplatz Rathaus Zell",
    "treffpunktUhrzeit": "18:00 Uhr",
    "verein": {
      "name": "KG Beispielstadt",
      "sitzungsbeginn": "20:00 Uhr",
      "strasse": "Hauptstr. 123",
      "plz": "67000",
      "ort": "Beispielstadt"
    },
    "geschenk": "Rotwein",
    "fahrer": ["Max Mustermann"],
    "teilnehmer": ["Anna", "Bernd"],
    "auftritte": ["Rote Garde"]
  }
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}
