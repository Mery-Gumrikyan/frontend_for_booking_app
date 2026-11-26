import { useRef, useState } from "react";
import { Collapse, Typography, message } from "antd";

import AppHeader from "../../components/AppHeader/AppHeader";
import WelcomeText from "../../components/WelcomeText/WelcomeText";
import FlightSearchForm from "../../components/FlightSearchForm/FlightSearchForm";
import FlightInfoCard from "../../components/FlightInfoCard/FlightInfoCard";
import TripSummary from "../../components/TripSummary/TripSummary";
import ReservationsList from "../../components/ReservationsList/ReservationsList";
import FlightRouteHeader from "../../components/FlightRouteHeader/FlightRouteHeader";

import { useGetUserQuery } from "../../store/authApi";
import {
  useLazySelectFlightQuery,
  useCreateReservationMutation,
} from "../../store/flightApi";

import "./travelerPage.css";

import type {
  Flight,
  FlightSearchRequest,
  TripType,
  CreateReservationRequest,
} from "../../type";

const isSameFlight = (selected: Flight | null, flight: Flight) => {
  if (!selected) return false;
  if (selected.id && flight.id) return selected.id === flight.id;
  return selected === flight;
};

const formatTripTotal = (
  departure: Flight,
  returnFlight: Flight | null,
  passengersCount: number,
  tripType: TripType | null,
) => {
  const depPrice = (departure.ticketPrice ?? 0) * passengersCount;
  const retPrice = (returnFlight?.ticketPrice ?? 0) * passengersCount;

  if (tripType === "oneWay" || !returnFlight) {
    return `${depPrice.toFixed(2)} ${departure.ticketCurrency}`;
  }

  if (departure.ticketCurrency === returnFlight.ticketCurrency) {
    return `${(depPrice + retPrice).toFixed(2)} ${departure.ticketCurrency}`;
  }

  return `${depPrice.toFixed(2)} ${departure.ticketCurrency} + ${retPrice.toFixed(2)} ${returnFlight.ticketCurrency}`;
};

