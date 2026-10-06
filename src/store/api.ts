import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface SearchFlightsRequest {
  from: string;
  to: string;
  departureDate?: string;
  arrivalDate?: string;
  passengersCount?: number;
}

interface Flight {
  from: string;
  to: string;
  dateOfFlight: string;
  timeOfFlight: string;
  availableSeats: number;
  price: number;
}

export const api = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000",
  }),

  endpoints: (builder) => ({
    searchFlights: builder.mutation<Flight[], SearchFlightsRequest>({
      query: (body) => ({
        url: "/flights/search",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useSearchFlightsMutation } = api;
