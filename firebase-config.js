
// Firebase SDK Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDeWDl2SM1t50tfxLZE6PWabrjdEnp42kw",
  authDomain: "library-inventory-system-da62c.firebaseapp.com",
  projectId: "library-inventory-system-da62c",
  storageBucket: "library-inventory-system-da62c.firebasestorage.app",
  messagingSenderId: "856447377350",
  appId: "1:856447377350:web:8bd2bafd175e21e24c1cc7",
  measurementId: "G-7WLDLW85Z9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };

