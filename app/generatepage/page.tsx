"use client";
import Header from "../components/Header";
import Prompt from "../components/Prompt";
import ResultFetch from "../components/ResultFetch";

const Container = () => {
  return (
    <div className="bg-[--black]">
      <Header />
      <div className="lg:m-20 rounded-3xl p-10 bg-[--dark]">
        <Prompt />
        <ResultFetch />
      </div>
    </div>
  );
};

export default Container;
