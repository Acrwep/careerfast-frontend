import { useEffect, useState } from "react";
import {
  getAllWorkshops,
  getUserProfile,
  registerForWorkshop,
  checkIsRegisteredWorkshop,
} from "../ApiService/action";
import {
  Card,
  Row,
  Col,
  Select,
  Tag,
  Space,
  Button,
  Empty,
  Divider,
  Typography,
  message,
  Spin,
} from "antd";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  CheckCircleFilled,
  TeamOutlined,
  UserOutlined,
  LoadingOutlined,
  GlobalOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { MdWorkOutline } from "react-icons/md";

const { Option } = Select;
const { Title, Text, Paragraph } = Typography;

export default function WorkshopFilter() {
  const [workshops, setWorkshops] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);

  const [categoryFilter, setCategoryFilter] = useState("");
  const [modeFilter, setModeFilter] = useState("");
  const [loadingRegister, setLoadingRegister] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  // ✅ Fetch all workshops
  useEffect(() => {
    fetchWorkshops();
  }, []);

  const fetchWorkshops = async () => {
    try {
      const response = await getAllWorkshops();
      const data = response?.data?.data || [];

      // Add calculated "daysLeft" property
      const withDays = data.map((w) => {
        const now = new Date();
        const end = w.endDate ? new Date(w.endDate) : now;
        const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
        return {
          ...w,
          daysLeft: diff > 0 ? `${diff} days left` : "Expired",
        };
      });

      setWorkshops(withDays);
      setFiltered(withDays);
      if (withDays.length) setSelectedWorkshop(withDays[0]);
    } catch (err) {
      console.error("❌ Error fetching workshops:", err);
      message.error("Failed to load workshops.");
    }
  };

  // ✅ Check if user is already registered
  useEffect(() => {
    const checkRegistration = async () => {
      try {
        const stored = localStorage.getItem("loginDetails");
        if (!stored || !selectedWorkshop) return;
        const user = JSON.parse(stored);

        const res = await checkIsRegisteredWorkshop(user.id, selectedWorkshop.id);
        setIsRegistered(res?.data?.registered || false);
      } catch (err) {
        console.error("Error checking registration:", err);
      }
    };

    checkRegistration();
  }, [selectedWorkshop]);

  // ✅ Filter by category & mode
  useEffect(() => {
    let result = [...workshops];
    if (categoryFilter)
      result = result.filter((w) =>
        w.category?.toLowerCase().includes(categoryFilter.toLowerCase())
      );
    if (modeFilter)
      result = result.filter(
        (w) => w.mode?.toLowerCase() === modeFilter.toLowerCase()
      );

    setFiltered(result);
  }, [categoryFilter, modeFilter, workshops]);

  // ✅ Register for workshop
  const handleRegister = async () => {
    try {
      const stored = localStorage.getItem("loginDetails");
      if (!stored) return message.warning("Please log in to register.");

      const user = JSON.parse(stored);
      if (!selectedWorkshop) return message.warning("Select a workshop first!");

      setLoadingRegister(true);

      const profile = await getUserProfile({ user_id: user.id });
      const userDetails = profile?.data?.data || {};

      const payload = {
        userId: user.id,
        workshopId: selectedWorkshop.id,
        userDetails,
      };

      const res = await registerForWorkshop(payload);
      if (res.data.success) {
        message.success("Successfully registered for this workshop 🎉");
        setIsRegistered(true);
      } else {
        message.warning(res.data.message || "Already registered.");
      }
    } catch (err) {
      console.error("❌ Registration failed:", err);
      message.error("Failed to register for this workshop.");
    } finally {
      setLoadingRegister(false);
    }
  };

  return (
    <>
      <Header />
      <div
        style={{
          padding: "0px 24px 40px 24px",
          background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
          minHeight: "100vh",
        }}
      >
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          {/* Filters */}
          <Card
            style={{
              position: "sticky",
              top: 60,
              zIndex: 20,
              borderRadius: 18,
              border: "1px solid rgba(229, 231, 235, 0.5)",
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(249,250,251,0.9) 100%)",
              boxShadow:
                "0 6px 18px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
              marginBottom: 20,
              backdropFilter: "blur(8px)",
            }}
          >
            <Row gutter={[20, 20]} align="middle">
              <Col xs={24} sm={12} md={8}>
                <Select
                  placeholder="Select Category"
                  style={{ width: "100%", borderRadius: 12 }}
                  allowClear
                  onChange={(value) => setCategoryFilter(value)}
                  size="large"
                >
                  {[...new Set(workshops.map((w) => w.category))].map((cat, i) => (
                    <Option key={i} value={cat}>
                      {cat}
                    </Option>
                  ))}
                </Select>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Select
                  placeholder="Select Mode"
                  style={{ width: "100%", borderRadius: 12 }}
                  allowClear
                  onChange={(value) => setModeFilter(value)}
                  size="large"
                >
                  <Option value="Online">Online</Option>
                  <Option value="Offline">Offline</Option>
                  <Option value="Hybrid">Hybrid</Option>
                </Select>
              </Col>

              <Col xs={24} sm={24} md={8}>
                <Button
                  size="large"
                  onClick={() => {
                    setCategoryFilter("");
                    setModeFilter("");
                  }}
                  style={{
                    width: "100%",
                    borderRadius: 10,
                    color: "#5f2eea",
                    fontWeight: 600,
                    background: "rgba(95,46,234,0.08)",
                  }}
                >
                  Clear Filters ✨
                </Button>
              </Col>
            </Row>
          </Card>

          <Row gutter={[32, 32]}>
            {/* Workshops List */}
            <Col
              xs={24}
              lg={8}
              style={{
                position: "sticky",
                top: 170,
                alignSelf: "flex-start",
                zIndex: 5,
              }}
            >
              <Card
                style={{
                  borderRadius: 16,
                  border: "1px solid rgba(229, 231, 235, 0.6)",
                  background: "linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)",
                  boxShadow:
                    "0 4px 12px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.08)",
                  overflow: "hidden",
                }}
                bodyStyle={{ padding: 0 }}
              >
                <div
                  style={{
                    padding: "24px 28px",
                    borderBottom: "1px solid #f1f5f9",
                    background:
                      "linear-gradient(90deg, rgba(95,46,234,0.1) 0%, rgba(255,255,255,0) 100%)",
                  }}
                >
                  <Title
                    level={4}
                    style={{
                      margin: 0,
                      color: "#1f2937",
                      fontWeight: 700,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>Available Workshops</span>
                    <Text
                      style={{
                        background: "#5f2eea",
                        color: "#fff",
                        padding: "2px 10px",
                        borderRadius: 8,
                        fontSize: 14,
                      }}
                    >
                      {filtered.length}
                    </Text>
                  </Title>
                </div>

                <div style={{ maxHeight: "100vh", overflowY: "auto", padding: 16 }}>
                  {filtered.length > 0 ? (
                    filtered.map((w, i) => (
                      <div
                        key={i}
                        onClick={() => setSelectedWorkshop(w)}
                        style={{
                          padding: 16,
                          marginBottom: 12,
                          borderRadius: 10,
                          background:
                            selectedWorkshop?.id === w.id
                              ? "rgba(95,46,234,0.08)"
                              : "#fff",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          border:
                            selectedWorkshop?.id === w.id
                              ? "1px solid #5f2eea"
                              : "1px solid #eee",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <img
                            src={w.logo}
                            alt={w.title}
                            style={{
                              width: 64,
                              height: 64,
                              borderRadius: 8,
                              objectFit: "cover",
                            }}
                          />
                          <div>
                            <Title level={5} style={{ margin: 0, fontWeight: 600 }}>
                              {w.title}
                            </Title>
                            <Text type="secondary">{w.category}</Text>
                            <div>
                              <Tag color="purple" style={{ borderRadius: 6, marginTop: 8 }}>
                                {w.mode}
                              </Tag>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <Empty description="No workshops found" />
                  )}
                </div>
              </Card>
            </Col>

            {/* Workshop Details */}
            <Col xs={24} lg={16}>
              <Card
                style={{
                  borderRadius: 18,
                  border: "1px solid rgba(229, 231, 235, 0.6)",
                  background: "linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)",
                  boxShadow: "0 6px 18px rgba(0, 0, 0, 0.06)",
                }}
                bodyStyle={{ padding: 40 }}
              >
                {selectedWorkshop ? (
                  <>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 28,
                        marginBottom: 20,
                        borderBottom: "1px solid #f1f5f9",
                        paddingBottom: 28,
                      }}
                    >
                      <img
                        src={selectedWorkshop.logo}
                        alt={selectedWorkshop.title}
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: 16,
                          objectFit: "cover",
                          boxShadow: "0 6px 14px rgba(0,0,0,0.2)",
                        }}
                      />
                      <div>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: 8,
                          }}
                        >
                          <Title level={2} style={{ margin: 0, color: "#111827" }}>
                            {selectedWorkshop.title}
                          </Title>
                          <Tag
                            color="success"
                            icon={<CheckCircleFilled />}
                            style={{
                              marginLeft: 12,
                              borderRadius: 8,
                              fontWeight: 500,
                              background: "rgba(16,185,129,0.1)",
                              color: "#065f46",
                            }}
                          >
                            Verified
                          </Tag>
                        </div>
                        <Paragraph
                          style={{
                            color: "#5f2eea",
                            fontWeight: 600,
                            fontSize: 16,
                            marginBottom: 10,
                          }}
                        >
                          {selectedWorkshop.category}
                        </Paragraph>

                        <Space size={[24, 12]} wrap>
                          <Text style={{ fontSize: 15, color: "#4b5563" }}>
                            <GlobalOutlined
                              style={{
                                marginRight: 8,
                                color: "#7c3aed",
                                fontSize: 16,
                                verticalAlign: "middle",
                              }}
                            />
                            {selectedWorkshop.mode}
                          </Text>
                          <Text style={{ fontSize: 15, color: "#4b5563" }}>
                            <EnvironmentOutlined
                              style={{
                                marginRight: 8,
                                color: "#7c3aed",
                                fontSize: 16,
                                verticalAlign: "middle",
                              }}
                            />
                            {selectedWorkshop.venue || "Venue not specified"}
                          </Text>
                        </Space>
                      </div>
                    </div>

                    <Button
                      type="primary"
                      block
                      size="large"
                      disabled={isRegistered || loadingRegister}
                      onClick={handleRegister}
                      style={{
                        background: isRegistered
                          ? "linear-gradient(135deg,rgba(220,252,231,0.7) 0%,rgba(187,247,208,0.5) 100%)"
                          : "linear-gradient(135deg,#5f2eea,#7c3aed)",
                        color: isRegistered ? "#15803d" : "#fff",
                        fontWeight: 600,
                        height: 52,
                        fontSize: 17,
                        borderRadius: 10,
                        border: "none",
                      }}
                    >
                      {loadingRegister ? (
                        <Spin
                          indicator={
                            <LoadingOutlined style={{ fontSize: 20, color: "#fff" }} spin />
                          }
                        />
                      ) : isRegistered ? (
                        "Already Registered ✅"
                      ) : (
                        "Register Now 🚀"
                      )}
                    </Button>

                    <Divider style={{ margin: "40px 0" }} />

                    <Title
                      level={4}
                      style={{
                        color: "#1f2937",
                        marginBottom: 16,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          width: 4,
                          height: 24,
                          background: "linear-gradient(180deg,#5f2eea,#9d4edd)",
                          borderRadius: 4,
                        }}
                      ></span>
                      About This Workshop
                    </Title>
                    <div
                      style={{
                        color: "#4b5563",
                        fontSize: 15.5,
                        background: "#fafafa",
                        padding: 20,
                        borderRadius: 12,
                        border: "1px solid #f3f4f6",
                        whiteSpace: "pre-wrap",
                      }}
                      dangerouslySetInnerHTML={{
                        __html:
                          selectedWorkshop.about ||
                          "<p>No description available.</p>",
                      }}
                    />

                    <Divider style={{ margin: "40px 0" }} />

                    <Title level={4}>Eligibility</Title>
                    <Space wrap>
                      {Array.isArray(selectedWorkshop.eligibility)
                        ? selectedWorkshop.eligibility.map((e, i) => (
                          <Tag key={i} color="purple">
                            {e}
                          </Tag>
                        ))
                        : selectedWorkshop.eligibility && (
                          <Tag color="purple">{selectedWorkshop.eligibility}</Tag>
                        )}
                    </Space>

                    <Divider style={{ margin: "40px 0" }} />

                    <Title level={4}>Organizer & Contact</Title>
                    <Paragraph>
                      <UserOutlined style={{ marginRight: 6, color: "#5f2eea" }} />
                      {selectedWorkshop.organizer || "N/A"}
                    </Paragraph>
                    <Paragraph>
                      <MailOutlined style={{ marginRight: 6, color: "#5f2eea" }} />
                      {selectedWorkshop.contactEmail || "N/A"}
                    </Paragraph>
                    <Paragraph>
                      <PhoneOutlined style={{ marginRight: 6, color: "#5f2eea" }} />
                      {selectedWorkshop.contactNumber || "N/A"}
                    </Paragraph>
                  </>
                ) : (
                  <div
                    style={{
                      padding: 100,
                      textAlign: "center",
                      background:
                        "linear-gradient(180deg, #fafafa 0%, #f3f4f6 100%)",
                    }}
                  >
                    <Empty
                      description={
                        <span style={{ color: "#6b7280", fontWeight: 500 }}>
                          Select a workshop from the list to view details
                        </span>
                      }
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  </div>
                )}
              </Card>
            </Col>
          </Row>
        </div>
      </div>
      <Footer />
    </>
  );
}
