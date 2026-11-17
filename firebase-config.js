// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDUyWNfQXeLnmXc4r9UHzUlmdnG0cVfxsY",
  authDomain: "simulasi-dma2252.firebaseapp.com",
  databaseURL: "https://simulasi-dma2252-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "simulasi-dma2252",
  storageBucket: "simulasi-dma2252.firebasestorage.app",
  messagingSenderId: "607251342424",
  appId: "1:607251342424:web:3c1c16d306e32a82fc962d",
  measurementId: "G-4RM7YM0YLT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);