import { useCallback, useEffect, useState } from "react";
import { onValue, ref as rtdbRef } from "firebase/database";
import { getMetadata, listAll, ref } from "firebase/storage";
import { doc, onSnapshot } from "firebase/firestore";
import { db, rtdb, storage } from "../firebase/firebaseConfig";
import { useAuth } from "../context/AuthContext";

const card = {
  background: "white",
  borderRadius: 16,
  padding: 20,
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const SPARK_STORAGE_LIMIT_BYTES = 5 * 1024 * 1024 * 1024;
const SPARK_DAILY_DOWNLOAD_LIMIT_BYTES = 1 * 1024 * 1024 * 1024;

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
  const rootRef = ref(storage);
  const stack = [rootRef];
  let totalBytes = 0;
  let fileCount = 0;

  while (stack.length > 0) {
    const currentRef = stack.pop();
    const snapshot = await listAll(currentRef);
    stack.push(...snapshot.prefixes);

    const sizes = await Promise.all(
      snapshot.items.map(async (itemRef) => {
        const meta = await getMetadata(itemRef);
        return Number(meta.size) || 0;
      })
    );

    totalBytes += sizes.reduce((sum, size) => sum + size, 0);
    fileCount += snapshot.items.length;
  }

  return { totalBytes, fileCount };
}

