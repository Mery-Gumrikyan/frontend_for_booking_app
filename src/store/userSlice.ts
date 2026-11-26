import { createSlice } from "@reduxjs/toolkit";
import type { User } from "../type";

const initialState: { user?: User } = {
  user: undefined,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = undefined;
    },
  },
});

export const { addUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
