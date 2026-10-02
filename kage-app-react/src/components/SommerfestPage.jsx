import { useEffect, useState } from "react";
import AufbauAbbauPage from "./AufbauAbbauPage";
import { useIsMobile } from "../hooks/useIsMobile";
import { useAuth } from "../context/useAuth";
import { supabase } from "../supabase/supabaseConfig";
import interneVeranstaltungen from "../data/interneVeranstaltungen";

const STATUS_COLUMN = "Status Abarbeitung";
const STATUS_OPTIONS = ["", "offen", "in Arbeit", "abgeschlossen"];

const pageStyle = {
  padding: "24px",
  paddingBottom: "60px",
  width: "100%",
  boxSizing: "border-box",
};

const headerStyle = {
  marginBottom: "20px",
  padding: "20px 24px",
  borderRadius: "20px",
  background: "linear-gradient(135deg, #fff7ed 0%, #ffffff 100%)",
  border: "1px solid #fed7aa",
  boxShadow: "0 10px 24px rgba(185, 28, 28, 0.06)",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "20px",
  alignItems: "start",
};

export default function SommerfestPage() {
  return (
    <InternalVmiEventPage
      title="Sommerfest"
      tableName="VMI-Sommerfest"
      eventDetails={interneVeranstaltungen.sommerfest.veranstaltung}
    />
  );
}

export function InternalVmiEventPage({ title, tableName, eventDetails }) {
  const isMobile = useIsMobile(960);
  const { currentUser } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadVmiRows() {
      setLoading(true);
      setLoadError("");

      try {
        if (currentUser?.uid === "dev") {
          throw new Error("Der lokale Entwickler-Login hat keine Supabase-Sitzung. Bitte mit einem Supabase-Benutzer anmelden, um die VMI-Matrix zu laden.");
        }
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (!sessionData.session) {
          throw new Error("Keine Supabase-Sitzung gefunden. Bitte mit einem Supabase-Benutzer anmelden.");
        }

        const { data, error } = await supabase.from(tableName).select("*").order("id");
        if (error) throw error;
        if (!Array.isArray(data)) {
          throw new Error(`Die Tabelle "${tableName}" hat keine gültige Datenliste geliefert.`);
        }
        if (data.length === 0) {
          throw new Error(`Supabase hat 0 Zeilen aus public."${tableName}" zurückgegeben. Prüfe, ob die Tabelle Daten enthält und eine SELECT-RLS-Policy für angemeldete Nutzer besteht.`);
        }

        const mappedRows = data.map(mapVmiRow);
        if (mounted) setRows(mappedRows);
      } catch (error) {
        console.error(`Fehler beim Laden der Tabelle ${tableName}:`, error);
        if (mounted) setLoadError(`Die VMI-Matrix für ${title} konnte nicht geladen werden: ${error.message}`);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadVmiRows();
    return () => {
      mounted = false;
    };
  }, [currentUser?.uid, tableName, title]);

  const organisationRow = rows.find((row) => row.Bereich === "Organisation");
  const taskRows = rows.filter((row) => row.Bereich !== "Organisation");
  const organisationTasks = [
    ...(organisationRow
      ? [{
          text: organisationRow.Aufgabenbeschreibung || "Keine Aufgabenbeschreibung",
        }]
      : []),
    ...taskRows.map((row) => row.Bereich).filter(Boolean),
  ];
  const organisationOwners = splitPeople(organisationRow?.["V-Verantwortlich"]);
  const tasks = taskRows.map((row) => ({
    id: row.id,
    text: `${row.Bereich}: ${row.Aufgabenbeschreibung || "Keine Aufgabenbeschreibung"}`,
    verantwortlich: splitPeople(row["V-Verantwortlich"]),
    mitwirkend: splitPeople(row["M-Mitwirkend"]),
    informierend: splitPeople(row["I-Information"]),
    status: row[STATUS_COLUMN] ?? "",
    statusOptions: STATUS_OPTIONS,
  }));

  async function updateTaskStatus(task, status) {
    setSaveError("");
    const statusValue = status === "" ? null : status;
    const { data, error } = await supabase
      .from(tableName)
      .update({ [STATUS_COLUMN]: statusValue })
      .eq("id", task.id)
      .select("id")
      .single();

    if (error) {
      console.error(`Fehler beim Aktualisieren des Status in ${tableName}:`, error);
      setSaveError(`Der Status für „${task.text}“ konnte nicht gespeichert werden: ${error.message}`);
      throw error;
    }
    if (!data) {
      const missingRowError = new Error("Der Matrix-Eintrag wurde nicht gefunden.");
      setSaveError(`Der Status für „${task.text}“ konnte nicht gespeichert werden: ${missingRowError.message}`);
      throw missingRowError;
    }

    setRows((currentRows) => currentRows.map((row) => (
      row.id === task.id ? { ...row, [STATUS_COLUMN]: statusValue } : row
    )));
  }

  if (loading) {
    return <div style={{ padding: isMobile ? 12 : 24 }}>Sommerfest-Matrix wird geladen…</div>;
  }

  if (loadError) {
    return (
      <div style={{ padding: isMobile ? 12 : 24 }}>
        <p role="alert" style={{ color: "#b91c1c" }}>{loadError}</p>
      </div>
    );
  }

  return (
    <div style={{ ...pageStyle, padding: isMobile ? 12 : 24 }}>
      <div style={headerStyle}>
        <h2 style={{ margin: 0, color: "#9f1239" }}>{title}</h2>
        <p style={{ margin: "8px 0 0 0", color: "#6b7280", lineHeight: 1.5 }}>
          Veranstaltungsdaten und Aufgaben aus der Supabase-VMI-Matrix.
        </p>
      </div>

      {saveError && <p role="alert" style={{ color: "#b91c1c" }}>{saveError}</p>}

      <div style={gridStyle}>
        <AufbauAbbauPage data={eventDetails} typ="Veranstaltung" embedded />
        <AufbauAbbauPage
          data={{ verantwortliche: organisationOwners, aufgaben: organisationTasks }}
          typ="Organisation"
          embedded
        />
        <AufbauAbbauPage
          data={{ aufgaben: tasks }}
          typ="Aufgaben"
          embedded
          onTaskStatusChange={updateTaskStatus}
        />
      </div>
    </div>
  );
}

