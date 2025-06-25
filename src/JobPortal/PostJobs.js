import React, { useEffect, useState } from "react";
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
  Switch,
  InputNumber,
  Space,
  Tag,
  Divider,
  Card,
  message,
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  LineChartOutlined,
  MedicineBoxOutlined,
  CarOutlined,
  CoffeeOutlined,
} from "@ant-design/icons";
import { HiMiniComputerDesktop } from "react-icons/hi2";
import { MdOutlineEventNote } from "react-icons/md";
import { TbContract } from "react-icons/tb";
import { PiOfficeChairLight } from "react-icons/pi";
import { FaTruckFieldUn } from "react-icons/fa6";
import { FaPersonCircleExclamation } from "react-icons/fa6";
import { FaPersonCircleCheck } from "react-icons/fa6";
import { FaBusinessTime } from "react-icons/fa";
import { MdFileDownloadDone } from "react-icons/md";
import { LuLocateFixed } from "react-icons/lu";
import { RiEqualizerLine } from "react-icons/ri";
import { FaAngleUp } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa";
import { FaHeartCircleCheck } from "react-icons/fa6";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import CommonInputField from "../Common/CommonInputField";
import CommonSelectField from "../Common/CommonSelectField";
import { nameValidator, selectValidator } from "../Common/Validation";
import { useNavigate } from "react-router-dom"; // For navigation
import {
  getBenifitsData,
  getDuration,
  getDurationTypes,
  getEligibilityData,
  getGenderData,
  getJobNature,
  getSalaryData,
  getWorkPlaceLocation,
  getWorkPlaceType,
  getYears,
} from "../ApiService/action";
import { option } from "framer-motion/client";
const { Option } = Select;
const { Group: InputGroup } = Input;
export default function PostJobs() {
  const [companyLogo, setCompanyLogo] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [jobNatureId, setJobNatureId] = useState(1);
  const [workTypeActiveButton, setWorkTypeActiveButton] = useState(null);
  const [weeksActiveButton, setWeeksActiveButton] = useState(null);
  const [workLocationActiveButton, setWorkLocationActiveButton] =
    useState(null);
  const { Title, Text } = Typography;
  const [experienceRequiredActiveButton, setExperienceRequiredActiveButton] =
    useState(null);
  const [fresherPassActiveButton, setFresherPassActiveButton] = useState(null);
  const [selectedFresherPass, setSelectedFresherPass] = useState([]);
  const [experienceRequired, setExperienceRequired] = useState("");
  const [salaryTypeActiveButton, setSalaryTypeActiveButton] = useState(null);
  const [diversityenabled, setDiversityEnabled] = useState(true);
  const [genderselected, setGenderSelected] = useState("All");
  const [showMore, setShowMore] = useState(false);
  const [selectedBenefits, setSelectedBenefits] = useState([]);
  //
  const [companyName, setCompanyName] = useState("");
  const [companyNameError, setCompanyNameError] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobTitleError, setJobTitleError] = useState("");
  const [jobNatureError, setJobNatureError] = useState("");
  const [jobNatureOptions, setJobNatureOptions] = useState([]);
  const [jobInternshipDuration, setJobInternshipDuration] = useState("");
  const [jobInternshipDurationError, setJobInternshipDurationError] =
    useState("");
  const [internshipDurationTypeData, setInternshipDurationTypeData] = useState(
    []
  );
  const [internShipDuration, setIntershipDuration] = useState([]);
  const [selectedDurationId, setSelectedDurationId] = useState(null);
  const [workplaceType, setWorkplaceType] = useState("");
  const [workplaceTypeError, setWorkplaceTypeError] = useState("");
  const [workplaceTypeData, setWorkplaceTypeData] = useState([]);
  const [workplaceLocation, setWorkplaceLocation] = useState([]);
  const [jobCategory, setJobCategory] = useState("");
  const [jobCategoryError, setJobCategoryError] = useState("");
  const [jobCategoryName, setJobCategoryName] = useState("");
  const [skillsRequired, setSkillsRequired] = useState([]);
  const [skillsRequiredError, setSkillsRequiredError] = useState("");
  const [salaryDetails, setSalaryDetails] = useState("");
  const [salaryDetailsError, setSalaryDetailsError] = useState("");
  const [eligibility, setEligibility] = useState("");
  const [eligibilityError, setEligibilityError] = useState("");
  const [eligibilityData, setEligibilityData] = useState([]);
  const [eligibilityYear, setEligibilityYear] = useState("");
  const [eligibilityYearData, setEligibilityYearData] = useState([]);
  const [workLocation, setWorkLocation] = useState("");
  const [workLocationError, setWorkLocationError] = useState("");
  const [specificLocation, setSpecificLocation] = useState("");
  const [specificLocationName, setSpecificLocationName] = useState("");
  const [otherBenifits, setOtherBenifits] = useState([]);
  const [gender, setGender] = useState([]);
  const [genderData, setGenderData] = useState("");
  const [salaryData, setSalaryDate] = useState([]);
  // salary
  const [currency, setCurrency] = useState("INR");
  const [fixedSalary, setFixedSalary] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");

  const navigate = useNavigate();

  const fresherPass = [
    { id: 1, name: "All" },
    { id: 2, name: "2021" },
    { id: 2, name: "2022" },
    { id: 2, name: "2023" },
    { id: 2, name: "2024" },
  ];

  const workplaceOptions = [
    { value: "1", label: "Chennai" },
    { value: "2", label: "Mumbai" },
    { value: "3", label: "Bangalore" },
  ];

  const jobCategoryOptions = [
    { value: "1", label: "Web Developer" },
    { value: "2", label: "React Developer" },
    { value: "3", label: "UXUI Designer" },
  ];

  const skillsRequiredOptions = [
    { value: "1", label: "React" },
    { value: "2", label: "Java" },
    { value: "3", label: "Python" },
  ];

  useEffect(() => {
    getJobNatureData();
  }, []);

  const getJobNatureData = async () => {
    try {
      const response = await getJobNature();
      console.log(response);
      setJobNatureOptions(response?.data?.data || []);
    } catch (error) {
      console.log("job nature error", error);
    } finally {
      setTimeout(() => {
        getWorkPlaceTypeData();
      }, 300);
    }
  };

  const getWorkPlaceTypeData = async () => {
    try {
      const response = await getWorkPlaceType();
      setWorkplaceTypeData(response?.data?.data || []);
      console.log("workplace type", response);
    } catch (error) {
      console.log("workplace type", error);
    } finally {
      getBenifitsDataType();
    }
  };

  const getBenifitsDataType = async () => {
    try {
      const response = await getBenifitsData();
      setOtherBenifits(response?.data?.data || []);
      console.log("Benifits data", response);
    } catch (error) {
      console.log("Benifits data", error);
    } finally {
      getGenderDataType();
    }
  };

  const getGenderDataType = async () => {
    try {
      const response = await getGenderData();
      setGender(response?.data?.data || []);
      console.log("gender", response);
    } catch (error) {
      console.log("gender error", error);
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
    } finally {
      setTimeout(() => {
        getSalaryDataType();
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
    }
  };

  const getSalaryDataType = async () => {
    try {
      const response = await getSalaryData();
      setSalaryDate(response?.data?.data || []);
      console.log("Salary data", response);
    } catch (error) {
      console.log("Salary data error", error);
    } finally {
      setTimeout(() => {
        getYearsData();
      }, 300);
    }
  };

  //onclick functions
  const getDurationTypesData = async () => {
    try {
      const response = await getDurationTypes();
      setInternshipDurationTypeData(response?.data?.data || []);
      console.log("Duration type", response);
    } catch (error) {
      console.log("duration type", error);
    } finally {
      setTimeout(() => {}, 300);
    }
  };

  const getWorkPlaceLocationData = async () => {
    try {
      const response = await getWorkPlaceLocation();
      setWorkplaceLocation(response?.data?.data || []);
      console.log("workplace location", response);
    } catch (error) {
      console.log("workplace location", error);
    }
  };

  const getDurationData = async (durationId) => {
    const payload = {
      duration_type_id: durationId,
    };
    try {
      const response = await getDuration(payload);
      setIntershipDuration(response?.data?.data || []);
      console.log("duration typesss", response);
    } catch (error) {
      console.log("duration errorss", error);
    }
  };

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

  const handleTagClick = (tag) => {
    setGenderSelected(tag);
  };

  const toggleBenefitSelection = (key) => {
    setSelectedBenefits((prevSelected) =>
      prevSelected.includes(key)
        ? prevSelected.filter((item) => item !== key)
        : [...prevSelected, key]
    );
  };

  const visibleBenefits = showMore ? otherBenifits : otherBenifits.slice(0, 4);

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
    const jobNatureValidate = selectValidator(jobNatureId);
    const workplaceTypeValidate = selectValidator(workplaceType);
    const jobCategoryValidate = selectValidator(jobCategory);
    const skillsRequiredValidate = selectValidator(skillsRequired);
    const salaryDetailsValidate = selectValidator(salaryDetails);
    const jobInternshipDurationValidate =
      jobNatureId === "Internship"
        ? selectValidator(jobInternshipDuration)
        : "";
    const eligibilityValidate = selectValidator(eligibility);
    const workLocationValidate = selectValidator(workLocation);

    // Set all error states
    setCompanyNameError(companyNameValidate);
    setJobTitleError(jobTitleValidate);
    setJobNatureError(jobNatureValidate);
    setWorkplaceTypeError(workplaceTypeValidate);
    setJobCategoryError(jobCategoryValidate);
    setSkillsRequiredError(skillsRequiredValidate);
    setSalaryDetailsError(salaryDetailsValidate);
    setJobInternshipDurationError(jobInternshipDurationValidate);
    setEligibilityError(eligibilityValidate);
    setWorkLocationError(workLocationValidate);

    // Validation check
    const hasPostJobError = [
      companyNameValidate,
      jobTitleValidate,
      jobNatureValidate,
      workplaceTypeValidate,
      jobCategoryValidate,
      skillsRequiredValidate,
      salaryDetailsValidate,
      ...(jobNatureId === "Internship" ? [jobInternshipDurationValidate] : []),
      eligibilityValidate,
      // workLocationValidate,
    ].some((val) => val !== "");

    // if (hasPostJobError) {
    //   console.log("error publish the post");
    //   message.error("Please fill all fields correctly before proceeding.");
    //   return;
    // }

    console.log("All validations passed");
    const getUserDetails = JSON.parse(localStorage.getItem("loginDetails"));
    console.log("user details", getUserDetails);

    const getDurationName = internShipDuration.find(
      (f) => f.id === selectedDurationId
    );

    const selectedSkillNames = skillsRequiredOptions
      .filter((opt) => skillsRequired.includes(opt.value))
      .map((opt) => opt.label);

    if (salaryDetails === 2) {
      if (!salaryMin || !salaryMax) {
        message.error("Please enter both minimum and maximum salary.");
        return;
      }

      if (Number(salaryMax) <= Number(salaryMin)) {
        message.error("Maximum salary must be greater than minimum salary.");
        return;
      }
    }

    const allBenefitsData = otherBenifits
      .filter((b) => selectedBenefits.includes(b.id))
      .map((b) => b.name);

    const payload = {
      user_id: getUserDetails.id,
      company_name: companyName,
      company_logo: "",
      job_title: jobTitle,
      job_nature:
        jobNatureId === 1
          ? "Job"
          : jobNatureId === 2
          ? "Internship"
          : jobNatureId === 3
          ? "Contract"
          : "",
      duration_period:
        jobNatureId === 1
          ? "Permanent"
          : jobNatureId === 2
          ? getDurationName.duration
          : "Contract",
      workplace_type:
        workplaceType === 1
          ? "In Office"
          : workplaceType === 2
          ? "Work From Home"
          : "On Field",

      work_location:
        workLocation === 1
          ? specificLocationName
          : workLocation === 2
          ? "Pan India"
          : "",
      job_category: jobCategoryName,
      skills: selectedSkillNames,
      experience_type:
        eligibility === 1 ? "Fresher" : eligibility === 2 ? "Experienced" : "",
      experience_required:
        eligibility === 1
          ? selectedFresherPass
          : eligibility === 2
          ? experienceRequired
          : "",
      salary_type: salaryDetails === 1 ? "Fixed" : "Range",
      salary_figure:
        salaryDetails === 1
          ? {
              currency: currency,
              amount: fixedSalary,
            }
          : {
              currency: currency,
              min: salaryMin,
              max: salaryMax,
            },
      diversity_hiring:
        genderData === 1
          ? "Male"
          : genderData === 2
          ? "Female"
          : genderData === 3
          ? "Transgender"
          : genderData === 4
          ? "Intersex"
          : genderData === 5
          ? "Non-binary"
          : genderData === 6
          ? "Others"
          : "",
      benefits: allBenefitsData,
    };

    // Prepare final payload
    const postJobData = {
      companyName,
      jobTitle,
      jobNatureId,
      workplaceType,
      jobCategory,
      skillsRequired,
      salaryDetails,
      ...(jobNatureId === "Internship" && {
        jobInternshipDuration,
      }),
      eligibility,
      workLocation,
    };

    setTimeout(() => {
      console.log("Saving Job post data:", payload);
      // message.success("Job Posted Successfully.");
      // navigate("/job-portal");
    }, 1000);
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

          <div style={{ marginTop: 15 }} className="form-group">
            <Form.Item
              layout="vertical"
              label={<span style={{ fontWeight: 500 }}>Job Nature </span>}
              name="jobnature"
              rules={[
                {
                  required: true,
                  message: "Please Select your Job Nature ",
                },
              ]}
            >
              <div className="job_nature">
                {jobNatureOptions.map((item) => {
                  return (
                    <button
                      type="button"
                      className={
                        jobNatureId === item.id
                          ? "job_nature_button_active"
                          : "job_nature_button"
                      }
                      onClick={() => {
                        if (item.id === jobNatureId) {
                          return;
                        } else {
                          setJobNatureId(item.id);
                          setJobNatureError("");
                          if (item.id === 2) {
                            getDurationTypesData();
                          } else {
                            setInternshipDurationTypeData([]);
                          }
                        }
                      }}
                    >
                      {item.id === 1 ? (
                        <HiMiniComputerDesktop />
                      ) : item.id === 2 ? (
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
                <div style={{ color: "red", marginTop: 6, fontSize: 13 }}>
                  {"Job nature" + jobNatureError}
                </div>
              )}
            </Form.Item>
          </div>
          {/*  */}

          <div style={{ marginTop: 15 }} className="form-group">
            {jobNatureId === 2 && (
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
                  {internshipDurationTypeData.map((item) => {
                    return (
                      <button
                        type="button"
                        className={
                          jobInternshipDuration === item.id
                            ? "internship_duration_button_active"
                            : "internship_duration_button"
                        }
                        onClick={() => {
                          getDurationData(item.id);
                          setJobInternshipDuration(item.id);
                          setJobInternshipDurationError("");
                        }}
                      >
                        {item.name === "In Weeks" ? (
                          <HiMiniComputerDesktop />
                        ) : (
                          <HiMiniComputerDesktop />
                        )}{" "}
                        {item.name}
                      </button>
                    );
                  })}
                </div>
                {jobInternshipDurationError && (
                  <div
                    className="error-message"
                    style={{ color: "red", marginTop: "8px" }}
                  >
                    {"Internship" + jobInternshipDurationError}
                  </div>
                )}
              </Form.Item>
            )}
          </div>

          <div style={{ marginTop: 15 }} className="form-group">
            {jobNatureId === 2 && (
              <div className="job_nature">
                {internShipDuration.map((item) => {
                  return (
                    <button
                      type="button"
                      key={item.id}
                      className={
                        selectedDurationId === item.id
                          ? "weeks_button_active"
                          : "weeks_button"
                      }
                      onClick={() => {
                        setWeeksActiveButton(item.id);
                        setSelectedDurationId(item.id);
                      }}
                    >
                      {item.duration}
                    </button>
                  );
                })}
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
                  {workplaceTypeData.map((item) => {
                    return (
                      <button
                        type="button"
                        className={
                          workTypeActiveButton === item.id
                            ? "work_type_button_active"
                            : "work_type_button"
                        }
                        onClick={() => {
                          if (item.id === 2) {
                            getWorkPlaceLocationData();
                          } else {
                            setWorkplaceLocation([]);
                          }
                          setWorkTypeActiveButton(item.id);
                          setWorkplaceType(item.id);
                          setWorkplaceTypeError("");
                        }}
                      >
                        <PiOfficeChairLight /> {item.name}
                      </button>
                    );
                  })}
                </div>
                {workplaceTypeError && (
                  <div
                    className="error-message"
                    style={{ color: "red", marginTop: "8px" }}
                  >
                    {"Workplace Type" + workplaceTypeError}
                  </div>
                )}
              </Form.Item>
            </div>
          </div>

          <div style={{ marginTop: 15 }} className="form-group">
            {workTypeActiveButton === 2 ? (
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
                          setWorkLocationError("");
                        }}
                      >
                        <PiOfficeChairLight /> {item.name}
                      </button>
                    );
                  })}
                </div>
                {workLocationError && (
                  <div
                    className="error-message"
                    style={{ color: "red", marginTop: "8px" }}
                  >
                    {"Work location" + workLocationError}
                  </div>
                )}

                {workLocationActiveButton === 1 ? (
                  <CommonSelectField
                    style={{ marginTop: "20px" }}
                    showSearch={true}
                    placeholder={"Select Location"}
                    value={specificLocation}
                    onChange={(value, option) => {
                      setSpecificLocation(value);
                      setSpecificLocationName(option.label);
                    }}
                    options={workplaceOptions}
                  />
                ) : null}
              </Form.Item>
            ) : null}
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
              placeholder={"Select Job Category"}
              options={jobCategoryOptions}
              onChange={(value, option) => {
                setJobCategory(value);
                setJobCategoryName(option.label);
                setJobCategoryError(selectValidator(value));
              }}
              error={jobCategoryError}
            />

            <CommonSelectField
              label={"Skills Required"}
              mandatory={true}
              name={"skill_required"}
              showSearch={true}
              mode="multiple"
              placeholder={"Select skills"}
              style={{ height: 56 }}
              options={skillsRequiredOptions}
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

            <div className="experience_required">
              <p>
                <span style={{ color: "red" }}>*</span> Experience Required (In
                Years)
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
                        setWorkLocationError("");
                      }}
                    >
                      <FaPersonCircleExclamation /> {item.name}
                    </button>
                  );
                })}
              </div>
              {eligibilityError && (
                <div
                  className="error-message"
                  style={{ color: "red", marginTop: "8px" }}
                >
                  {"Experience" + eligibilityError}
                </div>
              )}
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
                            eligibilityYearData.filter((i) => i.year !== "All")
                              .length
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

          <div className="salary_details">
            <h4>Salary Details</h4>
            <p>
              Add compensation details to filter better candidates and speed up
              the sourcing process.
            </p>
            <Form.Item
              layout="vertical"
              label={
                <h5>
                  <span style={{ color: "red" }}>*</span> Salary Type
                </h5>
              }
              name="internship_duration"
            >
              <div className="job_nature">
                {salaryData.map((item) => {
                  return (
                    <button
                      className={
                        salaryTypeActiveButton === item.id
                          ? "experience_required_button_active"
                          : "experience_required_button"
                      }
                      onClick={() => {
                        setSalaryTypeActiveButton(item.id);
                        setSalaryDetails(item.id);
                        setSalaryDetailsError(selectValidator(item.name));
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
              {salaryDetailsError && (
                <div
                  className="error-message"
                  style={{ color: "red", marginTop: "8px" }}
                >
                  {"Salary Type" + salaryDetailsError}
                </div>
              )}
            </Form.Item>

            {salaryTypeActiveButton === 1 && (
              <div className="salary_details_inner">
                <h5>Salary Figure</h5>
                <p>The salary on the job page will be shown in years only.</p>
                <div className="job_nature">
                  <Select
                    value={currency}
                    onChange={(value) => setCurrency(value)}
                    style={{ border: "none" }}
                  >
                    <Option value="INR">₹ (INR)</Option>
                    <Option value="USD">$ (USD)</Option>
                    <Option value="EUR">€ (EUR)</Option>
                  </Select>

                  <Input
                    style={{ width: "60%" }}
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
                {gender.map((item) => (
                  <Tag.CheckableTag
                    checked={genderselected === item.id}
                    onChange={() => {
                      handleTagClick(item.id);
                      setGenderData(item.id);
                    }}
                    style={{
                      border: "1px dashed #ccc",
                      borderRadius: 8,
                      padding: "4px 12px",
                    }}
                  >
                    {item.name}
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
                      onClick={() => {
                        toggleBenefitSelection(item.id);
                      }}
                      style={{
                        width: 140,
                        textAlign: "center",
                        border: selectedBenefits.includes(item.id)
                          ? "2px dashed #6a00ff"
                          : "1px dashed #ccc",
                        background: selectedBenefits.includes(item.id)
                          ? "#6a00ff14"
                          : "#fff",
                        borderRadius: 8,
                      }}
                    >
                      <div style={{ fontSize: 24, marginBottom: 4 }}>
                        {item.id === 1 ? (
                          <LineChartOutlined />
                        ) : item.id === 2 ? (
                          <MedicineBoxOutlined />
                        ) : item.id === 3 ? (
                          <CarOutlined />
                        ) : item.id === 4 ? (
                          <CoffeeOutlined />
                        ) : null}
                      </div>
                      <Text>{item.name}</Text>
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
