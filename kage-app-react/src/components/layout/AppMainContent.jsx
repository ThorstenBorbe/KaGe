import ContentErrorBoundary from "./ContentErrorBoundary";
import { theme } from "../../styles/theme";

export default function AppMainContent({ mainRef, active, activeLabel, children, onScrollToTop }) {
  return (
    <main ref={mainRef} style={{ flex: 1, height: "100vh", padding: "24px", background: theme.colors.contentBg, overflowY: "auto", position: "relative" }}>
      <h1 style={{ marginTop: 0 }}>{activeLabel}</h1>
      <ContentErrorBoundary resetKey={active}>{children}</ContentErrorBoundary>
      <button
        onClick={onScrollToTop}
        title="Nach oben"
        style={{
          position: "fixed",
          bottom: 32,
          right: 32,
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: theme.colors.danger,
          color: "white",
          border: "none",
          fontSize: 20,
          cursor: "pointer",
          boxShadow: theme.shadow.floating,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        ↑
      </button>
    </main>
  );
}
