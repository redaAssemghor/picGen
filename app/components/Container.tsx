"use client";
import { useSelector } from "react-redux";
import ImageOutput from "./ImageOutput";
import Prompt from "./Prompt";
import { RootState } from "../store/store";

const Container = () => {
  const isGenerating = useSelector(
    (state: RootState) => state.generateImg.var1
  );
  return (
    <div className="p-5 overflow-hidden">
      <Prompt />
      {isGenerating && <ImageOutput />}
    </div>
  );
};

export default Container;
