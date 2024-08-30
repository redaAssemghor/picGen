import { configureStore } from "@reduxjs/toolkit";
import promptReducer from "./promptSlice";
import imagesUrlReducer from "./imagesUrlSlice";

export const store = configureStore({
  reducer: {
    prompt: promptReducer,
    imagesArr: imagesUrlReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
