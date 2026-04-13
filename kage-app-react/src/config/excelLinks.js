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
