"use client";

import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { User } from "./features/querys/usersQuery";
import { Friends } from "./features/querys/friendsQuery";
import { Posts } from "./features/querys/postsQuery";
import { Chat } from "./features/querys/chatQuery";
import { saveUserData } from "./features/slices/userSlices";
import saveChatData from "./features/slices/chatsSices";

export default configureStore({
  reducer: {
    [User.reducerPath]: User.reducer,
    [Friends.reducerPath]: Friends.reducer,
    [Posts.reducerPath]: Posts.reducer,
    [Chat.reducerPath]: Chat.reducer,
    saveUser: saveUserData,
    saveChat: saveChatData,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      User.middleware,
      Friends.middleware,
      Posts.middleware,
      Chat.middleware
    ),
});
