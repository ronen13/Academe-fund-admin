import { NextResponse } from "next/server";
import { fetchSubmissions } from "@/lib/sheets";

export async function GET() {
  try {
    const submissions = await fetchSubmissions();
    return NextResponse.json({ ok: true, submissions });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message || "שגיאה" }, { status: 500 });
  }
}
