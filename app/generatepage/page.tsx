"use client";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Prompt from "../components/Prompt";
import ResultFetch from "../components/ResultFetch";

const Container = () => {
  return (
    <div className="bg-[--black] text-[--light]">
      <Header />
      <div className="lg:m-20 rounded-3xl p-10 bg-base-200">
        <Prompt />
        <ResultFetch />
      </div>
      <FAQ />
      <Footer />
    </div>
  );
};

export default Container;
