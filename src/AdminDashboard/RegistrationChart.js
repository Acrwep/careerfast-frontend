import React, { useState } from "react";
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
} from "recharts";
import {
  DatePicker,
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Divider,
} from "antd";
import {
  RiseOutlined,
  TeamOutlined,
  BarChartOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import styled from "styled-components";

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

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
  { date: "06-25", total: 160, male: 120, female: 40 },
  { date: "06-26", total: 210, male: 160, female: 50 },
  { date: "06-27", total: 90, male: 70, female: 20 },
  { date: "06-28", total: 180, male: 130, female: 50 },
  { date: "06-29", total: 220, male: 170, female: 50 },
  { date: "06-30", total: 150, male: 110, female: 40 },
];

const genderData = [
  { name: "Male", value: 605 },
  { name: "Female", value: 166 },
  { name: "Other", value: 30 },
];

const domainData = [
  { domain: "Software IT", value: 683 },
  { domain: "Mechanical", value: 7 },
  { domain: "Arts", value: 12 },
  { domain: "Science", value: 25 },
  { domain: "Other", value: 5 },
];

const COLORS = ["#6366F1", "#EC4899", "#94A3B8"]; // indigo, pink, slate

const RegistrationDashboard = () => {
  const [dateRange, setDateRange] = useState(null);

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
            background: "white",
            padding: "12px",
            border: "1px solid #e2e8f0",
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
                alignItems: "center",
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
            <Statistic
              title="Total Registrations"
              value={totalRegistrations}
              prefix={<TeamOutlined />}
            />
          </StatCard>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <StatCard>
            <Statistic
              title="Daily Average"
              value={(totalRegistrations / timeSeriesData.length).toFixed(1)}
              prefix={<BarChartOutlined />}
            />
          </StatCard>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <StatCard>
            <Statistic
              title="Growth Rate"
              value={growthRate.toFixed(1)}
              suffix="%"
              prefix={<RiseOutlined />}
              valueStyle={{ color: growthRate >= 0 ? "#10B981" : "#EF4444" }}
            />
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
            <Title level={5} style={{ margin: 0 }}>
              Registration Trends
            </Title>
            <RangePicker
              style={{ width: 256 }}
              value={dateRange}
              onChange={setDateRange}
            />
          </div>
        }
      >
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
            <XAxis dataKey="date" tick={{ fill: "#64748b" }} tickLine={false} />
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
      </ChartCard>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <ChartCard
            title={
              <Title level={5} style={{ margin: 0 }}>
                <PieChartOutlined style={{ marginRight: 8 }} />
                Gender Distribution
              </Title>
            }
          >
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
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  iconType="circle"
                  formatter={(value, entry, index) => (
                    <span style={{ color: "#334155" }}>
                      {value}: {genderData[index].value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </Col>
        <Col xs={24} md={12}>
          <ChartCard
            title={
              <Title level={5} style={{ margin: 0 }}>
                <BarChartOutlined style={{ marginRight: 8 }} />
                Domain Distribution
              </Title>
            }
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={domainData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  horizontal={true}
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  type="number"
                  tick={{ fill: "#64748b" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="domain"
                  tick={{ fill: "#64748b" }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Registrations" radius={[0, 4, 4, 0]}>
                  {domainData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Col>
      </Row>
    </DashboardContainer>
  );
};

export default RegistrationDashboard;
