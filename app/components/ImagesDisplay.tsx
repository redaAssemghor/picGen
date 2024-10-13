import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { FaDownload, FaRegStar } from "react-icons/fa6";
import { useState } from "react";
import FullImgPage from "./FullImage";

const ImagesDisplay = () => {
  const [show, setShow] = useState(true);

  const showImages = () => {
    setShow(true);
  };

  const imagesArr = useSelector((state: RootState) => state.imagesArr.value);
  const loadingState = useSelector((state: RootState) => state.loading.value);

  const handleDownload = (url: string, index: number) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `downloaded-image-${index + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {imagesArr.map((url, index) =>
        !loadingState ? (
          <div key={index} className="relative">
            <button onClick={showImages} className="custom-cursor">
              <Image
                className="rounded-lg md:w-[300px]"
                src={url}
                alt={`image-${index}`}
                width={300}
                height={300}
              />
            </button>
            <div className="absolute bottom-0 right-0 flex gap-4 p-4">
              <button className="rounded-full hover:bg-neutral p-2 duration-700">
                <FaRegStar size={30} color="white" />
              </button>
              <button
                onClick={() => handleDownload(url, index)}
                className="rounded-full hover:bg-neutral p-2 duration-700"
              >
                <FaDownload size={30} color="white" />
              </button>
            </div>
          </div>
        ) : (
          <div key={index} className="skeleton h-[350px] w-[350px]"></div>
        )
      )}
      {show && <FullImgPage setShow={setShow} />}
    </div>
  );
};

export default ImagesDisplay;
