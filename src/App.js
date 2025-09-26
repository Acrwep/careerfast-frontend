// App.js
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { useEffect, useState } from "react";

import Layout from "./Layout/Layout";
import { Provider } from "react-redux";
import { store } from "./Redux/store";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ScrollToTop from "./ScrollTop/ScrollToTop";
import { requestForToken, onMessageListener } from "./firebase/fireBase";
import axios from "axios";
import { ToastContainer } from "react-toastify";

function App() {
  // disable console logs in production
  if (process.env.NODE_ENV === "production") {
    console.log = () => { };
    console.debug = () => { };
    console.info = () => { };
    console.warn = () => { };
    console.error = () => { };
  }

  const CLIENT_ID =
    "288981358654-vrhl2uqu61r1ju40blnk4ibde6sbnu47.apps.googleusercontent.com";

  const [isTokenFound, setTokenFound] = useState(false);

  // 1️⃣ Request notification permission & FCM token
  useEffect(() => {
    const initFCM = async () => {
      if (Notification.permission !== "granted") {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          console.log("❌ Notifications denied by user");
          return;
        }
      }

      const token = await requestForToken();
      if (token) {
        console.log("✅ FCM Token:", token);

        // 🔹 Subscribe this token to allUsers topic
        try {
          await axios.post(`${process.env.REACT_APP_API_URL}/api/subscribe-topic`, {
            token,
          });
          console.log("✅ Token subscribed to allUsers topic");
        } catch (err) {
          console.error("❌ Failed to subscribe to topic:", err);
        }
      }
    };

    initFCM();
  }, []);

  // 2️⃣ Foreground notifications → show clickable native Notification
  useEffect(() => {
    onMessageListener()
      .then((payload) => {
        console.log("📩 Foreground notification received:", payload);

        const title = payload.notification?.title || "CareerFast";
        const body = payload.notification?.body || "";
        const icon = payload.data?.icon || "/favicon.png";
        const link =
          payload?.fcmOptions?.link ||
          payload?.data?.click_action ||
          "https://careerfast.in/job-portal";

        // Show browser Notification instead of toast
        if (Notification.permission === "granted") {
          const n = new Notification(title, { body, icon });
          n.onclick = () => window.open(link, "_blank");
        }
      })
      .catch((err) => console.log("onMessageListener failed:", err));
  }, []);

  console.log("isTokenFound", isTokenFound);

  return (
    <div className="App">
      <GoogleOAuthProvider clientId={CLIENT_ID}>
        <Provider store={store}>
          <BrowserRouter>
            <ScrollToTop />
            <Layout />
            <ToastContainer
              position="top-right"
              autoClose={1500}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
          </BrowserRouter>
        </Provider>
      </GoogleOAuthProvider>
    </div>
  );
}

export default App;
