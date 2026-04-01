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
import { useLocation, useNavigate, useParams } from "react-router-dom";

import Header from "../Header/Header";
import Footer from "../Footer/Footer";
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

// Helper function to convert currency code to symbol
const getCurrencySymbol = (currencyCode) => {
  const currencyMap = {
    'INR': '₹',
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'JPY': '¥',
    'AUD': 'A$',
    'CAD': 'C$',
  };
  return currencyMap[currencyCode] || currencyCode;
};

const workTypes = ["In Office", "On Field", "Work From Home"];
const jobNature = ["Job", "Internship", "Scholarship"];

export default function JobFilter() {
  const navigate = useNavigate();
  const location = useLocation();
  const { filterSlug } = useParams();
  const [courses, setCourses] = useState([]);
  const [categorySearch, setCategorySearch] = useState("");
  const lastSlugRef = React.useRef(""); // Track the last filterSlug for reset logic
  /** -------------------- STATE -------------------- **/
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Data
  const [jobs, setJobs] = useState([]);
  const [activeJob, setActiveJob] = useState(null);
  const fetchRequestId = React.useRef(0);
  const skipUrlSyncRef = React.useRef(false);
  const [jobCategoryOptions, setJobCategoryOptions] = useState([]);

  // Pagination
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);

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

        backend.sort((a, b) =>
          String(a.label).localeCompare(String(b.label), "en", { sensitivity: "base" })
        );

        setJobCategoryOptions(backend);
      } catch {
        // silent
      }
    })();
  }, []);

  // 1. URL --> State (Standardized parsing)
  useEffect(() => {
    if (skipUrlSyncRef.current) {
      skipUrlSyncRef.current = false;
      return;
    }
    let nature = "Job";
    let locations = [];
    let categories = [];
    let types = [];
    let userType = "";

    // Parse Nature
    if (location.pathname.includes("/internship")) nature = "Internship";
    else if (location.pathname.includes("/scholarship")) nature = "Scholarship";

    // Parse Slug
    if (filterSlug) {
      const cityMap = {
        "bangalore": "Bangalore", "delhi": "Delhi", "hyderabad": "Hyderabad",
        "gurgaon": "Gurgaon", "kolkata": "Kolkata", "mumbai": "Mumbai", "chennai": "Chennai"
      };

      if (filterSlug === "work-from-home") {
        types = ["Work From Home"];
      } else if (cityMap[filterSlug.toLowerCase()]) {
        // Direct city slug: /jobs/bangalore → Bangalore
        const cityVal = allCities.find(c => c.value.toLowerCase() === filterSlug.toLowerCase())?.value || cityMap[filterSlug.toLowerCase()];
        if (cityVal) locations = [cityVal];
      } else if (filterSlug.includes("-in-")) {
        // Legacy slug: /jobs/jobs-in-bangalore → Bangalore
        const parts = filterSlug.split("-in-");
        const cityKey = parts[parts.length - 1];
        const cityVal = allCities.find(c => c.value.toLowerCase() === cityKey)?.value || cityMap[cityKey];
        if (cityVal) locations = [cityVal];
      } else if (filterSlug.includes("fresher")) {
        userType = "Fresher";
        if (filterSlug.includes("-in-")) {
          const cityKey = filterSlug.split("-in-")[1];
          const cityVal = allCities.find(c => c.value.toLowerCase() === cityKey)?.value || cityMap[cityKey];
          if (cityVal) locations = [cityVal];
        } else if (filterSlug.includes("work-from-home")) {
          types = ["Work From Home"];
        }
      } else if (filterSlug.endsWith("-jobs")) {
        const catKey = filterSlug.replace("-jobs", "");
        if (catKey === "it") categories = ["IT & Software"];
        else if (catKey === "fresher") userType = "Fresher";
        else if (catKey === "full-stack-development") categories = ["Full Stack", "Full Stack Development"];
        else if (catKey === "devops-cloud-computing") categories = ["DevOps", "DevOps & Cloud Computing"];
        else if (catKey === "data-science-analytics") categories = ["Data Science", "Data Science & Analytics"];
        else if (catKey === "frontend-development") categories = ["Frontend", "Frontend Development"];
        else if (catKey === "hr-analytics") categories = ["HR Analytics"];
        else if (catKey === "software-development") categories = ["Software Development"];
        else if (catKey === "ui-ux-design") categories = ["UI / UX", "UI/UX Design"];
        else {
          const matched = jobCategoryOptions.find(c => generateSlug(c.value) === catKey);
          if (matched) categories = [matched.value];
        }
      } else {
        // Try matching as a city from the full cities list
        const cityVal = allCities.find(c => c.value.toLowerCase() === filterSlug.toLowerCase())?.value;
        if (cityVal) locations = [cityVal];
      }
    }

    // Apply only if changed or on initial load
    const isFirstTime = lastSlugRef.current === "";
    const urlChanged = lastSlugRef.current !== (filterSlug || location.pathname);

    if (isFirstTime || urlChanged) {
      setJobNatureSelected(nature);
      setSelectedLocations(locations);
      setSelectedCategories(categories);
      setSelectedTypes(types);
      if (userType) setSelectedUserType(userType);
      
      // Reset deep filters on first load or nature change
      if (isFirstTime || lastSlugRef.current.split("/")[1] !== location.pathname.split("/")[1]) {
        setSelectedStatus("");
        setSelectedWorkingDays("");
        setSelectedSort(null);
      }
      lastSlugRef.current = filterSlug || location.pathname;
    }
  }, [filterSlug, location.pathname, allCities, jobCategoryOptions]);

  // 2. State --> URL Sync
  const syncFilterUrl = (overrides = {}) => {
    const nature = overrides.hasOwnProperty('nature') ? overrides.nature : jobNatureSelected;
    const locations = overrides.hasOwnProperty('locations') ? overrides.locations : selectedLocations;
    const categories = overrides.hasOwnProperty('categories') ? overrides.categories : selectedCategories;
    const types = overrides.hasOwnProperty('types') ? overrides.types : selectedTypes;
    const userType = overrides.hasOwnProperty('userType') ? overrides.userType : selectedUserType;

    // Default to "Job" if nature is empty (so URL still works)
    const effectiveNature = nature || "Job";
    const baseMap = { "Job": "jobs", "Internship": "internship", "Scholarship": "scholarship" };
    const base = baseMap[effectiveNature] || "jobs";
    
    let slug = "";
    const topCities = ["Bangalore", "Delhi", "Hyderabad", "Gurgaon", "Kolkata", "Mumbai", "Chennai"];

    if (userType === "Fresher") {
      if (locations.length === 1 && topCities.includes(locations[0])) {
        slug = `fresher-jobs-in-${generateSlug(locations[0])}`;
      } else {
        slug = "fresher-jobs";
      }
    } else if (userType === "Experienced") {
      slug = "experienced-jobs";
    } else if (userType === "College Students") {
      slug = "college-students-jobs";
    } else if (types.includes("Work From Home")) {
      slug = "work-from-home";
    } else if (locations.length === 1 && topCities.includes(locations[0])) {
      slug = generateSlug(locations[0]);
    } else if (categories.length === 1) {
      slug = `${generateSlug(categories[0])}-jobs`;
    }
    
    if (slug) {
      if (location.pathname !== `/${base}/${slug}`) {
        skipUrlSyncRef.current = true;
        navigate(`/${base}/${slug}`, { replace: true });
      }
    } else {
      if (location.pathname !== `/${base}`) {
        skipUrlSyncRef.current = true;
        navigate(`/${base}`, { replace: true });
      }
    }
  };

  // Fetch jobs when filters change (reset to page 1)
  useEffect(() => {
    if (!jobNatureSelected) return;
    setPage(1);
    setJobs([]);
    fetchJobs(1, true);
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


  // Infinite scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (loadingMore || !hasMore) return;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;

      // Trigger when user is 300px from bottom
      if (scrollTop + clientHeight >= scrollHeight - 300) {
        loadMoreJobs();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingMore, hasMore, page]);

  /** -------------------- HELPERS -------------------- **/
  function jobNatureOptionsToKey(opts) {
    return opts.map((o) => o.value).join("|");
  }

  const payload = useMemo(
    () => {
      const p = {};
      if (selectedCategories.length > 0) p.job_categories = selectedCategories;
      if (selectedTypes.length > 0) p.workplace_type = selectedTypes;
      // NOTE: work_location is filtered client-side to avoid production backend JSON_CONTAINS crash
      if (selectedWorkingDays) p.working_days = selectedWorkingDays;
      if (selectedStatus) p.status = selectedStatus;
      if (jobNatureSelected) p.job_nature = jobNatureSelected;
      if (selectedSort === "highToLow") p.salary_sort = "high_to_low";
      else if (selectedSort === "lowToHigh") p.salary_sort = "low_to_high";
      return p;
    },
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
          ? `${getCurrencySymbol(job.currency)}${job.min_salary || "N/A"} LPA`
          : job.salary_type === "Range"
            ? `${getCurrencySymbol(job.currency)}${job.min_salary || "N/A"} - ${job.max_salary || "N/A"} LPA`
            : "Negotiable",
      location: Array.isArray(job.work_location) ? job.work_location.join(", ") : job.work_location,
      diversity_hiring: job.diversity_hiring || [],
      job_category: job.job_category,
      type: job.job_nature,
      openings: job.openings,
      benefits: job.benefits || [],
      skills: job.skills || [],
      eligibility: job.experience_required?.join(", "),
      status: daysLeft >= 0 ? "Live" : "Expired",
      // keeping questions mapping harmlessly, though not used in UI now
      raw_location: job.work_location,
      raw_workplace_type: job.workplace_type,
      raw_experience_required: job.experience_required,
      questions: safeQs.map((q) => q?.question || ""),
      questions_with_ids: safeQs.map((q) => ({
        id: q?.id || null,
        question: q?.question || "",
        isrequired: !!q?.isrequired,
      })),
    };
  };

  const fetchJobs = async (passedPage = 1, isReset = false) => {
    if (isReset) {
      setLoading(true);
      setJobs([]);
      setPage(1);
    } else {
      setLoadingMore(true);
    }

    const requestId = ++fetchRequestId.current;
    
    try {
      let aggregatedList = [];
      let currentPage = passedPage;
      let hasMoreOnBackend = true;
      let meta = {};
      let attempts = 0;
      // Only these filters are NOT handled by the backend correctly (location filter is broken on production backend)
      const isFrontendFilteringRequired = selectedLocations.length > 0 || !!selectedUserType;

      // Aggregation Loop for Initial Filter Results or Loading More
      // When filtering client-side, we scan multiple pages to provide a "Single Load" experience with a better count.
      while (true) {
        const paginatedPayload = {
          ...payload,
          page: currentPage,
          limit: 20,
        };

        const res = await getJobPosts(paginatedPayload);
        if (requestId !== fetchRequestId.current) return;

        let raw = res?.data?.data?.data || [];
        meta = res?.data?.data?.meta || {};
        hasMoreOnBackend = meta.hasMore || false;

        // NOTE: We trust the backend for job_nature, categories, workplace_type, status, etc.
        // We only apply client-side filters for things the backend doesn't handle (locations, experience_type).

        if (selectedLocations.length > 0) {
          raw = raw.filter((j) => {
            const jobLocs = Array.isArray(j.work_location)
              ? j.work_location
              : typeof j.work_location === "string"
                ? (() => { try { return JSON.parse(j.work_location); } catch { return [j.work_location]; } })()
                : [];
            return selectedLocations.some((sel) =>
              jobLocs.some((loc) => {
                const l = String(loc).toLowerCase();
                const s = String(sel).toLowerCase();
                return l === s || l.includes(`${s},`) || l.includes(`, ${s}`) || l.startsWith(`${s}-`) || l.includes(`- ${s}`);
              })
            );
          });
        }

        if (selectedUserType) {
          const filterKey = selectedUserType.toLowerCase();
          raw = raw.filter((j) => (j.experience_type || "").toLowerCase().includes(filterKey));
        }

        // Backend payload handles workplace_type and categories, so we skip redundant client-filtering here.

        const currentBatchList = raw.map(transformJob);
        aggregatedList = [...aggregatedList, ...currentBatchList];

        // Break logic:
        // 1. If not client filtering, just take 1 page.
        // 2. If we found at least 15 jobs, that's a good "Single Load" batch.
        // 3. If we've scanned 5 pages and haven't hit 15, stop anyway to avoid long wait.
        // 4. If there's no more data on backend, stop.
        attempts++;
        if (!isFrontendFilteringRequired || aggregatedList.length >= 15 || attempts >= 5 || !hasMoreOnBackend) {
          break;
        }
        currentPage++;
      }

      setPage(currentPage);
      setHasMore(hasMoreOnBackend);

      if (isReset) {
        setJobs(aggregatedList);
        setActiveJob(aggregatedList[0] || null);
        // Use backend total if we didn't filter the list client-side, otherwise use the aggregated count
        setTotalJobs(isFrontendFilteringRequired ? aggregatedList.length : (meta.total || aggregatedList.length));
      } else {
        setJobs((prevJobs) => {
          const combined = [...prevJobs, ...aggregatedList];
          if (isFrontendFilteringRequired) setTotalJobs(combined.length);
          return combined;
        });
      }

      if (!isFrontendFilteringRequired) {
        setTotalJobs(meta.total || aggregatedList.length);
      }

    } catch (err) {
      console.error("Fetch jobs error:", err);
      if (isReset) setJobs([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreJobs = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchJobs(nextPage, false);
    }
  };

  const getFilterTitle = () => {
    const natureSuffix = jobNatureSelected === "Job" ? "Jobs" : jobNatureSelected === "Internship" ? "Internships" : jobNatureSelected === "Scholarship" ? "Scholarships" : "Opportunities";
    
    // Slug based titles
    if (filterSlug) {
      if (filterSlug === "work-from-home") return `Work From Home ${natureSuffix}`;
      if (filterSlug.includes("bangalore")) return `${natureSuffix} in Bangalore`;
      if (filterSlug.includes("delhi")) return `${natureSuffix} in Delhi`;
      if (filterSlug.includes("hyderabad")) return `${natureSuffix} in Hyderabad`;
      if (filterSlug.includes("gurgaon")) return `${natureSuffix} in Gurgaon`;
      if (filterSlug.includes("kolkata")) return `${natureSuffix} in Kolkata`;
      if (filterSlug.includes("mumbai")) return `${natureSuffix} in Mumbai`;
      if (filterSlug.includes("chennai")) return `${natureSuffix} in Chennai`;
      if (filterSlug === "it-jobs") return `IT & Software ${natureSuffix}`;
      if (filterSlug === "marketing-jobs") return `Marketing ${natureSuffix}`;
      if (filterSlug === "fresher-jobs") return `Fresher ${natureSuffix}`;
    }
    
    // State based fallbacks
    if (selectedLocations.length === 1) return `${natureSuffix} in ${selectedLocations[0]}`;
    if (selectedCategories.length === 1) return `${selectedCategories[0]} ${natureSuffix}`;
    if (jobNatureSelected) {
      const plural = jobNatureSelected === "Job" ? "Jobs" : jobNatureSelected === "Internship" ? "Internships" : "Scholarships";
      let title = `${jobNatureSelected} Opportunities`;
      if (selectedLocations.length === 1) {
        title += ` in ${selectedLocations[0]}`;
      }
      return title;
    }
    
    return `Latest ${natureSuffix}`;
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
          // setJobNatureSelected("Job"); // REMOVED - maintain current nature
          const baseMap = { "Job": "jobs", "Internship": "internship", "Scholarship": "scholarship" };
          const base = baseMap[jobNatureSelected] || "jobs";
          navigate(`/${base}`, { replace: true });
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
                setJobNatureSelected("Job");
                syncFilterUrl({ nature: "Job", locations: [], categories: [], types: [], userType: "" });
              }}
            >
              Clear
            </span>
          )}
        </div>
        <Radio.Group
          value={jobNatureSelected}
          onChange={(e) => {
            setJobNatureSelected(e.target.value);
            syncFilterUrl({ nature: e.target.value });
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
            <span className="clear-filter" onClick={() => { setSelectedSort(null); }}>
              Clear
            </span>
          )}
        </div>
        <CommonSelectField
          placeholder="Select Salary Range"
          value={selectedSort}
          onChange={(v) => { setSelectedSort(v); syncFilterUrl(); }}
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
            <span className="clear-filter" onClick={() => { setSelectedStatus(""); }}>
              Clear
            </span>
          )}
        </div>
        <Radio.Group
          value={selectedStatus}
          onChange={(e) => { setSelectedStatus(e.target.value); syncFilterUrl(); }}
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
              <span className="clear-filter" onClick={() => { setSelectedWorkingDays(""); }}>
                Clear
              </span>
            )}
          </div>
          <Radio.Group
            value={selectedWorkingDays}
            onChange={(e) => { setSelectedWorkingDays(e.target.value); syncFilterUrl(); }}
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
              <span className="clear-filter" onClick={() => { setSelectedLocations([]); syncFilterUrl({ locations: [] }); }}>
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
            onChange={(v) => { setSelectedLocations(v); syncFilterUrl({ locations: v }); }}
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
              <span className="clear-filter" onClick={() => { setSelectedTypes([]); syncFilterUrl({ types: [] }); }}>
                Clear
              </span>
            )}
          </div>
          <Checkbox.Group
            value={selectedTypes}
            onChange={(v) => { setSelectedTypes(v); syncFilterUrl({ types: v }); }}
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
            <span className="clear-filter" onClick={() => { setSelectedUserType(""); syncFilterUrl({ userType: "" }); }}>
              Clear
            </span>
          )}
        </div>
        <Radio.Group
          value={selectedUserType}
          onChange={(e) => { setSelectedUserType(e.target.value); syncFilterUrl({ userType: e.target.value }); }}
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
            <span className="clear-filter" onClick={() => { setSelectedCategories([]); syncFilterUrl({ categories: [] }); }}>
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
          onChange={(v) => { setSelectedCategories(v); syncFilterUrl({ categories: v }); }}
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

        const jobNature = generateSlug(job.type || "");
        const jobTitle = generateSlug(job.title || "");
        const companyName = generateSlug(job.company || "");
        const locationSlug = safeSlug(job.raw_location);
        const workplaceType = generateSlug(job.raw_workplace_type || "");
        const experienceType = generateSlug(job.level || "");
        const experienceRequired = safeSlug(job.raw_experience_required);

        let basePath = "";

        if (job.type === "Job") {
          basePath = "/job-details";
        } else if (job.type === "Internship") {
          basePath = "/internship-details";
        } else if (job.type === "Scholarship") {
          basePath = "/scholarship-details";
        }

        const finalUrl = `${basePath}/${jobNature}-${jobTitle}-${companyName}-${locationSlug}-${workplaceType}-${experienceType}-${experienceRequired}-${job.id}`;
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
        <Row gutter={24} justify="center">
          {/* Left Sidebar */}
          <Col xs={0} md={7} lg={6} className="filter_sidebar">
            {FilterSidebar}
          </Col>

          {/* Right Content */}
          <Col xs={24} md={17} lg={14}>
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
                      // setJobNatureSelected("Job"); // REMOVED - maintain current nature
                      const baseMap = { "Job": "jobs", "Internship": "internship", "Scholarship": "scholarship" };
                      const base = baseMap[jobNatureSelected] || "jobs";
                      navigate(`/${base}`, { replace: true });
                    }}
                  >
                    Explore All Opportunities
                  </Button>
                </Empty>
              </Card>
            ) : (
              <div className="filter-results-container">
                <div className="filter-results-header premium-results-header">
                  <h2 className="results-title">{totalJobs} {getFilterTitle()}</h2>
                  <p className="results-subtitle">
                    {selectedLocations.length === 1 
                      ? `Search for ${selectedLocations[0]} Jobs and Apply to Latest Vacancies in ${selectedLocations[0]}` 
                      : "Browse all latest jobs and internships across leading companies in India"}
                  </p>
                </div>
                <div className="cf4-job-list-wrapper">
                  {jobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}

                  {/* Loading more indicator */}
                  {loadingMore && (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                      <Skeleton active />
                    </div>
                  )}

                  {/* End of results message */}
                  {!hasMore && jobs.length > 0 && (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                      <p>You've reached the end of the results ({totalJobs} total jobs)</p>
                    </div>
                  )}
                </div>
              </div>
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

      <Footer />
    </>
  );
}
