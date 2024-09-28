import Image from "next/image";
import { MdOutlineArrowRightAlt } from "react-icons/md";

const Carousel = () => {
  return (
    <div className="bg-inherit">
      <h1 className="flex items-center gap-2 px-5 opacity-60">
        <span className="text-2xl">SCROLL</span>
        <MdOutlineArrowRightAlt size={60} />
      </h1>

      <div className="carousel">
        <div className="carousel-item max-h-[400px] max-w-[400px]">
          <Image
            width={300}
            height={300}
            src="/carousel/img6.webp"
            alt="Burger"
          />
        </div>
        <div className="carousel-item max-h-[400px] max-w-[400px]">
          <Image
            width={300}
            height={300}
            src="/carousel/img7.webp"
            alt="Burger"
          />
        </div>
        <div className="carousel-item max-h-[400px] max-w-[400px]">
          <Image
            width={300}
            height={300}
            src="/carousel/img5.webp"
            alt="Burger"
          />
        </div>
        <div className="carousel-item max-h-[400px] max-w-[400px]">
          <Image
            width={300}
            height={300}
            src="/carousel/img2.webp"
            alt="Burger"
          />
        </div>
        <div className="carousel-item max-h-[400px] max-w-[400px]">
          <Image
            width={300}
            height={300}
            src="/carousel/img3.webp"
            alt="Burger"
          />
        </div>
        <div className="carousel-item max-h-[400px] max-w-[400px]">
          <Image
            width={300}
            height={300}
            src="/carousel/img4.webp"
            alt="Burger"
          />
        </div>
      </div>
    </div>
  );
};

export default Carousel;
