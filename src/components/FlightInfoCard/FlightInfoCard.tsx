import { Button, Popconfirm } from "antd";
import dayjs from "dayjs";

import type { Flight } from "../../type";
import { DateFormat } from "../../utils/dateFormat";

import "./FlightInfoCard.css";

export type FlightCardData = Partial<Flight> & {
  stops?: number | string | null;
  nonStop?: boolean;
  isNonStop?: boolean;
  direct?: boolean;
  isDirect?: boolean;
};

interface FlightInfoCardProps {
  flight: FlightCardData;
  selected?: boolean;
  onSelect?: (flight: Flight) => void;
  onEdit?: (flight: Flight) => void;
  onDelete?: (flight: Flight) => void;
  isDeleting?: boolean;
}

const formatClock = (value?: string) => {
  if (!value) {
    return { time: "—", date: "Date pending" };
  }

  const parsed = dayjs(value);

  if (!parsed.isValid()) {
    return { time: value, date: "" };
  }

  return {
    time: parsed.format("HH:mm"),
    date: parsed.format(DateFormat.DisplayDate),
  };
};

const formatDuration = (departure?: string, arrival?: string) => {
  if (!departure || !arrival) {
    return null;
  }

  const start = dayjs(departure);
  const end = dayjs(arrival);

  if (!start.isValid() || !end.isValid() || !end.isAfter(start)) {
    return null;
  }

  const minutes = end.diff(start, "minute");
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;

  if (hours === 0) {
    return `${remainder}m`;
  }

  if (remainder === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainder}m`;
};

const readNonStop = (flight: FlightCardData): boolean | null => {
  if (typeof flight.nonStop === "boolean") return flight.nonStop;
  if (typeof flight.isNonStop === "boolean") return flight.isNonStop;
  if (typeof flight.direct === "boolean") return flight.direct;
  if (typeof flight.isDirect === "boolean") return flight.isDirect;

  if (typeof flight.stops === "number" && Number.isFinite(flight.stops)) {
    return flight.stops === 0;
  }

  if (typeof flight.stops === "string" && flight.stops.trim() !== "") {
    const parsed = Number(flight.stops);
    if (!Number.isNaN(parsed)) {
      return parsed === 0;
    }
  }

  return null;
};

const formatFare = (price?: number, currency?: string) => {
  if (typeof price !== "number" || Number.isNaN(price)) {
    return "—";
  }

  const amount = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: Number.isInteger(price) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(price);

  return currency ? `${amount} ${currency}` : amount;
};

const isSelectableFlight = (flight: FlightCardData): flight is Flight => {
  return Boolean(
    flight.departureDestination &&
      flight.arrivalDestination &&
      flight.departureDateAndTime &&
      flight.arrivalDateAndTime &&
      typeof flight.ticketPrice === "number" &&
      flight.ticketCurrency &&
      typeof flight.numberOfSeats === "number",
  );
};

const FlightInfoCard = ({
  flight,
  selected = false,
  onSelect,
  onEdit,
  onDelete,
  isDeleting,
}: FlightInfoCardProps) => {
  const departure = formatClock(flight.departureDateAndTime);
  const arrival = formatClock(flight.arrivalDateAndTime);
  const duration = formatDuration(
    flight.departureDateAndTime,
    flight.arrivalDateAndTime,
  );
  const nonStop = readNonStop(flight);
  const departureCity = flight.departureDestination?.trim() || "";
  const arrivalCity = flight.arrivalDestination?.trim() || "";
  const canSelect = Boolean(onSelect) && isSelectableFlight(flight);

  return (
    <article className={`flightCard${selected ? " isSelected" : ""}`}>
      <div className="flightCardTop">
        <p className="flightRouteLabel">
          <span className={departureCity ? undefined : "isPlaceholder"}>
            {departureCity || "Departure"}
          </span>
          <span className="flightRouteArrow" aria-hidden="true">
            →
          </span>
          <span className={arrivalCity ? undefined : "isPlaceholder"}>
            {arrivalCity || "Arrival"}
          </span>
        </p>

        {selected && <span className="flightSelectedBadge">Selected</span>}
      </div>

      <div className="flightSchedule">
        <div className="flightEndpoint">
          <span className="flightClock">{departure.time}</span>
          <span
            className={`flightDate${departure.date === "Date pending" ? " isPlaceholder" : ""}`}
          >
            {departure.date}
          </span>
          <span
            className={`flightCity${departureCity ? "" : " isPlaceholder"}`}
          >
            {departureCity || "City"}
          </span>
        </div>

        <div className="flightTimeline">
          <div className="flightTimelineTrack" aria-hidden="true">
            <i className="fa-solid fa-plane flightTimelinePlane" />
          </div>
          {duration && <span className="flightDuration">{duration}</span>}
          {nonStop === true && <span className="flightNonStop">Non-stop</span>}
        </div>

        <div className="flightEndpoint flightEndpointArrival">
          <span className="flightClock">{arrival.time}</span>
          <span
            className={`flightDate${arrival.date === "Date pending" ? " isPlaceholder" : ""}`}
          >
            {arrival.date}
          </span>
          <span className={`flightCity${arrivalCity ? "" : " isPlaceholder"}`}>
            {arrivalCity || "City"}
          </span>
        </div>
      </div>

      <div className="flightCardFooter">
        <div className="flightPriceBlock">
          <span className="flightPriceLabel">Fare</span>
          <span className="flightPrice">
            {formatFare(flight.ticketPrice, flight.ticketCurrency)}
          </span>
          {typeof flight.numberOfSeats === "number" && (
            <span className="flightSeatsInfo">
              {flight.numberOfSeats} seat
              {flight.numberOfSeats === 1 ? "" : "s"} available
            </span>
          )}
        </div>

        {canSelect && onSelect && (
          <Button
            type={selected ? "default" : "primary"}
            className="flightSelectButton"
            aria-pressed={selected}
            onClick={() => onSelect(flight)}
          >
            {selected ? "Selected" : "Select the flight"}
          </Button>
        )}

        {(onEdit || onDelete) && isSelectableFlight(flight) && (
          <div className="flightCardActions">
            {onEdit && (
              <Button
                type="default"
                className="flightActionButton flightEditButton"
                onClick={() => onEdit(flight)}
              >
                Edit
              </Button>
            )}

            {onDelete && (
              <Popconfirm
                title="Delete Flight"
                description="Are you sure you want to delete this flight?"
                onConfirm={() => onDelete(flight)}
                okText="Yes, Delete"
                cancelText="No"
                okButtonProps={{ danger: true }}
              >
                <Button
                  danger
                  className="flightActionButton flightDeleteButton"
                  loading={isDeleting}
                >
                  Delete
                </Button>
              </Popconfirm>
            )}
          </div>
        )}
      </div>
    </article>
  );
};

export default FlightInfoCard;
