// engine.js — Game state, save/load, combat, habits, quests, XP, events
// ────────────────────────────────────────────────────────────
"use strict";

const WS=()=>{const d=new Date();const day=d.getDay();const diff=d.getDate()-day+(day===0?-6:1);const m=new Date(d);m.setDate(diff);return m.toDateString();};
const DEF=()=>({
  lv:1,xp:0,totXp:0,hp:100,mhp:100,gold:0,totGo:0,cr:0,totCr:0,
  streak:0,cStr:0,daysA:0,kills:0,evC:0,evHist:[],
  xpTd:0,goTd:0,dnTd:0,bdTd:0,lastDay:null,hist:[],phist:[],bkHist:[],
  aQ:[],badLog:{},avData:null,
  attrs:{
    vit:{nm:'Vitalidade',ic:'💪',v:10,sk:0,cl:'#e74c3c'},
    men:{nm:'Mente',ic:'🧠',v:10,sk:0,cl:'#3498db'},
    dis:{nm:'Disciplina',ic:'🔱',v:10,sk:0,cl:'#9b59b6'},
    ene:{nm:'Energia',ic:'⚡',v:10,sk:0,cl:'#f39c12'},
    sab:{nm:'Sabedoria',ic:'📖',v:10,sk:0,cl:'#1abc9c'},
    car:{nm:'Carisma',ic:'🌟',v:10,sk:0,cl:'#e67e22'},
  },
  habits:[
    {id:'h1',nm:'Treino / Academia',ic:'🏋️',xb:50,gb:30,at:'vit',dn:false,sk:0,td:0},
    {id:'h2',nm:'Meditação',ic:'🧘',xb:30,gb:18,at:'men',dn:false,sk:0,td:0},
    {id:'h3',nm:'Journaling / Diário',ic:'📓',xb:25,gb:15,at:'sab',dn:false,sk:0,td:0},
    {id:'h4',nm:'Dormir 7h+',ic:'😴',xb:35,gb:20,at:'vit',dn:false,sk:0,td:0},
    {id:'h5',nm:'Beber 3L de água',ic:'💧',xb:20,gb:12,at:'ene',dn:false,sk:0,td:0},
    {id:'h6',nm:'Seguir a Dieta',ic:'🥗',xb:30,gb:18,at:'vit',dn:false,sk:0,td:0},
    {id:'h7',nm:'Mobilidade / Alongamento',ic:'🤸',xb:25,gb:15,at:'vit',dn:false,sk:0,td:0},
    {id:'h8',nm:'Leitura 30min',ic:'📚',xb:25,gb:15,at:'sab',dn:false,sk:0,td:0},
  ],
  eq:{weapon:null,armor:null,offhand:null,head:null,feet:null,legs:null,hands:null},
  owned:[],
  boss:{idx:0,hp:500,mhp:500,ws:WS(),def:false,phase:1},
  activeEv:null,
  tavHist:[],
  playerClass:null,
  activeDots:[],
  classLockedAt:null,
  bardBuff:null,
  potions:{transform:0},
  potionInv:{},         // {potionId: count}
  activePotions:[],     // [{id, effect, expiresAt, usesLeft}]
  guildRank:{},
  activeGuild:null, // id of active guild
  profile:{name:'Herói',age:'',sex:'',weight:'',height:''},
  skillPts:0,           // pontos de habilidade disponíveis
  skillsUnlocked:[],    // array de IDs de habilidades desbloqueadas
  hall:{},              // Hall dos Heróis: foto do ídolo + respostas
  comboHit:{},          // flags de combo por dia {_day, 3:bool, 5:bool, 8:bool}
});

let S=(()=>{
  try{const s=localStorage.getItem('lrpg6');if(s){const p=JSON.parse(s);const d=DEF();for(const k in d)if(!(k in p))p[k]=d[k];if(!p.classLockedAt)p.classLockedAt=null;if(!p.bardBuff)p.bardBuff=null;if(!p.potions)p.potions={transform:0};if(!p.guildRank)p.guildRank={};if(!p.activeGuild&&p.activeGuild!==null)p.activeGuild=null;if(!p.profile)p.profile={name:'Herói',age:'',sex:'',weight:'',height:''};if(p.skillPts===undefined)p.skillPts=0;if(!p.skillsUnlocked)p.skillsUnlocked=[];if(!p.hall)p.hall={};if(!p.potionInv)p.potionInv={};if(!p.activePotions)p.activePotions=[];if(p.boss&&p.boss.phase===undefined)p.boss.phase=1;if(p.comboDmgToday===undefined)p.comboDmgToday=0;if(!p.comboHit)p.comboHit={};return p;}}catch(e){}
  return DEF();
})();
let uAch=JSON.parse(localStorage.getItem('lrpgAch5')||'[]');
let smF='all',shF='all';

// ── SAVE: localStorage + nuvem (Firebase quando logado) ───────────
const save=()=>{
  localStorage.setItem('lrpg6', JSON.stringify(S));
  if(window.cloudSave) window.cloudSave(S, uAch);
};

// ── SAVE CONQUISTAS: persiste uAch local + nuvem ──────────────────
const saveAch=()=>{
  localStorage.setItem('lrpgAch5', JSON.stringify(uAch));
  if(window.cloudSave) window.cloudSave(S, uAch);
};

// =============== EQUIPMENT HELPERS ===============
const eqPow=(s=S)=>{let p=0;for(const sl in s.eq){const e=EDB.find(x=>x.id===s.eq[sl]);if(e)p+=e.pw;}return p;};
const eqAtk=(s=S)=>{let a=0;for(const sl in s.eq){const e=EDB.find(x=>x.id===s.eq[sl]);if(e)a+=e.atk;}return a;};
const eqDef=(s=S)=>{let d=0;for(const sl in s.eq){const e=EDB.find(x=>x.id===s.eq[sl]);if(e)d+=e.def;}return d;};
const iImg=(eq,cls='')=>{if(!eq)return'<span style="font-size:20px;opacity:.3">?</span>';const src=IMGS[eq.ik];return src?`<img src="${src}" class="${cls}" style="width:100%;height:100%;object-fit:contain;image-rendering:crisp-edges;filter:drop-shadow(0 2px 6px rgba(0,0,0,.8))" alt="${eq.nm}">`:'<span style="font-size:20px;opacity:.4">⚔️</span>';};

function equipItem(id){
  // Guard: cannot equip item not in inventory
  if(!S.owned.includes(id)){
    notify('🎒','Não no inventário','Você precisa adquirir o item antes de equipá-lo.','nr');
    return;
  }
  const eq=EDB.find(e=>e.id===id);if(!eq)return;
  if(!S.owned.includes(id)){notify('⚠️','Não possui','Forje no Ferreiro!','nr');return;}
  S.eq[eq.slot]=id;save();renderEqPage();renderStrip();renderAll();
  notify('⚔️','Equipado!',`${eq.nm} equipado! +${eq.pw}% poder`,'ng');
}
function buyEquip(id){
  const eq=EDB.find(e=>e.id===id);if(!eq)return;
  if(eq.isCrafted){notify('⚗️','Forja Exclusiva','Este item só pode ser criado na Mesa de Combinação (aba Crafting).','nc');return;}
  if(S.owned.includes(id)){notify('💎','Já possui','Este item já foi forjado!','ng');return;}
  if(isInventoryFull()){notify('🎒','Inventário Cheio!',`Máx. ${INV_MAX} itens. Venda algo na Taberna!`,'nr');return;}
  if(S.cr<eq.price){notify('💎','Cristais insuf.',`Precisa de ${eq.price} 💎. Você tem ${S.cr}.`,'nc');return;}
  S.cr-=eq.price;
  S.owned.push(id);
  // Do NOT auto-equip — player must choose to equip from inventory
  save();renderAll();checkAch();
  notify('💎','Adquirido!',`${eq.nm} adicionado ao inventário! (${getInventoryUsed()}/${INV_MAX} slots)`,'nc');
}

