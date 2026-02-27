import React, { useEffect, useState } from "react";
import {
    Layout,
    Button,
    Table,
    Tag,
    Avatar,
    Input,
    Space,
    Typography,
    Card,
    Select,
    Skeleton,
    Tooltip,
    Drawer,
    message,
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
    MailOutlined,
    SearchOutlined,
    FilterOutlined,
    CheckOutlined,
    StopOutlined,
    FileTextOutlined,
    TrophyOutlined,
    SwapOutlined,
    TagsOutlined,
} from "@ant-design/icons";
import { FaInstagram, FaTwitter, FaFacebook, FaBehance, FaDribbble } from "react-icons/fa6";
import { EyeOutlined } from "@ant-design/icons";
import {
    getAllAppliedCandidates,
    getUserJobPostStatus,
    getUserProfile,
    updateUserAppliedJobStatus,
} from "../ApiService/action";
import { CommonToaster } from "../Common/CommonToaster";
import Header from "../Header/Header";

const { Content } = Layout;
const { Text } = Typography;
const { Option } = Select;

export default function AppliedCandidates({ onStatusChange }) {
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [appliedUsers, setAppliedUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [viewProfileLoading, setViewProfileLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [loadingAction, setLoadingAction] = useState({ id: null, action: null });

    const statusColors = {
        Shortlisted: {
            background: "#f6ffed",
            borderColor: "#b7eb8f",
            color: "#52c41a",
        },
        Rejected: {
            background: "#fff1f0",
            borderColor: "#ffa39e",
            color: "#f5222d",
        },
        "Mail Sent": {
            background: "#e6f4ff",
            borderColor: "#91caff",
            color: "#0958d9",
        },
        Pending: {
            background: "#fffbe6",
            borderColor: "#ffe58f",
            color: "#faad14",
        },
    };

    useEffect(() => {
        fetchCandidates();
    }, []);

    const fetchCandidates = async () => {
        setLoading(true);
        try {
            const response = await getAllAppliedCandidates();
            const users = response?.data?.data || [];
            console.log(users);

            const formattedUsers = await Promise.all(
                users.map(async (user, index) => {
                    let latestStatus = "Pending";
                    let latestUpdatedAt = null;

                    try {
                        // using applied_jobs_id from backend response
                        if (user.applied_jobs_id) {
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
                        }
                    } catch (err) {
                        console.error(`Status fetch failed for user ${user.user_id}`, err);
                    }

                    return {
                        ...user,
                        key: index,
                        name: `${user.first_name} ${user.last_name}`,
                        status: latestStatus,
                        status_updated_at: latestUpdatedAt,
                        score: user.score || 0,
                    };
                })
            );

            setAppliedUsers(formattedUsers);
        } catch (error) {
            console.error("Error fetching candidates:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleGetUserProfile = async (userId) => {
        try {
            setViewProfileLoading(true);
            const response = await getUserProfile({ user_id: userId });
            setSelectedUser(response?.data?.data || null);
            setOpen(true);
        } catch (error) {
            console.log("User Profile data error", error);
        } finally {
            setViewProfileLoading(false);
        }
    };

    const handleJobStatus = async (status, record) => {
        const backendStatusMap = {
            Shortlist: "Shortlisted",
            Rejected: "Rejected",
            "Sent Mail": "Mail Sent",
        };

        const finalStatus = backendStatusMap[status] || status;

        const payload = {
            post_id: record.job_post_id, // Use job_post_id from record
            user_id: record.user_id,
            status: finalStatus,
        };

        setLoadingAction({ id: record.applied_jobs_id, action: finalStatus });

        try {
            await updateUserAppliedJobStatus(payload);

            if (onStatusChange) {
                onStatusChange();
            }

            const lower = finalStatus.toLowerCase();
            if (lower === "shortlisted") message.success("Candidate Shortlisted Successfully");
            if (lower === "rejected") message.error("Candidate Rejected Successfully");
            if (lower === "mail sent") message.info("Mail Sent Successfully");

            setAppliedUsers((prev) =>
                prev.map((user) =>
                    user.user_id === record.user_id && user.applied_jobs_id === record.applied_jobs_id
                        ? {
                            ...user,
                            status: finalStatus,
                            status_updated_at: new Date().toISOString(),
                        }
                        : user
                )
            );
        } catch (error) {
            console.error("Status update error", error);
            message.error("Failed to update status");
        } finally {
            setLoadingAction({ id: null, action: null });
        }
    };

    const filteredUsers = appliedUsers.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.company_name.toLowerCase().includes(searchTerm.toLowerCase());

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
                        size={40}
                        src={record.profile_image}
                        icon={!record.profile_image && <UserOutlined />}
                    />
                    <div>
                        <div style={{ fontWeight: 600 }}>{record.name}</div>
                        <Text type="secondary" style={{ fontSize: 12 }}>{record.email}</Text>
                    </div>
                </Space>
            ),
        },
        {
            title: <Text type="secondary">APPLIED JOB</Text>,
            key: "job",
            render: (_, record) => (
                <div>
                    <div style={{ fontWeight: 600 }}>{record.job_title}</div>
                    <Text type="secondary" style={{ fontSize: 12 }}>{record.company_name}</Text>
                    <div style={{ fontSize: 11, color: '#999' }}>
                        Applied: {new Date(record.created_at).toLocaleDateString()}
                    </div>
                </div>
            ),
        },
        {
            title: <Text type="secondary">STATUS</Text>,
            dataIndex: "status",
            render: (status, record) => {
                const currentStatus = status || "Pending";
                const colors = statusColors[currentStatus] || statusColors["Pending"];
                return (
                    <Tag
                        style={{
                            fontWeight: 500,
                            borderRadius: 6,
                            background: colors.background,
                            borderColor: colors.borderColor,
                            color: colors.color,
                        }}
                    >
                        {currentStatus}
                    </Tag>
                );
            },
        },
        {
            title: <Text type="secondary">ACTION</Text>,
            key: "action",
            render: (text, record) => {
                const lowerStatus = record.status?.toLowerCase();

                return (
                    <Space>
                        <Tooltip title="Shortlist">
                            <Button
                                onClick={() => handleJobStatus("Shortlisted", record)}
                                shape="circle"
                                icon={<CheckOutlined />}
                                loading={loadingAction.id === record.applied_jobs_id && loadingAction.action === "Shortlisted"}
                                disabled={lowerStatus === "rejected" || lowerStatus === "mail sent"}
                                style={{
                                    border: "none",
                                    background: record.status === "Shortlisted" ? statusColors["Shortlisted"].color : "#f0f0f0",
                                    color: record.status === "Shortlisted" ? "#fff" : statusColors["Shortlisted"].color,
                                }}
                            />
                        </Tooltip>
                        <Tooltip title="Reject">
                            <Button
                                onClick={() => handleJobStatus("Rejected", record)}
                                shape="circle"
                                icon={<StopOutlined />}
                                loading={loadingAction.id === record.applied_jobs_id && loadingAction.action === "Rejected"}
                                disabled={lowerStatus === "shortlisted" || lowerStatus === "mail sent"}
                                style={{
                                    border: "none",
                                    background: record.status === "Rejected" ? statusColors["Rejected"].color : "#f0f0f0",
                                    color: record.status === "Rejected" ? "#fff" : statusColors["Rejected"].color,
                                }}
                            />
                        </Tooltip>
                        <Tooltip title="Send Email">
                            <Button
                                onClick={() => handleJobStatus("Mail Sent", record)}
                                shape="circle"
                                icon={<MailOutlined />}
                                loading={loadingAction.id === record.applied_jobs_id && loadingAction.action === "Mail Sent"}
                                disabled={lowerStatus === "rejected" || lowerStatus === "shortlisted"}
                                style={{
                                    border: "none",
                                    background: record.status === "Mail Sent" ? statusColors["Mail Sent"].color : "#f0f0f0",
                                    color: record.status === "Mail Sent" ? "#fff" : statusColors["Mail Sent"].color,
                                }}
                            />
                        </Tooltip>
                        <Tooltip title="View Profile">
                            <Button shape="circle" icon={<EyeOutlined />} onClick={() => handleGetUserProfile(record.user_id)} />
                        </Tooltip>
                    </Space>
                );
            },
        },
    ];

    return (
        <>
            <Header />
            <div style={{ padding: 20 }}>
                <h2 style={{ fontSize: 26, fontWeight: 600 }}>All Applied Candidates</h2>
                <Card style={{ marginTop: 20, borderRadius: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                        <Input
                            className="search-input"
                            placeholder="Search candidates, job, company..."
                            prefix={<SearchOutlined />}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: 300 }}
                        />
                        <Select
                            placeholder="Filter Status"
                            style={{ width: 160 }}
                            value={statusFilter}
                            onChange={(value) => setStatusFilter(value)}
                        >
                            <Option value="all">All Status</Option>
                            <Option value="pending">Pending</Option>
                            <Option value="shortlisted">Shortlisted</Option>
                            <Option value="rejected">Rejected</Option>
                            <Option value="mail sent">Sent Mail</Option>
                        </Select>
                    </div>

                    {loading ? (
                        <Skeleton active />
                    ) : (
                        <Table
                            columns={columns}
                            dataSource={filteredUsers}
                            pagination={{ pageSize: 10 }}
                            rowKey={(record) => record.applied_jobs_id || record.key}
                        />
                    )}
                </Card>

                <Drawer
                    className="userDetails_drawer"
                    closable
                    width={900}
                    title={
                        <div className="drawer-title">
                            <Avatar
                                size={36}
                                src={selectedUser?.profile_image}
                                style={{
                                    border: "2px solid #6a5cff",
                                }}
                            />
                            <span>User Profile</span>
                        </div>
                    }
                    placement="right"
                    open={open}
                    loading={viewProfileLoading}
                    onClose={() => setOpen(false)}
                >
                    {selectedUser && (
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
                                                icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
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
                    )}
                </Drawer>
            </div>
        </>

    );
}
