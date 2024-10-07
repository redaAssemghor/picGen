"use client";
import React from "react";
import Pricing from "./Pricing";
import Footer from "../components/Footer";
import Header from "../components/Header";

const page = () => {
  return (
    <div className="bg-[--black]">
      <Header />
      <Pricing />
      <Footer />
    </div>
  );
};

export default page;
