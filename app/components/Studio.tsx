"use client";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { SignInButton, useAuth } from "@clerk/nextjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Download, ImagePlus, Loader2, Shuffle, Sparkles } from "lucide-react";
import { CREDIT_COST, INSPIRATION, MODELS, RATIOS, STYLES, GenerationInput } from "@/lib/generation";
import Gallery from "./Gallery";

export default function Studio() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState<keyof typeof MODELS>("z-image");
  const [ratio, setRatio] = useState<keyof typeof RATIOS>("1:1");
  const [style, setStyle] = useState<keyof typeof STYLES>("none");
  const [seed, setSeed] = useState("");
  const [points, setPoints] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [accountError, setAccountError] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [resultPrompt, setResultPrompt] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [draftKey, setDraftKey] = useState<string | null>(null);
  const query = useSearchParams().toString();
  const storageKey = "picgen-draft-" + (userId || "guest");
  const [notice, setNotice] = useState("");
  const pending = useRef<GenerationInput | null>(null);
  const inFlight = useRef(false);
  const owner = useRef(userId);
  owner.current = userId;
  const balance = useCallback(async () => {
    if (!userId) { setPoints(null); return; }
    const requestedOwner = userId;
    try {
      const response = await fetch("/api/user/getUser");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      if (owner.current === requestedOwner) { setPoints(data.points); setAccountError(""); }
    } catch { if (owner.current === requestedOwner) setAccountError("Your balance could not load. Retry to continue."); }
  }, [userId]);
  useEffect(() => { setPoints(null); setResult(null); setError(""); pending.current = null; void balance(); }, [balance]);
  useEffect(() => {
    if (!isLoaded) return;
    const params = new URLSearchParams(query);
    try { setPrompt(params.get("prompt")?.slice(0, 1500) || localStorage.getItem(storageKey) || ""); } catch { setPrompt(params.get("prompt")?.slice(0, 1500) || ""); }
    const modelParam = params.get("model"); if (modelParam && Object.hasOwn(MODELS, modelParam)) setModel(modelParam as keyof typeof MODELS);
    const ratioParam = params.get("ratio"); if (ratioParam && Object.hasOwn(RATIOS, ratioParam)) setRatio(ratioParam as keyof typeof RATIOS);
    const styleParam = params.get("style"); if (styleParam && Object.hasOwn(STYLES, styleParam)) setStyle(styleParam as keyof typeof STYLES);
    const seedParam = params.get("seed"); if (seedParam && /^\d+$/.test(seedParam) && Number(seedParam) <= 2147483647) setSeed(seedParam);
    setDraftKey(storageKey);
  }, [isLoaded, userId, query, storageKey]);
  useEffect(() => {
    if (draftKey !== storageKey) return;
    try { localStorage.setItem(storageKey, prompt); } catch { /* Draft storage is optional. */ }
  }, [prompt, storageKey, draftKey]);
  async function generate(event: React.FormEvent) {
    event.preventDefault();
    if (inFlight.current || !isSignedIn) return;
    inFlight.current = true; setBusy(true); setError(""); setNotice("");
    const requestedOwner = userId;
    const previous = pending.current;
    const same = previous && previous.prompt === prompt.trim() && previous.model === model && previous.ratio === ratio && previous.style === style && (!seed || previous.seed === Number(seed));
    const body: GenerationInput = same ? previous : { requestId: crypto.randomUUID(), prompt: prompt.trim(), model, ratio, style, seed: seed ? Number(seed) : crypto.getRandomValues(new Uint32Array(1))[0] % 2147483648 };
    pending.current = body;
    try {
      const response = await fetch("/api/fetchImg", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await response.json();
      if (requestedOwner !== owner.current) return;
      if (!response.ok) {
        if (response.status !== 409) pending.current = null;
        if (response.status === 409 && !data.error?.includes("still generating")) pending.current = null;
        throw new Error(data.error || "Unable to create this image.");
      }
      pending.current = null;
      setResult(data.id); setResultPrompt(body.prompt); setPoints(data.points);
      setRefresh(value => value + 1);
      setNotice("Your image is ready and saved to your library.");
    } catch (error) {
      if (requestedOwner === owner.current) setError(error instanceof TypeError ? "Connection interrupted. Retry with the same settings to safely recover your image, or check your library." : (error as Error).message);
    } finally { inFlight.current = false; setBusy(false); if (requestedOwner === owner.current) void balance(); }
  }
  return <main className="shell studio-page">
    <div className="studio-title"><div><span className="eyebrow">THE CREATIVE STUDIO</span><h1>A new idea starts here.</h1><p>Describe it. Shape it. Make it yours.</p></div>{isSignedIn && <Link className="credit-balance" href="/pricing"><Sparkles size={16} />{points === null ? "Loading credits…" : points + " credits"}<ArrowUpRight size={14} /></Link>}</div>
    <div className="studio-workspace">
      <form className="studio-editor" onSubmit={generate}>
        <fieldset disabled={busy}><div className="prompt-label-row"><label htmlFor="studio-prompt">Your prompt</label><button type="button" onClick={() => setPrompt(INSPIRATION[Math.floor(Math.random() * INSPIRATION.length)])}><Shuffle size={14} />Inspire me</button></div>
        <textarea id="studio-prompt" required minLength={3} maxLength={1500} value={prompt} onChange={event => setPrompt(event.target.value)} placeholder="A sunlit room filled with wildflowers, soft film grain, warm peach tones…" className="prompt-input" />
        <div className="prompt-meta"><span>Be specific about subject, light, and mood.</span><span>{prompt.length}/1500</span></div>
        <label className="field-label" htmlFor="model">Image model</label><select id="model" className="studio-select" value={model} onChange={event => setModel(event.target.value as keyof typeof MODELS)}>{Object.entries(MODELS).map(([key, value]) => <option key={key} value={key}>{value.name}</option>)}</select><p className="field-hint">{MODELS[model].description} · Open-source, Apache 2.0</p>
        <span className="field-label" id="ratio-label">Aspect ratio</span><div className="ratio-options" role="group" aria-labelledby="ratio-label">{Object.entries(RATIOS).map(([key, value]) => <button key={key} type="button" aria-pressed={ratio === key} onClick={() => setRatio(key as keyof typeof RATIOS)}><span className={"ratio-icon ratio-" + value.label.toLowerCase()} /><span>{value.label}<small>{key}</small></span></button>)}</div>
        <label className="field-label" htmlFor="style">Visual style</label><select id="style" className="studio-select" value={style} onChange={event => setStyle(event.target.value as keyof typeof STYLES)}>{Object.entries(STYLES).map(([key, value]) => <option key={key} value={key}>{value.name}</option>)}</select>
        <details className="advanced-settings"><summary>Advanced settings</summary><label className="field-label" htmlFor="seed">Seed <span className="field-hint">(optional)</span></label><input id="seed" type="number" min={0} max={2147483647} step={1} className="studio-select" value={seed} onChange={event => setSeed(event.target.value)} placeholder="Random each time" /><p className="field-hint">Reuse a seed and settings for similar results. Exact results can vary by provider.</p></details>
        </fieldset>
        {accountError && <div className="studio-error" role="alert">{accountError}<button type="button" onClick={() => void balance()}>Retry balance</button></div>}
        {error && <p className="studio-error" role="alert">{error}</p>}
        {!isLoaded ? <button disabled className="button button-primary generate-button">Loading account…</button> : !isSignedIn ? <SignInButton mode="modal"><button type="button" className="button button-primary generate-button">Sign in to create <ArrowUpRight size={17} /></button></SignInButton> : <button type="submit" className="button button-primary generate-button" disabled={busy || prompt.trim().length < 3 || points === null || points < CREDIT_COST}>{busy ? <><Loader2 size={17} className="spin" />Creating your image…</> : <><Sparkles size={17} />Generate image<span>{CREDIT_COST} credits</span></>}</button>}
        {points !== null && points < CREDIT_COST && <Link href="/pricing" className="low-credits">Add credits to keep creating <ArrowUpRight size={14} /></Link>}
        <p className="generation-note">One image per generation. Failed attempts are refunded.</p>
      </form>
      <section className={"studio-canvas " + (busy ? "canvas-busy" : "")} aria-busy={busy} aria-label="Generated image">
        {busy ? <div className="canvas-placeholder"><div className="canvas-symbol"><Loader2 className="spin" size={30} /></div><h2>Making room for your idea.</h2><p>This can take a minute. Your image will be saved automatically.</p></div> : result ? <div className="canvas-result"><Image src={"/api/images/" + result} alt={resultPrompt} width={1024} height={1024} unoptimized /><div className="canvas-result-bar"><span>Saved to your library</span><a href={"/api/images/" + result + "?download=1"} className="button button-secondary"><Download size={15} />Download</a></div></div> : <div className="canvas-placeholder"><div className="canvas-symbol"><ImagePlus size={32} /></div><span className="eyebrow">AN OPEN CANVAS</span><h2>Anything starts<br />with an idea.</h2><p>Your creation will appear here.<br />Give your imagination somewhere to go.</p><div className="canvas-tags"><span>Imagine</span><span>Create</span><span>Explore</span></div></div>}
      </section>
    </div><p className="sr-only" role="status">{notice || (busy ? "Generating image. Please wait." : "")}</p>
    <Gallery refresh={refresh} compact />
  </main>;
}
