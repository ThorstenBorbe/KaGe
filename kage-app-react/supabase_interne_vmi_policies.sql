-- Rechte und RLS-Policies fuer interne VMI-Veranstaltungstabellen.
-- Einmalig im Supabase SQL Editor des KaGe-Projekts ausfuehren.
-- Angemeldete Nutzer duerfen lesen und ausschliesslich den Aufgabenstatus aendern.

GRANT USAGE ON SCHEMA public TO authenticated;

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
    'VMI-Kinderfasching'
  ];
BEGIN
  FOREACH table_name IN ARRAY table_names LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);
    EXECUTE format('GRANT SELECT ON TABLE public.%I TO authenticated', table_name);
    EXECUTE format('REVOKE UPDATE ON TABLE public.%I FROM authenticated', table_name);
    EXECUTE format(
      'GRANT UPDATE (%I) ON TABLE public.%I TO authenticated',
      'Status Abarbeitung',
      table_name
    );

    EXECUTE format(
      'DROP POLICY IF EXISTS %I ON public.%I',
      'Authenticated users can read internal VMI',
      table_name
    );
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR SELECT TO authenticated USING (true)',
      'Authenticated users can read internal VMI',
      table_name
    );

    EXECUTE format(
      'DROP POLICY IF EXISTS %I ON public.%I',
      'Authenticated users can update internal VMI status',
      table_name
    );
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR UPDATE TO authenticated USING (true) WITH CHECK (true)',
      'Authenticated users can update internal VMI status',
      table_name
    );
  END LOOP;
END $$;
