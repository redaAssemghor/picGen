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
  },
});

export const { ToggleLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
