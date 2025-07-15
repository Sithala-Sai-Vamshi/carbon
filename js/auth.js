import { auth } from '../firebase-config.js';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

// Elements
const msgEl = document.getElementById('authMsg');
const emailF = document.getElementById('emailForm');
const googleB = document.getElementById('googleBtn');

// EMAIL SIGN‑IN / SIGN‑UP
emailF.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const em = email.value.trim(), pw = password.value;
  try{
    await signInWithEmailAndPassword(auth, em, pw);
  }catch(err){
    // If user does not exist, create on first try
    if(err.code === 'auth/user-not-found'){
      await createUserWithEmailAndPassword(auth, em, pw);
    } else { msgEl.textContent = err.message; }
  }
});

// GOOGLE
googleB.onclick = ()=> signInWithPopup(auth,new GoogleAuthProvider());

// REDIRECT
onAuthStateChanged(auth, user=>{
  if(user) location.href='dashboard.html';
});
