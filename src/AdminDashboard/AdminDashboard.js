import { useState } from "react";
import React from "react";
import {
  IoQrCode,
  IoNotifications,
  IoSettingsSharp,
  IoLogOutOutline,
  IoPersonCircleOutline,
} from "react-icons/io5";
import { FaClipboardUser, FaRegChartBar, FaChartLine } from "react-icons/fa6";
import { MdOutlineModeEdit, MdDashboard } from "react-icons/md";
import { FaEye, FaSearch, FaChevronDown } from "react-icons/fa";
import { VscGraph } from "react-icons/vsc";
import "../css/AdminDashboard.css";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  MailOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Divider,
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
} from "antd";
import ManageCandidate from "./ManageCandidate";
const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

export default function AdminDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG, colorPrimary },
  } = theme.useToken();

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
      key: "4",
      icon: <FaEye size={16} />,
      label: "View Opportunity",
    },
    {
      key: "5",
      icon: <VscGraph size={17} />,
      label: "Opportunity Stats",
      children: [
        {
          key: "5-1",
          label: "Analytics",
          icon: <FaRegChartBar size={15} />,
        },
        {
          key: "5-2",
          label: "Reports",
          icon: <FaChartLine size={15} />,
        },
      ],
    },
    {
      key: "6",
      icon: <IoNotifications size={18} />,
      label: "Manage Notifications",
    },
    {
      key: "7",
      icon: <IoSettingsSharp size={17} />,
      label: "Settings",
    },
  ];

  const userMenu = (
    <Menu
      items={[
        {
          key: "1",
          label: "Profile",
          icon: <IoPersonCircleOutline size={16} />,
        },
        {
          key: "2",
          label: "Settings",
          icon: <IoSettingsSharp size={16} />,
        },
        {
          type: "divider",
        },
        {
          key: "3",
          label: "Logout",
          icon: <IoLogOutOutline size={16} />,
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

  const candidates = [
    {
      name: "Alex Johnson",
      position: "Senior UX Designer",
      status: "Interview",
      progress: 75,
    },
    {
      name: "Maria Garcia",
      position: "Fullstack Developer",
      status: "Technical Test",
      progress: 50,
    },
    {
      name: "David Kim",
      position: "Product Manager",
      status: "Final Review",
      progress: 90,
    },
    {
      name: "Sarah Wilson",
      position: "DevOps Engineer",
      status: "Screening",
      progress: 30,
    },
  ];

  const [activeTab, setActiveTab] = useState("1");

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
            padding: "30px 0",
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
                src="https://randomuser.me/api/portraits/men/1.jpg"
                style={{ marginRight: 12, border: "none" }}
              />
              <div>
                <Text strong style={{ color: "#fff", display: "block" }}>
                  John Doe
                </Text>
                <Text
                  type="secondary"
                  style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}
                >
                  Super Admin
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
                  src="https://randomuser.me/api/portraits/men/1.jpg"
                  style={{ marginRight: 8 }}
                />
                {!collapsed && (
                  <>
                    <Text strong>John Doe</Text>
                    <FaChevronDown
                      style={{ marginLeft: 8, fontSize: 12, color: "#666" }}
                    />
                  </>
                )}
              </div>
            </Dropdown>
          </Space>
        </Header>

        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: "transparent",
          }}
        >
          {activeTab === "1" && (
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
                  Hello Santhosh kathirvel! 👋
                </Title>
                <Select
                  defaultValue="this_week"
                  style={{ width: 180 }}
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
                    <Col xs={24}>
                      <Card
                        title="Recent Candidates"
                        extra={
                          <Button className="view_all_can" type="primary">
                            View All Candidates
                          </Button>
                        }
                        style={{ borderRadius: 12 }}
                        headStyle={{ border: "none" }}
                      >
                        <List
                          itemLayout="horizontal"
                          dataSource={candidates}
                          renderItem={(item) => (
                            <List.Item
                              actions={[
                                <Button
                                  type="text"
                                  style={{
                                    color: "#6a5cff",
                                    background: "#f3f2ff",
                                  }}
                                >
                                  View
                                </Button>,
                              ]}
                            >
                              <List.Item.Meta
                                avatar={
                                  <Avatar
                                    src={`https://randomuser.me/api/portraits/${
                                      Math.random() > 0.5 ? "men" : "women"
                                    }/${Math.floor(Math.random() * 50)}.jpg`}
                                  />
                                }
                                title={<a>{item.name}</a>}
                                description={item.position}
                              />
                              <div>
                                <Tag
                                  color={
                                    item.status === "Interview"
                                      ? "blue"
                                      : item.status === "Technical Test"
                                      ? "orange"
                                      : item.status === "Final Review"
                                      ? "green"
                                      : "purple"
                                  }
                                >
                                  {item.status}
                                </Tag>
                                <Progress
                                  percent={item.progress}
                                  size="small"
                                  style={{ width: 150 }}
                                  strokeColor={
                                    item.progress > 75
                                      ? "#52c41a"
                                      : item.progress > 50
                                      ? colorPrimary
                                      : "#faad14"
                                  }
                                />
                              </div>
                            </List.Item>
                          )}
                        />
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
          )}

          {activeTab === "2" && (
            <>
              <ManageCandidate />
            </>
          )}
        </Content>
      </Layout>
    </Layout>
  );
}
