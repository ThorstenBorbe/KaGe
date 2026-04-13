import SidebarNavigation from "../navigation/SidebarNavigation";
import { appTree, MENU_ROLES } from "../../config/appNavigation";
import { theme } from "../../styles/theme";

export default function AppSidebar({
  logoSrc,
  active,
  openMenus,
  sessionValue,
  sessionSaving,
  sessionOptions,
  canEditSession,
  onSessionChange,
  onNavigate,
  onToggleMenu,
  hasRole,
  onLogout,
  appVersion,
  isMobile,
  mobileMenuOpen,
  onCloseMobileMenu,
}) {
  const drawerStyle = isMobile
    ? {
        position: "fixed",
        top: 0,
        left: 0,
        width: "min(86vw, 320px)",
        height: "100vh",
        zIndex: 1000,
        transform: mobileMenuOpen ? "translateX(0)" : "translateX(-105%)",
        transition: "transform 220ms ease",
        boxShadow: "0 12px 28px rgba(0,0,0,0.35)",
      }
    : {
        width: "300px",
        height: "100vh",
      };

  return (
    <aside
      style={{
        ...drawerStyle,
        overflowY: "auto",
        background: theme.colors.sidebarBg,
        color: theme.colors.sidebarText,
        padding: "20px",
        paddingBottom: "40px",
        boxSizing: "border-box",
      }}
    >
      {isMobile && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
          <button
            onClick={onCloseMobileMenu}
            title="Menü schließen"
            style={{
              border: `1px solid ${theme.colors.borderSoft}`,
              background: "rgba(255,255,255,0.1)",
              color: "white",
              borderRadius: 8,
              width: 34,
              height: 34,
              cursor: "pointer",
              fontSize: 18,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>
      )}

      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <img
          src={logoSrc}
          alt="KaGe Logo"
          style={{ width: "120px" }}
        />
      </div>

      {canEditSession && (
        <div style={{ marginTop: "36px", marginBottom: "6px" }}>
          <select
            value={sessionValue}
            onChange={(e) => onSessionChange(e.target.value)}
            disabled={sessionSaving}
            style={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.35)",
              background: "white",
              color: "#111",
              fontSize: "18px",
              textAlign: "center",
              cursor: "pointer",
              boxSizing: "border-box",
            }}
          >
            {sessionOptions.map((session) => (
              <option key={session} value={session}>
                {session}
              </option>
            ))}
          </select>
        </div>
      )}

      <SidebarNavigation
        items={appTree}
        activeKey={active}
        openMenus={openMenus}
        onNavigate={onNavigate}
        onToggleMenu={onToggleMenu}
        hasRole={hasRole}
        menuRoles={MENU_ROLES}
      />

      <div style={{ marginTop: "auto", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.2)", marginTop: "32px" }}>
        <p style={{ textAlign: "center", fontSize: 10, color: "rgba(255,255,255,0.5)", margin: "0 0 10px 0" }}>
          Version: {appVersion}
        </p>

        <button
          onClick={() => onNavigate("einstellungen")}
          style={{
            width: "100%",
            padding: "10px 8px",
            marginBottom: 8,
            minHeight: 44,
            background: active === "einstellungen" ? theme.colors.white : "rgba(255,255,255,0.1)",
            color: active === "einstellungen" ? "#111" : "white",
            border: `1px solid ${theme.colors.borderSoft}`,
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 16,
            fontWeight: 400,
            textAlign: "center",
          }}
        >
          Persönliche Einstellungen
        </button>
        <button
          onClick={onLogout}
          style={{
            width: "100%",
            padding: "10px 8px",
            minHeight: 44,
            background: "rgba(255,255,255,0.15)",
            color: "white",
            border: `1px solid ${theme.colors.borderSoft}`,
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 16,
            fontWeight: 400,
            textAlign: "center",
          }}
        >
          Abmelden
        </button>
      </div>
    </aside>
  );
}
