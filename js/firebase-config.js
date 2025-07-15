// 🚨  Replace the config object with the keys from your own Firebase project ⚠️
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth }       from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getFirestore }  from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR‑KEY",
  authDomain: "YOUR‑APP.firebaseapp.com",
  projectId: "YOUR‑APP",
  storageBucket: "YOUR‑APP.appspot.com",
  messagingSenderId: "000",
  appId: "1:000:web:000"
};

export const app   = initializeApp(firebaseConfig);
export const auth  = getAuth(app);
export const db    = getFirestore(app);
