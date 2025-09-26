import React, { useState, useEffect } from "react";
import {
  FiEdit,
  FiSearch,
  FiCalendar,
  FiBriefcase,
  FiAward,
  FiBook,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Card, Typography, Skeleton, Tooltip } from "antd";
import {
  getAppliedCandidatesCount,
  getJobPostByUserId,
  getJobPosts,
  StatsOfPost,
} from "../ApiService/action";
import { FaEye } from "react-icons/fa";
import moment from "moment/moment";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import { MdFactCheck } from "react-icons/md";
const { Title, Text } = Typography;

export default function ListingDashboard() {
  const [activeTab, setActiveTab] = useState("All");
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loginUserId, setLoginUserId] = useState(null);
  const navigate = useNavigate();
  const [postId, setPostId] = useState(null);
  const [totalAppliedCandidates, setTotalAppliedCandidates] = useState(null);
  const [listLoading, setListLoading] = useState(true);
  const [appliedCounts, setAppliedCounts] = useState({});
  const [visibleCount, setVisibleCount] = useState(10);
  const [postedOn, setPostedOn] = useState(0);

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
    getJobPostByUserIdData();
  }, []);

  useEffect(() => {
    getJobPostsData();

  }, []);

  useEffect(() => {
    getAppliedCandidatesCountData();
  }, [loginUserId])

  const getJobPostsData = async () => {
    const payload = {};
    try {
      const response = await getJobPosts(payload);
      const jobPosts = response?.data?.data?.data || [];

      const postedMap = {};
      jobPosts.forEach((job) => {
        postedMap[job.id] = job.date_posted;
      });

      setPostedOn(postedMap);

      const firstId = jobPosts[0]?.id || null;
      setPostId(firstId);
    } catch (error) {
      console.log("applied candidate", error);
    } finally {
      setTimeout(() => setListLoading(false), 600);
    }
  };

  const getAppliedCandidatesCountData = async () => {
    const payload = {
      user_id: loginUserId,
    };
    try {
      const response = await getAppliedCandidatesCount(payload);
      console.log("getAppliedCandidatesCount", response)
      setTotalAppliedCandidates(
        Number(response?.data?.data?.candidatesCount) || 0
      );
    } catch (error) {
      console.log("applied candidates count", error);
      setTotalAppliedCandidates(0);
    }
  };

  useEffect(() => {
    StatsOfPostData();
  }, [loginUserId]);

  const StatsOfPostData = async () => {
    const payload = {
      user_id: loginUserId,
      job_post_id: postId,
    };

    try {
      const response = await StatsOfPost(payload);
      console.log("StatsOfPost", response);
    } catch (error) {
      console.log("StatsOfPost", error);
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
      const jobs = response?.data?.data || [];
      setListings(jobs);

      // fetch applied count for each job
      const counts = {};
      for (let job of jobs) {
        try {
          const statPayload = {
            user_id: getUserDetails.id,
            job_post_id: job.id,
          };
          const res = await StatsOfPost(statPayload);
          counts[job.id] = res?.data?.data?.candidatesCount || 0;
        } catch (err) {
          counts[job.id] = 0;
        }
      }
      setAppliedCounts(counts);
    } catch (error) {
      console.error("Error fetching job posts:", error);
    } finally {
      setTimeout(() => setLoading(false), 300);
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

  // Safe reducer
  const totalRegistrations = listings.reduce(
    (sum, listing) => sum + (Number(listing.registrations) || 0),
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
  const listingOrder = localStorage.getItem("listingOrder"); // get the order

  return (
    <>
      <Header />
      <div className="dashboard-container">
        <div className="dashboard-inner">
          <div className="dashboard-header">
            <h1>Listing</h1>
          </div>

          <div className="stats-container">
            {listLoading ? (
              <Skeleton active />
            ) : (
              <StatCard
                title="Total Opportunities"
                value={listings.length}
                change="+12% from last month"
                icon={<FiBriefcase />}
                bgColor="purple"
              />
            )}
            {listLoading ? (
              <Skeleton active />
            ) : (
              <StatCard
                title="Total Applied Candidates"
                value={totalAppliedCandidates}
                change="+24% from last month"
                icon={<MdFactCheck />}
                bgColor="blue"
              />
            )}
            {listLoading ? (
              <Skeleton active />
            ) : (
              <StatCard
                title="Total View"
                value={totalRegistrations}
                change="+8% from last month"
                icon={<FaEye />}
                bgColor="orange"
              />
            )}
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
                  {[...filteredListings]
                    .sort((a, b) => {
                      if (listingOrder === "bottomTop") {
                        return new Date(a.created_at) - new Date(b.created_at); // oldest first
                      }
                      if (listingOrder === "topBottom") {
                        return new Date(b.created_at) - new Date(a.created_at); // newest first
                      } else {
                        return new Date(b.created_at) - new Date(a.created_at); // newest first
                      }
                    })
                    .slice(0, visibleCount)
                    .map((listing) => {
                      const isClosed =
                        moment().diff(moment(listing.created_at), "days") >= 15;
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
                                    style={{
                                      color: isClosed ? "red" : "green",
                                    }}
                                  >
                                    Posted:{" "}
                                  </span>
                                  <b>{postedOn[listing.id] || "N/A"}</b>
                                </span>
                              </div>

                              <div className="listing-footer">
                                <div>
                                  <span>
                                    <strong>{listing.impressions}</strong>{" "}
                                    Impressions
                                  </span>
                                  <span>
                                    <strong>
                                      {appliedCounts[listing.id] || 0}
                                    </strong>{" "}
                                    : Registrations
                                  </span>
                                </div>
                                <div className="listing-actions">
                                  <Tooltip
                                    title={`View ${listing.job_nature} post`}
                                  >
                                    <FaEye
                                      size={18}
                                      onClick={() =>
                                        navigate(`/job-details/${listing.id}`)
                                      }
                                      style={{ cursor: "pointer" }}
                                    />
                                  </Tooltip>
                                  <Tooltip
                                    title={`Edit ${listing.job_nature} post`}
                                  >
                                    <FiEdit
                                      size={16}
                                      onClick={() =>
                                        navigate(
                                          `/admin-dashboard/${listing.id}`
                                        )
                                      }
                                      style={{ cursor: "pointer" }}
                                    />
                                  </Tooltip>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                </AnimatePresence>
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
                    onClick={() => navigate("/post-jobs")}
                    type="secondary"
                  >
                    Post new jobs
                  </Text>
                </Card>
              )}
              {visibleCount < filteredListings.length && (
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                  <button
                    onClick={() => setVisibleCount(visibleCount + 10)}
                    className="see-more-btn"
                  >
                    See More
                  </button>
                </div>
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
          <p className="stat-value">{isNaN(value) ? 0 : value}</p>
          <p className="stat-change">{change}</p>
        </div>
        <div className="stat-icon">{icon}</div>
      </div>
    </div>
  );
};
