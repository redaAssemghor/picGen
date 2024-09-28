"use client";
import Image from "next/image";
import { useState } from "react";

const DoubleImages = ({ images }: { images: string[] }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative lg:w-[600px] lg:h-[500px] w-[200px] h-[200px]"
    >
      <Image
        className={`rounded-3xl absolute h-[340px] w-[340px] object-scale-down transition-transform duration-1000 ${
          isHovered
            ? "transform lg:translate-y-40 lg:translate-x-40 translate-y-10 translate-x-10"
            : "transform lg:translate-y-20 lg:translate-x-20 translate-y-0 translate-x-0"
        }`}
        width={500}
        height={500}
        src={images[0]}
        alt="dalle generated"
      />

      <Image
        className={`rounded-3xl absolute h-[340px] w-[340px] object-scale-down transition-transform duration-1000 ${
          isHovered
            ? "transform lg:-translate-y-10 lg:-translate-x-10 -translate-y-10 -translate-x-10"
            : "transform lg:-translate-y-0 lg:-translate-x-0 -translate-y-8 -translate-x-8"
        }`}
        width={500}
        height={500}
        src={images[1]}
        alt="dalle generated"
      />
    </div>
  );
};

const ImageSlider = ({ images }: { images: string[] }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative lg:w-[600px] lg:h-[500px] w-[200px] h-[200px]"
    >
      <Image
        className="rounded-3xl absolute bottom-5 z-50 h-[400px] w-[400px] object-scale-down"
        width={500}
        height={500}
        src={images[0]}
        alt="dalle generated"
      />

      <Image
        className={`rounded-3xl absolute bottom-10 h-[340px] w-[340px] object-scale-down transition-transform duration-1000 ${
          isHovered
            ? "transform lg:translate-x-72 translate-x-36"
            : "transform lg:translate-x-40 translate-x-20"
        }`}
        width={500}
        height={500}
        src={images[1]}
        alt="dalle generated"
      />

      <Image
        className={`rounded-3xl absolute bottom-10 h-[340px] w-[340px] object-scale-down transition-transform duration-1000 ${
          isHovered
            ? "transform lg:-translate-x-72 -translate-x-36"
            : "transform lg:-translate-x-40 -translate-x-20"
        }`}
        width={500}
        height={500}
        src={images[2]}
        alt="dalle generated"
      />
    </div>
  );
};

const Info = () => {
  const dalleImgs = [
    "/dalle-imgs/img01.webp",
    "/dalle-imgs/img02.webp",
    "/dalle-imgs/img03.webp",
  ];

  const stableDiffusion = [
    "/stable-diffusion/01.webp",
    "/stable-diffusion/02.webp",
  ];
  return (
    <div className="text-[--light] py-20 px-5 lg:p-40 w-screen dark:[background:radial-gradient(44.36%_38.02%_at_50%_0%,#272B36_0%,#0C0D0F_100%),rgba(255,255,255,0.02)]">
      <div className="flex flex-col gap-2 items-center">
        <h2 className="p-2 bg-[--dark-blue] text-sm font-bold">
          Unleash Your Creativity
        </h2>
        <h1 className="font-extrabold lg:text-3xl text-xl">
          Advanced Generative AI Tools
        </h1>
        <p className="text-center text-sm ">
          Discover PicGen, the ultimate app that leverages the power of leading
          language models to bring your artistic visions to life.
        </p>
      </div>

      <div className="w-full h-[640px] lg:h-full flex justify-between lg:items-center flex-col lg:flex-row lg:py-20 pt-20 relative">
        <div className="space-y-2">
          <h2 className="text-[--dark-blue]">Generative AI</h2>
          <h2 className="text-2xl font-bold">Generated using DALL-E</h2>
          <p className="text-sm max-w-[300px]">
            Steampunk creatures and towering steam-powered beasts are roaming a
            mechanized wilderness in a steampunk world
          </p>
          <button className="bg-[--dark-blue] font-bold px-8 py-3 rounded-full">
            Start Generate
          </button>
        </div>
        <div className="lg:w-fit flex w-full justify-center">
          <ImageSlider images={dalleImgs} />
        </div>
      </div>

      <div className="w-screen h-[600px] lg:flex justify-around items-center flex-col lg:flex-row lg:py-20 relative hidden">
        <div className="lg:w-fit flex w-full justify-end">
          <DoubleImages images={stableDiffusion} />
        </div>
        <div className="space-y-2">
          <h2 className="text-[--dark-blue]">Generative AI</h2>
          <h2 className="text-2xl font-bold">
            Generated using Stable Diffusion
          </h2>
          <p className="text-sm w-1/2">
            girl of the future using a food vendor machine, futuristic design,
            electronic artwork, manga character, techno-noir, animated drawing,
            dystopian cyberpunk,
          </p>
          <button className="bg-[--dark-blue] font-bold px-8 py-3 rounded-full">
            Start Generate
          </button>
        </div>
      </div>
    </div>
  );
};

export default Info;
