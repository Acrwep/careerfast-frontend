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
  officialEmailValidator,
} from "../Common/Validation";
import { CommonToaster } from "../Common/CommonToaster";
import CommonInputField from "../Common/CommonInputField";
import CommonPasswordField from "../Common/CommonPasswordField";
import { getOrganizationType, register } from "../ApiService/action";
import CommonSelectField from "../Common/CommonSelectField";

const { Title, Text, Link } = Typography;

const RegisterPage = () => {
  const [form] = Form.useForm();
  const [fname, setFname] = useState("");
  const [fnameError, setFnameError] = useState("");
  const [lname, setLname] = useState("");
  const [lnameError, setLnameError] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [officialEmail, setOfficialEmail] = useState("");
  const [officialEmailError, setOfficialEmailError] = useState("");
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
  const [orgTypeOptions, setOrgTypeOptions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getOrganizationTypeDate();
  }, []);

  const getOrganizationTypeDate = async () => {
    try {
      const response = await getOrganizationType();
      console.log("orgtype", response);
      setOrgTypeOptions(response?.data?.data || []);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleSubmit = async () => {
    const fnameValidate = nameValidator(fname);
    const lnameValidate = nameValidator(lname);
    const phoneValidate = phoneValidation(phone);
    const emailValidate =
      activeTab === "recruiter"
        ? officialEmailValidator(officialEmail)
        : emailValidator(email);
    const passwordValidate = passwordValidator(password);
    const confirmPasswordValidate = confirmPasswordValidation(
      password,
      confirmPassword
    );
    const orgNameValidate =
      activeTab === "recruiter" ? orgNameValidation(orgName) : "";
    const orgTypeValidate =
      activeTab === "recruiter" ? orgTypeValidation(orgType) : "";

    setFnameError(fnameValidate);
    setLnameError(lnameValidate);
    setPhoneError(phoneValidate);
    setEmailError(emailValidate);
    setOfficialEmailError(emailValidate);
    setPasswordError(passwordValidate);
    setConfirmPasswordError(confirmPasswordValidate);
    setOrgNameError(orgNameValidate);
    setOrgTypeError(orgTypeValidate);

    if (
      fnameValidate ||
      lnameValidate ||
      phoneValidate ||
      emailValidate ||
      passwordValidate ||
      confirmPasswordValidate ||
      orgNameValidate ||
      orgTypeValidate
    )
      return;

    const registerload = {
      first_name: fname,
      last_name: lname,
      phone_code: "+91",
      phone: phone,
      email: activeTab === "recruiter" ? officialEmail : email,
      password: password,
      organization: orgName,
      organization_type_id: orgType,
      role_id:
        activeTab === "candidate" ? 2 : activeTab === "recruiter" ? 3 : 1,
    };

    console.log("registerload", registerload);

    try {
      const response = await register(registerload);
      console.log("Register response", response);
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
    } catch (error) {
      console.log("Error", error);
      message.error(error.response.data.details);
    }
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
    document.title = "CareerFast | Register";
    setEmail("");
    setPassword("");
    setFname("");
    setConfirmPassword("");
    setPhone("");
  }, [activeTab]);

  return (
    <div className="loginpage_container">
      <Row>
        <Col span={12}>
          {" "}
          <div className="floating_circle1"></div>
          <div
            style={{ height: 800, placeContent: "center" }}
            className="login-animation"
          >
            <Card className="login_card">
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
                  setOfficialEmailError("");
                  setFnameError("");
                  setLnameError("");
                  setOrgNameError("");
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

              <Form form={form} className="login_form" layout="vertical">
                <div style={{ marginBottom: "0px" }}>
                  <div className="form-row">
                    <CommonInputField
                      label="First Name"
                      name="name"
                      mandotary={true}
                      placeholder="Enter your first name"
                      prefix={
                        <UserOutlined
                          style={{ color: "rgba(0, 0, 0, 0.25)" }}
                        />
                      }
                      value={fname}
                      onChange={(e) => {
                        setFname(e.target.value);
                        setFnameError(nameValidator(e.target.value));
                      }}
                      error={fnameError}
                    />

                    <CommonInputField
                      label="Last Name"
                      name="name"
                      mandotary={true}
                      placeholder="Enter your last name"
                      prefix={
                        <UserOutlined
                          style={{ color: "rgba(0, 0, 0, 0.25)" }}
                        />
                      }
                      value={lname}
                      onChange={(e) => {
                        setLname(e.target.value);
                        setLnameError(nameValidator(e.target.value));
                      }}
                      error={lnameError}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div style={{ marginBottom: "0px" }}>
                    <CommonInputField
                      label="Phone Number"
                      name="phone"
                      mandotary={true}
                      placeholder="Enter your phone number"
                      prefix={
                        <PhoneOutlined
                          style={{ color: "rgba(0, 0, 0, 0.25)" }}
                        />
                      }
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        setPhoneError(phoneValidation(e.target.value));
                      }}
                      error={phoneError}
                    />
                  </div>

                  {activeTab === "recruiter" && (
                    <div style={{ marginBottom: "0px" }}>
                      <CommonInputField
                        label="Official Email"
                        name="officialemail"
                        mandotary={true}
                        placeholder="Enter your official email"
                        prefix={
                          <MailOutlined
                            style={{ color: "rgba(0, 0, 0, 0.25)" }}
                          />
                        }
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

                  {activeTab === "candidate" && (
                    <div style={{ marginBottom: "0px" }}>
                      <CommonInputField
                        label="Email"
                        name="email"
                        mandotary={true}
                        placeholder="Enter your email"
                        prefix={
                          <MailOutlined
                            style={{ color: "rgba(0, 0, 0, 0.25)" }}
                          />
                        }
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setEmailError(emailValidator(e.target.value));
                        }}
                        error={emailError}
                      />
                    </div>
                  )}
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
                        <CommonSelectField
                          label="Organization Type"
                          name="orgType"
                          mandotary={true}
                          placeholder="Select organization"
                          prefix={
                            <SolutionOutlined
                              style={{ color: "rgba(0, 0, 0, 0.25)" }}
                            />
                          }
                          value={orgType}
                          options={orgTypeOptions}
                          onChange={(value) => {
                            setOrgType(value);
                            setOrgTypeError(orgTypeValidation(value));
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
          <div
            style={{ height: 800, placeContent: "center" }}
            className="login_image"
          >
            <img src={loginImage} alt="Registration illustration"></img>
          </div>
          <div className="floating_circle2"></div>
        </Col>
      </Row>
    </div>
  );
};

export default RegisterPage;
