# KaGe Zell App – Technische Dokumentation

**Version:** v0.0.4  
**Datum:** April 2026  
**Technologie-Stack:** React (Vite), Firebase (Auth, Firestore, Storage)

---

## Inhaltsverzeichnis

1. [Projektstruktur](#1-projektstruktur)
2. [Einstiegspunkt & Konfiguration](#2-einstiegspunkt--konfiguration)
3. [Firebase-Konfiguration](#3-firebase-konfiguration)
4. [AuthContext – Authentifizierung & Rollen](#4-authcontext--authentifizierung--rollen)
5. [App.jsx – Hauptkomponente & Navigation](#5-appjsx--hauptkomponente--navigation)
6. [Hooks](#6-hooks)
7. [Komponenten](#7-komponenten)
   - [LoginPage](#loginpage)
   - [PrivacyConsentPage](#privacyconsentpage)
   - [UebersichtPage](#uebersichtpage)
   - [KalenderPage](#kalenderpage)
   - [GroupPage](#grouppage)
   - [VorstandsPage](#vorstandspage)
   - [EthikkommiteePage](#ethikkommiteepage)
   - [KaGeCartaPage](#kagecartapage)
   - [AhndungPage](#ahndungpage)
   - [MeldungPage](#meldungpage)
   - [BoeckFeedbackPage](#boeckfeedbackpage)
   - [AufbauAbbauPage](#aufbauabbaupage)
   - [ExterneVeranstaltungPage](#externeveanstaltungpage)
   - [FaschingszugPage](#faschingszugpage)
   - [FinanzPage](#finanzpage)
   - [ZugaengePage](#zugaengepage)
   - [DatenschutzPage](#datenschutzpage)
   - [EinstellungenPage](#einstellungenpage)
   - [AdminPage](#adminpage)
8. [Datendateien](#8-datendateien)
9. [Rollen & Berechtigungen](#9-rollen--berechtigungen)
10. [Menüstruktur (appTree)](#10-menüstruktur-apptree)
11. [Offene Punkte (ToDos)](#11-offene-punkte-todos)

---

## 1. Projektstruktur

```
src/
├── App.jsx                        # Hauptkomponente, Navigation, Routing
├── App.css                        # Globale App-Styles
├── index.css                      # Basis-CSS
├── main.jsx                       # Einstiegspunkt, AuthProvider-Wrapping
├── assets/
│   └── Logo/                      # KaGe Zell Logo (PNG)
├── components/                    # Alle Seiten-Komponenten (eine pro Menüpunkt)
├── context/
│   └── AuthContext.jsx            # Authentifizierung, Rollen, Datenschutzzustimmung
├── data/                          # Statische Stammdaten als JS-Module
├── firebase/
│   └── firebaseConfig.js          # Firebase-Initialisierung (Auth, Firestore, Storage)
├── hooks/
│   └── useFirebaseData.js         # Custom Hook: JSON aus Firebase Storage laden
└── styles/
    └── fonts.css                  # Schriftarten-Definitionen
```

---

## 2. Einstiegspunkt & Konfiguration

### `main.jsx`

Einstiegspunkt der React-Anwendung.

- Rendert `<App />` in den DOM-Knoten `#root`
- Umschließt die gesamte Anwendung mit `<AuthProvider>`, damit alle Komponenten auf den Auth-Kontext zugreifen können
- Verwendet `StrictMode` für Entwicklungswarnungen

---

## 3. Firebase-Konfiguration

### `firebase/firebaseConfig.js`

Initialisiert die Firebase-App und exportiert die drei genutzten Dienste:

| Export | Dienst | Verwendung |
|--------|--------|-----------|
| `db` | Firestore | Nutzerdaten, App-Einstellungen (Session) |
| `auth` | Firebase Auth | Login, Registrierung, Passwort-Reset |
| `storage` | Firebase Storage | JSON-Dateien mit Vereinsdaten |

**Firebase-Projekt:** `kage-zell`

---

## 4. AuthContext – Authentifizierung & Rollen

### `context/AuthContext.jsx`

Zentraler Kontext für Authentifizierung und Rollenverwaltung.

#### Rollen-Hierarchie

```
gast < mitglied < trainer < vorstand < admin
```

Rollen werden in **Firestore** unter `users/{uid}.role` gespeichert. Höhere Rollen schließen alle niedrigeren Berechtigungen ein.

#### Zustände im Context

| State | Typ | Bedeutung |
|-------|-----|-----------|
| `currentUser` | `{uid, name}` | Eingeloggter Nutzer (oder `null`) |
| `userRole` | `string` | Aktuelle Rolle des Nutzers |
| `privacyAccepted` | `boolean` | Datenschutzzustimmung für aktuelle Policy-Version |
| `privacyBusy` | `boolean` | Ladeindikator beim Speichern der Zustimmung |
| `loading` | `boolean` | Initial-Ladevorgang (Firebase Auth-Initialisierung) |

#### Bereitgestellte Funktionen

| Funktion | Beschreibung |
|----------|-------------|
| `login(email, password)` | Firebase-Anmeldung per E-Mail/Passwort |
| `register(name, email, password)` | Registrierung + Firestore-Dokument anlegen (`role: "mitglied"`) |
| `resetPassword(email)` | Passwort-Reset-E-Mail senden |
| `logout()` | Abmelden (Firebase Auth oder Dev-Mode-Reset) |
| `devLogin()` | Entwickler-Login ohne Firebase (Rolle: `admin`, Datenschutz: akzeptiert) |
| `acceptPrivacyConsent()` | Datenschutzzustimmung in Firestore speichern |
| `hasRole(requiredRole)` | Prüft ob Nutzer mindestens die angegebene Rolle hat |
| `privacyPolicyStand` | Datum der aktuellen Datenschutzrichtlinie |

#### Datenschutz-Versionierung

```js
const PRIVACY_POLICY_VERSION = "2026-05-10";
const PRIVACY_POLICY_STAND   = "10.05.2026";
```

Bei jedem Login wird geprüft, ob der Nutzer die aktuelle Version akzeptiert hat. Falls nicht, wird `PrivacyConsentPage` angezeigt, bevor der Nutzer die App nutzen kann.

#### Firestore-Struktur: `users/{uid}`

```json
{
  "name": "Max Mustermann",
  "email": "max@example.de",
  "role": "mitglied",
  "privacyConsent": {
    "accepted": true,
    "version": "2026-05-10",
    "stand": "10.05.2026",
    "acceptedAt": "2026-04-03T10:00:00.000Z"
  }
}
```

---

## 5. App.jsx – Hauptkomponente & Navigation

### Aufgaben

- **Auth-Guard:** Zeigt `LoginPage` wenn kein Nutzer eingeloggt ist
- **Privacy-Guard:** Zeigt `PrivacyConsentPage` wenn Datenschutz nicht akzeptiert
- **Session-Verwaltung:** Aktuelle Saison (z.B. `"Session 2026/2027"`) wird in Firestore (`appSettings/session`) gespeichert und per `onSnapshot` live synchronisiert
- **Seitennavigation:** Zustandsbehaftetes Routing via `active`-State (kein React Router)
- **Menü-Rendering:** Hierarchisches Menü (3–4 Ebenen tief) mit Auf-/Zuklappen per `openMenus`-State
- **`renderContent()`:** Gibt basierend auf `active` die passende Komponente zurück

### Konstanten

| Konstante | Wert | Beschreibung |
|-----------|------|-------------|
| `APP_VERSION` | `"v0.0.4"` | Wird im Sidebar-Footer angezeigt |
| `SESSION_OPTIONS` | Array | Auswählbare Saisons (2026/27 – 2029/30) |
| `MENU_ROLES` | Objekt | Definiert Mindest-Rollen für Menüpunkte |

### Menü-Rollen-Beschränkungen

```js
const MENU_ROLES = {
  finanzen:         "vorstand",  // Nur Vorstand+ sieht Finanzen
  zugaenge:         "vorstand",  // Nur Vorstand+ sieht Zugänge
  mitglieder:       "mitglied",
  nutzerverwaltung: "admin",     // Nur Admin sieht Nutzerverwaltung
};
```

### Layout

```
┌────────────────────┬───────────────────────────────────────────┐
│  Sidebar (300px)   │  Main Content (flex: 1)                    │
│  Rot (#b91c1c)     │  Hellgrau (#f3f4f6)                        │
│  - Logo            │  - Seitentitel (h1)                        │
│  - Session-Auswahl │  - Aktive Komponente (renderContent)       │
│  - Navigation      │  - Scroll-to-Top Button (fixiert)         │
│  - Einstellungen   │                                            │
│  - Abmelden        │                                            │
└────────────────────┴───────────────────────────────────────────┘
```

---

## 6. Hooks

### `hooks/useFirebaseData.js`

Custom Hook zum Laden von JSON-Dateien aus Firebase Storage.

```js
const { data, loading, error } = useFirebaseData("externeVeranstaltungen.json");
```

#### Parameter

| Parameter | Typ | Beschreibung |
|-----------|-----|-------------|
| `filename` | `string` | Dateiname in Firebase Storage unter `daten/` |

#### Rückgabe

| Wert | Typ | Beschreibung |
|------|-----|-------------|
| `data` | `any` | Geparste JSON-Daten oder `null` |
| `loading` | `boolean` | `true` solange Daten geladen werden |
| `error` | `string\|null` | Fehlermeldung oder `null` |

**Hinweis:** Dateien liegen in Firebase Storage unter dem Pfad `daten/{filename}`.

---

## 7. Komponenten

### LoginPage

**Datei:** `components/LoginPage.jsx`

Login-Seite der App – wird angezeigt wenn kein Nutzer eingeloggt ist.

**Drei Modi:**

| Modus | Beschreibung |
|-------|-------------|
| `LOGIN` | E-Mail & Passwort Anmeldung |
| `REGISTER` | Neuer Account mit Name, E-Mail, Passwort (+ Wiederholung) |
| `FORGOT` | Passwort-Reset per E-Mail |

- Im Entwicklungsmodus (`import.meta.env.DEV`) wird ein **Dev-Login-Button** angezeigt
- Firebase-Fehlercodes werden in lesbare deutsche Meldungen übersetzt
- Zentriertes weißes Card-Layout auf rotem Hintergrund mit KaGe-Logo

---

### PrivacyConsentPage

**Datei:** `components/PrivacyConsentPage.jsx`

Wird nach dem Login angezeigt, wenn der Nutzer die gültige Datenschutzerklärung noch nicht akzeptiert hat.

**Props:**

| Prop | Typ | Beschreibung |
|------|-----|-------------|
| `onAccept` | `function` | Callback nach Bestätigung (aus AuthContext) |
| `busy` | `boolean` | Ladeindikator während des Speichervorgangs |
| `stand` | `string` | Versionsdatum der Datenschutzrichtlinie |

- Scrollbares Dokument mit allen 8 Datenschutz-Abschnitten
- Checkbox muss aktiv sein, bevor der Bestätigungs-Button aktiv wird
- Enthält vollständigen DSGVO-konformen Text

---

### UebersichtPage

**Datei:** `components/UebersichtPage.jsx`

Interne ToDo-Liste für noch zu implementierende App-Funktionen.

- Zeigt 10 priorisierte Aufgaben für die Weiterentwicklung
- Hinweisbox: "Dies ist nur ein Merker für noch notwendige Aufgaben"

---

### KalenderPage

**Datei:** `components/KalenderPage.jsx`

Zeigt die nächsten 6 anstehenden Termine ab dem heutigen Datum.

- Liest Daten aus `data/kalenderTermine.js`
- Filtert vergangene Termine heraus
- Sortiert chronologisch
- Zeigt maximal 6 Termine
- Datum wird mit `Intl.DateTimeFormat` deutsch formatiert (Wochentag, TT.MM.JJJJ)
- Farbliche Unterscheidung: **Extern** (rot), **Intern** (grau)

---

### GroupPage

**Datei:** `components/GroupPage.jsx`

Generische Seite für alle Gruppen/Abteilungen.

**Props:**

| Prop | Typ | Beschreibung |
|------|-----|-------------|
| `group` | `object` | Gruppenobjekt aus den data/-Dateien |

**Angezeigte Bereiche:**
- **Ansprechpartner:** Name, Telefon, E-Mail
- **Trainingstermine / Sitzungstermine** (je nach Gruppentyp)
- Button "Training/Sitzung fällt aus" (nur für `vorstand`+)

Wird für folgende Gruppen verwendet:
- Rote Garde, Blaue Garde, Grüne Garde
- Zeller Böckli, Böck2Beat
- Zeller Böck Ballett (Männerballett)
- Zeller Daller Lacker, Büttenredner
- 11'n, Elferräte

---

### VorstandsPage

**Datei:** `components/VorstandsPage.jsx`

Zeigt Personen-Karten für alle Vorstandsmitglieder.

- Liest Daten aus `data/vorstandSchaft.js`
- Zeigt je Person: Bild, Rolle (rot), Name, E-Mail, Mobilnummer, Adresse
- Responsives Grid-Layout (`auto-fit, minmax(300px, 1fr)`)

---

### EthikkommiteePage

**Datei:** `components/EthikkommiteePage.jsx`

Zeigt die Mitglieder des Ethikkommitees.

- Liest Daten aus `data/ethikKommitee.js`
- Gleiche Karten-Struktur wie `VorstandsPage`
- Erklärender Einleitungstext über Aufgaben der Ethikkommission

---

### KaGeCartaPage

**Datei:** `components/KaGeCartaPage.jsx`

Zeigt die 14 Grundsätze der **KaGe-Carta** als nummerierte Liste.

- Werte des Vereins (Respekt, Zusammenhalt, Schutz, Fairness etc.)
- Abschlusssatz: "Die KaGe Zell ist mehr als eine Abteilung…"

---

### AhndungPage

**Datei:** `components/AhndungPage.jsx`

Platzhalter-Seite für das Ahndungsverfahren bei Regelverstößen.

- Hinweis, dass Inhalte im Workshop erarbeitet werden müssen
- Noch keine konkreten Inhalte

---

### MeldungPage

**Datei:** `components/MeldungPage.jsx`

Formular zum Einreichen einer Meldung an das Ethikkommitee.

**Felder:**
- Betreff/Kategorie: Verstoß gegen Verhaltensregeln / Konflikt zwischen Mitgliedern / Verstoß gegen KaGe-Carta / Sonstiges
- Freitext-Nachricht (max. 2000 Zeichen, Zeichenzähler)

**Status:** Sendet derzeit nur einen `alert`. E-Mail-Anbindung steht noch aus.

---

### BoeckFeedbackPage

**Datei:** `components/BoeckFeedbackPage.jsx`

Anonymes Feedback-Formular ("Böck-Feedback" = Kummerkasten).

**Felder:**
- Betreff/Kategorie: Kategorie 1–3 / Sonstiges (Kategorien noch zu definieren)
- Freitext-Nachricht (max. 2000 Zeichen, Zeichenzähler)

**Status:** Sendet derzeit nur einen `alert`. E-Mail-Anbindung steht noch aus.

---

### AufbauAbbauPage

**Datei:** `components/AufbauAbbauPage.jsx`

Zeigt Aufbau- oder Abbaupläne für interne Veranstaltungen.

**Props:**

| Prop | Typ | Beschreibung |
|------|-----|-------------|
| `data` | `object` | Aufbau- oder Abbaudiobjekt aus `interneVeranstaltungen.js` |
| `typ` | `"Aufbau" \| "Abbau"` | Bestimmt Titel und Icon |

**Abschnitte:**
- Zeitraum & Treffpunkt
- Verantwortliche (Liste)
- Aufgaben (Liste)
- Bemerkungen

---

### ExterneVeranstaltungPage

**Datei:** `components/ExterneVeranstaltungPage.jsx`

Detailseite für auswärtige Auftritte (Auswärtssitzungen, Seniorenheime).

**Props:**

| Prop | Typ | Beschreibung |
|------|-----|-------------|
| `veranstaltung` | `object` | Veranstaltungsobjekt aus `externeVeranstaltungen.js` |

**Abschnitte:**
- Treffpunkt & Uhrzeit
- Besuchter Verein (Name, Sitzungsbeginn, Adresse)
- Geschenk
- Fahrer
- Teilnehmer
- Mitbringsel der KaGe (Auftritte)

---

### FaschingszugPage

**Datei:** `components/FaschingszugPage.jsx`

Spezialisierte Seite für den Faschingszug.

**Props:**

| Prop | Typ | Beschreibung |
|------|-----|-------------|
| `veranstaltung` | `object` | Faschingszug-Objekt aus `externeVeranstaltungen.js` |

**Abschnitte:**
- Treffpunkt & Uhrzeit
- Fahrer
- Teilnehmer
- Wagenaufbau (Status/Info)
- Besorgung Wurfmaterial

---

### FinanzPage

**Datei:** `components/FinanzPage.jsx`

Platzhalter-Seite für die Finanzübersicht.

- Hinweis: "Finanzübersicht wird aktuell noch entwickelt"
- Sichtbar nur für Rolle `vorstand`+

---

### ZugaengePage

**Datei:** `components/ZugaengePage.jsx`

Platzhalter-Seite für Zugangsdaten und Anleitungen.

- Kurze Beschreibung des Cloud-Konzepts (Excel-Listen, Terminpflege)
- Zugangsdaten noch einzutragen
- Sichtbar nur für Rolle `vorstand`+

---

### DatenschutzPage

**Datei:** `components/DatenschutzPage.jsx`

Vollständige Datenschutzerklärung (jederzeit über das Menü abrufbar).

**Abschnitte (DSGVO-konform):**
1. Verantwortlicher (TG-Zell, KaGe-Abteilung)
2. Zweck der Verarbeitung
3. Verarbeitete Daten (Stammdaten, Nutzungsdaten, Organisations- und Inhaltsdaten)
4. Rechtsgrundlagen (Art. 6 DSGVO)
5. Empfänger – Google Firebase (Authentication, Firestore, Storage)
6. Speicherdauer
7. Rechte der betroffenen Personen
8. Datenschutz-Kontakt

---

### EinstellungenPage

**Datei:** `components/EinstellungenPage.jsx`

Persönliche Kontoeinstellungen des eingeloggten Nutzers.

**Drei expandierbare Bereiche:**

| Bereich | Felder | Aktion |
|---------|--------|--------|
| E-Mail ändern | Aktuelles Passwort, Neue E-Mail | Reauth → `updateEmail` + Firestore-Update |
| Telefonnummer | Neue Telefonnummer | `updateDoc` Firestore + `updateProfile` |
| Passwort ändern | Aktuelles PW, Neues PW (2×) | Reauth → `updatePassword` |

- Re-Authentifizierung wird vor sensiblen Änderungen erzwungen
- Firebase-Fehlercodes werden in lesbare deutsche Meldungen übersetzt
- Mindestlänge für Passwort: 6 Zeichen

---

### AdminPage

**Datei:** `components/AdminPage.jsx`

Nutzerverwaltung (nur für Rolle `admin` sichtbar).

**Funktionen:**
- Alle registrierten Nutzer aus Firestore laden
- Nutzer nach E-Mail durchsuchen (Filter)
- Rolle per Dropdown ändern (live-Update in Firestore)
- Firestore-Nutzereintrag löschen (mit Bestätigungs-Dialog)
- Hervorhebung ausstehender Freischaltungen (Rolle `pending`)

**Verfügbare Rollen:** `gast`, `mitglied`, `trainer`, `vorstand`, `admin`, `gesperrt`

**Farbcodierung der Rollen:**

| Rolle | Farbe |
|-------|-------|
| pending | Orange |
| gast | Grau |
| mitglied | Blau |
| trainer | Grün |
| vorstand | Gelb/Amber |
| admin | Rot |
| gesperrt | Schwarz |

---

## 8. Datendateien

Alle Datendateien unter `src/data/` sind statische JavaScript-Module.

| Datei | Inhalt |
|-------|--------|
| `roteGarde.js` | Ansprechpartner & Trainingstermine – Rote Garde |
| `blaueGarde.js` | Ansprechpartner & Trainingstermine – Blaue Garde |
| `grueneGarde.js` | Ansprechpartner & Trainingstermine – Grüne Garde |
| `boeckliGarde.js` | Ansprechpartner & Trainingstermine – Zeller Böckli |
| `boeck2Beat.js` | Ansprechpartner & Trainingstermine – Böck2Beat |
| `maennerBallett.js` | Ansprechpartner & Trainingstermine – Zeller Böck Ballett |
| `zellerDallerLacker.js` | Ansprechpartner & Trainingstermine – Zeller Daller Lacker |
| `buettenRedner.js` | Ansprechpartner & Termine – Büttenredner |
| `elfInnen.js` | Ansprechpartner & Sitzungstermine – 11'n |
| `elferRaete.js` | Ansprechpartner & Sitzungstermine – Elferräte |
| `ethikKommitee.js` | Mitglieder des Ethikkommitees (wie Vorstand-Struktur) |
| `vorstandSchaft.js` | Vorstandsmitglieder mit Bild, Rolle, Kontaktdaten, Adresse |
| `externeVeranstaltungen.js` | Externe Veranstaltungen (Auswärtssitzungen, Faschingszug, Seniorenheime) |
| `interneVeranstaltungen.js` | Interne Veranstaltungen mit Aufbau/Abbau-Daten |
| `kalenderTermine.js` | Alle Saisontermine mit Datum, Uhrzeit, Ort, Kategorie |

### Struktur `kalenderTermine.js`

```js
{
  id:        "prunksitzung-1",
  titel:     "1. Prunksitzung",
  datum:     "2027-01-16",        // ISO-Format YYYY-MM-DD
  uhrzeit:   "19:33",
  ort:       "Zell am Main",
  kategorie: "Intern" | "Extern"
}
```

### Struktur Gruppen-Datei (Beispiel `roteGarde.js`)

```js
{
  name: "Rote Garde",
  ansprechpartner: [
    { name: "…", telefon: "…", email: "…" }
  ],
  trainingstermine: [
    { tag: "…", uhrzeit: "…", ort: "…" }
  ]
}
```

### Struktur `externeVeranstaltungen.js`

```js
{
  "auswaerts-x": {
    treffpunkt: "…",
    treffpunktUhrzeit: "…",
    verein: { name: "…", sitzungsbeginn: "…", strasse: "…", plz: "…", ort: "…" },
    geschenk: "…",
    fahrer: ["…"],
    teilnehmer: ["…"],
    auftritte: ["…"]
  },
  "faschingszug": {
    treffpunkt: "…",
    treffpunktUhrzeit: "…",
    fahrer: ["…"],
    teilnehmer: ["…"],
    wagenaufbau: "…",
    wurfmaterial: "…"
  }
}
```

---

## 9. Rollen & Berechtigungen

| Bereich | Mindest-Rolle |
|---------|--------------|
| App-Zugang allgemein | mitglied (nach Datenschutz-Zustimmung) |
| Gruppen, Kalender, Veranstaltungen | mitglied |
| Training/Sitzung-Absage-Button | vorstand |
| Session-Auswahl ändern | vorstand |
| Finanzen | vorstand |
| Zugänge & Anleitungen | vorstand |
| Nutzerverwaltung | admin |

---

## 10. Menüstruktur (appTree)

```
├── ToDo's für die App
├── Kalender
├── Veranstaltungen
│   ├── Intern
│   │   ├── 11.11. Jetzt geht los
│   │   │   ├── Aufbau
│   │   │   └── Abbau
│   │   ├── 1. Prunksitzung  [Aufbau / Abbau]
│   │   ├── 2. Prunksitzung  [Aufbau / Abbau]
│   │   ├── Bunter Nachmittag  [Aufbau / Abbau]
│   │   ├── Beat-Bocks-Party  [Aufbau / Abbau]
│   │   ├── Kinderfasching  [Aufbau / Abbau]
│   │   └── Kehraus  [Aufbau / Abbau]
│   └── Extern
│       ├── 1. Auswärtssitzung (X)
│       ├── 2. Auswärtssitzung (Y)
│       ├── 3. Auswärtssitzung (Z)
│       ├── Faschingszug
│       └── Seniorenheime
├── Verein
│   ├── Vorstandschaft
│   ├── Gruppen
│   │   ├── Rote Garde
│   │   ├── Blaue Garde
│   │   ├── Grüne Garde
│   │   ├── Zeller Böckli
│   │   ├── Böck2Beat
│   │   ├── Zeller Böck Ballett
│   │   ├── Zeller Daller Lacker
│   │   ├── Büttenredner
│   │   ├── 11'n
│   │   └── Elferräte
│   └── Ethikkommitee
│       ├── Kommitee
│       ├── KaGe-Carta
│       ├── Ahndung
│       └── Meldung
├── Finanzen  [nur Vorstand+]
├── Zugänge & Anleitungen  [nur Vorstand+]
├── Böck-Feedback
├── Datenschutz
└── Nutzerverwaltung  [nur Admin]
```

---

## 11. Offene Punkte (ToDos)

Die folgenden Punkte sind noch nicht implementiert und müssen künftig erarbeitet werden:

1. **Ansprechpartner aus Cloud-Excel-Liste** laden (kein hardcodiertes JS-Modul)
2. **E-Mail-Anbindung** für Ethikkommitee (`MeldungPage`) und Kummerkasten (`BoeckFeedbackPage`)
3. **Cloud-Speicher** reservieren und alle Vereinsdaten dort ablegen
4. **VMI-Matrix** (Verantwortliche, Mitwirkende, Informierte) je Bereich definieren
5. **Personalisierte Übersicht** – was steht für den einzelnen Nutzer als nächstes an
6. **Datenbank für Termine** mit Bild-Upload (Aufbau-Fotos aus der Cloud abrufbar)
7. **GEMA-Automatisierung** – bei Termineintrag automatisch Anmelde-E-Mail versenden
8. **Protokolle** über App lesbar machen (Cloud-Anbindung)
9. **Workshop-Ideen** einarbeiten
10. **Session-Umschaltung** über Cloud – nur aktuelle Session für Nicht-Vorstand sichtbar

---

*Diese Dokumentation beschreibt den Code-Stand von Version v0.0.4 (April 2026).*
