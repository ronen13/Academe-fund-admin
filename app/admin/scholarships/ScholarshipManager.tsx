"use client";

import { useState, FormEvent, CSSProperties } from "react";

type Scholarship = {
  id: string;
  name: string;
  details: string;
  link: string | null;
  deadline: string | null;
  moreInfo: string | null;
};

const emptyForm = { name: "", details: "", link: "", deadline: "", moreInfo: "" };

export default function ScholarshipManager({
  initialScholarships,
}: {
  initialScholarships: Scholarship[];
}) {
  const [items, setItems] = useState(initialScholarships);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function refresh() {
    const res = await fetch("/api/admin/scholarships");
    const data = await res.json();
    if (data.ok) setItems(data.scholarships);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    const url = editingId ? `/api/admin/scholarships/${editingId}` : "/api/admin/scholarships";
    const method = editingId ? "PUT" : "POST";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setForm(emptyForm);
    setEditingId(null);
    refresh();
  }

  function startEdit(s: Scholarship) {
    setEditingId(s.id);
    setForm({
      name: s.name,
      details: s.details,
      link: s.link || "",
      deadline: s.deadline ? s.deadline.slice(0, 10) : "",
      moreInfo: s.moreInfo || "",
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("למחוק את המלגה? הפעולה אינה הפיכה.")) return;
    await fetch(`/api/admin/scholarships/${id}`, { method: "DELETE" });
    refresh();
  }

  const inputStyle: CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1.5px solid #f7a75c",
    fontSize: 15,
    marginBottom: 10,
    fontFamily: "Heebo, sans-serif",
    boxSizing: "border-box",
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 24, marginTop: 20 }}>
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          padding: 20,
          borderRadius: 14,
          border: "1.5px solid #f7a75c",
          height: "fit-content",
        }}
      >
        <h3 style={{ marginTop: 0, color: "#0f2e73" }}>
          {editingId ? "עריכת מלגה" : "הוספת מלגה חדשה"}
        </h3>
        <input
          style={inputStyle}
          placeholder="שם המלגה"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <textarea
          style={{ ...inputStyle, minHeight: 80 }}
          placeholder="פרטי המלגה"
          value={form.details}
          onChange={(e) => setForm({ ...form, details: e.target.value })}
        />
        <input
          style={inputStyle}
          placeholder="קישור למלגה"
          value={form.link}
          onChange={(e) => setForm({ ...form, link: e.target.value })}
        />
        <input
          style={inputStyle}
          type="date"
          value={form.deadline}
          onChange={(e) => setForm({ ...form, deadline: e.target.value })}
        />
        <textarea
          style={{ ...inputStyle, minHeight: 60 }}
          placeholder="פרטים נוספים"
          value={form.moreInfo}
          onChange={(e) => setForm({ ...form, moreInfo: e.target.value })}
        />
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              background: "#e8690f",
              color: "#fff",
              border: "none",
              borderRadius: 999,
              padding: "10px 20px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {saving ? "שומר..." : editingId ? "עדכון" : "הוספה"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
              style={{
                background: "transparent",
                border: "1.5px solid #f7a75c",
                borderRadius: 999,
                padding: "10px 20px",
                cursor: "pointer",
              }}
            >
              ביטול
            </button>
          )}
        </div>
      </form>

      <div>
        {items.length === 0 && (
          <p style={{ color: "#6e8fd6" }}>עדיין לא נוספו מלגות למאגר.</p>
        )}
        {items.map((s) => (
          <div
            key={s.id}
            style={{
              background: "#fff",
              border: "1.5px solid #f7a75c",
              borderRadius: 12,
              padding: 16,
              marginBottom: 12,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <h4 style={{ margin: 0, color: "#e8690f" }}>{s.name}</h4>
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <button
                  onClick={() => startEdit(s)}
                  style={{ background: "none", border: "none", color: "#1c4fbf", cursor: "pointer" }}
                >
                  עריכה
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  style={{ background: "none", border: "none", color: "#c94a3a", cursor: "pointer" }}
                >
                  מחיקה
                </button>
              </div>
            </div>
            {s.details && <p style={{ color: "#15398f", fontSize: 14 }}>{s.details}</p>}
            {s.deadline && (
              <p style={{ fontSize: 12, color: "#6e8fd6" }}>
                מועד הגשה: {new Date(s.deadline).toLocaleDateString("he-IL")}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
