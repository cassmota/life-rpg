// render.js — All render* functions and DOM helpers
// ────────────────────────────────────────────────────────────
"use strict";

const getPS=()=>{const a=S.attrs;return{atk:Math.floor(a.dis.v*.4+a.ene.v*.3+S.lv*2)+eqAtk(),def:Math.floor(a.vit.v*.4+a.men.v*.2+S.lv)+eqDef()};};
const s=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v;};
const sw=(id,st,v)=>{const e=document.getElementById(id);if(e)e.style[st]=v;};

function renderStatus(){
  const lv=S.lv,xn=XPL(lv);
  s('hs-hp',`${S.hp}/${S.mhp}`);s('hs-xp',`${S.xp}/${xn}`);
  s('hs-gl',S.gold.toLocaleString('pt-BR'));
  s('hs-cl',S.cr);
  s('hs-gb2',S.gold);s('hs-cb2',S.cr);
  s('hs-st',S.streak);s('hs-lv',S.lv);s('hs-lv-orb',S.lv);
  s('hs-pw',`+${eqPow()}%`);
  sw('hs-hb','width',Math.min(100,S.hp/S.mhp*100)+'%');
  sw('hs-xb','width',Math.min(100,S.xp/xn*100)+'%');
  // HP bar color + pulse on low HP
  const hpPct=S.hp/S.mhp;
  const hpBar=document.getElementById('hs-hb');
  const hpWrap=document.getElementById('hs-hb-wrap');
  if(hpBar){
    if(hpPct<0.2){
      hpBar.style.background='linear-gradient(90deg,#3a0000,#8b0000 40%,#c0392b 80%,#ff1744 100%)';
    } else if(hpPct<0.5){
      hpBar.style.background='linear-gradient(90deg,#5c0a0a,#a01818 40%,#d63031 80%,#ff4757 100%)';
    } else {
      hpBar.style.background='linear-gradient(90deg,#5c0a0a 0%,#a01818 40%,#d63031 80%,#ff4757 100%)';
    }
    if(hpWrap) hpWrap.classList.toggle('bar-low', hpPct < 0.3);
  }
  // XP near-full pulse
  const xn2=XPL(S.lv);
  const xpPct=S.xp/xn2;
  const xpWrap=document.getElementById('hs-xb-wrap');
  if(xpWrap) xpWrap.classList.toggle('bar-near-full', xpPct >= 0.85);
  // Title label under name
  const t=getTitle();s('hs-title-lbl',t.ti);
  // Update hero name from profile
  const nm=document.getElementById('hs-hero-name');
  if(nm) nm.textContent=S.profile?.name||'Herói';
  // Class tag
  const cls=getClass();
  const ctag=document.getElementById('hs-class-tag');
  if(ctag){
    if(cls){ctag.style.display='flex';const miniSvg=CLASS_SVG[S.playerClass]?CLASS_SVG[S.playerClass].replace('width="56" height="56"','width="20" height="20"'):'';ctag.innerHTML=`${miniSvg||cls.icon} ${cls.name}`;}
    else ctag.style.display='none';
  }
}
function renderDash(){
  const t=getTitle();s('d-ttl',t.ti);s('d-dsc',t.ds);s('d-xp',S.totXp);s('d-go',S.gold);s('d-cr',S.cr);s('d-ki',S.kills);
  s('d-str',S.streak);s('d-ml',`×${getMult().toFixed(1)}`);s('d-pw',`+${eqPow()}%`);
  const top=Object.values(S.attrs).sort((a,b)=>b.v-a.v)[0];s('d-ta',`${top.ic} ${top.nm}`);s('d-tv',`${top.v} pts`);
  const boss=getBoss();const bp=((S.boss.hp/S.boss.mhp)*100).toFixed(0);
  s('d-bs',S.boss.def?`✅ ${boss.nm} derrotado!`:`${boss.em} ${boss.nm} — ${bp}% HP`);
  s('d-ev',S.activeEv?`${EVENTS_DB.find(e=>e.id===S.activeEv.eid)?.em} Evento ativo!`:'Nenhum evento ativo');
  const prev=document.getElementById('d-prev');
  if(prev)prev.innerHTML=S.habits.slice(0,5).map(h=>`<div style="display:flex;align-items:center;gap:7px;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.04)"><span>${h.dn?'✅':'○'}</span><span style="font-size:13px;color:${h.dn?'var(--text2)':'var(--text)'};text-decoration:${h.dn?'line-through':'none'}">${h.ic} ${h.nm}</span><span style="margin-left:auto;font-size:10px;color:var(--gold)">+${h.xb}XP</span><span style="font-size:10px;color:var(--amber2)">+${h.gb}🪙</span></div>`).join('');
  renderStrip();
}
function renderStrip(){
  const strip=document.getElementById('dash-strip');if(!strip)return;
  const rc={common:'',uncommon:'',rare:'sr',epic:'se',legendary:'sl'};
  strip.innerHTML=SLOTS.map(sc=>{
    const eid=S.eq[sc.slot];const eq=eid?EDB.find(e=>e.id===eid):null;const rr=eq?rc[eq.r]:'';
    const imgH=eq&&IMGS[eq.ik]?`<img src="${IMGS[eq.ik]}" style="width:36px;height:36px;object-fit:contain;image-rendering:crisp-edges;filter:drop-shadow(0 1px 4px rgba(0,0,0,.7))">`:'<span style="font-size:18px;opacity:.15">❓</span>';
    return `<div class="eq-slot" onclick="swT('smithy')" title="${eq?eq.nm:'Vazio — Forje no Ferreiro!'}">
      <div class="eq-box ${eq?'on':''} ${rr}">${imgH}${eq?`<div class="pw-badge">+${eq.pw}%</div>`:''}</div>
      <div class="eq-lbl">${sc.lbl}</div>
      <div class="eq-nm">${eq?eq.nm:'Vazio'}</div>
    </div>`;
  }).join('');
}
function renderEqPage(){
  const left=document.getElementById('eq-left');const right=document.getElementById('eq-right');if(!left||!right)return;
  const rc={common:'',uncommon:'',rare:'sr',epic:'se',legendary:'sl'};
  const renderSl=sc=>{
    const eid=S.eq[sc.slot];const eq=eid?EDB.find(e=>e.id===eid):null;const rr=eq?rc[eq.r]:'';
    const imgH=eq&&IMGS[eq.ik]?`<img src="${IMGS[eq.ik]}" style="width:34px;height:34px;object-fit:contain;image-rendering:crisp-edges;filter:drop-shadow(0 2px 6px rgba(0,0,0,.8))">`:'<span style="font-size:18px;opacity:.3">❓</span>';
    return `<div class="eq-sl ${eq?'on':''} ${rr}" onclick="openEqMo('${sc.slot}')">
      <div class="sl-ib">${imgH}</div>
      <div class="sl-i"><div class="sl-tl">${sc.lbl}</div><div class="sl-nm">${eq?eq.nm:'Vazio'}</div>${eq?`<div class="sl-st">ATK+${eq.atk} DEF+${eq.def} PWR+${eq.pw}%</div>`:''}</div>
    </div>`;
  };
  left.innerHTML=SLOTS.filter(s=>s.side==='left').map(renderSl).join('');
  right.innerHTML=SLOTS.filter(s=>s.side==='right').map(renderSl).join('');
  const pw=eqPow();const ps=getPS();
  s('ep-pw',`+${pw}%`);s('cs-atk',ps.atk);s('cs-def',ps.def);s('cs-pw',`+${pw}%`);
  s('b-at',ps.atk);s('b-df',ps.def);s('b-mh',S.mhp);s('b-pw2',`+${pw}%`);
  const ai=document.getElementById('atk-img');if(ai&&IMGS.icon_swordblood)ai.src=IMGS.icon_swordblood;
  const di=document.getElementById('def-img');if(di&&IMGS.icon_shield2)di.src=IMGS.icon_shield2;
}
function openEqMo(slot){
  const sc=SLOTS.find(s=>s.slot===slot);
  const owned=S.owned.map(id=>EDB.find(e=>e.id===id)).filter(e=>e&&e.slot===slot);
  const ro={common:0,uncommon:1,rare:2,epic:3,legendary:4};owned.sort((a,b)=>ro[b.r]-ro[a.r]);
  const cur=S.eq[slot];const rm={common:'Comum',uncommon:'Incomum',rare:'Raro',epic:'Épico',legendary:'Lendário'};
  let body=`<p style="font-size:12px;color:var(--text2);margin-bottom:11px">Slot: <strong style="color:var(--gold)">${sc.lbl}</strong></p>`;
  if(!owned.length)body+='<div style="color:var(--text2);font-style:italic;font-size:12px">Nenhum item. Forje no Ferreiro!</div>';
  else body+=owned.map(eq=>{
    const isEq=eq.id===cur;const imgSrc=IMGS[eq.ik];
    const imgH=imgSrc?`<img src="${imgSrc}" style="width:42px;height:42px;object-fit:contain;image-rendering:crisp-edges;filter:drop-shadow(0 2px 6px rgba(0,0,0,.8));flex-shrink:0">`:'<span style="font-size:26px;flex-shrink:0">⚔️</span>';
    const fxLine = eq.fx ? `<div style="font-size:9px;margin-top:2px;color:${eq.fx.color}">${eq.fx.emoji} ${eq.fx.label} (${Math.round(eq.fx.chance*100)}% chance)</div>` : '';
    return `<div onclick="equipItem('${eq.id}');closeMo();" style="display:flex;align-items:center;gap:9px;padding:8px 10px;background:${isEq?'rgba(201,168,76,.08)':'rgba(0,0,0,.4)'};border:1px solid ${isEq?'rgba(201,168,76,.4)':'rgba(255,255,255,.05)'};border-radius:6px;margin-bottom:5px;cursor:pointer;transition:border-color .2s;" onmouseover="this.style.borderColor='var(--border2)'" onmouseout="this.style.borderColor='${isEq?'rgba(201,168,76,.4)':'rgba(255,255,255,.05)'}'">${imgH}
      <div style="flex:1"><div style="font-family:'Cinzel',serif;font-size:11px;color:${isEq?'var(--gold2)':'var(--text)'}">${eq.nm} ${isEq?'✓':''}</div>
      <div style="font-size:10px;color:var(--text2)">${rm[eq.r]} · ATK+${eq.atk} DEF+${eq.def} PWR+${eq.pw}%</div>${fxLine}</div>
    </div>`;
  }).join('');
  showMo(sc.lbl,null,body,[]);
}
function renderHabits(){
  const m=getMult();const l=document.getElementById('hb-list');
  if(l)l.innerHTML=S.habits.map(h=>{
    const avail=isHabitAvailable(h);
    const locked=!h.dn&&!avail;
    return `<div class="hb-item ${h.dn?'done':''} ${locked?'bh':''}" style="position:relative;${locked?'opacity:.55;':''}">
      <div onclick="${locked?'void(0)':''}" style="display:flex;align-items:center;gap:9px;flex:1;cursor:${locked?'not-allowed':'pointer'}" onclick="${locked?'':` togH('${h.id}')` }">
        <div class="hchk" onclick="event.stopPropagation();${locked?'':` togH('${h.id}')` }">${h.dn?'✓':locked?'🔒':''}</div>
        <div class="hi" onclick="event.stopPropagation();${locked?'':` togH('${h.id}')` }"><div class="hn">${h.ic} ${h.nm} ${getHabitTypeLabel(h.tp)}</div><div class="hm">${S.attrs[h.at].ic} ${S.attrs[h.at].nm} · 🔥${h.sk}d · ✅${h.td}${locked?' · '+(h.tp==='unique'?'Concluída':'Esta semana'):''}
        </div></div>
        <div class="hr2" style="padding-right:28px"><div class="hxp">+${Math.floor(h.xb*m)}XP</div><div class="hgd">+${Math.floor(h.gb*m)}🪙</div>${m>1?`<div style="font-size:9px;color:var(--amber2)">×${m.toFixed(1)}</div>`:''}</div>
      </div>
      <button onclick="event.stopPropagation();confDelHabit('${h.id}')" title="Deletar missão"
        style="position:absolute;top:50%;right:8px;transform:translateY(-50%);background:transparent;border:none;color:rgba(192,57,43,.2);font-size:14px;cursor:pointer;padding:4px 6px;border-radius:4px;line-height:1;transition:all .15s"
        onmouseover="this.style.color='var(--red3)';this.style.background='rgba(192,57,43,.15)'"
        onmouseout="this.style.color='rgba(192,57,43,.2)';this.style.background='transparent'">✕</button>
    </div>`;}).join('');
  const dn=S.habits.filter(h=>h.dn).length;
  s('xp-td',S.xpTd);s('go-td',S.goTd);s('dn-ct',dn);s('tt-ct',S.habits.length);
  const d=document.getElementById('hb-dt');if(d)d.textContent=new Date().toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long'});
}
function renderBadH(){
  const l=document.getElementById('bh-list');if(!l)return;
  l.innerHTML=BAD_H.map(bh=>{const c=S.badLog[bh.id]||0;
    return `<div class="hb-item bh ${c>0?'pun':''}" id="bh-${bh.id}" onclick="togBad('${bh.id}')">
      <div class="hchk">${c>0?'✕':''}</div>
      <div class="hi"><div class="hn">${bh.ic} ${bh.nm}</div><div class="hm" style="color:var(--red3)">-${Math.floor(bh.gp*100)}% Gold · -${bh.hp}HP · Boss+ATK</div></div>
      <div class="hr2"><div class="hpn">-${Math.floor(bh.gp*100)}%🪙</div><div class="hpn">-${bh.hp}❤</div></div>
    </div>`;
  }).join('');
  const st=document.getElementById('dk-st');if(st){const tot=Object.values(S.badLog).reduce((a,b)=>a+b,0);st.innerHTML=`Vícios hoje:<strong style="color:var(--red3)">${tot}</strong> · Streak limpo:<strong style="color:var(--gold2)">${S.cStr} dias</strong>`;}
}
function renderBoss(){
  const boss=getBoss();const pct=(S.boss.hp/S.boss.mhp*100).toFixed(1);
  const lore=BOSS_LORE[S.boss.idx]||BOSS_LORE[0];
  // Core boss elements
  s('b-nm',boss.nm);s('b-tt',boss.tt);s('b-hl',`${S.boss.hp}/${S.boss.mhp}`);sw('b-hf','width',pct+'%');
  const bspEl=document.getElementById('b-sp');if(bspEl){const svgHtml=boss.svk?BOSS_SVG[boss.svk]:null;if(svgHtml){bspEl.innerHTML=svgHtml;bspEl.style.fontSize='0';}else bspEl.textContent=boss.em;}
  const ws=new Date(WS());ws.setDate(ws.getDate()+7);const diff=ws-new Date();
  const days=Math.floor(diff/86400000);const hrs=Math.floor((diff%86400000)/3600000);
  s('b-tmr',`⏳ Novo Boss em: ${days}d ${hrs}h · Abatidos: ${S.kills}`);

  // ── Lore card ──
  const loreEm=document.getElementById('boss-lore-em');
  const loreTitle=document.getElementById('boss-lore-title');
  const loreSub=document.getElementById('boss-lore-sub');
  const loreText=document.getElementById('boss-lore-text');
  if(loreEm){const svgSmall=boss.svk?BOSS_SVG[boss.svk]?.replace('width="80" height="80"','width="52" height="52"'):null;if(svgSmall){loreEm.innerHTML=svgSmall;loreEm.style.fontSize='0';}else loreEm.textContent=boss.em;}
  if(loreTitle)loreTitle.textContent=boss.nm;
  if(loreSub)loreSub.textContent=boss.tt;
  if(loreText)loreText.innerHTML=lore.lore+`<br><br><span style="font-family:'Cinzel',serif;font-size:9px;color:rgba(39,174,96,.7);letter-spacing:.1em">⚡ FRAQUEZA: ${lore.weakness}</span>`;

  // ── Boss arena stats ──
  s('boss-arena-atk',boss.atk);
  s('boss-arena-maxhp',boss.mh);
  s('boss-arena-xp',boss.xr);
  s('boss-arena-cr',boss.cr+'💎');

  // ── Hero arena side ──
  const ps=getPS();
  const hpPct=Math.min(100,S.hp/S.mhp*100);
  s('hero-arena-lv',S.lv);
  s('hero-arena-hp',`${S.hp}/${S.mhp}`);
  s('hero-arena-atk',ps.atk);
  s('hero-arena-def',ps.def);
  s('hero-arena-pwr',`+${eqPow()}%`);
  s('hero-arena-streak',`×${getMult().toFixed(1)}`);
  const heroName=document.getElementById('hero-arena-name');
  if(heroName)heroName.textContent=S.profile?.name||'Herói';
  const cls=getClass();
  const heroClass=document.getElementById('hero-arena-class');
  if(heroClass)heroClass.textContent=cls?`${cls.icon} ${cls.name}`:'Sem Classe';
  const heroHb=document.getElementById('hero-arena-hb');
  if(heroHb)heroHb.style.width=hpPct+'%';
  // avatar
  const heroImg=document.getElementById('hero-arena-img');
  const heroEm=document.getElementById('hero-arena-em');
  if(S.avData&&heroImg){heroImg.src=S.avData;heroImg.style.display='block';if(heroEm)heroEm.style.display='none';}
  else if(heroImg){heroImg.style.display='none';if(heroEm){heroEm.style.display='';heroEm.textContent=cls?cls.icon:'🧙';}}

  // ── Boss defeated overlay ──
  const deadBadge=document.getElementById('boss-dead-badge');
  if(deadBadge)deadBadge.style.display=S.boss.def?'flex':'none';

  // ── Rewards card ──
  const rc=document.getElementById('boss-rewards-content');
  if(rc){
    rc.innerHTML=`
      <div style="display:flex;align-items:center;gap:5px;background:rgba(201,168,76,.08);border:1px solid rgba(201,168,76,.2);border-radius:8px;padding:7px 12px">
        <span style="font-size:16px">⚡</span>
        <div><div style="font-family:'Cinzel Decorative',serif;font-size:13px;color:var(--gold2)">${boss.xr}</div><div style="font-family:'Cinzel',serif;font-size:7px;color:var(--text3);letter-spacing:.1em">XP</div></div>
      </div>
      <div style="display:flex;align-items:center;gap:5px;background:rgba(230,126,34,.08);border:1px solid rgba(230,126,34,.2);border-radius:8px;padding:7px 12px">
        <span style="font-size:16px">🪙</span>
        <div><div style="font-family:'Cinzel Decorative',serif;font-size:13px;color:var(--amber2)">${boss.gr}</div><div style="font-family:'Cinzel',serif;font-size:7px;color:var(--text3);letter-spacing:.1em">OURO</div></div>
      </div>
      <div style="display:flex;align-items:center;gap:5px;background:rgba(0,212,255,.08);border:1px solid rgba(0,212,255,.2);border-radius:8px;padding:7px 12px">
        <span style="font-size:16px">💎</span>
        <div><div style="font-family:'Cinzel Decorative',serif;font-size:13px;color:var(--crystal)">${boss.cr}</div><div style="font-family:'Cinzel',serif;font-size:7px;color:var(--text3);letter-spacing:.1em">CRISTAIS</div></div>
      </div>`;
  }
  // Reward item preview
  const riPrev=document.getElementById('boss-reward-item-preview');
  if(riPrev&&boss.rewardItem){
    const ri=EDB.find(e=>e.id===boss.rewardItem);
    if(ri){
      riPrev.style.display='block';
      const riIcon=document.getElementById('boss-ri-icon');
      const riName=document.getElementById('boss-ri-name');
      const riDesc=document.getElementById('boss-ri-desc');
      const riFx=document.getElementById('boss-ri-fx');
      const alreadyOwned=S.owned.includes(ri.id);
      if(riIcon){const imgSrc=IMGS[ri.ik];riIcon.innerHTML=imgSrc?`<img src="${imgSrc}" style="width:36px;height:36px;object-fit:contain;image-rendering:crisp-edges">`:ri.em||'⚔';}
      if(riName)riName.textContent=ri.nm+(alreadyOwned?' ✓':'');
      if(riDesc)riDesc.textContent=ri.desc;
      if(riFx&&ri.fx)riFx.innerHTML=`<span style="color:${ri.fx.color}">${ri.fx.emoji} ${ri.fx.label} · ${Math.round(ri.fx.chance*100)}% chance${ri.fx.dot?' · DoT '+ri.fx.dotTurns+'t':''}</span>`;
      if(alreadyOwned&&riPrev){riPrev.style.borderColor='rgba(39,174,96,.35)';riPrev.style.background='rgba(39,174,96,.04)';}
    }
  }

  // ── History ──
  const h=document.getElementById('b-hist');
  if(h){if(!S.bkHist.length){h.innerHTML='<div style="font-size:12px;color:var(--text2);font-style:italic">Nenhum ainda.</div>';return;}
  h.innerHTML=S.bkHist.slice(0,5).map(b=>{
    const svgTiny=b.svk&&BOSS_SVG[b.svk]?BOSS_SVG[b.svk].replace('width="80" height="80"','width="28" height="28"'):null;
    const iconHtml=svgTiny?`<span style="display:inline-flex;flex-shrink:0">${svgTiny}</span>`:`<span style="font-size:20px">${b.em}</span>`;
    return`<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.04)">${iconHtml}<div style="flex:1"><div style="font-family:'Cinzel',serif;font-size:11px">${b.nm}</div><div style="font-size:10px;color:var(--text2)">${b.dt}</div>${b.ri?`<div style="font-size:9px;color:var(--gold2)">🎁 ${b.ri}</div>`:''}</div><div style="text-align:right"><div style="font-size:10px;color:var(--gold)">+${b.xp}XP</div><div style="font-size:10px;color:var(--amber2)">+${b.go}🪙</div><div style="font-size:10px;color:var(--crystal)">+${b.cr}💎</div></div></div>`;
  }).join('');}
}
function renderMini(){
  const boss=getBoss();const pct=(S.boss.hp/S.boss.mhp*100).toFixed(1);
  s('bm-nm',S.boss.def?'✅ Boss Derrotado':boss.nm);s('bm-hl',`${S.boss.hp}/${S.boss.mhp}`);
  const bmEmEl=document.getElementById('bm-em');if(bmEmEl){const svgMini=boss.svk?BOSS_SVG[boss.svk]?.replace('width="80" height="80"','width="28" height="28"'):null;if(svgMini){bmEmEl.innerHTML=svgMini;bmEmEl.style.fontSize='0';}else bmEmEl.textContent=boss.em;}
  const f=document.getElementById('bm-fl');if(f)f.style.width=pct+'%';
}
function renderEvBanner(){
  const bn=document.getElementById('ev-banner');
  if(!S.activeEv){bn.classList.remove('on');const tab=document.getElementById('tab-ev');if(tab){tab.style.color='';tab.style.borderBottomColor='';}updateNavAlerts();return;}
  const ev=EVENTS_DB.find(e=>e.id===S.activeEv.eid);if(!ev)return;
  bn.classList.add('on');
  s('ev-em',ev.em);s('ev-ttl',ev.cr+' Detectada!');s('ev-desc',ev.sub);
  const rem=Math.max(0,S.activeEv.exp-Date.now());const hrs=Math.floor(rem/3600000);const mins=Math.floor((rem%3600000)/60000);
  s('ev-tmr',`⏳ Expira em ${hrs}h ${mins}m`);
  const tab=document.getElementById('tab-ev');if(tab){tab.style.color='var(--event2)';tab.style.borderBottomColor='var(--event)';}
}
function renderEvPanel(){
  const area=document.getElementById('ev-area');if(!area)return;
  if(!S.activeEv){
    area.innerHTML=`<div class="card" style="text-align:center;padding:34px 18px">
      <div style="font-size:42px;margin-bottom:10px">🌙</div>
      <div style="font-family:'Cinzel Decorative',serif;font-size:14px;color:var(--gold3);margin-bottom:6px">Mundo Tranquilo</div>
      <div style="font-size:13px;color:var(--text2);font-style:italic;margin-bottom:13px">Nenhuma criatura à vista. Continue suas missões!</div>
      <button class="btn bsm bev" onclick="forceEv()">⚄ Invocar Evento (Teste)</button>
    </div>`;
    const eh=document.getElementById('ev-hist');if(eh){if(!S.evHist.length){eh.innerHTML='<div style="font-size:12px;color:var(--text2);font-style:italic">Nenhum completado.</div>';return;}eh.innerHTML=S.evHist.slice(0,8).map(e=>`<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.04)"><span style="font-size:16px">${e.em}</span><div style="flex:1"><div style="font-family:'Cinzel',serif;font-size:11px">${e.nm}</div><div style="font-size:10px;color:var(--text2)">${e.dt}</div></div><div style="text-align:right"><div style="font-size:10px;color:var(--gold)">+${e.xp}XP</div><div style="font-size:10px;color:var(--amber2)">+${e.go}🪙</div><div style="font-size:10px;color:var(--crystal)">+${e.cr}💎</div>${e.itm?`<div style="font-size:9px;color:var(--red3)">🎁${e.itm}</div>`:''}</div></div>`).join('');}
    return;
  }
  const ev=EVENTS_DB.find(e=>e.id===S.activeEv.eid);if(!ev)return;
  const pct=(S.activeEv.hp/S.activeEv.mhp*100).toFixed(1);
  const rem=Math.max(0,S.activeEv.exp-Date.now());const hrs=Math.floor(rem/3600000);const mins=Math.floor((rem%3600000)/60000);
  const dn=Object.keys(S.activeEv.done).length;const tot=ev.tasks.length;const pw=eqPow();
  const itmInfo=ev.rew.item?EDB.find(e=>e.id===ev.rew.item):null;
  area.innerHTML=`<div class="ev-panel">
    <div class="evN">${ev.em} ${ev.cr}</div>
    <div class="evST">${ev.sub} · Dificuldade: ${ev.dif}</div>
    <span class="evSP">${ev.em}</span>
    <div style="display:flex;justify-content:space-between;font-family:'Cinzel',serif;font-size:10px;color:var(--event2);margin-bottom:3px"><span>HP DA CRIATURA</span><span>${S.activeEv.hp}/${S.activeEv.mhp}</span></div>
    <div class="evHW"><div class="evHF" style="width:${pct}%"></div></div>
    <div class="ev-ch"><div class="ev-ch-t">⚔ DESAFIO (${dn}/${tot})</div><div class="ev-ch-d">${ev.ds}</div></div>
    ${ev.tasks.map(t=>{const done=S.activeEv.done[t.id];const dmg=Math.floor(t.dmg*(1+pw/100));
      return `<div class="ev-task ${done?'done':''}" onclick="togEvTask('${t.id}')">
        <div class="hchk">${done?'✓':''}</div>
        <div class="hi"><div class="hn">${t.ic} ${t.nm}</div><div class="hm" style="color:var(--event2)">Dano: ${dmg} (×${(1+pw/100).toFixed(2)} equip)</div></div>
      </div>`;}).join('')}
    <div class="evRW">
      <span style="font-size:9px;color:var(--text2);font-family:'Cinzel',serif">RECOMPENSAS:</span>
      <span class="ert ert-g">+${ev.rew.xp}XP</span>
      <span class="ert ert-g">+${ev.rew.gold}🪙</span>
      <span class="ert ert-c">+${ev.rew.crystal}💎</span>
      ${itmInfo?`<span class="ert ert-i">🎁 ${itmInfo.nm}</span>`:''}
    </div>
    <div style="font-family:'Cinzel',serif;font-size:10px;color:var(--event);margin:8px 0 6px">⏳ ${hrs}h ${mins}m · Falhar: -${ev.pen.hp}HP -${Math.floor(ev.pen.gp*100)}%Gold</div>
    <div class="ev-log" id="ev-log">Criatura detectada! Complete os desafios...
</div>
  </div>`;
  const eh=document.getElementById('ev-hist');if(eh){if(!S.evHist.length){eh.innerHTML='<div style="font-size:12px;color:var(--text2);font-style:italic">Nenhum completado.</div>';return;}eh.innerHTML=S.evHist.slice(0,6).map(e=>`<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.04)"><span style="font-size:16px">${e.em}</span><div style="flex:1"><div style="font-family:'Cinzel',serif;font-size:11px">${e.nm}</div><div style="font-size:10px;color:var(--text2)">${e.dt}</div></div><div style="text-align:right"><div style="font-size:10px;color:var(--gold)">+${e.xp}XP</div><div style="font-size:10px;color:var(--amber2)">+${e.go}🪙</div><div style="font-size:10px;color:var(--crystal)">+${e.cr}💎</div>${e.itm?`<div style="font-size:9px;color:var(--red3)">🎁${e.itm}</div>`:''}</div></div>`).join('');}
}
function renderSmithy(){
  s('sm-cr',S.cr);
  const grid=document.getElementById('sm-grid');if(!grid)return;
  const ro={common:0,uncommon:1,rare:2,epic:3,legendary:4};const rm={common:'Comum',uncommon:'Incomum',rare:'Raro',epic:'Épico',legendary:'Lendário'};
  const items=EDB.filter(e=>{
    if(smF==='boss') return e.bossReward===true;
    if(smF==='all') return true;
    return e.slot===smF;
  }).sort((a,b)=>ro[a.r]-ro[b.r]);
  grid.innerHTML=items.map(eq=>{
    const own=S.owned.includes(eq.id);
    const isBossR=eq.bossReward===true;
    const bossLocked=isBossR&&!own;
    const cant=!isBossR&&S.cr<eq.price&&!own;
    const sn=SLOTS.find(s=>s.slot===eq.slot)?.lbl||eq.slot;
    const imgSrc=IMGS[eq.ik];const imgH=imgSrc?`<img src="${imgSrc}" style="width:58px;height:58px;object-fit:contain;image-rendering:crisp-edges;filter:drop-shadow(0 2px 8px rgba(0,0,0,.8))">`:'<span style="font-size:32px">⚔️</span>';
    const bossNm=isBossR?(BOSSES[eq.bossIdx||0]?.nm||'Boss'):'';
    // Store fx data in global map keyed by item id, render badge with only data-fxid
    if(eq.fx) FX_TIP_MAP[eq.id] = {
      name:  eq.fx.emoji + ' ' + eq.fx.label,
      desc:  getFxDescription(eq.fx),
      chance:'Chance: ' + Math.round(eq.fx.chance*100) + '% por missão' + (eq.fx.dot ? ' · DoT: ' + eq.fx.dotTurns + ' turnos' : ''),
      color: eq.fx.color
    };
    const fxBadge = eq.fx ? `<div class="fx-badge"
        style="border:1px solid ${eq.fx.color}40;color:${eq.fx.color}"
        data-fxid="${eq.id}"
        onmouseenter="showFxTip(event,this)"
        onmouseleave="hideFxTip()"
      >${eq.fx.emoji} ${eq.fx.label} <span style="color:var(--text3)">${Math.round(eq.fx.chance*100)}%</span></div>` : '';
    return `<div class="sm-item ${bossLocked?'boss-locked':''}" style="opacity:${cant?.4:1};cursor:pointer" onclick="openItemDetail('${eq.id}')">
      <div class="sm-rb rb-${eq.r} r-${eq.r}">${rm[eq.r]}</div>
      <div class="sm-iw">${imgH}</div>
      <div class="sm-nm">${eq.nm}</div>
      <div class="sm-tp">${sn} · ${eq.desc}</div>
      <div class="sm-st">⚔ ATK +${eq.atk} · 🛡 DEF +${eq.def}<br>💥 Poder +${eq.pw}%</div>
      ${fxBadge}
      ${isBossR
        ? `<div class="boss-reward-badge">🐉 Derrote: "${bossNm}"</div>`
        : eq.isCrafted
          ? `<div style="font-family:'Cinzel',serif;font-size:8px;color:var(--crystal);letter-spacing:.08em;margin-bottom:4px">⚗️ APENAS CRAFTING</div>`
          : `<div class="sm-pr">💎 ${eq.price}</div>`}
      ${own
        ? `<button class="btn bsm" onclick="equipItem('${eq.id}');swT('char')">⚔ Equipar</button>`
        : isBossR
          ? `<button class="btn bsm" disabled style="opacity:.4;cursor:not-allowed">🔒 Boss Locked</button>`
          : eq.isCrafted
            ? `<button class="btn bsm" onclick="swT('crafting')" style="border-color:var(--crystal);color:var(--crystal)">⚗️ Ir para Crafting</button>`
            : `<button class="btn bsm bcr" onclick="buyEquip('${eq.id}')" ${cant?'disabled style="opacity:.5;cursor:not-allowed"':''}>Forjar</button>`}
    </div>`;
  }).join('');
  const ownd=document.getElementById('sm-own');
  if(ownd){const ol=S.owned.map(id=>EDB.find(e=>e.id===id)).filter(Boolean);
    if(!ol.length){ownd.innerHTML='<div style="font-size:12px;color:var(--text2);font-style:italic">Nenhum forjado.</div>';return;}
    ownd.innerHTML=ol.map(eq=>{const isEq=Object.values(S.eq).includes(eq.id);const imgSrc=IMGS[eq.ik];const imgH=imgSrc?`<img src="${imgSrc}" style="width:28px;height:28px;object-fit:contain;image-rendering:crisp-edges">`:'⚔️';
      const fxMini=eq.fx?`<span style="font-size:9px;color:${eq.fx.color}">${eq.fx.emoji} ${eq.fx.label}</span>`:'';
      return `<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.04)">${imgH}<div style="flex:1"><div style="font-family:'Cinzel',serif;font-size:11px">${eq.nm} ${isEq?'<span style="color:var(--gold2);font-size:9px">✓</span>':''}</div><div style="font-size:10px;color:var(--text2)">ATK+${eq.atk} DEF+${eq.def} PWR+${eq.pw}% ${fxMini}</div></div>${!isEq?`<button class="btn bsm" onclick="equipItem('${eq.id}')">Eq.</button>`:''}</div>`;
    }).join('');}
}
function renderShop(){
  s('sh-gl',S.gold);const grid=document.getElementById('sh-grid');if(!grid)return;
  const rm={common:'Comum',uncommon:'Incomum',rare:'Raro',epic:'Épico',legendary:'Lendário'};
  const items=SHOP_ITEMS.filter(i=>shF==='all'||i.ct===shF);
  grid.innerHTML=items.map(item=>{
    const cant=S.gold<item.pr;const imgSrc=item.ik?IMGS[item.ik]:null;
    const imgH=imgSrc?`<img src="${imgSrc}" style="width:48px;height:48px;object-fit:contain;image-rendering:crisp-edges;filter:drop-shadow(0 2px 6px rgba(0,0,0,.7))">`:`<span style="font-size:34px">${item.em||'🛒'}</span>`;
    return `<div class="sh-item ${cant?'ca':''}" onclick="${cant?'':(`buyShop('${item.id}')`)}">
      <div style="position:absolute;top:5px;right:5px;font-size:8px;font-family:'Cinzel',serif;letter-spacing:.07em;padding:2px 6px;border-radius:12px;" class="rb-${item.r} r-${item.r}">${rm[item.r]}</div>
      <div class="sh-iw">${imgH}</div>
      <div class="sh-nm">${item.nm}</div>
      <div class="sh-ds">${item.ds}</div>
      <div class="sh-pr">🪙 ${item.pr}</div>
    </div>`;
  }).join('');
  const hist=document.getElementById('sh-hist');
  if(hist){if(!S.phist.length){hist.innerHTML='<div style="font-size:12px;color:var(--text2);font-style:italic">Nenhuma compra.</div>';return;}
  hist.innerHTML=S.phist.slice(0,12).map(p=>{const imgSrc=p.ik?IMGS[p.ik]:null;const imgH=imgSrc?`<img src="${imgSrc}" style="width:20px;height:20px;object-fit:contain">`:`<span>${p.em||'🛒'}</span>`;
    return `<div style="display:flex;align-items:center;gap:7px;padding:4px 0;border-bottom:1px solid rgba(255,255,255,.04)">${imgH}<span style="flex:1;font-size:12px">${p.nm}</span><span style="font-size:10px;color:var(--text2)">${p.dt}</span><span style="font-family:'Cinzel',serif;font-size:11px;color:var(--amber2)">-${p.pr}🪙</span></div>`;}).join('');}
}
function renderAttrs(){
  const l=document.getElementById('at-list');
  if(l)l.innerHTML=Object.values(S.attrs).map(a=>`<div class="ar"><div class="ai">${a.ic}</div><div class="an">${a.nm}</div><div class="abw"><div class="ab" style="width:${a.v}%;background:${a.cl}"></div></div><div class="av2">${a.v}</div><div class="ask">🔥${a.sk}d</div></div>`).join('');
  drawRadar();
}
let xpRange = 14;
function setXpRange(n){ xpRange=n; renderProg(); }

