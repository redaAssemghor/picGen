import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const sig = req.headers.get("Stripe-Signature") as string;

  try {
    // Verify Stripe webhook signature
    const event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );

    // Handle the event based on its type
    switch (event.type) {
      case "checkout.session.completed": {
        const charge = stripe.checkout.sessions.retrieve(
          (event.data.object as Stripe.Checkout.Session).id,
          { expand: ["line_items"] }
        );

        const costumerId = (await charge).customer as string;
        const costumerDetails = (await charge).customer_details;

        // Fetch MongoDB user by clerkId from Prisma
        const user = await prisma.user.findUnique({
          where: { email: costumerDetails?.email as string },
        });

        if (!user) {
          throw new Error("User not found");
        }
        console.log("user from webhook", user);

        // Create a transaction and use MongoDB user.id (_id) as userId
        // await prisma.subscription.create({
        //   data: {
        //     amount: charge.amount,
        //     userId: user.id,
        //     paymentIntentId: charge.payment_intent as string, // Stripe Payment Intent ID
        //     status: charge.status, // Status of the charge (e.g., 'succeeded', 'pending')
        //   },
        // });
        return NextResponse.json({ status: "success", event: event.type });
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
        return NextResponse.json({
          status: "unhandled_event",
          event: event.type,
        });
    }
  } catch (error) {
    console.error("Error in Stripe webhook:", error);
    return new Response(JSON.stringify({ error: "Webhook handler failed" }), {
      status: 500,
    });
  }
}
