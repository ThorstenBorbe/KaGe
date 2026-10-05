import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { supabase } from "../supabase/supabaseConfig";
import { useIsMobile } from "../hooks/useIsMobile";

const STATUS_COLUMN = "Status Abarbeitung";
const VMI_TABLES = [
  { table: "VMI-Sommerfest", label: "Sommerfest" },
  { table: "VMI-Rathaussturm", label: "11.11. Rathaussturm" },
  { table: "VMI-Beat Bocks Party", label: "Beat-Bocks-Party" },
  { table: "VMI-Kehraus", label: "Kehraus" },
  { table: "VMI-Prunksitzung", label: "Prunksitzung" },
  { table: "VMI-Weihnachtsfeier", label: "Weihnachtsfeier" },
  { table: "VMI-Bunter Nachmittag", label: "Bunter Nachmittag" },
  { table: "VMI-Kinderfasching", label: "Kinderfasching" },
  { table: "VMI-Altenheime", label: "Seniorenheime" },
  { table: "VMI-Faschingszug", label: "Faschingszug" },
  { table: "VMI-Kindergärten", label: "Kindergarten" },
];

const pageContainerStyle = (isMobile) => ({
  padding: isMobile ? "12px" : "24px",
  background: "#f3f4f6",
  minHeight: isMobile ? "auto" : "100vh",
});

const pageHeaderCardStyle = {
  background: "linear-gradient(135deg, #fff7ed 0%, #ffffff 100%)",
  border: "1px solid #fed7aa",
  borderRadius: "20px",
  padding: "20px 24px",
  boxShadow: "0 10px 24px rgba(185, 28, 28, 0.06)",
  marginBottom: "20px",
};

const taskListStyle = {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "16px",
  width: "100%",
};

const taskCardStyle = {
  background: "white",
  borderRadius: "18px", // Kartenform: 0 = eckig, 12 = klassisch, 24 = weicher
  padding: "20px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  border: "1px solid #f1f5f9",
  width: "100%",
  boxSizing: "border-box",
};

const taskMetaLabelStyle = {
  color: "#6b7280",
  fontWeight: 600,
  minWidth: 80,
  textAlign: "left",
};

const taskMetaRowStyle = (isMobile) => ({
  display: "grid",
  gridTemplateColumns: isMobile ? "1fr" : "80px minmax(0, 1fr)",
  gap: isMobile ? 4 : 12,
  alignItems: "start",
});

const taskMetaValueStyle = {
  lineHeight: 1.6,
  wordBreak: "break-word",
  textAlign: "left",
};

const STATUS_STYLE_BY_VALUE = {
  offen: { background: "#fee2e2", color: "#b91c1c", borderColor: "#fca5a5" },
  "in Arbeit": { background: "#fef3c7", color: "#b45309", borderColor: "#fcd34d" },
  abgeschlossen: { background: "#dcfce7", color: "#15803d", borderColor: "#86efac" },
};

const STATUS_OPTIONS = ["offen", "in Arbeit", "abgeschlossen"];

