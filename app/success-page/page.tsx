"use client";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { CheckCircle2, Clock3 } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
export default function PaymentSuccess() {
  const { isLoaded, isSignedIn } = useAuth();
  const [credits, setCredits] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const check = useCallback(async () => {
    const session = new URLSearchParams(window.location.search).get("session_id");
    if (!session) { setError("No checkout session was provided."); return; }
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/checkout/status?session_id=" + encodeURIComponent(session));
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      if (data.status === "credited") setCredits(data.credits);
    } catch (error) { setError((error as Error).message); }
    finally { setBusy(false); }
  }, []);
  useEffect(() => {
    if (!isSignedIn) return;
    void check();
    let count = 0;
    const timer = window.setInterval(() => { if (++count >= 10) window.clearInterval(timer); void check(); }, 3000);
    return () => window.clearInterval(timer);
  }, [isSignedIn, check]);
  return <><Header /><main className="shell purchase-status">{credits !== null ? <CheckCircle2 size={40} /> : <Clock3 size={40} />}<h1>{credits !== null ? "You are ready to create." : "Confirming your credits."}</h1><p>{credits !== null ? credits + " credits have been added to your account." : isLoaded && !isSignedIn ? "Sign in to check your payment status." : "Your payment is being verified. Credits appear after confirmation."}</p>{error && <p role="alert" className="studio-error">{error}</p>}<div className="studio-tools">{credits === null && isSignedIn && <button className="button button-secondary" onClick={() => void check()} disabled={busy}>{busy ? "Checking…" : "Check again"}</button>}<Link className="button button-primary" href="/generatepage">Back to the studio</Link></div></main><Footer /></>;
}
