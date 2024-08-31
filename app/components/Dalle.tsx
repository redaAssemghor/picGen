"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { ToggleLoading } from "../store/featurs/loadingSlice";

const Dalle = () => {
  const [imgs, setImgs] = useState<any[]>([]);
  const prompt = useSelector((state: RootState) => state.prompt.value);
  const loadingState = useSelector((state: RootState) => state.loading.value);
  const model = useSelector((state: RootState) => state.model.value);

  const dispatch = useDispatch();

  const handleFetch = async () => {
    try {
      dispatch(ToggleLoading());
      const requests = Array.from({ length: 1 }, () =>
        fetch("/api/dalle2", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt,
          }),
        }).then((res) => res.json())
      );
      const responses = await Promise.all(requests);

      const imageUrls = responses.map((res) => res.image_url);

      console.log(imageUrls);
      setImgs(imageUrls);
    } catch (error) {
      console.log(error);

      return { error };
    } finally {
      dispatch(ToggleLoading());
    }
  };

  useEffect(() => {
    if (prompt !== "" && model === "dalle 3") {
      handleFetch();
    }
  }, [prompt]);

  return (
    <div className="my-10 flex md:flex-row flex-col gap-2 w-full justify-center items-center overflow-hidden">
      {imgs.length > 0 &&
        imgs.map((img, i) =>
          !loadingState ? (
            <Image
              className="rounded-lg md:w-[350px]"
              src={img}
              key={i}
              alt="Generated Image"
              width={500}
              height={500}
            />
          ) : (
            <div key={i} className="skeleton h-[350px] w-[350px]"></div>
          )
        )}
    </div>
  );
};

export default Dalle;
