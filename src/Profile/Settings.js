import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import {
  Switch,
  Typography,
  Collapse,
  Input,
  Form,
  Button,
  Select,
  message,
  Card,
  Divider,
  Space,
  Tabs,
} from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  BellOutlined,
  LockOutlined,
  UserOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import { motion } from "framer-motion";
import { changePassword } from "../ApiService/action";
import { confirmPasswordValidation, passwordValidator } from "../Common/Validation";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

/* ---------- Premium Styled Components ---------- */
const SettingsContainer = styled(motion.div)`
  padding: 40px;
  background: linear-gradient(145deg, #f8fafc, #f8fafc);
  border-radius: 0 0 24px 24px;
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.08);
`;

const SectionTitle = styled(Title)`
  font-weight: 700 !important;
  margin-bottom: 8px !important;
  font-size: 26px !important;
`;

const SectionDescription = styled(Text)`
  color: #6c6f85;
  font-size: 15px;
  display: block;
  margin-bottom: 28px;
`;

const SettingCard = styled(motion(Card))`
  border-radius: 16px;
  margin-bottom: 20px;
  border: none;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.75);
  box-shadow: 0 8px 24px rgba(95, 46, 234, 0.08);

  .ant-card-body {
    padding: 28px;
  }
`;

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 18px 0;

  &:not(:last-child) {
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }
`;

const SettingContent = styled.div`
  flex: 1;
  margin-right: 24px;
`;

const SettingTitle = styled.h4`
  font-weight: 600;
  margin-bottom: 6px;
  color: #1a1a1a;
  font-size: 18px;
`;

const SettingDescription = styled.p`
  color: #777;
  margin: 0;
  font-size: 14px;
