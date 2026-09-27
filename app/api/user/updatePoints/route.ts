import { NextResponse } from "next/server";
export async function POST() {
  return NextResponse.json({ error: "Credits are managed automatically during generation." }, { status: 410 });
}
