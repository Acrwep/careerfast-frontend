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
const { Title, Text } = Typography;
const { Dragger } = Upload;

const { Header, Sider, Content } = Layout;

const menuItems = [
  { key: "mainprofile", icon: <FaUserPen />, label: "Your profile" },
  { key: "watchlist", icon: <FaRegHeart />, label: "Watchlist" },
  { key: "bookmarked", icon: <FaRegBookmark />, label: "Bookmarked Jobs" },
  { key: "viewed", icon: <ClockCircleOutlined />, label: "Recently Viewed" },
  {
    key: "certificates",
    icon: <SafetyCertificateOutlined />,
    label: "Certificates",
  },
  { key: "settings", icon: <SettingOutlined />, label: "Settings" },
  { key: "listing", icon: <FaListOl />, label: "Manage Listing" },
  {
    key: "accountsettings",
    icon: <SettingOutlined />,
    label: "Account Settings",
  },
  { key: "prosubscription", icon: <FcApproval />, label: "Pro Subscription" },
];

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

const items = [
  { key: "basic", label: "Basic Details" },
  { key: "resume", label: "Resume" },
  { key: "about", label: "About" },
  { key: "skills", label: "Skills" },
  { key: "education", label: "Education" },
  { key: "experience", label: "Work Experience" },
  { key: "certification", label: "Certifications" },
  { key: "projects", label: "Projects" },
  { key: "sociallinks", label: "Social Links" },
];

const suggestions = [
  "Deep Learning",
  "Tone of Voice",
  "CRM Proficiency",
  "E-Discovery",
  "Embedded Programming",
  "GDPR Compliance",
  "Medical Malpractice",
  "Remote Access",
  "Education Law",
  "Substance Designer",
];

const drawerContentStyle = {
  display: "flex",
  gap: "24px",
};

const onChangeDate = (date, dateString) => {
  console.log(date, dateString);
};

export default function UserProfile() {
  const [collapsed, setCollapsed] = useState(false);
  const [certifications, setCertification] = useState([]);
  const [sideBar, setSideBar] = useState("mainprofile");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [customSkill, setCustomSkill] = useState("");
  const [activeButton, setActiveButton] = useState(null);
  const [fileName, setFileName] = useState("");
  const [userTypeactiveButton, setUserTypeActiveButton] = useState(null);

  const today = new Date();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };

  const onCloseDrawer = () => {
    setOpen(false);
  };

  const handleAddSkill = (skill) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSelectedSkills(
      selectedSkills.filter((skill) => skill !== skillToRemove)
    );
  };

  const handleCustomSkillAdd = () => {
    const trimmed = customSkill.trim();
    if (trimmed && !selectedSkills.includes(trimmed)) {
      setSelectedSkills([...selectedSkills, trimmed]);
      setCustomSkill("");
    }
  };

  const handleButtonClick = (buttonId) => {
    setActiveButton((prev) => buttonId);
  };

  const handleUserTypeClick = (buttonId) => {
    setUserTypeActiveButton((prev) => buttonId);
  };

  const [purpose, setPurpose] = useState(null);
  const handlePurposeClick = (buttonId) => {
    setPurpose((prev) => buttonId);
  };

  const [Class, setClass] = useState(null);
  const handleClassClick = (buttonId) => {
    setClass((prev) => buttonId);
  };

  const handleCertification = ({ file }) => {
    console.log("fileee", file);

    setCertification([file]);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setFileName(file.name);
    } else {
      setFileName("");
    }
  };

  const SidebarContent = {
    mainprofile: () => <MainProfile />,
    watchlist: () => <WatchList />,
    bookmarked: () => <div>hello Ladki</div>,
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
            src="https://i.imgur.com/your-avatar.png"
            className="profile-avatar"
          />
          <h3 className="profile-name">Santhosh Kathirvel</h3>
          <p className="profile-email">
            santhoshkathirvel.s@actetechnologies.com
          </p>

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
