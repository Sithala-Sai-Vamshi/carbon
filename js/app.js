import { auth, db } from '../firebase-config.js';
import { onAuthStateChanged, signOut } from
  "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import {
  collection, addDoc, query, orderBy, onSnapshot
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import { calcEmission } from './data.js';
import { drawHistory, drawBreakdown } from './charts.js';

// Elements
const toggle   = document.getElementById('themeToggle');
const saveBtn  = document.getElementById('saveActivity');
const msg      = document.getElementById('saveMsg');
const avatar   = document.getElementById('avatar');

// THEME
toggle.onclick = ()=> document.body.classList.toggle('dark');

// AUTH + profile pic
onAuthStateChanged(auth,u=>{
  if(!u) location.href='index.html';
  avatar.src = u.photoURL || 'https://i.pravatar.cc/40?u='+u.uid;
});

// SAVE ACTIVITY
saveBtn.onclick = async()=>{
  const act = {
    uid: auth.currentUser.uid,
    ts : Date.now(),
    transportMode: transportMode.value,
    val: +transportVal.value,
    electricity: +electricity.value,
    water: +water.value,
    diet: diet.value,
    waste: +waste.value,
    homeSize: +homeSize.value,
    appliances: +appliances.value,
    trips: +trips.value
  };
  act.emission = calcEmission(act);
  await addDoc(collection(db,'activities'),act);
  msg.textContent = 'Saved!';
  msg.style.color = 'var(--green)';
};

// REAL‑TIME DASHBOARD
const q = query(collection(db,'activities'),
                orderBy('ts','asc'));

let historyChart, breakChart;

onSnapshot(q,snap=>{
  const rows = snap.docs.map(d=>d.data())
                         .filter(r=>r.uid===auth.currentUser.uid);
  if(!rows.length) return;
  const labels = rows.map(r=>new Date(r.ts)
                      .toLocaleDateString('en-GB',{month:'short',day:'numeric'}));
  const totals = rows.map(r=>r.emission);
  const latest = rows.at(-1);

  // Eco‑score (arbitrary inverse scale)
  const eco = Math.max(0,100 - latest.emission*2).toFixed(0);
  ecoScore.textContent = eco;
  co2Saved.textContent = (Math.max(...totals)-latest.emission).toFixed(1);
  goalProgress.value = eco;

  // Category boxes
  tEmit.textContent = (latest.val * factors.transport[latest.transportMode]).toFixed(1);
  eEmit.textContent = (latest.electricity*factors.electricity).toFixed(1);
  fEmit.textContent = (factors.diet[latest.diet]).toFixed(1);
  totalEmit.textContent = latest.emission;

  // Draw / update charts
  if(historyChart) historyChart.destroy();
  historyChart = drawHistory(historyChartCtx, totals, labels);

  const breakdownVals = [
    +tEmit.textContent, +eEmit.textContent, +fEmit.textContent,
    (latest.emission - (+tEmit.textContent + +eEmit.textContent + +fEmit.textContent)).toFixed(1)
  ];
  if(breakChart) breakChart.destroy();
  breakChart = drawBreakdown(breakdownChartCtx, breakdownVals);

  // Generate 3 dynamic tips
  tipsList.innerHTML = '';
  const tipBank = [
    'Try biking short trips.',
    'Switch to a renewable power plan.',
    'Plant two trees this month.',
    'Replace showers ≤ 5 min.',
    'Have meat‑free Mondays.',
    'Unplug idle chargers.',
    'Use cold‑water laundry.'
  ];
  for(let i=0;i<3;i++){
     const li = document.createElement('li');
     li.textContent = tipBank[(Date.now()+i)%tipBank.length];
     tipsList.appendChild(li);
  }
});
