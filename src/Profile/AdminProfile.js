import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout, Menu, Progress, Avatar, Modal, Badge } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import "../css/Profile.css";
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
import BookMark from "./BookMark";
import Listing from "./Listing";
import AppliedJobs from "./AppliedJobs";
import AppliedCandidates from "./AppliedCandidates";
import AccountSettings from "./AccountSettings";
import {
  getUserProfile,
  getAllAppliedCandidates,
  getUserJobPostStatus,
} from "../ApiService/action";
import { VscGitStashApply } from "react-icons/vsc";
import { GrUserSettings } from "react-icons/gr";
import { UserCheck } from "lucide-react";

const { Sider } = Layout;

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
  const { activeTab } = useParams();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [sideBar, setSideBar] = useState(activeTab || "mainprofile");
  const [loginUserId, setLoginUserId] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [roleId, setRoleId] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (roleId === 3) {
      fetchPendingCount();
    }
  }, [roleId]);

  const fetchPendingCount = async () => {
    try {
      const response = await getAllAppliedCandidates();
      const users = response?.data?.data || [];

      const statuses = await Promise.all(
        users.map(async (user) => {
          let latestStatus = "Pending";
          if (user.applied_jobs_id) {
            try {
              const statusRes = await getUserJobPostStatus({
                applied_job_id: user.applied_jobs_id,
              });
              const statusList = statusRes?.data?.data;
              if (Array.isArray(statusList) && statusList.length > 0) {
                statusList.sort(
                  (a, b) => new Date(b.changed_at) - new Date(a.changed_at)
                );
                latestStatus = statusList[0]?.status || "Pending";
              }
            } catch (err) {
              console.error("Status fetch error", err);
            }
          }
          return latestStatus;
        })
      );

      const count = statuses.filter((status) => status === "Pending").length;
      setPendingCount(count);
    } catch (error) {
      console.error("Error fetching candidates for badge:", error);
    }
  };

  const menuItems = [
    { key: "mainprofile", icon: <FaUserPen />, label: "Your profile" },
    { key: "wishlist", icon: <FaRegHeart />, label: "Wishlist" },

    ...(roleId === 3
      ? [
        { key: "listing", icon: <FaListOl />, label: "Manage Listing" },
        { key: "applied", icon: <VscGitStashApply />, label: "Applied Jobs" },
        {
          key: "appliedcandidates",
          icon: <UserCheck size={16} />,
          label: (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>Applied Candidates</span>
              {pendingCount > 0 && <Badge count={pendingCount} />}
            </div>
          ),
        },
      ]
      : [{ key: "applied", icon: <FaListOl />, label: "Applied Jobs" }]),

    {
      key: "accountsettings",
      icon: <GrUserSettings />,
      label: "Account Settings",
    },
    { key: "settings", icon: <SettingOutlined />, label: "Settings" },
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
        const storedImage = localStorage.getItem("profileImage");
        if (storedImage) setAvatarUrl(storedImage);
      }
    } catch (error) {
      console.error("Invalid JSON in localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (activeTab) {
      setSideBar(activeTab);
    } else {
      setSideBar("mainprofile");
    }
  }, [activeTab]);

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
        const image = profile.profile_image || "";
        setAvatarUrl(image);
        setFname(profile.first_name || "");
        setEmail(profile.email || "");
        setLname(profile.last_name || "");
        localStorage.setItem("profileImage", image);
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
          <Avatar
            size={80}
            src={avatarUrl}
            onClick={() => setIsImageModalOpen(true)}
            className="profile-avatar"
          />
          <h3 className="profile-name">
            {fname} {""}
            {lname}
          </h3>
          <p className="profile-email">{email}</p>
          <hr />
        </div>

        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={menuItems}
          selectedKeys={[sideBar]}
          onClick={(e) => navigate(`/admin-profile/${e.key}`)}
          className="profile-menu"
        />
      </Sider>

      <Layout style={{ background: "none" }} className="profile-content-layout">
        <div style={{ flex: 1, padding: 5 }}>
          {sideBar === "mainprofile" ? (
            <MainProfile />
          ) : sideBar === "wishlist" ? (
            <WatchList />
          ) : sideBar === "bookmarked" ? (
            <BookMark />
          ) : sideBar === "viewed" ? (
            <RecentlyViewed />
          ) : sideBar === "listing" ? (
            <Listing />
          ) : sideBar === "settings" ? (
            <Settings />
          ) : sideBar === "accountsettings" ? (
            <AccountSettings />
          ) : sideBar === "prosubscription" ? (
            <ProSubscription />
          ) : sideBar === "applied" ? (
            <AppliedJobs />
          ) : sideBar === "appliedcandidates" ? (
            <AppliedCandidates onStatusChange={fetchPendingCount} />
          ) : (
            ""
          )}
        </div>

        {/* Modal for image preview */}
        <Modal
          open={isImageModalOpen}
          footer={null}
          onCancel={() => setIsImageModalOpen(false)}
          centered
        >
          <img
            alt="Profile"
            src={avatarUrl}
            style={{
              width: "100%",
              height: "400px",
              objectFit: "contain",
              borderRadius: "10px",
            }}
          />
        </Modal>
      </Layout>
    </Layout>
  );
}
