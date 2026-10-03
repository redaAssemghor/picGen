"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

const ideas = [
  { label: "Dreamy landscapes", prompt: "A peaceful mountain lake at sunrise, wildflowers along the shore, soft golden light, cinematic landscape" },
  { label: "Tiny worlds", prompt: "A tiny rabbit peeking out of a snowy burrow, golden winter sunrise, soft detailed wildlife photography" },
  { label: "Something surreal", prompt: "A cathedral made of glowing glass, sunlight falling through impossibly tall windows, ethereal architectural photography" },
];

export default function Hero() {
  const [prompt, setPrompt] = useState("");
  const router = useRouter();
  const input = useRef<HTMLTextAreaElement>(null);
  return (
    <section className="hero-v3 shell">
      <div className="hero-copy">
        <span className="eyebrow"><span className="status-dot" /> YOUR NEXT IDEA STARTS HERE</span>
        <h1>Imagination,<br /><span>made visible.</span></h1>
        <p>Dream up a world, capture a mood, or try something unexpected. Turn your words into images worth keeping.</p>
        <form className="hero-composer" onSubmit={(event) => {
          event.preventDefault();
          router.push("/generatepage" + (prompt.trim() ? "?prompt=" + encodeURIComponent(prompt.trim()) : ""));
        }}>
          <label htmlFor="hero-prompt"><Sparkles size={16} />What would you love to see?</label>
          <textarea ref={input} id="hero-prompt" value={prompt} onChange={(event) => setPrompt(event.target.value)} minLength={3} maxLength={1500} rows={3} placeholder="A tiny world tucked inside a wildflower…" aria-describedby="hero-hint" />
          <div className="hero-composer-footer">
            <span id="hero-hint">Your idea. Your style.</span>
            <button type="submit" className="button button-primary" aria-label="Create this image">Open studio <ArrowRight size={17} /></button>
          </div>
        </form>
        <div className="hero-ideas" aria-label="Prompt starting points">
          <span>Try an idea</span>
          {ideas.map((idea) => <button type="button" key={idea.label} onClick={() => { setPrompt(idea.prompt); input.current?.focus(); }}>{idea.label}</button>)}
        </div>
        <div className="hero-under"><span>50 welcome credits · No subscription</span><Link href="#explore">Explore inspiration <ArrowUpRight size={14} /></Link></div>
      </div>
      <div className="hero-preview">
        <div className="hero-preview-top"><span className="status-dot" /> A LITTLE OF WHAT IS POSSIBLE</div>
        <Link className="hero-preview-main" href="/generatepage?prompt=A%20tiny%20rabbit%20in%20a%20snowy%20burrow%20at%20golden%20sunrise" aria-label="Try the snowy rabbit prompt">
          <Image src="/new/hero-main.webp" alt="A rabbit sheltering in a snowy burrow at golden sunrise" fill priority sizes="(max-width: 800px) 70vw, 32vw" />
          <span className="hero-image-caption">Small wonders.<span>Try this idea <ArrowUpRight size={15} /></span></span>
        </Link>
        <Link className="hero-preview-detail" href="/generatepage?prompt=A%20grand%20cathedral%20filled%20with%20golden%20sunlight%20and%20intricate%20architecture" aria-label="Try the sunlit cathedral prompt">
          <Image src="/new/hero-detail.webp" alt="Golden sunlight filling an ornate cathedral" fill sizes="(max-width: 800px) 36vw, 18vw" />
          <span>Or dream a little bigger <ArrowUpRight size={15} /></span>
        </Link>
        <div className="hero-preview-note"><Sparkles size={16} /><span>From a few words<br /><strong>to a whole new perspective.</strong></span></div>
      </div>
    </section>
  );
}
