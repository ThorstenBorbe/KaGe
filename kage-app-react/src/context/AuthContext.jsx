import { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext(null);

const ROLE_HIERARCHY = ["gast", "mitglied", "vorstand", "admin"];

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState("gast");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(userRef);
        let role = "mitglied";
        if (snap.exists()) {
          role = snap.data().role ?? "mitglied";
        } else {
          // Nutzer ist in Firebase Auth, hat aber noch keinen Firestore-Eintrag → anlegen
          await setDoc(userRef, {
            name: firebaseUser.displayName ?? "",
            email: firebaseUser.email ?? "",
            role: "mitglied",
          });
        }
        setCurrentUser({ uid: firebaseUser.uid, name: firebaseUser.displayName ?? firebaseUser.email });
        setUserRole(role);
      } else {
        setCurrentUser(null);
        setUserRole("gast");
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (name, email, password) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    await setDoc(doc(db, "users", cred.user.uid), { name, email, role: "mitglied" });
  };

  const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, email);
  };

  const logout = () => signOut(auth);

  const devLogin = () => {
    setCurrentUser({ uid: "dev", name: "Dev" });
    setUserRole("admin");
  };

  const hasRole = (requiredRole) => {
    const userIndex = ROLE_HIERARCHY.indexOf(userRole);
    const requiredIndex = ROLE_HIERARCHY.indexOf(requiredRole);
    return userIndex >= requiredIndex;
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ currentUser, userRole, login, register, resetPassword, logout, devLogin, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
