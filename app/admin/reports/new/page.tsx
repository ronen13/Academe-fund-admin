import { prisma } from "@/lib/db";
import ReportBuilder from "./ReportBuilder";

export default async function NewReportPage({
  searchParams,
}: {
  searchParams: { name?: string; email?: string; phone?: string; ref?: string };
}) {
  const scholarships = await prisma.scholarship.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 style={{ fontFamily: "Rubik, sans-serif", color: "#0f2e73" }}>הכנת דוח מלגות</h1>
      <ReportBuilder
        scholarships={JSON.parse(JSON.stringify(scholarships))}
        defaultName={searchParams.name || ""}
        defaultEmail={searchParams.email || ""}
        defaultPhone={searchParams.phone || ""}
        submissionRef={searchParams.ref || ""}
      />
    </div>
  );
}
