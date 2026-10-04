import { useCallback, useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseConfig";
import { useAuth } from "../context/useAuth";
import { MITGLIEDER_GRUPPEN } from "../config/mitgliederGruppen";

export default function FreigabenPage() {
  const { hasRole } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyEmail, setBusyEmail] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: loadError } = await supabase
      .from("Mitglieder")
      .select("*")
      .or("Freigabe.is.null,Freigabe.eq.false");
    if (loadError) {
      setError(`Registrierungen konnten nicht geladen werden: ${loadError.message}`);
      setItems([]);
    } else {
      setError("");
      setItems(data ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  async function approve(email) {
    setBusyEmail(email);
    setError("");
    const { data, error: updateError } = await supabase
      .from("Mitglieder")
      .update({ Freigabe: true })
      .eq("Email", email)
      .select("Email");
    if (updateError || !data?.length) {
      setError(updateError?.message ?? "Freigabe wurde nicht gespeichert (fehlende Berechtigung?).");
    } else {
      setItems((prev) => prev.filter((item) => item.Email !== email));
    }
    setBusyEmail("");
  }

  if (!hasRole("praesidium")) {
    return <div style={{ padding: 24 }}>Keine Berechtigung.</div>;
  }

  return (
    <div style={{ padding: 24, maxWidth: 900 }}>
      <h2 style={{ marginTop: 0 }}>Freigaben</h2>
      <p style={{ color: "#6b7280", fontSize: 14 }}>
        Registrierungen, die noch nicht freigegeben sind. Erst nach der Freigabe sehen Mitglieder Daten in der App.
      </p>
      {error && <p style={{ color: "#b91c1c" }}>{error}</p>}
      {loading ? (
        <p>Lade …</p>
      ) : items.length === 0 ? (
        <p>Keine offenen Registrierungen.</p>
      ) : (
        items.map((item) => {
          const gruppen = MITGLIEDER_GRUPPEN.filter((g) => item[g.column] === true).map((g) => g.label);
          return (
            <div
              key={item.Email}
              style={{
                display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
                flexWrap: "wrap", padding: "12px 16px", marginBottom: 10,
                border: "1px solid #e5e7eb", borderRadius: 10, background: "#fff",
              }}
            >
              <div>
                <div style={{ fontWeight: 700 }}>{item.Vorname} {item.Nachname}</div>
                <div style={{ fontSize: 13, color: "#4b5563" }}>{item.Email}</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>
                  Gruppen: {gruppen.length ? gruppen.join(", ") : "keine angegeben"}
                </div>
              </div>
              <button
                type="button"
                disabled={busyEmail === item.Email}
                onClick={() => approve(item.Email)}
                style={{
                  padding: "8px 16px", background: "#16a34a", color: "#fff", border: "none",
                  borderRadius: 8, fontWeight: 600, cursor: "pointer",
                }}
              >
                ✓ Freigeben
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}
