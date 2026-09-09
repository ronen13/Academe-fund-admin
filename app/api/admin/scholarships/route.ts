import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const scholarships = await prisma.scholarship.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ ok: true, scholarships });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { name, details, link, deadline, moreInfo } = body;

  if (!name) {
    return NextResponse.json({ ok: false, error: "שם המלגה הוא שדה חובה" }, { status: 400 });
  }

  const scholarship = await prisma.scholarship.create({
    data: {
      name,
      details: details || "",
      link: link || null,
      deadline: deadline ? new Date(deadline) : null,
      moreInfo: moreInfo || null,
    },
  });

  return NextResponse.json({ ok: true, scholarship });
}
