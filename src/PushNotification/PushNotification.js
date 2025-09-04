// PushNotification.js
import React from "react";
// privateKey = tjOKocG1RMVXJQ37p7pImv5bGvP46v05jCYreQulu-I
// keyPair = BKGtYr63kuHwQaJpCzuG1HQ7jnxrKGd66FNSmOAJ0q8N_POfqmhvBuKEtsrwUvsQdNUyq4RLL4YF3q07Raxytrk

function PushNotification() {
  const showNotification = () => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Hello from Santhosh!", {
        body: "This is a browser push notification",
        icon: "/logo192.png", // your app icon
      });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification("Thanks for allowing notifications!");
        }
      });
    }
  };

  return <button onClick={showNotification}>Enable Push Notification</button>;
}

export default PushNotification;
