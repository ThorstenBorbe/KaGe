import kageLogo from "../../assets/Logo/KaGe Zell Logo mit Schriftzug.png";

export default function WelcomeToast({ name, visible, onClose }) {
  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: "36px 40px",
          maxWidth: 380,
          width: "90%",
          textAlign: "center",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        }}
      >
        <div style={{ marginBottom: 16 }}>
          <img src={kageLogo} alt="KaGe Logo" style={{ width: 100 }} />
        </div>
        <h2 style={{ margin: "0 0 8px", color: "#111827", fontSize: 22 }}>
          Willkommen{name ? `, ${name}` : ""}!
        </h2>
        <p style={{ margin: "0 0 28px", color: "#6b7280", fontSize: 14, lineHeight: 1.6 }}>
          Schön, dass du wieder dabei bist.
        </p>
        <button
          onClick={onClose}
          style={{
            background: "#b91c1c",
            color: "white",
            border: "none",
            borderRadius: 8,
            padding: "10px 32px",
            fontSize: 15,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Los geht's
        </button>
      </div>
    </div>
  );
}
