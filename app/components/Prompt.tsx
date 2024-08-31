"use client";
import { use, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { fillPrompt } from "../store/featurs/promptSlice";
import { setNagativePrompt } from "../store/featurs/negativePromptSlice";

const Prompt = () => {
  const [userPrompt, setUserPrompt] = useState("");
  const [userNegativePrompt, setUserNegativePrompt] = useState(
    "ugly, blurry, poor quality"
  );
  const [negativePrompt, setNegativePrompt] = useState(false);
  const [run, setRun] = useState(false);

  const dispatch = useDispatch();
  const loading = useSelector((state: RootState) => state.loading.value);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(fillPrompt(userPrompt));
    dispatch(setNagativePrompt(userNegativePrompt));
  };

  const handleClear = () => {
    setUserPrompt("");
  };

  const handleRun = async () => {
    try {
      setRun(true);
      const response = await fetch("/api/fetchPrompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log(data);
      setUserPrompt(data);
      setRun(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-between">
        <h1 className="text-3xl">AI Image Generator</h1>

        <select className="select select-bordered w-full max-w-xs">
          <option disabled selected>
            Choose a Model
          </option>
          <option>Dalle 3</option>
          <option>Stable Diffusion 2</option>
        </select>
      </div>
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full h-40 border border-gray-500 bg-transparent rounded-xl p-5 focus:outline-none"
          name="prompt"
          placeholder="Description prompt"
          onChange={(e) => setUserPrompt(e.target.value)}
          value={userPrompt}
        ></textarea>

        {negativePrompt && (
          <textarea
            className="w-full h-40 border border-gray-500 bg-transparent rounded-xl p-5 focus:outline-none"
            name="negative_prompt"
            placeholder="negative prompt"
            onChange={(e) => setUserNegativePrompt(e.target.value)}
            value={userNegativePrompt}
          ></textarea>
        )}

        <div className="flex flex-col gap-10 lg:flex-row justify-between mt-10">
          <div className="form-control gap">
            <label className="label gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="toggle"
                onClick={() => setNegativePrompt((e) => !e)}
              />
              <span className="label-text">Negative prompt</span>
            </label>
          </div>
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="flex gap-5">
              <button
                onClick={handleClear}
                className="btn btn-outline btn-warning w-20"
              >
                clear
              </button>
              <button
                onClick={handleRun}
                className="btn btn-outline btn-warning w-20"
              >
                {!run ? (
                  "run"
                ) : (
                  <span className="loading loading-spinner text-warning"></span>
                )}
              </button>
            </div>
            <button
              className={`btn btn-outline btn-success lg:w-60 w-full`}
              type="submit"
            >
              {!loading ? (
                "Generate"
              ) : (
                <span className="loading loading-spinner text-success"></span>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Prompt;
