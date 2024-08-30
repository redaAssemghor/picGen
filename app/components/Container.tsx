"use client";
import ImageOutput from "./ImageOutput";
import Prompt from "./Prompt";

const Container = () => {
  return (
    <div className="p-5 overflow-hidden">
      <Prompt />
      <ImageOutput />
    </div>
  );
};

export default Container;
