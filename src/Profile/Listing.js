import React, { useState, useEffect } from "react";
import {
  FiEdit,
  FiSettings,
  FiMoreVertical,
  FiSearch,
  FiCalendar,
  FiBriefcase,
  FiAward,
  FiBook,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { Menu, Dropdown, message } from "antd";
import axios from "axios";
import { closeRegistration } from "../ApiService/action";

export default function ListingDashboard() {
  const [activeTab, setActiveTab] = useState("All");
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setListings([
        {
          id: 1,
          title: "HR Analyst",
          company: "Markerz Global Solution",
          startDate: "2025-05-19",
          endDate: "2025-05-26",
          type: "Jobs",
          status: "Approved",
          visibility: "Private",
          expired: true,
          impressions: 120,
          registrations: 45,
          logo: "https://randomuser.me/api/portraits/lego/1.jpg",
        },
        {
          id: 2,
          title: "Tech Hackathon 2025",
          company: "Innovate Inc.",
          startDate: "2025-06-10",
          endDate: "2025-06-12",
          type: "Hackathons",
          status: "Live",
          visibility: "Public",
          expired: false,
          impressions: 320,
          registrations: 128,
          logo: "https://randomuser.me/api/portraits/lego/2.jpg",
        },
        {
          id: 3,
          title: "Data Science Scholarship",
          company: "AI Foundation",
          startDate: "2025-04-01",
          endDate: "2025-05-15",
          type: "Scholarships",
          status: "Rejected",
          visibility: "Public",
          expired: true,
          impressions: 85,
          registrations: 32,
          logo: "https://randomuser.me/api/portraits/lego/3.jpg",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const moreOptions = (
    <Menu
      items={[
        {
          key: "1",
          label: "Close Registration",
          danger: true,
          icon: <IoMdCloseCircleOutline />,
        },
      ]}
    />
  );

  const filteredListings = listings.filter((listing) => {
    const matchesTab = activeTab === "All" || listing.type === activeTab;
    const matchesFilter =
      activeFilter === "All" || listing.status === activeFilter;
    const matchesSearch =
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesFilter && matchesSearch;
  });

  const totalImpressions = listings.reduce(
    (sum, listing) => sum + listing.impressions,
    0
  );
  const totalRegistrations = listings.reduce(
    (sum, listing) => sum + listing.registrations,
    0
  );

  const tabs = ["All", "Scholarships", "Internships", "Jobs"];
  const filters = ["All", "Live", "Incomplete", "Rejected", "Approved"];

  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "Jobs":
        return <FiBriefcase className="icon-blue" />;
      case "Hackathons":
        return <FiAward className="icon-purple" />;
      case "Scholarships":
        return <FiBook className="icon-green" />;
      default:
        return <FiCalendar className="icon-gray" />;
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-inner">
        <div className="dashboard-header">
          <h1>Listing</h1>
        </div>

        <div className="tabs-container">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab-btn ${activeTab === tab ? "active" : ""}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="stats-container">
          <StatCard
            title="Total Opportunities"
            value={listings.length}
            change="+12% from last month"
            icon={<FiBriefcase />}
            bgColor="purple"
          />
          <StatCard
            title="Total Impressions"
            value={totalImpressions}
            change="+24% from last month"
            icon={<FiAward />}
            bgColor="blue"
          />
          <StatCard
            title="Total Registrations"
            value={totalRegistrations}
            change="+8% from last month"
            icon={<FiBook />}
            bgColor="orange"
          />
        </div>

        <div className="filter-container">
          <div className="search-input">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search opportunities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="filters">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`filter-btn ${
                  activeFilter === filter ? "active" : ""
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="loading-spinner"></div>
        ) : (
          <div className="listing-list">
            {filteredListings.length > 0 ? (
              <AnimatePresence>
                {filteredListings.map((listing) => (
                  <motion.div
                    key={listing.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="listing-card"
                  >
                    <div className="card-inner">
                      <img
                        src={listing.logo}
                        alt={listing.company}
                        className="company-logo"
                      />
                      <div className="listing-info">
                        <div className="listing-header">
                          <div style={{ textAlign: "left" }}>
                            <h3>{listing.title}</h3>
                            <p>{listing.company}</p>
                          </div>
                          <div className="listing-type">
                            {getTypeIcon(listing.type)}
                            <span>{listing.type}</span>
                          </div>
                        </div>
                        <div className="listing-meta">
                          <span>
                            {formatDate(listing.startDate)} -{" "}
                            {formatDate(listing.endDate)}
                            {listing.expired && (
                              <span className="expired"> (Expired)</span>
                            )}
                          </span>
                          <span
                            className={`badge ${listing.visibility.toLowerCase()}`}
                          >
                            {listing.visibility}
                          </span>
                          <span
                            className={`badge ${listing.status.toLowerCase()}`}
                          >
                            {listing.status}
                          </span>
                        </div>
                        <div className="listing-footer">
                          <div>
                            <span>
                              <strong>{listing.impressions}</strong> Impressions
                            </span>
                            <span>
                              <strong>{listing.registrations}</strong>{" "}
                              Registrations
                            </span>
                          </div>
                          <div className="listing-actions">
                            <a href="/admin-dashboard">
                              <FiEdit style={{ cursor: "pointer" }} />
                            </a>

                            <FiSettings />
                            <Dropdown
                              placement="bottomRight"
                              overlay={moreOptions}
                            >
                              <FiMoreVertical
                              // onClick={handleCloseRegistration}
                              />
                            </Dropdown>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            ) : (
              <div className="no-data">No opportunities found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const StatCard = ({ title, value, change, icon, bgColor }) => {
  return (
    <div className={`stat-card ${bgColor}`}>
      <div className="stat-header">
        <div>
          <p className="stat-title">{title}</p>
          <p className="stat-value">{value.toLocaleString()}</p>
          <p className="stat-change">{change}</p>
        </div>
        <div className="stat-icon">{icon}</div>
      </div>
    </div>
  );
};
