import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export enum UserRole {
  Traveler = "traveler",
  Agent = "agent",
}

interface LoginRequest {
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

interface UserProfile {
  name: string;
  userRole: UserRole;
}

export const authApi = createApi({
  reducerPath: "authApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000",

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

    getProfile: builder.query<UserProfile, void>({
      query: () => "/auth/profile",
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useGetProfileQuery } =
  authApi;
