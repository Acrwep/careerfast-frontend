import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Tag,
  Typography,
  Space,
  Button,
  Dropdown,
  Menu,
  Badge,
  Drawer,
  Radio,
  Divider,
  List,
  Switch,
  Input,
  Checkbox,
  Slider,
  Select,
} from "antd";
import {
  ClockCircleOutlined,
  StarFilled,
  ThunderboltFilled,
  CrownFilled,
  FilterOutlined,
  ThunderboltOutlined,
  DownOutlined,
  LaptopOutlined,
  TrophyOutlined,
  BookOutlined,
  ReadOutlined,
  UserOutlined,
  CodeOutlined,
  FileTextOutlined,
  CalendarOutlined,
  ToolOutlined,
  CloseOutlined,
  EnvironmentOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import "../css/JobFilter.css";
import { FaLocationDot, FaTransgender } from "react-icons/fa6";
import { FaRegCalendarAlt } from "react-icons/fa";
import CommonSelectField from "../Common/CommonSelectField";
import { style } from "framer-motion/client";
import { getJobPosts } from "../ApiService/action";
import { DollarOutlined } from "@ant-design/icons";
import { BsDot } from "react-icons/bs";
import { MdOutlineSchool, MdOutlineWorkOutline } from "react-icons/md";
import { CommonToaster } from "../Common/CommonToaster";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { IoMdCalendar } from "react-icons/io";
import { IoIosShareAlt } from "react-icons/io";

const { Title, Text, Link } = Typography;

const FILTER_SECTIONS = [
  { key: "status", label: "Status", count: 1 },
  { key: "type", label: "Type" },
  { key: "timing", label: "Timing" },
  { key: "workdays", label: "Work Days" },
  { key: "usertype", label: "User Type" },
  { key: "category", label: "Category", count: 5 },
  { key: "location", label: "Location" },
];

const workTypes = ["In Office", "Remote", "Field Work", "Hybrid"];
const userTypes = ["Fresher", "Professionals", "College Students"];
const category = [
  "Backend Development",
  "Frontend Development",
  "College Students",
  "Backend Development",
  "Frontend Development",
  "College Students",
  "Backend Development",
  "Frontend Development",
  "College Students",
  "Backend Development",
  "Frontend Development",
  "College Students",
];

export default function JobFilter() {
  const [open, setOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("status");
  const [statusValue, setStatusValue] = useState("Live");

  const [visible, setVisible] = useState(false);
  const [radiusSearch, setRadiusSearch] = useState(false);
  const [radius, setRadius] = useState(50); // default 50km
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [workTypevisible, setWorkTypeVisible] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [userTypevisible, setUserTypeVisible] = useState(false);
  const [selectedCatergory, setSelectedCatergory] = useState(null);
  const [userCatergoryvisible, setUserCatergoryVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState(null);
  const [backendJobs, setBackendJobs] = useState([]);
  const [postDetails, setPostDetails] = useState([]);
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (backendJobs.length > 0 && !postDetails.length) {
      setPostDetails([transformJob(backendJobs[0])]);
    }
  }, [backendJobs]);

  const fetchJobs = async () => {
    const payload = {
      job_categories: "jobCategories",
      workplace_type: "workTypes",
      work_location: "locationsData",
      working_days: "category",
      start_date: "2025-07-01",
      end_date: "2025-07-30",
      salary_sort: "desc",
    };

    try {
      const response = await getJobPosts(payload);
      console.log("getJobPosts", response);

      const jobs = response?.data?.data?.data;
      if (Array.isArray(jobs)) {
        setBackendJobs(jobs);
      } else {
        console.warn("Unexpected job data format", response);
      }
    } catch (error) {
      console.error("getJobPosts error", error);
    }
  };

  const handleCheck = (location) => {
    setSelected((prev) =>
      prev.includes(location)
        ? prev.filter((item) => item !== location)
        : [...prev, location]
    );
  };

  const dropdownItems = () => (
    <Menu style={{ minWidth: 220, padding: "0.5rem 0" }}>
      <Menu.Item key="internships" icon={<LaptopOutlined />}>
        Internships
      </Menu.Item>
      <Menu.Item
        key="jobs"
        icon={<ReadOutlined />}
        style={{ background: "#f0f7ff" }}
      >
        Jobs
      </Menu.Item>
      <Menu.SubMenu
        key="competitions"
        title="Competitions"
        icon={<TrophyOutlined />}
      >
        <Menu.Item key="comp-1">Online</Menu.Item>
        <Menu.Item key="comp-2">Onsite</Menu.Item>
      </Menu.SubMenu>
      <Menu.Item key="mentorship" icon={<UserOutlined />}>
        Mentorship
      </Menu.Item>
      <Menu.SubMenu key="courses" title="Courses" icon={<BookOutlined />}>
        <Menu.Item key="course-1">Tech</Menu.Item>
        <Menu.Item key="course-2">Design</Menu.Item>
      </Menu.SubMenu>
    </Menu>
  );

  const locationsData = [
    { name: "Pune", detail: "Pune, Maharashtra, India" },
    { name: "Gurgaon", detail: "Gurgaon, Haryana, India" },
    { name: "Delhi", detail: "Delhi, Delhi, India" },
    { name: "Bangalore Urban", detail: "Bangalore Urban, Karnataka, India" },
    { name: "Bangalore Rural", detail: "Bangalore Rural, Karnataka, India" },
  ];

  // Create dropdown menu for reusability
  const getDropdownMenu = (label) => (
    <Menu
      items={[
        { label: `${label} Option 1`, key: "1" },
        { label: `${label} Option 2`, key: "2" },
      ]}
    />
  );
  const transformJob = (job) => {
    const postedDate = new Date(job.created_at);
    const today = new Date();
    const timeDiff = today - postedDate;
    const daysPassed = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    const totalActiveDays = 5;
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
          ? "$" + (job.min_salary || "N/A")
          : job.salary_type === "Range"
          ? `${job.min_salary || "N/A"} - ${job.max_salary || "N/A"}`
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
      status: daysLeft > 0 ? "Active" : "Expired",
    };
  };

  const JobCard = ({ job }) => (
    <Card
      className="premium-job-card"
      bodyStyle={{ padding: 0 }}
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
          <span
            className={
              job.status === "Active"
                ? "status-badge"
                : job.status === "Expired"
                ? "status-badge-red"
                : ""
            }
          >
            {job.status}
          </span>
        </div>

        <div className="premium-skills">
          {job.skills.map((skill, index) => (
            <span key={index} className="premium-skill">
              {skill}
            </span>
          ))}
        </div>

        <div className="premium-footer">
          <span className="premium-level">
            {job.level.includes("Leadership") ? (
              <CrownFilled />
            ) : (
              <ThunderboltFilled />
            )}
            {job.level}
          </span>
          <Button
            className={
              job.status === "Active"
                ? "premium-apply"
                : job.status === "Expired"
                ? "premium-apply-disabel"
                : ""
            }
          >
            Apply Now
          </Button>
        </div>
      </div>
    </Card>
  );

  const handleClickedjob = (item) => {
    let arr = [];
    arr.push(item);
    setPostDetails(arr);
  };

  const JobDetails = ({ job }) => {
    console.log("jobbbb", job);
    return (
      <>
        <div className="job-header">
          <div className="job-header-content">
            <img
              className="job-logo"
              src={job.logo}
              alt={`${job.company} logo`}
            />
            <div className="job-title-section">
              <h1 className="job-title">{job.title}</h1>
              <p className="job-company">{job.company}</p>
            </div>
          </div>

          <div className="job-meta">
            <div className="job-location">
              <p className="job-meta-item">
                <FaLocationDot /> {job.location}
              </p>
              <p className="job-meta-item">
                <FaRegCalendarAlt /> Updated: {job.created_date}
              </p>
            </div>
            <Button type="primary" className="apply-button" size="large">
              Apply Now
            </Button>
          </div>
        </div>

        <div className="section-card">
          <div className="job-eligibility">
            <h2 className="section-title">Eligibility</h2>
            <p>{job.eligibility}</p>
          </div>
        </div>

        <div className="section-card job-description">
          <h2 className="section-title">Job Description</h2>
          <h6>Xerox is hiring for the role of Python Developer!</h6>
          <ul>
            Responsibilities of the Candidate:
            <li>
              Builds knowledge of the organization, processes and customers.
            </li>
            <li>
              Requires knowledge and experience in own discipline; still
              acquiring higher level knowledge and skills.
            </li>
            <li>Receives a moderate level of guidance and direction.</li>
            <li>
              Moderate decision-making authority guided by policies, procedures,
              and business operations protocol.
            </li>
          </ul>

          <ul>
            Requirements:
            <li>Will need to be strong on ML pipelines, modern tech stack.</li>
            <li>Proven experience with MLOPs with Azure and MLFlow etc.</li>
            <li>Experience with scripting and coding using Python.</li>
            <li>
              Working Experience with container technologies (Docker,
              Kubernetes).
            </li>
          </ul>
        </div>
      </>
    );
  };

  const renderLocation = () => {
    return (
      <div style={{ width: 300, padding: 16, background: "#fff" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <Text strong>Location</Text>
          <Button
            type="link"
            size="small"
            danger
            onClick={() => setSelected([])}
          >
            Clear
          </Button>
        </div>

        {/* Toggle */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <div>
            <Text strong>Use Radius Search</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Find nearby by Jobs
            </Text>
          </div>
          <Switch checked={radiusSearch} onChange={setRadiusSearch} />
        </div>

        {/* Conditional Slider */}
        {radiusSearch && (
          <div style={{ marginBottom: 16 }}>
            <Slider
              min={5}
              max={200}
              step={5}
              value={radius}
              onChange={setRadius}
              tooltip={{ formatter: (value) => `${value}km` }}
            />
          </div>
        )}

        {/* Search */}
        <Input
          placeholder="Search location"
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginBottom: 12 }}
        />

        {/* Location list */}
        <List
          dataSource={locationsData.filter((item) =>
            item.name.toLowerCase().includes(search.toLowerCase())
          )}
          style={{ maxHeight: 200, overflowY: "auto" }}
          renderItem={(item) => (
            <List.Item style={{ padding: "4px 0" }}>
              <Checkbox
                checked={selected.includes(item.name)}
                onChange={() => handleCheck(item.name)}
              >
                <div>
                  <Text>
                    <EnvironmentOutlined style={{ marginRight: 6 }} />
                    {item.name}
                  </Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {item.detail}
                  </Text>
                </div>
              </Checkbox>
            </List.Item>
          )}
        />

        <Divider style={{ margin: "12px 0" }} />

        {/* Apply Button */}
        <div style={{ textAlign: "right" }}>
          <Button type="primary" className="apply_filter" shape="round">
            Apply Filter →
          </Button>
        </div>
      </div>
    );
  };

  const handleCheckboxChange = (checkedValue) => {
    setSelectedTypes((prev) =>
      prev.includes(checkedValue)
        ? prev.filter((item) => item !== checkedValue)
        : [...prev, checkedValue]
    );
  };

  const handleClear = () => {
    setSelectedTypes([]);
  };

  const handleApply = () => {
    console.log("Selected Work Types:", selectedTypes);
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
              checked={selectedTypes.includes(type)}
              onChange={() => handleCheckboxChange(type)}
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
        onClick={handleApply}
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
    setUserTypeVisible(false);
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

  const handleUserCatergoryClear = () => {
    setSelectedCatergory(null);
  };

  const handleUserCatergoryApply = () => {
    console.log("Selected Catergory:", selectedCatergory);
    setUserCatergoryVisible(false);
  };

  const userCatergory = () => (
    <div style={{ padding: 16, width: 220, background: "#fff" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <strong>Catergory</strong>
        <a onClick={handleUserCatergoryClear} style={{ color: "#f5222d" }}>
          Clear
        </a>
      </div>
      <Radio.Group
        onChange={(e) => setSelectedCatergory(e.target.value)}
        value={selectedCatergory}
        className="custom-radio"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          maxHeight: "200px",
          overflowY: "scroll",
        }}
      >
        {category.map((Catergory) => (
          <Radio key={Catergory} value={Catergory}>
            {Catergory}
          </Radio>
        ))}
      </Radio.Group>
      <Divider style={{ margin: "12px 0" }} />
      <Button
        type="primary"
        shape="round"
        className="apply_filter"
        block
        onClick={handleUserCatergoryApply}
      >
        Apply Filter
      </Button>
    </div>
  );

  // filter

  const handleChange = (value) => {
    setSelectedSort(value);
  };

  const clearSort = () => {
    setSelectedSort(null);
  };

  const handleWishlistToggle = () => {
    setWishlisted(!wishlisted);
    // Show toast notification
    if (wishlisted === false) {
      CommonToaster("Added to wishlist ❤️", "success");
    } else {
      CommonToaster("Removed from wishlist 💔", "error");
    }
  };

  return (
    <section
      className="job_filter"
      style={{
        padding: "20px 60px 48px 60px",
        background:
          "linear-gradient(135deg, rgb(247 247 247) 0%, rgb(244 238 255) 100%)",
      }}
    >
      <div
        className="job-filter-topbar"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "16px 24px",
          borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
          backgroundColor: "#fff",
          flexWrap: "wrap",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
          borderRadius: "12px 12px 0 0",
          marginBottom: 15,
        }}
      >
        {/* Primary Filter Dropdown */}
        <Dropdown
          popupRender={dropdownItems}
          trigger={["click"]}
          placement="bottomLeft"
          overlayStyle={{
            borderRadius: 12,
            boxShadow: "0 4px 24px rgba(0, 0, 0, 0.12)",
            padding: "8px 0",
          }}
        >
          <Button className="job-filter-job" shape="round" type="primary">
            <Space>
              <span style={{ fontWeight: 500 }}>Jobs</span>
              <DownOutlined style={{ fontSize: 12 }} />
            </Space>
          </Button>
        </Dropdown>

        {/* Salary Filter */}
        <>
          {selectedSort ? (
            <Button
              shape="round"
              type="default"
              style={{
                border: "1px solid #4f46e5",
                backgroundColor: "#fff",
                color: "#1e293b",
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
              // label={false}
              style={{
                border: "1px solid rgba(0, 0, 0, 0.08)",
                background: "#fff",
                padding: "0 5px",
                height: 36,
                borderRadius: 20,
                color: "#2d3748",
                fontWeight: 500,
                marginBottom: 0,
              }}
              name="experiencemonth"
              onChange={handleChange}
              placeholder="Select Salary Filter"
              options={[
                {
                  id: 1,
                  label: "Salary (High to Low)",
                },
                {
                  id: 2,
                  label: "Salary (Low to High)",
                },
              ]}
              showSearch={true}
            />
          )}
        </>

        {/* Main Filters Button */}
        <Button
          shape="round"
          icon={<FilterOutlined style={{ fontSize: 14 }} />}
          onClick={() => setOpen(true)}
          style={{
            border: "1px solid rgba(0, 0, 0, 0.08)",
            background: "#fff",
            padding: "0 16px",
            height: 36,
            color: "#2d3748",
            fontWeight: 500,
          }}
        >
          <Space>
            Filters
            <Badge
              count={6}
              offset={[-4, 0]}
              style={{
                backgroundColor: "#4f46e5",
                boxShadow: "0 0 0 1px #fff",
              }}
            />
          </Space>
        </Button>

        {/* Filters Drawer */}
        <Drawer
          title={
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <FilterOutlined style={{ color: "#4f46e5" }} />
              <span style={{ fontWeight: 600 }}>Filters</span>
            </div>
          }
          placement="right"
          width={600}
          onClose={() => setOpen(false)}
          open={open}
          closable={true}
          closeIcon={<CloseOutlined style={{ color: "#64748b" }} />}
          headerStyle={{ borderBottom: "1px solid rgba(0, 0, 0, 0.05)" }}
          bodyStyle={{ padding: 0 }}
          footerStyle={{ borderTop: "1px solid rgba(0, 0, 0, 0.05)" }}
          footer={
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 24px",
              }}
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => {
                  // Clear all filters logic
                }}
              >
                Clear All
              </Button>
              <Button
                type="primary"
                shape="round"
                style={{
                  background:
                    "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                  border: "none",
                  padding: "0 24px",
                  height: 40,
                  fontWeight: 500,
                }}
                onClick={() => setOpen(false)}
              >
                Show Results
              </Button>
            </div>
          }
        >
          <div style={{ display: "flex", height: "100%" }}>
            {/* Left Navigation */}
            <div
              style={{
                width: 200,
                borderRight: "1px solid rgba(0, 0, 0, 0.05)",
                padding: "16px 0",
              }}
            >
              <List
                itemLayout="horizontal"
                dataSource={FILTER_SECTIONS}
                renderItem={(item) => (
                  <List.Item
                    style={{
                      background:
                        activeFilter === item.key
                          ? "rgba(79, 70, 229, 0.05)"
                          : "transparent",
                      borderRadius: 6,
                      margin: "0 12px 4px 12px",
                      padding: "10px 12px",
                      cursor: "pointer",
                      borderLeft:
                        activeFilter === item.key
                          ? "3px solid #4f46e5"
                          : "3px solid transparent",
                    }}
                    onClick={() => setActiveFilter(item.key)}
                  >
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          color:
                            activeFilter === item.key ? "#4f46e5" : "#2d3748",
                          fontWeight: activeFilter === item.key ? 500 : 400,
                        }}
                      >
                        {item.label}
                      </Text>
                      {item.count && (
                        <Badge
                          count={item.count}
                          size="small"
                          style={{
                            backgroundColor:
                              activeFilter === item.key ? "#4f46e5" : "#e2e8f0",
                            color:
                              activeFilter === item.key ? "#fff" : "#2d3748",
                          }}
                        />
                      )}
                    </div>
                  </List.Item>
                )}
              />
            </div>

            {/* Right Content */}
            <div
              style={{
                flex: 1,
                padding: "24px",
                overflowY: "auto",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 24,
                }}
              >
                <Title
                  level={5}
                  style={{
                    margin: 0,
                    color: "#1e293b",
                    fontWeight: 600,
                  }}
                >
                  {FILTER_SECTIONS.find((f) => f.key === activeFilter)?.label}
                </Title>
                <Button
                  type="text"
                  size="small"
                  danger
                  onClick={() => {
                    // Clear current filter logic
                  }}
                >
                  Clear
                </Button>
              </div>

              {activeFilter === "status" && (
                <Radio.Group
                  className="custom-radio"
                  onChange={(e) => setStatusValue(e.target.value)}
                  value={statusValue}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                  }}
                >
                  {["Live", "Expired", "Registrations Closed", "Recent"].map(
                    (option) => (
                      <Radio
                        key={option}
                        value={option}
                        style={{
                          margin: 0,
                          padding: "12px 16px",
                          borderRadius: 8,
                          border:
                            statusValue === option
                              ? "1px solid #4f46e5"
                              : "1px solid rgba(0, 0, 0, 0.08)",
                          backgroundColor:
                            statusValue === option
                              ? "rgba(79, 70, 229, 0.05)"
                              : "#fff",
                        }}
                      >
                        {option}
                      </Radio>
                    )
                  )}
                </Radio.Group>
              )}

              {/* Additional filter sections would go here */}
            </div>
          </div>
        </Drawer>

        {/* Location Filter */}
        <Dropdown
          popupRender={renderLocation}
          trigger={["click"]}
          open={visible}
          onOpenChange={(flag) => setVisible(flag)}
          overlayStyle={{
            borderRadius: 12,
            boxShadow: "0 4px 24px rgba(0, 0, 0, 0.12)",
            padding: "8px 0",
          }}
        >
          <Button
            shape="round"
            style={{
              border: "1px solid rgba(0, 0, 0, 0.08)",
              background: "#fff",
              padding: "0 16px",
              height: 36,
              color: "#2d3748",
              fontWeight: 500,
            }}
          >
            <Space>
              Location
              <DownOutlined style={{ fontSize: 12, color: "#64748b" }} />
            </Space>
          </Button>
        </Dropdown>

        {/* Work Type Filter */}
        <Dropdown
          popupRender={dropdownContent}
          trigger={["click"]}
          open={workTypevisible}
          onOpenChange={(flag) => setWorkTypeVisible(flag)}
          overlayStyle={{
            borderRadius: 12,
            boxShadow: "0 4px 24px rgba(0, 0, 0, 0.12)",
            padding: "8px 0",
          }}
        >
          <Button
            shape="round"
            style={{
              border: "1px solid rgba(0, 0, 0, 0.08)",
              background: "#fff",
              padding: "0 16px",
              height: 36,
              color: "#2d3748",
              fontWeight: 500,
            }}
          >
            <Space>
              Work Type
              <DownOutlined style={{ fontSize: 12, color: "#64748b" }} />
            </Space>
          </Button>
        </Dropdown>

        {/*Category */}
        <Dropdown
          popupRender={userCatergory}
          trigger={["click"]}
          open={userCatergoryvisible}
          onOpenChange={(flag) => setUserCatergoryVisible(flag)}
          overlayStyle={{
            borderRadius: 12,
            boxShadow: "0 4px 24px rgba(0, 0, 0, 0.12)",
            padding: "8px 0",
          }}
        >
          <Button
            shape="round"
            style={{
              border: "1px solid rgba(0, 0, 0, 0.08)",
              background: "#fff",
              padding: "0 16px",
              height: 36,
              color: "#2d3748",
              fontWeight: 500,
            }}
          >
            <Space>
              Category
              <DownOutlined style={{ fontSize: 12, color: "#64748b" }} />
            </Space>
          </Button>
        </Dropdown>

        {/* Quick Apply Button */}
        <div style={{ marginLeft: "auto" }}>
          <Button
            shape="round"
            icon={<ThunderboltOutlined style={{ color: "#f59e0b" }} />}
            style={{
              border: "1px solid rgba(0, 0, 0, 0.08)",
              background: "#fff",
              padding: "0 20px",
              height: 36,
              color: "#fff",
              fontWeight: 500,
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)",
              background:
                "linear-gradient(135deg, rgb(79, 70, 229) 0%, rgb(124, 58, 237) 100%)",
            }}
          >
            <Space>Quick Apply</Space>
          </Button>
        </div>
      </div>

      <div>
        <Row gutter={32}>
          <Col className="job_filter_left" lg={7} xs={24} md={8}>
            <Space direction="vertical" size={24} style={{ width: "100%" }}>
              {backendJobs.map((job) => (
                <JobCard key={job.id} job={transformJob(job)} />
              ))}
            </Space>
          </Col>
          <Col className="job_filter_left" lg={17} xs={24} md={16}>
            {postDetails.map((job) => (
              <>
                <div className="job-header">
                  <div className="job-header-content">
                    <img
                      className="job-logo"
                      src={job.logo}
                      alt={`${job.company} logo`}
                    />
                    <div className="job-title-section">
                      <h1 className="job-title">{job.title}</h1>
                      <p className="job-company">{job.company}</p>
                    </div>

                    <div className="quick_apply_btn">
                      <>
                        <div className="icons">
                          <span className="icon" onClick={handleWishlistToggle}>
                            {wishlisted ? (
                              <FaHeart className="icon heart active" />
                            ) : (
                              <FaRegHeart className="icon heart" />
                            )}
                          </span>
                          <span className="icon">
                            {" "}
                            <IoMdCalendar className="icon calendar" />
                          </span>
                        </div>
                      </>
                    </div>
                  </div>

                  <div className="job-meta">
                    <div className="job-location">
                      <p className="job-meta-item">
                        <FaLocationDot /> {job.location}
                      </p>
                      <p className="job-meta-item">
                        <FaRegCalendarAlt /> Updated: {job.created_date}
                      </p>
                    </div>
                    <Button
                      type="primary"
                      className="apply-button"
                      size="large"
                    >
                      Apply Now
                    </Button>
                  </div>
                </div>

                <div className="section-card">
                  <div className="job-eligibility">
                    <h2 className="section-title">Eligibility</h2>
                    <p>
                      <MdOutlineSchool /> {job.level}
                      <b> • </b> <MdOutlineWorkOutline /> {job.eligibility}{" "}
                      <b> • </b>
                      <FaTransgender />{" "}
                      {job.diversity_hiring.map((diversity_hiring, index) => (
                        <span key={index}>
                          {diversity_hiring}
                          {index < job.diversity_hiring.length - 1 && ", "}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>

                <div className="section-card job-description">
                  <h2 className="section-title">Job Description</h2>
                  <h6>Xerox is hiring for the role of Python Developer!</h6>
                  <div
                    className="job-description-content"
                    dangerouslySetInnerHTML={{ __html: job.job_description }}
                  />
                </div>

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
              </>
            ))}
          </Col>
        </Row>
      </div>
    </section>
  );
}
