import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const Chat = createApi({
  reducerPath: 'chat',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://tukituki-backend-2f9e.onrender.com' }),
  endpoints: (builder) => ({
    /*getUserId: builder.query({
      query: (id) => `/users`,
    }),*/
    getChatInfo: builder.mutation({
      query: (data) => ({
          url: `chat/friend`,
          method: 'POST',
          body: data,
    }),
    }),
    getUserChats: builder.query({
      query: (userId) => `chat/allchats/${userId}`,
    }),
    getChatMessages: builder.query({
      query: (chatId) => `chat/message/${chatId}`,
    }),
    createChat: builder.mutation({
        query: (data) => ({
            url: `/chat`,
            method: 'POST',
            body: data,
      }),
    }),
    sendMessage: builder.mutation({
        query: (data) => ({
            url: `/chat/message`,
            method: 'POST',
            body: data,
      }),
    }),
  }),
});

export const {
    useGetChatInfoQuery,
    useGetChatFriendInfoQuery,
    useGetUserChatsQuery,
    useGetChatMessagesQuery,
    useCreateChatMutation,
    useSendMessageMutation
} = Chat;