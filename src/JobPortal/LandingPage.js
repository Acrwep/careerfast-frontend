import React, { useEffect, useState } from "react";
import { Typography, Card, message, Col, Row, Empty, Spin } from "antd";

import {
  EnvironmentOutlined,
  TeamOutlined,
  StarOutlined,
  ArrowRightOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import "../css/LandingPage.css";
import { motion } from "framer-motion";
import ParticlesBg from "particles-bg";
import post_jobs1 from "../images/post_jobs1.png";
import { PiCurrencyDollarDuotone } from "react-icons/pi";
import { LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
// header
import Header from "../Header/Header";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import {
  getJobPostByUserId,
  getJobPosts,
  StatsOfPost,
} from "../ApiService/action";
import Footer from "../Footer/Footer";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { FaBuilding, FaClock, FaUserClock } from "react-icons/fa6";
import { MdPunchClock } from "react-icons/md";

const { Title, Text } = Typography;

const gradientColors = [
  "linear-gradient(to right, #0f3443, #34e89e)", // Teal-Blue
  "linear-gradient(to right, #666600, #999966)",
  "linear-gradient(90deg, #0575E6 0%, #021B79 100%)",
  "linear-gradient(90deg, #20002c 0%, #cbb4d4 100%)",
  "linear-gradient(to right, #000000, #434343)", // Charcoal Grey
  "linear-gradient(to right, #4b79a1, #283e51)", // Slate Blue
  "linear-gradient(90deg, #16222A 0%, #3A6073 100%)",
  "linear-gradient(to right, #1e3c72, #2a5298)", // Cool Royal Blue
  "linear-gradient(to right, #0f2027, #203a43, #2c5364)", // Deep Space
  "linear-gradient(to right, #141e30, #243b55)", // Moody Blue
];

const PrevArrow = ({ onClick }) => (
  <div className="custom-arrow custom-prev" onClick={onClick}>
    <LeftOutlined />
  </div>
);

const NextArrow = ({ onClick }) => (
  <div className="custom-arrow custom-next" onClick={onClick}>
    <RightOutlined />
  </div>
);

const companiesSettings = {
  dots: false,
  infinite: true,
  arrows: false,
  autoplay: true,
  speed: 6000,
  autoplaySpeed: 0,
  cssEase: "linear",
  slidesToShow: 9,
  slidesToScroll: 1,
  swipeToSlide: true,
  responsive: [
    {
      breakpoint: 1200,
      settings: { slidesToShow: 4 },
    },
    {
      breakpoint: 768,
      settings: { slidesToShow: 2 },
    },
    {
      breakpoint: 480,
      settings: { slidesToShow: 1 },
    },
  ],
};

export default function JobPortalLandingPage({ jobPortals, loading, error }) {
  console.log("landingpage", jobPortals);
  const [backendJobs, setBackendJobs] = useState([]);
  const [roleId, setRoleId] = useState(null);
  const [loginUserId, setLoginUserId] = useState(null);
  const navigate = useNavigate();
  const [categoryCounts, setCategoryCounts] = useState({});
  const [category, setCategory] = useState([]);
  const [delayedLoading, setDelayedLoading] = useState(true);
  const [appliedCounts, setAppliedCounts] = useState({});

  const settings = {
    dots: true,
    infinite: backendJobs.length > 3,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToShow: 3.8,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const sliderSettings = {
    dots: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToShow: 6,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  const icons = ["💻", "📊", "🎨", "📢", "💰", "🏥", "⚙️", "✈️", "📚", "🔬"];
  const jobTypeJobs = backendJobs.filter((jobs) => jobs.job_nature === "Job");

  useEffect(() => {
    document.title = "CareerFast | Job Portal";
    getJobPostsData();
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("loginDetails");
      if (stored) {
        const loginDetails = JSON.parse(stored);
        setLoginUserId(loginDetails.id);
        setRoleId(loginDetails.role_id);
      }
    } catch (error) {
      console.error("Invalid JSON in localStorage", error);
    }
  }, []);

  const getJobPostsData = async () => {
    const payload = {};
    try {
      const response = await getJobPosts(payload);
      console.log("getJobPosts", response);

      const jobs = response?.data?.data?.data || [];
      const jobCategories = [
        ...new Set(jobs.flatMap((job) => job.job_category || [])),
      ];
      setCategory(jobCategories);

      const categoryCounts = jobs.reduce((acc, job) => {
        (job.job_category || []).forEach((cat) => {
          acc[cat] = (acc[cat] || 0) + 1;
        });
        return acc;
      }, {});
      setCategoryCounts(categoryCounts);

      if (Array.isArray(jobs)) {
        const uniqueJobs = jobs.filter(
          (job, index, self) => index === self.findIndex((j) => j.id === job.id)
        );
        setBackendJobs(uniqueJobs);
      } else {
        console.warn("Unexpected job data format", response);
      }
    } catch (error) {
      message.error("Please Login");
      console.log("get job post error", error);
    }
  };

  useEffect(() => {
    getJobPostByUserIdData();
  }, [loginUserId]);

  const getJobPostByUserIdData = async () => {
    const getUserDetails = JSON.parse(localStorage.getItem("loginDetails"));

    if (!getUserDetails || !getUserDetails.id) {
      console.error("User not logged in or ID missing.");
      return;
    }

    const payload = { user_id: getUserDetails.id };

    try {
      const response = await getJobPostByUserId(payload);
      const jobs = response?.data?.data || [];

      // fetch applied count for each job
      const counts = {};
      for (let job of jobs) {
        try {
          const statPayload = {
            user_id: getUserDetails.id,
            job_post_id: job.id,
          };
          const res = await StatsOfPost(statPayload);
          counts[job.id] = res?.data?.data?.candidatesCount || 0;
        } catch (err) {
          counts[job.id] = 0;
        }
      }
      setAppliedCounts(counts);
    } catch (error) {
      console.error("Error fetching job posts:", error);
    }
  };

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setDelayedLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (delayedLoading || loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "50px",
          position: "relative",
          top: "250px",
        }}
      >
        <Spin size="large"></Spin>
      </div>
    );
  }

  if (error) return <p>Error: {error}</p>;
  const jobs = jobPortals?.data ?? jobPortals ?? [];

  // ✅ then map companies
  const BASE_URL = "http://localhost:1337";
  const companies =
    jobs[0]?.companyList?.map((item) => ({
      id: item.id,
      logo: `${BASE_URL}${item.url}`,
    })) ?? [];
  const loopedCompanies = [...companies, ...companies];

  return (
    <div className="">
      <Header />
      {Array.isArray(jobs) && jobs.length > 0 && (
        <div key={jobs[0].id}>
          <Row className="job-portal">
            <ParticlesBg type="cobweb" bg={true} color="#7f5af0" num={50} />
            <Col
              style={{ placeContent: "center" }}
              lg={12}
              sm={24}
              md={24}
              xs={24}
            >
              <div className="left-content">
                <div className="header-content">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: jobs[0].homeBannerLeft[0].children[0].text,
                    }}
                  />
                  <div className="button-group">
                    <button
                      onClick={() => navigate("/job-filter")}
                      className="primary-btn"
                    >
                      <span>Find Jobs</span>
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
                    {roleId === 3 ? (
                      <button
                        onClick={() => navigate("/post-jobs")}
                        className="secondary-btn"
                      >
                        <>
                          <span>Post Jobs</span>
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12 5V19M5 12H19"
                              stroke="#5f2eea"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </>
                      </button>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </Col>
            <Col lg={12} sm={24} md={24} xs={24}>
              <div
                dangerouslySetInnerHTML={{
                  __html: jobs[0].homeBannerRight[0].children[0].text,
                }}
              />
            </Col>
          </Row>

          <Col>
            <div className="job-categories">
              <div className="section-header">
                <h4>Explore Categories</h4>
                <a onClick={() => navigate("/job-filter")} className="view-all">
                  View all
                </a>
              </div>

              <Slider {...sliderSettings}>
                {category.map((cat, index) => (
                  <div key={index} className="category-card">
                    <div className="card-icon">
                      {icons[index % icons.length]}
                    </div>
                    <h5>{cat}</h5>
                    <p className="job-count">
                      {categoryCounts[cat] || 0} jobs found
                    </p>
                  </div>
                ))}
              </Slider>
            </div>
          </Col>

          {/* Recommended Jobs */}
          <div className="elite-carousel-container">
            <div className="elite-carousel-header">
              <div className="elite-title-wrapper">
                <Title level={2} className="elite-title">
                  <motion.span
                    className="elite-title-text"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    {jobs[0].recommendedTitle}
                  </motion.span>
                  <motion.span
                    className="elite-badge"
                    animate={{
                      background: [
                        "linear-gradient(135deg, #7f5af0 0%, #5f2eea 100%)",
                      ],
                      boxShadow: [
                        "0 4px 15px rgba(200, 210, 230, 0.7)",
                        "0 4px 15px rgba(200, 210, 250, 0.7)",
                        "0 4px 15px rgba(230, 210, 200, 0.7)",
                      ],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    for you
                  </motion.span>
                </Title>

                <motion.div
                  className="elite-subtitle-wrapper"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  <Text className="elite-subtitle">
                    {jobs[0].recommendedDescription}
                  </Text>
                  <div className="elite-decoration-line"></div>
                </motion.div>
              </div>
            </div>
            {jobTypeJobs.length > 0 ? (
              <Slider {...settings} className="elite-job-carousel">
                {backendJobs
                  .filter((jobs) => jobs.job_nature === "Job")
                  .map((jobs, index) => {
                    const randomGradient =
                      gradientColors[
                        Math.floor(Math.random() * gradientColors.length)
                      ];
                    return (
                      <motion.div
                        key={jobs.id}
                        className="elite-job-slide"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Card
                          className="elite-job-card"
                          style={{ background: randomGradient }}
                          bordered={false}
                        >
                          <div className="elite-job-tag">{jobs.job_nature}</div>

                          <div className="elite-logo-wrapper">
                            <img
                              src={jobs.company_logo}
                              alt={jobs.company_name}
                              className="elite-company-logo"
                            />
                            <div className="elite-logo-backdrop"></div>
                          </div>

                          <div className="elite-job-content">
                            <Title level={4} className="elite-job-title">
                              {jobs.job_title}
                            </Title>
                            <Text className="elite-company-name">
                              {jobs.company_name}
                            </Text>

                            <div className="elite-job-details">
                              <div className="elite-detail-item">
                                <EnvironmentOutlined className="elite-detail-icon" />
                                <div>
                                  <span className="elite-detail-label">
                                    Location
                                  </span>
                                  <span>
                                    {jobs.work_location
                                      ? jobs.work_location
                                      : "WFH"}
                                  </span>
                                </div>
                              </div>
                              <div className="elite-detail-item">
                                <StarOutlined className="elite-detail-icon" />
                                <div>
                                  <span className="elite-detail-label">
                                    Level
                                  </span>
                                  <span>{jobs.experience_type}</span>
                                </div>
                              </div>
                            </div>

                            <div className="elite-job-meta">
                              <div className="elite-meta-item">
                                <TeamOutlined />
                                <span>
                                  {" "}
                                  {appliedCounts[jobs.id] || 0} applicants
                                </span>
                              </div>
                              <div className="elite-meta-item elite-salary">
                                <PiCurrencyDollarDuotone />
                                <span>
                                  {jobs.salary_type === "Range"
                                    ? `${jobs.min_salary} - ${jobs.max_salary}`
                                    : jobs.salary_type === "Fixed"
                                    ? jobs.min_salary
                                    : ""}
                                </span>
                              </div>
                            </div>
                          </div>

                          <motion.div
                            onClick={() => navigate(`/job-details/${jobs.id}`)}
                            className="elite-job-cta"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <ArrowRightOutlined
                              style={{ color: "#5f2eea" }}
                              className="elite-cta-icon"
                            />

                            <span style={{ color: "#5f2eea" }}>
                              View Details
                            </span>
                          </motion.div>
                        </Card>
                      </motion.div>
                    );
                  })}
              </Slider>
            ) : (
              <div className="no-jobs-found">
                <Empty />
              </div>
            )}
          </div>
          {/*  */}

          {/* Need Guidence */}
          <div className="need_guidence">
            <Row
              className="need_guidence_row"
              style={{
                background:
                  "linear-gradient(90deg, rgb(217 186 255) 0%, rgb(255, 255, 255) 100%)",
                borderRadius: "30px",
              }}
            >
              <Col
                style={{
                  overflow: "hidden",
                  borderRadius: "30px 0 0 30px",
                  border: "1px solid #ddd",
                  borderRight: "none",
                }}
                lg={10}
                md={12}
                xs={24}
                sm={24}
              >
                <div
                  style={{ height: "100%" }}
                  dangerouslySetInnerHTML={{
                    __html: jobs[0].needGuideContent[0].children[0].text,
                  }}
                />
              </Col>
              <Col
                style={{
                  textAlign: "left",
                  borderRadius: "0px 30px 30px 0px",
                  border: "1px solid #ddd",
                  borderLeft: "none",
                  placeContent: "center",
                }}
                lg={14}
                md={12}
                xs={24}
                sm={24}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: jobs[0].needGuideContent[1].children[0].text,
                  }}
                />
              </Col>
            </Row>
          </div>
          {/*  */}

          {/* top companies */}
          <div className="top_companies">
            <div
              dangerouslySetInnerHTML={{
                __html: jobs[0].topCompanyContent[0].children[0].text,
              }}
            />

            <div className="compay_icons">
              <Slider {...companiesSettings} className="elite-job-carousel">
                {loopedCompanies.map((company, index) => (
                  <motion.div
                    key={`${company.id}-${index}`}
                    className="elite-job-slide"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="elite-rightRole-logo-wrapper">
                      <img
                        src={company.logo}
                        alt={`Company ${company.id}`}
                        className="elite-compay_icons-company-logo"
                      />
                    </div>
                  </motion.div>
                ))}
              </Slider>
            </div>
          </div>
          {/*  */}

          {/* counting */}
          <div className="counter">
            <Row>
              <Col md={8}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: jobs[0].jobsCount[0].children[0].text,
                  }}
                />
              </Col>
              <Col md={8}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: jobs[0].jobsCount[1].children[0].text,
                  }}
                />
              </Col>
              <Col md={8}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: jobs[0].jobsCount[2].children[0].text,
                  }}
                />
              </Col>
            </Row>
          </div>
          {/*  */}

          {/* Top Course */}
          <div className="need_guidence">
            <Row className="need_guidence_row">
              <Col
                style={{
                  textAlign: "left",
                  borderRadius: "30px 0px 0px 30px",
                  border: "1px solid #ddd",
                  borderRight: "none",
                  placeContent: "center",
                  paddingLeft: "30px",
                }}
                lg={14}
                md={12}
                xs={24}
                sm={24}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: jobs[0].stuckContent[0].children[0].text,
                  }}
                />
              </Col>

              <Col
                style={{
                  overflow: "hidden",
                  borderRadius: "0px 30px 30px 0px",
                  border: "1px solid #ddd",
                  borderLeft: "none",
                }}
                lg={10}
                md={12}
                xs={24}
                sm={24}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: jobs[0].stuckContent[1].children[0].text,
                  }}
                />
              </Col>
            </Row>
          </div>
          {/*  */}

          {/* Post Your Jobs & Internships */}
          <div className="post_jobs">
            <Row className="post_jobs_row">
              <Col
                style={{ placeContent: "center" }}
                lg={12}
                sm={24}
                md={24}
                xs={24}
              >
                <div
                  className={`post_jobs_glass ${
                    roleId !== 3 ? "blur-access" : ""
                  }`}
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: jobs[0].postYours1[0].children[0].text,
                    }}
                  />

                  <div className="post_jobs_btn">
                    <img style={{ width: "60%" }} src={post_jobs1} alt="icon" />
                    {roleId === 3 ? (
                      <button
                        onClick={() => navigate("/post-jobs")}
                        className="primary-btn"
                      >
                        <span>Post Jobs Now</span>
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
                    ) : (
                      <button className="primary-btn" disabled>
                        <span>You cannot access</span>
                      </button>
                    )}
                  </div>
                  {roleId !== 3 && (
                    <div className="access-restricted-overlay">
                      <div className="access-restricted-content">
                        <LockOutlined
                          style={{
                            fontSize: "32px",
                            color: "#fff",
                            marginBottom: "16px",
                          }}
                        />
                        <h3 style={{ color: "#fff", marginBottom: "8px" }}>
                          Access Restricted
                        </h3>
                        <p style={{ color: "#fff", textAlign: "center" }}>
                          This feature is only available for employers. Please
                          contact support if you believe this is an error.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </Col>

              <Col
                style={{ placeContent: "center" }}
                lg={12}
                sm={24}
                md={24}
                xs={24}
              >
                <div
                  className={`post_jobs_div1 ${
                    roleId !== 3 ? "blur-access" : ""
                  }`}
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: jobs[0].postYours1[1].children[0].text,
                    }}
                  />
                  {roleId !== 3 && (
                    <div className="access-restricted-overlay"></div>
                  )}
                </div>
              </Col>
            </Row>
          </div>
        </div>
      )}

      {/*  */}
      <Footer />
    </div>
  );
}
