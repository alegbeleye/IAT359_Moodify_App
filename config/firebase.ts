// src/config/firebase.ts
import { initializeApp } from "firebase/app";
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// TODO: Replace with your actual Firebase credentials
const firebaseConfig = {
  apiKey: "AIzaSyB5IMr35cE8_tA5UbRO-5EV6D7YWuD-w_I",
  authDomain: "moodify-c1b75.firebaseapp.com",
  projectId: "moodify-c1b75",
  storageBucket: "moodify-c1b75.firebasestorage.app",
  messagingSenderId: "619624604256",
  appId: "1:619624604256:web:086a5df202912117ae9905",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const db = getFirestore(app);
