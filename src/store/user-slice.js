import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  isChange: false,
  teacherList: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    reqUserStart(state) {
      state.loading = true;
    },
    reqUserSuccess(state) {
      state.loading = false;
      state.isChange = !state.isChange;
    },
    reqUserFailure(state) {
      state.loading = false;
    },
    saveTeachers(state, action) {
      state.teacherList = action.payload;
    },
    addNewTeacher(state, action) {
      state.teacherList = [...state.teacherList, action.payload];
      state.loading = false;
    },
    updateTeacher(state, action) {
      const { _id, updatedValue } = action.payload;
      state.teacherList = state.teacherList.map((item) =>
        item._id === _id ? { ...item, ...updatedValue } : item
      );
      state.loading = false;
    },
    deleteTeacher(state, action) {
      state.teacherList = state.teacherList.filter(
        (item) => item._id !== action.payload._id
      );
    },
  },
});

export const UserActions = userSlice.actions;
export default userSlice.reducer;
