import { MessageSquareText, SlidersHorizontal, Download } from "lucide-react";
const steps = [
  { icon: MessageSquareText, title: "Start with a spark", text: "Describe a scene, a mood, or a wild idea. Add details to make it your own." },
  { icon: SlidersHorizontal, title: "Find your direction", text: "Choose a model and refine your prompt. Explore different takes on the same idea." },
  { icon: Download, title: "Make it yours", text: "Preview your images, choose your favorites, and download what you love." },
];
export default function Info() {
  return <section className="shell section-space">
    <div className="section-heading"><span className="eyebrow">FROM THOUGHT TO IMAGE</span><h2>A small prompt.<br />A world of possibilities.</h2><p>Your creative process, with room to play.</p></div>
    <div className="feature-grid">{steps.map(({icon: Icon, title, text}, index) =>
      <article className="feature-card" key={title}><div className="feature-top"><Icon size={22} /><span>0{index + 1}</span></div><h3>{title}</h3><p>{text}</p></article>
    )}</div>
  </section>;
}
