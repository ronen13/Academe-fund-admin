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

  const thStyle: React.CSSProperties = { padding: 10, fontSize: 13, color: "#6e8fd6" };
  const tdStyle: React.CSSProperties = { padding: 10, fontSize: 14 };

  return (
    <div>
      <h1 style={{ fontFamily: "Rubik, sans-serif", color: "#0f2e73" }}>תשובות שאלון</h1>
      <p style={{ color: "#6e8fd6", fontSize: 14 }}>
        נטען ישירות מגיליון ה-Google Sheets — {submissions.length} תשובות.
      </p>
      {error && <p style={{ color: "#c94a3a" }}>{error}</p>}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 20, background: "#fff" }}>
          <thead>
            <tr style={{ textAlign: "right", borderBottom: "2px solid #f7a75c" }}>
              <th style={thStyle}>שם</th>
              <th style={thStyle}>אימייל</th>
              <th style={thStyle}>טלפון</th>
              <th style={thStyle}>מוסד</th>
              <th style={thStyle}>תחום</th>
              <th style={thStyle}></th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((s) => (
              <tr key={s._row} style={{ borderBottom: "1px solid #eee" }}>
                <td style={tdStyle}>{s.full_name}</td>
                <td style={tdStyle}>{s.email}</td>
                <td style={tdStyle}>{s.phone}</td>
                <td style={tdStyle}>{s.institution}</td>
                <td style={tdStyle}>{s.field_of_study}</td>
                <td style={tdStyle}>
                  <Link
                    href={`/admin/reports/new?name=${encodeURIComponent(
                      s.full_name || ""
                    )}&email=${encodeURIComponent(s.email || "")}&phone=${encodeURIComponent(
                      s.phone || ""
                    )}&ref=${s._row}`}
                    style={{ color: "#e8690f", fontWeight: 700, textDecoration: "none" }}
                  >
                    הכן דוח מלגות ›
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
