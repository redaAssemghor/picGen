import { headers } from "next/headers";
import { Webhook } from "svix";
import prisma from "@/prisma"; // Adjust the import according to your project structure

interface ClerkEvent {
  data: {
    id: string;
    [key: string]: any; // Add other fields as necessary
  };
  object: string;
  type: string;
}

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("Missing svix headers");
    return new Response("Error occurred -- no svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: ClerkEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as ClerkEvent;
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response("Webhook verification failed", { status: 400 });
  }

  console.log("Webhook event received:", evt);

  const eventType = evt.type;
  if (eventType === "user.created") {
    console.log("User created event received");

    try {
      const { id } = evt.data;
      if (id) {
        const user = await prisma.user.findUnique({
          where: {
            clerkId: id,
          },
        });

        if (!user) {
          try {
            const dbUser = await prisma.user.create({
              data: {
                clerkId: id,
                points: 60,
              },
            });
            console.log("User created in database:", dbUser);
          } catch (error) {
            console.error("Error creating user in database:", error);
            return new Response("Internal Server Error", { status: 500 });
          }
        } else {
          console.log("User already exists in the database");
        }
      } else {
        console.error("User ID is missing in the event data");
      }
    } catch (error) {
      console.error("Error processing user.created event:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  }

  return new Response("Webhook processed successfully", { status: 200 });
}
