import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma";

export async function POST(request: NextRequest) {
  const { userId } = getAuth(request);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { points } = await request.json();
    if (typeof points == "number" && points > 0) {
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          points: {
            decrement: points,
          },
        },
      });
      return NextResponse.json({ points: user.points }, { status: 200 });
    }

    return NextResponse.json(
      { error: "Invalid points value. Must be a positive number." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error decrementing points:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
