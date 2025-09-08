/* =========================
   Modern SmartCore JS
   - rendering courses/teachers/events
   - typing hero effect
   - enrollments (localStorage)
   - CSV download
   - intersection animations
   - simple responsive nav
   - contact form EmailJS placeholder
   ========================= */

// -- Data (example content)
const COURSES = [
  { id:'c1', title:'Mathematics Mastery', desc:'Algebra, geometry & problem solving.', img:'images/course1.jpg', price:'$800' },
  { id:'c2', title:'Foundations of Science', desc:'Hands-on physics & chemistry labs.', img:'images/course2.jpg', price:'$1,000' },
  { id:'c3', title:'Web Development Bootcamp', desc:'HTML, CSS, JS, and real projects.', img:'images/course3.jpg', price:'$2,000' }
];

const TEACHERS = [
  { name:'Mr. Alex', role:'Mathematics Expert', img:'images/teacher1.jpg', linkedin:'#'},
  { name:'Ms. Grace', role:'Science Specialist', img:'images/teacher2.jpg', linkedin:'#'},
  { name:'Mr. John', role:'Web Dev Mentor', img:'images/teacher3.jpg', linkedin:'#'}
];

const EVENTS = [
  { date:'2025-09-15', label:'Science Fair', time:'10:00', note:'Student science exhibition & awards.' },
  { date:'2025-10-05', label:'Coding Bootcamp', time:'09:00', note:'Intro to web dev - 2 day workshop.' },
  { date:'2025-11-20', label:'Math Olympiad', time:'08:30', note:'Inter-school competition.' }
];

// -- Utility
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

