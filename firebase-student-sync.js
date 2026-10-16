import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, where, orderBy } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";
const app=initializeApp(firebaseConfig);
const db=getFirestore(app);
const KEY="divineAcademyLessonsV2";
function sortLessons(a,b){return (a.subject||"").localeCompare(b.subject||"")||(a.className||"").localeCompare(b.className||"")||(a.chapter||"").localeCompare(b.chapter||"")||Number(a.lessonNumber)-Number(b.lessonNumber);}
try {
  const snap=await getDocs(query(collection(db,"lessons"),where("published","==",true)));
  const lessons=snap.docs.map(d=>({id:d.id,...d.data()})).sort(sortLessons);
  const current=localStorage.getItem(KEY);
  const next=JSON.stringify(lessons);
  if(current!==next){localStorage.setItem(KEY,next);location.reload();}
} catch(err) {
  console.error("Divine Academy Firebase lesson sync failed:",err);
  const root=document.getElementById("lesson-list");
  if(root && !root.textContent.trim()) root.textContent="Unable to load lessons from the online database. Please refresh later.";
}
