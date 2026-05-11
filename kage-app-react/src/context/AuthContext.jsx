import { createContext, useState, useEffect } from "react";
import { supabase, SUPABASE_ANON_KEY, getSupabaseAuthBaseUrl } from "../supabase/supabaseConfig";

export const AuthContext = createContext(null);

const ROLE_HIERARCHY = ["gast", "mitglied", "trainer", "vorstand", "admin"];
const PRIVACY_POLICY_VERSION = "2026-05-10";
const PRIVACY_POLICY_STAND = "10.05.2026";

function normalizeRole(role) {
  return String(role ?? "gast").trim().toLowerCase();
}

function getProfileName(authUser, profile) {
  return profile?.name
    ?? authUser?.user_metadata?.display_name
    ?? authUser?.email
    ?? "";
}

function getPrivacyAccepted(profile) {
  const consent = profile?.privacy_consent;
  return consent?.accepted === true && consent?.version === PRIVACY_POLICY_VERSION;
}

function withTimeout(promise, ms) {
  const timeout = new Promise((resolve) => {
    setTimeout(() => resolve({ data: null, timedOut: true }), ms);
  });
  return Promise.race([promise.then((result) => ({ data: result, timedOut: false })), timeout]);
}

async function loginViaRestFallback(email, password) {
  const authBaseUrl = getSupabaseAuthBaseUrl();

  console.log("[Login REST] Token-Anfrage startet...");
  const result = await withTimeout(
    fetch(`${authBaseUrl}/token?grant_type=password`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    }),
    8000
  );

  if (result.timedOut) {
    throw new Error("Login-Zeitüberschreitung (REST, 8s). Browser blockiert vermutlich Supabase-Verbindungen.");
  }

  const response = result.data;
  console.log("[Login REST] Token-Antwort erhalten:", response.status);
  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(
      payload?.msg
      ?? payload?.error_description
      ?? payload?.error
      ?? `REST-Login fehlgeschlagen (HTTP ${response.status}).`
    );
  }

  const accessToken = payload?.access_token;
  const refreshToken = payload?.refresh_token;
  if (!accessToken || !refreshToken) {
    throw new Error("REST-Login erfolgreich, aber Session-Tokens fehlen.");
  }

  console.log("[Login REST] setSession startet...");
  const sessionResult = await withTimeout(
    supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    }),
    200
  );

  if (sessionResult.timedOut) {
    // In einigen Browser-Setups schreibt das SDK die Session trotzdem in den Storage,
    // obwohl das Promise wegen Lockdown/CSP nicht sauber auflöst.
    // Ein Reload übernimmt dann die Session zuverlässig.
    console.warn("[Login REST] setSession-Timeout, führe automatischen Reload zur Session-Übernahme aus.");
    setTimeout(() => {
      window.location.reload();
    }, 5);
    return;
  }

  const { error } = sessionResult.data;
  if (error) throw error;
  console.log("[Login REST] setSession abgeschlossen.");
}

