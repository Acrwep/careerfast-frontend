import { useEffect, useState, useCallback } from "react";
import React from "react";
import { useParams } from "react-router-dom";
import {
  IoQrCode,
  IoNotifications,
  IoSettingsSharp,
  IoLogOutOutline,
  IoPersonCircleOutline,
} from "react-icons/io5";
import { ArrowRightOutlined, PieChartOutlined } from "@ant-design/icons";
import { FaInstagram, FaTwitter } from "react-icons/fa";
import {
  FaClipboardUser,
  FaFacebook,
  FaBehance,
  FaDribbble,
} from "react-icons/fa6";
import { MdOutlineModeEdit, MdDashboard } from "react-icons/md";
import { FaChevronDown } from "react-icons/fa";
import { VscGraph } from "react-icons/vsc";
import "../css/AdminDashboard.css";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  LabelList,
} from "recharts";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  MailOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  LinkedinOutlined,
  PhoneOutlined,
  UserOutlined,
  CalendarOutlined,
  BankOutlined,
  ApartmentOutlined,
  ExperimentOutlined,
  FieldTimeOutlined,
  FileTextOutlined,
  TrophyOutlined,
  SwapOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  Layout,
  Menu,
  Space,
  theme,
  Typography,
  Card,
  Col,
  Row,
  Statistic,
  Tag,
  List,
  Timeline,
  Drawer,
  message,
  Skeleton,
  Alert,
  Tooltip,
} from "antd";
import ManageCandidate from "./ManageCandidate";
import EditOpportunity from "./EditOpportunity";
import JobDetails from "../JobPortal/JobDetails";
import RegistrationChart from "./RegistrationChart";
import ManageNotification from "./ManageNotification";

import {
  getAllCandidateByRecruiter,
  getAppliedCandidatesCount,
  getJobAppliedCandidates,
  getJobPosts,
  getUserProfile,
} from "../ApiService/action";
import { requestForToken } from "../firebase/fireBase";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;


