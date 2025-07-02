import React, { useEffect, useState } from "react";
import {
  Button,
  Drawer,
  Card,
  Row,
  Col,
  Typography,
  Divider,
  Tag,
  Space,
  Avatar,
  ColorPicker,
  Alert,
  Form,
  Select,
  Input,
  InputNumber,
} from "antd";
import {
  EditOutlined,
  PictureOutlined,
  ProfileOutlined,
  SolutionOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  UserOutlined,
  EyeOutlined,
  CalendarOutlined,
  AreaChartOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import {
  getJobCategoryData,
  getSalaryData,
  getWorkPlaceLocation,
  getYears,
  getEligibilityData,
} from "../ApiService/action";
import ReactQuill from "react-quill";
import styled from "styled-components";
import { LuLocateFixed } from "react-icons/lu";
import { RiEqualizerLine } from "react-icons/ri";
import { TbContract } from "react-icons/tb";
import CommonInputField from "../Common/CommonInputField";
import CommonDatePicker from "../Common/CommonDatePicker";
import CommonSelectField from "../Common/CommonSelectField";
import { MdOutlineModeEdit } from "react-icons/md";
import { PiOfficeChairLight } from "react-icons/pi";
import { FaPersonCircleExclamation } from "react-icons/fa6";
import { MdFileDownloadDone } from "react-icons/md";
import { FaBusinessTime } from "react-icons/fa";
import { State, City } from "country-state-city";

const { Title, Text } = Typography;
const { Option } = Select;

const StyledCard = styled(Card)`
  transition: all 0.3s ease;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: none;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  }
`;

const OptionCard = styled(StyledCard)`
  .ant-card-body {
    padding: 16px;
  }
`;

const PreviewCard = styled(StyledCard)`
  background: linear-gradient(135deg, #f9f0ff 0%, #f0f9ff 100%);
  border-left: 4px solid #1890ff;
`;

const StatsCard = styled(StyledCard)`
  .ant-card-body {
    padding: 20px;
  }
`;

const editOptions = [
  {
    key: "banner",
    title: "Opportunity Banner Theme",
    description: "Upload custom banners or modify default banners",
    icon: <PictureOutlined style={{ fontSize: 18, color: "#722ed1" }} />,
    color: "#722ed1",
  },
  {
    key: "basic",
    title: "Basic Details & Eligibility",
    description: "Define job title, dates, and eligibility criteria",
    icon: <ProfileOutlined style={{ fontSize: 18, color: "#13c2c2" }} />,
    color: "#13c2c2",
  },
  {
    key: "process",
    title: "Eligibility Criteria & Job Details",
    description:
      "Specify the required qualifications, experience, and key job responsibilities.",
    icon: <SolutionOutlined style={{ fontSize: 18, color: "#fa8c16" }} />,
    color: "#fa8c16",
  },
  {
    key: "description",
    title: "Job Description",
    description: "Mention Rules, Process, Format, etc.",
    icon: <FileTextOutlined style={{ fontSize: 18, color: "#eb2f96" }} />,
    color: "#eb2f96",
  },

  {
    key: "additionalinformation",
    title: "Additional information",
    description:
      "Include any extra details such as rules, event format, important instructions, or FAQs.",
    icon: <PlusCircleOutlined style={{ fontSize: 18, color: "#1d39c4" }} />,
    color: "#1d39c4",
  },
];

const defaultContent = `
  <p><strong>About the Opportunity:</strong></p><br></br>
  <ul>
    <li></li>
    <li></li>
  </ul>
  <p style="margin-top: 30px;"><strong>Responsibilities of the Candidate:</strong></p><br></br>
  <ul>
    <li></li>
    <li></li>
  </ul>
  <p><strong>Requirements:</strong></p>
  <ul>
    <li></li>
    <li></li>
  </ul>
`;

const colors = [
  "#1677ff",
  "#ffd591",
  "#ffbb96",
  "#b7eb8f",
  "#87e8de",
  "#91caff",
  "#ffadd2",
];

const workingDaysOptions = [
  { value: "6 Working Days", label: "6 Working Days" },
  { value: "5 Working Days", label: "5 Working Days" },
];
const jobTypeOptions = [
  { value: "Full Time", label: "Full Time" },
  { value: "Contarct", label: "Contarct" },
  { value: "Part Time", label: "Part Time" },
];

const EditOpportunity = () => {
  useEffect(() => {
    getSalaryDataType();
  }, []);

  useEffect(() => {
    const loadCities = () => {
      const states = State.getStatesOfCountry("IN");
      const cities = states.flatMap((state) =>
        City.getCitiesOfState("IN", state.isoCode)
      );
      const formatted = cities.map((city) => ({
        label: city.name,
        value: city.name,
      }));
      setWorkLocationOption(formatted);
    };

    loadCities();
  }, []);

  const getSalaryDataType = async () => {
    try {
      const response = await getSalaryData();
      setSalaryData(response?.data?.data || []);
      console.log("Salary data", response);
    } catch (error) {
      console.log("Salary data error", error);
    } finally {
      setTimeout(() => {
        getJobCategoryDataType();
      }, 300);
    }
  };

  const getJobCategoryDataType = async () => {
    try {
      const response = await getJobCategoryData();
      const jobCategoryFormatted = response?.data?.data.map((jobCategory) => ({
        label: jobCategory.category_name,
        value: jobCategory.category_name,
      }));
      setJobCategoryOptions(jobCategoryFormatted);
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        getWorkPlaceLocationData();
      }, 300);
    }
  };

  const getWorkPlaceLocationData = async () => {
    try {
      const response = await getWorkPlaceLocation();
      setWorkplaceLocation(response?.data?.data || []);
      console.log("workplace location", response);
    } catch (error) {
      console.log("workplace location", error);
    } finally {
      setTimeout(() => {
        getYearsData();
      }, 300);
    }
  };

  const getYearsData = async () => {
    try {
      const response = await getYears();
      setEligibilityYearData(response?.data?.data || []);
      console.log("years", response);
    } catch (error) {
      console.log("years error", error);
    } finally {
      setTimeout(() => {
        getEligibilityDataTypes();
      }, 300);
    }
  };

  const getEligibilityDataTypes = async () => {
    try {
      const response = await getEligibilityData();
      setEligibilityData(response?.data?.data || []);
      console.log("Eligibility data", response);
    } catch (error) {
      console.log("Eligibility data error", error);
    }
  };

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [salaryData, setSalaryData] = useState([]);
  const [salaryTypeActiveButton, setSalaryTypeActiveButton] = useState("");
  const [salaryDetails, setSalaryDetails] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [fixedSalary, setFixedSalary] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [jobCategory, setJobCategory] = useState("");
  const [jobCategoryOptions, setJobCategoryOptions] = useState([]);
  const [eligibilityCriteria, setEligibilityCriteria] = useState("");
  const [value, setValue] = useState(defaultContent);
  const MAX_LENGTH = 3000;
  const [touched, setTouched] = useState(false); // to control initial error
  const [jobDescription, setJobDescription] = useState("");
  const [jobOpenings, setJobOpenings] = useState("");
  const [workingDays, setWorkingDays] = useState("");
  const [workLocation, setWorkLocation] = useState("");
  const [workplaceLocation, setWorkplaceLocation] = useState("");
  const [workLocationActiveButton, setWorkLocationActiveButton] = useState("");
  const [specificLocation, setSpecificLocation] = useState("");
  const [specificLocationName, setSpecificLocationName] = useState("");
  const [workLocationOption, setWorkLocationOption] = useState([]);
  const [eligibilityData, setEligibilityData] = useState([]);
  const [experienceRequiredActiveButton, setExperienceRequiredActiveButton] =
    useState(null);
  const [eligibility, setEligibility] = useState("");
  const [eligibilityYearData, setEligibilityYearData] = useState([]);
  const [selectedFresherPass, setSelectedFresherPass] = useState([]);
  const [eligibilityYear, setEligibilityYear] = useState("");
  const [experienceRequired, setExperienceRequired] = useState("");
  const [jobType, setJobType] = useState("");

  const handleEditClick = (key) => {
    setActiveSection(key);
    setDrawerOpen(true);
  };

  const handleFresherPassClick = (item) => {
    const allYears = eligibilityYearData
      .filter((i) => i.year !== "All")
      .map((i) => i.year);

    if (item.year === "All") {
      if (selectedFresherPass.length === allYears.length) {
        setSelectedFresherPass([]);
      } else {
        setSelectedFresherPass(allYears);
      }
    } else {
      if (selectedFresherPass.includes(item.year)) {
        setSelectedFresherPass((prev) =>
          prev.filter((year) => year !== item.year)
        );
      } else {
        setSelectedFresherPass((prev) => [...prev, item.year]);
      }
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

  const handleChange = (content, delta, source, editor) => {
    if (editor.getLength() <= MAX_LENGTH + 1) {
      setTouched(true);
      setValue(content);
      setJobDescription(content);
    }
  };

  const renderDrawerContent = () => {
    switch (activeSection) {
      case "banner":
        return (
          <div>
            <h5>Default Banner</h5>
            <p style={{ fontSize: 12 }}>
              We will add default banners in case you do not upload custom
              desktop or mobile banners. You can also customize these as per
              your liking. A wide range of color themes are also available.
            </p>
            <p style={{ marginTop: 15 }}>Choose Theme Color (beta)</p>
            <div className="colorChoose">
              {colors.map((color, index) => (
                <ColorPicker key={index} defaultValue={color} />
              ))}
            </div>
            <Alert
              style={{ marginTop: 20, fontSize: 12, border: "none" }}
              message="Select the banner background color to be applied after saving."
              type="warning"
              showIcon
            />
          </div>
        );
      case "basic":
        return (
          <div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div className="edi_page_logo" style={{ textAlign: "center" }}>
                <img
                  className="edi_page_logo_img"
                  size={100}
                  src={
                    "https://d8it4huxumps7.cloudfront.net/uploads/images/150x150/uploadedManual-685be86f28e4d_mark.jpeg"
                  }
                ></img>
                <p>Change Logo</p>
              </div>
            </div>
            <div className="salary_details">
              <h4>Salary Details</h4>
              <p>
                Add compensation details to filter better candidates and speed
                up the sourcing process.
              </p>
              <Form.Item
                layout="vertical"
                label={<h5> Salary Type</h5>}
                name={"salarytype"}
              >
                <div className="job_nature">
                  {salaryData.map((item) => {
                    return (
                      <button
                        key={item.id}
                        className={
                          salaryTypeActiveButton === item.id
                            ? "experience_required_button_active"
                            : "experience_required_button"
                        }
                        onClick={() => {
                          setSalaryTypeActiveButton(item.id);
                          setSalaryDetails(item.id);
                        }}
                      >
                        {item.id === 1 ? (
                          <LuLocateFixed />
                        ) : item.id === 2 ? (
                          <RiEqualizerLine />
                        ) : (
                          <TbContract />
                        )}{" "}
                        {item.name}
                      </button>
                    );
                  })}
                </div>
              </Form.Item>

              {salaryTypeActiveButton === 1 && (
                <div className="salary_details_inner">
                  <h5>Salary Figure</h5>
                  <p>The salary on the job page will be shown in years only.</p>

                  <div className="job_nature">
                    <Select
                      value={currency}
                      onChange={(value) => setCurrency(value)}
                      style={{ width: 120 }}
                    >
                      <Option value="INR">₹ (INR)</Option>
                      <Option value="USD">$ (USD)</Option>
                      <Option value="EUR">€ (EUR)</Option>
                    </Select>

                    <Input
                      style={{ width: "60%", marginLeft: 12 }}
                      value={fixedSalary}
                      onChange={(e) => setFixedSalary(e.target.value)}
                      placeholder="Enter amount"
                    />
                  </div>
                </div>
              )}

              {salaryTypeActiveButton === 2 && (
                <div className="salary_details_inner">
                  <h5>Salary Figure</h5>
                  <p>The salary on the job page will be shown in years only.</p>
                  <div className="job_nature">
                    <Select
                      value={currency}
                      onChange={(value) => setCurrency(value)}
                      style={{ width: 100 }}
                    >
                      <Option value="INR">₹ (INR)</Option>
                      <Option value="USD">$ (USD)</Option>
                      <Option value="EUR">€ (EUR)</Option>
                    </Select>

                    <InputNumber
                      value={salaryMin}
                      onChange={(value) => setSalaryMin(value)}
                      placeholder="Min"
                      min={0}
                      style={{
                        width: "30%",
                        height: 45,
                        placeContent: "center",
                        textAlign: "center",
                      }}
                    />

                    <InputNumber
                      value={salaryMax}
                      onChange={(value) => setSalaryMax(value)}
                      placeholder="Max"
                      min={0}
                      style={{
                        width: "30%",
                        height: 45,
                        placeContent: "center",
                        textAlign: "center",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="form-group">
              <CommonInputField
                name={"Job title"}
                mandotary={true}
                label="Job Title/Role"
                placeholder={"Enter your job title"}
                type={"text"}
                value={jobTitle}
                onChange={(e) => {
                  setJobTitle(e.target.value);
                }}
              />
            </div>

            <div className="form-row">
              <div className="from-group">
                <CommonDatePicker
                  label="Job Start Date"
                  value={startDate}
                  onChange={(value) => setStartDate(value)}
                />
              </div>
              <div className="from-group">
                <CommonDatePicker
                  label="Job End Date"
                  value={endDate}
                  onChange={(value) => setEndDate(value)}
                />
              </div>
            </div>
            <div style={{ marginTop: 15 }} className="form-group">
              <CommonSelectField
                label={"Job Category"}
                showSearch={true}
                value={jobCategory}
                mandatory={true}
                name={"Job category"}
                placeholder={"Select Job Category"}
                options={jobCategoryOptions}
                onChange={(value) => {
                  setJobCategory(value);
                }}
              />
            </div>
          </div>
        );
      case "process":
        return (
          <div>
            <CommonSelectField
              style={{ height: 56 }}
              label={"Eligibility Criteria"}
              showSearch={true}
              mode="multiple"
              value={eligibilityCriteria}
              name={"eligibilityCriteria"}
              placeholder={"Select eligibility Criteria"}
              options={[
                { label: "Fresher", value: "Fresher" },
                { label: "Graduate ", value: "Graduate " },
                { label: "Postgraduate", value: "Postgraduate" },
              ]}
              onChange={(value) => {
                setEligibilityCriteria(value);
              }}
            />
            <Alert
              style={{ marginTop: 10, fontSize: 12, border: "none" }}
              message="Select the eligibility criteria that will be displayed after saving."
              type="warning"
              showIcon
            />
            <div style={{ marginTop: 20 }} className="form-group">
              <CommonInputField
                name={"Job Openings"}
                label="Job Openings"
                placeholder={"No.of openings"}
                type={"text"}
                value={jobOpenings}
                onChange={(e) => {
                  setJobOpenings(e.target.value);
                }}
              />
            </div>
          </div>
        );
      case "description":
        return (
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
                color:
                  value.replace(/<[^>]+>/g, "").length >= MAX_LENGTH
                    ? "red"
                    : "gray",
              }}
            >
              {value.replace(/<[^>]+>/g, "").length}/{MAX_LENGTH}
            </div>
          </div>
        );

      case "additionalinformation":
        return (
          <div>
            <div style={{ marginTop: 0 }} className="form-group">
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
                <div style={{ marginBottom: 15 }} className="job_nature">
                  {workplaceLocation.map((item) => {
                    return (
                      <button
                        type="button"
                        className={
                          workLocationActiveButton === item.id
                            ? "work_location_button_active"
                            : "work_location_button"
                        }
                        onClick={() => {
                          setWorkLocationActiveButton(item.id);
                          setWorkLocation(item.id);
                        }}
                      >
                        <PiOfficeChairLight /> {item.name}
                      </button>
                    );
                  })}
                </div>
                {workLocationActiveButton === 1 ? (
                  <CommonSelectField
                    label={"Select location"}
                    style={{ marginTop: "0px" }}
                    showSearch={true}
                    name={"specific_location"}
                    placeholder={"Select location"}
                    value={specificLocation}
                    onChange={(value, option) => {
                      setSpecificLocation(value);
                      setSpecificLocationName(option.label);
                    }}
                    options={workLocationOption}
                  />
                ) : null}
              </Form.Item>
            </div>

            <div className="eligibility">
              <div style={{ paddingTop: 0 }} className="experience_required">
                <p>
                  <span style={{ color: "red" }}>*</span> Experience Required
                  (In Years)
                </p>
                <div className="job_nature">
                  {eligibilityData.map((item) => {
                    return (
                      <button
                        type="button"
                        className={
                          experienceRequiredActiveButton === item.id
                            ? "experience_required_button_active"
                            : "experience_required_button"
                        }
                        onClick={() => {
                          setExperienceRequiredActiveButton(item.id);
                          setEligibility(item.id);
                        }}
                      >
                        <FaPersonCircleExclamation /> {item.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="experience_required">
                {experienceRequiredActiveButton === 1 ? (
                  <>
                    <p>Experience Required (In Years)</p>
                    <div className="job_nature">
                      {eligibilityYearData.map((item) => {
                        const isSelected =
                          item.year === "All"
                            ? selectedFresherPass.length ===
                              eligibilityYearData.filter(
                                (i) => i.year !== "All"
                              ).length
                            : selectedFresherPass.includes(item.year);

                        return (
                          <button
                            key={item.id}
                            className={
                              isSelected
                                ? "fresher_pass_button_active"
                                : "fresher_pass_button"
                            }
                            onClick={() => {
                              handleFresherPassClick(item);
                              setEligibilityYear(item.id);
                            }}
                          >
                            {item.year === "All" ? (
                              <MdFileDownloadDone />
                            ) : (
                              <FaBusinessTime />
                            )}{" "}
                            {item.year}
                          </button>
                        );
                      })}
                    </div>
                  </>
                ) : null}

                {experienceRequiredActiveButton === 2 ? (
                  <>
                    <div className="">
                      <CommonInputField
                        name={"Experience"}
                        label="Experience required"
                        onChange={(e) => {
                          setExperienceRequired(e.target.value);
                        }}
                        mandotary={false}
                        placeholder={"Enter your Experience"}
                        type={"text"}
                      />
                    </div>
                  </>
                ) : null}
              </div>
            </div>
            <div style={{ marginTop: 20 }} className="form-group">
              <CommonSelectField
                label={"Working Days"}
                showSearch={true}
                value={workingDays}
                name={"working_days"}
                placeholder={"Choose working days"}
                options={workingDaysOptions}
                onChange={(value) => {
                  setWorkingDays(value);
                }}
              />
            </div>

            <div style={{ marginTop: 20 }} className="form-group">
              <CommonSelectField
                label={"Job Type"}
                showSearch={true}
                value={workingDays}
                name={"job_type"}
                placeholder={"Choose job type"}
                options={jobTypeOptions}
                onChange={(value) => {
                  setJobType(value);
                }}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="edit_opportunity" style={{ padding: 24 }}>
      <div style={{ display: "flex", gap: 24 }}>
        {/* Left Panel - Edit Options */}
        <div
          style={{
            width: "320px",
            flexShrink: 0,
            position: "sticky",
            top: 0,
            alignSelf: "flex-start",
            height: "100vh",
            overflowY: "auto",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          className="no-scrollbar"
        >
          <Title
            className="section-title"
            level={4}
            style={{ marginBottom: 24 }}
          >
            Customize Your Post <MdOutlineModeEdit size={18} />
          </Title>

          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            {editOptions.map((item) => (
              <OptionCard
                style={{ padding: "15px 6px" }}
                key={item.key}
                hoverable
              >
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <Avatar
                    size={40}
                    style={{
                      backgroundColor: `${item.color}20`,
                      color: item.color,
                    }}
                  >
                    {item.icon}
                  </Avatar>
                  <div style={{ flex: 1 }}>
                    <Text strong style={{ display: "block" }}>
                      {item.title}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {item.description}
                    </Text>
                  </div>
                  <Button
                    type="text"
                    icon={<EditOutlined style={{ color: item.color }} />}
                    onClick={() => handleEditClick(item.key)}
                    style={{ marginLeft: "auto" }}
                  />
                </div>
              </OptionCard>
            ))}
          </Space>
        </div>

        {/* Right Panel - Preview */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            maxHeight: "calc(100vh - 48px)",
            paddingRight: 8,
          }}
        >
          <PreviewCard>
            <div
              style={{
                display: "flex",
                gap: 16,
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <img
                className="job-logo"
                src="https://cdn.worldvectorlogo.com/logos/trellix.svg"
                alt={"logo"}
              />
              <div>
                <Title className="job-title" level={3} style={{ margin: 0 }}>
                  React Developer
                </Title>
                <Text className="job-company">Markerz Global Solution</Text>
                <div style={{ paddingTop: 8 }}>
                  <Tag color="geekblue">Chennai</Tag>
                  <Tag color="purple">Full-time</Tag>
                </div>
              </div>
            </div>

            <Divider style={{ margin: "24px 0" }} />

            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <Tag
                style={{ padding: 6 }}
                icon={<CalendarOutlined />}
                color="default"
              >
                Updated: Jun 27, 2025
              </Tag>
              <Tag
                style={{ padding: 6 }}
                icon={<ClockCircleOutlined />}
                color="warning"
              >
                10 days left
              </Tag>
              <Tag
                style={{ padding: 6 }}
                icon={<DollarOutlined />}
                color="success"
              >
                4-6 LPA
              </Tag>
            </div>
          </PreviewCard>

          <StatsCard className="edit_oppor_details" style={{ marginTop: 24 }}>
            <Row style={{ alignItems: "baseline" }} gutter={16}>
              <Col lg={6} xs={24} sm={12}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 16,
                  }}
                >
                  <Avatar
                    icon={<UserOutlined />}
                    style={{ backgroundColor: "#fde3cf", color: "#f56a00" }}
                  />
                  <div>
                    <Text type="secondary">Applications</Text>
                    <Title level={4} style={{ margin: 0 }}>
                      481
                    </Title>
                  </div>
                </div>
              </Col>
              <Col lg={6} xs={24} sm={12}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 16,
                  }}
                >
                  <Avatar
                    icon={<EyeOutlined />}
                    style={{ backgroundColor: "#d6e4ff", color: "#1d39c4" }}
                  />
                  <div>
                    <Text type="secondary">Impressions</Text>
                    <Title level={4} style={{ margin: 0 }}>
                      18,609
                    </Title>
                  </div>
                </div>
              </Col>

              <Col lg={6} xs={24} sm={12}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 16,
                  }}
                >
                  <Avatar
                    icon={<AreaChartOutlined />}
                    style={{
                      backgroundColor: "rgb(234 255 212)",
                      color: "#52c41a",
                    }}
                  />
                  <div>
                    <Text type="secondary">Reach</Text>
                    <Title level={4} style={{ margin: 0 }}>
                      18,609
                    </Title>
                  </div>
                </div>
              </Col>

              <Col lg={6} xs={24} sm={12}>
                <Button
                  className="apply-button"
                  type="primary"
                  size="large"
                  block
                  style={{ marginTop: 16 }}
                >
                  Apply Now
                </Button>
              </Col>
            </Row>
          </StatsCard>
          <StatsCard className="section-card">
            <Col>
              <div className="job-eligibility">
                <h2 className="section-title">Eligibility</h2>
                <p>Fresher • Graduate • Postgraduate</p>
              </div>
            </Col>
          </StatsCard>
          <StatsCard className="section-card job-description">
            <h2 className="section-title">Job Description</h2>
            <h6>Xerox is hiring for the role of Python Developer!</h6>
            <ul>
              Responsibilities of the Candidate:
              <li>
                Builds knowledge of the organization, processes and customers.
              </li>
              <li>
                Requires knowledge and experience in own discipline; still
                acquiring higher level knowledge and skills.
              </li>
              <li>Receives a moderate level of guidance and direction.</li>
              <li>
                Moderate decision-making authority guided by policies,
                procedures, and business operations protocol.
              </li>
            </ul>

            <ul>
              Requirements:
              <li>
                Will need to be strong on ML pipelines, modern tech stack.
              </li>
              <li>Proven experience with MLOPs with Azure and MLFlow etc.</li>
              <li>Experience with scripting and coding using Python.</li>
              <li>
                Working Experience with container technologies (Docker,
                Kubernetes).
              </li>
            </ul>
          </StatsCard>

          <StatsCard className="section-card">
            <h2 className="section-title">Additional Information</h2>

            <div className="info-card">
              <div className="info-card-content">
                <h4>Job Location(s)</h4>
                <p>Pan India</p>
              </div>
              <img
                className="info-card-image"
                src="https://d8it4huxumps7.cloudfront.net/uploads/images/66702737c9e5c_location.png"
                alt="Location"
              />
            </div>

            <div className="info-card">
              <div className="info-card-content">
                <h4>Experience</h4>
                <p>No prior experience required</p>
              </div>
              <img
                className="info-card-image"
                src="https://d8it4huxumps7.cloudfront.net/uploads/images/66710a39d5851_experience.png"
                alt="Experience"
              />
            </div>

            <div className="info-card">
              <div className="info-card-content">
                <h4>Salary</h4>
                <p>Competitive compensation package</p>
              </div>
              <img
                className="info-card-image"
                src="https://d8it4huxumps7.cloudfront.net/uploads/images/667109f58b243_salary.png"
                alt="Salary"
              />
            </div>

            <div className="info-card">
              <div className="info-card-content">
                <h4>Work Schedule</h4>
                <p>
                  <b>Working Days</b>: 5 Days
                </p>
              </div>
              <img
                className="info-card-image"
                src="https://d8it4huxumps7.cloudfront.net/uploads/images/667109d710a09_work_detail.png"
                alt="Work Details"
              />
            </div>

            <div className="info-card">
              <div className="info-card-content">
                <h4>Job Type/Timing</h4>
                <p>
                  <b>Job Type</b>: Work From Home
                </p>
                <p>
                  <b>Job Timing</b>: Full Time
                </p>
              </div>
              <img
                className="info-card-image"
                src="https://d8it4huxumps7.cloudfront.net/uploads/images/667109c430518_job_typetiming.png?d=240x172"
                alt="Work Details"
              />
            </div>
          </StatsCard>
        </div>
      </div>

      {/* Drawer */}
      <Drawer
        title={
          <div>
            <Text strong>Editing: </Text>
            <Text
              style={{
                color: editOptions.find((o) => o.key === activeSection)?.color,
              }}
            >
              {editOptions.find((o) => o.key === activeSection)?.title}
            </Text>
          </div>
        }
        placement="right"
        open={drawerOpen}
        width={700}
        onClose={() => setDrawerOpen(false)}
        headerStyle={{ borderBottom: "1px solid #f0f0f0" }}
        bodyStyle={{ padding: 24 }}
        extra={
          <Space>
            <Button onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button className="account_settings" type="primary">
              Save Changes
            </Button>
          </Space>
        }
      >
        {renderDrawerContent()}
      </Drawer>
    </div>
  );
};

export default EditOpportunity;
