import Link from "next/link";

export default function HomePage() {
  return (
    <main
      dir="rtl"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Heebo, sans-serif",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontFamily: "Rubik, sans-serif", color: "#0f2e73" }}>AcadeMe.Fund</h1>
        <p style={{ color: "#6e8fd6", marginBottom: 20 }}>לוח ניהול פנימי</p>
        <Link
          href="/admin"
          style={{
            display: "inline-block",
            background: "#e8690f",
            color: "#fff",
            padding: "12px 28px",
            borderRadius: 999,
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          כניסה ללוח הבקרה
        </Link>
      </div>
    </main>
  );
}
