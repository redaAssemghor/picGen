"use client";
import ImageOutput from "./ImageOutput";
import Prompt from "./Prompt";

const Container = () => {
  return (
    <div className="m-10">
      <Prompt />
      <ImageOutput />
    </div>
  );
};

export default Container;
