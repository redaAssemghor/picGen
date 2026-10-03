import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { inspiration, inspirationHref } from "@/lib/inspiration";

export default function InspirationGallery() {
  return (
    <section className="gallery-section inspiration-section" aria-labelledby="inspiration-title">
      <div className="gallery-heading">
        <div>
          <span className="eyebrow">KEEP EXPLORING</span>
          <h2 id="inspiration-title">A little spark for your next idea.</h2>
          <p className="inspiration-description">Sample images to get you started. Pick a prompt and make it your own.</p>
        </div>
        <span className="sample-collection-label">Inspiration collection</span>
      </div>
      <div className="inspiration-masonry">
        {inspiration.map((item) => (
          <Link href={inspirationHref(item.prompt)} className="inspiration-card" key={item.file} aria-label={"Try this prompt: " + item.title}>
            <div className="inspiration-image" style={{ aspectRatio: item.ratio }}>
              <Image src={"/new/" + item.file + ".webp"} alt={item.title} fill sizes="(max-width: 640px) 45vw, (max-width: 1000px) 30vw, 25vw" style={{ objectPosition: item.position }} />
              <span className="sample-badge">Sample</span>
            </div>
            <div className="inspiration-caption">
              <span>{item.title}<small>Try this prompt</small></span>
              <ArrowUpRight size={18} aria-hidden="true" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
