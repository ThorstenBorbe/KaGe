import { useState, useEffect } from "react";
import { supabase } from "../supabase/supabaseConfig";

const STORAGE_BUCKET = "daten";

/**
 * Hook zum Laden von JSON-Dateien aus dem Supabase-Speicher
 * @param {string} filename - Name der Datei (z.B. "externeVeranstaltungen.json")
 * @returns {object} { data, loading, error }
 */
export function useSupabaseData(filename) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: fileBlob, error: downloadError } = await supabase
          .storage
          .from(STORAGE_BUCKET)
          .download(filename);

        if (downloadError) throw downloadError;

        const text = await fileBlob.text();
        
        const json = JSON.parse(text);
        
        setData(json);
      } catch (err) {
        console.error(`Fehler beim Laden von ${filename}:`, err);
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    if (filename) {
      loadData();
    }
  }, [filename]);

  return { data, loading, error };
}
