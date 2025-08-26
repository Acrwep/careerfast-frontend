import React, { useEffect, useState } from "react";
import {
  Layout,
  Menu,
  Button,
  Table,
  Tag,
  Avatar,
  Input,
  Space,
  Typography,
  Card,
  Dropdown,
  Select,
  Skeleton,
  Tooltip,
  Drawer,
} from "antd";
import {
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
import { FaInstagram, FaTwitter } from "react-icons/fa";
import { FaFacebook, FaBehance, FaDribbble } from "react-icons/fa6";
import {
  EyeOutlined,
  MailOutlined,
  SearchOutlined,
  FilterOutlined,
  MoreOutlined,
  CheckOutlined,
  StopOutlined,
} from "@ant-design/icons";
import {
  getJobAppliedCandidates,
  getJobPosts,
  getUserJobPostStatus,
  getUserProfile,
  updateUserAppliedJobStatus,
} from "../ApiService/action";
import { useParams } from "react-router-dom";

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

export default function ManageCandidate() {
  const [postId, setPostId] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [appliedUser, setAppliedUser] = useState([]);
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobTitle, setJobTitle] = useState("");
  const [appliedUserId, setAppliedUserId] = useState(null);
  const [postDetails, setPostDetails] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("loginDetails");
    if (stored) {
      try {
        const loginDetails = JSON.parse(stored);
        getUserProfileData(loginDetails.id);
      } catch (error) {
        console.error("Invalid JSON in localStorage", error);
      } finally {
        setTimeout(() => {
          getJobPostsData();
        }, 300);
      }
    }
  }, []);

  const getUserProfileData = async (userId) => {
    const payload = {
      user_id: userId,
    };

    try {
      const response = await getUserProfile(payload);
      console.log("getuserprofile", response);
    } catch (error) {
      console.log("getuserprofile error", error);
    }
  };

  useEffect(() => {
    if (id) {
      getJobAppliedCandidatesData();
    }
  }, [id]);

  const getJobAppliedCandidatesData = async () => {
    if (!id) return;
    setPostId(id);
    setLoading(true);

    try {
      const response = await getJobAppliedCandidates({ post_id: id });
      const users = response?.data?.data[0]?.users;

      if (!Array.isArray(users)) {
        setAppliedUser([]);
        setLoading(false);
        return;
      }

      const formattedUsers = await Promise.all(
        users.map(async (user, index) => {
          let latestStatus = "Pending";
          let latestUpdatedAt = null;

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
              latestUpdatedAt = statusList[0]?.changed_at || null;
            }
          } catch (err) {
            console.error(`Status fetch failed for user ${user.id}`, err);
          }

          return {
            ...user,
            key: user.id || index,
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            college: user.college_name,
            avatarColor: "#1890ff",
            profile_image: user.image || null,
            status: latestStatus, // ✅ correct
            status_updated_at: latestUpdatedAt, // ✅ include updated time
            score: user.score || 0,
          };
        })
      );

      setTimeout(() => {
        setAppliedUser(formattedUsers);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error("Error fetching applied candidates:", error);
      setTimeout(() => {
        setAppliedUser([]);
        setLoading(false);
      }, 800);
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

  const getJobPostsData = async () => {
    const payload = {};
    try {
      const response = await getJobPosts(payload);
      const jobs = response?.data?.data?.data || [];
      setPostDetails(jobs);
      if (id) {
        const matchedJob = jobs.find((job) => String(job.id) === String(id));
        setJobTitle(matchedJob ? matchedJob.job_title : "");
      }
    } catch (error) {
      console.log("applied candidate", error);
    } finally {
      getUserJobPostStatusData();
    }
  };

  const getUserJobPostStatusData = async () => {
    const payload = {
      applied_job_id: appliedUserId,
    };
    try {
      const response = await getUserJobPostStatus(payload);
      console.log("getUserJobPostStatus", response);
    } catch (error) {
      console.log("getUserJobPostStatus", error);
    }
  };

  const handleJobStatus = async (status, userId) => {
    const payload = {
      post_id: id,
      user_id: userId,
      status: status,
    };

    try {
      const response = await updateUserAppliedJobStatus(payload);
      console.log("updateUserAppliedJobStatus", response);

      setAppliedUser((prev) =>
        prev.map((user) =>
          user.id === userId
            ? {
                ...user,
                status: status,
                status_updated_at: new Date().toISOString(),
              }
            : user
        )
      );
    } catch (error) {
      console.log("updateUserAppliedJobStatus", error);
    }
  };

  const filteredUsers = appliedUser.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      user.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      title: <Text type="secondary">#</Text>,
      key: "index",
      width: 50,
      render: (text, record, index) => <Text>{index + 1}</Text>,
    },

    {
      title: <Text type="secondary">CANDIDATE</Text>,
      dataIndex: "name",
      render: (_, record) => (
        <Space>
          <Avatar
            size={48}
            src={record.image}
            style={{ marginRight: 12, border: "none" }}
            icon={!record.profile_image && <UserOutlined />}
          />

          <div>
            <div style={{ fontWeight: 600 }}>{record.name}</div>
            <Text type="secondary" style={{ fontSize: 13 }}>
              {record.email}
            </Text>
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {record.college}
              </Text>
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: <Text type="secondary">CANDIDATE STATUS</Text>,
      dataIndex: "status",
      render: (status, record) => {
        let color = "default";
        const lower = status?.toLowerCase();

        if (lower === "shortlist") color = "green";
        else if (lower === "rejected") color = "red";
        else if (lower === "sent mail") color = "blue";
        else if (lower === "pending") color = "orange";

        return (
          <Tooltip
            title={`Last updated: ${new Date(
              record.status_updated_at
            ).toLocaleDateString()}`}
          >
            <Tag color={color} style={{ fontWeight: 500, borderRadius: 6 }}>
              {status?.charAt(0).toUpperCase() + status?.slice(1)}
            </Tag>
          </Tooltip>
        );
      },
    },
    {
      title: <Text type="secondary">REG STATUS</Text>,
      key: "regStatus",
      render: (text, record) => {
        const lowerStatus = record.status?.toLowerCase();

        return (
          <Space>
            <Tooltip title="Shortlist">
              <Button
                onClick={() => handleJobStatus("Shortlist", record.id)}
                shape="circle"
                icon={<CheckOutlined />}
                disabled={
                  lowerStatus === "rejected" || lowerStatus === "sent mail"
                }
                style={{
                  background: "#f6ffed",
                  borderColor: "#b7eb8f",
                  color: "#52c41a",
                  opacity:
                    lowerStatus === "rejected" || lowerStatus === "sent mail"
                      ? 0.5
                      : 1,
                }}
              />
            </Tooltip>

            <Tooltip title="Reject">
              <Button
                onClick={() => handleJobStatus("Rejected", record.id)}
                shape="circle"
                icon={<StopOutlined />}
                style={{
                  background: "#fff1f0",
                  borderColor: "#ffa39e",
                  color: "#f5222d",
                }}
              />
            </Tooltip>

            <Tooltip title="Send Email">
              <Button
                onClick={() => handleJobStatus("Sent Mail", record.id)}
                shape="circle"
                icon={<MailOutlined />}
                style={{
                  background: "#e6f4ff",
                  borderColor: "#91caff",
                  color: "#0958d9",
                }}
              />
            </Tooltip>
          </Space>
        );
      },
    },
    {
      title: <Text type="secondary">COMPATIBILITY</Text>,
      dataIndex: "score",
      render: (score) => (
        <div style={{ position: "relative", width: 60 }}>
          <div
            style={{
              height: 6,
              background: "#f0f0f0",
              borderRadius: 3,
              marginBottom: 4,
            }}
          >
            <div
              style={{
                width: `${score}%`,
                height: "100%",
                background:
                  "linear-gradient(135deg, #7f5af0 0%, #5f2eea 50%, #4b1ea0 100%)",
                borderRadius: 3,
              }}
            />
          </div>
          <Text strong>{score}%</Text>
        </div>
      ),
    },

    {
      title: "",
      key: "action",
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item
                key="view"
                onClick={() => handleGetUserProfile(record.id)}
                icon={<EyeOutlined />}
              >
                View Profile
              </Menu.Item>
              <Menu.Item key="email" icon={<MailOutlined />}>
                Send Email
              </Menu.Item>
            </Menu>
          }
          trigger={["click"]}
        >
          <Button
            shape="circle"
            icon={<MoreOutlined />}
            style={{ border: "none", boxShadow: "none" }}
          />
        </Dropdown>
      ),
    },
  ];

  return (
    <Layout
      className="manage-can"
      style={{
        minHeight: "100vh",
        margin: 0,
        padding: 0,
        background: "#f5f7fa",
      }}
    >
      {/* Main Content */}
      <Layout style={{ padding: 20 }}>
        <Header
          style={{
            borderRadius: 12,
            background: "#fff",
            padding: "0 32px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            zIndex: 1,
          }}
        >
          <Title level={4} style={{ margin: 0 }}>
            <b style={{ color: "#5f2eea", fontWeight: 800 }}>{jobTitle}</b> |
            All Registrations
          </Title>
        </Header>

        <Content style={{ margin: "24px", padding: 0 }}>
          <Card
            bordered={false}
            style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
            bodyStyle={{ padding: 24 }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 24,
              }}
            >
              <Space>
                <Input
                  size="large"
                  placeholder="Search candidates..."
                  prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                  style={{ width: 320 }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Select
                  size="large"
                  placeholder="Filter Status"
                  suffixIcon={<FilterOutlined style={{ color: "#706f6fff" }} />}
                  style={{
                    width: 160,
                    background: "#E9E0FE",
                    color: "#5f2eea",
                    padding: "0px 5px 0px 10px",
                    borderRadius: "6px",
                  }}
                  value={statusFilter}
                  onChange={(value) => setStatusFilter(value)}
                >
                  <Option value="all">All Status</Option>
                  <Option value="pending">Pending</Option>
                  <Option value="shortlist">Shortlisted</Option>
                  <Option value="rejected">Rejected</Option>
                  <Option value="sent mail">Sent Mail</Option>
                </Select>
              </Space>

              <Space>
                {/* <Button size="large" icon={<DownloadOutlined />}>
                  Export
                </Button> */}
                <Button
                  className="view_all_can"
                  size="large"
                  icon={<MailOutlined />}
                  type="primary"
                >
                  Email Selected
                </Button>
              </Space>
            </div>

            {loading ? (
              <Skeleton
                avatar={{ size: "large", shape: "circle" }}
                active
                paragraph={{ rows: 5 }}
                title={false}
                style={{ padding: "24px 0" }}
              />
            ) : (
              <Table
                columns={columns}
                dataSource={filteredUsers}
                pagination={{
                  position: ["bottomRight"],
                  showSizeChanger: true,
                  pageSizeOptions: ["10", "20", "50"],
                }}
                rowSelection={{
                  type: "checkbox",
                  columnWidth: 48,
                }}
                style={{
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              />
            )}
          </Card>
        </Content>
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
                  <Avatar size={100} src={selectedUser.profile_image} />
                  <div className="status-indicator"></div>
                </div>
                <div className="name">
                  {selectedUser.first_name} {selectedUser.last_name}
                </div>
                <div className="role">{selectedUser.role_name}</div>
                <div style={{ display: "flex", gap: 10 }}>
                  <div className="location">
                    <EnvironmentOutlined />
                    <span>{selectedUser.location}</span>
                  </div>

                  <div className="verification-badge">
                    {selectedUser.is_email_verified ? (
                      <Tag
                        icon={
                          <CheckCircleOutlined style={{ color: "#52c41a" }} />
                        }
                        color="success"
                      >
                        Verified
                      </Tag>
                    ) : (
                      <Tag icon={<ExclamationCircleOutlined />} color="error">
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
                        const value = selectedUser.social_links[key];
                        return (
                          <a
                            key={key}
                            href={value || "#"}
                            target="_blank"
                            rel="noreferrer"
                            className={`social-icon ${key}`}
                            style={{
                              opacity: value ? 1 : 0.3,
                              pointerEvents: value ? "auto" : "none",
                            }}
                          >
                            {key === "linkedin" && <LinkedinOutlined />}
                            {key === "facebook" && <FaFacebook />}
                            {key === "instagram" && <FaInstagram />}
                            {key === "behance" && <FaBehance />}
                            {key === "twitter" && <FaTwitter />}
                            {key === "dribble" && <FaDribbble />}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT DETAILS */}
              <div className="user-details-cards">
                <Card title="Basic Information" className="info-card">
                  <div className="info-grid">
                    <div className="info-item">
                      <div className="info-icon">
                        <MailOutlined />
                      </div>
                      <div className="info-content">
                        <div className="info-label">Email</div>
                        <div className="info-value">{selectedUser.email}</div>
                      </div>
                    </div>

                    <div className="info-item">
                      <div className="info-icon">
                        <PhoneOutlined />
                      </div>
                      <div className="info-content">
                        <div className="info-label">Phone</div>
                        <div className="info-value">
                          {selectedUser.phone || (
                            <span className="na-text">N/A</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="info-item">
                      <div className="info-icon">
                        <UserOutlined />
                      </div>
                      <div className="info-content">
                        <div className="info-label">Gender</div>
                        <div className="info-value">
                          {selectedUser.gender || (
                            <span className="na-text">N/A</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="info-item">
                      <div className="info-icon">
                        <CalendarOutlined />
                      </div>
                      <div className="info-content">
                        <div className="info-label">Start Year</div>
                        <div className="info-value">
                          {selectedUser.start_year || (
                            <span className="na-text">N/A</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card title="Professional Information" className="info-card">
                  <div className="info-grid">
                    <div className="info-item">
                      <div className="info-icon">
                        <BankOutlined />
                      </div>
                      <div className="info-content">
                        <div className="info-label">Organization</div>
                        <div className="info-value">
                          {selectedUser.organization || (
                            <span className="na-text">N/A</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="info-item">
                      <div className="info-icon">
                        <ApartmentOutlined />
                      </div>
                      <div className="info-content">
                        <div className="info-label">Org Type</div>
                        <div className="info-value">
                          {selectedUser.organization_type || (
                            <span className="na-text">N/A</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="info-item">
                      <div className="info-icon">
                        <ExperimentOutlined />
                      </div>
                      <div className="info-content">
                        <div className="info-label">Experience</div>
                        <div className="info-value">
                          {selectedUser.experince_type || (
                            <span className="na-text">N/A</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="info-item">
                      <div className="info-icon">
                        <FieldTimeOutlined />
                      </div>
                      <div className="info-content">
                        <div className="info-label">Experience Duration</div>
                        <div className="info-value">
                          {selectedUser.total_years ||
                          selectedUser.total_months ? (
                            <>
                              {selectedUser.total_years || 0}{" "}
                              {selectedUser.total_months
                                ? ` ${selectedUser.total_months}`
                                : ""}
                            </>
                          ) : (
                            <span className="na-text">N/A</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card title="Education" className="info-card">
                  {selectedUser.education &&
                  selectedUser.education.length > 0 ? (
                    <div className="info-grid">
                      <div className="info-item">
                        <div className="info-icon">
                          <FileTextOutlined />
                        </div>
                        <div className="info-content">
                          <div className="info-label">Course & College</div>
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
                          <div className="info-label">Specialization</div>
                          <div className="info-value">
                            {selectedUser.education[0].specialization || "N/A"}
                          </div>
                        </div>
                      </div>

                      <div className="info-item">
                        <div className="info-icon">
                          <CalendarOutlined />
                        </div>
                        <div className="info-content">
                          <div className="info-label">Duration</div>
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
                          <div className="info-label">CGPA / Percentage</div>
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
                          <div className="info-label">Qualification</div>
                          <div className="info-value">
                            {selectedUser.education[0].qualification}
                          </div>
                        </div>
                      </div>

                      <div className="info-item">
                        <div className="info-icon">
                          <SwapOutlined />
                        </div>
                        <div className="info-content">
                          <div className="info-label">Lateral Entry</div>
                          <div className="info-value">
                            {selectedUser.education[0].lateral_entry}
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
                  <Card title="Skills" className="info-card">
                    <div className="skills-container">
                      {selectedUser.skills.map((skill, idx) => (
                        <div key={idx} className="skill-pill">
                          {skill}
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {selectedUser.about && (
                  <Card title="About" className="info-card">
                    <div className="about-container">
                      <div className="about-text">{selectedUser.about}</div>
                    </div>
                  </Card>
                )}

                {selectedUser.resume ? (
                  <Card title="Resume" className="info-card">
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
                ) : null}
              </div>
            </div>
          </Drawer>
        )}
      </Layout>
    </Layout>
  );
}
