import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/prisma";

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const dbUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!dbUser) {
      const dbUser = await prisma.user.create({
        data: {
          id: userId,
          points: 60,
        },
      });
    }
    if (!dbUser) {
      return new NextResponse(null, {
        status: 302, // 302 Found - temporary redirect
        headers: {
          Location: "http://127.0.0.1:3000/api/auth/new-user",
        },
      });
    }

    return new NextResponse(null, {
      status: 302, // 302 Found - temporary redirect
      headers: {
        Location: "http://127.0.0.1:3000/",
      },
    });
  } catch (error) {
    console.error("Error in /api/createUser route:", error);
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }
}
