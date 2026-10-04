-- Tabelle "Session 26/27" umbenennen (der Schraegstrich bricht die REST-URL).
-- Fuer weitere Sessions analog: Session_27_28 usw.

-- Alte View aus dem frueheren Skript entfernen (falls angelegt)
DROP VIEW IF EXISTS public.session_26_27;

DO $$
BEGIN
  IF to_regclass('public."Session 26/27"') IS NOT NULL THEN
    ALTER TABLE public."Session 26/27" RENAME TO "Session_26_27";
  END IF;
END $$;

ALTER TABLE public."Session_26_27"
  ADD COLUMN IF NOT EXISTS "Treffpunkt" text;

GRANT SELECT ON TABLE public."Session_26_27" TO authenticated;

-- Leserichtlinie (RLS): ohne sie liefert die Tabelle der App 0 Zeilen
ALTER TABLE public."Session_26_27" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Session_26_27 lesen" ON public."Session_26_27";
CREATE POLICY "Session_26_27 lesen" ON public."Session_26_27"
  FOR SELECT TO authenticated USING (true);

NOTIFY pgrst, 'reload schema';
