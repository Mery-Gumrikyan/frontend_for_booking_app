import { useState, useRef, useEffect, useCallback } from "react";
import {
  Button,
  Empty,
  Spin,
  Alert,
  List,
  Typography,
  Modal,
  Form,
  DatePicker,
  InputNumber,
  Select,
  message,
} from "antd";
import dayjs from "dayjs";
import { DownOutlined, UpOutlined, LoadingOutlined } from "@ant-design/icons";

import {
  useLazyGetMyFlightsQuery,
  useEditFlightMutation,
  useDeleteFlightMutation,
} from "../../store/flightApi";
import FlightInfoCard from "../../components/FlightInfoCard/FlightInfoCard";
import DestinationRow from "../../components/DestinationRow/DestinationRow";
import type { Flight, FlightFormValues, EditFlightRequest } from "../../type";
import { DateFormat } from "../../utils/dateFormat";

import "./flightsList.css";

const { Title } = Typography;

const BATCH_SIZE = 10;

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "object" && error !== null && "data" in error) {
    const data = error.data;

    if (
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof data.message === "string"
    ) {
      return data.message;
    }
  }

  return "An unexpected error occurred. Please try again.";
};

const FlightList = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [editingFlight, setEditingFlight] = useState<Flight | null>(null);
  const [deletingFlightId, setDeletingFlightId] = useState<number | null>(null);

  
  const [flights, setFlights] = useState<Flight[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

 
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const isRequestInProgress = useRef(false);

  const [form] = Form.useForm<FlightFormValues>();

  
  const [fetchFlights, { isFetching, error: queryError }] =
    useLazyGetMyFlightsQuery();

  const [editFlight, { isLoading: isEditing }] = useEditFlightMutation();
  const [deleteFlight] = useDeleteFlightMutation();

  
  const loadPage = useCallback(
    async (pageToLoad: number) => {
      if (isRequestInProgress.current) return;
      isRequestInProgress.current = true;

      if (pageToLoad > 1) {
        setIsLoadingMore(true);
      }

      try {
        const response = await fetchFlights({
          page: pageToLoad,
          limit: BATCH_SIZE,
        }).unwrap();

        const newFlights = response.flights ?? [];
        const total = response.total ?? newFlights.length;
        const more = response.hasMore ?? pageToLoad * BATCH_SIZE < total;

        setTotalCount(total);
        setHasMore(more);
        setPage(pageToLoad);

        if (pageToLoad === 1) {
          setFlights(newFlights);
        } else {
          
          setFlights((prev) => {
            const existingIds = new Set(prev.map((f) => f.id));
            const uniqueIncoming = newFlights.filter(
              (f) => !existingIds.has(f.id),
            );
            return [...prev, ...uniqueIncoming];
          });
        }
      } catch (err) {
        console.error("Failed to fetch flights page:", err);
      } finally {
        setIsLoadingMore(false);
        isRequestInProgress.current = false;
      }
    },
    [fetchFlights],
  );

 
  useEffect(() => {
    let ignore = false;

    const fetchInitial = async () => {
      if (ignore) return;
      await loadPage(1);
    };

    fetchInitial();

    return () => {
      ignore = true;
    };
  }, [loadPage]);

  
  const loadNextPage = useCallback(() => {
    if (isRequestInProgress.current || !hasMore || isLoadingMore) {
      return;
    }
    loadPage(page + 1);
  }, [hasMore, isLoadingMore, loadPage, page]);

  
  useEffect(() => {
    const sentinel = sentinelRef.current;
    const container = containerRef.current;
    if (!sentinel || !container || !hasMore || !isVisible) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadNextPage();
        }
      },
      {
        root: container,
        rootMargin: "80px",
        threshold: 0.1,
      },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isVisible, loadNextPage]);

  
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!hasMore || isRequestInProgress.current || isLoadingMore) return;
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight <= 80) {
      loadNextPage();
    }
  };

  const handleToggle = () => {
    setIsVisible((prev) => !prev);
  };

  const handleOpenEdit = (flight: Flight) => {
    setEditingFlight(flight);
    form.setFieldsValue({
      departureDestination: flight.departureDestination,
      arrivalDestination: flight.arrivalDestination,
      departureDateAndTime: dayjs(flight.departureDateAndTime),
      arrivalDateAndTime: dayjs(flight.arrivalDateAndTime),
      ticketPrice: flight.ticketPrice,
      ticketCurrency: flight.ticketCurrency,
      numberOfSeats: flight.numberOfSeats,
    });
  };

  const handleCloseEdit = () => {
    setEditingFlight(null);
    form.resetFields();
  };

  const handleSaveEdit = async (values: FlightFormValues) => {
    if (!editingFlight?.id) return;

    const payload: EditFlightRequest = {
      id: editingFlight.id,
      departureDestination: values.departureDestination,
      arrivalDestination: values.arrivalDestination,
      departureDateAndTime: values.departureDateAndTime.format(
        DateFormat.IsoDateTime,
      ),
      arrivalDateAndTime: values.arrivalDateAndTime.format(
        DateFormat.IsoDateTime,
      ),
      ticketPrice: values.ticketPrice,
      ticketCurrency: values.ticketCurrency,
      numberOfSeats: values.numberOfSeats,
    };

    try {
      const res = await editFlight(payload).unwrap();
      message.success("Flight updated successfully!");
      if (res.flight) {
        setFlights((prev) =>
          prev.map((f) => (f.id === res.flight.id ? res.flight : f)),
        );
      }
      handleCloseEdit();
    } catch (err: unknown) {
      message.error(getErrorMessage(err));
    }
  };

  const handleDelete = async (flight: Flight) => {
    if (!flight.id) return;
    setDeletingFlightId(flight.id);

    try {
      await deleteFlight(flight.id).unwrap();
      message.success("Flight deleted successfully!");
     
      setFlights((prev) => prev.filter((f) => f.id !== flight.id));
      setTotalCount((prev) => Math.max(0, prev - 1));
    } catch (err: unknown) {
      message.error(getErrorMessage(err));
    } finally {
      setDeletingFlightId(null);
    }
  };

  return (
    <div className="flightList">
      <Button
        block
        className={`flightListToggleBtn${isVisible ? " isExpanded" : ""}`}
        onClick={handleToggle}
      >
        <div>
          <span>
            {isVisible
              ? "Hide My Flights"
              : totalCount > 0
                ? `My Flights (${totalCount})`
                : "My Flights"}
          </span>
          {totalCount > 0 && !isVisible && (
            <span className="flightCountBadge">{totalCount}</span>
          )}
        </div>

        <div className="upDownIcon">
          {isVisible ? <UpOutlined /> : <DownOutlined />}
        </div>
      </Button>

      {isVisible && (
        <div className="myFlightsContent">
          <div className="myFlightsHeader">
            <Title level={4} className="myFlightsTitle">
              My Created Flights
            </Title>
            <span className="myFlightsSubtitle">
              {totalCount > BATCH_SIZE
                ? `Showing ${flights.length} of ${totalCount}`
                : `${totalCount} ${totalCount === 1 ? "flight" : "flights"}`}
            </span>
          </div>

          {isFetching && flights.length === 0 ? (
            <div className="myFlightsLoading">
              <Spin />
            </div>
          ) : queryError && flights.length === 0 ? (
            <Alert type="error" description="Failed to load flights" showIcon />
          ) : flights.length > 0 ? (
            <div
              className="myFlightsListContainer"
              ref={containerRef}
              onScroll={handleScroll}
            >
              <List
                className="myFlightsList"
                grid={{
                  gutter: [0, 12],
                  xs: 1,
                  sm: 1,
                  md: 1,
                  lg: 1,
                  xl: 1,
                  xxl: 1,
                }}
                dataSource={flights}
                rowKey={(flight) => String(flight.id)}
                renderItem={(flight) => (
                  <List.Item style={{ padding: 0, marginBottom: 0 }}>
                    <FlightInfoCard
                      flight={flight}
                      onEdit={handleOpenEdit}
                      onDelete={handleDelete}
                      isDeleting={deletingFlightId === flight.id}
                    />
                  </List.Item>
                )}
              />

              {/* Sentinel element to trigger intersection observer at the bottom */}
              <div ref={sentinelRef} className="myFlightsSentinel" />

              {/* Incremental loading indicator shown when reaching end and fetching next batch */}
              {isLoadingMore && (
                <div className="myFlightsLoadingMore">
                  <Spin indicator={<LoadingOutlined spin />} size="small" />
                  <span>Loading next 10 flights...</span>
                </div>
              )}

              {/* End of list confirmation when all items loaded */}
              {!isLoadingMore && !hasMore && totalCount > BATCH_SIZE && (
                <div className="myFlightsAllLoaded">
                  <span>All {totalCount} flights loaded</span>
                </div>
              )}
            </div>
          ) : (
            <Empty
              className="myFlightsEmpty"
              description="No flights created yet"
            />
          )}
        </div>
      )}

      {/* Edit Flight Modal */}
      <Modal
        title={`Edit Flight #${editingFlight?.id ?? ""}`}
        open={Boolean(editingFlight)}
        onCancel={handleCloseEdit}
        footer={null}
        destroyOnHidden
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveEdit}
          style={{ marginTop: "1rem" }}
        >
          <Form.Item
            label={
              <span className="flightFormLabel">
                Departure and Arrival Cities
              </span>
            }
            required
            noStyle
          >
            <DestinationRow />
          </Form.Item>

          <div className="editFlightRow">
            <Form.Item
              name="departureDateAndTime"
              label={
                <span className="flightFormLabel">Departure Date and Time</span>
              }
              rules={[
                {
                  required: true,
                  message: "Please select departure date and time",
                },
              ]}
            >
              <DatePicker
                showTime
                style={{ width: "100%" }}
                disabledDate={(current) =>
                  current && current.isBefore(dayjs(), "day")
                }
              />
            </Form.Item>

            <Form.Item
              name="arrivalDateAndTime"
              label={
                <span className="flightFormLabel">Arrival Date and Time</span>
              }
              dependencies={["departureDateAndTime"]}
              rules={[
                {
                  required: true,
                  message: "Please select arrival date and time",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const departure = getFieldValue("departureDateAndTime");

                    if (!value || !departure || value.isAfter(departure)) {
                      return Promise.resolve();
                    }

                    return Promise.reject(
                      new Error(
                        "The arrival time must be later than the departure time.",
                      ),
                    );
                  },
                }),
              ]}
            >
              <DatePicker
                showTime
                style={{ width: "100%" }}
                disabledDate={(current) =>
                  current && current.isBefore(dayjs(), "day")
                }
              />
            </Form.Item>
          </div>

          <div className="editFlightRow" style={{ marginTop: 0 }}>
            <Form.Item
              name="ticketPrice"
              label={<span className="flightFormLabel">Ticket Price</span>}
              rules={[
                { required: true, message: "Please enter ticket price" },
                { type: "number", min: 0.01 },
              ]}
            >
              <InputNumber
                min={0.01}
                precision={2}
                placeholder="0.00"
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item
              name="ticketCurrency"
              label={<span className="flightFormLabel">Ticket Currency</span>}
              rules={[{ required: true, message: "Please select currency" }]}
            >
              <Select
                placeholder="Select Currency"
                options={[
                  {
                    value: "USD",
                    label: "USD",
                  },
                  {
                    value: "AMD",
                    label: "AMD",
                  },
                ]}
              />
            </Form.Item>
          </div>

          <Form.Item
            name="numberOfSeats"
            label={<span className="flightFormLabel">Number of Seats</span>}
            rules={[
              { required: true, message: "Please enter number of seats" },
              { type: "number", min: 1 },
            ]}
          >
            <InputNumber
              min={1}
              precision={0}
              placeholder="0"
              step={1}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <div className="editFlightActions">
            <Button onClick={handleCloseEdit}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={isEditing}>
              Save Changes
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default FlightList;
