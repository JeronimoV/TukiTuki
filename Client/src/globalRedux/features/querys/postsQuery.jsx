import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const Posts = createApi({
  reducerPath: 'posts',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://tukituki-backend.onrender.com' }),
  endpoints: (builder) => ({
    /*getUserId: builder.query({
      query: (id) => `/users`,
    }),*/
    getFriendsPosts: builder.query({
        query: (userId) => `/posts/friends/${userId}`,
    }),
  }),
});

export const {
  useGetFriendsPostsQuery
} = Posts;