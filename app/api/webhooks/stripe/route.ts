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
        const session = stripe.checkout.sessions.retrieve(
          (event.data.object as Stripe.Checkout.Session).id,
          { expand: ["line_items"] }
        );

        const costumerId = (await session).customer as string;
        const costumerDetails = (await session).customer_details;

        if (costumerDetails?.email) {
          const user = await prisma.user.findFirst({
            where: { email: costumerDetails?.email as string },
          });
          if (!user) {
            throw new Error("User not found");
          }
          console.log("user from webhook", user);

          if (!user.customerId) {
            await prisma.user.update({
              where: { email: costumerDetails?.email as string },
              data: { customerId: costumerId },
            });
          }
        }

        const lineItems = (await session).line_items?.data;
        for (const item of lineItems as Stripe.LineItem[]) {
          const price = item.price;
          const itemId = item.id;

          await prisma.subscription.create({
            data: {
              amount: price?.unit_amount as number,
              userId: costumerId,
            },
          });
        }

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
