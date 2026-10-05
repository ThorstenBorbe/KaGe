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
          <b>Anmelden:</b> 
          <br /> 
          Gib Deine Zugangsdaten auf der Login-Seite ein. Bei Problemen wende dich an den Vorstand.
          <br /><br />
        </li>

        <li>
          <b>Widget:</b> 
          <br /> 
          Um nicht immer über den Internet Explorer oder z.B. Safari gehen zu müssen, hast Du die Möglichkeit den Zugriff auf die WebApp
          wie bei einer normalen App über ein Icon zu öffnen.
          Die Anleitung für iOS & Android folgt in Kürze.
          <br /><br />
          <strong>iOS:</strong> <br />
          1. Tippe lange auf Dein Bildschirm, nicht auf eine App<br />
          2. Gehe auf Bearbeiten<br />
          3. Widget hinzufügen<br />
          4. Wähle Safari aus<br />
          5. kommt noch<br />
          <br />
          <strong>Android:</strong> <br />
          1. kommt noch <br />
          2. kommt noch<br />
          3. kommt noch<br />
          4. kommt noch<br />
          5. kommt noch
          <br /><br />
        </li>
        <li>
          <b>Navigation:</b> 
          <br /> 
          Über die Navigation kannst du zwischen den verschiedenen Bereichen der App wechseln. Bei der Nutzung von mobilen Geräten kann die Darstellung leicht abweichen.
          Um eine gute Lesbarkeit zu gewährleisten, wird die Menüleiste auf mobilen Geräten ausgeblendet.
          Im oberen linken Eck der App, findest du das Menü-Symbol, über das du die Navigation öffnen kannst.
          Das Menü-Symbol ermöglicht dir den Zugriff auf alle Navigationspunkte der App, in dem Du das Feld mit den drei waagrechten strichen auswählst.
          Dann kannst Du die gewünschten Navigationspunkte auswählen.
          <br /><br />
        </li>
        <li>
          <b>Kalender:</b> <br />
          Hier findest Du die nächsten Termine und Veranstaltungen auf einem Blick. Wochentag, Datum, Uhrzeit und Ort sind dort für jede Veranstaltung aufgelistet. 
          <br /><br />
        </li>
        <li>
          <b>Meine Aufgaben:</b> Hier findest Du Deine Aufgaben, welche Du erledigen musst. Wenn Du diese angefangen hast, kannst du den Status auf "in Arbeit" umstellen. Hast Du Deine Aufgabe abgeschlossen, kannst du den Status auf "abgeschlossen" setzen. Den Status kannst Du jederzeit wieder zurückstellen.
          <br /><br />
        </li>
        <li>
          <b>Veranstaltungen:</b> <br /> 
          Sieh Dir die interne und externe Veranstaltungen an und erhalte Informationen über die Veranstaltung. Des Weiteren siehst Du den Hauptverantwortlichen der Veranstaltung. Deine Aufgaben zu dieser Veranstaltung sind ebenfalls dort ersichtlich. Bei Fragen, wende Dich einfach an den Organisationsverantwortlichen. 
          <br /><br />
        </li>
        <li>
          <b>Menüpunkt Verein:</b> <br />
          Hier hast du Informationen zu der Vorstandschaft. In Zukunft sind dort auch alle Informationen zu den Gruppen aufgeführt, wann und wo das Training ist, wer der Ansprechpartner ist usw.
          <br /><br />
        </li>
        <li>
          <b>KaGe-Carta:</b> <br />
          Hier sind unsere Werte beschrieben an welche sich jedes Mitglied der KaGe halten muss. Der Ahndungsprozess ist ebenfalls beschrieben, dass Du siehst, wie dann der Ablauf ist. Über die App wird es zukünftig noch möglich sein, eine Meldung an die Vorstandschaft abzusetzen, wenn die KaGe-Carta verletzt wurde.
          <br /><br />
        </li>
        <li>
          <b>Button Persönliche Einstellungen:</b> <br />
          Ich Bitte Dich unter den Button Persönliche Einstellungen deine Daten vollständig einzutragen. Der Ansprechpartner in Notfällen inkl. dessen Telefonnummer sind zwar optional, zeitgleich halten wir dies für Sinnvoll, falls mal etwas passiert.
          <br /><br />
        </li>
        <li>
          <b>Button Abmelden:</b> <br />
          Beim Klicken auf den Button Abmelden wirst du sicher aus der App ausgeloggt.
          <br /><br />
        </li>
      </ol>
      <p style={{ color: "#6b7280", marginTop: 32 }}>
        Bei Fragen oder Problemen wende dich bitte an den Vorstand oder die Administratoren.
      </p>
    </div>
  );
}
