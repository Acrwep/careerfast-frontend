import React from "react";
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
} from "antd";
import {
  EyeOutlined,
  DownloadOutlined,
  MailOutlined,
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  MoreOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

export default function ManageCandidate() {
  const candidates = [
    {
      key: "1",
      name: "CHITHIRALA Harsha Vardhan",
      email: "chithirala.harsha@gmail.com",
      college: "Koneru Lakshmaiah Education...",
      avatarColor: "#6a5acd",
      status: "Complete",
      score: 85,
    },
    {
      key: "2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      college: "Stanford University",
      avatarColor: "#1890ff",
      status: "Pending",
      score: 72,
    },
    {
      key: "3",
      name: "Robert Johnson",
      email: "robert.j@example.com",
      college: "MIT",
      avatarColor: "#52c41a",
      status: "Complete",
      score: 91,
    },
  ];

  const columns = [
    {
      title: <Text type="secondary">#</Text>,
      dataIndex: "key",
      key: "key",
      width: 50,
    },
    {
      title: <Text type="secondary">CANDIDATE</Text>,
      dataIndex: "name",
      render: (_, record) => (
        <Space>
          <Avatar
            size="large"
            style={{
              backgroundColor: record.avatarColor,
              fontSize: 18,
              fontWeight: 500,
            }}
          >
            {record.name[0]}
          </Avatar>
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
      title: <Text type="secondary">REG. STATUS</Text>,
      dataIndex: "status",
      render: (status) => (
        <Tag
          color={status === "Complete" ? "green" : "orange"}
          style={{
            borderRadius: 12,
            padding: "0 8px",
            fontWeight: 500,
          }}
        >
          {status}
        </Tag>
      ),
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
      title: <Text type="secondary">PROGRESS</Text>,
      render: () => (
        <Space>
          <Tag
            style={{
              background: "#f6ffed",
              borderColor: "#b7eb8f",
              color: "#389e0d",
              borderRadius: 12,
              fontWeight: 500,
            }}
          >
            R1
          </Tag>
          <ArrowRightOutlined style={{ color: "#888" }} />
          <Tag
            style={{
              background: "#e6f7ff",
              borderColor: "#91d5ff",
              color: "#1890ff",
              borderRadius: 12,
              fontWeight: 500,
            }}
          >
            R2
          </Tag>
        </Space>
      ),
    },
    {
      title: "",
      key: "action",
      render: () => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="view" icon={<EyeOutlined />}>
                View Profile
              </Menu.Item>
              <Menu.Item key="download" icon={<DownloadOutlined />}>
                Download CV
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
      {/* Sidebar */}
      <Sider
        width={280}
        style={{
          background: "#fff",
          padding: "24px 15px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ padding: "0 24px 24px" }}>
          <Button
            block
            icon={<PlusOutlined />}
            type="primary"
            className="view_all_can"
            size="large"
            style={{
              marginBottom: 24,
              height: 48,
              fontWeight: 500,
              fontSize: 15,
            }}
          >
            Create New Round
          </Button>
        </div>

        <Menu
          mode="inline"
          defaultSelectedKeys={["all"]}
          style={{ borderRight: 0 }}
          items={[
            {
              key: "all",
              label: <Text strong>All Applications</Text>,
              style: { height: 48, marginTop: 20, border: "1px solid #5f2eea" },
            },
            {
              key: "r1",
              label: <Text strong>Screening Round</Text>,
              style: { height: 48, marginTop: 20, border: "1px solid #5f2eea" },
            },
            {
              key: "r2",
              label: <Text strong>Final Round</Text>,
              style: { height: 48, marginTop: 20, border: "1px solid #5f2eea" },
            },
          ]}
        />
      </Sider>

      {/* Main Content */}
      <Layout>
        <Header
          style={{
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
            React Developer | All Registrations
          </Title>
          <Button size="large" style={{ fontWeight: 500 }}>
            Credit Balance: 12
          </Button>
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
                />
                <Select
                  size="large"
                  placeholder="Filter"
                  suffixIcon={<FilterOutlined style={{ color: "#bfbfbf" }} />}
                  style={{ width: 120 }}
                >
                  <Option value="all">All</Option>
                  <Option value="complete">Complete</Option>
                  <Option value="pending">Pending</Option>
                </Select>
              </Space>

              <Space>
                <Button size="large" icon={<DownloadOutlined />}>
                  Export
                </Button>
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

            <Table
              columns={columns}
              dataSource={candidates}
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
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
}
