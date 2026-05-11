import { useContext } from "react";
import { AuthContext } from "./AuthContext";

// Eigene Datei nötig: Vite Fast Refresh erlaubt keine Mischexporte
// (Komponente + Hook) in derselben Datei.
export function useAuth() {
  return useContext(AuthContext);
}
