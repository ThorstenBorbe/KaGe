import { useState, useRef } from "react";
import { useAuth } from "./context/AuthContext";
import kageLogo from "./assets/Logo/KaGe Zell Logo mit Schriftzug.png";
import LoginPage from "./components/LoginPage";
import PrivacyConsentPage from "./components/PrivacyConsentPage";
import AppSidebar from "./components/layout/AppSidebar";
import AppMainContent from "./components/layout/AppMainContent";
import { appTree, TOP_LEVEL, SUB_LEVEL, GRAND_LEVEL } from "./config/appNavigation";
import { renderAppContent } from "./content/renderAppContent";
import { useSessionSetting } from "./hooks/useSessionSetting";
import {
  buildCollapsedMenuState,
  buildToggledMenuState,
  findActiveLabel,
  findAncestorKeys,
} from "./utils/appNavigation";
import { theme } from "./styles/theme";

const APP_VERSION = "v0.0.9";

export default function App() {
  const {
    currentUser,
    logout,
    hasRole,
    privacyAccepted,
    privacyBusy,
    acceptPrivacyConsent,
    privacyPolicyStand,
  } = useAuth();

  if (!currentUser) return <LoginPage />;
  if (!privacyAccepted) {
    return (
      <PrivacyConsentPage
        onAccept={acceptPrivacyConsent}
        busy={privacyBusy}
        stand={privacyPolicyStand}
      />
    );
  }

  const [active, setActive] = useState("uebersicht");
  const [openMenus, setOpenMenus] = useState({
    veranstaltungen: false,
    interne: false,
    externe: false,
    verein: false,
    gruppen: false,
    "11-11": false,
    "prunksitzung-1": false,
    "prunksitzung-2": false,
    "bunter-nachmittag": false,
    "beatbox-party": false,
    kinderfasching: false,
    kehraus: false,
  });

  const mainRef = useRef(null);

  const canEditSession = hasRole("vorstand");
  const { sessionValue, sessionSaving, handleSessionChange } = useSessionSetting(canEditSession, currentUser);
  const SESSION_OPTIONS = [
    "Session 2026/2027",
    "Session 2027/2028",
    "Session 2028/2029",
    "Session 2029/2030",
  ];

  function scrollToTop() {
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function navigate(key) {
    setActive(key);
    const ancestors = findAncestorKeys(appTree, key) || [];
    setOpenMenus((prev) => buildCollapsedMenuState(prev, ancestors));
    mainRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }

  const toggleMenu = (key) => {
    setOpenMenus((prev) => buildToggledMenuState(prev, key, TOP_LEVEL, SUB_LEVEL, GRAND_LEVEL));
  };

  const activeLabel = findActiveLabel(appTree, active);

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", fontFamily: theme.font.base }}>
      <AppSidebar
        logoSrc={kageLogo}
        active={active}
        openMenus={openMenus}
        sessionValue={sessionValue}
        sessionSaving={sessionSaving}
        sessionOptions={SESSION_OPTIONS}
        canEditSession={canEditSession}
        onSessionChange={handleSessionChange}
        onNavigate={navigate}
        onToggleMenu={toggleMenu}
        hasRole={hasRole}
        onLogout={logout}
        appVersion={APP_VERSION}
      />

      <AppMainContent
        mainRef={mainRef}
        active={active}
        activeLabel={activeLabel}
        onScrollToTop={scrollToTop}
      >
        {renderAppContent(active)}
      </AppMainContent>
    </div>
  );
}