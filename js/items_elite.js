// ═══════════════════════════════════════════════════════════════
// ELITE & EPIC ITEMS — appended to EDB and IMGS after data.js loads
// ═══════════════════════════════════════════════════════════════

// Load images from local files (img/elite/)
const ELITE_IMGS = {
  w_broom:      'img/elite/w_broom.jpg',
  w_firestf:    'img/elite/w_firestf.jpg',
  w_naturestf:  'img/elite/w_naturestf.jpg',
  w_bonestf:    'img/elite/w_bonestf.jpg',
  a_firerobes:  'img/elite/a_firerobes.jpg',
  a_leafcloak:  'img/elite/a_leafcloak.jpg',
  a_greencloak: 'img/elite/a_greencloak.jpg',
  a_ironplate:  'img/elite/a_ironplate.jpg',
  a_titanplate: 'img/elite/a_titanplate.jpg',
  a_warlord:    'img/elite/a_warlord.jpg',
  a_vamcloak:   'img/elite/a_vamcloak.jpg',
  h_ironhelm:   'img/elite/h_ironhelm.jpg',
  h_goldhelm:   'img/elite/h_goldhelm.jpg',
  h_skullcloak: 'img/elite/h_skullcloak.jpg',
  f_goldenleg:  'img/elite/f_goldenleg.jpg',
  f_whitelegs:  'img/elite/f_whitelegs.jpg',
  l_goldskirt:  'img/elite/l_goldskirt.jpg',
  g_vambrace:   'img/elite/g_vambrace.jpg',
  g_goldgaunt:  'img/elite/g_goldgaunt.jpg',
  w_bloomstaff: 'img/elite/w_bloomstaff.jpg',
};

