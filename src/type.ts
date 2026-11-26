import type { Dayjs } from "dayjs";

export enum UserRole {
  Traveler = "traveler",
  Agent = "agent",
}

export interface User {
  name: string;
  surname: string;
  email: string;
  role: UserRole;
}

export interface FlightFormValues {
  departureDestination: string;
  arrivalDestination: string;
  departureDateAndTime: Dayjs;
  arrivalDateAndTime: Dayjs;
  ticketPrice: number;
  ticketCurrency: string;
  numberOfSeats: number;
}

export type TripType = "oneWay" | "roundTrip";

export interface FlightSearchValues {
  tripType: TripType;
  departureDestination: string;
  arrivalDestination: string;
  departureDate: Dayjs;
  returnDate?: Dayjs;
  adults: number;
  children: number;
  infants: number;
}

export interface FlightSearchRequest {
  departureDestination: string;
  arrivalDestination: string;
  departureDate: string;
  returnDate?: string;
  tripType: TripType;
  adults: number;
  children: number;
  infants: number;
}

export interface FlightSearchResponse {
  departureFlights: Flight[];
  returnFlights: Flight[];
}

export interface Flight {
  id?: number;
  createdBy?: number;
  departureDestination: string;
  arrivalDestination: string;
  departureDateAndTime: string;
  arrivalDateAndTime: string;
  ticketPrice: number;
  ticketCurrency: string;
  numberOfSeats: number;
}

export interface AddFlightRequest {
  departureDestination: string;
  arrivalDestination: string;
  departureDateAndTime: string;
  arrivalDateAndTime: string;
  ticketPrice: number;
  ticketCurrency: string;
  numberOfSeats: number;
}

export interface AddFlightResponse {
  message: string;
  flight: Flight;
}

export interface EditFlightRequest {
  id: number;
  departureDestination?: string;
  arrivalDestination?: string;
  departureDateAndTime?: string;
  arrivalDateAndTime?: string;
  ticketPrice?: number;
  ticketCurrency?: string;
  numberOfSeats?: number;
}

export interface EditFlightResponse {
  message: string;
  flight: Flight;
}

export interface MyFlightsResponse {
  flights: Flight[];
  total?: number;
  page?: number;
  limit?: number;
  hasMore?: boolean;
}

export interface GetMyFlightsParams {
  page?: number;
  limit?: number;
}

export interface Reservation {
  id: number;
  userId: number;
  userEmail: string;
  tripType: TripType;
  passengersCount: number;
  departureFlightId: number;
  returnFlightId?: number | null;
  departureFlight: Flight;
  returnFlight?: Flight | null;
  totalPrice: number;
  ticketCurrency: string;
  status: "confirmed" | "cancelled";
  createdAt: string;
  cancelledAt?: string;
}

export interface CreateReservationRequest {
  departureFlightId: number;
  returnFlightId?: number | null;
  tripType: TripType;
  passengersCount: number;
}

export interface CreateReservationResponse {
  message: string;
  reservation: Reservation;
}

export interface MyReservationsResponse {
  reservations: Reservation[];
}
