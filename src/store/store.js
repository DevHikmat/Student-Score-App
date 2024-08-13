import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "./auth-slice";
import userSliceReducer from "./user-slice";
import groupSliceReducer from "./group-slice";
import quizSliceReducer from "./quiz-slice";
import questionSliceReducer from "./question-slice";
import historySliceReducer from "./history-slice";
import examSliceReducer from "./exam-slice";

export const store = configureStore({
  reducer: {
    auth: authSliceReducer,
    user: userSliceReducer,
    group: groupSliceReducer,
    quiz: quizSliceReducer,
    question: questionSliceReducer,
    history: historySliceReducer,
    exam: examSliceReducer,
  },
});
