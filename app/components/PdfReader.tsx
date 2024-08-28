"use client";
import { HfInference } from "@huggingface/inference";
import Image from "next/image";
import { useEffect, useState } from "react";

const hf = new HfInference("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");
const model = "stabilityai/stable-diffusion-2";

const PdfReader = () => {
  const [imgUrl, setimgUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetshData = async () => {
      try {
        const response = await hf.textToImage({
          model: "",
          inputs:
            "award winning high resolution photo of a giant tortoise/((ladybird)) hybrid, [trending on artstation]",
          parameters: {},
        });
        const url = URL.createObjectURL(response);
        setimgUrl(url);

        return () => URL.revokeObjectURL(url);

        // .then((output) => {
        //   const blob = output;
        //   const url = URL.createObjectURL(blob);
        //   setimgUrl(url);
        //   console.log(output);
        // });
      } catch (error) {
        console.log(error);
      }
    };
    fetshData();
  }, []);

  return (
    <div>
      {imgUrl && <Image src={imgUrl} alt="image" width={500} height={500} />}
    </div>
  );
};

export default PdfReader;
