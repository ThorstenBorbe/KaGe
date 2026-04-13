import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import interneVeranstaltungen from "../data/interneVeranstaltungen";
import { useIsMobile } from "../hooks/useIsMobile";

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
  const { currentUser, hasRole } = useAuth();
  const isMobile = useIsMobile(960);
  const userNames = buildUserNameCandidates(currentUser);
  const assignedTasks = collectAssignedTasks(userNames);
  const tasksToDisplay = sortTasksByDate(hasRole("admin")
    ? [...ADMIN_DUMMY_TASKS, ...assignedTasks]
    : assignedTasks);
  const [statusByTaskId, setStatusByTaskId] = useState(() => buildStatusMap(tasksToDisplay));

  useEffect(() => {
    setStatusByTaskId(buildStatusMap(tasksToDisplay));
  }, [tasksToDisplay]);

  return (
    <div style={pageContainerStyle(isMobile)}>
      <div style={pageHeaderCardStyle}>
        <h2 style={{ margin: 0, color: "#9f1239" }}>Meine Aufgaben</h2>
        <p style={{ margin: "8px 0 0 0", color: "#6b7280", lineHeight: 1.5 }}>
          Hier siehst du alle aktuell zugewiesenen Tätigkeiten aus den internen Veranstaltungen, die deinem Namen zugeordnet sind.
        </p>
      </div>

      {tasksToDisplay.length === 0 ? (
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
                      onChange={(event) => {
                        const nextStatus = event.target.value;
                        setStatusByTaskId((prev) => ({ ...prev, [task.id]: nextStatus }));
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

function buildUserNameCandidates(currentUser) {
  if (!currentUser) return [];

  const names = [
    currentUser.name,
    [currentUser.vorname, currentUser.nachname].filter(Boolean).join(" "),
  ]
    .map((value) => value?.trim())
    .filter(Boolean)
    .map((value) => value.toLowerCase());

  return Array.from(new Set(names));
}

function collectAssignedTasks(userNames) {
  if (userNames.length === 0) return [];

  return Object.entries(interneVeranstaltungen).flatMap(([eventKey, eventData]) => {
    const eventLabel = INTERNAL_EVENT_LABELS[eventKey] || eventKey;

    return INTERNAL_EVENT_PHASES.flatMap((phase) => {
      const phaseData = eventData[phase.key];
      if (!phaseData?.aufgaben?.length) return [];

      return phaseData.aufgaben
        .filter((task) => isAssignedToUser(task, userNames))
        .map((task, index) => ({
          id: `${eventKey}-${phase.key}-${index}`,
          text: getTaskLabel(task),
          status: task.status || "offen",
          datum: phaseData.datum || "",
          info: buildTaskInfo(eventLabel, phase.label, phaseData),
        }));
    });
  });
}

function isAssignedToUser(task, userNames) {
  if (!task || typeof task !== "object") return false;

  const responsible = task.verantwortlich ?? task.verantwortliche;
  const responsibleNames = Array.isArray(responsible) ? responsible : [responsible];

  return responsibleNames
    .filter(Boolean)
    .map((name) => String(name).trim().toLowerCase())
    .some((name) => userNames.includes(name));
}

function getTaskLabel(task) {
  return task?.text || task?.aufgabe || task?.titel || "Ohne Bezeichnung";
}

function buildTaskInfo(eventLabel, phaseLabel, phaseData) {
  const location = phaseData?.ort ? `Ort: ${phaseData.ort}` : "Ort wird noch abgestimmt";
  const time = phaseData?.uhrzeit || phaseData?.treffzeit || "Zeit folgt";
  return `${eventLabel} (${phaseLabel}) koordinieren. ${location}. Zeit: ${time}.`;
}

function buildStatusMap(tasks) {
  return tasks.reduce((statusMap, task) => {
    statusMap[task.id] = task.status || "offen";
    return statusMap;
  }, {});
}

function sortTasksByDate(tasks) {
  return [...tasks].sort((taskA, taskB) => parseDateValue(taskA.datum) - parseDateValue(taskB.datum));
}

function parseDateValue(dateString) {
  if (!dateString) return Number.MAX_SAFE_INTEGER;

  const [day, month, year] = String(dateString).split(".").map((value) => Number.parseInt(value, 10));
  if (!day || !month || !year) return Number.MAX_SAFE_INTEGER;

  return new Date(year, month - 1, day).getTime();
}

const INTERNAL_EVENT_PHASES = [
  { key: "vorbereitung", label: "Vorbereitung" },
  { key: "aufbau", label: "Aufbau" },
  { key: "abbau", label: "Abbau" },
];

const INTERNAL_EVENT_LABELS = {
  "11-11": "11.11. Jetzt geht los",
  "prunksitzung-1": "1. Prunksitzung",
  "prunksitzung-2": "2. Prunksitzung",
  "bunter-nachmittag": "Bunter Nachmittag",
  "beatbox-party": "Beat-Bocks-Party",
  kinderfasching: "Kinderfasching",
  kehraus: "Kehraus",
};

const ADMIN_DUMMY_TASKS = [
  {
    id: "admin-dummy-1",
    text: "Hallenbuchung bei der Gemeinde fuer die Session 2026/2027",
    status: "offen",
    datum: "14.04.2026",
    info: "Buergerbuero und Buergermeister per Email kontaktieren (Email: dddd@dddd.de).",
  },
  {
    id: "admin-dummy-2",
    text: "Wurfmaterial fuer Faschingszug organisieren",
    status: "in Arbeit",
    datum: "18.04.2026",
    info: "Bestand im Lager pruefen, fehlende Artikel bei Lieferant anfragen und Budget mit dem Vorstand abstimmen.",
  },
  {
    id: "admin-dummy-3",
    text: "Security organisieren fuer BBP",
    status: "abgeschlossen",
    datum: "20.04.2026",
    info: "Angebote von zwei Sicherheitsdiensten eingeholt und Einsatzzeit fuer Einlass und Saalschutz abgestimmt.",
  },
];