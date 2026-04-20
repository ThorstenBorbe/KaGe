import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zbdaoewookiyzojoostw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpiZGFvZXdvb2tpeXpvam9vc3R3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwNjQwNjMsImV4cCI6MjA5MTY0MDA2M30.LO_LrM9otkpJzCGx51bnZXbtv-uhMXq7rVqXTp50Srk";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
