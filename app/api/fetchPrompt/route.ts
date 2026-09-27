import { NextResponse } from "next/server";
import { INSPIRATION } from "@/lib/generation";
export async function POST() {
  return NextResponse.json({ response: INSPIRATION[Math.floor(Math.random() * INSPIRATION.length)] });
}
