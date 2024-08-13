import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isExamStart: false,
  isExamFinish: false,
  answers: [],
};

const examSlice = createSlice({
  name: "exam",
  initialState,
  reducers: {
    examStart(state) {
      state.isExamStart = true;
      state.isExamFinish = false;
      state.answers = [];
    },
    addAnswer(state, action) {
      state.answers = [...state.answers, action.payload];
    },
    examFinish(state) {
      state.isExamFinish = true;
      state.isExamStart = false;
    },
  },
});

export const ExamActions = examSlice.actions;
export default examSlice.reducer;