async function ensureUserProfile(authUser) {
  const { data: existing, error: readError } = await supabase
    .from("users")
    .select("*")
    .eq("id", authUser.id)
    .maybeSingle();

  if (readError) {
    throw readError;
  }

  if (existing) {
    return existing;
  }

  const profile = {
    id: authUser.id,
    name: authUser.user_metadata?.display_name ?? authUser.email ?? "",
    email: authUser.email ?? "",
    vorname: "",
    nachname: "",
    role: "mitglied",
    privacy_consent: {
      accepted: false,
      version: PRIVACY_POLICY_VERSION,
      stand: PRIVACY_POLICY_STAND,
      acceptedAt: null,
    },
  };

  const { error: insertError } = await supabase.from("users").upsert(profile, { onConflict: "id" });
  if (insertError) {
    throw insertError;
  }

  return profile;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState("gast");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [privacyBusy, setPrivacyBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Sicherheits-Timeout: Falls alle anderen Timeouts versagen, Ladezustand nach 5 Sekunden beenden.
    const safetyTimer = setTimeout(() => {
      if (mounted) {
        console.warn("[Auth] Sicherheits-Timeout – Ladezustand wird erzwungen beendet.");
        setLoading(false);
      }
    }, 5000);

    function applyLoggedOutState() {
      setCurrentUser(null);
      setUserRole("gast");
      setPrivacyAccepted(false);
    }

    function applyAuthFallbackState(authUser) {
      // Fallback: Auth-User ist vorhanden, aber Profilzugriff ist lokal nicht moeglich.
      setCurrentUser({
        uid: authUser.id,
        name: authUser.user_metadata?.display_name ?? authUser.email ?? "",
        email: authUser.email ?? "",
        vorname: "",
        nachname: "",
      });
      setUserRole("mitglied");
      setPrivacyAccepted(false);
    }

    async function hydrateUser(authUser) {
      if (!mounted) return;

      if (!authUser) {
        applyLoggedOutState();
        return;
      }

      try {
        const profile = await ensureUserProfile(authUser);

        setCurrentUser({
          uid: authUser.id,
          name: getProfileName(authUser, profile),
          email: profile.email ?? authUser.email ?? "",
          vorname: profile.vorname ?? "",
          nachname: profile.nachname ?? "",
        });
        setUserRole(normalizeRole(profile.role ?? "mitglied"));
        setPrivacyAccepted(getPrivacyAccepted(profile));
      } catch (error) {
        console.error("[Auth Profilfehler]", error?.message ?? error);
        applyAuthFallbackState(authUser);
      }
    }

    const init = async () => {
      try {
        // getSession mit 4-Sekunden-Timeout absichern – verhindert langes Warten bei
        // Supabase-Verbindungsproblemen (z. B. pausiertes Projekt oder kein Netzwerk).
        console.log("[Auth Init] getSession() wird aufgerufen …");
        const result = await withTimeout(supabase.auth.getSession(), 4000);

        if (result.timedOut) {
          console.warn("[Auth Init] getSession() Timeout nach 4s – Login-Screen wird angezeigt.");
          applyLoggedOutState();
          return;
        }
        console.log("[Auth Init] getSession() abgeschlossen.", result.data?.data?.session ? "Session vorhanden" : "Keine Session");

        const { data, error } = result.data;
        if (error) {
          console.error("[Auth Init]", error.message);
        }
        await hydrateUser(data?.session?.user ?? null);
      } catch (error) {
        console.error("[Auth Init Exception]", error?.message ?? error);
        applyLoggedOutState();
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        await hydrateUser(session?.user ?? null);
      } catch (error) {
        console.error("[Auth State Change]", error?.message ?? error);
        applyLoggedOutState();
      } finally {
        if (mounted) setLoading(false);
      }
    });

    return () => {
      mounted = false;
      clearTimeout(safetyTimer);
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!currentUser?.uid || currentUser.uid === "dev") return;

    const channel = supabase.channel("online-users", {
      config: { presence: { key: currentUser.uid } },
    });

    channel.subscribe(async (status) => {
      if (status !== "SUBSCRIBED") return;
      await channel.track({
        uid: currentUser.uid,
        role: userRole,
        name: currentUser.name ?? "",
        email: currentUser.email ?? "",
        onlineAt: new Date().toISOString(),
      });
    });

    return () => {
      channel.untrack();
      supabase.removeChannel(channel);
    };
  }, [currentUser, userRole]);

  const login = async (email, password) => {
    // Primär über REST + lokalen Vite-Proxy anmelden.
    // Das umgeht Browser-Schutzlisten, die direkte SDK-Aufrufe auf supabase.co blockieren.
    await loginViaRestFallback(email, password);
  };

  const register = async (name, email, password) => {
    const result = await withTimeout(
      supabase.auth.signUp({
        email,
        password,
        options: { data: { display_name: name } },
      }),
      10000
    );

    if (result.timedOut) {
      throw new Error("Registrierung-Zeitüberschreitung (10s). Prüfe Browser-Schutz/Adblocker/CSP.");
    }

    const { data, error } = result.data;
    if (error) throw error;
    if (!data.user) return;

    const { error: profileError } = await supabase.from("users").upsert({
      id: data.user.id,
      name,
      email,
      role: "mitglied",
      privacy_consent: {
        accepted: false,
        version: PRIVACY_POLICY_VERSION,
        stand: PRIVACY_POLICY_STAND,
        acceptedAt: null,
      },
    });
    if (profileError) throw profileError;
  };

  const resetPassword = async (email) => {
    const result = await withTimeout(
      supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      }),
      10000
    );

    if (result.timedOut) {
      throw new Error("Passwort-Reset-Zeitüberschreitung (10s). Prüfe Browser-Schutz/Adblocker/CSP.");
    }

    const { error } = result.data;
    if (error) throw error;
  };

  const logout = async () => {
    // Entwickler-Anmeldung nutzt keinen Supabase-Authentifizierungsnutzer und muss lokal zurueckgesetzt werden.
    if (currentUser?.uid === "dev") {
      setCurrentUser(null);
      setUserRole("gast");
      setPrivacyAccepted(false);
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const updateName = async (vorname, nachname) => {
    if (!currentUser?.uid || currentUser.uid === "dev") return;
    const fullName = [vorname, nachname].filter(Boolean).join(" ");
    const { error } = await supabase
      .from("users")
      .update({ vorname, nachname, name: fullName })
      .eq("id", currentUser.uid);
    if (error) throw error;

    await supabase.auth.updateUser({ data: { display_name: fullName } });
    setCurrentUser((prev) => ({ ...prev, vorname, nachname, name: fullName }));
  };

  const devLogin = () => {
    setCurrentUser({ uid: "dev", name: "Dev", email: "dev@example.com" });
    setUserRole("admin");
    setPrivacyAccepted(true);
  };

  const acceptPrivacyConsent = async () => {
    if (!currentUser?.uid || currentUser.uid === "dev") {
      setPrivacyAccepted(true);
      return;
    }
    setPrivacyBusy(true);
    try {
      const { error } = await supabase
        .from("users")
        .update({
          privacy_consent: {
            accepted: true,
            version: PRIVACY_POLICY_VERSION,
            stand: PRIVACY_POLICY_STAND,
            acceptedAt: new Date().toISOString(),
          },
        })
        .eq("id", currentUser.uid);
      if (error) {
        // DB-Fehler protokollieren aber trotzdem lokal akzeptieren,
        // damit der Nutzer nicht dauerhaft auf dieser Seite haengt.
        console.error("[Datenschutz DB-Fehler]", error.message);
      }
      setPrivacyAccepted(true);
    } finally {
      setPrivacyBusy(false);
    }
  };

  const hasRole = (requiredRole) => {
    const userIndex = ROLE_HIERARCHY.indexOf(normalizeRole(userRole));
    const requiredIndex = ROLE_HIERARCHY.indexOf(normalizeRole(requiredRole));
    return userIndex >= requiredIndex;
  };

  // Ladebildschirm anzeigen, solange der Auth-Status noch nicht bekannt ist.
  if (loading) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "#1a1a2e",           /* Hintergrundfarbe – z. B. "#fff" für weiß */
        color: "#c8a84b",                /* Textfarbe – passend zum App-Theme */
        fontSize: "1.1rem",
        fontFamily: "sans-serif",
        flexDirection: "column",
        gap: "1rem",
      }}>
        <div style={{
          width: 40,                       /* Spinner-Größe in px */
          height: 40,
          border: "4px solid rgba(200,168,75,0.3)",
          borderTop: "4px solid #c8a84b", /* Spinner-Farbe */
          borderRadius: "50%",
          animation: "kage-spin 0.9s linear infinite",
        }} />
        <style>{"@keyframes kage-spin { to { transform: rotate(360deg); } }"}</style>
        <span>App wird geladen …</span>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userRole,
        login,
        register,
        resetPassword,
        logout,
        devLogin,
        hasRole,
        updateName,
        privacyAccepted,
        privacyBusy,
        acceptPrivacyConsent,
        privacyPolicyStand: PRIVACY_POLICY_STAND,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


