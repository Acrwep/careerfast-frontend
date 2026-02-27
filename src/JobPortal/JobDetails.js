import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";


import {
  Row,
  Col,
  Collapse,
  Input,
  Drawer,
  message,
  Tooltip,
  Spin,
} from "antd";
import {
  FaRegBuilding,
  FaRegCalendarAlt,
  FaMapMarkerAlt,
  FaHeart,
  FaLink,
} from "react-icons/fa";
import {
  MinusCircleFilled,
  PlusCircleFilled,
} from "@ant-design/icons";
import { FaRegHeart } from "react-icons/fa";
import { IoMdCalendar } from "react-icons/io";
import { IoIosShareAlt } from "react-icons/io";
import { CommonToaster } from "../Common/CommonToaster";
import {
  applyForJob,
  checkIsJobApplied,
  checkIsJobSaved,
  getJobPosts,
  saveJobPost,
  getSavedJobs,
  removeSavedJobs,
} from "../ApiService/action";
import { MdOutlineSchool, MdOutlineWorkOutline } from "react-icons/md";
import { FaTransgender } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import Header from "../Header/Header";
import additional1 from "../images/additional1.png";
import additional2 from "../images/additional2.png";
import additional3 from "../images/additional3.png";
import additional4 from "../images/additional4.png";
import additional5 from "../images/additional5.png";
import additional6 from "../images/additional6.png";

// ✅ Dynamically generate tab list based on job type
const getTabs = (jobType) => {
  const tabs = ["Job Description"];
  if (jobType !== "Scholarship") {
    tabs.push("Additional Informations");
  }
  tabs.push("FAQs & Discussions");
  return tabs;
};


const generateSlug = (text = "") =>
  String(text).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

// Helper function to convert currency code to symbol
const getCurrencySymbol = (currencyCode) => {
  const currencyMap = {
    'INR': '₹',
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'JPY': '¥',
    'AUD': 'A$',
    'CAD': 'C$',
  };
  return currencyMap[currencyCode] || currencyCode;
};

