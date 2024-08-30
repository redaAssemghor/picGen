"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { fillPrompt } from "../store/promptSlice";
import { generateImg } from "../store/generateImgSlice";

const Prompt = () => {
  const [userPrompt, setUserPrompt] = useState("");

  const prompt = useSelector((state: RootState) => state.prompt.value);
  const dispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(fillPrompt(userPrompt));
  };
  return (
    <div className="w-full flex flex-col gap-10">
      <h1 className="text-3xl">AI Image Generator</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full h-40 border border-gray-500 bg-transparent rounded-xl p-5 focus:outline-none"
          name="prompt"
          placeholder="Description prompt"
          onChange={(e) => setUserPrompt(e.target.value)}
          value={userPrompt}
        ></textarea>
        <div className="flex flex-col gap-10 lg:flex-row justify-between mt-10">
          <div className="form-control gap">
            <label className="label gap-2 cursor-pointer">
              <input type="checkbox" className="toggle" defaultChecked />
              <span className="label-text">Negative prompt</span>
            </label>
          </div>
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="flex gap-5">
              <button className="btn btn-outline btn-warning w-20">
                clear
              </button>
              <button className="btn btn-outline btn-warning w-20">run</button>
            </div>
            <button
              className="btn btn-outline btn-success lg:w-60 w-full"
              type="submit"
            >
              Generate
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Prompt;