// =============== BOSS ===============
const getBoss=()=>BOSSES[S.boss.idx];
function checkBW(){if(S.boss.ws!==WS()){const ni=(S.boss.idx+1)%BOSSES.length;const b=BOSSES[ni];S.boss={idx:ni,hp:b.mh,mhp:b.mh,ws:WS(),def:false,phase:1};save();notify('🐉','Novo Boss!',b.nm,'nr');}}
function spawnNextBoss(){
  const ni=(S.boss.idx+1)%BOSSES.length;
  const b=BOSSES[ni];
  S.boss={idx:ni,hp:b.mh,mhp:b.mh,ws:WS(),def:false,defeatedAt:null,phase:1};
  save();renderBoss();renderMini();
  bLog(`<span style="color:var(--red3)">🐉 <strong>${b.em} ${b.nm}</strong> surgiu das sombras!</span>`);
  notify('🐉','Novo Boss!',`${b.em} ${b.nm} chegou! Prepare-se!`,'nr');
}
// Checa se o cooldown de 24h após derrota do boss já passou e faz o respawn
function checkBossRespawn(){
  if(!S.boss.def) return; // boss ainda vivo, nada a fazer
  const defeatedAt=S.boss.defeatedAt;
  if(!defeatedAt) return; // sem timestamp (save antigo), aguarda próximo ciclo
  const elapsed=Date.now()-defeatedAt;
  const h24=24*60*60*1000;
  if(elapsed>=h24) spawnNextBoss();
}
// ══ LORE DOS BOSSES ══════════════════════════════════════════════════
const BOSS_LORE=[
  {lore:'Nas profundezas da Caverna do Amanhã, este ser ancestral aguarda. Alimentado por cada tarefa adiada e sonho engavetado, seu corpo cresce a cada hora desperdiçada. Sua respiração libera névoa do esquecimento — o veneno que apaga ambições e entorpece a vontade dos fracos.',weakness:'Ação imediata e consistência diária'},
  {lore:'Nascido nas trevas da zona de conforto, o Demônio da Preguiça suga a energia vital de todos ao redor. Cada hora no sofá o alimenta; cada esforço resistido o fortalece. Suas correntes são invisíveis, mas prendem com força de ferro. Apenas o fogo da disciplina pode dissolver suas sombras pegajosas.',weakness:'Movimento constante e hábitos matinais'},
  {lore:'Ela não tem forma definida — muda de rosto a cada instante, refletindo seus próprios medos. A Sombra da Ansiedade habita o espaço entre o que é e o que poderia ser ruim. Alimenta-se da ruminação e cresce no silêncio da noite. Só a presença plena e a gratidão pelo momento atual podem enfraquecê-la.',weakness:'Meditação, respiração e ação presente'},
  {lore:'Construído tijolo a tijolo por anos de maus hábitos repetidos, o Golem é a manifestação física de rotinas destrutivas cristalizadas. Cada pedra de seu corpo é um vício não combatido. Lento mas imensamente resistente — ele não cede facilmente. A única forma de destruí-lo é partir as correntes hábito por hábito.',weakness:'Consistência de 21 dias e substituição de hábitos'},
  {lore:'Imortal por definição — o Lich do Passado não pode ser morto pelo tempo, pois ele próprio controla o tempo. Coleciona memórias dolorosas e erros cometidos como troféus em sua torre. Enquanto você olhar para trás com arrependimento, ele se alimentará. Apenas o perdão a si mesmo pode quebrar o feitiço eterno.',weakness:'Autoaceitação e foco no crescimento futuro'},
  {lore:'Sete cabeças — sete formas de distração. Redes sociais, notificações, conteúdo infinito e o canto sedutor do multitasking. Cortar uma cabeça faz crescerem duas. A Hidra da Distração só morre quando você mergulha em foco profundo e deliberado, ignorando o coro de suas vozes hipnóticas.',weakness:'Foco único e bloqueio total de distrações'},
];
// ── ELEMENTAL RESISTANCE/WEAKNESS TABLE ─────────────────────────────────────
// resist: elemento recebe 50% do dano  |  weak: elemento recebe 175% do dano
const BOSS_ELEM = {
  dragao:  { weak:['ice','holy'],      resist:['fire','lightning'] },
  demonio: { weak:['holy','fire'],     resist:['shadow','poison']  },
  sombra:  { weak:['holy','lightning'],resist:['shadow','ice']     },
  golem:   { weak:['lightning','fire'],resist:['bleed','poison']   },
  lich:    { weak:['fire','holy'],     resist:['ice','shadow']     },
  hidra:   { weak:['ice','poison'],   resist:['holy','fire']      },
};

function getElemMult(fxType){
  const boss=getBoss(); if(!boss) return 1;
  const tbl=BOSS_ELEM[boss.svk]; if(!tbl) return 1;
  if(tbl.weak    && tbl.weak.includes(fxType))    return 1.75;
  if(tbl.resist  && tbl.resist.includes(fxType))  return 0.5;
  return 1;
}

function elemLog(mult, fx, bonus){
  const col = fx.color;
  if(mult >= 1.75) bLog(`<span style="color:${col}">${fx.emoji} ${fx.label}: +${bonus} — <strong>FRAQUEZA! ×1.75</strong></span>`);
  else if(mult <= 0.5) bLog(`<span style="color:${col}">${fx.emoji} ${fx.label}: +${bonus} — <em>Resistido (×0.5)</em></span>`);
  else bLog(`<span style="color:${col}">${fx.emoji} ${fx.label}: +${bonus} dano!</span>`);
}

function resolveEffects(baseDmg, src){
  if(S.boss.def) return;
  const effects = [];
  for(const sl in S.eq){
    const id = S.eq[sl]; if(!id) continue;
    const eq = EDB.find(e=>e.id===id); if(!eq||!eq.fx) continue;
    effects.push(eq.fx);
  }
  effects.forEach(fx=>{
    if(Math.random() > fx.chance) return;
    const em = getElemMult(fx.type);
    let bonus = 0;
    switch(fx.type){
      case 'double_strike':
        bonus = Math.floor(baseDmg * (fx.dmgMult||1.0) * em);
        S.boss.hp = Math.max(0, S.boss.hp - bonus);
        bLog(`<span style="color:${fx.color}">${fx.emoji} ${fx.label}: golpe extra +${bonus} dano!</span>`);
        break;
      case 'multishot':
        bonus = Math.floor(baseDmg * (fx.dmgMult||1.5) * em);
        S.boss.hp = Math.max(0, S.boss.hp - bonus);
        bLog(`<span style="color:${fx.color}">${fx.emoji} ${fx.label}: salva extra +${bonus} dano!</span>`);
        break;
      case 'triple_element':
        bonus = Math.floor((baseDmg * (fx.dmgMult||3.0) + (fx.extraDmg||0)) * em);
        S.boss.hp = Math.max(0, S.boss.hp - bonus);
        bLog(`<span style="color:${fx.color}">${fx.emoji} ${fx.label}: 🔥🧊⚡ +${bonus} dano ELEMENTAL!</span>`);
        break;
      case 'bleed':
        bonus = Math.floor((fx.extraDmg || Math.floor(baseDmg * 0.3)) * em);
        S.boss.hp = Math.max(0, S.boss.hp - bonus);
        elemLog(em, fx, bonus);
        if(fx.dot && fx.dotTurns) applyDotToState(fx.type, fx.label, fx.emoji, fx.color, Math.floor(bonus*0.5), fx.dotTurns);
        break;
      case 'fire':
        bonus = Math.floor((fx.extraDmg || Math.floor(baseDmg * 0.4)) * em);
        S.boss.hp = Math.max(0, S.boss.hp - bonus);
        elemLog(em, fx, bonus);
        if(fx.dot && fx.dotTurns) applyDotToState(fx.type, fx.label, fx.emoji, fx.color, Math.floor(bonus*0.5), fx.dotTurns);
        break;
      case 'ice':
        bonus = Math.floor((fx.extraDmg || Math.floor(baseDmg * 0.35)) * em);
        S.boss.hp = Math.max(0, S.boss.hp - bonus);
        elemLog(em, fx, bonus);
        break;
      case 'lightning':
        bonus = Math.floor(baseDmg * (fx.dmgMult||2.0) * em);
        S.boss.hp = Math.max(0, S.boss.hp - bonus);
        elemLog(em, fx, bonus);
        break;
      case 'poison':
        bonus = Math.floor((fx.extraDmg || Math.floor(baseDmg * 0.25)) * em);
        S.boss.hp = Math.max(0, S.boss.hp - bonus);
        elemLog(em, fx, bonus);
        if(fx.dot && fx.dotTurns) applyDotToState(fx.type, fx.label, fx.emoji, fx.color, Math.floor(bonus*0.4), fx.dotTurns);
        break;
      case 'shadow':
        bonus = Math.floor((fx.extraDmg ? baseDmg*(fx.dmgMult||1)+fx.extraDmg : baseDmg*(fx.dmgMult||2.2)) * em);
        S.boss.hp = Math.max(0, S.boss.hp - bonus);
        elemLog(em, fx, bonus);
        break;
      case 'holy':
        bonus = Math.floor(baseDmg * (fx.dmgMult||1.9) * em);
        S.boss.hp = Math.max(0, S.boss.hp - bonus);
        elemLog(em, fx, bonus);
        break;
      case 'lifesteal':
        bonus = Math.floor((fx.extraDmg || Math.floor(baseDmg * 0.4)) * em);
        S.boss.hp = Math.max(0, S.boss.hp - bonus);
        const healed = Math.floor(bonus * 0.4);
        S.hp = Math.min(S.mhp, S.hp + healed);
        bLog(`<span style="color:${fx.color}">${fx.emoji} ${fx.label}: +${bonus} dano, +${healed} HP recuperado!</span>`);
        break;
      case 'stun':
        bonus = Math.floor(baseDmg * (fx.dmgMult||1.5) * em);
        S.boss.hp = Math.max(0, S.boss.hp - bonus);
        elemLog(em, fx, bonus);
        break;
      case 'earthquake':
        bonus = Math.floor((fx.extraDmg ? baseDmg*(fx.dmgMult||1.5)+fx.extraDmg : baseDmg*1.5) * em);
        S.boss.hp = Math.max(0, S.boss.hp - bonus);
        elemLog(em, fx, bonus);
        break;
      case 'thorns':
        bonus = Math.floor((fx.extraDmg || Math.floor(baseDmg * 0.2)) * em);
        S.boss.hp = Math.max(0, S.boss.hp - bonus);
        elemLog(em, fx, bonus);
        break;
    }
    S.boss.hp = Math.max(0, S.boss.hp);
  });
}

