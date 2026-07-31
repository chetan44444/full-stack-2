import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "./postsSlice";
import counterReducer from "./counterSlice";

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    counter: counterReducer,
  },
});