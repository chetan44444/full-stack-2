import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "../features/posts/postsSlice";
import platformsReducer from "../features/platforms/platformsSlice";

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    platforms: platformsReducer,
  },
  // configureStore already wires up redux-thunk + Redux DevTools by default
});

// Types are omitted here since this is a JavaScript project.
// If migrating to TypeScript, export RootState/AppDispatch types from here.
