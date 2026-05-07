// anim.js — Battle animations, achievement popup, init
// ────────────────────────────────────────────────────────────
"use strict";

function animBossHit(dmg, isCrit=false){
  const sp = document.getElementById('b-sp');
  const ba = sp?.closest('.ba');
  if(!sp) return;

  // Shake + hit animation
  sp.classList.remove('hit','shake','heal');
  void sp.offsetWidth; // reflow
  sp.classList.add('hit');
  if(ba){ ba.classList.remove('flash-hit'); void ba.offsetWidth; ba.classList.add('flash-hit'); }

  // Floating damage number
  spawnDmgFloat('-'+dmg, isCrit?'crit':'');

  setTimeout(()=>sp.classList.remove('hit','flash-hit'), 600);
}

function animBossAttack(){
  const sp = document.getElementById('b-sp');
  if(!sp) return;
  sp.classList.remove('hit','shake','heal');
  void sp.offsetWidth;
  sp.classList.add('heal'); // boss glows when attacking
  setTimeout(()=>sp.classList.remove('heal'), 600);
}

function animBossDeath(){
  const sp = document.getElementById('b-sp');
  if(!sp) return;
  sp.classList.remove('hit','shake','heal');
  void sp.offsetWidth;
  sp.classList.add('dying');
  spawnDmgFloat('☠ DERROTADO!','crit');
}

function animDotHit(dmg){
  spawnDmgFloat('☠'+dmg,'dot');
  const sp = document.getElementById('b-sp');
  if(sp){ sp.classList.remove('hit'); void sp.offsetWidth; sp.classList.add('hit');
    setTimeout(()=>sp.classList.remove('hit'),400); }
}

function spawnDmgFloat(text, cls=''){
  const area = document.getElementById('dmg-float-area');
  if(!area) return;
  const el = document.createElement('div');
  el.className = 'dmg-float' + (cls?' '+cls:'');
  el.textContent = text;
  // Random horizontal offset for variety
  const offset = (Math.random()-0.5)*60;
  el.style.left = `calc(50% + ${offset}px)`;
  area.appendChild(el);
  setTimeout(()=>el.remove(), 950);
}
// ═══════════════════════════════════════════════════════════════
// END BOSS ANIMATIONS
// ═══════════════════════════════════════════════════════════════


// ═══════════════════════════════════════════════════════════════
// ACHIEVEMENT POPUP SYSTEM
// ═══════════════════════════════════════════════════════════════
let achQueue = [];
let achPlaying = false;

function triggerAchPopup(ach){
  achQueue.push(ach);
  if(!achPlaying) playNextAch();
}

function playNextAch(){
  if(!achQueue.length){ achPlaying=false; return; }
  achPlaying = true;
  const ach = achQueue.shift();

  const popup  = document.getElementById('ach-popup');
  const card   = document.getElementById('ach-card');
  const icon   = document.getElementById('ach-icon');
  const name   = document.getElementById('ach-name');
  const desc   = document.getElementById('ach-desc');
  if(!popup||!card) return;

  icon.textContent  = ach.ic || '🏆';
  name.textContent  = ach.lb;
  desc.textContent  = ach.ds;

  // Reset card animation
  card.classList.remove('out');
  card.style.animation = 'none';
  void card.offsetWidth;
  card.style.animation = '';

  popup.classList.add('active');
  spawnAchParticles(popup);

  // Auto-dismiss after 2.8s
  setTimeout(()=>{
    card.classList.add('out');
    setTimeout(()=>{
      popup.classList.remove('active');
      // Remove particles
      popup.querySelectorAll('.ach-particle').forEach(p=>p.remove());
      setTimeout(playNextAch, 300);
    }, 480);
  }, 2800);
}

function spawnAchParticles(popup){
  const colors = ['#c9a84c','#f5e098','#e8c96b','#fff8e0','#ffd700'];
  const cx = window.innerWidth/2, cy = window.innerHeight/2;
  for(let i=0;i<24;i++){
    const p = document.createElement('div');
    p.className = 'ach-particle';
    const angle = (i/24)*Math.PI*2;
    const dist  = 80 + Math.random()*140;
    const px    = Math.cos(angle)*dist;
    const py    = Math.sin(angle)*dist;
    const size  = 4 + Math.random()*8;
    p.style.cssText = `
      left:${cx}px;top:${cy}px;
      width:${size}px;height:${size}px;
      background:${colors[i%colors.length]};
      --px:${px}px;--py:${py}px;
      animation-delay:${Math.random()*0.3}s;
      animation-duration:${0.8+Math.random()*0.5}s;
    `;
    popup.appendChild(p);
  }
}

// Click anywhere to dismiss early
document.addEventListener('click', ()=>{
  const popup=document.getElementById('ach-popup');
  const card=document.getElementById('ach-card');
  if(popup?.classList.contains('active')&&card&&!card.classList.contains('out')){
    card.classList.add('out');
    setTimeout(()=>{
      popup.classList.remove('active');
      popup.querySelectorAll('.ach-particle').forEach(p=>p.remove());
      setTimeout(playNextAch,200);
    },480);
  }
});
// ═══════════════════════════════════════════════════════════════
// END ACHIEVEMENT POPUP
// ═══════════════════════════════════════════════════════════════

// =============== INIT ===============
// Pre-populate FX_TIP_MAP for all items
EDB.forEach(eq=>{
  if(eq.fx) FX_TIP_MAP[eq.id]={
    name:  eq.fx.emoji+' '+eq.fx.label,
    desc:  getFxDescription(eq.fx),
    chance:'Chance: '+Math.round(eq.fx.chance*100)+'% por missão'+(eq.fx.dot?' · DoT: '+eq.fx.dotTurns+' turnos':''),
    color: eq.fx.color
  };
});
setupPWA();
if(!S.activeDots) S.activeDots=[];
if(!S.playerClass) S.playerClass=null;
checkBW();
if(S.avData)applyAv(S.avData);
genQ();checkEvExp();startEv();renderAll();
// Init navigation
switchCat('main');
// Register crafted items that may be in save
CRAFT_EDB.forEach(item=>{ if(!EDB.find(e=>e.id===item.id)) EDB.push(item); });
if(S.totXp===0&&S.gold===0)setTimeout(()=>notify('⚔','Bem-vindo, Guerreiro!','Complete missões para ganhar Cristais 💎 e forje seus primeiros equipamentos no Ferreiro!','ng'),600);
setInterval(()=>{checkEvExp();renderEvBanner();},60000);