// ── BOSS PHASE DEFINITIONS ───────────────────────────────────────────────────
// phase 1 → normal  |  phase 2 (≤50% HP) → enraivecido  |  phase 3 (≤25% HP) → desesperado
const BOSS_PHASES = {
  dragao: {
    p2:{ label:'🔥 Chama Furiosa',  msg:'O Dragão ENRAIVECE! Sua chama agora queima mais forte — ataques de vício causam 50% mais dano!', atkMult:1.5, hint:'Use gelo e luz sagrada!' },
    p3:{ label:'💀 Agonia Eterna',  msg:'O Dragão entra em AGONIA! Ataques ficam frenéticos — mas sua armadura racha!',                  atkMult:2.0, hint:'Foco total — ele está quase morto!' },
  },
  demonio: {
    p2:{ label:'😈 Possessão',      msg:'O Demônio te POSSUI! Cada vício cometido agora devolve HP para ele!',                           atkMult:1.4, hint:'Evite vícios a todo custo agora!' },
    p3:{ label:'🩸 Pacto de Sangue',msg:'O Demônio faz um PACTO DE SANGUE! Ele drena 10 HP seu a cada ataque independente de defesa!',   atkMult:1.8, hint:'Santa água e fogo purificam!' },
  },
  sombra: {
    p2:{ label:'👁️ Olho do Caos',   msg:'A Sombra abre o OLHO DO CAOS! Seus hábitos causam 20% menos dano enquanto ela observa!',        atkMult:1.3, dmgDebuff:0.8, hint:'Luz sagrada e raio são sua saída!' },
    p3:{ label:'🌑 Eclipse Total',   msg:'ECLIPSE TOTAL! A Sombra absorve 15% de todo dano recebido como cura!',                          atkMult:1.6, absorbPct:0.15, hint:'Dano explosivo em rajadas!' },
  },
  golem: {
    p2:{ label:'🗿 Endurecimento',   msg:'O Golem ENDURECE! Sua pedra torna-se adamantina — recebe apenas 60% do dano de ataques normais!', atkMult:1.2, dmgDebuff:0.6, hint:'Raio e fogo racham a pedra!' },
    p3:{ label:'⚡ Colapso Sísmico', msg:'O Golem entra em COLAPSO SÍSMICO! Tremores causam 20 de dano a você a cada hábito feito!',       atkMult:1.5, sismoDmg:20,  hint:'Resista — ele está se destruindo!' },
  },
  lich: {
    p2:{ label:'💀 Maldição',        msg:'O Lich lança MALDIÇÃO! Cada hábito desfeito neste fase te custa o dobro de XP!',                atkMult:1.3, hint:'Fire e holy ignoram sua maldição!' },
    p3:{ label:'☠️ Lich Imortal',    msg:'O Lich ativa IMORTALIDADE! Ele regenera 15 HP por hábito completado durante 3 turnos!',         atkMult:1.7, regenHp:15, regenTurns:3, hint:'Cause dano massivo em cadeia!' },
  },
  hidra: {
    p2:{ label:'🐍 Cabeça Dupla',    msg:'A Hidra revela CABEÇA DUPLA! Ataques de vício agora acertam duas vezes!',                       atkMult:1.6, hint:'Veneno e gelo congelam as cabeças!' },
    p3:{ label:'🌊 Veneno Mortal',   msg:'A Hidra cospe VENENO MORTAL! Você perde 8 HP por turno pelos próximos 4 hábitos!',              atkMult:2.0, dotDmg:8, dotTurns:4, hint:'Reta final — tudo ou nada!' },
  },
};

function checkBossPhase(){
  const boss = getBoss(); if(!boss || S.boss.def) return;
  const phaseDef = BOSS_PHASES[boss.svk]; if(!phaseDef) return;
  const pct = S.boss.hp / S.boss.mhp;
  const curPhase = S.boss.phase || 1;
  let newPhase = 1;
  if(pct <= 0.25) newPhase = 3;
  else if(pct <= 0.50) newPhase = 2;
  if(newPhase <= curPhase) return; // só avança, nunca retrocede
  S.boss.phase = newPhase;
  const pd = newPhase === 3 ? phaseDef.p3 : phaseDef.p2;
  // Aplicar efeitos de fase contínuos
  if(pd.dotDmg && pd.dotTurns){
    applyDotToState('phase_venom','Veneno da Hidra','🌊','#5dcaa5', pd.dotDmg, pd.dotTurns);
  }
  if(pd.regenHp && pd.regenTurns){
    S.boss.phaseRegen = {hp: pd.regenHp, turns: pd.regenTurns};
  }
  // Log e notify de fase
  bLog(`<span style="color:var(--red3);font-weight:bold">⚠️ FASE ${newPhase}: ${pd.label}!</span>`);
  bLog(`<span style="color:var(--red3)">${pd.msg}</span>`);
  if(pd.hint) bLog(`<span style="color:var(--gold2)">💡 Dica: ${pd.hint}</span>`);
  notify(`⚠️ Fase ${newPhase}!`, pd.label, pd.msg, 'nr');
  animBossHit(0, true); // animação de transição de fase
}

function getBossAtkMult(){
  const boss = getBoss(); if(!boss) return 1;
  const phaseDef = BOSS_PHASES[boss.svk]; if(!phaseDef) return 1;
  const phase = S.boss.phase || 1;
  if(phase === 3 && phaseDef.p3) return phaseDef.p3.atkMult || 1;
  if(phase >= 2 && phaseDef.p2) return phaseDef.p2.atkMult || 1;
  return 1;
}

function getBossDmgDebuff(){
  const boss = getBoss(); if(!boss) return 1;
  const phaseDef = BOSS_PHASES[boss.svk]; if(!phaseDef) return 1;
  const phase = S.boss.phase || 1;
  if(phase === 3 && phaseDef.p3 && phaseDef.p3.dmgDebuff) return phaseDef.p3.dmgDebuff;
  if(phase >= 2 && phaseDef.p2 && phaseDef.p2.dmgDebuff) return phaseDef.p2.dmgDebuff;
  return 1;
}

function bossDmg(amt,src){
  if(S.boss.def)return;const boss=getBoss();
  const skillDmg=(typeof getSkillDmgBonus==='function')?getSkillDmgBonus():1;
  const potDmg=getBossDmgPotionMult();
  const phaseDebuff = getBossDmgDebuff();
  const bm=(1+(eqPow()/100))*getClassDmgMult()*skillDmg*potDmg*phaseDebuff;
  const dmg=Math.max(1,Math.floor(amt*bm));
  S.boss.hp=Math.max(0,S.boss.hp-dmg);
  // Fase 3 Sombra: absorção de dano como cura
  const pd3 = (S.boss.phase===3 && BOSS_PHASES[boss.svk]?.p3);
  if(pd3 && pd3.absorbPct){
    const absorbed = Math.floor(dmg * pd3.absorbPct);
    S.boss.hp = Math.min(S.boss.mhp, S.boss.hp + absorbed);
    bLog(`<span style="color:#b39ddb">🌑 Sombra absorve ${absorbed} HP do ataque!</span>`);
  }
  // Fase 3 Golem: tremor sísmico ao atacar
  if(S.boss.phase>=3 && BOSS_PHASES[boss.svk]?.p3?.sismoDmg){
    const sd = BOSS_PHASES[boss.svk].p3.sismoDmg;
    S.hp = Math.max(1, S.hp - sd);
    bLog(`<span style="color:#888">⚡ Tremor sísmico: -${sd} HP!</span>`);
  }
  // Fase 2+ Lich: regen de boss
  if(S.boss.phaseRegen && S.boss.phaseRegen.turns > 0){
    const rg = S.boss.phaseRegen;
    S.boss.hp = Math.min(S.boss.mhp, S.boss.hp + rg.hp);
    bLog(`<span style="color:#b39ddb">☠️ Lich regenera ${rg.hp} HP! (${rg.turns} turnos restantes)</span>`);
    rg.turns--;
    if(rg.turns <= 0) S.boss.phaseRegen = null;
  }
  const debuffTag = phaseDebuff < 1 ? ` <em style="color:var(--text3)">[debuff ×${phaseDebuff.toFixed(1)}]</em>` : '';
  bLog(`<span class="ld">⚔ ${src}: ${dmg} dano (×${bm.toFixed(2)})${debuffTag}!</span>`);
  animBossHit(dmg, false);
  resolveEffects(dmg, src);
  // Verificar transição de fase ANTES de checar morte
  checkBossPhase();
  if(S.boss.hp<=0){animBossDeath();
    S.boss.def=true;S.kills++;addXP(boss.xr);addGold(boss.gr);addCr(boss.cr);
    let bRewardNm='';
    if(boss.rewardItem){
      const ri=EDB.find(e=>e.id===boss.rewardItem);
      if(ri&&!S.owned.includes(ri.id)){
        S.owned.push(ri.id);S.eq[ri.slot]=ri.id;bRewardNm=ri.nm;
        bLog(`<span class="lw">🎁 ITEM LENDÁRIO: ${ri.nm} desbloqueado!</span>`);
      }
    }
    S.bkHist.unshift({nm:boss.nm,em:boss.em,svk:boss.svk,dt:new Date().toLocaleDateString('pt-BR'),xp:boss.xr,go:boss.gr,cr:boss.cr,ri:bRewardNm});
    bLog(`<span class="lw">🏆 BOSS DERROTADO! +${boss.xr}XP +${boss.gr}Gold +${boss.cr}💎!</span>`);
    notify('🏆','Boss Derrotado!',`${boss.em} ${boss.nm}\n+${boss.xr}XP +${boss.gr}Gold +${boss.cr}💎${bRewardNm?'\n🎁 '+bRewardNm:''}!`,'ng');
    if(Math.random()<0.4) setTimeout(()=>grantRandomPotion(),800);
    checkAch();
    S.boss.defeatedAt=Date.now();
    save();
    scheduleBossRespawn();
  }
  save();renderBoss();renderMini();
}
function bossAtk(nm){
  if(S.boss.def){bLog(`<span style="color:var(--text2)">Boss derrotado, mas ${nm} causou dano...</span>`);return;}
  // Check potion shield
  if(hasBossShield()){
    consumeBossShield();
    bLog(`<span style="color:var(--gold2)">🛡️ Escudo da Morte bloqueou o ataque de ${nm}!</span>`);
    notify('🛡️','Bloqueado!',`O Osso da Morte absorveu o ataque!`,'ng');
    return;
  }
  const boss=getBoss();const def=eqDef();
  const rawD=Math.floor(boss.atk*0.5+Math.random()*boss.atk*0.5);
  const phaseAtkMult = getBossAtkMult();
  const dmg=Math.max(1,Math.floor((rawD-Math.floor(def*0.3))*phaseAtkMult));
  // Paladin: HP below 30% triggers holy protection (cleric at 100 also)
  const isProtected = (S.playerClass==='cleric' && getEvolvedClass()?.lv>=100) && S.hp-dmg<=0;
  if(isProtected){ S.hp=1; bLog(`<span style="color:#f5e098">😇 Graça Eterna: morte evitada! (1 HP)</span>`); }
  else S.hp=Math.max(0,S.hp-dmg);
  const phaseTag = phaseAtkMult > 1 ? ` <em style="color:var(--red3)">[Fase ${S.boss.phase||1} ×${phaseAtkMult.toFixed(1)}]</em>` : '';
  bLog(`<span class="lb">👹 ${boss.nm}: ${dmg} dano (${nm})${phaseTag}</span>`);
  if(S.hp<=0) playerDeath();
  else if(S.hp<=Math.floor(S.mhp*0.2)) notify('💀','Perigo!','HP crítico! Cuidado com os vícios!','nr');
  save();renderBoss();renderStatus();
}

