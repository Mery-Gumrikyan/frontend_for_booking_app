import { useState } from "react";
import {
  Button,
  Empty,
  Spin,
  Alert,
  List,
  Typography,
  Tag,
  Popconfirm,
  message,
} from "antd";
import dayjs from "dayjs";

import {
  useGetMyReservationsQuery,
  useCancelReservationMutation,
} from "../../store/flightApi";
import type { Reservation } from "../../type";
import { DateFormat } from "../../utils/dateFormat";

import "./ReservationsList.css";

const { Title, Text } = Typography;

const formatDateTime = (value?: string) => {
  if (!value) return "—";
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format(DateFormat.DisplayDateTime) : value;
};

const ReservationsList = () => {
  const { data, isLoading, isFetching, error, refetch } =
    useGetMyReservationsQuery();
  const [cancelReservation, { isLoading: isCancelling }] =
    useCancelReservationMutation();

  const [isCollapsed, setIsCollapsed] = useState(true);

  const reservations = (data?.reservations ?? []).filter(
    (res: Reservation) => res.status === "confirmed",
  );
  const reservationsCount = reservations.length;

  const isVisible = !isCollapsed;

  const handleToggle = () => {
    setIsCollapsed((prev) => !prev);
  };

  const handleCancel = async (id: number) => {
    try {
      const response = await cancelReservation(id).unwrap();
      message.success(response.message || "Reservation cancelled successfully");
      await refetch();
    } catch (err: unknown) {
      let errorMsg = "Failed to cancel reservation";
      if (
        typeof err === "object" &&
        err !== null &&
        "data" in err &&
        typeof (err as { data: { message?: string } }).data?.message ===
          "string"
      ) {
        errorMsg = (err as { data: { message: string } }).data.message;
      }
      message.error(errorMsg);
    }
  };

  return (
    <div className="reservationsSection">
      <Button block className="reservationsToggleBtn" onClick={handleToggle}>
        {isVisible ? "Hide My Bookings" : `My Bookings (${reservationsCount})`}
      </Button>

      {isVisible && (
        <div className="reservationsContent">
          <Title level={4} className="reservationsContentTitle">
            My Booked Trips
          </Title>

          {isLoading || isFetching ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <Spin />
            </div>
          ) : error ? (
            <Alert
              type="error"
              description="Failed to load your reservations"
              showIcon
            />
          ) : reservationsCount > 0 ? (
            <List
              grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
              dataSource={reservations}
              rowKey={(item: Reservation) => String(item.id)}
              renderItem={(res: Reservation) => {
                const isConfirmed = res.status === "confirmed";

                return (
                  <List.Item>
                    <div
                      className={`reservationCard${!isConfirmed ? " isCancelled" : ""}`}
                    >
                      <div className="reservationCardHeader">
                        <span className="reservationId">
                          Booking #RES-{res.id}
                        </span>
                        <Tag color={isConfirmed ? "green" : "default"}>
                          {res.status.toUpperCase()}
                        </Tag>
                      </div>

                      <div className="reservationCardBody">
                        <div className="reservationFlightRow">
                          <span className="reservationRouteBadge">Depart</span>
                          <span>
                            {res.departureFlight?.departureDestination} →{" "}
                            {res.departureFlight?.arrivalDestination}
                          </span>
                          <span className="reservationTimeText">
                            {formatDateTime(
                              res.departureFlight?.departureDateAndTime,
                            )}
                          </span>
                        </div>

                        {res.tripType === "roundTrip" && res.returnFlight && (
                          <div className="reservationFlightRow">
                            <span className="reservationRouteBadge">
                              Return
                            </span>
                            <span>
                              {res.returnFlight.departureDestination} →{" "}
                              {res.returnFlight.arrivalDestination}
                            </span>
                            <span className="reservationTimeText">
                              {formatDateTime(
                                res.returnFlight.departureDateAndTime,
                              )}
                            </span>
                          </div>
                        )}

                        <div className="reservationMetaRow">
                          <div>
                            <Text type="secondary">
                              {res.passengersCount} passenger
                              {res.passengersCount > 1 ? "s" : ""} ·{" "}
                              {res.tripType === "roundTrip"
                                ? "Round Trip"
                                : "One Way"}
                            </Text>
                          </div>
                          <div>
                            <span className="reservationPrice">
                              {res.totalPrice.toFixed(2)} {res.ticketCurrency}
                            </span>
                          </div>
                        </div>

                        <div className="reservationFooter">
                          <span className="reservationDateCreated">
                            Booked on {formatDateTime(res.createdAt)}
                          </span>

                          {isConfirmed && (
                            <Popconfirm
                              title="Cancel this reservation?"
                              description="Are you sure you want to cancel this booking?"
                              onConfirm={() => handleCancel(res.id)}
                              okText="Yes, Cancel"
                              cancelText="No"
                              okButtonProps={{ danger: true }}
                            >
                              <Button
                                danger
                                size="small"
                                loading={isCancelling}
                              >
                                Cancel Booking
                              </Button>
                            </Popconfirm>
                          )}
                        </div>
                      </div>
                    </div>
                  </List.Item>
                );
              }}
            />
          ) : (
            <Empty description="No reservations found. Book a flight above!" />
          )}
        </div>
      )}
    </div>
  );
};

export default ReservationsList;
