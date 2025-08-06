import { useEffect, useState } from "react";
import React from "react";
import { useParams } from "react-router-dom";
import {
  IoQrCode,
  IoNotifications,
  IoSettingsSharp,
  IoLogOutOutline,
  IoPersonCircleOutline,
} from "react-icons/io5";
import { ArrowRightOutlined } from "@ant-design/icons";
import { FaInstagram, FaTwitter } from "react-icons/fa";
import {
  FaClipboardUser,
  FaFacebook,
  FaBehance,
  FaDribbble,
} from "react-icons/fa6";
import { MdOutlineModeEdit, MdDashboard } from "react-icons/md";
import { FaSearch, FaChevronDown } from "react-icons/fa";
import { VscGraph } from "react-icons/vsc";
import "../css/AdminDashboard.css";
import { useNavigate } from "react-router-dom";
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
  Input,
  Layout,
  Menu,
  Space,
  theme,
  Typography,
  Card,
  Col,
  Row,
  Progress,
  Statistic,
  Tag,
  List,
  Timeline,
  Select,
  Drawer,
  message,
} from "antd";
import ManageCandidate from "./ManageCandidate";
import EditOpportunity from "./EditOpportunity";
import JobDetails from "../JobPortal/JobDetails";
import RegistrationChart from "./RegistrationChart";
import ManageNotification from "./ManageNotification";
import {
  getJobAppliedCandidates,
  getJobPosts,
  getUserProfile,
} from "../ApiService/action";
const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

