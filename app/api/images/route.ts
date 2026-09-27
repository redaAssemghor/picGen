import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
export async function GET(request: Request) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Sign in to view your library." }, { status: 401 });
  try {
    const url = new URL(request.url);
    const cursor = url.searchParams.get("cursor");
    const images = await prisma.generation.findMany({
      where: { userId, status: "completed", ...(url.searchParams.get("favorites") === "true" ? { favorite: true } : {}),  },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }], ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}), take: 25,
      select: { id: true, prompt: true, model: true, ratio: true, style: true, seed: true, favorite: true, createdAt: true },
    });
    return NextResponse.json({ images: images.slice(0, 24), nextCursor: images.length > 24 ? images[23].id : null }, { headers: { "Cache-Control": "no-store" } });
  } catch { return NextResponse.json({ error: "Unable to load your library." }, { status: 503 }); }
}
