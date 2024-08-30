import { createSlice } from "@reduxjs/toolkit";
import { initialize } from "next/dist/server/lib/render-server";

interface nagativePromptState {
  value: string;
}

const initialState = {
  value: "",
};

const nagativePromptSlice = createSlice({
  name: "nagativePrompt",
  initialState,
  reducers: {
    setNagativePrompt: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setNagativePrompt } = nagativePromptSlice.actions;
export default nagativePromptSlice.reducer;
