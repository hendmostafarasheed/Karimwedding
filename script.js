const openBtn=document.getElementById('openBtn');
const cover=document.getElementById('cover');
const invitation=document.getElementById('invitation');
const bgMusic=document.getElementById('bgMusic');
const musicToggle=document.getElementById('musicToggle');

function updateMusicButton(){
  const playing=bgMusic&&!bgMusic.paused;
  musicToggle.textContent=playing?'♫':'▶';
  musicToggle.classList.toggle('playing',playing);
  musicToggle.setAttribute('aria-label',playing?'Pause music':'Play music');
}
openBtn.addEventListener('click',async()=>{
  cover.classList.add('opening');
  setTimeout(()=>{cover.style.display='none';invitation.classList.remove('hidden');window.scrollTo({top:0});initReveal();},500);
  try{await bgMusic.play()}catch(e){}
  updateMusicButton();
});
musicToggle.addEventListener('click',async()=>{if(bgMusic.paused){try{await bgMusic.play()}catch(e){}}else bgMusic.pause();updateMusicButton()});
bgMusic.addEventListener('play',updateMusicButton);bgMusic.addEventListener('pause',updateMusicButton);

const weddingDate=new Date('2026-11-08T18:00:00+02:00').getTime();
function updateCountdown(){
  let diff=Math.max(0,weddingDate-Date.now());
  const d=Math.floor(diff/86400000),h=Math.floor(diff%86400000/3600000),m=Math.floor(diff%3600000/60000),s=Math.floor(diff%60000/1000);
  document.getElementById('days').textContent=String(d).padStart(2,'0');
  document.getElementById('hours').textContent=String(h).padStart(2,'0');
  document.getElementById('minutes').textContent=String(m).padStart(2,'0');
  document.getElementById('seconds').textContent=String(s).padStart(2,'0');
  document.getElementById('countdownMessage').textContent=Date.now()>=weddingDate?'Today is the day! ✦':'';
}
updateCountdown();setInterval(updateCountdown,1000);

function initReveal(){
  const els=document.querySelectorAll('.section-reveal');
  const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});
  els.forEach(el=>io.observe(el));
}

// Glitter / sparkles / floating particles
const canvas=document.getElementById('fxCanvas'),ctx=canvas.getContext('2d');
let W,H,particles=[];
function resize(){W=canvas.width=innerWidth*devicePixelRatio;H=canvas.height=innerHeight*devicePixelRatio;canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0)}
function makeParticle(){return{x:Math.random()*innerWidth,y:innerHeight+Math.random()*80,r:Math.random()*1.8+.3,v:Math.random()*.55+.15,drift:(Math.random()-.5)*.35,a:Math.random()*.55+.15,tw:Math.random()*Math.PI*2}}
function seed(){particles=Array.from({length:Math.min(95,Math.floor(innerWidth/10))},makeParticle)}
function animate(){ctx.clearRect(0,0,innerWidth,innerHeight);for(const p of particles){p.y-=p.v;p.x+=p.drift;p.tw+=.04;if(p.y<-10){Object.assign(p,makeParticle());p.y=innerHeight+10}const glow=(Math.sin(p.tw)+1)/2;ctx.globalAlpha=p.a*(.45+.55*glow);ctx.fillStyle='#d9b56e';ctx.beginPath();ctx.arc(p.x,p.y,p.r*(.8+glow),0,Math.PI*2);ctx.fill()}ctx.globalAlpha=1;requestAnimationFrame(animate)}
addEventListener('resize',()=>{resize();seed()});resize();seed();animate();

// Tap/click sparkle burst
function burst(x,y){for(let i=0;i<18;i++){const s=document.createElement('span');s.textContent='✦';s.className='burst';s.style.left=x+'px';s.style.top=y+'px';s.style.setProperty('--dx',(Math.random()*120-60)+'px');s.style.setProperty('--dy',(Math.random()*120-60)+'px');document.body.appendChild(s);setTimeout(()=>s.remove(),850)}}
document.addEventListener('click',e=>{if(e.target.closest('button,.location-btn,.rsvp-btn'))burst(e.clientX,e.clientY)});

// Shared RSVP click counter using a public counter endpoint, with local fallback.
const rsvpBtn=document.getElementById('rsvpBtn'),countEl=document.getElementById('rsvpCount'),statusEl=document.getElementById('rsvpStatus');
const counterUrl='https://api.counterapi.dev/v1/karim-laila-wedding/attendance';
async function loadCount(){try{const r=await fetch(counterUrl);if(!r.ok)throw Error();const j=await r.json();countEl.textContent=j.count??j.value??0;return true}catch(e){countEl.textContent=localStorage.getItem('kl_rsvp_count')||'0';return false}}
async function addCount(){rsvpBtn.disabled=true;rsvpBtn.classList.add('clicked');try{const r=await fetch(counterUrl+'/up');if(!r.ok)throw Error();const j=await r.json();countEl.textContent=j.count??j.value??(Number(countEl.textContent)||0)+1;statusEl.textContent='Thank you for celebrating with us ♥';}catch(e){const n=(Number(localStorage.getItem('kl_rsvp_count'))||0)+1;localStorage.setItem('kl_rsvp_count',n);countEl.textContent=n;statusEl.textContent='Your love has been counted on this device ♥'}setTimeout(()=>rsvpBtn.disabled=false,1200)}
rsvpBtn.addEventListener('click',addCount);loadCount();

// Gentle magnetic hover on desktop
if(matchMedia('(pointer:fine)').matches){document.querySelectorAll('.magnetic').forEach(btn=>btn.addEventListener('mousemove',e=>{const r=btn.getBoundingClientRect();btn.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.08}px,${(e.clientY-r.top-r.height/2)*.08}px)`;btn.addEventListener('mouseleave',()=>btn.style.transform='',{once:true})}))}
