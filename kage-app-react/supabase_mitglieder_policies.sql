-- Rechte fuer die Tabelle "Mitglieder": Registrierung und Telefonnummer-Pflege.
-- Einmalig im Supabase SQL Editor ausfuehren.
-- Angemeldete Nutzer duerfen sich selbst eintragen sowie ihre eigene Zeile
-- (Zuordnung ueber die E-Mail-Adresse) lesen und aendern.
-- Bestehende Lese-Policies der Tabelle bleiben unveraendert.

-- Spalten muessen vor den Funktionen/Policies existieren.
ALTER TABLE public."Mitglieder" ADD COLUMN IF NOT EXISTS "Freigabe" boolean DEFAULT false;
ALTER TABLE public."Mitglieder" ADD COLUMN IF NOT EXISTS "Praesidium" boolean DEFAULT false;

GRANT SELECT, INSERT, UPDATE ON TABLE public."Mitglieder" TO authenticated;

DROP POLICY IF EXISTS "Nutzer duerfen sich selbst als Mitglied eintragen" ON public."Mitglieder";
CREATE POLICY "Nutzer duerfen sich selbst als Mitglied eintragen"
ON public."Mitglieder"
FOR INSERT TO authenticated
WITH CHECK (lower("Email") = lower(auth.jwt() ->> 'email'));

DROP POLICY IF EXISTS "Nutzer duerfen eigenen Mitglieder-Eintrag lesen" ON public."Mitglieder";
CREATE POLICY "Nutzer duerfen eigenen Mitglieder-Eintrag lesen"
ON public."Mitglieder"
FOR SELECT TO authenticated
USING (lower("Email") = lower(auth.jwt() ->> 'email'));

DROP POLICY IF EXISTS "Nutzer duerfen eigenen Mitglieder-Eintrag aendern" ON public."Mitglieder";
CREATE POLICY "Nutzer duerfen eigenen Mitglieder-Eintrag aendern"
ON public."Mitglieder"
FOR UPDATE TO authenticated
USING (lower("Email") = lower(auth.jwt() ->> 'email'))
WITH CHECK (lower("Email") = lower(auth.jwt() ->> 'email'));

-- Admins und Praesidium (Mitglieder."Praesidium" = TRUE) duerfen alle Mitglieder-Zeilen
-- lesen und aendern (Menue "Freigaben"). Die Pruefung laeuft ueber eine SECURITY-DEFINER-
-- Funktion, damit keine Rekursion auf der Tabelle entsteht.
CREATE OR REPLACE FUNCTION public.can_approve_members()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
      OR EXISTS (
        SELECT 1 FROM public."Mitglieder" m
         WHERE lower(m."Email") = lower(auth.jwt() ->> 'email')
           AND m."Praesidium" = true
      );
$$;

DROP POLICY IF EXISTS "Admins duerfen Mitglieder lesen" ON public."Mitglieder";
DROP POLICY IF EXISTS "Freigeber duerfen Mitglieder lesen" ON public."Mitglieder";
CREATE POLICY "Freigeber duerfen Mitglieder lesen"
ON public."Mitglieder"
FOR SELECT TO authenticated
USING (public.can_approve_members());

DROP POLICY IF EXISTS "Admins duerfen Mitglieder aendern" ON public."Mitglieder";
DROP POLICY IF EXISTS "Freigeber duerfen Mitglieder aendern" ON public."Mitglieder";
CREATE POLICY "Freigeber duerfen Mitglieder aendern"
ON public."Mitglieder"
FOR UPDATE TO authenticated
USING (public.can_approve_members())
WITH CHECK (public.can_approve_members());

-- Admins duerfen das Profil (Rolle pending -> mitglied) freigegebener Nutzer aendern.
DROP POLICY IF EXISTS "Admins duerfen users aendern" ON public.users;
CREATE POLICY "Admins duerfen users aendern"
ON public.users
FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'));
