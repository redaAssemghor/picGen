import { currentUser } from "@clerk/nextjs/server";
import prisma from "./prisma";
import { STARTER_CREDITS } from "@/lib/generation";

export async function ensureAccount(userId: string) {
  const existing = await prisma.user.findUnique({ where: { id: userId } });
  if (existing) return existing;
  const profile = await currentUser();
  const email = profile?.emailAddresses.find(address => address.id === profile.primaryEmailAddressId)?.emailAddress;
  if (!profile || profile.id !== userId || !email) throw new Error("Account setup is incomplete.");
  return prisma.user.upsert({
    where: { id: userId },
    create: { id: userId, email, points: STARTER_CREDITS },
    update: {},
  });
}
