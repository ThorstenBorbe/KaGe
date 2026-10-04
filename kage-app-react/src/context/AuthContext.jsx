import { createContext, useState, useEffect } from "react";
import { supabase, SUPABASE_ANON_KEY, getSupabaseAuthBaseUrl } from "../supabase/supabaseConfig";
import { MITGLIEDER_GRUPPEN } from "../config/mitgliederGruppen";

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

// Die Registrierungsdaten liegen bis zur ersten Anmeldung in den Auth-Metadaten,
// weil vor der E-Mail-Bestätigung noch keine Session für den DB-Zugriff existiert.
async function syncMitgliedFromMetadata(authUser) {
  const daten = authUser.user_metadata?.mitglied_daten;
  if (!daten) return;

  const { data: existing, error: readError } = await supabase
    .from("Mitglieder")
    .select("Email")
    .ilike("Email", daten.Email)
    .limit(1);
  if (readError) throw readError;

  if (!existing?.length) {
    const { error: insertError } = await supabase.from("Mitglieder").insert({ ...daten, Freigabe: false });
    if (insertError) throw insertError;
  }

  await supabase.auth.updateUser({ data: { mitglied_daten: null } });
}

const PROFIL_PFLICHTFELDER = ["Geburtsdatum", "Strasse", "Postleitzahl", "Wohnort", "Telefonnummer"];

