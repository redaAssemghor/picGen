import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getPack } from "@/lib/plans";
import { transaction } from "@/app/lib/credits";

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) return NextResponse.json({ error: "Billing is not configured." }, { status: 503 });
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(await request.text(), request.headers.get("stripe-signature") || "", process.env.STRIPE_WEBHOOK_SECRET);
  } catch { return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 }); }
  if (!["checkout.session.completed", "checkout.session.async_payment_succeeded"].includes(event.type)) return NextResponse.json({ received: true });
  const session = event.data.object as Stripe.Checkout.Session;
  if (session.payment_status !== "paid") return NextResponse.json({ received: true });
  const pack = getPack(session.metadata?.plan);
  const userId = session.metadata?.userId;
  if (!pack || !userId || session.client_reference_id !== userId || session.mode !== "payment" || session.currency !== "usd" || session.amount_total !== pack.amount) return NextResponse.json({ error: "Checkout details do not match a credit pack." }, { status: 400 });
  try {
    await transaction(async tx => {
      if (await tx.creditPurchase.findUnique({ where: { id: session.id } })) return;
      await tx.user.update({ where: { id: userId }, data: { points: { increment: pack.credits } } });
      await tx.creditPurchase.create({ data: { id: session.id, userId, credits: pack.credits } });
    });
    return NextResponse.json({ received: true });
  } catch {
    // Returning an error lets Stripe retry; the receipt prevents duplicate credits.
    return NextResponse.json({ error: "Credit delivery is pending. Retry this event." }, { status: 503 });
  }
}
