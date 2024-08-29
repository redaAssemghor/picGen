"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

const ImageOutput = () => {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const prompt = "Generate an image of a cat playing with a ball of yarn.";

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch("/api/fetchImg**", {
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

    fetchImage();
  }, []);

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
