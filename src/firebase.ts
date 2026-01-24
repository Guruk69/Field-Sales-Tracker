import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "field-sales-tracker-8894e.firebaseapp.com",
  projectId: "field-sales-tracker-8894e",
  storageBucket: "field-sales-tracker-8894e.appspot.com",
  messagingSenderId: "101147682889",
  appId: "1:101147682889:web:2c3275b1011bdbd9303798"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);