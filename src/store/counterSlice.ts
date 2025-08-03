import { createSlice } from "@reduxjs/toolkit";

interface CounterState {
  value: number;
  disabled: boolean;
}

const initialState: CounterState = {
  value: 0,
  disabled: false,
};

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment(state) {
      state.value += 1;
    },
    reset(state) {
      state.value = 0;
    },
    toggleDisabled(state) {
      state.disabled = !state.disabled;
    },
  },
});

export const { increment, reset, toggleDisabled } = counterSlice.actions;
export default counterSlice.reducer;
