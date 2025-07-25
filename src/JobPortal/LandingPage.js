import React, { useEffect, useState } from "react";
import { Typography, Card, message, Col, Row, Empty } from "antd";

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
import loginImage from "../images/job_search.jpeg";
import logo1 from "../images/logo1.svg";
import logo2 from "../images/logo2.svg";
import logo3 from "../images/logo3.svg";
import logo4 from "../images/logo4.svg";
import logo5 from "../images/tesla-pure.svg";
import logo6 from "../images/samsung-8.svg";
import logo7 from "../images/tata-1.svg";
import right_role1 from "../images/right_role1.png";
import right_role2 from "../images/right_role2.png";
import right_role3 from "../images/right_role3.png";
import right_role4 from "../images/right_role4.png";
import right_role5 from "../images/right_role5.png";
import right_role6 from "../images/right_role6.png";
import need_guidence from "../images/need_guidence.webp";
import recruiter1 from "../images/recruiter1.png";
import counter_box1 from "../images/counter_box1.png";
import counter_box2 from "../images/verified.png";
import counter_box3 from "../images/applied.png";
import need_guidence1 from "../images/need_guidence1.png";
import post_jobs from "../images/post_jobs.webp";
import post_jobs1 from "../images/post_jobs1.png";
import { PiCurrencyDollarDuotone } from "react-icons/pi";
import { LockOutlined } from "@ant-design/icons";
// header
import Header from "../Header/Header";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { getJobPosts } from "../ApiService/action";

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

const rightRole = [
  {
    id: 1,
    title: "Data Analyst",
    openings: "370+ Openings",
    logo: right_role1,
    bgColor: "#fff",
  },
  {
    id: 2,
    title: "Frontend",
    openings: "250+ Openings",
    logo: right_role2,
    bgColor: "#fff",
  },
  {
    id: 3,
    title: "Full-Stack Roles",
    openings: "300+ Openings",
    logo: right_role3,
    bgColor: "#fff",
  },
  {
    id: 4,
    title: "Project Management",
    openings: "246+ Openings",
    logo: right_role4,
    bgColor: "#fff",
  },
  {
    id: 5,
    title: "Marketing",
    openings: "300+ Openings",
    logo: right_role5,
    bgColor: "#fff",
  },
  {
    id: 6,
    title: "Finance",
    openings: "230+ Openings",
    logo: right_role6,
    bgColor: "#fff",
  },
];

