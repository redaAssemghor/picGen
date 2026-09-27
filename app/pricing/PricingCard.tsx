"use client";
import { useState } from "react";
import { SignInButton, useAuth } from "@clerk/nextjs";
import { ArrowUpRight, Check } from "lucide-react";
import { CREDIT_PACKS, PackId } from "@/lib/plans";
export default function PricingCard({ id }: { id: PackId }) {
  const { isLoaded, isSignedIn } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const pack = CREDIT_PACKS[id];
  const featured = id === "plus";
  async function checkout() {
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ plan: id }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      const url = new URL(data.url);
      if (url.protocol !== "https:" || url.hostname !== "checkout.stripe.com") throw new Error("Invalid checkout destination.");
      window.location.assign(url.toString());
    } catch (error) { setError((error as Error).message || "Unable to open checkout."); setBusy(false); }
  }
  return <article className={`pricing-card ${featured ? "featured" : ""}`}><div className="plan-heading"><h2>{pack.name}</h2>{featured && <span className="plan-badge">A little more room</span>}</div><p className="plan-description">{id === "basic" ? "For a new idea and a little exploration." : id === "plus" ? "For your next project and all its possibilities." : "For a creative streak you want to keep going."}</p><div className="plan-price">${(pack.amount / 100).toFixed(2)}<span>one time</span></div><ul><li><Check size={16} />{pack.credits} credits · {pack.credits / 5} images</li><li><Check size={16} />Both open-source image models</li><li><Check size={16} />Private library and downloads</li><li><Check size={16} />Styles, aspect ratios, and seeds</li></ul>{error && <p className="studio-error" role="alert">{error}</p>}{!isLoaded ? <button className="button button-secondary" disabled>Loading…</button> : isSignedIn ? <button disabled={busy} onClick={checkout} className={`button ${featured ? "button-primary" : "button-secondary"}`}>{busy ? "Opening checkout…" : "Get " + pack.credits + " credits"}<ArrowUpRight size={16} /></button> : <SignInButton mode="modal" forceRedirectUrl="/pricing"><button className={`button ${featured ? "button-primary" : "button-secondary"}`}>Sign in to add credits</button></SignInButton>}</article>;
}
