import React, { useEffect, useState, useMemo } from "react";
import {
  Tabs,
  Input,
  Button,
  Card,
  Tag,
  Typography,
  Dropdown,
  Menu,
  Badge,
  Spin,
} from "antd";
import {
  SearchOutlined,
  CalendarOutlined,
  ShareAltOutlined,
  WifiOutlined,
  EllipsisOutlined,
  StarFilled,
  StarOutlined,
  HeartOutlined,
  HeartFilled,
} from "@ant-design/icons";
import { debounce } from "lodash";
import { CommonToaster } from "../Common/CommonToaster";
import CommonSelectField from "../Common/CommonSelectField";
import { getSavedJobs, removeSavedJobs } from "../ApiService/action";

const { Title, Text } = Typography;

const tabLabels = ["All Opportunities", "Internships", "Full-time Roles"];

const statusOptions = [
  { value: "live", label: "Live" },
  { value: "closed", label: "Closed" },
  { value: "upcoming", label: "Upcoming" },
];

const sortOptions = [
  { value: "recent", label: "Most Recent" },
  { value: "deadline", label: "Application Deadline" },
  { value: "popular", label: "Most Popular" },
];

const getStatusTag = (status) => {
  switch (status) {
    case "live":
      return (
        <Tag color="green" icon={<WifiOutlined />}>
          Live
        </Tag>
      );
    case "closed":
      return <Tag color="red">Closed</Tag>;
    case "upcoming":
      return <Tag color="orange">Upcoming</Tag>;
    default:
      return <Tag>{status}</Tag>;
  }
};

const OpportunityCard = ({ opportunity, onSave }) => {
  const [saved, setSaved] = useState(() => opportunity.saved);
  const [loginUserId, setLoginUserId] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("loginDetails");
      console.log("login details", stored);
      if (stored) {
        const loginDetails = JSON.parse(stored);
        setLoginUserId(loginDetails.id);
      }
    } catch (error) {
      console.error("Invalid JSON in localStorage", error);
    }
  }, []);

  const handleSave = () => {
    if (!loginUserId) {
      CommonToaster("Please log in to save jobs.", "error");
      return;
    }

    const newSavedState = !saved;
    onSave(opportunity.id, newSavedState);
    setSaved(newSavedState);

    CommonToaster(
      newSavedState ? "Removed to favourites ❤️" : "Removed from favourites ❤️",
      newSavedState ? "error" : "success"
    );

    if (newSavedState) {
      removeSavedJobsData(opportunity);
      getSavedJobs();
    }
  };

  const removeSavedJobsData = async (opportunity) => {
    const payload = { id: opportunity.id };
    try {
      const response = await removeSavedJobs(payload);
      console.log("Remove saved jobs", response);
    } catch (error) {
      console.error("Remove saved jobs error", error);
    }
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" icon={<ShareAltOutlined />}>
        Share
      </Menu.Item>
      <Menu.Item key="2" icon={<CalendarOutlined />}>
        Add to Calendar
      </Menu.Item>
      <Menu.Item key="3">View Similar Roles</Menu.Item>
    </Menu>
  );

  return (
    <Card
      style={{
        marginBottom: 16,
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
        border: "none",
      }}
    >
      <div style={{ display: "flex", gap: 16 }}>
        <div style={{ flexShrink: 0 }}>
          <img
            src={opportunity.company_logo}
            alt={`${opportunity.company_name || opportunity.company} logo`}
            style={{
              borderRadius: 8,
              width: 80,
              height: 80,
              objectFit: "cover",
              border: "1px solid #f0f0f0",
            }}
          />
        </div>

        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 0,
            }}
          >
            <Title level={5} style={{ margin: 0 }}>
              {opportunity.job_title}
            </Title>

            <Button
              type="text"
              style={saved ? {} : { background: "rgba(255, 0, 0, 0.1)" }}
              icon={
                saved ? (
                  <HeartOutlined style={{ color: "red" }} />
                ) : (
                  <HeartFilled style={{ color: "red" }} />
                )
              }
              onClick={handleSave}
              aria-label="Toggle favourite"
            />
          </div>

          <Text strong style={{ display: "block", marginBottom: 4 }}>
            {opportunity.company_name}
          </Text>

          <div
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 8,
              flexWrap: "wrap",
            }}
          >
            <Tag>{opportunity.type}</Tag>
            <Tag>{opportunity.location}</Tag>
            <Tag color="blue">{opportunity.salary}</Tag>
            {getStatusTag(opportunity.status)}
          </div>

          <Text
            type="secondary"
            style={{ display: "flex", alignItems: "center", gap: 4 }}
          >
            <CalendarOutlined /> Apply by {opportunity.deadline}
          </Text>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Dropdown overlay={menu} placement="bottomRight">
            <Button
              type="text"
              icon={<EllipsisOutlined />}
              aria-label="More actions"
            />
          </Dropdown>
        </div>
      </div>
    </Card>
  );
};

