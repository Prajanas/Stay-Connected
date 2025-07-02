import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
const firebaseConfig = {
  apiKey: "AIzaSyAE6Cs6OSM2gNTkTg9w7U0rrDwrjmHFg4U",
  authDomain: "active-meet.firebaseapp.com",
  databaseURL: "https://active-meet-default-rtdb.firebaseio.com",
  projectId: "active-meet",
  storageBucket: "active-meet.appspot.com",
  messagingSenderId: "215283414590",
  appId: "1:215283414590:web:33b8c2f81dcaa782df836f",
  measurementId: "G-2KV2JGE484",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };
