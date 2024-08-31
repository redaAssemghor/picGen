import { useDispatch } from "react-redux";
import { ToggleLoading } from "../store/featurs/loadingSlice";

const fetchImage = async () => {
  try {
    const requests = Array.from({ length: 4 }, () =>
      fetch("/api/fetchImg", {
        method: "POST",
        body: JSON.stringify({ prompt, negative_prompt: negativePrompt }),
      })
    );

    const responses = await Promise.all(requests);

    const blobs = await Promise.all(responses.map((res) => res.blob()));
    const urls = blobs.map((blob) => URL.createObjectURL(blob));
  } catch (error) {
    console.error("Failed to fetch image:", error);
  }
};