export default function AdminDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const { id } = useParams();
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const [loginUserId, setLoginUserId] = useState(null);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [role_name, setRoleName] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();
  const [postDetails, setPostDetails] = useState([]);
  const [maleCount, setMaleCount] = useState(null);
  const [femaleCount, setFemaleCount] = useState(null);
  const [othersCount, setOthersCount] = useState(null);
  const [totalAppliedCandidates, setTotalAppliedCandidates] = useState(null);
  const [domainCount, setDomainCount] = useState([]);
  const [allAppliedUsers, setAllAppliedUsers] = useState([])

  const handleLogout = () => {
    localStorage.removeItem("loginDetails");
    setLoginUserId(null);
    navigate("/login");
    message.error("Your'e logged out");
  };

  const getUserProfileData = useCallback(async () => {
    const payload = {
      user_id: loginUserId,
    };

    try {
      const response = await getUserProfile(payload);
      const image = response?.data?.data?.profile_image || "";
      setProfileImage(image);
    } catch (error) {
      console.log("getuserprofile erroxxr", error);
    }
  }, [loginUserId]);

  const getJobPostsData = useCallback(async () => {
    const payload = {};
    try {
      const response = await getJobPosts(payload);
      const jobs = response?.data?.data?.data || [];
      console.log("jobsss", jobs);
      setPostDetails(jobs);
      console.log("job post", response);
    } catch (error) {
      console.log("applied candidate", error);
    }
  }, []);

  const getAllCandidateByRecruiterData = useCallback(async () => {
    const payload = {
      user_id: loginUserId
    }

    try {
      const response = await getAllCandidateByRecruiter(payload);
      setAllAppliedUsers(response?.data?.data || [])
      console.log("getAllCandidateByRecruiter", response)
    } catch (error) {
      console.log("getAllCandidateByRecruiter", error)
    }
  }, [loginUserId]);

  const getJobAppliedCandidatesData = useCallback(async () => {
    setLoading(true);

    if (!id) {
      console.warn("Post ID is missing");
      setLoading(false);
      return;
    }

    const payload = { post_id: id };
    try {
      const response = await getJobAppliedCandidates(payload);
      console.log("getJobAppliedCandidates", response)
    } catch (error) {
      console.error("Error fetching applied candidates:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 700);
    }
  }, [id]);

  const getAppliedCandidatesCountData = useCallback(async () => {
    const payload = {
      user_id: loginUserId,
      id: id,
    };

    try {
      const response = await getAppliedCandidatesCount(payload);
      setTotalAppliedCandidates(response?.data?.data?.candidatesCount || 0);
      setMaleCount(response?.data?.data?.males || null);
      setFemaleCount(response?.data?.data?.females || null);
      setOthersCount(response?.data?.data?.others || null);
      setDomainCount(
        (response?.data?.data?.domain_stats || []).map((item) => ({
          domain: item.job_categories,
          value: item.candidates_count,
        }))
      );

      console.log("getAppliedCandidatesCount", response);
    } catch (error) {
      console.log("getAppliedCandidatesCount", error);
    }
  }, [loginUserId, id]);

  const handleGetUserProfile = async (userId) => {
    const payload = {
      user_id: userId,
    };

    try {
      const response = await getUserProfile(payload);
      setOpen(true);
      setDrawerLoading(true);
      setSelectedUser(response?.data?.data || null);
      console.log("User Profile data", response);
      setTimeout(() => {
        setDrawerLoading(false);
      }, 2000);
    } catch (error) {
      console.log("User Profile data", error);
      setSelectedUser(null);
    }
  };

  useEffect(() => {
    console.log("Post ID from URL:", id);
  }, [id]);

  useEffect(() => {
    // handled by Helmet
    getJobPostsData();
  }, [getJobPostsData]);

  useEffect(() => {
    // 🔹 Save/update recruiter FCM token when dashboard loads
    requestForToken();
  }, []);

  useEffect(() => {
    if (loginUserId) {
      getAppliedCandidatesCountData();
    }
  }, [loginUserId, getAppliedCandidatesCountData]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("loginDetails");
      console.log("login details", stored);
      if (stored) {
        const loginDetails = JSON.parse(stored);
        setLoginUserId(loginDetails.id);
        setFname(loginDetails.first_name);
        setLname(loginDetails.last_name);
        setRoleName(loginDetails.role_name);

        if (loginDetails.role_id === 2) {
          navigate("/job-portal");
          return;
        }
      }
    } catch (error) {
      console.error("Invalid JSON in localStorage", error);
    }
  }, [navigate]);

  useEffect(() => {
    if (loginUserId) {
      getUserProfileData();
    }
  }, [loginUserId, getUserProfileData]);

  useEffect(() => {
    if (loginUserId) {
      getAllCandidateByRecruiterData()
    }
  }, [loginUserId, getAllCandidateByRecruiterData]);

  useEffect(() => {
    if (activeTab === "1" && id) {
      getJobAppliedCandidatesData();
    }
  }, [activeTab, id, getJobAppliedCandidatesData]);

  const menuItems = [
    {
      key: "1",
      icon: <MdDashboard size={18} />,
      label: "Dashboard (Overall)",
    },
    {
      key: "2",
      icon: <FaClipboardUser size={16} />,
      label: "Manage Candidates",
    },
    {
      key: "3",
      icon: <MdOutlineModeEdit size={18} />,
      label: "Edit Opportunity",
    },
    {
      key: "5",
      icon: <VscGraph size={17} />,
      label: "Opportunity Stats",
    },
    {
      key: "6",
      icon: <IoNotifications size={18} />,
      label: "Manage Notifications",
    },
  ];

  const userMenu = (
    <Menu
      items={[
        {
          key: "1",
          label: (
            <div onClick={() => navigate("/admin-profile")}>
              <IoPersonCircleOutline size={16} style={{ marginRight: 8 }} />
              Profile
            </div>
          ),
        },
        {
          key: "2",
          label: (
            <div onClick={() => navigate("/settings")}>
              <IoSettingsSharp size={16} style={{ marginRight: 8 }} />
              Settings
            </div>
          ),
        },
        {
          type: "divider",
        },
        {
          key: "3",
          label: (
            <div onClick={handleLogout}>
              <IoLogOutOutline size={16} style={{ marginRight: 8 }} />
              Logout
            </div>
          ),
          danger: true,
        },
      ]}
    />
  );

  const ChartCard = styled(Card)`
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    margin-bottom: 24px;
    border: none;
    .ant-card-head {
      border-bottom: 1px solid #f0f0f0;
    }
  `;

  const genderData = [
    { name: "Female", value: femaleCount || 0 },
    { name: "Male", value: maleCount || 0 },
    { name: "Other", value: othersCount || 0 },
  ];

  const COLORS = ["#EC4899", "#6366F1", "#94A3B8"];
  const COLORS1 = ["#6366F1", "#EC4899", "#94A3B8"];
  const renderCustomizedLabel = ({ percent, x, y }) => (
    <text
      x={x}
      y={y}
      fill="#334155"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fontWeight={500}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Card size="small" style={{ borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} bordered={false}>
          {label && (
            <div style={{ marginBottom: 8, fontWeight: "600", color: "#475569" }}>
              {label}
            </div>
          )}
          {payload.map((entry, index) => (
            <div key={index} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: entry.color || entry.payload.fill || "#6366F1",
                }}
              />
              <Text strong style={{ color: "#1e293b" }}>
                {entry.name}:
              </Text>
              <Text style={{ color: "#64748b" }}>{entry.value}</Text>
            </div>
          ))}
        </Card>
      );
    }
    return null;
  };

  const recentJobs = postDetails.filter((job) => {
    const createdDate = new Date(job.created_at);
    const currentDate = new Date();
    const diffDays = Math.floor(
      (currentDate - createdDate) / (1000 * 60 * 60 * 24)
    );
    return diffDays <= 15;
  });

  const expiredJobs = postDetails.filter((job) => {
    const createdDate = new Date(job.created_at);
    const currentDate = new Date();
    const diffDays = Math.floor(
      (currentDate - createdDate) / (1000 * 60 * 60 * 24)
    );
    return diffDays >= 15;
  });

  return (
    <Layout className="admin-dashboard" style={{ minHeight: "100vh" }}>

      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={280}
        style={{
          background: "linear-gradient(180deg, #1a2a3a 0%, #0f1a23 100%)",
          boxShadow: "5px 0 15px rgba(0,0,0,0.1)",
          position: "fixed",
          height: "100vh",
          zIndex: 100,
        }}
      >
        <div
          className="logo-container"
          style={{
            height: 72,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {collapsed ? (
            <div
              style={{
                width: 40,
                height: 40,
                background:
                  "linear-gradient(135deg, #7f5af0 0%, #5f2eea 50%, #4b1ea0 100%)",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Title level={3} style={{ color: "#fff", margin: 0 }}>
                A
              </Title>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "0 16px",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  background:
                    "linear-gradient(135deg, #7f5af0 0%, #5f2eea 50%, #4b1ea0 100%)",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Title level={3} style={{ color: "#fff", margin: 0 }}>
                  A
                </Title>
              </div>
              <Title level={3} style={{ color: "#fff", margin: 0 }}>
                Admin <span style={{ color: "#5f2eea" }}>View</span>
              </Title>
            </div>
          )}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["5"]}
          items={menuItems}
          style={{
            background: "transparent",
            padding: "30px 10px",
            borderRight: "none",
          }}
          onClick={({ key }) => setActiveTab(key)}
          inlineIndent={16}
        />

        {!collapsed && (
          <div
            style={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              padding: "16px",
              background: "rgba(0,0,0,0.3)",
              borderTop: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Avatar
                size={48}
                src={profileImage}
                style={{ marginRight: 12, border: "none" }}
              />
              <div>
                <Text strong style={{ color: "#fff", display: "block" }}>
                  {fname} {lname}
                </Text>
                <Text
                  type="secondary"
                  style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}
                >
                  {role_name}
                </Text>
              </div>
            </div>
          </div>
        )}
      </Sider>

      <Layout
        style={{
          marginLeft: collapsed ? 80 : 280,
          transition: "all 0.2s",
          background: "#f5f7fa",
        }}
      >
        <Header
          style={{
            padding: "0 24px",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 1px 10px 0 rgba(0,0,0,0.05)",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 48,
                height: 48,
              }}
            />
          </div>

          <Space size="large">
            <Badge count={12} size="small" color={colorPrimary}>
              <Button
                type="text"
                icon={<BellOutlined style={{ fontSize: 20 }} />}
                shape="circle"
                style={{ width: 35, height: 35 }}
              />
            </Badge>
            <Badge count={12} size="small" color="#52c41a">
              <Button
                type="text"
                icon={<MailOutlined style={{ fontSize: 20 }} />}
                shape="circle"
                style={{ width: 35, height: 35 }}
              />
            </Badge>

            <Dropdown overlay={userMenu} placement="bottomRight">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  padding: "8px 12px",
                  borderRadius: 8,
                  background:
                    "linear-gradient(135deg, #7f5af038 0%, #6c41e752 50%, #4b1ea04f 100%)",
                }}
              >
                <Avatar
                  size={36}
                  src={profileImage}
                  style={{ marginRight: 8 }}
                />
                {!collapsed && (
                  <>
                    <Text strong>
                      {fname} {lname}
                    </Text>
                    <FaChevronDown
                      style={{ marginLeft: 8, fontSize: 12, color: "#666" }}
                    />
                  </>
                )}
              </div>
            </Dropdown>
          </Space>
        </Header>
        {String(activeTab) === "1" && (
          <Content
            style={{
              margin: "24px 16px",
              padding: "24px 34px",
              minHeight: 280,
              background: "transparent",
            }}
          >
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 5,
                }}
              >
                <Title level={2} style={{ margin: 0 }}>
                  Hello {fname} {lname}! 👋
                </Title>
              </div>
              <div>
                <Tooltip title="Overall summary details">
                  <Alert
                    style={{
                      marginTop: 3,
                      marginBottom: 20,
                      fontSize: 12,
                      border: "none",
                      display: "inline-flex",
                    }}
                    message="Here is the summary of overall performance"
                    type="warning"
                    showIcon
                  />
                </Tooltip>
              </div>

              <Row gutter={[24, 24]} style={{ marginBottom: 44 }}>
                <Col xs={24} sm={12} md={6}>
                  <Tooltip
                    color="#f6faff"
                    key="#000"
                    title={
                      <span style={{ color: "#1677ff" }}>
                        View all applied candidates
                      </span>
                    }
                  >
                    <Card
                      onClick={() => navigate("/applied-candidates-all")}
                      hoverable
                      style={{
                        background:
                          "linear-gradient(135deg, #f6faff 0%, #e6f4ff 100%)",
                        border: "none",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
                        borderRadius: 12,
                      }}
                    >
                      {loading ? (
                        <>
                          <Skeleton.Input
                            active
                            style={{ width: 120, height: 32, marginBottom: 12 }}
                          />
                          <Skeleton
                            paragraph={{ rows: 1, width: "60%" }}
                            active
                          />
                        </>
                      ) : (
                        <>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 12,
                            }}
                          >
                            <div
                              style={{
                                backgroundColor: "white",
                                padding: 8,
                                borderRadius: "50%",
                                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                              }}
                            >
                              <IoQrCode
                                style={{ color: colorPrimary, fontSize: 24 }}
                              />
                            </div>
                            <Statistic
                              title={
                                <Text type="secondary">Total Candidates</Text>
                              }
                              value={totalAppliedCandidates}
                              valueStyle={{
                                color: colorPrimary,
                                fontWeight: 600,
                                fontSize: 24,
                              }}
                            />
                          </div>
                          <div style={{ marginTop: 6 }}>
                            <Text type="secondary">
                              <span
                                style={{ color: "#52c41a", fontWeight: "bold" }}
                              >
                                +12.5%
                              </span>{" "}
                              from last month
                            </Text>
                          </div>
                        </>
                      )}
                    </Card>
                  </Tooltip>
                </Col>

                {/* Active Jobs */}
                <Col xs={24} sm={12} md={6}>
                  <Tooltip
                    color="#f6ffed  "
                    key="#000"
                    title={
                      <span style={{ color: "#52c41a" }}>
                        View all active jobs
                      </span>
                    }
                  >
                    <Card
                      onClick={() => {
                        localStorage.setItem("activeAdminTab", "listing");
                        localStorage.setItem("listingOrder", "topBottom"); // add this
                        navigate("/admin-profile");
                      }}
                      hoverable
                      style={{
                        background:
                          "linear-gradient(135deg, #f6ffed 0%, #e6ffd7 100%)",
                        border: "none",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
                        borderRadius: 12,
                      }}
                    >
                      {loading ? (
                        <>
                          <Skeleton.Input
                            active
                            style={{ width: 100, height: 32, marginBottom: 12 }}
                          />
                          <Skeleton
                            paragraph={{ rows: 1, width: "50%" }}
                            active
                          />
                        </>
                      ) : (
                        <>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 12,
                            }}
                          >
                            <div
                              style={{
                                backgroundColor: "white",
                                padding: 8,
                                borderRadius: "50%",
                                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                              }}
                            >
                              <FaClipboardUser
                                style={{ color: "#52c41a", fontSize: 24 }}
                              />
                            </div>
                            <Statistic
                              title={<Text type="secondary">Active Jobs</Text>}
                              value={recentJobs.length}
                              valueStyle={{
                                color: "#52c41a",
                                fontWeight: 600,
                                fontSize: 24,
                              }}
                            />
                          </div>
                          <div style={{ marginTop: 6 }}>
                            <Text type="secondary">
                              <span
                                style={{ color: "#52c41a", fontWeight: "bold" }}
                              >
                                +3
                              </span>{" "}
                              new this week
                            </Text>
                          </div>
                        </>
                      )}
                    </Card>
                  </Tooltip>
                </Col>

                {/* Interviews */}
                <Col xs={24} sm={12} md={6}>
                  <Tooltip
                    color="#fffbe6"
                    key="#000"
                    title={
                      <span style={{ color: "#faad14" }}>
                        View all interviews candidates
                      </span>
                    }
                  >
                    <Card
                      hoverable
                      style={{
                        background:
                          "linear-gradient(135deg, #fffbe6 0%, #fff1b8 100%)",
                        border: "none",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
                        borderRadius: 12,
                      }}
                    >
                      {loading ? (
                        <>
                          <Skeleton.Input
                            active
                            style={{ width: 100, height: 32, marginBottom: 12 }}
                          />
                          <Skeleton
                            paragraph={{ rows: 1, width: "50%" }}
                            active
                          />
                        </>
                      ) : (
                        <>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 12,
                            }}
                          >
                            <div
                              style={{
                                backgroundColor: "white",
                                padding: 8,
                                borderRadius: "50%",
                                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                              }}
                            >
                              <VscGraph
                                style={{ color: "#faad14", fontSize: 24 }}
                              />
                            </div>
                            <Statistic
                              title={<Text type="secondary">Interviews</Text>}
                              value={156}
                              valueStyle={{
                                color: "#faad14",
                                fontWeight: 600,
                                fontSize: 24,
                              }}
                            />
                          </div>
                          <div style={{ marginTop: 6 }}>
                            <Text type="secondary">
                              <span
                                style={{ color: "#ff4d4f", fontWeight: "bold" }}
                              >
                                -8
                              </span>{" "}
                              from last week
                            </Text>
                          </div>
                        </>
                      )}
                    </Card>
                  </Tooltip>
                </Col>

                {/* Pending Actions */}
                <Col xs={24} sm={12} md={6}>
                  <Tooltip
                    color="#fff2f0"
                    key="#000"
                    title={
                      <span style={{ color: "#ff4d4f" }}>
                        View all expired candidates
                      </span>
                    }
                  >
                    <Card
                      onClick={() => {
                        localStorage.setItem("activeAdminTab", "listing");
                        localStorage.setItem("listingOrder", "bottomTop"); // add this
                        navigate("/admin-profile");
                      }}
                      hoverable
                      style={{
                        background:
                          "linear-gradient(135deg, #fff2f0 0%, #ffccc7 100%)",
                        border: "none",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
                        borderRadius: 12,
                      }}
                    >
                      {loading ? (
                        <>
                          <Skeleton.Input
                            active
                            style={{ width: 100, height: 32, marginBottom: 12 }}
                          />
                          <Skeleton
                            paragraph={{ rows: 1, width: "50%" }}
                            active
                          />
                        </>
                      ) : (
                        <>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 12,
                            }}
                          >
                            <div
                              style={{
                                backgroundColor: "white",
                                padding: 8,
                                borderRadius: "50%",
                                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                              }}
                            >
                              <IoNotifications
                                style={{ color: "#ff4d4f", fontSize: 24 }}
                              />
                            </div>
                            <Statistic
                              title={<Text type="secondary">Expired Jobs</Text>}
                              value={expiredJobs.length}
                              valueStyle={{
                                color: "#ff4d4f",
                                fontWeight: 600,
                                fontSize: 24,
                              }}
                            />
                          </div>
                          <div style={{ marginTop: 6 }}>
                            <Text type="secondary">
                              <span
                                style={{ color: "#ff4d4f", fontWeight: "bold" }}
                              >
                                +5
                              </span>{" "}
                              urgent
                            </Text>
                          </div>
                        </>
                      )}
                    </Card>
                  </Tooltip>
                </Col>
              </Row>

              <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                  <Row gutter={[24, 24]}>
                    <Col xs={24}>
                      <Card
                        className="recent-candidates"
                        title={
                          <div className="premium-card-header">
                            <span className="card-title">
                              Applied Candidates
                            </span>
                            <Alert
                              style={{
                                marginTop: 0,
                                marginLeft: 10,
                                marginBottom: 6,
                                fontSize: 13,
                                border: "none",
                                padding: "6px 10px",
                                display: "inline-flex",
                              }}
                              message={<span>All Applied Candidates</span>}
                              type="success"
                              showIcon
                            />
                          </div>
                        }
                        style={{
                          borderRadius: "16px",
                          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.05)",
                          border: "none",
                          overflow: "hidden",
                        }}
                        headStyle={{
                          border: "none",
                          padding: "20px 24px 8px",
                        }}
                      >


                        {allAppliedUsers.length > 0 ? (
                          <div
                            style={{ maxHeight: "500px", overflowY: "auto" }}
                          >
                            <List
                              itemLayout="horizontal"
                              dataSource={allAppliedUsers.slice(0, 5)}
                              renderItem={(item, index) => (
                                <List.Item
                                  className="candidate-item"
                                  style={{
                                    padding: "16px 24px",
                                    transition: "all 0.3s ease",
                                    borderBottom:
                                      "1px solid rgba(0, 0, 0, 0.03)",
                                  }}
                                  actions={[
                                    <Button
                                      onClick={() =>
                                        handleGetUserProfile(item.user_id)
                                      }
                                      type="text"
                                      className="view-btn"
                                      style={{
                                        color: "#6a5cff",
                                        background: "rgba(106, 92, 255, 0.1)",
                                        borderRadius: "8px",
                                        fontWeight: 500,
                                        padding: "4px 12px",
                                        transition: "all 0.2s ease",
                                      }}
                                      onMouseEnter={(e) =>
                                      (e.currentTarget.style.transform =
                                        "translateX(2px)")
                                      }
                                      onMouseLeave={(e) =>
                                      (e.currentTarget.style.transform =
                                        "translateX(0)")
                                      }
                                    >
                                      View{" "}
                                      <ArrowRightOutlined
                                        style={{ fontSize: "12px" }}
                                      />
                                    </Button>,
                                  ]}
                                >
                                  {selectedUser && (
                                    <Drawer
                                      className="userDetails_drawer"
                                      closable
                                      width={900}
                                      title={
                                        <div className="drawer-title">
                                          <Avatar
                                            size={36}
                                            src={selectedUser.profile_image}
                                            style={{
                                              border: "2px solid #6a5cff",
                                            }}
                                          />
                                          <span>User Profile</span>
                                        </div>
                                      }
                                      placement="right"
                                      open={open}
                                      loading={drawerLoading}
                                      onClose={() => setOpen(false)}
                                    >
                                      <div className="drawer-body">
                                        {/* LEFT PROFILE */}
                                        <div className="profile-left">
                                          <div className="avatar-container">
                                            <Avatar
                                              size={100}
                                              src={selectedUser.profile_image}
                                            />
                                            <div className="status-indicator"></div>
                                          </div>
                                          <div className="name">
                                            {selectedUser.first_name}{" "}
                                            {selectedUser.last_name}
                                          </div>
                                          <div className="role">
                                            {selectedUser.role_name}
                                          </div>
                                          <div
                                            style={{ display: "flex", gap: 10 }}
                                          >
                                            <div className="location">
                                              <EnvironmentOutlined />
                                              <span>
                                                {selectedUser.location}
                                              </span>
                                            </div>

                                            <div className="verification-badge">
                                              {selectedUser.is_email_verified ? (
                                                <Tag
                                                  icon={
                                                    <CheckCircleOutlined
                                                      style={{
                                                        color: "#52c41a",
                                                      }}
                                                    />
                                                  }
                                                  color="success"
                                                >
                                                  Verified
                                                </Tag>
                                              ) : (
                                                <Tag
                                                  icon={
                                                    <ExclamationCircleOutlined />
                                                  }
                                                  color="error"
                                                >
                                                  Unverified
                                                </Tag>
                                              )}
                                            </div>
                                          </div>
                                          {selectedUser.social_links && (
                                            <div className="social-links">
                                              <div className="social-icons">
                                                {[
                                                  "linkedin",
                                                  "facebook",
                                                  "instagram",
                                                  "behance",
                                                  "twitter",
                                                  "dribble",
                                                ].map((key) => {
                                                  const value =
                                                    selectedUser.social_links[
                                                    key
                                                    ];
                                                  return (
                                                    <a
                                                      key={key}
                                                      href={value || "#"}
                                                      target="_blank"
                                                      rel="noreferrer"
                                                      className={`social-icon ${key}`}
                                                      style={{
                                                        opacity: value
                                                          ? 1
                                                          : 0.3,
                                                        pointerEvents: value
                                                          ? "auto"
                                                          : "none",
                                                      }}
                                                    >
                                                      {key === "linkedin" && (
                                                        <LinkedinOutlined />
                                                      )}
                                                      {key === "facebook" && (
                                                        <FaFacebook />
                                                      )}
                                                      {key === "instagram" && (
                                                        <FaInstagram />
                                                      )}
                                                      {key === "behance" && (
                                                        <FaBehance />
                                                      )}
                                                      {key === "twitter" && (
                                                        <FaTwitter />
                                                      )}
                                                      {key === "dribble" && (
                                                        <FaDribbble />
                                                      )}
                                                    </a>
                                                  );
                                                })}
                                              </div>
                                            </div>
                                          )}
                                        </div>

                                        {/* RIGHT DETAILS */}
                                        <div className="user-details-cards">
                                          <Card
                                            title="Basic Information"
                                            className="info-card"
                                          >
                                            <div className="info-grid">
                                              <div className="info-item">
                                                <div className="info-icon">
                                                  <MailOutlined />
                                                </div>
                                                <div className="info-content">
                                                  <div className="info-label">
                                                    Email
                                                  </div>
                                                  <div className="info-value">
                                                    {selectedUser.email}
                                                  </div>
                                                </div>
                                              </div>

                                              <div className="info-item">
                                                <div className="info-icon">
                                                  <PhoneOutlined />
                                                </div>
                                                <div className="info-content">
                                                  <div className="info-label">
                                                    Phone
                                                  </div>
                                                  <div className="info-value">
                                                    {selectedUser.phone || (
                                                      <span className="na-text">
                                                        N/A
                                                      </span>
                                                    )}
                                                  </div>
                                                </div>
                                              </div>

                                              <div className="info-item">
                                                <div className="info-icon">
                                                  <UserOutlined />
                                                </div>
                                                <div className="info-content">
                                                  <div className="info-label">
                                                    Gender
                                                  </div>
                                                  <div className="info-value">
                                                    {selectedUser.gender || (
                                                      <span className="na-text">
                                                        N/A
                                                      </span>
                                                    )}
                                                  </div>
                                                </div>
                                              </div>

                                              <div className="info-item">
                                                <div className="info-icon">
                                                  <CalendarOutlined />
                                                </div>
                                                <div className="info-content">
                                                  <div className="info-label">
                                                    Start Year
                                                  </div>
                                                  <div className="info-value">
                                                    {selectedUser.start_year || (
                                                      <span className="na-text">
                                                        N/A
                                                      </span>
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </Card>

                                          <Card
                                            title="Professional Information"
                                            className="info-card"
                                          >
                                            <div className="info-grid">
                                              <div className="info-item">
                                                <div className="info-icon">
                                                  <BankOutlined />
                                                </div>
                                                <div className="info-content">
                                                  <div className="info-label">
                                                    Organization
                                                  </div>
                                                  <div className="info-value">
                                                    {selectedUser.organization || (
                                                      <span className="na-text">
                                                        N/A
                                                      </span>
                                                    )}
                                                  </div>
                                                </div>
                                              </div>

                                              <div className="info-item">
                                                <div className="info-icon">
                                                  <ApartmentOutlined />
                                                </div>
                                                <div className="info-content">
                                                  <div className="info-label">
                                                    Org Type
                                                  </div>
                                                  <div className="info-value">
                                                    {selectedUser.organization_type || (
                                                      <span className="na-text">
                                                        N/A
                                                      </span>
                                                    )}
                                                  </div>
                                                </div>
                                              </div>

                                              <div className="info-item">
                                                <div className="info-icon">
                                                  <ExperimentOutlined />
                                                </div>
                                                <div className="info-content">
                                                  <div className="info-label">
                                                    Experience
                                                  </div>
                                                  <div className="info-value">
                                                    {selectedUser.experince_type || (
                                                      <span className="na-text">
                                                        N/A
                                                      </span>
                                                    )}
                                                  </div>
                                                </div>
                                              </div>

                                              <div className="info-item">
                                                <div className="info-icon">
                                                  <FieldTimeOutlined />
                                                </div>
                                                <div className="info-content">
                                                  <div className="info-label">
                                                    Experience Duration
                                                  </div>
                                                  <div className="info-value">
                                                    {selectedUser.total_years ||
                                                      selectedUser.total_months ? (
                                                      <>
                                                        {selectedUser.total_years ||
                                                          0}{" "}
                                                        {selectedUser.total_months
                                                          ? ` ${selectedUser.total_months}`
                                                          : ""}
                                                      </>
                                                    ) : (
                                                      <span className="na-text">
                                                        N/A
                                                      </span>
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </Card>

                                          <Card
                                            title="Education"
                                            className="info-card"
                                          >
                                            {selectedUser.education &&
                                              selectedUser.education.length >
                                              0 ? (
                                              <div className="info-grid">
                                                <div className="info-item">
                                                  <div className="info-icon">
                                                    <FileTextOutlined />
                                                  </div>
                                                  <div className="info-content">
                                                    <div className="info-label">
                                                      Course & College
                                                    </div>
                                                    <div className="info-value">
                                                      {`${selectedUser.education[0].course} at ${selectedUser.education[0].college}`}
                                                    </div>
                                                  </div>
                                                </div>

                                                <div className="info-item">
                                                  <div className="info-icon">
                                                    <TagsOutlined />
                                                  </div>
                                                  <div className="info-content">
                                                    <div className="info-label">
                                                      Specialization
                                                    </div>
                                                    <div className="info-value">
                                                      {selectedUser.education[0]
                                                        .specialization ||
                                                        "N/A"}
                                                    </div>
                                                  </div>
                                                </div>

                                                <div className="info-item">
                                                  <div className="info-icon">
                                                    <CalendarOutlined />
                                                  </div>
                                                  <div className="info-content">
                                                    <div className="info-label">
                                                      Duration
                                                    </div>
                                                    <div className="info-value">
                                                      {`${selectedUser.education[0].start_date} - ${selectedUser.education[0].end_date}`}
                                                    </div>
                                                  </div>
                                                </div>

                                                <div className="info-item">
                                                  <div className="info-icon">
                                                    <CalendarOutlined />
                                                  </div>
                                                  <div className="info-content">
                                                    <div className="info-label">
                                                      CGPA / Percentage
                                                    </div>
                                                    <div className="info-value">
                                                      {`CGPA: ${selectedUser.education[0].cgpa}, Percentage: ${selectedUser.education[0].percentage}`}
                                                    </div>
                                                  </div>
                                                </div>

                                                <div className="info-item">
                                                  <div className="info-icon">
                                                    <TrophyOutlined />
                                                  </div>
                                                  <div className="info-content">
                                                    <div className="info-label">
                                                      Qualification
                                                    </div>
                                                    <div className="info-value">
                                                      {
                                                        selectedUser
                                                          .education[0]
                                                          .qualification
                                                      }
                                                    </div>
                                                  </div>
                                                </div>

                                                <div className="info-item">
                                                  <div className="info-icon">
                                                    <SwapOutlined />
                                                  </div>
                                                  <div className="info-content">
                                                    <div className="info-label">
                                                      Lateral Entry
                                                    </div>
                                                    <div className="info-value">
                                                      {
                                                        selectedUser
                                                          .education[0]
                                                          .lateral_entry
                                                      }
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            ) : (
                                              // <div className="info-item full-width">
                                              //   <div className="info-content">

                                              //     <div className="info-label">
                                              //       <TrophyOutlined
                                              //         style={{
                                              //           marginRight: 6,
                                              //           color: "#6a5cff",
                                              //         }}
                                              //       />
                                              //       Qualification
                                              //     </div>
                                              //     <div className="info-value">
                                              //       {
                                              //         selectedUser.education[0]
                                              //           .qualification
                                              //       }
                                              //     </div>
                                              //   </div>
                                              // </div>
                                              <span className="na-text">
                                                N/A
                                              </span>
                                            )}
                                          </Card>

                                          {selectedUser.skills?.length > 0 && (
                                            <Card
                                              title="Skills"
                                              className="info-card"
                                            >
                                              <div className="skills-container">
                                                {selectedUser.skills.map(
                                                  (skill, idx) => (
                                                    <div
                                                      key={idx}
                                                      className="skill-pill"
                                                    >
                                                      {skill}
                                                    </div>
                                                  )
                                                )}
                                              </div>
                                            </Card>
                                          )}

                                          {selectedUser.about && (
                                            <Card
                                              title="About"
                                              className="info-card"
                                            >
                                              <div className="about-container">
                                                <div className="about-text">
                                                  {selectedUser.about}
                                                </div>
                                              </div>
                                            </Card>
                                          )}

                                          {selectedUser.resume && (
                                            <Card
                                              title="Resume"
                                              className="info-card"
                                            >
                                              <iframe
                                                src={selectedUser.resume}
                                                title="Resume"
                                                width="100%"
                                                height="500px"
                                                style={{
                                                  border: "1px solid #ddd",
                                                  borderRadius: "8px",
                                                  marginBottom: 0,
                                                }}
                                              />
                                            </Card>
                                          )}
                                        </div>
                                      </div>
                                    </Drawer>
                                  )}
                                  {loading ? (
                                    <Skeleton
                                      avatar={{
                                        size: "large",
                                        shape: "circle",
                                      }}
                                      active
                                      paragraph={{ rows: 5 }}
                                      title={false}
                                      style={{ padding: "24px 0" }}
                                    />
                                  ) : (
                                    <List.Item.Meta
                                      avatar={
                                        <Badge
                                          dot
                                          color="#52c41a"
                                          offset={[-4, 40]}
                                          className="online-badge"
                                        >
                                          <Avatar
                                            className="profile_image"
                                            size={48}
                                            src={
                                              item.profile_image ||
                                              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                                            }
                                            style={{
                                              border: "2px solid #fff",
                                              boxShadow:
                                                "0 2px 8px rgba(0, 0, 0, 0.1)",
                                            }}
                                          />
                                        </Badge>
                                      }
                                      title={
                                        <span className="candidate-name">{`${item.first_name} ${item.last_name}`}</span>
                                      }
                                      description={
                                        <div className="candidate-info">
                                          <span>
                                            {item.email || item.phone}
                                          </span>
                                        </div>
                                      }
                                      style={{
                                        alignItems: "center",
                                        display: "flex",
                                      }}
                                    />
                                  )}
                                </List.Item>
                              )}
                            />
                            <div style={{ textAlign: "center", marginTop: 20, marginBottom: 10 }}>
                              <button className="see-more-btn" onClick={() => navigate("/applied-candidates-all")} style={{ cursor: "pointer", background: "none", border: "none" }}>View All</button>
                            </div>

                          </div>
                        ) : (
                          <Card style={{ textAlign: "center", padding: 40 }}>
                            <Title level={4} style={{ color: "#bfbfbf" }}>
                              No Candidates found
                            </Title>
                          </Card>
                        )}
                      </Card>
                    </Col>
                    <Col xs={24}>
                      <ChartCard
                        title={
                          <span style={{ padding: "20px 10px" }}>
                            <Title level={5} style={{ margin: 0 }}>
                              <PieChartOutlined style={{ marginRight: 8 }} />
                              Gender Distribution
                            </Title>
                            <Alert
                              style={{
                                marginTop: 7,
                                marginBottom: 15,
                                fontSize: 12,
                                padding: "3px 5px",
                                border: "none",
                                display: "inline-flex",
                              }}
                              message="Here is the gender distribution chart for overall posts"
                              type="warning"
                              showIcon
                            />
                          </span>
                        }
                      >
                        {genderData.some((item) => item.value > 0) ? (
                          <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                              <Pie
                                data={genderData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={2}
                                dataKey="value"
                                label={renderCustomizedLabel}
                                labelLine={false}
                              >
                                {genderData.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                  />
                                ))}
                              </Pie>
                              <Tooltip
                                content={<CustomTooltip />}
                                wrapperStyle={{ zIndex: 1000 }}
                              />
                              <Legend
                                layout="vertical"
                                verticalAlign="middle"
                                align="right"
                                iconType="circle"
                                formatter={(value, entry) => (
                                  <span style={{ color: "#334155" }}>
                                    {value}: {entry.payload.value}
                                  </span>
                                )}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        ) : (
                          <Card style={{ textAlign: "center", padding: 40 }}>
                            <Title level={4} style={{ color: "#bfbfbf" }}>
                              No gender data available
                            </Title>
                          </Card>
                        )}
                      </ChartCard>
                    </Col>
                  </Row>
                </Col>

                <Col xs={24} lg={8}>
                  <Row gutter={[24, 24]}>
                    <Col xs={24}>
                      <Card
                        title={
                          <Text
                            style={{
                              fontSize: 18,
                              fontWeight: 600,
                              color: "#1d1f2f",
                            }}
                          >
                            Recent Listings
                          </Text>
                        }
                        style={{
                          borderRadius: 16,
                          background: "rgba(255, 255, 255, 0.8)",
                          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
                          backdropFilter: "blur(10px)",
                          border: "1px solid rgba(255,255,255,0.3)",
                          padding: "12px 14px",
                        }}
                        headStyle={{ border: "none", padding: "12px 0" }}
                        extra={
                          postDetails.length > 0 && (
                            <Button
                              onClick={() => {
                                localStorage.setItem(
                                  "activeAdminTab",
                                  "listing"
                                );
                                navigate("/admin-profile");
                              }}
                              type="text"
                              style={{ color: "#6a5cff" }}
                            >
                              See All
                            </Button>
                          )
                        }
                      >
                        {loading ? (
                          <Skeleton active />
                        ) : postDetails.length > 0 ? (
                          <Timeline
                            style={{ marginTop: 8 }}
                            items={postDetails.slice(0, 4).map((job) => {
                              const createdDate = new Date(job.created_at);
                              const currentDate = new Date();
                              const diffDays =
                                (currentDate - createdDate) /
                                (1000 * 60 * 60 * 24);
                              const isActive = diffDays <= 15;

                              return {
                                color: "transparent",
                                dot: (
                                  <div
                                    style={{
                                      width: 14,
                                      height: 14,
                                      borderRadius: "50%",
                                      background:
                                        "linear-gradient(135deg, #6a5cff, #836fff)",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      boxShadow:
                                        "0 2px 6px rgba(106,92,255,0.4)",
                                    }}
                                  >
                                    <CheckCircleOutlined
                                      style={{ fontSize: 12, color: "#fff" }}
                                    />
                                  </div>
                                ),
                                children: (
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      gap: 4,
                                      paddingBottom: 8,
                                    }}
                                  >
                                    <Text
                                      strong
                                      style={{ fontSize: 15, color: "#1d1f2f" }}
                                    >
                                      {job.job_title}
                                    </Text>
                                    <Text
                                      type="secondary"
                                      style={{ fontSize: 12 }}
                                    >
                                      📅 Posted on:{" "}
                                      {createdDate.toLocaleDateString("en-GB")}
                                    </Text>
                                    <div
                                      style={{
                                        marginTop: 4,
                                        display: "flex",
                                        gap: 6,
                                        flexWrap: "wrap",
                                      }}
                                    >
                                      <Tag
                                        style={{
                                          borderRadius: 20,
                                          background:
                                            "linear-gradient(135deg, #dfe9ff, #f0f4ff)",
                                          color: "#334",
                                          fontWeight: 500,
                                        }}
                                      >
                                        {job.job_nature}
                                      </Tag>
                                      <Tag
                                        style={{
                                          borderRadius: 20,
                                          background:
                                            "linear-gradient(135deg, #e0f0ff, #f0f8ff)",
                                          color: "#004a8f",
                                          fontWeight: 500,
                                        }}
                                      >
                                        {job.workplace_type}
                                      </Tag>
                                      {isActive ? (
                                        <Tag
                                          style={{
                                            borderRadius: 20,
                                            background:
                                              "linear-gradient(135deg, #d4fcd5, #b4f0b9)",
                                            color: "#0f5132",
                                            fontWeight: 500,
                                          }}
                                        >
                                          Active
                                        </Tag>
                                      ) : (
                                        <Tag
                                          style={{
                                            borderRadius: 20,
                                            background:
                                              "linear-gradient(135deg, #ffe0e0, #ffcccc)",
                                            color: "#842029",
                                            fontWeight: 500,
                                          }}
                                        >
                                          Closed
                                        </Tag>
                                      )}
                                    </div>
                                  </div>
                                ),
                              };
                            })}
                          />
                        ) : (
                          <Card style={{ textAlign: "center", padding: 40 }}>
                            <Title level={4} style={{ color: "#bfbfbf" }}>
                              No listings available
                            </Title>
                          </Card>
                        )}
                      </Card>
                    </Col>
                    <Col xs={24}>
                      <ChartCard
                        title={
                          <span style={{ padding: "20px 10px" }}>
                            <Title level={5} style={{ margin: 0 }}>
                              <PieChartOutlined style={{ marginRight: 8 }} />
                              Domain Distribution
                            </Title>
                            <Alert
                              style={{
                                marginTop: 7,
                                marginBottom: 15,
                                fontSize: 12,
                                padding: "3px 5px",
                                border: "none",
                                display: "inline-flex",
                              }}
                              message="Here is the domain distribution chart for overall posts"
                              type="warning"
                              showIcon
                            />
                          </span>
                        }
                      >
                        {domainCount.length > 0 &&
                          domainCount.some((item) => item.value > 0) ? (
                          <ResponsiveContainer width="100%" height={280}>
                            <BarChart
                              data={domainCount}
                              layout="vertical"
                              margin={{
                                top: 5,
                                right: 30,
                                left: -30,
                                bottom: 5,
                              }}
                            >
                              <CartesianGrid
                                horizontal
                                vertical={false}
                                stroke="#f0f0f0"
                              />
                              <XAxis
                                type="number"
                                tick={{ fill: "#64748b" }}
                                tickLine={false}
                                axisLine={false}
                              />
                              <YAxis
                                type="category"
                                dataKey="domain"
                                tick={{ fill: "#64748b", fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                                width={200}
                              />
                              <Tooltip
                                content={<CustomTooltip />}
                                wrapperStyle={{ zIndex: 1000 }}
                              />
                              <Bar
                                dataKey="value"
                                name="Registrations"
                                radius={[0, 4, 4, 0]}
                              >
                                {domainCount.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS1[index % COLORS1.length]}
                                  />
                                ))}
                                <LabelList
                                  dataKey="value"
                                  position="right"
                                  fill="#000"
                                />
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        ) : (
                          <Card style={{ textAlign: "center", padding: 40 }}>
                            <Title level={4} style={{ color: "#bfbfbf" }}>
                              No domain data available
                            </Title>
                          </Card>
                        )}
                      </ChartCard>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </>
          </Content>
        )}

        {String(activeTab) === "2" && (
          <Content
            style={{
              margin: "0px",
              padding: 0,
              background: "transparent",
            }}
          >
            <ManageCandidate /> {/* Tab 2 content */}
          </Content>
        )}

        {String(activeTab) === "3" && (
          <Content
            style={{
              margin: "0px",
              padding: 0,
              background: "transparent",
            }}
          >
            <EditOpportunity /> {/* Tab 2 content */}
          </Content>
        )}


        {String(activeTab) === "4" && <JobDetails />}
        {String(activeTab) === "5" && <RegistrationChart />}
        {String(activeTab) === "6" && <ManageNotification />}
      </Layout>
    </Layout>
  );
}
