import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ImageUrlsState {
  value: string[];
}

const initialState: ImageUrlsState = {
  value: [],
};

const imagesUrlSlice = createSlice({
  name: "imageUrls",
  initialState,
  reducers: {
    addImageUrl: (state, action: PayloadAction<string>) => {
      state.value.push(action.payload);
    },
    removeImageUrl: (state, action) => {
      state.value = state.value.filter((url) => url !== action.payload);
    },
  },
});
export const { addImageUrl, removeImageUrl } = imagesUrlSlice.actions;
export default imagesUrlSlice.reducer;