`;

const PremiumButton = styled(Button)`
  background: linear-gradient(135deg, #7f5af0 0%, #5f2eea 100%);
  border: none;
  font-weight: 600;
  height: 42px;
  padding: 0 26px;
  border-radius: 8px;
  color: #fff;

  &:hover {
    transform: translateY(-1px);
    background: linear-gradient(135deg, #7f5af0 0%, #5f2eea 100%) !important;
    opacity: 0.95;
  }
`;

const PasswordInput = styled(Input.Password)`
  border-radius: 8px;
  padding: 10px 16px;
  margin-bottom: 16px;
`;

/* ---------- Component ---------- */
export default function Settings() {
  const [loginUserId, setLoginUserId] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [activeTab, setActiveTab] = useState("notifications");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("loginDetails");
      if (stored) {
        const loginDetails = JSON.parse(stored);
        setLoginUserId(loginDetails.id);
      }
    } catch (error) {
      console.error("Invalid JSON in localStorage", error);
    }
  }, []);

  const handleChangePassword = async () => {
    if (!currentPassword || currentPassword.trim() === "") {
      message.error("Current password is required");
      return;
    }

    const newPassErr = passwordValidator(newPassword);
    const confirmErr = confirmPasswordValidation(newPassword, confirmPassword);

    setNewPasswordError(newPassErr);
    setConfirmPasswordError(confirmErr);

    if (newPassErr || confirmErr) {
      message.error("Please fix password errors");
      return;
    }

    try {
      const payload = {
        user_id: loginUserId,
        currentPassword,
        newPassword,
      };

      const res = await changePassword(payload);

      message.success("Password changed successfully!");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setNewPasswordError("");
      setConfirmPasswordError("");

    } catch (err) {
      message.error("Invalid current password!");
    }
  };



  return (
    <div>
      <Header />
      <SettingsContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <SectionTitle level={2}>Account Settings</SectionTitle>
        <SectionDescription>
          Manage your account preferences and security settings
        </SectionDescription>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          tabPosition="left"
          style={{ minHeight: 500 }}
          tabBarStyle={{ fontWeight: "600" }}
          items={[
            {
              key: "notifications",
              label: (
                <span>
                  <BellOutlined style={{ marginRight: 6 }} />
                  Notifications
                </span>
              ),
              children: (
                <SettingCard>
                  {[
                    {
                      title: "Newsletter Preference",
                      desc: "Access the latest updates on jobs, internships, and competitions.",
                    },
                    {
                      title: "Email Notification Preferences",
                      desc: "Get reminders for quizzes, hackathons, and incomplete registrations.",
                    },
                    {
                      title: "Competition Updates",
                      desc: "Turn on emails for specific competitions from My Registration page.",
                    },
                    {
                      title: "Relevant Jobs Notifications",
                      desc: "Receive job notifications that match your profile.",
                    },
                  ].map((item, i) => (
                    <SettingItem key={i}>
                      <SettingContent>
                        <SettingTitle>{item.title}</SettingTitle>
                        <SettingDescription>{item.desc}</SettingDescription>
                      </SettingContent>
                      <Switch />
                    </SettingItem>
                  ))}
                </SettingCard>
              ),
            },
            {
              key: "password",
              label: (
                <span>
                  <LockOutlined style={{ marginRight: 6 }} />
                  Password
                </span>
              ),
              children: (
                <SettingCard>
                  <SettingContent>
                    <SettingTitle>Change Password</SettingTitle>
                    <SettingDescription>
                      Use a strong, unique password for better security.
                    </SettingDescription>
                  </SettingContent>

                  <Divider />

                  <Form layout="vertical" style={{ maxWidth: 500 }}>

                    {/* ✅ CURRENT PASSWORD */}
                    <Form.Item label="Current Password">
                      <PasswordInput
                        placeholder="Enter current password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        iconRender={(visible) =>
                          visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                        }
                      />
                    </Form.Item>

                    {/* ✅ NEW PASSWORD */}
                    <Form.Item label="New Password">
                      <PasswordInput
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => {
                          const value = e.target.value;
                          setNewPassword(value);
                          setNewPasswordError(passwordValidator(value));
                        }}
                        status={newPasswordError ? "error" : ""}
                        iconRender={(visible) =>
                          visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                        }
                      />
                      {newPasswordError && (
                        <div style={{ color: "red", marginTop: -10, marginBottom: 10 }}>
                          {newPasswordError}
                        </div>
                      )}
                    </Form.Item>

                    {/* ✅ CONFIRM PASSWORD */}
                    <Form.Item label="Confirm New Password">
                      <PasswordInput
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => {
                          const value = e.target.value;
                          setConfirmPassword(value);
                          setConfirmPasswordError(
                            confirmPasswordValidation(newPassword, value)
                          );
                        }}
                        status={confirmPasswordError ? "error" : ""}
                        iconRender={(visible) =>
                          visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                        }
                      />
                      {confirmPasswordError && (
                        <div style={{ color: "red", marginTop: -10, marginBottom: 10 }}>
                          {confirmPasswordError}
                        </div>
                      )}
                    </Form.Item>

                    <Space>
                      <PremiumButton
                        type="primary"
                        onClick={handleChangePassword}
                        disabled={!currentPassword || !newPassword || !confirmPassword}
                      >
                        Update Password
                      </PremiumButton>

                      <Button
                        onClick={() => {
                          setCurrentPassword("");
                          setNewPassword("");
                          setConfirmPassword("");
                          setNewPasswordError("");
                          setConfirmPasswordError("");
                        }}
                      >
                        Cancel
                      </Button>
                    </Space>
                  </Form>
                </SettingCard>
              ),
            },
            {
              key: "profile",
              label: (
                <span>
                  <UserOutlined style={{ marginRight: 6 }} />
                  Profile
                </span>
              ),
              children: (
                <SettingCard>
                  <SettingItem>
                    <SettingContent>
                      <SettingTitle>Profile Visibility</SettingTitle>
                      <SettingDescription>
                        Choose whether your profile is visible to search engines.
                      </SettingDescription>
                    </SettingContent>
                    <Select
                      defaultValue="Public"
                      style={{ width: 140 }}
                      options={[
                        { value: "Public", label: "Public" },
                        { value: "Private", label: "Private" },
                      ]}
                    />
                  </SettingItem>
                </SettingCard>
              ),
            },
            {
              key: "security",
              label: (
                <span>
                  <SafetyOutlined style={{ marginRight: 6 }} />
                  Security
                </span>
              ),
              children: (
                <SettingCard>
                  <SettingItem>
                    <SettingContent>
                      <SettingTitle>Two-Factor Authentication</SettingTitle>
                      <SettingDescription>
                        Add an extra layer of protection to your account.
                      </SettingDescription>
                    </SettingContent>
                    <Switch checked={false} />
                  </SettingItem>
                  <SettingItem>
                    <SettingContent>
                      <SettingTitle>Login Activity</SettingTitle>
                      <SettingDescription>
                        View recent login history and sessions.
                      </SettingDescription>
                    </SettingContent>
                    <Button style={{ color: "#5f2eea" }} type="link">
                      View Activity
                    </Button>
                  </SettingItem>
                </SettingCard>
              ),
            },
          ]}
        />

      </SettingsContainer>
    </div>
  );
}
