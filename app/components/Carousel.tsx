import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { inspiration, inspirationHref } from "@/lib/inspiration";

export default function Carousel() {
  return (
    <section id="explore" className="shell showcase" aria-label="Image inspiration">
      <div className="section-caption"><span>A LITTLE INSPIRATION</span><span>Find a starting point. Make it yours.</span></div>
      <div className="showcase-grid">
        {inspiration.slice(1, 5).map((item, index) => (
          <Link href={inspirationHref(item.prompt)} className="showcase-card" key={item.file} style={{ aspectRatio: index % 2 ? "3 / 4" : "4 / 5" }}>
            <Image src={"/new/" + item.file + ".webp"} alt={item.title} width={500} height={800} sizes="(max-width: 640px) 45vw, 25vw" />
            <span className="showcase-caption">{item.title}<ArrowUpRight size={16} /></span>
          </Link>
        ))}
      </div>
    </section>
  );
}
