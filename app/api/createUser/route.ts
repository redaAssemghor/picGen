import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/prisma";

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      console.log("Unauthorized access attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { points } = await req.json();
    console.log("Parsed points:", points);

    if (typeof points !== "number") {
      console.log("Invalid points value:", points);
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
      console.log("User created or updated successfully");
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
    console.error("Error in /api/createUser route:", error);
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }
}
