export const dynamic = "force-dynamic";
import { prisma } from "@/lib/db";
import ScholarshipManager from "./ScholarshipManager";

export default async function ScholarshipsPage() {
  const scholarships = await prisma.scholarship.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 style={{ fontFamily: "Rubik, sans-serif", color: "#0f2e73" }}>מאגר מלגות</h1>
      <ScholarshipManager initialScholarships={JSON.parse(JSON.stringify(scholarships))} />
    </div>
  );
}
