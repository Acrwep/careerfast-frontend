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
import post_jobs from "../images/post_jobs.jpg";
import bannerImg from "../images/job_search.jpeg";
import company_logos1 from "../images/counter_box2.png";
import company_logos2 from "../images/verified.png";
import company_logos3 from "../images/applied.png";
import need_content_img from "../images/need_guidence.webp";
import need_guidence1 from "../images/need_guidence1.png";
import { PiCurrencyDollarDuotone } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import logo1 from "../images/logo1.svg";
import logo2 from "../images/logo2.svg";
import logo3 from "../images/logo3.svg";
import logo4 from "../images/logo4.svg";
import logo5 from "../images/flipcart.webp";
import logo6 from "../images/samsung-8.svg";
import logo7 from "../images/tata-1.svg";
import logo8 from "../images/tesla-pure.svg";
import logo9 from "../images/amazon.svg";
import logo10 from "../images/hundai.png";
import logo11 from "../images/apple.png";
import logo12 from "../images/hp.webp";
import logo13 from "../images/facebook.webp";
// header
import Header from "../Header/Header";
import {
  FaLaptopCode,
  FaBullhorn,
  FaChartBar,
  FaPalette,
  FaHospitalAlt,
  FaPlaneDeparture,
  FaBookOpen,
  FaTools,
  FaBriefcase,
  FaMicrochip
} from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import {
  getJobPostByUserId,
  getJobPosts,
  StatsOfPost,
  getJobCategoryData,
  getBlogs
} from "../ApiService/action";
import Footer from "../Footer/Footer";
import { Loader } from "lucide-react";

const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const { Title, Text } = Typography;

