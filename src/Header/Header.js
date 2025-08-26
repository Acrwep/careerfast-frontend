import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import logo from "../images/careerfastlogofinal.png";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { storeLoginStatus } from "../Redux/Slice";
import {
  Input,
  Avatar,
  Badge,
  Dropdown,
  Drawer,
  Space,
  List,
  Typography,
  Progress,
  Tooltip,
  message,
} from "antd";
import { AutoComplete } from "antd";
import { useLocation, Link } from "react-router-dom";

import {
  BellOutlined,
  UserOutlined,
  PlusOutlined,
  SearchOutlined,
  BookOutlined,
  CodeOutlined,
  SettingOutlined,
  AppstoreOutlined,
  UserAddOutlined,
  CloseOutlined,
  ArrowRightOutlined,
  LogoutOutlined,
  RightOutlined,
  HeartOutlined,
} from "@ant-design/icons";

import { Skeleton, Tag } from "antd";
import {
  CrownFilled,
  StarFilled,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { getUserProfile, searchByKeyword } from "../ApiService/action";
import { IoChevronDownOutline } from "react-icons/io5";
import { CommonToaster } from "../Common/CommonToaster";
import { FcApproval } from "react-icons/fc";

const { Title, Text } = Typography;

export default function Header() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.loginstatus);
  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);
  const [loginUserId, setLoginUserId] = useState(null);
  const [roleId, setRoleId] = useState(null);
  const [profileImage, setProfileImage] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("AccessToken");
    const stored = localStorage.getItem("loginDetails");
    if (stored) {
      try {
        const loginDetails = JSON.parse(stored);
        setLoginUserId(loginDetails.id);
        setRoleId(loginDetails.role_id);
      } catch (err) {
        console.error("Invalid loginDetails", err);
      }
    }
  }, []);

  const handleLogOut = () => {
    localStorage.removeItem("loginDetails");
    dispatch(storeLoginStatus(false));
    setRoleId(null);
    navigate("/login");
    message.error("Your'e logged out");
  };

  useEffect(() => {
    console.log("loginUserId updated", loginUserId);
    if (loginUserId) {
      getUserProfileData();
    }
  }, [loginUserId]);

  const getUserProfileData = async () => {
    const payload = {
      user_id: loginUserId,
    };

    try {
      const response = await getUserProfile(payload);
      console.log("getUserProfile", response);
      const image = response?.data?.data?.profile_image || "";

      setProfileImage(image);
      setFname(response?.data?.data?.first_name || "");
      setEmail(response?.data?.data?.email || "");
      setLname(response?.data?.data?.last_name || "");

      // localStorage.setItem("profileImage", image);
    } catch (error) {
      console.log("getuserprofile errorddd", error);
    } finally {
      setTimeout(() => {
        handleSearch();
      }, 300);
    }
  };

  const handleSearch = async (value) => {
    setSearchText(value);
    if (!value) {
      setSuggestions([]);
      return;
    }

    try {
      setLoading(true);
      const payload = { searchTerm: value };
      const response = await searchByKeyword(payload);
      const data = response?.data?.data || [];
      console.log("search", response);

      const formattedSuggestions = data.map((item) => ({
        value: item.id,
        label: (
          <div className={`suggestion-item ${item.isPremium ? "premium" : ""}`}>
            {item.isPremium && (
              <span className="premium-badge">
                <CrownFilled /> Premium
              </span>
            )}
            <img
              src={item.company_logo}
              alt={item.company_name}
              className="company-logo"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/48";
              }}
            />
            <div className="suggestion-content">
              <div className="job-title">
                {item.job_title}
                {item.isFeatured && <StarFilled className="featured-icon" />}
              </div>
              <div className="company-info">
                <span style={{ marginBottom: "7px" }}>{item.company_name}</span>
                <br></br>
                <Tag
                  style={{ marginTop: "7px" }}
                  icon={<EnvironmentOutlined />}
                  color="blue"
                >
                  {item.work_location}
                </Tag>
                <Tag
                  color={item.workplace_type === "Remote" ? "green" : "purple"}
                >
                  {item.workplace_type}
                </Tag>
              </div>
            </div>
          </div>
        ),
      }));

      setSuggestions(formattedSuggestions);
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (jobId) => {
    navigate(`/job-details/${jobId}`);
  };

  const menuItems = [
    { key: "jobs", label: "Jobs", icon: <UserOutlined />, path: "/job-portal" },
    {
      key: "internships",
      label: "Internships",
      icon: <BookOutlined />,
      path: "/internship",
    },
    { key: "practice", label: "Practice", icon: <CodeOutlined />, path: "#" },
    // { key: "more", label: "More", icon: <CodeOutlined />, path: "#" },
  ];

  const moreMenuItems = [
    { key: "scholarships", label: "Scholarships", path: "#" },
    { key: "events", label: "Events", path: "#" },
    { key: "resources", label: "Resources", path: "#" },
    { key: "blog", label: "Blog", path: "/blogs" },
  ];

  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <>
      <Navbar
        sticky="top"
        key="md"
        expand="md"
        className="bg-white shadow-sm py-3 premium-header"
      >
        <Container>
          <div className="d-flex gap-3 global_search">
            <Navbar.Brand>
              <img
                onClick={() => navigate("/job-portal")}
                src={logo}
                style={{ cursor: "pointer" }}
                alt="Logo"
                className="main-logo"
              />
            </Navbar.Brand>
            <AutoComplete
              options={suggestions}
              onSearch={handleSearch}
              onSelect={handleSelect}
              style={{ width: "100%" }}
              dropdownStyle={{
                borderRadius: 12,
                padding: "8px 0",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
              }}
              notFoundContent={
                loading ? (
                  <div className="loading-container">
                    <Skeleton active paragraph={{ rows: 2 }} />
                  </div>
                ) : (
                  <div className="no-results-container">
                    <div className="no-results-title">No results found</div>
                    <div className="no-results-subtitle">
                      Try different keywords or check your spelling
                    </div>
                  </div>
                )
              }
              popupClassName="premium-dropdown"
            >
              <Input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search opportunities, companies, or skills"
                prefix={<SearchOutlined className="search-icon" />}
                allowClear
                className="premium-search-input"
                size="large"
              />
            </AutoComplete>
          </div>

          <Navbar.Toggle aria-controls="offcanvasNavbar-expand-md" />
          <Navbar.Offcanvas
            id="offcanvasNavbar-expand-md"
            aria-labelledby="offcanvasNavbarLabel-expand-md"
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id="offcanvasNavbarLabel-expand-md">
                Menu
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              {/* Center: Navigation */}
              <Nav className="justify-content-center flex-grow-1 align-items-start gap-3">
                {menuItems.map((item) => (
                  <Nav.Link
                    disabled={item.key === "practice" ? true : false}
                    key={item.key}
                    onClick={() => {
                      onClose();
                      navigate(item.path);
                    }}
                    to={item.path}
                    active={currentPath === item.path}
                  >
                    {item.label}
                  </Nav.Link>
                ))}
                <Dropdown
                  menu={{
                    items: moreMenuItems,
                    onClick: ({ key }) => {
                      const selectedItem = moreMenuItems.find(
                        (item) => item.key === key
                      );
                      if (selectedItem?.path) {
                        navigate(selectedItem.path);
                        onClose();
                      }
                    },
                  }}
                  trigger={["hover"]}
                  placement="bottomLeft"
                >
                  <Nav.Link
                    className={`nav-item ${
                      moreMenuItems.some((menu) => menu.path === currentPath)
                        ? "active"
                        : ""
                    }`}
                  >
                    More <IoChevronDownOutline />
                  </Nav.Link>
                </Dropdown>
              </Nav>

              {/* Right: User Actions */}
              <div className="align-items-center gap-3 mt-3 mt-md-0 mobile_sidebar">
                {isLoggedIn === true ? (
                  <Badge count={3}>
                    <Button className="icon-button" variant="light">
                      <BellOutlined />
                    </Button>
                  </Badge>
                ) : (
                  ""
                )}

                {isLoggedIn === true ? (
                  <div
                    className="d-flex align-items-center gap-1 user-dropdown"
                    style={{ cursor: "pointer" }}
                  >
                    <Avatar
                      onClick={showDrawer}
                      style={{ objectFit: "contain" }}
                      size="large"
                      src={profileImage}
                    />
                  </div>
                ) : (
                  ""
                )}

                {roleId === 2 ? (
                  <>
                    <Tooltip title="You don't have permission to post jobs">
                      <span>
                        <Button
                          onClick={() => navigate("/post-jobs")}
                          className="host-button"
                          disabled
                        >
                          <PlusOutlined /> Host
                        </Button>
                      </span>
                    </Tooltip>
                    {isLoggedIn === false ? (
                      <Button
                        onClick={() => navigate("/login")}
                        className="host-button"
                      >
                        Login
                      </Button>
                    ) : (
                      ""
                    )}
                  </>
                ) : (
                  <>
                    <Button
                      onClick={() => {
                        if (isLoggedIn === false) {
                          message.error("Please Login");
                        } else {
                          navigate("/post-jobs");
                        }
                      }}
                      className="host-button"
                    >
                      <PlusOutlined /> Host
                    </Button>
                    {isLoggedIn === false ? (
                      <Button
                        onClick={() => navigate("/login")}
                        className="host-button"
                      >
                        Login
                      </Button>
                    ) : (
                      ""
                    )}{" "}
                  </>
                )}
              </div>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>

      <Drawer
        title={null}
        placement="right"
        width={380}
        onClose={onClose}
        open={open}
        closable={false}
        headerStyle={{ border: "none", padding: 0 }}
        bodyStyle={{ padding: 0 }}
      >
        {/* Premium Header */}
        <div
          className="premium-profile-header"
          style={{
            background: "linear-gradient(135deg, #4f46e5 0%, #8b5cf6 100%)",
            padding: "24px 24px 32px",
            color: "white",
            position: "relative",
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              background: "rgba(255,255,255,0.2)",
              border: "none",
              width: 32,
              height: 32,
              borderRadius: "50%",
              color: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CloseOutlined />
          </button>

          <Space align="start" size={16} style={{ width: "100%" }}>
            <div style={{ position: "relative" }}>
              <Avatar
                size={72}
                src={profileImage}
                style={{ border: "3px solid white" }}
              />
              <Progress
                type="circle"
                percent={56}
                size={84}
                strokeColor="#0cd10c"
                trailColor="#fff"
                strokeWidth={8}
                format={() => (
                  <span
                    style={{ color: "white", fontSize: 12, fontWeight: 600 }}
                  >
                    56%
                  </span>
                )}
                style={{
                  position: "absolute",
                  top: -6,
                  left: -6,
                  zIndex: 1,
                  background: "rgba(37, 148, 4, 0.1)",
                  borderRadius: "50%",
                }}
              />
            </div>

            <div>
              <Title level={4} style={{ color: "white", margin: "4px 0" }}>
                {fname} {""}
                {lname}
              </Title>
              <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>
                {email}
              </Text>
              <div style={{ marginTop: 12 }}>
                <Button
                  onClick={() => {
                    localStorage.setItem("activeAdminTab", "mainprofile");
                    navigate("/admin-profile");
                  }}
                  type="text"
                  style={{
                    color: "#8d3ffb",
                    padding: 6,
                    height: "auto",
                    fontWeight: 500,
                    background: "#fff",
                    border: "none",
                  }}
                  icon={<ArrowRightOutlined style={{ fontSize: 12 }} />}
                >
                  View Profile
                </Button>
              </div>
            </div>
          </Space>
        </div>

        {/* Premium Content */}
        <div style={{ padding: "24px" }}>
          {/* Menu Sections */}
          <div className="premium-menu-section">
            <Text
              type="secondary"
              style={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 12,
                display: "block",
              }}
            >
              {roleId === 2 ? " For Users" : "For Organizers"}
            </Text>

            <List
              size="large"
              itemLayout="horizontal"
              dataSource={[
                ...(roleId !== 2
                  ? [
                      {
                        title: (
                          <span
                            style={{ cursor: "pointer", color: "#4f46e5" }}
                            onClick={() => {
                              localStorage.setItem("activeAdminTab", "listing");
                              navigate("/admin-profile");
                            }}
                          >
                            Manage Listings
                          </span>
                        ),
                        icon: <AppstoreOutlined style={{ color: "#4f46e5" }} />,
                      },
                    ]
                  : []),
                {
                  title: (
                    <span
                      style={{ cursor: "pointer", color: "#4f46e5" }}
                      onClick={() => {
                        localStorage.setItem("activeAdminTab", "wishlist");
                        navigate("/admin-profile");
                      }}
                    >
                      Wishlist
                    </span>
                  ),
                  icon: <HeartOutlined style={{ color: "#4f46e5" }} />,
                },
                {
                  title: (
                    <span
                      style={{ cursor: "pointer", color: "#4f46e5" }}
                      onClick={() => {
                        localStorage.setItem(
                          "activeAdminTab",
                          "accountsettings"
                        );
                        navigate("/admin-profile");
                      }}
                    >
                      Account Settings
                    </span>
                  ),
                  icon: <SettingOutlined style={{ color: "#4f46e5" }} />,
                },
                {
                  title: (
                    <span
                      style={{ cursor: "pointer", color: "#4f46e5" }}
                      onClick={() => {
                        localStorage.setItem(
                          "activeAdminTab",
                          "prosubscription"
                        );
                        navigate("/admin-profile");
                      }}
                    >
                      Pro Subscription
                    </span>
                  ),
                  icon: <FcApproval style={{ color: "#4f46e5" }} />,
                },
              ]}
              renderItem={(item) => (
                <List.Item
                  className="premium-menu-item"
                  style={{
                    padding: "12px 0",
                    borderBottom: "1px solid #f0f0f0",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          background: "rgba(79, 70, 229, 0.1)",
                          borderRadius: 8,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {item.icon}
                      </div>
                    }
                    title={
                      <Text style={{ fontWeight: 500 }}>{item.title}</Text>
                    }
                    style={{ alignItems: "center" }}
                  />
                  <RightOutlined style={{ color: "#d9d9d9" }} />
                </List.Item>
              )}
            />
          </div>

          <div className="premium-menu-section" style={{ marginTop: 0 }}>
            <List
              size="large"
              itemLayout="horizontal"
              dataSource={[
                {
                  title: (
                    <span
                      style={{ cursor: "pointer", color: "#4f46e5" }}
                      onClick={() => {
                        localStorage.setItem("activeAdminTab", "applied");
                        navigate("/admin-profile");
                      }}
                    >
                      Applied Jobs
                    </span>
                  ),
                  icon: <UserAddOutlined style={{ color: "#4f46e5" }} />,
                },
              ]}
              renderItem={(item) => (
                <List.Item
                  className="premium-menu-item"
                  style={{
                    padding: "12px 0",
                    borderBottom: "1px solid #f0f0f0",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          background: "rgba(79, 70, 229, 0.1)",
                          borderRadius: 8,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {item.icon}
                      </div>
                    }
                    title={
                      <Text style={{ fontWeight: 500 }}>{item.title}</Text>
                    }
                    style={{ alignItems: "center" }}
                  />
                  <RightOutlined style={{ color: "#d9d9d9" }} />
                </List.Item>
              )}
            />
          </div>
        </div>

        {/* Premium Footer */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid #f0f0f0",
            background: "#fafafa",
          }}
        >
          <Button
            type="text"
            onClick={handleLogOut}
            danger
            icon={<LogoutOutlined />}
            style={{
              fontWeight: 500,
              background:
                "linear-gradient(180deg, #fa1414e8 0%, #ff1c1cb0 100%)",
              border: "none",
            }}
          >
            <LogoutOutlined /> Log Out
          </Button>
        </div>
      </Drawer>
    </>
  );
}
