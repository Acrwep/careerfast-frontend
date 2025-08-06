import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import {
  Row,
  Col,
  Collapse,
  Form,
  Input,
  Space,
  Drawer,
  Button,
  message,
} from "antd";
import {
  FaRegBuilding,
  FaRegCalendarAlt,
  FaMapMarkerAlt,
  FaCrown,
  FaHeart,
} from "react-icons/fa";
import {
  StarFilled,
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
  getJobAppliedCandidates,
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

const tabs = ["Job Description", "Dates & Deadlines", "FAQs & Discussions"];

export default function JobDetails() {
  const [wishlisted, setWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState("Job Description");
  const [postDetails, setPostDetails] = useState([]);
  const [backendJobs, setBackendJobs] = useState([]);
  const [openApplyNow, setOpenApplyNow] = useState(false);
  const [answers, setAnswers] = useState("");
  const [loginUserId, setLoginUserId] = useState(null);
  const { id } = useParams();
  const [isApplied, setIsApplied] = useState({});
  const [isSaved, setIsSaved] = useState({});
  const [wishlistedJobs, setWishlistedJobs] = useState({});
  const [savedJobMap, setSavedJobMap] = useState({});

  useEffect(() => {
    document.title = "CareerFast | Job Details";
    fetchJobs();
  }, []);

  useEffect(() => {
    console.log("Job ID from URL:", id);
  }, [id]);

  useEffect(() => {
    if (backendJobs.length > 0 && id) {
      const selectedJob = backendJobs.find((job) => job.id.toString() === id);
      if (selectedJob) {
        setPostDetails([transformJob(selectedJob)]);
      } else {
        console.warn("Job not found with id:", id);
      }
      checkIsJobAppliedData(selectedJob.id);
    }
  }, [backendJobs, id]);

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
      postedDate,
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
      premium: true,
      urgent: false,
      skills: job.skills,
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

  const applyForJobData = async () => {
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
      const response = await applyForJob(payload);
      console.log("apply jobs", response);
      message.success("Job applied successfully");
      setIsApplied((prev) => ({
        ...prev,
        [jobId]: true,
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

  const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;
  const items = [
    {
      key: "1",
      label: "This is panel header 1",
      children: <p>{text}</p>,
    },
    {
      key: "2",
      label: "This is panel header 2",
      children: <p>{text}</p>,
    },
    {
      key: "3",
      label: "This is panel header 3",
      children: <p>{text}</p>,
    },
  ];

  return (
    <>
      <Header />
      <section className="premium-job-details job_filter details_page">
        <Row>
          <Col lg={24} md={24} sm={24}>
            {postDetails.map((job) => (
              <div
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

                <div style={{ width: "40%" }} className="side_job_details">
                  <div className="side_job_actions">
                    <div className="side_job_action_buttons">
                      <div className="side_job_action_icons">
                        <span className="side_job_action_icon">
                          {isSaved[job.id] ? (
                            <FaHeart className="side_job_action_icon heart active" />
                          ) : (
                            <FaRegHeart className="side_job_action_icon heart" />
                          )}
                        </span>
                        <span className="side_job_action_icon">
                          <IoMdCalendar className="side_job_action_icon calendar" />
                        </span>
                      </div>
                      <button className="side_job_share_button">
                        <IoIosShareAlt /> Share
                      </button>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      {isApplied[job.id] === true ? (
                        <div className="side_job_applied_badge">
                          <FaCheckCircle /> Applied
                        </div>
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
                          {postDetails[0].questions.map((question, index) => (
                            <div key={index} className="question-item">
                              <p>{question}</p>
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
                          <span key={index}>
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
          <div className="job-details-container">
            {/* Premium Tab Navigation */}
            <div className="tabs">
              {tabs.map((tab) => (
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

            {activeTab === "Dates & Deadlines" && (
              <div className="job_filter">
                <div className="section-card">
                  <h2 className="section-title">Additional Information</h2>

                  <div className="info-card">
                    <div className="info-card-content">
                      <h4>Job Location(s)</h4>
                      <p>{job.location}</p>
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
                      <p>{job.eligibility}</p>
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
                      <p>{job.salary}</p>
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
                        <b>Working Days</b>: {job.working_days}
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
                      src="https://d8it4huxumps7.cloudfront.net/uploads/images/667109c430518_job_typetiming.png?d=240x172"
                      alt="Work Details"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "FAQs & Discussions" && (
              <div className="reviews-tab premium-indigo-theme">
                <div className="indigo-header">
                  <div className="review-badge">
                    <StarFilled style={{ color: "#ffc107" }} />
                    <span>4.9/5.0</span>
                  </div>
                  <h2 className="indigo-title">What Our Clients Say</h2>
                  <p className="indigo-subtitle">
                    Trusted by thousands of satisfied customers
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
