import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function ReportPage({ params }: { params: { token: string } }) {
  const report = await prisma.report.findUnique({
    where: { token: params.token },
    include: { items: { include: { scholarship: true } } },
  });

  if (!report) return notFound();

  return (
    <main
      dir="rtl"
      style={{
        maxWidth: 760,
        margin: "0 auto",
        padding: "48px 20px 80px",
        fontFamily: "Heebo, sans-serif",
        color: "#15398f",
      }}
    >
      <h1 style={{ fontFamily: "Rubik, sans-serif", color: "#0f2e73", fontSize: 28 }}>
        AcadeMe.Fund — התאמות המלגות שלך
      </h1>
      {report.studentName && (
        <p style={{ color: "#1c4fbf", fontSize: 16 }}>הוכן עבור: {report.studentName}</p>
      )}

      <a
        href={`/api/reports/${report.token}/pdf`}
        style={{
          display: "inline-block",
          background: "linear-gradient(180deg, #f5821f, #e8690f)",
          color: "#fff",
          padding: "12px 26px",
          borderRadius: 999,
          textDecoration: "none",
          fontWeight: 700,
          margin: "16px 0 32px",
        }}
      >
        הורדת PDF
      </a>

      {report.items.map((it) => (
        <div
          key={it.id}
          style={{
            border: "1.5px solid #f7a75c",
            borderRadius: 14,
            padding: 20,
            marginBottom: 16,
            background: "#fff",
          }}
        >
          <h2 style={{ color: "#e8690f", fontSize: 18, margin: "0 0 8px" }}>
            {it.scholarship.name}
          </h2>
          {it.scholarship.details && (
            <p style={{ margin: "0 0 8px", lineHeight: 1.7 }}>{it.scholarship.details}</p>
          )}
          {it.scholarship.deadline && (
            <p style={{ color: "#6e8fd6", fontSize: 13, margin: "0 0 4px" }}>
              מועד הגשה אחרון: {it.scholarship.deadline.toLocaleDateString("he-IL")}
            </p>
          )}
          {it.scholarship.link && (
            <p style={{ fontSize: 13, margin: "0 0 4px" }}>
              <a href={it.scholarship.link} target="_blank" rel="noopener" style={{ color: "#e8690f" }}>
                לפרטים והגשה ›
              </a>
            </p>
          )}
          {it.scholarship.moreInfo && (
            <p style={{ color: "#6e8fd6", fontSize: 13, margin: 0 }}>{it.scholarship.moreInfo}</p>
          )}
        </div>
      ))}
    </main>
  );
}
