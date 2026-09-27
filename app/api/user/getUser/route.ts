import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ensureAccount } from "@/app/lib/account";
import { recoverExpired } from "@/app/lib/credits";
import prisma from "@/app/lib/prisma";
export async function GET() {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Sign in to view your balance." }, { status: 401 });
  try {
    await ensureAccount(userId);
    await recoverExpired(userId);
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { points: true } });
    return NextResponse.json(user, { headers: { "Cache-Control": "no-store" } });
  } catch { return NextResponse.json({ error: "Unable to load your account. Please retry." }, { status: 503 }); }
}
export const POST = GET;
