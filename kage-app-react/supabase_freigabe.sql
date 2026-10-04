-- Registrierung mit Freigabe durch den Admin. Einmalig im Supabase SQL Editor ausfuehren
-- (zusaetzlich zu supabase_mitglieder_policies.sql).
--
-- 1. Spalte "Freigabe" (boolean) mit Default FALSE
-- 2. Trigger: uebernimmt Vorname, Nachname, Email und die Gruppen sofort bei der
--    Registrierung in "Mitglieder" (Freigabe immer FALSE)
-- 3. Schutz-Trigger: nur Admins/Praesidium duerfen "Freigabe" auf TRUE setzen bzw. aendern
--    (ZUERST supabase_mitglieder_policies.sql ausfuehren, es legt can_approve_members() an)
-- 4. Spalte "Praesidium" (boolean): Mitglieder mit TRUE duerfen Freigaben erteilen

ALTER TABLE public."Mitglieder" ADD COLUMN IF NOT EXISTS "Praesidium" boolean DEFAULT false;

ALTER TABLE public."Mitglieder" ADD COLUMN IF NOT EXISTS "Freigabe" boolean DEFAULT false;
ALTER TABLE public."Mitglieder" ALTER COLUMN "Freigabe" SET DEFAULT false;

-- Bestehende Mitglieder ohne Wert bleiben gesperrt, bis sie freigegeben werden.
-- Sollen alle bisherigen Mitglieder sofort freigegeben sein, einmalig ausfuehren:
-- UPDATE public."Mitglieder" SET "Freigabe" = true WHERE "Freigabe" IS NULL;

CREATE OR REPLACE FUNCTION public.handle_new_user_mitglied()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  daten jsonb;
  spalte text;
  gruppen text[] := ARRAY['Rote Garde', 'Blaue Garde', 'Gruene Garde', 'Zeller Boeckli',
    'Boeck2Beat', 'Zeller Boeck Ballett', 'ZDL', 'Buettenredner', 'Trainer', '11n', 'Elferrat'];
BEGIN
  daten := NEW.raw_user_meta_data -> 'mitglied_daten';
  IF daten IS NULL OR jsonb_typeof(daten) <> 'object' THEN
    RETURN NEW;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public."Mitglieder" m WHERE lower(m."Email") = lower(NEW.email)
  ) THEN
    -- Zuerst nur die Kerndaten, damit die Zeile auch bei abweichenden Gruppen-Spalten entsteht.
    BEGIN
      INSERT INTO public."Mitglieder" ("Vorname", "Nachname", "Email")
      VALUES (daten ->> 'Vorname', daten ->> 'Nachname', NEW.email);
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'handle_new_user_mitglied (Insert): %', SQLERRM;
      RETURN NEW;
    END;
  END IF;

  BEGIN
    UPDATE public."Mitglieder" SET "Freigabe" = false WHERE lower("Email") = lower(NEW.email);
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'handle_new_user_mitglied (Freigabe): %', SQLERRM;
  END;

  FOREACH spalte IN ARRAY gruppen LOOP
    BEGIN
      EXECUTE format('UPDATE public."Mitglieder" SET %I = $1 WHERE lower("Email") = lower($2)', spalte)
        USING COALESCE((daten ->> spalte)::boolean, false), NEW.email;
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'handle_new_user_mitglied (%): %', spalte, SQLERRM;
    END;
  END LOOP;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'handle_new_user_mitglied: %', SQLERRM;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_mitglied ON auth.users;
CREATE TRIGGER on_auth_user_created_mitglied
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_mitglied();

CREATE OR REPLACE FUNCTION public.protect_mitglieder_freigabe()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Nur Admins und Praesidium duerfen "Freigabe" aendern.
  -- auth.uid() ist NULL im SQL Editor und in Server-Triggern: dort ist alles erlaubt.
  IF auth.uid() IS NULL OR public.can_approve_members() THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    NEW."Freigabe" := false;
  ELSE
    NEW."Freigabe" := OLD."Freigabe";
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_mitglieder_freigabe ON public."Mitglieder";
CREATE TRIGGER protect_mitglieder_freigabe
BEFORE INSERT OR UPDATE ON public."Mitglieder"
FOR EACH ROW EXECUTE FUNCTION public.protect_mitglieder_freigabe();
