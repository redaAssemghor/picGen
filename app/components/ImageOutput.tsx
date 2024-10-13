"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { addImageUrl } from "../store/featurs/imagesUrlSlice";
import { startLoading, stopLoading } from "../store/featurs/loadingSlice";
import { HiChatBubbleBottomCenterText } from "react-icons/hi2";
import { SignInButton, useAuth } from "@clerk/nextjs";
import ImagesDisplay from "./ImagesDisplay";

const ImageOutput = () => {
  const [error, setError] = useState<string | null>(null);

  const prompt = useSelector((state: RootState) => state.prompt.value);
  const points = useSelector((state: RootState) => state.points.value);
  const negativePrompt = useSelector(
    (state: RootState) => state.negativePrompts.value
  );

  const { isSignedIn } = useAuth();

  const dispatch = useDispatch();

  const fetchImage = async () => {
    try {
      if (points < 5) {
        setError("Not enough points to fetch image");
        return;
      }
      dispatch(startLoading());
      const requests = Array.from({ length: 2 }, () =>
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
    } catch (error) {
      console.error("Failed to fetch image:", error);
    } finally {
      dispatch(stopLoading());
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
    <div className="flex flex-col gap-4 bg-[--black] rounded-lg my-10 p-5">
      {
        <h1 className="flex gap-2 items-center">
          <HiChatBubbleBottomCenterText />
          Generate: {prompt}
        </h1>
      }

      <div className="flex md:flex-row flex-col gap-2 w-full justify-center items-center overflow-hidden">
        {!isSignedIn && (
          <div role="alert" className="alert shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-info h-6 w-6 shrink-0"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <div>
              <h3 className="font-bold">You are not Signed In!</h3>
              <div className="text-xs">sigh in to get free 50 points</div>
            </div>
            <SignInButton />
          </div>
        )}

        {error && (
          <div role="alert" className="alert alert-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}
        {!error && <ImagesDisplay />}
      </div>
    </div>
  );
};

export default ImageOutput;
