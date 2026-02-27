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
import { HelmetProvider } from "react-helmet-async";


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
      <HelmetProvider>
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
      </HelmetProvider>
    </div>
  );
}

export default App;
