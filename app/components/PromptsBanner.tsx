import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
export default function PromptsBanner() {
  return <section className="shell"><div className="prompt-banner"><div><span className="eyebrow"><Sparkles size={14} /> SKIP THE BLANK PAGE</span><h2>A little help finding<br />your next big idea.</h2><p>Try a curated prompt to discover a fresh starting point.</p></div><Link className="button button-primary" href="/generatepage">Find your inspiration <ArrowUpRight size={18} /></Link></div></section>;
}
