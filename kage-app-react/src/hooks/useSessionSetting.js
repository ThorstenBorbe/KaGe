import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseConfig";

function parseSettingValue(value) {
  if (typeof value !== "string") return "";
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

export function useSessionSetting(canEditSession, currentUser) {
  const [sessionValue, setSessionValue] = useState("Session 2026/2027");
  const [sessionSaving, setSessionSaving] = useState(false);

  useEffect(() => {
    if (currentUser?.uid === "dev") return undefined;

    let mounted = true;

    const loadSession = async () => {
      const { data, error } = await supabase
        .from("app_settings")
        .select("value")
        .eq("key", "session")
        .maybeSingle();

      if (error || !mounted) return;

      const parsed = parseSettingValue(data?.value);
      if (typeof parsed === "string" && parsed.trim()) {
        setSessionValue(parsed);
      }
    };

    loadSession();

    const channel = supabase
      .channel("app-settings-session")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "app_settings",
          filter: "key=eq.session",
        },
        (payload) => {
          const parsed = parseSettingValue(payload.new?.value);
          if (typeof parsed === "string" && parsed.trim()) {
            setSessionValue(parsed);
          }
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [currentUser]);

  async function handleSessionChange(nextSession) {
    setSessionValue(nextSession);
    if (!canEditSession || currentUser?.uid === "dev") return;

    setSessionSaving(true);
    try {
      const { error } = await supabase.from("app_settings").upsert(
        {
          key: "session",
          value: JSON.stringify(nextSession),
          updated_by: currentUser?.uid ?? null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "key" }
      );
      if (error) throw error;
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
