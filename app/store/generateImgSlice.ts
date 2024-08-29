import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  var1: false,
};

const generateSlice = createSlice({
  name: "generate",
  initialState,
  reducers: {
    generateImg: (state) => {
      state.var1 = !state.var1;
    },
  },
});

export const { generateImg } = generateSlice.actions;
export default generateSlice.reducer;
