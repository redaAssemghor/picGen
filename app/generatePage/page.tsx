"use client";
import Prompt from "../components/Prompt";
import ResultFetch from "../components/ResultFetch";

const Container = () => {
  return (
    <div className="lg:m-20 rounded-3xl p-10 bg-neutral">
      <Prompt />
      <ResultFetch />
    </div>
  );
};

export default Container;
