export default function FinanzPage() {
  return (
    <div style={{ padding: "24px" }}>


      <div
        style={{
          background: "white",
          borderRadius: "18px",
          padding: "24px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          maxWidth: "800px",
        }}
      >
        <h2 style={{ marginTop: 0 }}>📊 Finanzübersicht</h2>

        <p style={{ marginTop: "12px", color: "#4b5563", lineHeight: 1.5 }}>
          In diesem Bereich wird zukünftig die Finanzübersicht der Karnevalsgesellschaft dargestellt.
        </p>

        <p style={{ marginTop: "8px", color: "#4b5563", lineHeight: 1.5 }}>
          Hier können Einnahmen, Ausgaben, Budgets sowie Auswertungen und Berichte eingesehen werden.
        </p>

        <div
          style={{
            marginTop: "20px",
            padding: "16px",
            borderRadius: "12px",
            background: "#f9fafb",
            border: "1px dashed #d1d5db",
            textAlign: "center",
            color: "#6b7280",
            fontStyle: "italic",
          }}
        >
          ⚠️ Finanzübersicht wird aktuell noch entwickelt
        </div>
      </div>
    </div>
  );
}