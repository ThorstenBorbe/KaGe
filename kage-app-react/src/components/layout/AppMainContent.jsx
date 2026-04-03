import ContentErrorBoundary from "./ContentErrorBoundary";
import { theme } from "../../styles/theme";

export default function AppMainContent({ mainRef, active, activeLabel, children, onScrollToTop, isMobile, onOpenMobileMenu }) {
  return (
    <main
      ref={mainRef}
      style={{
        flex: 1,
        height: "100vh",
        padding: isMobile ? "12px" : "24px",
        paddingTop: isMobile ? "64px" : "24px",
        paddingBottom: isMobile ? "160px" : "120px",
        background: theme.colors.contentBg,
        overflowY: "auto",
        position: "relative",
      }}
    >
      {isMobile && (
        <button
          onClick={onOpenMobileMenu}
          title="Menü öffnen"
          style={{
            position: "fixed",
            top: 14,
            left: 14,
            zIndex: 850,
            width: 38,
            height: 38,
            borderRadius: 10,
            border: "none",
            background: theme.colors.danger,
            color: "white",
            fontSize: 20,
            cursor: "pointer",
            boxShadow: theme.shadow.floating,
            lineHeight: 1,
          }}
        >
          ☰
        </button>
      )}

      <h1 style={{ marginTop: 0, marginBottom: isMobile ? 12 : undefined }}>{activeLabel}</h1>
      <ContentErrorBoundary resetKey={active}>{children}</ContentErrorBoundary>
      <button
        onClick={onScrollToTop}
        title="Nach oben"
        style={{
          position: "fixed",
          bottom: isMobile ? 40 : 32,
          right: isMobile ? 18 : 32,
          width: isMobile ? 40 : 44,
          height: isMobile ? 40 : 44,
          borderRadius: "50%",
          background: theme.colors.danger,
          color: "white",
          border: "none",
          fontSize: isMobile ? 18 : 20,
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
