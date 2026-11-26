import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { User, UserRole } from "../type";

export interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
}

interface RegisterRequest {
  role: UserRole;
  name: string;
  surname: string;
  citizenship?: string;
  chronicDiseases?: boolean;
  email: string;
  password: string;
}

interface RegistrationResponse {
  message: string;
}

export const authApi = createApi({
  reducerPath: "authApi",

  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",

    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),

    register: builder.mutation<RegistrationResponse, RegisterRequest>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
    }),

    getUser: builder.query<User, void>({
      query: () => "/auth/me",
      keepUnusedDataFor: 0,
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetUserQuery,
  useLazyGetUserQuery,
} = authApi;
