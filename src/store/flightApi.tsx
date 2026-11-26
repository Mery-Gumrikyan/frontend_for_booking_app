import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type {
  FlightSearchResponse,
  FlightSearchRequest,
  AddFlightRequest,
  AddFlightResponse,
  EditFlightRequest,
  EditFlightResponse,
  MyFlightsResponse,
  GetMyFlightsParams,
  CreateReservationRequest,
  CreateReservationResponse,
  MyReservationsResponse,
} from "../type";

export const flightApi = createApi({
  reducerPath: "flightApi",

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
  tagTypes: ["Flights", "Reservations"],
  endpoints: (builder) => ({
    addFlight: builder.mutation<AddFlightResponse, AddFlightRequest>({
      query: (body) => ({
        url: "/flights/flights",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Flights"],
    }),

    editFlight: builder.mutation<EditFlightResponse, EditFlightRequest>({
      query: ({ id, ...body }) => ({
        url: `/flights/flights/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Flights"],
    }),

    deleteFlight: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/flights/flights/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Flights"],
    }),

    getMyFlights: builder.query<MyFlightsResponse, GetMyFlightsParams | void>({
      query: (params) => ({
        url: "/flights/my-flights",
        params: params
          ? {
              page: params.page ?? 1,
              limit: params.limit ?? 10,
            }
          : undefined,
      }),
      providesTags: ["Flights"],
    }),

    selectFlight: builder.query<FlightSearchResponse, FlightSearchRequest>({
      query: (params) => ({
        url: "/flights/flights",
        method: "GET",
        params,
      }),
      providesTags: ["Flights"],
    }),

    createReservation: builder.mutation<
      CreateReservationResponse,
      CreateReservationRequest
    >({
      query: (body) => ({
        url: "/reservations",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Reservations", "Flights"],
    }),

    getMyReservations: builder.query<MyReservationsResponse, void>({
      query: () => "/reservations/my-reservations",
      providesTags: ["Reservations"],
    }),

    cancelReservation: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/reservations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reservations", "Flights"],
    }),
  }),
});

export const {
  useAddFlightMutation,
  useEditFlightMutation,
  useDeleteFlightMutation,
  useGetMyFlightsQuery,
  useLazyGetMyFlightsQuery,
  useLazySelectFlightQuery,
  useCreateReservationMutation,
  useGetMyReservationsQuery,
  useLazyGetMyReservationsQuery,
  useCancelReservationMutation,
} = flightApi;
