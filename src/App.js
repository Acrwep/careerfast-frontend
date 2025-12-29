// App.js
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { useEffect, useState } from "react";

import Layout from "./Layout/Layout";
import { Provider } from "react-redux";
import { store } from "./Redux/store";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ScrollToTop from "./ScrollTop/ScrollToTop";
import { requestForToken, messaging } from "./firebase/fireBase";
import { onMessage } from "firebase/messaging";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { HelmetProvider, Helmet } from "react-helmet-async";

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

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then(() => console.log("✅ Firebase Service Worker registered"))
        .catch((err) => console.error("❌ SW registration failed", err));
    }
  }, []);


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

        // 🔹 Check if we've already subscribed this token
        const subscribedToken = localStorage.getItem("fcm_subscribed_token");
        if (subscribedToken === token) {
          console.log("✅ Already subscribed to allUsers topic");
          return;
        }

        // 🔹 Subscribe this token to allUsers topic
        try {
          await axios.post(`${process.env.REACT_APP_API_URL}/api/subscribe-topic`, {
            token,
          });
          console.log("✅ Token subscribed to allUsers topic");
          // Store the token to prevent re-subscription
          localStorage.setItem("fcm_subscribed_token", token);
        } catch (err) {
          console.error("❌ Failed to subscribe to topic:", err);
        }
      }
    };

    initFCM();
  }, []);

  // 2️⃣ Listen for foreground messages (when app is open)
  useEffect(() => {
    onMessage(messaging, (payload) => {
      console.log("📩 Foreground message received:", payload);
    });
  }, []);


  console.log("isTokenFound", isTokenFound);

  return (
    <div className="App">
      <GoogleOAuthProvider clientId={CLIENT_ID}>
        <Provider store={store}>
          <HelmetProvider>
            <Helmet>
              <title>CareerFast - Job Portal</title>
              <meta
                name="description"
                content="CareerFast is a modern job portal connecting candidates with top employers. Apply faster and grow your career today."
              />
              <meta property="og:title" content="CareerFast - Job Portal" />
              <meta
                property="og:description"
                content="CareerFast is a modern job portal connecting candidates with top employers. Apply faster and grow your career today."
              />
              <meta property="og:type" content="website" />
              <meta property="og:url" content="https://careerfast.in" />
              <meta property="og:image" content="https://careerfast.in/favicon.png" />
              <meta name="twitter:card" content="summary_large_image" />
              <meta name="twitter:title" content="CareerFast - Job Portal" />
              <meta
                name="twitter:description"
                content="Discover jobs, connect with employers, and accelerate your career with CareerFast."
              />
              <meta name="twitter:image" content="https://careerfast.in/favicon.png" />
            </Helmet>
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
          </HelmetProvider>
        </Provider>
      </GoogleOAuthProvider>
    </div>
  );
}

export default App;
