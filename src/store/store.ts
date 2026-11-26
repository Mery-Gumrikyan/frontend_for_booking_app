import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./authApi";
import { flightApi } from "./flightApi";
import userReducer from "./userSlice";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [flightApi.reducerPath]: flightApi.reducer,
    user: userReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      flightApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