const gradientColors = [
  "linear-gradient(to right, #0f3443, #34e89e)",
  "linear-gradient(to right, #666600, #999966)",
  "linear-gradient(90deg, #0575E6 0%, #021B79 100%)",
  "linear-gradient(90deg, #20002c 0%, #cbb4d4 100%)",
  "linear-gradient(to right, #000000, #434343)",
  "linear-gradient(to right, #4b79a1, #283e51)",
  "linear-gradient(90deg, #16222A 0%, #3A6073 100%)",
  "linear-gradient(to right, #1e3c72, #2a5298)",
  "linear-gradient(to right, #0f2027, #203a43, #2c5364)",
  "linear-gradient(to right, #141e30, #243b55)",
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

const companies = [
  { id: 1, logo: logo1 },
  { id: 2, logo: logo2 },
  { id: 3, logo: logo3 },
  { id: 4, logo: logo4 },
  { id: 5, logo: logo5 },
  { id: 6, logo: logo6 },
  { id: 7, logo: logo7 },
  { id: 8, logo: logo8 },
  { id: 9, logo: logo9 },
  { id: 10, logo: logo10 },
  { id: 11, logo: logo11 },
  { id: 12, logo: logo12 },
  { id: 13, logo: logo13 },
];
const loopedCompanies = [...companies, ...companies];

export default function JobPortalLandingPage() {
  const [backendJobs, setBackendJobs] = useState([]);
  const [roleId, setRoleId] = useState(null);
  const [loginUserId, setLoginUserId] = useState(null);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [category, setCategory] = useState([]);
  const [appliedCounts, setAppliedCounts] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [blogTips, setBlogTips] = useState([]);
  // 🔹 Loader state
  const [loading, setLoading] = useState(true);
  const [visibleBlogs, setVisibleBlogs] = useState(6);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    loadBlogsForTips();
  }, []);

  const loadBlogsForTips = async () => {
    try {
      const res = await getBlogs();
      const blogs = res.data || [];
      setBlogTips(blogs.slice(0, 10));
    } catch (error) {
      console.error("Error fetching blog tips:", error);
    }
  };

  const loadMoreBlogs = () => {
    setVisibleBlogs((prev) => prev + 3);
  };


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

  // Variants for reusability
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.4,
        ease: "easeOut",
      },
    }),
  };

  const icons = [
    <FaLaptopCode />,
    <FaChartBar />,
    <FaPalette />,
    <FaBullhorn />,
    <FaHospitalAlt />,
    <FaTools />,
    <FaPlaneDeparture />,
    <FaBookOpen />,
    <FaBriefcase />,
    <FaMicrochip />
  ];
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

  const fetchCategories = async () => {
    try {
      const response = await getJobCategoryData();

      const backendCategories =
        response?.data?.data?.map(cat => cat.category_name) || [];

      setCategory(backendCategories);

      // ✅ Count jobs per category using backendJobs
      const counts = {};
      backendJobs.forEach(job => {
        if (Array.isArray(job.job_category)) {
          job.job_category.forEach(cat => {
            counts[cat] = (counts[cat] || 0) + 1;
          });
        }
      });

      setCategoryCounts(counts);

    } catch (err) {
      console.error("Category fetch failed:", err);
    }
  };

  const getJobPostsData = async () => {
    setLoading(true);
    try {
      const response = await getJobPosts({});
      const jobs = response?.data?.data?.data || [];
      setBackendJobs(jobs);
    } catch (error) {
      message.error("Please Login");
    } finally {
      setLoading(false);
      fetchCategories(); // ✅ call here
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

  // ✅ Loader overlay
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#fff",
        }}
      >
        <Spin size="large" tip="Loading jobs..." />
      </div>
    );
  }


  // ✅ Render rest of the page only after data is ready
  return (
    <div>
      <Header />
      {/* Hero Section */}
      <Row className="job-portal">
        <ParticlesBg type="cobweb" bg={true} color="#7f5af0" num={50} />

        {/* Left Content */}
        <Col lg={12} sm={24} md={24} xs={24}>
          <motion.div
            className="left-content"
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="header-content">
              <motion.h1
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                Elevate Your Career <br /> Journey
              </motion.h1>

              <motion.p
                className="subtitle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                Discover premium opportunities with top-tier companies <br />
                and unlock your professional potential.
              </motion.p>

              <motion.div
                className="button-group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                {/* Find Jobs */}
                <motion.button
                  onClick={() => navigate("/job-filter?filter=Job")}
                  className="primary-btn"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
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
                </motion.button>

                {/* Post Jobs */}
                <motion.button
                  onClick={() => {
                    if (!loginUserId) {
                      message.warning("Please login to post a job");
                      navigate("/login");
                    } else if (roleId === 3) {
                      navigate("/post-jobs");
                    } else {
                      message.error(
                        "Access restricted! Only employers can post jobs."
                      );
                    }
                  }}
                  className="secondary-btn"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                >
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
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </Col>

        {/* Right Content (Hero Image with floating tags & stats) */}
        <Col lg={12} sm={24} md={24} xs={24}>
          <motion.div
            className="right-content"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="image-container">
              <div className="gradient-overlay"></div>
              <motion.img
                src={bannerImg}
                alt="Professional woman"
                className="main-image"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />

              {/* Floating tags */}
              <motion.div
                className="floating-tag top-left"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <div className="tag-icon">
                  <i className="fa fa-clock"></i>
                </div>
                <span>Latest Jobs</span>
              </motion.div>

              <motion.div
                className="floating-tag top-right"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <div className="tag-icon">
                  <i className="fa-solid fa-briefcase"></i>
                </div>
                <span>Internships</span>
              </motion.div>

              <motion.div
                className="floating-tag mid-right"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <div className="tag-icon">
                  <i className="fa-solid fa-building-circle-check"></i>
                </div>
                <span>Top Companies</span>
              </motion.div>

              {/* Stats Card */}
              <motion.div
                className="stats-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                <div className="stats-content">
                  <h3>21M+</h3>
                  <p>Professionals hired through our platform</p>
                </div>
                <div className="stats-icon">
                  <i className="fa-solid fa-circle-check"></i>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </Col>
      </Row>


      <Col>
        <div className="job-categories">
          <motion.div
            className="section-header"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <h4>Explore Categories</h4>
            <a onClick={() => navigate("/internship-filter")} className="view-all">
              View all
            </a>
          </motion.div>

          <Slider {...sliderSettings}>
            {category.map((cat, index) => (
              <motion.div
                key={index}
                className="category-card"
                onClick={() => {
                  const categorySlug = generateSlug(cat);
                  navigate(`/job-filter?category=${categorySlug}`);
                }}
              >
                <div className="card-icon">{icons[index % icons.length]}</div>
                <h5>{cat}</h5>
              </motion.div>
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
                Recommended Jobs
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
                Looking for the best of the best? Here're the top-rated Jobs by the learners' community.
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
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                  >
                    <Card
                      className="elite-job-card"
                      style={{ background: randomGradient }}
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
                              <span className="elite-detail-label">Location</span>
                              <span>
                                {(() => {
                                  const arr = Array.isArray(jobs.work_location)
                                    ? jobs.work_location
                                    : (() => {
                                      try {
                                        return JSON.parse(jobs.work_location);
                                      } catch {
                                        return [jobs.work_location];
                                      }
                                    })();

                                  const firstTwo = arr.slice(0, 2).join(", ");
                                  return arr.length > 2 ? `${firstTwo}, ...` : firstTwo;
                                })()}
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
                            <span>
                              {jobs.salary_type === "Range"
                                ? `${jobs.currency} ${jobs.min_salary} - ${jobs.max_salary}`
                                : jobs.salary_type === "Fixed"
                                  ? `${jobs.currency} ${jobs.min_salary}`
                                  : ""}
                            </span>
                          </div>
                        </div>
                      </div>

                      <motion.div
                        onClick={() => {
                          const jobTitleSlug = generateSlug(jobs.job_title);
                          const companySlug = generateSlug(jobs.company_name);
                          const finalUrl = `/job-details/${jobTitleSlug}-${companySlug}-${jobs.id}`;
                          navigate(finalUrl);
                        }}
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

      {/* ✅ My Opportunities Section */}
      <div className="my-opportunities">
        <div className="opportunities-header">
          <div className="header-text">
            <h2>My Opportunities <span>( Recently Published )</span></h2>
            <p className="subtitle">
              Keep track of your recent and in-progress listings to stay on top of what you've posted.
            </p>
          </div>
          <a onClick={() => navigate("/job-filter")} className="view-all-link">
            View all opportunities →
          </a>
        </div>

        {/* Opportunities Grid */}
        {/* Opportunities Grid */}
        <div className="opportunities-grid">
          {backendJobs
            .filter((job) => job.job_nature === "Job") // ✅ only jobs
            .sort((a, b) => new Date(b.posted_date) - new Date(a.posted_date)) // ✅ newest first
            .slice(0, 4) // ✅ limit to 4
            .map((job) => (
              <motion.div
                key={job.id}
                className="classical-opportunity-card"
                onClick={() => {
                  const jobTitleSlug = generateSlug(job.job_title);
                  const companySlug = generateSlug(job.company_name);
                  const finalUrl = `/job-details/${jobTitleSlug}-${companySlug}-${job.id}`;
                  navigate(finalUrl);
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                whileHover={{ scale: 1.03 }}
              >
                <div className="card-header">
                  <div className="company-logos">
                    <img
                      src={job.company_logo || logo1}
                      alt={job.company_name}
                    />
                  </div>
                  <div className="company-info">
                    <h3 className="job-title">{job.job_title}</h3>
                    <p className="company-name">{job.company_name}</p>
                  </div>
                </div>

                <div className="card-details">
                  <div className="detail-item">
                    <span className="label">Location:</span>
                    <span>
                      {(() => {
                        try {
                          const arr = JSON.parse(job.work_location);

                          // Show FIRST 2 only
                          if (Array.isArray(arr)) {
                            const firstTwo = arr.slice(0, 2).join(", ");
                            return arr.length > 2 ? `${firstTwo}, ...` : firstTwo;
                          }

                          return job.work_location;
                        } catch {
                          return job.work_location;
                        }
                      })()}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Posted:</span>
                    <span>{job.date_posted || "Recently"}</span>
                  </div>
                </div>

                <div className="card-footer">
                  <span className="status-badges published">Published</span>
                  <span className="applicants">{job.applicants || 0} applicants</span>
                </div>

              </motion.div>
            ))}
        </div>

        {backendJobs.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <p>No opportunities found</p>
            <button className="create-opportunity-btn">Create Your First Opportunity</button>
          </div>
        )}
      </div>

      {/* Need Guidence */}
      <motion.div
        className="need_guidence"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
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
            <div className="need_content_img"><img src={need_content_img}></img></div>
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
            <div> <Text className="need_guidence_text">Need Guidence?</Text> <h1 className="need_guidence_title"> Get Winning Tips From <span>Top Mentors</span></h1> </div>
          </Col>
        </Row>
      </motion.div>

      {/*  */}

      {/* top companies */}
      <div className="top_companies">
        <motion.div
          className="elite-title-wrapper"
          initial="hidden"
          whileInView="visible"
          variants={fadeInUp}
          viewport={{ once: true }}
        >
          <h2 className="elite-title">
            <span className="elite-title-text">
              Top Companies Listing on Career Fast
            </span>
          </h2>
        </motion.div>

        <Slider {...companiesSettings} className="elite-job-carousel">
          {loopedCompanies.map((company, index) => (
            <motion.div
              key={`${company.id}-${index}`}
              className="elite-job-slide"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              custom={index}
            >
              <motion.div whileHover={{ scale: 1.05 }}>
                <img
                  src={company.logo}
                  alt={`Company ${company.id}`}
                  className="elite-compay_icons-company-logo"
                />
              </motion.div>
            </motion.div>
          ))}
        </Slider>
      </div>

      {/*  */}

      {/* counting */}
      <div className="counter">
        <Row>
          <Col md={8}>
            <motion.div
              className="counter-card pink-bg"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            ><h2>100K+</h2><p>Listed Jobs & Internships</p><div className="company-logos1"><img src={company_logos1} alt="Jobs Counter" /></div></motion.div>
          </Col>
          <Col md={8}>
            <motion.div
              className="counter-card blue-bg"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            ><h2>25K+</h2><p>Verified Recruiters</p><div className="company-logos2"><img src={company_logos2} alt="Jobs Counter" /></div></motion.div>
          </Col>
          <Col md={8}>
            <motion.div
              className="counter-card yellow-bg"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            ><h2>5.5M+</h2><p>Applications</p><div className="company-logos3"><img src={company_logos3} alt="Jobs Counter" /></div></motion.div>
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
            <div><Text className="need_guidence_text">Stuck Somewhere?</Text><h1 className="need_guidence_title">Learn From <span>Top Courses</span></h1><Text>Upskill, get certified, and stay ahead of the competition with our 50+ trending courses.</Text></div>
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
            <div><img src={need_guidence1}></img> </div>
          </Col>
        </Row>
      </div>
      {/*  */}

      {/* Career Tips Section */}
      <div className={`career-tips ${isVisible ? 'visible' : ''}`}>
        <div className="premium-decoration">
          <div className="decoration-circle circle-1"></div>
          <div className="decoration-circle circle-2"></div>
          <div className="decoration-circle circle-3"></div>
        </div>

        <div className="section-headers">
          <div className="header-decoration">
            <h4>Career Fast Blogs</h4>
          </div>
          <p>Stay updated with the latest blog trends & interview hacks</p>
        </div>

        <Row gutter={[30, 30]}>
          {blogTips.length === 0 ? (
            <Col span={24} style={{ textAlign: "center" }}>
              <h3>No Blogs Found</h3>
              <p style={{ color: "#666" }}>Check back later for new blog updates.</p>
            </Col>
          ) : (
            blogTips.slice(0, visibleBlogs).map((tip, index) => (
              <Col
                xs={24}
                sm={12}
                lg={8}
                key={index}
                className="tip-col"
              >
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                  custom={index}
                  whileHover={{ y: -2, scale: 1.01 }}
                >
                  <Card
                    className="premium-tip-card"
                    cover={
                      <div className="card-image-container">
                        <img alt={tip.blogTitle} src={tip.blogImage} />
                        <div className="image-overlay"></div>
                        <div className="read-time">{tip.readingTime || "3 min read"}</div>
                      </div>
                    }
                    hoverable
                  >
                    <div className="card-contents">
                      <h3>{tip.blogTitle?.slice(0, 60) + "..."}</h3>
                      <p>{tip.overview?.slice(0, 100) + "..."}</p>
                      <a
                        href={`/blog/${generateSlug(tip.blogTitle)}`}
                        className="premium-read-more"
                      >
                        Read More <i className="fas fa-arrow-right"></i>
                      </a>
                    </div>
                  </Card>
                </motion.div>
              </Col>
            ))
          )}
        </Row>
        {visibleBlogs < blogTips.length && (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button
              onClick={loadMoreBlogs}
              className="premium-load-more"
              style={{
                padding: "7px 15px",
                background: "linear-gradient(135deg, #7f5af0 0%, #5f2eea 100%)",
                color: "#fff",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Load More <Loader style={{ marginTop: -2 }} size={16} />
            </button>
          </div>
        )}
        <div className="section-footer">
          <p>Explore more career resources in our <a href="/job-portal">Careerfast</a></p>
        </div>
      </div>


      {/* Post Your Jobs & Internships - CLEAN UI */}
      <motion.div
        className="postJobsContainer"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <Row className="postJobsWrapper">

          {/* Left Content */}
          <Col lg={12} md={24} xs={24} className="postJobsLeft">
            <h2 className="pjTitle">
              Post Your <span>Jobs & Internships</span>
            </h2>

            <p className="pjSubtitle">
              Reach thousands of active job seekers — from fresh graduates to experienced professionals.
              Post your openings and connect with the right talent instantly.
            </p>

            <button
              className="pjPrimaryBtn"
              onClick={() => {
                if (!loginUserId) {
                  message.warning("Please login to post a job");
                  navigate("/login");
                } else if (roleId === 3) {
                  navigate("/post-jobs");
                } else {
                  message.error("Access restricted! Only employers can post jobs.");
                }
              }}
            >
              Get Started
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </Col>

          {/* Right Image */}
          <Col lg={12} md={24} xs={24} className="postJobsRight">
            <div className="pjImageWrapper">
              <img src={post_jobs} alt="Post Jobs" className="pjImage" />
            </div>
          </Col>

        </Row>
      </motion.div>

      {/*  */}
      <Footer />
    </div>
  );
}