export default function WatchList() {
  const [activeTab, setActiveTab] = useState("0");
  const [opportunities, setOpportunities] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginUserId, setLoginUserId] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("loginDetails");
      if (stored) {
        const loginDetails = JSON.parse(stored);
        setLoginUserId(loginDetails.id);
      }
    } catch (error) {
      console.error("Invalid JSON in localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (loginUserId) {
      getSavedJobsData();
    }
  }, [loginUserId]);

  const getSavedJobsData = async () => {
    setLoading(true);
    try {
      const response = await getSavedJobs({ user_id: loginUserId });
      setOpportunities(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching jobs", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (id, saved) => {
    setOpportunities((prev) =>
      prev.map((opp) => (opp.id === id ? { ...opp, saved } : opp))
    );
  };

  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        setSearchQuery(value);
      }, 300),
    []
  );

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      if (activeTab === "1" && opp.type !== "Internship") return false;
      if (activeTab === "2" && opp.type !== "Full-time") return false;

      const target = `${opp.title} ${
        opp.company || opp.company_name
      }`.toLowerCase();
      return searchQuery ? target.includes(searchQuery.toLowerCase()) : true;
    });
  }, [opportunities, searchQuery, activeTab]);

  const tabItems = tabLabels.map((label, index) => ({
    key: index.toString(),
    label: (
      <span style={{ padding: "0 16px" }}>
        {label}
        {index === 0 && (
          <Badge
            count={opportunities.length}
            style={{ backgroundColor: "#5f2eea", marginLeft: 6 }}
          />
        )}
      </span>
    ),
    children: (
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 24,
            marginTop: 15,
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <Input
            placeholder="Search by role or company..."
            prefix={<SearchOutlined />}
            style={{
              flex: "1 1 300px",
              borderRadius: 8,
              padding: "10px 16px",
              maxWidth: 400,
            }}
            onChange={(e) => debouncedSearch(e.target.value)}
            allowClear
            aria-label="Search opportunities"
          />

          <CommonSelectField
            defaultValue={["live"]}
            name="watchlist"
            className="custom-select"
            options={statusOptions}
            showSearch
          />

          <CommonSelectField
            defaultValue={["recent"]}
            name="watchlist"
            className="custom-select"
            options={sortOptions}
            showSearch
          />
        </div>

        <div style={{ marginTop: 16 }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: 40 }}>
              <Spin size="large" />
            </div>
          ) : filteredOpportunities.length > 0 ? (
            filteredOpportunities.map((opp) => (
              <OpportunityCard
                key={opp.id}
                opportunity={opp}
                onSave={handleSave}
              />
            ))
          ) : (
            <Card style={{ textAlign: "center", padding: 40 }}>
              <Title level={4} style={{ color: "#bfbfbf" }}>
                No opportunities found
              </Title>
              <Text type="secondary">
                Try adjusting your filters or search query
              </Text>
            </Card>
          )}
        </div>
      </div>
    ),
  }));

  return (
    <section
      className="watchlist-container"
      style={{
        padding: "24px 32px",
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          My Opportunity Watchlist
        </Title>
      </div>

      <Tabs
        defaultActiveKey="0"
        items={tabItems}
        onChange={setActiveTab}
        tabBarStyle={{ marginBottom: 0 }}
        tabBarExtraContent={
          <Text type="secondary">
            {filteredOpportunities.length} opportunities
          </Text>
        }
      />
    </section>
  );
}
