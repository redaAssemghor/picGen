"use client";
import Prompt from "./Prompt";
import ResultFetch from "./ResultFetch";

const Container = () => {
  return (
    <div className="relative lg:m-20 rounded-3xl p-10">
      <Prompt />
      <ResultFetch />
    </div>
  );
};

export default Container;
