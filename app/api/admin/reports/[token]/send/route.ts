import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { renderReportPdf } from "@/lib/pdf";
import { sendReportEmail } from "@/lib/email";

export async function POST(req: NextRequest, { params }: { params: { token: string } }) {
  const report = await prisma.report.findUnique({
    where: { token: params.token },
    include: { items: { include: { scholarship: true } } },
  });

  if (!report) {
    return NextResponse.json({ ok: false, error: "דוח לא נמצא" }, { status: 404 });
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

  try {
    const pdfBuffer = await renderReportPdf(report.studentName, items);
    const origin = req.nextUrl.origin;
    const reportUrl = `${origin}/report/${report.token}`;

    await sendReportEmail({
      to: report.studentEmail,
      studentName: report.studentName,
      reportUrl,
      pdfBuffer,
    });

    await prisma.report.update({ where: { id: report.id }, data: { sentAt: new Date() } });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message || "שגיאה בשליחה" }, { status: 500 });
  }
}
