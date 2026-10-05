-- Spalte "Admin" in "Mitglieder": TRUE = Nutzer sieht alle Menuepunkte (Rolle admin in der App).
-- Einmalig im Supabase SQL Editor ausfuehren.

ALTER TABLE public."Mitglieder" ADD COLUMN IF NOT EXISTS "Admin" boolean DEFAULT false;

-- Schutz: "Admin" darf nur von bestehenden Admins geaendert werden
-- (auth.uid() ist im SQL Editor NULL: dort ist alles erlaubt).
CREATE OR REPLACE FUNCTION public.protect_mitglieder_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL
     OR EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
     OR EXISTS (
       SELECT 1 FROM public."Mitglieder" m
        WHERE lower(m."Email") = lower(auth.jwt() ->> 'email') AND m."Admin" = true
     ) THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    NEW."Admin" := false;
  ELSE
    NEW."Admin" := OLD."Admin";
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_mitglieder_admin ON public."Mitglieder";
CREATE TRIGGER protect_mitglieder_admin
BEFORE INSERT OR UPDATE ON public."Mitglieder"
FOR EACH ROW EXECUTE FUNCTION public.protect_mitglieder_admin();

-- Beispiel: Admin setzen
-- UPDATE public."Mitglieder" SET "Admin" = true WHERE lower("Email") = lower('name@example.de');
