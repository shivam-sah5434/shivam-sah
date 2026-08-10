
/* Dynamic background: lightweight particles + touch/mouse parallax. */
(() => {
  const canvas = document.getElementById('dynamic-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
  let particles = [];
  const pointer = { x: innerWidth / 2, y: innerHeight / 2, active: false, tx: innerWidth / 2, ty: innerHeight / 2 };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  function resize(){
    w = innerWidth; h = innerHeight; dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.floor(w*dpr); canvas.height = Math.floor(h*dpr);
    canvas.style.width = w+'px'; canvas.style.height = h+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const count = Math.min(95, Math.max(38, Math.floor((w*h)/17000)));
    particles = Array.from({length:count}, () => ({
      x: Math.random()*w, y: Math.random()*h,
      vx:(Math.random()-.5)*.24, vy:(Math.random()-.5)*.24,
      r:Math.random()*1.7+.45, phase:Math.random()*Math.PI*2
    }));
  }
  resize();
  addEventListener('resize', resize, {passive:true});

  function move(x,y){
    pointer.tx=x; pointer.ty=y; pointer.active=true;
    document.documentElement.style.setProperty('--mx', `${(x/w)*100}%`);
    document.documentElement.style.setProperty('--my', `${(y/h)*100}%`);
    const dx=(x-w/2)/w, dy=(y-h/2)/h;
    document.documentElement.style.setProperty('--hero-x', `${dx*10}px`);
    document.documentElement.style.setProperty('--hero-y', `${dy*7}px`);
  }
  addEventListener('pointermove', e => move(e.clientX,e.clientY), {passive:true});
  addEventListener('touchmove', e => {
    const t=e.touches[0]; if(t) move(t.clientX,t.clientY);
  }, {passive:true});
  addEventListener('pointerleave', () => pointer.active=false, {passive:true});

  function draw(t){
    ctx.clearRect(0,0,w,h);
    if(reduced.matches){ requestAnimationFrame(draw); return; }
    pointer.x += (pointer.tx-pointer.x)*.055; pointer.y += (pointer.ty-pointer.y)*.055;
    const light = body.classList.contains('light');
    const dot = light ? 'rgba(8,127,180,.25)' : 'rgba(78,203,255,.34)';
    const line = light ? 'rgba(8,127,180,.045)' : 'rgba(78,203,255,.065)';

    for(const p of particles){
      p.x += p.vx; p.y += p.vy;
      if(p.x < -20) p.x=w+20; if(p.x>w+20) p.x=-20;
      if(p.y < -20) p.y=h+20; if(p.y>h+20) p.y=-20;

      const dx=p.x-pointer.x, dy=p.y-pointer.y, dist=Math.hypot(dx,dy);
      if(pointer.active && dist<170){
        const force=(170-dist)/170*.012;
        p.x += dx*force; p.y += dy*force;
      }
      const pulse=.72+.28*Math.sin(t*.001+p.phase);
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r*pulse,0,Math.PI*2);
      ctx.fillStyle=dot; ctx.fill();
    }

    // Connect only nearby particles, keeping the effect subtle.
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const a=particles[i], b=particles[j], dx=a.x-b.x, dy=a.y-b.y, dist2=dx*dx+dy*dy;
        if(dist2<10500){
          const alpha=(1-Math.sqrt(dist2)/102.5)*.7;
          ctx.strokeStyle=line.replace(/[\d.]+\)$/,'') + alpha + ')';
          ctx.lineWidth=.55;
          ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
        }
      }
    }

    // Soft cursor/touch halo.
    if(pointer.active){
      const g=ctx.createRadialGradient(pointer.x,pointer.y,0,pointer.x,pointer.y,150);
      g.addColorStop(0, light?'rgba(8,127,180,.075)':'rgba(78,203,255,.09)');
      g.addColorStop(1,'rgba(78,203,255,0)');
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(pointer.x,pointer.y,150,0,Math.PI*2); ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();


const body = document.body;
const themeToggle = document.querySelector('#themeToggle');
const menuBtn = document.querySelector('#menuBtn');
const navLinks = document.querySelector('#navLinks');
const topBtn = document.querySelector('#topBtn');
const toast = document.querySelector('#toast');
const sections = [...document.querySelectorAll('main section[id]')];
const navAnchors = [...document.querySelectorAll('.nav-links a')];

function setTheme(theme){
  body.classList.toggle('light', theme === 'light');
  localStorage.setItem('shivam-theme', theme);
  themeToggle.setAttribute('aria-label', theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
  themeToggle.innerHTML = theme === 'light' ? '☾' : '☼';
}
const savedTheme = localStorage.getItem('shivam-theme');
setTheme(savedTheme || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'));

themeToggle.addEventListener('click', () => setTheme(body.classList.contains('light') ? 'dark' : 'light'));

menuBtn.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
  menuBtn.textContent = open ? '×' : '☰';
});
navAnchors.forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn.textContent = '☰';
}));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){ entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
  });
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
    }
  });
},{rootMargin:'-35% 0px -55% 0px'});
sections.forEach(section => sectionObserver.observe(section));

