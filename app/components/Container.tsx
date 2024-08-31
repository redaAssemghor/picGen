"use client";
import { useSelector } from "react-redux";
import Prompt from "./Prompt";
import { RootState } from "../store/store";
import { useEffect } from "react";
import ResultFetch from "./ResultFetch";

const Container = () => {
  const model = useSelector((state: RootState) => state.model.value);

  useEffect(() => {
    console.log(model);
  }, [model]);

  return (
    <div className="m-10">
      <Prompt />
      <ResultFetch />
    </div>
  );
};

export default Container;
