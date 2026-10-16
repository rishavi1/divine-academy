import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, query, orderBy } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const DATA_KEY = "divineAcademyLessonsV2";
const form = document.getElementById("lesson-form");
const lockForm = document.getElementById("unlock-form");
const lock = document.getElementById("admin-lock");
const content = document.getElementById("admin-content");
const message = document.getElementById("admin-message");
const lockMessage = document.getElementById("lock-message");
const listRoot = document.getElementById("admin-lesson-list");
const restore = document.getElementById("restore-demo");
if (restore) restore.hidden = true; // Demo lessons must not overwrite online data.

function friendlyError(err) {
  const code = err?.code || "";
  if (code.includes("permission-denied")) return "Firestore denied this action. Check that you published the security rules and the teacher UID in firestore.rules matches your Firebase teacher UID.";
  if (code.includes("auth/invalid-credential") || code.includes("auth/wrong-password") || code.includes("auth/user-not-found")) return "Email or password is incorrect. Use the account created in Firebase Authentication.";
  if (code.includes("auth/unauthorized-domain")) return "Add your website domain under Firebase Authentication → Settings → Authorized domains.";
  return `${err?.message || "Something went wrong."} (${code || "unknown error"})`;
}
function sortLessons(a,b) { return (a.subject||"").localeCompare(b.subject||"") || (a.className||"").localeCompare(b.className||"") || (a.chapter||"").localeCompare(b.chapter||"") || Number(a.lessonNumber)-Number(b.lessonNumber); }
function esc(s) { return String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;", "'":"&#39;"}[c])); }
async function fetchAll() {
  const snap = await getDocs(query(collection(db,"lessons"), orderBy("createdAt","desc")));
  return snap.docs.map(d=>({id:d.id,...d.data()})).sort(sortLessons);
}
async function refreshList() {
  try {
    const lessons = await fetchAll();
    localStorage.setItem(DATA_KEY, JSON.stringify(lessons));
    listRoot.innerHTML = lessons.length ? lessons.map(l=>`<div class="admin-item"><div><strong>${esc(l.title)}</strong><small>${esc(l.className)} • ${esc(({maths:"Mathematics",science:"Science",english:"English"})[l.subject]||l.subject)} • ${esc(l.chapter)} • Lesson ${esc(l.lessonNumber)}</small></div><button class="soft-btn" data-firebase-delete="${esc(l.id)}" type="button">Delete</button></div>`).join("") : '<div class="empty-state">No lessons in Firebase yet. Add your first lesson above.</div>';
  } catch(err) { message.textContent = friendlyError(err); }
}
onAuthStateChanged(auth, async user => {
  if (user) {
    lock.hidden = true; content.hidden = false;
    if (!document.getElementById("logout-teacher")) {
      const b=document.createElement("button"); b.id="logout-teacher"; b.className="soft-btn"; b.textContent="Sign out"; b.style.margin="0 0 16px";
      b.onclick=()=>signOut(auth).catch(e=>message.textContent=friendlyError(e)); content.prepend(b);
    }
    await refreshList();
  } else { lock.hidden = false; content.hidden = true; }
});
lockForm.addEventListener("submit", async e => {
  e.preventDefault(); lockMessage.textContent="Signing in…";
  try { await signInWithEmailAndPassword(auth, document.getElementById("admin-email").value.trim(), document.getElementById("admin-password").value); lockMessage.textContent=""; }
  catch(err) { lockMessage.textContent=friendlyError(err); }
});
form.addEventListener("submit", async e => {
  e.preventDefault(); e.stopImmediatePropagation();
  if (!auth.currentUser) { message.textContent="Please sign in first."; return; }
  const f=new FormData(form), url=String(f.get("url")||"").trim();
  const videoId = (()=>{try{const u=new URL(url); if(u.hostname.includes("youtu.be"))return u.pathname.split("/").filter(Boolean)[0]||""; if(u.hostname.includes("youtube.com")||u.hostname.includes("youtube-nocookie.com")){if(u.searchParams.get("v"))return u.searchParams.get("v");const p=u.pathname.split("/").filter(Boolean);const i=p.findIndex(x=>["embed","shorts","live"].includes(x));return i>=0?p[i+1]||"":"";} }catch{} return "";})();
  if (!videoId && !/^https?:\/\/.+\.mp4($|\?)/i.test(url)) { message.textContent="Please enter a valid YouTube URL or direct MP4 URL."; return; }
  const lesson={className:String(f.get("className")),subject:String(f.get("subject")),chapter:String(f.get("chapter")).trim(),lessonNumber:Number(f.get("lessonNumber")),title:String(f.get("title")).trim(),url,description:String(f.get("description")||"").trim(),published:true,createdAt:serverTimestamp(),createdBy:auth.currentUser.uid};
  try { message.textContent="Saving lesson online…"; await addDoc(collection(db,"lessons"),lesson); form.reset(); form.elements.lessonNumber.value=1; message.textContent="Lesson saved to Firebase. Students can now see it from any device."; await refreshList(); }
  catch(err) { message.textContent=friendlyError(err); }
}, true);
listRoot.addEventListener("click", async e => {
  const b=e.target.closest("[data-firebase-delete]"); if(!b)return;
  e.preventDefault(); e.stopImmediatePropagation();
  if(!auth.currentUser || !confirm("Delete this lesson for all students?"))return;
  try { await deleteDoc(doc(db,"lessons",b.dataset.firebaseDelete)); message.textContent="Lesson deleted."; await refreshList(); }
  catch(err) { message.textContent=friendlyError(err); }
}, true);
