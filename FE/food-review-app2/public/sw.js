importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js")
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js")

const firebaseApp = firebase.initializeApp({
  apiKey: "your-api-key",
  authDomain: "foodbuddy-app.firebaseapp.com",
  projectId: "foodbuddy-app",
  storageBucket: "foodbuddy-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id",
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/images/app-icon.png",
    badge: "/images/app-icon.png",
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})
