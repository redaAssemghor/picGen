import { getAuth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { userId } = getAuth(req);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId, // Use the user ID from Clerk to query the database
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch points" });
  }
}
