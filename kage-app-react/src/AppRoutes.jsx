import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";
import Setup2FAPage from "./components/auth/Setup2FAPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import App from "./App";

function KeinZugangPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
        background: "#f3f4f6",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: "40px 32px",
          textAlign: "center",
          boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
          maxWidth: 400,
        }}
      >
        <h2 style={{ color: "#b91c1c" }}>Kein Zugang</h2>
        <p style={{ color: "#374151" }}>
          Du besitzt nicht die nötige Berechtigung für diesen Bereich.
        </p>
        <a href="/" style={{ color: "#b91c1c", fontWeight: 600 }}>
          Zurück zur Übersicht
        </a>
      </div>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Öffentliche Routen */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registrierung" element={<RegisterPage />} />
      <Route path="/kein-zugang" element={<KeinZugangPage />} />

      {/* 2FA-Einrichtung: nur für eingeloggte Nutzer */}
      <Route
        path="/2fa-einrichten"
        element={
          <ProtectedRoute>
            <Setup2FAPage />
          </ProtectedRoute>
        }
      />

      {/* Haupt-App: nur für eingeloggte Nutzer */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <App />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
