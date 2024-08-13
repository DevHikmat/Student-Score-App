import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  isChange: false,
  quizList: [],
};

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    reqQuizStart(state) {
      state.loading = true;
    },
    reqQuizSuccess(state) {
      state.loading = false;
      state.isChange = !state.isChange;
    },
    reqQuizFailure(state) {
      state.loading = false;
    },
  },
});

export const QuizActions = quizSlice.actions;
export default quizSlice.reducer;
