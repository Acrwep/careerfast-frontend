import React, { useEffect, useState, useMemo } from "react";
import { Input, Card, Tag, Typography, Badge, Spin } from "antd";
import { SearchOutlined, CalendarOutlined } from "@ant-design/icons";
import { debounce } from "lodash";
import { useNavigate } from "react-router-dom";
import {
  getJobAppliedCandidates,
  getUserAppliedJobs,
  getUserJobPostStatus,
} from "../ApiService/action";
import { FaCheckCircle } from "react-icons/fa";
import Header from "../Header/Header";

const { Title, Text } = Typography;

const OpportunityCard = ({ opportunity, appliedJobStatus }) => {
  const navigate = useNavigate();

  const statusForThisJob = appliedJobStatus.find(
    (item) => item.post_id === opportunity.post_id
  );

  return (
    <Card
      onClick={() => navigate(`/job-details/${opportunity.post_id}`)}
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
            {statusForThisJob ? (
              <Tag
                color={
                  statusForThisJob.status === "Shortlist"
                    ? "green"
                    : statusForThisJob.status === "Rejected"
                    ? "red"
                    : statusForThisJob.status === "Sent mail"
                    ? "blue"
                    : statusForThisJob.status === "Pending"
                    ? "orange"
                    : "default"
                }
              >
                {statusForThisJob.status}
              </Tag>
            ) : (
              <Tag>Pending</Tag>
            )}
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
            <CalendarOutlined /> Created at: {opportunity.created_at}
          </Text>
        </div>
      </div>
    </Card>
  );
};

export default function AppliedJobs() {
  const [opportunities, setOpportunities] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginUserId, setLoginUserId] = useState(null);
  const [appliedJobStatus, setAppliedJobStatus] = useState([]);
  const navigate = useNavigate("");

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
      fetchAppliedJobs();
    }
  }, [loginUserId]);

  const fetchAppliedJobs = async () => {
    setLoading(true);
    try {
      const response = await getUserAppliedJobs({ userId: loginUserId });
      const jobs = response?.data?.data || [];

      setOpportunities(jobs);

      if (jobs.length > 0) {
        await fetchAllJobStatuses(jobs.map((job) => job.post_id));
      }
    } catch (error) {
      console.error("Error fetching applied jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllJobStatuses = async (jobIds) => {
    try {
      const statusResults = await Promise.all(
        jobIds.map(async (id) => {
          const res = await getUserJobPostStatus({ applied_job_id: id });
          const statusData = res?.data?.data?.[0];
          return { post_id: id, status: statusData?.status || null };
        })
      );

      setAppliedJobStatus(statusResults);
    } catch (error) {
      console.error("Error fetching job statuses:", error);
    }
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
    <>
      <Header />
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
            Applied Jobs & Internships
          </Title>
          <Badge
            count={filteredOpportunities.length}
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
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              appliedJobStatus={appliedJobStatus}
            />
          ))
        ) : (
          <Card style={{ textAlign: "center", padding: 40 }}>
            <Title level={4} style={{ color: "#bfbfbf" }}>
              No opportunities found
            </Title>
            <Text
              style={{
                cursor: "pointer",
                textDecoration: "underline",
                color: "#5f2eea",
              }}
              onClick={() => navigate("/job-filter")}
              type="secondary"
            >
              Apply some jobs
            </Text>
          </Card>
        )}
      </section>
    </>
  );
}
