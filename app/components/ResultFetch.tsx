import { useSelector } from "react-redux";
import Dalle from "./Dalle";
import ImageOutput from "./ImageOutput";
import { RootState } from "../store/store";

const ResultFetch = () => {
  const model = useSelector((state: RootState) => state.model.value);

  return (
    <div>{model === "Stable Diffusion 2" ? <ImageOutput /> : <Dalle />}</div>
  );
};

export default ResultFetch;
