import { NextResponse } from "next/server";
export async function POST() {
  return NextResponse.json({ error: "Use the credit pack checkout." }, { status: 410 });
}
