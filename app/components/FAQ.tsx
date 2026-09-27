const faqs = [
  { question: "How do I create my first image?", answer: "Sign in to get 50 starter credits. Open Create, describe your idea, choose a model and style, then generate. Each image uses 5 credits." },
  { question: "Which models can I use?", answer: "Z-Image Turbo is our default for detailed images. FLUX.1 Schnell is another option for creative exploration. Both use the Apache 2.0 license." },
  { question: "Where are my images saved?", answer: "Your creations are saved to your private account library. Download an image, mark it as a favorite, or reuse its prompt and settings whenever you want." },
  { question: "What happens if generation fails?", answer: "Failed attempts are refunded. If a connection is interrupted, check your library or retry with the same settings. Interrupted server jobs are recovered when you revisit the studio after five minutes." },
  { question: "Is this a subscription?", answer: "No. You start with welcome credits and can purchase one-time credit packs. There are no recurring charges. Hosted AI inference uses compute, so an open-source model does not mean unlimited free generation." },
];
export default function FAQ() {
  return <section className="shell section-space faq-layout"><div className="section-heading"><span className="eyebrow">GOOD TO KNOW</span><h2>A few answers<br />before you create.</h2></div><div className="faq-list">{faqs.map(faq =>
    <details key={faq.question}><summary>{faq.question}<span aria-hidden="true">+</span></summary><p>{faq.answer}</p></details>
  )}</div></section>;
}
