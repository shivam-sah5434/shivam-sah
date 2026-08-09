
// ===== Persistent light/dark theme =====
const themeToggle = document.getElementById('themeToggle');

function applyTheme(theme){
  const dark = theme === 'dark';
  document.body.classList.toggle('dark-mode', dark);
  if(themeToggle){
    const icon = themeToggle.querySelector('.theme-icon');
    const label = themeToggle.querySelector('.theme-label');
    if(icon) icon.textContent = dark ? '☀' : '☾';
    if(label) label.textContent = dark ? 'Bright' : 'Dark';
    themeToggle.setAttribute('aria-label', dark ? 'Switch to bright mode' : 'Switch to dark mode');
    themeToggle.title = dark ? 'Switch to bright mode' : 'Switch to dark mode';
  }
}

const savedTheme = localStorage.getItem('shivam-theme');
applyTheme(savedTheme || 'light');

if(themeToggle){
  themeToggle.addEventListener('click', ()=>{
    const next = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
    localStorage.setItem('shivam-theme', next);
    applyTheme(next);
  });
}


const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');
if(menuToggle) menuToggle.addEventListener('click',()=>mobileNav.classList.toggle('open'));

const searchToggle = document.getElementById('searchToggle');
const searchPanel = document.getElementById('searchPanel');
if(searchToggle) searchToggle.addEventListener('click',()=>searchPanel.classList.toggle('open'));

const searchForm = document.getElementById('searchForm');
if(searchForm) searchForm.addEventListener('submit',(e)=>{
  e.preventDefault();
  const q=document.getElementById('searchInput').value.trim().toLowerCase();
  if(!q) return;
  const pages=[
    ['about','about.html'],['educational','educational.html'],['materials','educational.html'],
    ['gallery','gallery.html'],['contact','contact.html'],['engineering','about.html'],
    ['projects','educational.html'],['shivam','index.html']
  ];
  const found=pages.find(([key])=>q.includes(key));
  if(found) window.location.href=found[1];
  else alert('No matching page found. Try: about, educational materials, gallery, or contact.');
});

const contactForm=document.getElementById('contactForm');
if(contactForm) contactForm.addEventListener('submit',(e)=>{
  e.preventDefault();
  const data=new FormData(contactForm);
  const subject=encodeURIComponent('Website enquiry from '+(data.get('firstName')||'Visitor'));
  const body=encodeURIComponent(
    `Name: ${data.get('firstName')||''} ${data.get('lastName')||''}\n`+
    `Email: ${data.get('email')||''}\nPhone: ${data.get('phone')||''}\n\n`+
    `Project Details:\n${data.get('details')||''}`
  );
  window.location.href=`mailto:079bch041.shivam@pcampus.edu.np?subject=${subject}&body=${body}`;
});
