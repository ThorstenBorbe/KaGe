import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseConfig";

// Menüpunkt (key) -> Wert in der Spalte "Veranstaltung" der Tabelle "Session JJ/JJ" (z. B. "Session 26/27")
export const EVENT_NAME_BY_KEY = {
  sommerfest: "Sommerfest",
  "11-11": "Rathaussturm",
  weihnachtsfeier: "Weihnachtsfeier",
  "prunksitzung-1": "1. Prunksitzung",
  "prunksitzung-2": "2. Prunksitzung",
  "bunter-nachmittag": "Bunter Nachmittag",
  "beatbox-party": "BBP",
  kinderfasching: "Kinderfasching",
  kehraus: "Kehraus",
  seniorenheime: "Seniorenheime",
  kindergarten: "Kindergartenbesuch",
  faschingszug: "Faschingszug",
};

export function sessionToTable(session) {
  const m = (session || "Session 2026/2027").match(/(\d{2})(\d{2})\s*\/\s*(\d{2})(\d{2})/);
  return m ? `Session_${m[2]}_${m[4]}` : session;
}

function formatDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value ?? ""));
  return match ? `${match[3]}.${match[2]}.${match[1]}` : (value ?? "");
}

function formatTime(value) {
  return String(value ?? "").replace(/(\d{1,2}:\d{2}):\d{2}(\.\d+)?/g, "$1");
}

const EMPTY_EVENT = { wochentag: "", datum: "", treffpunkt: "", ort: "", uhrzeit: "" };

// Lädt Wochentag, Datum, Treffpunkt, Ort (Adresse) und Beginn (Uhrzeit) der Veranstaltung
export function useEventTermin(eventKey, sessionValue) {
  const [eventData, setEventData] = useState(EMPTY_EVENT);

  useEffect(() => {
    let mounted = true;
    const name = EVENT_NAME_BY_KEY[eventKey];

    async function load() {
      if (!name) {
        setEventData(EMPTY_EVENT);
        return;
      }
      try {
        const { data, error } = await supabase
          .from(sessionToTable(sessionValue))
          .select("*")
          .ilike("Veranstaltung", `%${name}%`)
          .order("Datum", { ascending: true })
          .limit(1);
        if (error) throw error;
        const row = data?.[0];
        if (mounted) {
          setEventData(row
            ? {
                wochentag: row.Wochentag ?? "",
                datum: formatDate(row.Datum),
                treffpunkt: formatTime(row.Treffpunkt),
                ort: row.Adresse ?? "",
                uhrzeit: formatTime(row.Uhrzeit),
              }
            : EMPTY_EVENT);
        }
      } catch (err) {
        console.warn("Veranstaltungsdaten konnten nicht geladen werden:", err);
        if (mounted) setEventData(EMPTY_EVENT);
      }
    }

    load();
    return () => { mounted = false; };
  }, [eventKey, sessionValue]);

  return eventData;
}
