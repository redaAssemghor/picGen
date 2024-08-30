import { configureStore } from "@reduxjs/toolkit";
import promptReducer from "./featurs/promptSlice";
import imagesUrlReducer from "./featurs/imagesUrlSlice";
import loadingReducer from "./featurs/loadingSlice";
import nagativePromptReducer from "./featurs/negativePromptSlice";

export const store = configureStore({
  reducer: {
    prompt: promptReducer,
    imagesArr: imagesUrlReducer,
    loading: loadingReducer,
    negativePrompts: nagativePromptReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