function playerDeath(){
  // Lose all XP of current level
  const lostXp = S.xp;
  S.xp = 0;
  S.hp = Math.floor(S.mhp * 0.3); // revive with 30% HP
  // Abandon all active quests with penalty already paid via HP
  S.aQ = [];
  save(); renderAll();
  setTimeout(()=>{
    showMo('💀 Você Caiu em Batalha',null,
      `<div style="text-align:center;padding:10px 0">
        <div style="font-size:48px;margin-bottom:10px">💀</div>
        <div style="font-family:'Cinzel Decorative',serif;font-size:16px;color:var(--red3);margin-bottom:6px">Derrota</div>
        <div style="font-size:12px;color:var(--text2);line-height:1.7;margin-bottom:12px">
          Você perdeu toda a experiência do nível atual.<br>
          <strong style="color:var(--red3)">−${lostXp} XP</strong> perdidos.<br>
          Quests ativas foram abandonadas.<br>
          Revivido com ${Math.floor(S.mhp*0.3)} HP.
        </div>
        <div style="font-size:11px;color:var(--text3);font-style:italic">"O que não te mata… te devolve ao início do nível."</div>
      </div>`,
      [{lb:'⚔ Levantar e Lutar',ac:'closeMo()',cl:'btn'}]
    );
  }, 300);
}
function bLog(h){const l=document.getElementById('b-log');if(!l)return;l.innerHTML+=h+'\n';l.scrollTop=l.scrollHeight;}

// =============== EVENTS ===============
let evTimer=null;
let bossRespawnTimer=null;
function scheduleBossRespawn(){
  // Cancela qualquer timer anterior
  if(bossRespawnTimer){clearTimeout(bossRespawnTimer);bossRespawnTimer=null;}
  if(!S.boss.def||!S.boss.defeatedAt) return;
  const h24=24*60*60*1000;
  const remaining=Math.max(0, h24-(Date.now()-S.boss.defeatedAt));
  bossRespawnTimer=setTimeout(()=>{ checkBossRespawn(); },remaining);
}
function startEv(){checkEvExp();checkBossRespawn();scheduleBossRespawn();evTimer=setInterval(()=>{checkEvExp();if(!S.activeEv&&Math.random()<0.3)spawnEv();},10*60*1000);}
function spawnEv(){
  const pool=EVENTS_DB;const ev=pool[Math.floor(Math.random()*pool.length)];
  const now=Date.now();
  S.activeEv={eid:ev.id,hp:ev.mh,mhp:ev.mh,done:{},start:now,exp:now+(ev.hrs*3600000)};
  save();renderEvBanner();renderEvPanel();renderTavern();renderDash();
  notify('👹','Criatura!',`${ev.em} ${ev.cr} surgiu! Vá para Eventos!`,'ne');
  const fl=document.createElement('div');fl.className='efl';document.body.appendChild(fl);setTimeout(()=>fl.remove(),700);
  const tab=document.getElementById('tab-ev');if(tab){tab.style.color='var(--event2)';tab.style.borderBottomColor='var(--event)';}updateNavAlerts();
}
function forceEv(){spawnEv();}
function checkEvExp(){
  if(!S.activeEv)return;
  if(Date.now()>S.activeEv.exp){
    const ev=EVENTS_DB.find(e=>e.id===S.activeEv.eid);
    if(ev){const gl=Math.max(1,Math.floor(S.gold*ev.pen.gp));S.gold=Math.max(0,S.gold-gl);S.hp=Math.max(1,S.hp-ev.pen.hp);
      notify('💀','Evento Expirado!',`${ev.em} ${ev.cr} fugiu! -${gl}Gold -${ev.pen.hp}HP`,'nr');}
    S.activeEv=null;save();renderEvBanner();renderEvPanel();renderDash();
  }
}
function togEvTask(tid){
  if(!S.activeEv)return;
  const ev=EVENTS_DB.find(e=>e.id===S.activeEv.eid);if(!ev)return;
  const task=ev.tasks.find(t=>t.id===tid);if(!task)return;
  if(S.activeEv.done[tid]){delete S.activeEv.done[tid];S.activeEv.hp=Math.min(S.activeEv.mhp,S.activeEv.hp+task.dmg);eLog(`<span style="color:var(--text2)">↩ ${task.nm} desmarcado.</span>`);}
  else{
    S.activeEv.done[tid]=true;
    const bm=1+(eqPow()/100);const dmg=Math.floor(task.dmg*bm);
    S.activeEv.hp=Math.max(0,S.activeEv.hp-dmg);
    eLog(`<span class="elh">⚔ ${task.ic} ${task.nm}: ${dmg} dano (×${bm.toFixed(2)})!</span>`);
    if(S.activeEv.hp<=0){finishEv(ev);return;}
  }
  save();renderEvPanel();renderEvBanner();
}
function finishEv(ev){
  addXP(ev.rew.xp);addGold(ev.rew.gold);addCr(ev.rew.crystal);S.evC++;
  let itmNm='';
  if(ev.rew.item){const itm=EDB.find(e=>e.id===ev.rew.item);if(itm&&!S.owned.includes(itm.id)){S.owned.push(itm.id);S.eq[itm.slot]=itm.id;itmNm=itm.nm;}}
  S.evHist.unshift({nm:ev.cr,em:ev.em,dt:new Date().toLocaleDateString('pt-BR'),xp:ev.rew.xp,go:ev.rew.gold,cr:ev.rew.crystal,itm:itmNm});
  eLog(`<span class="elw">🏆 ${ev.em} ${ev.cr} DERROTADA! +${ev.rew.xp}XP +${ev.rew.gold}Gold +${ev.rew.crystal}💎${itmNm?' +'+itmNm:''}!</span>`);
  S.activeEv=null;save();checkAch();renderAll();
  notify('🏆','Criatura Derrotada!',`${ev.em} ${ev.cr}\n+${ev.rew.xp}XP +${ev.rew.gold}Gold +${ev.rew.crystal}💎${itmNm?'\n🎁 '+itmNm:''}!`,'ng');
}
function eLog(h){const l=document.getElementById('ev-log');if(l){l.innerHTML+=h+'\n';l.scrollTop=l.scrollHeight;}}

