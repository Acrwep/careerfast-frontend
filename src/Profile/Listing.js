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
import { Menu, Dropdown, message, Button } from "antd";
import {
  closeRegistration,
  getJobPostByUserId,
  getJobPosts,
} from "../ApiService/action";
import { FaEye } from "react-icons/fa";
import moment from "moment/moment";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";

export default function ListingDashboard() {
  const [activeTab, setActiveTab] = useState("All");
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loginUserId, setLoginUserId] = useState(null);
  const navigate = useNavigate();
  const [postId, setPostId] = useState(null);

  useEffect(() => {
    getJobPostByUserIdData();
  }, []);

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
    getJobPostsData();
  });

  const getJobPostsData = async () => {
    const payload = {};
    try {
      const response = await getJobPosts(payload);
      setPostId(response?.data?.data?.data.id || null);
      console.log("job post", response);
    } catch (error) {
      console.log("applied candidate", error);
    }
  };

  const getJobPostByUserIdData = async () => {
    const getUserDetails = JSON.parse(localStorage.getItem("loginDetails"));

    if (!getUserDetails || !getUserDetails.id) {
      console.error("User not logged in or ID missing.");
      return;
    }

    const payload = { user_id: getUserDetails.id };

    try {
      const response = await getJobPostByUserId(payload);
      console.log("getJobPostByUserId", response);

      setListings(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching job posts:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  };

  const handleCloseRegistration = async (jobId) => {
    const payload = {
      id: jobId,
      status: "Expired", // set status explicitly
    };
    try {
      const response = await closeRegistration(payload); // backend should handle the update
      message.success("Job marked as expired.");
      getJobPostByUserIdData(); // Refresh listing
    } catch (error) {
      message.error("Failed to close registration.");
      console.error("Close Registration Error:", error);
    }
  };

  const filteredListings = listings.filter((listing) => {
    const matchesTab = activeTab === "All" || listing.job_nature === activeTab;
    const matchesFilter =
      activeFilter === "All" || listing.status === activeFilter;
    const matchesSearch =
      listing.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.company_name.toLowerCase().includes(searchQuery.toLowerCase());
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

  const tabs = ["All", "Internship", "Job"];

  const getTypeIcon = (job_nature) => {
    switch (job_nature) {
      case "Job":
        return <FiBriefcase className="icon-blue" />;
      case "Contract":
        return <FiBriefcase className="icon-green" />;
      case "Internship":
        return <FiBriefcase className="icon-purple" />;
      default:
        return <FiCalendar className="icon-gray" />;
    }
  };

  return (
    <>
      <Header />
      <div className="dashboard-container">
        <div className="dashboard-inner">
          <div className="dashboard-header">
            <h1>Listing</h1>
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
              title="Total View"
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
          </div>

          {loading ? (
            <div className="loading-spinner"></div>
          ) : (
            <div className="listing-list">
              {filteredListings.length > 0 ? (
                <AnimatePresence>
                  {filteredListings.map((listing) => {
                    const isClosed =
                      moment().diff(moment(listing.created_at), "days") > 15;
                    const moreOptions = (
                      <Menu
                        items={[
                          {
                            key: "1",
                            label: (
                              <span
                                onClick={() =>
                                  handleCloseRegistration(listing.id)
                                }
                              >
                                Close Registration
                              </span>
                            ),
                            danger: true,
                            icon: <IoMdCloseCircleOutline />,
                          },
                        ]}
                      />
                    );
                    return (
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
                            src={listing.company_logo}
                            alt={listing.company_name}
                            className="company-logo"
                          />
                          <div className="listing-info">
                            <div className="listing-header">
                              <div style={{ textAlign: "left" }}>
                                <h3>{listing.job_title}</h3>
                                <p>{listing.company_name}</p>
                              </div>
                              <div className="listing-type">
                                {getTypeIcon(listing.job_nature)}
                                <span>{listing.job_nature}</span>
                              </div>
                            </div>

                            <div className="activeClosed">
                              <button className={isClosed ? "clo" : "act"}>
                                {isClosed ? "Closed" : "Active"}
                              </button>
                            </div>

                            <div className="listing-meta">
                              <span>
                                <span
                                  style={{ color: isClosed ? "red" : "green" }}
                                >
                                  Posted on:{" "}
                                </span>
                                <b>
                                  {moment(listing.created_at).format(
                                    "DD MMM YYYY"
                                  )}
                                </b>
                              </span>
                            </div>

                            <div className="listing-footer">
                              <div>
                                <span>
                                  <strong>{listing.impressions}</strong>{" "}
                                  Impressions
                                </span>
                                <span>
                                  <strong>{listing.registrations}</strong>{" "}
                                  Registrations
                                </span>
                              </div>
                              <div className="listing-actions">
                                <FaEye
                                  size={18}
                                  onClick={() =>
                                    navigate(`/job-details/${listing.id}`)
                                  }
                                  style={{ cursor: "pointer" }}
                                />
                                <FiEdit
                                  size={16}
                                  onClick={() =>
                                    navigate(`/admin-dashboard/${listing.id}`)
                                  }
                                  style={{ cursor: "pointer" }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              ) : (
                <div className="no-data">No opportunities found</div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
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