export default function CloudPage() {
  const { hasRole } = useAuth();
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

  const usedPercent = Math.min((usage.totalBytes / SPARK_STORAGE_LIMIT_BYTES) * 100, 100);

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
    const trafficRef = doc(db, "appSettings", "cloudTrafficToday");
    const unsub = onSnapshot(
      trafficRef,
      (snap) => {
        const data = snap.data() || {};
        const downloadBytesToday = Number(data.downloadBytesToday);
        const updatedAt = typeof data.updatedAt === "string" ? data.updatedAt : "";

        setTraffic({
          loading: false,
          error: "",
          downloadBytesToday: Number.isFinite(downloadBytesToday) ? downloadBytesToday : null,
          updatedAt,
        });
      },
      () => {
        setTraffic({
          loading: false,
          error: "Tages-Traffic konnte nicht geladen werden.",
          downloadBytesToday: null,
          updatedAt: "",
        });
      }
    );
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!hasRole("vorstand")) {
      setOnlineStats({ loading: false, error: "", count: 0, lastUpdated: "" });
      return;
    }

    const statusRef = rtdbRef(rtdb, "status");
    const unsubscribe = onValue(
      statusRef,
      (snapshot) => {
        const value = snapshot.val() || {};
        const count = Object.values(value).filter((entry) => entry?.state === "online").length;
        setOnlineStats({
          loading: false,
          error: "",
          count,
          lastUpdated: new Date().toLocaleString("de-DE"),
        });
      },
      () => {
        setOnlineStats({
          loading: false,
          error: "Online-Status konnte nicht geladen werden.",
          count: 0,
          lastUpdated: "",
        });
      }
    );

    return () => unsubscribe();
  }, [hasRole]);

  const trafficPercent = traffic.downloadBytesToday == null
    ? 0
    : Math.min((traffic.downloadBytesToday / SPARK_DAILY_DOWNLOAD_LIMIT_BYTES) * 100, 100);

  return (
    <div style={{ display: "grid", gap: 16, maxWidth: 1100 }}>
      <div style={card}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 10,
          }}
        >
          <h3 style={{ margin: 0, color: "#111827" }}>Aktueller Verbrauch (Spark Free)</h3>
          <button
            onClick={loadUsage}
            disabled={usage.loading}
            style={{
              border: "none",
              borderRadius: 8,
              padding: "8px 12px",
              background: usage.loading ? "#9ca3af" : "#b91c1c",
              color: "white",
              cursor: usage.loading ? "not-allowed" : "pointer",
              fontWeight: 600,
            }}
          >
            {usage.loading ? "Lädt..." : "Verbrauch aktualisieren"}
          </button>
        </div>

        <p style={{ marginTop: 0, color: "#4b5563", marginBottom: 10 }}>
          Belegter Speicherplatz aus deinem Firebase Storage Bucket.
        </p>

        <div style={{ marginBottom: 8 }}>
          <div
            style={{
              width: "100%",
              height: 24,
              borderRadius: 999,
              overflow: "hidden",
              background: "#e5e7eb",
              border: "1px solid #d1d5db",
            }}
          >
            <div
              style={{
                width: `${usedPercent}%`,
                height: "100%",
                background: usedPercent > 85 ? "#dc2626" : "#b91c1c",
                transition: "width 300ms ease",
              }}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", color: "#1f2937", fontSize: 14 }}>
          <span>Belegt: {formatBytes(usage.totalBytes)}</span>
          <span>Limit: {formatBytes(SPARK_STORAGE_LIMIT_BYTES)}</span>
          <span>Auslastung: {usedPercent.toFixed(2)}%</span>
          <span>Dateien: {usage.fileCount}</span>
        </div>

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
          Hinweis: Download-Traffic/Operationen pro Tag stellt Firebase nicht direkt im Client-SDK als Live-Wert bereit.
          Diese Werte siehst du in der Firebase Console unter Usage/Billing.
        </p>
      </div>

      <div style={card}>
        <h3 style={{ marginTop: 0, marginBottom: 8, color: "#111827" }}>Tages-Traffic (Spark Free)</h3>
        <p style={{ marginTop: 0, color: "#4b5563", marginBottom: 10 }}>
          Tageslimit Download im Spark-Tarif: {formatBytes(SPARK_DAILY_DOWNLOAD_LIMIT_BYTES)}.
        </p>

        <div style={{ marginBottom: 8 }}>
          <div
            style={{
              width: "100%",
              height: 24,
              borderRadius: 999,
              overflow: "hidden",
              background: "#e5e7eb",
              border: "1px solid #d1d5db",
            }}
          >
            <div
              style={{
                width: `${trafficPercent}%`,
                height: "100%",
                background: trafficPercent > 85 ? "#dc2626" : "#2563eb",
                transition: "width 300ms ease",
              }}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", color: "#1f2937", fontSize: 14 }}>
          <span>
            Heute geladen: {traffic.loading ? "Lädt..." : traffic.downloadBytesToday == null ? "Keine Daten" : formatBytes(traffic.downloadBytesToday)}
          </span>
          <span>Limit: {formatBytes(SPARK_DAILY_DOWNLOAD_LIMIT_BYTES)}</span>
          <span>Auslastung: {traffic.downloadBytesToday == null ? "-" : `${trafficPercent.toFixed(2)}%`}</span>
        </div>

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
          Für eine echte Live-Anzeige muss ein Backend-Job den heutigen Download-Traffic nach
          appSettings/cloudTrafficToday schreiben (Feld: downloadBytesToday).
        </p>
      </div>

      {hasRole("vorstand") && (
        <div style={card}>
          <h3 style={{ marginTop: 0, marginBottom: 8, color: "#111827" }}>
            Aktuell online
          </h3>
          <p style={{ marginTop: 0, color: "#4b5563", marginBottom: 10 }}>
            Live-Anzahl der aktuell verbundenen Nutzer.
          </p>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 96,
              borderRadius: 12,
              padding: "10px 14px",
              background: "#ecfdf5",
              border: "1px solid #a7f3d0",
              color: "#065f46",
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            {onlineStats.loading ? "..." : onlineStats.count}
          </div>

          {onlineStats.lastUpdated && (
            <p style={{ marginBottom: 0, marginTop: 10, fontSize: 12, color: "#6b7280" }}>
              Zuletzt aktualisiert: {onlineStats.lastUpdated}
            </p>
          )}

          {onlineStats.error && (
            <p style={{ marginBottom: 0, marginTop: 10, color: "#b91c1c", fontSize: 13 }}>
              {onlineStats.error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
