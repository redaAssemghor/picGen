import { validateJsonMutation } from "@/lib/request";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getPack } from "@/lib/plans";
import { ensureAccount } from "@/app/lib/account";
export async function POST(request: Request) {
  const invalid = validateJsonMutation(request); if (invalid) return invalid;
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Sign in to add credits." }, { status: 401 });
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET || !process.env.NEXT_PUBLIC_APP_URL) return NextResponse.json({ error: "Credit purchases are not available yet. Please try again later." }, { status: 503 });
  let plan;
  try { plan = (await request.json()).plan; } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const pack = getPack(plan);
  if (!pack) return NextResponse.json({ error: "Choose an available credit pack." }, { status: 400 });
  try {
    const account = await ensureAccount(userId);
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const origin = new URL(process.env.NEXT_PUBLIC_APP_URL).origin;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: account.email,
      client_reference_id: userId,
      metadata: { userId, plan },
      line_items: [{ price_data: { currency: "usd", unit_amount: pack.amount, product_data: { name: `Picgen ${pack.name} — ${pack.credits} credits` } }, quantity: 1 }],
      success_url: origin + "/success-page?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: origin + "/pricing?checkout=cancelled",
    });
    return NextResponse.json({ url: session.url });
  } catch { return NextResponse.json({ error: "Checkout could not start. Please try again." }, { status: 503 }); }
}
