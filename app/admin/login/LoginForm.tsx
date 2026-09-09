"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push(params.get("next") || "/admin");
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "שגיאה בהתחברות");
    }
  }

  return (
    <main
      dir="rtl"
      style={{ maxWidth: 380, margin: "80px auto", fontFamily: "Heebo, sans-serif", padding: "0 20px" }}
    >
      <h1 style={{ fontFamily: "Rubik, sans-serif", color: "#0f2e73", textAlign: "center" }}>
        כניסת מנהל
      </h1>
      <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="סיסמה"
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: 8,
            border: "1.5px solid #f7a75c",
            fontSize: 16,
            marginBottom: 12,
            boxSizing: "border-box",
          }}
        />
        {error && <p style={{ color: "#c94a3a", fontSize: 14 }}>{error}</p>}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: 999,
            border: "none",
            background: "#e8690f",
            color: "#fff",
            fontWeight: 700,
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          {loading ? "מתחבר/ת..." : "כניסה"}
        </button>
      </form>
    </main>
  );
}
