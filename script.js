/* Divine Academy learning features. Data is stored locally in this browser. */
(() => {
  const DATA_KEY = "divineAcademyLessonsV2";
  const SAVED_KEY = "divineAcademySavedV2";
  const DONE_KEY = "divineAcademyCompletedV2";
  const LAST_KEY = "divineAcademyLastLessonV2";
  const POS_KEY = "divineAcademyPositionsV2";
  const subjects = { maths:"Mathematics", science:"Science", english:"English" };
  const samples = [
    {id:"m11-1",className:"Class 11",subject:"maths",chapter:"Sets",lessonNumber:1,title:"Introduction to Sets",description:"Understand sets, elements, and basic notation.",url:"https://www.youtube.com/watch?v=H6w2c4e2f8Q"},
    {id:"m11-2",className:"Class 11",subject:"maths",chapter:"Sets",lessonNumber:2,title:"Types of Sets",description:"Explore empty, finite, infinite, and equal sets.",url:"https://www.youtube.com/watch?v=H6w2c4e2f8Q"},
    {id:"s11-1",className:"Class 11",subject:"science",chapter:"Physical World",lessonNumber:1,title:"Introduction to Physics",description:"An introductory lesson for Class 11 Physics.",url:"https://www.youtube.com/watch?v=H6w2c4e2f8Q"},
    {id:"e11-1",className:"Class 11",subject:"english",chapter:"Reading Skills",lessonNumber:1,title:"How to Read a Passage",description:"Practice a simple strategy for reading comprehension.",url:"https://www.youtube.com/watch?v=H6w2c4e2f8Q"}
  ];
  const get = (key, fallback) => { try { const v=localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch(e){ return fallback; } };
  const set = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const allLessons = () => get(DATA_KEY, samples).slice().sort((a,b) => (a.subject||"").localeCompare(b.subject||"") || (a.className||"").localeCompare(b.className||"") || (a.chapter||"").localeCompare(b.chapter||"") || Number(a.lessonNumber)-Number(b.lessonNumber));
  const saved = () => get(SAVED_KEY, []);
  const done = () => get(DONE_KEY, []);
  const lessonById = id => allLessons().find(x => x.id === id);
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const watchUrl = l => `watch.html?id=${encodeURIComponent(l.id)}`;
  const videoId = url => {
    try {
      const u = new URL(url);
      if (u.hostname.includes("youtu.be")) return u.pathname.split("/").filter(Boolean)[0] || "";
      if (u.hostname.includes("youtube.com") || u.hostname.includes("youtube-nocookie.com")) {
        if (u.searchParams.get("v")) return u.searchParams.get("v");
        const bits = u.pathname.split("/").filter(Boolean);
        const i = bits.findIndex(x => ["embed","shorts","live"].includes(x));
        return i >= 0 ? bits[i+1] || "" : "";
      }
    } catch(e) {}
    return "";
  };
  const isYouTube = url => !!videoId(url);
  const linkRow = (l, opts={}) => `<a class="lesson-row ${opts.current?'current':''}" href="${watchUrl(l)}"><span class="lesson-number">${esc(l.lessonNumber)}</span><span class="lesson-info"><strong>${esc(l.title)}</strong><small>${esc(l.className)} • ${esc(l.chapter)}${opts.subject ? " • "+esc(subjects[l.subject]||l.subject):""}</small></span><span class="lesson-status">${done().includes(l.id)?"✓ Done":saved().includes(l.id)?"☆ Saved":"Watch →"}</span></a>`;
  const empty = text => `<div class="empty-state">${esc(text)}</div>`;
  const renderSubject = () => {
    const root = document.getElementById("lesson-list"); if (!root) return;
    const params = new URLSearchParams(location.search), subject = params.get("subject") || "maths";
    const classFilter = params.get("class");
    const list = allLessons().filter(l=>l.subject===subject && (!classFilter || l.className===classFilter));
    document.title = `${classFilter ? classFilter + " " : ""}${subjects[subject]||"Subject"} Lessons | Divine Academy`;
    document.getElementById("subject-title").textContent = `${classFilter ? classFilter + " • " : ""}${subjects[subject]||"Subject"} Lessons`;
    document.getElementById("subject-description").textContent = `${classFilter ? classFilter + " • " : "Classes 11–12 • "}Chapter-wise lessons arranged in serial order.`;
    document.querySelectorAll("[data-subject]").forEach(a=>a.classList.toggle("active",a.dataset.subject===subject));
    root.innerHTML = list.length ? list.map((l,i)=>linkRow(l,{subject:true})).join("") : empty("No lessons added yet. Use Add Lessons to add your first video.");
    const finished = list.filter(l=>done().includes(l.id)).length;
    document.getElementById("progress-label").textContent = `${finished} of ${list.length} lessons completed`;
    document.getElementById("progress-fill").style.width = `${list.length ? finished/list.length*100 : 0}%`;
    const lastId = get(LAST_KEY,null), last = list.find(l=>l.id===lastId) || list.find(l=>!done().includes(l.id)) || list[0];
    document.getElementById("continue-area").innerHTML = last ? `<div class="continue-card"><strong>${esc(last.title)}</strong><p>${esc(last.className)} • ${esc(last.chapter)}</p><a class="action-btn" href="${watchUrl(last)}">${last.id===lastId?"Continue watching":"Start learning"} →</a></div>` : empty("Your next lesson will appear here.");
    const saveList = list.filter(l=>saved().includes(l.id));
    document.getElementById("saved-area").innerHTML = saveList.length ? saveList.map(l=>linkRow(l)).join("") : empty("Lessons you save will appear here.");
  };
  const renderWatch = () => {
    const player=document.getElementById("player"); if(!player) return;
    const id = new URLSearchParams(location.search).get("id"), l = lessonById(id);
    if(!l){ player.innerHTML=`<div class="player-placeholder">Lesson not found. <a style="color:white" href="courses.html">Browse subjects</a></div>`; return; }
    set(LAST_KEY,l.id);
    document.getElementById("watch-subject").textContent=`${l.className} • ${subjects[l.subject]||l.subject} • ${l.chapter} • Lesson ${l.lessonNumber}`;
    document.getElementById("watch-title").textContent=l.title;
    document.getElementById("watch-description").textContent=l.description||"";
    const vid=videoId(l.url);
    if(vid && location.protocol === "file:") {
      player.innerHTML=`<div class="player-placeholder"><h3>Video player needs a website connection</h3><p>You're opening this page directly from your computer. Open Divine Academy through its website address or start it with a local web server to play lessons.</p><p style="font-size:13px;opacity:.85">The lesson will play inside this page when opened through HTTP/HTTPS.</p></div>`;
    } else if(vid) {
      // Privacy-enhanced embed. YouTube may still show its own player controls/branding; this site does not add a separate source label.
      player.innerHTML=`<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(vid)}?rel=0&playsinline=1&modestbranding=1" title="${esc(l.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen loading="lazy"></iframe>`;
    } else if(/\.mp4($|\?)/i.test(l.url)) player.innerHTML=`<video controls playsinline src="${esc(l.url)}"></video>`;
    else player.innerHTML=`<div class="player-placeholder">This video link could not be played. Check the link or use a direct MP4 file URL.</div>`;
    const saveBtn=document.getElementById("save-button");
    const refreshSave=()=>{saveBtn.textContent=saved().includes(l.id)?"★ Saved for later":"☆ Save for later";};
    saveBtn.onclick=()=>{let s=saved();s=s.includes(l.id)?s.filter(x=>x!==l.id):[...s,l.id];set(SAVED_KEY,s);refreshSave();};
    const doneBtn=document.getElementById("complete-button");
    const refreshDone=()=>{doneBtn.textContent=done().includes(l.id)?"✓ Completed (undo)":"✓ Mark completed";};
    doneBtn.onclick=()=>{let d=done();d=d.includes(l.id)?d.filter(x=>x!==l.id):[...d,l.id];set(DONE_KEY,d);refreshDone();renderWatchList(l);};
    refreshSave();refreshDone();
    const same = allLessons().filter(x=>x.subject===l.subject && x.className===l.className);
    const idx=same.findIndex(x=>x.id===l.id), prev=same[idx-1], next=same[idx+1];
    const prevBtn=document.getElementById("prev-button"), nextBtn=document.getElementById("next-button");
    if(prev){prevBtn.href=watchUrl(prev);prevBtn.style.display="inline-block";}else prevBtn.style.display="none";
    if(next){nextBtn.href=watchUrl(next);nextBtn.style.display="inline-block";}else {nextBtn.style.display="none"; document.getElementById("watch-note").textContent="You reached the end of this subject's lessons. Great work!";}
    renderWatchList(l);
  };
  const renderWatchList = current => {const root=document.getElementById("watch-lesson-list");if(!root)return;const list=allLessons().filter(x=>x.subject===current.subject&&x.className===current.className);root.innerHTML=list.map(l=>linkRow(l,{current:l.id===current.id})).join("");};
  const renderDashboard = () => {
    if(!document.getElementById("dashboard-continue"))return;
    const all=allLessons(), last=lessonById(get(LAST_KEY,null));
    document.getElementById("dashboard-continue").innerHTML=last?linkRow(last,{subject:true}):empty("You have not started a lesson yet.");
    const savedLessons=all.filter(l=>saved().includes(l.id));
    document.getElementById("dashboard-saved").innerHTML=savedLessons.length?savedLessons.map(l=>linkRow(l,{subject:true})).join(""):empty("Save a lesson to watch it later.");
    const completed=all.filter(l=>done().includes(l.id));
    document.getElementById("dashboard-completed").innerHTML=completed.length?completed.map(l=>linkRow(l,{subject:true})).join(""):empty("Completed lessons will show here.");
  };
  const renderAdmin = () => {
    const root=document.getElementById("admin-lesson-list"); if(!root)return;
    const list=allLessons();
    root.innerHTML=list.length?list.map(l=>`<div class="admin-item"><div><strong>${esc(l.title)}</strong><small>${esc(l.className)} • ${esc(subjects[l.subject]||l.subject)} • ${esc(l.chapter)} • Lesson ${esc(l.lessonNumber)}</small></div><button class="soft-btn" data-delete="${esc(l.id)}" type="button">Delete</button></div>`).join(""):empty("No lessons saved.");
    root.querySelectorAll("[data-delete]").forEach(b=>b.onclick=()=>{const id=b.dataset.delete;set(DATA_KEY,allLessons().filter(l=>l.id!==id));set(SAVED_KEY,saved().filter(x=>x!==id));set(DONE_KEY,done().filter(x=>x!==id));renderAdmin();});
  };
  const setupAdmin = () => {
    const form=document.getElementById("lesson-form"); if(!form)return;
    if(!localStorage.getItem(DATA_KEY))set(DATA_KEY,samples);
    form.onsubmit=e=>{
      e.preventDefault(); const f=new FormData(form), url=String(f.get("url")||"").trim();
      if(!isYouTube(url)&&!/^https?:\/\/.+\.mp4($|\?)/i.test(url)){document.getElementById("admin-message").textContent="Please enter a valid YouTube URL or a direct MP4 video URL.";return;}
      const subject=String(f.get("subject")), chapter=String(f.get("chapter")).trim(), lessonNumber=Number(f.get("lessonNumber"));
      const item={id:"da-"+Date.now()+"-"+Math.random().toString(36).slice(2,7),className:String(f.get("className")),subject,chapter,lessonNumber,title:String(f.get("title")).trim(),url,description:String(f.get("description")||"").trim()};
      const list=allLessons();list.push(item);set(DATA_KEY,list);
      document.getElementById("admin-message").textContent="Lesson added in this browser. It is sorted by class, chapter, and lesson number on the subject page.";
      form.reset();form.elements.lessonNumber.value=1;renderAdmin();
    };
    document.getElementById("restore-demo").onclick=()=>{set(DATA_KEY,samples);document.getElementById("admin-message").textContent="Sample lessons restored.";renderAdmin();};
    renderAdmin();
  };
  // Responsive menu helper
  document.querySelectorAll(".menu-toggle").forEach(btn=>btn.addEventListener("click",()=>{const nav=btn.parentElement.querySelector(".site-nav, .main-nav");if(!nav)return;const open=nav.classList.toggle("open");btn.setAttribute("aria-expanded",String(open));}));
  renderSubject();renderWatch();renderDashboard();setupAdmin();
})();