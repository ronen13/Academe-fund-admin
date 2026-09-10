export const dynamic = "force-dynamic";
import { fetchSubmissions } from "@/lib/sheets";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import SubmissionReportBuilder from "../../SubmissionReportBuilder";
import SubmissionTabs from "../../SubmissionTabs";

const GROUPS: { title: string; fields: string[] }[] = [
  { title: "פרטים אישיים", fields: ["full_name", "email", "phone", "age", "residence_town", "grew_up_here", "housing", "rent_difficulty"] },
  { title: "סוג הסיוע המבוקש", fields: ["assistance_types"] },
  { title: "לימודים והשכלה", fields: ["study_status", "institution", "campus", "field_of_study", "field_of_study_other", "study_type", "study_year", "achievements", "gpa"] },
  { title: "רקע אישי ואוכלוסיות יעד", fields: ["parents_education", "target_groups", "haredi_background", "haredi_support"] },
  { title: "מצב משפחתי וכלכלי", fields: ["family_status", "has_children", "children_count", "children_ages", "employment", "monthly_income", "scholarship_amount", "external_tuition_funding", "external_tuition_funding_source", "extra_funding_year", "extra_funding_degree"] },
  { title: "שירות וזכויות מיוחדות", fields: ["service_type_status", "service_type", "reserve_duty", "spouse_reserve_duty"] },
];

const FIELD_LABELS: Record<string, string> = {
  submitted_at: "תאריך שליחה", full_name: "שם מלא", email: "אימייל", phone: "טלפון",
  age: "גיל", residence_town: "יישוב", grew_up_here: "גדל/ה ביישוב", housing: "מגורים בלימודים",
  rent_difficulty: "קושי במימון דיור", assistance_types: "סוגי סיוע מבוקשים",
  study_status: "סטטוס לימודים", institution: "מוסד לימודים", campus: "קמפוס",
  field_of_study: "תחום לימודים", field_of_study_other: "תחום לימודים (אחר)",
  study_type: "סוג לימודים", study_year: "שנת לימודים", achievements: "הישגים אקדמיים", gpa: "ממוצע ציונים",
  parents_education: "השכלת הורים", target_groups: "קבוצות שיוך", haredi_background: "רקע חרדי",
  haredi_support: "מעוניין/ת בליווי", family_status: "מצב משפחתי", has_children: "יש ילדים",
  children_count: "מספר ילדים", children_ages: "גילאי ילדים", employment: "עבודה בזמן הלימודים",
  monthly_income: "הכנסה חודשית", scholarship_amount: "גובה מלגה משוער",
  external_tuition_funding: "מימון חיצוני לשכ״ל", external_tuition_funding_source: "מקור המימון החיצוני",
  extra_funding_year: "מימון נוסף לשנה הקרובה", extra_funding_degree: "מימון נוסף להשלמת התואר",
  service_type_status: "שירות צבאי/לאומי", service_type: "סוג שירות",
  reserve_duty: "משרת/ת מילואים", spouse_reserve_duty: "בן/בת זוג במילואים",
};

export default async function SubmissionCardPage({ params }: { params: { row: string } }) {
  const submissions = await fetchSubmissions();
  const submission = submissions.find((s) => String(s._row) === params.row);
  if (!submission) return notFound();

  const scholarships = await prisma.scholarship.findMany({ orderBy: { createdAt: "desc" } });

  const groupTabs = GROUPS.map((group) => {
    const filled = group.fields.filter((f) => submission[f]);
    if (filled.length === 0) return null;
    return {
      label: group.title,
      content: (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
          {filled.map((f) => (
            <div key={f}>
              <div style={{ fontSize: 11.5, color: "#6e8fd6" }}>{FIELD_LABELS[f] || f}</div>
              <div style={{ fontSize: 14.5, color: "#15398f" }}>{submission[f]}</div>
            </div>
          ))}
        </div>
      ),
    };
  }).filter(Boolean) as { label: string; content: React.ReactNode }[];

  const tabs = [
    ...groupTabs,
    {
      label: "מלגות ודוח",
      content: (
        <SubmissionReportBuilder
          scholarships={JSON.parse(JSON.stringify(scholarships))}
          defaultName={submission.full_name || ""}
          defaultEmail={submission.email || ""}
          defaultPhone={submission.phone || ""}
          submissionRef={String(submission._row)}
        />
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 900 }}>
      <h1 style={{ fontFamily: "Rubik, sans-serif", color: "#0f2e73" }}>
        {submission.full_name || "ללא שם"}
      </h1>
      <p style={{ color: "#6e8fd6", fontSize: 14, marginBottom: 24 }}>
        {submission.email} {submission.phone ? "· " + submission.phone : ""}
      </p>
      <SubmissionTabs tabs={tabs} />
    </div>
  );
}