export default function AdminDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const { id } = useParams();
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const [postId, setPostId] = useState(null);
  const [loginUserId, setLoginUserId] = useState(null);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [role_name, setRoleName] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [appliedUser, setAppliedUser] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("1");
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Post ID from URL:", id);
  }, [id]);

  useEffect(() => {
    document.title = "CareerFast | Admin Dashboard";
    getJobPostsData();
  }, []);

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
      }
    } catch (error) {
      console.error("Invalid JSON in localStorage", error);
    } finally {
      getUserProfileData();
    }
  });

  const handleLogout = () => {
    localStorage.removeItem("loginDetails");
    setLoginUserId(null);
    navigate("/login");
    message.error("Your'e logged out");
  };

  const getUserProfileData = async () => {
    const payload = {
      user_id: loginUserId,
    };

    try {
      const response = await getUserProfile(payload);
      const image = response?.data?.data?.profile_image || "";
      setProfileImage(image);
    } catch (error) {
      console.log("getuserprofile error", error);
    }
  };

  useEffect(() => {
    if (id) {
      getJobAppliedCandidatesData();
    }
  }, [id]);

  const getJobPostsData = async () => {
    const payload = {};
    try {
      const response = await getJobPosts(payload);
      console.log("job post", response);
    } catch (error) {
      console.log("applied candidate", error);
    }
  };

  const getJobAppliedCandidatesData = async () => {
    if (!id) {
      console.warn("Post ID is missing");
      return;
    }
    setPostId(id);

    const payload = {
      post_id: id,
    };

    try {
      const response = await getJobAppliedCandidates(payload);
      const users = response?.data?.data[0]?.users;

      if (Array.isArray(users)) {
        setAppliedUser(users);
      } else {
        console.warn("No users found in response", response?.data?.data);
        setAppliedUser([]);
      }
    } catch (error) {
      console.error("Error fetching applied candidates:", error);
    }
  };

  const handleGetUserProfile = async (userId) => {
    const payload = {
      user_id: userId,
    };

    try {
      const response = await getUserProfile(payload);
      setOpen(true);
      setLoading(true);
      setSelectedUser(response?.data?.data || null);
      console.log("User Profile data", response);
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.log("User Profile data", error);
      setSelectedUser(null);
    }
  };

  const menuItems = [
    {
      key: "1",
      icon: <MdDashboard size={18} />,
      label: "Dashboard",
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

  const activities = [
    {
      color: "blue",
      label: "New candidate applied for Frontend Developer",
      time: "2 mins ago",
    },
    {
      color: "green",
      label: "Interview scheduled with Sarah Johnson",
      time: "1 hour ago",
    },
    {
      color: "orange",
      label: "New job posting approved",
      time: "3 hours ago",
    },
    {
      color: "purple",
      label: "System update completed",
      time: "5 hours ago",
    },
    {
      color: "red",
      label: "Urgent: 3 positions need attention",
      time: "1 day ago",
    },
  ];

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
            <Button
              type="primary"
              ghost
              icon={<IoSettingsSharp size={16} />}
              style={{ width: "100%" }}
              className="account_settings"
            >
              Account Settings
            </Button>
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
            <Input
              placeholder="Search candidates, jobs, reports..."
              prefix={<FaSearch style={{ color: "#999" }} />}
              style={{
                width: 400,
                marginLeft: 16,
                borderRadius: 8,
                height: 40,
              }}
              allowClear
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
                  marginBottom: 24,
                }}
              >
                <Title level={2} style={{ margin: 0 }}>
                  Hello {fname} {lname}! 👋
                </Title>
                <Select
                  defaultValue="this_week"
                  style={{
                    width: 180,
                    background: "#E9E0FE",
                    padding: "0px 5px 0px 10px",
                    borderRadius: "6px",
                  }}
                  suffixIcon={<FaChevronDown style={{ fontSize: 12 }} />}
                >
                  <Option value="this_week">This Week</Option>
                  <Option value="last_week">Last Week</Option>
                  <Option value="this_month">This Month</Option>
                  <Option value="last_month">Last Month</Option>
                </Select>
              </div>

              <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} md={6}>
                  <Card
                    hoverable
                    style={{
                      background:
                        "linear-gradient(135deg, #f6faff 0%, #e6f4ff 100%)",
                      border: "none",
                    }}
                  >
                    <Statistic
                      title="Total Candidates"
                      value={1234}
                      prefix={<IoQrCode style={{ color: colorPrimary }} />}
                      valueStyle={{ color: colorPrimary }}
                    />
                    <div style={{ marginTop: 16 }}>
                      <Text type="secondary">
                        <span style={{ color: "#52c41a", fontWeight: "bold" }}>
                          +12.5%
                        </span>{" "}
                        from last month
                      </Text>
                    </div>
                  </Card>
                </Col>

                <Col xs={24} sm={12} md={6}>
                  <Card
                    hoverable
                    style={{
                      background:
                        "linear-gradient(135deg, #f6ffed 0%, #e6ffd7 100%)",
                      border: "none",
                    }}
                  >
                    <Statistic
                      title="Active Jobs"
                      value={42}
                      prefix={<FaClipboardUser style={{ color: "#52c41a" }} />}
                      valueStyle={{ color: "#52c41a" }}
                    />
                    <div style={{ marginTop: 16 }}>
                      <Text type="secondary">
                        <span style={{ color: "#52c41a", fontWeight: "bold" }}>
                          +3
                        </span>{" "}
                        new this week
                      </Text>
                    </div>
                  </Card>
                </Col>

                <Col xs={24} sm={12} md={6}>
                  <Card
                    hoverable
                    style={{
                      background:
                        "linear-gradient(135deg, #fffbe6 0%, #fff1b8 100%)",
                      border: "none",
                    }}
                  >
                    <Statistic
                      title="Interviews"
                      value={156}
                      prefix={<VscGraph style={{ color: "#faad14" }} />}
                      valueStyle={{ color: "#faad14" }}
                    />
                    <div style={{ marginTop: 16 }}>
                      <Text type="secondary">
                        <span style={{ color: "#ff4d4f", fontWeight: "bold" }}>
                          -8
                        </span>{" "}
                        from last week
                      </Text>
                    </div>
                  </Card>
                </Col>

                <Col xs={24} sm={12} md={6}>
                  <Card
                    hoverable
                    style={{
                      background:
                        "linear-gradient(135deg, #fff2f0 0%, #ffccc7 100%)",
                      border: "none",
                    }}
                  >
                    <Statistic
                      title="Pending Actions"
                      value={28}
                      prefix={<IoNotifications style={{ color: "#ff4d4f" }} />}
                      valueStyle={{ color: "#ff4d4f" }}
                    />
                    <div style={{ marginTop: 16 }}>
                      <Text type="secondary">
                        <span style={{ color: "#ff4d4f", fontWeight: "bold" }}>
                          +5
                        </span>{" "}
                        urgent
                      </Text>
                    </div>
                  </Card>
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
                        bodyStyle={{ padding: "8px 0" }}
                      >
                        <div style={{ maxHeight: "500px", overflowY: "auto" }}>
                          <List
                            itemLayout="horizontal"
                            dataSource={appliedUser.slice(0, 5)}
                            renderItem={(item, index) => (
                              <List.Item
                                className="candidate-item"
                                style={{
                                  padding: "16px 24px",
                                  transition: "all 0.3s ease",
                                  borderBottom: "1px solid rgba(0, 0, 0, 0.03)",
                                }}
                                actions={[
                                  <Button
                                    onClick={() =>
                                      handleGetUserProfile(item.id)
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
                                    loading={loading}
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
                                            <span>{selectedUser.location}</span>
                                          </div>

                                          <div className="verification-badge">
                                            {selectedUser.is_email_verified ? (
                                              <Tag
                                                icon={
                                                  <CheckCircleOutlined
                                                    style={{ color: "#52c41a" }}
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
                                                      opacity: value ? 1 : 0.3,
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
                                          selectedUser.education.length > 0 ? (
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
                                                      .specialization || "N/A"}
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
                                                      selectedUser.education[0]
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
                                                      selectedUser.education[0]
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
                                            <span className="na-text">N/A</span>
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
                                          item.image ||
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
                                    <a className="candidate-name">{`${item.first_name} ${item.last_name}`}</a>
                                  }
                                  description={
                                    <div className="candidate-info">
                                      <span>{item.email || item.phone}</span>
                                      {item.skills && (
                                        <div className="skill-tags">
                                          {item.skills
                                            .slice(0, 2)
                                            .map((skill) => (
                                              <Tag className="skill-tag">
                                                {skill}
                                              </Tag>
                                            ))}
                                          {item.skills.length > 2 && (
                                            <Tag className="skill-tag">
                                              +{item.skills.length - 2}
                                            </Tag>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  }
                                  style={{
                                    alignItems: "center",
                                    display: "flex",
                                  }}
                                />
                              </List.Item>
                            )}
                          />
                        </div>
                      </Card>
                    </Col>
                    <Col xs={24}>
                      <Card
                        title="Hiring Analytics"
                        extra={
                          <Button type="text" style={{ color: "#6a5cff" }}>
                            View Details
                          </Button>
                        }
                        style={{ borderRadius: 12 }}
                        headStyle={{ border: "none" }}
                        bodyStyle={{ paddingTop: 0 }}
                      >
                        <div style={{ height: 300 }}>
                          {/* Chart would go here */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              height: "100%",
                              background:
                                "linear-gradient(135deg, #f5f7fa 0%, #e4e8ed 100%)",
                              borderRadius: 8,
                            }}
                          >
                            <div
                              style={{
                                textAlign: "center",
                                color: "#666",
                              }}
                            >
                              <Title level={4} style={{ color: "#666" }}>
                                Hiring Metrics Chart
                              </Title>
                              <Text>Applications, Interviews, Hires</Text>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  </Row>
                </Col>

                <Col xs={24} lg={8}>
                  <Row gutter={[24, 24]}>
                    <Col xs={24}>
                      <Card
                        title="Hiring Progress"
                        style={{ borderRadius: 12 }}
                        headStyle={{ border: "none" }}
                      >
                        <Space
                          direction="vertical"
                          size="middle"
                          style={{ width: "100%" }}
                        >
                          {[
                            {
                              title: "Frontend",
                              percent: 65,
                              color: colorPrimary,
                            },
                            { title: "Backend", percent: 45, color: "#52c41a" },
                            {
                              title: "UX Design",
                              percent: 80,
                              color: "#faad14",
                            },
                            { title: "Product", percent: 30, color: "#eb2f2f" },
                            { title: "DevOps", percent: 55, color: "#722ed1" },
                          ].map((item) => (
                            <div key={item.title}>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  marginBottom: 4,
                                }}
                              >
                                <Text strong>{item.title}</Text>
                                <Text>{item.percent}%</Text>
                              </div>
                              <Progress
                                percent={item.percent}
                                strokeColor={item.color}
                                showInfo={false}
                              />
                            </div>
                          ))}
                        </Space>
                      </Card>
                    </Col>
                    <Col xs={24}>
                      <Card
                        title="Recent Activities"
                        style={{ borderRadius: 12 }}
                        headStyle={{ border: "none" }}
                        extra={
                          <Button type="text" style={{ color: "#6a5cff" }}>
                            See All
                          </Button>
                        }
                      >
                        <Timeline>
                          {activities.map((activity, index) => (
                            <Timeline.Item key={index} color={activity.color}>
                              <div>
                                <Text strong>{activity.label}</Text>
                                <div>
                                  <Text type="secondary">{activity.time}</Text>
                                </div>
                              </div>
                            </Timeline.Item>
                          ))}
                        </Timeline>
                      </Card>
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
