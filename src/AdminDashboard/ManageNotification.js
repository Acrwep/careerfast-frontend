import React, { useState } from "react";
import { Divider, Tooltip, Card, Typography, Space, Switch } from "antd";
import { BellOutlined, ClockCircleOutlined } from "@ant-design/icons";

import {
  MdOutlineSend,
  MdOutlineCancel,
  MdOutlinePendingActions,
} from "react-icons/md";
import { BiMessageDetail } from "react-icons/bi";
import { FaClipboardCheck } from "react-icons/fa";
import { AiOutlineClockCircle } from "react-icons/ai";
import styled from "styled-components";

const { Title, Text } = Typography;

const PremiumContainer = styled(Card)`
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  border: none;
  overflow: hidden;

  .ant-card-body {
    padding: 32px;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;

  .anticon {
    font-size: 20px;
    margin-right: 12px;
    color: #722ed1;
  }
`;

const NotificationItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
`;

const NotificationLabel = styled.div`
  display: flex;
  align-items: center;

  .anticon,
  svg {
    color: #8c8c8c;
    margin-right: 8px;
    font-size: 18px;
  }
`;

const ManageNotification = () => {
  const [notificationSettings, setNotificationSettings] = useState({
    applicationAlert: true,
    registrationCancel: true,
    discussionPost: true,
    submission: false,
    dailyDigest: false,
    incompleteReminder: true,
  });

  const handleChange = (key) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <PremiumContainer style={{ margin: 30 }}>
      <Title level={3} style={{ marginBottom: 8 }}>
        Notification Preferences
      </Title>
      <Text type="secondary" style={{ marginBottom: 32, display: "block" }}>
        Customize how and when you receive notifications for this opportunity
      </Text>

      <SectionHeader>
        <BellOutlined />
        <Title level={5} style={{ margin: 0 }}>
          Activity Notifications
        </Title>
      </SectionHeader>

      <Space direction="vertical" style={{ width: "100%", marginBottom: 32 }}>
        <NotificationItem>
          <NotificationLabel>
            <MdOutlineSend />
            <Text>Application Submission Alert</Text>
          </NotificationLabel>
          <Switch
            checked={notificationSettings.applicationAlert}
            onChange={() => handleChange("applicationAlert")}
          />
        </NotificationItem>

        <NotificationItem>
          <NotificationLabel>
            <MdOutlineCancel />
            <Text>Registration Cancellations</Text>
          </NotificationLabel>
          <Switch
            checked={notificationSettings.registrationCancel}
            onChange={() => handleChange("registrationCancel")}
          />
        </NotificationItem>

        <NotificationItem>
          <NotificationLabel>
            <BiMessageDetail />
            <Text>Discussions Post</Text>
          </NotificationLabel>
          <Switch
            checked={notificationSettings.discussionPost}
            onChange={() => handleChange("discussionPost")}
          />
        </NotificationItem>

        <NotificationItem>
          <NotificationLabel>
            <FaClipboardCheck />
            <Text>Submission Notifications</Text>
          </NotificationLabel>
          <Switch
            checked={notificationSettings.submission}
            onChange={() => handleChange("submission")}
          />
        </NotificationItem>

        <NotificationItem>
          <NotificationLabel>
            <AiOutlineClockCircle />
            <Text>Daily Digest</Text>
          </NotificationLabel>
          <Switch
            checked={notificationSettings.dailyDigest}
            onChange={() => handleChange("dailyDigest")}
          />
        </NotificationItem>
      </Space>

      <Divider style={{ margin: "24px 0" }} />

      <SectionHeader>
        <ClockCircleOutlined />
        <Title level={5} style={{ margin: 0 }}>
          Automated Reminders
        </Title>
      </SectionHeader>

      <Space direction="vertical" style={{ width: "100%" }}>
        <NotificationItem>
          <NotificationLabel>
            <Tooltip title="Reminder emails for users who have started but not completed registration">
              <MdOutlinePendingActions style={{ cursor: "pointer" }} />
            </Tooltip>
            <Text style={{ marginLeft: 8 }}>
              Incomplete Registrations Reminder
            </Text>
          </NotificationLabel>
          <Switch
            checked={notificationSettings.incompleteReminder}
            onChange={() => handleChange("incompleteReminder")}
          />
        </NotificationItem>
      </Space>
    </PremiumContainer>
  );
};

export default ManageNotification;
