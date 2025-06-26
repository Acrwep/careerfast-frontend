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
    const expired = isTokenExpired(AccessToken);
    if (expired === true) {
      ShowModal();
      return Promise.reject(new Error("Token is expired"));
    }
    // const loginDetails = localStorage.getItem("loginDetails");
    // console.log("login details", loginDetails);

    // if (loginDetails) {
    //   const convertJson = JSON.parse(loginDetails);
    //   console.log(convertJson);
    // }

    if (AccessToken) {
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

// export const getJobOpeningsData = async () => {
//   try {
//     const response = await api.get("/api/openings");
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };

// job post (post api)

export const createJobPost = async (jobPostPayload) => {
  try {
    const response = await api.post("/api/jobPosting", jobPostPayload);
    return response;
  } catch (error) {
    throw error;
  }
};
