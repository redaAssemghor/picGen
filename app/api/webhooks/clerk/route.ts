import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { STARTER_CREDITS } from "@/lib/generation";
export async function POST(request: Request) {
  if (!process.env.WEBHOOK_SECRET) return NextResponse.json({ error: "Webhook is not configured." }, { status: 503 });
  let event: WebhookEvent;
  try {
    event = new Webhook(process.env.WEBHOOK_SECRET).verify(await request.text(), {
      "svix-id": request.headers.get("svix-id") || "",
      "svix-timestamp": request.headers.get("svix-timestamp") || "",
      "svix-signature": request.headers.get("svix-signature") || "",
    }) as WebhookEvent;
  } catch { return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 }); }
  if (event.type !== "user.created") return NextResponse.json({ received: true });
  const email = event.data.email_addresses.find(address => address.id === event.data.primary_email_address_id)?.email_address;
  if (!email) return NextResponse.json({ error: "Primary email is required." }, { status: 400 });
  try {
    await prisma.user.upsert({ where: { id: event.data.id }, create: { id: event.data.id, email, points: STARTER_CREDITS }, update: {} });
    return NextResponse.json({ received: true });
  } catch { return NextResponse.json({ error: "Account creation is pending. Retry this event." }, { status: 503 }); }
}
