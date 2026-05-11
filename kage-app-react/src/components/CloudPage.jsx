import { useCallback, useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseConfig";
import { useAuth } from "../context/useAuth";
import { useIsMobile } from "../hooks/useIsMobile";

const STORAGE_BUCKET = "daten";

const card = {
  background: "white",
  borderRadius: 16, // Kartenform: 0 = eckig, 12 = neutral, 24 = weicher
  padding: 20, // Standard-Innenabstand; mobil wird unten gezielt reduziert
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const pageGridStyle = {
  display: "grid",
  gap: 16,
  maxWidth: 1100,
  marginBottom: "60px",
};

const usageButtonStyle = (isMobile, isLoading) => ({
  border: "none",
  borderRadius: 8, // Schaltflaechenform: 4 = sachlicher, 8 = Standard, 999 = pillenartig
  padding: "8px 12px", // Groesse leicht anpassbar, ohne den Rest der Karte zu veraendern
  minWidth: isMobile ? 0 : 220,
  width: isMobile ? "100%" : "auto",
  background: isLoading ? "#9ca3af" : "#b91c1c", // Grau deaktiviert, Rot aktive Primaeraktion
  color: "white",
  cursor: isLoading ? "not-allowed" : "pointer",
  fontWeight: 600,
  textAlign: "center",
});

const progressTrackStyle = {
  width: "100%",
  height: 24,
  borderRadius: 999, // Pillenform fuer Fortschrittsbalken; alternativ 8 fuer kantigeres Design
  overflow: "hidden",
  background: "#e5e7eb",
  border: "1px solid #d1d5db",
};

const onlineBadgeStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: 96,
  borderRadius: 12, // Markenform: 6 = kompakter, 12 = freundlich, 999 = pillenartig
  padding: "10px 14px",
  background: "#ecfdf5",
  border: "1px solid #a7f3d0",
  color: "#065f46",
  fontSize: 26,
  fontWeight: 700,
};

const SUPABASE_STORAGE_LIMIT_BYTES = 5 * 1024 * 1024 * 1024;
const SUPABASE_DAILY_DOWNLOAD_LIMIT_BYTES = 1 * 1024 * 1024 * 1024;

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  const decimals = value >= 100 ? 0 : value >= 10 ? 1 : 2;
  return `${value.toFixed(decimals)} ${units[unitIndex]}`;
}

async function readStorageUsage() {
  const stack = [""];
  let totalBytes = 0;
  let fileCount = 0;

  while (stack.length > 0) {
    const prefix = stack.pop() ?? "";
    const { data, error } = await supabase
      .storage
      .from(STORAGE_BUCKET)
      .list(prefix, { limit: 1000, sortBy: { column: "name", order: "asc" } });

    if (error) throw error;

    for (const item of data ?? []) {
      if (!item.id) {
        const nextPrefix = prefix ? `${prefix}/${item.name}` : item.name;
        stack.push(nextPrefix);
        continue;
      }

      totalBytes += Number(item.metadata?.size ?? 0);
      fileCount += 1;
    }
  }

  return { totalBytes, fileCount };
}

