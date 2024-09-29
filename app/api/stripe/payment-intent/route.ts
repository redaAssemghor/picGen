import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
export async function POST(request: NextRequest) {
  try {
    const { amount, clerkId } = await request.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      metadata: { clerkId },
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.log(error);
    return new NextResponse(JSON.stringify({ error }), { status: 500 });
  }
}
