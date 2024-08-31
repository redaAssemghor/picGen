import { createSlice } from "@reduxjs/toolkit";

interface imageState {
  value: string;
}

const initialState: imageState = {
  value: "",
};

const imageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {
    setImage: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setImage } = imageSlice.actions;
export default imageSlice.reducer;
