-- Prüfe und repariere User-Eintrag
-- Ersetze 'DEINE_EMAIL@DOMAIN.COM' mit deiner tatsächlichen E-Mail

-- 1. Prüfe, ob User in Auth existiert
SELECT id, email, created_at FROM auth.users WHERE email = 'DEINE_EMAIL@DOMAIN.COM';

-- 2. Prüfe, ob User in users-Tabelle existiert
SELECT id, name, email, role FROM users WHERE email = 'DEINE_EMAIL@DOMAIN.COM';

-- 3. Wenn User in Auth existiert aber nicht in users-Tabelle:
-- Ersetze die UUID unten mit der ID aus Schritt 1
-- Ersetze die E-Mail und Namen mit deinen Daten
INSERT INTO users (id, name, email, vorname, nachname, role, privacy_consent)
VALUES (
  'UUID_HIER_EINFUEGEN', -- Kopiere die ID aus Schritt 1
  'Dein Voller Name',
  'DEINE_EMAIL@DOMAIN.COM',
  'Dein Vorname',
  'Dein Nachname',
  'admin', -- oder 'vorstand', 'trainer', 'mitglied'
  '{
    "accepted": true,
    "version": "2026-05-10",
    "stand": "10.05.2026",
    "acceptedAt": "2026-04-20T12:00:00.000Z"
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;