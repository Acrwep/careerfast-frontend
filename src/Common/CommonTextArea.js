import React from "react";
import TextArea from "antd/es/input/TextArea";
import { label, style } from "framer-motion/client";
import { message, Form } from "antd";
export default function CommonTextArea({
  placeholder,
  name,
  mandatory,
  value,
  label,
  error,
  onChange,
  clasname = "premium-input",
  text,
  style,
}) {
  return (
    <div className="commontextarea">
      <Form.Item
        layout="vertical"
        label={
          <span>
            {mandatory ? <span style={{ color: "red" }}>* </span> : ""}
            {label}
          </span>
        }
      >
        <TextArea
          style={style}
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          mandatory={mandatory}
          value={value}
          className="premium-input"
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
