import Link from "next/link";
import { fetchSubmissions, Submission } from "@/lib/sheets";

const FIELD_ORDER = [
  "submitted_at", "full_name", "email", "phone",
  "age", "residence_town", "grew_up_here", "housing", "rent_difficulty",
  "assistance_types",
  "study_status", "institution", "campus", "field_of_study", "field_of_study_other",
  "study_type", "study_year", "achievements", "gpa",
  "parents_education", "target_groups", "haredi_background", "haredi_support",
  "family_status", "has_children", "children_count", "children_ages",
  "employment", "monthly_income", "scholarship_amount",
  "external_tuition_funding", "external_tuition_funding_source",
  "extra_funding_year", "extra_funding_degree",
  "service_type_status", "service_type", "reserve_duty", "spouse_reserve_duty",
  "consent", "source",
];

const FIELD_LABELS: Record<string, string> = {
  submitted_at: "תאריך שליחה",
  full_name: "שם מלא",
  email: "אימייל",
  phone: "טלפון",
  age: "גיל",
  residence_town: "יישוב",
  grew_up_here: "גדל/ה ביישוב",
  housing: "מגורים בלימודים",
  rent_difficulty: "קושי במימון דיור",
  assistance_types: "סוגי סיוע מבוקשים",
  study_status: "סטטוס לימודים",
  institution: "מוסד לימודים",
  campus: "קמפוס",
  field_of_study: "תחום לימודים",
  field_of_study_other: "תחום לימודים (אחר)",
  study_type: "סוג לימודים",
  study_year: "שנת לימודים",
  achievements: "הישגים אקדמיים",
  gpa: "ממוצע ציונים",
  parents_education: "השכלת הורים",
  target_groups: "קבוצות שיוך",
  haredi_background: "רקע חרדי",
  haredi_support: "מעוניין/ת בליווי",
  family_status: "מצב משפחתי",
  has_children: "יש ילדים",
  children_count: "מספר ילדים",
  children_ages: "גילאי ילדים",
  employment: "עבודה בזמן הלימודים",
  monthly_income: "הכנסה חודשית",
  scholarship_amount: "גובה מלגה משוער",
  external_tuition_funding: "מימון חיצוני לשכ״ל",
  external_tuition_funding_source: "מקור המימון החיצוני",
  extra_funding_year: "מימון נוסף לשנה הקרובה",
  extra_funding_degree: "מימון נוסף להשלמת התואר",
  service_type_status: "שירות צבאי/לאומי",
  service_type: "סוג שירות",
  reserve_duty: "משרת/ת מילואים",
  spouse_reserve_duty: "בן/בת זוג במילואים",
  consent: "אישור שימוש במידע",
  source: "מקור",
};

export default async function AdminSubmissionsPage() {
  let submissions: Submission[] = [];
  let error = "";
  try {
    submissions = await fetchSubmissions();
  } catch (e: any) {
    error = e.message || "שגיאה בטעינת הנתונים מהגיליון";
  }

  const extraKeys =
    submissions.length > 0
      ? Object.keys(submissions[0]).filter((k) => k !== "_row" && !FIELD_ORDER.includes(k))
      : [];
  const columns = [...FIELD_ORDER, ...extraKeys];

  const thStyle: React.CSSProperties = {
    padding: "10px 14px",
    fontSize: 12.5,
    color: "#6e8fd6",
    whiteSpace: "nowrap",
  };
  const tdStyle: React.CSSProperties = {
    padding: "10px 14px",
    fontSize: 13.5,
    whiteSpace: "nowrap",
    maxWidth: 220,
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  return (
    <div>
      <h1 style={{ fontFamily: "Rubik, sans-serif", color: "#0f2e73" }}>תשובות שאלון</h1>
      <p style={{ color: "#6e8fd6", fontSize: 14 }}>
        נטען ישירות מגיליון ה-Google Sheets — {submissions.length} תשובות, {columns.length} עמודות. אפשר לגלול אופקית לצפייה בכל השדות.
      </p>
      {error && <p style={{ color: "#c94a3a" }}>{error}</p>}
      <div style={{ overflowX: "auto", border: "1px solid #eee", borderRadius: 10 }}>
        <table style={{ borderCollapse: "collapse", background: "#fff", minWidth: "100%" }}>
          <thead>
            <tr style={{ textAlign: "right", borderBottom: "2px solid #f7a75c" }}>
              {columns.map((key) => (
                <th key={key} style={thStyle}>
                  {FIELD_LABELS[key] || key}
                </th>
              ))}
              <th style={thStyle}></th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((s) => (
              <tr key={s._row} style={{ borderBottom: "1px solid #eee" }}>
                {columns.map((key) => (
                  <td key={key} style={tdStyle} title={s[key] || ""}>
                    {s[key] || ""}
                  </td>
                ))}
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
