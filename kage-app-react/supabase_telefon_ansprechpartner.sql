-- Neue Spalte für die Telefonnummer des Ansprechpartners in der Tabelle "Mitglieder"
ALTER TABLE public."Mitglieder"
  ADD COLUMN IF NOT EXISTS "Telefonnummer Ansprechpartner" text;
