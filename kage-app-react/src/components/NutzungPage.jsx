import React from "react";

const pageStyle = {
  background: "white",
  borderRadius: 16,
  padding: 24,
  maxWidth: 800,
  margin: "32px auto",
  boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
  fontFamily: "Century Gothic, Segoe UI, Roboto, sans-serif",
};

export default function NutzungPage() {
  return (
    <div style={pageStyle}>
      <h2>Bedienungsanleitung der App</h2>
      <ol style={{ lineHeight: 1.7, fontSize: 18, paddingLeft: 24, textAlign: 'left' }}>
        <li>
          <b>Anmelden:</b> Gib deine Zugangsdaten auf der Login-Seite ein. Bei Problemen wende dich an den Vorstand.
        </li>
        <li>
          <b>Navigation:</b> Nutze die linke Seitenleiste, um zwischen den Bereichen wie Veranstaltungen, Verein, Finanzen und Allgemein zu wechseln.
        </li>
        <li>
          <b>Allgemein:</b> Hier findest du wichtige Dokumente, Anleitungen, ToDos und die App-Dokumentation.
        </li>
        <li>
          <b>Böck-Feedback:</b> Sende Feedback oder Rechnungen direkt an den Vorstand. Bei Rechnungen bitte den Betrag und einen Anhang angeben.
        </li>
        <li>
          <b>Veranstaltungen:</b> Sieh dir interne und externe Termine an. Details zu Aufgaben, Zeiten und Orten findest du in den jeweiligen Unterpunkten.
        </li>
        <li>
          <b>Gruppen & Verein:</b> Informiere dich über die einzelnen Gruppen, Mitglieder und Dokumente des Vereins.
        </li>
        <li>
          <b>Persönliche Einstellungen:</b> Über das Profil-Icon kannst du deine persönlichen Daten und Einstellungen anpassen.
        </li>
        <li>
          <b>Abmelden:</b> Klicke auf das Logout-Symbol unten in der Seitenleiste, um dich sicher abzumelden.
        </li>
      </ol>
      <p style={{ color: "#6b7280", marginTop: 32 }}>
        Bei Fragen oder Problemen wende dich bitte an den Vorstand oder die Administratoren.
      </p>
    </div>
  );
}
