import React from "react";
import { Form, Select } from "antd";

export default function CommonSelectField({
  label,
  name,
  placeholder,
  mandatory,
  onChange,
  options = [],
  value,
  error,
  errorMessage,
  disabled,
  showSearch,
  optionFilterProp = "children",
  className = "premium-input",
  ...rest
}) {
  return (
    <div className="commonselectfield">
      <Form.Item
        layout="vertical"
        label={<span style={{ fontWeight: 500 }}>{label}</span>}
        name={name}
        rules={[
          {
            required: mandatory,
            message:
              errorMessage || `Please select your ${label?.toLowerCase()}`,
          },
        ]}
      >
        <Select
          styles={{
            popup: {
              root: {
                zIndex: 9999,
              },
            },
          }}
          showSearch={showSearch}
          placeholder={placeholder}
          optionFilterProp={optionFilterProp}
          className={className}
          onChange={onChange}
          value={value}
          disabled={disabled}
          options={options.map((item) => ({
            label: item.label ?? item.name,
            value: item.value ?? item.isoCode ?? item.id ?? item.name,
          }))}
          {...rest}
        />
      </Form.Item>
      <div
        className={
          error ? "show-premium-input-error" : "hide-premium-input-error"
        }
      >
        <p style={{ color: "red" }}>{label + error}</p>
      </div>
    </div>
  );
}
