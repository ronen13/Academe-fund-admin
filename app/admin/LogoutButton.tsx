"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <button
      onClick={handleLogout}
      style={{
        background: "transparent",
        border: "1px solid #fff",
        color: "#fff",
        padding: "8px 16px",
        borderRadius: 999,
        cursor: "pointer",
      }}
    >
      התנתקות
    </button>
  );
}
