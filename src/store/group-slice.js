import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  groupList: [],
};

const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {
    reqGroupStart(state) {
      state.loading = true;
    },
    reqGroupSuccess(state, action) {
      state.loading = false;
      state.groupList = action.payload;
    },
    reqGroupFailure(state) {
      state.loading = false;
    },
    addNewGroup(state, action) {
      let key = state.groupList.length + 1;
      state.groupList = [...state.groupList, { key, ...action.payload }];
      state.loading = false;
    },
    delGroupById(state, action) {
      state.groupList = state.groupList.filter(
        (item) => item._id !== action.payload._id
      );
      state.loading = false;
    },
    updGroupById(state, action) {
      const { _id, newGroup } = action.payload;
      state.groupList = state.groupList.map((item) =>
        item._id === _id ? { ...item, ...newGroup } : item
      );
      state.loading = false;
    },
  },
});

export const GroupActions = groupSlice.actions;
export default groupSlice.reducer;