// =============== XP/GOLD/CR ===============
const XPL=lv=>Math.floor(100*Math.pow(1.4,lv-1));
const getMult=()=>{const base=S.streak>=30?2:S.streak>=7?1.5:S.streak>=3?1.2:1;return base+getClassStreakBonus();};
function addXP(n){
  const skillXp=(typeof getSkillXpBonus==='function')?getSkillXpBonus():1;
  const potXp=getPotionMult('xp');
  const g=Math.floor(n*getMult()*getClassXpMult()*getGuildXpBonus()*skillXp*potXp);S.xp+=g;S.totXp+=g;S.xpTd+=g;
  let lv=false;
  while(S.xp>=XPL(S.lv)){S.xp-=XPL(S.lv);S.lv++;lv=true;S.mhp+=10;S.hp=S.mhp;S.skillPts++;}
  if(lv){
    bLog(`<span style="color:var(--gold3)">✨ LEVEL UP! Nível ${S.lv} — HP completamente restaurado! +1 Ponto de Habilidade! (${S.mhp}/${S.mhp})</span>`);
    notify('🏆','LEVEL UP!',`Nível ${S.lv}! ❤️ HP restaurado! ✨ +1 Ponto de Habilidade!`,'ng');
    // Check evolution milestones
    const evolved = getEvolvedClass();
    const tree = S.playerClass ? CLASS_EVOLUTIONS[S.playerClass] : null;
    if(tree){
      const milestone = tree.find(stage=>stage.lv===S.lv);
      if(milestone){
        setTimeout(()=>{
          showMo(
            `${milestone.icon} EVOLUÇÃO DE CLASSE!`,
            null,
            `<div style="text-align:center;padding:10px 0">
              <div style="font-size:48px;margin-bottom:8px">${milestone.icon}</div>
              <div style="font-family:'Cinzel Decorative',serif;font-size:18px;color:${milestone.color};margin-bottom:4px">${milestone.name}</div>
              <div style="font-size:12px;color:var(--text2);margin-bottom:14px;font-style:italic">Nível ${milestone.lv} alcançado!</div>
              <div style="background:rgba(0,0,0,.4);border:1px solid ${milestone.color}40;border-radius:8px;padding:12px">
                <div style="font-family:'Cinzel',serif;font-size:11px;color:${milestone.color};margin-bottom:4px">${milestone.skill.icon} ${milestone.skill.name}</div>
                <div style="font-size:11px;color:var(--text2);line-height:1.6">${milestone.skill.desc}</div>
              </div>
            </div>`,
            [{lb:'🎉 Aceitar Evolução!',ac:'closeMo()',cl:'btn'}]
          );
        },600);
        return g;
      }
    }
    notify('🏆','LEVEL UP!',`Nível ${S.lv}!`,'ng');
  }
  return g;
}
function addGold(n){const skillGold=(typeof getSkillGoldBonus==='function')?getSkillGoldBonus():1;const potGold=getPotionMult('gold');const g=Math.floor(n*getMult()*getClassGoldMult()*getGuildGoldBonus()*skillGold*potGold);S.gold+=g;S.totGo+=g;S.goTd+=g;return g;}
function addCr(n){const skillCr=(typeof getSkillCrBonus==='function')?getSkillCrBonus():1;const potCr=getPotionMult('cr');const g=Math.floor(n*getClassCrMult()*skillCr*potCr);S.cr+=g;S.totCr+=g;return g;}

// ── COMBO DE HÁBITOS ─────────────────────────────────────────────────────────
// Dispara dano bônus ao atingir limiares de hábitos completos no dia.
// Cada limiar é disparado uma única vez por dia (guardado em S.comboHit).
const COMBO_TIERS = [
  { at:3, label:'⚡ COMBO I',    color:'#f39c12', dmgMult:0.8,  xpBonus:20,  msg:'3 missões em cadeia!'   },
  { at:5, label:'🌟 COMBO II',   color:'#e67e22', dmgMult:1.5,  xpBonus:50,  msg:'5 missões! Imparável!'  },
  { at:8, label:'💥 PERFEITO!',  color:'#e74c3c', dmgMult:3.0,  xpBonus:120, msg:'Dia Perfeito — PODER MÁXIMO!' },
];
function checkHabitCombo(lastDmg){
  if(S.boss.def) return;
  if(!S.comboHit) S.comboHit = {};
  const today = new Date().toDateString();
  // Resetar flags se for um novo dia
  if(S.comboHit._day !== today) S.comboHit = {_day: today};
  COMBO_TIERS.forEach(tier=>{
    if(S.dnTd === tier.at && !S.comboHit[tier.at]){
      S.comboHit[tier.at] = true;
      const comboDmg = Math.max(1, Math.floor(lastDmg * tier.dmgMult));
      S.boss.hp = Math.max(0, S.boss.hp - comboDmg);
      const xpGained = addXP(tier.xpBonus);
      bLog(`<span style="color:${tier.color};font-weight:bold">${tier.label}: ${tier.msg} +${comboDmg} dano em cadeia! +${xpGained} XP!</span>`);
      notify(tier.label, tier.msg, `+${comboDmg} dano bonus! +${xpGained} XP!`, 'ng');
      animBossHit(comboDmg, false);
      save(); renderBoss(); renderMini();
    }
  });
}

// =============== HABITS ===============
function togH(id){
  const h=S.habits.find(x=>x.id===id);if(!h)return;
  // Block unavailable habit types
  if(!h.dn && !isHabitAvailable(h)){
    const msg=h.tp==='unique'?'Esta missão única já foi completada!':h.tp==='weekly'?'Esta missão semanal já foi completada esta semana!':'';
    if(msg){ notify('⚠️','Indisponível',msg,'nc'); return; }
  }
  const m=getMult();
  if(h.dn){h.dn=false;const xr=Math.floor(h.xb*m),gr=Math.floor(h.gb*m);S.xp=Math.max(0,S.xp-xr);S.totXp=Math.max(0,S.totXp-xr);S.xpTd=Math.max(0,S.xpTd-xr);S.gold=Math.max(0,S.gold-gr);S.totGo=Math.max(0,S.totGo-gr);S.goTd=Math.max(0,S.goTd-gr);S.dnTd=Math.max(0,S.dnTd-1);}
  else{
    h.dn=true;h.td++;S.dnTd++;
    if(h.tp==='weekly') h.weekDone=WS();
    if(h.tp==='unique') h.completed=true;
    const xg=addXP(h.xb),gg=addGold(h.gb);S.attrs[h.at].v=Math.min(100,S.attrs[h.at].v+1);
    const bAtk=Math.floor(S.attrs.dis.v*.4+S.attrs.ene.v*.3+S.lv*2);
    const archerBonus=(S.playerClass==='archer'?S.attrs.ene.v:0)*0.5;
    const dmg=Math.floor((bAtk*0.6+S.attrs[h.at].v*0.5+S.lv*1.5+archerBonus)*getClassDmgMult());
    // Process DoTs BEFORE this hit
    processDots();
    bossDmg(dmg,h.nm);

    // ── COMBO DE HÁBITOS ─────────────────────────────────────────
    // 3 hábitos = Combo I · 5 = Combo II · 8 = Combo Perfeito
    checkHabitCombo(dmg);

    // ── Special class abilities on mission completion ──
    const evo = getEvolvedClass();
    if(evo && S.playerClass){
      // CLERIC: heal on Wisdom/Mind missions
      if(S.playerClass==='cleric'){
        const healAttrs = ['sab','men','car'];
        if(healAttrs.includes(h.at)){
          const heal = evo.lv>=100?15:evo.lv>=50?10:8;
          S.hp=Math.min(S.mhp,S.hp+heal);
          bLog(`<span style="color:#f5e098">✝️ Bênção Divina: +${heal} HP restaurado!</span>`);
        }
      }
      // DRUID: HP recovery on any attr
      if(S.playerClass==='druid' && evo.lv>=1){
        S.hp=Math.min(S.mhp,S.hp+5);
      }
      // PALADIN: low HP = more dmg (logged via resolveEffects mult)
      // BARD: stacking song buff (tracked via S.bardBuff)
      if(S.playerClass==='bard'){
        if(!S.bardBuff) S.bardBuff={count:0,day:new Date().toDateString()};
        if(S.bardBuff.day!==new Date().toDateString()){S.bardBuff={count:0,day:new Date().toDateString()};}
        S.bardBuff.count=Math.min(S.bardBuff.count+1,10);
        if(S.bardBuff.count>=3 && evo.lv>=25){
          addXP(10); // Trovador bonus
        }
      }
      // ROGUE: 30% furtive crit doubles dano (tracked in resolveEffects already via shadow)
    }

    notify('⚡','Missão!',`${h.ic} ${h.nm}\n+${xg}XP +${gg}Gold`,'ng');checkAch();
    // Check if any active quest is auto-triggered by this habit completion
    if(typeof checkQuestTriggers==='function') checkQuestTriggers();
  }
  save();renderAll();
}
function togBad(id){
  const bh=BAD_H.find(x=>x.id===id);if(!bh)return;
  const el=document.getElementById('bh-'+id);
  if(el&&el.classList.contains('pun')){el.classList.remove('pun');const c=el.querySelector('.hchk');if(c)c.innerHTML='';return;}
  const gl=Math.max(1,Math.floor(S.gold*bh.gp));S.gold=Math.max(0,S.gold-gl);S.hp=Math.max(1,S.hp-bh.hp);S.cStr=0;S.bdTd++;S.badLog[id]=(S.badLog[id]||0)+1;
  bossAtk(bh.nm);const fl=document.createElement('div');fl.className='pfl';document.body.appendChild(fl);setTimeout(()=>fl.remove(),600);
  if(el){el.classList.add('pun');const c=el.querySelector('.hchk');if(c)c.innerHTML='✕';}
  notify('💀','Vício!',`${bh.ic} ${bh.nm}\n-${gl}Gold -${bh.hp}HP`,'nr');
  save();renderStatus();renderDash();renderBoss();renderMini();
}
function addHabit(){
  const nm=document.getElementById('nh-nm').value.trim();if(!nm)return;
  const xb=parseInt(document.getElementById('nh-xp').value)||20;const gb=parseInt(document.getElementById('nh-gd').value)||10;
  const at=document.getElementById('nh-at').value;const ic=document.getElementById('nh-ic').value||'⚡';
  const tp=document.getElementById('nh-tp')?document.getElementById('nh-tp').value:'daily';
  S.habits.push({id:'c'+Date.now(),nm,ic,xb,gb,at,dn:false,sk:0,td:0,tp});
  document.getElementById('nh-nm').value='';save();renderHabits();
}