function parseSettingValue(value) {
  if (typeof value !== "string") return null;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

export default function CloudPage() {
  const isMobile = useIsMobile(960);
  const authContext = useAuth();
  const canSeeOnlineStats = typeof authContext?.hasRole === "function"
    ? authContext.hasRole("vorstand")
    : false;
  const [usage, setUsage] = useState({
    loading: true,
    error: "",
    totalBytes: 0,
    fileCount: 0,
    lastUpdated: "",
  });
  const [traffic, setTraffic] = useState({
    loading: true,
    error: "",
    downloadBytesToday: null,
    updatedAt: "",
  });
  const [onlineStats, setOnlineStats] = useState({
    loading: true,
    error: "",
    count: 0,
    lastUpdated: "",
  });

  const usedPercent = Math.min((usage.totalBytes / SUPABASE_STORAGE_LIMIT_BYTES) * 100, 100);

  const loadUsage = useCallback(async () => {
    setUsage((prev) => ({ ...prev, loading: true, error: "" }));
    try {
      const result = await readStorageUsage();
      setUsage({
        loading: false,
        error: "",
        totalBytes: result.totalBytes,
        fileCount: result.fileCount,
        lastUpdated: new Date().toLocaleString("de-DE"),
      });
    } catch (error) {
      setUsage((prev) => ({
        ...prev,
        loading: false,
        error: "Verbrauch konnte nicht geladen werden. Bitte Storage-Regeln/Berechtigungen prüfen.",
      }));
    }
  }, []);

  useEffect(() => {
    loadUsage();
  }, [loadUsage]);

  useEffect(() => {
    let mounted = true;

    const applyTraffic = (row) => {
      const parsed = parseSettingValue(row?.value);
      const downloadBytesToday = Number(parsed?.downloadBytesToday);
      const updatedAt = typeof parsed?.updatedAt === "string"
        ? parsed.updatedAt
        : (typeof row?.updated_at === "string" ? row.updated_at : "");

      setTraffic({
        loading: false,
        error: "",
        downloadBytesToday: Number.isFinite(downloadBytesToday) ? downloadBytesToday : null,
        updatedAt,
      });
    };

    const loadTraffic = async () => {
      const { data, error } = await supabase
        .from("app_settings")
        .select("value, updated_at")
        .eq("key", "cloudTrafficToday")
        .maybeSingle();

      if (!mounted) return;

      if (error) {
        setTraffic({
          loading: false,
          error: "Tages-Traffic konnte nicht geladen werden.",
          downloadBytesToday: null,
          updatedAt: "",
        });
        return;
      }

      applyTraffic(data);
    };

    loadTraffic();

    const channel = supabase
      .channel("cloud-traffic-setting")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "app_settings",
          filter: "key=eq.cloudTrafficToday",
        },
        (payload) => applyTraffic(payload.new)
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (!canSeeOnlineStats) {
      setOnlineStats({ loading: false, error: "", count: 0, lastUpdated: "" });
      return;
    }

    const channel = supabase
      .channel("online-users")
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const count = Object.values(state).reduce((sum, entries) => sum + entries.length, 0);

        setOnlineStats({
          loading: false,
          error: "",
          count,
          lastUpdated: new Date().toLocaleString("de-DE"),
        });
      })
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR") {
          setOnlineStats({
            loading: false,
            error: "Online-Status konnte nicht geladen werden.",
            count: 0,
            lastUpdated: "",
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [canSeeOnlineStats]);

  const trafficPercent = traffic.downloadBytesToday == null
    ? 0
    : Math.min((traffic.downloadBytesToday / SUPABASE_DAILY_DOWNLOAD_LIMIT_BYTES) * 100, 100);

  return (
    <div style={pageGridStyle}>
      <div style={{ ...card, padding: isMobile ? 14 : 20 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            marginBottom: 10,
          }}
        >
          <h3 style={{ margin: 0, color: "#111827", textAlign: "center" }}>Aktueller Verbrauch (Supabase Free Plan)</h3>
          <button
            onClick={loadUsage}
            disabled={usage.loading}
            style={usageButtonStyle(isMobile, usage.loading)}
          >
            {usage.loading ? "Lädt..." : "Verbrauch aktualisieren"}
          </button>
        </div>

        <p style={{ marginTop: 0, color: "#4b5563", marginBottom: 10 }}>
          Belegter Speicherplatz im Supabase-Speicher.
        </p>

        {usage.loading ? (
          <div style={{ display: "grid", gap: 8, marginBottom: 8 }}>
            <div className="skeleton" style={{ height: 24, borderRadius: 999 }} />
            <div style={{ display: "flex", gap: 12 }}>
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="skeleton" style={{ height: 16, width: 90, borderRadius: 4 }} />
              ))}
            </div>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 8 }}>
              <div
                style={progressTrackStyle}
              >
                <div
                  style={{
                    width: `${usedPercent}%`,
                    height: "100%",
                    background: usedPercent > 85 ? "#dc2626" : "#b91c1c", // Ab 85% signalisiert dunkleres Rot die hohe Auslastung
                    transition: "width 300ms ease",
                  }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: isMobile ? 6 : 16, flexWrap: "wrap", color: "#1f2937", fontSize: 14, flexDirection: isMobile ? "column" : "row" }}>
              <span>Belegt: {formatBytes(usage.totalBytes)}</span>
              <span>Limit: {formatBytes(SUPABASE_STORAGE_LIMIT_BYTES)}</span>
              <span>Auslastung: {usedPercent.toFixed(2)}%</span>
              <span>Dateien: {usage.fileCount}</span>
            </div>
          </>
        )}

        {usage.lastUpdated && (
          <p style={{ marginBottom: 0, marginTop: 10, fontSize: 12, color: "#6b7280" }}>
            Zuletzt aktualisiert: {usage.lastUpdated}
          </p>
        )}

        {usage.error && (
          <p style={{ marginBottom: 0, marginTop: 10, color: "#b91c1c", fontSize: 13 }}>
            {usage.error}
          </p>
        )}

        <p style={{ marginBottom: 0, marginTop: 12, color: "#6b7280", fontSize: 12 }}>
          Hinweis: Download-Traffic/Operationen pro Tag sind im Client nur über eigene Statistiken sichtbar.
          Diese Werte kannst du als JSON im Eintrag app_settings/cloudTrafficToday pflegen.
        </p>
      </div>

      <div style={{ ...card, padding: isMobile ? 14 : 20 }}>
        <h3 style={{ marginTop: 0, marginBottom: 8, color: "#111827" }}>Tages-Traffic (Supabase Free Plan)</h3>
        <p style={{ marginTop: 0, color: "#4b5563", marginBottom: 10 }}>
          Tageslimit Download (Schätzwert): {formatBytes(SUPABASE_DAILY_DOWNLOAD_LIMIT_BYTES)}.
        </p>

        {traffic.loading ? (
          <div style={{ display: "grid", gap: 8, marginBottom: 8 }}>
            <div className="skeleton" style={{ height: 24, borderRadius: 999 }} />
            <div style={{ display: "flex", gap: 12 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} className="skeleton" style={{ height: 16, width: 90, borderRadius: 4 }} />
              ))}
            </div>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 8 }}>
              <div
                style={progressTrackStyle}
              >
                <div
                  style={{
                    width: `${trafficPercent}%`,
                    height: "100%",
                    background: trafficPercent > 85 ? "#dc2626" : "#2563eb", // Blau trennt den Traffic visuell vom Speicherverbrauch
                    transition: "width 300ms ease",
                  }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: isMobile ? 6 : 16, flexWrap: "wrap", color: "#1f2937", fontSize: 14, flexDirection: isMobile ? "column" : "row" }}>
              <span>Heute geladen: {traffic.downloadBytesToday == null ? "Keine Daten" : formatBytes(traffic.downloadBytesToday)}</span>
              <span>Limit: {formatBytes(SUPABASE_DAILY_DOWNLOAD_LIMIT_BYTES)}</span>
              <span>Auslastung: {traffic.downloadBytesToday == null ? "-" : `${trafficPercent.toFixed(2)}%`}</span>
            </div>
          </>
        )}

        {traffic.updatedAt && (
          <p style={{ marginBottom: 0, marginTop: 10, fontSize: 12, color: "#6b7280" }}>
            Traffic zuletzt aktualisiert: {traffic.updatedAt}
          </p>
        )}

        {traffic.error && (
          <p style={{ marginBottom: 0, marginTop: 10, color: "#b91c1c", fontSize: 13 }}>
            {traffic.error}
          </p>
        )}

        <p style={{ marginBottom: 0, marginTop: 12, color: "#6b7280", fontSize: 12 }}>
          Für eine Live-Anzeige schreibe ein Backend den Tageswert in app_settings/cloudTrafficToday
          (Beispiel: <code>{'{"downloadBytesToday": 12345, "updatedAt": "2026-05-04T10:00:00.000Z"}'}</code>).
        </p>
      </div>

      {canSeeOnlineStats && (
        <div style={{ ...card, padding: isMobile ? 14 : 20, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h3 style={{ marginTop: 0, marginBottom: 8, color: "#111827", textAlign: "center" }}>
            Aktuell online
          </h3>
          <p style={{ marginTop: 0, color: "#4b5563", marginBottom: 10, textAlign: "center" }}>
            Live-Anzahl der aktuell verbundenen Nutzer.
          </p>

          {onlineStats.loading ? (
            <div className="skeleton" style={{ height: 56, width: 96, borderRadius: 12 }} />
          ) : (
            <div
              style={onlineBadgeStyle}
            >
              {onlineStats.count}
            </div>
          )}

          {onlineStats.lastUpdated && (
            <p style={{ marginBottom: 0, marginTop: 10, fontSize: 12, color: "#6b7280", textAlign: "center" }}>
              Zuletzt aktualisiert: {onlineStats.lastUpdated}
            </p>
          )}

          {onlineStats.error && (
            <p style={{ marginBottom: 0, marginTop: 10, color: "#b91c1c", fontSize: 13, textAlign: "center" }}>
              {onlineStats.error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
