import React from "react";
import { Input, Form } from "antd";
import { pattern } from "framer-motion/client";
import "./commonstyles.css";

export default function CommonInputField({
  label,
  mandotary,
  onChange,
  error,
  placeholder,
  type,
  pattern,
  value,
  name,
  onPressEnter,
  errorMessage,
  prefix,
}) {
  return (
    <div className="commoninputfield">
      <Form.Item
        layout="vertical"
        name={name}
        label={<span style={{ fontWeight: 500 }}>{label}</span>}
        rules={[
          {
            required: mandotary,
          },
        ]}
      >
        <Input
          placeholder={placeholder}
          className={"premium-input"}
          onChange={onChange}
          type={type}
          pattern={pattern}
          value={value}
          prefix={prefix}
          onPressEnter={onPressEnter}
        />
      </Form.Item>
      <div
        className={
          error ? "show-premium-input-error" : "hide-premium-input-error"
        }
      >
        <p style={{ color: "red", marginTop: 4 }}>{label + error}</p>
      </div>
    </div>
  );
}
