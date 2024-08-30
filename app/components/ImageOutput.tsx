"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { addImageUrl } from "../store/featurs/imagesUrlSlice";
import { ToggleLoading } from "../store/featurs/loadingSlice";

const ImageOutput = () => {
  const prompt = useSelector((state: RootState) => state.prompt.value);
  const imagesArr = useSelector((state: RootState) => state.imagesArr.value);
  const loadingState = useSelector((state: RootState) => state.loading.value);
  const negativePrompt = useSelector(
    (state: RootState) => state.negativePrompts.value
  );

  const dispatch = useDispatch();

  const fetchImage = async () => {
    try {
      dispatch(ToggleLoading());
      const requests = Array.from({ length: 4 }, () =>
        fetch("/api/fetchImg", {
          method: "POST",
          body: JSON.stringify({ prompt, negative_prompt: negativePrompt }),
        })
      );

      const responses = await Promise.all(requests);

      const blobs = await Promise.all(responses.map((res) => res.blob()));
      const urls = blobs.map((blob) => URL.createObjectURL(blob));

      dispatch(addImageUrl(urls));
    } catch (error) {
      console.error("Failed to fetch image:", error);
    } finally {
      dispatch(ToggleLoading());
    }
  };
  useEffect(() => {
    console.log(imagesArr);
    console.log(negativePrompt);
    fetchImage();
  }, [prompt]);

  return (
    <div className="my-10 flex md:flex-row flex-col gap-2 w-full justify-center items-center overflow-hidden">
      {imagesArr.map((url, index) =>
        !loadingState ? (
          <Image
            key={index}
            className="rounded-lg md:w-[350px]"
            src={url}
            alt={`image-${index}`}
            width={300}
            height={300}
          />
        ) : (
          <div key={index} className="skeleton h-[350px] w-[350px]"></div>
        )
      )}
    </div>
  );
};

export default ImageOutput;
