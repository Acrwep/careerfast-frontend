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
} from "antd";
import {
  StarOutlined,
  EyeOutlined,
  LinkOutlined,
  EditOutlined,
  CheckCircleFilled,
  PlusOutlined,
  UploadOutlined,
  InboxOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { IoIosMale } from "react-icons/io";
import { IoMdAdd } from "react-icons/io";
import { IoFemaleOutline } from "react-icons/io5";
import { MdOutlineNotInterested } from "react-icons/md";
import { LuGraduationCap } from "react-icons/lu";
import { GiOfficeChair } from "react-icons/gi";
import { PiStudent } from "react-icons/pi";
import { GiNewShoot } from "react-icons/gi";
import "../css/Profile.css";
import { FaFacebookF } from "react-icons/fa";
import { BsThreads } from "react-icons/bs";
import { FaInstagram } from "react-icons/fa";
import { FaBehance } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { FaDribbble } from "react-icons/fa";
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
import TextArea from "antd/es/input/TextArea";
import CommonInputField from "../Common/CommonInputField";
import CommonSelectField from "../Common/CommonSelectField";
import { label } from "framer-motion/client";
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
  // { key: "initiatives", label: "Accomplishments & Initiatives" },
  // { key: "responsibilities", label: "Responsibilities" },
  { key: "certification", label: "Certifications" },
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

const drawerContentStyle = {
  display: "flex",
  gap: "24px",
};

const onChangeDate = (date, dateString) => {
  console.log(date, dateString); // date is a moment object, dateString is formatted string
};

export default function MainProfile() {
  const [collapsed, setCollapsed] = useState(false);
  const [certifications, setCertification] = useState([]);
  const [activeTab, setActiveTab] = useState("basic");
  const [sideBar, setSideBar] = useState("watchlist");
  const [aboutText, setAboutText] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [customSkill, setCustomSkill] = useState("");
  const [activeButton, setActiveButton] = useState(null);
  const [fileName, setFileName] = useState("");
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
  const [userName, setUserName] = useState("");
  const [userNameError, setUserNameError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [gender, setGender] = useState("");
  const [genderError, setGenderError] = useState("");
  const [userType, setUserType] = useState("");
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
  const [percentageError, setPercentageError] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [cgpaError, setCgpaError] = useState("");
  const [educationStartDate, setEducationStartDate] = useState("");
  const [educationStartDateError, setEducationStartDateError] = useState("");
  const [educationEndDate, setEducationEndDate] = useState("");
  const [educationEndDateError, setEducationEndDateError] = useState("");
  const [aboutTextNew, setAboutTextNew] = useState("");
  const [aboutTextError, setAboutTextError] = useState("");
  //
  const [designation, setDesignation] = useState("");
  const [designationError, setDesignationError] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [organisationError, setOrganisationError] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [employmentTypeError, setEmploymentTypeError] = useState("");
  const [workExpStartDate, setWorkExpStartDate] = useState("");
  const [workExpStartDateError, setWorkExpStartDateError] = useState("");
  const [workExpEndDate, setWorkExpEndDate] = useState("");
  const [workExpEndDateError, setWorkExpEndDateError] = useState("");
  const [workExpLocation, setWorkExpLocation] = useState("");
  const [workExpLocationError, setWorkExpLocationError] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  //
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
  //

  const [customSkills, setCustomSkills] = useState("");
  const [customSkillError, setCustomSkillError] = useState("");

  const handleSave = (e) => {
    e.preventDefault();

    const fnameValidate = nameValidator(fname);
    const lnameValidate = nameValidator(lname);
    const userNameValidate = nameValidator(userName);
    const emailValidate = emailValidator(email);
    const phoneValidate = phoneValidation(phoneNumber);
    const genderValidate = genderValidator(gender);
    const userTypeValidate = userTypeValidator(userType);
    const locationValidate = nameValidator(location);
    const courseValidate =
      userType === "Collage Student" ? selectValidator(course) : "";
    const startDateValidate =
      userType === "Collage Student" ? selectValidator(startDate) : "";
    const endDateValidate =
      userType === "Collage Student" ? selectValidator(endDate) : "";

    const fresherCourseValidate =
      userType === "Fresher" ? selectValidator(fresherCourse) : "";
    const fresherStartDateValidate =
      userType === "Fresher" ? selectValidator(fresherStartDate) : "";
    const fresherEndtDateValidate =
      userType === "Fresher" ? selectValidator(fresherEndtDate) : "";

    setFnameError(fnameValidate);
    setLnameError(lnameValidate);
    setUserNameError(userNameValidate);
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
      userNameValidate,
      emailValidate,
      phoneValidate,
      genderValidate,
      userTypeValidate,
      locationValidate,
      ...(userType === "Collage Student"
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
      console.log("Validation errors found");
      message.error("Please fill all fields correctly before proceeding.");
      return;
    }

    console.log("All validations passed");

    const userData = {
      firstName: fname,
      lastName: lname,
      userName: userName,
      email: email,
      phoneNumber: phoneNumber,
      gender: gender,
      userType: userType,
      location: location,
      ...(userType === "Collage Student" && {
        course: course,
        startDate: startDate,
        endDate: endDate,
      }),
    };
    console.log("Saving user data:", userData);
    message.success("Profile details saved successfully.");
    resetFormFields();
  };

  //

  const handleEducationSave = (e) => {
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
      console.log("Validation errors found");
      message.error("Please fill all fields correctly before proceeding.");
      return;
    }

    const educationUserData = {
      qualificaton: qualificaton,
      educationcourse: educationCourse,
      specialization: specialization,
      collage: collage,
      courseType: courseType,
      percentage: percentage,
      educationStartDate: educationStartDate,
      educationEndDate: educationEndDate,
      cgpa: cgpa,
    };
    console.log("Saving user data:", educationUserData);
    message.success("Education details saved successfully.");
    resetFormFields();
  };

  const handleWorkExpSave = (e) => {
    e.preventDefault();

    const designationValidate = selectValidator(designation);
    const organisationValidate = selectValidator(organisation);
    const employmentTypeValidate = selectValidator(employmentType);
    const workExpStartDateValidate = selectValidator(workExpStartDate);
    const workExpEndDateValidate = selectValidator(workExpEndDate);
    const workExpLocationValidate = nameValidator(workExpLocation);

    setDesignationError(designationValidate);
    setOrganisationError(organisationValidate);
    setEmploymentTypeError(employmentTypeValidate);
    setWorkExpStartDateError(workExpStartDateValidate);
    setWorkExpEndDateError(workExpEndDateValidate);
    setWorkExpLocationError(workExpLocationValidate);

    const hasWorkExpError = [
      designationValidate,
      organisationValidate,
      employmentTypeValidate,
      workExpStartDateValidate,
      workExpEndDateValidate,
      workExpLocationValidate,
    ].some((val) => val !== "");

    if (hasWorkExpError) {
      console.log("Validation errors found");
      message.error("Please fill all fields correctly before proceeding.");
      return;
    }

    const workExpUserData = {
      designation: designation,
      organisation: organisation,
      employmentType: employmentType,
      workExpStartDate: workExpStartDate,
      workExpEndDate: workExpEndDate,
      workExpLocation: workExpLocation,
      cgpa: cgpa,
    };
    console.log("Saving user data:", workExpUserData);
    message.success("Education details saved successfully.");
    resetFormFields();
  };

  const handleProjectSave = (e) => {
    e.preventDefault();

    const projectValidate = nameValidator(project);
    const projectTypeValidate = selectValidator(projectType);
    const projectStartDateValidate = selectValidator(projectStartDate);
    const projectEndDateValidate = selectValidator(projectEndDate);
    const projectDescriptionValidate = nameValidator(projectDescription);

    setProjectError(projectValidate);
    setProjectTypeError(projectTypeValidate);
    setProjectStartDateError(projectStartDateValidate);
    setProjectEndDateError(projectEndDateValidate);
    setProjectDescriptionError(projectDescriptionValidate);

    const hasProjectError = [
      projectValidate,
      projectTypeValidate,
      projectStartDateValidate,
      projectEndDateValidate,
      projectDescriptionValidate,
    ].some((val) => val !== "");

    let valid = true;

    if (!projectType) {
      setProjectTypeError("Project Type is required   ");
      valid = false;
    }

    if (hasProjectError) {
      console.log("Validation errors found");
      message.error("Please fill all fields correctly before proceeding.");
      return;
    }

    const projectUserData = {
      project: project,
      projectType: projectType,
      projectStartDate: projectStartDate,
      projectEndDate: projectEndDate,
      projectDescription: projectDescription,
    };
    console.log("Saving user data:", projectUserData);
    message.success("Education details saved successfully.");
    resetFormFields();
  };

  const handleAboutSave = (e) => {
    e.preventDefault();

    const aboutTextValidate = nameValidator(aboutTextNew);

    setAboutTextError(aboutTextValidate);

    const hasAboutError = [aboutTextValidate].some((val) => val !== "");

    if (hasAboutError) {
      console.log("Validation errors found");
      message.error("Please fill all fields correctly before proceeding.");
      return;
    }

    const aboutUserData = {
      aboutTextNew: aboutTextNew,
    };
    console.log("Saving user data:", aboutUserData);
    message.success("About details saved successfully.");
    resetFormFields();
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

    setResumeFile(file); // Store the file in state
    return false; // Prevent auto-upload
  };

  const handleSkillsSave = (e) => {
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

    console.log("Saving skills data:", customSkillUserData);
    message.success("Skills saved successfully.");
    resetFormFields();

    // Reset states
    setCustomSkill("");
    setSelectedSkills([]);
    setCustomSkillError("");
  };

  const handleFileSave = () => {
    if (!resumeFile) {
      message.error("Please upload a valid resume before saving.");
      return;
    }

    resetFormFields();
    console.log("Saving file:", resumeFile);
    message.success("Resume saved successfully!");
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

  const [savedLinks, setSavedLinks] = useState([]);
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

  const handleAddSocialLinks = () => {
    let hasErrors = false;
    const newErrors = {};

    Object.entries(socialLinks).forEach(([platform, link]) => {
      if (link.trim() !== "") {
        if (!urlPattern.test(link)) {
          newErrors[platform] = "Invalid URL";
          hasErrors = true;
        }
      }
    });

    setSocialLinkErrors((prev) => ({ ...prev, ...newErrors }));

    if (hasErrors) {
      message.error("Please correct the errors before saving.");
      return;
    }

    const linksArray = Object.entries(socialLinks)
      .filter(([_, value]) => value.trim() !== "")
      .map(([platform, link]) => ({ platform, link }));

    if (linksArray.length === 0) {
      message.warning("Please enter at least one social link.");
      return;
    }

    setSavedLinks((prev) => [...prev, linksArray]);
    console.log("Saved Social Links:", linksArray);
    resetFormFields();
    message.success("Social links saved successfully!");

    // Reset inputs and errors
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

  const [resetTrigger, setResetTrigger] = useState(false);

  const resetFormFields = () => {
    // Basic Details
    console.log("resetttt");

    setFname("");
    setLname("");
    setUserName("");
    setEmail("");
    setPhoneNumber("");
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

    // Work Experience
    setDesignation("");
    setOrganisation("");
    setEmploymentType("");
    setWorkExpStartDate("");
    setWorkExpEndDate("");
    setWorkExpLocation("");

    // Projects
    setProject("");
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
    setUserNameError("");
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
    setOrganisationError("");
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
    // setResetTrigger((prev) => !prev);
  };

  // useEffect(() => {

  // }, [resetTrigger]);

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
                error={lnameError}
              />
            </div>
          </div>

          <div className="form-group">
            <CommonInputField
              label="Username"
              mandotary={true}
              value={userName}
              placeholder="Enter your Username"
              onChange={(e) => {
                setUserName(e.target.value);
                setUserNameError(nameValidator(e.target.value));
              }}
              error={userNameError}
            />
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
                <button
                  type="button"
                  className={
                    activeButton === "Male"
                      ? "job_nature_button_active"
                      : "job_nature_button"
                  }
                  onClick={() => {
                    handleButtonClick("Male");
                    setGender("Male");
                    setGenderError("");
                  }}
                >
                  <IoIosMale /> Male
                </button>

                <button
                  type="button"
                  className={
                    activeButton === "Female"
                      ? "job_nature_button_active"
                      : "job_nature_button"
                  }
                  onClick={() => {
                    handleButtonClick("Female");
                    setGender("Female");
                    setGenderError("");
                  }}
                >
                  <IoFemaleOutline /> Female
                </button>

                <button
                  type="button"
                  className={
                    activeButton === "Others"
                      ? "job_nature_button_active"
                      : "job_nature_button"
                  }
                  onClick={() => {
                    handleButtonClick("Others");
                    setGender("Others");
                    setGenderError("");
                  }}
                >
                  <MdOutlineNotInterested /> Others
                </button>
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
                <button
                  type="button"
                  className={
                    userTypeactiveButton === "Collage Student"
                      ? "job_nature_button_active"
                      : "job_nature_button"
                  }
                  onClick={() => {
                    handleUserTypeClick("Collage Student");
                    setUserType("Collage Student");
                    setUserTypeError("");
                  }}
                >
                  <LuGraduationCap /> Collage Student
                </button>

                <button
                  type="button"
                  className={
                    userTypeactiveButton === "Professional"
                      ? "job_nature_button_active"
                      : "job_nature_button"
                  }
                  onClick={() => {
                    handleUserTypeClick("Professional");
                    setUserType("Professional");
                    setUserTypeError("");
                  }}
                >
                  <GiOfficeChair /> Professional
                </button>

                <button
                  type="button"
                  className={
                    userTypeactiveButton === "School Student"
                      ? "job_nature_button_active"
                      : "job_nature_button"
                  }
                  onClick={() => {
                    handleUserTypeClick("School Student");
                    setUserType("School Student");
                    setUserTypeError("");
                  }}
                >
                  <PiStudent /> School Student
                </button>

                <button
                  type="button"
                  className={
                    userTypeactiveButton === "Fresher"
                      ? "job_nature_button_active"
                      : "job_nature_button"
                  }
                  onClick={() => {
                    handleUserTypeClick("Fresher");
                    setUserType("Fresher");
                    setUserTypeError("");
                  }}
                >
                  <GiNewShoot /> Fresher
                </button>
              </div>
              {userTypeError && (
                <div style={{ color: "red", marginTop: 6, fontSize: 13 }}>
                  {userTypeError}
                </div>
              )}
            </Form.Item>
          </div>

          <div className="">
            {userTypeactiveButton === "Collage Student" && (
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

                <div style={{ alignItems: "center" }} className="form-row">
                  <div className="form-group">
                    <CommonDatePicker
                      value={startDate}
                      label="Start Year"
                      name="startyear"
                      placeholder="Start Year"
                      onChange={(value) => {
                        setStartDate(value);

                        if (!value || value.trim() === "") {
                          setStartDateError(" is required");
                        } else {
                          setStartDateError("");
                        }
                      }}
                      error={startDateError}
                    />
                  </div>

                  <div className="form-group">
                    <CommonDatePicker
                      value={endDate}
                      label="End Year"
                      name="endyear"
                      placeholder="End Year"
                      onChange={(value) => {
                        setEndDate(value);

                        if (!value || value.trim() === "") {
                          setEndDateError(" is required");
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

                <div style={{ alignItems: "center" }} className="form-row">
                  <div className="form-group">
                    <CommonDatePicker
                      value={fresherStartDate}
                      label="Start Year"
                      name="startyear"
                      placeholder="Start Year"
                      onChange={(value) => {
                        setFresherStartDate(value);

                        if (!value || value.trim() === "") {
                          setFresherStartDateError(" is required");
                        } else {
                          setFresherStartDateError("");
                        }
                      }}
                      error={fresherStartDateError}
                    />
                  </div>

                  <div className="form-group">
                    <CommonDatePicker
                      value={fresherEndtDate}
                      label="End Year"
                      name="endyear"
                      placeholder="End Year"
                      onChange={(value) => {
                        setFresherEndDate(value);

                        if (!value || value.trim() === "") {
                          setFresherEndDateError(" is required");
                        } else {
                          setFresherEndDateError("");
                        }
                      }}
                      error={fresherEndDateError}
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

        <Button
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
        </Button>

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
            name={"Job title"}
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

        <div style={{ alignItems: "center" }} className="form-row">
          <div className="form-group">
            <CommonDatePicker
              value={educationStartDate}
              label="Start Year"
              name="startyear"
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
            <CommonDatePicker
              value={educationEndDate}
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
            value={endDate}
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
              />
            </div>
          </Col>
        </Row>

        <Row style={{ gap: 20 }}>
          <Col lg={11}>
            <div className="form-group">
              <CommonInputField
                name="rollnumber"
                label="Roll Number"
                placeholder="Roll Number"
                type="number"
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
        <div style={{ textAlign: "-webkit-right" }} className="save_btn">
          <Button
            type="primary"
            size="large"
            onClick={handleEducationSave}
            className="nav-btn next-btn"
          >
            <MdFileDownloadDone style={{ fontSize: 22 }} />
            Save
          </Button>
        </div>
      </div>
    ),
    experience: () => (
      <div>
        <div className="form-group">
          <CommonSelectField
            label="Designation"
            name="designation"
            mandatory={true}
            placeholder="Select Designation"
            showSearch={true}
            value={designation}
            optionFilterProp="label"
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
              setDesignation(value);
              setDesignationError(selectValidator(value));
            }}
            error={designationError}
          />
        </div>

        <div className="form-group">
          <CommonSelectField
            label="Organisation"
            name="organisation"
            mandatory={true}
            placeholder="Select Organisation"
            showSearch={true}
            value={organisation}
            optionFilterProp="label"
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
              setOrganisation(value);
              setOrganisationError(selectValidator(value));
            }}
            error={organisationError}
          />
        </div>

        <div className="form-group">
          <CommonSelectField
            label="Employment type"
            name="employmenttype"
            mandatory={true}
            placeholder="Select Employmenttype"
            showSearch={true}
            value={employmentType}
            optionFilterProp="label"
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
              setEmploymentType(value);
              setEmploymentTypeError(selectValidator(value));
            }}
            error={employmentTypeError}
          />
        </div>

        <div style={{ alignItems: "end" }} className="form-row">
          <div className="form-group">
            <CommonDatePicker
              value={workExpStartDate}
              label="Start Date"
              name="startdate"
              placeholder="Start Date"
              onChange={(value) => {
                setWorkExpStartDate(value);

                if (!value || value.trim() === "") {
                  setWorkExpStartDateError(" is required");
                } else {
                  setWorkExpStartDateError("");
                }
              }}
              error={workExpStartDateError}
            />
          </div>
          <div className="form-group">
            <CommonDatePicker
              value={workExpEndDate}
              label="End Date"
              name="enddate"
              placeholder="End Date"
              onChange={(value) => {
                setWorkExpEndDate(value);

                if (!value || value.trim() === "") {
                  setWorkExpEndDateError(" is required");
                } else {
                  setWorkExpEndDateError("");
                }
              }}
              error={workExpEndDateError}
            />
          </div>
        </div>

        <div className="form-group">
          <CommonInputField
            name={"location"}
            label="Location"
            mandotary={true}
            placeholder={"Location"}
            type={"text"}
            value={workExpLocation}
            onChange={(e) => {
              setWorkExpLocation(e.target.value);
              setWorkExpLocationError(nameValidator(e.target.value));
            }}
            error={workExpLocationError}
          />
        </div>
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
            <IoMdAdd style={{ fontSize: 22 }} />
            Add
          </Button>
        </div>
      </div>
    ),

    projects: () => (
      <div>
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
            label={<span style={{ fontWeight: 500 }}>Project Type</span>}
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
              <div style={{ color: "red", marginTop: 6, fontSize: 13 }}>
                {projectTypeError}
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

        {/*  */}

        <div className="form-group">
          <CommonTextArea
            label={"Project Description"}
            placeholder={"Enter your description"}
            mandatory={true}
            name={"description"}
            value={projectDescription}
            onChange={(e) => {
              setProjectDescription(e.target.value);
              setProjectDescriptionError(nameValidator(e.target.value));
            }}
            error={projectDescriptionError}
          />
        </div>
        <div style={{ textAlign: "-webkit-right" }} className="save_btn">
          <Button
            type="primary"
            size="large"
            onClick={handleProjectSave}
            className="nav-btn next-btn"
          >
            <MdFileDownloadDone style={{ fontSize: 22 }} />
            Save
          </Button>
        </div>
      </div>
    ),

    certification: () => (
      <Dragger
        fileList={certifications}
        onChange={handleCertification}
        status="done"
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined style={{ color: "#5f2eea" }} />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibited from
          uploading company<br></br> data or other banned files.
        </p>
      </Dragger>
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
                <h2 style={{ marginBottom: 4 }}>Santhosh Kathirvel</h2>
                <p style={{ marginBottom: 6, color: "#666" }}>@santhkat7778</p>
                <div>
                  <Tag color="blue">Markerz Global Solution</Tag>
                  <Tag color="purple">Accountant</Tag>
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
          {/* Certificate Section */}

          <div className="profile-section-card userprofile_cards">
            <div className="skills_card">
              <div style={{ textAlign: "left" }}>
                <h3>Certificate</h3>
                <p className="profile-section-description">
                  Flaunt your certifications and show recruiters that you're a
                  step ahead in your field!
                </p>
                <Button
                  onClick={() => {
                    setActiveTab("certification");
                    showDrawer();
                  }}
                  style={{ color: "#5f2eea", paddingLeft: 0, paddingTop: 10 }}
                  type="link"
                >
                  <PlusOutlined />
                  Add Certificate
                </Button>
              </div>
              <div>
                <img src={profile5}></img>
              </div>
            </div>
            <Divider />
          </div>
        </div>

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
