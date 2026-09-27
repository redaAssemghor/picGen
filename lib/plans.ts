export const CREDIT_PACKS = {
  basic: { name: "Starter", credits: 40, amount: 399 },
  plus: { name: "Creator", credits: 80, amount: 699 },
  premium: { name: "Studio", credits: 100, amount: 999 },
} as const;
export type PackId = keyof typeof CREDIT_PACKS;
export function getPack(id: unknown) {
  return typeof id === "string" && Object.hasOwn(CREDIT_PACKS, id) ? CREDIT_PACKS[id as PackId] : null;
}
