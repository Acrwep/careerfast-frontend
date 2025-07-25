import React, { useState, useEffect } from "react";
import { Layout, Menu, Progress, Avatar, Upload, Typography } from "antd";
import {
  SettingOutlined,
  ClockCircleOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import "../css/Profile.css";
import { FaRegBookmark } from "react-icons/fa";
import { FaUserPen } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { FaListOl } from "react-icons/fa";
import { FcApproval } from "react-icons/fc";
import WatchList from "./WatchList";
import RecentlyViewed from "./RecentlyViewed";
import MainProfile from "./MainProfile";
import Settings from "./Settings";
import "react-calendar-heatmap/dist/styles.css";
import ProSubscription from "./ProSubscription";
import TextArea from "antd/es/input/TextArea";
import BookMark from "./BookMark";
import Listing from "./Listing";
import AccountSettings from "./AccountSettings";
import { getUserProfile } from "../ApiService/action";

const { Header, Sider, Content } = Layout;

const siderStyle = {
  overflow: "auto",
  height: "100vh",
  position: "sticky",
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  WebkitOverflowScrolling: "touch",
  scrollbarWidth: "none",
  msOverflowStyle: "none",
};

export default function UserProfile() {
  const [collapsed, setCollapsed] = useState(false);
  const [sideBar, setSideBar] = useState("mainprofile");
  const [loginUserId, setLoginUserId] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [roleId, setRoleId] = useState(null);

  const menuItems = [
    { key: "mainprofile", icon: <FaUserPen />, label: "Your profile" },
    { key: "watchlist", icon: <FaRegHeart />, label: "Watchlist" },
    { key: "settings", icon: <SettingOutlined />, label: "Settings" },
    ...(roleId === 3
      ? [{ key: "listing", icon: <FaListOl />, label: "Manage Listing" }]
      : []),
    {
      key: "accountsettings",
      icon: <SettingOutlined />,
      label: "Account Settings",
    },
    { key: "prosubscription", icon: <FcApproval />, label: "Pro Subscription" },
  ];

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("loginDetails");
      if (stored) {
        const loginDetails = JSON.parse(stored);
        setLoginUserId(loginDetails.id);
        setRoleId(loginDetails.role_id);
      }
      console.log("stored", stored);
    } catch (error) {
      console.error("Invalid JSON in localStorage", error);
    }
  }, []);

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
      if (response?.data?.data) {
        const profile = response.data.data;
        setAvatarUrl(response?.data?.data?.profile_image || "");
        setFname(profile.first_name || "");
        setEmail(profile.email || "");
        setLname(profile.last_name || "");
      }
    } catch (error) {
      console.log("getuserprofile errorddd", error);
    }
  };

  return (
    <Layout className="profile-layout">
      {/* Sidebar */}
      <Sider
        style={siderStyle}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={280}
        className="profile-sider"
        breakpoint="lg"
      >
        <div className="profile-card-sidebar">
          <Avatar size={80} src={avatarUrl} className="profile-avatar" />
          <h3 className="profile-name">
            {fname} {""}
            {lname}
          </h3>
          <p className="profile-email">{email}</p>

          <div className="profile-completion">
            <div className="progress-header">
              <span style={{ color: "#000" }}>Profile Completion</span>
              <span
                style={{ color: "#000" }}
                onClick={() => {
                  console.log(sideBar);
                }}
              >
                56%
              </span>
            </div>
            <Progress
              percent={56}
              strokeColor="#22c55e"
              showInfo={false}
              className="profile-progress"
            />
          </div>
        </div>

        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={menuItems}
          selectedKeys={[sideBar]}
          onClick={(e) => setSideBar(e.key)}
          className="profile-menu"
        />
      </Sider>

      {/* Main Content */}
      <Layout className="profile-content-layout">
        {/* Dynamic Content */}
        <div style={{ flex: 1, padding: 5 }}>
          {sideBar === "mainprofile" ? (
            <MainProfile />
          ) : sideBar === "watchlist" ? (
            <WatchList />
          ) : sideBar === "bookmarked" ? (
            <BookMark />
          ) : sideBar === "viewed" ? (
            <RecentlyViewed />
          ) : sideBar === "settings" ? (
            <Settings />
          ) : sideBar === "listing" ? (
            <Listing />
          ) : sideBar === "accountsettings" ? (
            <AccountSettings />
          ) : sideBar === "prosubscription" ? (
            <ProSubscription />
          ) : (
            ""
          )}
        </div>
      </Layout>
    </Layout>
  );
}
