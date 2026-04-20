import { useEffect, useState, useRef } from "react";
import { useAuth } from "./context/AuthContext";
import kageLogo from "./assets/Logo/KaGe Zell Logo mit Schriftzug.png";
import LoginPage from "./components/LoginPage";
import PrivacyConsentPage from "./components/PrivacyConsentPage";
import AppSidebar from "./components/layout/AppSidebar";
import AppMainContent from "./components/layout/AppMainContent";
import WelcomeToast from "./components/layout/WelcomeToast";
import { useWelcomeToast } from "./hooks/useWelcomeToast";
import { useIsMobile } from "./hooks/useIsMobile";
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

const APP_VERSION = "v0.2.0";

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

  const [active, setActive] = useState("uebersicht");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState({
    veranstaltungen: false,
    interne: false,
    externe: false,
    verein: false,
    gruppen: false,
  });

  const mainRef = useRef(null);
  const isMobile = useIsMobile(960);

  const canEditSession = hasRole("vorstand");
  const { sessionValue, sessionSaving, handleSessionChange } = useSessionSetting(canEditSession, currentUser);
  const SESSION_OPTIONS = [
    "Session 2026/2027",
    "Session 2027/2028",
    "Session 2028/2029",
    "Session 2029/2030",
  ];

  const activeLabel = findActiveLabel(appTree, active);
  const { visible: showWelcome, dismiss: dismissWelcome } = useWelcomeToast(currentUser);

  useEffect(() => {
    if (!isMobile) {
      setMobileMenuOpen(false);
    }
  }, [isMobile]);

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

  function scrollToTop() {
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function navigate(key) {
    setActive(key);
    const ancestors = findAncestorKeys(appTree, key) || [];
    setOpenMenus((prev) => buildCollapsedMenuState(prev, ancestors));
    if (isMobile) setMobileMenuOpen(false);
    mainRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }

  const toggleMenu = (key) => {
    setOpenMenus((prev) => buildToggledMenuState(prev, key, TOP_LEVEL, SUB_LEVEL, GRAND_LEVEL));
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", fontFamily: theme.font.base }}>
      <WelcomeToast name={currentUser?.vorname || currentUser?.name} visible={showWelcome} onClose={dismissWelcome} />

      {isMobile && mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 900,
          }}
        />
      )}

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
        isMobile={isMobile}
        mobileMenuOpen={mobileMenuOpen}
        onCloseMobileMenu={() => setMobileMenuOpen(false)}
      />

      <AppMainContent
        mainRef={mainRef}
        active={active}
        activeLabel={activeLabel}
        onScrollToTop={scrollToTop}
        isMobile={isMobile}
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
      >
        {renderAppContent(active)}
      </AppMainContent>
    </div>
  );
}