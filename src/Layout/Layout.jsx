import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
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
import AllAppliedCandidates from "../AdminDashboard/AllAppliedCandidates";

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    //handle navigate to login page when token expire
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
      if (pathName === "" || pathName === "/") {
        navigate("/job-portal", { replace: true });
      } else if (
        pathName.includes("job-details") ||
        pathName.includes("admin-dashboard") ||
        pathName.includes("edit-opportunity")
      ) {
        return;
      } else {
        navigate(`/${pathName}`, { replace: true });
      }
    } else {
      dispatch(storeLoginStatus(false));
      if (pathName === "register") {
        navigate("/register", { replace: true });
      } else if (pathName === "login") {
        navigate("/login", { replace: true });
      } else if (pathName === "internship") {
        navigate("/internship", { replace: true });
      } else if (pathName === "job-filter") {
        navigate("/job-filter", { replace: true });
      } else if (location.pathname.includes("/job-details/")) {
        return;
      } else {
        navigate("/job-portal", { replace: true });
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
        <Route path="/job-portal" element={<JobPortalLandingPage />} />
        <Route path="/internship" element={<InternshipLandingPage />} />
        <Route path="/header" element={<Header />} />
        <Route path="/footer" element={<Footer />}></Route>
        <Route path="/post-jobs" element={<PostJobs />} />
        <Route path="/job-filter" element={<JobFilter />} />
        <Route path="/job-details/:id" element={<JobDetails />} />
        <Route path="/admin-profile" element={<AdminProfile />} />
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
        <Route path="/edit-opportunity/:id" element={<EditOpportunity />} />
        <Route path="/manage-candidate" element={<ManageCandidate />} />
        <Route path="/registration-chart" element={<RegistrationChart />} />
        <Route path="/manage-notification" element={<ManageNotification />} />
        <Route
          path="/applied-candidates-all"
          element={<AllAppliedCandidates />}
        />
      </Routes>
    </div>
  );
};

export default Layout;
