import { Prisma } from "@prisma/client";
import prisma from "./prisma";
import { CREDIT_COST, GenerationInput } from "@/lib/generation";

export class CreditError extends Error {
  constructor(message: string, public status: number) { super(message); }
}
// MongoDB transaction conflicts must be retried as a whole, never as individual writes.
export async function transaction<T>(work: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try { return await prisma.$transaction(work); }
    catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034" && attempt < 3) continue;
      throw error;
    }
  }
}
export async function recoverExpired(userId: string) {
  await transaction(async tx => {
    const expired = await tx.generation.updateMany({
      where: { userId, status: "pending", createdAt: { lt: new Date(Date.now() - 5 * 60_000) } },
      data: { status: "failed" },
    });
    if (expired.count) await tx.user.update({ where: { id: userId }, data: { points: { increment: expired.count * CREDIT_COST } } });
  });
}
export async function reserve(userId: string, input: GenerationInput) {
  return transaction(async tx => {
    const existing = await tx.generation.findUnique({ where: { id: input.requestId } });
    if (existing) {
      if (existing.userId !== userId) throw new CreditError("Invalid request ID.", 409);
      if (existing.prompt !== input.prompt || existing.model !== input.model || existing.ratio !== input.ratio || existing.style !== input.style || existing.seed !== input.seed) throw new CreditError("Request ID already used with different settings.", 409);
      if (existing.status === "completed") return existing;
      throw new CreditError(existing.status === "pending" ? "This image is still generating. Check your library shortly." : "This attempt failed and was refunded. Try a new generation.", 409);
    }
    if (await tx.generation.count({ where: { userId, status: "pending" } })) throw new CreditError("An image is already generating. Please wait.", 429);
    if (await tx.generation.count({ where: { userId, createdAt: { gt: new Date(Date.now() - 60_000) } } }) >= 6) throw new CreditError("Please wait a minute before creating more images.", 429);
    const debit = await tx.user.updateMany({ where: { id: userId, points: { gte: CREDIT_COST } }, data: { points: { decrement: CREDIT_COST } } });
    if (!debit.count) throw new CreditError("You need 5 credits to create an image.", 402);
    return tx.generation.create({ data: { id: input.requestId, userId, prompt: input.prompt, model: input.model, ratio: input.ratio, style: input.style, seed: input.seed, status: "pending" } });
  });
}
export async function refund(id: string, userId: string) {
  await transaction(async tx => {
    const changed = await tx.generation.updateMany({ where: { id, userId, status: "pending" }, data: { status: "failed" } });
    if (changed.count) await tx.user.update({ where: { id: userId }, data: { points: { increment: CREDIT_COST } } });
  });
}
