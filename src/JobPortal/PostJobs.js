import React, { useState } from "react";
import {
  Row,
  Col,
  Avatar,
  Button,
  Modal,
  Typography,
  Form,
  Input,
  Select,
  Text,
  Switch,
  InputNumber,
  Space,
  Selected,
  Tag,
  Divider,
  Card,
  message,
} from "antd";
import {
  UserOutlined,
  SolutionOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  ArrowRightOutlined,
  MailOutlined,
  LineChartOutlined,
  MedicineBoxOutlined,
  CarOutlined,
  CoffeeOutlined,
} from "@ant-design/icons";
import { HiMiniComputerDesktop } from "react-icons/hi2";
import { MdOutlineEventNote } from "react-icons/md";
import { TbContract } from "react-icons/tb";
import { PiOfficeChairLight } from "react-icons/pi";
import { IoHomeOutline } from "react-icons/io5";
import { FaTruckFieldUn } from "react-icons/fa6";
import { FaCalendarDay } from "react-icons/fa6";
import { FaCalendarDays } from "react-icons/fa6";
import { FaPersonCircleExclamation } from "react-icons/fa6";
import { FaPersonCircleCheck } from "react-icons/fa6";
import { FaBusinessTime } from "react-icons/fa";
import { MdFileDownloadDone } from "react-icons/md";
import { LuLocateFixed } from "react-icons/lu";
import { RiEqualizerLine } from "react-icons/ri";
import { FaAngleUp } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa";
import { FaHeartCircleCheck } from "react-icons/fa6";
import { style } from "framer-motion/client";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import CommonInputField from "../Common/CommonInputField";
import CommonSelectField from "../Common/CommonSelectField";
import { nameValidator, selectValidator } from "../Common/Validation";
const { Option } = Select;
const { Group: InputGroup } = Input;
export default function PostJobs() {
  const [companyLogo, setCompanyLogo] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
  const [workTypeActiveButton, setWorkTypeActiveButton] = useState(null);
  const [internshipDurationActiveButton, setInternshipDurationActiveButton] =
    useState(null);
  const [weeksActiveButton, setWeeksActiveButton] = useState(null);
  const [monthsActiveButton, setMonthsActiveButton] = useState(null);
  const [workLocationActiveButton, setWorkLocationActiveButton] =
    useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isFirstSwitchChecked, setIsFirstSwitchChecked] = useState(false);
  const { Title, Text } = Typography;
  const [experienceRequiredActiveButton, setExperienceRequiredActiveButton] =
    useState(null);
  const [fresherPassActiveButton, setFresherPassActiveButton] = useState(null);
  const [salaryTypeActiveButton, setSalaryTypeActiveButton] = useState(null);
  const [diversityenabled, setDiversityEnabled] = useState(true);
  const [genderselected, setGenderSelected] = useState("All");
  const [otherBenifitselected, setOtherBenifitSelected] = useState("stock");
  const [showMore, setShowMore] = useState(false);
  //
  const [companyName, setCompanyName] = useState("");
  const [companyNameError, setCompanyNameError] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobTitleError, setJobTitleError] = useState("");
  const [jobNature, setJobNature] = useState("");
  const [jobNatureError, setJobNatureError] = useState("");
  const [workplaceType, setWorkplaceType] = useState("");
  const [workplaceTypeError, setWorkplaceTypeError] = useState("");
  const [jobCategory, setJobCategory] = useState("");
  const [jobCategoryError, setJobCategoryError] = useState("");
  const [skillsRequired, setSkillsRequired] = useState("");
  const [skillsRequiredError, setSkillsRequiredError] = useState("");
  const [salaryDetails, setSalaryDetails] = useState("");
  const [salaryDetailsError, setSalaryDetailsError] = useState("");

  const jobNatureOptions = [
    { id: 1, name: "Job" },
    { id: 2, name: "Internship" },
    { id: 3, name: "Contract" },
  ];

  const workPlaceType = [
    { id: 1, name: "In Office" },
    { id: 2, name: "Work From Home" },
    { id: 3, name: "On Field" },
    { id: 4, name: "Hybrid" },
  ];

  const internshipDuration = [
    { id: 1, name: "In Weeks" },
    { id: 2, name: "In Months" },
  ];

  const weeks = [
    { id: 1, name: "1 Week" },
    { id: 2, name: "2 Weeks" },
    { id: 3, name: "3 Weeks" },
  ];

  const months = [
    { id: 1, name: "1 Month" },
    { id: 2, name: "2 Months" },
    { id: 3, name: "3 Months" },
    { id: 3, name: "4 Months" },
    { id: 3, name: "5 Months" },
    { id: 3, name: "6 Months" },
    { id: 3, name: "7 Months" },
    { id: 3, name: "8 Months" },
    { id: 3, name: "9 Months" },
    { id: 3, name: "10 Months" },
    { id: 3, name: "11 Months" },
    { id: 3, name: "12 Months" },
  ];

  const work_location = [
    { id: 1, name: "Specific Location" },
    { id: 2, name: "Pan India" },
  ];

  const experienceRequired = [
    { id: 1, name: "Fresher" },
    { id: 2, name: "Experienced" },
  ];

  const fresherPass = [
    { id: 1, name: "All" },
    { id: 2, name: "2021" },
    { id: 2, name: "2022" },
    { id: 2, name: "2023" },
    { id: 2, name: "2024" },
  ];

  const salaryType = [
    { id: 1, name: "Fixed" },
    { id: 2, name: "Range" },
  ];

  const diversityOptions = [
    "All",
    "Female",
    "Male",
    "Transgender",
    "Intersex",
    "Non-binary",
    "Others",
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const imageURL = URL.createObjectURL(file);
      setProfileImage(imageURL);
    }
  };

  const openModal = () => {
    setIsModalVisible(true);
  };

  const onFirstSwitchChange = (checked) => {
    setIsFirstSwitchChecked(checked);
  };

  const handleTagClick = (tag) => {
    setGenderSelected(tag);
  };

  const allBenefits = [
    { key: "stock", icon: <LineChartOutlined />, label: "Employee Stock" },
    {
      key: "insurance",
      icon: <MedicineBoxOutlined />,
      label: "Medical Insurance",
    },
    { key: "transport1", icon: <CarOutlined />, label: "Transport" },
    { key: "food1", icon: <CoffeeOutlined />, label: "Food & Beverages" },
    { key: "transport2", icon: <CarOutlined />, label: "Transport" },
    { key: "food2", icon: <CoffeeOutlined />, label: "Food & Beverages" },
    { key: "transport3", icon: <CarOutlined />, label: "Transport" },
    { key: "food3", icon: <CoffeeOutlined />, label: "Food & Beverages" },
    { key: "transport4", icon: <CarOutlined />, label: "Transport" },
    { key: "food4", icon: <CoffeeOutlined />, label: "Food & Beverages" },
  ];

  const visibleBenefits = showMore ? allBenefits : allBenefits.slice(0, 4);

  const defaultContent = `
  <p><strong>About the Opportunity:</strong></p>
  <ul><li></li><li></li></ul>
  <p><strong>Responsibilities of the Candidate:</strong></p>
  <ul><li></li><li></li></ul>
  <p><strong>Requirements:</strong></p>
  <ul><li></li><li></li></ul>
`;

  const MAX_LENGTH = 3000;
  const [value, setValue] = useState(defaultContent);

  const handleChange = (content, delta, source, editor) => {
    if (editor.getLength() <= MAX_LENGTH + 1) {
      setValue(content);
    }
  };

  const generateWithAI = () => {
    // Replace this with actual AI call
    const aiContent = `
      <p><strong>About the Opportunity:</strong></p>
      <ul><li>Work in a dynamic, collaborative team environment</li><li>Opportunity to influence product roadmap</li></ul>
      <p><strong>Responsibilities of the Candidate:</strong></p>
      <ul><li>Lead feature development and deployment</li><li>Collaborate cross-functionally with designers and PMs</li></ul>
      <p><strong>Requirements:</strong></p>
      <ul><li>3+ years of React development experience</li><li>Good understanding of RESTful APIs and UI/UX principles</li></ul>
    `;
    setValue(aiContent);
  };

  const handlePublishPost = (e) => {
    e.preventDefault();

    const companyNameValidate = nameValidator(companyName);
    const jobTitleValidate = nameValidator(jobTitle);
    const jobNatureValidate = selectValidator(jobNature);
    const workplaceTypeValidate = selectValidator(workplaceType);
    const jobCategoryValidate = selectValidator(jobCategory);
    const skillsRequiredValidate = selectValidator(skillsRequired);
    const salaryDetailsValidate = selectValidator(salaryDetails);

    setCompanyNameError(companyNameValidate);
    setJobTitleError(jobTitleValidate);
    setJobNatureError(jobNatureValidate);
    setWorkplaceTypeError(workplaceTypeValidate);
    setJobCategoryError(jobCategoryValidate);
    setSkillsRequiredError(skillsRequiredValidate);
    setSalaryDetailsError(salaryDetailsValidate);

    if (setWorkplaceTypeError == "") {
    }

    const hasPostJobError = [
      companyNameValidate,
      jobTitleValidate,
      jobNatureValidate,
      workplaceTypeValidate,
      jobCategoryValidate,
      skillsRequiredValidate,
      salaryDetailsValidate,
    ].some((val) => val !== "");

    if (hasPostJobError) {
      console.log("error publish the post");
      message.error("Please fill all fields correctly before proceeding.");
      return;
    }
    console.log("All validations passed");

    const postJobData = {
      companyName: companyName,
      jobTitle: jobTitle,
      jobNature: jobNature,
      workplaceType: workplaceType,
      jobCategory: jobCategory,
      skillsRequired: skillsRequired,
      salaryDetails: salaryDetails,
    };

    console.log("Saving Job post data:", postJobData);
    message.success("Job post details saved successfully.");
  };

  return (
    <section className="post_jobs_section">
      <Row>
        <Col lg={13} md={13} sm={24} xs={24}>
          <div style={{ textAlign: "left" }}>
            <h3 style={{ fontSize: 20 }}>Post New Job</h3>
          </div>

          <div
            style={{
              position: "relative",
              textAlign: "center",
              paddingBottom: "20px",
            }}
            className=""
          >
            <Avatar
              onClick={openModal}
              size={80}
              src={profileImage || null}
              icon={!profileImage && <UserOutlined />}
              className="profile-avatar"
            />
            <br></br>
            <label className="image_upload" htmlFor="upload-input">
              Click me
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
              Change Logo
            </Button>
          </div>

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

          <CommonInputField
            name={"Company name"}
            label="Company you are hiring for"
            mandotary={true}
            placeholder={"Enter your company name"}
            type={"text"}
            value={companyName}
            onChange={(e) => {
              setCompanyName(e.target.value);
              setCompanyNameError(nameValidator(e.target.value));
            }}
            error={companyNameError}
          />

          <div className="form-group">
            <CommonInputField
              name={"Job title"}
              label="Job Title/Role"
              mandotary={true}
              placeholder={"Enter your job title"}
              type={"text"}
              value={jobTitle}
              onChange={(e) => {
                setJobTitle(e.target.value);
                setJobTitleError(nameValidator(e.target.value));
              }}
              error={jobTitleError}
            />
          </div>

          <div className="form-group">
            <Form.Item
              layout="vertical"
              label={<span style={{ fontWeight: 500 }}>Job Nature</span>}
              name="jobnature"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <div className="job_nature">
                {jobNatureOptions.map((item, index) => {
                  return (
                    <button
                      type="button"
                      key={index}
                      className={
                        index === activeButton
                          ? "job_nature_button_active"
                          : "job_nature_button"
                      }
                      onClick={() => {
                        setActiveButton(index);
                        setJobNature(item.name);
                        setJobNatureError(selectValidator(item.name));

                        const selectedType = jobNatureOptions[index]?.name;
                        if (selectedType !== "Internship") {
                          setInternshipDurationActiveButton(null);
                          setWeeksActiveButton(null);
                          setMonthsActiveButton(null);
                        }
                      }}
                    >
                      {item.name === "Job" ? (
                        <HiMiniComputerDesktop />
                      ) : item.name === "Internship" ? (
                        <MdOutlineEventNote />
                      ) : (
                        <TbContract />
                      )}{" "}
                      {item.name}
                    </button>
                  );
                })}
              </div>
              {jobNatureError && (
                <div
                  className="error-message"
                  style={{ color: "red", marginTop: "8px" }}
                >
                  {jobNatureError}
                </div>
              )}
            </Form.Item>
          </div>

          <div style={{ marginTop: 15 }} className="form-group">
            {jobNatureOptions[activeButton]?.name === "Internship" && (
              <Form.Item
                layout="vertical"
                label={
                  <span style={{ fontWeight: 500 }}>Internships Duration</span>
                }
                name="internship_duration"
                rules={[
                  {
                    required: true,
                    message: "Please Choose your Internships Duration",
                  },
                ]}
              >
                <div className="job_nature">
                  {internshipDuration.map((item, index) => {
                    return (
                      <button
                        className={
                          index === internshipDurationActiveButton
                            ? "internship_duration_button_active"
                            : "internship_duration_button"
                        }
                        onClick={() => {
                          setInternshipDurationActiveButton(index);
                        }}
                      >
                        {item.name === "In Weeks" ? (
                          <FaCalendarDay />
                        ) : item.name === "In Months" ? (
                          <FaCalendarDays />
                        ) : (
                          <TbContract />
                        )}{" "}
                        {item.name}
                      </button>
                    );
                  })}
                </div>
              </Form.Item>
            )}
          </div>

          <div className="form-group">
            {jobNatureOptions[activeButton]?.name === "Internship" &&
              internshipDuration[internshipDurationActiveButton]?.name ===
                "In Weeks" && (
                <div className="job_nature">
                  {weeks.map((item, index) => (
                    <button
                      type="button"
                      key={index}
                      className={
                        index === weeksActiveButton
                          ? "weeks_button_active"
                          : "weeks_button"
                      }
                      onClick={() => setWeeksActiveButton(index)}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              )}

            {jobNatureOptions[activeButton]?.name === "Internship" &&
              internshipDuration[internshipDurationActiveButton]?.name ===
                "In Months" && (
                <div className="job_nature">
                  {months.map((item, index) => (
                    <button
                      type="button"
                      key={index}
                      className={
                        index === monthsActiveButton
                          ? "months_button_active"
                          : "months_button"
                      }
                      onClick={() => setMonthsActiveButton(index)}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              )}
          </div>

          <div style={{ marginTop: 15 }} className="form-group">
            <div className="job_nature">
              <Form.Item
                layout="vertical"
                name={"workplaceType"}
                label={<span style={{ fontWeight: 500 }}>Workplace Type</span>}
                style={{ marginBottom: "0px" }}
                rules={[
                  {
                    required: true,
                    message: "Please enter your Workplace Type",
                  },
                ]}
              >
                <div className="work_type">
                  {workPlaceType.map((item, index) => (
                    <button
                      type="button"
                      key={index}
                      className={
                        index === workTypeActiveButton
                          ? "work_type_button_active"
                          : "work_type_button"
                      }
                      onClick={() => {
                        setWorkTypeActiveButton(index);
                        setWorkplaceType(item.name);
                        const error = selectValidator(item.name);
                        setWorkplaceTypeError(error);

                        if (error === "") {
                          console.log("Workplace type is valid!");
                        }
                      }}
                    >
                      {item.name === "In Office" ? (
                        <PiOfficeChairLight />
                      ) : item.name === "Work From Home" ? (
                        <IoHomeOutline />
                      ) : item.name === "On Field" ? (
                        <FaTruckFieldUn />
                      ) : (
                        <TbContract />
                      )}{" "}
                      {item.name}
                    </button>
                  ))}
                </div>
                {workplaceTypeError && (
                  <div
                    className="error-message"
                    style={{ color: "red", marginTop: "8px" }}
                  >
                    {workplaceTypeError}
                  </div>
                )}
              </Form.Item>
            </div>
            
          </div>

          <div style={{ marginTop: 15 }} className="form-group">
            {(workPlaceType[workTypeActiveButton]?.name === "In Office" ||
              workPlaceType[workTypeActiveButton]?.name === "On Field" ||
              workPlaceType[workTypeActiveButton]?.name === "Hybrid") && (
              <Form.Item
                layout="vertical"
                label={<span style={{ fontWeight: 500 }}>Work Location</span>}
                name="fname"
                rules={[
                  {
                    required: true,
                    message: "Please enter your Work Location",
                  },
                ]}
              >
                <div className="job_nature">
                  {work_location.map((item, index) => {
                    return (
                      <button
                        type="button"
                        key={index}
                        className={
                          index === workLocationActiveButton
                            ? "work_location_button_active"
                            : "work_location_button"
                        }
                        onClick={() => setWorkLocationActiveButton(index)}
                      >
                        {item.name}
                      </button>
                    );
                  })}
                </div>

                {work_location[workLocationActiveButton]?.name ===
                "Specific Location" ? (
                  <CommonSelectField
                    style={{ marginTop: "20px" }}
                    showSearch={true}
                    placeholder={"Select Location"}
                    options={[
                      { value: "1", label: "Chennai" },
                      { value: "2", label: "Mumbai" },
                      { value: "3", label: "Bangalore" },
                    ]}
                  />
                ) : null}
              </Form.Item>
            )}
          </div>
          {/*  */}

          {/* Job category */}
          <div style={{ marginTop: 15 }} className="form-group">
            <CommonSelectField
              label={"Job Category"}
              showSearch={true}
              value={jobCategory}
              mandatory={true}
              name={"Job category"}
              placeholder={"Select Location"}
              options={[
                { value: "1", label: "Chennai" },
                { value: "2", label: "Mumbai" },
                { value: "3", label: "Bangalore" },
              ]}
              onChange={(value) => {
                setJobCategory(value);
                setJobCategoryError(selectValidator(value));
              }}
              error={jobCategoryError}
            />

            <CommonSelectField
              label={"Skills Required"}
              mandatory={true}
              name={"skill_required"}
              showSearch={true}
              placeholder={"Select Location"}
              options={[
                { value: "1", label: "Chennai" },
                { value: "2", label: "Mumbai" },
                { value: "3", label: "Bangalore" },
              ]}
              onChange={(value) => {
                setSkillsRequired(value);
                setSkillsRequiredError(selectValidator(value));
              }}
              error={skillsRequiredError}
            />
          </div>

          <div className="eligibility">
            <h4>Eligibility</h4>
            <p>Add the eligibility criteria to better filter the candidates.</p>
            <div className="switch_button">
              <Text className="p">
                Open for college students (currently studying)
              </Text>
              <Switch
                size="default"
                checked={isFirstSwitchChecked}
                onChange={onFirstSwitchChange}
              />
            </div>

            {isFirstSwitchChecked && (
              <div className="switch_button">
                <Text className="p">
                  Any specific course/ specialization/ graduating year
                </Text>
                <Switch
                  size="small"
                  defaultChecked
                  onChange={(checked) => console.log("Second:", checked)}
                />
              </div>
            )}

            <div className="experience_required">
              <p>Experience Required (In Years)</p>
              <div className="job_nature">
                {experienceRequired.map((item, index) => {
                  return (
                    <button
                      className={
                        index === experienceRequiredActiveButton
                          ? "experience_required_button_active"
                          : "experience_required_button"
                      }
                      onClick={() => setExperienceRequiredActiveButton(index)}
                    >
                      {item.name === "Fresher" ? (
                        <FaPersonCircleExclamation />
                      ) : item.name === "Experienced" ? (
                        <FaPersonCircleCheck />
                      ) : (
                        <TbContract />
                      )}{" "}
                      {item.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="experience_required">
              {experienceRequired[experienceRequiredActiveButton]?.name ===
              "Fresher" ? (
                <>
                  <p>Experience Required (In Years)</p>
                  <div className="job_nature">
                    {fresherPass.map((item, index) => (
                      <button
                        key={index}
                        className={
                          index === fresherPassActiveButton
                            ? "fresher_pass_button_active"
                            : "fresher_pass_button"
                        }
                        onClick={() => setFresherPassActiveButton(index)}
                      >
                        {item.name === "All" ? (
                          <MdFileDownloadDone />
                        ) : (
                          <FaBusinessTime />
                        )}{" "}
                        {item.name}
                      </button>
                    ))}
                  </div>
                </>
              ) : null}

              {experienceRequired[experienceRequiredActiveButton]?.name ===
              "Experienced" ? (
                <>
                  <div className="">
                    <CommonInputField
                      name={"Experience"}
                      label="Experience required"
                      mandotary={false}
                      placeholder={"Enter your Experience"}
                      type={"text"}
                    />
                  </div>
                </>
              ) : null}
            </div>
          </div>

          <div className="salary_details">
            <h4>Salary Details</h4>
            <p>
              Add compensation details to filter better candidates and speed up
              the sourcing process.
            </p>
            <Form.Item
              layout="vertical"
              label={<h5>Salary Type</h5>}
              name="internship_duration"
            >
              <div className="job_nature">
                {salaryType.map((item, index) => (
                  <button
                    key={index}
                    className={
                      index === salaryTypeActiveButton
                        ? "experience_required_button_active"
                        : "experience_required_button"
                    }
                    onClick={() => {
                      setSalaryTypeActiveButton(index);
                      setSalaryDetails(item.name);
                      setSalaryDetailsError(selectValidator(item.name));
                    }}
                  >
                    {item.name === "Fixed" ? (
                      <LuLocateFixed />
                    ) : item.name === "Range" ? (
                      <RiEqualizerLine />
                    ) : (
                      <TbContract />
                    )}{" "}
                    {item.name}
                  </button>
                ))}
              </div>
              {salaryDetailsError && (
                <div
                  className="error-message"
                  style={{ color: "red", marginTop: "8px" }}
                >
                  {salaryDetailsError}
                </div>
              )}
            </Form.Item>

            {salaryType[salaryTypeActiveButton]?.name === "Fixed" && (
              <div className="salary_details_inner">
                <h5>Salary Figure</h5>
                <p>The salary on the job page will be shown in years only.</p>
                <div className="job_nature">
                  <Input
                    addonBefore={
                      <Select
                        defaultValue="INR"
                        style={{ width: 90, border: "none" }}
                      >
                        <Option value="INR">₹ (INR)</Option>
                        <Option value="USD">$ (USD)</Option>
                        <Option value="EUR">€ (EUR)</Option>
                      </Select>
                    }
                    placeholder="Enter amount"
                  />
                </div>
              </div>
            )}

            {salaryType[salaryTypeActiveButton]?.name === "Range" && (
              <div className="salary_details_inner">
                <h5>Salary Figure</h5>
                <p>The salary on the job page will be shown in years only.</p>
                <div className="job_nature">
                  <InputGroup compact>
                    <Select defaultValue="INR" style={{ width: 100 }}>
                      <Option value="INR">₹ (INR)</Option>
                      <Option value="USD">$ (USD)</Option>
                      <Option value="EUR">€ (EUR)</Option>
                    </Select>
                    <InputNumber
                      className="premium-input"
                      style={{ width: "30%", textAlign: "center" }}
                      placeholder="Min"
                      min={0}
                    />
                    <InputNumber
                      className="premium-input"
                      style={{ width: "30%", textAlign: "center" }}
                      placeholder="Max"
                      min={0}
                    />
                  </InputGroup>
                </div>
              </div>
            )}
          </div>

          <div
            className="diversity_options"
            style={{
              background: "#f8f9fa",
              padding: 16,
              borderRadius: 8,
              border: "1px solid #e0e0e0",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <Text strong>Diversity Hiring</Text>
              <Switch
                checked={diversityenabled}
                onChange={setDiversityEnabled}
              />
            </div>
            <Divider style={{ margin: "8px 0px 15px 0" }} />
            {diversityenabled && (
              <Space wrap>
                {diversityOptions.map((tag) => (
                  <Tag.CheckableTag
                    key={tag}
                    checked={genderselected === tag}
                    onChange={() => handleTagClick(tag)}
                    style={{
                      border: "1px dashed #ccc",
                      borderRadius: 8,
                      padding: "4px 12px",
                    }}
                  >
                    {tag}
                  </Tag.CheckableTag>
                ))}
              </Space>
            )}
          </div>

          <div className="other_benifits">
            <div className="job_nature">
              <Text strong>Other Benefits</Text>
              <Row gutter={[16, 16]} style={{ marginTop: 8 }}>
                {visibleBenefits.map((item) => (
                  <Col key={item.key}>
                    <Card
                      hoverable
                      onClick={() => setOtherBenifitSelected(item.key)}
                      style={{
                        width: 140,
                        textAlign: "center",
                        border:
                          otherBenifitselected === item.key
                            ? "2px dashed #6a00ff"
                            : "1px dashed #ccc",
                        background:
                          otherBenifitselected === item.key
                            ? "#6a00ff14"
                            : "#fff",
                        borderRadius: 8,
                      }}
                    >
                      <div style={{ fontSize: 24, marginBottom: 4 }}>
                        {item.icon}
                      </div>
                      <Text>{item.label}</Text>
                    </Card>
                  </Col>
                ))}
              </Row>
              <Button
                type="link"
                onClick={() => setShowMore(!showMore)}
                style={{ marginTop: 12, color: "#6a00ff" }}
              >
                {showMore ? (
                  <>
                    View Less <FaAngleUp />
                  </>
                ) : (
                  <>
                    View More <FaAngleDown />
                  </>
                )}
              </Button>
            </div>
          </div>

          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
                marginTop: 28,
              }}
            >
              <label style={{ fontWeight: "bold" }}>Job Description</label>
              <button
                onClick={generateWithAI}
                style={{
                  backgroundColor: "#6a00ff",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  color: "#fff",
                  border: "none",
                }}
              >
                🧠 Generate with AI
              </button>
            </div>

            <ReactQuill
              value={value}
              onChange={handleChange}
              modules={{
                toolbar: [
                  ["bold", "italic", "underline", "strike"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link", "image"],
                  ["clean"],
                ],
              }}
              formats={[
                "bold",
                "italic",
                "underline",
                "strike",
                "list",
                "bullet",
                "link",
                "image",
              ]}
              style={{ height: "300px", marginBottom: "8px" }}
            />

            <div
              style={{
                textAlign: "right",
                fontSize: 12,
                color: value.length >= MAX_LENGTH ? "red" : "gray",
              }}
            >
              {value.replace(/<[^>]+>/g, "").length}/{MAX_LENGTH}
            </div>
          </div>

          <div className="job_posting_submit">
            <div className="button-group">
              <button className="secondary-btn">
                <span>Save as Draft</span>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 5V19M5 12H19"
                    stroke="#6900ad"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button onClick={handlePublishPost} className="primary-btn">
                <span>Publish</span>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 12H19M19 12L12 5M19 12L12 19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </Col>
        <Col className="guideline_right" lg={11} md={11} sm={24} xs={24}>
          <div className="guidelines">
            <h5>Guidelines</h5>
            <h3>Follow these guidelines for faster approval</h3>
            <ul>
              <li>
                {" "}
                <FaHeartCircleCheck className="heart_icon" /> User can use Job
                Title suggestions to auto-fill common industry terms and enhance
                discoverability.
              </li>
              <li>
                {" "}
                <FaHeartCircleCheck className="heart_icon" /> Clearly define
                your ideal candidate using the Eligibility section for targeted
                applications.
              </li>
              <li>
                {" "}
                <FaHeartCircleCheck className="heart_icon" /> Select the right
                Job Category to ensure your listing reaches the right
                candidates.
              </li>
              <li>
                {" "}
                <FaHeartCircleCheck className="heart_icon" /> Avoid restricting
                applications based on nationality, caste, religion, gender, etc.
              </li>
              <li>
                <FaHeartCircleCheck className="heart_icon" /> Do not charge any
                application fees.
              </li>
              <li>
                <FaHeartCircleCheck className="heart_icon" /> Keep the Job
                Description clear and specific to the role, highlighting
                responsibilities, required skills, and growth opportunities. Use
                the AI generator for quick drafts, then customize as needed.
              </li>
            </ul>
          </div>

          <div className="guidelines">
            <h5>Shortlist faster & accurately</h5>
            <h3>Follow these guidelines & recruitment rounds on next step:</h3>
            <ul>
              <li>
                {" "}
                <FaHeartCircleCheck className="heart_icon" />
                Add assessment rounds like quiz, coding, case submissions etc.
              </li>
              <li>
                {" "}
                <FaHeartCircleCheck className="heart_icon" /> Accept submissions
                via PPT, PDFs, DOC, CSVs, etc.
              </li>
              <li>
                {" "}
                <FaHeartCircleCheck className="heart_icon" /> Add Video
                interview rounds for final selection of candidates.
              </li>
            </ul>
          </div>

          <div className="guidelines">
            <h5>Support</h5>
            <h3>Facing an issue or need any help ?</h3>
            <ul>
              <li>
                {" "}
                <FaHeartCircleCheck className="heart_icon" />
                Reach us at support@carrerfast.com
              </li>
              <li>
                {" "}
                <a href="">Get in touch with us here</a>
              </li>
            </ul>
          </div>
        </Col>
      </Row>
    </section>
  );
}
