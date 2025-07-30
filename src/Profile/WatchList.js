import React, { useEffect, useState, useMemo } from "react";
import {
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
  EllipsisOutlined,
  HeartOutlined,
  HeartFilled,
} from "@ant-design/icons";
import { debounce } from "lodash";
import { CommonToaster } from "../Common/CommonToaster";
import { getSavedJobs, removeSavedJobs } from "../ApiService/action";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const OpportunityCard = ({ opportunity, onSave }) => {
  const [saved, setSaved] = useState(() => opportunity.saved);
  const [loginUserId, setLoginUserId] = useState(null);
  const navigate = useNavigate();

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

  const handleSave = () => {
    if (!loginUserId) {
      CommonToaster("Please log in to save jobs.", "error");
      return;
    }

    const newSavedState = !saved;
    onSave(opportunity.id, newSavedState);
    setSaved(newSavedState);

    CommonToaster(
      newSavedState ? "Removed from favourites ❤️" : "Added to favourites ❤️",
      newSavedState ? "error" : "success"
    );

    if (newSavedState) {
      removeSavedJobsData(opportunity);
    }
  };

  const removeSavedJobsData = async (opportunity) => {
    try {
      await removeSavedJobs({ id: opportunity.id });
    } catch (error) {
      console.error("Remove saved jobs error", error);
    }
  };

  return (
    <Card
      onClick={() => navigate(`/job-details/${opportunity.job_post_id}`)}
      style={{
        marginBottom: 16,
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
        border: "none",
        cursor: "pointer",
      }}
    >
      <div style={{ display: "flex", gap: 20 }}>
        <div style={{ flexShrink: 0 }}>
          <img
            src={opportunity.company_logo}
            alt={`${opportunity.company_name || opportunity.company} logo`}
            style={{
              borderRadius: 8,
              width: 80,
              height: 80,
              objectFit: "contain",
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

          <Text strong style={{ display: "block", marginBottom: 8 }}>
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
            <Tag color="green">{opportunity.work_location}</Tag>
            <Tag color="blue">
              {opportunity.salary_type === "Fixed"
                ? `$${opportunity.min_salary}`
                : opportunity.salary_type === "Range"
                ? `$${opportunity.min_salary} - $${opportunity.max_salary}`
                : ""}
            </Tag>
          </div>

          <Text
            type="secondary"
            style={{ display: "flex", alignItems: "center", gap: 4 }}
          >
            <CalendarOutlined /> Created at: {opportunity.created_date}
          </Text>
        </div>

        {/* <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Dropdown overlay={menu} placement="bottomRight">
            <Button type="text" icon={<EllipsisOutlined />} />
          </Dropdown>
        </div> */}
      </div>
    </Card>
  );
};

export default function WatchList() {
  const [opportunities, setOpportunities] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginUserId, setLoginUserId] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("loginDetails");
    if (stored) {
      try {
        const loginDetails = JSON.parse(stored);
        setLoginUserId(loginDetails.id);
      } catch (error) {
        console.error("Invalid JSON in localStorage", error);
      }
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
      // console.log("kjshdfshhd", response);
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
      const target = `${opp.job_title} ${
        opp.company_name || opp.company
      }`.toLowerCase();
      return searchQuery ? target.includes(searchQuery.toLowerCase()) : true;
    });
  }, [opportunities, searchQuery]);

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
          My Opportunity Wishlist
        </Title>
        <Badge
          count={opportunities.length}
          style={{ backgroundColor: "#5f2eea" }}
        />
      </div>

      <Input
        placeholder="Search by role or company..."
        prefix={<SearchOutlined />}
        style={{
          borderRadius: 8,
          padding: "10px 16px",
          maxWidth: 400,
          marginBottom: 24,
        }}
        onChange={(e) => debouncedSearch(e.target.value)}
        allowClear
      />

      {loading ? (
        <div style={{ textAlign: "center", padding: 40 }}>
          <Spin size="large" />
        </div>
      ) : filteredOpportunities.length > 0 ? (
        filteredOpportunities.map((opp) => (
          <OpportunityCard key={opp.id} opportunity={opp} onSave={handleSave} />
        ))
      ) : (
        <Card style={{ textAlign: "center", padding: 40 }}>
          <Title level={4} style={{ color: "#bfbfbf" }}>
            No opportunities found
          </Title>
          <Text type="secondary">Try adjusting your search query</Text>
        </Card>
      )}
    </section>
  );
}
