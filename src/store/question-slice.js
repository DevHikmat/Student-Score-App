import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  isChange: false,
};

const questionSlice = createSlice({
  name: "question",
  initialState,
  reducers: {
    reqQuestionStart(state) {
      state.loading = true;
    },
    reqQuestionSuccess(state) {
      state.loading = false;
      state.isChange = !state.isChange;
    },
    reqQuestionFailure(state) {
      state.loading = false;
    },
  },
});

export const QuestionActions = questionSlice.actions;
export default questionSlice.reducer;
