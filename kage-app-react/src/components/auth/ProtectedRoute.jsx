import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import WartenPage from "./WartenPage";

/**
 * Schützt eine Route vor nicht-authentifizierten oder
 * nicht-autorisierten Nutzern.
 */
export default function ProtectedRoute({ children, role }) {
  const { currentUser, userRole, hasRole } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Noch nicht freigeschaltet
  if (userRole === "pending") {
    return <WartenPage />;
  }

  // Gesperrt
  if (userRole === "gesperrt") {
    return <WartenPage gesperrt />;
  }

  if (role && !hasRole(role)) {
    return <Navigate to="/kein-zugang" replace />;
  }

  return children;
}
