import { Form, Select } from "antd";
import type { Rule } from "antd/es/form";

const cities = ["Yerevan", "Moscow", "Tabriz", "Paris"];
import "./DestinationRow.css";

const createCityOptions = (icon: string) =>
  cities.map((city) => ({
    value: city,
    label: (
      <div className="customOption">
        <i className={`fa-solid ${icon} destinationCityIcon`} />
        {city}
      </div>
    ),
  }));

const departureOptions = createCityOptions("fa-plane-departure");
const arrivalOptions = createCityOptions("fa-plane-arrival");

const arrivalValidationRule: Rule = ({ getFieldValue }) => ({
  validator(_, value) {
    const departure = getFieldValue("departureDestination");

    if (!value || value !== departure) {
      return Promise.resolve();
    }

    return Promise.reject(
      new Error("Departure and arrival cities must be different."),
    );
  },
});

const DestinationRow = () => {
  return (
    <div className="destinationRow">
      <Form.Item
        name="departureDestination"
        label="From"
        rules={[{ required: true, message: "Please select a departure city." }]}
        className="flightFormField"
      >
        <Select
          showSearch={{ optionFilterProp: "label" }}
          placeholder="Select city"
          options={departureOptions}
          variant="borderless"
        />
      </Form.Item>

      <Form.Item
        name="arrivalDestination"
        label="To"
        className="flightFormField"
        dependencies={["departureDestination"]}
        rules={[
          { required: true, message: "Please select an arrival city." },
          arrivalValidationRule,
        ]}
      >
        <Select
          placeholder="Select city"
          showSearch={{ optionFilterProp: "label" }}
          options={arrivalOptions}
          variant="borderless"
        />
      </Form.Item>
    </div>
  );
};

export default DestinationRow;
