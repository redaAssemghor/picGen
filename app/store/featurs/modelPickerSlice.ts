import { createSlice } from "@reduxjs/toolkit";

interface modelState {
  value: string;
}

const initialState: modelState = {
  value: "Stable Diffusion 2",
};

const modelSlice = createSlice({
  name: "model",
  initialState,
  reducers: {
    selectModel: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { selectModel } = modelSlice.actions;
export default modelSlice.reducer;
