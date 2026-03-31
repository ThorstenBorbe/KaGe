// ============================================================
//  AuthContext
//  Verwaltet den eingeloggten Nutzer und seine Rolle.
//
//  Rollen (werden in Firestore unter users/{uid}.role gespeichert):
//    "admin"     → sieht alles (Finanzen, Ethik, Zugänge …)
//    "vorstand"  → sieht alles außer Finanzen
//    "mitglied"  → sieht öffentliche Bereiche + Gruppe
//    "gast"      → nur Übersicht & Gruppen
// ============================================================
import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
  sendEmailVerification,
  multiFactor,
  TotpMultiFactorGenerator,
  getMultiFactorResolver,
  TotpSecret,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";

const AuthContext = createContext(null);

// Rollen-Hierarchie: höhere Zahl = mehr Rechte
const ROLE_LEVEL = {
  pending: -1, // noch nicht freigeschaltet
  gast: 0,
  mitglied: 1,
  vorstand: 2,
  admin: 3,
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Beobachte Auth-Status und lade Rolle aus Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Anonymer Dev-Nutzer bekommt immer Admin-Rolle, kein Firestore-Eintrag nötig
        if (user.isAnonymous) {
          setUserRole("admin");
          setCurrentUser(user);
          setLoading(false);
          return;
        }
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          setUserRole(snap.data().role ?? "gast");
        } else {
          // Erstmalige Registrierung: Status "pending" bis Admin freischaltet
          await setDoc(doc(db, "users", user.uid), {
            email: user.email,
            role: "pending",
            createdAt: serverTimestamp(),
          });
          setUserRole("pending");
        }
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Login
  async function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Registrierung: legt Nutzer an (keine Bestätigungs-E-Mail nötig,
  // da Admin die Rolle manuell vergibt)
  async function register(email, password) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    return cred;
  }

  // Logout
  async function logout() {
    await signOut(auth);
  }

  // Entwickler-Login (nur im Dev-Modus verfügbar)
  async function devLogin() {
    return signInAnonymously(auth);
  }

  // Prüft ob Nutzer mindestens eine bestimmte Rolle hat
  function hasRole(requiredRole) {
    if (!userRole) return false;
    return (ROLE_LEVEL[userRole] ?? 0) >= (ROLE_LEVEL[requiredRole] ?? 0);
  }

  // ── 2FA: TOTP-Secret für Google Authenticator generieren ──
  async function enroll2FA() {
    const mfaUser = multiFactor(auth.currentUser);
    const session = await mfaUser.getSession();
    const totpSecret = await TotpMultiFactorGenerator.generateSecret(session);
    return totpSecret; // .totpKey enthält den QR-Code-URL
  }

  // 2FA: Enrollment abschließen mit dem Code aus der App
  async function finalize2FA(totpSecret, verificationCode, displayName = "Authenticator") {
    const cred = TotpMultiFactorGenerator.assertionForEnrollment(totpSecret, verificationCode);
    await multiFactor(auth.currentUser).enroll(cred, displayName);
  }

  // 2FA: Beim Login – MFA-Resolver auflösen
  async function resolve2FA(mfaError, verificationCode) {
    const resolver = getMultiFactorResolver(auth, mfaError);
    const hint = resolver.hints[0]; // erstes enrolled Gerät
    const assertion = TotpMultiFactorGenerator.assertionForSignIn(hint.uid, verificationCode);
    return resolver.resolveSignIn(assertion);
  }

  const value = {
    currentUser,
    userRole,
    loading,
    login,
    register,
    logout,
    devLogin,
    hasRole,
    enroll2FA,
    finalize2FA,
    resolve2FA,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth muss innerhalb von <AuthProvider> verwendet werden");
  return ctx;
}
