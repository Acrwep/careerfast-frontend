import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import Layout from "./Layout/Layout";
import { Provider } from "react-redux";
import { store } from "./Redux/store";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ScrollToTop from "./ScrollTop/ScrollToTop";
import { requestForToken, onMessageListener } from "./firebase/fireBase";

function App() {
  // disable console logs in production
  if (process.env.NODE_ENV === "production") {
    console.log = () => {};
    console.debug = () => {};
    console.info = () => {};
    console.warn = () => {};
    console.error = () => {};
  }

  // Google Client ID
  const CLIENT_ID =
    "288981358654-vrhl2uqu61r1ju40blnk4ibde6sbnu47.apps.googleusercontent.com";

  const [isTokenFound, setTokenFound] = useState(false);

  // Ask for browser notification permission
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("✅ Browser notifications allowed");
        } else {
          console.log("❌ Notifications denied");
        }
      });
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("fcm_token");
    if (token) {
      axios
        .post("http://localhost:3001/api/subscribe-topic", { token })
        .then(() => console.log("✅ Subscribed to allUsers"))
        .catch((err) => console.error("❌ Error subscribing:", err));
    }
  }, []);

  console.log("isTokenFound", isTokenFound);

  // Send a test notification
  const sendTestNotification = async () => {
    try {
      const token = localStorage.getItem("fcm_token");
      if (!token) {
        console.error("⚠️ No FCM token found. Request permission again.");
        return;
      }

      const res = await axios.post(
        "http://localhost:3001/api/send-notification",
        {
          title: "CareerFast Push 🚀",
          body: "Hello from your site integration!",
          token,
        }
      );

      console.log("Notification sent:", res.data);
    } catch (err) {
      console.error("Error sending notification:", err);
    }
  };

  return (
    <div className="App">
      <GoogleOAuthProvider clientId={CLIENT_ID}>
        <Provider store={store}>
          <BrowserRouter>
            <ScrollToTop />
            <Layout />
          </BrowserRouter>
        </Provider>
      </GoogleOAuthProvider>
    </div>
  );
}

export default App;
