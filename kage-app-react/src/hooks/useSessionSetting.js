import { useEffect, useState } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export function useSessionSetting(canEditSession, currentUser) {
  const [sessionValue, setSessionValue] = useState("Session 2026/2027");
  const [sessionSaving, setSessionSaving] = useState(false);

  useEffect(() => {
    const sessionRef = doc(db, "appSettings", "session");
    const unsub = onSnapshot(sessionRef, (snap) => {
      const value = snap.data()?.activeSession;
      if (typeof value === "string" && value.trim()) {
        setSessionValue(value);
      }
    });
    return () => unsub();
  }, []);

  async function handleSessionChange(nextSession) {
    setSessionValue(nextSession);
    if (!canEditSession) return;

    setSessionSaving(true);
    try {
      await setDoc(
        doc(db, "appSettings", "session"),
        {
          activeSession: nextSession,
          updatedBy: currentUser?.uid ?? null,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } finally {
      setSessionSaving(false);
    }
  }

  return {
    sessionValue,
    sessionSaving,
    handleSessionChange,
  };
}
