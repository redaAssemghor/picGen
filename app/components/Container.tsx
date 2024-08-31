"use client";
import GenerateImageComponent from "./Dalle";
import ImageOutput from "./ImageOutput";
import Prompt from "./Prompt";

const Container = () => {
  return (
    <div className="m-10">
      <Prompt />
      <ImageOutput />

      {/* <GenerateImageComponent /> */}
    </div>
  );
};

export default Container;