function renderXpChart(container, days){
  if(!container) return;
  if(!days.length){
    container.innerHTML='<div style="font-size:12px;color:var(--text2);font-style:italic;padding:20px 0;text-align:center">Complete o primeiro dia para ver o gráfico.</div>';
    return;
  }

  const W=container.clientWidth||320, H=130;
  const PAD={t:10,r:16,b:28,l:40};
  const cW=W-PAD.l-PAD.r, cH=H-PAD.t-PAD.b;

  const vals=days.map(d=>d.xp||0);
  const mx=Math.max(...vals,1);
  const n=days.length;

  // Scale helpers
  const xP=i=>PAD.l+(i/(Math.max(n-1,1)))*cW;
  const yP=v=>PAD.t+cH-(v/mx)*cH;

  // Area path
  const pts=days.map((d,i)=>`${xP(i).toFixed(1)},${yP(d.xp||0).toFixed(1)}`).join(' ');
  const area=`${PAD.l},${PAD.t+cH} `+pts+` ${xP(n-1).toFixed(1)},${PAD.t+cH}`;

  // Grid lines (4)
  const gridLines=[0,.25,.5,.75,1].map(p=>{
    const y=(PAD.t+cH-p*cH).toFixed(1);
    const lbl=Math.round(p*mx);
    return `<line class="xp-grid-line" x1="${PAD.l}" y1="${y}" x2="${PAD.l+cW}" y2="${y}"/>
            <text class="xp-axis-label" x="${PAD.l-5}" y="${parseFloat(y)+3}" text-anchor="end" font-size="7" fill="#6a5a4a">${lbl}</text>`;
  }).join('');

  // Dots + day labels (show every Nth)
  const step=Math.max(1,Math.ceil(n/7));
  const dots=days.map((d,i)=>{
    const x=xP(i).toFixed(1), y=yP(d.xp||0).toFixed(1);
    const lbl=step===1||i%step===0||i===n-1 ? (d.day?.split(' ').slice(1,3).join(' ')||'') : '';
    return `<circle class="xp-dot" cx="${x}" cy="${y}" r="3.5"
              onmouseenter="showXpTooltip(evt,${d.xp||0},'${d.day||''}')"
              onmouseleave="hideXpTooltip()"/>
            ${lbl?`<text class="xp-day-label" x="${x}" y="${H-4}">${lbl}</text>`:''}`;
  }).join('');

  // Tooltip group (hidden by default)
  const ttg=`<g id="xp-tooltip-g" visibility="hidden">
    <rect id="xp-tooltip-box" x="0" y="0" width="70" height="28"/>
    <text id="xp-tooltip-val" x="35" y="12" text-anchor="middle" font-family="Cinzel" font-size="9" fill="#e8c96b"></text>
    <text id="xp-tooltip-day" x="35" y="23" text-anchor="middle" font-size="7" fill="#9a8a6a"></text>
  </g>`;

  container.innerHTML=`<div id="xp-chart-svg-wrap">
    <svg width="100%" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" id="xp-svg">
      <defs>
        <linearGradient id="xpAreaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#c9a84c" stop-opacity=".5"/>
          <stop offset="100%" stop-color="#c9a84c" stop-opacity="0"/>
        </linearGradient>
      </defs>
      ${gridLines}
      <polygon class="xp-area" points="${area}"/>
      <polyline class="xp-line" points="${pts}"/>
      ${dots}
      ${ttg}
    </svg>
  </div>`;
}

