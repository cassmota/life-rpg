// ui.js — Tabs, modals, notifications, tavern, import/export
// ────────────────────────────────────────────────────────────
"use strict";

function swT(p){
  document.querySelectorAll('.panel').forEach(x=>x.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
  const pn=document.getElementById('panel-'+p);if(pn)pn.classList.add('active');
  const tn=document.querySelector(`[data-p="${p}"]`);if(tn)tn.classList.add('active');
  // sync subtab pills — passa skipActivateFirst=true para não sobrescrever p
  setActiveSubtab(p);
  // sync bottom nav category
  for(const [cat,cfg] of Object.entries(NAV_CATS)){
    if(cfg.tabs.some(t=>t.p===p)){
      if(cat!==currentCat){
        currentCat=cat;
        document.querySelectorAll('.nav-cat').forEach(el=>el.classList.toggle('active',el.dataset.cat===cat));
        const lbl=document.getElementById('cat-label-text');
        if(lbl) lbl.textContent=cfg.label;
      }
      // Sempre reconstrói as pills marcando p como ativo, sem forçar a primeira
      renderSubtabs(cat, true);
      // Marcar a pill correta como active
      document.querySelectorAll('.subtab').forEach(el=>el.classList.toggle('active',el.dataset.p===p));
      break;
    }
  }
  if(p==='crafting') renderCrafting();
  if(p==='inventory') renderInventory();
  if(p==='classe') renderClasse();
  if(p==='profile') renderProfile();
  if(p==='calendar'){ if(typeof renderCal==='function') renderCal(); else if(typeof renderCalendar==='function') renderCalendar(); }
  if(p==='guilds') renderGuilds();
  if(p==='arena')   { if(typeof renderArena==='function')    renderArena();    }
  if(p==='events')  { if(typeof renderEvPanel==='function')  renderEvPanel();  if(typeof renderEvBanner==='function') renderEvBanner(); }
  if(p==='boss')    { if(typeof renderBoss==='function')     renderBoss();     }
  if(p==='potions') { if(typeof renderPotions==='function')  renderPotions();  }
  updateNavAlerts();
}
document.getElementById('tabs').addEventListener('click',e=>{const t=e.target.closest('.tab');if(!t)return;swT(t.dataset.p);});
document.getElementById('sm-flt').addEventListener('click',e=>{const b=e.target.closest('.sf-btn');if(!b||!b.dataset.sc)return;document.querySelectorAll('#sm-flt .sf-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');smF=b.dataset.sc;renderSmithy();});
document.getElementById('sh-flt').addEventListener('click',e=>{const b=e.target.closest('.sf-btn');if(!b||!b.dataset.sc2)return;document.querySelectorAll('#sh-flt .sf-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');shF=b.dataset.sc2;renderShop();});

// =============== MODAL ===============
function showMo(t,txt,html,btns=[]){
  s('mo-t',t||'');const mb=document.getElementById('mo-b');
  if(html)mb.innerHTML=html;else{mb.innerHTML='';if(txt)mb.textContent=txt;}
  document.getElementById('mo-f').innerHTML=(btns||[]).map(b=>`<button class="btn ${b.cl||''}" onclick="${b.ac}">${b.lb}</button>`).join('');
  document.getElementById('mo').classList.add('show');
}
function closeMo(){document.getElementById('mo').classList.remove('show');}
document.getElementById('mo').addEventListener('click',e=>{if(e.target===e.currentTarget)closeMo();});


// =============== TAVERN ===============
const TAV_SPEECHES = [
  '"Hmph... outro aventureiro tentando me enganar. Tudo bem, deixa ver o que você trouxe. Não espere preços justos — sou um homem de negócios, não um filantropo!"',
  '"Olha só, mais sucata! Mas tudo bem, minha mãe me ensinou a não desperdiçar. Vou levar por preço de custo — meu custo, claro."',
  '"Por que esses heróis sempre querem vender as armas mais enferrujadas? Não importa, aceito mesmo assim. Mas o preço... bah!"',
  '"Você de novo! Traz a porcaria, pega o ouro e sai da minha taberna. Tenho clientes reais esperando."',
  '"Uma espada em bom estado? Caramba, você me surpreendeu hoje! Ainda vou pagar barato, mas... pelo menos está apresentável."',
  '"Hmm, isso pode interessar ao meu fornecedor. Mas não pense que vou te dizer quanto vou lucrar com isso."',
];
function getTavSpeech(){ return TAV_SPEECHES[Math.floor(Math.random()*TAV_SPEECHES.length)]; }

function getSellPrice(item){
  // Boss reward items cannot be sold
  if(item.bossReward) return null;
  // 25% of crystal price, converted to gold (1 crystal ≈ 4 gold)
  if(item.price>0) return Math.max(5, Math.floor(item.price * 0.25 * 4));
  return 5; // free starter items
}

function renderTavernPotion(){
  const el = document.getElementById('tav-potion');
  if(!el) return;
  const hasClass = !!S.playerClass;
  const evo = getEvolvedClass();
  el.innerHTML = `
    <div style="background:linear-gradient(135deg,rgba(91,68,200,.08),rgba(0,0,0,.4));border:1px solid rgba(91,68,200,.3);border-radius:6px;padding:12px;display:flex;gap:10px;align-items:center">
      <span style="font-size:32px;flex-shrink:0">⚗️</span>
      <div style="flex:1">
        <div style="font-family:'Cinzel',serif;font-size:11px;color:#9b8fe0;margin-bottom:2px">Poção de Transformação</div>
        <div style="font-size:10px;color:var(--text2);line-height:1.5;margin-bottom:7px">
          ${hasClass && evo?`Permite trocar de <strong style="color:${evo.color}">${evo.name}</strong> para qualquer outra classe. Bônus de HP são revertidos.`:'Você ainda não tem uma classe — escolha gratuitamente na aba Classe!'}
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-family:'Cinzel Decorative',serif;font-size:15px;color:var(--crystal)">100 💎</span>
          <button class="btn bsm ${hasClass?'bcr':''}" onclick="${hasClass?'buyClassPotion()':'swT(\'classe\')'}" >
            ⚗️ Comprar Poção (100💎)
          </button>
        </div>
      </div>
    </div>`;
}

function sellItem(itemId){
  const item = EDB.find(e=>e.id===itemId);
  if(!item){ notify('❌','Erro','Item não encontrado.','nr'); return; }
  if(item.bossReward){ notify('🎁','Intransferível','Recompensas de Boss não podem ser vendidas!','nr'); return; }
  // Check not equipped
  const isEquipped = Object.values(S.eq).includes(itemId);
  if(isEquipped){ notify('⚔️','Equipado!','Desequipe o item antes de vender.','nr'); return; }
  if(!S.owned.includes(itemId)){ notify('❌','Erro','Você não possui este item.','nr'); return; }
  const price = getSellPrice(item);
  if(!price){ notify('❌','Impossível','Este item não pode ser vendido.','nr'); return; }

  // Confirm
  showMo(`Vender ${item.nm}?`,
    `O Grumpy oferece ${price} 🪙 ouro por este item. Confirma a venda?`,
    null,
    [{lb:'Cancelar', ac:'closeMo()'}, {lb:`Vender por ${price}🪙`, ac:`confirmSell('${itemId}')`, cl:'btn-sell'}]
  );
}

function confirmSell(itemId){
  closeMo();
  const item = EDB.find(e=>e.id===itemId);
  if(!item||!S.owned.includes(itemId)) return;
  const price = getSellPrice(item);
  // Remove from owned
  S.owned = S.owned.filter(id=>id!==itemId);
  // Add gold
  S.gold += price; S.totGo += price;
  // Track sale
  if(!S.tavHist) S.tavHist=[];
  S.tavHist.unshift({nm:item.nm, ik:item.ik, pr:price, dt:new Date().toLocaleDateString('pt-BR')});
  if(S.tavHist.length>20) S.tavHist.pop();
  save();
  const speech = TAV_SPEECHES[Math.floor(Math.random()*TAV_SPEECHES.length)];
  const sp=document.getElementById('tav-speech'); if(sp) sp.textContent=speech;
  notify('🪙','Vendido!',`${item.nm} vendido por ${price} gold!`,'ng');
  renderTavern(); renderStatus(); renderDash();
}

function renderTavern(){renderTavernPotion();
  s('tav-gold', S.gold);
  const list = document.getElementById('tav-inv-list');
  if(!list) return;

  const rm={common:'Comum',uncommon:'Incomum',rare:'Raro',epic:'Épico',legendary:'Lendário'};
  const rcolor={common:'var(--green3)',uncommon:'var(--blue3)',rare:'var(--purple3)',epic:'var(--gold2)',legendary:'var(--red3)'};

  // Get sellable items: owned, not equipped, not bossReward
  const sellable = S.owned
    .map(id=>EDB.find(e=>e.id===id))
    .filter(Boolean)
    .filter(item=>{
      if(item.bossReward) return false;
      if(Object.values(S.eq).includes(item.id)) return false;
      return true;
    })
    .sort((a,b)=>{
      const ro={common:0,uncommon:1,rare:2,epic:3,legendary:4};
      return ro[b.r]-ro[a.r];
    });

  if(!sellable.length){
    list.innerHTML='<div style="text-align:center;padding:24px;font-size:13px;color:var(--text2);font-style:italic">Você não tem itens para vender.<br>Todos os seus itens estão equipados ou são recompensas de Boss.</div>';
  } else {
    list.innerHTML = sellable.map(item=>{
      const imgSrc = IMGS[item.ik];
      const imgH = imgSrc
        ? `<img src="${imgSrc}" style="width:36px;height:36px;object-fit:contain;image-rendering:crisp-edges;filter:drop-shadow(0 1px 4px rgba(0,0,0,.7))">`
        : `<span style="font-size:22px">⚔️</span>`;
      const price = getSellPrice(item);
      const slotNm = SLOTS.find(s=>s.slot===item.slot)?.lbl || item.slot;
      return `<div class="inv-item">
        <div class="inv-item-img">${imgH}</div>
        <div class="inv-info">
          <div class="inv-nm" style="color:${rcolor[item.r]}">${item.nm}</div>
          <div class="inv-st">${rm[item.r]} · ${slotNm} · ATK+${item.atk} DEF+${item.def} PWR+${item.pw}%</div>
        </div>
        <div class="inv-price">
          <div class="sell-price">🪙 ${price}</div>
          <div class="sell-price-lbl">Gold</div>
          <button class="btn-sell" onclick="sellItem('${item.id}')">Vender</button>
        </div>
      </div>`;
    }).join('');
  }

  // Render history
  const hist = document.getElementById('tav-hist-list');
  if(hist){
    if(!S.tavHist||!S.tavHist.length){
      hist.innerHTML='<div style="font-size:12px;color:var(--text2);font-style:italic">Nenhuma venda ainda.</div>';
    } else {
      hist.innerHTML = (S.tavHist||[]).slice(0,15).map(h=>{
        const imgSrc = IMGS[h.ik]; const imgH = imgSrc?`<img src="${imgSrc}" style="width:22px;height:22px;object-fit:contain">`:'⚔️';
        return `<div style="display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid rgba(255,255,255,.04)">
          ${imgH}<span style="flex:1;font-size:12px;color:var(--text)">${h.nm}</span>
          <span style="font-size:10px;color:var(--text2)">${h.dt}</span>
          <span style="font-family:'Cinzel',serif;font-size:12px;color:#e8a842">+${h.pr}🪙</span>
        </div>`;
      }).join('');
    }
  }
}

// =============== NOTIF ===============
let nT;
function notify(icon,title,text,cls='ng'){
  clearTimeout(nT);const el=document.getElementById('notif');el.className='notif '+cls;
  s('ni',icon);s('nt2',title);s('nb',text);el.classList.add('show');nT=setTimeout(()=>el.classList.remove('show'),4000);
}

// =============== IMPORT BACKUP ===============
let _pendingImport = null;

function handleDrop(e){
  e.preventDefault();
  const dz = document.getElementById('drop-zone');
  dz.classList.remove('dz-hover');
  const file = e.dataTransfer?.files?.[0];
  if(!file){ dzError('Nenhum arquivo detectado.'); return; }
  readImportFile(file);
}

function handleImport(e){
  const file = e.target.files?.[0];
  if(!file) return;
  readImportFile(file);
  // reset input so same file can be re-selected
  e.target.value = '';
}

function readImportFile(file){
  const dz = document.getElementById('drop-zone');
  if(!file.name.endsWith('.json') && file.type !== 'application/json'){
    dzError('Arquivo inválido. Use um .json exportado pelo Life RPG.');
    return;
  }
  const reader = new FileReader();
  reader.onload = ev => {
    try{
      const data = JSON.parse(ev.target.result);
      validateAndPreviewImport(data, file.name);
    } catch(err){
      dzError('Arquivo corrompido ou inválido.');
    }
  };
  reader.onerror = () => dzError('Erro ao ler o arquivo.');
  reader.readAsText(file);
}

function validateAndPreviewImport(data, filename){
  const dz = document.getElementById('drop-zone');
  // Basic validation: must have lv and habits
  if(typeof data !== 'object' || !data.lv || !Array.isArray(data.habits)){
    dzError('Formato não reconhecido. Este arquivo não é um save do Life RPG.');
    return;
  }
  _pendingImport = data;
  dz.classList.remove('dz-error');
  dz.classList.add('dz-success');

  // Build preview
  const lv = data.lv || 1;
  const xp = data.totXp || 0;
  const gold = data.gold || 0;
  const cr = data.cr || 0;
  const streak = data.streak || 0;
  const kills = data.kills || 0;
  const habits = (data.habits||[]).length;
  const owned = (data.owned||[]).length;
  const achs = JSON.parse(localStorage.getItem('lrpgAch5')||'[]').length;

  document.getElementById('import-preview-body').innerHTML = `
    <div class="import-stat"><span class="import-stat-lbl">📁 Arquivo:</span><span class="import-stat-val" style="color:var(--text2);font-family:'Crimson Pro',serif;font-size:12px">${filename}</span></div>
    <div class="import-stat"><span class="import-stat-lbl">🏰 Nível:</span><span class="import-stat-val">${lv}</span></div>
    <div class="import-stat"><span class="import-stat-lbl">⚡ XP Total:</span><span class="import-stat-val">${xp.toLocaleString('pt-BR')}</span></div>
    <div class="import-stat"><span class="import-stat-lbl">🪙 Gold:</span><span class="import-stat-val">${gold.toLocaleString('pt-BR')}</span></div>
    <div class="import-stat"><span class="import-stat-lbl">💎 Cristais:</span><span class="import-stat-val">${cr}</span></div>
    <div class="import-stat"><span class="import-stat-lbl">🔥 Streak:</span><span class="import-stat-val">${streak} dias</span></div>
    <div class="import-stat"><span class="import-stat-lbl">🐉 Kills:</span><span class="import-stat-val">${kills} bosses</span></div>
    <div class="import-stat"><span class="import-stat-lbl">⚔ Missões:</span><span class="import-stat-val">${habits} hábitos</span></div>
    <div class="import-stat"><span class="import-stat-lbl">🛡 Itens:</span><span class="import-stat-val">${owned} equipamentos</span></div>
  `;
  document.getElementById('import-preview').style.display = 'block';
}

function confirmImport(){
  if(!_pendingImport){ notify('❌','Erro','Nenhum save pendente.','nr'); return; }
  showMo('📥 Confirmar Importação?',
    'Seu progresso atual será SUBSTITUÍDO pelo save importado. Esta ação não pode ser desfeita.',
    null,
    [
      {lb:'Cancelar', ac:'closeMo()'},
      {lb:'⚔ Importar Agora', ac:'doImport()', cl:'btn bcr'}
    ]
  );
}

function doImport(){
  closeMo();
  if(!_pendingImport){ notify('❌','Erro','Nenhum save pendente.','nr'); return; }
  try{
    // Merge with DEF() to ensure all keys exist (handles older saves missing new fields)
    const base = DEF();
    const merged = {...base, ..._pendingImport};
    // Ensure nested objects are complete
    for(const k in base){
      if(typeof base[k]==='object'&&!Array.isArray(base[k])&&base[k]!==null&&merged[k]){
        merged[k]={...base[k],...merged[k]};
      }
    }
    S = merged;
    localStorage.setItem('lrpg6', JSON.stringify(S));
    // Also restore achievements if present in file
    if(_pendingImport._achievements && Array.isArray(_pendingImport._achievements)){
      uAch = _pendingImport._achievements;
      localStorage.setItem('lrpgAch5', JSON.stringify(uAch));
    }
    _pendingImport = null;
    cancelImport();
    if(S.avData) applyAv(S.avData);
    genQ(); renderAll(); checkAch();
    notify('✅','Save Importado!',`Bem-vindo de volta, Nível ${S.lv}! Sua jornada continua.`,'ng');
    // Flash effect
    const fl=document.createElement('div');fl.style.cssText='position:fixed;inset:0;background:rgba(0,212,255,.12);z-index:999;pointer-events:none;animation:fl .6s ease-out';document.body.appendChild(fl);setTimeout(()=>fl.remove(),700);
  } catch(err){
    notify('❌','Erro na Importação','Arquivo inválido ou corrompido.','nr');
    console.error('Import error:', err);
  }
}

function cancelImport(){
  _pendingImport = null;
  document.getElementById('import-preview').style.display = 'none';
  const dz = document.getElementById('drop-zone');
  dz.classList.remove('dz-success','dz-error','dz-hover');
}

function dzError(msg){
  const dz = document.getElementById('drop-zone');
  dz.classList.add('dz-error');
  dz.classList.remove('dz-success');
  document.getElementById('import-preview').style.display = 'none';
  _pendingImport = null;
  notify('❌','Importação falhou', msg,'nr');
  setTimeout(()=>dz.classList.remove('dz-error'), 2500);
}

// =============== EXPORT/RESET ===============
function expData(){
  const exportObj = {...S, _achievements: uAch, _exportedAt: new Date().toISOString(), _appVersion: 'v7'};
  const blob=new Blob([JSON.stringify(exportObj,null,2)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);
  a.download=`life-rpg-${new Date().toLocaleDateString('pt-BR').replace(/\//g,'-')}.json`;
  a.click();
  notify('📤','Backup Exportado!','Guarde o arquivo em local seguro!','ng');
}
function confReset(){showMo('⚠️ Resetar?','TODO o progresso será perdido.',null,[{lb:'Cancelar',ac:'closeMo()'},{lb:'Resetar!',ac:'doReset()',cl:'btn bred'}]);}
function doReset(){closeMo();localStorage.removeItem('lrpg6');localStorage.removeItem('lrpgAch5');S=DEF();uAch=[];genQ();renderAll();notify('🔄','Reset!','Nova jornada!','ng');}

