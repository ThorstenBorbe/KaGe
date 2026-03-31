import { useAuth } from "../../context/AuthContext";

const BRAND_RED = "#b91c1c";

export default function WartenPage({ gesperrt = false }) {
  const { currentUser, logout } = useAuth();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: "40px 32px",
          maxWidth: 420,
          width: "100%",
          boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
          textAlign: "center",
        }}
      >
        <img
          src="https://www.tgzell.de/images/abteilungen/kage/kagezell.png"
          alt="KaGe Logo"
          style={{ width: 90, marginBottom: 16 }}
        />
        <h2 style={{ color: gesperrt ? "#111827" : BRAND_RED, marginBottom: 12 }}>
          {gesperrt ? "Konto gesperrt" : "Warte auf Freischaltung"}
        </h2>
        <p style={{ color: "#374151", lineHeight: 1.7, marginBottom: 8 }}>
          {gesperrt
            ? "Dein Konto wurde gesperrt. Bitte wende dich an einen Administrator."
            : "Dein Konto wurde erfolgreich erstellt. Ein Administrator muss dich erst freischalten, bevor du die App nutzen kannst."}
        </p>
        <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 24 }}>
          Angemeldet als: <strong>{currentUser?.email}</strong>
        </p>
        <button
          onClick={logout}
          style={{
            padding: "10px 24px",
            background: BRAND_RED,
            color: "white",
            border: "none",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          Abmelden
        </button>
      </div>
    </div>
  );
}
