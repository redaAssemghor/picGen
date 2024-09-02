import { createSlice } from "@reduxjs/toolkit";

interface pointsState {
  value: number;
}

const initialState: pointsState = {
  value: 0,
};

const pointsSlice = createSlice({
  name: "points",
  initialState,
  reducers: {
    updatePoints: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { updatePoints } = pointsSlice.actions;
export default pointsSlice.reducer;
