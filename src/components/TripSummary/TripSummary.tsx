import { Button } from "antd";
import dayjs from "dayjs";

import type { Flight } from "../../type";

import "./TripSummary.css";

interface TripSummaryProps {
  departureFlight: Flight;
  returnFlight: Flight | null;
  passengersCount: number;
  totalLabel: string;
  isBooking: boolean;
  isConfirmed: boolean;
  errorMessage: string | null;
  onConfirm: () => void;
}

const formatLeg = (flight: Flight) => {
  const departure = dayjs(flight.departureDateAndTime);
  const arrival = dayjs(flight.arrivalDateAndTime);
  const departs = departure.isValid()
    ? departure.format("DD MMM, HH:mm")
    : flight.departureDateAndTime;
  const arrives = arrival.isValid() ? arrival.format("HH:mm") : flight.arrivalDateAndTime;

  return `${flight.departureDestination} → ${flight.arrivalDestination} · ${departs}–${arrives}`;
};

const TripSummary = ({
  departureFlight,
  returnFlight,
  passengersCount,
  totalLabel,
  isBooking,
  isConfirmed,
  errorMessage,
  onConfirm,
}: TripSummaryProps) => {
  const passengerLabel = `${passengersCount} passenger${passengersCount === 1 ? "" : "s"}`;

  return (
    <div className="tripSummaryBar" role="region" aria-label="Trip summary">
      <div className="tripSummaryInner">
        <div className="tripSummaryLegs">
          <p className="tripSummaryLeg">
            <span className="tripSummaryLegLabel">Departure</span>
            <span className="tripSummaryLegValue">{formatLeg(departureFlight)}</span>
          </p>

          <p className="tripSummaryLeg">
            <span className="tripSummaryLegLabel">Return</span>
            <span className="tripSummaryLegValue">
              {returnFlight ? formatLeg(returnFlight) : "One way"}
            </span>
          </p>
        </div>

        <div className="tripSummaryMeta">
          <p className="tripSummaryStat">
            <span className="tripSummaryLegLabel">Passengers</span>
            <span className="tripSummaryStatValue">{passengerLabel}</span>
          </p>
          <p className="tripSummaryStat">
            <span className="tripSummaryLegLabel">Total</span>
            <span className="tripSummaryTotal">{totalLabel}</span>
          </p>
        </div>

        <div className="tripSummaryAction">
          <Button
            type="primary"
            className="button tripSummaryButton"
            onClick={onConfirm}
            loading={isBooking}
            disabled={isBooking || isConfirmed}
          >
            {isConfirmed ? "Confirmed" : "Confirm & Book"}
          </Button>
          {errorMessage && (
            <p className="tripSummaryError" role="alert">
              {errorMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripSummary;