async function loadMitgliedStatus(email) {
  const empty = { telefon: "", freigabe: false, praesidium: false, profilUnvollstaendig: false };
  if (!email) return empty;
  const { data, error } = await supabase
    .from("Mitglieder")
    .select("*")
    .ilike("Email", email)
    .limit(1);
  if (error) {
    console.error("[Mitglieder-Status]", error.message);
    return empty;
  }
  if (!data?.length) {
    console.warn("[Mitglieder-Status] Kein Mitglieder-Eintrag oder keine Leseberechtigung für", email);
  }
  return {
    telefon: data?.[0]?.Telefonnummer ?? "",
    freigabe: data?.[0]?.Freigabe === true,
    praesidium: data?.[0]?.Praesidium === true,
    profilUnvollstaendig: Boolean(data?.length) && PROFIL_PFLICHTFELDER.some(
      (key) => !String(data[0][key] ?? "").trim()
    ),
  };
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
    vorname: authUser.user_metadata?.vorname ?? "",
    nachname: authUser.user_metadata?.nachname ?? "",
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
  const [isPraesidium, setIsPraesidium] = useState(false);
  const [needsProfile, setNeedsProfile] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [privacyBusy, setPrivacyBusy] = useState(false);
  const [passwordRecovery, setPasswordRecovery] = useState(() => (
    new URLSearchParams(window.location.hash.slice(1)).get("type") === "recovery"
    || new URLSearchParams(window.location.search).get("type") === "recovery"
  ));
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
      setIsPraesidium(false);
      setNeedsProfile(false);
      setPrivacyAccepted(false);
    }

    async function applyAuthFallbackState(authUser) {
      // Fallback: Profilzugriff (users) nicht moeglich. Die Freigabe in Mitglieder zaehlt trotzdem.
      const { telefon, freigabe, praesidium } = await loadMitgliedStatus(authUser.email);
      if (!mounted) return;
      setCurrentUser({
        uid: authUser.id,
        name: authUser.user_metadata?.display_name ?? authUser.email ?? "",
        email: authUser.email ?? "",
        vorname: "",
        nachname: "",
        telefon,
      });
      setIsPraesidium(praesidium);
      setUserRole(freigabe || praesidium ? "mitglied" : "pending");
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

        try {
          await syncMitgliedFromMetadata(authUser);
        } catch (syncError) {
          console.error("[Mitglieder-Sync]", syncError?.message ?? syncError);
        }

        const { telefon, freigabe, praesidium, profilUnvollstaendig } = await loadMitgliedStatus(profile.email ?? authUser.email);
        setIsPraesidium(praesidium);
        setNeedsProfile(profilUnvollstaendig);
        const profileRole = normalizeRole(profile.role ?? "mitglied");
        // Nur freigegebene Mitglieder (Mitglieder.Freigabe = TRUE) sehen Daten; Admins sind ausgenommen.
        const approved = freigabe || praesidium;
        const effectiveRole = profileRole === "admin"
          ? "admin"
          : approved
            ? (profileRole === "pending" ? "mitglied" : profileRole)
            : "pending";

        setCurrentUser({
          uid: authUser.id,
          name: getProfileName(authUser, profile),
          email: profile.email ?? authUser.email ?? "",
          vorname: profile.vorname ?? "",
          nachname: profile.nachname ?? "",
          telefon,
        });
        setUserRole(effectiveRole);
        setPrivacyAccepted(getPrivacyAccepted(profile));
      } catch (error) {
        console.error("[Auth Profilfehler]", error?.message ?? error);
        await applyAuthFallbackState(authUser);
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
          if (/invalid refresh token|refresh token not found/i.test(error.message ?? "")) {
            // Eine alte lokale Session darf die App nicht dauerhaft beim Auth-Start blockieren.
            await supabase.auth.signOut({ scope: "local" });
          }
          applyLoggedOutState();
          return;
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
    } =     supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "PASSWORD_RECOVERY") setPasswordRecovery(true);
      if (event === "SIGNED_OUT") setPasswordRecovery(false);
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

  const register = async (form, password) => {
    const email = form.email;
    const vorname = form.vorname;
    const nachname = form.nachname;
    const name = [vorname, nachname].filter(Boolean).join(" ");
    const mitgliedDaten = {
      Vorname: vorname,
      Nachname: nachname,
      Email: email,
      Freigabe: false,
    };
    MITGLIEDER_GRUPPEN.forEach((g) => {
      mitgliedDaten[g.column] = Boolean(form.gruppen?.[g.column]);
    });
    const result = await withTimeout(
      fetch(`${getSupabaseAuthBaseUrl()}/signup`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          data: { display_name: name, vorname, nachname, mitglied_daten: mitgliedDaten },
          gotrue_meta_security: {},
        }),
      }),
      10000
    );

    if (result.timedOut) {
      throw new Error("Registrierung-Zeitüberschreitung (10s). Prüfe Browser-Schutz/Adblocker/CSP.");
    }

    const response = result.data;
    let payload;
    try {
      payload = await response.json();
    } catch {
      throw new Error(`Supabase hat bei der Registrierung eine ungültige Antwort geliefert (HTTP ${response.status}).`);
    }
    if (!response.ok) {
      throw new Error(
        payload?.msg
        ?? payload?.message
        ?? payload?.error_description
        ?? payload?.error
        ?? `Registrierung fehlgeschlagen (HTTP ${response.status}).`
      );
    }
    // Bei aktiver E-Mail-Bestätigung liefert GoTrue den Benutzer ohne "user"-Wrapper.
    if (!payload?.user && !payload?.id) {
      throw new Error("Supabase hat die Registrierung bestätigt, aber keinen Benutzer zurückgegeben.");
    }

    if (payload.access_token && payload.refresh_token) {
      const sessionResult = await withTimeout(
        supabase.auth.setSession({
          access_token: payload.access_token,
          refresh_token: payload.refresh_token,
        }),
        8000
      );
      if (sessionResult.timedOut) {
        throw new Error("Registrierung erfolgreich, aber die Anmeldung konnte nicht übernommen werden. Bitte melde dich an.");
      }
      if (sessionResult.data.error) throw sessionResult.data.error;
    }

    return { confirmationRequired: !payload.access_token };
  };

  const resetPassword = async (email) => {
    const redirectTo = encodeURIComponent(window.location.origin);
    const result = await withTimeout(
      fetch(`${getSupabaseAuthBaseUrl()}/recover?redirect_to=${redirectTo}`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, gotrue_meta_security: {} }),
      }),
      10000
    );

    if (result.timedOut) {
      throw new Error("Passwort-Reset-Zeitüberschreitung (10s). Prüfe Browser-Schutz/Adblocker/CSP.");
    }

    const response = result.data;
    if (!response.ok) {
      let payload;
      try {
        payload = await response.json();
      } catch {
        throw new Error(`Passwort-Reset fehlgeschlagen (HTTP ${response.status}).`);
      }
      throw new Error(
        payload?.msg
        ?? payload?.message
        ?? payload?.error_description
        ?? payload?.error
        ?? `Passwort-Reset fehlgeschlagen (HTTP ${response.status}).`
      );
    }
  };

  const updateRecoveredPassword = async (password) => {
    const result = await withTimeout(supabase.auth.updateUser({ password }), 10000);
    if (result.timedOut) {
      throw new Error("Passwortänderung-Zeitüberschreitung (10s). Bitte versuche es erneut.");
    }
    if (result.data.error) throw result.data.error;
  };

  const finishPasswordRecovery = () => {
    setPasswordRecovery(false);
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
  };

  const logout = async () => {
    // Entwickler-Anmeldung nutzt keinen Supabase-Authentifizierungsnutzer und muss lokal zurueckgesetzt werden.
    const resetLocal = () => {
      setCurrentUser(null);
      setUserRole("gast");
      setIsPraesidium(false);
      setNeedsProfile(false);
      setPrivacyAccepted(false);
    };
    if (currentUser?.uid === "dev") {
      resetLocal();
      return;
    }
    // Lokal abmelden, auch wenn der Server nicht antwortet (Timeout/Browser-Schutz).
    const result = await withTimeout(supabase.auth.signOut({ scope: "local" }), 4000);
    if (result.timedOut || result.data?.error) {
      console.warn("[Logout] signOut nicht bestaetigt – lokaler Zustand wird zurueckgesetzt.");
      try {
        Object.keys(localStorage)
          .filter((key) => key.startsWith("sb-") && key.endsWith("-auth-token"))
          .forEach((key) => localStorage.removeItem(key));
      } catch {
        // localStorage nicht verfuegbar
      }
    }
    resetLocal();
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

  const updatePhone = async (telefon) => {
    if (!currentUser?.uid || currentUser.uid === "dev") return;
    const { data, error } = await supabase
      .from("Mitglieder")
      .update({ Telefonnummer: telefon })
      .ilike("Email", currentUser.email)
      .select("Email");
    if (error) throw error;
    if (!data?.length) {
      throw new Error("Kein Mitglieder-Eintrag zu deiner E-Mail-Adresse gefunden oder keine Schreibberechtigung.");
    }
    setCurrentUser((prev) => ({ ...prev, telefon }));
  };

  const saveMitgliedProfil = async (daten) => {
    if (!currentUser?.uid || currentUser.uid === "dev") return;
    const { data, error } = await supabase
      .from("Mitglieder")
      .update({
        Geburtsdatum: daten.geburtsdatum,
        Strasse: daten.strasse,
        Postleitzahl: daten.postleitzahl,
        Wohnort: daten.wohnort,
        Telefonnummer: daten.telefonnummer,
        Ansprechpartner: daten.ansprechpartner || null,
      })
      .ilike("Email", currentUser.email)
      .select("Email");
    if (error) throw error;
    if (!data?.length) {
      throw new Error("Kein Mitglieder-Eintrag zu deiner E-Mail-Adresse gefunden oder keine Schreibberechtigung.");
    }
    setCurrentUser((prev) => ({ ...prev, telefon: daten.telefonnummer }));
    setNeedsProfile(false);
  };

  const loadMitgliedDetails = async () => {
    if (!currentUser?.email || currentUser.uid === "dev") return null;
    const { data, error } = await supabase
      .from("Mitglieder")
      .select("Vorname, Nachname, Strasse, Postleitzahl, Wohnort, Ansprechpartner, Geburtsdatum")
      .ilike("Email", currentUser.email)
      .limit(1);
    if (error) throw error;
    return data?.[0] ?? null;
  };

  const updateMitglied = async (patch) => {
    if (!currentUser?.uid || currentUser.uid === "dev") return;
    const { data, error } = await supabase
      .from("Mitglieder")
      .update(patch)
      .ilike("Email", currentUser.email)
      .select("Email");
    if (error) throw error;
    if (!data?.length) {
      throw new Error("Kein Mitglieder-Eintrag zu deiner E-Mail-Adresse gefunden oder keine Schreibberechtigung.");
    }
  };

  const skipProfileCompletion = () => setNeedsProfile(false);

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
    // Pseudo-Rolle: Freigaben dürfen Admins und Mitglieder mit Praesidium = TRUE erteilen.
    if (requiredRole === "praesidium") {
      return normalizeRole(userRole) === "admin" || isPraesidium;
    }
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
        updatePhone,
        needsProfile,
        saveMitgliedProfil,
        loadMitgliedDetails,
        updateMitglied,
        skipProfileCompletion,
        passwordRecovery,
        updateRecoveredPassword,
        finishPasswordRecovery,
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
