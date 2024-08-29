"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const ImageOutput = () => {
  const [imgUrl, setImgUrl] = useState<string | null>(null);

  const prompt = useSelector((state: RootState) => state.prompt.value);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch("/api/fetchImg", {
          method: "POST",
          body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log(response);

        const blob = await response.blob(); // Get the image as a Blob
        const url = URL.createObjectURL(blob); // Create a local URL for the Blob
        setImgUrl(url); // Set the local URL to the state
      } catch (error) {
        console.error("Failed to fetch image:", error);
      }
    };
    if (prompt) fetchImage();
  }, [prompt]);

  return (
    <div>
      {imgUrl ? (
        <Image src={imgUrl} alt="image" width={500} height={500} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ImageOutput;