const companies = [
  {
    id: 1,
    logo: logo1,
  },
  {
    id: 2,
    logo: logo2,
  },
  {
    id: 3,
    logo: logo3,
  },
  {
    id: 4,
    logo: logo4,
  },
  {
    id: 5,
    logo: logo5,
  },
  {
    id: 6,
    logo: logo6,
  },
  {
    id: 7,
    logo: logo7,
  },

  {
    id: 8,
    logo: logo1,
  },
  {
    id: 9,
    logo: logo2,
  },
  {
    id: 10,
    logo: logo3,
  },
  {
    id: 11,
    logo: logo4,
  },
  {
    id: 12,
    logo: logo5,
  },
  {
    id: 13,
    logo: logo6,
  },
  {
    id: 14,
    logo: logo7,
  },

  {
    id: 15,
    logo: logo1,
  },
  {
    id: 16,
    logo: logo2,
  },
  {
    id: 17,
    logo: logo3,
  },
  {
    id: 18,
    logo: logo4,
  },
  {
    id: 19,
    logo: logo5,
  },
  {
    id: 20,
    logo: logo6,
  },
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

const settings = {
  dots: true,
  infinite: true,
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

const rightRolesettings = {
  dots: false,
  infinite: true,
  arrows: true,
  autoplay: true,
  autoplaySpeed: 4000,
  slidesToShow: 4.5,
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

const companiesSettings = {
  dots: false,
  infinite: true,
  arrows: false,
  autoplay: true,
  autoplaySpeed: 2000,
  slidesToShow: 10,
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

export default function JobPortalLandingPage() {
  const [backendJobs, setBackendJobs] = useState([]);
  const [roleId, setRoleId] = useState(null);
  const [loginUserId, setLoginUserId] = useState(null);

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
      const jobs = response?.data?.data?.data;
      console.log("get job posttt", jobs);
      if (Array.isArray(jobs)) {
        setBackendJobs(jobs);
      } else {
        console.warn("Unexpected job data format", response);
      }
    } catch (error) {
      message.error("Failed to fetch");
      console.log("get job post error", error);
    }
  };

  return (
    <div className="">
      <Header />
      <Row className="job-portal">
        <ParticlesBg type="cobweb" bg={true} color="#7f5af0" num={50} />
        <Col style={{ placeContent: "center" }} lg={12} sm={24} md={24} xs={24}>
          <div className="left-content">
            <div className="header-content">
              <h1>
                <span className="highlight">Elevate</span> Your Career<br></br>{" "}
                Journey
              </h1>
              <p className="subtitle">
                Discover premium opportunities with top-tier companies<br></br>{" "}
                and unlock your professional potential.
              </p>
              <div className="button-group">
                <a href="job-filter">
                  <button className="primary-btn">
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
                </a>
                <a href="post-jobs">
                  {roleId === 3 ? (
                    <button className="secondary-btn">
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
                            stroke="#6900ad"
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
                </a>
              </div>
            </div>
          </div>
        </Col>
        <Col lg={12} sm={24} md={24} xs={24}>
          <div className="right-content">
            <div className="image-container">
              <div className="gradient-overlay"></div>
              <img
                src={loginImage}
                alt="Professional woman"
                className="main-image"
              />

              <div className="floating-tag top-left">
                <div className="tag-icon">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12Z"
                      fill="#6900ad"
                    />
                    <path
                      d="M12 8V12L15 15"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span>Latest Jobs</span>
              </div>

              <div className="floating-tag top-right">
                <div className="tag-icon">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                      stroke="#6900ad"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 8V12L15 15"
                      stroke="#6900ad"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span>Internships</span>
              </div>

              <div className="floating-tag mid-right">
                <div className="tag-icon">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 21H21"
                      stroke="#6900ad"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M19 21V5C19 4.46957 18.7893 3.96086 18.4142 3.58579C18.0391 3.21071 17.5304 3 17 3H7C6.46957 3 5.96086 3.21071 5.58579 3.58579C5.21071 3.96086 5 4.46957 5 5V21"
                      stroke="#6900ad"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 10H15"
                      stroke="#6900ad"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 14H15"
                      stroke="#6900ad"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span>Top Companies</span>
              </div>

              <div className="stats-card">
                <div className="stats-content">
                  <h3>21M+</h3>
                  <p>Professionals hired through our platform</p>
                </div>
                <div className="stats-icon">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                      stroke="#6900ad"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      <Col className="">
        <div className="job-categories">
          <div className="section-header">
            <h4>Explore Categories</h4>
            <a href="#" className="view-all">
              View all
            </a>
          </div>
          <div className="categories-grid">
            <div className="category-card">
              <div className="card-icon">💻</div>
              <h5>Software Development</h5>
              <p className="job-count">12,345 jobs</p>
            </div>
            <div className="category-card">
              <div className="card-icon">📊</div>
              <h5>Data Science</h5>
              <p className="job-count">8,742 jobs</p>
            </div>
            <div className="category-card">
              <div className="card-icon">🎨</div>
              <h5>UX/UI Design</h5>
              <p className="job-count">5,321 jobs</p>
            </div>
            <div className="category-card">
              <div className="card-icon">📢</div>
              <h5>Digital Marketing</h5>
              <p className="job-count">7,856 jobs</p>
            </div>
            <div className="category-card">
              <div className="card-icon">💰</div>
              <h5>Finance</h5>
              <p className="job-count">9,123 jobs</p>
            </div>
            <div className="category-card">
              <div className="card-icon">🏥</div>
              <h5>Healthcare</h5>
              <p className="job-count">6,789 jobs</p>
            </div>
          </div>
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
                Recommended Jobs
              </motion.span>
              <motion.span
                className="elite-badge"
                animate={{
                  background: ["#6900ad"],
                  boxShadow: [
                    "0 4px 15px rgba(200, 210, 230, 0.7)",
                    "0 4px 15px rgba(200, 210, 250, 0.7)",
                    "0 4px 15px rgba(230, 210, 200, 0.7)",
                  ],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
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
                Looking for the best of the best? Here're the top-rated Jobs by
                the learners' community.
              </Text>
              <div className="elite-decoration-line"></div>
            </motion.div>
          </div>
        </div>

        {backendJobs.length > 0 ? (
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
                              <span>{jobs.work_location}</span>
                            </div>
                          </div>
                          <div className="elite-detail-item">
                            <StarOutlined className="elite-detail-icon" />
                            <div>
                              <span className="elite-detail-label">Level</span>
                              <span>{jobs.experience_type}</span>
                            </div>
                          </div>
                        </div>

                        <div className="elite-job-meta">
                          <div className="elite-meta-item">
                            <TeamOutlined />
                            <span>543+ applicants</span>
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
                        className="elite-job-cta"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ArrowRightOutlined
                          style={{ color: "#5f2eea" }}
                          className="elite-cta-icon"
                        />
                        <a
                          href={`/job-details/${jobs.id}`}
                          style={{ color: "#5f2eea" }}
                        >
                          <span>View Details</span>
                        </a>
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

      {/* Right role */}
      <div className="elite-carousel-rightRole-container">
        <div className="elite-carousel-header">
          <div className="elite-title-wrapper">
            <Title level={2} className="elite-title">
              <motion.span
                className="elite-title-text"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Find The Right Role For You
              </motion.span>
              <motion.span
                className="elite-badge"
                animate={{
                  background: ["#6900ad"],
                  boxShadow: [
                    "0 4px 15px rgba(200, 210, 230, 0.7)",
                    "0 4px 15px rgba(200, 210, 250, 0.7)",
                    "0 4px 15px rgba(230, 210, 200, 0.7)",
                  ],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                EXCLUSIVE SELECTION
              </motion.span>
            </Title>
            <motion.div
              className="elite-subtitle-wrapper"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <Text className="elite-subtitle">
                Apply to roles matching your skills from 500+ trending options.
              </Text>
              <div className="elite-decoration-line"></div>
            </motion.div>
          </div>
        </div>
        <div className="right_role">
          <Slider {...rightRolesettings} className="elite-job-carousel">
            {rightRole.map((rightRole, index) => (
              <motion.div
                key={rightRole.id}
                className="elite-job-slide"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  className="elite-rightRole-card"
                  style={{
                    background: rightRole.bgColor,
                  }}
                  bordered={false}
                >
                  <div className="elite-rightRole-content">
                    <Title level={4} className="elite-rightRole-title">
                      {rightRole.title}
                    </Title>
                    <Text className="elite-rightRole-company-name">
                      {rightRole.openings}
                    </Text>
                  </div>
                  <div className="elite-rightRole-logo-wrapper">
                    <img
                      src={rightRole.logo}
                      alt={rightRole.company}
                      className="elite-rightRole-company-logo"
                    />
                  </div>

                  <motion.div
                    className="elite-rightRole-cta"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ArrowRightOutlined className="elite-rightRole-cta-icon" />
                  </motion.div>
                </Card>
              </motion.div>
            ))}
          </Slider>
        </div>
      </div>
      {/*  */}

      {/* Jobs */}
      {/* <div className="elite-carousel-container">
        <div className="elite-carousel-header">
          <div className="elite-title-wrapper">
            <Title level={2} className="elite-title">
              <motion.span
                className="elite-title-text"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Curated Opportunities
              </motion.span>
            </Title>
            <motion.div
              className="elite-subtitle-wrapper"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <Text className="elite-subtitle">
                Handpicked positions from industry leaders, tailored for
                top-tier professionals like yourself.
              </Text>
              <div className="elite-decoration-line"></div>
            </motion.div>
          </div>
        </div>

        <Slider {...settings} className="elite-job-carousel">
          {jobs.map((job, index) => (
            <motion.div
              key={job.id}
              className="elite-job-slide"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className="elite-job-card"
                style={{
                  background: job.bgColor,
                }}
                bordered={false}
              >
                <div className="elite-job-tag">{job.tag}</div>

                <div className="elite-logo-wrapper">
                  <img
                    src={job.logo}
                    alt={job.company}
                    className="elite-company-logo"
                  />
                  <div className="elite-logo-backdrop"></div>
                </div>

                <div className="elite-job-content">
                  <Title level={4} className="elite-job-title">
                    {job.title}
                  </Title>
                  <Text className="elite-company-name">{job.company}</Text>

                  <div className="elite-job-details">
                    <div className="elite-detail-item">
                      <EnvironmentOutlined className="elite-detail-icon" />
                      <div>
                        <span className="elite-detail-label">Location</span>
                        <span>{job.location}</span>
                      </div>
                    </div>
                    <div className="elite-detail-item">
                      <StarOutlined className="elite-detail-icon" />
                      <div>
                        <span className="elite-detail-label">Level</span>
                        <span>{job.experience}</span>
                      </div>
                    </div>
                  </div>

                  <div className="elite-job-meta">
                    <div className="elite-meta-item">
                      <TeamOutlined />
                      <span>{job.applicants}+ applicants</span>
                    </div>
                    <div className="elite-meta-item elite-salary">
                      <PiCurrencyDollarDuotone />
                      <span>{job.salary}</span>
                    </div>
                  </div>
                </div>

                <motion.div
                  className="elite-job-cta"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowRightOutlined className="elite-cta-icon" />
                  <span>View Details</span>
                </motion.div>
              </Card>
            </motion.div>
          ))}
        </Slider>
      </div> */}
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
            <img src={need_guidence}></img>
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
            <Text className="need_guidence_text">Need Guidence?</Text>
            <Title className="need_guidence_title">
              Get Winning Tips From <span>Top Mentors</span>
            </Title>
          </Col>
        </Row>
      </div>
      {/*  */}

      {/* top companies */}
      <div className="top_companies">
        <div className="elite-title-wrapper">
          <h2 className="ant-typography elite-title css-dev-only-do-not-override-1m2bkf9">
            <span className="elite-title-text">
              Top Companies Listing on Career Fast
            </span>
          </h2>
          <div className="elite-subtitle-wrapper" style={{ opacity: "1" }}>
            <span class="ant-typography elite-subtitle css-dev-only-do-not-override-1m2bkf9">
              Find the Jobs that fits your career aspirations.
            </span>
            <div className="elite-decoration-line"></div>
          </div>
        </div>
        <div className="compay_icons">
          <Slider {...companiesSettings} className="elite-job-carousel">
            {companies.map((company, index) => (
              <motion.div
                key={company.id}
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
            <div className="counter-card pink-bg">
              <h2>100K+</h2>
              <p>Listed Jobs & Internships</p>
              <div className="company-logos1">
                <img src={counter_box1}></img>
              </div>
            </div>
          </Col>
          <Col md={8}>
            <div className="counter-card blue-bg">
              <h2>24K+</h2>
              <p>Verified Recruiters</p>
              <img style={{ width: "44%" }} src={recruiter1}></img>
              <div className="company-logos2">
                <img src={counter_box2}></img>
              </div>
            </div>
          </Col>
          <Col md={8}>
            <div className="counter-card yellow-bg">
              <h2>5.3M+</h2>
              <p>Applications</p>
              <div className="company-logos3">
                <img src={counter_box3}></img>
              </div>
            </div>
          </Col>
        </Row>
      </div>
      {/*  */}

      {/* Top Course */}
      <div className="need_guidence">
        <Row
          className="need_guidence_row"
          style={{
            background:
              "linear-gradient(90deg, rgb(253 253 255) 0%, rgb(217, 186, 255) 100%)",
            borderRadius: "30px",
          }}
        >
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
            <Text className="need_guidence_text">Stuck Somewhere?</Text>
            <Title className="need_guidence_title">
              Learn From <span>Top Courses</span>
            </Title>
            <Text>
              Upskill, get certified, and stay ahead of the competition with our
              50+ trending courses.
            </Text>
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
            <img src={need_guidence1}></img>
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
              className={`post_jobs_glass ${roleId !== 3 ? "blur-access" : ""}`}
            >
              <Title className="post_jobs_title">
                Post Your{" "}
                <span style={{ color: "#6900ad" }}>Jobs & Internships</span>
              </Title>
              <Text className="post_jobs_text">
                Connect with top talent actively seeking opportunities across
                various domains. Whether you're hiring for full-time roles,
                part-time positions, or internships.
              </Text>
              <br />
              <Text className="post_jobs_text">
                Tap into a diverse and dynamic talent pool of fresh graduates,
                experienced professionals, and industry-ready interns. Post your
                opportunities with ease and start building your dream team
                today.
              </Text>

              <div className="post_jobs_btn">
                <img src={post_jobs1} alt="icon" />
                {roleId === 3 ? (
                  <a href="post-jobs">
                    <button className="primary-btn">
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
                  </a>
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
              className={`post_jobs_div1 ${roleId !== 3 ? "blur-access" : ""}`}
            >
              <img src={post_jobs} alt="Post Job Illustration" />
              {roleId !== 3 && (
                <div className="access-restricted-overlay"></div>
              )}
            </div>
          </Col>
        </Row>
      </div>

      {/*  */}
    </div>
  );
}
