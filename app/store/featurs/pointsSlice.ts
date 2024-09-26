import { createSlice } from "@reduxjs/toolkit";

interface pointsState {
  value: number;
  enoghPoints: boolean;
}

const initialState: pointsState = {
  value: 0,
  enoghPoints: true,
};

const pointsSlice = createSlice({
  name: "points",
  initialState,
  reducers: {
    updatePoints: (state, action) => {
      state.value = action.payload;
    },
    setEnoghpoints: (state, action) => {
      state.enoghPoints = action.payload;
    },
  },
});

export const { updatePoints, setEnoghpoints } = pointsSlice.actions;
export default pointsSlice.reducer;
