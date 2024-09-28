import Image from "next/image";
import { MdOutlineArrowRightAlt } from "react-icons/md";

const imgs = [
  { link: "/carousel/img01.webp", alt: "img01" },
  { link: "/carousel/img02.jpg", alt: "img02" },
  { link: "/carousel/img03.jpg", alt: "img03" },
  { link: "/carousel/img04.jpg", alt: "img04" },
  { link: "/carousel/img05.jpg", alt: "img05" },
  { link: "/carousel/img06.webp", alt: "img06" },
  { link: "/carousel/img07.webp", alt: "img07" },
  { link: "/carousel/img08.webp", alt: "img08" },
  { link: "/carousel/img09.webp", alt: "img09" },
  { link: "/carousel/img10.webp", alt: "img10" },
  { link: "/carousel/img6.webp", alt: "Burger" },
  { link: "/carousel/img7.webp", alt: "Burger" },
  { link: "/carousel/img5.webp", alt: "Burger" },
  { link: "/carousel/img2.webp", alt: "Burger" },
  { link: "/carousel/img3.webp", alt: "Burger" },
  { link: "/carousel/img4.webp", alt: "Burger" },
  { link: "/carousel/img11.webp", alt: "img11" },
  { link: "/carousel/img12.webp", alt: "img12" },
  { link: "/carousel/img13.webp", alt: "img13" },
  { link: "/carousel/img15.webp", alt: "img15" },
  { link: "/carousel/img16.jpg", alt: "img16" },
  { link: "/carousel/img17.jpg", alt: "img17" },
  { link: "/carousel/img18.jpg", alt: "img18" },
  { link: "/carousel/img19.jpg", alt: "img19" },
  { link: "/carousel/img20.png", alt: "img20" },
  { link: "/carousel/img21.webp", alt: "img21" },
  { link: "/carousel/img22.webp", alt: "img22" },
  { link: "/carousel/img23.webp", alt: "img23" },
  { link: "/carousel/img24.webp", alt: "img24" },
  { link: "/carousel/img25.webp", alt: "img25" },
  { link: "/carousel/img26.webp", alt: "img26" },
  { link: "/carousel/img27.webp", alt: "img27" },
  { link: "/carousel/img28.webp", alt: "img28" },
  { link: "/carousel/img29.webp", alt: "img29" },
  { link: "/carousel/img30.webp", alt: "img30" },
];

const Carousel = () => {
  return (
    <div className="">
      <h1 className="flex items-center gap-2 px-5 opacity-60">
        <span className="text-2xl">SCROLL</span>
        <MdOutlineArrowRightAlt size={60} />
      </h1>

      <div className="carousel">
        {imgs.map((img, index) => (
          <div
            key={index}
            className="carousel-item max-w-[300px] max-h-[300px]"
          >
            <Image
              className="object-cover"
              width={400}
              height={400}
              src={img.link}
              alt={img.alt}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
