import React, { useEffect, useState } from "react";
import {
  Button,
  Drawer,
  Card,
  Row,
  Col,
  Typography,
  Space,
  Avatar,
  ColorPicker,
  Alert,
  Form,
  Select,
  Input,
  InputNumber,
  message,
  Upload,
  Switch,
  Divider,
  Tag,
  Skeleton,
} from "antd";
import {
  EditOutlined,
  PictureOutlined,
  ProfileOutlined,
  SolutionOutlined,
  FileTextOutlined,
  UserOutlined,
  EyeOutlined,
  AreaChartOutlined,
  PlusCircleOutlined,
  UploadOutlined,
  DeleteOutlined,
  CheckOutlined,
  LineChartOutlined,
  MedicineBoxOutlined,
  CarOutlined,
  CoffeeOutlined,
} from "@ant-design/icons";
import {
  getJobCategoryData,
  getSalaryData,
  getWorkPlaceLocation,
  getYears,
  getEligibilityData,
  getSkillsData,
  getDurationTypes,
  getJobNature,
  getWorkPlaceType,
  getDuration,
  checkIsJobApplied,
  getJobPosts,
  updateJobBasicDetails,
  updateJobNature,
  updateEligibility,
  getGenderData,
  getBenifitsData,
  updateJobDescription,
} from "../ApiService/action";
import ReactQuill from "react-quill";
import styled from "styled-components";
import { LuLocateFixed } from "react-icons/lu";
import { RiEqualizerLine } from "react-icons/ri";
import { TbContract } from "react-icons/tb";
import CommonInputField from "../Common/CommonInputField";
import CommonSelectField from "../Common/CommonSelectField";
import { MdOutlineModeEdit } from "react-icons/md";
import { PiOfficeChairLight } from "react-icons/pi";
import { FaPersonCircleExclamation } from "react-icons/fa6";
import { MdFileDownloadDone } from "react-icons/md";
import {
  FaBusinessTime,
  FaAngleUp,
  FaAngleDown,
  FaCheckCircle,
} from "react-icons/fa";
import { State, City } from "country-state-city";
import { HiMiniComputerDesktop } from "react-icons/hi2";
import { MdOutlineEventNote } from "react-icons/md";
import { MdOutlineSchool, MdOutlineWorkOutline } from "react-icons/md";
import { FaTransgender } from "react-icons/fa6";
import additional1 from "../images/additional1.png";
import additional2 from "../images/additional2.png";
import additional3 from "../images/additional3.png";
import additional4 from "../images/additional4.png";
import additional5 from "../images/additional5.png";
import additional6 from "../images/additional6.png";

import {
  FaRegCalendarAlt,
  FaRegBuilding,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useParams } from "react-router-dom";

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

const StatsCard = styled(StyledCard)`
  .ant-card-body {
    padding: 20px;
  }
`;

