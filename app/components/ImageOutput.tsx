"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { addImageUrl } from "../store/featurs/imagesUrlSlice";
import { startLoading, stopLoading } from "../store/featurs/loadingSlice";
import { HiChatBubbleBottomCenterText } from "react-icons/hi2";
import { FaDownload, FaRegStar } from "react-icons/fa";
import Link from "next/link";
import { updateUserPoints } from "../lib/userApi";
import { updatePoints } from "../store/featurs/pointsSlice";

const ImageOutput = () => {
  const prompt = useSelector((state: RootState) => state.prompt.value);
  const imagesArr = useSelector((state: RootState) => state.imagesArr.value);
  const loadingState = useSelector((state: RootState) => state.loading.value);
  const points = useSelector((state: RootState) => state.points.value);
  const negativePrompt = useSelector(
    (state: RootState) => state.negativePrompts.value
  );

  const dispatch = useDispatch();

  const handleDownload = (url: string, index: number) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `downloaded-image-${index + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fetchImage = async () => {
    try {
      dispatch(startLoading());
      const requests = Array.from({ length: 4 }, () =>
        fetch("/api/fetchImg", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt, negative_prompt: negativePrompt }),
        })
      );

      const responses = await Promise.all(requests);

      const blobs = await Promise.all(responses.map((res) => res.blob()));
      const urls = blobs.map((blob) => URL.createObjectURL(blob));

      dispatch(addImageUrl(urls));
      if (points > 4) await handleDecrement();
    } catch (error) {
      console.error("Failed to fetch image:", error);
    } finally {
      dispatch(stopLoading());
    }
  };
  const handleDecrement = async () => {
    try {
      const updatedPoints = await updateUserPoints(4);
      dispatch(updatePoints(updatedPoints));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (prompt !== "") {
      fetchImage();
    }

    return () => {
      dispatch(stopLoading());
    };
  }, [prompt]);

  return (
    <div className="flex flex-col gap-4 bg-base-200 rounded-lg my-10 p-5">
      {
        <h1 className="flex gap-2 items-center">
          <HiChatBubbleBottomCenterText />
          Generate: {prompt}
        </h1>
      }

      <div className="flex md:flex-row flex-col gap-2 w-full justify-center items-center overflow-hidden">
        {imagesArr.map((url, index) =>
          !loadingState ? (
            <div key={index} className="relative ">
              <Link href={"/images"} className="custom-cursor">
                <Image
                  className="rounded-lg md:w-[300px]"
                  src={url}
                  alt={`image-${index}`}
                  width={300}
                  height={300}
                />
              </Link>
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
      </div>
    </div>
  );
};

export default ImageOutput;