function showXpTooltip(evt, xp, day){
  const g=document.getElementById('xp-tooltip-g');
  const vt=document.getElementById('xp-tooltip-val');
  const dt=document.getElementById('xp-tooltip-day');
  if(!g||!vt||!dt) return;
  const svg=document.getElementById('xp-svg');
  if(!svg) return;
  const rect=svg.getBoundingClientRect();
  const mx=evt.clientX-rect.left, my=evt.clientY-rect.top;
  let tx=mx-35, ty=my-36;
  if(tx<0)tx=0; if(tx+70>rect.width)tx=rect.width-70;
  if(ty<0)ty=my+8;
  document.getElementById('xp-tooltip-box').setAttribute('x',tx);
  document.getElementById('xp-tooltip-box').setAttribute('y',ty);
  vt.setAttribute('x',tx+35); vt.setAttribute('y',ty+12);
  dt.setAttribute('x',tx+35); dt.setAttribute('y',ty+23);
  vt.textContent='+'+xp+' XP';
  dt.textContent=day.split(' ').slice(1,3).join(' ');
  g.setAttribute('visibility','visible');
}
function hideXpTooltip(){
  const g=document.getElementById('xp-tooltip-g');
  if(g)g.setAttribute('visibility','hidden');
}

function renderProg(){
  // XP Chart
  const xc=document.getElementById('xp-ch');
  const days=S.hist.slice(-xpRange);
  renderXpChart(xc, days);

  // Update range buttons
  [7,14,30].forEach(n=>{
    const btn=document.getElementById(`xp-btn-${n}`);
    if(btn){
      btn.style.background=xpRange===n?'rgba(201,168,76,.2)':'';
      btn.style.borderColor=xpRange===n?'var(--gold)':'';
      btn.style.color=xpRange===n?'var(--gold2)':'';
    }
  });

  // XP summary stats
  const statsEl=document.getElementById('xp-stats');
  if(statsEl&&days.length){
    const total=days.reduce((a,d)=>a+(d.xp||0),0);
    const avg=Math.round(total/days.length);
    const best=Math.max(...days.map(d=>d.xp||0));
    statsEl.innerHTML=[
      ['⚡','Total',total.toLocaleString('pt-BR')+' XP'],
      ['📅','Média/dia',avg+' XP'],
      ['🏆','Melhor dia',best+' XP'],
    ].map(([ic,lb,vl])=>`
      <div style="text-align:center;background:rgba(0,0,0,.3);border:1px solid var(--border);border-radius:5px;padding:7px 4px">
        <div style="font-size:14px">${ic}</div>
        <div style="font-family:'Cinzel',serif;font-size:8px;color:var(--text3);letter-spacing:.08em">${lb}</div>
        <div style="font-family:'Cinzel',serif;font-size:11px;color:var(--gold2)">${vl}</div>
      </div>`).join('');
  }
  const cc=document.getElementById('cm-ch');
  if(cc)cc.innerHTML=S.habits.slice(0,8).map(h=>{const p=S.daysA>0?Math.min(100,Math.floor(h.td/Math.max(1,S.daysA)*100)):0;return`<div class="pr"><div class="pl">${h.ic} ${h.nm.split(' ')[0]}</div><div class="pb"><div class="pf" style="width:${p}%;background:${S.attrs[h.at].cl}"></div></div><div class="pv">${p}%</div></div>`;}).join('');
  const al=document.getElementById('ac-list');
  if(al){
    const total=ACHS.length, done_count=ACHS.filter(a=>uAch.includes(a.id)).length;
    al.innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <div style="font-size:10px;color:var(--text2)">${done_count}/${total} desbloqueadas</div>
      <div style="height:5px;flex:1;margin:0 10px;background:rgba(0,0,0,.4);border-radius:3px;overflow:hidden">
        <div style="height:100%;background:var(--gold);width:${Math.round(done_count/total*100)}%;transition:width .6s;border-radius:3px"></div>
      </div>
      <div style="font-size:10px;color:var(--gold2);font-family:'Cinzel',serif">${Math.round(done_count/total*100)}%</div>
    </div>`+
    ACHS.map(a=>{
      const done=uAch.includes(a.id);
      return `<div class="ac" style="opacity:${done?1:.4};cursor:${done?'default':'not-allowed'};background:${done?'rgba(201,168,76,.04)':'transparent'};border-radius:5px;padding:6px;margin-bottom:2px;border:1px solid ${done?'rgba(201,168,76,.15)':'transparent'}">
        <div style="font-size:18px;width:26px;text-align:center">${a.ic}</div>
        <div style="flex:1">
          <div style="font-family:'Cinzel',serif;font-size:11px;color:${done?'var(--gold2)':'var(--text2)'}">${a.lb}</div>
          <div style="font-size:10px;color:var(--text2)">${a.ds}</div>
        </div>
        ${done?'<div style="color:var(--green3);font-size:14px;flex-shrink:0">✓</div>':'<div style="color:var(--text3);font-size:12px;flex-shrink:0">🔒</div>'}
      </div>`;
    }).join('');
  }
}
function renderAll(){renderStatus();renderDash();renderHabits();renderBadH();renderBoss();renderMini();renderEqPage();renderStrip();renderSmithy();renderShop();renderAttrs();renderProg();renderActiveQ();renderEvBanner();renderEvPanel();renderTavern();renderTavernPotion();renderClasse();renderProfile();renderCrafting();renderInventory();renderDotDisplay();}

// =============== TABS ===============
