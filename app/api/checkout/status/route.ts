import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
export async function GET(request: Request) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Sign in to view this purchase." }, { status: 401 });
  const id = new URL(request.url).searchParams.get("session_id");
  if (!id || !/^cs_[a-zA-Z0-9_]{8,200}$/.test(id)) return NextResponse.json({ error: "Invalid checkout session." }, { status: 400 });
  try {
    const receipt = await prisma.creditPurchase.findFirst({ where: { id, userId }, select: { credits: true } });
    return NextResponse.json({ status: receipt ? "credited" : "pending", credits: receipt?.credits }, { headers: { "Cache-Control": "no-store" } });
  } catch { return NextResponse.json({ error: "Unable to verify this purchase yet." }, { status: 503 }); }
}
