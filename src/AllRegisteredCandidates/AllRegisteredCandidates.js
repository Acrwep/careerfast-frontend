// allapplied.js
import React, { useEffect, useState } from "react";
import {
    Layout,
    Table,
    Tag,
    Avatar,
    Input,
    Space,
    Typography,
    Card,
    Dropdown,
    Button,
    Skeleton,
    Select,
    Drawer,
    message,
    Badge,
    Statistic,
    Slider,
} from "antd";
import {
    UserOutlined,
    EyeOutlined,
    MailOutlined,
    MoreOutlined,
    CalendarOutlined,
    BankOutlined,
    FieldTimeOutlined,
    TrophyOutlined,
    DownloadOutlined,
    PhoneOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    EnvironmentOutlined,
    FileTextOutlined,
    TagsOutlined,
    LinkedinOutlined,
    ApartmentOutlined,
    ExperimentOutlined,
    SwapOutlined,
    SearchOutlined,
    TeamOutlined,
    DownOutlined,
    ReloadOutlined
} from "@ant-design/icons";

// ✅ Import your actual API service
import { getUsers, getUserProfile } from "../ApiService/action";
import { FaBehance, FaDribbble, FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa6";
import Footer from "../Footer/Footer";

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

export default function AllRegisteredCandidates() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [viewProfileLoading, setViewProfileLoading] = useState(false);
    const [userTypeFilter, setUserTypeFilter] = useState("all");
    const [experienceRange, setExperienceRange] = useState([0, 10]);



    useEffect(() => {
        getUserData();
    }, []);

    // ✅ Fetch real users
    const getUserData = async () => {
        setLoading(true);
        try {
            const response = await getUsers();
            console.log("getusers", response);
            const data = response?.data?.data || response?.data || [];

            const formattedUsers = data.map((user, index) => ({
                ...user,
                key: user.id || index,
                name: `${user.first_name || ""} ${user.last_name || ""}`,
                email: user.email,
                college: user.college_name || "N/A",
                status: user.status || "Pending",
                score: user.score || 0,
                joinDate: user.created_at || "2024-01-01",
            }));

            setUsers(formattedUsers);
        } catch (error) {
            console.error("getUsers error", error);
            message.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Fetch single profile
    const handleGetUserProfile = async (userId) => {
        try {
            setViewProfileLoading(true);
            const response = await getUserProfile({ user_id: userId });
            setSelectedUser(response?.data?.data || response?.data || null);
            setOpen(true);
        } catch (error) {
            console.error("User Profile error", error);
            message.error("Failed to load profile");
            setSelectedUser(null);
        } finally {
            setViewProfileLoading(false);
        }
    };

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            (user.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.phone?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())));

        const matchesStatus =
            statusFilter === "all" ||
            user.status?.toLowerCase() === statusFilter.toLowerCase();

        const matchesExperience = (() => {
            // Extract numbers from "7 Years" and "4 Months" safely
            const yearMatch = String(user.total_years || "0").match(/\d+/);
            const monthMatch = String(user.total_months || "0").match(/\d+/);

            const years = yearMatch ? parseInt(yearMatch[0], 10) : 0;
            const months = monthMatch ? parseInt(monthMatch[0], 10) : 0;

            // Convert total months into fractional years
            const totalExperience = years + months / 12;

            // Apply slider filter
            return totalExperience >= experienceRange[0] && totalExperience <= experienceRange[1];
        })();




        const matchesUserType =
            userTypeFilter === "all" ||
            (user.user_type && user.user_type.toLowerCase() === userTypeFilter.toLowerCase());

        return matchesSearch && matchesStatus && matchesExperience && matchesUserType;
    });


    const columns = [
        {
            title: <Text type="secondary" style={{ fontSize: 12, fontWeight: 600 }}>#</Text>,
            key: "index",
            width: 60,
            render: (text, record, index) => (
                <Text style={{ color: "#8c8c8c", fontWeight: 500 }}>{index + 1}</Text>
            ),
        },
        {
            title: <Text type="secondary" style={{ fontSize: 12, fontWeight: 600 }}>CANDIDATE</Text>,
            dataIndex: "name",
            render: (_, record) => (
                <Space style={{ padding: "8px 0" }}>
                    <Badge
                        dot
                        color={record.status === "Active" ? "#52c41a" : "#faad14"}
                        offset={[-5, 40]}
                    >
                        <Avatar
                            size={50}
                            src={record.profile_image}
                            style={{
                                marginRight: 16,
                                border: "3px solid #f0f0f0",
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            }}
                            icon={!record.image && <UserOutlined />}
                        />
                    </Badge>
                    <div>
                        <div style={{ fontWeight: 600, fontSize: 15, color: "#262626", marginBottom: 2 }}>
                            {record.name}
                        </div>
                        <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 2 }}>
                            {record.email}
                        </Text>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <PhoneOutlined style={{ fontSize: 10, color: "#8c8c8c" }} />
                            <Text type="secondary" style={{ fontSize: 11 }}>
                                {record.phone_code} {record.phone}
                            </Text>
                        </div>
                    </div>
                </Space>
            ),
        },
        {
            title: (
                <Text type="secondary" style={{ fontSize: 12, fontWeight: 600 }}>
                    SKILLS
                </Text>
            ),
            dataIndex: "skills",
            render: (skills) =>
                skills && skills.length > 0 ? (
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(2, 1fr)",
                            gap: "4px 0px",
                        }}
                    >
                        {skills.map((skill, idx) => (
                            <Text key={idx} style={{ fontSize: 12, fontWeight: 500 }}>
                                {skill}
                                {idx !== skills.length - 1 && ","} {/* ✅ Add comma except last */}
                            </Text>
                        ))}
                    </div>
                ) : (
                    <Text type="secondary">N/A</Text>
                ),
        }
        ,
        {
            title: (
                <Text type="secondary" style={{ fontSize: 12, fontWeight: 600 }}>
                    USER TYPE
                </Text>
            ),
            dataIndex: "college",
            render: (_, record) => (
                <>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                        <h3 style={{ fontSize: 15, color: "#2b2b2bff" }}>
                            {{
                                "College Student": "College Student :",
                                "Fresher": "Graduated Fresher :",
                                "Professional": "Professional",
                                "School Student": "School Student :",
                            }[record.user_type] || "N/A"}
                        </h3>
                    </div>

                    {record.user_type !== "Professional" && (
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <Text style={{ fontSize: 13, color: "#595959" }}>
                                {{
                                    "College Student": record.course,
                                    "Fresher": record.course,
                                    "School Student": record.class,
                                }[record.user_type] || "N/A"}
                            </Text>
                        </div>
                    )}
                </>
            )

        },
        {
            title: <Text type="secondary" style={{ fontSize: 12, fontWeight: 600 }}>EXPERIENCE</Text>,
            dataIndex: "joinDate",
            render: (_, record) => (
                <>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <h3 style={{ fontSize: 15, color: "#2b2b2bff" }}>
                            {record.experince_type === "Fresher" ? ("Fresher") : record.experince_type === "Experience" ? (
                                "Experience :"
                            ) : "N/A"}
                        </h3>
                    </div>
                    <Text style={{ fontSize: 13, color: "#595959" }}>
                        {record.experince_type === "Fresher"
                            ? "-"
                            : record.experince_type === "Experience"
                                ? `${record.total_years} ${record.total_months}`
                                : "N/A"}
                    </Text>

                </>
            ),
        },
        // {
        //     title: <Text type="secondary" style={{ fontSize: 12, fontWeight: 600 }}>STATUS</Text>,
        //     dataIndex: "status",
        //     render: (status) => {
        //         const colors = statusColors[status] || statusColors["Pending"];
        //         return (
        //             <Tag
        //                 style={{
        //                     fontWeight: 600,
        //                     borderRadius: 16,
        //                     padding: "4px 12px",
        //                     background: colors.background,
        //                     border: `1px solid ${colors.borderColor}`,
        //                     color: colors.color,
        //                     fontSize: 11,
        //                     display: "flex",
        //                     alignItems: "center",
        //                     gap: 4,
        //                 }}
        //                 icon={colors.icon}
        //             >
        //                 {status}
        //             </Tag>
        //         );
        //     },
        // },
        // {
        //     title: <Text type="secondary" style={{ fontSize: 12, fontWeight: 600 }}>COMPATIBILITY</Text>,
        //     dataIndex: "score",
        //     render: (score) => (
        //         <div style={{ minWidth: 100 }}>
        //             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        //                 <Text strong style={{ color: getScoreColor(score), fontSize: 14 }}>
        //                     {score}%
        //                 </Text>
        //                 <TrophyOutlined style={{ color: getScoreColor(score), fontSize: 12 }} />
        //             </div>
        //             <div
        //                 style={{
        //                     height: 6,
        //                     background: "#f0f0f0",
        //                     borderRadius: 3,
        //                     overflow: "hidden",
        //                 }}
        //             >
        //                 <div
        //                     style={{
        //                         width: `${score}%`,
        //                         height: "100%",
        //                         background: `linear-gradient(90deg, ${getScoreColor(score)}33, ${getScoreColor(score)})`,
        //                         borderRadius: 3,
        //                         transition: "all 0.3s ease",
        //                     }}
        //                 />
        //             </div>
        //         </div>
        //     ),
        // },
        {
            title: "",
            key: "action",
            width: 80,
            render: (_, record) => (
                <Dropdown
                    menu={{
                        items: [
                            {
                                key: "view",
                                icon: <EyeOutlined />,
                                label: "View Profile",
                                onClick: () => handleGetUserProfile(record.id),
                            },
                            {
                                key: "email",
                                icon: <MailOutlined />,
                                label: "Send Email",
                            },
                            {
                                key: "download",
                                icon: <DownloadOutlined />,
                                label: "Download CV",
                            },
                        ],
                    }}
                    placement="bottomRight"
                >
                    <Button
                        shape="circle"
                        icon={<MoreOutlined />}
                        style={{
                            border: "1px solid #f0f0f0",
                            background: "#fff",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                        }}
                    />
                </Dropdown>
            ),
        },
    ];

    const statsData = {
        total: users.length,
        active: users.filter((u) => u.status === "Active").length,
        pending: users.filter((u) => u.status === "Pending").length,
        averageScore: users.length
            ? Math.round(users.reduce((acc, u) => acc + u.score, 0) / users.length)
            : 0,
    };

    return (
        <>
            <Layout style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)" }}>
                <Layout style={{ padding: 24 }}>
                    <Header
                        style={{
                            borderRadius: 16,
                            background: "linear-gradient(135deg, #fff 0%, #fafafa 100%)",
                            padding: "40px 32px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                            border: "1px solid rgba(0,0,0,0.03)",
                            marginBottom: 24,
                        }}
                    >
                        <div style={{ display: "grid" }}>
                            <Title level={3} style={{ margin: 0, color: "#1a1a1a", fontWeight: 700 }}>
                                Candidate Management
                            </Title>
                            <Text type="secondary" style={{ fontSize: 14 }}>
                                Manage and review all registered candidates
                            </Text>
                        </div>
                        <Space>
                            <Button
                                type="primary"
                                icon={<DownloadOutlined />}
                                style={{
                                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                    border: "none",
                                    fontWeight: 600,
                                }}
                            >
                                Export Data
                            </Button>
                        </Space>
                    </Header>

                    {/* Statistics */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
                        <Card>
                            <Statistic title="Total Candidates" value={statsData.total} valueStyle={{ color: "#1890ff" }} prefix={<UserOutlined />} />
                        </Card>
                        <Card>
                            <Statistic title="Active" value={statsData.active} valueStyle={{ color: "#52c41a" }} prefix={<CheckCircleOutlined />} />
                        </Card>
                        <Card>
                            <Statistic title="Pending" value={statsData.pending} valueStyle={{ color: "#faad14" }} prefix={<FieldTimeOutlined />} />
                        </Card>
                        <Card>
                            <Statistic title="Avg. Score" value={statsData.averageScore} suffix="%" valueStyle={{ color: "#722ed1" }} prefix={<TrophyOutlined />} />
                        </Card>
                    </div>

                    <Content>
                        <Card
                            style={{
                                marginBottom: 24,
                                borderRadius: 16,
                                background: "linear-gradient(135deg, #ffffff 0%, #f9f9fb 100%)",
                                boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
                                border: "1px solid #f0f0f0",
                            }}
                            bodyStyle={{ padding: "16px 24px" }}
                        >
                            <Space
                                wrap
                                align="center"
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    flexWrap: "wrap",
                                    rowGap: 20,
                                    padding: "24px",
                                    background: "linear-gradient(135deg, rgb(236 230 255) 0%, rgb(225 221 255) 100%)",
                                    borderRadius: 20,
                                    border: "1px solid #e8edff",
                                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
                                    marginBottom: 24,
                                }}
                            >
                                {/* 🔍 Premium Search */}
                                <div style={{ position: "relative" }}>
                                    <Input
                                        prefix={
                                            <SearchOutlined
                                                style={{
                                                    color: "#667eea",
                                                    fontSize: 16,
                                                }}
                                            />
                                        }
                                        placeholder="Search by name, email, phone, or skills..."
                                        allowClear
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        style={{
                                            width: 380,
                                            height: 48,
                                            borderRadius: 16,
                                            paddingLeft: 16,
                                            background: "#ffffff",
                                            fontSize: 14,
                                            fontWeight: 400,
                                            boxShadow: "0 2px 12px rgba(102, 126, 234, 0.08)",
                                            transition: "all 0.3s ease",
                                        }}
                                    />
                                    <div style={{
                                        position: "absolute",
                                        top: -8,
                                        left: 12,
                                        background: "#667eea",
                                        color: "white",
                                        fontSize: 10,
                                        fontWeight: 600,
                                        padding: "2px 8px",
                                        borderRadius: 10,
                                        letterSpacing: 0.5,
                                    }}>
                                        QUICK SEARCH
                                    </div>
                                </div>

                                <Space wrap size={30}>
                                    {/* Experience Range Filter */}
                                    <div
                                        style={{
                                            background: "white",
                                            padding: "12px 20px",
                                            borderRadius: 16,
                                            boxShadow: "0 2px 10px rgba(102,126,234,0.1)",
                                            minWidth: 280,
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                marginBottom: 6,
                                            }}
                                        >
                                            <span
                                                style={{
                                                    color: "#667eea",
                                                    fontWeight: 600,
                                                    fontSize: 13,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 6,
                                                }}
                                            >
                                                <ExperimentOutlined /> Experience Range
                                            </span>
                                            <span style={{ fontSize: 13, fontWeight: 500, color: "#333" }}>
                                                {experienceRange[0]} – {experienceRange[1]} yrs
                                            </span>
                                        </div>

                                        <div style={{ padding: "0 8px" }}>
                                            <Slider
                                                range
                                                step={0.5}
                                                min={0}
                                                max={10}
                                                tooltip={{ open: false }}
                                                value={experienceRange}
                                                onChange={(value) => setExperienceRange(value)}
                                                trackStyle={[{ backgroundColor: "#667eea" }]}
                                                handleStyle={[
                                                    { borderColor: "#667eea", backgroundColor: "#fff" },
                                                    { borderColor: "#667eea", backgroundColor: "#fff" },
                                                ]}
                                            />
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    fontSize: 12,
                                                    color: "#8c8c8c",
                                                }}
                                            >
                                                <span>0 yrs</span>
                                                <span>5 yrs</span>
                                                <span>10+ yrs</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* User Type Filter */}
                                    <div style={{ position: "relative" }}>
                                        <Select
                                            value={userTypeFilter}
                                            onChange={setUserTypeFilter}
                                            style={{
                                                width: 200,
                                                height: 42,
                                                background: "#fff",
                                                padding: "10px",
                                                borderRadius: 10
                                            }}
                                            placeholder={
                                                <span style={{ color: "#8c8c8c", fontWeight: 500 }}>
                                                    <TeamOutlined style={{ marginRight: 8, color: "#667eea" }} />
                                                    User Type
                                                </span>
                                            }
                                            options={[
                                                { value: "all", label: <span style={{ fontWeight: 500 }}>All User Types</span> },
                                                { value: "College Student", label: <span style={{ fontWeight: 500 }}>🎓 College Student</span> },
                                                { value: "Fresher", label: <span style={{ fontWeight: 500 }}>📚 Graduated Fresher</span> },
                                                { value: "Professional", label: <span style={{ fontWeight: 500 }}>💼 Professional</span> },
                                                { value: "School Student", label: <span style={{ fontWeight: 500 }}>📖 School Student</span> },
                                            ]}
                                            suffixIcon={<DownOutlined style={{ color: "#667eea" }} />}
                                        />
                                    </div>

                                    {/* Reset Button - Premium Style */}
                                    <Button
                                        onClick={() => {
                                            setSearchTerm("");
                                            setStatusFilter("all");
                                            setExperienceRange([0, 10]);
                                            setUserTypeFilter("all");
                                        }}
                                        icon={<ReloadOutlined />}
                                        style={{
                                            borderRadius: 16,
                                            padding: "0 20px",
                                            height: 42,
                                            background: "linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%)",
                                            border: "none",
                                            fontWeight: 600,
                                            color: "white",
                                            transition: "all 0.3s ease",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 8,
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.transform = "translateY(-2px)";
                                            e.target.style.boxShadow = "0 6px 10px rgb(102, 126, 234)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.transform = "translateY(0)";
                                            e.target.style.boxShadow = "0 0px 0px rgb(102, 126, 234)";
                                        }}
                                    >
                                        Reset Filters
                                    </Button>
                                </Space>
                            </Space>

                            {loading ? (
                                <Skeleton active avatar paragraph={{ rows: 6 }} />
                            ) : (
                                <Table
                                    columns={columns}
                                    dataSource={filteredUsers}
                                    pagination={{
                                        position: ["bottomRight"],
                                        showSizeChanger: true,
                                        pageSizeOptions: ["10", "20", "50"],
                                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} candidates`,
                                        style: { marginTop: 24 },
                                    }}
                                    rowSelection={{ type: "checkbox", columnWidth: 48 }}
                                />
                            )}
                        </Card>
                    </Content>

                    {/* Drawer for Profile */}
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
                            loading={viewProfileLoading}
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
            <Footer />
        </>

    );
}
