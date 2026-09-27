import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { userId } = auth();
  if (!userId) return new Response(null, { status: 401 });
  try {
    const image = await prisma.generation.findFirst({ where: { id: params.id, userId, status: "completed" }, select: { image: true, mimeType: true } });
    if (!image?.image) return new Response(null, { status: 404 });
    const extension = image.mimeType === "image/jpeg" ? "jpg" : image.mimeType === "image/webp" ? "webp" : "png";
    const headers: Record<string, string> = { "Content-Type": image.mimeType!, "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" };
    if (new URL(request.url).searchParams.has("download")) headers["Content-Disposition"] = `attachment; filename="picgen-${params.id.replace(/[^a-z0-9-]/gi, "")}.${extension}"`;
    return new Response(Buffer.from(image.image, "base64"), { headers });
  } catch { return new Response(null, { status: 503 }); }
}
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Sign in to save favorites." }, { status: 401 });
  let favorite;
  try { favorite = (await request.json()).favorite; } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  if (typeof favorite !== "boolean") return NextResponse.json({ error: "Invalid favorite value." }, { status: 400 });
  try {
    const result = await prisma.generation.updateMany({ where: { id: params.id, userId, status: "completed" }, data: { favorite } });
    return NextResponse.json({ favorite }, { status: result.count ? 200 : 404 });
  } catch { return NextResponse.json({ error: "Unable to update favorite." }, { status: 503 }); }
}
