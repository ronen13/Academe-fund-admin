"use client";

import { useState } from "react";

type Scholarship = { id: string; name: string; details: string };

export default function ReportBuilder({
  scholarships,
  defaultName,
  defaultEmail,
  defaultPhone,
  submissionRef,
}: {
  scholarships: Scholarship[];
  defaultName: string;
  defaultEmail: string;
  defaultPhone: string;
  submissionRef: string;
}) {
  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [phone, setPhone] = useState(defaultPhone);
  const [selected, setSelected] = useState<string[]>([]);
  const [result, setResult] = useState<{ token: string } | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState("");

  function toggle(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  async function handleCreate() {
    const res = await fetch("/api/admin/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentName: name,
        studentEmail: email,
        studentPhone: phone,
        submissionRef,
        scholarshipIds: selected,
      }),
    });
    const data = await res.json();
    if (data.ok) setResult({ token: data.token });
  }

  async function handleSend() {
    if (!result) return;
    setSending(true);
    setSendError("");
    const res = await fetch(`/api/admin/reports/${result.token}/send`, { method: "POST" });
    const data = await res.json();
    setSending(false);
    if (data.ok) {
      setSent(true);
    } else {
      setSendError(data.error || "שגיאה בשליחה");
    }
  }

  const reportUrl = result
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/report/${result.token}`
    : "";

  const inputStyle = {
    padding: 10,
    borderRadius: 8,
    border: "1.5px solid #f7a75c",
    fontSize: 15,
    boxSizing: "border-box" as const,
  };

  return (
    <div style={{ maxWidth: 700 }}>
      <div style={{ display: "grid", gap: 10, marginBottom: 24 }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="שם הסטודנט/ית"
          style={inputStyle}
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="אימייל"
          style={inputStyle}
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="טלפון (רשות)"
          style={inputStyle}
        />
      </div>

      <h3 style={{ color: "#0f2e73" }}>בחירת מלגות מתאימות</h3>
      <div style={{ display: "grid", gap: 8, marginBottom: 24 }}>
        {scholarships.length === 0 && (
          <p style={{ color: "#6e8fd6" }}>
            אין עדיין מלגות במאגר — הוסף מלגות בעמוד "מאגר מלגות" תחילה.
          </p>
        )}
        {scholarships.map((s) => (
          <label
            key={s.id}
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              background: "#fff",
              border: "1.5px solid #f7a75c",
              borderRadius: 8,
              padding: 10,
              cursor: "pointer",
            }}
          >
            <input type="checkbox" checked={selected.includes(s.id)} onChange={() => toggle(s.id)} />
            <span>{s.name}</span>
          </label>
        ))}
      </div>

      {!result ? (
        <button
          onClick={handleCreate}
          disabled={!email || selected.length === 0}
          style={{
            background: "#e8690f",
            color: "#fff",
            border: "none",
            borderRadius: 999,
            padding: "12px 24px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          יצירת דוח וקישור ייחודי
        </button>
      ) : (
        <div style={{ background: "#fff", border: "1.5px solid #f7a75c", borderRadius: 12, padding: 20 }}>
          <p style={{ margin: "0 0 6px" }}>קישור ייחודי לדוח:</p>
          <p style={{ margin: "0 0 16px" }}>
            <a href={reportUrl} target="_blank" rel="noopener" style={{ color: "#e8690f" }}>
              {reportUrl}
            </a>
          </p>
          {sendError && <p style={{ color: "#c94a3a" }}>{sendError}</p>}
          <button
            onClick={handleSend}
            disabled={sending || sent}
            style={{
              background: "#1c4fbf",
              color: "#fff",
              border: "none",
              borderRadius: 999,
              padding: "10px 20px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {sent ? "נשלח ✓" : sending ? "שולח..." : "שליחה במייל + PDF ללקוח"}
          </button>
        </div>
      )}
    </div>
  );
}
