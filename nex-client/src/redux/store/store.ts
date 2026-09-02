import { configureStore } from "@reduxjs/toolkit";

import themeReducer from "./slices/themeSlice";
import authReducer from "./slices/authSlice";
import courseReducer from "@/redux/features/courses/courseSlice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    courses: courseReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;