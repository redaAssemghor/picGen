"use client";
import Image from "next/image";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { HiFlag, HiMiniXMark } from "react-icons/hi2";
import { FaDownload, FaRegHeart, FaRegStar } from "react-icons/fa";
import { HiOutlineDownload } from "react-icons/hi";

const FullImgPage = () => {
  const [selectedImg, setSelectedImg] = useState(0);

  const imagesUrl = useSelector((state: RootState) => state.imagesArr.value);
  const prompt = useSelector((state: RootState) => state.prompt.value);

  const handleBack = () => {
    window.history.back();
  };

  const handleDownload = () => {
    const imageUrl = imagesUrl[selectedImg];
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `downloaded-image-${selectedImg + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="lg:flex h-screen">
      <div className="relative flex flex-col gap-4 justify-center items-center p-5 lg:w-2/3">
        {/* Blurred Background Element */}
        <div className="absolute inset-0 bg-secondary-content blur-3xl z-0"></div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col gap-4 justify-center items-center">
          <div>
            <Image
              className="rounded-sm"
              src={imagesUrl[selectedImg]}
              alt="image"
              width={550}
              height={550}
            />
          </div>
          <div className="flex gap-3">
            {imagesUrl.map((img, i) => (
              <Image
                className={`hover:opacity-100 duration-700 rounded-xl ${
                  i === selectedImg ? "opacity-100" : "opacity-30"
                }`}
                onClick={() => setSelectedImg(i)}
                key={i}
                src={img}
                alt="image"
                width={100}
                height={100}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="relative bg-black flex-grow m-auto lg:m-0">
        <div className="m-5">
          <div className="flex gap-6">
            <button className="rounded-full hover:bg-neutral p-2 duration-700">
              <FaRegStar size={20} color="white" />
            </button>

            <button
              className="rounded-full hover:bg-neutral p-2 duration-700"
              onClick={handleDownload}
            >
              <HiOutlineDownload size={20} color="white" />
            </button>

            <button className="rounded-full hover:bg-neutral p-2 duration-700">
              <FaRegHeart size={20} color="white" />
            </button>

            <button className="rounded-full hover:bg-neutral p-2 duration-700">
              <HiFlag size={20} color="white" />
            </button>
          </div>

          <div className="lg:my-[100px] py-5">
            <h1 className="font-semibold text-xl">Prompt</h1>
            <p className="text-sm py-3 text-gray-500">{prompt}</p>
          </div>
        </div>

        <button
          className="absolute right-0 top-0 text-3xl p-4"
          onClick={handleBack}
        >
          <HiMiniXMark />
        </button>
      </div>
    </div>
  );
};

export default FullImgPage;
