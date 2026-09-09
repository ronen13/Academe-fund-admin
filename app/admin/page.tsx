import Link from "next/link";
import { fetchSubmissions, Submission } from "@/lib/sheets";

export default async function AdminSubmissionsPage() {
  let submissions: Submission[] = [];
  let error = "";
  try {
    submissions = await fetchSubmissions();
  } catch (e: any) {
    error = e.message || "שגיאה בטעינת הנתונים מהגיליון";
  }

  return (
    <div>
      <h1 style={{ fontFamily: "Rubik, sans-serif", color: "#0f2e73" }}>תשובות שאלון</h1>
      <p style={{ color: "#6e8fd6", fontSize: 14 }}>
        נטען ישירות מגיליון ה-Google Sheets — {submissions.length} תשובות.
      </p>
      {error && <p style={{ color: "#c94a3a" }}>{error}</p>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16, marginTop: 20 }}>
        {submissions.map((s) => (
          <Link
            key={s._row}
            href={`/admin/submissions/${s._row}`}
            style={{
              display: "block",
              background: "#fff",
              border: "1.5px solid #f7a75c",
              borderRadius: 14,
              padding: 18,
              textDecoration: "none",
            }}
          >
            <div style={{ fontFamily: "Rubik, sans-serif", color: "#0f2e73", fontSize: 17, fontWeight: 700, marginBottom: 6 }}>
              {s.full_name || "ללא שם"}
            </div>
            <div style={{ color: "#1c4fbf", fontSize: 13.5, marginBottom: 4 }}>{s.email}</div>
            {s.phone && <div style={{ color: "#6e8fd6", fontSize: 13 }}>{s.phone}</div>}
            {s.institution && (
              <div style={{ marginTop: 10, fontSize: 12.5, color: "#e8690f" }}>{s.institution}</div>
            )}
            <div style={{ marginTop: 14, fontSize: 13, color: "#e8690f", fontWeight: 700 }}>
              פתח כרטיס ›
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
