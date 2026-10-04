import { useAuth } from "../context/useAuth";
import kageLogo from "../assets/Logo/KaGe Zell Logo mit Schriftzug.png";
import { theme } from "../styles/theme";

export default function PendingApprovalPage() {
  const { currentUser, logout } = useAuth();

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "#f3f4f6", fontFamily: theme.font.base, padding: 16,
    }}>
      <div style={{
        background: "#fff", borderRadius: 12, padding: 32, maxWidth: 440, width: "100%",
        textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      }}>
        <img src={kageLogo} alt="KaGe Zell" style={{ maxWidth: 180, marginBottom: 16 }} />
        <h2 style={{ margin: "0 0 12px" }}>⏳ Freischaltung ausstehend</h2>
        <p style={{ color: "#4b5563", lineHeight: 1.5 }}>
          Vielen Dank für deine Registrierung{currentUser?.vorname ? `, ${currentUser.vorname}` : ""}.
          Dein Zugang muss zuerst von einem Administrator freigeschaltet werden.
          Sobald das erfolgt ist, kannst du dich erneut anmelden und die Inhalte sehen.
        </p>
        <button
          type="button"
          onClick={logout}
          style={{
            marginTop: 16, padding: "9px 20px", background: "#b91c1c", color: "#fff",
            border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600,
          }}
        >
          Abmelden
        </button>
      </div>
    </div>
  );
}
