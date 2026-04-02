import { useState, useEffect } from "react";
import { ref, getBytes } from "firebase/storage";
import { storage } from "../firebase/firebaseConfig";

/**
 * Hook zum Laden von JSON-Dateien aus Firebase Storage
 * @param {string} filename - Name der Datei (z.B. "externeVeranstaltungen.json")
 * @returns {object} { data, loading, error }
 */
export function useFirebaseData(filename) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Referenz zur Datei in Firebase Storage
        const fileRef = ref(storage, `daten/${filename}`);
        
        // Datei als Bytes laden
        const bytes = await getBytes(fileRef);
        
        // Bytes zu String konvertieren
        const text = new TextDecoder().decode(bytes);
        
        // JSON parsen
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
