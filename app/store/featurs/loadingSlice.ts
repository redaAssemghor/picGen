import { createSlice } from "@reduxjs/toolkit";

interface loadingState {
  value: boolean;
}

const initialState: loadingState = {
  value: false,
};

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    ToggleLoading: (state) => {
      state.value = !state.value;
    },
    startLoading: (state) => {
      state.value = true;
    },
    stopLoading: (state) => {
      state.value = false;
    },
  },
});

export const { ToggleLoading, startLoading, stopLoading } =
  loadingSlice.actions;
export default loadingSlice.reducer;
