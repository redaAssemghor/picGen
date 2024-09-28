import { NextResponse } from "next/server";
import { getUser, updateUserPoints } from "@/app/lib/actions/action";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userId = body.userId;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is missing" },
        { status: 400 }
      );
    }

    const user = await getUser({ id: userId });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.points < 5) {
      return NextResponse.json(
        { error: "User does not have enough points" },
        { status: 400 }
      );
    }

    const updatedUser = await updateUserPoints({ id: userId });

    if (!updatedUser) {
      return NextResponse.json(
        { error: "Error updating user points" },
        { status: 500 }
      );
    }

    return NextResponse.json({ points: updatedUser.points });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching user points" },
      { status: 500 }
    );
  }
}
