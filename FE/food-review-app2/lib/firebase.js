import { initializeApp } from "firebase/app"
import { getMessaging, getToken, onMessage } from "firebase/messaging"

const firebaseConfig = {
  // 실제 프로젝트에서는 환경변수로 관리
  apiKey: "your-api-key",
  authDomain: "foodbuddy-app.firebaseapp.com",
  projectId: "foodbuddy-app",
  storageBucket: "foodbuddy-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id",
}

const app = initializeApp(firebaseConfig)

let messaging = null
if (typeof window !== "undefined") {
  messaging = getMessaging(app)
}

export const requestNotificationPermission = async () => {
  if (!messaging) return null

  try {
    const permission = await Notification.requestPermission()
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: "your-vapid-key",
      })
      return token
    }
  } catch (error) {
    console.error("알림 권한 요청 실패:", error)
  }
  return null
}

export const onMessageListener = () => {
  if (!messaging) return Promise.resolve()

  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload)
    })
  })
}

export { messaging }
