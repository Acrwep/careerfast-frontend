import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "../Login/Login";
import About from "../About/About";
import ProfileDetails from "../ProfileDetails/ProfileDetails";
import RegisterPage from "../Register/RegisterPage";
import JobPortalLandingPage from "../JobPortal/LandingPage";
import InternshipLandingPage from "../InternshipPortal/LandingPage";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import PostJobs from "../JobPortal/PostJobs";
import JobFilter from "../JobPortal/JobFilter";
import JobDetails from "../JobPortal/JobDetails";
import AdminProfile from "../Profile/AdminProfile";
import NotFound from "../NotFound/NotFound";
import MainProfile from "../Profile/MainProfile";
import WatchList from "../Profile/WatchList";
import Dummy from "../ProfileDetails/Dummy";
import Settings from "../Profile/Settings";
import BookMark from "../Profile/BookMark";
import RecentlyViewed from "../Profile/RecentlyViewed";
import Listing from "../Profile/Listing";
import AccountSettings from "../Profile/AccountSettings";
import ProSubscription from "../Profile/ProSubscription";
import AdminDashboard from "../AdminDashboard/AdminDashboard";
import ManageCandidate from "../AdminDashboard/ManageCandidate";
import EditOpportunity from "../AdminDashboard/EditOpportunity";
import RegistrationChart from "../AdminDashboard/RegistrationChart";
import ManageNotification from "../AdminDashboard/ManageNotification";
import { useDispatch } from "react-redux";
import { storeLoginStatus } from "../Redux/Slice";
import Location from "../JobPortal/Location";
import AllRegisteredCandidates from "../AllRegisteredCandidates/AllRegisteredCandidates";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import AllAppliedCandidates from "../AdminDashboard/AllAppliedCandidates";
import PostEvents from "../PostEvents/PostEvents";
import EventFilter from "../JobPortal/EventFilter";
import PostWorkShop from "../PostWorkShop/PostWorkShop";
import WorkshopFilter from "../JobPortal/WorkshopFilter";
import Courses from "../Courses/Courses";
import PostCourses from "../Courses/PostCourses";
import AddBlogs from "../Blogs/AddBlogs";
import BlogSingle from "../Blogs/BlogSingle";
import Blogs from "../Blogs/Blogs";
import MentorList from "../Mentors/MentorList";
import MentorDetails from "../Mentors/MentorDetails";
import CompetitionsLandingPage from "../Competitions/CompetitionsLandingPage";

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [roleId, setRoleId] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("loginDetails");
      if (stored) {
        const loginDetails = JSON.parse(stored);
        setRoleId(loginDetails.role_id);
      }
      console.log("stored", stored);
    } catch (error) {
      console.error("Invalid JSON in localStorage", error);
    }
  }, []);


  useEffect(() => {
    const handleTokenExpire = () => {
      navigate("/login");
    };

    window.addEventListener("tokenExpireUpdated", handleTokenExpire);

    // Initial load
    // handleTokenExpire();

    return () => {
      window.removeEventListener("tokenExpireUpdated", handleTokenExpire);
    };
  }, []);

  useEffect(() => {
    const AccessToken = localStorage.getItem("AccessToken");
    const pathName = location.pathname.split("/")[1];

    console.log("pathname", pathName);
    if (AccessToken) {
      dispatch(storeLoginStatus(true));

      // No redirect for root path
      if (pathName === "" || pathName === "/") {
        return;
      }

      if (
        pathName.includes("job-details") ||
        pathName.includes("internship-details") ||
        pathName.includes("scholarship-details") ||
        pathName.includes("admin-dashboard") ||
        pathName.includes("edit-opportunity") ||
        pathName.includes("blog") ||
        pathName.includes("course") ||
        pathName.includes("mentor") ||
        pathName.includes("competitions") ||
        pathName.includes("admin-profile")
      ) {
        return;
      }

      // ✅ Allow portal routes with sub-slugs for filtering
      if (
        pathName === "jobs" ||
        pathName === "internship" ||
        pathName === "scholarship" ||
        pathName === "internship-filter" ||
        pathName === "job-filter"
      ) {
        return;
      }

      // ✅ Safe redirect for others
      navigate(`/${pathName}`, { replace: true });
      return;
    }
    else {
      dispatch(storeLoginStatus(false));
      if (pathName === "register") {
        navigate("/register", { replace: true });
      } else if (pathName === "login") {
        navigate("/login", { replace: true });
      } else if (pathName === "internship" || pathName === "internship-filter" || pathName === "job-filter" || pathName === "scholarship" || pathName === "course" || pathName === "event-filter" || pathName === "workshop-filter" || pathName === "blogs") {
        return;
      }
      else if (location.pathname.startsWith("/blog/")) {
        return;  // allow blog single page
      }
      else if (pathName === "mentors" || pathName === "mentor" || pathName === "competitions") {
        return;
      }
      else if (location.pathname.includes("/job-details/")) {
        return;
      } else {
        // No default redirect to /jobs
        return;
      }
    }
  }, [location.pathname]);


  return (
    <div>
      {" "}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/profiledetails" element={<ProfileDetails />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<JobPortalLandingPage />} />
        <Route path="/jobs" element={<JobFilter />} />
        <Route path="/jobs/:filterSlug" element={<JobFilter />} />
        <Route path="/internship" element={<JobFilter />} />
        <Route path="/internship/:filterSlug" element={<JobFilter />} />
        <Route path="/scholarship" element={<JobFilter />} />
        <Route path="/scholarship/:filterSlug" element={<JobFilter />} />
        <Route path="/internships" element={<InternshipLandingPage />} />
        <Route path="/header" element={<Header />} />
        <Route path="/footer" element={<Footer />} />
        <Route path="/post-jobs" element={<PostJobs />} />
        <Route path="/job-filter" element={<JobFilter />} />
        <Route path="/internship-filter" element={<JobFilter />} />
        <Route path="/event-filter" element={<EventFilter />} />
        <Route path="/workshop-filter" element={<WorkshopFilter />} />
        <Route path="/job-details/:slug" element={<JobDetails />} />
        <Route path="/internship-details/:slug" element={<JobDetails />} />
        <Route path="/scholarship-details/:slug" element={<JobDetails />} />
        <Route path="/admin-profile/:activeTab?" element={<AdminProfile />} />
        <Route path="/main-profile" element={<MainProfile />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/dummy" element={<Dummy />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/recently-viewed" element={<RecentlyViewed />} />
        <Route path="/bookmark" element={<BookMark />} />
        <Route path="/watchlist" element={<WatchList />} />
        <Route path="/listing" element={<Listing />} />
        <Route path="/accountsetting" element={<AccountSettings />} />
        <Route path="/pro-subscription" element={<ProSubscription />} />
        <Route path="/admin-dashboard/:id" element={<AdminDashboard />} />
        <Route path="/admin-dashboard/:id" element={<EditOpportunity />} />
        <Route path="/admin-dashboard/:id" element={<ManageCandidate />} />
        <Route path="/admin-dashboard/:id" element={<RegistrationChart />} />
        <Route path="/location" element={<Location />} />
        <Route path="/manage-notification" element={<ManageNotification />} />
        <Route path="/post-events" element={<PostEvents />} />
        <Route path="/post-workshop" element={<PostWorkShop />} />
        <Route path="/applied-candidates-all" element={<AllAppliedCandidates />} />
        <Route path="/post-course" element={<PostCourses />} />
        <Route path="/course" element={<Courses />} />
        <Route path="/add-blog" element={<AddBlogs />} />
        <Route path="/blog/:slug" element={<BlogSingle />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/mentors" element={<MentorList />} />
        <Route path="/mentor/:id" element={<MentorDetails />} />
        <Route path="/competitions" element={<CompetitionsLandingPage />} />
        {/* ✅ Restrict access only to role_id = 3 */}
        <Route
          path="/all-candidates"
          element={
            <ProtectedRoute allowedRoles={[3]}>
              <AllRegisteredCandidates />
            </ProtectedRoute>
          }
        />

      </Routes>

    </div>
  );
};

export default Layout;