window.addEventListener('scroll', () => topBtn.classList.toggle('show', scrollY > 650), {passive:true});
topBtn.addEventListener('click', () => scrollTo({top:0, behavior:'smooth'}));

function showToast(message){
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 3000);
}

const projectData = {
  "Green Hydrogen Production Using Alkaline Water Electrolysis": {
    description:"Exploring alkaline water electrolysis for green hydrogen production using renewable electricity, with a focus on process simulation and equipment modelling.",
    tech:["Aspen Plus","Process Simulation","Chemical Engineering"]
  },
  "Canned Mushroom Manufacturing Process": {
    description:"Academic process design project focused on the manufacturing process, unit operations, material balance, and industrial considerations involved in canned mushroom production.",
    tech:["Material Balance","Unit Operations","Process Design"]
  },
  "Rotary Drum Dryer": {
    description:"Study and design of a rotary drum drying system, including operating principles, heat and mass transfer considerations, and industrial applications.",
    tech:["Heat Transfer","Mass Transfer","Equipment Design"]
  },
  "Vicks VapoRub Purification": {
    description:"Process study involving purification using short-path distillation and analysis of separation principles.",
    tech:["Separation Processes","Distillation","Process Analysis"]
  },
  "Shoe Polish Manufacturing": {
    description:"Chemical process industry project covering formulation, manufacturing process, equipment, and industrial production considerations.",
    tech:["CPI","Formulation","Equipment"]
  }
};

const modal = document.querySelector('#projectModal');
const modalTitle = document.querySelector('#modalTitle');
const modalDesc = document.querySelector('#modalDesc');
const modalTech = document.querySelector('#modalTech');
document.querySelectorAll('[data-project]').forEach(btn => btn.addEventListener('click', () => {
  const data = projectData[btn.dataset.project];
  if(!data) return;
  modalTitle.textContent = btn.dataset.project;
  modalDesc.textContent = data.description;
  modalTech.innerHTML = data.tech.map(t => `<span class="tag">${t}</span>`).join('');
  modal.classList.add('open');
  document.body.style.overflow='hidden';
}));
function closeModal(){ modal.classList.remove('open'); document.body.style.overflow=''; }
document.querySelector('#modalClose').addEventListener('click', closeModal);
modal.addEventListener('click', e => { if(e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeModal(); });

document.querySelector('#contactForm').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.currentTarget;
  const submit = form.querySelector('button[type="submit"]');
  const name = document.querySelector('#name').value.trim();
  const email = document.querySelector('#email').value.trim();
  const message = document.querySelector('#message').value.trim();
  const API_BASE_URL = window.API_BASE_URL || '';

  // GitHub Pages is static. If no backend URL is configured, use mailto instead of
  // sending a request to a nonexistent /api/contact endpoint.
  if (!API_BASE_URL) {
    const subject = encodeURIComponent(`Portfolio contact from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    window.location.href = `mailto:079bch041.shivam@pcampus.edu.np?subject=${subject}&body=${body}`;
    form.reset();
    showToast('Opening your email app…');
    return;
  }

  submit.disabled = true;
  submit.innerHTML = 'Sending…';

  try {
    const response = await fetch(`${API_BASE_URL}/api/contact`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({name, email, message})
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Unable to send message.');
    form.reset();
    showToast(result.message || 'Message sent successfully.');
  } catch (error) {
    showToast(error.message || 'Could not send your message.');
  } finally {
    submit.disabled = false;
    submit.innerHTML = 'Send Message <span>→</span>';
  }
});

document.querySelector('#year').textContent = new Date().getFullYear();
