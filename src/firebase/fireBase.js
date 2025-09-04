// firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import axios from "axios";

const firebaseConfig = {
  apiKey: "AIzaSyA2rXuLi_kgfth-sGZnhM-xm-GUuo9Y0aE",
  authDomain: "careerfastjobportal.firebaseapp.com",
  projectId: "careerfastjobportal",
  storageBucket: "careerfastjobportal.firebasestorage.com",
  messagingSenderId: "130499988544",
  appId: "1:130499988544:web:52699b5654802be3d3a3a5",
  measurementId: "G-YX6Y57X00W",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestForToken = async (setTokenFound) => {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey:
        "BIA97K5wTZQp1V8RGwnJkJbONenXKy_q0-eAf9n0hFqQELOj3o_1R_4ZQMtHwTOLtotR5MfxiPT-_vMP3biSNgo", // from Firebase project settings
    });
    if (currentToken) {
      console.log("FCM Token:", currentToken);
      setTokenFound(true);

      // save in localStorage for later
      localStorage.setItem("fcm_token", currentToken);
    } else {
      console.log("No registration token available. Request permission.");
      setTokenFound(false);
    }
  } catch (err) {
    console.log("An error occurred while retrieving token. ", err);
    setTokenFound(false);
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("Foreground message received:", payload);

      // Show Chrome/Windows/macOS native notification
      if (Notification.permission === "granted") {
        new Notification(payload.notification.title, {
          body: payload.notification.body,
          icon: "/logo192.png", // change this to your app logo
        });
      }

      resolve(payload);
    });
  });