function TravelerPage() {
  const { data: profile } = useGetUserQuery();

  const [selectFlight, { isLoading }] = useLazySelectFlightQuery();
  const [createReservation] = useCreateReservationMutation();

  const [departureFlights, setDepartureFlights] = useState<Flight[]>([]);
  const [returnFlights, setReturnFlights] = useState<Flight[]>([]);

  const [departureExpanded, setDepartureExpanded] = useState(false);
  const [returnExpanded, setReturnExpanded] = useState(false);

  const [selectedDepartureFlight, setSelectedDepartureFlight] =
    useState<Flight | null>(null);
  const [selectedReturnFlight, setSelectedReturnFlight] =
    useState<Flight | null>(null);

  const [tripType, setTripType] = useState<TripType | null>(null);
  const [passengersCount, setPassengersCount] = useState<number>(1);
  const [isBooking, setIsBooking] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const confirmLock = useRef(false);

  const resetBooking = () => {
    confirmLock.current = false;
    setIsBooking(false);
    setIsConfirmed(false);
    setBookingError(null);
  };

  const handleFlightSearch = async (values: FlightSearchRequest) => {
    try {
      const response = await selectFlight(values).unwrap();

      setDepartureFlights(response.departureFlights);
      setReturnFlights(response.returnFlights);
      setDepartureExpanded(false);
      setReturnExpanded(false);

      setSelectedDepartureFlight(null);
      setSelectedReturnFlight(null);
      resetBooking();

      setTripType(values.tripType);
      const totalPassengers =
        (Number(values.adults) || 0) +
        (Number(values.children) || 0) +
        (Number(values.infants) || 0);
      setPassengersCount(totalPassengers || 1);

      message.success("The flights were successfully found.");
    } catch (error) {
      setDepartureFlights([]);
      setReturnFlights([]);

      setSelectedDepartureFlight(null);
      setSelectedReturnFlight(null);
      resetBooking();

      message.error("there is no appropriate flights");
      console.log(error);
    }
  };

  const handleSelectedDeparture = (flight: Flight) => {
    if (!isSameFlight(selectedDepartureFlight, flight)) {
      resetBooking();
    }

    setSelectedDepartureFlight(flight);

    message.success("The departure flight has been selected.");
  };

  const handleSelectReturn = (flight: Flight) => {
    if (!isSameFlight(selectedReturnFlight, flight)) {
      resetBooking();
    }

    setSelectedReturnFlight(flight);

    message.success("The return flight has been selected.");
  };

  const isSelectionComplete =
    !!selectedDepartureFlight &&
    (tripType === "oneWay" || !!selectedReturnFlight);

  const handleConfirmBooking = async () => {
    if (confirmLock.current || isBooking || isConfirmed) {
      return;
    }

    if (!isSelectionComplete || !selectedDepartureFlight?.id) {
      const text = "Select the required flights before booking.";
      setBookingError(text);
      message.error(text);
      return;
    }

    if (tripType === "roundTrip" && !selectedReturnFlight?.id) {
      const text = "Select a return flight before booking.";
      setBookingError(text);
      message.error(text);
      return;
    }

    confirmLock.current = true;
    setBookingError(null);
    setIsBooking(true);

    try {
      const payload: CreateReservationRequest = {
        departureFlightId: selectedDepartureFlight.id,
        returnFlightId: selectedReturnFlight?.id ?? null,
        tripType: tripType ?? "oneWay",
        passengersCount,
      };

      const response = await createReservation(payload).unwrap();

      setIsConfirmed(true);
      message.success(response.message || "Your trip is confirmed.");
    } catch (error: unknown) {
      confirmLock.current = false;
      setIsConfirmed(false);
      let text = "Could not confirm the booking. Please try again.";
      if (
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        typeof (error as { data: { message?: string } }).data?.message ===
          "string"
      ) {
        text = (error as { data: { message: string } }).data.message;
      }
      setBookingError(text);
      message.error(text);
      console.error(error);
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div
      className={`travelerPageWrapper${isSelectionComplete ? " hasStickySummary" : ""}`}
    >
      <div className="travelerContentWrapper">
        <AppHeader />

        <WelcomeText name={profile?.name} role={profile?.role} />

        <ReservationsList />

        <FlightSearchForm onSearch={handleFlightSearch} />

        {isLoading && (
          <Typography.Text>Searching for flights...</Typography.Text>
        )}

        {departureFlights.length > 0 && (
          <Collapse
            className="flightRouteCollapse"
            activeKey={departureExpanded ? ["departure"] : []}
            onChange={(keys) => {
              const active = Array.isArray(keys) ? keys : [keys];
              setDepartureExpanded(active.includes("departure"));
            }}
            ghost
            collapsible="header"
            expandIcon={() => null}
            items={[
              {
                key: "departure",
                label: (
                  <FlightRouteHeader
                    title="Departure flights"
                    departure={departureFlights[0].departureDestination}
                    arrival={departureFlights[0].arrivalDestination}
                    count={departureFlights.length}
                    isExpanded={departureExpanded}
                  />
                ),
                children: (
                  <div className="flightCardsStack">
                    {departureFlights.map((flight, index) => (
                      <FlightInfoCard
                        key={
                          flight.id ||
                          `${flight.departureDestination}-${flight.arrivalDestination}-${index}`
                        }
                        flight={flight}
                        selected={isSameFlight(selectedDepartureFlight, flight)}
                        onSelect={handleSelectedDeparture}
                      />
                    ))}
                  </div>
                ),
              },
            ]}
          />
        )}

        {tripType === "roundTrip" && returnFlights.length > 0 && (
          <Collapse
            className="flightRouteCollapse"
            activeKey={returnExpanded ? ["return"] : []}
            onChange={(keys) => {
              const active = Array.isArray(keys) ? keys : [keys];
              setReturnExpanded(active.includes("return"));
            }}
            ghost
            collapsible="header"
            expandIcon={() => null}
            items={[
              {
                key: "return",
                label: (
                  <FlightRouteHeader
                    title="Return flights"
                    departure={returnFlights[0].departureDestination}
                    arrival={returnFlights[0].arrivalDestination}
                    count={returnFlights.length}
                    isExpanded={returnExpanded}
                  />
                ),
                children: (
                  <div className="flightCardsStack">
                    {returnFlights.map((flight, index) => (
                      <FlightInfoCard
                        key={
                          flight.id ||
                          `${flight.departureDestination}-${flight.arrivalDestination}-${index}`
                        }
                        flight={flight}
                        selected={isSameFlight(selectedReturnFlight, flight)}
                        onSelect={handleSelectReturn}
                      />
                    ))}
                  </div>
                ),
              },
            ]}
          />
        )}

        {isSelectionComplete && selectedDepartureFlight && (
          <TripSummary
            departureFlight={selectedDepartureFlight}
            returnFlight={selectedReturnFlight}
            passengersCount={passengersCount}
            totalLabel={formatTripTotal(
              selectedDepartureFlight,
              selectedReturnFlight,
              passengersCount,
              tripType,
            )}
            isBooking={isBooking}
            isConfirmed={isConfirmed}
            errorMessage={bookingError}
            onConfirm={handleConfirmBooking}
          />
        )}
      </div>
    </div>
  );
}

export default TravelerPage;