/* ======= RENDERING ======= */
function renderCourses(){
  const grid = $('#courses-grid');
  grid.innerHTML = '';
  COURSES.forEach(c => {
    const card = document.createElement('article');
    card.className = 'course-card fade-in';
    card.innerHTML = `
      <div class="course-media" style="background-image:url('${c.img}')"></div>
      <div>
        <div class="course-title">${c.title}</div>
        <div class="course-desc">${c.desc}</div>
      </div>
      <div class="course-meta">
        <div class="course-price">${c.price}</div>
        <div class="course-actions">
          <button class="btn ghost" onclick="openPreview('${c.id}')">Preview</button>
          <button class="btn primary" onclick="enrollCourse('${c.id}')">Enroll</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function renderTeachers(){
  const grid = $('#teachers-grid');
  grid.innerHTML = '';
  TEACHERS.forEach(t => {
    const el = document.createElement('div');
    el.className = 'teacher-card fade-in';
    el.innerHTML = `
      <img class="teacher-avatar" src="${t.img}" alt="${t.name}">
      <div class="teacher-name">${t.name}</div>
      <div class="teacher-role">${t.role}</div>
      <div class="socials"><a href="${t.linkedin}" aria-label="LinkedIn">${t.linkedin ? '🔗' : ''}</a></div>
    `;
    grid.appendChild(el);
  });
}

function renderTimeline(){
  const wrap = $('#timeline');
  wrap.innerHTML = '';
  EVENTS.forEach(ev => {
    const item = document.createElement('div');
    item.className = 'timeline-item fade-in';
    item.innerHTML = `
      <div class="timeline-dot" aria-hidden="true"></div>
      <div class="timeline-content">
        <div class="timeline-time">${new Date(ev.date).toLocaleDateString()} • ${ev.time}</div>
        <div class="timeline-label"><strong>${ev.label}</strong></div>
        <div class="timeline-note muted">${ev.note}</div>
      </div>
    `;
    wrap.appendChild(item);
  });
}

/* ======= TYPING EFFECT (hero) ======= */
const TYPER_WORDS = ['Hands-on Projects','Career-ready Skills','Supportive Mentors'];
function typeEffect(target, words, speed=80, pause=1600){
  let i=0, wordIndex=0, forward=true, curr='';
  function tick(){
    const full = words[wordIndex];
    if(forward){
      curr = full.slice(0, i++);
      if(i > full.length){ forward=false; setTimeout(tick,pause); return; }
    } else {
      curr = full.slice(0, i--);
      if(i === 0){ forward=true; wordIndex=(wordIndex+1)%words.length; }
    }
    target.textContent = curr;
    setTimeout(tick, speed);
  }
  tick();
}

/* ======= ENROLLMENTS (localStorage) ======= */
const STORAGE_KEY = 'smartcore_enrollments_v1';
let enrollments = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

function saveEnrollments(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(enrollments)); renderEnrollments(); }

function enrollCourse(id){
  const c = COURSES.find(x=>x.id===id);
  if(!c) return;
  if(enrollments.some(e => e.id===id)){
    toast('Course already in enrollments', 'info'); return;
  }
  enrollments.push({id:c.id,title:c.title,added:new Date().toISOString()});
  saveEnrollments();
  toast('Added to My Enrollments', 'success');
}

function renderEnrollments(){
  const list = $('#enroll-list');
  list.innerHTML = '';
  if(enrollments.length===0){
    list.innerHTML = `<p class="muted">No enrollments yet — add a course to get started.</p>`;
    return;
  }
  enrollments.forEach(e=>{
    const row = document.createElement('div');
    row.className='enroll-card';
    row.innerHTML = `<div>${e.title}</div><div><span class="enroll-badge">${new Date(e.added).toLocaleDateString()}</span></div>`;
    list.appendChild(row);
  });
}

function clearEnrollments(){
  if(!confirm('Clear all enrollments?')) return;
  enrollments = []; saveEnrollments();
  toast('Enrollments cleared', 'info');
}

function downloadEnrollmentsCSV(){
  if(enrollments.length===0) return alert('No enrollments to download');
  let csv = 'Course,Date,Time\n';
  enrollments.forEach(e=>{
    const d = new Date(e.added);
    csv += `${e.title},${d.toLocaleDateString()},${d.toLocaleTimeString()}\n`;
  });
  const blob = new Blob([csv], {type:'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download='enrollments.csv'; a.click();
  URL.revokeObjectURL(url);
}

/* ======= NAV (hamburger) ======= */
const hamburger = $('#hamburger');
hamburger && hamburger.addEventListener('click', e=>{
  const nav = document.querySelector('.nav-links');
  const expanded = hamburger.getAttribute('aria-expanded')==='true';
  hamburger.setAttribute('aria-expanded', (!expanded).toString());
  nav.style.display = expanded ? '' : 'flex';
});

/* ======= SCROLL + FADE IN ======= */
function setupObservers(){
  const faders = $$('.fade-in');
  const io = new IntersectionObserver((entries, obs)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, {threshold:0.18, rootMargin:'0px 0px -40px 0px'});
  faders.forEach(f => io.observe(f));
}

/* ======= FLIGHTS / PREVIEW (simple modal) ======= */
function openPreview(id){
  const course = COURSES.find(c=>c.id===id);
  if(!course) return;
  alert(`${course.title}\n\n${course.desc}\n\nPrice: ${course.price}`);
}

/* ======= TOAST (tiny) ======= */
function toast(msg, type='success'){
  const t = document.createElement('div'); t.className = 'toast';
  t.style.position='fixed'; t.style.right='18px'; t.style.bottom='18px'; t.style.background= type==='success' ? 'linear-gradient(90deg,#2a7dff,#0066ff)' : '#67757f';
  t.style.color='#fff'; t.style.padding='10px 14px'; t.style.borderRadius='10px'; t.style.boxShadow='0 8px 30px rgba(2,8,23,0.12)';
  t.textContent = msg; document.body.appendChild(t);
  setTimeout(()=> t.style.opacity=0,2400); setTimeout(()=> t.remove(),3000);
}

/* ======= CONTACT FORM (EmailJS placeholders) ======= */
const contactForm = $('#contact-form');
contactForm && contactForm.addEventListener('submit', function(e){
  e.preventDefault();
  const status = $('#contact-status');
  status.textContent = 'Sending…';
  // To enable real email sending:
  // 1) include EmailJS SDK in HTML
  // 2) call emailjs.init('YOUR_USER_ID')
  // 3) emailjs.sendForm('YOUR_SERVICE_ID','YOUR_TEMPLATE_ID',this)
  // For now simulate:
  setTimeout(()=>{ status.textContent='Message sent — we will reply shortly!'; contactForm.reset(); }, 900);
});

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  renderCourses();
  renderTeachers();
  renderTimeline();
  renderEnrollments();
  setupObservers();

  // typing effect
  const typeTarget = document.getElementById('type-target');
  if(typeTarget) typeEffect(typeTarget, TYPER_WORDS);

  // wire enrollment buttons
  $('#download-enrollments')?.addEventListener('click', downloadEnrollmentsCSV);
  $('#clear-enrollments')?.addEventListener('click', clearEnrollments);
  $('#enrollments-btn')?.addEventListener('click', ()=>document.getElementById('enrollments').scrollIntoView({behavior:'smooth'}));
});
