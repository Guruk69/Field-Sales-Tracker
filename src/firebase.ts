import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCCXwQmNaD5jHYY6QOA5QNgJcvXA1LZf-8",
  authDomain: "field-sales-tracker-8894e.firebaseapp.com",
  projectId: "field-sales-tracker-8894e",
  storageBucket: "field-sales-tracker-8894e.firebasestorage.app",
  messagingSenderId: "101147682889",
  appId: "1:101147682889:web:2c3275b1011bdbd9303798"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
