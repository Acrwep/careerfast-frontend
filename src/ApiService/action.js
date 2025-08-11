import axios from "axios";
import { Modal } from "antd";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: { "Content-Type": "application/json" },
});

let isModalVisible = false;
let modalInstance = null;

api.interceptors.request.use(
  (config) => {
    const AccessToken = localStorage.getItem("AccessToken");
    // console.log("my token", AccessToken);

    const loginDetails = localStorage.getItem("loginDetails");
    // console.log("login details", loginDetails);

    if (loginDetails) {
      const convertJson = JSON.parse(loginDetails);
      // console.log(convertJson);
    }

    if (AccessToken) {
      const expired = isTokenExpired(AccessToken);
      if (expired === true) {
        ShowModal();
        return Promise.reject(new Error("Token is expired"));
      }
      config.headers.Authorization = `Bearer ${AccessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// TokenExpired
const isTokenExpired = (token) => {
  if (!token) return true; // No token means it's "expired"

  try {
    // split the token into parts
    const payloadBase64 = token.split(".")[1];

    // decode the base64 payload
    const decodedPayload = JSON.parse(atob(payloadBase64));

    // get the current time in seconds
    const currentTime = Date.now() / 1000;

    // check if the token has expired
    return decodedPayload.exp < currentTime;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
};

// modal
const ShowModal = () => {
  if (isModalVisible) {
    return; // Don't open a new modal if one is already visible
  }

  isModalVisible = true;

  modalInstance = Modal.warning({
    title: "Session Expired",
    centered: true,
    content: "Your session has expired. Please log in again.",
    onOk() {
      handleSessionModal();
    },
    onCancel() {
      handleSessionModal();
    },
    onClose() {
      handleSessionModal();
    },
    footer: [
      <div className="sessionmodal_okbuttonContainer">
        <button className="sessionmodal_okbutton" onClick={handleSessionModal}>
          OK
        </button>
      </div>,
    ],
  });

  return;
};

const handleSessionModal = () => {
  const event = new Event("tokenExpireUpdated");
  window.dispatchEvent(event);
  if (modalInstance) {
    modalInstance.destroy(); // Manually close the modal
    modalInstance = null;
  }
  isModalVisible = false;
};

// getRoles

export const getRoles = async () => {
  try {
    const response = await api.get("/api/getRoles");
    return response;
  } catch (error) {
    throw error;
  }
};

export const login = async (payload) => {
  try {
    const response = await api.post("/api/login", payload);
    return response;
  } catch (error) {
    throw error;
  }
};

export const register = async (registerload) => {
  try {
    const response = await api.post("/api/createUser", registerload);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getOrganizationType = async () => {
  try {
    const response = await api.get("/api/organization/type/get");
    return response;
  } catch (error) {
    throw error;
  }
};

export const getJobNature = async () => {
  try {
    const response = await api.get("/api/job/getJobNature");
    return response;
  } catch (error) {
    throw error;
  }
};

export const getDurationTypes = async () => {
  try {
    const response = await api.get("/api/job/durationTypes/get");
    return response;
  } catch (error) {
    throw error;
  }
};

export const getDuration = async (payload) => {
  try {
    const response = await api.get("/api/getDuration", { params: payload });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getWorkPlaceType = async () => {
  try {
    const response = await api.get("/api/job/workplace-type/get");
    return response;
  } catch (error) {
    throw error;
  }
};

export const getWorkPlaceLocation = async () => {
  try {
    const response = await api.get("/api/job/workLocation/get");
    return response;
  } catch (error) {
    throw error;
  }
};

export const getBenifitsData = async () => {
  try {
    const response = await api.get("/api/getBenefits");
    return response;
  } catch (error) {
    throw error;
  }
};

export const getGenderData = async () => {
  try {
    const response = await api.get("/api/getGender");
    return response;
  } catch (error) {
    throw error;
  }
};

export const getEligibilityData = async () => {
  try {
    const response = await api.get("/api/getEligibility");
    return response;
  } catch (error) {
    throw error;
  }
};

export const getYears = async () => {
  try {
    const response = await api.get("/api/getYears");
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSalaryData = async () => {
  try {
    const response = await api.get("/api/getSalaryType");
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSkillsData = async () => {
  try {
    const response = await api.get("/api/getSkills");
    return response;
  } catch (error) {
    throw error;
  }
};

export const getJobCategoryData = async () => {
  try {
    const response = await api.get("api/getJobCategories");
    return response;
  } catch (error) {
    throw error;
  }
};

// job post (post api)

export const createJobPost = async (jobPostPayload) => {
  try {
    const response = await api.post("/api/jobPosting", jobPostPayload);
    return response;
  } catch (error) {
    throw error;
  }
};

// closing registration api

export const closeRegistration = async (token) => {
  try {
    const response = await api.put(
      "/api/registrationClose",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// forgot pass

// Step 1: Send OTP
export const sendOtp = async (payload) => {
  try {
    const response = await api.post("/api/sendOTP", payload);
    return response;
  } catch (error) {
    throw error;
  }
};

// Step 2: Verify OTP
export const verifyOtp = async (payload) => {
  try {
    const response = await api.post("/api/verifyOTP", payload);
    return response;
  } catch (error) {
    throw error;
  }
};

// Step 3: Reset Password
export const forgotPassword = async (payload) => {
  try {
    const response = await api.put("/api/forgotPassword", payload);
    return response;
  } catch (error) {
    throw error;
  }
};

// insert profile

export const insertProfileData = async (payload) => {
  try {
    const response = await api.post("/api/insertProfile", payload);
    return response;
  } catch (error) {
    throw error;
  }
};

// verify email

export const verifyEmail = async (payload) => {
  try {
    const response = await api.post("/api/VerifyEmail", payload);
    return response;
  } catch (error) {
    throw error;
  }
};

// getJobPostByUserId

export const getJobPostByUserId = async (payload) => {
  try {
    const response = await api.get("/api/getJobPostByUserId", {
      params: payload,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// getUserType

export const getUserTypeData = async () => {
  try {
    const response = await api.get("api/getUserType");
    return response;
  } catch (error) {
    throw error;
  }
};

// updateResume

export const updateResume = async (payload) => {
  try {
    const response = await api.put("api/updateResume", payload);
    return response;
  } catch (error) {
    throw error;
  }
};

// updateAbout

export const updateAbout = async (payload) => {
  try {
    const response = await api.put("api/updateAbout", payload);
    return response;
  } catch (error) {
    throw error;
  }
};

// updateSkills

export const updateSkills = async (payload) => {
  try {
    const response = await api.put("api/updateSkills", payload);
    return response;
  } catch (error) {
    throw error;
  }
};

// insertProjects

export const insertProjects = async (payload) => {
  try {
    const response = await api.post("/api/insertProjects", payload);
    return response;
  } catch (error) {
    throw error;
  }
};

// updateProject

export const updateProject = async (payload) => {
  try {
    const response = await api.put("/api/updateProject", payload);
    return response;
  } catch (error) {
    throw error;
  }
};

// deleteProject

export const deleteProject = async (payload) => {
  try {
    const response = await api.delete("/api/deleteProject", {
      params: payload,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// updateSocialLinks

export const updateSocialLinks = async (payload) => {
  try {
    const response = await api.put("/api/updateSocialLinks", payload);
    return response;
  } catch (error) {
    throw error;
  }
};

// updateBasicDetails

export const updateBasicDetails = async (payload) => {
  try {
    const response = await api.put("/api/updateBasicDetails", payload);
    return response;
  } catch (error) {
    throw error;
  }
};

// updateEducation

export const updateEducation = async (payload) => {
  try {
    const response = await api.put("/api/updateEducation", payload);
    return response;
  } catch (error) {
    throw error;
  }
};

// insertEducation

export const insertEducation = async (payload) => {
  try {
    const response = await api.post("/api/insertEducation", payload);
    return response;
  } catch (error) {
    throw error;
  }
};

// deleteEducation

export const deleteEducation = async (payload) => {
  try {
    const response = await api.delete("/api/deleteEducation", {
      params: payload,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// insertExperience

export const insertExperience = async (payload) => {
  try {
    const response = await api.post("/api/insertExperience", payload);
    return response;
  } catch (error) {
    throw error;
  }
};

// updateExperience

export const updateExperience = async (payload) => {
  try {
    const response = await api.put("/api/updateExperience", payload);
    return response;
  } catch (error) {
    throw error;
  }
};

// deleteExperience

export const deleteExperience = async (payload) => {
  try {
    const response = await api.delete("/api/deleteExperience", {
      params: payload,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// getUserProfile

export const getUserProfile = async (payload) => {
  try {
    const response = await api.get("/api/getUserProfile", {
      params: payload,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// getQualification

export const getQualification = async () => {
  try {
    const response = await api.get("api/getQualification");
    return response;
  } catch (error) {
    throw error;
  }
};

// getCourses

export const getCourses = async () => {
  try {
    const response = await api.get("api/getCourses");
    return response;
  } catch (error) {
    throw error;
  }
};

// getSpecialization

export const getSpecialization = async () => {
  try {
    const response = await api.get("api/getSpecialization");
    return response;
  } catch (error) {
    throw error;
  }
};

// getColleges

export const getColleges = async () => {
  try {
    const response = await api.get("api/getColleges");
    return response;
  } catch (error) {
    throw error;
  }
};

// getCourseType

export const getCourseType = async () => {
  try {
    const response = await api.get("api/getCourseType");
    return response;
  } catch (error) {
    throw error;
  }
};

// getJobPosts

export const getJobPosts = async (payload) => {
  try {
    const response = await api.post("api/getJobPosts", payload);
    return response;
  } catch (error) {
    throw error;
  }
};

// applyForJob

export const applyForJob = async (payload) => {
  try {
    const response = await api.post("api/applyForJob", payload);
    return response;
  } catch (error) {
    throw error;
  }
};

// getJobAppliedCandidates

export const getJobAppliedCandidates = async (payload) => {
  try {
    const response = await api.get("api/getJobAppliedCandidates", {
      params: payload,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// checkIsJobApplied

export const checkIsJobApplied = async (payload) => {
  try {
    const response = await api.get("api/checkIsJobApplied", {
      params: payload,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// isProfileUpdated

export const isProfileUpdated = async (payload) => {
  try {
    const response = await api.get("api/isProfileUpdated", {
      params: payload,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// saveJobPost

export const saveJobPost = async (payload) => {
  try {
    const response = await api.post("api/saveJobPost", payload);
    return response;
  } catch (error) {
    throw error;
  }
};

// getSavedJobs

export const getSavedJobs = async (payload) => {
  try {
    const response = await api.get("api/getSavedJobs", {
      params: payload,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// removeSavedJobs

export const removeSavedJobs = async (payload) => {
  try {
    const response = await api.delete("/api/removeSavedJobs", {
      params: payload,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// checkIsJobSaved

export const checkIsJobSaved = async (payload) => {
  try {
    const response = await api.get("api/checkIsJobSaved", {
      params: payload,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// updateProfileImage

export const updateProfileImage = async (payload) => {
  try {
    const response = await api.put("/api/updateProfileImage", payload);
    return response;
  } catch (error) {
    throw error;
  }
};

// getUserAppliedJobs

export const getUserAppliedJobs = async (payload) => {
  try {
    const response = await api.get("api/userAppliedJobs", {
      params: payload,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// searchByKeyword

export const searchByKeyword = async (payload) => {
  try {
    const response = await api.get("api/searchByKeyword", {
      params: payload,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// updateJobBasicDetails

export const updateJobBasicDetails = async (payload) => {
  try {
    const response = await api.put("api/updateJobBasicDetails", payload);
    return response;
  } catch (error) {
    throw error;
  }
};

// updateJobNature

export const updateJobNature = async (payload) => {
  try {
    const response = await api.put("api/updateJobNature", payload);
    return response;
  } catch (error) {
    throw error;
  }
};

// updateEligibility

export const updateEligibility = async (payload) => {
  try {
    const response = await api.put("api/updateEligibility", payload);
    return response;
  } catch (error) {
    throw error;
  }
};

// updateJobDescription

export const updateJobDescription = async (payload) => {
  try {
    const response = await api.put("api/updateJobDescription", payload);
    return response;
  } catch (error) {
    throw error;
  }
};

// updateUserAppliedJobStatus

export const updateUserAppliedJobStatus = async (payload) => {
  try {
    const response = await api.put("api/updateUserAppliedJobStatus", payload);
    return response;
  } catch (error) {
    throw error;
  }
};

// getUserJobPostStatus

export const getUserJobPostStatus = async (payload) => {
  try {
    const response = await api.get("api/getUserJobPostStatus", {
      params: payload,
    });
    return response;
  } catch (error) {
    throw error;
  }
};
