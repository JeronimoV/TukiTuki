import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const Friends = createApi({
  reducerPath: 'friends',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://tukituki-backend-2f9e.onrender.com' }),
  endpoints: (builder) => ({
    /*getUserId: builder.query({
      query: (id) => `/users`,
    }),*/
    getFriends: builder.query({
        query: (userId) => `friends/${userId}`,
      }),
    setFriend: builder.mutation({
        query: (data) => ({
            url: `/friends/`,
            method: 'POST',
            body: data,
      }),
    }),
    removeFriend: builder.mutation({
        query: (data) => ({
            url: `/friends/remove`,
            method: 'POST',
            body: data,
      }),
    }),
  
  }),
});

export const {
  useGetFriendsQuery,
  useRemoveFriendMutation,
  useSetFriendMutation,
} = Friends;