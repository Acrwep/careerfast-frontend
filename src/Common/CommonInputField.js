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
  readOnly,
  disabled,
}) {
  return (
    <div className="commoninputfield">
      <div style={{ display: "flex" }}>
        <p style={{ color: "black" }}>
          <span style={{ color: "red" }}>{mandotary === true ? "*" : ""}</span>{" "}
          {label}
        </p>
      </div>
      <Input
        name={name}
        placeholder={placeholder}
        className={"premium-input"}
        onChange={onChange}
        type={type}
        pattern={pattern}
        value={value}
        readOnly={readOnly}
        disabled={disabled}
        prefix={prefix}
        onPressEnter={onPressEnter}
      />
      <div
        className={
          error ? "show-premium-input-error" : "hide-premium-input-error"
        }
      >
        <p style={{ color: "red", marginTop: 4, fontSize: 13 }}>
          {label + error}
        </p>
      </div>
    </div>
  );
}
