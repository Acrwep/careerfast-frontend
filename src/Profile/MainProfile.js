import React, { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Progress,
  Card,
  Avatar,
  Button,
  Space,
  Divider,
  Tag,
  Tooltip,
  Drawer,
  Upload,
  Typography,
  Input,
  Form,
  Select,
  Row,
  Col,
  DatePicker,
  message,
  Checkbox,
} from "antd";
import {
  StarOutlined,
  EyeOutlined,
  LinkOutlined,
  EditOutlined,
  CheckCircleFilled,
  PlusOutlined,
  UploadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { IoIosMale } from "react-icons/io";
import { IoMdAdd } from "react-icons/io";
import { IoFemaleOutline } from "react-icons/io5";
import { LuGraduationCap } from "react-icons/lu";
import { GiOfficeChair } from "react-icons/gi";
import { PiStudent } from "react-icons/pi";
import { GiNewShoot } from "react-icons/gi";
import "../css/Profile.css";
import { FaFacebookF } from "react-icons/fa";
import { FiBriefcase, FiCalendar, FiArrowRight } from "react-icons/fi";
import { BsThreads } from "react-icons/bs";
import { FaInstagram } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { FaBehance } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { FaDribbble } from "react-icons/fa";
import { PiGenderTransgender } from "react-icons/pi";
import { PiGenderIntersex } from "react-icons/pi";
import { PiGenderNonbinary } from "react-icons/pi";
import { MdNotInterested } from "react-icons/md";

import { FaFigma } from "react-icons/fa6";
import { IoMdLink } from "react-icons/io";
import { LiaSchoolSolid } from "react-icons/lia";
import { MdFileDownloadDone } from "react-icons/md";
import profile1 from "../images/profile1.webp";
import profile2 from "../images/profile2.webp";
import profile3 from "../images/profile3.webp";
import profile5 from "../images/profile5.webp";
import profile6 from "../images/profile6.webp";
import profile7 from "../images/profile7.webp";

import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { addDays, subDays, format, parseISO, setDate } from "date-fns";
import { motion } from "framer-motion";
import CommonInputField from "../Common/CommonInputField";
import CommonSelectField from "../Common/CommonSelectField";
import CommonTextArea from "../Common/CommonTextArea";
import {
  emailValidator,
  genderValidator,
  nameValidator,
  phoneValidation,
  selectValidator,
  userTypeValidator,
} from "../Common/Validation";
import CommonDatePicker from "../Common/CommonDatePicker";
import {
  getGenderData,
  getUserProfile,
  getUserTypeData,
  insertEducation,
  insertExperience,
  insertProjects,
  updateAbout,
  updateBasicDetails,
  updateEducation,
  updateResume,
  updateSkills,
  updateSocialLinks,
} from "../ApiService/action";

const { Title, Text } = Typography;
const { Dragger } = Upload;

// Calculate streaks
const currentStreak = 2;
const maxStreak = 3;

const { Header, Sider, Content } = Layout;
const { Meta } = Card;

const items = [
  { key: "basic", label: "Basic Details" },
  { key: "resume", label: "Resume" },
  { key: "about", label: "About" },
  { key: "skills", label: "Skills" },
  { key: "education", label: "Education" },
  { key: "experience", label: "Work Experience" },
  // { key: "certification", label: "Certifications" },
  { key: "projects", label: "Projects" },
  // { key: "personalDetails", label: "Personal Details" },
  { key: "sociallinks", label: "Social Links" },
];

const suggestions = [
  "Deep Learning",
  "Tone of Voice",
  "CRM Proficiency",
  "E-Discovery",
  "Embedded Programming",
  "GDPR Compliance",
  "Medical Malpractice",
  "Remote Access",
  "Education Law",
  "Substance Designer",
];

const yearOptions = Array.from({ length: 2025 - 1990 + 1 }, (_, i) => {
  const year = (1990 + i).toString();
  return { label: year, value: year };
});

const workingYearOptions = Array.from({ length: 2025 - 1990 + 1 }, (_, i) => {
  const workingYear = (1990 + i).toString();
  return { label: workingYear, value: workingYear };
});

const FresherYearOptions = Array.from({ length: 2025 - 1990 + 1 }, (_, i) => {
  const FreshYear = (1990 + i).toString();
  return { label: FreshYear, value: FreshYear };
});

const startYearOptions = yearOptions;
const endYearOptions = yearOptions;

const fresherStartYearOptions = FresherYearOptions;
const fresherEndYearOptions = FresherYearOptions;

const workingStartDateOptions = workingYearOptions;
const workingEndDateOptions = workingYearOptions;

export default function MainProfile() {
  const [certifications, setCertification] = useState([]);
  const [activeTab, setActiveTab] = useState("basic");
  const [aboutText, setAboutText] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [customSkill, setCustomSkill] = useState("");
  const [activeButton, setActiveButton] = useState(null);
  const [userTypeactiveButton, setUserTypeActiveButton] = useState(null);
  const defaultAvatar =
    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
  const [avatarUrl, setAvatarUrl] = useState(defaultAvatar);
  const [lateral, setLateral] = useState(null);

  //
  const [form] = Form.useForm();
  const [fname, setFname] = useState("");
  const [fnameError, setFnameError] = useState("");
  const [lname, setLname] = useState("");
  const [lnameError, setLnameError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [gender, setGender] = useState("");
  const [genderOptions, setGenderOptions] = useState([]);
  const [genderError, setGenderError] = useState("");
  const [userType, setUserType] = useState("");
  const [userTypeName, setUserTypeName] = useState([]);
  const [userTypeError, setUserTypeError] = useState("");
  const [course, setCourse] = useState(null);
  const [courseError, setCourseError] = useState("");
  const [location, setLocation] = useState("");
  const [locationError, setLocationError] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startDateError, setStartDateError] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endDateError, setEndDateError] = useState("");
  const [fresherCourse, setFresherCourse] = useState("");
  const [fresherCourseError, setFresherCourseError] = useState("");
  const [fresherStartDate, setFresherStartDate] = useState("");
  const [fresherStartDateError, setFresherStartDateError] = useState("");
  const [fresherEndtDate, setFresherEndDate] = useState("");
  const [fresherEndDateError, setFresherEndDateError] = useState("");
  const [loginUserId, setLoginUserId] = useState(null);
  const [organizationName, setOrganisationName] = useState("");
  const [organizationNameType, setOrganizationType] = useState("");
  const [resumeError, setResumeError] = useState("");

  //

  const [qualificaton, setQualification] = useState("");
  const [qualificatonError, setQualificationError] = useState("");
  const [educationCourse, setEducationCourse] = useState("");
  const [educationCourseError, setEducationCourseError] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [specializationError, setSpecializationError] = useState("");
  const [collage, setCollage] = useState("");
  const [collageError, setCollageError] = useState("");
  const [courseType, setCourseType] = useState("");
  const [courseTypeError, setCourseTypeError] = useState("");
  const [percentage, setPercentage] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [educationStartDate, setEducationStartDate] = useState("");
  const [educationStartDateError, setEducationStartDateError] = useState("");
  const [educationEndDate, setEducationEndDate] = useState("");
  const [educationEndDateError, setEducationEndDateError] = useState("");
  const [aboutTextNew, setAboutTextNew] = useState("");
  const [aboutTextError, setAboutTextError] = useState("");
  //
  const [designation, setDesignation] = useState("");
  const [designationError, setDesignationError] = useState("");
  const [employmentTypeError, setEmploymentTypeError] = useState("");
  const [workExpStartDate, setWorkExpStartDate] = useState("");
  const [workExpStartDateError, setWorkExpStartDateError] = useState("");
  const [workExpEndDate, setWorkExpEndDate] = useState("");
  const [workExpEndDateError, setWorkExpEndDateError] = useState("");
  const [workExpLocation, setWorkExpLocation] = useState("");
  const [workExpLocationError, setWorkExpLocationError] = useState("");
  const [resumeFile, setResumeFile] = useState(null);

  // work exp
  const [selectExperienceType, setSelectExperienceType] = useState("");
  const [workingCompanyName, setWorkingCompanyName] = useState("");
  const [workingCompanyNameError, setWorkingCompanyNameError] = useState("");
  const [selectExperienceTypeError, setSelectExperienceTypeError] =
    useState("");
  const [experienceType, setExperienceType] = useState(null);
  const [totalYearsExperience, setTotalYearsExperience] = useState("");
  const [totalYearsExperienceError, setTotalYearsExperienceError] =
    useState("");
  const [totalMonthsExperience, setTotalMonthsExperience] = useState("");
  const [totalMonthsExperienceError, setTotalMonthsExperienceError] =
    useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobTitleError, setJobTitleError] = useState("");
  const [workingStartDate, setWorkingStartDate] = useState("");
  const [workingStartDateError, setWorkingStartDateError] = useState("");
  const [workingEndDate, setWorkingEndDate] = useState("");
  const [workingEndDateError, setWorkingEndDateError] = useState("");
  //
  const [companyName, setCompanyName] = useState("");
  const [companyNameError, setCompanyNameError] = useState("");
  const [project, setProject] = useState("");
  const [projectError, setProjectError] = useState("");
  const [projectType, setProjectType] = useState("");
  const [projectTypeError, setProjectTypeError] = useState("");
  const [projectStartDate, setProjectStartDate] = useState("");
  const [projectStartDateError, setProjectStartDateError] = useState("");
  const [projectEndDate, setProjectEndDate] = useState("");
  const [projectEndDateError, setProjectEndDateError] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectDescriptionError, setProjectDescriptionError] = useState("");
  const [projectsList, setProjectsList] = useState([]);
  const [showForm, setShowForm] = useState(true);
  const [rollNumber, setRollNumber] = useState("");
  const [educationId, setEducationId] = useState("");
  const [companies, setCompanies] = useState([
    {
      id: Date.now(),
      workingCompanyName: "",
      designation: "",
      workingStartDate: "",
      workingEndDate: "",
      currentlyWorking: false,
    },
  ]);

  //
  const [customSkillError, setCustomSkillError] = useState("");

  useEffect(() => {
    getGenderDataType();
  }, []);

  useEffect(() => {
    if (loginUserId) {
      getUserProfileData();
    }
  }, [loginUserId]);

  const getUserProfileData = async () => {
    const payload = {
      user_id: loginUserId,
    };
    try {
      const response = await getUserProfile(payload);
      console.log("getuserprofile", response);
    } catch (error) {
      console.log("getuserprofile", error);
    }
  };

  const getGenderDataType = async () => {
    try {
      const response = await getGenderData();
      setGenderOptions(response?.data?.data || []);
      console.log("gender", response);
    } catch (error) {
      console.log("gender error", error);
    } finally {
      setTimeout(() => {
        getUserTypeDataOptions();
      }, 300);
    }
  };

  const getUserTypeDataOptions = async () => {
    try {
      const response = await getUserTypeData();
      setUserTypeName(response?.data?.data || []);
      console.log("userType", response);
    } catch (error) {
      console.log("usertype", error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const fnameValidate = nameValidator(fname);
    const lnameValidate = nameValidator(lname);
    const emailValidate = emailValidator(email);
    const phoneValidate = phoneValidation(phoneNumber);
    const genderValidate = genderValidator(gender);
    const userTypeValidate = userTypeValidator(userType);
    const locationValidate = nameValidator(location);
    const courseValidate =
      userType === "College Student" ? selectValidator(course) : "";
    const startDateValidate =
      userType === "College Student" ? selectValidator(startDate) : "";
    const endDateValidate =
      userType === "College Student" ? selectValidator(endDate) : "";

    const fresherCourseValidate =
      userType === "Fresher" ? selectValidator(fresherCourse) : "";
    const fresherStartDateValidate =
      userType === "Fresher" ? selectValidator(fresherStartDate) : "";
    const fresherEndtDateValidate =
      userType === "Fresher" ? selectValidator(fresherEndtDate) : "";

    setFnameError(fnameValidate);
    setLnameError(lnameValidate);
    setEmailError(emailValidate);
    setPhoneNumberError(phoneValidate);
    setGenderError(genderValidate);
    setUserTypeError(userTypeValidate);
    setLocationError(locationValidate);
    setCourseError(courseValidate);
    setStartDateError(startDateValidate);
    setEndDateError(endDateValidate);
    setFresherCourseError(fresherCourseValidate);
    setFresherStartDateError(fresherStartDateValidate);
    setFresherEndDateError(fresherEndtDateValidate);

    const hasErrors = [
      fnameValidate,
      lnameValidate,
      emailValidate,
      phoneValidate,
      genderValidate,
      userTypeValidate,
      locationValidate,
      ...(userType === "College Student"
        ? [courseValidate, startDateValidate, endDateValidate]
        : []),
      ...(userType === "Fresher"
        ? [
            fresherCourseValidate,
            fresherStartDateValidate,
            fresherEndtDateValidate,
          ]
        : []),
    ].some((val) => val !== "");

    if (hasErrors) {
      message.error("Please fill all fields correctly before proceeding.");
      return;
    }

    const payload = {
      first_name: fname,
      last_name: lname,
      gender: gender,
      user_type: userType,
      location: location,
      ...(userType === "College Student" && {
        course: course,
        start_year: startDate,
        end_year: endDate,
      }),
      ...(userType === "Fresher" && {
        course: fresherCourse,
        start_year: fresherStartDate,
        end_year: fresherEndtDate,
      }),

      ...(userType === "School Student" && {
        classes: Class,
      }),
      user_id: loginUserId,
    };
    try {
      const response = await updateBasicDetails(payload);
      console.log("Saving user data:", response);
      message.success("Profile details saved successfully.");
      resetFormFields();
    } catch (error) {
      console.log("Saving user data:", error);
    }
  };

  //

  const yearOptions = Array.from({ length: 2025 - 1990 + 1 }, (_, i) => {
    const year = (1990 + i).toString();
    return { label: year, value: year };
  });

  const educationStartDateOptions = yearOptions;
  const educationEndDateOptions = yearOptions;

  const handleExperienceTypeChange = (value) => setExperienceType(value);
  const handleCompanyFields = (index, fieldName, value) => {
    const updateDatas = [...companies];
    updateDatas[index][fieldName] = value;

    if (fieldName === "workingCompanyName") {
      updateDatas[index].workingCompanyNameError = nameValidator(value);
    }

    if (fieldName === "designation") {
      updateDatas[index].designationError = nameValidator(value);
    }

    if (fieldName === "workingStartDate") {
      updateDatas[index].WorkingStartDateError = selectValidator(value);
    }

    if (fieldName === "workingEndDate") {
      updateDatas[index].workingEndDateError = selectValidator(value);
    }

    if (fieldName === "currentlyWorking") {
      if (updateDatas[index].currentlyWorking === true) {
        updateDatas[index].workingEndDate = "";
        updateDatas[index].workingEndDateError = "";
      }
    }

    setCompanies(updateDatas);
  };

  const handleAddCompany = () => {
    setCompanies([
      ...companies,
      {
        id: Date.now(),
        workingCompanyName: "",
        designation: "",
        workingStartDate: "",
        workingEndDate: "",
        currentlyWorking: false,
      },
    ]);
  };

  const handleEducationSave = async (e) => {
    e.preventDefault();

    const qualificatonValidate = selectValidator(qualificaton);
    const educationCourseValidate = selectValidator(educationCourse);
    const specializationValidate = selectValidator(specialization);
    const collageValidate = nameValidator(collage);
    const courseTypeValidate = selectValidator(courseType);
    const educationStartDateValidate = selectValidator(educationStartDate);
    const educationEndDateValidate = selectValidator(educationEndDate);

    setQualificationError(qualificatonValidate);
    setEducationCourseError(educationCourseValidate);
    setSpecializationError(specializationValidate);
    setCollageError(collageValidate);
    setCourseTypeError(courseTypeValidate);
    setEducationStartDateError(educationStartDateValidate);
    setEducationEndDateError(educationEndDateValidate);

    const hasEducationErrors = [
      qualificatonValidate,
      educationCourseValidate,
      specializationValidate,
      collageValidate,
      courseTypeValidate,
      educationStartDateValidate,
      educationEndDateValidate,
    ].some((val) => val !== "");

    if (hasEducationErrors) {
      message.error("Please fill all fields correctly before proceeding.");
      return;
    }

    const payload = {
      user_id: loginUserId,
      qualification: qualificaton,
      course: educationCourse,
      specialization: specialization,
      college: collage,
      start_date: educationStartDate,
      end_date: educationEndDate,
      course_type: courseType,
      percentage: percentage,
      cgpa: cgpa,
      roll_number: rollNumber,
      lateral_entry: lateral,
    };

    try {
      if (educationId) {
        const response = await updateEducation({ ...payload, id: educationId });
        console.log("Education updated:", response);
        message.success("Education updated successfully.");
      } else {
        const response = await insertEducation(payload);
        console.log("Education inserted:", response);
        message.success("Education added successfully.");
        resetFormFields();
      }
    } catch (error) {
      console.error("Education save/update failed:", error);
      message.error("Failed to save education data.");
    }
  };

  const handleDeleteCompanyWork = (index) => {
    if (companies.length === 1) return;
    let data = [...companies];
    data.splice(index, 1);
    setCompanies(data);
  };

  const handleWorkExpSave = async (e) => {
    e.preventDefault();

    const selectExperienceTypeValidate = selectValidator(selectExperienceType);

    setSelectExperienceTypeError(selectExperienceTypeValidate);

    let experienceErrors = false;

    let totalYearsExperienceValidate = "";
    let totalMonthsExperienceValidate = "";
    let jobTitleValidate = "";

    if (selectExperienceType === "Experience") {
      totalYearsExperienceValidate = selectValidator(totalYearsExperience);
      totalMonthsExperienceValidate = selectValidator(totalMonthsExperience);
      jobTitleValidate = nameValidator(jobTitle);

      setTotalYearsExperienceError(totalYearsExperienceValidate);
      setTotalMonthsExperienceError(totalMonthsExperienceValidate);
      setJobTitleError(jobTitleValidate);

      const validateCompanyFields = companies.map((item) => ({
        ...item,
        workingCompanyNameError: nameValidator(item.workingCompanyName),
        designationError: nameValidator(item.designation),
        workingStartDateError: selectValidator(item.workingStartDate),
        workingEndDateError: item.currentlyWorking
          ? ""
          : selectValidator(item.workingEndDate),
      }));

      setCompanies(validateCompanyFields);

      experienceErrors = validateCompanyFields.some(
        (err) =>
          err.workingCompanyNameError ||
          err.designationError ||
          err.workingStartDateError ||
          err.workingEndDateError
      );
    }

    const hasAnyError =
      selectExperienceTypeValidate ||
      totalYearsExperienceValidate ||
      totalMonthsExperienceValidate ||
      jobTitleValidate ||
      experienceErrors;

    if (hasAnyError) {
      message.error("Please fill all fields correctly before proceeding.");
      return;
    } else {
      console.log("Exp Inserted");
    }

    const experiences = companies.map((company) => ({
      company_name: company.workingCompanyName,
      designation: company.designation,
      start_date: company.workingStartDate,
      end_date: company.workingEndDate,
      currently_working: company.currentlyWorking,
      experince_type: selectExperienceType,
      total_years: totalYearsExperience,
      total_months: totalMonthsExperience,
      job_title: jobTitle,
    }));

    const payload = {
      user_id: loginUserId,
      experiences,
    };

    try {
      const response = await insertExperience(payload);
      console.log("workexp", response);
      message.success("Experience inserted successfully");
      // resetFormFields();
    } catch (error) {
      console.log("experience insert error", error);
    }
  };

  const handleProjectSave = async (e) => {
    e.preventDefault();
    const projectCompanyNameValidate = nameValidator(companyName);
    const projectValidate = nameValidator(project);
    const projectTypeValidate = selectValidator(projectType);
    const projectStartDateValidate = selectValidator(projectStartDate);
    const projectEndDateValidate = selectValidator(projectEndDate);
    const projectDescriptionValidate = nameValidator(projectDescription);

    setCompanyNameError(projectCompanyNameValidate);
    setProjectError(projectValidate);
    setProjectTypeError(projectTypeValidate);
    setProjectStartDateError(projectStartDateValidate);
    setProjectEndDateError(projectEndDateValidate);
    setProjectDescriptionError(projectDescriptionValidate);

    const hasProjectError = [
      projectCompanyNameValidate,
      projectValidate,
      projectTypeValidate,
      projectStartDateValidate,
      projectEndDateValidate,
      projectDescriptionValidate,
    ].some((val) => val !== "");

    if (hasProjectError) {
      message.error("Please fill all fields correctly before proceeding.");
      return;
    }

    const payload = {
      user_id: loginUserId,
      company_name: companyName,
      project_title: project,
      project_type: projectType,
      start_date: formatDateTime(projectStartDate),
      end_date: formatDateTime(projectEndDate),
      description: projectDescription,
    };

    try {
      const response = await insertProjects(payload);
      console.log("project", response);

      setProjectsList([...projectsList, payload]);

      setShowForm(false);
    } catch (error) {
      console.log("project error", error);
      message.error("Failed to save project");
    }
  };

  const handleAddNewProject = () => {
    setShowForm(true);
    setCompanyName("");
    setProject("");
    setProjectStartDate("");
    setProjectEndDate("");
    setProjectType("");
  };

  const handleDeleteCompany = (idx) => {
    let data = [...projectsList];
    data.splice(idx, 1);
    setProjectsList(data);
  };

  const handleAboutSave = async (e) => {
    e.preventDefault();

    const aboutTextValidate = nameValidator(aboutTextNew);

    setAboutTextError(aboutTextValidate);

    const hasAboutError = [aboutTextValidate].some((val) => val !== "");

    if (hasAboutError) {
      return;
    }

    const payload = {
      about: aboutTextNew,
      id: loginUserId,
    };

    try {
      const response = await updateAbout(payload);
      console.log("updateAbout", response);

      setAboutText(response?.data?.data || []);
      message.success("About details saved successfully.");
    } catch (error) {
      setAboutTextError(aboutTextValidate);
    }
  };

  const handleBeforeUpload = (file) => {
    const isValidType = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ].includes(file.type);
    const isLt10MB = file.size / 1024 / 1024 < 10;

    if (!isValidType) {
      message.error("Only DOC, DOCX, or PDF files are allowed!");
      return Upload.LIST_IGNORE;
    }

    if (!isLt10MB) {
      message.error("File must be smaller than 10MB!");
      return Upload.LIST_IGNORE;
    }
    setResumeError("");
    setResumeFile(file);
    return false;
  };

  const handleSkillsSave = async (e) => {
    e.preventDefault();

    const customskillValidate = nameValidator(customSkill);

    if (selectedSkills.length === 0 && customSkill.trim() === "") {
      setCustomSkillError(customskillValidate);
      message.warning("Please add at least one skill.");
      return;
    }

    if (customSkill.trim() !== "") {
      setSelectedSkills((prev) => [...prev, customSkill.trim()]);
    }

    const customSkillUserData = {
      skills: [
        ...selectedSkills,
        ...(customSkill.trim() ? [customSkill.trim()] : []),
      ],
    };

    const payload = {
      skills: selectedSkills,
      user_id: loginUserId,
    };

    try {
      const response = await updateSkills(payload);
      console.log("skilssss", response);

      setSelectedSkills(response?.data?.data || []);
    } catch (error) {
      setCustomSkillError(customskillValidate);
    }

    console.log("Saving skills data:", customSkillUserData);
    message.success("Skills saved successfully.");
    resetFormFields();

    // Reset states
    setCustomSkill("");
    setSelectedSkills([]);
    setCustomSkillError("");
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file); // Reads file as Base64
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileSave = async () => {
    if (!resumeFile) {
      setResumeError("Please upload a valid resume before saving.");
      return;
    }

    try {
      const base64Resume = await getBase64(resumeFile);
      const payload = {
        resume: base64Resume,
        id: loginUserId,
      };

      const response = await updateResume(payload);
      console.log("updateResume", response);

      resetFormFields();
      setResumeError("");
      message.success("Resume saved successfully!");
    } catch (error) {
      console.error("Base64 conversion or upload failed:", error);
      setResumeError("Something went wrong while saving resume.");
    }
  };

  const [socialLinks, setSocialLinks] = useState({
    Linkedin: "",
    Facebook: "",
    Instagram: "",
    Twitter: "",
    Dribbble: "",
    Behance: "",
  });

  const [socialLinkErrors, setSocialLinkErrors] = useState({
    Linkedin: "",
    Facebook: "",
    Instagram: "",
    Twitter: "",
    Dribbble: "",
    Behance: "",
  });

  const [savedLinks, setSavedLinks] = useState("");
  const urlPattern = /^(https?:\/\/)?([\w\d-]+\.)+[\w-]{2,}(\/.*)?$/;
  const handleSocialLinksSave = (name, value) => {
    setSocialLinks((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validation on change
    setSocialLinkErrors((prev) => ({
      ...prev,
      [name]:
        value.trim() === ""
          ? " field is required"
          : !urlPattern.test(value)
          ? " Invalid URL"
          : "",
    }));
  };

  //

  const handleAddSocialLinks = async () => {
    let hasErrors = false;
    const newErrors = {};

    Object.entries(socialLinks).forEach(([platform, link]) => {
      if (link.trim() !== "" && !urlPattern.test(link)) {
        newErrors[platform] = "Invalid URL";
        hasErrors = true;
      }
    });

    setSocialLinkErrors((prev) => ({ ...prev, ...newErrors }));

    if (hasErrors) {
      message.error("Please correct the errors before saving.");
      return;
    }

    const hasAnyLink = Object.values(socialLinks).some(
      (val) => val.trim() !== ""
    );
    if (!hasAnyLink) {
      message.warning("Please enter at least one social link.");
      return;
    }

    const payload = {
      linkedin: socialLinks["Linkedin"] || "",
      facebook: socialLinks["Facebook"] || "",
      instagram: socialLinks["Instagram"] || "",
      twitter: socialLinks["Twitter"] || "",
      dribble: socialLinks["Dribbble"] || "",
      behance: socialLinks["Behance"] || "",
      user_id: loginUserId,
    };

    try {
      const response = await updateSocialLinks(payload);
      console.log("social links", response);
      message.success("Social links saved successfully!");
    } catch (error) {
      message.error("Failed to save social links.");
    }

    // Reset fields
    setSocialLinks({
      Linkedin: "",
      Facebook: "",
      Instagram: "",
      Twitter: "",
      Dribbble: "",
      Behance: "",
    });

    setSocialLinkErrors({
      Linkedin: "",
      Facebook: "",
      Instagram: "",
      Twitter: "",
      Dribbble: "",
      Behance: "",
    });
  };

  const handleLateralTypeChange = (value) => {
    setLateral(value);
    console.log("Selected Lateral Entry Option:", value);
  };

  const today = new Date();

  const formatDateTime = (date) => {
    return new Date(date).toISOString().slice(0, 19).replace("T", " "); // 'YYYY-MM-DD HH:MM:SS'
  };

  const [isLoading, setIsLoading] = useState(true);

  // Simulate data loading
  useEffect(() => {
    const storedAvatar = localStorage.getItem("profileAvatar");
    if (storedAvatar) {
      setAvatarUrl(storedAvatar);
    }

    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
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
        setPhoneNumber(loginDetails.phone);
        setOrganisationName(loginDetails.organization);
        setOrganizationType(loginDetails.organization_type);
      }
      console.log("stored", stored);
    } catch (error) {
      console.error("Invalid JSON in localStorage", error);
    }
  }, []);

  const streakData = [
    { date: "2025-05-08", count: 4 },
    { date: "2025-05-18", count: 1 },
    { date: "2025-05-19", count: 1 },
    { date: "2025-05-20", count: 1 },
    { date: "2025-05-30", count: 1 },
    { date: "2025-05-31", count: 1 },
  ];

  const getClassForValue = (value) => {
    if (!value) return "color-empty";
    if (value.count >= 3) return "color-scale-3";
    if (value.count >= 2) return "color-scale-2";
    return "color-scale-1";
  };

  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };

  const resetFormFields = () => {
    setGender("");
    setUserType("");
    setLocation("");
    setCourse("");
    setStartDate("");
    setEndDate("");
    setFresherCourse("");
    setFresherStartDate("");
    setFresherEndDate("");
    setActiveButton(null);
    setUserTypeActiveButton(null);
    setClass(null);

    // Education
    setQualification("");
    setEducationCourse("");
    setSpecialization("");
    setCollage("");
    setCourseType("");
    setPercentage("");
    setCgpa("");
    setEducationStartDate("");
    setEducationEndDate("");
    setRollNumber("");

    // Work Experience
    setSelectExperienceType("");
    setSelectExperienceTypeError("");
    setTotalYearsExperience("");
    setTotalYearsExperienceError("");
    setTotalMonthsExperience("");
    setTotalMonthsExperienceError("");
    setJobTitle("");
    setJobTitleError("");
    setWorkExpLocation("");
    setCompanies([
      {
        workingCompanyName: "",
        designation: "",
        workingStartDate: "",
        workingEndDate: "",
      },
    ]);

    // Projects
    setProject("");
    setCompanyName("");
    setCompanyNameError("");
    setProjectType("");
    setProjectStartDate("");
    setProjectEndDate("");
    setProjectDescription("");

    // Skills
    setSelectedSkills([]);
    setCustomSkill("");

    // About
    setAboutTextNew("");

    // Resume
    setResumeFile(null);

    // Social Links
    setSocialLinks({
      Linkedin: "",
      Facebook: "",
      Instagram: "",
      Twitter: "",
      Dribbble: "",
      Behance: "",
    });

    // Errors
    setFnameError("");
    setLnameError("");
    setEmailError("");
    setPhoneNumberError("");
    setGenderError("");
    setUserTypeError("");
    setLocationError("");
    setCourseError("");
    setStartDateError("");
    setEndDateError("");
    setFresherCourseError("");
    setFresherStartDateError("");
    setFresherEndDateError("");
    setQualificationError("");
    setEducationCourseError("");
    setSpecializationError("");
    setCollageError("");
    setCourseTypeError("");
    setEducationStartDateError("");
    setEducationEndDateError("");
    setDesignationError("");
    setEmploymentTypeError("");
    setWorkExpStartDateError("");
    setWorkExpEndDateError("");
    setWorkExpLocationError("");
    setProjectError("");
    setProjectTypeError("");
    setProjectStartDateError("");
    setProjectEndDateError("");
    setProjectDescriptionError("");
    setCustomSkillError("");
    setAboutTextError("");
    setOpen(false);
  };

  const handleAddSkill = (skill) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
      setCustomSkillError("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSelectedSkills(
      selectedSkills.filter((skill) => skill !== skillToRemove)
    );
  };

  const handleCustomSkillAdd = () => {
    const trimmed = customSkill.trim();

    if (!trimmed) {
      setCustomSkillError("Please enter a skill before adding.");
      return;
    }

    if (selectedSkills.includes(trimmed)) {
      setCustomSkillError("Skill already added.");
      return;
    }

    setSelectedSkills((prev) => [...prev, trimmed]);
    setCustomSkill("");
    setCustomSkillError("");
  };

  const handleButtonClick = (buttonId) => {
    setActiveButton(buttonId);
    setGender(buttonId);
    setGenderError("");
  };

  const handleProjectTypeClick = (type) => {
    setActiveButton(type);
    setProjectType(type);
    setProjectTypeError("");
  };

  const handleUserTypeClick = (buttonId) => {
    setUserTypeActiveButton((prev) => buttonId);
    setFresherEndDate("");
    setFresherStartDate("");
    setEndDate("");
    setStartDate("");
  };

  const [purpose, setPurpose] = useState(null);
  const handlePurposeClick = (buttonId) => {
    setPurpose((prev) => buttonId);
  };

  const [Class, setClass] = useState(null);
  const handleClassClick = (buttonId) => {
    setClass((prev) => buttonId);
  };

  const handleCertification = ({ file }) => {
    console.log("fileee", file);

    setCertification([file]);
  };

  const handleUpload = (info) => {
    const file = info.file.originFileObj || info.file;
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageDataUrl = reader.result;
        setAvatarUrl(imageDataUrl);
        localStorage.setItem("profileAvatar", imageDataUrl);
        message.success("Profile image updated!");
      };
      reader.readAsDataURL(file);
    } else {
      message.error("Please upload a valid image file");
    }
  };

  const handleRemove = () => {
    setAvatarUrl(defaultAvatar);
    localStorage.removeItem("profileAvatar");
    message.error("Profile image removed.");
  };
  // --- Tab Content Components ---
  const TabContent = {
    basic: () => (
      <Form
        layout="vertical"
        name="multi-step-form"
        className="multi-step-form"
        form={form}
      >
        <div>
          <div className="form-row">
            <div className="form-group">
              <CommonInputField
                label="First Name"
                mandotary={true}
                value={fname}
                placeholder="Enter your first name"
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
                label="Last Name"
                mandotary={true}
                value={lname}
                placeholder="Enter your Last Name"
                type="text"
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

          <div className="form-row">
            <div className="form-group">
              <CommonInputField
                name="email"
                label="Email"
                mandotary={true}
                value={email}
                placeholder="Enter your Email"
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
                name="Mobile"
                label="Mobile"
                mandotary={true}
                value={phoneNumber}
                placeholder="Enter your mobile"
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  setPhoneNumberError(phoneValidation(e.target.value));
                }}
                readOnly={true}
                disabled={true}
                error={phoneNumberError}
              />
            </div>
          </div>

          <div className="form-group">
            <Form.Item
              layout="vertical"
              label={<span style={{ fontWeight: 500 }}>Gender</span>}
              required
            >
              <div className="job_nature">
                {genderOptions.map((item) => {
                  return (
                    <button
                      type="button"
                      className={
                        activeButton === item.name
                          ? "job_nature_button_active"
                          : "job_nature_button"
                      }
                      onClick={() => {
                        handleButtonClick(item.name);
                        setGender(item.name);
                        setGenderError("");
                      }}
                    >
                      {item.name === "Male" ? (
                        <IoIosMale />
                      ) : item.name === "Female" ? (
                        <IoFemaleOutline />
                      ) : item.name === "Transgender" ? (
                        <PiGenderTransgender />
                      ) : item.name === "Intersex" ? (
                        <PiGenderIntersex />
                      ) : item.name === "Non-binary" ? (
                        <PiGenderNonbinary />
                      ) : item.name === "Others" ? (
                        <MdNotInterested />
                      ) : (
                        ""
                      )}{" "}
                      {item.name}
                    </button>
                  );
                })}
              </div>

              {genderError && (
                <div style={{ color: "red", marginTop: 6, fontSize: 13 }}>
                  {genderError}
                </div>
              )}
            </Form.Item>
          </div>

          <div style={{ marginTop: 15 }} className="form-group">
            <Form.Item
              layout="vertical"
              label={<span style={{ fontWeight: 500 }}>User Type </span>}
              name="usertype"
              rules={[
                {
                  required: true,
                  message: "Please Select your User Type ",
                },
              ]}
            >
              <div className="job_nature">
                {userTypeName.map((item) => {
                  return (
                    <button
                      type="button"
                      className={
                        userTypeactiveButton === item.name
                          ? "job_nature_button_active"
                          : "job_nature_button"
                      }
                      onClick={() => {
                        handleUserTypeClick(item.name);
                        setUserType(item.name);
                        setUserTypeError("");
                      }}
                    >
                      {item.name === "College Student" ? (
                        <LuGraduationCap />
                      ) : item.name === "Professional" ? (
                        <GiOfficeChair />
                      ) : item.name === "School Student" ? (
                        <PiStudent />
                      ) : item.name === "Fresher" ? (
                        <GiNewShoot />
                      ) : (
                        ""
                      )}
                      {item.name}
                    </button>
                  );
                })}
              </div>
              {userTypeError && (
                <div style={{ color: "red", marginTop: 6, fontSize: 13 }}>
                  {userTypeError}
                </div>
              )}
            </Form.Item>
          </div>

          <div className="">
            {userTypeactiveButton === "College Student" && (
              <>
                <div style={{ marginTop: 15 }} className="form-group">
                  <CommonSelectField
                    label="Course"
                    disabled={false}
                    name="course"
                    mandatory={true}
                    placeholder="Select Course"
                    showSearch={true}
                    options={[
                      { value: "MBA", label: "MBA" },
                      { value: "BSC", label: "BSC" },
                    ]}
                    onChange={(value) => {
                      setCourse(value);
                      setCourseError(selectValidator(value));
                    }}
                    error={courseError}
                  />
                </div>

                <div
                  className="form-row"
                  style={{ display: "flex", gap: "16px", alignItems: "center" }}
                >
                  <div className="form-group" style={{ flex: 1 }}>
                    <CommonSelectField
                      value={startDate}
                      label="Start Year"
                      mandatory={true}
                      name="startyear"
                      placeholder="Start Year"
                      options={startYearOptions}
                      onChange={(value) => {
                        setStartDate(value);

                        if (!value || value.trim() === "") {
                          setStartDateError("Start year is required");
                        } else {
                          setStartDateError("");
                        }

                        if (endDate && parseInt(value) > parseInt(endDate)) {
                          setEndDateError("End year must be after start year");
                        } else {
                          setEndDateError("");
                        }
                      }}
                      error={startDateError}
                    />
                  </div>

                  <div className="form-group" style={{ flex: 1 }}>
                    <CommonSelectField
                      value={endDate}
                      label="End Year"
                      name="endyear"
                      placeholder="End Year"
                      mandatory={true}
                      options={endYearOptions}
                      onChange={(value) => {
                        setEndDate(value);

                        if (!value || value.trim() === "") {
                          setEndDateError("End year is required");
                        } else if (
                          startDate &&
                          parseInt(value) < parseInt(startDate)
                        ) {
                          setEndDateError("End year must be after start year");
                        } else {
                          setEndDateError("");
                        }
                      }}
                      error={endDateError}
                    />
                  </div>
                </div>
              </>
            )}

            {userTypeactiveButton === "Fresher" && (
              <>
                <div style={{ marginTop: 15 }} className="form-group">
                  <CommonSelectField
                    label="Course"
                    disabled={false}
                    name="course1"
                    mandatory={true}
                    placeholder="Select Course"
                    showSearch={true}
                    options={[
                      { value: "MBA", label: "MBA" },
                      { value: "BSC", label: "BSC" },
                    ]}
                    onChange={(value) => {
                      setFresherCourse(value);
                      setFresherCourseError(selectValidator(value));
                    }}
                    error={fresherCourseError}
                  />
                </div>

                {/*  */}

                <div
                  className="form-row"
                  style={{ display: "flex", gap: "16px", alignItems: "center" }}
                >
                  <div className="form-group" style={{ flex: 1 }}>
                    <CommonSelectField
                      value={fresherStartDate}
                      label="Start Year"
                      name="startyear"
                      placeholder="Start Year"
                      options={fresherStartYearOptions}
                      onChange={(value) => {
                        setFresherStartDate(value);

                        if (!value || value.trim() === "") {
                          setFresherStartDateError("Start year is required");
                        } else {
                          setFresherStartDateError("");
                        }

                        if (endDate && parseInt(value) > parseInt(endDate)) {
                          setFresherEndDateError(
                            "End year must be after start year"
                          );
                        } else {
                          setFresherEndDateError("");
                        }
                      }}
                      error={fresherStartDateError}
                    />
                  </div>

                  <div className="form-group" style={{ flex: 1 }}>
                    <CommonSelectField
                      label="End Year"
                      name="endyear"
                      placeholder="End Year"
                      value={fresherEndtDate}
                      options={fresherEndYearOptions}
                      onChange={(value) => {
                        setFresherEndDate(value);

                        if (!value || value.trim() === "") {
                          setFresherEndDateError("End year is required");
                        } else if (
                          startDate &&
                          parseInt(value) < parseInt(startDate)
                        ) {
                          setFresherEndDateError(
                            "End year must be after start year"
                          );
                        } else {
                          setFresherEndDateError("");
                        }
                      }}
                      error={fresherEndDateError} // fixed
                    />
                  </div>
                </div>
              </>
            )}

            {userTypeactiveButton === "School Student" && (
              <>
                <Form.Item
                  style={{ marginTop: 15 }}
                  layout="vertical"
                  label={<span style={{ fontWeight: 500 }}>Class</span>}
                  name="usertype"
                  rules={[
                    {
                      required: true,
                      message: "Please Select your Class",
                    },
                  ]}
                >
                  <div className="job_nature">
                    <button
                      type="button"
                      className={
                        Class === "1"
                          ? "job_nature_button_active"
                          : "job_nature_button"
                      }
                      onClick={() => handleClassClick("1")}
                    >
                      <LiaSchoolSolid /> 1
                    </button>

                    <button
                      type="button"
                      className={
                        Class === "2"
                          ? "job_nature_button_active"
                          : "job_nature_button"
                      }
                      onClick={() => handleClassClick("2")}
                    >
                      <LiaSchoolSolid /> 2
                    </button>

                    <button
                      type="button"
                      className={
                        Class === "3"
                          ? "job_nature_button_active"
                          : "job_nature_button"
                      }
                      onClick={() => handleClassClick("3")}
                    >
                      <LiaSchoolSolid /> 3
                    </button>

                    <button
                      type="button"
                      className={
                        Class === "4"
                          ? "job_nature_button_active"
                          : "job_nature_button"
                      }
                      onClick={() => handleClassClick("4")}
                    >
                      <LiaSchoolSolid /> 4
                    </button>

                    <button
                      type="button"
                      className={
                        Class === "5"
                          ? "job_nature_button_active"
                          : "job_nature_button"
                      }
                      onClick={() => handleClassClick("5")}
                    >
                      <LiaSchoolSolid /> 5
                    </button>

                    <button
                      type="button"
                      className={
                        Class === "6"
                          ? "job_nature_button_active"
                          : "job_nature_button"
                      }
                      onClick={() => handleClassClick("6")}
                    >
                      <LiaSchoolSolid /> 6
                    </button>

                    <button
                      type="button"
                      className={
                        Class === "7"
                          ? "job_nature_button_active"
                          : "job_nature_button"
                      }
                      onClick={() => handleClassClick("7")}
                    >
                      <LiaSchoolSolid /> 7
                    </button>

                    <button
                      type="button"
                      className={
                        Class === "8"
                          ? "job_nature_button_active"
                          : "job_nature_button"
                      }
                      onClick={() => handleClassClick("8")}
                    >
                      <LiaSchoolSolid /> 8
                    </button>

                    <button
                      type="button"
                      className={
                        Class === "9"
                          ? "job_nature_button_active"
                          : "job_nature_button"
                      }
                      onClick={() => handleClassClick("9")}
                    >
                      <LiaSchoolSolid /> 9
                    </button>

                    <button
                      type="button"
                      className={
                        Class === "10"
                          ? "job_nature_button_active"
                          : "job_nature_button"
                      }
                      onClick={() => handleClassClick("10")}
                    >
                      <LiaSchoolSolid /> 10
                    </button>

                    <button
                      type="button"
                      className={
                        Class === "11"
                          ? "job_nature_button_active"
                          : "job_nature_button"
                      }
                      onClick={() => handleClassClick("11")}
                    >
                      <LiaSchoolSolid /> 11
                    </button>

                    <button
                      type="button"
                      className={
                        Class === "12"
                          ? "job_nature_button_active"
                          : "job_nature_button"
                      }
                      onClick={() => handleClassClick("12")}
                    >
                      <LiaSchoolSolid /> 12
                    </button>
                  </div>
                </Form.Item>
              </>
            )}
          </div>

          <div style={{ marginTop: 20 }} className="form-group">
            <CommonInputField
              name="location"
              label="Location"
              mandotary={true}
              value={location}
              placeholder="Enter your Location"
              type="text"
              onChange={(e) => {
                setLocation(e.target.value);
                setLocationError(nameValidator(e.target.value));
              }}
              error={locationError}
            />
          </div>
          <div style={{ textAlign: "-webkit-right" }} className="save_btn">
            <Button
              type="primary"
              size="large"
              onClick={handleSave}
              className="nav-btn next-btn"
            >
              <MdFileDownloadDone style={{ fontSize: 22 }} />
              Save
            </Button>
          </div>
        </div>
      </Form>
    ),

    resume: () => (
      <>
        <Title level={4}>Resume</Title>
        <Text type="secondary">
          Remember that one pager that highlights how amazing you are? Time to
          let employers notice your potential through it.
        </Text>

        <div
          style={{
            border: "1px dashed #d9d9d9",
            borderRadius: 8,
            padding: 32,
            textAlign: "center",
            marginTop: 24,
          }}
        >
          <Upload
            name="resume"
            showUploadList={false}
            accept=".doc,.docx,.pdf"
            maxCount={1}
            beforeUpload={handleBeforeUpload}
          >
            <Button
              style={{ background: "#5f2eea" }}
              icon={<UploadOutlined />}
              type="primary"
            >
              Update Resume
            </Button>
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">
                Supported file formats: DOC, DOCX, PDF. File size limit: 10 MB.
              </Text>
            </div>
          </Upload>

          {resumeFile && (
            <div style={{ marginTop: 16 }}>
              <Text strong>Selected File: </Text>
              <Text>{resumeFile.name}</Text>
            </div>
          )}

          {resumeError && (
            <div style={{ marginTop: 8 }}>
              <Text type="danger" style={{ color: "red" }}>
                {resumeError}
              </Text>
            </div>
          )}

          <div style={{ textAlign: "right", marginTop: 24 }}>
            <Button
              type="primary"
              style={{ background: "#5f2eea" }}
              onClick={handleFileSave}
            >
              Save Resume
            </Button>
          </div>
        </div>
      </>
    ),
    about: () => (
      <div
        style={{
          background: "#fff",
          borderRadius: 8,
          padding: 24,
          boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: 16 }}
        >
          <CheckCircleFilled style={{ color: "#00c853", marginRight: 8 }} />
          <Title level={4} style={{ margin: 0 }}>
            About
          </Title>
        </div>

        <div style={{ marginBottom: 8 }}>
          <Text strong>
            About Me <span style={{ color: "red" }}>*</span>
          </Text>
          <div style={{ fontSize: 12, color: "#888" }}>
            Maximum 1000 characters can be added
          </div>
        </div>

        <CommonTextArea
          style={{ height: 150 }}
          mandatory={true}
          rows={6}
          label={"About"}
          value={aboutTextNew}
          onChange={(e) => {
            setAboutTextNew(e.target.value);
            setAboutTextError(nameValidator(e.target.value));
          }}
          error={aboutTextError}
        />

        {/* <Button
          icon={
            <img
              src="https://cdn-icons-png.flaticon.com/512/4712/4712106.png"
              alt="AI"
              width={18}
              style={{ marginRight: 8 }}
            />
          }
          onClick={() =>
            setAboutText(
              "I am a detail-oriented and results-driven professional with a passion for continuous learning and growth. With a proven track record in [Your Industry], I thrive in fast-paced environments and excel at problem-solving, teamwork, and communication. I’m eager to bring my unique strengths and dedication to a dynamic organization where I can make a meaningful impact."
            )
          }
          style={{
            marginTop: 16,
            background: "#f0f2f5",
            border: "1px solid #d9d9d9",
            boxShadow: "none",
            fontWeight: 500,
          }}
        >
          Generate with AI
        </Button> */}

        <div style={{ textAlign: "-webkit-right" }} className="save_btn">
          <Button
            type="primary"
            size="large"
            onClick={handleAboutSave}
            className="nav-btn next-btn"
          >
            <MdFileDownloadDone style={{ fontSize: 22 }} />
            Save
          </Button>
        </div>
      </div>
    ),

    skills: () => (
      <div
        className="drawer_skills"
        style={{
          background: "#fff",
          borderRadius: 8,
          padding: 24,
          boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: 16 }}
        >
          <CheckCircleFilled style={{ color: "#00c853", marginRight: 8 }} />
          <Title level={4} style={{ margin: 0 }}>
            Skills
          </Title>
        </div>

        <div style={{ marginBottom: 16 }}>
          <Text strong>Suggestions</Text>
          <div style={{ marginTop: 12 }}>
            {suggestions.map((skill) => (
              <Tag
                key={skill}
                style={{
                  borderStyle: "dashed",
                  marginBottom: 8,
                  borderRadius: 50,
                  cursor: "pointer",
                  fontSize: 13,
                  padding: "7px 10px",
                }}
                onClick={() => handleAddSkill(skill)}
              >
                {skill}
              </Tag>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ marginTop: 8, marginBottom: 12 }}>
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
            name={"Skills"}
            onChange={(e) => {
              setCustomSkill(e.target.value);
              if (customSkillError) setCustomSkillError("");
            }}
            mandotary={true}
            placeholder={"List your skills here, showcasing what you excel at."}
            error={customSkillError}
          />

          <Button
            type="primary"
            style={{ marginTop: 20, background: "#5f2eea" }}
            onClick={handleSkillsSave}
          >
            Add Skill
          </Button>
        </div>
      </div>
    ),
    education: () => (
      <div>
        <div className="form-group">
          <CommonSelectField
            label={"Qualification"}
            name={"qualificaton"}
            placeholder={"Select Qualification"}
            value={qualificaton}
            mandatory={true}
            showSearch={true}
            optionFilterProp={"lable"}
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
              setQualification(value);
              setQualificationError(selectValidator(value));
            }}
            error={qualificatonError}
          />
        </div>

        <div className="form-group">
          <div className="form-group">
            <CommonSelectField
              label={"Course"}
              name={"course"}
              placeholder={"Select Course"}
              mandatory={true}
              showSearch={true}
              optionFilterProp={"lable"}
              value={educationCourse}
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
                setEducationCourse(value);
                setEducationCourseError(selectValidator(value));
              }}
              error={educationCourseError}
            />
          </div>
        </div>

        <div className="form-group">
          <CommonSelectField
            label={"Specialization"}
            name={"specialization"}
            placeholder={"Select Specialization"}
            mandatory={true}
            value={specialization}
            showSearch={true}
            optionFilterProp={"lable"}
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
              setSpecialization(value);
              setSpecializationError(selectValidator(value));
            }}
            error={specializationError}
          />
        </div>

        <div className="form-group">
          <CommonInputField
            name="collage"
            label="Collage"
            mandotary={true}
            placeholder="Collage"
            type="text"
            value={collage}
            onChange={(e) => {
              setCollage(e.target.value);
              setCollageError(nameValidator(e.target.value));
            }}
            error={collageError}
          />
        </div>

        <div
          style={{ alignItems: "center", marginTop: 10 }}
          className="form-row"
        >
          <div className="form-group">
            <CommonSelectField
              value={educationStartDate}
              options={educationStartDateOptions}
              label="Start Year"
              name="startyear"
              mandatory={true}
              placeholder="Start Year"
              onChange={(value) => {
                setEducationStartDate(value);

                if (!value || value.trim() === "") {
                  setEducationStartDateError(" is required");
                } else {
                  setEducationStartDateError("");
                }
              }}
              error={educationStartDateError}
            />
          </div>

          <div className="form-group">
            <CommonSelectField
              value={educationEndDate}
              options={educationEndDateOptions}
              mandatory={true}
              label="End Year"
              name="endyear"
              placeholder="End Year"
              onChange={(value) => {
                setEducationEndDate(value);

                if (!value || value.trim() === "") {
                  setEducationEndDateError(" is required");
                } else {
                  setEducationEndDateError("");
                }
              }}
              error={educationEndDateError}
            />
          </div>
        </div>

        <div className="form-group">
          <CommonSelectField
            label={"Course type"}
            name={"coursetype"}
            placeholder={"Select Course type"}
            mandatory={true}
            showSearch={true}
            optionFilterProp={"lable"}
            value={courseType}
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
              setCourseType(value);
              setCourseTypeError(selectValidator(value));
            }}
            error={courseTypeError}
          />
        </div>

        <Row style={{ alignItems: "end", gap: 20 }}>
          <Col lg={11}>
            <div className="form-group">
              <CommonInputField
                name="percentage"
                label="Percentage"
                placeholder="Percentage"
                type="text"
                value={percentage}
                onChange={(e) => {
                  setPercentage(e.target.value);
                }}
              />
            </div>
          </Col>
          <Col lg={11}>
            <div className="form-group">
              <CommonInputField
                name="cgpa"
                label="CGPA"
                placeholder="CGPA"
                type="text"
                value={cgpa}
                onChange={(e) => {
                  setCgpa(e.target.value);
                }}
              />
            </div>
          </Col>
        </Row>

        <Row style={{ gap: 20, marginTop: 30 }}>
          <Col lg={11}>
            <div className="form-group">
              <CommonInputField
                name="rollnumber"
                label="Roll Number"
                placeholder="Roll Number"
                type="number"
                value={rollNumber}
                onChange={(e) => {
                  setRollNumber(e.target.value);
                }}
              />
            </div>
          </Col>
          <Col lg={11}>
            <div className="form-group">
              <CommonSelectField
                label="Are you a Lateral Entry Student?"
                name="lateralstudent"
                placeholder="Lateral Entry"
                showSearch={true}
                options={[
                  { value: "Yes", label: "Yes" },
                  { value: "No", label: "No" },
                ]}
                value={lateral}
                optionFilterProp="label"
                onChange={handleLateralTypeChange}
              />
            </div>
          </Col>
        </Row>
        <div
          style={{ textAlign: "-webkit-right", marginTop: 25 }}
          className="save_btn"
        >
          <Button
            type="primary"
            size="large"
            onClick={handleEducationSave}
            className="nav-btn next-btn"
          >
            <MdFileDownloadDone style={{ fontSize: 22, marginRight: 6 }} />
            {educationId ? "Update" : "Save"}
          </Button>
        </div>
      </div>
    ),
    experience: () => (
      <div>
        <div className="form-group">
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
                      onClick={() => handleDeleteCompanyWork(index)}
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
                      value={company.workingCompanyName}
                      error={company.workingCompanyNameError}
                      onChange={(e) =>
                        handleCompanyFields(
                          index,
                          "workingCompanyName",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="form-group">
                    <CommonInputField
                      label="Designation"
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
                    <CommonSelectField
                      label="Start Date"
                      mandatory={true}
                      value={company.workingStartDate}
                      options={workingStartDateOptions}
                      error={company.workingStartDateError}
                      onChange={(value) =>
                        handleCompanyFields(index, "workingStartDate", value)
                      }
                    />
                  </div>
                  <div className="from-group">
                    <CommonSelectField
                      label="End Date"
                      mandatory={true}
                      value={company.workingEndDate}
                      options={workingEndDateOptions}
                      error={company.workingEndDateError}
                      onChange={(value) =>
                        handleCompanyFields(index, "workingEndDate", value)
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

        <div style={{ textAlign: "-webkit-right" }} className="save_btn">
          <Button
            type="primary"
            size="large"
            onClick={handleWorkExpSave}
            className="nav-btn next-btn"
          >
            <MdFileDownloadDone style={{ fontSize: 22 }} />
            Save
          </Button>
        </div>
      </div>
    ),
    sociallinks: () => (
      <div>
        <div style={{ alignItems: "end" }} className="form-row">
          <div className="form-group">
            <CommonInputField
              name="Linkedin"
              label="Linkedin"
              mandotary={true}
              placeholder="Add link"
              type="text"
              value={socialLinks.Linkedin}
              onChange={(e) =>
                handleSocialLinksSave("Linkedin", e.target.value)
              }
              error={socialLinkErrors.Linkedin}
            />
          </div>
          <div className="form-group">
            <CommonInputField
              name="Facebook"
              label="Facebook"
              mandotary={true}
              placeholder="Add link"
              type="text"
              value={socialLinks.Facebook}
              onChange={(e) =>
                handleSocialLinksSave("Facebook", e.target.value)
              }
              error={socialLinkErrors.Facebook}
            />
          </div>
        </div>

        <div style={{ alignItems: "end" }} className="form-row">
          <div className="form-group">
            <CommonInputField
              name="Instagram"
              label="Instagram"
              mandotary={true}
              placeholder="Add link"
              type="text"
              value={socialLinks.Instagram}
              onChange={(e) =>
                handleSocialLinksSave("Instagram", e.target.value)
              }
              error={socialLinkErrors.Instagram}
            />
          </div>
          <div className="form-group">
            <CommonInputField
              name="Twitter"
              label="Twitter"
              mandotary={true}
              placeholder="Add link"
              type="text"
              value={socialLinks.Twitter}
              error={socialLinkErrors.Twitter}
              onChange={(e) => handleSocialLinksSave("Twitter", e.target.value)}
            />
          </div>
        </div>

        <div style={{ alignItems: "end" }} className="form-row">
          <div className="form-group">
            <CommonInputField
              name="Dribbble"
              label="Dribbble"
              mandotary={true}
              placeholder="Add link"
              type="text"
              value={socialLinks.Dribbble}
              error={socialLinkErrors.Dribbble}
              onChange={(e) =>
                handleSocialLinksSave("Dribbble", e.target.value)
              }
            />
          </div>
          <div className="form-group">
            <CommonInputField
              name="Behance"
              label="Behance"
              mandotary={true}
              placeholder="Add link"
              type="text"
              value={socialLinks.Behance}
              error={socialLinkErrors.Behance}
              onChange={(e) => handleSocialLinksSave("Behance", e.target.value)}
            />
          </div>
        </div>
        <div style={{ textAlign: "-webkit-right" }} className="save_btn">
          <Button
            type="primary"
            size="large"
            className="nav-btn next-btn"
            onClick={handleAddSocialLinks}
          >
            Save Links
          </Button>
        </div>
      </div>
    ),

    projects: () => (
      <div>
        <div>
          {/* Project Form */}
          {showForm && (
            <div>
              {
                <>
                  <div className="form-group">
                    <CommonInputField
                      name="companyName"
                      label="Company Name"
                      mandotary={true}
                      placeholder="Company Name"
                      type="text"
                      value={companyName}
                      onChange={(e) => {
                        setCompanyName(e.target.value);
                        setCompanyNameError(nameValidator(e.target.value));
                      }}
                      error={companyNameError}
                    />
                  </div>

                  <div className="form-group">
                    <CommonInputField
                      name="projectname"
                      label="Project Name"
                      mandotary={true}
                      placeholder="Project Name"
                      type="text"
                      value={project}
                      onChange={(e) => {
                        setProject(e.target.value);
                        setProjectError(nameValidator(e.target.value));
                      }}
                      error={projectError}
                    />
                  </div>

                  <div className="form-group">
                    <Form.Item
                      layout="vertical"
                      label={
                        <span style={{ fontWeight: 500 }}>Project Type</span>
                      }
                      name="projecttype"
                      required
                    >
                      <div className="job_nature">
                        <button
                          type="button"
                          className={
                            activeButton === "Full Time"
                              ? "job_nature_button_active"
                              : "job_nature_button"
                          }
                          onClick={() => {
                            handleProjectTypeClick("Full Time");
                            setProjectType("Full Time");
                            setProjectTypeError("");
                          }}
                        >
                          Full Time
                        </button>

                        <button
                          type="button"
                          className={
                            activeButton === "Part Time"
                              ? "job_nature_button_active"
                              : "job_nature_button"
                          }
                          onClick={() => {
                            handleProjectTypeClick("Part Time");
                            setProjectType("Part Time");
                            setProjectTypeError("");
                          }}
                        >
                          Part Time
                        </button>

                        <button
                          type="button"
                          className={
                            activeButton === "Freelance"
                              ? "job_nature_button_active"
                              : "job_nature_button"
                          }
                          onClick={() => {
                            handleProjectTypeClick("Freelance");
                            setProjectType("Freelance");
                            setProjectTypeError("");
                          }}
                        >
                          Freelance
                        </button>
                      </div>
                      {projectTypeError && (
                        <div
                          style={{ color: "red", marginTop: 6, fontSize: 13 }}
                        >
                          Project type {projectTypeError}
                        </div>
                      )}
                    </Form.Item>
                  </div>

                  <div
                    style={{ alignItems: "center", marginTop: 15 }}
                    className="form-row"
                  >
                    <div className="form-group">
                      <CommonDatePicker
                        value={projectStartDate}
                        label="Start Date"
                        name="enddate"
                        placeholder="Start Date"
                        onChange={(value) => {
                          setProjectStartDate(value);

                          if (!value || value.trim() === "") {
                            setProjectStartDateError(" is required");
                          } else {
                            setProjectStartDateError("");
                          }
                        }}
                        error={projectStartDateError}
                      />
                    </div>

                    <div className="form-group">
                      <CommonDatePicker
                        value={projectEndDate}
                        label="End Date"
                        name="enddate"
                        placeholder="End Date"
                        onChange={(value) => {
                          setProjectEndDate(value);

                          if (!value || value.trim() === "") {
                            setProjectEndDateError(" is required");
                          } else {
                            setProjectEndDateError("");
                          }
                        }}
                        error={projectEndDateError}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <CommonTextArea
                      label={"Project Description"}
                      placeholder={"Enter your description"}
                      mandatory={true}
                      name={"description"}
                      value={projectDescription}
                      onChange={(e) => {
                        setProjectDescription(e.target.value);
                        setProjectDescriptionError(
                          nameValidator(e.target.value)
                        );
                      }}
                      error={projectDescriptionError}
                    />
                  </div>
                  <div
                    style={{ textAlign: "-webkit-right" }}
                    className="save_btn"
                  >
                    <Button
                      type="primary"
                      size="large"
                      onClick={handleProjectSave}
                      className="nav-btn next-btn"
                    >
                      Save
                    </Button>
                  </div>
                </>
              }
            </div>
          )}

          {/* Show "Add Project" Button after saving */}
          {!showForm && (
            <div style={{ marginTop: 20 }}>
              <Button type="dashed" onClick={handleAddNewProject}>
                + Add Project
              </Button>
            </div>
          )}

          {!showForm && (
            <div style={{ marginTop: 30 }}>
              {projectsList.map((proj, idx) => (
                <motion.div
                  key={idx}
                  className="project-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: idx * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{
                    y: -4,
                    boxShadow: "0 12px 32px rgba(0, 0, 0, 0.12)",
                  }}
                  custom={idx}
                >
                  <div className="project-card-inner">
                    <div className="project-card-header">
                      <div className="project-title-wrapper">
                        <div className="project-type-tag">
                          {proj.project_type}
                        </div>
                        <h3 className="project-title">{proj.project_title}</h3>
                      </div>

                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteCompany(idx)}
                        className="delete-btn"
                        aria-label="Delete project"
                      >
                        <MdDeleteForever className="delete-icon" />
                      </motion.button>
                    </div>

                    <div className="project-meta">
                      <div className="meta-item">
                        <FiBriefcase className="meta-icon" />
                        <span>{proj.company_name}</span>
                      </div>
                      <div className="meta-item">
                        <FiCalendar className="meta-icon" />
                        <span>
                          {proj.start_date} - {proj.end_date}
                        </span>
                      </div>
                    </div>

                    <div className="project-description">
                      <p>{proj.description}</p>
                    </div>

                    <div className="project-footer">
                      <div className="project-skills">
                        {proj.skills?.map((skill, i) => (
                          <span key={i} className="skill-tag">
                            {skill}
                          </span>
                        ))}
                      </div>
                      <button className="view-project-btn">
                        View Project <FiArrowRight />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    ),
  };
  //////////////////////////////////////////////////
  return (
    <>
      <Header className="profile-banner">
        <div className="banner-content">
          <Tooltip title="Edit Background">
            <Button
              style={{ color: "rgb(95, 46, 234)" }}
              shape="circle"
              icon={<EditOutlined />}
              className="edit-banner-btn"
            />
          </Tooltip>
        </div>
      </Header>

      <Content className="profile-main-content">
        {/* Profile Header Card */}
        <Card className="profile-header-card">
          <div
            className="profile-header-content"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              className="profile-header-left"
              style={{ display: "flex", alignItems: "center" }}
            >
              <div
                style={{
                  position: "relative",
                  display: "inline-block",
                  border: "1px solid #cfcfcf",
                  borderRadius: "50%",
                  padding: "7px",
                }}
              >
                <Avatar size={90} src={avatarUrl} />
                <Upload
                  showUploadList={false}
                  beforeUpload={() => false}
                  onChange={handleUpload}
                >
                  <Button
                    icon={<UploadOutlined />}
                    size="small"
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      borderRadius: "50%",
                      padding: "4px 2px",
                      fontSize: 12,
                      backgroundColor: "#fff",
                      boxShadow: "0 0 4px rgba(0,0,0,0.1)",
                    }}
                  />
                </Upload>

                {/* Remove Button */}
                {avatarUrl !== defaultAvatar && (
                  <Button
                    icon={<DeleteOutlined />}
                    size="small"
                    danger
                    style={{
                      position: "absolute",
                      top: 0,
                      right: "0px",
                      borderRadius: "50%",
                      padding: "4px 2px",
                      fontSize: 12,
                      backgroundColor: "#fff",
                      boxShadow: "0 0 4px rgba(0,0,0,0.1)",
                    }}
                    onClick={handleRemove}
                  />
                )}
              </div>

              <div style={{ marginLeft: 16, textAlign: "left" }}>
                <h2 style={{ marginBottom: 0 }}>{`${fname} ${lname}`}</h2>
                <p style={{ marginBottom: 10, color: "#666" }}>{email}</p>
                <div>
                  <Tag color="blue">{organizationName}</Tag>
                  <Tag color="purple">{organizationNameType}</Tag>
                </div>
              </div>
            </div>

            <Space>
              <Tooltip title="Share profile">
                <Button shape="circle" icon={<LinkOutlined />} />
              </Tooltip>
              <Tooltip title="View as others see">
                <Button shape="circle" icon={<EyeOutlined />} />
              </Tooltip>
              <Button
                className="userprofile-edit-profile"
                type="primary"
                icon={<EditOutlined />}
                onClick={() => {
                  setActiveTab("basic");
                  console.log("fffffffffffff", fname);
                  showDrawer();
                }}
              >
                Edit Profile
              </Button>
            </Space>
          </div>
        </Card>

        {/* Profile Sections */}
        <div className="profile-sections">
          {/* About Section */}
          <Card
            title="About"
            className="profile-section-card"
            extra={
              <Button
                onClick={() => {
                  setActiveTab("about");
                  showDrawer();
                }}
                style={{ color: "#5f2eea" }}
                type="link"
              >
                <PlusOutlined />
                Add About
              </Button>
            }
          >
            <p className="profile-section-description">
              Craft an engaging story in your bio and make meaningful
              connections with peers and recruiters alike!
            </p>

            <Divider />

            <Card title="Resume" className="resume-card">
              <p className="resume-card-title">
                <strong>
                  Add your Resume & get your profile filled in a click!
                </strong>
              </p>
              <p className="resume-card-description">
                Adding your Resume helps you to tell who you are and what makes
                you different — to employers and recruiters.
              </p>
              {/* <label
                className="resume_upload"
                htmlFor="upload-input"
                style={{ cursor: "pointer" }}
              >
                Click me
                <input
                  id="upload-input"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </label> */}

              {/* <Button type="primary" className="upload-resume-btn">
                Upload Resume
              </Button>

              {fileName && (
                <div style={{ marginTop: "15px", fontWeight: "bold" }}>
                  Selected File: {fileName}
                </div>
              )} */}
            </Card>
          </Card>

          {/* Rankings Section */}
          <Card
            title="Rankings"
            className="profile-section-card rankings-card"
            extra={
              <Button style={{ color: "#5f2eea" }} type="link">
                How it works?
              </Button>
            }
          >
            <div className="stats-container">
              <div className="stat-item">
                <div className="stat-label">Total Points</div>
                <div className="stat-value">0</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Total Badges</div>
                <div className="stat-value">2</div>
              </div>
            </div>

            <Divider />

            <div className="badges-container">
              <Avatar
                size={50}
                icon={<StarOutlined />}
                className="badge-avatar gold-badge"
              />
              <Avatar
                size={50}
                icon={<StarOutlined />}
                className="badge-avatar silver-badge"
              />

              <Avatar
                size={50}
                icon={<StarOutlined />}
                className="badge-avatar silver-badge"
              />
              <Avatar
                size={50}
                icon={<StarOutlined />}
                className="badge-avatar silver-badge"
              />
            </div>
          </Card>
        </div>

        {/* Resume upload  Sections */}
        <div style={{ marginTop: 25 }} className="profile-sections">
          <div className="profile-section-card userprofile_cards">
            <div className="skills_card">
              <div style={{ textAlign: "left" }}>
                <h3>Resume</h3>
                <p className="profile-section-description">
                  Adding your Resume helps you to tell who you are and what
                  makes you different to employers and recruiters.
                </p>
                <Button
                  onClick={() => {
                    setActiveTab("resume");
                    showDrawer();
                  }}
                  style={{ color: "#5f2eea", paddingLeft: 0, paddingTop: 10 }}
                  type="link"
                >
                  <PlusOutlined />
                  Add Resume
                </Button>
              </div>
              <div>
                <img src={profile1}></img>
              </div>
            </div>
            <Divider />
          </div>
        </div>

        {/* Profile Sections */}
        <div style={{ marginTop: 25 }} className="profile-sections">
          <div className="profile-section-card userprofile_cards">
            <div className="skills_card">
              <div style={{ textAlign: "left" }}>
                <h3>Skills</h3>
                <p className="profile-section-description">
                  Craft an engaging story in your bio and make meaningful
                  connections with peers and recruiters alike!
                </p>
                <Button
                  onClick={() => {
                    setActiveTab("skills");
                    showDrawer();
                  }}
                  style={{ color: "#5f2eea", paddingLeft: 0, paddingTop: 10 }}
                  type="link"
                >
                  <PlusOutlined />
                  Add Skills
                </Button>
              </div>
              <div>
                <img src={profile1}></img>
              </div>
            </div>
            <Divider />
          </div>
        </div>

        {/* Profile Sections */}
        <div style={{ marginTop: 25 }} className="profile-sections">
          {/* Skills Section */}

          <div className="profile-section-card userprofile_cards">
            <div className="skills_card">
              <div style={{ textAlign: "left" }}>
                <h3>Work Experience</h3>
                <p className="profile-section-description">
                  Narrate your professional journey and fast-track your way to
                  new career heights!
                </p>
                <Button
                  onClick={() => {
                    setActiveTab("experience");
                    showDrawer();
                  }}
                  style={{ color: "#5f2eea", paddingLeft: 0, paddingTop: 10 }}
                  type="link"
                >
                  <PlusOutlined />
                  Add Work Experience
                </Button>
              </div>
              <div>
                <img src={profile2}></img>
              </div>
            </div>
            <Divider />
          </div>
        </div>

        {/* Profile Sections */}
        <div style={{ marginTop: 25 }} className="profile-sections">
          {/* Education Section */}

          <div className="profile-section-card userprofile_cards">
            <div className="skills_card">
              <div style={{ textAlign: "left" }}>
                <h3>Education</h3>
                <p className="profile-section-description">
                  Showcase your academic journey and open doors to your dream
                  career opportunities!
                </p>
                <Button
                  onClick={() => {
                    setActiveTab("education");
                    showDrawer();
                  }}
                  style={{ color: "#5f2eea", paddingLeft: 0, paddingTop: 10 }}
                  type="link"
                >
                  <PlusOutlined />
                  Add Education
                </Button>
              </div>
              <div>
                <img src={profile3}></img>
              </div>
            </div>
            <Divider />
          </div>
        </div>

        {/* Profile Sections */}
        {/* Responsibilities Section */}
        {/* <div style={{ marginTop: 25 }} className="profile-sections">
            <div className="profile-section-card userprofile_cards">
              <div className="skills_card">
                <div style={{ textAlign: "left" }}>
                  <h3>Responsibilities</h3>
                  <p className="profile-section-description">
                    Highlight the responsibilities you've mastered to
                    demonstrate your leadership and expertise!
                  </p>
                  <Button
                    onClick={showDrawer}
                    style={{ color: "#5f2eea", paddingLeft: 0, paddingTop: 10 }}
                    type="link"
                  >
                    <PlusOutlined />
                    Add Responsibilities
                  </Button>
                </div>
                <div>
                  <img src={profile4}></img>
                </div>
              </div>
              <Divider />
            </div>
          </div> */}

        {/* Profile Sections */}
        <div style={{ marginTop: 25 }} className="profile-sections">
          {/* Projects Section */}

          <div className="profile-section-card userprofile_cards">
            <div className="skills_card">
              <div style={{ textAlign: "left" }}>
                <h3>Projects</h3>
                <p className="profile-section-description">
                  Unveil your projects to the world and pave your path to
                  professional greatness!
                </p>
                <Button
                  onClick={() => {
                    setActiveTab("projects");
                    showDrawer();
                  }}
                  style={{ color: "#5f2eea", paddingLeft: 0, paddingTop: 10 }}
                  type="link"
                >
                  <PlusOutlined />
                  Add Projects
                </Button>
              </div>
              <div>
                <img src={profile6}></img>
              </div>
            </div>
            <Divider />
          </div>
        </div>

        {/* Profile Sections */}
        <div style={{ marginTop: 25 }} className="profile-sections">
          {/* Achievements Section */}

          <div className="profile-section-card userprofile_cards">
            <div className="skills_card">
              <div style={{ textAlign: "left" }}>
                <h3>Achievements</h3>
                <p className="profile-section-description">
                  Broadcast your triumphs and make a remarkable impression on
                  industry leaders!
                </p>
                <Button
                  onClick={() => {
                    setActiveButton("achievements");
                    showDrawer();
                  }}
                  style={{ color: "#5f2eea", paddingLeft: 0, paddingTop: 10 }}
                  type="link"
                >
                  <PlusOutlined />
                  Add Achievements
                </Button>
              </div>
              <div>
                <img src={profile7}></img>
              </div>
            </div>
            <Divider />
          </div>
        </div>

        {/* Profile Sections */}
        <div style={{ marginTop: 25 }} className="profile-sections">
          {/* Social Links Section */}
          <div className="profile-section-card userprofile_cards">
            <div className="skills_card">
              <div style={{ textAlign: "left" }}>
                <h3>Social Links</h3>
              </div>
              <div>
                <Button
                  onClick={() => {
                    setActiveButton("sociallinks");
                    showDrawer();
                  }}
                  style={{ color: "#5f2eea", paddingLeft: 0, paddingTop: 10 }}
                  type="link"
                >
                  <PlusOutlined />
                  Add Links
                </Button>
              </div>
            </div>
            <div className="userprofile_social">
              <Tooltip title="Not yet added">
                <FaFacebookF />
              </Tooltip>
              <Tooltip title="Not yet added">
                <BsThreads />
              </Tooltip>
              <Tooltip title="Not yet added">
                <FaInstagram />
              </Tooltip>
              <Tooltip title="Not yet added">
                <FaLinkedinIn />
              </Tooltip>
              <Tooltip title="Not yet added">
                <FaBehance />
              </Tooltip>
              <Tooltip title="Not yet added">
                <FaDribbble />
              </Tooltip>
              <Tooltip title="Not yet added">
                <FaFigma />
              </Tooltip>
              <Tooltip title="Not yet added">
                <IoMdLink />
              </Tooltip>
            </div>

            <Divider />

            {/* Streak Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="streak-container"
              style={{
                background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                marginBottom: "32px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "24px",
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: "1.5rem",
                    fontWeight: 600,
                    color: "#fff",
                    letterSpacing: "0.5px",
                  }}
                >
                  Activity Streak
                </h3>
                <div
                  style={{
                    display: "flex",
                    gap: "16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "3px",
                        background: "var(--color-scale-1)",
                      }}
                    />
                    <span
                      style={{
                        color: "rgba(255, 255, 255, 0.8)",
                        fontSize: "0.85rem",
                      }}
                    >
                      1 Activity
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "3px",
                        background: "var(--color-scale-3)",
                      }}
                    />
                    <span
                      style={{
                        color: "rgba(255, 255, 255, 0.8)",
                        fontSize: "0.85rem",
                      }}
                    >
                      3+ Activities
                    </span>
                  </div>
                </div>
              </div>

              {isLoading ? (
                <div
                  style={{
                    height: "160px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div className="loading-pulse" />
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <CalendarHeatmap
                    startDate={subDays(today, 365)}
                    endDate={today}
                    values={streakData}
                    classForValue={getClassForValue}
                    showWeekdayLabels={true}
                    gutterSize={3}
                    monthLabels={[
                      "Jan",
                      "Feb",
                      "Mar",
                      "Apr",
                      "May",
                      "Jun",
                      "Jul",
                      "Aug",
                      "Sep",
                      "Oct",
                      "Nov",
                      "Dec",
                    ]}
                    weekdayLabels={[
                      "Sun",
                      "Mon",
                      "Tue",
                      "Wed",
                      "Thu",
                      "Fri",
                      "Sat",
                    ]}
                    transformDayElement={(el, value) => {
                      if (!value || !value.date) return el;
                      const date = format(parseISO(value.date), "MMMM d, yyyy");
                      return (
                        <Tooltip
                          title={`${date} | ${value.count} ${
                            value.count > 1 ? "Activities" : "Activity"
                          }`}
                          arrow
                          placement="top"
                          componentsProps={{
                            tooltip: {
                              sx: {
                                bgcolor: "#0f3460",
                                color: "white",
                                fontSize: "0.85rem",
                                "& .MuiTooltip-arrow": {
                                  color: "#0f3460",
                                },
                              },
                            },
                          }}
                        >
                          {el}
                        </Tooltip>
                      );
                    }}
                  />
                </motion.div>
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "32px",
                  marginTop: "10px",
                }}
              >
                <div
                  style={{
                    textAlign: "center",
                    padding: "12px 20px",
                    background: "rgba(255, 255, 255, 0.05)",
                    borderRadius: "12px",
                    minWidth: "120px",
                  }}
                >
                  <div
                    style={{
                      color: "rgba(255, 255, 255, 0.6)",
                      fontSize: "0.9rem",
                    }}
                  >
                    Current Streak
                  </div>
                  <div
                    style={{
                      color: "#4cc9f0",
                      fontSize: "16px",
                      fontWeight: 700,
                      marginTop: "1px",
                    }}
                  >
                    {currentStreak} {currentStreak === 1 ? "Day" : "Days"}
                  </div>
                </div>
                <div
                  style={{
                    textAlign: "center",
                    padding: "12px 20px",
                    background: "rgba(255, 255, 255, 0.05)",
                    borderRadius: "12px",
                    minWidth: "120px",
                  }}
                >
                  <div
                    style={{
                      color: "rgba(255, 255, 255, 0.6)",
                      fontSize: "0.9rem",
                    }}
                  >
                    Max Streak
                  </div>
                  <div
                    style={{
                      color: "#f72585",
                      fontSize: "16px",
                      fontWeight: 700,
                      marginTop: "1px",
                    }}
                  >
                    {maxStreak} {maxStreak === 1 ? "Day" : "Days"}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* drawer */}
            <Drawer
              title={null}
              placement="right"
              onClose={resetFormFields}
              open={open}
              width={1100}
              className="user_details_drawer"
            >
              <div style={{ display: "flex", gap: 24 }}>
                {/* Sidebar */}
                <div
                  style={{
                    width: 300,
                    background: "#f9f9f9",
                    padding: 16,
                    borderRight: "1px solid #eee",
                  }}
                >
                  <div style={{ marginBottom: 16 }}>
                    <Text strong>Enhance your Profile</Text>
                    <Text
                      type="secondary"
                      style={{ display: "block", marginTop: 4 }}
                    >
                      Stay ahead of the competition by regularly updating your
                      profile.
                    </Text>
                    <Progress
                      percent={78}
                      size="small"
                      style={{ marginTop: 8 }}
                    />
                  </div>
                  <Menu
                    mode="vertical"
                    selectedKeys={[activeTab]}
                    onClick={(e) => {
                      // resetFormFields();
                      setActiveTab(e.key);
                    }}
                    items={items}
                  />
                </div>

                {/* Dynamic Content */}
                <div style={{ flex: 1, padding: 5 }}>
                  {TabContent[activeTab] ? (
                    TabContent[activeTab]()
                  ) : (
                    <p>Section not found</p>
                  )}
                </div>
              </div>
            </Drawer>
          </div>
        </div>
      </Content>
    </>
  );
}
