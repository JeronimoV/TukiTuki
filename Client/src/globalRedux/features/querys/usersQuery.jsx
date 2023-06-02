import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const User = createApi({
  reducerPath: 'user',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://tukituki-backend-2f9e.onrender.com' }),
  endpoints: (builder) => ({
    getUserWithEmail: builder.query({
      query: (email) => `/users/id/${email}`,
    }),
    getUserWithId: builder.query({
      query: (id) => `/users/${id}`,
    }),
    getUserWithNickname: builder.query({
      query: (nickname) => `/users/profile/${nickname}`,
    }),
    createUser: builder.mutation({
        query: (data) => ({
          url: `/users`,
          method: 'POST',
          body: data,
        }),
      }),
    loginUser: builder.mutation({
      query: (data) => ({
        url: `/users/login`,
        method: 'POST',
        body: data,
      }),
    }),
    logOutUser: builder.mutation({
      query: (data) => ({
        url: `/users/delete`,
        method: 'POST',
        body: data,
      }),
    }),
    isLogged: builder.mutation({
      query: (data) => ({
        url: `/users/verify`,
        method: 'POST',
        body: data,
      }),
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `/users/`,
        method: 'PUT',
        body: data,
      }),
    }),
  }),
});

export const {
    useGetUserWithEmailQuery,
    useGetUserWithIdQuery,
    useGetUserWithNicknameQuery,
    useCreateUserMutation,
    useLoginUserMutation,
    useLogOutUserMutation,
    useIsLoggedMutation,
    useUpdateUserMutation,
} = User;
