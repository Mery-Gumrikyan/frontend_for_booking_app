// import { Select, DatePicker, InputNumber, Form, Button, Flex } from "antd";
// import { useEffect } from "react";
// import { useNavigate } from "react-router";

import GoBackPlane from "../../components/GoBackPlane/GoBackPlane";

// import type { FormProps } from "antd";
// import type { Dayjs } from "dayjs";
// import { useSearchFlightsMutation } from "../../store/api";
// import FlightInfoCard from "../../components/FlightInfoCard/FlightInfoCard";
// import FlightDestinationCard from "../../components/FlightDestinationCard/FlightDestinationCard";
// import { DateFormate } from "../../utils/dateFormat";

// interface FieldType {
//   from: string;
//   to: string;
//   departureDate?: Dayjs;
//   arrivalDate?: Dayjs;
//   passengersCount?: number;
// }

function TravelerPage() {
  return (
    <div className="userPageWrapper">
      <GoBackPlane
        onClick={() => {
          localStorage.removeItem("accessToken");
        }}
      />

      <p>welcome to traveler page</p>

      {/* <Form<FieldType> onFinish={onFinish} className="travelerPage">
        <Flex>
          <Form.Item
            name="from"
            rules={[{ required: true, message: "Ընտրեք մեկնման վայրը" }]}
          >
            <Select
              showSearch
              placeholder="Որտեղից"
              size="large"
              options={[
                {
                  value: "Yerevan",
                  label: "Yerevan",
                },
                {
                  value: "Moscow",
                  label: "Moscow",
                },
                {
                  value: "Tabriz",
                  label: "Tabriz",
                },
                {
                  value: "Paris",
                  label: "Paris",
                },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="to"
            rules={[{ required: true, message: "Ընտրեք ժամանման վայրը" }]}
          >
            <Select
              showSearch
              size="large"
              placeholder="Ուր"
              options={[
                {
                  value: "Yerevan",
                  label: "Yerevan",
                },
                {
                  value: "Moscow",
                  label: "Moscow",
                },
                {
                  value: "Tabriz",
                  label: "Tabriz",
                },
                {
                  value: "Paris",
                  label: "Paris",
                },
              ]}
            />
          </Form.Item>
        </Flex>

        <Flex>
          <Form.Item name="departureDate">
            <DatePicker placeholder="մեկնման օրը" size="large" />
          </Form.Item>
          <Form.Item name="arrivalDate">
            <DatePicker placeholder="ժամանման օրը" size="large" />
          </Form.Item>
        </Flex>

        <Form.Item
          name="passengersCount"
          rules={[
            {
              required: true,
              message: "Մուտքագրեք ուղևորների քանակը",
            },
          ]}
        >
          <InputNumber
            size="large"
            min={1}
            max={100}
            placeholder="Ուղևորների քանակը"
          />
        </Form.Item>

        <Form.Item>
          <Button
            block
            type="primary"
            htmlType="submit"
            loading={flightsLoading}
            className="button"
            size="large"
          >
            Փնտրել
          </Button>
        </Form.Item>
      </Form> */}
      {/* 
      {flightsError && <p>Failed to search flights.</p>}

      {flights?.length === 0 && <p>There are no flights found</p>}

      {flights && flights.length > 0 && (
        <FlightDestinationCard flight={flights[0]} />
      )}

      {flights && flights.length > 0 && (
        <div>
          {flights.map((flight) => (
            <FlightInfoCard
              flight={flight}
              key={`${flight.from} ${flight.dateOfFlight} ${flight.timeOfFlight}`}
            />
          ))}
        </div>
      )} */}
    </div>
  );
}

export default TravelerPage;