export default function MeineAufgabenPage() {
  const { currentUser, loadMitgliedDetails } = useAuth();
  const isMobile = useIsMobile(960);
  const [tasksToDisplay, setTasksToDisplay] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusByTaskId, setStatusByTaskId] = useState({});

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError("");
      try {
        if (!currentUser || currentUser.uid === "dev") {
          if (mounted) setTasksToDisplay([]);
          return;
        }
        const details = await loadMitgliedDetails();
        const ownName = normalizeName(`${details?.Vorname ?? ""}${details?.Nachname ?? ""}`);
        if (!ownName) {
          if (mounted) setTasksToDisplay([]);
          return;
        }

        const results = await Promise.all(
          VMI_TABLES.map(async ({ table, label }) => {
            const { data, error: tableError } = await supabase.from(table).select("*").order("id");
            if (tableError) throw tableError;
            return (data ?? [])
              .filter((row) => row.Bereich !== "Organisation")
              .filter((row) => splitPeople(row["V-Verantwortlich"]).some((person) => normalizeName(person) === ownName))
              .map((row) => ({
                id: `${table}-${row.id}`,
                table,
                rowId: row.id,
                text: `${row.Bereich}: ${row.Aufgabenbeschreibung || "Keine Aufgabenbeschreibung"}`,
                status: row[STATUS_COLUMN] || "offen",
                datum: "",
                info: label,
              }));
          })
        );
        if (mounted) setTasksToDisplay(results.flat());
      } catch (loadError) {
        if (mounted) setError(`Aufgaben konnten nicht geladen werden: ${loadError?.message ?? "Unbekannter Fehler"}`);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.uid, currentUser?.email]);

  useEffect(() => {
    setStatusByTaskId(buildStatusMap(tasksToDisplay));
  }, [tasksToDisplay]);

  async function changeStatus(task, nextStatus) {
    const previous = statusByTaskId[task.id];
    setStatusByTaskId((prev) => ({ ...prev, [task.id]: nextStatus }));
    const { data, error: updateError } = await supabase
      .from(task.table)
      .update({ [STATUS_COLUMN]: nextStatus })
      .eq("id", task.rowId)
      .select("id");
    if (updateError || !data?.length) {
      setStatusByTaskId((prev) => ({ ...prev, [task.id]: previous }));
      setError(`Status konnte nicht gespeichert werden: ${updateError?.message ?? "Keine Berechtigung"}`);
    } else {
      setError("");
    }
  }

  return (
    <div style={pageContainerStyle(isMobile)}>
      <div style={pageHeaderCardStyle}>
        <h2 style={{ margin: 0, color: "#9f1239" }}>Meine Aufgaben</h2>
        <p style={{ margin: "8px 0 0 0", color: "#6b7280", lineHeight: 1.5 }}>
          Hier siehst du alle aktuell zugewiesenen Tätigkeiten aus den internen Veranstaltungen, die deinem Namen zugeordnet sind.
        </p>
      </div>

      {error && <p role="alert" style={{ color: "#b91c1c" }}>{error}</p>}
      {loading ? (
        <div style={taskCardStyle}>Aufgaben werden geladen …</div>
      ) : tasksToDisplay.length === 0 ? (
        <div style={taskCardStyle}>
          <h3 style={{ marginTop: 0, color: "#111827" }}>Aktuell keine zugewiesenen Aufgaben</h3>
          <p style={{ marginBottom: 0, color: "#6b7280", lineHeight: 1.6 }}>
            Sobald dir Aufgaben in Vorbereitung, Aufbau oder Abbau zugewiesen werden, erscheinen sie hier personalisiert.
          </p>
        </div>
      ) : (
        <div style={taskListStyle}>
          {tasksToDisplay.map((task) => {
            const currentStatus = statusByTaskId[task.id] ?? task.status ?? "offen";
            const statusStyle = STATUS_STYLE_BY_VALUE[currentStatus] ?? STATUS_STYLE_BY_VALUE.offen;

            return (
              <div key={task.id} style={taskCardStyle}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: isMobile ? "flex-start" : "center",
                    gap: 12,
                    flexDirection: isMobile ? "column" : "row",
                    marginBottom: 14,
                  }}
                >
                  <h3 style={{ margin: 0, color: "#111827" }}>{task.text}</h3>
                  <label style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#374151", fontSize: isMobile ? 12 : 14 }}>
                    <span>Status:</span>
                    <select
                      value={currentStatus}
                      onChange={(event) => changeStatus(task, event.target.value)}
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
                </div>

                <div style={{ display: "grid", gap: 8, color: "#374151", fontSize: isMobile ? 13 : 14 }}>
                  <TaskMetaRow label="Datum" value={task.datum} isMobile={isMobile} />
                  <TaskMetaRow label="Info" value={task.info} isMobile={isMobile} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TaskMetaRow({ label, value, isMobile }) {
  return (
    <div style={taskMetaRowStyle(isMobile)}>
      <span style={taskMetaLabelStyle}>{label}:</span>
      <span style={taskMetaValueStyle}>{value || "—"}</span>
    </div>
  );
}

function normalizeName(value) {
  return String(value ?? "").replace(/\s+/g, "").toLocaleLowerCase("de-DE");
}

function splitPeople(value) {
  if (!value || value === "-") return [];
  return String(value).split(/[,\n]/).map((person) => person.trim()).filter(Boolean);
}

function buildStatusMap(tasks) {
  return tasks.reduce((statusMap, task) => {
    statusMap[task.id] = task.status || "offen";
    return statusMap;
  }, {});
}
