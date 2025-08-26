import React, { useState } from "react";
import { Typography, Button, Collapse, Card, Tag, Divider } from "antd";
import {
  CrownOutlined,
  ArrowRightOutlined,
  CheckOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import Header from "../Header/Header";

const { Title, Text } = Typography;
const { Panel } = Collapse;

const ProSubscription = () => {
  const [activePanel, setActivePanel] = useState(null);

  const features = [
    "Priority support",
    "Advanced analytics",
    "Exclusive templates",
    "Early access to features",
    "Custom branding",
  ];

  // Animation styles
  const fadeIn = {
    animation: "fadeIn 0.5s ease-out",
    "@keyframes fadeIn": {
      from: { opacity: 0, transform: "translateY(10px)" },
      to: { opacity: 1, transform: "translateY(0)" },
    },
  };

  const pulse = {
    animation: "pulse 2s infinite",
    "@keyframes pulse": {
      "0%": { boxShadow: "0 0 0 0 rgba(108, 62, 245, 0.4)" },
      "70%": { boxShadow: "0 0 0 10px rgba(108, 62, 245, 0)" },
      "100%": { boxShadow: "0 0 0 0 rgba(108, 62, 245, 0)" },
    },
  };

  return (
    <>
      <Header />
      <Card
        style={{
          borderRadius: "0px 0px 16px 16px",
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          transition: "all 0.3s ease",
          ...fadeIn,
          border: "none",
          ":hover": {
            transform: "translateY(-3px)",
            boxShadow: "0 8px 25px rgba(0, 0, 0, 0.12)",
          },
        }}
      >
        {/* Section Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <CrownOutlined style={{ fontSize: 24, color: "#6c3ef5" }} />
            <Title level={4} style={{ margin: 0, fontWeight: 600 }}>
              Careerfast Pro Subscription
            </Title>
          </div>
          <Divider style={{ margin: "16px 0", borderColor: "#f0f0f0" }} />
        </div>

        {/* Subscription Status Card */}
        <div
          style={{
            background: "linear-gradient(135deg, #f9f5ff, #f0ebff)",
            borderRadius: 12,
            padding: 20,
            marginBottom: 24,
            border: "1px solid #e9e0ff",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -20,
              right: -20,
              width: 100,
              height: 100,
              background:
                "radial-gradient(circle, rgba(108,62,245,0.1) 0%, rgba(108,62,245,0) 70%)",
              borderRadius: "50%",
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #6c3ef5, #8a5ff7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: 24,
                  fontWeight: 600,
                }}
              >
                <CrownOutlined />
              </div>
              <div style={{ textAlign: "left" }}>
                <Text strong style={{ display: "block", fontSize: 16 }}>
                  No Active Subscription
                </Text>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  Upgrade to unlock premium features and tools
                </Text>
              </div>
            </div>

            <Button
              type="primary"
              shape="round"
              icon={<ThunderboltOutlined />}
              style={{
                height: 44,
                padding: "0 24px",
                fontWeight: 600,
                letterSpacing: "0.5px",
                transition: "all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)",
                background: "linear-gradient(135deg, #6c3ef5, #8a5ff7)",
                border: "none",
              }}
            >
              Go Pro Now <ArrowRightOutlined style={{ marginLeft: 8 }} />
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div style={{ marginBottom: 24 }}>
          <Text
            strong
            style={{ display: "block", marginBottom: 12, textAlign: "left" }}
          >
            Pro Features:
          </Text>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {features.map((feature, index) => (
              <Tag
                key={index}
                icon={<CheckOutlined style={{ color: "#6c3ef5" }} />}
                style={{
                  margin: 4,
                  borderRadius: 20,
                  padding: "0 12px",
                  height: 28,
                  lineHeight: "28px",
                  fontSize: 12,
                  background: "rgba(108, 62, 245, 0.1)",
                  color: "#6c3ef5",
                  border: "none",
                }}
              >
                {feature}
              </Tag>
            ))}
          </div>
        </div>

        {/* Payment History Dropdown */}
        <Collapse
          bordered={false}
          expandIconPosition="right"
          activeKey={activePanel}
          onChange={(key) => setActivePanel(key.length > 0 ? key : null)}
          style={{
            background: "#faf9ff",
            borderRadius: 12,
            border: "1px solid #f0ebff",
          }}
        >
          <Panel
            header={
              <Text strong style={{ color: activePanel ? "#fff" : "inherit" }}>
                View Payment History
              </Text>
            }
            key="1"
            style={{
              border: "none",
              borderRadius: 12,
              padding: "0px 0px 0px 0",
            }}
          >
            <div
              style={{
                padding: 16,
                background: "#fff",
                borderRadius: 8,
                border: "1px dashed #f0f0f0",
              }}
            >
              <Text type="secondary">No payment history available</Text>
            </div>
          </Panel>
        </Collapse>
      </Card>
    </>
  );
};

export default ProSubscription;
