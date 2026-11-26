import { useState, useRef, useEffect } from "react";

import { Form, DatePicker, Button, Radio, InputNumber } from "antd";
import type { FormInstance } from "antd";
import { UserOutlined, DownOutlined } from "@ant-design/icons";

import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

import DestinationRow from "../DestinationRow/DestinationRow";

import type {
  FlightSearchValues,
  FlightSearchRequest,
  TripType,
} from "../../type";

import "./FlightSearchForm.css";

interface FlightSearchFormProps {
  onSearch: (values: FlightSearchRequest) => void;
}

const FlightSearchForm = ({ onSearch }: FlightSearchFormProps) => {
  const [form] = Form.useForm<FlightSearchValues>();

  const [tripType, setTripType] = useState<TripType>("roundTrip");
  const [passengerOpen, setPassengerOpen] = useState(false);

  const passengerDropdownRef = useRef<HTMLDivElement>(null);

  const departureDate = Form.useWatch("departureDate", form);
  const adults = Form.useWatch("adults", form) ?? 1;
  const children = Form.useWatch("children", form) ?? 0;
  const infants = Form.useWatch("infants", form) ?? 0;

  const totalPassengers = (adults || 0) + (children || 0) + (infants || 0);
  const passengerLabel = `${totalPassengers} Passenger${totalPassengers !== 1 ? "s" : ""}`;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        passengerDropdownRef.current &&
        !passengerDropdownRef.current.contains(e.target as Node)
      ) {
        setPassengerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTripChange = (value: TripType) => {
    setTripType(value);

    if (value === "oneWay") {
      form.setFieldValue("returnDate", undefined);
    }
  };

  const handleSubmit = (values: FlightSearchValues) => {
    const searchData: FlightSearchRequest = {
      departureDestination: values.departureDestination,
      arrivalDestination: values.arrivalDestination,

      departureDate: values.departureDate.format("YYYY-MM-DD"),

      returnDate:
        tripType === "roundTrip" && values.returnDate
          ? values.returnDate.format("YYYY-MM-DD")
          : undefined,

      tripType,

      adults: values.adults,
      children: values.children,
      infants: values.infants,
    };

    onSearch(searchData);
  };

  return (
    <Form<FlightSearchValues>
      form={form}
      layout="vertical"
      className="flightSearchForm"
      onFinish={handleSubmit}
      initialValues={{
        tripType: "roundTrip",
        adults: 1,
        children: 0,
        infants: 0,
      }}
      requiredMark={false}
      autoComplete="off"
    >
      <div className="tripTypeSelector">
        <Radio.Group
          value={tripType}
          onChange={(event) => handleTripChange(event.target.value)}
          optionType="button"
          buttonStyle="solid"
          options={[
            { label: "One way", value: "oneWay" },
            { label: "Round trip", value: "roundTrip" },
          ]}
        />
      </div>

      <div className="searchMainRow">
        {/* From / To */}
        <div className="searchSegment destinationSegment">
          <DestinationRow />
        </div>

        {/* Dates */}
        <div className="searchSegment datesSegment">
          <Form.Item
            name="departureDate"
            label="Departure"
            rules={[{ required: true, message: "Select departure date" }]}
          >
            <DatePicker
              size="large"
              className="fullWidth"
              format="DD MMM YYYY"
              disabledDate={(date) => date.isBefore(dayjs(), "day")}
              placeholder="Departure date"
            />
          </Form.Item>

          {tripType === "roundTrip" && (
            <Form.Item
              name="returnDate"
              label="Return"
              dependencies={["departureDate"]}
              rules={[
                { required: true, message: "Select return date" },
                ({ getFieldValue }) => ({
                  validator(_, value: Dayjs | undefined) {
                    const departure = getFieldValue("departureDate");

                    if (
                      !value ||
                      !departure ||
                      !value.isBefore(departure, "day")
                    ) {
                      return Promise.resolve();
                    }

                    return Promise.reject(
                      new Error("Return date cannot be before departure date."),
                    );
                  },
                }),
              ]}
            >
              <DatePicker
                size="large"
                className="fullWidth"
                format="DD MMM YYYY"
                disabledDate={(date) =>
                  date.isBefore(departureDate || dayjs(), "day")
                }
                placeholder="Return date"
              />
            </Form.Item>
          )}
        </div>

        {/* Passengers dropdown */}
        <div
          className="searchSegment passengersSegment"
          ref={passengerDropdownRef}
        >
          <div className="passengerTriggerLabel">Passengers</div>
          <button
            type="button"
            className={`passengerTrigger${passengerOpen ? " open" : ""}`}
            onClick={() => setPassengerOpen((v) => !v)}
            aria-expanded={passengerOpen}
            aria-haspopup="true"
          >
            <UserOutlined className="passengerTriggerIcon" />
            <span className="passengerTriggerText">{passengerLabel}</span>
            <DownOutlined
              className={`passengerTriggerChevron${passengerOpen ? " rotated" : ""}`}
            />
          </button>

          <div style={{ display: "none" }}>
            <Form.Item name="adults" rules={[{ required: true }]}>
              <InputNumber min={1} max={9} />
            </Form.Item>
            <Form.Item name="children" rules={[{ required: true }]}>
              <InputNumber min={0} max={9} />
            </Form.Item>
            <Form.Item name="infants" rules={[{ required: true }]}>
              <InputNumber min={0} max={9} />
            </Form.Item>
          </div>

          {passengerOpen && (
            <div
              className="passengerDropdown"
              role="dialog"
              aria-label="Passenger selection"
            >
              <PassengerRow
                label="Adults"
                hint="12+ years"
                fieldName="adults"
                min={1}
                max={9}
                form={form}
              />
              <PassengerRow
                label="Children"
                hint="2–11 years"
                fieldName="children"
                min={0}
                max={9}
                form={form}
              />
              <PassengerRow
                label="Infants"
                hint="Under 2 years"
                fieldName="infants"
                min={0}
                max={9}
                form={form}
              />
              <button
                type="button"
                className="passengerDoneBtn"
                onClick={() => setPassengerOpen(false)}
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>

      <Button
        block
        type="primary"
        htmlType="submit"
        size="large"
        className="button searchBtn"
        icon={<i className="fa-solid fa-magnifying-glass" />}
      >
        Search Flights
      </Button>
    </Form>
  );
};

// ── Passenger counter row ─────────────────────────────────────────────────────
interface PassengerRowProps {
  label: string;
  hint: string;
  fieldName: "adults" | "children" | "infants";
  min: number;
  max: number;
  form: FormInstance<FlightSearchValues>;
}

function PassengerRow({
  label,
  hint,
  fieldName,
  min,
  max,
  form,
}: PassengerRowProps) {
  const value: number =
    Form.useWatch(fieldName, form as FormInstance<FlightSearchValues>) ?? min;

  const decrement = () => {
    const next = Math.max(min, value - 1);
    form.setFieldValue(fieldName, next);
  };

  const increment = () => {
    const next = Math.min(max, value + 1);
    form.setFieldValue(fieldName, next);
  };

  return (
    <div className="passengerRow">
      <div className="passengerInfo">
        <span className="passengerType">{label}</span>
        <span className="passengerHint">{hint}</span>
      </div>
      <div className="passengerCounter">
        <button
          type="button"
          className="counterBtn"
          onClick={decrement}
          disabled={value <= min}
          aria-label={`Decrease ${label}`}
        >
          −
        </button>
        <span className="counterValue">{value}</span>
        <button
          type="button"
          className="counterBtn"
          onClick={increment}
          disabled={value >= max}
          aria-label={`Increase ${label}`}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default FlightSearchForm;
