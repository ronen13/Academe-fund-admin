import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div dir="rtl" style={{ display: "flex", minHeight: "100vh", fontFamily: "Heebo, sans-serif" }}>
      <aside style={{ width: 220, background: "#0f2e73", color: "#fff", padding: 24, flexShrink: 0 }}>
        <h2 style={{ fontFamily: "Rubik, sans-serif", marginBottom: 28, fontSize: 18 }}>
          AcadeMe.Fund
        </h2>
        <nav style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Link href="/admin" style={{ color: "#fff", textDecoration: "none" }}>
            תשובות שאלון
          </Link>
          <Link href="/admin/scholarships" style={{ color: "#fff", textDecoration: "none" }}>
            מאגר מלגות
          </Link>
          <Link href="/admin/reports" style={{ color: "#fff", textDecoration: "none" }}>
            דוחות שהופקו
          </Link>
        </nav>
        <div style={{ marginTop: 48 }}>
          <LogoutButton />
        </div>
      </aside>
      <main style={{ flex: 1, padding: 32, background: "#f7f9fc" }}>{children}</main>
    </div>
  );
}
