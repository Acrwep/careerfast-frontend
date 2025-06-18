import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Login/Login";
import About from "./About/About";
import ProfileDetails from "./ProfileDetails/ProfileDetails";
import RegisterPage from "./Register/RegisterPage";
import JobPortalLandingPage from "./JobPortal/LandingPage";
import InternshipLandingPage from "./InternshipPortal/LandingPage";
import Header from "./Header/Header";
import PostJobs from "./JobPortal/PostJobs";
import JobFilter from "./JobPortal/JobFilter";
import JobDetails from "./JobPortal/JobDetails";
import UserProfile from "./Profile/UserProfile";
import NotFound from "./NotFound/NotFound";
import MainProfile from "./Profile/MainProfile";
import WatchList from "./Profile/WatchList";
import Dummy from "./ProfileDetails/Dummy";
import Settings from "./Profile/Settings";
import BookMark from "./Profile/BookMark";
import RecentlyViewed from "./Profile/RecentlyViewed";
import Listing from "./Profile/Listing";
import AccountSettings from "./Profile/AccountSettings";
import ProSubscription from "./Profile/ProSubscription";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/profiledetails" element={<ProfileDetails />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/job-portal" element={<JobPortalLandingPage />} />
          <Route path="/internship" element={<InternshipLandingPage />} />
          <Route path="/header" element={<Header />} />
          <Route path="/post-jobs" element={<PostJobs />} />
          <Route path="/job-filter" element={<JobFilter />} />
          <Route path="/job-details" element={<JobDetails />} />
          <Route path="/user-profile" element={<UserProfile />} />
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
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={700}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={true}
        draggable={false}
        pauseOnHover={true}
        theme="light"
      />
    </div>
  );
}

export default App;
