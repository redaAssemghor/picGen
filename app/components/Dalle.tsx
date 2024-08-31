"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

const Dalle = () => {
  const [img, setImg] = useState<any[]>([]);

  const handleFetch = async () => {
    try {
      const requests = Array.from({ length: 2 }, () =>
        fetch("/api/dalle2**", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }).then((res) => res.json())
      );
      const responses = await Promise.all(requests);

      const imageUrls = responses.map((res) => res.image_url);

      console.log(imageUrls);
      setImg(imageUrls);
    } catch (error) {
      console.log(error);

      return { error };
    }
  };

  useEffect(() => {
    handleFetch();
  }, []); // Run only on component mount

  return (
    <div className="my-10 flex md:flex-row flex-col gap-2 w-full justify-center items-center overflow-hidden">
      {img.length > 0 ? (
        img.map((img, i) => (
          <Image
            className="rounded-lg md:w-[350px]"
            src={img}
            key={i}
            alt="Generated Image"
            width={500}
            height={500}
          />
        ))
      ) : (
        <p>Loading image...</p>
      )}
    </div>
  );
};

export default Dalle;