export default function JobDetails() {
  const [activeTab, setActiveTab] = useState("Job Description");
  const [postDetails, setPostDetails] = useState([]);
  const [backendJobs, setBackendJobs] = useState([]);
  const [appliedDates, setAppliedDates] = useState({});
  const [openApplyNow, setOpenApplyNow] = useState(false);
  const [answers, setAnswers] = useState("");
  const [loginUserId, setLoginUserId] = useState(null);
  const [isApplied, setIsApplied] = useState({});
  const [isSaved, setIsSaved] = useState({});
  const [wishlistedJobs, setWishlistedJobs] = useState({});
  const [savedJobMap, setSavedJobMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // handled by Helmet
    fetchJobs();
  }, []);

  const { slug } = useParams();
  const jobId = slug?.split("-").pop();

  useEffect(() => {
    console.log("Job ID from URL:", jobId);
  }, [jobId]);

  useEffect(() => {
    if (backendJobs.length > 0 && jobId) {
      const selectedJob = backendJobs.find(job => job.id.toString() === jobId);

      if (selectedJob) {
        setPostDetails([transformJob(selectedJob)]);
        checkIsJobAppliedData(selectedJob.id);
      } else {
        console.warn("Job not found with id:", jobId);
      }
    }
  }, [backendJobs, jobId]);

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

  useEffect(() => {
    try {
      const stored = localStorage.getItem("loginDetails");
      if (stored) {
        const loginDetails = JSON.parse(stored);
        setLoginUserId(loginDetails.id);
      }
    } catch (error) {
      console.error("Invalid JSON in localStorage", error);
    }
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    const payload = {};

    try {
      const response = await getJobPosts(payload);

      const jobs = response?.data?.data?.data;
      console.log("getJobPosts response", jobs);

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
        setLoading(false)
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
      console.log("is applied", response);
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
      logo: job.company_logo,
      created_date: job.created_at,
      job_description: job.job_description,
      benefits: job.benefits,
      openings: job.openings,
      job_category: job.job_category,
      postedDate,
      working_days: job.working_days,
      daysLeft: daysLeft >= 0 ? `${daysLeft} days left` : "Expired",
      level: job.experience_type,
      salary:
        job.salary_type === "Fixed"
          ? `${getCurrencySymbol(job.currency)}${job.min_salary || "N/A"}`
          : job.salary_type === "Range"
            ? `${getCurrencySymbol(job.currency)}${job.min_salary || "N/A"} - ${getCurrencySymbol(job.currency)}${job.max_salary || "N/A"}`
            : "Negotiable",
      location: (() => {
        try {
          const parsed = JSON.parse(job.work_location);
          const locations = Array.isArray(parsed) ? parsed.join(", ") : job.work_location;

          return `${job.workplace_type}${locations ? ` • ${locations}` : ""}`;
        } catch {
          // if not JSON, fallback safely
          return `${job.workplace_type}${job.work_location ? ` • ${job.work_location}` : ""}`;
        }
      })(),
      diversity_hiring: job.diversity_hiring,
      type: job.job_nature,
      premium: true,
      urgent: false,
      skills: job.skills,
      eligibility: job.experience_required?.join(", "),
      status: daysLeft >= 0 ? "Live" : "Expired",
      raw_location: job.work_location,
      raw_workplace_type: job.workplace_type,
      raw_experience_required: job.experience_required,
      questions: job.questions?.map((q) => q.question) || [],
      questions_with_ids:
        job.questions?.map((q) => ({
          id: q.id,
          question: q.question,
          isrequired: q.isrequired,
        })) || [],
    };
  };

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
      const response = await applyForJob(payload, token); // pass token to API helper
      console.log("apply jobs", response);
      message.success("Application submitted! Recruiter has been notified 🚀");
      setIsApplied((prev) => ({
        ...prev,
        [jobId]: true,
      }));
      const appliedDate = response.data.appliedJob.created_at;
      setAppliedDates((prev) => ({
        ...prev,
        [jobId]: appliedDate,
      }));
      setOpenApplyNow(false);

    } catch (error) {
      console.error("apply jobs error", error);
      message.error("Error while applying");
    }
  };

  const showDrawer = () => {
    if (postDetails[0]?.questions?.length > 0) {
      setOpenApplyNow(true);
    } else {
      applyForJobData();
    }
  };

  const onClose = () => {
    setOpenApplyNow(false);
    setAnswers("");
  };

  const checkIsJobSavedData = async (postId) => {
    if (!loginUserId || !postId) return;

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
      const isWishlisted = !wishlistedJobs[jobId];

      setWishlistedJobs((prev) => {
        const updated = { ...prev, [jobId]: isWishlisted };
        localStorage.setItem("wishlist", JSON.stringify(updated));
        return updated;
      });

      if (isWishlisted) {
        await saveJobPostData(jobId);
        CommonToaster("Added to wishlist ❤️", "success");
      } else {
        await removeSavedJobsData(jobId);
        CommonToaster("Removed from wishlist 💔", "error");
      }

      setIsSaved((prev) => ({
        ...prev,
        [jobId]: !prev[jobId],
      }));

      await getSavedJobsData();
    } catch (error) {
      console.error("Wishlist toggle failed:", error);
      setWishlistedJobs((prev) => {
        const updated = { ...prev, [jobId]: !prev[jobId] };
        localStorage.setItem("wishlist", JSON.stringify(updated));
        return updated;
      });
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
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getSavedJobsData = async () => {
    try {
      const response = await getSavedJobs({ user_id: loginUserId });
      const savedJobs = response?.data?.data || [];

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
      if (!savedJobId) throw new Error("Saved job ID not found");

      const response = await removeSavedJobs({ id: savedJobId });
      return response;
    } catch (error) {
      console.error("Remove saved job error:", error);
      throw error;
    }
  };

  const handleShare = (job) => {
    const safeSlug = (val) => {
      if (!val) return "";
      if (Array.isArray(val)) return generateSlug(val.join(" "));
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) return generateSlug(parsed.join(" "));
        return generateSlug(parsed);
      } catch {
        return generateSlug(val);
      }
    };

    const jobNature = generateSlug(job.type || "");
    const jobTitle = generateSlug(job.title || "");
    const companyName = generateSlug(job.company || "");
    const locationSlug = safeSlug(job.raw_location);
    const workplaceType = generateSlug(job.raw_workplace_type || "");
    const experienceType = generateSlug(job.level || "");
    const experienceRequired = safeSlug(job.raw_experience_required);

    let basePath = "/job-details";
    if (job.type === "Internship") basePath = "/internship-details";
    if (job.type === "Scholarship") basePath = "/scholarship-details";

    const jobLink = `${window.location.origin}${basePath}/${jobNature}-${jobTitle}-${companyName}-${locationSlug}-${workplaceType}-${experienceType}-${experienceRequired}-${job.id}`;

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
    const safeSlug = (val) => {
      if (!val) return "";
      if (Array.isArray(val)) return generateSlug(val.join(" "));
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) return generateSlug(parsed.join(" "));
        return generateSlug(parsed);
      } catch {
        return generateSlug(val);
      }
    };

    const jobNature = generateSlug(job.type || "");
    const jobTitle = generateSlug(job.title || "");
    const companyName = generateSlug(job.company || "");
    const locationSlug = safeSlug(job.raw_location);
    const workplaceType = generateSlug(job.raw_workplace_type || "");
    const experienceType = generateSlug(job.level || "");
    const experienceRequired = safeSlug(job.raw_experience_required);

    let basePath = "/job-details";
    if (job.type === "Internship") basePath = "/internship-details";
    if (job.type === "Scholarship") basePath = "/scholarship-details";

    const jobUrl = `${window.location.origin}${basePath}/${jobNature}-${jobTitle}-${companyName}-${locationSlug}-${workplaceType}-${experienceType}-${experienceRequired}-${job.id}`;

    navigator.clipboard
      .writeText(jobUrl)
      .then(() => {
        message.success("Job link copied to clipboard!");
      })
      .catch(() => {
        message.error("Failed to copy job link");
      });
  };

  const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;
  const items = [
    {
      key: "1",
      label: "How do I apply for this job?",
      children: (
        <p>
          To apply, click on the <b>Apply Now</b> button on this page. If the employer
          has added screening questions, you will be asked to answer them before
          submitting your application. Once submitted, your profile will be shared
          directly with the recruiter.
        </p>
      ),
    },
    {
      key: "2",
      label: "Do I need to be logged in to apply?",
      children: (
        <p>
          Yes. You must be logged in to apply for any job. Logging in allows recruiters
          to view your profile, track your application status, and contact you if you
          are shortlisted.
        </p>
      ),
    },
    {
      key: "3",
      label: "Can I apply for the same job more than once?",
      children: (
        <p>
          No. Each candidate can apply only once for a job. If you have already applied,
          the <b>Apply Now</b> button will be disabled and marked as <b>Applied</b>.
        </p>
      ),
    },
    {
      key: "4",
      label: "How can I check if my application was submitted successfully?",
      children: (
        <p>
          Once your application is submitted, you will see an <b>Applied</b> badge on
          the job page. You can also track all your applications from the
          <b> My Applications</b> section in your dashboard.
        </p>
      ),
    },
    {
      key: "5",
      label: "What does ‘Saved Job’ or ‘Wishlist’ mean?",
      children: (
        <p>
          Saving a job allows you to bookmark it for later review. Saved jobs can be
          accessed anytime from your <b>Saved Jobs</b> section without having to search
          again.
        </p>
      ),
    },
    {
      key: "6",
      label: "Who can see my application details?",
      children: (
        <p>
          Only the employer who posted the job can view your application details,
          including your profile information and answers to screening questions.
          Your data is kept secure and confidential.
        </p>
      ),
    },
    {
      key: "7",
      label: "What happens after I apply?",
      children: (
        <p>
          After applying, your profile is reviewed by the recruiter. If shortlisted,
          they may contact you via email or phone for further steps such as interviews
          or assessments.
        </p>
      ),
    },
    {
      key: "8",
      label: "Can I edit my answers after applying?",
      children: (
        <p>
          No. Once an application is submitted, answers cannot be edited. Please review
          all your responses carefully before submitting.
        </p>
      ),
    },
    {
      key: "9",
      label: "What does ‘Expired’ job status mean?",
      children: (
        <p>
          An <b>Expired</b> status means the application deadline has passed and the job
          is no longer accepting applications. You can still view the job details but
          cannot apply.
        </p>
      ),
    },
    {
      key: "10",
      label: "Is applying for jobs on CareerFast free?",
      children: (
        <p>
          Yes. Applying for jobs on CareerFast is completely free for candidates.
          There are no hidden charges for job applications.
        </p>
      ),
    },
  ];

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Job Details | CareerFast</title>
          <meta name="description" content="View job details on CareerFast." />
        </Helmet>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            background: "#fff",
          }}
        >
          <Spin size="large" tip="Loading details..." />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          {postDetails[0]
            ? `${postDetails[0].title} | ${postDetails[0].company} | CareerFast`
            : "Job Details | CareerFast"}
        </title>
        <meta
          name="description"
          content={
            postDetails[0]
              ? `Apply for ${postDetails[0].title} at ${postDetails[0].company} in ${postDetails[0].location}.`
              : "View job opportunities on CareerFast"
          }
        />
      </Helmet>

      <Header />
      <section className="premium-job-details job_filter details_page">
        <Row>
          <Col lg={24} md={24} sm={24}>
            {postDetails.map((job) => (
              <div
                key={job.id}
                style={{ padding: "40px 80px" }}
                className="premium-job-card"
              >
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
                    {job.type !== "Scholarship" && (
                      <div className="job-meta-item">
                        <FaMapMarkerAlt className="meta-icon premium-icon" />
                        <span className="meta-text">{job.location}</span>
                      </div>
                    )}
                    <div className="job-meta-item">
                      <FaRegCalendarAlt className="meta-icon premium-icon" />
                      <span className="meta-text">
                        Updated On: {job.created_date}
                      </span>
                    </div>

                    <div className="job-tags">
                      <span className="tag">{job.type}</span>
                      {job.type !== "Scholarship" && (
                        <span className="tag">{job.working_days}</span>
                      )}
                      <span className="tag">{job.salary}</span>
                    </div>
                  </div>
                </div>

                <div style={{ width: "40%" }} className="side_job_details">
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
                            style={{ cursor: "no-drop" }}
                            size={20}
                            className="side_job_action_icon calendar"
                          />
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: 10 }}>
                        <Tooltip title="Copy link">
                          <span className="side_job_action_icon">
                            <FaLink size={20} onClick={() => handleCopy(job)} />
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
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      {isApplied[job.id] === true ? (
                        <Tooltip
                          title={
                            appliedDates[job.id]
                              ? `Applied on ${new Date(appliedDates[job.id]).toLocaleDateString("en-GB")}`
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
                            <span className="applied-text">Applied</span>
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
                        Hi Santhosh! We request you to take a couple of minutes
                        to update your profile.
                      </p>

                      {postDetails[0]?.questions?.length > 0 && (
                        <div className="job-questions-section">
                          <h4>Application Questions</h4>
                          {postDetails[0]?.questions_with_ids?.map((q, index) => (
                            <div key={q.id || index} className="question-item">
                              <p>{q.question}</p>
                              <Input.TextArea
                                rows={3}
                                placeholder="Your answer..."
                                className="premium-input"
                                value={answers[index] || ""}
                                onChange={(e) => {
                                  const newAnswers = [...answers];
                                  newAnswers[index] = e.target.value;
                                  setAnswers(newAnswers);
                                }}
                              />
                            </div>
                          ))}
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
                    <h4 className="side_job_eligibility_title">Eligibility</h4>
                    <div className="side_job_eligibility_details">
                      <span className="side_job_eligibility_item">
                        <MdOutlineSchool /> {job.level}
                      </span>
                      <span className="side_job_eligibility_item">
                        <MdOutlineWorkOutline /> {job.eligibility}
                      </span>
                      <span className="side_job_eligibility_item">
                        <FaTransgender />{" "}
                        {job.diversity_hiring.map((diversity_hiring, index) => (
                          <span key={diversity_hiring}>
                            {diversity_hiring}
                            {index < job.diversity_hiring.length - 1 && ", "}
                          </span>
                        ))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Col>
        </Row>
        {postDetails.map((job) => (
          <div key={job.id} className="job-details-container">
            {/* Premium Tab Navigation */}
            <div className="tabs">
              {getTabs(job.type).map((tab) => (
                <button
                  key={tab}
                  className={`tab-button ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  <span className="tab-label">{tab}</span>
                  {activeTab === tab && <div className="active-indicator" />}
                </button>
              ))}
            </div>

            {activeTab === "Job Description" && (
              <div className="section-card job-description">
                <h2 className="section-title">Job Description</h2>
                <h6>
                  {job.company} is hiring for the role of {job.title}!
                </h6>
                <div
                  className="job-description-content"
                  dangerouslySetInnerHTML={{ __html: job.job_description }}
                />
              </div>
            )}
            {job.type !== "Scholarship" && (
              <>
                {activeTab === "Additional Informations" && (
                  <div className="job_filter">
                    <div className="section-card">
                      <h2 className="section-title">Additional Information</h2>

                      <div className="info-card">
                        <div className="info-card-content">
                          <h4>Skills Required</h4>
                          <p>
                            {job.skills.map((skill, index) => (
                              <span key={skill} className="premium-skill">
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
                          <h4>Job Benefits</h4>
                          <p>
                            {(job.benefits || []).map((benefit, index) => (
                              <span key={benefit} className="premium-skill">
                                {benefit}
                                {index < job.benefits.length - 1 && (
                                  <span className="skill-separator"> | </span>
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
                          <p>
                            {(job.job_category || []).map((cat, index) => (
                              <span key={cat} className="premium-skill">
                                {cat}
                                {index < job.job_category.length - 1 && (
                                  <span className="skill-separator"> | </span>
                                )}
                              </span>
                            ))}
                          </p>
                        </div>
                        <img
                          className="info-card-image"
                          src={additional4}
                          alt="Work Details"
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
                          <h4>Job Type / Natute</h4>
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
                  </div>
                )}
              </>
            )}

            {activeTab === "FAQs & Discussions" && (
              <div className="reviews-tab premium-indigo-theme">
                <div className="indigo-header">
                  <h2 className="indigo-title">Application Help & FAQs</h2>
                  <p className="indigo-subtitle">
                    Clear answers to common questions about job applications and recruiter processes.
                  </p>
                </div>

                <Collapse
                  accordion
                  items={items}
                  className="indigo-collapse"
                  expandIcon={({ isActive }) => (
                    <div className="indigo-expand-icon">
                      {isActive ? <MinusCircleFilled /> : <PlusCircleFilled />}
                    </div>
                  )}
                  expandIconPosition="end"
                  bordered={false}
                />
              </div>
            )}
          </div>
        ))}
      </section>
    </>
  );
}
