import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  isChange: false,
};

const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    reqHistoryStart(state) {
      state.loading = true;
    },
    reqHistorySuccess(state) {
      state.loading = false;
      state.isChange = !state.isChange;
    },
    reqHistoryFailure(state) {
      state.loading = false;
    },
  },
});

export const HistoryActions = historySlice.actions;
export default historySlice.reducer;
