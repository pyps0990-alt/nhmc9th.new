// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDGhHrcV5F93chxTeFXI0KkwgHeb0m_31g",
  authDomain: "nhmc9th.firebaseapp.com",
  projectId: "nhmc9th",
  storageBucket: "nhmc9th.firebasestorage.app",
  messagingSenderId: "95509517890",
  appId: "1:95509517890:web:d8627e54521db752c53fdb",
  measurementId: "G-FKQL729HWM"
};
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDGhHrcV5F93chxTeFXI0KkwgHeb0m_31g",
  authDomain: "nhmc9th.firebaseapp.com",
  projectId: "nhmc9th",
  storageBucket: "nhmc9th.firebasestorage.app",
  messagingSenderId: "95509517890",
  appId: "1:95509517890:web:d8627e54521db752c53fdb",
  measurementId: "G-FKQL729HWM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);