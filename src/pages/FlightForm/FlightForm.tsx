import {
  Form,
  Select,
  DatePicker,
  InputNumber,
  Button,
  Typography,
  message,
} from "antd";
import dayjs from "dayjs";

import "./flightForm.css";
import DestinationRow from "../../components/DestinationRow/DestinationRow";

import type { FlightFormValues } from "../../type";
import type { Dayjs } from "dayjs";
import { DateFormat } from "../../utils/dateFormat";

import { useAddFlightMutation } from "../../store/flightApi";
import FlightInfoCard from "../../components/FlightInfoCard/FlightInfoCard";
import type { FlightCardData } from "../../components/FlightInfoCard/FlightInfoCard";
import FlightList from "../FlightsList/FlightList";

const { Title } = Typography;

const toPreviewDate = (value?: Dayjs) => {
  if (!value || !dayjs.isDayjs(value) || !value.isValid()) {
    return undefined;
  }

  return value.format(DateFormat.IsoDateTime);
};

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

  return "Failed to add flight. Please try again.";
};

const FlightForm = () => {
  const [addFlight, { isLoading }] = useAddFlightMutation();

  const [form] = Form.useForm<FlightFormValues>();

  const departureDestination = Form.useWatch("departureDestination", form);
  const arrivalDestination = Form.useWatch("arrivalDestination", form);
  const departureDateAndTime = Form.useWatch("departureDateAndTime", form);
  const arrivalDateAndTime = Form.useWatch("arrivalDateAndTime", form);
  const ticketPrice = Form.useWatch("ticketPrice", form);
  const ticketCurrency = Form.useWatch("ticketCurrency", form);
  const numberOfSeats = Form.useWatch("numberOfSeats", form);

  const previewFlight: FlightCardData = {
    departureDestination: departureDestination || undefined,
    arrivalDestination: arrivalDestination || undefined,
    departureDateAndTime: toPreviewDate(departureDateAndTime),
    arrivalDateAndTime: toPreviewDate(arrivalDateAndTime),
    ticketPrice: typeof ticketPrice === "number" ? ticketPrice : undefined,
    ticketCurrency: ticketCurrency || undefined,
    numberOfSeats:
      typeof numberOfSeats === "number" ? numberOfSeats : undefined,
  };

  const onFinish = async (values: FlightFormValues) => {
    const flight = {
      ...values,
      departureDateAndTime: values.departureDateAndTime.format(
        DateFormat.IsoDateTime,
      ),
      arrivalDateAndTime: values.arrivalDateAndTime.format(
        DateFormat.IsoDateTime,
      ),
    };

    try {
      await addFlight(flight).unwrap();

      message.success("Flight added successfully!");

      form.resetFields();
    } catch (error: unknown) {
      message.error(getErrorMessage(error));

      console.error(error);
    }
  };

  return (
    <div className="flightCreator">
      <Form
        form={form}
        className="flightForm"
        onFinish={onFinish}
        layout="vertical"
      >
        <Title level={3}>Create a New Flight</Title>
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

        <div className="departureAndArrivalDate">
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
              variant="borderless"
              className="flightFormField"
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
              variant="borderless"
              className="flightFormField"
              disabledDate={(current) =>
                current && current.isBefore(dayjs(), "day")
              }
            />
          </Form.Item>
        </div>

        <div className="ticketPriceAndCurrency">
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
              changeOnWheel={false}
              placeholder="0.00"
              variant="borderless"
              className="flightFormField"
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
                  label: <div className="custom-option">USD</div>,
                },
                {
                  value: "AMD",
                  label: <div className="custom-option">AMD</div>,
                },
              ]}
              variant="borderless"
              className="flightFormField"
            />
          </Form.Item>
        </div>

        <Form.Item
          name="numberOfSeats"
          label={<span className="flightFormLabel">Number of Seats </span>}
          rules={[
            { required: true, message: "Please enter number of seats" },
            { type: "number", min: 1 },
          ]}
        >
          <InputNumber
            min={1}
            precision={0}
            changeOnWheel={false}
            placeholder="0"
            step={1}
            variant="borderless"
            className="flightFormField"
          />
        </Form.Item>

        <Form.Item>
          <Button
            block
            type="primary"
            htmlType="submit"
            loading={isLoading}
            disabled={isLoading}
            className="flightFormButton"
          >
            Add Flight
          </Button>
        </Form.Item>
      </Form>

      <div className="flightSidePanel">
        <aside
          className="flightPreviewPanel"
          aria-label="Live flight card preview"
        >
          <p className="flightPreviewTitle">Live preview</p>
          <p className="flightPreviewHint">
            Travelers see this card. It updates as you edit the form and is not
            saved until you add the flight.
          </p>
          <FlightInfoCard flight={previewFlight} />
        </aside>

        <FlightList />
      </div>
    </div>
  );
};

export default FlightForm;
