import React, { useEffect, useState } from "react";
import {
  Tabs,
  Form,
  Input,
  Button,
  Checkbox,
  Typography,
  Card,
  Divider,
  message,
  Col,
  Row,
  Modal,
  Flex,
} from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import "../css/LoginPage.css";
import loginImage from "../images/login_image.png";
import { useNavigate } from "react-router-dom"; // For navigation
import {
  confirmPasswordValidation,
  emailValidator,
  officialEmailValidator,
  passwordValidator,
} from "../Common/Validation";
import CommonInputField from "../Common/CommonInputField";
import CommonPasswordField from "../Common/CommonPasswordField";
import { login } from "../ApiService/action";
import { verifyOtp, forgotPassword, sendOtp } from "../ApiService/action";

const { Title, Text, Link } = Typography;

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [officialEmail, setOfficialEmail] = useState("");
  const [officialEmailError, setOfficialEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [form] = Form.useForm();

  const [step, setStep] = useState(1);
  const [otpEmail, setOtpEmail] = useState("");
  const [otpEmailError, setOtpEmailError] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [confirmNewPasswordError, setConfirmNewPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("candidate");
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setEmail("");
  }, [activeTab]);

  useEffect(() => {
    localStorage.clear();
    sessionStorage.clear();
    const storedEmail = localStorage.getItem("rememberedEmail");
    if (storedEmail) {
      console.log("remember me", storedEmail);
      setEmail(storedEmail);
      setRememberMe(true);
    }
  }, []);

  const showLoading = () => {
    setOpen(true);
    setLoading(false);
  };

  const onChange = (text) => {
    console.log("onChange:", text);
  };
  const onInput = (value) => {
    console.log("onInput:", value);
  };
  const sharedProps = {
    onChange,
    onInput,
  };

  const handleModalClose = () => {
    setOpen(false);
    setStep(1);
    setOtpEmail("");
    setNewPassword("");
    setOtp("");
    setNewPasswordError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailValidate =
      activeTab === "recruiter"
        ? officialEmailValidator(officialEmail)
        : emailValidator(email);
    const passwordValidate = passwordValidator(password);

    if (rememberMe) {
      localStorage.setItem("rememberedEmail", email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    if (emailValidate || passwordValidate) {
      setEmailError(emailValidate);
      setPasswordError(passwordValidate);
      setOfficialEmailError(emailValidate);
      return;
    }
    const payload = {
      email: activeTab === "recruiter" ? officialEmail : email,
      password: password,
    };
    try {
      const response = await login(payload);
      console.log("login response", response);
      const token = response.data.token;
      localStorage.setItem("AccessToken", token);
      const loginDetails = response.data.data[0];
      console.log(loginDetails);
      localStorage.setItem("loginDetails", JSON.stringify(loginDetails));
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        message.success(
          `${
            activeTab === "candidate" ? "Candidate" : "Recruiter"
          } Login successfully!`
        );

        navigate("/profiledetails");
      }, 1500);
    } catch (error) {
      console.log("login error", error);
      message.error(error?.response?.data?.details);
    }
  };

  // Step 1: Send OTP
  const handleSendOtp = async () => {
    const otpEmailValidate = emailValidator(otpEmail);
    if (otpEmailValidate) {
      setOtpEmailError(otpEmailValidate);
      return;
    }
    try {
      const payload = {
        email: email,
        email: otpEmail,
      };
      setLoading(true);
      const res = await sendOtp(payload);

      if (res?.data?.message) {
        message.success("OTP sent to your email");
        setStep(2);
      } else {
        message.error(res?.data?.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      message.error("Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    try {
      const payload = {
        email: otpEmail,
        otp: otp,
      };
      setLoading(true);
      const res = await verifyOtp(payload);
      if (res?.data?.message) {
        message.success("OTP verified");
        setStep(3);
      } else {
        message.error(res?.data?.message || "Invalid OTP");
      }
    } catch (err) {
      console.error(err);
      message.error("Error verifying OTP");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async () => {
    const newPasswordValidate = passwordValidator(newPassword);
    const confirmNewPasswordValidate = confirmPasswordValidation(
      newPassword,
      confirmNewPassword
    );

    setNewPasswordError(newPasswordValidate);
    setConfirmNewPasswordError(confirmNewPasswordValidate);

    // Stop if validation fails
    if (newPasswordValidate || confirmNewPasswordValidate) return;
    setOtp("");
    try {
      const payload = {
        email: otpEmail,
        password: newPassword,
      };
      setLoading(true);
      const res = await forgotPassword(payload);
      if (res?.data?.message) {
        message.success("Password changed successfully");
        setTimeout(() => {
          handleModalClose(); // close & reset
        }, 1000);
      } else {
        message.error(res?.data?.message || "Failed to change password");
      }
    } catch (err) {
      console.error(err);
      message.error("Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  const tabItems = [
    {
      key: "candidate",
      label: (
        <span className="tab-label" style={{ padding: "0 24px" }}>
          Candidate Login
        </span>
      ),
    },
    {
      key: "recruiter",
      label: (
        <span className="tab-label" style={{ padding: "0 24px" }}>
          Recruiter Login
        </span>
      ),
    },
  ];

  return (
    <div className="loginpage_container">
      <Row>
        <Col span={12}>
          {" "}
          <div className="floating_circle1"></div>
          <div
            style={{ height: 720, placeContent: "center" }}
            className="login-animation"
          >
            <Card className="login_card">
              <div style={{ textAlign: "center", marginBottom: 12 }}>
                <Title
                  level={2}
                  style={{ marginBottom: 8, fontWeight: 700, color: "#2d3748" }}
                >
                  Welcome to CareerFast!
                </Title>
                <Text type="secondary" style={{ fontSize: 16 }}>
                  Accelerate your{" "}
                  {activeTab === "candidate"
                    ? "career journey"
                    : "hiring process"}
                </Text>
              </div>

              <Tabs
                activeKey={activeTab}
                onChange={(value) => {
                  setActiveTab(value);
                  setEmail("");
                  setEmailError("");
                  setOfficialEmailError("");
                  setPassword("");
                  setPasswordError("");
                  form.resetFields();
                }}
                centered
                size="large"
                tabBarStyle={{ marginBottom: 32 }}
                items={tabItems}
              />

              <Form form={form} className="login_form" layout="vertical">
                {activeTab === "candidate" && (
                  <div style={{ marginBottom: "4px" }}>
                    <CommonInputField
                      label="Email"
                      name="email"
                      mandotary={true}
                      placeholder="Enter your email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError(emailValidator(e.target.value));
                      }}
                      error={emailError}
                    />
                  </div>
                )}

                {activeTab === "recruiter" && (
                  <div style={{ marginBottom: "4px" }}>
                    <CommonInputField
                      label="Official Email"
                      name="officialemail"
                      mandotary={true}
                      placeholder="Enter your email"
                      type="email"
                      value={officialEmail}
                      onChange={(e) => {
                        setOfficialEmail(e.target.value);
                        setOfficialEmailError(
                          officialEmailValidator(e.target.value)
                        );
                      }}
                      error={officialEmailError}
                    />
                  </div>
                )}

                <CommonPasswordField
                  label="Password"
                  name="password"
                  placeholder="••••••••"
                  prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError(passwordValidator(e.target.value));
                  }}
                  error={passwordError}
                  mandatory={true}
                  min={8}
                />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 14,
                    marginTop: 6,
                  }}
                >
                  <Form.Item name="remember" noStyle>
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      style={{ fontWeight: 500 }}
                    >
                      Remember me
                    </Checkbox>
                  </Form.Item>
                  <Link
                    onClick={showLoading}
                    style={{ color: "#8d3ffb", fontWeight: 500 }}
                    className="hover-underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    size="large"
                    onClick={handleSubmit}
                    loading={isLoading}
                    className="premium-button"
                  >
                    {isLoading
                      ? "Authenticating..."
                      : `Continue as ${
                          activeTab === "candidate" ? "Candidate" : "Recruiter"
                        }`}
                  </Button>
                </Form.Item>

                <Divider style={{ color: "rgba(0,0,0,0.25)", fontSize: 14 }}>
                  or continue with
                </Divider>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 16,
                    marginBottom: 14,
                  }}
                >
                  <Button
                    shape="circle"
                    size="large"
                    className="social-button"
                    icon={
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png"
                        alt="Google"
                        style={{ width: 20 }}
                      />
                    }
                  />
                  <Button
                    shape="circle"
                    size="large"
                    className="social-button"
                    icon={
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/733/733547.png"
                        alt="Facebook"
                        style={{ width: 20 }}
                      />
                    }
                  />
                  <Button
                    shape="circle"
                    size="large"
                    className="social-button"
                    icon={
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png"
                        alt="Instagram"
                        style={{ width: 20 }}
                      />
                    }
                  />
                </div>

                <div style={{ textAlign: "center" }}>
                  <Text type="secondary" style={{ fontSize: 15 }}>
                    Don't have an account?{" "}
                    <Link
                      href="/register"
                      style={{ color: "#8d3ffb", fontWeight: 600 }}
                      className="hover-underline"
                    >
                      Sign up now
                    </Link>
                  </Text>
                </div>
              </Form>
            </Card>
          </div>
        </Col>

        <Modal
          title="Forgot Password"
          open={open}
          onCancel={handleModalClose}
          footer={null}
        >
          {step === 1 && (
            <>
              <CommonInputField
                label="Email"
                mandotary={true}
                placeholder={"Enter your valid email"}
                type="email"
                value={otpEmail}
                onChange={(e) => {
                  setOtpEmail(e.target.value);
                  setOtpEmailError(emailValidator(e.target.value));
                }}
                error={otpEmailError}
              />
              <div style={{ textAlign: "start" }}>
                <Button
                  style={{ marginTop: 5 }}
                  className="sendOtp"
                  type="primary"
                  loading={loading}
                  onClick={handleSendOtp}
                >
                  Send OTP
                </Button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <Typography.Title level={5}>Enter OTP</Typography.Title>
              <Input.OTP value={otp} onChange={(val) => setOtp(val)} />
              <br></br>
              <div style={{ textAlign: "start" }}>
                <Button
                  style={{ marginTop: 20 }}
                  className="sendOtp"
                  type="primary"
                  loading={loading}
                  onClick={handleVerifyOtp}
                >
                  Verify OTP
                </Button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <CommonPasswordField
                label="New Password"
                type="password"
                mandatory={true}
                value={newPassword}
                placeholder="••••••••"
                prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setNewPasswordError(passwordValidator(e.target.value));
                }}
                error={newPasswordError}
              />

              <CommonPasswordField
                label="Confirm New Password"
                name="confirmNewPassword"
                placeholder="••••••••"
                value={confirmNewPassword}
                onChange={(e) => {
                  setConfirmNewPassword(e.target.value);
                  setConfirmNewPasswordError(
                    confirmPasswordValidation(newPassword, e.target.value)
                  );
                }}
                error={confirmNewPasswordError}
                mandatory={true}
                min={8}
              />
              <div style={{ textAlign: "start" }}>
                <Button
                  style={{ marginTop: 14 }}
                  className="sendOtp"
                  type="primary"
                  loading={loading}
                  onClick={handleResetPassword}
                >
                  Change Password
                </Button>
              </div>
            </>
          )}
        </Modal>

        <Col span={12}>
          {" "}
          <div className="login_image">
            <img src={loginImage}></img>
          </div>
          <div className="floating_circle2"></div>
        </Col>
      </Row>
    </div>
  );
};

export default LoginPage;
