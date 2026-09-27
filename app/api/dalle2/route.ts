import { NextResponse } from "next/server";
export async function POST() {
  return NextResponse.json({ error: "DALL·E has been replaced by open image models. Use the studio." }, { status: 410 });
}