// =============== NEW DAY ===============
function confDay(){showMo('🌅 Novo Dia?','Registrar progresso, aplicar streak e resetar missões.',null,[{lb:'Cancelar',ac:'closeMo()'},{lb:'Sim!',ac:'newDay()',cl:'btn'}]);}
function newDay(){
  closeMo();
  const today=new Date().toDateString();
  const todayISO=new Date().toISOString().substring(0,10);
  const done=S.habits.filter(h=>h.dn).length;
  S.hist.push({
    day:today,
    date:todayISO,
    xp:S.xpTd,
    gold:S.goTd,
    go:S.goTd,
    done:done,
    dn:done,
    tot:S.habits.length
  });
  if(S.hist.length>60)S.hist.shift();
  if(done>0){S.streak++;S.daysA++;S.cStr++;
    if(S.streak%7===0){for(const k in S.attrs)S.attrs[k].v=Math.min(100,S.attrs[k].v+5);notify('✨','Streak!','7 dias! +5 atribs!','ng');}
    S.habits.forEach(h=>{if(h.dn){h.sk++;S.attrs[h.at].sk++;}else if(h.tp!=='unique'&&h.tp!=='weekly') h.sk=0;if(h.tp!=='unique'&&h.tp!=='weekly') h.dn=false; else if(h.tp==='daily') h.dn=false;});}
  else{S.streak=0;S.cStr=0;S.habits.forEach(h=>{h.dn=false;h.sk=0;});}
  S.xpTd=0;S.goTd=0;S.dnTd=0;S.bdTd=0;S.badLog={};S.lastDay=today;
  // Check quest triggers after streaks are updated
  if(typeof checkQuestTriggers==='function') checkQuestTriggers();
  checkBW();checkAch();save();renderAll();
  if(Math.random()<0.4&&!S.activeEv)setTimeout(spawnEv,2000);
  notify('🌅','Novo Dia!','A jornada continua!','ng');
}

// =============== SHOP ===============
function buyShop(id){
  const item=SHOP_ITEMS.find(x=>x.id===id);if(!item)return;
  if(S.gold<item.pr){notify('🪙','Sem gold!',`Precisa de ${item.pr}.`,'nr');return;}
  S.gold-=item.pr;S.phist.unshift({nm:item.nm,ik:item.ik,em:item.em||'🛒',pr:item.pr,dt:new Date().toLocaleDateString('pt-BR')});
  if(item.ef==='heal30'){S.hp=Math.min(S.mhp,S.hp+30);notify('🧪','Curado!','+30 HP!','ng');}
  else if(item.ef==='healFull'){S.hp=S.mhp;notify('⚗️','HP Total!','Completamente restaurado!','ng');}
  else if(item.ef==='xp100'){addXP(100);notify('✨','XP!','+100 XP!','ng');}
  else if(item.ef==='attrB'){for(const k in S.attrs)S.attrs[k].v=Math.min(100,S.attrs[k].v+2);notify('🎓','Upgrade!','+2 todos atribs!','ng');}
  else notify('🛒','Comprado!',`${item.nm}!`,'ng');
  checkAch();save();renderAll();
}

// ═══════════════════════════════════════════════════════════════
// POTION SYSTEM
// ═══════════════════════════════════════════════════════════════

function getPot(id){ return (typeof POTION_DB!=='undefined')?POTION_DB.find(p=>p.id===id):null; }

function getPotionMult(stat){
  if(!S.activePotions||!S.activePotions.length) return 1;
  cleanExpiredPotions();
  let bonus=0;
  S.activePotions.forEach(ap=>{
    const e=ap.effect;
    if(stat==='xp'  &&(e==='xp50_24h'||e==='gold100xp100_1h'||e==='cr50xp50_24h')) bonus+=e==='gold100xp100_1h'?100:50;
    if(stat==='gold'&&(e==='gold60_24h'||e==='gold100xp100_1h'))                    bonus+=e==='gold100xp100_1h'?100:60;
    if(stat==='cr'  &&(e==='cr40_24h'  ||e==='cr50xp50_24h'))                       bonus+=e==='cr50xp50_24h'?50:40;
    if(stat==='skill'&&e==='skill30_24h') bonus+=30;
  });
  return 1+bonus/100;
}

function hasBossShield(){
  cleanExpiredPotions();
  return (S.activePotions||[]).some(ap=>ap.effect==='boss_shield');
}
function consumeBossShield(){
  const idx=(S.activePotions||[]).findIndex(ap=>ap.effect==='boss_shield');
  if(idx!==-1){S.activePotions.splice(idx,1);save();}
}
function getBossDmgPotionMult(){
  const ap=(S.activePotions||[]).find(ap=>ap.effect==='boss3x_3atk'&&(ap.usesLeft===undefined||ap.usesLeft>0));
  if(!ap) return 1;
  ap.usesLeft--;if(ap.usesLeft<=0)S.activePotions.splice(S.activePotions.indexOf(ap),1);
  save();return 3;
}
function cleanExpiredPotions(){
  if(!S.activePotions) return;
  const now=Date.now();
  S.activePotions=S.activePotions.filter(ap=>{
    if(ap.expiresAt&&ap.expiresAt<now) return false;
    if(ap.usesLeft!==undefined&&ap.usesLeft<=0) return false;
    return true;
  });
}

function buyPotion(id){
  const pot=getPot(id);
  if(!pot){notify('⚠️','Erro','Poção não encontrada.','nr');return;}
  if(S.gold<pot.cost){notify('🪙','Ouro insuficiente',`Precisa de ${pot.cost}🪙. Você tem ${S.gold}🪙.`,'nr');return;}
  confMo(`Comprar <strong>${pot.nm}</strong>?`,
    `Custo: <strong style="color:var(--gold2)">${pot.cost}🪙</strong> · <em>${pot.desc}</em><br>Você tem ${S.gold}🪙.`,
    ()=>{
      S.gold-=pot.cost;
      if(!S.potionInv)S.potionInv={};
      S.potionInv[id]=(S.potionInv[id]||0)+1;
      save();renderPotions();renderStatus();
      notify('⚗️',`${pot.nm} adquirida!`,'Use na aba Poções para ativar.','ng');
    }
  );
}

function usePotion(id){
  if(!S.potionInv||!(S.potionInv[id]>0)){notify('⚗️','Sem estoque','Você não tem essa poção.','nr');return;}
  const pot=getPot(id);if(!pot)return;
  const now=Date.now(),h24=now+86400000,h1=now+3600000;
  let entry=null;
  switch(pot.effect){
    case 'xp50_24h':        entry={id,effect:pot.effect,expiresAt:h24};break;
    case 'cr40_24h':        entry={id,effect:pot.effect,expiresAt:h24};break;
    case 'gold60_24h':      entry={id,effect:pot.effect,expiresAt:h24};break;
    case 'gold100xp100_1h': entry={id,effect:pot.effect,expiresAt:h1}; break;
    case 'skill30_24h':     entry={id,effect:pot.effect,expiresAt:h24};break;
    case 'cr50xp50_24h':    entry={id,effect:pot.effect,expiresAt:h24};break;
    case 'boss3x_3atk':     entry={id,effect:pot.effect,usesLeft:3};   break;
    case 'boss_shield':     entry={id,effect:pot.effect,usesLeft:1};   break;
    case 'hp50pct':{
      const heal=Math.floor(S.mhp*0.5);S.hp=Math.min(S.mhp,S.hp+heal);
      notify('💊','Vida restaurada!',`+${heal} HP!`,'ng');
      bLog(`<span style="color:var(--green3)">⚗️ ${pot.nm}: +${heal} HP!</span>`);break;
    }
    case 'streak2x_today':
      (S.habits||[]).forEach(h=>{if(h.dn&&h.sk>0)h.sk++;});
      notify('🔥','Streaks turbinados!','Todos os streaks ativos +1!','ng');
      bLog(`<span style="color:var(--gold2)">⚗️ ${pot.nm}: streaks +1!</span>`);break;
  }
  if(entry){if(!S.activePotions)S.activePotions=[];S.activePotions.push(entry);}
  S.potionInv[id]--;if(S.potionInv[id]<=0)delete S.potionInv[id];
  save();renderPotions();renderStatus();renderAll();
  if(entry)notify('⚗️',`${pot.nm} ativada!`,`${pot.desc}`,'ng');
}