// Item definitions
const ELITE_ITEMS = [
  {
    id:'w_broom', nm:'Vassoura da Bruxa', slot:'weapon', ik:'w_broom',
    pw:18, atk:22, def:5, price:380,
    tier:'elite', element:'arcane', elemBonus:15,
    elemColor:'#ce93d8', elemEmoji:'🔮',
    lore:'Forjada com galhos de yggdrasil e amarrada com tendões de dragão. Cada golpe libera energia arcana.',
    desc:'Elite · Weapon · 🔮 Arcane +15%',
    fx: null,
    sc:'weapon'
  },
  {
    id:'w_firestf', nm:'Cajado da Chama Viva', slot:'weapon', ik:'w_firestf',
    pw:22, atk:28, def:4, price:450,
    tier:'elite', element:'fire', elemBonus:20,
    elemColor:'#ff6b35', elemEmoji:'🔥',
    lore:'A esfera dourada no topo contém uma chama que nunca se apaga desde que o mundo começou.',
    desc:'Elite · Weapon · 🔥 Fire +20%',
    fx: null,
    sc:'weapon'
  },
  {
    id:'w_naturestf', nm:'Cajado da Floresta Viva', slot:'weapon', ik:'w_naturestf',
    pw:16, atk:18, def:8, price:340,
    tier:'elite', element:'nature', elemBonus:18,
    elemColor:'#7bc67e', elemEmoji:'🌿',
    lore:'Cresceu de um único galho do espírito da floresta. Cura ao mesmo tempo que destrói.',
    desc:'Elite · Weapon · 🌿 Nature +18%',
    fx: null,
    sc:'weapon'
  },
  {
    id:'w_bonestf', nm:'Lança do Crânio Eterno', slot:'weapon', ik:'w_bonestf',
    pw:25, atk:35, def:2, price:520,
    tier:'epic', element:'shadow', elemBonus:25,
    elemColor:'#b39ddb', elemEmoji:'💀',
    lore:'O crânio no topo ainda sente. Drena a vida dos inimigos e converte em força para o portador.',
    desc:'Épico · Weapon · 💀 Shadow +25%',
    fx: null,
    sc:'weapon'
  },
  {
    id:'a_firerobes', nm:'Robes da Chama Sagrada', slot:'armor', ik:'a_firerobes',
    pw:14, atk:5, def:18, price:420,
    tier:'elite', element:'fire', elemBonus:12,
    elemColor:'#ff6b35', elemEmoji:'🔥',
    lore:'Tecido com fios de magma solidificado. O calor interno afasta qualquer medo do combate.',
    desc:'Elite · Armor · 🔥 Fire +12%',
    fx: null,
    sc:'armor'
  },
  {
    id:'a_leafcloak', nm:'Manto das Folhas Eternas', slot:'armor', ik:'a_leafcloak',
    pw:12, atk:4, def:20, price:390,
    tier:'elite', element:'nature', elemBonus:14,
    elemColor:'#7bc67e', elemEmoji:'🌿',
    lore:'Cada folha é um escudo vivo. Regenera lentamente sob a luz da lua cheia.',
    desc:'Elite · Armor · 🌿 Nature +14%',
    fx: null,
    sc:'armor'
  },
  {
    id:'a_greencloak', nm:'Manto do Espírito Verde', slot:'armor', ik:'a_greencloak',
    pw:16, atk:6, def:17, price:410,
    tier:'elite', element:'nature', elemBonus:16,
    elemColor:'#7bc67e', elemEmoji:'🌿',
    lore:'O espírito da floresta vive neste manto. Quem o veste nunca se perde nos bosques mais sombrios.',
    desc:'Elite · Armor · 🌿 Nature +16%',
    fx: null,
    sc:'armor'
  },
  {
    id:'a_ironplate', nm:'Peitoral de Ferro Bruto', slot:'armor', ik:'a_ironplate',
    pw:10, atk:8, def:28, price:440,
    tier:'elite', element:'none', elemBonus:0,
    elemColor:'var(--text2)', elemEmoji:'',
    lore:'Fundido em ferro negro das profundezas. Pesado como a responsabilidade, resistente como a vontade.',
    desc:'Elite · Armor · ',
    fx: null,
    sc:'armor'
  },
  {
    id:'a_titanplate', nm:'Armadura do Titã', slot:'armor', ik:'a_titanplate',
    pw:20, atk:12, def:35, price:600,
    tier:'epic', element:'holy', elemBonus:20,
    elemColor:'#fff176', elemEmoji:'✨',
    lore:'Usada pelo último Titã antes da Grande Queda. Emana um calor sagrado que protege a alma.',
    desc:'Épico · Armor · ✨ Holy +20%',
    fx: null,
    sc:'armor'
  },
  {
    id:'a_warlord', nm:'Peitoral do Senhor da Guerra', slot:'armor', ik:'a_warlord',
    pw:18, atk:15, def:30, price:580,
    tier:'epic', element:'fire', elemBonus:18,
    elemColor:'#ff6b35', elemEmoji:'🔥',
    lore:'O olho central vê além do véu — antecipa ataques antes que aconteçam.',
    desc:'Épico · Armor · 🔥 Fire +18%',
    fx: null,
    sc:'armor'
  },
  {
    id:'a_vamcloak', nm:'Capa do Vampiro Ancestral', slot:'armor', ik:'a_vamcloak',
    pw:16, atk:6, def:22, price:480,
    tier:'epic', element:'shadow', elemBonus:20,
    elemColor:'#b39ddb', elemEmoji:'💀',
    lore:'Tecida com sombras do além. Drena XP dos inimigos a cada ataque recebido.',
    desc:'Épico · Armor · 💀 Shadow +20%',
    fx: null,
    sc:'armor'
  },
  {
    id:'h_ironhelm', nm:'Elmo de Ferro e Malha', slot:'head', ik:'h_ironhelm',
    pw:10, atk:6, def:22, price:360,
    tier:'elite', element:'none', elemBonus:0,
    elemColor:'var(--text2)', elemEmoji:'',
    lore:'Proteção honesta sem adorno. Cada amassado conta uma batalha vencida.',
    desc:'Elite · Head · ',
    fx: null,
    sc:'head'
  },
  {
    id:'h_goldhelm', nm:'Elmo Dourado da Glória', slot:'head', ik:'h_goldhelm',
    pw:15, atk:10, def:20, price:480,
    tier:'epic', element:'holy', elemBonus:15,
    elemColor:'#fff176', elemEmoji:'✨',
    lore:'O capacete que líderes usavam para inspirar exércitos inteiros com presença pura.',
    desc:'Épico · Head · ✨ Holy +15%',
    fx: null,
    sc:'head'
  },
  {
    id:'h_skullcloak', nm:'Capuz do Ceifador', slot:'head', ik:'h_skullcloak',
    pw:12, atk:8, def:14, price:420,
    tier:'elite', element:'shadow', elemBonus:18,
    elemColor:'#b39ddb', elemEmoji:'💀',
    lore:'O crânio na cintura observa. O portador sente a presença da morte como aliada, não inimiga.',
    desc:'Elite · Head · 💀 Shadow +18%',
    fx: null,
    sc:'head'
  },
  {
    id:'f_goldenleg', nm:'Grevas da Honra', slot:'feet', ik:'f_goldenleg',
    pw:12, atk:5, def:20, price:400,
    tier:'elite', element:'holy', elemBonus:12,
    elemColor:'#fff176', elemEmoji:'✨',
    lore:'Incrustadas com pedras de rubi que brilham quando o portador age com honra.',
    desc:'Elite · Feet · ✨ Holy +12%',
    fx: null,
    sc:'feet'
  },
  {
    id:'f_whitelegs', nm:'Grevas do Anjo Caído', slot:'feet', ik:'f_whitelegs',
    pw:8, atk:4, def:16, price:300,
    tier:'elite', element:'none', elemBonus:0,
    elemColor:'var(--text2)', elemEmoji:'',
    lore:'Simples em aparência, densas em magia. Cada passo em silêncio amplifica o próximo golpe.',
    desc:'Elite · Feet · ',
    fx: null,
    sc:'feet'
  },
  {
    id:'l_goldskirt', nm:'Saia de Batalha Áurea', slot:'legs', ik:'l_goldskirt',
    pw:12, atk:6, def:18, price:380,
    tier:'elite', element:'fire', elemBonus:10,
    elemColor:'#ff6b35', elemEmoji:'🔥',
    lore:'O tecido interno é escarlate — cor do sangue de dragão que tingiu o tecido original.',
    desc:'Elite · Legs · 🔥 Fire +10%',
    fx: null,
    sc:'legs'
  },
  {
    id:'g_vambrace', nm:'Braçadeiras da Sentinela', slot:'hands', ik:'g_vambrace',
    pw:9, atk:8, def:14, price:320,
    tier:'elite', element:'none', elemBonus:0,
    elemColor:'var(--text2)', elemEmoji:'',
    lore:'Leves como penas, duras como promessas. Feitas para quem protege sem esperar reconhecimento.',
    desc:'Elite · Hands · ',
    fx: null,
    sc:'hands'
  },
  {
    id:'w_bloomstaff', nm:'Cajado da Flor Maldita', slot:'weapon', ik:'w_bloomstaff',
    pw:24, atk:30, def:6, price:540,
    tier:'epic', element:'nature', elemBonus:22,
    elemColor:'#7bc67e', elemEmoji:'🌿',
    lore:'Brotou de um túmulo antigo. A flor que o encima nunca murcha — mas drena a vida de tudo ao redor.',
    desc:'Épico · Weapon · 🌿 Nature +22% · 💀 Shadow',
    fx: null,
    sc:'weapon'
  },
  {
    id:'g_goldgaunt', nm:'Manoplas do Guerreiro Eterno', slot:'hands', ik:'g_goldgaunt',
    pw:14, atk:12, def:16, price:460,
    tier:'epic', element:'fire', elemBonus:14,
    elemColor:'#ff6b35', elemEmoji:'🔥',
    lore:'Cada dedo é articulado com precisão de relojoeiro. O punho que empunha tudo que importa.',
    desc:'Épico · Hands · 🔥 Fire +14%',
    fx: null,
    sc:'hands'
  },
];

