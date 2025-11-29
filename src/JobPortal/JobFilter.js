// src/pages/JobFilter.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Row,
  Col,
  Card,
  Space,
  Button,
  Radio,
  Checkbox,
  Skeleton,
  Drawer,
  Empty,
} from "antd";
import {
  ClockCircleOutlined,
  CrownFilled,
  ThunderboltFilled,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";

import Header from "../Header/Header";
import CommonSelectField from "../Common/CommonSelectField";

import { getAllCourses, getJobCategoryData, getJobPosts } from "../ApiService/action";

import { FaMapMarkerAlt } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { CgWorkAlt } from "react-icons/cg";
import { LuCalendarDays } from "react-icons/lu";
import { BiCategoryAlt } from "react-icons/bi";
import { CheckCircle, RefreshCcwIcon } from "lucide-react";

import cities from "cities-list";
import "../css/JobFilter.css";

const generateSlug = (text = "") =>
  String(text).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const workTypes = ["In Office", "On Field", "Work From Home"];
const jobNature = ["Job", "Internship", "Scholarship"];

export default function JobFilter() {
  const navigate = useNavigate();
  const location = useLocation();
  const [courses, setCourses] = useState([]);
  const [categorySearch, setCategorySearch] = useState("");
  /** -------------------- STATE -------------------- **/
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Data
  const [jobs, setJobs] = useState([]);
  const [activeJob, setActiveJob] = useState(null);
  const [jobCategoryOptions, setJobCategoryOptions] = useState([]);

  // Filters
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedWorkingDays, setSelectedWorkingDays] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedSort, setSelectedSort] = useState(null);
  const [selectedUserType, setSelectedUserType] = useState("");
  const [jobNatureSelected, setJobNatureSelected] = useState("");

  // Derived
  const [allCities, setAllCities] = useState([]);

  /** -------------------- EFFECTS -------------------- **/

  // Title
  useEffect(() => {
    document.title = "CareerFast | Find Jobs";
  }, []);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await getAllCourses();
      setCourses(res);
    } catch (error) {
      console.log("Error loading courses:", error);
    }
  };

  // Cities
  useEffect(() => {
    const mapped = Object.keys(cities).map((city) => ({
      value: city,
      label: city,
      country: cities[city].country,
    }));

    // Add "Pan India" at the top
    setAllCities([
      { value: "Pan India", label: "Pan India" },
      ...mapped
    ]);
  }, []);


  // Categories (with custom merge preserved)
  useEffect(() => {
    (async () => {
      try {
        const res = await getJobCategoryData();
        const backend =
          res?.data?.data?.map((item) => ({
            label: item?.category_name || "",
            value: item?.category_name || "",
          })) || [];

        const custom = JSON.parse(localStorage.getItem("customCategories") || "[]")
          .filter(Boolean)
          .map((c) => ({ label: c, value: c }));

        const merged = [
          ...backend,
          ...custom.filter((c) => !backend.some((b) => b.value === c.value)),
        ].filter((i) => i.label?.trim());

        merged.sort((a, b) =>
          String(a.label).localeCompare(String(b.label), "en", { sensitivity: "base" })
        );

        setJobCategoryOptions(merged);
      } catch {
        // silent
      }
    })();
  }, []);

  // URL preselects
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filterType = params.get("filter");
    const categorySlug = params.get("category");

    if (filterType && jobNature.includes(filterType)) {
      setJobNatureSelected(filterType);
    }

    if (categorySlug && jobCategoryOptions.length) {
      const matched = jobCategoryOptions.find(
        (c) => generateSlug(c.value) === categorySlug
      );
      if (matched) {
        setSelectedCategories([matched.value]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, jobNatureOptionsToKey(jobCategoryOptions)]);

  // Fetch jobs when filters change
  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedCategories.join("|"),
    selectedTypes.join("|"),
    selectedLocations.join("|"),
    selectedWorkingDays,
    selectedStatus,
    selectedSort,
    jobNatureSelected,
    selectedUserType,
  ]);

  /** -------------------- HELPERS -------------------- **/
  function jobNatureOptionsToKey(opts) {
    return opts.map((o) => o.value).join("|");
  }

  const payload = useMemo(
    () => ({
      job_categories: selectedCategories,
      workplace_type: selectedTypes,
      work_location: selectedLocations,
      working_days: selectedWorkingDays,
      status: selectedStatus,
      job_nature: jobNatureSelected,
      salary_sort:
        selectedSort === "highToLow"
          ? "high_to_low"
          : selectedSort === "lowToHigh"
            ? "low_to_high"
            : "",
    }),
    [
      selectedCategories,
      selectedTypes,
      selectedLocations,
      selectedWorkingDays,
      selectedStatus,
      jobNatureSelected,
      selectedSort,
    ]
  );

  const filteredCategoryOptions = useMemo(() => {
    return jobCategoryOptions.filter((item) =>
      item.label.toLowerCase().includes(categorySearch.toLowerCase())
    );
  }, [jobCategoryOptions, categorySearch]);


  const transformJob = (job) => {
    const postedDate = new Date(job.created_at);
    const today = new Date();
    const daysPassed = Math.floor((today - postedDate) / (1000 * 60 * 60 * 24));
    const totalActiveDays = 15;
    const daysLeft = totalActiveDays - daysPassed;

    const safeQs = Array.isArray(job?.questions) ? job.questions : [];

    return {
      id: job.id,
      title: job.job_title,
      company: job.company_name,
      logo: job.company_logo,
      job_description: job.job_description,
      date_posted: job.date_posted,
      working_days: job.working_days,
      daysLeft: daysLeft >= 0 ? `${daysLeft} days left` : "Expired",
      level: job.experience_type,
      salary:
        job.salary_type === "Fixed"
          ? `${job.currency} ${job.min_salary || "N/A"}`
          : job.salary_type === "Range"
            ? `${job.currency} ${job.min_salary || "N/A"} - ${job.currency} ${job.max_salary || "N/A"}`
            : "Negotiable",
      location: (() => {
        const locations = Array.isArray(job.work_location)
          ? job.work_location.join(", ")
          : "";

        return `${job.workplace_type}${locations ? ` • ${locations}` : ""}`;
      })(),
      diversity_hiring: job.diversity_hiring || [],
      job_category: job.job_category,
      type: job.job_nature,
      openings: job.openings,
      benefits: job.benefits || [],
      skills: job.skills || [],
      eligibility: job.experience_required?.join(", "),
      status: daysLeft >= 0 ? "Live" : "Expired",
      // keeping questions mapping harmlessly, though not used in UI now
      questions: safeQs.map((q) => q?.question || ""),
      questions_with_ids: safeQs.map((q) => ({
        id: q?.id || null,
        question: q?.question || "",
        isrequired: !!q?.isrequired,
      })),
    };
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await getJobPosts(payload);
      let raw = res?.data?.data?.data || [];

      if (selectedUserType) {
        const filterKey = selectedUserType.toLowerCase();
        raw = raw.filter((j) =>
          (j.experience_type || "").toLowerCase().includes(filterKey)
        );
      }

      const list = raw.map(transformJob);
      setJobs(list);
      setActiveJob(list[0] || null);
    } catch (err) {
      console.error("Fetch jobs error:", err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  /** -------------------- SIDEBAR FILTER UI (UNCHANGED) -------------------- **/
  const FilterSidebar = (
    <div className="filter_box premium-filter-sidebar">
      {/* Header */}
      <div className="filter-header">
        <h3 className="filter-main-title">
          <BiCategoryAlt className="filter-title-icon" />
          Filters
        </h3>
        <div className="filter-count">
          {[
            selectedCategories.length,
            selectedTypes.length,
            selectedLocations.length,
            selectedWorkingDays ? 1 : 0,
            selectedStatus ? 1 : 0,
            selectedSort ? 1 : 0,
            selectedUserType ? 1 : 0,
            jobNatureSelected ? 1 : 0,
          ].reduce((a, b) => a + b, 0)}{" "}
          active filter
        </div>
      </div>


      {/* Reset Button */}
      <Button
        className="premium-reset-btn"
        onClick={() => {
          setSelectedCategories([]);
          setSelectedTypes([]);
          setSelectedLocations([]);
          setSelectedWorkingDays("");
          setSelectedStatus("");
          setSelectedSort(null);
          setSelectedUserType("");
          setJobNatureSelected("");
          const params = new URLSearchParams(location.search);
          params.delete("filter");
          params.delete("category");
          navigate(
            { pathname: location.pathname, search: params.toString() ? `?${params}` : "" },
            { replace: true }
          );
        }}
        icon={<RefreshCcwIcon size={17} />}
      >
        Reset All Filters
      </Button>

      {/* Post Type */}
      <div className="filter_group premium-filter-group">
        <div className="filter-header-group">
          <h4 className="filter_title">
            <CrownFilled className="filter-icon" />
            Post Type
          </h4>
          {jobNatureSelected && (
            <span
              className="clear-filter"
              onClick={() => {
                setJobNatureSelected("");
                const params = new URLSearchParams(location.search);
                params.delete("filter");
                navigate(
                  {
                    pathname: location.pathname,
                    search: params.toString() ? `?${params}` : "",
                  },
                  { replace: true }
                );
              }}
            >
              Clear
            </span>
          )}
        </div>
        <Radio.Group
          value={jobNatureSelected}
          onChange={(e) => {
            const v = e.target.value;
            setJobNatureSelected(v);
            const params = new URLSearchParams(location.search);
            if (v) params.set("filter", v);
            else params.delete("filter");
            navigate(
              {
                pathname: location.pathname,
                search: params.toString() ? `?${params}` : "",
              },
              { replace: true }
            );
          }}
          className="filter_radio premium-radio-group"
        >
          {jobNature.map((t) => (
            <Radio key={t} value={t} className="premium-radio">
              <span className="radio-label">{t}</span>
            </Radio>
          ))}
        </Radio.Group>
      </div>

      {/* Salary */}
      <div className="filter_group premium-filter-group salary_filter_group">
        <div className="filter-header-group">
          <h4 className="filter_title">
            <ThunderboltFilled className="filter-icon" />
            Salary
          </h4>
          {selectedSort && (
            <span className="clear-filter" onClick={() => setSelectedSort(null)}>
              Clear
            </span>
          )}
        </div>
        <CommonSelectField
          placeholder="Select Salary Range"
          value={selectedSort}
          onChange={setSelectedSort}
          options={[
            { label: "💰 High to Low", value: "highToLow" },
            { label: "💸 Low to High", value: "lowToHigh" },
          ]}
          className="premium-select"
        />
      </div>

      {/* Status */}
      <div className="filter_group premium-filter-group">
        <div className="filter-header-group">
          <h4 className="filter_title">
            <CheckCircle className="filter-icon" />
            Status
          </h4>
          {selectedStatus && (
            <span className="clear-filter" onClick={() => setSelectedStatus("")}>
              Clear
            </span>
          )}
        </div>
        <Radio.Group
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="filter_radio premium-radio-group"
        >
          <Radio value="Live" className="premium-radio">
            <span className="radio-label status-live">🟢 Live</span>
          </Radio>
          <Radio value="Expired" className="premium-radio">
            <span className="radio-label status-expired">🔴 Expired</span>
          </Radio>
        </Radio.Group>
      </div>

      {/* Working Days */}
      {jobNatureSelected !== "Scholarship" && (
        <div className="filter_group premium-filter-group">
          <div className="filter-header-group">
            <h4 className="filter_title">
              <LuCalendarDays className="filter-icon" />
              Working Days
            </h4>
            {selectedWorkingDays && (
              <span className="clear-filter" onClick={() => setSelectedWorkingDays("")}>
                Clear
              </span>
            )}
          </div>
          <Radio.Group
            value={selectedWorkingDays}
            onChange={(e) => setSelectedWorkingDays(e.target.value)}
            className="filter_radio premium-radio-group"
          >
            <Radio value="5 Working days" className="premium-radio">
              <span className="radio-label">5 Days/Week</span>
            </Radio>
            <Radio value="6 Working days" className="premium-radio">
              <span className="radio-label">6 Days/Week</span>
            </Radio>
          </Radio.Group>
        </div>
      )}

      {/* Location */}
      {jobNatureSelected !== "Scholarship" && (
        <div className="filter_group premium-filter-group salary_filter_group">
          <div className="filter-header-group">
            <h4 className="filter_title">
              <FaMapMarkerAlt className="filter-icon" />
              Location
            </h4>
            {selectedLocations.length > 0 && (
              <span className="clear-filter" onClick={() => setSelectedLocations([])}>
                Clear
              </span>
            )}
          </div>
          <CommonSelectField
            mode="multiple"
            allowClear
            showSearch
            placeholder="🌍 Search locations..."
            value={selectedLocations}
            onChange={setSelectedLocations}
            options={allCities}
            optionLabelProp="label"
            optionFilterProp="label"
            className="premium-select multi-select"
          />
        </div>
      )}

      {/* Work Type */}
      {jobNatureSelected !== "Scholarship" && (
        <div className="filter_group premium-filter-group">
          <div className="filter-header-group">
            <h4 className="filter_title">
              <CgWorkAlt className="filter-icon" />
              Work Type
            </h4>
            {selectedTypes.length > 0 && (
              <span className="clear-filter" onClick={() => setSelectedTypes([])}>
                Clear
              </span>
            )}
          </div>
          <Checkbox.Group
            value={selectedTypes}
            onChange={setSelectedTypes}
            className="filter_checkbox premium-checkbox-group"
          >
            {workTypes.map((t) => (
              <Checkbox key={t} value={t} className="premium-checkbox">
                <span className="checkbox-label">
                  {t === "Work From Home"}
                  {t === "In Office"}
                  {t === "On Field"}
                  {t}
                </span>
              </Checkbox>
            ))}
          </Checkbox.Group>
        </div>
      )}

      {/* User Type */}
      <div className="filter_group premium-filter-group">
        <div className="filter-header-group">
          <h4 className="filter_title">
            <FiUser className="filter-icon" />
            User Type
          </h4>
          {selectedUserType && (
            <span className="clear-filter" onClick={() => setSelectedUserType("")}>
              Clear
            </span>
          )}
        </div>
        <Radio.Group
          value={selectedUserType}
          onChange={(e) => setSelectedUserType(e.target.value)}
          className="filter_radio premium-radio-group"
        >
          <Radio value="Fresher" className="premium-radio">
            <span className="radio-label">Fresher</span>
          </Radio>
          <Radio value="Experienced" className="premium-radio">
            <span className="radio-label">Experienced</span>
          </Radio>
          <Radio value="College Students" className="premium-radio">
            <span className="radio-label">College Students</span>
          </Radio>
        </Radio.Group>
      </div>

      {/* Category */}
      {/* Category */}
      <div className="filter_group premium-filter-group">
        <div className="filter-header-group">
          <h4 className="filter_title">
            <BiCategoryAlt className="filter-icon" />
            Category
          </h4>
          {selectedCategories.length > 0 && (
            <span className="clear-filter" onClick={() => setSelectedCategories([])}>
              Clear
            </span>
          )}
        </div>

        {/* ✅ Search field above category list */}
        <input
          type="text"
          value={categorySearch}
          onChange={(e) => setCategorySearch(e.target.value)}
          placeholder="🔍 Search categories..."
          className="category-search-input"
        />
        {selectedCategories.length > 0 && (
          <div style={{ marginBottom: 10, display: "flex", gap: 5 }} className="selected-tags">
            {selectedCategories.slice(0, 3).map((category) => (
              <span key={category} className="selected-tag">
                {category}
              </span>
            ))}
            {selectedCategories.length > 3 && (
              <span className="selected-tag-more">
                +{selectedCategories.length - 3} more
              </span>
            )}
          </div>
        )}
        {/* ✅ Checkbox list (filtered) */}
        <Checkbox.Group
          value={selectedCategories}
          onChange={setSelectedCategories}
          className="filter_checkbox premium-checkbox-group category-group"
          options={filteredCategoryOptions}
        />
      </div>
    </div>
  );

  /** -------------------- JOB CARD (BRAND NEW UNIQUE CLASSES) -------------------- **/
  const JobCard = ({ job }) => (
    <Card
      className={`cf4-card-wrapper ${activeJob?.id === job.id ? "cf4-active" : ""}`}
      onClick={() => setActiveJob(job)}
      hoverable
    >
      <div onClick={() => {
        const jobTitleSlug = generateSlug(job.title);
        const companySlug = generateSlug(job.company);

        let basePath = "";

        if (job.type === "Job") {
          basePath = "/job-details";
        } else if (job.type === "Internship") {
          basePath = "/internship-details";
        } else if (job.type === "Scholarship") {
          basePath = "/scholarship-details";
        }

        const finalUrl = `${basePath}/${jobTitleSlug}-${companySlug}-${job.id}`;
        navigate(finalUrl);
      }} className="cf4-card-inner">

        {/* Floating badge */}
        <div className={`cf4-status-badge 
      ${job.status === "Expired" ? "cf4-expired-tag" : job.status === "Live" ? "cf4-active-tag" : ""}`
        }>
          {job.status}
        </div>

        {/* Top Section */}
        <div className="cf4-header">
          <div className="cf4-logo-box">
            <img src={job.logo} alt={job.company} className="cf4-logo" />
          </div>

          <div className="cf4-title-box">
            <h3 className="cf4-title">{job.title}</h3>
            <p className="cf4-company">({job.company})</p>
          </div>
        </div>

        {/* Meta Info */}
        <div className="cf4-meta">
          <span className="cf4-meta-item">
            <ClockCircleOutlined /> {job.daysLeft}
          </span>

          {job.type !== "Scholarship" && (
            <span className="cf4-meta-item">
              <FaMapMarkerAlt /> {job.location}
            </span>
          )}

          <span className="cf4-meta-item">{job.salary}</span>
        </div>

        {/* Floating Skills */}
        {job.type !== "Scholarship" && (
          <div className="cf4-skill-container">
            {job.skills.slice(0, 6).map((s, i) => (
              <span key={i} className="cf4-skill-chip">
                {s}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="cf4-footer">
          <span className="cf4-level-chip">
            {job.level}
          </span>

          <span
            className={`cf4-type-badge ${job.type === "Job"
              ? "cf4-type-job"
              : job.type === "Internship"
                ? "cf4-type-intern"
                : "cf4-type-scholar"
              }`}
          >
            {job.type}
          </span>
        </div>
      </div>
    </Card>
  );


  /** -------------------- RENDER -------------------- **/
  return (
    <>
      <Header />

      {/* Mobile filter trigger reserved (kept hidden) */}
      <div className="details_page" style={{ padding: "20px 16px 0 16px" }}>
        <div className="job-filter-top-actions" style={{ display: "none" }} />
        <Button
          className="apply_filter"
          type="primary"
          onClick={() => setMobileFilterOpen(true)}
          style={{ display: "none" }}
        >
          Open Filters
        </Button>
      </div>

      <section
        className="job_filter"
        style={{
          padding: "16px 24px 48px",
          background: "linear-gradient(135deg, rgb(247 247 247) 0%, rgb(244 238 255) 100%)",
        }}
      >
        <Row gutter={24}>
          {/* Left Sidebar */}
          <Col xs={0} md={7} lg={6} className="filter_sidebar">
            {FilterSidebar}
          </Col>

          {/* Right Content - Job list only (details removed) */}
          <Col xs={24} md={17} lg={18}>
            {loading ? (
              <Space direction="vertical" size={24} style={{ width: "100%" }}>
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} active />
                ))}
              </Space>
            ) : jobs.length === 0 ? (
              <Card style={{ borderRadius: 12 }}>
                <Empty
                  image={require("../images/job_search.jpeg")}
                  imageStyle={{ height: 300 }}
                  description={<span>We couldn’t find any opportunities that match your filters.</span>}
                >
                  <Button
                    style={{ background: "linear-gradient(135deg, #7f5af0 0%, #5f2eea 100%)" }}
                    type="primary"
                    shape="round"
                    onClick={() => {
                      setSelectedCategories([]);
                      setSelectedTypes([]);
                      setSelectedLocations([]);
                      setSelectedWorkingDays("");
                      setSelectedStatus("");
                      setSelectedSort(null);
                      setSelectedUserType("");
                      setJobNatureSelected("");
                      fetchJobs();
                    }}
                  >
                    Explore All Opportunities
                  </Button>
                </Empty>
              </Card>
            ) : (
              <Row gutter={24}>
                {/* ✅ Row 2 — Your Job Cards */}
                <Col xs={0} md={7} lg={16}>
                  <div className="cf4-job-list-wrapper">
                    {jobs.map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </div>
                </Col>
                <Col xs={0} md={7} lg={8}>
                  {/* ✅ Row 3 — Courses */}
                  <div className="cf4-course-box">
                    <h3 className="cf4-section-title">Recommended Courses</h3>

                    {courses.length === 0 ? (
                      <Skeleton active />
                    ) : (
                      <div className="cf4-course-list">
                        {courses.slice(0, 5).map((course) => (
                          <div
                            key={course.id}
                            className="cf4-course-item"
                            onClick={() => {
                              if (course.link?.startsWith("http")) {
                                window.open(course.link, "_blank");
                              } else {
                                navigate(`/course/${course.id}`);
                              }
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            <img
                              src={course.image}
                              alt={course.title}
                              className="cf4-course-thumb"
                            />
                            <div className="cf4-course-info">
                              <h4 className="cf4-course-title">{course.title}</h4>
                              <p className="cf4-course-desc">
                                {course.description?.slice(0, 70)}...
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Col>
              </Row>

            )}
          </Col>
        </Row>
      </section>

      {/* Mobile Filters Drawer */}
      <Drawer
        width={320}
        title="Filters"
        onClose={() => setMobileFilterOpen(false)}
        open={mobileFilterOpen}
        className="header-drawer"
      >
        {FilterSidebar}
      </Drawer>
    </>
  );
}
