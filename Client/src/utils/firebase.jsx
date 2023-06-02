// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getStorage} from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

//tukituki-ca702.firebaseapp.com
const firebaseConfig = {
  apiKey: "AIzaSyA6t9cQZK41FkdOFqgb_TiappgKI-W45V8",
  authDomain: "tukituki-ca702.firebaseapp.com",
  projectId: "tukituki-ca702",
  storageBucket: "tukituki-ca702.appspot.com",
  messagingSenderId: "576385544601",
  appId: "1:576385544601:web:1466e03e64afa67fa12308",
  measurementId: "G-NTX1F01QGK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage = getStorage(app)