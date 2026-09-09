import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => ({}));
  const { name, details, link, deadline, moreInfo } = body;

  const scholarship = await prisma.scholarship.update({
    where: { id: params.id },
    data: {
      name,
      details,
      link: link || null,
      deadline: deadline ? new Date(deadline) : null,
      moreInfo: moreInfo || null,
    },
  });

  return NextResponse.json({ ok: true, scholarship });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.scholarship.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
