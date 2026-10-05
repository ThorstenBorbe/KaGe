-- Interne VMI-Tabellen: Aufgaben sehen/aendern nur Verantwortliche.
-- Praesidium sieht alle Aufgaben und darf jeden Status aendern, alle anderen nur eigene.
-- Nach supabase_interne_vmi_policies.sql im Supabase SQL Editor ausfuehren.

CREATE OR REPLACE FUNCTION public.is_praesidium()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public."Mitglieder" m
    WHERE lower(m."Email") = lower(auth.jwt() ->> 'email')
      AND m."Praesidium" IS TRUE
  );
$$;

-- Verantwortliche stehen als "Vorname Nachname" (kommagetrennt) in "V-Verantwortlich".
CREATE OR REPLACE FUNCTION public.is_vmi_verantwortlich(verantwortlich text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public."Mitglieder" m,
         unnest(regexp_split_to_array(coalesce(verantwortlich, ''), '[,\n]')) AS person
    WHERE lower(m."Email") = lower(auth.jwt() ->> 'email')
      AND length(trim(person)) > 0
      AND lower(regexp_replace(person, '\s', '', 'g'))
          = lower(regexp_replace(coalesce(m."Vorname", '') || coalesce(m."Nachname", ''), '\s', '', 'g'))
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_praesidium() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_vmi_verantwortlich(text) TO authenticated;

DO $$
DECLARE
  table_name TEXT;
  table_names TEXT[] := ARRAY[
    'VMI-Sommerfest',
    'VMI-Rathaussturm',
    'VMI-Beat Bocks Party',
    'VMI-Kehraus',
    'VMI-Prunksitzung',
    'VMI-Weihnachtsfeier',
    'VMI-Bunter Nachmittag',
    'VMI-Kinderfasching',
    'VMI-Faschingszug',
    'VMI-Altenheime',
    'VMI-Kindergärten'
  ];
BEGIN
  FOREACH table_name IN ARRAY table_names LOOP
    -- Lesen: Zeile "Organisation" fuer alle, Aufgaben nur Verantwortliche und Praesidium
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', 'Authenticated users can read internal VMI', table_name);
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', 'VMI read own or praesidium', table_name);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR SELECT TO authenticated USING ("Bereich" = %L OR public.is_praesidium() OR public.is_vmi_verantwortlich("V-Verantwortlich"))',
      'VMI read own or praesidium', table_name, 'Organisation'
    );

    -- Status aendern: Verantwortliche und Praesidium
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', 'Authenticated users can update internal VMI status', table_name);
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', 'VMI update own status', table_name);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR UPDATE TO authenticated USING (public.is_praesidium() OR public.is_vmi_verantwortlich("V-Verantwortlich")) WITH CHECK (public.is_praesidium() OR public.is_vmi_verantwortlich("V-Verantwortlich"))',
      'VMI update own status', table_name
    );
  END LOOP;
END $$;
