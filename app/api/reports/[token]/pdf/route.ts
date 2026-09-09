import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { renderReportPdf } from "@/lib/pdf";

export async function GET(req: NextRequest, { params }: { params: { token: string } }) {
  const report = await prisma.report.findUnique({
    where: { token: params.token },
    include: { items: { include: { scholarship: true } } },
  });

  if (!report) {
    return new NextResponse("Not found", { status: 404 });
  }

  const items = report.items.map((it) => ({
    name: it.scholarship.name,
    details: it.scholarship.details,
    link: it.scholarship.link,
    deadline: it.scholarship.deadline
      ? it.scholarship.deadline.toLocaleDateString("he-IL")
      : null,
    moreInfo: it.scholarship.moreInfo,
  }));

  const pdfBuffer = await renderReportPdf(report.studentName, items);

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="AcadeMe-Fund-${report.token}.pdf"`,
    },
  });
}
