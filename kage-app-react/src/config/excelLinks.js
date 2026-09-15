/**
 * Zentrale Konfiguration aller Excel-Listen-Links.
 *
 * ZUGRIFFSRECHTE:
 *  - gruppen.*   → wird in der jeweiligen Gruppenpage angezeigt
 *                  (Sichtbarkeit dort auf Vorstand/Admin beschränkt)
 *  - mitglieder  → nur Vorstand & Admin (ListenPage)
 *  - sponsoren   → nur Vorstand & Admin (ListenPage)
 *  - ehrensenatoren → nur Vorstand & Admin (ListenPage)
 *
 * Trage hier die tatsächlichen URLs zu deinen Excel-/Tabellendateien ein.
 * Lasse den Wert als leeren String (""), wenn die Liste noch nicht existiert.
 */

export const EXCEL_LINKS = {
  // ── Gruppen-spezifische Mitgliederlisten ────────────────────────────────────
  gruppen: {
    "rote-garde":    "",
    "blaue-garde":   "",
    "gruene-garde":  "",
    "boeckli-garde": "",
    boeck2beat:      "",
    maennerballett:  "",
    zdl:             "",
    buettenredner:   "",
    elfinnen:        "",
    elferraete:      "",
  },

  // ── Vereinsweite Listen (nur Vorstand & Admin) ──────────────────────────────
  mitglieder:      "",
  sponsoren:       "",
  ehrensenatoren:  "",
};

// ── Supabase Dashboard-Links (Table Editor) ────────────────────────────────────
// Format: https://supabase.com/dashboard/project/{project-ref}/editor/{table-oid}
// Die Table-OIDs findest du im Supabase Table Editor in der URL,
// sobald du die jeweilige Tabelle aufrufst (Zahl am Ende der URL).
// Solange keine OID bekannt ist, wird der allgemeine Table-Editor geöffnet.
const SUPABASE_PROJECT = "zbdaoewookiyzojoostw";
const SUPABASE_EDITOR_BASE = `https://supabase.com/dashboard/project/${SUPABASE_PROJECT}/editor`;

export const SUPABASE_LINKS = {
  mitglieder:      `${SUPABASE_EDITOR_BASE}`, // Tabellen-OID ergänzen: .../editor/12345
  sponsoren:       `${SUPABASE_EDITOR_BASE}`, // Tabellen-OID ergänzen: .../editor/12346
  ehrensenatoren:  `${SUPABASE_EDITOR_BASE}`, // Tabellen-OID ergänzen: .../editor/12347
};
