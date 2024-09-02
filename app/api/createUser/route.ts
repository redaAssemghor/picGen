import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { userId } = getAuth(req);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { points } = await req.json();

    if (typeof points !== "number") {
      return NextResponse.json(
        { error: "Invalid points value" },
        { status: 400 }
      );
    }

    try {
      await prisma.user.upsert({
        where: { id: userId },
        update: { points },
        create: {
          id: userId,
          points,
        },
      });

      return NextResponse.json(
        { message: "User created or updated successfully" },
        { status: 201 }
      );
    } catch (error) {
      console.error("Error upserting user:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error parsing request body:", error);
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }
}
