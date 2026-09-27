import Image from "next/image";
const images = [
  { src: "/hero-z-image.png", label: "Everyday, reimagined" },
  { src: "/carousel/img22.webp", label: "A different perspective" },
  { src: "/carousel/img06.webp", label: "Limitless possibilities" },
  { src: "/dalle-imgs/img01.webp", label: "Worlds beyond the ordinary" },
];
export default function Carousel() {
  return <section id="explore" className="shell showcase" aria-label="Image inspiration">
    <div className="section-caption"><span>A LITTLE INSPIRATION</span><span>Imagine what you could make</span></div>
    <div className="showcase-grid">{images.map((image, index) =>
      <figure className="showcase-card" key={image.src}>
        <Image src={image.src} alt={image.label} width={500} height={600} priority={index < 2} sizes="(max-width: 640px) 45vw, 25vw" />
        <figcaption><span>0{index + 1}</span>{image.label}</figcaption>
      </figure>
    )}</div>
  </section>;
}
