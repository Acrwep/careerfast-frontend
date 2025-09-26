import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Space,
  Button,
  Dropdown,
  Drawer,
  Radio,
  Divider,
  Input,
  Checkbox,
  message,
  Spin,
  Empty,
  Skeleton,
  Tooltip,
  Badge,
} from "antd";
import {
  ClockCircleOutlined,
  ThunderboltFilled,
  CrownFilled,
  DownOutlined,
  CloseOutlined,
  EnvironmentOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import "../css/JobFilter.css";
import { FaTransgender } from "react-icons/fa6";
import {
  FaRegCalendarAlt,
  FaRegBuilding,
  FaMapMarkerAlt,
} from "react-icons/fa";
import CommonSelectField from "../Common/CommonSelectField";
import {
  applyForJob,
  checkIsJobApplied,
  checkIsJobSaved,
  getJobCategoryData,
  getJobPosts,
  getSavedJobs,
  removeSavedJobs,
  saveJobPost,
  userApplyJob,
} from "../ApiService/action";
import { FaLink } from "react-icons/fa6";
import { MdOutlineSchool, MdOutlineWorkOutline } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { CommonToaster } from "../Common/CommonToaster";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { IoMdCalendar } from "react-icons/io";
import { IoIosShareAlt } from "react-icons/io";
import { LuCalendarDays } from "react-icons/lu";
import { HiOutlineStatusOnline } from "react-icons/hi";
import { GrLocation } from "react-icons/gr";
import { CgWorkAlt } from "react-icons/cg";
import { BiCategoryAlt } from "react-icons/bi";
import Header from "../Header/Header";
import additional1 from "../images/additional1.png";
import additional2 from "../images/additional2.png";
import additional3 from "../images/additional3.png";
import additional4 from "../images/additional4.png";
import additional5 from "../images/additional5.png";
import additional6 from "../images/additional6.png";
import cities from "cities-list";
import axios from "axios";

const { Text } = Typography;

const workTypes = ["In Office", "On Field", "Work From Home"];
const jobNature = ["Job", "Internship", "Contract"];
const userTypes = ["Fresher", "Professionals", "College Students"];

export default function JobFilter() {
  const [openApplyNow, setOpenApplyNow] = useState(false);

  const [jobNatureVisible, setJobNatureVisible] = useState(false);
  const [jobNatureSelected, setJobNatureSelected] = useState("");

  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState([]);
  const [newWorkLocation, setNewWorkLocation] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [tempSelected, setTempSelected] = useState([]);
  const [workTypevisible, setWorkTypeVisible] = useState(false);
  const [statusVisible, setStatusVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const [workingDaysVisible, setWorkingDaysVisible] = useState(false);
  const [selectedWorkingDays, setSelectedWorkingDays] = useState("");
  const [selectedCategories, setSelectedCategories] = useState("");
  const [jobCategoryOptions, setJobCategoryOptions] = useState([]);
  const [userCatergoryvisible, setUserCatergoryVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState(null);
  const [backendJobs, setBackendJobs] = useState([]);
  const [postDetails, setPostDetails] = useState([]);
  const [loginUserId, setLoginUserId] = useState(null);
  const [answers, setAnswers] = useState("");
  const [isApplied, setIsApplied] = useState({});
  const [savedJobMap, setSavedJobMap] = useState({});
  const [isSaved, setIsSaved] = useState({});
  const [jobLoading, setJobLoading] = useState(true);
  const [jobDetailsLoading, setJobDetailsLoading] = useState(false);
  const [tempStatus, setTempStatus] = useState(selectedStatus);
  const [tempWorkingDays, setTempWorkingDays] = useState("");
  const [tempTypes, setTempTypes] = useState([]);
  const [tempCategories, setTempCategories] = useState([]);
  const [appliedDates, setAppliedDates] = useState({});
  const [fName, setFname] = useState("");
  const [lName, setLname] = useState("");

  const [activeFilters, setActiveFilters] = useState({
    jobNature: false,
    salary: false,
    status: false,
    workingDays: false,
    location: false,
    workType: false,
    category: false,
  });
  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

  useEffect(() => {
    setActiveFilters({
      jobNature: !!jobNatureSelected,
      salary: !!selectedSort,
      status: !!selectedStatus,
      workingDays: !!selectedWorkingDays,
      location: selected.length > 0,
      workType: selectedTypes.length > 0,
      category: selectedCategories.length > 0,
    });
  }, [
    jobNatureSelected,
    selectedSort,
    selectedStatus,
    selectedWorkingDays,
    selected,
    selectedTypes,
    selectedCategories,
  ]);

  useEffect(() => {
    document.title = "CareerFast | Find Jobs";
  }, []);

  useEffect(() => {
    const allCities = Object.keys(cities).map((city) => ({
      label: city,
      value: city,
      country: cities[city].country,
    }));

    console.log("allCities", allCities);
    setNewWorkLocation(allCities);
  }, []);

  useEffect(() => {
    fetchJobs();
    getJobCategoryDataTypes();
  }, [
    selectedSort,
    selectedCategories,
    selectedTypes,
    selected,
    selectedWorkingDays,
    selectedStatus,
    jobNatureSelected,
    isApplied,
  ]);

  useEffect(() => {
    if (backendJobs.length > 0 && !postDetails.length) {
      const firstJob = transformJob(backendJobs[0]);
      setPostDetails([firstJob]);
      checkIsJobAppliedData(firstJob.id);
    }
  }, [backendJobs]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("loginDetails");
      console.log("login details", stored);
      if (stored) {
        const loginDetails = JSON.parse(stored);
        setLoginUserId(loginDetails.id);
        setFname(loginDetails.first_name);
        setLname(loginDetails.last_name);
      }
    } catch (error) {
      console.error("Invalid JSON in localStorage", error);
    }
  }, []);

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
      const response = await getJobPosts(payload);
      console.log("getJobPosts response", response);
      const jobs = response?.data?.data?.data;

      if (Array.isArray(jobs)) {
        setBackendJobs(jobs);
      } else {
        console.warn("Unexpected job data format", response);
      }
    } catch (error) {
      console.error("getJobPosts error", error);
    } finally {
      setTimeout(() => {
        checkIsJobAppliedData();
        setJobLoading(false);
      }, 300);
    }
  };

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

  const checkIsJobSavedData = async (postId) => {
    if (!loginUserId || !postId) return;

    if (isSaved[postId] !== undefined) return;

    const payload = {
      user_id: loginUserId,
      job_post_id: postId,
    };

    try {
      const response = await checkIsJobSaved(payload);
      setIsSaved((prev) => ({
        ...prev,
        [postId]: response?.data?.data || false,
      }));
    } catch (error) {
      console.log("is saved error", error);
      setIsSaved((prev) => ({
        ...prev,
        [postId]: false,
      }));
    }
  };


  useEffect(() => {
    if (postDetails.length > 0) {
      const jobId = postDetails[0]?.id;
      if (jobId) {
        checkIsJobSavedData(jobId);
      }
    }
  }, [postDetails]);

  const handleWishlistToggle = async (jobId) => {
    try {
      const currentlySaved = isSaved[jobId];

      if (currentlySaved) {
        await removeSavedJobsData(jobId);
        CommonToaster("Removed from wishlist 💔", "error");
      } else {
        await saveJobPostData(jobId);
        CommonToaster("Added to wishlist ❤️", "success");
      }

      setIsSaved((prev) => ({
        ...prev,
        [jobId]: !currentlySaved,
      }));
    } catch (error) {
      console.error("Wishlist toggle failed:", error);
      CommonToaster("Failed to update wishlist", "error");
    }
  };

  const saveJobPostData = async (jobId) => {
    if (!loginUserId || !jobId) return;

    const payload = {
      user_id: loginUserId,
      job_post_id: jobId,
    };

    try {
      const response = await saveJobPost(payload);

      if (response?.data?.data?.id) {
        setSavedJobMap((prev) => ({
          ...prev,
          [jobId]: response.data.data.id,
        }));
      }

      return response;
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    if (loginUserId) {
      getSavedJobsData();
    }
  }, [loginUserId]);

  const getSavedJobsData = async () => {
    try {
      const response = await getSavedJobs({ user_id: loginUserId });
      const savedJobs = response?.data?.data || [];

      const savedJobIdsMap = {};
      savedJobs.forEach((job) => {
        savedJobIdsMap[job.job_post_id] = true;
      });

      setIsSaved(savedJobIdsMap);
      const jobMap = {};
      savedJobs.forEach((job) => {
        jobMap[job.job_post_id] = job.id;
      });
      setSavedJobMap(jobMap);
    } catch (error) {
      console.log("Get saved job error", error);
    }
  };

  const removeSavedJobsData = async (jobId) => {
    try {
      const savedJobId = savedJobMap[jobId];

      if (!savedJobId) {
        const response = await getSavedJobs({ user_id: loginUserId });
        const savedJobs = response?.data?.data || [];

        const jobToRemove = savedJobs.find((job) => job.job_post_id === jobId);
        if (jobToRemove) {
          await removeSavedJobs({ id: jobToRemove.id });
        } else {
          throw new Error("Saved job not found");
        }
      } else {
        await removeSavedJobs({ id: savedJobId });
      }

      return true;
    } catch (error) {
      console.error("Remove saved job error:", error);
      throw error;
    }
  };

  const getJobCategoryDataTypes = async () => {
    try {
      const response = await getJobCategoryData();
      const jobCategoryFormatted =
        response?.data?.data?.map((item) => ({
          label: item.category_name,
          value: item.category_name,
        })) || [];
      setJobCategoryOptions(jobCategoryFormatted);
    } catch (error) {
      console.log("job category error", error);
    }
  };

  const transformJob = (job) => {
    const postedDate = new Date(job.created_at);
    const today = new Date();
    const timeDiff = today - postedDate;
    const daysPassed = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    const totalActiveDays = 15;
    const daysLeft = totalActiveDays - daysPassed;

    return {
      id: job.id,
      title: job.job_title,
      company: job.company_name,
      benefits: job.benefits,
      logo: job.company_logo,
      created_date: job.created_at,
      job_description: job.job_description,
      openings: job.openings,
      postedDate,
      working_days: job.working_days,
      daysLeft: daysLeft >= 0 ? `${daysLeft} days left` : "Expired",
      level: job.experience_type,
      date_posted: job.date_posted,
      salary:
        job.salary_type === "Fixed"
          ? `$${job.min_salary || "N/A"}`
          : job.salary_type === "Range"
            ? `$${job.min_salary || "N/A"} - $${job.max_salary || "N/A"}`
            : "Negotiable",
      location: `${job.workplace_type}${job.work_location ? ` • ${job.work_location}` : ""
        }`,
      diversity_hiring: job.diversity_hiring,
      job_category: job.job_category,
      type: job.job_nature,
      premium: true,
      urgent: false,
      skills: job.skills,
      eligibility: job.experience_required?.join(", "),
      status: daysLeft >= 0 ? "Live" : "Expired",
      questions: job.questions?.map((q) => q.question) || [],
      questions_with_ids:
        job.questions?.map((q) => ({
          id: q.id,
          question: q.question,
          isrequired: q.isrequired,
        })) || [],
    };
  };

  const handleShare = (job) => {
    const jobLink = `${window.location.origin}/job-details/${job.id}`;

    if (navigator.share) {
      navigator
        .share({
          title: job.title,
          text: `Check out this job at ${job.company}!`,
          url: jobLink,
        })
        .then(() => console.log("Share successful"))
        .catch((err) => console.error("Share failed:", err));
    } else {
      navigator.clipboard.writeText(jobLink).then(() => {
        alert("Job link copied to clipboard!");
      });
    }
  };

  const handleCopy = (job) => {
    const jobUrl = `${window.location.origin}/job-details/${job.id}`;

    navigator.clipboard
      .writeText(jobUrl)
      .then(() => {
        message.success("Job link copied to clipboard!");
      })
      .catch(() => {
        message.error("Failed to copy job link");
      });
  };

  useEffect(() => {
    try {
      const storedAppliedDates = localStorage.getItem("appliedDates");
      if (storedAppliedDates) {
        setAppliedDates(JSON.parse(storedAppliedDates));
      }
    } catch (error) {
      console.error("Error loading applied dates from localStorage", error);
    }
  }, []);

  // Save applied dates to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("appliedDates", JSON.stringify(appliedDates));
  }, [appliedDates]);

  const applyForJobData = async () => {
    const token = localStorage.getItem("AccessToken");
    if (!token) {
      message.error("Please login before applying.");
      return;
    }

    const jobId = postDetails[0]?.id;
    const questionsWithIds = postDetails[0]?.questions_with_ids || [];

    const missingRequired = questionsWithIds.some(
      (q, index) => q.isrequired && !answers[index]?.trim()
    );

    if (missingRequired) {
      message.warning("Please answer all required questions before applying.");
      return;
    }

    const structuredAnswers = questionsWithIds.map((q, index) => ({
      questionId: q.id,
      answer: answers[index] || "",
    }));

    const payload = {
      postId: jobId,
      userId: loginUserId,
      answers: structuredAnswers,
    };

    try {
      // 1️⃣ Save application in DB
      const response = await applyForJob(payload, token);
      console.log("apply jobs", response);

      setIsApplied((prev) => ({
        ...prev,
        [jobId]: true,
      }));

      const appliedDate = response.data.appliedJob.created_at;
      setAppliedDates((prev) => ({
        ...prev,
        [jobId]: appliedDate,
      }));

      // 2️⃣ Notify recruiter (backend will ONLY push to recruiter now)
      const notifyResponse = await userApplyJob(payload);

      if (notifyResponse.data.success) {
        // ✅ Candidate gets confirmation via toast (not push)
        message.success("Application submitted! Recruiter has been notified 🚀");
      } else {
        message.warning(notifyResponse.data.message);
      }

      setOpenApplyNow(false);
    } catch (error) {
      console.error("apply jobs error", error);
      message.error("Error while applying for the job");
    }
  };


  const showDrawer = async () => {
    const jobId = postDetails[0]?.id;

    if (postDetails[0]?.questions?.length > 0) {
      // If questions exist, show the drawer
      setOpenApplyNow(true);
    } else {
      // No questions, directly apply
      try {
        const token = localStorage.getItem("AccessToken");
        if (!token) {
          message.error("Please login before applying.");
          return;
        }

        // 1️⃣ Store applied job in DB
        const payload = {
          postId: jobId,
          userId: loginUserId,
          answers: [], // ✅ no questions → empty answers
        };
        const response = await applyForJob(payload, token);
        console.log("applyForJob", response);

        // Update state
        setIsApplied((prev) => ({ ...prev, [jobId]: true }));
        const appliedDate = response.data.appliedJob.created_at;
        setAppliedDates((prev) => ({
          ...prev,
          [jobId]: appliedDate,
        }));

        // 2️⃣ Notify recruiter
        const notifyResponse = await userApplyJob({
          postId: jobId,
          userId: loginUserId,
          answers: [], // ✅ empty array instead of structuredAnswers
        });

        if (notifyResponse.data.success) {
          message.success("Applied successfully! Recruiter has been notified.");
        } else {
          message.warning(notifyResponse.data.message);
        }
      } catch (error) {
        console.error("Apply error:", error);
        message.error("Error while applying for job.");
      }
    }
  };


  const onClose = () => {
    setOpenApplyNow(false);
    setAnswers("");
  };

  const handleJobNatureChange = (checkedValue) => {
    setJobNatureSelected(checkedValue);
  };

  const handleJobNatureClear = () => {
    setJobNatureSelected("");
    fetchJobs();
    setJobNatureVisible(false);
  };


  const dropdownItems = () => (
    <div style={{ padding: 16, width: 220, background: "#fff" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <strong>Job Nature</strong>
        <a onClick={handleJobNatureClear} style={{ color: "#f5222d" }}>
          Clear
        </a>
      </div>
      <div>
        <Radio.Group
          className="custom-radio"
          onChange={(e) => handleJobNatureChange(e.target.value)}
          value={jobNatureSelected}
          style={{ display: "flex", flexDirection: "column", gap: 0 }}
        >
          {jobNature.map((type) => (
            <Radio key={type} value={type} style={{ marginBottom: 8 }}>
              {type}
            </Radio>
          ))}
        </Radio.Group>
      </div>
      <Divider style={{ margin: "12px 0" }} />
    </div>
  );

  const JobCard = ({ job }) => (
    <>
      {jobLoading ? (
        <Skeleton active />
      ) : (
        <Card
          className="premium-job-card"
          onClick={() => handleClickedjob(job)}
        >
          <div className="premium-content">
            <div className="premium-headers">
              <img src={job.logo} alt={job.company} className="premium-logo" />
              <div className="premium-title-section">
                <div className="premium-job-titles">
                  <h3 className="premium-titles">{job.title}</h3>
                  <span
                    className={
                      job.status === "Live"
                        ? "status-badge"
                        : job.status === "Expired"
                          ? "status-badge-red"
                          : ""
                    }
                  >
                    {job.status}
                  </span>
                </div>

                <div className="premium-company">({job.company})</div>
              </div>
            </div>

            <div className="premium-details">
              <span className="premium-detail-item">
                <ClockCircleOutlined />
                {job.daysLeft}
              </span>
              <span className="premium-detail-item">
                <EnvironmentOutlined />
                {job.location}
              </span>
              <span className="premium-detail-item">Salary: {job.salary}</span>
            </div>

            <div className="premium-skills">
              {job.skills.map((skill, index) => (
                <span key={skill} className="premium-skill">
                  {skill}
                </span>
              ))}
            </div>

            <div className="premium-footer">
              <span className="premium-level">
                {job.level ? <CrownFilled /> : <ThunderboltFilled />}
                {job.level}
              </span>
              <span
                className={
                  job.type === "Job"
                    ? "premium-badges"
                    : job.type === "Internship"
                      ? "regular-badge"
                      : "urgent-badge"
                }
              >
                {job.type}
              </span>
            </div>
          </div>
        </Card>
      )}
    </>
  );

  const handleClickedjob = (item) => {
    let arr = [];
    arr.push(item);
    setPostDetails(arr);
    checkIsJobAppliedData(item.id);
    setJobLoading(false);
    setJobDetailsLoading(true);
    const timer = setTimeout(() => {
      setJobDetailsLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  };

  const renderLocation = () => {
    const applyLocationFilter = () => {
      setSelected(tempSelected); // Commit UI choice
      console.log("Selected Locations:", tempSelected);
      setVisible(false);
    };

    // Clear filter
    const handleLocationClear = () => {
      setTempSelected([]);
      setSelected([]);
      setVisible(false);
    };
    return (
      <div
        className="allCities"
        style={{ width: 300, padding: 16, background: "#fff" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <Text strong>Location</Text>
          <Button type="link" size="small" danger onClick={handleLocationClear}>
            Clear
          </Button>
        </div>
        <CommonSelectField
          showSearch
          allowClear
          style={{ width: "100%" }}
          placeholder="Select location(s)"
          value={tempSelected}
          onChange={(values) => setTempSelected(values)}
          optionLabelProp="label"
          optionFilterProp="label"
          options={newWorkLocation.map((item) => ({
            value: item.value,
            label: item.label,
            customLabel: <span>{item.label}</span>,
          }))}
        />
        <div style={{ textAlign: "right", paddingTop: 15 }}>
          <Button
            type="primary"
            onClick={applyLocationFilter}
            className="apply_filter"
            shape="round"
          >
            Apply Filter →
          </Button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (statusVisible) {
      return;
    }
  }, [tempStatus, statusVisible]);

  const handleStatusApply = () => {
    setSelectedStatus(tempStatus);
    setStatusVisible(false);
  };

  const handleStatusClear = () => {
    setTempStatus(null);
    setSelectedStatus(null);
    setStatusVisible(false);
  };

  const renderStatus = () => {
    return (
      <div style={{ padding: 16, width: 220, background: "#fff" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <strong>Status</strong>
          <a onClick={handleStatusClear} style={{ color: "#f5222d" }}>
            Clear
          </a>
        </div>

        <Radio.Group
          className="custom-radio"
          onChange={(e) => setTempStatus(e.target.value)}
          value={tempStatus || selectedStatus} // Use tempStatus if available, otherwise selectedStatus
          style={{ display: "flex", flexDirection: "column", gap: 8 }}
        >
          <Radio value="Live">Live</Radio>
          <Radio value="Expired">Expired</Radio>
        </Radio.Group>

        <Divider style={{ margin: "12px 0" }} />

        <Button
          className="apply_filter"
          type="primary"
          shape="round"
          block
          onClick={handleStatusApply}
        >
          Apply Filter
        </Button>
      </div>
    );
  };

  const renderWorkingDays = () => {
    const handleWorkingDaysClear = () => {
      setTempWorkingDays("");
      setSelectedWorkingDays("");
      fetchJobs();
      setWorkingDaysVisible(false);
    };

    const handleWorkingDaysApply = () => {
      setSelectedWorkingDays(tempWorkingDays);
      setWorkingDaysVisible(false);
    };

    return (
      <div style={{ padding: 16, width: 220, background: "#fff" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <strong>Working Days</strong>
          <a onClick={handleWorkingDaysClear} style={{ color: "#f5222d" }}>
            Clear
          </a>
        </div>

        <Radio.Group
          className="custom-radio"
          onChange={(e) => setTempWorkingDays(e.target.value)}
          value={tempWorkingDays}
          style={{ display: "flex", flexDirection: "column", gap: 8 }}
        >
          <Radio value="5 Working days">5 Working days</Radio>
          <Radio value="6 Working days">6 Working days</Radio>
        </Radio.Group>

        <Divider style={{ margin: "12px 0" }} />

        <Button
          className="apply_filter"
          type="primary"
          shape="round"
          block
          onClick={handleWorkingDaysApply}
        >
          Apply Filter
        </Button>
      </div>
    );
  };

  const handleTempCheckboxChange = (type) => {
    setTempTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleClear = () => {
    setTempTypes([]);
    setSelectedTypes([]);
    setWorkTypeVisible(false);
  };

  useEffect(() => {
    if (selectedTypes.length > 0) {
      fetchJobs(selectedTypes);
    }
  }, [selectedTypes]);

  const handleWorkTypeFilter = () => {
    setSelectedTypes([...tempTypes]);
    setWorkTypeVisible(false);
  };

  const dropdownContent = () => (
    <div style={{ padding: 16, width: 220, background: "#fff" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <strong>Type</strong>
        <a onClick={handleClear} style={{ color: "#f5222d" }}>
          Clear
        </a>
      </div>
      <div>
        {workTypes.map((type) => (
          <div key={type} style={{ marginBottom: 8 }}>
            <Checkbox
              checked={tempTypes.includes(type)}
              onChange={() => handleTempCheckboxChange(type)}
            >
              {type}
            </Checkbox>
          </div>
        ))}
      </div>
      <Divider style={{ margin: "12px 0" }} />
      <Button
        className="apply_filter"
        type="primary"
        shape="round"
        block
        onClick={handleWorkTypeFilter}
      >
        Apply Filter
      </Button>
    </div>
  );

  // user types

  const handleUserTypeClear = () => {
    setSelectedType(null);
  };

  const handleUserTypeApply = () => {
    console.log("Selected User Type:", selectedType);
    fetchJobs();
  };

  const userType = (
    <div style={{ padding: 16, width: 220, background: "#fff" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <strong>User Type</strong>
        <a onClick={handleUserTypeClear} style={{ color: "#f5222d" }}>
          Clear
        </a>
      </div>
      <Radio.Group
        className="custom-radio"
        onChange={(e) => setSelectedType(e.target.value)}
        value={selectedType}
        style={{ display: "flex", flexDirection: "column", gap: 8 }}
      >
        {userTypes.map((type) => (
          <Radio key={type} value={type}>
            {type}
          </Radio>
        ))}
      </Radio.Group>
      <Divider style={{ margin: "12px 0" }} />
      <Button
        className="apply_filter"
        type="primary"
        shape="round"
        block
        onClick={handleUserTypeApply}
      >
        Apply Filter
      </Button>
    </div>
  );

  const handleUserCategoryClear = () => {
    setTempCategories([]);
    setSelectedCategories([]);
    fetchJobs();
    setUserCatergoryVisible(false);
  };

  const handleUserCategoryApply = () => {
    setSelectedCategories(tempCategories);
    setUserCatergoryVisible(false);
  };


  const userCatergory = () => (
    <div style={{ padding: 16, width: 260, background: "#fff" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <strong>Catergory</strong>
        <a onClick={handleUserCategoryClear} style={{ color: "#f5222d" }}>
          Clear
        </a>
      </div>
      <Checkbox.Group
        options={jobCategoryOptions}
        value={tempCategories}
        onChange={setTempCategories}
        style={{
          gap: 8,
          maxHeight: "200px",
          overflowY: "scroll",
        }}
      />
      <Divider style={{ margin: "12px 0" }} />
      <Button
        type="primary"
        shape="round"
        className="apply_filter"
        block
        onClick={handleUserCategoryApply}
      >
        Apply Filter
      </Button>
    </div>
  );

  // filter
  const clearSort = () => {
    setSelectedSort(null);
    setTimeout(() => {
      fetchJobs();
    }, 0);
  };

  return (
    <>
      <Header />
      <section
        className="job_filter"
        style={{
          padding: "10px 60px 48px 60px",
          background:
            "linear-gradient(135deg, rgb(247 247 247) 0%, rgb(244 238 255) 100%)",
        }}
      >
        <div
          className="job-filter-topbar"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 22,
            padding: "16px 24px",
            borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
            backgroundColor: "#fff",
            flexWrap: "wrap",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
            borderRadius: "12px 12px 0 0",
            marginBottom: 25,
          }}
        >
          {/* Primary Filter Dropdown */}
          <Dropdown
            popupRender={dropdownItems}
            trigger={["click"]}
            open={jobNatureVisible}
            onOpenChange={(visible) => setJobNatureVisible(visible)}
            placement="bottomLeft"
          >
            <Badge
              count={activeFilters.jobNature ? "•" : 0}
              offset={[-6, 2]}
              color="green"
            >
              <Button
                className="job-filter-job"
                shape="round"
                type={activeFilters.jobNature ? "primary" : "default"}
                onClick={() => setJobNatureVisible(!jobNatureVisible)}
              >
                <Space>
                  <span style={{ fontWeight: 500, color: "#fff" }}>Jobs</span>
                  <DownOutlined style={{ fontSize: 12, color: "#fff" }} />
                </Space>
              </Button>
            </Badge>
          </Dropdown>

          {/* Salary Filter */}
          <Badge
            count={activeFilters.salary ? "•" : 0}
            offset={[-4, 2]}
            color="green"
          >
            {selectedSort ? (
              <Button
                className="salaryFilterBtn"
                shape="round"
                type="primary"
                style={{
                  border: "1px solid #4f46e5",
                  backgroundColor: "#f3f2ff",
                  color: "#6a5cff",
                  fontWeight: 500,
                  padding: "0 12px",
                  height: 36,
                }}
                onClick={clearSort}
              >
                <Space>
                  {selectedSort === "highToLow"
                    ? "Salary (High to Low)"
                    : "Salary (Low to High)"}
                  <CloseOutlined style={{ fontSize: 12 }} />
                </Space>
              </Button>
            ) : (
              <CommonSelectField
                style={{
                  border: activeFilters.salary
                    ? "1px solid #4f46e5"
                    : "1px solid rgba(0, 0, 0, 0.08)",
                  background: activeFilters.salary ? "#f0f7ff" : "#fff",
                  padding: "0 5px",
                  height: 36,
                  borderRadius: 20,
                  color: "#2d3748",
                  fontWeight: 500,
                  marginBottom: 0,
                }}
                onChange={(value) => setSelectedSort(value)}
                placeholder="Select Salary Filter"
                options={[
                  {
                    id: 1,
                    label: "Salary (High to Low)",
                    value: "highToLow",
                  },
                  {
                    id: 2,
                    label: "Salary (Low to High)",
                    value: "lowToHigh",
                  },
                ]}
                showSearch={true}
              />
            )}
          </Badge>

          {/* Status Filter */}
          <Dropdown
            popupRender={renderStatus}
            trigger={["click"]}
            open={statusVisible}
            onOpenChange={setStatusVisible}
          >
            <Badge
              count={activeFilters.status ? "•" : 0}
              offset={[-6, 2]}
              color="green"
            >
              <Button
                shape="round"
                style={{
                  border: activeFilters.status
                    ? "1px solid #4f46e5"
                    : "1px solid rgba(0, 0, 0, 0.08)",
                  background: activeFilters.status ? "#f3f2ff" : "#fff",
                  padding: "0 16px",
                  height: 36,
                  color: activeFilters.status ? "#6a5cff" : "#2d3748",
                  fontWeight: 500,
                }}
              >
                <Space>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 3 }}
                  >
                    <HiOutlineStatusOnline /> Status
                  </div>
                  <DownOutlined
                    style={{
                      fontSize: 12,
                      color: activeFilters.status ? "#6a5cff" : "#2d3748",
                    }}
                  />
                </Space>
              </Button>
            </Badge>
          </Dropdown>

          {/* Working days Filter */}
          <Dropdown
            popupRender={renderWorkingDays}
            trigger={["click"]}
            open={workingDaysVisible}
            onOpenChange={(flag) => setWorkingDaysVisible(flag)}
          >
            <Badge
              count={activeFilters.workingDays ? "•" : 0}
              offset={[-6, 2]}
              color="green"
            >
              <Button
                shape="round"
                style={{
                  border: activeFilters.workingDays
                    ? "1px solid #4f46e5"
                    : "1px solid rgba(0, 0, 0, 0.08)",
                  background: activeFilters.workingDays ? "#f3f2ff" : "#fff",
                  padding: "0 16px",
                  height: 36,
                  color: activeFilters.workingDays ? "#6a5cff" : "#2d3748",
                  fontWeight: 500,
                }}
              >
                <Space>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 3 }}
                  >
                    <LuCalendarDays /> Working Days
                  </div>
                  <DownOutlined
                    style={{
                      fontSize: 12,
                      color: activeFilters.workingDays ? "#6a5cff" : "#2d3748",
                    }}
                  />
                </Space>
              </Button>
            </Badge>
          </Dropdown>

          {/* Location Filter */}
          <Dropdown
            popupRender={renderLocation}
            trigger={["click"]}
            open={visible}
            onOpenChange={(flag) => setVisible(flag)}
          >
            <Badge
              count={activeFilters.location ? "•" : 0}
              offset={[-6, 2]}
              color="green"
            >
              <Button
                shape="round"
                style={{
                  border: activeFilters.location
                    ? "1px solid #4f46e5"
                    : "1px solid rgba(0, 0, 0, 0.08)",
                  background: activeFilters.location ? "#f3f2ff" : "#fff",
                  padding: "0 16px",
                  height: 36,
                  color: activeFilters.location ? "#6a5cff" : "#2d3748",
                  fontWeight: 500,
                }}
              >
                <Space>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 3 }}
                  >
                    <GrLocation /> Location
                  </div>
                  <DownOutlined
                    style={{
                      fontSize: 12,
                      color: activeFilters.location ? "#6a5cff" : "#2d3748",
                    }}
                  />
                </Space>
              </Button>
            </Badge>
          </Dropdown>

          {/* Work Type Filter */}
          <Dropdown
            popupRender={dropdownContent}
            trigger={["click"]}
            open={workTypevisible}
            onOpenChange={(flag) => setWorkTypeVisible(flag)}
          >
            <Badge
              count={activeFilters.workType ? "•" : 0}
              offset={[-6, 2]}
              color="green"
            >
              <Button
                shape="round"
                style={{
                  border: activeFilters.workType
                    ? "1px solid #4f46e5"
                    : "1px solid rgba(0, 0, 0, 0.08)",
                  background: activeFilters.workType ? "#f3f2ff" : "#fff",
                  padding: "0 16px",
                  height: 36,
                  color: activeFilters.workType ? "#6a5cff" : "#2d3748",
                  fontWeight: 500,
                }}
              >
                <Space>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 3 }}
                  >
                    <CgWorkAlt /> Work Type
                  </div>
                  <DownOutlined
                    style={{
                      fontSize: 12,
                      color: activeFilters.workType ? "#6a5cff" : "#2d3748",
                    }}
                  />
                </Space>
              </Button>
            </Badge>
          </Dropdown>

          {/*Category */}
          <Dropdown
            popupRender={userCatergory}
            trigger={["click"]}
            open={userCatergoryvisible}
            onOpenChange={(flag) => setUserCatergoryVisible(flag)}
          >
            <Badge
              count={activeFilters.category ? "•" : 0}
              offset={[-6, 2]}
              color="green"
            >
              <Button
                shape="round"
                style={{
                  border: activeFilters.category
                    ? "1px solid #4f46e5"
                    : "1px solid rgba(0, 0, 0, 0.08)",
                  background: activeFilters.category ? "#f3f2ff" : "#fff",
                  padding: "0 16px",
                  height: 36,
                  color: activeFilters.category ? "#6a5cff" : "#2d3748",
                  fontWeight: 500,
                }}
              >
                <Space>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 3 }}
                  >
                    <BiCategoryAlt /> Category
                  </div>
                  <DownOutlined
                    style={{
                      fontSize: 12,
                      color: activeFilters.category ? "#6a5cff" : "#2d3748",
                    }}
                  />
                </Space>
              </Button>
            </Badge>
          </Dropdown>
          {/* Active Filters Indicator */}
          {activeFilterCount > 0 && (
            <div
              style={{
                marginLeft: "auto",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Badge
                count={activeFilterCount}
                size="small"
                style={{ backgroundColor: "#52c41a" }}
              >
                <FilterOutlined
                  style={{ color: "#52c41a", fontSize: "16px" }}
                />
              </Badge>
              <span
                style={{ marginLeft: "8px", fontSize: "14px", color: "#666" }}
              >
                filter{activeFilterCount !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        <div>
          <Row gutter={32}>
            <Col className="job_filter_left" lg={7} xs={24} md={8}>
              {jobLoading ? (
                // 🔹 Show skeleton placeholders while loading
                <Space direction="vertical" size={24} style={{ width: "100%" }}>
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} active />
                  ))}
                </Space>
              ) : backendJobs.length === 0 ? (
                // 🔹 Show "No data" only AFTER loading finishes
                <Empty description="No jobs found" />
              ) : (
                // 🔹 Show job cards after data is loaded
                <Space direction="vertical" size={24} style={{ width: "100%" }}>
                  {backendJobs.map((job) => (
                    <JobCard key={job.id} job={transformJob(job)} />
                  ))}
                </Space>
              )}
            </Col>


            <Col className="job_filter_left" lg={17} xs={24} md={16}>
              <section className="premium-job-details">
                {postDetails.map((job) => (
                  <React.Fragment key={job.id}>
                    {jobDetailsLoading ? (
                      <Skeleton active />
                    ) : (
                      <>
                        <div className="premium-job-card">
                          <div className="">
                            <div className="premium-border"></div>
                            <div className="premium-indicator">
                              <span
                                className={
                                  job.status === "Live"
                                    ? "status-badge"
                                    : job.status === "Expired"
                                      ? "status-badge-red"
                                      : ""
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
                                <span className="meta-text">
                                  {job.location}
                                </span>
                              </div>

                              <div className="job-meta-item">
                                <FaRegCalendarAlt className="meta-icon premium-icon" />
                                <span className="meta-text">
                                  Posted: {job.date_posted}
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
                              <div className="side_job_action_buttons">
                                <div className="side_job_action_icons">
                                  <span
                                    className="side_job_action_icon"
                                    onClick={() => handleWishlistToggle(job.id)}
                                  >
                                    {isSaved[job.id] ? (
                                      <FaHeart
                                        size={20}
                                        className="side_job_action_icon heart active"
                                      />
                                    ) : (
                                      <FaRegHeart
                                        size={20}
                                        className="side_job_action_icon heart"
                                      />
                                    )}
                                  </span>
                                  <span className="side_job_action_icon">
                                    <IoMdCalendar
                                      size={20}
                                      className="side_job_action_icon calendar"
                                    />
                                  </span>
                                </div>
                                <div style={{ display: "flex", gap: 10 }}>
                                  <Tooltip title="Copy link">
                                    <span className="side_job_action_icon">
                                      <FaLink
                                        size={20}
                                        onClick={() => handleCopy(job)}
                                      />
                                    </span>
                                  </Tooltip>
                                  <span className="side_job_action_icon">
                                    <Tooltip title="Share link">
                                      <IoIosShareAlt
                                        size={20}
                                        onClick={() => handleShare(job)}
                                      />{" "}
                                    </Tooltip>
                                  </span>
                                </div>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                {isApplied[job.id] === true ? (
                                  <Tooltip
                                    title={
                                      appliedDates[job.id]
                                        ? `Applied on ${new Date(
                                          appliedDates[job.id]
                                        ).toLocaleDateString("en-US", {
                                          month: "short",
                                          day: "numeric",
                                          year: "numeric",
                                        })}`
                                        : "Applied recently"
                                    }
                                    placement="top"
                                    arrow={true}
                                    overlayInnerStyle={{
                                      padding: "6px 10px",
                                      borderRadius: "8px",
                                      fontSize: "13px",
                                      fontWeight: 500,
                                      background: "#111827",
                                      color: "#fff",
                                    }}
                                  >
                                    <div className="side_job_applied_badge tooltip-badge">
                                      <FaCheckCircle className="applied-icon" />
                                      <span className="applied-text">
                                        Applied
                                      </span>
                                    </div>
                                  </Tooltip>
                                ) : (
                                  <button
                                    onClick={showDrawer}
                                    disabled={job.status !== "Live"}
                                    className={
                                      job.status === "Live"
                                        ? "side_job_apply_button primary"
                                        : "side_job_apply_button disabled"
                                    }
                                  >
                                    Apply Now
                                  </button>
                                )}
                              </div>
                              <Drawer
                                size="default"
                                title="Apply Now"
                                closable={{ "aria-label": "Close Button" }}
                                onClose={onClose}
                                open={openApplyNow}
                              >
                                <p>
                                  Hi {fName} {lName}! We request you to take a
                                  couple of minutes to update your profile.
                                </p>

                                {/* ✅ Show applied date if available */}
                                {postDetails[0]?.applied_at && (
                                  <p
                                    style={{
                                      marginTop: 12,
                                      fontWeight: "500",
                                      color: "#555",
                                    }}
                                  >
                                    Applied on:{" "}
                                    {new Date(
                                      postDetails[0].applied_at
                                    ).toLocaleDateString("en-IN", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </p>
                                )}

                                {postDetails[0]?.questions?.length > 0 && (
                                  <div className="job-questions-section">
                                    <h4>Application Questions</h4>
                                    {postDetails[0].questions.map(
                                      (question, index) => (
                                        <div
                                          key={question.id || index}
                                          className="question-item"
                                        >
                                          <p>{question}</p>
                                          <Input.TextArea
                                            rows={3}
                                            placeholder="Your answer..."
                                            className="premium-input"
                                            value={answers[index] || ""}
                                            onChange={(e) => {
                                              const newAnswers = [...answers];
                                              newAnswers[index] =
                                                e.target.value;
                                              setAnswers(newAnswers);
                                            }}
                                          />
                                        </div>
                                      )
                                    )}
                                    <div>
                                      <button
                                        className="premium-apply"
                                        onClick={applyForJobData}
                                      >
                                        Submit
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </Drawer>
                            </div>

                            <div className="side_job_eligibility">
                              <h4 className="side_job_eligibility_title">
                                Eligibility
                              </h4>
                              <div className="side_job_eligibility_details">
                                <span className="side_job_eligibility_item">
                                  <MdOutlineSchool /> {job.level}
                                </span>
                                <span className="side_job_eligibility_item">
                                  <MdOutlineWorkOutline /> {job.eligibility}
                                </span>
                                <span className="side_job_eligibility_item">
                                  <FaTransgender />{" "}
                                  {job.diversity_hiring.map(
                                    (diversity_hiring, index) => (
                                      <span key={diversity_hiring}>
                                        {diversity_hiring}
                                        {index <
                                          job.diversity_hiring.length - 1 &&
                                          ", "}
                                      </span>
                                    )
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="section-card job-description">
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
                        </div>

                        <div className="section-card">
                          <h2 className="section-title">
                            Additional Information
                          </h2>

                          <div className="info-card">
                            <div className="info-card-content">
                              <h4>Skills Required</h4>
                              <p>
                                {job.skills.map((skill, index) => (
                                  <span key={index} className="premium-skill">
                                    {skill}
                                    {index < job.skills.length - 1 && (
                                      <span className="skill-separator">
                                        {" "}
                                        |{" "}
                                      </span>
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
                                {(job.benefits || []).map(
                                  (benefit, index, arr) => (
                                    <span key={benefit} className="premium-skill">
                                      {benefit}
                                      {index < arr.length - 1 && (
                                        <span className="separator"> | </span>
                                      )}
                                    </span>
                                  )
                                )}
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
                        </div>
                      </>
                    )}
                  </React.Fragment>
                ))}
              </section>
            </Col>
          </Row>
        </div>
      </section>
    </>
  );
}