const editOptions = [
  {
    key: "basic",
    title: "Job Basics & Eligibility",
    description:
      "Set job title, role, category, number of openings, and eligibility criteria",
    icon: <ProfileOutlined style={{ fontSize: 18, color: "#13c2c2" }} />,
    color: "#13c2c2",
  },
  {
    key: "process",
    title: "Work Mode & Requirements",
    description:
      "Define work type (remote/hybrid/onsite), required experience, and qualifications",
    icon: <SolutionOutlined style={{ fontSize: 18, color: "#fa8c16" }} />,
    color: "#fa8c16",
  },
  {
    key: "description",
    title: "Salary & Compensation",
    description:
      "Outline salary range, compensation structure, and benefits offered",
    icon: <FileTextOutlined style={{ fontSize: 18, color: "#eb2f96" }} />,
    color: "#eb2f96",
  },
  {
    key: "additionalinformation",
    title: "Detailed Job Description",
    description:
      "Describe responsibilities, expectations, work culture, and additional notes",
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
      // console.log("workplace location", response);
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
      // console.log("years", response);
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
      // console.log("Eligibility data", response);
    } catch (error) {
      console.log("Eligibility data error", error);
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
        getJobNatureData();
      }, 300);
    }
  };

  const getJobNatureData = async () => {
    try {
      const response = await getJobNature();
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
      // console.log("workplace type", response);
    } catch (error) {
      console.log("workplace type", error);
    } finally {
      getDurationTypesData();
    }
  };

  //onclick functions
  const getDurationTypesData = async () => {
    try {
      const response = await getDurationTypes();
      setInternshipDurationTypeData(response?.data?.data || []);
      // console.log("Duration type", response);
    } catch (error) {
      console.log("duration type", error);
    } finally {
      setTimeout(() => {
        getDurationData();
      }, 300);
    }
  };

  const getDurationData = async (durationId) => {
    const payload = {
      duration_type_id: durationId,
    };
    try {
      const response = await getDuration(payload);
      setIntershipDuration(response?.data?.data || []);
      // console.log("duration typesss", response);
    } catch (error) {
      console.log("duration errorss", error);
    } finally {
      setTimeout(() => {
        getGenderDataType();
      }, 300);
    }
  };

  const getGenderDataType = async () => {
    try {
      const response = await getGenderData();
      setGender(response?.data?.data || []);
      // console.log("gender", response);
    } catch (error) {
      console.log("gender error", error);
    } finally {
      getBenifitsDataType();
    }
  };

  const getBenifitsDataType = async () => {
    try {
      const response = await getBenifitsData();
      setOtherBenifits(response?.data?.data || []);
      // console.log("Benifits data", response);
    } catch (error) {
      console.log("Benifits data", error);
    }
  };

  const OptionCardSkeleton = () => (
    <Card
      style={{
        padding: "15px 6px",
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
        border: "none",
        marginBottom: 16,
      }}
    >
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        {/* Avatar Skeleton */}
        <Skeleton.Avatar active size={40} />

        {/* Content Skeleton */}
        <div style={{ flex: 1 }}>
          <Skeleton.Input
            active
            size="small"
            style={{ width: 150, marginBottom: 8 }}
          />
          <Skeleton
            active
            paragraph={{ rows: 1, width: "100%" }}
            title={false}
          />
        </div>

        {/* Button Skeleton */}
        <Skeleton.Button active shape="circle" size="small" />
      </div>
    </Card>
  );

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [salaryData, setSalaryData] = useState([]);
  const [salaryTypeActiveButton, setSalaryTypeActiveButton] = useState("");
  const [salaryDetails, setSalaryDetails] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [fixedSalary, setFixedSalary] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobCategory, setJobCategory] = useState("");
  const [jobCategoryOptions, setJobCategoryOptions] = useState([]);
  const [value, setValue] = useState(defaultContent);
  const MAX_LENGTH = 3000;
  const [jobDescription, setJobDescription] = useState("");
  const [jobOpenings, setJobOpenings] = useState("");
  const [workingDays, setWorkingDays] = useState([]);
  const [workLocation, setWorkLocation] = useState("");
  const [workplaceLocation, setWorkplaceLocation] = useState("");
  const [workLocationActiveButton, setWorkLocationActiveButton] = useState("");
  const [specificLocation, setSpecificLocation] = useState("");
  const [workLocationOption, setWorkLocationOption] = useState([]);
  const [eligibilityData, setEligibilityData] = useState([]);
  const [experienceRequiredActiveButton, setExperienceRequiredActiveButton] =
    useState(null);
  const [eligibility, setEligibility] = useState("");
  const [eligibilityYearData, setEligibilityYearData] = useState([]);
  const [selectedFresherPass, setSelectedFresherPass] = useState([]);
  const [eligibilityYear, setEligibilityYear] = useState("");
  const [experienceRequired, setExperienceRequired] = useState("");
  const [skillsRequired, setSkillsRequired] = useState([]);
  const [skillsRequiredOptions, setSkillsRequiredOption] = useState([]);
  const [workingDaysName, setWorkingDaysName] = useState("");
  const [jobNatureOptions, setJobNatureOptions] = useState([]);
  const [jobNatureId, setJobNatureId] = useState(null);
  const [internshipDurationTypeData, setInternshipDurationTypeData] = useState(
    []
  );
  const [workplaceTypeData, setWorkplaceTypeData] = useState([]);
  const [jobInternshipDuration, setJobInternshipDuration] = useState("");
  const [internShipDuration, setIntershipDuration] = useState([]);
  const [selectedDurationId, setSelectedDurationId] = useState(null);
  const [weeksActiveButton, setWeeksActiveButton] = useState(null);
  const [workTypeActiveButton, setWorkTypeActiveButton] = useState(null);
  const [workplaceType, setWorkplaceType] = useState("");
  const [backendJobs, setBackendJobs] = useState([]);
  const [postDetails, setPostDetails] = useState([]);
  const [loginUserId, setLoginUserId] = useState(null);
  const [isApplied, setIsApplied] = useState({});
  const [selectedCategories, setSelectedCategories] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selected, setSelected] = useState([]);
  const [selectedWorkingDays, setSelectedWorkingDays] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [jobNatureSelected, setJobNatureSelected] = useState("");
  const [selectedSort, setSelectedSort] = useState(null);
  const [diversityenabled, setDiversityEnabled] = useState(true);
  const [gender, setGender] = useState([]);
  const [genderselected, setGenderSelected] = useState([]);
  const [otherBenifits, setOtherBenifits] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [selectedBenefits, setSelectedBenefits] = useState([]);
  const [logoUrl, setLogoUrl] = useState(
    "https://d8it4huxumps7.cloudfront.net/uploads/images/150x150/uploadedManual-685be86f28e4d_mark.jpeg"
  );
  const [logoFile, setLogoFile] = useState(null);
  const [currentPostId, setCurrentPostId] = useState(null);
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [drawerLoading, setDrawerLoading] = useState(false);

  useEffect(() => {
    console.log("Job ID from URL:", id);
  }, [id]);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  ///////
  const transformJob = (job) => {
    const postedDate = new Date(job.created_at);
    const today = new Date();
    const timeDiff = today - postedDate;
    const daysPassed = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    const totalActiveDays = 15;
    const daysLeft = totalActiveDays - daysPassed;
    setCurrentPostId(job.id);

    return {
      id: job.id,
      title: job.job_title,
      company: job.company_name,
      logo: job.company_logo,
      created_date: job.created_at,
      benefits: job.benefits,
      job_description: job.job_description,
      postedDate,
      job_category: job.job_category,
      working_days: job.working_days,
      daysLeft: daysLeft > 0 ? `${daysLeft} days left` : "Expired",
      level: job.experience_type,
      salary:
        job.salary_type === "Fixed"
          ? `$${job.min_salary || "N/A"}`
          : job.salary_type === "Range"
          ? `$${job.min_salary || "N/A"} - $${job.max_salary || "N/A"}`
          : "Negotiable",
      location: `${job.workplace_type}${
        job.work_location ? ` • ${job.work_location}` : ""
      }`,
      diversity_hiring: job.diversity_hiring,
      type: job.job_nature,
      job_category: job.job_category,
      openings: job.openings,
      premium: true,
      urgent: false,
      skills: job.skills || [],
      eligibility: job.experience_required?.join(", "),
      status: daysLeft > 0 ? "Live" : "Expired",
      questions: job.questions?.map((q) => q.question) || [],
      questions_with_ids:
        job.questions?.map((q) => ({
          id: q.id,
          question: q.question,
          isrequired: q.isrequired,
        })) || [],
    };
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem("loginDetails");
      console.log("login details", stored);
      if (stored) {
        const loginDetails = JSON.parse(stored);
        setLoginUserId(loginDetails.id);
      }
    } catch (error) {
      console.error("Invalid JSON in localStorage", error);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [loginUserId]);

  const fetchJobs = async () => {
    const payload = {
      job_categories: selectedCategories || [],
      workplace_type: selectedTypes || [],
      work_location: selected || [],
      working_days: selectedWorkingDays || "",
      status: selectedStatus || "",
      job_nature: jobNatureSelected || "",
      salary_sort:
        selectedSort === "highToLow"
          ? "high_to_low"
          : selectedSort === "lowToHigh"
          ? "low_to_high"
          : "",
    };

    try {
      setLoading(true);
      const response = await getJobPosts({});
      console.log("fetched jobs", response);
      const jobs = response?.data?.data?.data || [];
      const job = jobs.find((j) => j.id.toString() === id);

      if (job) {
        const transformedJob = transformJob(job);
        setPostDetails([transformedJob]);
        setCurrentPostId(job.id);
      }
    } catch (error) {
      console.error("Error fetching job post:", error);
    } finally {
      setTimeout(() => {
        checkIsJobAppliedData();
        setLoading(false);
      }, 300);
    }
  };

  useEffect(() => {
    if (backendJobs.length > 0 && !postDetails.length) {
      const firstJob = transformJob(backendJobs[0]);
      setPostDetails([firstJob]);
      checkIsJobAppliedData(firstJob.id);
    }
  }, [backendJobs]);

  useEffect(() => {
    if (postDetails.length > 0) {
      const job = postDetails[0];
      setCompanyName(job.company || "");
      setLogoUrl(job.logo || null);
      setJobTitle(job.title || "");
      setSkillsRequired(job.skills || []);
      setJobCategory(job.job_category[0]);
      setJobOpenings(job.openings || "");
      setWorkingDays(job.working_days || []);
      setWorkingDaysName(job.working_days || "");
      setJobDescription(job.job_description || "");
      localStorage.setItem("jobDescription", job.job_description || "");
    }
  }, [postDetails]);

  useEffect(() => {
    const savedJobDescription = localStorage.getItem("jobDescription");
    if (savedJobDescription) {
      setJobDescription(savedJobDescription);
      setValue(savedJobDescription); // For ReactQuill
    }
  }, []);

  const checkIsJobAppliedData = async (postId) => {
    if (!loginUserId || !postId) return;

    const payload = {
      user_id: loginUserId,
      job_post_id: postId,
    };
    try {
      const response = await checkIsJobApplied(payload);
      setIsApplied((prev) => ({
        ...prev,
        [postId]: response?.data?.data || false,
      }));
    } catch (error) {
      console.log("is applied error", error);
      setIsApplied((prev) => ({
        ...prev,
        [postId]: false,
      }));
    }
  };

  const handleSaveBasicDetails = async () => {
    console.log("Current values before save:", {
      skillsRequired,
      jobCategory,
      workingDays,
    });
    const payload = {
      job_post_id: currentPostId,
      company_name: companyName,
      company_logo: logoUrl,
      job_title: jobTitle,
      job_categories: jobCategory,
      skills: skillsRequired,
      openings: jobOpenings,
      working_days: workingDays,
    };
    try {
      const response = await updateJobBasicDetails(payload);
      setTimeout(() => {
        fetchJobs();
      }, 300);

      message.success("Updated Sucessfully");
      setDrawerOpen(false);
      console.log("update basic details", response);
    } catch (error) {
      console.log("update basic details", error);
      message.error("Updated Error");
    }
  };

  const getDurationName = internShipDuration.find(
    (f) => f.id === selectedDurationId
  );

  const handleSaveJobNature = async () => {
    const payload = {
      job_post_id: currentPostId,
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
          ? getDurationName?.duration || ""
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
    };

    try {
      const response = await updateJobNature(payload);
      console.log("jobnature update", response);
      message.success("Updated Successfully");
      fetchJobs();
      setDrawerOpen(false);
    } catch (error) {
      console.log("jobnature update", error);
      message.error("Updated error");
    }
  };

  const handleTagClick = (id) => {
    setGenderSelected((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((gid) => gid !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const allDiversity = gender
    .filter((d) => genderselected.includes(d.id))
    .map((d) => d.name);

  const handleSalarySave = async () => {
    const payload = {
      job_post_id: currentPostId,
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
    };

    try {
      const response = updateEligibility(payload);
      console.log("jobnature update", response);
      message.success("Updated Successfully");
      fetchJobs();
      setDrawerOpen(false);
    } catch (error) {
      console.log("jobnature update", error);
      message.error("Updated error");
    }
  };

  const visibleBenefits = showMore ? otherBenifits : otherBenifits.slice(0, 4);
  const toggleBenefitSelection = (key) => {
    setSelectedBenefits((prevSelected) =>
      prevSelected.includes(key)
        ? prevSelected.filter((item) => item !== key)
        : [...prevSelected, key]
    );
  };

  const allBenefitsData = otherBenifits
    .filter((b) => selectedBenefits.includes(b.id))
    .map((b) => b.name);

  const handleDescriptionSave = async () => {
    const payload = {
      job_post_id: currentPostId,
      description: jobDescription,
      formattedBenefits: allBenefitsData,
    };

    try {
      const response = updateJobDescription(payload);
      console.log("jobnature update", response);
      message.success("Updated Successfully");
      fetchJobs();
      setDrawerOpen(false);
    } catch (error) {
      console.log("jobnature update", error);
      message.error("Updated error");
    }
  };

  const handleEditClick = (key) => {
    setActiveSection(key);
    setDrawerOpen(true);
    setDrawerLoading(true);
    const timer = setTimeout(() => {
      setDrawerLoading(false);
    }, 700);
    return () => clearTimeout(timer);
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
      setValue(content);
      setJobDescription(content);
      localStorage.setItem("jobDescription", content); // Save to localStorage
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
          <div className="basicdetails_edit">
            <Alert
              style={{ marginBottom: 20, fontSize: 12, border: "none" }}
              message="For best results, upload a clear company logo (JPG, PNG, or SVG format)."
              type="warning"
              showIcon
            />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 40,
                position: "relative",
              }}
            >
              <div
                className="logo-upload-container"
                style={{
                  textAlign: "center",
                  position: "relative",
                  transition: "all 0.3s ease",
                }}
              >
                <div
                  style={{
                    width: 140,
                    height: 140,
                    margin: "0 auto",
                    borderRadius: 12,
                    border: "1px dashed #d9d9d9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                    position: "relative",
                    background: logoUrl ? "transparent" : "#fafafa",
                    transition: "all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)",
                  }}
                >
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt="Company Logo"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        transition: "transform 0.3s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.05)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    />
                  ) : (
                    <div
                      style={{
                        color: "#8c8c8c",
                        fontSize: 14,
                        padding: 20,
                      }}
                    >
                      <UploadOutlined
                        style={{ fontSize: 24, marginBottom: 8 }}
                      />
                      <div>Company Logo</div>
                    </div>
                  )}
                </div>

                <div
                  style={{
                    marginTop: 20,
                    display: "flex",
                    justifyContent: "center",
                    gap: 12,
                  }}
                >
                  <Upload
                    showUploadList={false}
                    beforeUpload={(file) => {
                      const isImage = file.type.startsWith("image/");
                      if (!isImage) {
                        message.error("Only image files are allowed");
                        return false;
                      }
                      const reader = new FileReader();
                      reader.onload = (e) => setLogoUrl(e.target.result);
                      reader.readAsDataURL(file);
                      setLogoFile(file);
                      return false;
                    }}
                  >
                    <Button
                      type={logoUrl ? "default" : "primary"}
                      icon={<UploadOutlined />}
                      className="uploadNew_profile"
                      shape="round"
                      style={{
                        minWidth: 140,
                        height: 36,
                        fontWeight: 500,
                        letterSpacing: 0.2,
                        boxShadow: logoUrl
                          ? "none"
                          : "0 2px 8px rgba(0, 85, 255, 0.2)",
                      }}
                    >
                      {logoUrl ? "Change Logo" : "Upload Logo"}
                    </Button>
                  </Upload>

                  {logoUrl && (
                    <Button
                      danger
                      type="text"
                      icon={<DeleteOutlined />}
                      shape="round"
                      style={{
                        height: 36,
                        fontWeight: 500,
                        letterSpacing: 0.2,
                      }}
                      onClick={() => {
                        setLogoUrl(null);
                        setLogoFile(null);
                      }}
                    >
                      Remove
                    </Button>
                  )}
                </div>

                {logoUrl && (
                  <>
                    <div
                      style={{
                        position: "absolute",
                        top: -10,
                        right: -10,
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: "rgb(0 179 5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: 12,
                        boxShadow: "0 2px 8px rgba(24, 144, 255, 0.3)",
                      }}
                    >
                      <CheckOutlined />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="form-group">
              <CommonInputField
                name={"Company name"}
                label="Company you are hiring for"
                placeholder={"Enter your company name"}
                type={"text"}
                value={companyName}
                onChange={(e) => {
                  setCompanyName(e.target.value);
                }}
              />
            </div>

            <div className="form-group">
              <CommonInputField
                name={"Job title"}
                label="Job Title/Role"
                placeholder={"Enter your job title"}
                type={"text"}
                value={jobTitle}
                onChange={(e) => {
                  setJobTitle(e.target.value);
                }}
              />
            </div>
            <div className="from-group">
              <CommonSelectField
                label={"Skills Required"}
                showSearch={true}
                mode="multiple"
                placeholder={"Select skills"}
                style={{ height: 56 }}
                value={skillsRequired}
                options={skillsRequiredOptions}
                onChange={(value) => {
                  setSkillsRequired(value);
                }}
              />
            </div>

            <div style={{ marginTop: 15 }} className="form-group">
              <CommonSelectField
                label={"Job Category"}
                showSearch={true}
                value={jobCategory}
                placeholder={"Select Job Category"}
                options={jobCategoryOptions}
                onChange={(value) => {
                  console.log("valllllllll", value);
                  setJobCategory(value);
                }}
              />
            </div>

            <div className="form-group">
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

            {/* working days */}
            <div style={{ marginTop: 20 }} className="form-group">
              <CommonSelectField
                label={"Working Days"}
                showSearch={true}
                value={workingDays}
                placeholder={"Choose working days"}
                options={workingDaysOptions}
                onChange={(value) => {
                  setWorkingDays(value);
                  setWorkingDaysName(value);
                }}
              />
            </div>
            <div>
              <Button
                onClick={handleSaveBasicDetails}
                className="account_settings"
                type="primary"
              >
                Save Changes
              </Button>
            </div>
          </div>
        );
      case "process":
        return (
          <>
            <div style={{ marginTop: 15 }} className="form-group">
              <Form.Item
                layout="vertical"
                label={<span style={{ fontWeight: 500 }}>Job Nature </span>}
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
              </Form.Item>
            </div>

            <div style={{ marginTop: 15 }} className="form-group">
              {jobNatureId === 2 && (
                <Form.Item
                  layout="vertical"
                  label={
                    <span style={{ fontWeight: 500 }}>
                      Internships Duration
                    </span>
                  }
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
            {/*  */}

            <div style={{ marginTop: 15 }} className="form-group">
              <div className="job_nature">
                <Form.Item
                  layout="vertical"
                  label={
                    <span style={{ fontWeight: 500 }}>Workplace Type</span>
                  }
                  style={{ marginBottom: "0px" }}
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
                          }}
                        >
                          <PiOfficeChairLight /> {item.name}
                        </button>
                      );
                    })}
                  </div>
                </Form.Item>
              </div>
            </div>

            <div style={{ marginTop: 15 }} className="form-group">
              {workTypeActiveButton === 3 || workTypeActiveButton === 1 ? (
                <Form.Item
                  layout="vertical"
                  label={<span style={{ fontWeight: 500 }}>Work Location</span>}
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
                          }}
                        >
                          <PiOfficeChairLight /> {item.name}
                        </button>
                      );
                    })}
                  </div>

                  {workLocationActiveButton === 1 ? (
                    <CommonSelectField
                      style={{ marginTop: "20px" }}
                      showSearch={true}
                      placeholder={"Select location"}
                      value={specificLocation}
                      onChange={(value, option) => {
                        setSpecificLocation(value);
                      }}
                      options={workLocationOption}
                    />
                  ) : null}
                </Form.Item>
              ) : null}
            </div>
            <div style={{ marginTop: 20 }}>
              <Button
                onClick={handleSaveJobNature}
                className="account_settings"
                type="primary"
              >
                Save Changes
              </Button>
            </div>
          </>
        );
      case "description":
        return (
          <>
            <div className="salary_details">
              <h4>Salary Details</h4>
              <p>
                Add compensation details to filter better candidates and speed
                up the sourcing process.
              </p>
              <Alert
                style={{ marginTop: 10, fontSize: 12, border: "none" }}
                message="Select the Salary type that will be displayed after saving."
                type="warning"
                showIcon
              />
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

            <div className="eligibility">
              <h4>Eligibility</h4>
              <p>
                Add the eligibility criteria to better filter the candidates.
              </p>
              <Alert
                style={{ marginBottom: 10, fontSize: 12, border: "none" }}
                message="Select the eligibility criteria that will be displayed after saving."
                type="warning"
                showIcon
              />
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
                              // setEligibilityYear(item.id);
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
              <Alert
                style={{ marginBottom: 10, fontSize: 12, border: "none" }}
                message="Select the gender that will be displayed after saving."
                type="warning"
                showIcon
              />
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
            <div style={{ marginTop: 20 }}>
              <Button
                onClick={handleSalarySave}
                className="account_settings"
                type="primary"
              >
                Save Changes
              </Button>
            </div>
          </>
        );

      case "additionalinformation":
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
              <Button
                onClick={handleDescriptionSave}
                className="account_settings"
                type="primary"
              >
                Save Changes
              </Button>
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
            width: "360px",
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
          {loading ? (
            <Space direction="vertical" size={16} style={{ width: "100%" }}>
              {[1, 2, 3, 4].map((item) => (
                <OptionCardSkeleton key={item} />
              ))}
            </Space>
          ) : (
            <Space direction="vertical" size={16} style={{ width: "100%" }}>
              {editOptions.map((item) => (
                <>
                  <OptionCard
                    style={{ padding: "15px 6px" }}
                    key={item.key}
                    hoverable
                  >
                    <div
                      style={{ display: "flex", gap: 16, alignItems: "center" }}
                    >
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
                </>
              ))}
            </Space>
          )}
        </div>

        {/* Right Panel - Preview */}
        <div
          className="premium-job-details"
          style={{
            flex: 1,
            overflowY: "auto",
            maxHeight: "calc(100vh - 48px)",
            paddingRight: 8,
            cursor: "no-drop",
          }}
        >
          {postDetails.map((job) => (
            <>
              {loading ? (
                <Skeleton active />
              ) : (
                <>
                  <div className="premium-job-card">
                    <Alert
                      style={{
                        marginTop: 0,
                        marginBottom: 6,
                        fontSize: 12,
                        border: "none",
                        position: "absolute",
                        top: 0,
                        left: 15,
                        padding: "5px 10px",
                      }}
                      message="For Display Purposes Only!"
                      type="warning"
                      showIcon
                    />
                    <div className="">
                      <div className="premium-border"></div>
                      <div className="premium-indicator">
                        <span
                          className={
                            job.status === "Live"
                              ? "status-badge"
                              : job.status === "Expired"
                              ? "status-badge-red"
                              : "status-badge"
                          }
                        >
                          {job.status}
                        </span>
                      </div>

                      <div className="company-logo-wrapper">
                        <img
                          src={job.logo}
                          alt="Company Logo"
                          className="premium-logo"
                        />
                      </div>

                      <div className="job-content">
                        <h2 className="premium-job-title">{job.title}</h2>

                        <div className="job-meta-item">
                          <FaRegBuilding className="meta-icon premium-icon" />
                          <span className="meta-text">{job.company}</span>
                          <span className="verified-badge">Verified</span>
                        </div>

                        <div className="job-meta-item">
                          <FaMapMarkerAlt className="meta-icon premium-icon" />
                          <span className="meta-text">{job.location}</span>
                        </div>

                        <div className="job-meta-item">
                          <FaRegCalendarAlt className="meta-icon premium-icon" />
                          <span className="meta-text">
                            Updated On: {job.created_date}
                          </span>
                        </div>

                        <div className="job-tags">
                          <span className="tag">{job.type}</span>
                          <span className="tag">{job.working_days}</span>
                          <span className="tag">{job.salary}</span>
                        </div>
                      </div>
                    </div>

                    <div className="side_job_details">
                      <div className="side_job_actions">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          {isApplied[job.id] === true ? (
                            <div className="side_job_applied_badge">
                              <FaCheckCircle /> Applied
                            </div>
                          ) : (
                            <button
                              disabled
                              className={"side_job_apply_button disabled"}
                            >
                              Apply Now
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="side_job_eligibility">
                        <h4 className="side_job_eligibility_title">
                          Eligibility
                        </h4>
                        <div className="side_job_eligibility_details">
                          <span className="side_job_eligibility_item">
                            <MdOutlineSchool />
                            {job.level}
                          </span>
                          <span className="side_job_eligibility_item">
                            <MdOutlineWorkOutline />
                            {job.eligibility}
                          </span>
                          <span className="side_job_eligibility_item">
                            <FaTransgender />{" "}
                            {job.diversity_hiring.map(
                              (diversity_hiring, index) => (
                                <span key={index}>
                                  {diversity_hiring}
                                  {index < job.diversity_hiring.length - 1 &&
                                    ", "}
                                </span>
                              )
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <StatsCard
                    className="edit_oppor_details"
                    style={{ marginTop: 24 }}
                  >
                    <Row style={{ alignItems: "baseline" }} gutter={16}>
                      <Col lg={8} xs={24} sm={12}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 12,
                          }}
                        >
                          <Avatar
                            icon={<UserOutlined />}
                            style={{
                              backgroundColor: "#fde3cf",
                              color: "#f56a00",
                            }}
                          />
                          <div>
                            <Text type="secondary">Applications</Text>
                            <Title level={4} style={{ margin: 0 }}>
                              481
                            </Title>
                          </div>
                        </div>
                      </Col>
                      <Col lg={8} xs={24} sm={12}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 12,
                          }}
                        >
                          <Avatar
                            icon={<EyeOutlined />}
                            style={{
                              backgroundColor: "#d6e4ff",
                              color: "#1d39c4",
                            }}
                          />
                          <div>
                            <Text type="secondary">Impressions</Text>
                            <Title level={4} style={{ margin: 0 }}>
                              18,609
                            </Title>
                          </div>
                        </div>
                      </Col>

                      <Col lg={8} xs={24} sm={12}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 12,
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
                    </Row>
                  </StatsCard>

                  <StatsCard className="section-card job-description">
                    <h2 className="section-title">Job Description</h2>
                    <h6>
                      {job.company} is hiring for the role of {job.title}!
                    </h6>
                    <div
                      className="job-description-content"
                      dangerouslySetInnerHTML={{
                        __html: job.job_description,
                      }}
                    />
                  </StatsCard>

                  <StatsCard className="section-card">
                    <h2 className="section-title">Additional Information</h2>

                    <div className="info-card">
                      <div className="info-card-content">
                        <h4>Skills Required</h4>
                        <p>
                          {job.skills.map((skill, index) => (
                            <span key={index} className="premium-skill">
                              {skill}
                              {index < job.skills.length - 1 && (
                                <span className="skill-separator"> | </span>
                              )}
                            </span>
                          ))}
                        </p>
                      </div>

                      <img
                        className="info-card-image"
                        src={additional1}
                        alt="Location"
                      />
                    </div>

                    <div className="info-card">
                      <div className="info-card-content">
                        <h4>Job Openings</h4>
                        <p>{job.openings}</p>
                      </div>
                      <img
                        className="info-card-image"
                        src={additional2}
                        alt="Experience"
                      />
                    </div>

                    <div className="info-card">
                      <div className="info-card-content">
                        <h4>Job Benefits</h4>
                        <p>
                          {(job.benefits || []).map((benefit, index, arr) => (
                            <span key={index} className="premium-skill">
                              {benefit}
                              {index < arr.length - 1 && (
                                <span className="separator"> | </span>
                              )}
                            </span>
                          ))}
                        </p>
                      </div>

                      <img
                        className="info-card-image"
                        src={additional3}
                        alt="Salary"
                      />
                    </div>

                    <div className="info-card">
                      <div className="info-card-content">
                        <h4>Job Catergory</h4>
                        <p>{job.job_category}</p>
                      </div>
                      <img
                        className="info-card-image"
                        src={additional4}
                        alt="Work Details"
                      />
                    </div>

                    <div className="info-card">
                      <div className="info-card-content">
                        <h4>Work Schedule</h4>
                        <p>
                          <b>Working Days</b>: {job.working_days}
                        </p>
                      </div>
                      <img
                        className="info-card-image"
                        src={additional5}
                        alt="Work Details"
                      />
                    </div>

                    <div className="info-card">
                      <div className="info-card-content">
                        <h4>Job Type / Nature</h4>
                        <p>
                          <b>Job Type</b>: {job.location}
                        </p>
                        <p>
                          <b>Job Nature</b>: {job.type}
                        </p>
                      </div>
                      <img
                        className="info-card-image"
                        src={additional6}
                        alt="Work Details"
                      />
                    </div>
                  </StatsCard>
                </>
              )}
            </>
          ))}
        </div>
      </div>

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
        extra={
          <Space>
            <Button onClick={() => setDrawerOpen(false)}>Cancel</Button>
          </Space>
        }
      >
        {drawerLoading ? <Skeleton active /> : <>{renderDrawerContent()}</>}
      </Drawer>
    </div>
  );
};

export default EditOpportunity;
