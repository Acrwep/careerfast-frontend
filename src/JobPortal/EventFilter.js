import { useEffect, useState } from "react";
import { checkIsRegistered, getAllEvents, getUserProfile, registerForEvent } from "../ApiService/action";
import {
  Card,
  Row,
  Col,
  Select,
  InputNumber,
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
  DollarOutlined,
  CheckCircleFilled,
  TeamOutlined,
  UserOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { MdWorkOutline } from "react-icons/md";

const { Option } = Select;
const { Title, Text, Paragraph } = Typography;

export default function EventFilter() {
  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [categoryFilter, setCategoryFilter] = useState("");
  const [modeFilter, setModeFilter] = useState("");
  const [minPrize, setMinPrize] = useState(null);
  const [maxPrize, setMaxPrize] = useState(null);
  const [loadingRegister, setLoadingRegister] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    getAllEventsData();
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("loginDetails");
    if (stored) {
      try {
        const loginDetails = JSON.parse(stored);
        getUserProfileData(loginDetails.id);
      } catch (error) {
        console.error("Invalid JSON in localStorage", error);
      }
    }
  }, []);

  useEffect(() => {
    const checkRegistrationStatus = async () => {
      try {
        const stored = localStorage.getItem("loginDetails");
        if (!stored || !selectedEvent) return;

        const user = JSON.parse(stored);

        // ✅ Check backend
        const res = await checkIsRegistered(user.id, selectedEvent.id);

        // ✅ Backend returns: { success: true, registered: true/false }
        if (res.data?.registered) {
          setIsRegistered(true);
          // Store locally so it persists after reload
          const key = `event_registered_${selectedEvent.id}_${user.id}`;
          localStorage.setItem(key, "true");
        } else {
          setIsRegistered(false);
        }
      } catch (error) {
        console.error("Error checking registration:", error);
        setIsRegistered(false);
      }
    };

    checkRegistrationStatus();
  }, [selectedEvent]);


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

  const getAllEventsData = async () => {
    try {
      const response = await getAllEvents();
      let events = response?.data?.data || [];

      // Calculate days left based on posted date (assuming expires in 15 days)
      events = events.map((event) => {
        const postedDate = new Date(event.postedTime || event.createdAt || event.date || Date.now());
        const now = new Date();
        const diffInDays = Math.floor((now - postedDate) / (1000 * 60 * 60 * 24));
        const remainingDays = 15 - diffInDays;

        return {
          ...event,
          daysLeft: remainingDays > 0 ? `${remainingDays} days left` : "Expired",
        };
      });

      setAllEvents(events);
      setFilteredEvents(events);
      if (events.length) setSelectedEvent(events[0]);
    } catch (error) {
      console.log("get all events error", error);
    }
  };

  useEffect(() => {
    let result = [...allEvents];

    if (categoryFilter)
      result = result.filter((e) =>
        e.category?.toLowerCase().includes(categoryFilter.toLowerCase())
      );

    if (modeFilter)
      result = result.filter(
        (e) => e.mode?.toLowerCase() === modeFilter.toLowerCase()
      );

    if (minPrize !== null)
      result = result.filter((e) => parseInt(e.winnerPrize || 0) >= minPrize);

    if (maxPrize !== null)
      result = result.filter((e) => parseInt(e.winnerPrize || 0) <= maxPrize);

    setFilteredEvents(result);
  }, [categoryFilter, modeFilter, minPrize, maxPrize, allEvents]);

  // ✅ Handle registration
  const handleRegister = async () => {
    try {
      const stored = localStorage.getItem("loginDetails");
      if (!stored) return message.warning("Please log in to register.");

      const user = JSON.parse(stored);
      if (!selectedEvent) return message.warning("Select an event first!");

      setLoadingRegister(true);

      // ✅ Fetch user profile details
      const profileResponse = await getUserProfile({ user_id: user.id });
      const userDetails = profileResponse?.data?.data || {};

      // ✅ Register payload
      const payload = {
        userId: user.id,
        eventId: selectedEvent.id,
        userDetails,
      };

      const res = await registerForEvent(payload);

      if (res.data.success) {
        message.success("Successfully registered for this event 🎉");

        setIsRegistered(true);

        // ✅ Save registration locally
        const key = `event_registered_${selectedEvent.id}_${user.id}`;
        localStorage.setItem(key, "true");
      } else {
        message.warning(res.data.message || "You may already be registered.");
      }
    } catch (error) {
      console.error("Error registering:", error);
      message.error(error.response?.data?.message || "Failed to register for event");
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

        {/* Main Content Container */}
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
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
              overflow: "hidden",
              backdropFilter: "blur(8px)",
              transition: "all 0.3s ease",
            }}
          >

            {/* Filter Controls */}
            <Row gutter={[20, 20]} align="middle">
              {/* Category Filter */}
              <Col xs={24} sm={12} md={6}>
                <div
                  style={{
                    background: "#ffffff",
                    borderRadius: 12,
                    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
                    transition: "all 0.3s ease",
                  }}
                >
                  <Select
                    placeholder="Select Category"
                    style={{
                      width: "100%",
                      border: "none",
                      borderRadius: 12,
                      padding: "6px 12px",
                      border: "1px solid #d1d1d1"
                    }}
                    allowClear
                    onChange={(value) => setCategoryFilter(value)}
                    size="large"
                    dropdownStyle={{
                      borderRadius: 10,
                    }}
                  >
                    {[...new Set(allEvents.map((e) => e.category))].map((cat, i) => (
                      <Option key={i} value={cat}>
                        {cat}
                      </Option>
                    ))}
                  </Select>
                </div>
              </Col>

              {/* Mode Filter */}
              <Col xs={24} sm={12} md={4}>
                <div
                  style={{
                    background: "#ffffff",
                    borderRadius: 12,
                    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
                    transition: "all 0.3s ease",
                  }}
                >
                  <Select
                    placeholder="Event Mode"
                    style={{
                      width: "100%",
                      border: "none",
                      borderRadius: 12,
                      padding: "6px 12px",
                      border: "1px solid #d1d1d1"
                    }}
                    allowClear
                    onChange={(value) => setModeFilter(value)}
                    size="large"
                    dropdownStyle={{
                      borderRadius: 10,
                    }}
                  >
                    <Option value="Online">Online</Option>
                    <Option value="Offline">Offline</Option>
                  </Select>
                </div>
              </Col>

              {/* Min Prize */}
              <Col xs={24} sm={12} md={4}>
                <div
                  style={{
                    background: "#ffffff",
                    borderRadius: 12,
                    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
                    transition: "all 0.3s ease",
                  }}
                >
                  <InputNumber
                    placeholder="Min Prize"
                    style={{
                      width: "100%",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: 12,
                    }}
                    onChange={(val) => setMinPrize(val)}
                    size="large"
                    prefix={<DollarOutlined style={{ color: "#9ca3af" }} />}
                  />
                </div>
              </Col>

              {/* Max Prize */}
              <Col xs={24} sm={12} md={4}>
                <div
                  style={{
                    background: "#ffffff",
                    borderRadius: 12,
                    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
                    transition: "all 0.3s ease",
                  }}
                >
                  <InputNumber
                    placeholder="Max Prize"
                    style={{
                      width: "100%",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: 12,
                    }}
                    onChange={(val) => setMaxPrize(val)}
                    size="large"
                    prefix={<DollarOutlined style={{ color: "#9ca3af" }} />}
                  />
                </div>
              </Col>

              {/* Clear Button */}
              <Col xs={24} sm={24} md={6}>
                <Space wrap style={{ width: "100%", justifyContent: "flex-end" }}>
                  <Button
                    size="large"
                    style={{
                      borderRadius: 10,
                      border: "none",
                      fontWeight: 600,
                      color: "#5f2eea",
                      background: "rgba(95,46,234,0.08)",
                      padding: "6px 20px",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(95,46,234,0.12)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(95,46,234,0.08)";
                    }}
                    onClick={() => {
                      setCategoryFilter("");
                      setModeFilter("");
                      setMinPrize(null);
                      setMaxPrize(null);
                    }}
                  >
                    Clear Filters ✨
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>


          {/* Results Section */}
          <Row style={{ marginTop: 0 }} gutter={[32, 32]}>
            {/* Events List Column */}
            <Col style={{
              position: "sticky",
              top: 170,
              alignSelf: "flex-start",
              height: "fit-content",
              zIndex: 5,
            }} xs={24} lg={8}>
              <Card
                style={{
                  borderRadius: 16,
                  border: "1px solid rgba(229, 231, 235, 0.6)",
                  background: "linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)",
                  height: "100%",
                  boxShadow:
                    "0 4px 12px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.08)",
                  overflow: "hidden",
                  backdropFilter: "blur(4px)",
                }}
                bodyStyle={{ padding: 0 }}
              >
                {/* Header */}
                <div
                  style={{
                    padding: "24px 28px",
                    marginBottom: 20,
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
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>Available Events</span>
                    <Text
                      style={{
                        color: "#ffffffff",
                        fontWeight: 500,
                        fontSize: 14,
                        background: "#149603ff",
                        padding: "2px 10px",
                        borderRadius: 8,
                      }}
                    >
                      {filteredEvents.length}
                    </Text>
                  </Title>
                </div>

                {/* List */}
                <div
                  style={{
                    maxHeight: "100vh",
                    overflowY: "auto",
                    padding: "12px 20px",
                  }}
                >
                  <style>
                    {`
          ::-webkit-scrollbar {
            width: 3px;
          }
          ::-webkit-scrollbar-thumb {
            background: rgba(95, 46, 234, 0.4);
            border-radius: 3px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: rgba(95, 46, 234, 0.7);
          }
        `}
                  </style>

                  {filteredEvents.length > 0 ? (
                    filteredEvents.map((event, i) => (
                      <div
                        key={i}
                        onClick={() => setSelectedEvent(event)}
                        style={{
                          padding: "20px 18px",
                          marginBottom: 18,
                          borderRadius: 12,
                          border: "1px solid transparent",
                          background:
                            selectedEvent?._id === event._id
                              ? "linear-gradient(90deg, rgba(95,46,234,0.1), rgba(255,255,255,0.5))"
                              : "rgba(255,255,255,0.9)",
                          transition: "all 0.3s ease",
                          boxShadow:
                            selectedEvent?._id === event._id
                              ? "0 4px 10px rgba(95,46,234,0.2)"
                              : "0 2px 6px rgba(0,0,0,0.05)",
                          cursor: "pointer",
                          position: "relative",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-4px)";
                          e.currentTarget.style.boxShadow =
                            "0 6px 14px rgba(0,0,0,0.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0px)";
                          e.currentTarget.style.boxShadow =
                            selectedEvent?._id === event._id
                              ? "0 4px 10px rgba(95,46,234,0.2)"
                              : "0 2px 6px rgba(0,0,0,0.05)";
                        }}
                      >
                        {/* Gradient side bar indicator */}
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            height: "100%",
                            width: selectedEvent?._id === event._id ? "4px" : "0px",
                            background: "linear-gradient(180deg,#5f2eea,#9d4edd)",
                            borderRadius: "4px 0 0 4px",
                            transition: "width 0.3s ease",
                          }}
                        />

                        <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                          <img
                            src={event.logo}
                            alt={event.title}
                            style={{
                              width: 64,
                              height: 64,
                              borderRadius: 10,
                              objectFit: "cover",
                              border: "1px solid #e5e7eb",
                              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                            }}
                          />

                          <div style={{ flex: 1 }}>
                            <Title
                              level={5}
                              style={{
                                margin: "0 0 8px 0",
                                color: "#111827",
                                fontWeight: 600,
                              }}
                            >
                              {event.title}
                            </Title>

                            <Tag
                              color="geekblue"
                              style={{
                                borderRadius: 6,
                                marginBottom: 12,
                                fontWeight: 500,
                                padding: "2px 10px",
                              }}
                            >
                              {event.category || "General"}
                            </Tag>

                            <Space size={[12, 6]} wrap>
                              <Text type="secondary" style={{ fontSize: 13 }}>
                                <CalendarOutlined style={{ marginRight: 4 }} />
                                {event.daysLeft || "15 days"}
                              </Text>
                              <Text type="secondary" style={{ fontSize: 13 }}>
                                <CalendarOutlined style={{ marginRight: 4 }} />
                                {event.type || "N/A"}
                              </Text>
                              <Text type="secondary" style={{ fontSize: 13 }}>
                                <EnvironmentOutlined style={{ marginRight: 4 }} />
                                {event.mode || "Online"}
                              </Text>
                              <Text
                                style={{
                                  fontSize: 13,
                                  borderRadius: 6,
                                  backgroundColor: "#FFF6D1",
                                  color: "#513C06",
                                  padding: "3px 8px",
                                  fontWeight: 600,
                                }}
                              >
                                🏆 ₹{event.winnerPrize}
                              </Text>
                            </Space>

                            <div style={{ marginTop: 12 }}>
                              {event.skills?.slice(0, 2).map((s, i) => (
                                <Tag
                                  key={i}
                                  style={{
                                    background: "#f3f4f6",
                                    color: "#4b5563",
                                    borderRadius: 4,
                                    fontSize: 11,
                                    marginBottom: 4,
                                    border: "none",
                                  }}
                                >
                                  {s}
                                </Tag>
                              ))}
                              {event.skills?.length > 2 && (
                                <Tag
                                  style={{
                                    background: "#f3f4f6",
                                    color: "#4b5563",
                                    borderRadius: 4,
                                    fontSize: 11,
                                  }}
                                >
                                  +{event.skills.length - 2}
                                </Tag>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: 60, textAlign: "center" }}>
                      <Empty
                        description={
                          <span style={{ color: "#6b7280", fontWeight: 500 }}>
                            No events match your filters
                          </span>
                        }
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                      />
                    </div>
                  )}
                </div>
              </Card>
            </Col>


            {/* Event Details Column */}
            <Col xs={24} lg={16}>
              <Card
                style={{
                  borderRadius: 18,
                  border: "1px solid rgba(229, 231, 235, 0.6)",
                  background: "linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)",
                  boxShadow:
                    "0 6px 18px rgba(0, 0, 0, 0.06), 0 2px 6px rgba(0, 0, 0, 0.04)",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                }}
                bodyStyle={{ padding: 0 }}
              >
                {selectedEvent ? (
                  <div style={{ padding: 40 }}>
                    {/* Header Section */}
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
                      <div
                        style={{
                          position: "relative",
                          width: 80,
                          height: 80,
                          borderRadius: 16,
                          padding: 5,
                          overflow: "hidden",
                          boxShadow: "rgb(0 0 0 / 25%) 0px 6px 14px",
                        }}
                      >
                        <img
                          src={selectedEvent.logo}
                          alt={selectedEvent.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: 16,
                          }}
                        />
                      </div>

                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: 8,
                          }}
                        >
                          <Title
                            level={2}
                            style={{
                              margin: 0,
                              color: "#111827",
                              fontWeight: 700,
                              letterSpacing: "-0.02em",
                            }}
                          >
                            {selectedEvent.title}
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
                            marginBottom: 20,
                          }}
                        >
                          {selectedEvent.category || "Event Category"}
                        </Paragraph>

                        <Space size={[24, 12]} wrap>
                          <Text style={{ fontSize: 15, color: "#4b5563" }}>
                            <TeamOutlined
                              style={{
                                marginRight: 8,
                                color: "#7c3aed",
                                fontSize: 16,
                                verticalAlign: "middle",
                              }}
                            />
                            {selectedEvent.participationType}{" "}
                            {selectedEvent.memberLimit ? `(${selectedEvent.memberLimit})` : ""}
                          </Text>
                          <Text style={{ fontSize: 15, color: "#4b5563" }}>
                            <MdWorkOutline
                              style={{
                                marginRight: 8,
                                color: "#7c3aed",
                                fontSize: 16,
                                verticalAlign: "middle",
                              }}
                            />
                            {selectedEvent.mode || "Online"}
                          </Text>
                        </Space>
                      </div>
                    </div>

                    {/* Premium Register Button */}
                    <Button
                      type="primary"
                      size="large"
                      block
                      disabled={
                        selectedEvent.daysLeft === "Expired" || isRegistered || loadingRegister
                      }
                      onClick={handleRegister}
                      style={{
                        background:
                          selectedEvent.daysLeft === "Expired"
                            ? "linear-gradient(135deg, #9ca3af 0%, #d1d5db 100%)"
                            : isRegistered
                              ? "linear-gradient(135deg,rgba(220, 252, 231, 0.7) 0%,rgba(187, 247, 208, 0.5) 100%)"
                              : "linear-gradient(135deg, #5f2eea 0%, #7c3aed 50%, #9d4edd 100%)",
                        border: "none",
                        borderRadius: 10,
                        fontWeight: 600,
                        height: 52,
                        fontSize: 17,
                        color: isRegistered ? "#15803d" : "#fff",
                        letterSpacing: 0.2,
                        boxShadow:
                          selectedEvent.daysLeft === "Expired"
                            ? "none"
                            : "0 0px 0px -0px rgba(95,46,234,0.3)",
                        opacity:
                          selectedEvent.daysLeft === "Expired" || loadingRegister ? 0.6 : 1,
                        cursor:
                          selectedEvent.daysLeft === "Expired" || isRegistered
                            ? "not-allowed"
                            : "pointer",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {loadingRegister ? (
                        <Spin
                          indicator={<LoadingOutlined style={{ fontSize: 20, color: "#fff" }} spin />}
                        />
                      ) : selectedEvent.daysLeft === "Expired" ? (
                        "Registration Closed 🔒"
                      ) : isRegistered ? (
                        "Already Registered ✅"
                      ) : (
                        "Register Now 🚀"
                      )}
                    </Button>

                    <Divider style={{ margin: "40px 0", background: "#ebebebff" }} />

                    {/* Eligibility Section */}
                    <div style={{ marginBottom: 40 }}>
                      <Title
                        level={4}
                        style={{
                          color: "#1f2937",
                          marginBottom: 16,
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        <UserOutlined style={{ color: "#5f2eea", fontSize: 20 }} />
                        Eligibility Criteria
                      </Title>

                      <div>
                        {Array.isArray(selectedEvent.eligibility) ? (
                          <Space wrap>
                            {selectedEvent.eligibility.map((item, i) => (
                              <Tag
                                key={i}
                                style={{
                                  background: "linear-gradient(135deg,#ede9fe 0%,#e0e7ff 100%)",
                                  color: "#5f2eea",
                                  fontWeight: 500,
                                  borderRadius: 20,
                                  padding: "6px 14px",
                                  fontSize: 14,
                                  border: "none",
                                  boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                                }}
                              >
                                {item}
                              </Tag>
                            ))}
                          </Space>
                        ) : (
                          <Tag
                            style={{
                              background: "#f3f4f6",
                              color: "#374151",
                              fontWeight: 500,
                              borderRadius: 8,
                              padding: "6px 14px",
                              fontSize: 14,
                              border: "1px solid #e5e7eb",
                            }}
                          >
                            {selectedEvent.eligibility || "Open to all participants"}
                          </Tag>
                        )}
                      </div>
                    </div>

                    <Divider style={{ background: "#ebebebff" }} />

                    {/* About Section */}
                    <div>
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
                        About This Opportunity
                      </Title>

                      <div
                        style={{
                          color: "#4b5563",
                          fontSize: 15.5,
                          background: "#fafafa",
                          padding: 20,
                          borderRadius: 12,
                          border: "1px solid #f3f4f6",
                          boxShadow: "inset 0 1px 2px rgba(0,0,0,0.02)",
                          whiteSpace: "pre-wrap",
                          transition: "all 0.3s ease",
                        }}
                        dangerouslySetInnerHTML={{
                          __html: selectedEvent.about,
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      padding: 100,
                      textAlign: "center",
                      background: "linear-gradient(180deg, #fafafa 0%, #f3f4f6 100%)",
                    }}
                  >
                    <Empty
                      description={
                        <span style={{ color: "#6b7280", fontWeight: 500 }}>
                          Select an event from the list to view details
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