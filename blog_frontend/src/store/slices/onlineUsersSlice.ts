import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../types";

const onlineUsersSlice = createSlice({
  name: "onlineUsers",
  initialState: [] as User[],
  reducers: {
    setOnlineUsers: (_, action: PayloadAction<User[]>) => {
      return action.payload;
    },
  },
});

export const { setOnlineUsers } = onlineUsersSlice.actions;
export default onlineUsersSlice.reducer;
