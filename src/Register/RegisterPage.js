import React, { useState, useEffect } from "react";
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
import {
  LockOutlined,
  MailOutlined,
  UserOutlined,
  PhoneOutlined,
  HomeOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import "../css/LoginPage.css";
import loginImage from "../images/login_image.png";
import { useNavigate } from "react-router-dom";
import {
  nameValidator,
  emailValidator,
  passwordValidator,
  phoneValidation,
  confirmPasswordValidation,
  orgNameValidation,
  orgTypeValidation,
} from "../Common/Validation";
import { CommonToaster } from "../Common/CommonToaster";
import CommonInputField from "../Common/CommonInputField";
import CommonPasswordField from "../Common/CommonPasswordField";

const { Title, Text, Link } = Typography;

const RegisterPage = () => {
  const [form] = Form.useForm();
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [orgName, setOrgName] = useState("");
  const [orgNameError, setOrgNameError] = useState("");
  const [orgType, setOrgType] = useState("");
  const [orgTypeError, setOrgTypeError] = useState("");
  const [activeTab, setActiveTab] = useState("candidate");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = () => {
    const nameValidate = nameValidator(name);
    const phoneValidate = phoneValidation(phone);
    const emailValidate = emailValidator(email);
    const passwordValidate = passwordValidator(password);
    const confirmPasswordValidate = confirmPasswordValidation(
      password,
      confirmPassword
    );
    const orgNameValidate =
      activeTab === "recruiter" ? orgNameValidation(orgName) : "";
    const orgTypeValidate =
      activeTab === "recruiter" ? orgTypeValidation(orgType) : "";

    setNameError(nameValidate);
    setPhoneError(phoneValidate);
    setEmailError(emailValidate);
    setPasswordError(passwordValidate);
    setConfirmPasswordError(confirmPasswordValidate);
    setOrgNameError(orgNameValidate);
    setOrgTypeError(orgTypeValidate);

    if (
      nameValidate ||
      phoneValidate ||
      emailValidate ||
      passwordValidate ||
      confirmPasswordValidate ||
      orgNameValidate ||
      orgTypeValidate
    )
      return;

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      message.success(
        `${
          activeTab === "candidate" ? "Candidate" : "Recruiter"
        } registered successfully!`
      );
      navigate("/login");
    }, 1500);
  };

  const tabItems = [
    {
      key: "candidate",
      label: (
        <span className="tab-label" style={{ padding: "0 24px" }}>
          Candidate Registration
        </span>
      ),
    },
    {
      key: "recruiter",
      label: (
        <span className="tab-label" style={{ padding: "0 24px" }}>
          Recruiter Registration
        </span>
      ),
    },
  ];

  useEffect(() => {
    setEmail("");
    setPassword("");
    setName("");
    setConfirmPassword("");
    setPhone("");
  }, [activeTab]);

  return (
    <div className="loginpage_container">
      <Row>
        <Col span={12}>
          {" "}
          <div className="floating_circle1"></div>
          <div style={{ height: 870 }} className="login-animation">
            <Card className="login_card" bordered={false}>
              <div style={{ textAlign: "center", marginBottom: 12 }}>
                <Title
                  level={2}
                  style={{ marginBottom: 8, fontWeight: 700, color: "#2d3748" }}
                >
                  Join CareerFast!
                </Title>
                <Text type="secondary" style={{ fontSize: 16 }}>
                  {activeTab === "candidate"
                    ? "Start your career journey with us"
                    : "Find the best talent for your organization"}
                </Text>
              </div>

              <Tabs
                activeKey={activeTab}
                onChange={(value) => {
                  setActiveTab(value);
                  setEmailError("");
                  setNameError("");
                  setConfirmPasswordError("");
                  setPhoneError("");
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
                // onFinish={handleSubmit}
              >
                <div style={{ marginBottom: "0px" }}>
                  <CommonInputField
                    label="Full Name"
                    name="name"
                    mandotary={true}
                    placeholder="Enter your full name"
                    prefix={
                      <UserOutlined style={{ color: "rgba(0, 0, 0, 0.25)" }} />
                    }
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setNameError(nameValidator(e.target.value));
                    }}
                    error={nameError}
                  />
                </div>

                <div style={{ marginBottom: "0px" }}>
                  <CommonInputField
                    label="Phone Number"
                    name="phone"
                    mandotary={true}
                    placeholder="Enter your phone number"
                    prefix={
                      <PhoneOutlined style={{ color: "rgba(0, 0, 0, 0.25)" }} />
                    }
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setPhoneError(phoneValidation(e.target.value));
                    }}
                    error={phoneError}
                  />
                </div>

                <div style={{ marginBottom: "0px" }}>
                  <CommonInputField
                    label="Email"
                    name="email"
                    mandotary={true}
                    placeholder="Enter your email"
                    prefix={
                      <MailOutlined style={{ color: "rgba(0, 0, 0, 0.25)" }} />
                    }
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError(emailValidator(e.target.value));
                    }}
                    error={emailError}
                  />
                </div>

                {activeTab === "recruiter" && (
                  <>
                    <div className="form-row">
                      <div style={{ marginBottom: "0px" }}>
                        <CommonInputField
                          label="Organization Name"
                          name="orgName"
                          mandotary={true}
                          placeholder="Enter your organization name"
                          prefix={
                            <HomeOutlined
                              style={{ color: "rgba(0, 0, 0, 0.25)" }}
                            />
                          }
                          value={orgName}
                          onChange={(e) => {
                            setOrgName(e.target.value);
                            setOrgNameError(orgNameValidation(e.target.value));
                          }}
                          error={orgNameError}
                        />
                      </div>
                      <div style={{ marginBottom: "0px" }}>
                        <CommonInputField
                          label="Organization Type"
                          name="orgType"
                          mandotary={true}
                          placeholder="E.g., IT, Healthcare, Finance"
                          prefix={
                            <SolutionOutlined
                              style={{ color: "rgba(0, 0, 0, 0.25)" }}
                            />
                          }
                          value={orgType}
                          onChange={(e) => {
                            setOrgType(e.target.value);
                            setOrgTypeError(orgTypeValidation(e.target.value));
                          }}
                          error={orgTypeError}
                        />
                      </div>
                    </div>
                  </>
                )}
                <div className="form-row">
                  <div style={{ marginBottom: "0px" }}>
                    <CommonPasswordField
                      label="Password"
                      name="password"
                      placeholder="••••••••"
                      prefix={
                        <LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                      }
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordError(passwordValidator(e.target.value));
                      }}
                      error={passwordError}
                      mandatory={true}
                      min={8}
                    />
                  </div>

                  <div style={{ marginBottom: "0px" }}>
                    <CommonPasswordField
                      label="Confirm Password"
                      name="confirmPassword"
                      placeholder="••••••••"
                      prefix={
                        <LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                      }
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setConfirmPasswordError(
                          confirmPasswordValidation(password, e.target.value)
                        );
                      }}
                      error={confirmPasswordError}
                      mandatory={true}
                      min={8}
                    />
                  </div>
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
                      ? "Registering..."
                      : `Create ${
                          activeTab === "candidate" ? "Candidate" : "Recruiter"
                        } Account`}
                  </Button>
                </Form.Item>
                <div style={{ textAlign: "center", marginTop: 20 }}>
                  <Text type="secondary" style={{ fontSize: 15 }}>
                    Already have an account?
                    <Link
                      href="/login"
                      style={{ color: "#8d3ffb", fontWeight: 600 }}
                      className="hover-underline"
                    >
                      Sign in now
                    </Link>
                  </Text>
                </div>
              </Form>
            </Card>
          </div>
        </Col>

        <Col span={12}>
          {" "}
          <div style={{ height: 870 }} className="login_image">
            <img src={loginImage} alt="Registration illustration"></img>
          </div>
          <div className="floating_circle2"></div>
        </Col>
      </Row>
    </div>
  );
};

export default RegisterPage;
