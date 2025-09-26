// firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { saveToken } from "../ApiService/action";

const firebaseConfig = {
  apiKey: "AIzaSyA2rXuLi_kgfth-sGZnhM-xm-GUuo9Y0aE",
  authDomain: "careerfastjobportal.firebaseapp.com",
  projectId: "careerfastjobportal",
  storageBucket: "careerfastjobportal.appspot.com",
  messagingSenderId: "130499988544",
  appId: "1:130499988544:web:52699b5654802be3d3a3a5",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestForToken = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey:
        "BJ5NJwYWpuRGKS7KXzqSW-80m_9p8QrDdLcv4PV8TEsgcuonquxhnYE5PTq8z9Cwg7qHGStNp1RyW3pz-6r7i9E",
    });

    if (token) {
      console.log("✅ Got FCM Token:", token);

      localStorage.setItem("fcm_token", token);

      const storedUser = JSON.parse(localStorage.getItem("loginDetails"));
      const userId = storedUser?.id;

      if (userId) {
        await saveToken(userId, token); // 🔹 calls backend /save-token
        console.log("✅ Token saved to backend");
      }
    } else {
      console.log("❌ No registration token available");
    }
  } catch (err) {
    console.error("❌ Error retrieving FCM token:", err);
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
