import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { studentName, studentEmail, studentPhone, submissionRef, scholarshipIds } = body;

  if (!studentEmail || !Array.isArray(scholarshipIds) || scholarshipIds.length === 0) {
    return NextResponse.json(
      { ok: false, error: "חסרים פרטים: יש להזין אימייל ולבחור לפחות מלגה אחת" },
      { status: 400 }
    );
  }

  const report = await prisma.report.create({
    data: {
      studentName: studentName || "",
      studentEmail,
      studentPhone: studentPhone || null,
      submissionRef: submissionRef || null,
      items: {
        create: scholarshipIds.map((id: string) => ({ scholarshipId: id })),
      },
    },
  });

  return NextResponse.json({ ok: true, token: report.token });
}

export async function GET() {
  const reports = await prisma.report.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: { include: { scholarship: true } } },
  });
  return NextResponse.json({ ok: true, reports });
}
