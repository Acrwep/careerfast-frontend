/* global importScripts, firebase */
importScripts(
  "https://www.gstatic.com/firebasejs/9.6.11/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.6.11/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyA2rXuLi_kgfth-sGZnhM-xm-GUuo9Y0aE",
  authDomain: "careerfastjobportal.firebaseapp.com",
  projectId: "careerfastjobportal",
  storageBucket: "careerfastjobportal.appspot.com",
  messagingSenderId: "130499988544",
  appId: "1:130499988544:web:52699b5654802be3d3a3a5",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("📩 Background message received:", payload);

  const { title, body, icon } = payload.notification || {};
  const click_action =
    payload?.fcmOptions?.link ||
    payload?.data?.click_action ||
    "https://careerfast.in/job-portal"; // default link

  self.registration.showNotification(title || "CareerFast", {
    body: body || "",
    icon: icon || "/favicon.png",
    data: { click_action }, // 🔹 store the link here
  });
});

// 🔹 Handle click on notification
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.click_action || "https://careerfast.in";
  event.waitUntil(clients.openWindow(url));
});
