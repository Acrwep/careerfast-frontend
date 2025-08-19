import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
  LabelList,
} from "recharts";
import {
  DatePicker,
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Divider,
  Alert,
  Skeleton,
} from "antd";
import {
  RiseOutlined,
  TeamOutlined,
  BarChartOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import { getAppliedCandidatesCount, StatsOfPost } from "../ApiService/action";
import { useParams } from "react-router-dom";
import { IoIosMale } from "react-icons/io";

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const RegistrationDashboard = () => {
  const { id } = useParams();
  const [dateRange, setDateRange] = useState(null);
  const [loginUserId, setLoginUserId] = useState(null);
  const [maleCount, setMaleCount] = useState(null);
  const [femaleCount, setFemaleCount] = useState(null);
  const [othersCount, setOthersCount] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [domainCount, setDomainCount] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    StatsOfPostData();
  });

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
  });

  useEffect(() => {
    StatsOfPostData();
  });

  useEffect(() => {
    getAppliedCandidatesCountData();
  }, [loginUserId]);

  const StatsOfPostData = async () => {
    const payload = {
      user_id: loginUserId,
      job_post_id: id,
    };
    try {
      const response = await StatsOfPost(payload);
      setMaleCount(response?.data?.data?.males || null);
      setFemaleCount(response?.data?.data?.females || null);
      setOthersCount(response?.data?.data?.females || null);
      setTotalCount(response?.data?.data?.candidatesCount || 0);

      console.log("StatsOfPost", response);
    } catch (error) {
      console.log("StatsOfPost", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  };

  const getAppliedCandidatesCountData = async () => {
    const payload = {
      user_id: loginUserId,
      id: id,
    };

    try {
      const response = await getAppliedCandidatesCount(payload);
      setOthersCount(response?.data?.data?.others || null);
      setDomainCount(
        (response?.data?.data?.domain_stats || []).map((item) => ({
          domain: item.job_categories,
          value: item.candidates_count,
        }))
      );

      console.log("getAppliedCandidatesCount", response);
    } catch (error) {
      console.log("getAppliedCandidatesCount", error);
    }
  };

  // Styled components for premium look
  const DashboardContainer = styled.div`
    padding: 24px;
    background: #f8fafc;
  `;

  const ChartCard = styled(Card)`
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    margin-bottom: 24px;
    border: none;
    .ant-card-head {
      border-bottom: 1px solid #f0f0f0;
    }
  `;

  const StatCard = styled(Card)`
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.03);
    border: none;
    .ant-statistic-title {
      color: #64748b;
      font-size: 14px;
    }
    .ant-statistic-content {
      font-size: 24px;
      color: #1e293b;
    }
  `;

  // Sample data
  const timeSeriesData = [
    {
      date: "06-25",
      total: totalCount,
      male: maleCount || 0,
      female: femaleCount || 0,
    },
    {
      date: "06-26",
      total: totalCount,
      male: maleCount || 0,
      female: femaleCount || 0,
    },
    {
      date: "06-27",
      total: totalCount,
      male: maleCount || 0,
      female: femaleCount || 0,
    },
    {
      date: "06-28",
      total: totalCount,
      male: maleCount || 0,
      female: femaleCount || 0,
    },
    {
      date: "06-29",
      total: totalCount,
      male: maleCount || 0,
      female: femaleCount || 0,
    },
    {
      date: "06-30",
      total: totalCount,
      male: maleCount || 0,
      female: femaleCount || 0,
    },
  ];

  const genderData = [
    { name: "Female", value: femaleCount || 0 },
    { name: "Male", value: maleCount || 0 },
    { name: "Other", value: othersCount || 0 },
  ];

  const domainData = [
    { domain: "Software IT", value: 683 },
    { domain: "Mechanical", value: 7 },
    { domain: "Arts", value: 12 },
    { domain: "Science", value: 25 },
    { domain: "Other", value: 5 },
  ];

  const COLORS = ["#EC4899", "#6366F1", "#94A3B8"];
  const COLORS1 = ["#6366F1", "#EC4899", "#94A3B8"];

  const totalRegistrations = genderData.reduce(
    (acc, cur) => acc + cur.value,
    0
  );
  const lastValue = timeSeriesData[timeSeriesData.length - 1]?.total || 0;
  const prevValue = timeSeriesData[timeSeriesData.length - 2]?.total || 0;
  const growthRate = ((lastValue - prevValue) / (prevValue || 1)) * 100;

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
    name,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
    const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fontSize: "12px", fontWeight: 500 }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="custom-tooltip"
          style={{
            background: "#c1a7fd94",
            padding: "12px",
            border: "1px solid #cbb5ffff",
            borderRadius: "6px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <p style={{ margin: 0, fontWeight: 600 }}>{label}</p>
          {payload.map((entry, index) => (
            <p
              key={`item-${index}`}
              style={{
                margin: "4px 0",
                color: entry.color,
                display: "flex",
                alignItems: "baseline",
                gap: "8px",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "10px",
                  height: "10px",
                  backgroundColor: entry.color,
                  borderRadius: "2px",
                }}
              ></span>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <DashboardContainer>
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8}>
          <StatCard>
            {loading ? (
              <Skeleton active />
            ) : (
              <Statistic
                title="Total Registrations"
                value={totalCount}
                prefix={<TeamOutlined />}
              />
            )}
          </StatCard>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <StatCard>
            {loading ? (
              <Skeleton active />
            ) : (
              <Statistic
                title="Daily Average"
                value={(totalRegistrations / timeSeriesData.length).toFixed(1)}
                prefix={<BarChartOutlined />}
              />
            )}
          </StatCard>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <StatCard>
            {loading ? (
              <Skeleton active />
            ) : (
              <Statistic
                title="Growth Rate"
                value={growthRate.toFixed(1)}
                suffix="%"
                prefix={<RiseOutlined />}
                valueStyle={{ color: growthRate >= 0 ? "#10B981" : "#EF4444" }}
              />
            )}
          </StatCard>
        </Col>
      </Row>

      <ChartCard
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ padding: "20px 10px" }}>
              <Title level={5} style={{ margin: 0 }}>
                <PieChartOutlined style={{ marginRight: 8 }} />
                Registration Trends
              </Title>
              <Alert
                style={{
                  marginTop: 7,
                  marginBottom: 0,
                  fontSize: 12,
                  padding: "3px 5px",
                  border: "none",
                  display: "inline-flex",
                }}
                message="Here is the registration trends for selected post"
                type="warning"
                showIcon
              />
            </span>
            <RangePicker
              style={{ width: 256 }}
              value={dateRange}
              onChange={setDateRange}
            />
          </div>
        }
      >
        {loading ? (
          <Skeleton active />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={timeSeriesData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f0f0f0"
              />
              <XAxis
                dataKey="date"
                tick={{ fill: "#64748b" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#64748b" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: 20 }} />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#6366F1"
                strokeWidth={2}
                name="Total"
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="male"
                stroke="#10B981"
                strokeWidth={2}
                name="Male"
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="female"
                stroke="#EC4899"
                strokeWidth={2}
                name="Female"
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <ChartCard
            title={
              <span style={{ padding: "20px 10px" }}>
                <Title level={5} style={{ margin: 0 }}>
                  <PieChartOutlined style={{ marginRight: 8 }} />
                  Gender Distribution
                </Title>
                <Alert
                  style={{
                    marginTop: 7,
                    marginBottom: 15,
                    fontSize: 12,
                    padding: "3px 5px",
                    border: "none",
                    display: "inline-flex",
                  }}
                  message="Here is the gender distribution chart for overall posts"
                  type="warning"
                  showIcon
                />
              </span>
            }
          >
            {genderData.some((item) => item.value > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={renderCustomizedLabel}
                    labelLine={false}
                  >
                    {genderData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={<CustomTooltip />}
                    wrapperStyle={{ zIndex: 1000 }}
                  />
                  <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    iconType="circle"
                    formatter={(value, entry) => (
                      <span style={{ color: "#334155" }}>
                        {value}: {entry.payload.value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Card style={{ textAlign: "center", padding: 40 }}>
                <Title level={4} style={{ color: "#bfbfbf" }}>
                  No gender data available
                </Title>
              </Card>
            )}
          </ChartCard>
        </Col>
        <Col xs={24} md={12}>
          <ChartCard
            title={
              <span style={{ padding: "20px 10px" }}>
                <Title level={5} style={{ margin: 0 }}>
                  <PieChartOutlined style={{ marginRight: 8 }} />
                  Domain Distribution
                </Title>
                <Alert
                  style={{
                    marginTop: 7,
                    marginBottom: 15,
                    fontSize: 12,
                    padding: "3px 5px",
                    border: "none",
                    display: "inline-flex",
                  }}
                  message="Here is the domain distribution chart for overall posts"
                  type="warning"
                  showIcon
                />
              </span>
            }
          >
            {domainCount.length > 0 &&
            domainCount.some((item) => item.value > 0) ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={domainCount}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: -30, bottom: 5 }}
                >
                  <CartesianGrid horizontal vertical={false} stroke="#f0f0f0" />
                  <XAxis
                    type="number"
                    tick={{ fill: "#64748b" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="domain"
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    width={200}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    wrapperStyle={{ zIndex: 1000 }}
                  />
                  <Bar
                    dataKey="value"
                    name="Registrations"
                    radius={[0, 4, 4, 0]}
                  >
                    {domainCount.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS1[index % COLORS1.length]}
                      />
                    ))}
                    <LabelList dataKey="value" position="right" fill="#000" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Card style={{ textAlign: "center", padding: 40 }}>
                <Title level={4} style={{ color: "#bfbfbf" }}>
                  No domain data available
                </Title>
              </Card>
            )}
          </ChartCard>
        </Col>
      </Row>
    </DashboardContainer>
  );
};

export default RegistrationDashboard;
