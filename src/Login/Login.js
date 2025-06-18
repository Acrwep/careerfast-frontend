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
} from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import "../css/LoginPage.css";
import loginImage from "../images/login_image.png";
import Header from "../Header/Header";
import { useNavigate } from "react-router-dom"; // For navigation
import { emailValidator, passwordValidator } from "../Common/Validation";
import CommonInputField from "../Common/CommonInputField";
import CommonPasswordField from "../Common/CommonPasswordField";
import { login } from "../ApiService/action";

const { Title, Text, Link } = Typography;

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [form] = Form.useForm();

  const [activeTab, setActiveTab] = useState("candidate");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setEmail("");
  }, [activeTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailValidate = emailValidator(email);
    const passwordValidate = passwordValidator(password);

    if (emailValidate || passwordValidate) {
      setEmailError(emailValidate);
      setPasswordError(passwordValidate);
      return;
    }

    if (activeTab === "candidate") {
      console.log("candidate api");

      const payload = {
        email: email,
        password: password,
      };
      try {
        const response = await login(payload);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("recuiter api");
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      message.success(
        `${
          activeTab === "candidate" ? "Candidate" : "Recruiter"
        } Login successfully!`
      );

      // navigate("/job-portal");
    }, 1500);
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
          <div style={{ height: 720 }} className="login-animation">
            <Card className="login_card" bordered={false}>
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
                  setPassword("");
                  setPasswordError("");
                  form.resetFields();
                }}
                centered
                size="large"
                tabBarStyle={{ marginBottom: 32 }}
                items={tabItems}
              />

              <Form
                form={form}
                className="login_form"
                layout="vertical"
                // onSubmitCapture={handleSubmit}
              >
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
                    <Checkbox style={{ fontWeight: 500 }}>Remember me</Checkbox>
                  </Form.Item>
                  <Link
                    style={{ color: "#8d3ffb", fontWeight: 500 }}
                    href="#"
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
