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

  const CLIENT_ID =
    "288981358654-vrhl2uqu61r1ju40blnk4ibde6sbnu47.apps.googleusercontent.com";

  const [isTokenFound, setTokenFound] = useState(false);

  // 1️⃣ Request notification permission & FCM token
  useEffect(() => {
    const initFCM = async () => {
      if (Notification.permission !== "granted") {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          console.log("❌ Notifications denied");
          return;
        }
      }
      await requestForToken(setTokenFound);
    };

    initFCM();
  }, []);

  // 2️⃣ Listen for foreground notifications
  useEffect(() => {
    onMessageListener()
      .then((payload) => {
        console.log("Foreground notification received:", payload);
      })
      .catch((err) => console.log("onMessageListener failed:", err));
  }, []);

  // 3️⃣ Subscribe token to backend topic
  useEffect(() => {
    const token = localStorage.getItem("fcm_token");
    if (token) {
      axios
        .post("http://localhost:3001/api/subscribe-topic", { token })
        .then(() => console.log("✅ Subscribed to allUsers"))
        .catch((err) => console.error("❌ Error subscribing:", err));
    }
  }, [isTokenFound]); // run when token is available

  console.log("isTokenFound", isTokenFound);

  // 4️⃣ Test sending notification
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
