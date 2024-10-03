import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createUser } from "@/app/lib/actions/action";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("Missing WEBHOOK_SECRET environment variable");
    return new Response("Webhook secret is missing", { status: 500 });
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("Missing Svix headers");
    return new Response("Missing required Svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Webhook verification failed", { status: 400 });
  }

  if (evt.type === "user.created") {
    console.log("User created event received");

    const { id, email_addresses } = evt.data;
    console.log("web hook", id);

    if (id) {
      try {
        await createUser({ id, email: email_addresses[0].email_address });

        console.log("User created successfully in the database");
        return new Response("User created", { status: 201 });
      } catch (error) {
        console.error("Error creating user in database:", error);
        return new Response("Failed to create user in the database", {
          status: 500,
        });
      }
    } else {
      console.error("No user ID in the webhook event data");
      return new Response("No user ID provided in the event", { status: 400 });
    }
  }

  return new Response("Event not handled", { status: 200 });
}