// ── Element FX config ─────────────────────────────────────────
const ELEM_FX_CFG = {
  fire:  {type:'fire',   emoji:'🔥', label:'Chama Viva',    color:'#ff6b35', chance:.45, dot:true, dotTurns:2},
  ice:   {type:'ice',    emoji:'❄️',  label:'Gelo Eterno',   color:'#7ecef4', chance:.40},
  nature:{type:'poison', emoji:'🌿', label:'Veneno Natural', color:'#7bc67e', chance:.40, dot:true, dotTurns:2},
  shadow:{type:'shadow', emoji:'💀', label:'Trevas',         color:'#b39ddb', chance:.40, dmgMult:1.8},
  holy:  {type:'holy',   emoji:'✨', label:'Luz Sagrada',    color:'#fff176', chance:.40, dmgMult:1.9},
  arcane:{type:'shadow', emoji:'🔮', label:'Arcano',         color:'#ce93d8', chance:.45, dmgMult:2.0},
};

// Register into EDB and IMGS once DOM is ready
(function initEliteItems(){
  function doInit(){
    if(typeof EDB==='undefined' || typeof IMGS==='undefined'){
      setTimeout(doInit, 100);
      return;
    }
    Object.assign(IMGS, ELITE_IMGS);
    ELITE_ITEMS.forEach(item => {
      if(item.element && item.element !== 'none' && ELEM_FX_CFG[item.element]){
        const cfg = ELEM_FX_CFG[item.element];
        item.fx = Object.assign({}, cfg, {
          extraDmg: Math.floor(item.elemBonus * 1.2)
        });
      } else {
        item.fx = null;
      }
      if(!EDB.find(e => e.id === item.id)) EDB.push(item);
    });
    console.log('[Elite Items] Registered', ELITE_ITEMS.length, 'items into EDB.');
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', doInit);
  else doInit();
})();