function grantRandomPotion(){
  if(typeof POTION_DB==='undefined'||!POTION_DB.length)return;
  const pool=POTION_DB.filter(p=>p.rarity!=='legendary');
  const pot=pool[Math.floor(Math.random()*pool.length)];
  if(!S.potionInv)S.potionInv={};
  S.potionInv[pot.id]=(S.potionInv[pot.id]||0)+1;
  save();renderPotions();
  notify('🎁','Poção encontrada!',`${pot.nm} — ${pot.desc}`,'ng');
  bLog(`<span class="lw">🎁 DROP: ${pot.nm}! Veja na aba Poções.</span>`);
}

// ═══════════════════════════════════════════════════════════════
// END POTION SYSTEM
// ═══════════════════════════════════════════════════════════════

// =============== QUESTS ===============
function genQ(){
  const pool=[...QUEST_POOL].sort(()=>Math.random()-.5).slice(0,10);
  const c=document.getElementById('q-list');if(!c)return;
  const rm={epic:'ÉPICA',rare:'RARA',common:'COMUM'};const rcl={epic:'qe',rare:'qr',common:'qco'};
  c.innerHTML=pool.map(q=>{
    const trig=QUEST_TRIGGERS[q.ti];
    const trigBadge=trig
      ? `<div style="margin:4px 0;display:inline-flex;align-items:center;gap:4px;background:rgba(201,168,76,.08);border:1px solid rgba(201,168,76,.25);border-radius:10px;padding:2px 8px">
           <span style="font-size:9px">🎯</span>
           <span style="font-family:'Cinzel',serif;font-size:8px;color:var(--gold2)">Auto-conclusão por hábito</span>
         </div><br>`
      : '';
    return `<div class="qc ${rcl[q.r]}"><div class="qt">${q.ti}</div><div class="qd">${q.ds}</div>
    ${trigBadge}
    <div class="qf"><span class="qry r-${q.r}">⬥ ${rm[q.r]}</span>
    <div class="qrw"><span class="qx">+${q.xp}XP</span><span class="qg">+${q.go}🪙</span><span class="qcr">+${q.cr}💎</span>
    <button class="btn bsm" onclick="accQ(${JSON.stringify(q).split('"').join("'")})">Aceitar</button></div></div></div>`;
  }).join('');
}
function accQ(q){
  if(S.aQ.find(a=>a.ti===q.ti)){notify('⚠️','Já ativa!','','ng');return;}
  if(S.aQ.length>=10){notify('⚠️','Limite','Máx 10 quests ativas.','nc');return;}
  // Attach penalty: common=10%, rare=15%, epic=20%
  const penMap={common:10,rare:15,epic:20};
  S.aQ.push({...q,acc:new Date().toLocaleDateString('pt-BR'),pen:penMap[q.r]||15});
  save();renderActiveQ();
  notify('🗺️','Quest Aceita!',`"${q.ti}" — cuidado, falhar custa HP!`,'ng');
}
function doneQ(i){
  const q=S.aQ[i];
  addXP(q.xp);addGold(q.go);addCr(q.cr);
  S.aQ.splice(i,1);
  notify('🏆','Quest Concluída!',`+${q.xp}XP +${q.go}🪙 +${q.cr}💎`,'ng');
  checkAch();save();renderAll();
}
function failQ(i){
  const q=S.aQ[i];
  const pen=q.pen||15; // % of max HP as penalty
  const dmg=Math.max(5,Math.floor(S.mhp*(pen/100)));
  showMo('⚠ Abandonar Quest?',null,
    `<div style="text-align:center;padding:8px 0">
      <div style="font-size:36px;margin-bottom:8px">💔</div>
      <div style="font-family:'Cinzel',serif;font-size:13px;color:var(--red3);margin-bottom:8px">${q.ti}</div>
      <div style="font-size:12px;color:var(--text2);line-height:1.7">
        Abandonar esta quest terá consequências.<br>
        Penalidade: <strong style="color:var(--red3)">−${dmg} HP</strong> (${pen}% do HP máximo).
      </div>
      <div style="margin-top:10px;font-size:10px;color:var(--text3);font-style:italic">"A falta de disciplina tem seu preço."</div>
    </div>`,
    [
      {lb:'Cancelar',ac:'closeMo()'},
      {lb:`💔 Abandonar (−${dmg} HP)`,ac:`applyFailQ(${i})`,cl:'btn bred'}
    ]
  );
}
function applyFailQ(i){
  closeMo();
  const q=S.aQ[i];
  const pen=q.pen||15;
  const dmg=Math.max(5,Math.floor(S.mhp*(pen/100)));
  const shadowMult=getGuildViceDmgMult();
  const finalDmg=Math.max(1,Math.floor(dmg*shadowMult));
  S.hp=Math.max(0,S.hp-finalDmg);
  if(shadowMult<1) bLog(`<span style="color:#7f8c8d">🌑 Sombras: dano reduzido ${dmg}→${finalDmg}</span>`);
  animBossAttack();
  S.aQ.splice(i,1);
  notify('💔','Quest Abandonada',`Penalidade: −${dmg} HP por falta de disciplina.`,'nr');
  if(S.hp<=0) playerDeath();
  save();renderAll();
}
function renderActiveQ(){
  const c=document.getElementById('q-act');if(!c)return;
  if(!S.aQ.length){c.innerHTML='<div style="font-size:12px;color:var(--text2);font-style:italic;padding:8px 0">Nenhuma quest ativa. Vá à aba Quests para aceitar!</div>';return;}
  const rcl={epic:'qe',rare:'qr',common:'qco'};
  c.innerHTML=S.aQ.map((q,i)=>{
    const pen=q.pen||15;
    const dmg=Math.max(5,Math.floor(S.mhp*(pen/100)));

    // Build trigger progress bar if quest has a trigger
    let trigHtml='';
    const trig=QUEST_TRIGGERS[q.ti];
    if(trig){
      let cur=0, max=trig.target||1, label='', icon='🎯';
      if(trig.type==='streak'){
        const h=(S.habits||[]).find(h=>h.nm===trig.habit);
        cur=h?Math.min(h.sk||0,max):0;
        label=`${trig.habit}: ${cur}/${max} dias streak`;icon='🔥';
      } else if(trig.type==='total'){
        const h=(S.habits||[]).find(h=>h.nm===trig.habit);
        cur=h?Math.min(h.td||0,max):0;
        label=`${trig.habit}: ${cur}/${max} completadas`;icon='✅';
      } else if(trig.type==='level'){
        cur=Math.min(S.lv,max);
        label=`Nível ${cur}/${max}`;icon='⭐';
      } else if(trig.type==='all_today'){
        const total=(S.habits||[]).filter(h=>!h.tp||h.tp==='daily').length;
        cur=(S.habits||[]).filter(h=>h.dn).length;max=total;
        label=`Hoje: ${cur}/${total} missões concluídas`;icon='🌟';
      } else if(trig.type==='streak_any'){
        cur=Math.min(Math.max(...(S.habits||[]).map(h=>h.sk||0),0),max);
        label=`Melhor streak: ${cur}/${max} dias`;icon='🔥';
      }
      const pct=max>0?Math.min(100,Math.round(cur/max*100)):0;
      const done=cur>=max;
      trigHtml=`
        <div style="margin:5px 0 4px;background:rgba(0,0,0,.4);border:1px solid ${done?'rgba(39,174,96,.4)':'rgba(201,168,76,.15)'};border-radius:6px;padding:6px 8px">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">
            <span style="font-size:9px;font-family:'Cinzel',serif;color:${done?'var(--green3)':'var(--gold2)'};">${icon} Auto-conclusão: ${label}</span>
            <span style="font-size:9px;color:${done?'var(--green3)':'var(--text3)'};">${pct}%</span>
          </div>
          <div style="height:4px;background:rgba(0,0,0,.5);border-radius:2px;overflow:hidden">
            <div style="height:100%;width:${pct}%;background:${done?'var(--green3)':'var(--gold2)'};border-radius:2px;transition:width .4s"></div>
          </div>
          ${done?'<div style="font-size:9px;color:var(--green3);margin-top:3px;font-style:italic">✓ Condição atingida — recompensa sendo processada...</div>':''}
        </div>`;
    }

    return `<div class="qc ${rcl[q.r]}">
      <div class="qt">${q.ti}</div>
      <div class="qd">${q.ds}</div>
      ${trigHtml}
      <div style="margin:4px 0 6px">
        <span style="font-size:9px;font-family:'Cinzel',serif;background:rgba(192,57,43,.15);border:1px solid rgba(192,57,43,.3);color:var(--red3);border-radius:8px;padding:1px 7px">⚠ Falhar: −${dmg} HP (${pen}%)</span>
      </div>
      <div class="qf">
        <span style="font-size:10px;color:var(--text3)">Aceita: ${q.acc}</span>
        <div class="qrw">
          <span class="qx">+${q.xp}XP</span><span class="qg">+${q.go}🪙</span><span class="qcr">+${q.cr}💎</span>
          ${!trig?`<button class="btn bsm" onclick="doneQ(${i})" style="background:rgba(39,174,96,.1);border-color:rgba(39,174,96,.5);color:var(--green3)">✓ Concluir</button>`:'<span style="font-size:9px;color:var(--text3);font-style:italic">Auto</span>'}
          <button class="btn bsm bred" onclick="failQ(${i})" style="font-size:8px">✕ Falhar</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

// ═══════════════════════════════════════════════════════════════
// HABIT → QUEST TRIGGER SYSTEM
// Cada entrada mapeia um quest title → condição automática de conclusão.
// type: 'streak'  → hábito com streak >= target dias consecutivos
//       'total'   → hábito concluído >= target vezes no total (h.td)
//       'days'    → dias ativos no S.hist com aquele hábito concluído
//       'level'   → jogador no nível >= target
//       'streak_any' → qualquer hábito com streak >= target
//       'all_today'  → todos hábitos concluídos no mesmo dia (via dnTd)
// ═══════════════════════════════════════════════════════════════
const QUEST_TRIGGERS = {
  // ── ÁGUA ─────────────────────────────────────────────────────
  'Aquário Vivo':          { habit:'Beber 3L de água',     type:'streak',  target:10  },
  'Fonte Imortal':         { habit:'Beber 3L de água',     type:'streak',  target:30  },
  'Hidratação Sagrada':    { habit:'Beber 3L de água',     type:'total',   target:50  },

  // ── TREINO ───────────────────────────────────────────────────
  'Corpo de Ferro':        { habit:'Treino / Academia',    type:'streak',  target:7   },
  'Atleta Forjado':        { habit:'Treino / Academia',    type:'streak',  target:21  },
  'Guerreiro Lendário':    { habit:'Treino / Academia',    type:'total',   target:100 },
  'Força Bruta':           { habit:'Treino / Academia',    type:'streak',  target:14  },

  // ── SONO ─────────────────────────────────────────────────────
  'Guardião do Sono':      { habit:'Dormir 7h+',           type:'streak',  target:7   },
  'Sono Reparador':        { habit:'Dormir 7h+',           type:'streak',  target:14  },
  'Mestre do Descanso':    { habit:'Dormir 7h+',           type:'total',   target:30  },

  // ── MEDITAÇÃO ────────────────────────────────────────────────
  'Mente Cristalina':      { habit:'Meditação',            type:'streak',  target:7   },
  'Monge Interno':         { habit:'Meditação',            type:'streak',  target:21  },
  'Vazio Sagrado':         { habit:'Meditação',            type:'total',   target:50  },
  'Paz Profunda':          { habit:'Meditação',            type:'streak',  target:14  },

  // ── DIETA ────────────────────────────────────────────────────
  'Alquimista da Nutrição':{ habit:'Seguir a Dieta',       type:'streak',  target:7   },
  'Templo do Corpo':       { habit:'Seguir a Dieta',       type:'streak',  target:21  },
  'Corpo Sagrado':         { habit:'Seguir a Dieta',       type:'total',   target:60  },
  'Disciplina Alimentar':  { habit:'Seguir a Dieta',       type:'streak',  target:14  },

  // ── LEITURA ──────────────────────────────────────────────────
  'Devorador de Livros':   { habit:'Leitura 30min',        type:'streak',  target:10  },
  'Sábio do Norte':        { habit:'Leitura 30min',        type:'streak',  target:21  },
  'Biblioteca Viva':       { habit:'Leitura 30min',        type:'total',   target:50  },

  // ── DIÁRIO / JOURNALING ───────────────────────────────────────
  'Crônicas do Herói':     { habit:'Journaling / Diário',  type:'streak',  target:7   },
  'Memórias Eternas':      { habit:'Journaling / Diário',  type:'streak',  target:30  },
  'Escriba Imortal':       { habit:'Journaling / Diário',  type:'total',   target:50  },

  // ── MOBILIDADE ───────────────────────────────────────────────
  'Corpo Fluído':          { habit:'Mobilidade / Alongamento', type:'streak', target:7 },
  'Serpente de Jade':      { habit:'Mobilidade / Alongamento', type:'streak', target:21},

  // ── MULTI-HÁBITO / NÍVEL ─────────────────────────────────────
  'Renascimento':          { type:'level',      target:10  },
  'Ascensão do Herói':     { type:'level',      target:25  },
  'Herói Transcendente':   { type:'level',      target:50  },
  'Dia Perfeito':          { type:'all_today',  target:1   },
  'Semana Impecável':      { type:'streak_any', target:7   },
  'Mestre da Consistência':{ type:'streak_any', target:30  },
};

// ── CHECK IF A SINGLE QUEST IS TRIGGERED ────────────────────────
function isQuestTriggered(q){
  const trig = QUEST_TRIGGERS[q.ti];
  if(!trig) return false;

  if(trig.type === 'streak'){
    const h = (S.habits||[]).find(h=>h.nm===trig.habit);
    return h && (h.sk||0) >= trig.target;
  }
  if(trig.type === 'total'){
    const h = (S.habits||[]).find(h=>h.nm===trig.habit);
    return h && (h.td||0) >= trig.target;
  }
  if(trig.type === 'level'){
    return (S.lv||1) >= trig.target;
  }
  if(trig.type === 'all_today'){
    const total = (S.habits||[]).filter(h=>!h.tp||h.tp==='daily').length;
    const done  = (S.habits||[]).filter(h=>h.dn).length;
    return total > 0 && done >= total;
  }
  if(trig.type === 'streak_any'){
    return (S.habits||[]).some(h=>(h.sk||0) >= trig.target);
  }
  return false;
}

// ── AUTO-COMPLETE TRIGGERED QUESTS ─────────────────────────────
function checkQuestTriggers(){
  const triggered = (S.aQ||[]).filter(q => isQuestTriggered(q));
  if(!triggered.length) return;

  triggered.forEach(q => {
    const idx = S.aQ.indexOf(q);
    if(idx === -1) return;
    // Grant rewards
    addXP(q.xp);
    addGold(q.go);
    addCr(q.cr);
    S.aQ.splice(idx, 1);

    // Special celebratory notification for auto-completed quests
    notify('🏆', 'Quest Automática!',
      `"${q.ti}" — concluída pelos seus hábitos! +${q.xp}XP +${q.go}🪙 +${q.cr}💎`, 'ng');
    bLog(`<span style="color:var(--gold3)">🏆 Quest automática: <em>${q.ti}</em> — concluída pelo hábito! +${q.xp}XP +${q.go}🪙 +${q.cr}💎</span>`);
  });

  if(triggered.length) { checkAch(); save(); renderAll(); }
}

// ═══════════════════════════════════════════════════════════════
// END HABIT → QUEST TRIGGER SYSTEM
// ═══════════════════════════════════════════════════════════════
function checkAch(){
  ACHS.forEach(a=>{
    if(!uAch.includes(a.id)&&a.ck(S)){
      uAch.push(a.id);
      saveAch();
      triggerAchPopup(a);  // animated popup instead of simple notify
    }
  });
}

// =============== AVATAR ===============
function handleAv(e){const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>{S.avData=ev.target.result;save();applyAv(ev.target.result);notify('📷','Foto!','','ng');};r.readAsDataURL(f);}
function applyAv(d){
  const img=document.getElementById('av-img');const ph=document.getElementById('av-ph');const ed=document.getElementById('av-ed');
  const ci=document.getElementById('ch-img');const ce=document.getElementById('ch-em');
  if(d){if(img){img.src=d;img.style.display='block';}if(ph)ph.style.display='none';if(ed)ed.style.display='flex';if(ci){ci.src=d;ci.style.display='block';}if(ce)ce.style.display='none';}
}

// =============== RADAR ===============
function drawRadar(){
  const svg=document.getElementById('radar');if(!svg)return;
  const cx=130,cy=130,r=86;const attrs=Object.values(S.attrs);const n=attrs.length;
  const pts=attrs.map((a,i)=>{const ag=(Math.PI*2*i/n)-Math.PI/2;const p=a.v/100;return{x:cx+r*p*Math.cos(ag),y:cy+r*p*Math.sin(ag),lx:cx+(r+21)*Math.cos(ag),ly:cy+(r+21)*Math.sin(ag),a};});
  let html='';
  [.2,.4,.6,.8,1].forEach(p=>{const ps=attrs.map((_,i)=>{const ag=(Math.PI*2*i/n)-Math.PI/2;return`${cx+r*p*Math.cos(ag)},${cy+r*p*Math.sin(ag)}`;}).join(' ');html+=`<polygon points="${ps}" fill="none" stroke="rgba(201,168,76,0.1)" stroke-width="1"/>`;});
  attrs.forEach((_,i)=>{const ag=(Math.PI*2*i/n)-Math.PI/2;html+=`<line x1="${cx}" y1="${cy}" x2="${cx+r*Math.cos(ag)}" y2="${cy+r*Math.sin(ag)}" stroke="rgba(201,168,76,0.1)" stroke-width="1"/>`;});
  html+=`<polygon points="${pts.map(p=>`${p.x},${p.y}`).join(' ')}" fill="rgba(201,168,76,0.1)" stroke="rgba(201,168,76,0.5)" stroke-width="1.5"/>`;
  pts.forEach(p=>{html+=`<circle cx="${p.x}" cy="${p.y}" r="3.5" fill="${p.a.cl}" stroke="var(--bg)" stroke-width="1.5"/>`;});
  pts.forEach(p=>{html+=`<text x="${p.lx}" y="${p.ly}" text-anchor="middle" dominant-baseline="middle" font-size="11" fill="rgba(224,212,186,0.6)" font-family="Cinzel,serif">${p.a.ic}${p.a.v}</text>`;});
  svg.innerHTML=html;
}

// =============== RENDER ===============
// getTitle() defined above with class+bonus+base system
