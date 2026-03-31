import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

const ROLE_HIERARCHY = ["gast", "mitglied", "vorstand", "admin"];

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState("gast");

  const login = (userData, role = "gast") => {
    setCurrentUser(userData);
    setUserRole(role);
  };
  const logout = () => {
    setCurrentUser(null);
    setUserRole("gast");
  };

  const hasRole = (requiredRole) => {
    const userIndex = ROLE_HIERARCHY.indexOf(userRole);
    const requiredIndex = ROLE_HIERARCHY.indexOf(requiredRole);
    return userIndex >= requiredIndex;
  };

  return (
    <AuthContext.Provider value={{ currentUser, userRole, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
