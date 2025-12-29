import React, { useState, useEffect } from "react";
import {
  FiEdit,
  FiSearch,
  FiCalendar,
  FiBriefcase,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Card, Typography, Skeleton, Tooltip } from "antd";
import {
  getAppliedCandidatesCount,
  getJobPostByUserId,
  getJobPosts,
  StatsOfPost,
  getAllEvents,
} from "../ApiService/action";
import { FaEye } from "react-icons/fa";
import moment from "moment/moment";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import { MdFactCheck } from "react-icons/md";
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const { Title, Text } = Typography;

export default function ListingDashboard() {
  const [activeTab, setActiveTab] = useState("All");
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [listings, setListings] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loginUserId, setLoginUserId] = useState(null);
  const [postId, setPostId] = useState(null);
  const [totalAppliedCandidates, setTotalAppliedCandidates] = useState(null);
  const [listLoading, setListLoading] = useState(true);
  const [appliedCounts, setAppliedCounts] = useState({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalOpportunitiesCount, setTotalOpportunitiesCount] = useState(0);
  const [postedOn, setPostedOn] = useState(0);
  const navigate = useNavigate();

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
    getJobPostsData();
    getAllEventsData();
  }, []);

  useEffect(() => {
    getAppliedCandidatesCountData();
  }, [loginUserId]);

  // Fetch paginated data when page, activeTab, loginUserId, or search changes
  useEffect(() => {
    if (!loginUserId) return;

    if (activeTab === "Events") {
      // ✅ Client-side handling for Events
      let filtered = [...events];

      // 1. Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (e) =>
            (e.title || "").toLowerCase().includes(q) ||
            (e.category || "").toLowerCase().includes(q)
        );
      }

      // 2. Sort (Respect listingOrder)
      const order = localStorage.getItem("listingOrder");
      filtered.sort((a, b) =>
        order === "bottomTop"
          ? new Date(a.created_at) - new Date(b.created_at)
          : new Date(b.created_at) - new Date(a.created_at)
      );

      setTotalItems(filtered.length);

      // 3. Paginate
      const start = (page - 1) * pageSize;
      const paginated = filtered.slice(start, start + pageSize);

      setListings(paginated);
      setLoading(false);
    } else {
      // ✅ Server-side handling for Jobs
      getJobPostByUserIdData(page, pageSize, activeTab, searchQuery.trim());
    }
    // eslint-disable-next-line
  }, [page, pageSize, loginUserId, activeTab, events, searchQuery]);

  const getAllEventsData = async () => {
    try {
      const response = await getAllEvents();
      const allEvents = response?.data?.data || [];

      const mapped = allEvents.map((event) => {
        const created = new Date(event.created_at);
        const now = new Date();
        const daysDiff = Math.floor((now - created) / (1000 * 60 * 60 * 24));
        const isExpired = daysDiff >= 15;
        const daysLeft = 15 - daysDiff;

        return {
          ...event,
          type: "Event",
          isExpired,
          daysLeft: isExpired ? "Expired" : `${daysLeft} days left`,
        };
      });

      setEvents(mapped);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

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
      console.log("getJobPosts error", error);
    } finally {
      setTimeout(() => setListLoading(false), 600);
    }
  };

  const getAppliedCandidatesCountData = async () => {
    const payload = { user_id: loginUserId };
    try {
      const response = await getAppliedCandidatesCount(payload);
      setTotalAppliedCandidates(
        Number(response?.data?.data?.candidatesCount) || 0
      );
    } catch (error) {
      console.log("applied candidates count", error);
      setTotalAppliedCandidates(0);
    }
  };

  const getJobPostByUserIdData = async (
    currentPage = 1,
    limit = pageSize,
    tab = "All",
    search = ""
  ) => {
    const getUserDetails = JSON.parse(localStorage.getItem("loginDetails"));
    if (!getUserDetails?.id) return;

    const payload = {
      user_id: getUserDetails.id,
      page: currentPage,
      limit: limit,
      search: search, // ✅ Pass search query
    };

    // Add job_nature filter if not "All" or "Events"
    if (tab !== "All" && tab !== "Events") {
      payload.job_nature = tab;
    }

    setLoading(true);

    try {
      const response = await getJobPostByUserId(payload);
      const jobs = response?.data?.data || [];
      const total = response?.data?.total || 0;

      setListings(jobs);
      setTotalItems(total);

      // Set total opportunities count only when on "All" tab (unfiltered total)
      if (tab === "All" && !search) {
        setTotalOpportunitiesCount(total);
      }

      const counts = {};
      for (let job of jobs) {
        try {
          const statPayload = {
            user_id: getUserDetails.id,
            job_post_id: job.id,
          };
          const res = await StatsOfPost(statPayload);
          counts[job.id] = res?.data?.data?.candidatesCount || 0;
        } catch {
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

  // Get listing order from localStorage
  const listingOrder = localStorage.getItem("listingOrder");

  // ✅ Sort listings based on order preference
  const sortedListings = [...listings].sort((a, b) =>
    listingOrder === "bottomTop"
      ? new Date(a.created_at) - new Date(b.created_at)
      : new Date(b.created_at) - new Date(a.created_at)
  );

  // Reset to page 1 when tab or search changes
  useEffect(() => {
    setPage(1);
  }, [activeTab, searchQuery, activeFilter]);

  const tabs = ["All", "Internship", "Job", "Scholarship", "Events"];

  return (
    <>
      <Header />
      <div className="dashboard-container">
        <div className="dashboard-inner">
          <div className="dashboard-header">
            <h1>Listing</h1>
          </div>

          {/* ✅ Stats */}
          <div className="stats-container">
            {listLoading ? (
              <Skeleton active />
            ) : (
              <>
                <StatCard
                  title="Total Opportunities"
                  value={totalOpportunitiesCount}
                  icon={<FiBriefcase />}
                  bgColor="purple"
                />
                <StatCard
                  title="Total Applied Candidates"
                  value={totalAppliedCandidates}
                  icon={<MdFactCheck />}
                  bgColor="blue"
                />
                <StatCard
                  title="Total Events"
                  value={events.length}
                  icon={<FiCalendar />}
                  bgColor="orange"
                />
              </>
            )}
          </div>


          {/* ✅ Filters */}
          <div className="filter-container">
            <div className="search-input">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder={`Search ${activeTab.toLowerCase()}...`}
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

          {/* ✅ Combined Listing */}
          {loading ? (
            <div className="loading-spinners"></div>
          ) : (
            <div className="listing-list">
              <AnimatePresence>
                {sortedListings.map((item) => {
                  const isEvent = item.isEvent || item.type === "Event";
                  const isClosed =
                    isEvent && item.isExpired
                      ? true
                      : moment().diff(moment(item.created_at), "days") >= 15;

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="listing-card"
                    >
                      <div className="card-inner">
                        <img
                          src={
                            isEvent
                              ? item.logo
                              : item.company_logo
                          }
                          alt={
                            isEvent
                              ? item.title
                              : item.company_name
                          }
                          className="company-logo"
                        />
                        <div className="listing-info">
                          <div className="listing-header">
                            <div>
                              <h3>
                                {isEvent
                                  ? item.title
                                  : item.job_title}
                              </h3>
                              <p>
                                {isEvent
                                  ? item.category
                                  : item.company_name}
                              </p>
                            </div>
                            <div className="listing-type">
                              <FiCalendar className="icon-blue" />
                              <span>
                                {isEvent
                                  ? item.mode
                                  : item.job_nature}
                              </span>
                            </div>
                          </div>

                          <div className="activeClosed">
                            <button className={isClosed ? "clo" : "act"}>
                              {isClosed ? "Expired" : "Active"}
                            </button>
                          </div>

                          <div className="listing-meta">
                            {isEvent ? (
                              <>
                                <span>
                                  <b>Mode:</b> {item.mode}
                                </span>
                                <span>
                                  <b>Prize:</b> ₹{item.winnerPrize || "N/A"}
                                </span>
                                <span>
                                  <b>Days Left:</b> {item.daysLeft}
                                </span>
                              </>
                            ) : (
                              <>
                                <span>
                                  <b>Posted:</b>{" "}
                                  {postedOn[item.id] || "N/A"}
                                </span>
                                <span>
                                  <b>Registrations:</b>{" "}
                                  {appliedCounts[item.id] || 0}
                                </span>
                              </>
                            )}
                          </div>

                          <div className="listing-footer">
                            <div className="listing-actions">
                              <Tooltip title="View">
                                <FaEye
                                  size={18}
                                  onClick={() => {
                                    if (isEvent) {
                                      navigate(`/event-details/${item.id}`);
                                    } else {
                                      const safeSlug = (val) => {
                                        if (!val) return "";
                                        if (Array.isArray(val)) return generateSlug(val.join(" "));
                                        try {
                                          const parsed = JSON.parse(val);
                                          if (Array.isArray(parsed)) return generateSlug(parsed.join(" "));
                                          return generateSlug(parsed);
                                        } catch {
                                          return generateSlug(val);
                                        }
                                      };

                                      const jobNature = generateSlug(item.job_nature || "");
                                      const jobTitle = generateSlug(item.job_title || "");
                                      const companyName = generateSlug(item.company_name || "");
                                      const locationSlug = safeSlug(item.work_location);
                                      const workplaceType = generateSlug(item.workplace_type || "");
                                      const experienceType = generateSlug(item.experience_type || "");
                                      const experienceRequired = safeSlug(item.experience_required);

                                      let basePath = "/job-details";
                                      if (item.job_nature === "Internship") basePath = "/internship-details";
                                      if (item.job_nature === "Scholarship") basePath = "/scholarship-details";

                                      navigate(`${basePath}/${jobNature}-${jobTitle}-${companyName}-${locationSlug}-${workplaceType}-${experienceType}-${experienceRequired}-${item.id}`);
                                    }
                                  }}
                                />
                              </Tooltip>
                              <Tooltip title="Edit">
                                <FiEdit
                                  size={16}
                                  onClick={() =>
                                    navigate(
                                      isEvent
                                        ? `/admin/event-edit/${item.id}`
                                        : `/admin-dashboard/${item.id}`
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
            </div>
          )}

          {/* ✅ Pagination Controls */}
          {!loading && sortedListings.length > 0 && totalItems > 0 && (
            <div className="pagination-container">
              <div className="pagination-info">
                <span>
                  Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, totalItems)} of {totalItems} items
                </span>
              </div>
              <div className="pagination-controls">
                <button
                  className="pagination-btn"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </button>
                <span className="pagination-page">
                  Page {page} of {Math.ceil(totalItems / pageSize) || 1}
                </span>
                <button
                  className="pagination-btn"
                  onClick={() => setPage(page + 1)}
                  disabled={page >= Math.ceil(totalItems / pageSize)}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ✅ Stat Card Component
const StatCard = ({ title, value, icon, bgColor }) => (
  <div className={`stat-card ${bgColor}`}>
    <div className="stat-header">
      <div>
        <p className="stat-title">{title}</p>
        <p className="stat-value">{isNaN(value) ? 0 : value}</p>
      </div>
      <div className="stat-icon">{icon}</div>
    </div>
  </div>
);
