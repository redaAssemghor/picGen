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
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        // Fetch MongoDB user by clerkId from Prisma
        const user = await prisma.user.findUnique({
          where: { clerkId: paymentIntent.metadata.clerkId },
        });

        if (!user) {
          throw new Error(
            `User not found for clerkId: ${paymentIntent.metadata.clerkId}`
          );
        }

        // Create a transaction and use MongoDB user.id (_id) as userId
        await prisma.transaction.create({
          data: {
            paymentIntentId: paymentIntent.id,
            amount: paymentIntent.amount,
            status: paymentIntent.status,
            userId: user.id, // MongoDB user.id, which is an ObjectId
          },
        });

        // Optionally update user points
        await prisma.user.update({
          where: { id: user.id },
          data: {
            points: { increment: 100 },
          },
        });

        console.log("userid from webhook", user);

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
