import { createContext, useContext, useState, useEffect } from "react";
import { auth, db, rtdb } from "../firebase/firebaseConfig";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onDisconnect, onValue, ref, serverTimestamp, set } from "firebase/database";

const AuthContext = createContext(null);

const ROLE_HIERARCHY = ["gast", "mitglied", "trainer", "vorstand", "admin"];
const PRIVACY_POLICY_VERSION = "2026-05-10";
const PRIVACY_POLICY_STAND = "10.05.2026";

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState("gast");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [privacyBusy, setPrivacyBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(userRef);
        let role = "mitglied";
        let accepted = false;
        if (snap.exists()) {
          const data = snap.data();
          role = data.role ?? "mitglied";
          accepted = data.privacyConsent?.accepted === true
            && data.privacyConsent?.version === PRIVACY_POLICY_VERSION;
        } else {
          // Nutzer ist in Firebase Auth, hat aber noch keinen Firestore-Eintrag → anlegen
          await setDoc(userRef, {
            name: firebaseUser.displayName ?? "",
            email: firebaseUser.email ?? "",
            role: "mitglied",
            privacyConsent: {
              accepted: false,
              version: PRIVACY_POLICY_VERSION,
              stand: PRIVACY_POLICY_STAND,
              acceptedAt: null,
            },
          });
        }
        setCurrentUser({ uid: firebaseUser.uid, name: firebaseUser.displayName ?? firebaseUser.email });
        setUserRole(role);
        setPrivacyAccepted(accepted);
      } else {
        setCurrentUser(null);
        setUserRole("gast");
        setPrivacyAccepted(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!currentUser?.uid || currentUser.uid === "dev") return;

    const statusRef = ref(rtdb, `status/${currentUser.uid}`);
    const connectedRef = ref(rtdb, ".info/connected");

    const unsubscribeConnected = onValue(connectedRef, async (snap) => {
      if (snap.val() !== true) return;

      await onDisconnect(statusRef).set({
        state: "offline",
        lastChanged: serverTimestamp(),
      });

      await set(statusRef, {
        state: "online",
        role: userRole,
        name: currentUser.name ?? "",
        lastChanged: serverTimestamp(),
      });
    });

    return () => {
      unsubscribeConnected();
    };
  }, [currentUser, userRole]);

  const login = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (name, email, password) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    await setDoc(doc(db, "users", cred.user.uid), {
      name,
      email,
      role: "mitglied",
      privacyConsent: {
        accepted: false,
        version: PRIVACY_POLICY_VERSION,
        stand: PRIVACY_POLICY_STAND,
        acceptedAt: null,
      },
    });
  };

  const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, email);
  };

  const logout = async () => {
    // Dev-Login nutzt keinen Firebase-Auth-User und muss lokal zurückgesetzt werden.
    if (currentUser?.uid === "dev") {
      setCurrentUser(null);
      setUserRole("gast");
      setPrivacyAccepted(false);
      return;
    }
    await signOut(auth);
  };

  const devLogin = () => {
    setCurrentUser({ uid: "dev", name: "Dev" });
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
      const userRef = doc(db, "users", currentUser.uid);
      await setDoc(userRef, {
        privacyConsent: {
          accepted: true,
          version: PRIVACY_POLICY_VERSION,
          stand: PRIVACY_POLICY_STAND,
          acceptedAt: new Date().toISOString(),
        },
      }, { merge: true });
      setPrivacyAccepted(true);
    } finally {
      setPrivacyBusy(false);
    }
  };

  const hasRole = (requiredRole) => {
    const userIndex = ROLE_HIERARCHY.indexOf(userRole);
    const requiredIndex = ROLE_HIERARCHY.indexOf(requiredRole);
    return userIndex >= requiredIndex;
  };

  if (loading) return null;

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

export function useAuth() {
  return useContext(AuthContext);
}
