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
}) {
  return (
    <aside
      style={{
        width: "300px",
        height: "100vh",
        overflowY: "auto",
        background: theme.colors.sidebarBg,
        color: theme.colors.sidebarText,
        padding: "20px",
        paddingBottom: "40px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <img
          src={logoSrc}
          alt="KaGe Logo"
          style={{ width: "120px" }}
        />
      </div>

      <div style={{ marginTop: "36px", marginBottom: "6px" }}>
        <select
          value={sessionValue}
          onChange={(e) => onSessionChange(e.target.value)}
          disabled={!canEditSession || sessionSaving}
          style={{
            width: "100%",
            padding: "8px 10px",
            borderRadius: "8px",
            border: "1px solid rgba(255,255,255,0.35)",
            background: !canEditSession ? "rgba(255,255,255,0.08)" : "white",
            color: !canEditSession ? "white" : "#111",
            fontSize: "18px",
            textAlign: "center",
            cursor: !canEditSession ? "not-allowed" : "pointer",
            boxSizing: "border-box",
          }}
        >
          {sessionOptions.map((session) => (
            <option key={session} value={session}>
              {session}
            </option>
          ))}
        </select>
        {!canEditSession && (
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.8)", marginTop: "6px", marginBottom: 0 }}>
            Nur Vorstand/Admin kann die Session ändern.
          </p>
        )}
      </div>

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
            padding: "8px",
            marginBottom: 8,
            background: active === "einstellungen" ? theme.colors.white : "rgba(255,255,255,0.1)",
            color: active === "einstellungen" ? "#111" : "white",
            border: `1px solid ${theme.colors.borderSoft}`,
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 18,
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
            padding: "8px",
            background: "rgba(255,255,255,0.15)",
            color: "white",
            border: `1px solid ${theme.colors.borderSoft}`,
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 18,
            fontWeight: 400,
          }}
        >
          Abmelden
        </button>
      </div>
    </aside>
  );
}
