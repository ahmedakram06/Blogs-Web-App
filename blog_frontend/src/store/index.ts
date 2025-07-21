import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import socketReducer from "./slices/socketSlice";
import onlineUsersReducer from "./slices/onlineUsersSlice";
import searchReducer from "./slices/searchSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    socket: socketReducer,
    onlineUsers: onlineUsersReducer,
    search: searchReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
