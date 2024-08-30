"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { addImageUrl } from "../store/imagesUrlSlice";

const ImageOutput = () => {
  const [imgUrls, setImgUrls] = useState<string[]>([]);
  const prompt = useSelector((state: RootState) => state.prompt.value);
  const imagesArr = useSelector((state: RootState) => state.imagesArr.value);
  const dispatch = useDispatch();

  const fetchImage = async () => {
    try {
      const requests = Array.from({ length: 4 }, () =>
        fetch("/api/fetchImg", {
          method: "POST",
          body: JSON.stringify({ prompt }),
        })
      );

      const responses = await Promise.all(requests);

      const blobs = await Promise.all(responses.map((res) => res.blob()));
      const urls = blobs.map((blob) => URL.createObjectURL(blob));

      setImgUrls(urls);
      dispatch(addImageUrl(urls));
    } catch (error) {
      console.error("Failed to fetch image:", error);
    }
  };
  useEffect(() => {
    console.log(imagesArr);
    fetchImage();
  }, [prompt]);

  return (
    <div className="m-4 flex md:flex-row flex-col gap-2 w-full justify-center items-center">
      {imgUrls.length > 0 ? (
        imgUrls.map((url, index) => (
          <Image
            key={index}
            className="rounded-lg md:w-[350px]"
            src={url}
            alt={`image-${index}`}
            width={300}
            height={300}
          />
        ))
      ) : (
        <span className="loading loading-dots loading-lg"></span>
      )}
    </div>
  );
};

export default ImageOutput;
