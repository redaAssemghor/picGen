import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  value: "",
  initialized: false,
};

const promptSlice = createSlice({
  name: "prompt",
  initialState,
  reducers: {
    fillPrompt(state, action: PayloadAction<string>) {
      state.value = action.payload;
    },
    initPrompt(state) {
      state.initialized = !state.initialized;
    },
  },
});
export const { fillPrompt } = promptSlice.actions;
export default promptSlice.reducer;
