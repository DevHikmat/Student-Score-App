import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  currentUser: null,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authStart(state) {
      state.loading = true;
    },
    authSuccess(state, action) {
      state.loading = false;
      state.currentUser = action.payload;
      state.isLoggedIn = true;
    },
    authFailure(state) {
      state.loading = false;
    },
    logout(state) {
      state.isLoggedIn = false;
    },
    changeCurrentUser(state, action) {
      state.currentUser = action.payload;
    },
  },
});

export const AuthActions = authSlice.actions;
export default authSlice.reducer;
