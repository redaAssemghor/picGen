import { NextResponse } from "next/server";
import { getUser } from "@/app/lib/actions/action";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const id = body.id;

    if (!id) {
      return NextResponse.json(
        { error: "User ID is missing" },
        { status: 400 }
      );
    }

    const user = await getUser({ id });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user points:", error);
    return NextResponse.json(
      { error: "Error fetching user points" },
      { status: 500 }
    );
  }
}
