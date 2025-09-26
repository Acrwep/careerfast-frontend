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
import { useLocation } from "react-router-dom";

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
          <div className={`elite-suggestion-item ${item.isPremium ? "elite-premium" : ""}`}>
            <div className="elite-content-wrapper">
              <div className="elite-logo-container">
                <div className="elite-logo-frame">
                  <img
                    src={item.company_logo}
                    alt={item.company_name}
                    className="elite-company-logo"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/48";
                    }}
                  />
                </div>
                {item.isPremium && (
                  <div className="elite-premium-badge">
                    <CrownFilled className="elite-premium-icon" />
                    <span>Elite</span>
                  </div>
                )}
              </div>
              <div className="elite-suggestion-content">
                <div className="elite-job-title-header">
                  {item.job_title}
                  {item.isFeatured && <StarFilled className="elite-featured-icon" />}
                </div>
                <div className="elite-company-name-header">{item.company_name}</div>
                <div className="elite-job-meta-header">
                  <Tag
                    icon={<EnvironmentOutlined />}
                    className="elite-location-tag"
                  >
                    {item.work_location}
                  </Tag>
                  <Tag
                    className={`elite-workplace-tag ${item.workplace_type === "Remote" ? "elite-remote" : "elite-onsite"}`}
                  >
                    {item.workplace_type}
                  </Tag>
                </div>
                <div className="elite-salary-badge">
                  <span className="elite-salary-text">${Math.floor(Math.random() * 50) + 60}k</span>
                </div>
              </div>
            </div>
            <div className="elite-view-btn">
              <RightOutlined />
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
        className="bg-white shadow-sm py-3 elite-header"
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
              dropdownMatchSelectWidth={520}
              onSearch={handleSearch}
              onSelect={handleSelect}
              style={{ width: "100%" }}
              dropdownClassName="elite-search-dropdown"
              notFoundContent={
                loading ? (
                  <div className="elite-loading-container">
                    <div className="elite-loading-animation">
                      <div className="elite-loading-dot"></div>
                      <div className="elite-loading-dot"></div>
                      <div className="elite-loading-dot"></div>
                    </div>
                    <div className="elite-loading-text">Finding the best opportunities for you</div>
                  </div>
                ) : (
                  <div className="elite-no-results-container">
                    <div className="elite-no-results-icon">
                      <SearchOutlined />
                    </div>
                    <div className="elite-no-results-title">No matching opportunities found</div>
                    <div className="elite-no-results-subtitle">
                      Try different keywords or explore our curated collections
                    </div>
                    <Button onClick={() => {
                      navigate("/job-filter")
                    }} type="primary" className="elite-explore-btn">
                      Explore Featured Jobs
                    </Button>
                  </div>
                )
              }
            >
              <Input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search opportunities, companies, or skills"
                prefix={<SearchOutlined className="elite-search-icon" />}
                allowClear
                className="elite-search-input"
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
                    className={`nav-item ${moreMenuItems.some((menu) => menu.path === currentPath)
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
        className="header-drawer"
        title={null}
        placement="right"
        width={380}
        onClose={onClose}
        open={open}
        closable={false}
        style={{ padding: 0 }}
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
                            localStorage.setItem("listingOrder", "topBottom"); // add this
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

      {/* Add CSS for elite search dropdown */}
      <style>
        {`
          /* Elite Search Dropdown Styles */
          .elite-search-dropdown {
            border-radius: 16px;
            box-shadow: 0 15px 50px rgba(0, 0, 0, 0.15);
            border: 1px solid rgba(255, 255, 255, 0.2);
            padding: 16px;
            margin-top: 10px;
            max-height: 600px;
            overflow-y: auto;
            scroll-behavior: smooth;
            background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
            backdrop-filter: blur(20px);
          }
          
          .elite-search-dropdown .ant-select-item {
            padding: 0;
            border-radius: 12px;
            margin-bottom: 8px;
            transition: all 0.3s ease;
            background: transparent;
          }
            
          .rc-virtual-list-holder{
          max-height: 340px !important;
          }
          
          .elite-search-dropdown .ant-select-item-option-active {
            background-color: rgba(79, 70, 229, 0.05);
          }
          
          .elite-search-dropdown .ant-select-item-option-selected {
            background: linear-gradient(90deg, rgba(79, 70, 229, 0.1) 0%, rgba(79, 70, 229, 0.05) 100%);
          }
          
          .elite-suggestion-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px;
            border-radius: 12px;
            transition: all 0.3s ease;
            border: 1px solid rgba(79, 70, 229, 0.1);
            background: white;
            position: relative;
            overflow: hidden;
          }
          
          .elite-suggestion-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 4px;
            height: 0;
            background: linear-gradient(180deg, #8b5cf6 0%, #4f46e5 100%);
            transition: height 0.3s ease;
          }
          
          .elite-suggestion-item:hover::before {
            height: 100%;
          }
          
          .elite-suggestion-item:hover {
            background-color: #fafbff;
            border-color: rgba(79, 70, 229, 0.3);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(79, 70, 229, 0.15);
          }
          
          .elite-content-wrapper {
            display: flex;
            align-items: flex-start;
            flex: 1;
          }
          
          .elite-logo-container {
            position: relative;
            margin-right: 16px;
          }
          
          .elite-logo-frame {
            width: 56px;
            height: 56px;
            border-radius: 12px;
            padding: 3px;
            background: linear-gradient(135deg, #8b5cf6 0%, #4f46e5 100%);
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .elite-company-logo {
            width: 100%;
            height: 100%;
            border-radius: 10px;
            object-fit: contain;
            background: white;
            padding: 5px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }
          
          .elite-premium-badge {
            position: absolute;
            top: -6px;
            right: -6px;
            background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
            color: #7c5a1a;
            font-size: 10px;
            font-weight: 700;
            padding: 3px 8px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
            z-index: 2;
          }
          
          .elite-premium-icon {
            font-size: 10px;
            margin-right: 3px;
          }
          
          .elite-suggestion-content {
            flex: 1;
            position: relative;
          }
          
          .elite-suggestion-item .elite-job-title-header {
            font-weight: 700;
            font-size: 16px;
            color: #1a1a1a !important;
            margin-bottom: 0px;
            display: flex;
            align-items: center;
          }
          
          .elite-featured-icon {
            color: #ffc53d;
            margin-left: 8px;
            font-size: 14px;
          }
          
          .elite-company-name-header {
            font-size: 13px;
            color: #595959;
            margin-bottom: 10px;
            font-weight: 600;
          }
          
          .elite-job-meta-header {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            margin-bottom: 10px;
          }
          
          .elite-location-tag, .elite-workplace-tag {
            font-size: 11px;
            padding: 4px 10px;
            border-radius: 6px;
            margin: 0;
            border: none;
          }
          
          .elite-location-tag {
            background: rgba(59, 130, 246, 0.1);
            color: #3b82f6;
          }
          
          .elite-remote {
            background: rgba(16, 185, 129, 0.1);
            color: #10b981;
          }
          
          .elite-onsite {
            background: rgba(139, 92, 246, 0.1);
            color: #8b5cf6;
          }
          
          .elite-salary-badge {
            display: inline-block;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            font-size: 11px;
            font-weight: 700;
            padding: 3px 8px;
            border-radius: 6px;
          }
          
          .elite-view-btn {
            width: 32px;
            height: 32px;
            border-radius: 8px;
            background: rgba(79, 70, 229, 0.1);
            color: #4f46e5;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            transition: all 0.3s ease;
          }
          
          .elite-suggestion-item:hover .elite-view-btn {
            background: #4f46e5;
            color: white;
            transform: translateX(3px);
          }
          
          .elite-no-results-container {
            text-align: center;
            padding: 10px 20px;
          }
          
          .elite-no-results-icon {
            font-size: 38px;
            color: #d9d9d9;
            margin-bottom: 16px;
          }
          
          .elite-no-results-title {
            font-weight: 700;
            color: #595959;
            margin-bottom: 8px;
            font-size: 16px;
          }
          
          .elite-no-results-subtitle {
            font-size: 14px;
            color: #8c8c8c;
            margin-bottom: 20px;
          }
          
          .elite-explore-btn {
            background: linear-gradient(135deg, #4f46e5 0%, #8b5cf6 100%);
            border: none;
            border-radius: 8px;
            padding: 8px 20px;
            height: auto;
            font-weight: 600;
          }
          
          .elite-loading-container {
            text-align: center;
            padding: 30px 20px;
          }
          
          .elite-loading-animation {
            display: flex;
            justify-content: center;
            margin-bottom: 16px;
          }
          
          .elite-loading-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: linear-gradient(135deg, #4f46e5 0%, #8b5cf6 100%);
            margin: 0 4px;
            animation: elite-loading 1.4s infinite ease-in-out both;
          }
          
          .elite-loading-dot:nth-child(1) {
            animation-delay: -0.32s;
          }
          
          .elite-loading-dot:nth-child(2) {
            animation-delay: -0.16s;
          }
          
          @keyframes elite-loading {
            0%, 80%, 100% { 
              transform: scale(0.8);
              opacity: 0.5;
            }
            40% { 
              transform: scale(1);
              opacity: 1;
            }
          }
          
          .elite-loading-text {
            font-size: 14px;
            color: #8c8c8c;
            font-weight: 500;
          }
          
          /* Elite search input */
          .elite-search-input {
            border-radius: 12px;
            border: 1px solid #e6e8f0;
            padding: 12px 18px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            transition: all 0.3s ease;
            background: white;
          }
          
          .elite-search-input:hover, .elite-search-input:focus {
            border-color: #8b5cf6;
            box-shadow: 0 6px 20px rgba(79, 70, 229, 0.2);
          }
          
          .elite-search-icon {
            color: #8b5cf6;
          }
          
          .elite-header {
            border-bottom: 1px solid rgba(79, 70, 229, 0.1);
          }
        `}
      </style>
    </>
  );
}