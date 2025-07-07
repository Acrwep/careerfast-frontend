import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Form,
  Steps,
  Divider,
  Card,
  Typography,
  Button,
  Avatar,
  Progress,
  Modal,
  Checkbox,
  message,
  DatePicker,
  Input,
  Spin,
  Tag,
} from "antd";
import {
  UserOutlined,
  SolutionOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { IoMdAdd } from "react-icons/io";
import { Country, State, City } from "country-state-city";
import { auth } from "../firebase/firebaseConfig";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "../css/ProfileDetailsPage.css";
import { MdDeleteForever } from "react-icons/md";
import CommonInputField from "../Common/CommonInputField";
import CommonSelectField from "../Common/CommonSelectField";
import CommonTextArea from "../Common/CommonTextArea";
import {
  emailValidator,
  nameValidator,
  pincodeValidator,
  selectValidator,
} from "../Common/Validation";
import { phoneValidation } from "../Common/Validation";
import CommonDatePicker from "../Common/CommonDatePicker";
import {
  insertProfileData,
  verifyEmail,
  verifyOtp,
} from "../ApiService/action";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

dayjs.extend(customParseFormat);

const ProfileDetails = () => {
  const [form] = Form.useForm();

  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(25);
  const [fname, setFname] = useState("");
  const [fnameError, setFnameError] = useState("");
  const [lname, setLname] = useState("");
  const [lnameError, setLnameError] = useState("");
  const [emailVerified, setEmailVerified] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [numberVerified, setNumberVerified] = useState("");
  const [number, setNumber] = useState("");
  const [numberError, setNumberError] = useState("");
  const [pincode, setPincode] = useState("");
  const [pincodeError, setPincodeError] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [countryList, setCountryList] = useState([]);
  const [country, setCountry] = useState([]);
  const [countryError, setCountryError] = useState("");
  const [countryId, setCountryId] = useState(null);
  const [state, setState] = useState("");
  const [stateError, setStateError] = useState("");
  const [stateList, setStateList] = useState([]);
  const [city, setCity] = useState("");
  const [cityError, setCityError] = useState("");
  const [cityList, setCityList] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [address, setAddress] = useState("");
  const [open, setOpen] = useState(false);

  // 2
  const [selectExperienceType, setSelectExperienceType] = useState("");
  const [selectExperienceTypeError, setSelectExperienceTypeError] =
    useState("");
  const [totalYearsExperience, setTotalYearsExperience] = useState("");
  const [totalYearsExperienceError, setTotalYearsExperienceError] =
    useState("");
  const [totalMonthsExperience, setTotalMonthsExperience] = useState("");
  const [totalMonthsExperienceError, setTotalMonthsExperienceError] =
    useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobTitleError, setJobTitleError] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [designation, setDesignation] = useState("");
  const [designationError, setDesignationError] = useState("");

  const [experienceType, setExperienceType] = useState(null);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSending, setOtpSending] = useState(false);
  const [otpError, setOtpError] = useState(null);
  const [recaptchaReady, setRecaptchaReady] = useState(false);
  const recaptchaContainerRef = useRef(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);
  const [recaptchaInitAttempts, setRecaptchaInitAttempts] = useState(0);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [customSkill, setCustomSkill] = useState("");
  const [skillsError, setSkillsError] = useState(null);
  const [startDateError, setstartDateError] = useState("");
  const [endDateError, setendDateError] = useState("");
  const [loginUserId, setLoginUserId] = useState(null);
  const [loading, setLoading] = React.useState(false);
  const [otpEmail, setOtpEmail] = useState("");

  const initializeRecaptcha = useCallback(async () => {
    try {
      // Check if Firebase auth is available
      if (!auth) {
        console.error("Firebase auth not initialized");
        return;
      }

      // Clear existing verifier
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        delete window.recaptchaVerifier;
      }

      // Wait for grecaptcha to be available
      if (!window.grecaptcha || !window.grecaptcha.enterprise) {
        console.log("Waiting for grecaptcha to load...");
        await new Promise((resolve) => {
          const checkInterval = setInterval(() => {
            if (window.grecaptcha?.enterprise) {
              clearInterval(checkInterval);
              resolve();
            }
          }, 100);
        });
      }

      const verifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => {
            console.log("reCAPTCHA solved");
            setRecaptchaReady(true);
          },
          "expired-callback": () => {
            console.log("reCAPTCHA expired");
            setRecaptchaReady(false);
          },
        },
        auth
      );

      // Verify the verifier was created
      if (!verifier) {
        throw new Error("Failed to create verifier");
      }

      window.recaptchaVerifier = verifier;
      setRecaptchaVerifier(verifier);

      // Force verification
      await verifier.verify();
      setRecaptchaReady(true);
      console.log("reCAPTCHA initialized successfully");
    } catch (error) {
      console.error("reCAPTCHA initialization failed:", error);
      setRecaptchaReady(false);
      // Retry with exponential backoff
      const delay = Math.min(1000 * Math.pow(2, recaptchaInitAttempts), 10000);
      setTimeout(initializeRecaptcha, delay);
    }
  }, [auth, recaptchaInitAttempts]);
  //

  useEffect(() => {
    setCountryList(Country.getAllCountries());
    initializeRecaptcha();

    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }
    };
  }, [initializeRecaptcha]);

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      const script = document.createElement("script");
      script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.onload = () => initializeRecaptcha();
      document.body.appendChild(script);
    } else {
      initializeRecaptcha();
    }
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("loginDetails");
      if (stored) {
        const loginDetails = JSON.parse(stored);
        setLoginUserId(loginDetails.id);
        setFname(loginDetails.first_name);
        setLname(loginDetails.last_name);
        setEmail(loginDetails.email);
        setNumber(loginDetails.phone);
      }
    } catch (error) {
      console.error("Invalid JSON in localStorage", error);
    }
  }, []);

  const handleCountryChange = (countryCode) => {
    const country = countryList.find((c) => c.isoCode === countryCode);
    setCountryId(country);
    setSelectedState(null);
    setSelectedCity(null);

    const states = State.getStatesOfCountry(countryCode);
    setStateList(states);
    setCityList([]); // Clear city list

    form.setFieldsValue({
      country: countryCode,
      state: undefined,
      city: undefined,
    });
  };

  const handleStateChange = (stateName) => {
    const state = stateList.find((s) => s.name === stateName);
    setSelectedState(state);
    form.setFieldsValue({ state: stateName, city: undefined });

    if (countryId && state) {
      const cities = City.getCitiesOfState(countryId.isoCode, state.isoCode);

      const cityOptions = cities.map((city) => ({
        label: city.name,
        value: city.name,
      }));

      setCityList(cityOptions);
      setSelectedCity(null);
    }
  };

  const handleCityChange = (cityName) => {
    setSelectedCity(cityName);
    form.setFieldsValue({ city: cityName });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result;
        setProfileImage(base64String);
      };

      reader.readAsDataURL(file);
    }
  };

  const handAvatarClick = () => {
    if (profileImage) setIsModalVisible(true);
  };

  const handleExperienceTypeChange = (value) => setExperienceType(value);
  const handleCheckboxChange = (index, e) => {
    const updatedCompanies = [...companies];
    updatedCompanies[index].currentlyWorking = e.target.checked;
    if (e.target.checked) {
      updatedCompanies[index].endDate = null;
    }
    setCompanies(updatedCompanies);
  };

  const handleModalClose = () => {
    setOpen(false);
  };

  const nextStep = (e) => {
    e.preventDefault();

    // Run validators again

    if (currentStep === 0) {
      ProfileInfoValidate();
    } else if (currentStep === 1) {
      ProfessionalInfoValidate();
    }
  };

  const ProfileInfoValidate = () => {
    const fnameValidate = nameValidator(fname);
    const lnameValidate = nameValidator(lname);
    const emailValidate = emailValidator(email);
    const phoneValidate = phoneValidation(number);
    const pincodeValidate = pincodeValidator(pincode);
    const countryValidate = selectValidator(countryId);
    const stateValidate = selectValidator(state);
    const cityValidate = selectValidator(city);

    setFnameError(fnameValidate);
    setLnameError(lnameValidate);
    setEmailError(emailValidate);
    setNumberError(phoneValidate);
    setPincodeError(pincodeValidate);
    setCountryError(countryValidate);
    setStateError(stateValidate);
    setCityError(cityValidate);

    if (
      // fnameValidate ||
      // lnameValidate ||
      // emailValidate ||
      // phoneValidate ||
      // pincodeValidate ||
      // countryValidate ||
      // stateValidate ||
      // cityValidate
      ""
    ) {
      message.error("Please fill all fields correctly before proceeding.");
      return;
    } else {
      setCurrentStep(1);
      setProgress(25);
    }
    setEmailVerified("Verified");
  };

  const ProfessionalInfoValidate = () => {
    const selectExperienceTypeValidate = selectValidator(selectExperienceType);

    let skillsValidate = "";
    if (selectedSkills.length <= 0) {
      skillsValidate = " is required";
    } else {
      skillsValidate = "";
    }

    setSelectExperienceTypeError(selectExperienceTypeValidate);
    setSkillsError(skillsValidate);

    let experienceErrors = false;
    if (selectExperienceType === "Experience") {
      const totalYearsExperienceValidate =
        selectValidator(totalYearsExperience);
      const totalMonthsExperienceValidate = selectValidator(
        totalMonthsExperience
      );
      const jobTitleValidate = nameValidator(jobTitle);

      setTotalYearsExperienceError(totalYearsExperienceValidate);
      setTotalMonthsExperienceError(totalMonthsExperienceValidate);
      setJobTitleError(jobTitleValidate);

      const validateCompanyFields = companies.map((item, index) => {
        return {
          ...item,
          companyNameError: nameValidator(item.companyName),
          designationError: nameValidator(item.designation),
          startDateError: selectValidator(item.startDate),
          endDateError:
            item.currentlyWorking === true ? "" : selectValidator(item.endDate),
        };
      });

      console.log("valllllll", validateCompanyFields);
      setCompanies(validateCompanyFields);

      validateCompanyFields.map((err) => {
        if (
          err.companyNameError ||
          err.designationError ||
          err.startDateError ||
          err.endDateError
        ) {
          experienceErrors = true;
        }
      });

      if (
        // selectExperienceTypeValidate ||
        // totalYearsExperienceValidate ||
        // totalMonthsExperienceValidate ||
        // jobTitleValidate ||
        // skillsValidate ||
        // experienceErrors
        ""
      ) {
        message.error("Please fill all fields correctly before proceeding.");
        return;
      }
    } else {
      if (
        // selectExperienceTypeValidate || skillsValidate || experienceErrors
        ""
      ) {
        message.error("Please fill all fields correctly before proceeding.");
        return;
      }
    }

    setCurrentStep(2);
    setProgress(50);
  };

  const doneProfile = async () => {
    const professional = companies.map((company) => ({
      experience_type: selectExperienceType,
      total_years: totalYearsExperience,
      total_months: totalMonthsExperience,
      job_title: company.designation,
      company_name: company.companyName,
      designation: company.designation,
      start_date: company.startDate,
      end_date: company.endDate,
      currently_working: company.currentlyWorking,
      skills: selectedSkills,
    }));

    const payload = {
      profile_image: profileImage,
      user_id: loginUserId,
      country: country,
      state: state,
      city: city,
      pincode: pincode,
      address: address,
      professional,
      is_email_verified: "verified",
    };

    try {
      const response = await insertProfileData(payload);
      console.log("my profile", response);
      message.success("Profile inserted successfully!");
    } catch (error) {
      console.log("my profile error", error);
      message.error("Fill all the required fields");
    }
  };

  // verify email

  const verifyEmailData = async () => {
    const verifyEmailLoad = {
      email: email,
    };

    try {
      setOtpSending(true);
      setOtpError(null);
      setOtp("");
      const response = await verifyEmail(verifyEmailLoad);
      console.log("verify email", response);
      message.success(response?.data?.message);
      setProgress(50);
    } catch (error) {
      console.log("verify email error", error);
      message.error(error?.data?.message);
    } finally {
      setOtpSending(false);
      setOpen(true);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    try {
      const payload = {
        email: email,
        otp: otp,
      };
      setLoading(true);
      const res = await verifyOtp(payload);
      if (res?.data?.message) {
        message.success("OTP verified");
        setTimeout(() => {
          setOpen(false);
        }, 500);
        setProgress(75);
        // setCurrentStep(3);
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

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setProgress(progress - 25);
    }
  };

  // add company
  const [companies, setCompanies] = useState([
    {
      id: Date.now(),
      companyName: "",
      designation: "",
      startDate: "",
      endDate: "",
      currentlyWorking: false,
    },
  ]);

  const handleAddCompany = () => {
    setCompanies([
      ...companies,
      {
        id: Date.now(),
        companyName: "",
        designation: "",
        startDate: "",
        endDate: "",
        currentlyWorking: false,
      },
    ]);
  };

  const handleCompanyFields = (index, fieldName, value) => {
    const updateDatas = [...companies];
    updateDatas[index][fieldName] = value;

    if (fieldName === "companyName") {
      updateDatas[index].companyNameError = nameValidator(value);
    }

    if (fieldName === "designation") {
      updateDatas[index].designationError = nameValidator(value);
    }

    if (fieldName === "startDate") {
      updateDatas[index].startDateError = selectValidator(value);
    }

    if (fieldName === "endDate") {
      updateDatas[index].endDateError = selectValidator(value);
    }

    if (fieldName === "currentlyWorking") {
      if (updateDatas[index].currentlyWorking === true) {
        updateDatas[index].endDate = "";
        updateDatas[index].endDateError = "";
      }
    }

    setCompanies(updateDatas);
  };

  const handleDeleteCompany = (index) => {
    if (companies.length === 1) return;
    let data = [...companies];
    data.splice(index, 1);
    setCompanies(data);
  };
  //

  const handleRemoveSkill = (skillToRemove) => {
    setSelectedSkills(
      selectedSkills.filter((skill) => skill !== skillToRemove)
    );
  };

  const handleCustomSkillAdd = () => {
    const trimmed = customSkill.trim();
    if (trimmed && !selectedSkills.includes(trimmed)) {
      setSelectedSkills([...selectedSkills, trimmed]);
      setCustomSkill("");
    }
  };

  const stepItems = [
    {
      title: "Personal Info",
      description: "Add your personal details",
      icon: <UserOutlined />,
      content: (
        <div className="step-content">
          <Card className="premium-card">
            <div className="avatar-section">
              <Avatar
                onClick={handAvatarClick}
                size={80}
                src={profileImage || null}
                icon={!profileImage && <UserOutlined />}
                className="profile-avatar"
              />
              <label className="image_upload" htmlFor="upload-input">
                <input
                  id="upload-input"
                  type="file"
                  accept="image/*"
                  style={{ display: "block" }}
                  onChange={handleImageChange}
                ></input>
              </label>
              <Button
                type="primary"
                shape="round"
                icon={<EditOutlined />}
                className="edit-btn"
              >
                Edit Photo
              </Button>
              <Modal
                open={isModalVisible}
                footer={null}
                onCancel={() => setIsModalVisible(false)}
                centered
                style={{ textAlign: "center", padding: 0 }}
              >
                <img
                  src={profileImage}
                  alt="Profile Zoomed"
                  style={{ width: "100%", maxWidth: "400px", margin: "auto" }}
                />
              </Modal>
            </div>
            <div className="form-section">
              <div className="form-row">
                <div className="form-group">
                  <CommonInputField
                    name="firstName"
                    label="First Name"
                    mandotary={true}
                    placeholder="Enter your first name"
                    type="text"
                    value={fname}
                    onChange={(e) => {
                      setFname(e.target.value);
                      setFnameError(nameValidator(e.target.value));
                    }}
                    readOnly={true}
                    disabled={true}
                    error={fnameError}
                  />
                </div>
                <div className="form-group">
                  <CommonInputField
                    name={"Last Name"}
                    label="Last Name"
                    mandotary={true}
                    value={lname}
                    placeholder={"Enter your last name"}
                    type={"text"}
                    onChange={(e) => {
                      setLname(e.target.value);
                      setLnameError(nameValidator(e.target.value));
                    }}
                    readOnly={true}
                    disabled={true}
                    error={lnameError}
                  />
                </div>
              </div>
              <div className="form-group">
                <CommonInputField
                  name={"Email"}
                  label="Email Address"
                  mandotary={true}
                  placeholder={"Enter your email"}
                  type={"email"}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError(emailValidator(e.target.value));
                  }}
                  readOnly={true}
                  disabled={true}
                  error={emailError}
                />
              </div>
              <div className="form-group">
                <CommonInputField
                  name={"Phone number"}
                  label="Phone Number"
                  mandotary={true}
                  placeholder={"Enter your phone number"}
                  type={"tel"}
                  value={number}
                  onChange={(e) => {
                    setNumber(e.target.value);
                    setNumberError(phoneValidation(e.target.value));
                  }}
                  readOnly={true}
                  disabled={true}
                  error={numberError}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <CommonSelectField
                    label="Country"
                    name="country"
                    mandatory={true}
                    placeholder="Select Country"
                    options={countryList.map((country) => ({
                      label: country.name,
                      value: country.isoCode,
                    }))}
                    showSearch={true}
                    onChange={(value) => {
                      handleCountryChange(value);
                      setCountry(value);
                      setCountryError(selectValidator(value));
                    }}
                    error={countryError}
                  />
                </div>
                <div className="form-group">
                  <CommonSelectField
                    label="State"
                    name="state"
                    disabled={!countryId}
                    mandatory={true}
                    placeholder="Select State"
                    options={stateList.map((state) => ({
                      label: state.name,
                      value: state.name,
                    }))}
                    onChange={(value) => {
                      handleStateChange(value);
                      setState(value);
                      setStateError(selectValidator(value));
                    }}
                    showSearch={true}
                    error={stateError}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <CommonSelectField
                    label="City"
                    name="city"
                    mandatory={true}
                    placeholder="Select City"
                    options={cityList}
                    onChange={(value) => {
                      handleCityChange(value);
                      setCity(value);
                      setCityError(selectValidator(value));
                    }}
                    showSearch={true}
                    error={cityError}
                  />
                </div>

                <div className="form-group">
                  <CommonInputField
                    name={"Pincode"}
                    label="Pincode"
                    mandotary={true}
                    placeholder={"Enter your pincode"}
                    type={"number"}
                    onChange={(e) => {
                      setPincode(e.target.value);
                      setPincodeError(pincodeValidator(e.target.value));
                    }}
                    error={pincodeError}
                  />
                </div>
              </div>
              <div className="form-group">
                <CommonTextArea
                  label={"Address"}
                  name={"address"}
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                  }}
                  placeholder={"Enter Your Address"}
                />
              </div>
            </div>
          </Card>
        </div>
      ),
    },
    {
      title: "Professional Info",
      description: "Add your professional details",
      icon: <SolutionOutlined />,
      content: (
        <div className="step-content">
          <Card className="premium-card">
            <div className="form-section">
              <div style={{ marginBottom: 20 }} className="form-group">
                <CommonSelectField
                  label="Fresher / Experience"
                  name="fresherexperience"
                  mandatory={true}
                  placeholder="Select Experience"
                  options={[
                    {
                      value: "Fresher",
                      label: "Fresher",
                    },
                    {
                      value: "Experience",
                      label: "Experience",
                    },
                  ]}
                  onChange={(value) => {
                    handleExperienceTypeChange(value);
                    setSelectExperienceType(value);
                    setSelectExperienceTypeError(selectValidator(value));
                  }}
                  showSearch={true}
                  error={selectExperienceTypeError}
                />
              </div>
              {experienceType === "Experience" && (
                <div className="forexprience">
                  <div className="form-row">
                    <div className="form-group">
                      <CommonSelectField
                        label=" Total Years of Experience"
                        name="totalexperience"
                        mandatory={true}
                        placeholder="Select Experience"
                        options={[
                          {
                            value: "0 Years",
                            label: "0 Years",
                          },
                          {
                            value: "1 Years",
                            label: "1 Years",
                          },
                          {
                            value: "2 Years",
                            label: "2 Years",
                          },
                          {
                            value: "3 Years",
                            label: "3 Years",
                          },
                          {
                            value: "4 Years",
                            label: "4 Years",
                          },
                          {
                            value: "5 Years",
                            label: "5 Years",
                          },
                          {
                            value: "6 Years",
                            label: "6 Years",
                          },
                          {
                            value: "7 Years",
                            label: "7 Years",
                          },
                          {
                            value: "8 Years",
                            label: "8 Years",
                          },
                          {
                            value: "9 Years",
                            label: "9 Years",
                          },
                          {
                            value: "10 Years",
                            label: "10 Years",
                          },
                          {
                            value: "11 Years",
                            label: "11 Years",
                          },
                        ]}
                        showSearch={true}
                        onChange={(value) => {
                          setTotalYearsExperience(value);
                          setTotalYearsExperienceError(selectValidator(value));
                        }}
                        error={totalYearsExperienceError}
                      />
                    </div>
                    <div className="form-group">
                      <CommonSelectField
                        label="Total Months of Experience"
                        name="experiencemonth"
                        mandatory={true}
                        placeholder="Select Experience"
                        options={[
                          {
                            value: "0 Month",
                            label: "0 Month",
                          },
                          {
                            value: "1 Month",
                            label: "1 Month",
                          },
                          {
                            value: "2 Months",
                            label: "2 Months",
                          },
                          {
                            value: "3 Months",
                            label: "3 Months",
                          },
                          {
                            value: "4 Months",
                            label: "4 Months",
                          },
                          {
                            value: "5 Months",
                            label: "5 Months",
                          },
                          {
                            value: "6 Months",
                            label: "6 Months",
                          },
                          {
                            value: "7 Months",
                            label: "7 Months",
                          },
                          {
                            value: "8 Months",
                            label: "8 Months",
                          },
                          {
                            value: "9 Months",
                            label: "9 Months",
                          },
                          {
                            value: "10 Months",
                            label: "10 Months",
                          },
                          {
                            value: "11 Months",
                            label: "11 Months",
                          },
                          {
                            value: "12 Months",
                            label: "12 Months",
                          },
                        ]}
                        onChange={(value) => {
                          setTotalMonthsExperience(value);
                          setTotalMonthsExperienceError(selectValidator(value));
                        }}
                        showSearch={true}
                        error={totalMonthsExperienceError}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <CommonInputField
                      name={"Job title"}
                      label="Job Title"
                      mandotary={true}
                      value={jobTitle}
                      placeholder={"Software Engineer"}
                      type={"text"}
                      onChange={(e) => {
                        setJobTitle(e.target.value);
                        setJobTitleError(nameValidator(e.target.value));
                      }}
                      error={jobTitleError}
                    />
                  </div>
                  {companies.map((company, index) => (
                    <div className="add-company-section" key={index}>
                      <div style={{ display: "flex", justifyContent: "end" }}>
                        {index == 0 ? (
                          ""
                        ) : (
                          <MdDeleteForever
                            onClick={() => handleDeleteCompany(index)}
                            name={["companies", index, "job-delete"]}
                            className="job-delete"
                          />
                        )}
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <CommonInputField
                            label=" Company name"
                            mandotary={true}
                            placeholder={"Tech Corp Inc."}
                            value={company.companyName}
                            error={company.companyNameError}
                            onChange={(e) =>
                              handleCompanyFields(
                                index,
                                "companyName",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="form-group">
                          <CommonInputField
                            label=" Designation"
                            mandotary={true}
                            placeholder={"Enter your designation"}
                            value={company.designation}
                            error={company.designationError}
                            onChange={(e) =>
                              handleCompanyFields(
                                index,
                                "designation",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="from-group">
                          <CommonDatePicker
                            label="Start Date"
                            value={company.startDate}
                            error={company.startDateError}
                            onChange={(value) =>
                              handleCompanyFields(index, "startDate", value)
                            }
                          />
                        </div>
                        <div className="from-group">
                          <CommonDatePicker
                            label="End Date"
                            value={company.endDate}
                            error={company.endDateError}
                            onChange={(value) =>
                              handleCompanyFields(index, "endDate", value)
                            }
                            disabled={
                              company.currentlyWorking === true ? true : false
                            }
                          />
                        </div>
                      </div>
                      <div
                        style={{ marginTop: 15 }}
                        className="professional-checkbox"
                      >
                        <Checkbox
                          checked={company.currentlyWorking}
                          onChange={(e) =>
                            handleCompanyFields(
                              index,
                              "currentlyWorking",
                              e.target.checked
                            )
                          }
                        >
                          Currently Working?
                        </Checkbox>
                      </div>
                    </div>
                  ))}

                  <div
                    style={{ display: "flex", justifyContent: "end" }}
                    className=""
                  >
                    <Button onClick={handleAddCompany} className="add-btn">
                      Add Company <IoMdAdd className="add-icon" />
                    </Button>
                  </div>
                </div>
              )}

              <div className="form-group">
                <div style={{ marginTop: 8, marginBottom: 0 }}>
                  {selectedSkills.map((skill) => (
                    <Tag
                      key={skill}
                      closable
                      onClose={() => handleRemoveSkill(skill)}
                      style={{
                        marginBottom: 15,
                        fontSize: 14,
                        padding: "5px 10px",
                        border: "none",
                        backgroundColor: "#e9e0fe",
                        color: "#5f2eea",
                        borderRadius: 50,
                      }}
                    >
                      {skill}
                    </Tag>
                  ))}
                </div>

                <CommonInputField
                  label={"Skills"}
                  onPressEnter={handleCustomSkillAdd}
                  value={customSkill}
                  name={"skills"}
                  onChange={(e) => {
                    setCustomSkill(e.target.value);
                    setSkillsError(selectValidator(e.target.value));
                  }}
                  mandotary={true}
                  placeholder={
                    "List your skills here, showcasing what you excel at."
                  }
                  error={skillsError}
                />
              </div>
            </div>
          </Card>
        </div>
      ),
    },
    {
      title: "Verification",
      description: "Verify your identity",
      icon: <CreditCardOutlined />,
      content: (
        <div className="step-content">
          <Card className="premium-card">
            <div className="verification-section">
              <div
                className="verification-item"
                style={{ display: "flex", alignItems: "center", gap: 12 }}
              >
                {emailVerified === "Verified" ? (
                  <CheckCircleOutlined
                    style={{ color: "green", fontSize: 20 }}
                  />
                ) : (
                  <CloseCircleOutlined
                    style={{
                      color: emailVerified ? "red" : "gray",
                      fontSize: 20,
                    }}
                  />
                )}
                <Text strong>Email Verification</Text>
                <Button
                  type="primary"
                  size="large"
                  onClick={verifyEmailData}
                  className="nav-btn next-btn"
                  loading={otpSending}
                >
                  Verify Email
                </Button>
              </div>
              <Divider />
              {/* <div
                className="verification-item"
                style={{ display: "flex", alignItems: "center", gap: 12 }}
              >
                {numberVerified === "Verified" ? (
                  <CheckCircleOutlined
                    style={{ color: "green", fontSize: 20 }}
                  />
                ) : (
                  <CloseCircleOutlined
                    style={{
                      color:
                        numberVerified &&
                        numberVerified !== "Pending Verification"
                          ? "red"
                          : "gray",
                      fontSize: 20,
                    }}
                  />
                )}
                <Text strong>Phone Verification</Text>
                <Text
                  type={
                    numberVerified === "Verified"
                      ? "success"
                      : numberVerified === "Pending Verification"
                      ? "warning"
                      : numberVerified
                      ? "danger"
                      : "secondary"
                  }
                  style={{ marginLeft: "auto" }}
                >
                  {numberVerified || "Not Checked"}
                </Text>
              </div> */}
            </div>
          </Card>
        </div>
      ),
    },
    {
      title: "Completion",
      description: "Profile setup complete",
      icon: <CheckCircleOutlined />,
      content: (
        <div className="step-content">
          <Card className="premium-card completion-card">
            <div className="completion-content">
              <CheckCircleOutlined className="success-icon" />
              <Title level={3}>Profile Setup Complete!</Title>
              <Text type="secondary">
                Your profile has been successfully set up. You can now access
                all features.
              </Text>
              <Button type="primary" size="large" className="dashboard-btn">
                Go to Dashboard <ArrowRightOutlined />
              </Button>
            </div>
          </Card>
        </div>
      ),
    },
  ];

  return (
    <div className="profile-details-container">
      <div className="profile-header">
        <Title level={2}>Complete Your Profile</Title>
        <Text type="secondary">
          Follow these steps to set up your professional profile
        </Text>
      </div>

      <div className="progress-container">
        <Progress percent={progress} strokeColor="#8d3ffb" showInfo={false} />
        <Text strong>{progress}% Complete</Text>
      </div>
      <Form
        form={form}
        layout="vertical"
        name="multi-step-form"
        className="multi-step-form"
      >
        <Steps
          current={currentStep}
          items={stepItems.map((item) => ({
            title: item.title,
            description: item.description,
            icon: item.icon,
          }))}
          className="premium-steps"
        />

        <Divider className="section-divider" />

        <div className="step-content-container">
          {stepItems[currentStep].content}
        </div>

        <div className="navigation-buttons">
          {currentStep > 0 && (
            <Button
              size="large"
              onClick={prevStep}
              className="nav-btn prev-btn"
            >
              Previous
            </Button>
          )}

          {currentStep === 2 ? (
            ""
          ) : currentStep < stepItems.length - 1 ? (
            <Button
              type="primary"
              size="large"
              onClick={nextStep}
              className="nav-btn next-btn"
            >
              Next Step
            </Button>
          ) : null}

          {/* <Button
            type="primary"
            size="large"
            onClick={doneProfile}
            className="nav-btn next-btn"
          >
            send profile
          </Button> */}
        </div>
        <Modal
          title="Forgot Password"
          open={open}
          onCancel={handleModalClose}
          footer={null}
        >
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
        </Modal>
      </Form>
    </div>
  );
};

export default ProfileDetails;
