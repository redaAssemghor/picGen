import { createSlice } from "@reduxjs/toolkit";

interface IState {
  value: string;
}

const initialState: IState = {
  value: "",
};

const idSlice = createSlice({
  name: "id",
  initialState,
  reducers: {
    setId: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setId } = idSlice.actions;
export default idSlice.reducer;