function mapVmiRow(row) {
  const mappedRow = {
    id: getColumnValue(row, "id"),
    Bereich: getColumnValue(row, "Bereich"),
    "V-Verantwortlich": getColumnValue(row, "V-Verantwortlich"),
    "M-Mitwirkend": getColumnValue(row, "M-Mitwirkend"),
    "I-Information": getColumnValue(row, "I-Information"),
    Aufgabenbeschreibung: getColumnValue(row, "Aufgabenbeschreibung"),
    [STATUS_COLUMN]: getColumnValue(row, STATUS_COLUMN),
  };

  if (mappedRow.id === null || mappedRow.id === undefined) {
    throw new Error('In der Sommerfest-Matrix fehlt bei mindestens einem Eintrag die Spalte "id".');
  }
  if (mappedRow[STATUS_COLUMN] !== null && !STATUS_OPTIONS.includes(mappedRow[STATUS_COLUMN])) {
    throw new Error(`Die Spalte "${STATUS_COLUMN}" darf nur NULL, „offen“, „in Arbeit“ oder „abgeschlossen“ enthalten.`);
  }
  if (typeof mappedRow.Bereich !== "string") {
    throw new Error('Die Spalte "Bereich" der Sommerfest-Matrix fehlt oder ist ungültig.');
  }

  return mappedRow;
}

function getColumnValue(row, columnName) {
  const matchingKey = Object.keys(row).find(
    (key) => key.trim().toLocaleLowerCase("de-DE") === columnName.toLocaleLowerCase("de-DE")
  );
  return matchingKey ? row[matchingKey] : undefined;
}

function splitPeople(value) {
  if (!value || value === "-") return [];
  return String(value)
    .split(/[,\n]/)
    .map((person) => person.trim())
    .filter(Boolean);
}
