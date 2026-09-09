"use client";

import { useState, ReactNode } from "react";

export default function SubmissionTabs({ tabs }: { tabs: { label: string; content: ReactNode }[] }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div style={{ display: "flex", gap: 4, borderBottom: "1.5px solid #f7a75c", marginBottom: 22, flexWrap: "wrap" }}>
        {tabs.map((t, i) => (
          <button
            key={t.label}
            onClick={() => setActive(i)}
            style={{
              padding: "10px 16px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontWeight: active === i ? 700 : 500,
              color: active === i ? "#e8690f" : "#6e8fd6",
              borderBottom: active === i ? "3px solid #e8690f" : "3px solid transparent",
              fontSize: 14,
              fontFamily: "Heebo, sans-serif",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div>{tabs[active]?.content}</div>
    </div>
  );
}
