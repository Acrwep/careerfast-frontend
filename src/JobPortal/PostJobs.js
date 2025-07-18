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
  Drawer,
  Checkbox,
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
import { IoMdAdd } from "react-icons/io";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { MdOutlineEventNote } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import { TbContract } from "react-icons/tb";
import { PiOfficeChairLight } from "react-icons/pi";
import { FaPersonCircleExclamation } from "react-icons/fa6";
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
import {
  nameValidator,
  selectValidator,
  userTypeValidator,
} from "../Common/Validation";
import { useNavigate } from "react-router-dom"; // For navigation
import { State, City } from "country-state-city";
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
  getSkillsData,
  getJobCategoryData,
  createJobPost,
} from "../ApiService/action";
const { Option } = Select;
const { Group: InputGroup } = Input;
export default function PostJobs() {
  const [profileImage, setProfileImage] = useState(""); // This will now store Base64
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [jobNatureId, setJobNatureId] = useState(null);
  const [workTypeActiveButton, setWorkTypeActiveButton] = useState(null);
  const [weeksActiveButton, setWeeksActiveButton] = useState(null);
  const [workLocationActiveButton, setWorkLocationActiveButton] =
    useState(null);
  const { Title, Text } = Typography;
  const [experienceRequiredActiveButton, setExperienceRequiredActiveButton] =
    useState(null);
  const [selectedFresherPass, setSelectedFresherPass] = useState([]);
  const [experienceRequired, setExperienceRequired] = useState("");
  const [salaryTypeActiveButton, setSalaryTypeActiveButton] = useState(null);
  const [diversityenabled, setDiversityEnabled] = useState(true);
  const [genderselected, setGenderSelected] = useState([]);
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
  const [jobCategoryOptions, setJobCategoryOptions] = useState([]);
  const [skillsRequired, setSkillsRequired] = useState([]);
  const [skillsRequiredError, setSkillsRequiredError] = useState("");
  const [skillsRequiredOptions, setSkillsRequiredOption] = useState([]);
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
  const [salaryData, setSalaryData] = useState([]);
  // salary
  const [currency, setCurrency] = useState("INR");
  const [fixedSalary, setFixedSalary] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [jobOpenings, setJobOpenings] = useState("");
  const [jobOpeningsError, setJobOpeningsError] = useState("");
  const [workingDays, setWorkingDays] = useState("");
  const [workingDaysName, setWorkingDaysName] = useState("");
  const [workingDaysError, setWorkingDaysError] = useState("");
  const MAX_LENGTH = 3000;
  const [jobDescription, setJobDescription] = useState("");

  const [workLocationOption, setWorkLocationOption] = useState([]);
  const [openQuestionModal, setOpenQuestionModal] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [questions, setQuestions] = useState([
    {
      id: Date.now(),
      question: "",
      error: "",
      isrequired: false,
    },
  ]);

  const [touched, setTouched] = useState(false); // to control initial error

  const navigate = useNavigate();
  const now = new Date();
  const fetchDateTime =
    now.toLocaleDateString("en-CA") +
    " " +
    now.toLocaleTimeString("en-GB", { hour12: false });

  const workingDaysOptions = [
    { value: "6 Working Days", label: "6 Working Days" },
    { value: "5 Working Days", label: "5 Working Days" },
  ];

  const indianStates = State.getStatesOfCountry("IN");

  useEffect(() => {
    getJobNatureData();
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

  const getSalaryDataType = async () => {
    try {
      const response = await getSalaryData();
      setSalaryData(response?.data?.data || []);
      console.log("Salary data", response);
    } catch (error) {
      console.log("Salary data error", error);
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
        getSkillsDataType();
      }, 300);
    }
  };

  const getSkillsDataType = async () => {
    try {
      const response = await getSkillsData();
      const formattedOptions =
        response?.data?.data?.map((skill) => ({
          label: skill.name,
          value: skill.name,
        })) || [];
      setSkillsRequiredOption(formattedOptions);
    } catch (error) {
      console.log("skills error", error);
    } finally {
      setTimeout(() => {
        getJobCategoryDataTypes();
      }, 300);
    }
  };

  const getJobCategoryDataTypes = async () => {
    try {
      const response = await getJobCategoryData();
      const jobCategoryFormatted =
        response?.data?.data?.map((jobCategory) => ({
          label: jobCategory.category_name,
          value: jobCategory.category_name,
        })) || [];
      setJobCategoryOptions(jobCategoryFormatted);
      console.log("Job Category", response);
    } catch (error) {
      console.log("job cattt error", error);
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
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result;
        setProfileImage(base64String);
      };

      reader.readAsDataURL(file);
    }
  };

  const openModal = () => {
    setIsModalVisible(true);
  };

  const toggleBenefitSelection = (key) => {
    setSelectedBenefits((prevSelected) =>
      prevSelected.includes(key)
        ? prevSelected.filter((item) => item !== key)
        : [...prevSelected, key]
    );
  };

  const handleTagClick = (id) => {
    setGenderSelected((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((gid) => gid !== id); // remove if already selected
      } else {
        return [...prevSelected, id]; // add if not selected
      }
    });
  };

  const visibleBenefits = showMore ? otherBenifits : otherBenifits.slice(0, 4);

  const defaultContent = `
  <p><strong>About the Opportunity:</strong></p>
  <ul>
    <li></li>
    <li></li>
  </ul>
  <p style="margin-top: 30px;"><strong>Responsibilities of the Candidate:</strong></p>
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

  const [value, setValue] = useState(defaultContent);

  const handleChange = (content, delta, source, editor) => {
    if (editor.getLength() <= MAX_LENGTH + 1) {
      setTouched(true);
      setValue(content);
      setJobDescription(content);
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

  const handleCheckValidation = async (e) => {
    e.preventDefault();
    // setIsLoading(true);

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
    const jobOpeningsValidate = selectValidator(jobOpenings);
    const workingDaysValidate = selectValidator(workingDays);

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
    setJobOpeningsError(jobCategoryValidate);
    setWorkingDaysError(workingDaysValidate);

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
      jobOpeningsValidate,
      workingDaysValidate,
    ].some((val) => val !== "");

    if (hasPostJobError) {
      console.log("error publish the post");
      message.error("Please fill all fields correctly before proceeding.");
      setOpenQuestionModal(false);
      return;
    } else {
      setOpenQuestionModal(true);
    }

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
  };

  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpenQuestionModal(false);
      setConfirmLoading(false);
      setOpenDrawer(true);
    }, 2000);
  };

  const onClose = () => {
    setOpenQuestionModal(false);
    setOpenDrawer(false);
  };

  const handleAddQuestions = () => {
    setQuestions([
      ...questions,
      {
        id: Date.now(),
        question: "",
        isrequired: false,
        error: "",
      },
    ]);
  };

  const handleQuestionChange = (index, fieldName, value) => {
    const updated = [...questions];
    updated[index][fieldName] = value;

    if (fieldName === "question" && value.trim() !== "") {
      updated[index].error = "";
    }

    setQuestions(updated);
  };

  const handleRemoveQuestion = (id) => {
    if (questions.length === 1) return;
    setQuestions((prevQuestions) => prevQuestions.filter((q) => q.id !== id));
  };

  const generatePayload = () => {
    const getUserDetails = JSON.parse(localStorage.getItem("loginDetails"));

    const getDurationName = internShipDuration.find(
      (f) => f.id === selectedDurationId
    );

    const allBenefitsData = otherBenifits
      .filter((b) => selectedBenefits.includes(b.id))
      .map((b) => b.name);

    const allDiversity = gender
      .filter((d) => genderselected.includes(d.id))
      .map((d) => d.name);

    console.log(allDiversity);

    return {
      user_id: getUserDetails.id,
      company_name: companyName,
      company_logo: profileImage,
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
          : jobNatureId === 3
          ? "Contract"
          : "",
      workplace_type:
        workplaceType === 1
          ? "In Office"
          : workplaceType === 2
          ? "Work From Home"
          : workplaceType === 3
          ? "On Field"
          : "",
      work_location:
        workLocation === 1
          ? specificLocation
          : workLocation === 2
          ? "Pan India"
          : "",
      job_category: jobCategory,
      skills: skillsRequired,
      experience_type:
        eligibility === 1 ? "Fresher" : eligibility === 2 ? "Experienced" : "",
      experience_required:
        eligibility === 1
          ? selectedFresherPass
          : eligibility === 2
          ? experienceRequired
          : "",
      salary_type:
        salaryDetails === 1 ? "Fixed" : salaryDetails === 2 ? "Range" : "",
      min_salary: salaryDetails === 1 ? fixedSalary : salaryMin,
      max_salary: salaryDetails === 2 ? salaryMax : null,
      diversity_hiring: allDiversity,
      benefits: allBenefitsData,
      created_at: fetchDateTime,
      openings: jobOpenings,
      working_days: workingDaysName,
      job_description: jobDescription,
    };
  };

  const validateQuestions = () => {
    const updated = questions.map((q) => {
      if (!q.question.trim()) {
        return { ...q, error: "This question is invalid." };
      }
      return { ...q, error: "" };
    });

    setQuestions(updated);
    return updated.every((q) => !q.error);
  };

  const handlePublishPostWithQuestions = async () => {
    const isValid = validateQuestions();
    if (!isValid) {
      message.error("Please fix all question errors before publishing.");
      return;
    }

    const payload = {
      ...generatePayload(),
      questions: questions,
    };

    await publish(payload);
  };

  const handlePublishPostWithoutQuestions = async () => {
    const payload = {
      ...generatePayload(),
      questions: [],
    };
    console.log("job posted", payload);
    await publish(payload);
  };

  const publish = async (payload) => {
    try {
      const response = await createJobPost(payload);
      console.log("posted job", response);

      setIsLoading(true);
      setTimeout(() => {
        message.success("Job Posted Successfully.");
        navigate("/job-portal");
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error posting job", error);
    }
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
                          if (item.id === 3 || item.id === 1) {
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
                    style={{ color: "red", marginTop: "8px", fontSize: 13 }}
                  >
                    {"Workplace Type" + workplaceTypeError}
                  </div>
                )}
              </Form.Item>
            </div>
          </div>

          <div style={{ marginTop: 15 }} className="form-group">
            {workTypeActiveButton === 3 || workTypeActiveButton === 1 ? (
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
              mode="multiple"
              placeholder={"Select skills"}
              style={{ height: 56 }}
              value={skillsRequired}
              options={skillsRequiredOptions}
              onChange={(value) => {
                setSkillsRequired(value);
                setSkillsRequiredError(selectValidator(value));
              }}
              error={skillsRequiredError}
            />
          </div>

          {/* Openings */}
          <div style={{ marginTop: 0 }} className="form-group">
            <CommonInputField
              name={"Job Openings"}
              label="Job Openings"
              mandotary={true}
              placeholder={"No.of openings"}
              type={"text"}
              value={jobOpenings}
              onChange={(e) => {
                setJobOpenings(e.target.value);
                setJobOpeningsError(selectValidator(e.target.value));
              }}
              error={jobOpeningsError}
            />
          </div>

          {/* working days */}
          <div style={{ marginTop: 0 }} className="form-group">
            <CommonSelectField
              label={"Working Days"}
              showSearch={true}
              value={workingDays}
              mandatory={true}
              name={"working_days"}
              placeholder={"Choose working days"}
              options={workingDaysOptions}
              onChange={(value) => {
                setWorkingDays(value);
                setWorkingDaysName(value);
                setWorkingDaysError(selectValidator(value));
              }}
              error={workingDaysError}
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
                        setEligibilityError("");
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
                  style={{ color: "red", marginTop: "8px", fontSize: 13 }}
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
                  style={{ color: "red", marginTop: "8px", fontSize: 13 }}
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
                    key={item.id}
                    checked={genderselected.includes(item.id)}
                    onChange={() => handleTagClick(item.id)}
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
                color:
                  value.replace(/<[^>]+>/g, "").length >= MAX_LENGTH
                    ? "red"
                    : "gray",
              }}
            >
              {value.replace(/<[^>]+>/g, "").length}/{MAX_LENGTH}
            </div>
          </div>

          <div className="job_posting_submit">
            <div style={{ justifyContent: "end" }} className="button-group">
              <button onClick={handleCheckValidation} className="primary-btn">
                <span>Save</span>
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

              <Modal
                className="premium-question-modal"
                open={openQuestionModal}
                title={
                  <div className="premium-modal-header">
                    <div className="header-icon-container">
                      <QuestionCircleOutlined className="header-icon" />
                    </div>
                    <span className="header-title">
                      Want to add questions on your post
                    </span>
                  </div>
                }
                onOk={handleOk}
                closable={false}
                confirmLoading={confirmLoading}
                onCancel={handlePublishPostWithoutQuestions}
                okText="Yes, Add Questions"
                cancelText="Publish Without Questions"
                maskClosable={false}
                width={560}
                centered
                footer={
                  <div className="premium-modal-footer">
                    <Button
                      key="publish"
                      onClick={handlePublishPostWithoutQuestions}
                      className="premium-cancel-btn"
                      size="large"
                    >
                      Publish Without Questions
                    </Button>
                    <Button
                      key="add"
                      type="primary"
                      onClick={handleOk}
                      loading={confirmLoading}
                      className="premium-confirm-btn"
                      size="large"
                    >
                      {confirmLoading ? (
                        <>
                          <span className="btn-loading-text">Adding</span>
                          <span className="btn-loading-dots"></span>
                        </>
                      ) : (
                        "Yes, Add Questions"
                      )}
                    </Button>
                  </div>
                }
              >
                <div className="premium-modal-content">
                  <p className="premium-modal-description">
                    Adding interactive questions can increase engagement by up
                    to 300%. Would you like to include some questions with your
                    post?
                  </p>
                </div>
              </Modal>

              <Drawer
                title="Question Manager"
                closable={{ "aria-label": "Close Button" }}
                onClose={onClose}
                open={openDrawer}
                width={600}
                headerStyle={{
                  borderBottom: "1px solid #f0f0f0",
                  padding: "24px",
                  fontSize: "18px",
                  fontWeight: 600,
                  background: "#fafafa",
                }}
                bodyStyle={{ padding: "24px" }}
                maskStyle={{ background: "rgba(0, 0, 0, 0.45)" }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                  }}
                >
                  {questions.map((q, index) => (
                    <div
                      key={q.id}
                      style={{
                        position: "relative",
                        padding: "12px 20px 10px 20px",
                        borderRadius: "8px",
                        border: "1px solid #f0f0f0",
                        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
                        transition: "all 0.3s ease",
                        background: "#fff",
                        ":hover": {
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                        },
                      }}
                    >
                      <CommonInputField
                        name={"question" + index}
                        label={`Question ${index + 1}`}
                        placeholder="e.g. What is your current location?"
                        type="text"
                        value={q.question}
                        onChange={(e) => {
                          handleQuestionChange(
                            index,
                            "question",
                            e.target.value
                          );
                        }}
                        inputStyle={{
                          padding: "12px 16px",
                          borderRadius: "6px",
                          border: "1px solid #d9d9d9",
                        }}
                        labelStyle={{
                          fontWeight: 500,
                          marginBottom: "8px",
                          color: "#1d1d1d",
                        }}
                      />
                      {q.error && (
                        <div
                          style={{
                            color: "#ff4d4f",
                            marginTop: "6px",
                            fontSize: "13px",
                          }}
                        >
                          {q.error}
                        </div>
                      )}

                      <Checkbox
                        style={{ marginTop: 10 }}
                        checked={q.isrequired}
                        onChange={(e) =>
                          handleQuestionChange(
                            index,
                            "isrequired",
                            e.target.checked
                          )
                        }
                      >
                        Is Required
                      </Checkbox>

                      {index !== 0 && (
                        <Button
                          type="text"
                          danger
                          icon={
                            <MdDeleteForever style={{ fontSize: "18px" }} />
                          }
                          onClick={() => handleRemoveQuestion(q.id)}
                          style={{
                            position: "absolute",
                            top: "16px",
                            right: "16px",
                            padding: "4px",
                            color: "#ff4d4f",
                            ":hover": {
                              background: "#fff2f0",
                            },
                          }}
                        />
                      )}
                    </div>
                  ))}

                  <Button
                    onClick={handleAddQuestions}
                    type="primary"
                    className=""
                    ghost
                    icon={<IoMdAdd style={{ fontSize: "18px" }} />}
                    style={{
                      alignSelf: "flex-end",
                      padding: "8px 16px",
                      height: "auto",
                      borderStyle: "dashed",
                      borderWidth: "1.5px",
                      borderRadius: "6px",
                      fontWeight: 500,
                      color: "#6a00ff",
                      borderColor: "#6a00ff",
                    }}
                  >
                    Add New Question
                  </Button>
                </div>
                <Button
                  onClick={handlePublishPostWithQuestions}
                  style={{
                    padding: "10px 15px",
                    backgroundColor: "#6900ad",
                    border: "none",
                    color: "#fff",
                    fontSize: 16,
                    display: "flex",
                    alignItems: "center",
                  }}
                  className="add_question"
                  loading={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="btn-loading-text">Publishing</span>
                      <span className="btn-loading-dots"></span>
                    </>
                  ) : (
                    <>
                      <span>Publish</span>
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5 12H19M19 12L12 5M19 12L12 19"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                      </svg>
                    </>
                  )}
                </Button>
              </Drawer>
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
                <a style={{ color: "#6a00ff" }} href="">
                  Get in touch with us here
                </a>
              </li>
            </ul>
          </div>
        </Col>
      </Row>
    </section>
  );
}
