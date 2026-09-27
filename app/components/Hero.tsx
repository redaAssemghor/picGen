"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Hero() {
  const [prompt, setPrompt] = useState("");
  const router = useRouter();
  return <section className="hero-v2 shell">
    <div className="hero-copy">
      <span className="eyebrow"><span className="status-dot" /> A STUDIO FOR YOUR IMAGINATION</span>
      <h1>You imagine.<br />We make it<br /><span>an image.</span></h1>
      <p>From the first spark to the final detail. Create original visuals with powerful open-source AI, in a space made for exploring.</p>
      <form className="hero-prompt" onSubmit={event => { event.preventDefault(); router.push("/generatepage" + (prompt.trim() ? "?prompt=" + encodeURIComponent(prompt.trim()) : "")); }}>
        <label htmlFor="hero-prompt" className="sr-only">Describe your first image</label>
        <Sparkles size={19} aria-hidden="true" />
        <input id="hero-prompt" value={prompt} onChange={event => setPrompt(event.target.value)} maxLength={1500} placeholder="A little idea goes a long way…" />
        <button type="submit" aria-label="Create this image"><ArrowRight size={20} /></button>
      </form>
      <div className="hero-under"><span>50 starter credits · 5 credits per image</span><Link href="#explore">Get inspired <ArrowUpRight size={14} /></Link></div>
    </div>
    <div className="hero-art" aria-label="Creative inspiration">
      <div className="hero-art-label"><Sparkles size={14} /> YOUR NEXT “WHAT IF” STARTS HERE</div>
      <div className="hero-main-image"><Image src="/hero-z-image.png" alt="Lavender glass vase generated with Z-Image Turbo" fill priority sizes="(max-width: 800px) 90vw, 45vw" /></div>
      <div className="hero-small-image"><Image src="/dalle-imgs/img01.webp" alt="Another creative direction to explore" fill sizes="(max-width: 800px) 35vw, 18vw" /></div>
      <div className="hero-art-note"><span className="status-dot" /><div><strong>Made with Z-Image Turbo.</strong><span>A real image from our studio.</span></div></div>
      <span className="hero-orbit" aria-hidden="true">✳</span>
    </div>
  </section>;
}
