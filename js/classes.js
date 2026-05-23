// classes.js — Class system, crafting, inventory, guilds, tooltips
// ────────────────────────────────────────────────────────────
"use strict";


// ═══════════════════════════════════════════════════════════════
// CLASS SYSTEM
// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════
// CLASS EVOLUTION TREES
// Levels: BASE → 25 → 50 → 75 → 100
// ═══════════════════════════════════════════════════════════════════
const CLASS_EVOLUTIONS = {
  warrior: [
    {lv:1,  name:'Guerreiro',   icon:'⚔️',  color:'#e74c3c',
     skill:{name:'Golpe Brutal',icon:'🗡️',desc:'Missões de Vitalidade causam +30% dano extra ao Boss.'}},
    {lv:25, name:'Sentinela',   icon:'🛡️',  color:'#c0392b',
     skill:{name:'Muralha Viva',icon:'🏰',desc:'Ao completar 5+ missões no dia, recupera 20 HP automaticamente.'}},
    {lv:50, name:'Cavaleiro',   icon:'🏇',  color:'#922b21',
     skill:{name:'Carga de Cavalaria',icon:'⚡',desc:'Primeira missão de cada dia causa dano triplo ao Boss.'}},
    {lv:75, name:'Comandante',  icon:'👑',  color:'#7b241c',
     skill:{name:'Grito de Guerra',icon:'📣',desc:'Streak de 7+ dias: todas as missões causam +50% dano por 24h.'}},
    {lv:100,name:'Black Knight', icon:'🖤⚔️',color:'#4a0000',
     skill:{name:'Juízo Final',icon:'💀',desc:'Chance de 25% de causar dano duplo em QUALQUER missão. Boss recebe -10% HP ao ser atacado.'}}
  ],
  mage: [
    {lv:1,  name:'Mago',        icon:'🔮',  color:'#8e44ad',
     skill:{name:'Conjuração',icon:'✨',desc:'+35% XP e +25% cristais de todas as fontes.'}},
    {lv:25, name:'Feiticeiro',  icon:'🌀',  color:'#7d3c98',
     skill:{name:'Mente Expandida',icon:'🧠',desc:'A cada level up, ganha +5 cristais bônus automaticamente.'}},
    {lv:50, name:'Arquimago',   icon:'⚗️',  color:'#6c3483',
     skill:{name:'Tempestade Arcana',icon:'🌩️',desc:'Efeitos mágicos (lightning/shadow/holy/ice) causam +50% dano.'}},
    {lv:75, name:'Lich',        icon:'💀🔮',color:'#4a235a',
     skill:{name:'Drenar Essência',icon:'🩸',desc:'10% de cada dano causado é convertido em cristais (máx 5/missão).'}},
    {lv:100,name:'Deus Arcano', icon:'🌌',  color:'#2c1654',
     skill:{name:'Onisciência',icon:'🌟',desc:'+100% XP total. Todos efeitos mágicos têm chance dobrada. Nível nunca regride.'}}
  ],
  archer: [
    {lv:1,  name:'Arqueiro',    icon:'🏹',  color:'#27ae60',
     skill:{name:'Flecha Certeira',icon:'🎯',desc:'+40% gold e streaks progridem 15% mais rápido.'}},
    {lv:25, name:'Atirador',    icon:'🎯',  color:'#219653',
     skill:{name:'Olho de Águia',icon:'🦅',desc:'Efeitos de bleed e poison têm chance +20%. Acertos críticos dão gold bônus.'}},
    {lv:50, name:'Caçador Élfico',icon:'🧝',color:'#1e8449',
     skill:{name:'Flecha Dupla',icon:'🏹🏹',desc:'25% de chance de causar o dano da missão duas vezes (Ataque Duplo).'}},
    {lv:75, name:'Mestre Atirador',icon:'🦉',color:'#196f3d',
     skill:{name:'Chuva de Flechas',icon:'🌧️',desc:'Ao completar 3+ missões seguidas no dia, spawna mini-dano automático de 50 no Boss.'}},
    {lv:100,name:'Lenda da Floresta',icon:'🌲',color:'#0e5c2f',
     skill:{name:'Precisão Divina',icon:'⚡🏹',desc:'+60% gold. Nunca perde streak por 1 dia perdido (graça divina). Efeitos de veneno são permanentes.'}}
  ],
  bard: [
    {lv:1,  name:'Bardo',       icon:'🎵',  color:'#f39c12',
     skill:{name:'Canção de Batalha',icon:'🎶',desc:'Cada missão concluída aumenta +5% o dano das próximas 3 missões do dia (acumula).'}},
    {lv:25, name:'Trovador',    icon:'🎸',  color:'#d68910',
     skill:{name:'Balada do Herói',icon:'🎼',desc:'Ao atingir 3+ streak de missões no dia, ganha 10 XP bônus por missão adicional.'}},
    {lv:50, name:'Menestrel',   icon:'🎺',  color:'#b7770d',
     skill:{name:'Hino da Vitória',icon:'🏆',desc:'Ao derrotar Boss, ganha 50% de gold e XP extras. Sua música enfraquece o inimigo.'}},
    {lv:75, name:'Mestre dos Cantos',icon:'🎭',color:'#9a6304',
     skill:{name:'Canto Épico',icon:'🌟',desc:'Todos os bônus de streak são dobrados. Cada missão "musical" (Carisma) restaura 5 HP.'}},
    {lv:100,name:'Lenda Imortal',icon:'👑🎵',color:'#7d5000',
     skill:{name:'Sinfonia do Cosmos',icon:'🌌',desc:'+25% em XP, Gold E Cristais simultaneamente. Canções nunca terminam — efeitos de buff duram o dobro.'}}
  ],
  cleric: [
    {lv:1,  name:'Clérigo',     icon:'✝️',  color:'#f5e098',
     skill:{name:'Bênção Divina',icon:'🙏',desc:'Missões de Sabedoria/Mente restauram 8 HP ao invés de apenas atacar.'}},
    {lv:25, name:'Sacerdote',   icon:'📿',  color:'#d4b896',
     skill:{name:'Cura em Área',icon:'💊',desc:'Ao completar 4+ missões no dia, recupera 30 HP automaticamente.'}},
    {lv:50, name:'Alto Sacerdote',icon:'⛪', color:'#b8975a',
     skill:{name:'Ressurreição',icon:'💫',desc:'Se HP cair abaixo de 20%, recupera automaticamente 50 HP (1× por dia).'}},
    {lv:75, name:'Bispo',       icon:'👼',  color:'#9a7a3a',
     skill:{name:'Escudo da Fé',icon:'🛡️✨',desc:'20% de chance de NEGAR completamente qualquer penalidade de vício ou evento.'}},
    {lv:100,name:'Arcanjo',     icon:'😇',  color:'#7a5f20',
     skill:{name:'Graça Eterna',icon:'🌟',desc:'HP máximo +100. Recupera 15 HP por missão de Sabedoria/Mente/Carisma. Nunca morre (mínimo 1 HP).'}}
  ],
  druid: [
    {lv:1,  name:'Druida',      icon:'🌿',  color:'#2ecc71',
     skill:{name:'Sintonia Natural',icon:'🌱',desc:'Missões de qualquer atributo ligado ao corpo/mente recuperam 5 HP e causam +10% dano.'}},
    {lv:25, name:'Guardião',    icon:'🌳',  color:'#27ae60',
     skill:{name:'Regeneração',icon:'🍃',desc:'Ao iniciar novo dia com streak ativo, recupera HP = streak × 2 (máx 40).'}},
    {lv:50, name:'Xamã',        icon:'🦉',  color:'#1e8449',
     skill:{name:'Forma Animal',icon:'🐺',desc:'Efeitos de veneno e sangramento têm +30% de dano. Canaliza a fera interior.'}},
    {lv:75, name:'Druida Ancião',icon:'🌲🌿',color:'#186a3b',
     skill:{name:'Voz da Floresta',icon:'🌍',desc:'Terremoto e efeitos naturais causam +60% dano. Cada evento derrotado cura 25 HP.'}},
    {lv:100,name:'Espírito da Terra',icon:'🌏',color:'#0e5c2f',
     skill:{name:'Ciclo Eterno',icon:'♻️',desc:'Nunca perde HP por eventos ou vícios — danos são convertidos em XP. A natureza te protege.'}}
  ],
  paladin: [
    {lv:1,  name:'Paladino',    icon:'⚔️✨',color:'#f1c40f',
     skill:{name:'Golpe Sagrado',icon:'✨',desc:'Efeitos holy causam +40% dano. Cada missão de Disciplina adiciona +2 dano sagrado base.'}},
    {lv:25, name:'Cruzado',     icon:'🏰✨',color:'#d4ac0d',
     skill:{name:'Aura da Retidão',icon:'🌟',desc:'Ao completar missões sem nenhum vício no dia, ganha +20% dano por 24h.'}},
    {lv:50, name:'Cavaleiro Sagrado',icon:'🛡️🌟',color:'#b7950b',
     skill:{name:'Martírio',icon:'💪',desc:'Quanto MENOR o HP, MAIOR o dano (+1% por cada % de HP perdido, máx +40%).'}},
    {lv:75, name:'Campeão da Luz',icon:'☀️',color:'#9a7d0a',
     skill:{name:'Julgamento Divino',icon:'⚖️',desc:'Ao derrotar um Boss, purifica o campo: todos os DoTs são removidos e HP é restaurado em 50.'}},
    {lv:100,name:'Santo Imortal', icon:'😇⚔️',color:'#7d6608',
     skill:{name:'Lâmina da Eternidade',icon:'🌌⚔️',desc:'+35% dano base, +35% HP máximo. Efeitos holy são garantidos (100% de chance).'}}
  ],
  rogue: [
    {lv:1,  name:'Ladino',      icon:'🗡️',  color:'#95a5a6',
     skill:{name:'Ataque Furtivo',icon:'🌑',desc:'30% de chance de causar dano duplo silenciosamente. Gold de missões +20%.'}},
    {lv:25, name:'Assassino',   icon:'🥷',  color:'#7f8c8d',
     skill:{name:'Veneno Aprimorado',icon:'☠️',desc:'Efeitos de veneno causam +50% dano e duram +1 turno extra.'}},
    {lv:50, name:'Mestre Ladrão',icon:'🎭', color:'#566573',
     skill:{name:'Roubo de Vitalidade',icon:'💚',desc:'Lifesteal tem +40% eficiência. Cada crítico rouba 3 HP do Boss.'}},
    {lv:75, name:'Sombra',      icon:'🌑',  color:'#2c3e50',
     skill:{name:'Invisibilidade',icon:'👻',desc:'50% de chance de EVITAR qualquer penalidade de vício. Opera nas sombras.'}},
    {lv:100,name:'Phantom',     icon:'💀🗡️',color:'#1a252f',
     skill:{name:'Morte Silenciosa',icon:'⚰️',desc:'Ataques furtivos sempre ocorrem (100%). Dano total de sombra/veneno/lifesteal ×2. O Boss não sabe que você existe.'}}
  ],

  // ── NOVAS CLASSES (Feminino / Não-binário — exceto Bárbaro) ──────────
  witch: [
    {lv:1,  name:'Bruxa',          icon:'🧙‍♀️', color:'#6c3483',
     skill:{name:'Maldição Sombria',icon:'🌙',desc:'Ao completar missões de Sabedoria ou Mente, aplica Maldição ao Boss: -8% de dano por missão nas próximas 3 completadas.'}},
    {lv:25, name:'Feiticeira',     icon:'🔯',   color:'#76448a',
     skill:{name:'Poção de Poder',icon:'⚗️',desc:'A cada 5 missões concluídas no dia, ganha +5 cristais automaticamente e o próximo ataque causa dano duplo.'}},
    {lv:50, name:'Bruxa das Ruínas',icon:'🌑🧙‍♀️',color:'#5b2c6f',
     skill:{name:'Maldição Encadeada',icon:'🕸️',desc:'A Maldição ao Boss agora se acumula até -25% DMG do boss. Missões de Sabedoria têm 30% de causar dano imediato de 20 ao Boss.'}},
    {lv:75, name:'Grande Bruxa',   icon:'🔮🌙',color:'#4a235a',
     skill:{name:'Pacto das Sombras',icon:'🌌',desc:'Ao usar vício deliberadamente, converte toda a penalidade em +30 XP e +3 cristais, como se tivesse negociado com forças sombrias.'}},
    {lv:100,name:'Bruxa Primordial',icon:'👁️‍🗨️',color:'#2e1046',
     skill:{name:'Olho do Caos',icon:'💜',desc:'Todas as maldições são permanentes durante a semana do Boss. XP e Cristais +40%. 25% chance de qualquer missão inverter o ataque do Boss contra si mesmo.'}}
  ],
  amazon: [
    {lv:1,  name:'Amazona',       icon:'🏹⚡', color:'#c0392b',
     skill:{name:'Grito de Batalha',icon:'🗡️',desc:'Cada missão concluída após a primeira no dia causa +15% dano acumulado (reseta no novo dia). Máx +75%.'}},
    {lv:25, name:'Caçadora',      icon:'🦅',   color:'#a93226',
     skill:{name:'Flecha de Sangue',icon:'🩸🏹',desc:'Efeitos de bleed e poison têm chance dobrada. Missões de Vitalidade ou Energia dão +10% gold.'}},
    {lv:50, name:'Guerreira da Tribo',icon:'🌺⚔️',color:'#922b21',
     skill:{name:'Fúria Tribal',icon:'🔥',desc:'Ao completar 6+ missões em um dia, entra em Fúria: próximas 24h todas as missões causam +50% dano ao Boss.'}},
    {lv:75, name:'Rainha das Feras',icon:'🐯👑',color:'#7b241c',
     skill:{name:'Dominar o Campo',icon:'🌪️',desc:'Streaks de 7+ dias concedem +25% a TODOS os bônus (DMG, Gold, XP). As feras da floresta combatem ao seu lado — +30 dano por missão.'}},
    {lv:100,name:'Lenda das Amazonas',icon:'⚡👸',color:'#641e16',
     skill:{name:'Tempestade Imortal',icon:'⚡🌩️',desc:'+40% DMG total. Imune a qualquer penalidade quando streak > 7 dias. Cada kill de Boss invoca +50 de dano automático no próximo.'}}
  ],
  vampire: [
    {lv:1,  name:'Vampira',       icon:'🧛‍♀️', color:'#922b21',
     skill:{name:'Sedução Sombria',icon:'🩸',desc:'Lifesteal tem +30% eficiência. Missões noturnas (Mente/Sabedoria) drenam 5 HP do Boss como bônus.'}},
    {lv:25, name:'Nobre das Trevas',icon:'🌹🧛‍♀️',color:'#7b241c',
     skill:{name:'Toque da Morte',icon:'💀',desc:'Efeitos shadow e lifesteal têm chance +25%. Ao derrotar Boss, recupera 30% do HP máximo instantaneamente.'}},
    {lv:50, name:'Condessa Vampira',icon:'🦇👑',color:'#641e16',
     skill:{name:'Praga de Morcegos',icon:'🦇',desc:'Ao completar qualquer missão, 20% de chance de sugar 10 HP do Boss sem custo adicional (ataque passivo de morcegos).'}},
    {lv:75, name:'Rainha da Noite',icon:'🌑👸',color:'#4a0e0e',
     skill:{name:'Banquete Eterno',icon:'🍷',desc:'Cada HP drenado do Boss cura o dobro para você. DoTs de veneno e sangramento estendem automaticamente por +1 turno.'}},
    {lv:100,name:'Vampira Ancestral',icon:'🧛‍♀️🌌',color:'#2e0808',
     skill:{name:'Imortalidade Sanguinária',icon:'♾️',desc:'Nunca morre se lifesteal estiver ativo — ao chegar a 0 HP com efeito ativo, drena 40 HP do Boss e ressurge. Shadow e lifesteal causam ×3 dano.'}}
  ],
  priestess: [
    {lv:1,  name:'Sacerdotisa',   icon:'🌸✝️', color:'#e8b4d4',
     skill:{name:'Graça Sagrada',icon:'🌸',desc:'Missões de Carisma, Sabedoria ou Mente restauram 10 HP e causam dano sagrado de 5 ao Boss como bênção.'}},
    {lv:25, name:'Devota da Luz', icon:'☀️📿',  color:'#d498c4',
     skill:{name:'Círculo de Cura',icon:'💗',desc:'Ao completar 4+ missões no dia, todos os aliados da guilda se fortalecem: +15% de dano nas próximas 3 missões.'}},
    {lv:50, name:'Orácula',       icon:'🔮🌸',  color:'#c07ab0',
     skill:{name:'Visão Divina',icon:'👁️',desc:'A Sacerdotisa prevê ataques: 25% de chance de NEGAR completamente qualquer dano recebido. Missões de Sabedoria dão +2 cristais.'}},
    {lv:75, name:'Alta Sacerdotisa',icon:'🌙✨',color:'#a05c9a',
     skill:{name:'Bênção Absoluta',icon:'🌟',desc:'Ao iniciar novo dia, aplica Bênção Divina: +20% a XP, Gold e CR por 24h. Missões de Carisma têm 15% de triplicar recompensas.'}},
    {lv:100,name:'Deusa do Templo',icon:'👑🌸', color:'#7a3a7a',
     skill:{name:'Transcendência',icon:'🌌🌸',desc:'HP máximo +80. Nunca perde streak. Bênções são permanentes — todos os multiplicadores de classe +20% extras. A luz guia cada passo.'}}
  ],
  barbarian: [
    {lv:1,  name:'Bárbaro(a)',    icon:'🪓',   color:'#d35400',
     skill:{name:'Fúria Primária',icon:'💢',desc:'Ao receber dano de vício, entra em Fúria: próximas 2 missões causam +60% dano ao Boss como resposta brutal.'}},
    {lv:25, name:'Berserker',     icon:'🔥🪓',  color:'#ca6f1e',
     skill:{name:'Sede de Sangue',icon:'🩸',desc:'Quanto mais HP perdido, mais forte: a cada 10% de HP perdido, +5% de dano (máx +40%). A dor vira poder.'}},
    {lv:50, name:'Campeão Bárbaro',icon:'⚡🪓', color:'#a04000',
     skill:{name:'Golpe da Montanha',icon:'🏔️',desc:'Primeira missão de cada dia causa dano TRIPLO. Missões de Vitalidade acumulam +10 de dano fixo por missão completada no dia.'}},
    {lv:75, name:'Senhor da Guerra',icon:'💀🪓',color:'#7e5109',
     skill:{name:'Ritual do Sangue',icon:'🔴',desc:'Ao completar 8+ missões em um dia, o Boss recebe uma maldição permanente de -15% HP por ataque durante 48h. Bárbaro(a) nunca recua.'}},
    {lv:100,name:'Titã Devastador(a)',icon:'⚡💀',color:'#5d1e00',
     skill:{name:'Apocalipse',icon:'🌋',desc:'+50% dano total. Ao morrer (0 HP), ressurge com 50% HP e o Boss sofre 100 de dano imediato de raiva. A morte é apenas o começo.'}}
  ],
};

// Build flat CLASSES from base (lv:1) entry


// CLASS_IMG — paths to class artwork PNGs (place files in img/classes/)
const CLASS_IMG={
  warrior:'img/classes/Warrior.png',
  mage:'img/classes/Mago.png',
  archer:'img/classes/Arqueiro.png',
  bard:'img/classes/Bardo.png',
  cleric:'img/classes/Clerico.png',
  druid:'img/classes/Druida.png',
  paladin:'img/classes/Paladino.png',
  rogue:'img/classes/Ladino.png',
  witch:'img/classes/Bruxa.png',
  amazon:'img/classes/Amazona.png',
  vampire:'img/classes/Vampira.png',
  priestess:'img/classes/Sacerdotisa.png',
  barbarian:'img/classes/Barbaro.png',
};
// Helper: renders class image at given size with themed glow
function classImgTag(id, size, color){
  const src=CLASS_IMG[id];if(!src)return'';
  const s=size||56;const c=color||'rgba(201,168,76,.4)';
  return `<img src="${src}" width="${s}" height="${s}" style="object-fit:cover;object-position:center 15%;border-radius:8px;filter:drop-shadow(0 0 6px ${c});image-rendering:auto">`;
}
// Legacy alias so any remaining CLASS_SVG references still work
const CLASS_SVG={
warrior:`<svg width="56" height="56" viewBox="0 0 32 32" style="image-rendering:pixelated;filter:drop-shadow(0 0 5px rgba(231,76,60,.5))"><ellipse cx="16" cy="31" rx="6" ry="1" fill="#000" opacity=".35"/><rect x="9" y="27" width="4" height="3" fill="#3a1a08"/><rect x="10" y="27" width="2" height="1" fill="#4a2010"/><rect x="9" y="29" width="4" height="1" fill="#2a1005"/><rect x="19" y="27" width="4" height="3" fill="#3a1a08"/><rect x="20" y="27" width="2" height="1" fill="#4a2010"/><rect x="19" y="29" width="4" height="1" fill="#2a1005"/><rect x="9" y="21" width="4" height="7" fill="#7a1515"/><rect x="19" y="21" width="4" height="7" fill="#7a1515"/><rect x="9" y="23" width="4" height="3" fill="#8b1a1a"/><rect x="19" y="23" width="4" height="3" fill="#8b1a1a"/><rect x="10" y="23" width="2" height="3" fill="#a01e1e" opacity=".4"/><rect x="9" y="23" width="4" height="1" fill="#c9a84c" opacity=".6"/><rect x="19" y="23" width="4" height="1" fill="#c9a84c" opacity=".6"/><rect x="9" y="25" width="4" height="1" fill="#c9a84c" opacity=".3"/><rect x="19" y="25" width="4" height="1" fill="#c9a84c" opacity=".3"/><rect x="9" y="19" width="14" height="3" fill="#5a1010"/><rect x="9" y="20" width="14" height="1" fill="#c9a84c" opacity=".7"/><rect x="14" y="19" width="4" height="3" fill="#7a1010"/><rect x="15" y="20" width="2" height="1" fill="#e8c96b"/><rect x="8" y="12" width="16" height="8" fill="#8b1a1a"/><rect x="9" y="12" width="14" height="8" fill="#9a1e1e"/><rect x="9" y="12" width="14" height="1" fill="#c9a84c" opacity=".6"/><rect x="9" y="12" width="1" height="8" fill="#b02020" opacity=".4"/><rect x="22" y="12" width="1" height="8" fill="#5a1010" opacity=".7"/><rect x="15" y="13" width="2" height="6" fill="#6a1010" opacity=".5"/><rect x="10" y="14" width="1" height="1" fill="#c9a84c" opacity=".8"/><rect x="10" y="17" width="1" height="1" fill="#c9a84c" opacity=".6"/><rect x="21" y="14" width="1" height="1" fill="#c9a84c" opacity=".8"/><rect x="21" y="17" width="1" height="1" fill="#c9a84c" opacity=".6"/><rect x="14" y="15" width="4" height="1" fill="#e74c3c" opacity=".45"/><rect x="5" y="11" width="5" height="5" fill="#7a1515"/><rect x="5" y="11" width="5" height="1" fill="#c9a84c" opacity=".7"/><rect x="5" y="11" width="1" height="5" fill="#b02020" opacity=".4"/><rect x="9" y="11" width="1" height="5" fill="#4a1010" opacity=".7"/><rect x="6" y="13" width="3" height="2" fill="#9a1e1e"/><rect x="22" y="11" width="5" height="5" fill="#7a1515"/><rect x="22" y="11" width="5" height="1" fill="#c9a84c" opacity=".7"/><rect x="26" y="11" width="1" height="5" fill="#4a1010" opacity=".7"/><rect x="4" y="15" width="4" height="5" fill="#7a1515"/><rect x="5" y="17" width="3" height="1" fill="#c9a84c" opacity=".5"/><rect x="24" y="15" width="4" height="5" fill="#7a1515"/><rect x="3" y="19" width="5" height="4" fill="#5a1010"/><rect x="3" y="19" width="5" height="1" fill="#c9a84c" opacity=".7"/><rect x="24" y="19" width="5" height="4" fill="#5a1010"/><rect x="24" y="19" width="5" height="1" fill="#c9a84c" opacity=".7"/><rect x="0" y="10" width="5" height="11" fill="#6a1010"/><rect x="0" y="10" width="5" height="1" fill="#c9a84c"/><rect x="0" y="20" width="5" height="1" fill="#c9a84c"/><rect x="0" y="10" width="1" height="11" fill="#c9a84c"/><rect x="4" y="10" width="1" height="11" fill="#4a1010"/><rect x="1" y="14" width="2" height="5" fill="#c9a84c" opacity=".6"/><rect x="0" y="15" width="4" height="3" fill="#c9a84c" opacity=".5"/><rect x="1" y="15" width="2" height="3" fill="#e8c96b"/><rect x="28" y="26" width="3" height="2" fill="#c9a84c"/><rect x="28" y="26" width="3" height="1" fill="#e8c96b"/><rect x="29" y="20" width="1" height="7" fill="#7a5a30"/><rect x="26" y="18" width="7" height="2" fill="#c9a84c"/><rect x="26" y="18" width="7" height="1" fill="#e8c96b"/><rect x="29" y="5" width="2" height="14" fill="#ccc"/><rect x="29" y="5" width="1" height="14" fill="#eee" opacity=".6"/><rect x="30" y="5" width="1" height="14" fill="#888"/><rect x="29" y="3" width="2" height="3" fill="#bbb"/><rect x="13" y="8" width="6" height="5" fill="#c8a87a"/><rect x="11" y="3" width="10" height="8" fill="#c8a87a"/><rect x="12" y="3" width="8" height="8" fill="#d4b48a"/><rect x="11" y="3" width="1" height="8" fill="#b89870" opacity=".5"/><rect x="12" y="5" width="3" height="2" fill="#1a0a00"/><rect x="12" y="5" width="3" height="1" fill="#e74c3c" opacity=".9"/><rect x="13" y="5" width="1" height="1" fill="#ff8b8b"/><rect x="17" y="5" width="3" height="2" fill="#1a0a00"/><rect x="17" y="5" width="3" height="1" fill="#e74c3c" opacity=".9"/><rect x="18" y="5" width="1" height="1" fill="#ff8b8b"/><rect x="14" y="9" width="4" height="1" fill="#8b6040" opacity=".6"/><rect x="11" y="1" width="10" height="4" fill="#7a1515"/><rect x="11" y="1" width="10" height="1" fill="#c9a84c"/><rect x="11" y="3" width="10" height="1" fill="#c9a84c" opacity=".4"/><rect x="15" y="0" width="2" height="2" fill="#e74c3c"/><rect x="14" y="0" width="1" height="1" fill="#e74c3c" opacity=".6"/><rect x="17" y="0" width="1" height="1" fill="#e74c3c" opacity=".6"/><rect x="11" y="4" width="2" height="4" fill="#7a1515"/><rect x="19" y="4" width="2" height="4" fill="#7a1515"/><rect x="12" y="4" width="8" height="1" fill="#1a0a00" opacity=".7"/></svg>`,
mage:`<svg width="56" height="56" viewBox="0 0 32 32" style="image-rendering:pixelated;filter:drop-shadow(0 0 5px rgba(142,68,173,.55))"><ellipse cx="16" cy="31" rx="5" ry="1" fill="#000" opacity=".35"/><rect x="11" y="27" width="3" height="3" fill="#2a1040"/><rect x="18" y="27" width="3" height="3" fill="#2a1040"/><rect x="11" y="27" width="3" height="1" fill="#3a1a55"/><rect x="18" y="27" width="3" height="1" fill="#3a1a55"/><rect x="10" y="18" width="12" height="10" fill="#3a1060"/><rect x="11" y="18" width="10" height="10" fill="#4a1a75"/><rect x="12" y="18" width="8" height="10" fill="#5a2080" opacity=".5"/><rect x="11" y="18" width="1" height="10" fill="#6030a0" opacity=".4"/><rect x="20" y="18" width="1" height="10" fill="#2a1040" opacity=".7"/><rect x="13" y="20" width="6" height="1" fill="#9b59b6" opacity=".3"/><rect x="13" y="22" width="6" height="1" fill="#9b59b6" opacity=".2"/><rect x="7" y="12" width="4" height="7" fill="#3a1060"/><rect x="21" y="12" width="4" height="7" fill="#3a1060"/><rect x="9" y="12" width="14" height="7" fill="#4a1a75"/><rect x="10" y="12" width="12" height="7" fill="#5a2080"/><rect x="10" y="12" width="1" height="7" fill="#7040b0" opacity=".5"/><rect x="21" y="12" width="1" height="7" fill="#2a1040" opacity=".6"/><rect x="10" y="12" width="12" height="1" fill="#9b59b6" opacity=".4"/><rect x="11" y="14" width="1" height="1" fill="#ddb8ff" opacity=".7"/><rect x="20" y="14" width="1" height="1" fill="#ddb8ff" opacity=".7"/><rect x="13" y="9" width="6" height="4" fill="#c8a87a"/><rect x="11" y="3" width="10" height="8" fill="#c8a87a"/><rect x="12" y="3" width="8" height="8" fill="#d4b48a"/><rect x="11" y="3" width="1" height="8" fill="#b89870" opacity=".5"/><rect x="12" y="5" width="3" height="2" fill="#1a0a00"/><rect x="12" y="5" width="3" height="1" fill="#9b59b6" opacity=".9"/><rect x="13" y="5" width="1" height="1" fill="#ddb8ff"/><rect x="17" y="5" width="3" height="2" fill="#1a0a00"/><rect x="17" y="5" width="3" height="1" fill="#9b59b6" opacity=".9"/><rect x="18" y="5" width="1" height="1" fill="#ddb8ff"/><rect x="14" y="9" width="4" height="1" fill="#8b6040" opacity=".6"/><rect x="10" y="0" width="12" height="4" fill="#3a1060"/><rect x="10" y="0" width="12" height="1" fill="#9b59b6" opacity=".5"/><rect x="12" y="-1" width="8" height="3" fill="#4a1a75"/><rect x="15" y="-2" width="2" height="3" fill="#6030a0"/><rect x="15" y="-2" width="2" height="1" fill="#ddb8ff" opacity=".5"/><rect x="10" y="3" width="3" height="1" fill="#ddb8ff" opacity=".4"/><rect x="19" y="3" width="3" height="1" fill="#ddb8ff" opacity=".4"/><rect x="28" y="5" width="1" height="22" fill="#7a5a30"/><rect x="26" y="3" width="5" height="5" fill="#1a0a2a"/><rect x="27" y="3" width="3" height="5" fill="#3a1060" opacity=".8"/><rect x="27" y="4" width="3" height="3" fill="#9b59b6" opacity=".5"/><rect x="28" y="4" width="1" height="3" fill="#ddb8ff"/><rect x="27" y="3" width="3" height="1" fill="#ddb8ff" opacity=".4"/></svg>`,
archer:`<svg width="56" height="56" viewBox="0 0 32 32" style="image-rendering:pixelated;filter:drop-shadow(0 0 5px rgba(39,174,96,.45))"><ellipse cx="16" cy="31" rx="5" ry="1" fill="#000" opacity=".35"/><rect x="10" y="27" width="4" height="3" fill="#1e4014"/><rect x="18" y="27" width="4" height="3" fill="#1e4014"/><rect x="10" y="27" width="4" height="1" fill="#2a5a1e"/><rect x="18" y="27" width="4" height="1" fill="#2a5a1e"/><rect x="9" y="18" width="6" height="10" fill="#245018"/><rect x="17" y="18" width="6" height="10" fill="#245018"/><rect x="11" y="18" width="10" height="10" fill="#2d5a1e"/><rect x="12" y="18" width="8" height="10" fill="#356622" opacity=".6"/><rect x="11" y="18" width="10" height="1" fill="#27ae60" opacity=".3"/><rect x="7" y="13" width="4" height="6" fill="#245018"/><rect x="21" y="13" width="4" height="5" fill="#245018"/><rect x="9" y="12" width="14" height="7" fill="#2d5a1e"/><rect x="10" y="12" width="12" height="7" fill="#356622" opacity=".6"/><rect x="10" y="12" width="12" height="1" fill="#27ae60" opacity=".3"/><rect x="12" y="14" width="1" height="1" fill="#c9a84c" opacity=".6"/><rect x="19" y="14" width="1" height="1" fill="#c9a84c" opacity=".6"/><rect x="13" y="9" width="6" height="4" fill="#c8a87a"/><rect x="11" y="3" width="10" height="8" fill="#c8a87a"/><rect x="12" y="3" width="8" height="8" fill="#d4b48a"/><rect x="11" y="3" width="1" height="8" fill="#b89870" opacity=".5"/><rect x="12" y="5" width="3" height="2" fill="#1a0a00"/><rect x="12" y="5" width="3" height="1" fill="#27ae60" opacity=".9"/><rect x="13" y="5" width="1" height="1" fill="#7eff9b"/><rect x="17" y="5" width="3" height="2" fill="#1a0a00"/><rect x="17" y="5" width="3" height="1" fill="#27ae60" opacity=".9"/><rect x="18" y="5" width="1" height="1" fill="#7eff9b"/><rect x="14" y="9" width="4" height="1" fill="#8b6040" opacity=".6"/><rect x="9" y="1" width="14" height="3" fill="#1e4014"/><rect x="11" y="0" width="10" height="2" fill="#245018"/><rect x="1" y="2" width="2" height="26" fill="#7a5a30"/><rect x="1" y="2" width="1" height="26" fill="#9a7040" opacity=".4"/><rect x="1" y="2" width="2" height="1" fill="#c9a84c"/><rect x="1" y="27" width="2" height="1" fill="#c9a84c"/><rect x="3" y="14" width="8" height="1" fill="#c8a87a" opacity=".8"/><rect x="9" y="13" width="2" height="1" fill="#e74c3c"/></svg>`,
bard:`<svg width="56" height="56" viewBox="0 0 32 32" style="image-rendering:pixelated;filter:drop-shadow(0 0 5px rgba(243,156,18,.45))"><ellipse cx="16" cy="31" rx="5" ry="1" fill="#000" opacity=".35"/><rect x="10" y="27" width="4" height="3" fill="#5a1e00"/><rect x="18" y="27" width="4" height="3" fill="#5a1e00"/><rect x="10" y="27" width="4" height="1" fill="#7a2a00"/><rect x="18" y="27" width="4" height="1" fill="#7a2a00"/><rect x="9" y="18" width="6" height="10" fill="#7a2a00"/><rect x="17" y="18" width="6" height="10" fill="#7a2a00"/><rect x="11" y="18" width="10" height="10" fill="#8a3200"/><rect x="12" y="18" width="8" height="10" fill="#e67e22" opacity=".3"/><rect x="13" y="20" width="6" height="1" fill="#f39c12" opacity=".25"/><rect x="7" y="12" width="4" height="7" fill="#7a2a00"/><rect x="21" y="12" width="4" height="7" fill="#7a2a00"/><rect x="9" y="12" width="14" height="7" fill="#8a3200"/><rect x="10" y="12" width="12" height="7" fill="#e67e22" opacity=".3"/><rect x="10" y="12" width="12" height="1" fill="#f39c12" opacity=".4"/><rect x="11" y="14" width="1" height="1" fill="#f39c12" opacity=".7"/><rect x="20" y="14" width="1" height="1" fill="#f39c12" opacity=".7"/><rect x="13" y="9" width="6" height="4" fill="#c8a87a"/><rect x="11" y="3" width="10" height="8" fill="#c8a87a"/><rect x="12" y="3" width="8" height="8" fill="#d4b48a"/><rect x="11" y="3" width="1" height="8" fill="#b89870" opacity=".5"/><rect x="12" y="5" width="3" height="2" fill="#1a0a00"/><rect x="12" y="5" width="3" height="1" fill="#f39c12" opacity=".9"/><rect x="13" y="5" width="1" height="1" fill="#ffd080"/><rect x="17" y="5" width="3" height="2" fill="#1a0a00"/><rect x="17" y="5" width="3" height="1" fill="#f39c12" opacity=".9"/><rect x="18" y="5" width="1" height="1" fill="#ffd080"/><rect x="14" y="9" width="4" height="1" fill="#8b6040" opacity=".6"/><rect x="9" y="0" width="15" height="3" fill="#8a3200"/><rect x="9" y="0" width="15" height="1" fill="#f39c12" opacity=".5"/><rect x="11" y="-1" width="10" height="3" fill="#7a2a00"/><rect x="22" y="-1" width="2" height="3" fill="#f39c12" opacity=".7"/><rect x="0" y="14" width="7" height="5" fill="#7a5a30"/><rect x="1" y="10" width="4" height="5" fill="#7a5a30"/><rect x="1" y="15" width="7" height="1" fill="#c8a87a" opacity=".4"/><rect x="1" y="16" width="7" height="1" fill="#c8a87a" opacity=".25"/></svg>`,
cleric:`<svg width="56" height="56" viewBox="0 0 32 32" style="image-rendering:pixelated;filter:drop-shadow(0 0 5px rgba(245,224,152,.45))"><ellipse cx="16" cy="31" rx="5" ry="1" fill="#000" opacity=".35"/><rect x="10" y="27" width="4" height="3" fill="#ccc8a0"/><rect x="18" y="27" width="4" height="3" fill="#ccc8a0"/><rect x="9" y="18" width="6" height="10" fill="#e8dbc0"/><rect x="17" y="18" width="6" height="10" fill="#e8dbc0"/><rect x="10" y="18" width="12" height="10" fill="#f0e4c8"/><rect x="11" y="18" width="10" height="10" fill="#fff8e8" opacity=".4"/><rect x="15" y="18" width="2" height="7" fill="#f5e098" opacity=".5"/><rect x="11" y="22" width="10" height="1" fill="#f5e098" opacity=".4"/><rect x="7" y="12" width="4" height="7" fill="#e8dbc0"/><rect x="21" y="12" width="4" height="7" fill="#e8dbc0"/><rect x="9" y="12" width="14" height="7" fill="#f0e4c8"/><rect x="10" y="12" width="12" height="7" fill="#fff8e8" opacity=".4"/><rect x="10" y="12" width="12" height="1" fill="#f5e098" opacity=".5"/><rect x="15" y="13" width="2" height="4" fill="#f5e098" opacity=".4"/><rect x="11" y="15" width="10" height="1" fill="#f5e098" opacity=".35"/><rect x="11" y="14" width="1" height="1" fill="#f5e098" opacity=".7"/><rect x="20" y="14" width="1" height="1" fill="#f5e098" opacity=".7"/><rect x="13" y="9" width="6" height="4" fill="#c8a87a"/><rect x="11" y="3" width="10" height="8" fill="#c8a87a"/><rect x="12" y="3" width="8" height="8" fill="#d4b48a"/><rect x="11" y="3" width="1" height="8" fill="#b89870" opacity=".5"/><rect x="12" y="5" width="3" height="2" fill="#1a0a00"/><rect x="12" y="5" width="3" height="1" fill="#f5e098" opacity=".9"/><rect x="13" y="5" width="1" height="1" fill="#ffffc0"/><rect x="17" y="5" width="3" height="2" fill="#1a0a00"/><rect x="17" y="5" width="3" height="1" fill="#f5e098" opacity=".9"/><rect x="18" y="5" width="1" height="1" fill="#ffffc0"/><rect x="14" y="9" width="4" height="1" fill="#8b6040" opacity=".6"/><rect x="10" y="0" width="12" height="4" fill="#f5e098" opacity=".5"/><rect x="10" y="0" width="12" height="1" fill="#f5e098" opacity=".7"/><rect x="28" y="4" width="2" height="22" fill="#c9a84c"/><rect x="26" y="4" width="6" height="3" fill="#f5e098"/><rect x="27" y="3" width="4" height="4" fill="#ffffc0" opacity=".6"/><rect x="28" y="4" width="2" height="2" fill="#ffffff"/></svg>`,
druid:`<svg width="56" height="56" viewBox="0 0 32 32" style="image-rendering:pixelated;filter:drop-shadow(0 0 5px rgba(46,204,113,.4))"><ellipse cx="16" cy="31" rx="5" ry="1" fill="#000" opacity=".35"/><rect x="10" y="27" width="4" height="3" fill="#163f20"/><rect x="18" y="27" width="4" height="3" fill="#163f20"/><rect x="9" y="18" width="6" height="10" fill="#1e5c30"/><rect x="17" y="18" width="6" height="10" fill="#1e5c30"/><rect x="10" y="18" width="12" height="10" fill="#245028"/><rect x="11" y="18" width="10" height="10" fill="#2ecc71" opacity=".15"/><rect x="7" y="12" width="4" height="7" fill="#1e5c30"/><rect x="21" y="12" width="4" height="7" fill="#1e5c30"/><rect x="9" y="12" width="14" height="7" fill="#245028"/><rect x="10" y="12" width="12" height="7" fill="#2ecc71" opacity=".15"/><rect x="10" y="12" width="12" height="1" fill="#2ecc71" opacity=".3"/><rect x="11" y="14" width="1" height="1" fill="#2ecc71" opacity=".6"/><rect x="20" y="14" width="1" height="1" fill="#2ecc71" opacity=".6"/><rect x="13" y="9" width="6" height="4" fill="#c8a87a"/><rect x="11" y="3" width="10" height="8" fill="#c8a87a"/><rect x="12" y="3" width="8" height="8" fill="#d4b48a"/><rect x="11" y="3" width="1" height="8" fill="#b89870" opacity=".5"/><rect x="12" y="5" width="3" height="2" fill="#1a0a00"/><rect x="12" y="5" width="3" height="1" fill="#2ecc71" opacity=".9"/><rect x="13" y="5" width="1" height="1" fill="#aaffcc"/><rect x="17" y="5" width="3" height="2" fill="#1a0a00"/><rect x="17" y="5" width="3" height="1" fill="#2ecc71" opacity=".9"/><rect x="18" y="5" width="1" height="1" fill="#aaffcc"/><rect x="14" y="9" width="4" height="1" fill="#8b6040" opacity=".6"/><rect x="9" y="1" width="14" height="3" fill="#1e5c30"/><rect x="5" y="0" width="4" height="4" fill="#1e5c30"/><rect x="23" y="0" width="4" height="4" fill="#1e5c30"/><rect x="6" y="-2" width="2" height="2" fill="#2ecc71" opacity=".5"/><rect x="23" y="-2" width="2" height="2" fill="#2ecc71" opacity=".5"/><rect x="11" y="-1" width="10" height="3" fill="#245028"/><rect x="2" y="7" width="2" height="20" fill="#7a5a30"/><rect x="0" y="6" width="5" height="3" fill="#2ecc71" opacity=".7"/><rect x="0" y="4" width="4" height="3" fill="#163f20"/></svg>`,
paladin:`<svg width="56" height="56" viewBox="0 0 32 32" style="image-rendering:pixelated;filter:drop-shadow(0 0 5px rgba(241,196,15,.45))"><ellipse cx="16" cy="31" rx="6" ry="1" fill="#000" opacity=".35"/><rect x="9" y="27" width="4" height="3" fill="#666"/><rect x="19" y="27" width="4" height="3" fill="#666"/><rect x="9" y="21" width="4" height="7" fill="#888"/><rect x="19" y="21" width="4" height="7" fill="#888"/><rect x="9" y="23" width="4" height="3" fill="#999"/><rect x="19" y="23" width="4" height="3" fill="#999"/><rect x="9" y="23" width="4" height="1" fill="#f1c40f" opacity=".6"/><rect x="19" y="23" width="4" height="1" fill="#f1c40f" opacity=".6"/><rect x="9" y="19" width="14" height="3" fill="#777"/><rect x="9" y="20" width="14" height="1" fill="#f1c40f" opacity=".5"/><rect x="14" y="19" width="4" height="3" fill="#888"/><rect x="15" y="19" width="2" height="3" fill="#f1c40f" opacity=".4"/><rect x="8" y="12" width="16" height="8" fill="#999"/><rect x="9" y="12" width="14" height="8" fill="#aaa"/><rect x="9" y="12" width="14" height="1" fill="#f1c40f" opacity=".7"/><rect x="15" y="13" width="2" height="6" fill="#f1c40f" opacity=".5"/><rect x="11" y="16" width="10" height="1" fill="#f1c40f" opacity=".45"/><rect x="10" y="14" width="1" height="1" fill="#f1c40f" opacity=".8"/><rect x="21" y="14" width="1" height="1" fill="#f1c40f" opacity=".8"/><rect x="5" y="11" width="5" height="5" fill="#888"/><rect x="5" y="11" width="5" height="1" fill="#f1c40f" opacity=".7"/><rect x="22" y="11" width="5" height="5" fill="#888"/><rect x="22" y="11" width="5" height="1" fill="#f1c40f" opacity=".7"/><rect x="4" y="15" width="4" height="5" fill="#888"/><rect x="24" y="15" width="4" height="5" fill="#888"/><rect x="3" y="19" width="5" height="4" fill="#777"/><rect x="24" y="19" width="5" height="4" fill="#777"/><rect x="3" y="19" width="5" height="1" fill="#f1c40f" opacity=".6"/><rect x="24" y="19" width="5" height="1" fill="#f1c40f" opacity=".6"/><rect x="0" y="10" width="5" height="11" fill="#888"/><rect x="0" y="10" width="5" height="1" fill="#f1c40f"/><rect x="0" y="20" width="5" height="1" fill="#f1c40f"/><rect x="0" y="10" width="1" height="11" fill="#f1c40f"/><rect x="4" y="10" width="1" height="11" fill="#555"/><rect x="1" y="15" width="2" height="3" fill="#f5e534"/><rect x="28" y="26" width="3" height="2" fill="#f1c40f"/><rect x="29" y="19" width="1" height="8" fill="#888"/><rect x="26" y="18" width="7" height="2" fill="#f1c40f"/><rect x="26" y="18" width="7" height="1" fill="#f5e534"/><rect x="29" y="5" width="2" height="14" fill="#ddd"/><rect x="29" y="5" width="1" height="14" fill="#fff" opacity=".5"/><rect x="30" y="5" width="1" height="14" fill="#999"/><rect x="29" y="3" width="2" height="3" fill="#bbb"/><rect x="29" y="5" width="1" height="12" fill="#f1c40f" opacity=".2"/><rect x="13" y="8" width="6" height="5" fill="#c8a87a"/><rect x="11" y="3" width="10" height="8" fill="#c8a87a"/><rect x="12" y="3" width="8" height="8" fill="#d4b48a"/><rect x="11" y="3" width="1" height="8" fill="#b89870" opacity=".5"/><rect x="12" y="5" width="3" height="2" fill="#1a0a00"/><rect x="12" y="5" width="3" height="1" fill="#f1c40f" opacity=".9"/><rect x="13" y="5" width="1" height="1" fill="#ffe060"/><rect x="17" y="5" width="3" height="2" fill="#1a0a00"/><rect x="17" y="5" width="3" height="1" fill="#f1c40f" opacity=".9"/><rect x="18" y="5" width="1" height="1" fill="#ffe060"/><rect x="14" y="9" width="4" height="1" fill="#8b6040" opacity=".6"/><rect x="11" y="1" width="10" height="4" fill="#888"/><rect x="11" y="1" width="10" height="1" fill="#f1c40f"/><rect x="15" y="0" width="2" height="2" fill="#f1c40f"/><rect x="11" y="4" width="2" height="4" fill="#888"/><rect x="19" y="4" width="2" height="4" fill="#888"/><rect x="12" y="4" width="8" height="1" fill="#1a0a00" opacity=".6"/></svg>`,
rogue:`<svg width="56" height="56" viewBox="0 0 32 32" style="image-rendering:pixelated;filter:drop-shadow(0 0 5px rgba(149,165,166,.35))"><ellipse cx="16" cy="31" rx="5" ry="1" fill="#000" opacity=".35"/><rect x="10" y="27" width="4" height="3" fill="#0a0a12"/><rect x="18" y="27" width="4" height="3" fill="#0a0a12"/><rect x="9" y="18" width="6" height="10" fill="#111120"/><rect x="17" y="18" width="6" height="10" fill="#111120"/><rect x="10" y="18" width="12" height="10" fill="#1a1a28"/><rect x="11" y="18" width="10" height="10" fill="#2a2a3a" opacity=".4"/><rect x="13" y="20" width="1" height="1" fill="#95a5a6" opacity=".4"/><rect x="7" y="12" width="4" height="7" fill="#111120"/><rect x="21" y="12" width="4" height="7" fill="#111120"/><rect x="9" y="12" width="14" height="7" fill="#1a1a28"/><rect x="10" y="12" width="12" height="7" fill="#2a2a3a" opacity=".4"/><rect x="11" y="14" width="1" height="1" fill="#95a5a6" opacity=".5"/><rect x="20" y="14" width="1" height="1" fill="#95a5a6" opacity=".5"/><rect x="13" y="9" width="6" height="4" fill="#c8a87a"/><rect x="11" y="3" width="10" height="8" fill="#c8a87a"/><rect x="12" y="3" width="8" height="8" fill="#d4b48a"/><rect x="11" y="3" width="1" height="8" fill="#b89870" opacity=".5"/><rect x="12" y="5" width="3" height="2" fill="#0a0a12"/><rect x="12" y="5" width="3" height="1" fill="#95a5a6" opacity=".9"/><rect x="13" y="5" width="1" height="1" fill="#d0e0e0"/><rect x="17" y="5" width="3" height="2" fill="#0a0a12"/><rect x="17" y="5" width="3" height="1" fill="#95a5a6" opacity=".9"/><rect x="18" y="5" width="1" height="1" fill="#d0e0e0"/><rect x="14" y="9" width="4" height="1" fill="#8b6040" opacity=".6"/><rect x="9" y="0" width="14" height="4" fill="#0a0a12"/><rect x="11" y="-1" width="10" height="3" fill="#111120"/><rect x="11" y="3" width="10" height="1" fill="#95a5a6" opacity=".2"/><rect x="2" y="10" width="2" height="12" fill="#888" opacity=".7"/><rect x="2" y="10" width="2" height="1" fill="#bbb" opacity=".6"/><rect x="2" y="9" width="3" height="1" fill="#999" opacity=".5"/><rect x="27" y="10" width="2" height="12" fill="#888" opacity=".7"/><rect x="27" y="10" width="2" height="1" fill="#bbb" opacity=".6"/><rect x="27" y="9" width="3" height="1" fill="#999" opacity=".5"/></svg>`,
witch:`<svg width="56" height="56" viewBox="0 0 32 32" style="image-rendering:pixelated;filter:drop-shadow(0 0 5px rgba(155,89,182,.55))"><ellipse cx="16" cy="31" rx="5" ry="1" fill="#000" opacity=".35"/><rect x="10" y="27" width="4" height="3" fill="#1a0030"/><rect x="18" y="27" width="4" height="3" fill="#1a0030"/><rect x="8" y="18" width="6" height="10" fill="#2d0050"/><rect x="18" y="18" width="6" height="10" fill="#2d0050"/><rect x="9" y="18" width="14" height="10" fill="#38006a"/><rect x="10" y="18" width="12" height="10" fill="#4a0080" opacity=".4"/><rect x="11" y="19" width="10" height="1" fill="#9b59b6" opacity=".2"/><rect x="12" y="22" width="8" height="1" fill="#9b59b6" opacity=".15"/><rect x="6" y="12" width="4" height="7" fill="#2d0050"/><rect x="22" y="12" width="4" height="7" fill="#2d0050"/><rect x="8" y="12" width="16" height="7" fill="#38006a"/><rect x="9" y="12" width="14" height="7" fill="#4a0080" opacity=".4"/><rect x="9" y="12" width="14" height="1" fill="#9b59b6" opacity=".4"/><rect x="12" y="14" width="1" height="1" fill="#ddb8ff" opacity=".6"/><rect x="19" y="14" width="1" height="1" fill="#ddb8ff" opacity=".6"/><rect x="16" y="15" width="1" height="1" fill="#ddb8ff" opacity=".4"/><rect x="13" y="9" width="6" height="4" fill="#c8a87a"/><rect x="11" y="4" width="10" height="7" fill="#c8a87a"/><rect x="12" y="4" width="8" height="7" fill="#d4b48a"/><rect x="11" y="4" width="1" height="7" fill="#b89870" opacity=".5"/><rect x="12" y="5" width="3" height="2" fill="#1a0030"/><rect x="12" y="5" width="3" height="1" fill="#9b59b6" opacity=".9"/><rect x="13" y="5" width="1" height="1" fill="#ddb8ff"/><rect x="17" y="5" width="3" height="2" fill="#1a0030"/><rect x="17" y="5" width="3" height="1" fill="#9b59b6" opacity=".9"/><rect x="18" y="5" width="1" height="1" fill="#ddb8ff"/><rect x="14" y="9" width="4" height="1" fill="#8b6040" opacity=".6"/><rect x="10" y="0" width="12" height="5" fill="#1a0030"/><rect x="12" y="-2" width="8" height="5" fill="#2d0050"/><rect x="14" y="-4" width="4" height="5" fill="#38006a"/><rect x="15" y="-5" width="2" height="4" fill="#4a0080"/><rect x="15" y="-5" width="2" height="1" fill="#ddb8ff" opacity=".4"/><rect x="10" y="4" width="2" height="1" fill="#ddb8ff" opacity=".5"/><rect x="20" y="3" width="2" height="1" fill="#ddb8ff" opacity=".4"/><rect x="29" y="6" width="1" height="20" fill="#5a3020"/><rect x="28" y="23" width="3" height="2" fill="#7a5a30" opacity=".7"/></svg>`,
amazon:`<svg width="56" height="56" viewBox="0 0 32 32" style="image-rendering:pixelated;filter:drop-shadow(0 0 5px rgba(192,57,43,.45))"><ellipse cx="16" cy="31" rx="5" ry="1" fill="#000" opacity=".35"/><rect x="10" y="26" width="4" height="4" fill="#6a2010"/><rect x="18" y="26" width="4" height="4" fill="#6a2010"/><rect x="9" y="19" width="5" height="8" fill="#8b3010"/><rect x="10" y="19" width="1" height="8" fill="#8b3010"/><rect x="13" y="19" width="1" height="8" fill="#8b3010"/><rect x="11" y="19" width="2" height="8" fill="#6a2010"/><rect x="18" y="19" width="5" height="8" fill="#8b3010"/><rect x="19" y="19" width="2" height="8" fill="#6a2010"/><rect x="9" y="17" width="14" height="3" fill="#8b3010"/><rect x="9" y="18" width="14" height="1" fill="#c9a84c" opacity=".5"/><rect x="9" y="12" width="14" height="6" fill="#8b3010"/><rect x="10" y="12" width="12" height="6" fill="#a04020" opacity=".5"/><rect x="10" y="12" width="12" height="1" fill="#c9a84c" opacity=".5"/><rect x="12" y="14" width="1" height="1" fill="#c9a84c" opacity=".6"/><rect x="19" y="14" width="1" height="1" fill="#c9a84c" opacity=".6"/><rect x="5" y="11" width="4" height="6" fill="#8b3010"/><rect x="5" y="13" width="4" height="1" fill="#c9a84c" opacity=".6"/><rect x="23" y="11" width="4" height="6" fill="#8b3010"/><rect x="23" y="13" width="4" height="1" fill="#c9a84c" opacity=".6"/><rect x="3" y="16" width="4" height="5" fill="#6a2010"/><rect x="25" y="16" width="4" height="5" fill="#6a2010"/><rect x="13" y="9" width="6" height="4" fill="#c8a87a"/><rect x="11" y="3" width="10" height="8" fill="#c8a87a"/><rect x="12" y="3" width="8" height="8" fill="#d4b48a"/><rect x="11" y="3" width="1" height="8" fill="#b89870" opacity=".5"/><rect x="12" y="5" width="3" height="2" fill="#1a0a00"/><rect x="12" y="5" width="3" height="1" fill="#e74c3c" opacity=".9"/><rect x="13" y="5" width="1" height="1" fill="#ff9090"/><rect x="17" y="5" width="3" height="2" fill="#1a0a00"/><rect x="17" y="5" width="3" height="1" fill="#e74c3c" opacity=".9"/><rect x="18" y="5" width="1" height="1" fill="#ff9090"/><rect x="14" y="9" width="4" height="1" fill="#8b6040" opacity=".6"/><rect x="9" y="1" width="14" height="3" fill="#8b3010"/><rect x="9" y="1" width="14" height="1" fill="#c9a84c" opacity=".5"/><rect x="11" y="0" width="10" height="2" fill="#6a2010"/><rect x="12" y="-1" width="2" height="2" fill="#c9a84c" opacity=".7"/><rect x="18" y="-1" width="2" height="2" fill="#c9a84c" opacity=".7"/><rect x="1" y="7" width="2" height="20" fill="#8b5a30"/><rect x="0" y="5" width="3" height="3" fill="#888"/><rect x="0" y="4" width="2" height="2" fill="#999"/></svg>`,
vampire:`<svg width="56" height="56" viewBox="0 0 32 32" style="image-rendering:pixelated;filter:drop-shadow(0 0 5px rgba(192,57,43,.5))"><ellipse cx="16" cy="31" rx="5" ry="1" fill="#000" opacity=".35"/><rect x="10" y="27" width="4" height="3" fill="#0a0000"/><rect x="18" y="27" width="4" height="3" fill="#0a0000"/><rect x="7" y="16" width="6" height="12" fill="#0f0505"/><rect x="19" y="16" width="6" height="12" fill="#0f0505"/><rect x="9" y="16" width="14" height="12" fill="#1a0808"/><rect x="10" y="16" width="12" height="12" fill="#2a0a0a" opacity=".4"/><rect x="10" y="16" width="12" height="1" fill="#c0392b" opacity=".5"/><rect x="15" y="17" width="2" height="10" fill="#2a0a0a" opacity=".4"/><rect x="5" y="12" width="4" height="6" fill="#0f0505"/><rect x="23" y="12" width="4" height="6" fill="#0f0505"/><rect x="9" y="12" width="14" height="5" fill="#1a0808"/><rect x="10" y="12" width="12" height="1" fill="#c0392b" opacity=".4"/><rect x="13" y="9" width="6" height="4" fill="#d4b8b0"/><rect x="11" y="3" width="10" height="8" fill="#d0b4ac"/><rect x="12" y="3" width="8" height="8" fill="#dcc0b8"/><rect x="12" y="5" width="3" height="2" fill="#0a0000"/><rect x="12" y="5" width="3" height="1" fill="#c0392b" opacity=".9"/><rect x="13" y="5" width="1" height="1" fill="#ff6060"/><rect x="17" y="5" width="3" height="2" fill="#0a0000"/><rect x="17" y="5" width="3" height="1" fill="#c0392b" opacity=".9"/><rect x="18" y="5" width="1" height="1" fill="#ff6060"/><rect x="14" y="8" width="1" height="2" fill="#e8dbc0"/><rect x="17" y="8" width="1" height="2" fill="#e8dbc0"/><rect x="14" y="9" width="4" height="1" fill="#8b6060" opacity=".5"/><rect x="9" y="1" width="14" height="4" fill="#0f0505"/><rect x="11" y="-1" width="10" height="4" fill="#1a0808"/><rect x="11" y="4" width="2" height="4" fill="#0f0505"/><rect x="19" y="4" width="2" height="4" fill="#0f0505"/><rect x="12" y="4" width="8" height="1" fill="#0a0000" opacity=".8"/><rect x="4" y="5" width="4" height="8" fill="#0f0505" opacity=".7"/><rect x="3" y="7" width="3" height="5" fill="#0f0505" opacity=".5"/><rect x="24" y="5" width="4" height="8" fill="#0f0505" opacity=".7"/><rect x="25" y="7" width="3" height="5" fill="#0f0505" opacity=".5"/><rect x="14" y="8" width="4" height="1" fill="#c0392b" opacity=".4"/></svg>`,
priestess:`<svg width="56" height="56" viewBox="0 0 32 32" style="image-rendering:pixelated;filter:drop-shadow(0 0 5px rgba(232,180,212,.5))"><ellipse cx="16" cy="31" rx="5" ry="1" fill="#000" opacity=".35"/><rect x="10" y="27" width="4" height="3" fill="#f0dce8"/><rect x="18" y="27" width="4" height="3" fill="#f0dce8"/><rect x="9" y="18" width="6" height="10" fill="#fff8f8"/><rect x="17" y="18" width="6" height="10" fill="#fff8f8"/><rect x="10" y="18" width="12" height="10" fill="#fff8f8"/><rect x="11" y="18" width="10" height="10" fill="#fff" opacity=".4"/><rect x="15" y="18" width="2" height="8" fill="#e8b4d4" opacity=".5"/><rect x="11" y="22" width="10" height="1" fill="#e8b4d4" opacity=".35"/><rect x="7" y="12" width="4" height="7" fill="#fff8f8"/><rect x="21" y="12" width="4" height="7" fill="#fff8f8"/><rect x="9" y="12" width="14" height="7" fill="#fff8f8"/><rect x="10" y="12" width="12" height="1" fill="#e8b4d4" opacity=".5"/><rect x="15" y="13" width="2" height="4" fill="#e8b4d4" opacity=".4"/><rect x="11" y="15" width="10" height="1" fill="#e8b4d4" opacity=".3"/><rect x="11" y="14" width="1" height="1" fill="#e8b4d4" opacity=".7"/><rect x="20" y="14" width="1" height="1" fill="#e8b4d4" opacity=".7"/><rect x="13" y="9" width="6" height="4" fill="#c8a87a"/><rect x="11" y="3" width="10" height="8" fill="#c8a87a"/><rect x="12" y="3" width="8" height="8" fill="#d4b48a"/><rect x="11" y="3" width="1" height="8" fill="#b89870" opacity=".5"/><rect x="12" y="5" width="3" height="2" fill="#1a0a00"/><rect x="12" y="5" width="3" height="1" fill="#e8b4d4" opacity=".9"/><rect x="13" y="5" width="1" height="1" fill="#ffd8f0"/><rect x="17" y="5" width="3" height="2" fill="#1a0a00"/><rect x="17" y="5" width="3" height="1" fill="#e8b4d4" opacity=".9"/><rect x="18" y="5" width="1" height="1" fill="#ffd8f0"/><rect x="14" y="9" width="4" height="1" fill="#8b6040" opacity=".6"/><rect x="9" y="0" width="14" height="5" fill="#e8b4d4" opacity=".4"/><rect x="9" y="0" width="14" height="1" fill="#e8b4d4" opacity=".6"/><rect x="28" y="5" width="2" height="20" fill="#e8b4d4"/><rect x="26" y="4" width="6" height="4" fill="#ffe8f8" opacity=".7"/><rect x="28" y="4" width="2" height="3" fill="#fff"/></svg>`,
barbarian:`<svg width="56" height="56" viewBox="0 0 32 32" style="image-rendering:pixelated;filter:drop-shadow(0 0 5px rgba(230,126,34,.45))"><ellipse cx="16" cy="31" rx="7" ry="1" fill="#000" opacity=".35"/><rect x="9" y="27" width="5" height="3" fill="#3a1a08"/><rect x="18" y="27" width="5" height="3" fill="#3a1a08"/><rect x="8" y="19" width="6" height="9" fill="#5a2a10"/><rect x="18" y="19" width="6" height="9" fill="#5a2a10"/><rect x="9" y="19" width="14" height="9" fill="#6a3010"/><rect x="10" y="19" width="12" height="9" fill="#7a3a15" opacity=".4"/><rect x="9" y="19" width="14" height="1" fill="#c9a84c" opacity=".4"/><rect x="8" y="12" width="16" height="8" fill="#5a2a10"/><rect x="9" y="12" width="14" height="8" fill="#6a3010"/><rect x="10" y="12" width="12" height="8" fill="#7a3a15" opacity=".4"/><rect x="9" y="12" width="14" height="1" fill="#c9a84c" opacity=".4"/><rect x="11" y="15" width="1" height="1" fill="#c9a84c" opacity=".6"/><rect x="20" y="15" width="1" height="1" fill="#c9a84c" opacity=".6"/><rect x="3" y="10" width="6" height="9" fill="#5a2a10"/><rect x="3" y="14" width="6" height="2" fill="#c9a84c" opacity=".5"/><rect x="23" y="10" width="6" height="9" fill="#5a2a10"/><rect x="23" y="14" width="6" height="2" fill="#c9a84c" opacity=".5"/><rect x="1" y="18" width="5" height="4" fill="#4a1a08"/><rect x="1" y="18" width="5" height="1" fill="#c9a84c" opacity=".6"/><rect x="26" y="18" width="5" height="4" fill="#4a1a08"/><rect x="26" y="18" width="5" height="1" fill="#c9a84c" opacity=".6"/><rect x="13" y="9" width="6" height="4" fill="#c8a87a"/><rect x="10" y="2" width="12" height="9" fill="#c8a87a"/><rect x="11" y="2" width="10" height="9" fill="#d4b48a"/><rect x="11" y="5" width="3" height="2" fill="#1a0800"/><rect x="11" y="5" width="3" height="1" fill="#e67e22" opacity=".9"/><rect x="12" y="5" width="1" height="1" fill="#ffb060"/><rect x="18" y="5" width="3" height="2" fill="#1a0800"/><rect x="18" y="5" width="3" height="1" fill="#e67e22" opacity=".9"/><rect x="19" y="5" width="1" height="1" fill="#ffb060"/><rect x="14" y="7" width="4" height="1" fill="#a05020" opacity=".6"/><rect x="9" y="0" width="14" height="3" fill="#7a3a10"/><rect x="9" y="0" width="14" height="1" fill="#c9a84c" opacity=".5"/><rect x="8" y="-1" width="2" height="3" fill="#a05020"/><rect x="22" y="-1" width="2" height="3" fill="#a05020"/><rect x="9" y="-2" width="2" height="2" fill="#c9a84c" opacity=".6"/><rect x="21" y="-2" width="2" height="2" fill="#c9a84c" opacity=".6"/><rect x="0" y="8" width="3" height="17" fill="#888"/><rect x="-2" y="5" width="5" height="5" fill="#999"/><rect x="-2" y="6" width="2" height="1" fill="#e8c96b" opacity=".3"/></svg>`,
};
const CLASSES = {};
Object.entries(CLASS_EVOLUTIONS).forEach(([id, tree]) => {
  const base = tree[0];
  const bonus = {
    warrior:   {dmgMult:1.25,hpBonus:30,goldMult:1.0,xpMult:1.0,crMult:1.0},
    mage:      {dmgMult:1.0,hpBonus:0,goldMult:1.0,xpMult:1.35,crMult:1.25},
    archer:    {dmgMult:1.0,hpBonus:0,goldMult:1.4,xpMult:1.0,crMult:1.0,streakBonus:0.15},
    bard:      {dmgMult:1.0,hpBonus:0,goldMult:1.15,xpMult:1.15,crMult:1.1,streakBonus:0.1},
    cleric:    {dmgMult:1.0,hpBonus:50,goldMult:1.0,xpMult:1.2,crMult:1.0},
    druid:     {dmgMult:1.1,hpBonus:20,goldMult:1.0,xpMult:1.1,crMult:1.15},
    paladin:   {dmgMult:1.2,hpBonus:40,goldMult:1.0,xpMult:1.0,crMult:1.0},
    rogue:     {dmgMult:1.1,hpBonus:0,goldMult:1.25,xpMult:1.0,crMult:1.1},
    // Novas classes
    witch:     {dmgMult:1.0,hpBonus:0,goldMult:1.0,xpMult:1.3,crMult:1.3},
    amazon:    {dmgMult:1.2,hpBonus:20,goldMult:1.15,xpMult:1.0,crMult:1.0,streakBonus:0.1},
    vampire:   {dmgMult:1.15,hpBonus:0,goldMult:1.1,xpMult:1.0,crMult:1.2},
    priestess: {dmgMult:1.0,hpBonus:60,goldMult:1.0,xpMult:1.25,crMult:1.1},
    barbarian: {dmgMult:1.35,hpBonus:40,goldMult:1.0,xpMult:1.0,crMult:1.0},
  }[id] || {dmgMult:1,hpBonus:0,goldMult:1,xpMult:1,crMult:1};
  CLASSES[id] = {
    id, name:base.name, icon:base.icon, color:base.color,
    desc: {
      warrior:'Mestre do combate físico. Força, vida e dano amplificados.',
      mage:'Mestre das artes arcanas. XP e efeitos mágicos amplificados.',
      archer:'Mestre da velocidade. Streak, gold e precisão amplificados.',
      bard:'A música como arma. Bônus crescentes por missões encadeadas.',
      cleric:'Servidor da luz. Cura, fé e proteção divina em batalha.',
      druid:'Filho da natureza. Regeneração, veneno e harmonia natural.',
      paladin:'Guerreiro sagrado. Disciplina, luz divina e martírio.',
      rogue:'Nas sombras, invisível. Furtividade, veneno e roubo de vida.',
      witch:'Mestra das maldições e pactos proibidos. Enfraquece Bosses com maldições acumuladas, converte sabedoria em cristais e manipula a própria realidade. Quanto mais missões de mente, mais poderosas suas bruxarias.',
      amazon:'Guerreira feroz das terras selvagens. Cada missão seguida no dia empilha fúria e poder. Imparável quando em movimento — letal quando em série. O corpo é sua arma e a resistência, sua religião.',
      vampire:'Predadora imortal da madrugada. Drena a vida dos inimigos para renovar a própria. Cada bit de dano causado retorna como cura. Quanto mais escura a batalha, mais devastadora sua resposta sanguinária.',
      priestess:'Intermediária entre o mundo mortal e o divino. Cura, protege e abençoa aliados com cada missão de alma. Carisma, sabedoria e fé valem ouro, XP e HP simultaneamente. A luz obedece sua voz.',
      barbarian:'Força bruta elevada ao absoluto. Converte dor em raiva e raiva em dano puro. Cada penalidade recebida dispara Fúria — e a Fúria dobra os próximos golpes. O campo de batalha é seu lar.',
    }[id],
    bonuses: bonus,
    passives: tree[0].skill ? [tree[0].skill] : [],
  };
});

// ── Get current evolved form of player class ──
function getEvolvedClass(){
  const cls = S.playerClass; if(!cls) return null;
  const tree = CLASS_EVOLUTIONS[cls]; if(!tree) return null;
  let current = tree[0];
  for(const stage of tree){
    if(S.lv >= stage.lv) current = stage;
    else break;
  }
  return current;
}

// ── Get next evolution milestone ──
function getNextEvolution(){
  const cls = S.playerClass; if(!cls) return null;
  const tree = CLASS_EVOLUTIONS[cls]; if(!tree) return null;
  return tree.find(stage => S.lv < stage.lv) || null;
}

// ── Get ALL unlocked evolutions for current class ──
function getUnlockedEvolutions(){
  const cls = S.playerClass; if(!cls) return [];
  const tree = CLASS_EVOLUTIONS[cls]; if(!tree) return [];
  return tree.filter(stage => S.lv >= stage.lv);
}

function getClass(){ return CLASSES[S.playerClass] || null; }
function getClassDmgMult(){
  const cls = getClass(); if(!cls) return 1;
  let mult = (cls.bonuses.dmgMult || 1) * getGuildDmgBonus();
  // PALADIN: Martírio — lower HP → higher dmg
  if(S.playerClass==='paladin'){
    const evo = getEvolvedClass();
    if(evo && evo.lv>=50){
      const hpPct = S.hp/S.mhp;
      const martyrBonus = Math.min(0.4, (1-hpPct));
      mult += martyrBonus;
    }
  }
  // BARD: stacking buff from missions today
  if(S.playerClass==='bard' && S.bardBuff){
    const today = new Date().toDateString();
    if(S.bardBuff.day===today){
      mult += S.bardBuff.count * 0.05; // +5% per stacked mission
    }
  }
  // ROGUE: furtive crit 30% chance → 1.0 or 2.0
  if(S.playerClass==='rogue' && Math.random()<0.3) mult *= 2;
  return mult;
}
function getClassXpMult(){
  const cls = getClass(); if(!cls) return 1;
  return cls.bonuses.xpMult || 1;
}
function getClassGoldMult(){
  const cls = getClass(); if(!cls) return 1;
  return cls.bonuses.goldMult || 1;
}
function getClassCrMult(){
  const cls = getClass(); if(!cls) return 1;
  return cls.bonuses.crMult || 1;
}
function getClassStreakBonus(){
  const cls = getClass(); if(!cls) return 0;
  return cls.bonuses.streakBonus || 0;
}

// ─── Open class detail modal (click on any class card) ───────────
// Classes restritas a feminino/não-binário
const GENDER_RESTRICTED_CLASSES = ['witch','amazon','vampire','priestess'];
// barbarian is open to all genders

function isClassAllowed(id){
  if(!GENDER_RESTRICTED_CLASSES.includes(id)) return true;
  const sex = S.profile?.sex || '';
  // Allowed: Feminino, Não-binário, Outro, empty (not specified)
  const blocked = sex === 'Masculino';
  return !blocked;
}

function openClassDetail(id){
  const cls = CLASSES[id]; if(!cls) return;
  const tree = CLASS_EVOLUTIONS[id] || [];
  const isActive = S.playerClass === id;
  const hasClass = !!S.playerClass;
  const hasPot = (S.potions?.transform||0) > 0;
  const b = cls.bonuses;

  const bonusLines = [
    b.dmgMult>1 ? `<div style="display:flex;align-items:center;gap:6px;padding:5px 0;border-bottom:1px solid rgba(255,255,255,.04)"><span style="font-size:14px">⚔️</span><span style="flex:1;font-size:11px;color:var(--text2)">Dano base</span><span style="font-family:'Cinzel',serif;font-size:11px;color:${cls.color}">+${Math.round((b.dmgMult-1)*100)}%</span></div>` : '',
    b.xpMult>1  ? `<div style="display:flex;align-items:center;gap:6px;padding:5px 0;border-bottom:1px solid rgba(255,255,255,.04)"><span style="font-size:14px">⚡</span><span style="flex:1;font-size:11px;color:var(--text2)">XP</span><span style="font-family:'Cinzel',serif;font-size:11px;color:${cls.color}">+${Math.round((b.xpMult-1)*100)}%</span></div>` : '',
    b.goldMult>1? `<div style="display:flex;align-items:center;gap:6px;padding:5px 0;border-bottom:1px solid rgba(255,255,255,.04)"><span style="font-size:14px">🪙</span><span style="flex:1;font-size:11px;color:var(--text2)">Gold</span><span style="font-family:'Cinzel',serif;font-size:11px;color:${cls.color}">+${Math.round((b.goldMult-1)*100)}%</span></div>` : '',
    b.crMult>1  ? `<div style="display:flex;align-items:center;gap:6px;padding:5px 0;border-bottom:1px solid rgba(255,255,255,.04)"><span style="font-size:14px">💎</span><span style="flex:1;font-size:11px;color:var(--text2)">Cristais</span><span style="font-family:'Cinzel',serif;font-size:11px;color:${cls.color}">+${Math.round((b.crMult-1)*100)}%</span></div>` : '',
    b.hpBonus>0 ? `<div style="display:flex;align-items:center;gap:6px;padding:5px 0;border-bottom:1px solid rgba(255,255,255,.04)"><span style="font-size:14px">❤️</span><span style="flex:1;font-size:11px;color:var(--text2)">HP Máximo</span><span style="font-family:'Cinzel',serif;font-size:11px;color:${cls.color}">+${b.hpBonus}</span></div>` : '',
    b.streakBonus? `<div style="display:flex;align-items:center;gap:6px;padding:5px 0"><span style="font-size:14px">🔥</span><span style="flex:1;font-size:11px;color:var(--text2)">Bônus de Streak</span><span style="font-family:'Cinzel',serif;font-size:11px;color:${cls.color}">+${Math.round(b.streakBonus*100)}%</span></div>` : '',
  ].filter(Boolean).join('');

  const evoLines = tree.map(stage => `
    <div class="cls-evo-stage">
      <div class="cls-evo-dot" style="border-color:${stage.color};background:${stage.color}18;color:${stage.color}">
        ${stage.icon}
      </div>
      <div style="flex:1">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;flex-wrap:wrap">
          <span style="font-family:'Cinzel',serif;font-size:12px;color:${stage.color}">${stage.name}</span>
          <span class="cls-evo-badge" style="background:${stage.color}18;color:${stage.color};border:1px solid ${stage.color}40">Nível ${stage.lv}</span>
        </div>
        <div style="background:rgba(0,0,0,.35);border:1px solid ${stage.color}25;border-radius:5px;padding:7px 9px">
          <div style="font-family:'Cinzel',serif;font-size:9px;color:${stage.color};letter-spacing:.08em;margin-bottom:3px">${stage.skill.icon} ${stage.skill.name}</div>
          <div style="font-size:11px;color:var(--text2);line-height:1.6">${stage.skill.desc}</div>
        </div>
      </div>
    </div>`).join('');

  let actionBtn = '';
  const allowed = isClassAllowed(id);
  if(isActive){
    actionBtn = `<div style="font-size:11px;color:var(--green3);text-align:center;padding:8px">✓ Esta é sua classe ativa</div>`;
  } else if(!allowed){
    actionBtn = `<div style="background:rgba(192,57,43,.1);border:1px solid rgba(192,57,43,.3);border-radius:6px;padding:10px 12px;text-align:center">
      <div style="font-size:16px;margin-bottom:4px">🔒</div>
      <div style="font-family:'Cinzel',serif;font-size:10px;color:var(--red3);margin-bottom:4px">Classe Restrita</div>
      <div style="font-size:10px;color:var(--text2)">Esta classe é exclusiva para personagens do sexo Feminino ou Não-binário.<br>Altere o sexo do personagem na aba <strong>Herói → Perfil</strong> para desbloquear.</div>
    </div>`;
  } else if(!hasClass){
    actionBtn = `<button class="btn" style="width:100%;margin-top:4px;border-color:${cls.color};color:${cls.color}" onclick="confirmSelectClass('${id}')">⚔ Escolher ${cls.name}</button>`;
  } else {
    // Has a different class — needs potion
    if(hasPot){
      actionBtn = `<button class="btn bcr" style="width:100%;margin-top:4px" onclick="confirmClassChange('${id}')">⚗️ Usar Poção e Trocar para ${cls.name}</button>`;
    } else {
      actionBtn = `<div style="background:rgba(0,0,0,.4);border:1px solid rgba(255,255,255,.08);border-radius:5px;padding:10px;text-align:center;margin-top:4px">
        <div style="font-size:11px;color:var(--text2);margin-bottom:6px">Você precisa de uma <strong style="color:var(--crystal)">Poção de Transformação</strong> para trocar de classe.</div>
        <div style="font-size:10px;color:var(--text3)">Compre na Taberna por 100💎 · Você tem: ${S.potions?.transform||0} poções</div>
      </div>`;
    }
  }

  showMo(null, null,
    `<div style="text-align:center;margin-bottom:14px">
      <div style="display:flex;align-items:center;justify-content:center;margin-bottom:6px">${CLASS_IMG[id]?classImgTag(id,120,cls.color):('<span style="font-size:44px">'+cls.icon+'</span>')}</div>
      <div style="font-family:'Cinzel Decorative',serif;font-size:18px;color:${cls.color};margin-bottom:3px">${cls.name}</div>
      <div style="font-size:11px;color:var(--text2);font-style:italic">${cls.desc}</div>
    </div>
    <div style="background:rgba(0,0,0,.3);border:1px solid ${cls.color}25;border-radius:6px;padding:10px 12px;margin-bottom:12px">
      <div style="font-family:'Cinzel',serif;font-size:8px;letter-spacing:.15em;color:var(--text3);margin-bottom:8px">ATRIBUTOS BASE</div>
      ${bonusLines}
    </div>
    <div style="margin-bottom:12px">
      <div style="font-family:'Cinzel',serif;font-size:8px;letter-spacing:.15em;color:var(--text3);margin-bottom:8px">ÁRVORE DE EVOLUÇÃO</div>
      ${evoLines}
    </div>
    ${actionBtn}`,
    []
  );
}

// ─── Confirm initial class selection (no class yet) ───────────────
function confirmSelectClass(id){
  const cls = CLASSES[id]; if(!cls) return;
  closeMo();
  setTimeout(()=>{
    showMo('⚔ Confirmar Classe',
      null,
      `<div style="font-size:13px;color:var(--text2);line-height:1.8;text-align:center;padding:4px 0">
        Tem certeza? Você escolherá<br>
        <strong style="color:${cls.color};font-size:15px">${cls.icon} ${cls.name}</strong><br>
        <div class="cls-title-tag" style="border:1px solid ${cls.color}44;color:${cls.color};margin:8px auto;display:inline-flex">
          <span>${cls.icon}</span><span>Título inicial: "${CLASS_TITLES[id]?.[0]?.ti||TITLES[0].ti}"</span>
        </div><br>
        <span style="font-size:11px;color:var(--text3)">Esta escolha é permanente — para mudar, precisará de uma Poção de Transformação.</span>
      </div>`,
      [
        {lb:'Cancelar', ac:'closeMo()'},
        {lb:`${cls.icon} Confirmar`, ac:`applyClassSelection('${id}')`, cl:'btn'}
      ]
    );
  }, 120);
}

function applyClassSelection(id){
  closeMo();
  const cls = CLASSES[id]; if(!cls) return;
  if(S.playerClass){ notify('🔒','Bloqueado','Use a Poção de Transformação para trocar.','nr'); return; }
  S.playerClass = id;
  S.classLockedAt = S.lv;
  S.mhp += (cls.bonuses.hpBonus||0);
  S.hp = Math.min(S.hp, S.mhp);
  save(); renderAll();
  notify(cls.icon, `Classe: ${cls.name}!`, `Bônus ativados. Que sua jornada seja épica!`, 'ng');
}

// ─── Confirm class change (has potion) ───────────────────────────
function confirmClassChange(id){
  const cls = CLASSES[id]; if(!cls) return;
  const hasPot = (S.potions?.transform||0) > 0;
  if(!hasPot){ notify('⚗️','Sem Poção','Compre a Poção de Transformação na Taberna.','nr'); return; }
  closeMo();
  setTimeout(()=>{
    showMo('⚗️ Segunda Confirmação',
      null,
      `<div style="font-size:13px;color:var(--text2);line-height:1.8;text-align:center;padding:4px 0">
        Esta ação é irreversível.<br>
        A Poção de Transformação será consumida e sua classe atual será perdida.<br><br>
        Deseja realmente trocar para<br>
        <strong style="color:${cls.color};font-size:15px">${cls.icon} ${cls.name}</strong>?
      </div>`,
      [
        {lb:'Cancelar', ac:'closeMo()'},
        {lb:`⚗️ Confirmar Transformação`, ac:`applyClassChange('${id}')`, cl:'btn bcr'}
      ]
    );
  }, 120);
}

function applyClassChange(id){
  closeMo();
  const cls = CLASSES[id]; if(!cls) return;
  if((S.potions?.transform||0) < 1){ notify('⚗️','Sem Poção','Poção não encontrada.','nr'); return; }
  S.potions.transform--;
  const old = S.playerClass;
  if(old && CLASSES[old]) S.mhp -= (CLASSES[old].bonuses.hpBonus||0);
  S.mhp = Math.max(100, S.mhp);
  S.hp = Math.min(S.hp, S.mhp);
  S.playerClass = id;
  S.classLockedAt = S.lv;
  S.bardBuff = null;
  S.mhp += (cls.bonuses.hpBonus||0);
  S.hp = Math.min(S.hp, S.mhp);
  save(); renderAll();
  notify(cls.icon, `Transformação Completa!`, `Você agora é ${cls.name}! Bônus anteriores removidos.`, 'ng');
}

// ─── Buy transformation potion (100 crystals) ────────────────────
function buyClassPotion(){
  if(S.cr < 100){ notify('💎','Cristais Insuficientes',`Precisa de 100💎. Você tem ${S.cr}.`,'nr'); return; }
  showMo('⚗️ Comprar Poção',
    `Custo: <strong style="color:var(--crystal)">100💎</strong>. A Poção de Transformação ficará no seu inventário de poções. Você tem ${S.potions?.transform||0} poção(ões) atualmente.`,
    null,
    [
      {lb:'Cancelar',ac:'closeMo()'},
      {lb:'⚗️ Comprar (100💎)',ac:'purchasePotion()',cl:'btn bcr'}
    ]
  );
}

function purchasePotion(){
  closeMo();
  if(S.cr < 100){ notify('💎','Insuficiente','Sem cristais suficientes.','nr'); return; }
  S.cr -= 100;
  if(!S.potions) S.potions = {transform:0};
  S.potions.transform++;
  save(); renderAll();
  notify('⚗️','Poção Adquirida!',`Você tem ${S.potions.transform} Poção(ões) de Transformação. Use na aba Classe.`,'ng');
}

// Legacy — keep stub for safety
function confirmClassPotion(){ purchasePotion(); }

function renderClasse(){
  const cur = document.getElementById('class-current');
  const grid = document.getElementById('class-grid');
  const passives = document.getElementById('class-passives');
  if(!grid) return;

  const active = getClass();
  const evolved = getEvolvedClass();
  const hasClass = !!S.playerClass;
  const unlocked = getUnlockedEvolutions();
  const nextEvo = getNextEvolution();

  if(cur){
    if(!active){
      cur.innerHTML = `<div style="background:rgba(0,0,0,.4);border:1px solid var(--border);border-radius:8px;padding:12px;text-align:center">
        <div style="font-size:28px;margin-bottom:6px">🏅</div>
        <div style="font-family:'Cinzel',serif;font-size:11px;color:var(--gold2);margin-bottom:4px">Sem Classe</div>
        <div style="font-size:11px;color:var(--text2);font-style:italic">Escolha sua classe abaixo para começar a jornada!</div>
      </div>`;
    } else {
      const evoBar = nextEvo
        ? `<div style="margin-top:8px">
            <div style="display:flex;justify-content:space-between;font-family:'Cinzel',serif;font-size:9px;color:var(--text3);margin-bottom:3px">
              <span>PRÓXIMA: ${nextEvo.name}</span><span>Nv ${nextEvo.lv} (faltam ${nextEvo.lv - S.lv})</span>
            </div>
            <div style="height:5px;background:rgba(0,0,0,.4);border-radius:3px;overflow:hidden">
              <div style="height:100%;background:linear-gradient(90deg,${evolved.color},${nextEvo.color});width:${Math.min(100,((S.lv-(unlocked[unlocked.length-2]?.lv||1))/(nextEvo.lv-(unlocked[unlocked.length-2]?.lv||1)))*100)}%;transition:width .6s"></div>
            </div>
          </div>`
        : `<div style="margin-top:6px;font-family:'Cinzel',serif;font-size:9px;color:var(--gold2);text-align:center">✦ FORMA MÁXIMA ATINGIDA ✦</div>`;
      cur.innerHTML = `
        <div style="background:linear-gradient(135deg,rgba(0,0,0,.5),rgba(0,0,0,.3));border:1px solid ${evolved.color}40;border-radius:8px;padding:12px">
          <div style="display:flex;align-items:center;gap:10px">
            <span style="display:inline-flex;align-items:center;justify-content:center;width:48px;height:48px;border-radius:6px;overflow:hidden">${CLASS_IMG[S.playerClass]?classImgTag(S.playerClass,48,evolved.color):('<span style="font-size:32px">'+evolved.icon+'</span>')}</span>
            <div style="flex:1">
              <div style="font-family:'Cinzel Decorative',serif;font-size:14px;color:${evolved.color}">${evolved.name}</div>
              <div style="font-family:'Cinzel',serif;font-size:9px;color:var(--text3);letter-spacing:.1em">Nível ${S.lv} · ${active.desc}</div>
            </div>
          </div>
          ${evoBar}
        </div>`;
    }
  }

  // Render class grid — all 8 cards, click opens detail modal
  const hasPot2 = (S.potions?.transform||0) > 0;
  grid.innerHTML = Object.values(CLASSES).map(cls => {
    const isActive = S.playerClass === cls.id;
    const isLocked = hasClass && !isActive;
    const genderLocked = !isClassAllowed(cls.id) && !isActive;
    const b = cls.bonuses;
    const lockVeil = genderLocked
      ? `<div class="class-lock-veil"><span style="font-size:20px">🚺</span><span>Restrita: ♀ / ⚧</span></div>`
      : isLocked ? `<div class="class-lock-veil"><span style="font-size:20px">${hasPot2?'⚗️':'🔒'}</span><span>${hasPot2?'Clique para trocar':'Poção necessária'}</span></div>` : '';
    return `<div class="class-card cls-${cls.id} ${isActive?'selected':''} ${(isLocked||genderLocked)?'cls-locked':''}"
        style="${genderLocked?'filter:grayscale(.7);':''}"
        onclick="openClassDetail('${cls.id}')">
      ${lockVeil}
      <div class="class-icon" style="display:flex;align-items:center;justify-content:center;height:90px;overflow:hidden;border-radius:8px;margin-bottom:4px">${CLASS_IMG[cls.id]?classImgTag(cls.id,90,cls.color):('<span style="font-size:36px">'+cls.icon+'</span>')}</div>
      <div class="class-name" style="color:${cls.color}">${cls.name}</div>
      <div style="font-size:9px;color:var(--text2);text-align:center;margin-bottom:7px;font-style:italic;line-height:1.4">${cls.desc}</div>
      <div class="class-bonus-list">
        ${b.dmgMult>1?`<div>⚔️ <span>+${Math.round((b.dmgMult-1)*100)}%</span></div>`:''}
        ${b.xpMult>1?`<div>⚡ <span>+${Math.round((b.xpMult-1)*100)}%</span></div>`:''}
        ${b.goldMult>1?`<div>🪙 <span>+${Math.round((b.goldMult-1)*100)}%</span></div>`:''}
        ${b.crMult>1?`<div>💎 <span>+${Math.round((b.crMult-1)*100)}%</span></div>`:''}
        ${b.hpBonus>0?`<div>❤️ <span>+${b.hpBonus} HP</span></div>`:''}
        ${b.streakBonus?`<div>🔥 <span>+${Math.round(b.streakBonus*100)}%</span></div>`:''}
      </div>
      <div style="margin-top:8px;text-align:center;font-family:'Cinzel',serif;font-size:8px;letter-spacing:.1em;color:${isActive?cls.color:'var(--text3)'}">
        ${isActive?'✓ ATIVA · CLIQUE PARA VER':'Clique para detalhes'}
      </div>
    </div>`;
  }).join('');
}

// ═══════════════════════════════════════════════════════════════
// DoT (Damage over Time) SYSTEM
// ═══════════════════════════════════════════════════════════════
function applyDotToState(fxType, label, emoji, color, extraDmg, turns){
  if(!S.activeDots) S.activeDots = [];
  // Stack or refresh existing dot of same type
  const existing = S.activeDots.find(d=>d.type===fxType);
  if(existing){ existing.turns = Math.max(existing.turns, turns); return; }
  S.activeDots.push({ type:fxType, label, emoji, color, dmg:extraDmg, turns });
}

function processDots(){
  if(!S.activeDots || !S.activeDots.length) return;
  if(S.boss.def){ S.activeDots=[]; renderDotDisplay(); return; }
  const toRemove=[];
  S.activeDots.forEach((dot,i)=>{
    const bonus = Math.max(1, Math.floor(dot.dmg * (1+eqPow()/100)));
    S.boss.hp = Math.max(0, S.boss.hp - bonus);
    dot.turns--;
    bLog(`<span style="color:${dot.color}">${dot.emoji} ${dot.label} (DoT): ${bonus} dano! (${dot.turns} turno${dot.turns!==1?'s':''} restante${dot.turns!==1?'s':''})</span>`);
    animDotHit(bonus);
    if(dot.turns<=0) toRemove.push(i);
  });
  toRemove.reverse().forEach(i=>S.activeDots.splice(i,1));
  renderDotDisplay();
}

function renderDotDisplay(){
  const el = document.getElementById('dot-display');
  if(!el) return;
  if(!S.activeDots||!S.activeDots.length){ el.style.display='none'; return; }
  el.style.display='flex';
  el.style.gap='6px';
  el.style.flexWrap='wrap';
  el.innerHTML = S.activeDots.map(d=>`
    <div class="dot-bar">
      <span class="dot-icon">${d.emoji}</span>
      <span class="dot-name">${d.label}</span>
      <span class="dot-turns">${d.turns}T</span>
    </div>`).join('');
}

// ═══════════════════════════════════════════════════════════════
// SKILL TREE SYSTEM
// ═══════════════════════════════════════════════════════════════

const SKILL_TREES = {
  warrior: [
    {id:'w1', name:'Pele de Ferro',    icon:'🛡️', row:0,col:1, cost:1, type:'passive', effect:'hp+20',     req:[],      desc:'+20 HP máximo permanente. A carne endurece como metal forjado.'},
    {id:'w2', name:'Força Bruta',      icon:'💪', row:1,col:0, cost:1, type:'passive', effect:'dmg+10',    req:['w1'],  desc:'+10% dano base em todas as missões. Músculos esculpidos pela disciplina.'},
    {id:'w3', name:'Resistência',      icon:'🏋️', row:1,col:2, cost:1, type:'passive', effect:'hp+15',     req:['w1'],  desc:'+15 HP máximo. O corpo treinado aguenta mais.'},
    {id:'w4', name:'Golpe Preciso',    icon:'⚔️', row:2,col:0, cost:2, type:'passive', effect:'dmg+20',    req:['w2'],  desc:'+20% dano. Cada golpe calculado, nenhuma energia desperdiçada.'},
    {id:'w5', name:'Muralha Viva',     icon:'🏰', row:2,col:1, cost:2, type:'passive', effect:'hp+30',     req:['w1','w3'], desc:'+30 HP máximo. Você é o último bastião entre os aliados e o caos.'},
    {id:'w6', name:'Carga Brutal',     icon:'🐂', row:2,col:2, cost:2, type:'passive', effect:'dmg+15',    req:['w3'],  desc:'+15% dano. A carga inicial esmaga qualquer defesa.'},
    {id:'w7', name:'Fúria de Batalha', icon:'🔥', row:3,col:0, cost:3, type:'passive', effect:'dmg+30',    req:['w4'],  desc:'+30% dano. A raiva canalizada se torna a arma mais afiada.'},
    {id:'w8', name:'Coração de Aço',   icon:'🖤', row:3,col:1, cost:3, type:'passive', effect:'hp+50',     req:['w5'],  desc:'+50 HP máximo. Forjado nas piores batalhas, invulnerável à fraqueza.'},
    {id:'w9', name:'Lâmina Última',    icon:'💀', row:3,col:2, cost:3, type:'passive', effect:'dmg+25xp+10',req:['w6','w7'], desc:'+25% dano e +10% XP. O guerreiro lendário aprende com cada combate.'},
  ],
  mage: [
    {id:'m1', name:'Mente Aguçada',    icon:'🧠', row:0,col:1, cost:1, type:'passive', effect:'xp+15',     req:[],      desc:'+15% XP de todas as fontes. A mente treinada absorve o conhecimento.'},
    {id:'m2', name:'Cristalomancia',   icon:'💎', row:1,col:0, cost:1, type:'passive', effect:'cr+15',     req:['m1'],  desc:'+15% cristais de todas as fontes. Transforma conhecimento em poder.'},
    {id:'m3', name:'Foco Arcano',      icon:'🔮', row:1,col:2, cost:1, type:'passive', effect:'xp+20',     req:['m1'],  desc:'+20% XP. A concentração máxima acelera o aprendizado.'},
    {id:'m4', name:'Amplificação',     icon:'⚡', row:2,col:0, cost:2, type:'passive', effect:'xp+25cr+20',req:['m2'],  desc:'+25% XP e +20% cristais. O feiticeiro que amplifica transcende limites.'},
    {id:'m5', name:'Transmutação',     icon:'⚗️', row:2,col:1, cost:2, type:'passive', effect:'cr+30',     req:['m2','m3'], desc:'+30% cristais. Converte qualquer esforço em recursos arcanos.'},
    {id:'m6', name:'Tempestade Arcana',icon:'🌩️', row:2,col:2, cost:2, type:'passive', effect:'xp+30',     req:['m3'],  desc:'+30% XP. A tempestade de magia acelera toda evolução.'},
    {id:'m7', name:'Onisciência',      icon:'🌌', row:3,col:0, cost:3, type:'passive', effect:'xp+40',     req:['m4'],  desc:'+40% XP total. O Deus Arcano vê além dos véus da realidade.'},
    {id:'m8', name:'Nexo de Cristal',  icon:'✨', row:3,col:1, cost:3, type:'passive', effect:'cr+40',     req:['m5'],  desc:'+40% cristais. O cristal pulsa em harmonia com a sua essência.'},
    {id:'m9', name:'Transcendência',   icon:'🌟', row:3,col:2, cost:3, type:'passive', effect:'xp+30cr+30',req:['m6','m7'], desc:'+30% XP e +30% cristais. A transcendência une magia e conhecimento.'},
  ],
  archer: [
    {id:'a1', name:'Olho de Falcão',   icon:'🦅', row:0,col:1, cost:1, type:'passive', effect:'gold+20',   req:[],      desc:'+20% ouro. A visão aguçada enxerga oportunidades onde outros veem nada.'},
    {id:'a2', name:'Flecha Certeira',  icon:'🎯', row:1,col:0, cost:1, type:'passive', effect:'dmg+15',    req:['a1'],  desc:'+15% dano. Cada flecha disparada é uma certeza, não uma tentativa.'},
    {id:'a3', name:'Caçador Nato',     icon:'🌲', row:1,col:2, cost:1, type:'passive', effect:'gold+25',   req:['a1'],  desc:'+25% ouro. A floresta revela seus segredos para o caçador paciente.'},
    {id:'a4', name:'Ataque Duplo',     icon:'🏹', row:2,col:0, cost:2, type:'passive', effect:'dmg+25',    req:['a2'],  desc:'+25% dano. Dois disparos onde um bastaria — eficiência pura.'},
    {id:'a5', name:'Comércio da Selva',icon:'🪙', row:2,col:1, cost:2, type:'passive', effect:'gold+35',   req:['a2','a3'], desc:'+35% ouro. A caçadora sabe o valor de cada presa abatida.'},
    {id:'a6', name:'Flechas Venenosas',icon:'☠️', row:2,col:2, cost:2, type:'passive', effect:'dmg+20gold+20',req:['a3'], desc:'+20% dano e +20% ouro. Veneno e fortuna caminham lado a lado.'},
    {id:'a7', name:'Precisão Lendária',icon:'⭐', row:3,col:0, cost:3, type:'passive', effect:'dmg+35',    req:['a4'],  desc:'+35% dano. A precisão que transcende a física — impossível falhar.'},
    {id:'a8', name:'Riqueza da Floresta',icon:'🌿',row:3,col:1,cost:3, type:'passive', effect:'gold+50',   req:['a5'],  desc:'+50% ouro. A floresta guarda suas riquezas apenas para os dignos.'},
    {id:'a9', name:'Lenda das Flechas', icon:'🌟',row:3,col:2,cost:3, type:'passive', effect:'dmg+25gold+30',req:['a6','a7'], desc:'+25% dano e +30% ouro. Nome gravado em toda árvore da floresta eterna.'},
  ],
  bard: [
    {id:'b1', name:'Melodia Básica',   icon:'🎵', row:0,col:1, cost:1, type:'passive', effect:'xp+10gold+10',req:[],   desc:'+10% XP e +10% ouro. A primeira nota de uma sinfonia épica.'},
    {id:'b2', name:'Canção de Força',  icon:'🎸', row:1,col:0, cost:1, type:'passive', effect:'dmg+15',    req:['b1'],  desc:'+15% dano. A canção de batalha infla o espírito guerreiro.'},
    {id:'b3', name:'Balada do Ouro',   icon:'🪙', row:1,col:2, cost:1, type:'passive', effect:'gold+20',   req:['b1'],  desc:'+20% ouro. Quem paga o bardo, paga o melhor.'},
    {id:'b4', name:'Hino de Batalha',  icon:'🏆', row:2,col:0, cost:2, type:'passive', effect:'dmg+20xp+15',req:['b2'], desc:'+20% dano e +15% XP. A música amplifica cada golpe e cada lição.'},
    {id:'b5', name:'Sinfonia Arcana',  icon:'🎺', row:2,col:1, cost:2, type:'passive', effect:'xp+20gold+20',req:['b2','b3'], desc:'+20% XP e +20% ouro. A harmonia perfeita entre aprendizado e recompensa.'},
    {id:'b6', name:'Balada da Riqueza',icon:'💰', row:2,col:2, cost:2, type:'passive', effect:'gold+30',   req:['b3'],  desc:'+30% ouro. A canção que abre carteiras e cofres.'},
    {id:'b7', name:'Épico Imortal',    icon:'👑', row:3,col:0, cost:3, type:'passive', effect:'dmg+25xp+20',req:['b4'], desc:'+25% dano e +20% XP. Lendas não se criam — se vivem.'},
    {id:'b8', name:'Cosmos Sonoro',    icon:'🌌', row:3,col:1, cost:3, type:'passive', effect:'xp+30gold+30',req:['b5'], desc:'+30% XP e +30% ouro. A sinfonia que ressoa por todos os planos.'},
    {id:'b9', name:'Canto do Fim',     icon:'🌟', row:3,col:2, cost:3, type:'passive', effect:'dmg+20gold+40',req:['b6','b7'], desc:'+20% dano e +40% ouro. O último canto — o mais belo de todos.'},
  ],
  cleric: [
    {id:'c1', name:'Fé Inabalável',    icon:'✝️', row:0,col:1, cost:1, type:'passive', effect:'hp+25',     req:[],      desc:'+25 HP máximo. A fé é o escudo mais resistente que existe.'},
    {id:'c2', name:'Cura Menor',       icon:'💊', row:1,col:0, cost:1, type:'passive', effect:'hp+20xp+10',req:['c1'],  desc:'+20 HP máximo e +10% XP. Sanar o corpo também educa o espírito.'},
    {id:'c3', name:'Bênção Divina',    icon:'🙏', row:1,col:2, cost:1, type:'passive', effect:'xp+20',     req:['c1'],  desc:'+20% XP. A bênção divina acelera todo aprendizado sagrado.'},
    {id:'c4', name:'Cura Maior',       icon:'💫', row:2,col:0, cost:2, type:'passive', effect:'hp+40',     req:['c2'],  desc:'+40 HP máximo. As mãos do curador tocam e a ferida some.'},
    {id:'c5', name:'Graça Sagrada',    icon:'😇', row:2,col:1, cost:2, type:'passive', effect:'hp+30xp+20',req:['c2','c3'], desc:'+30 HP e +20% XP. A graça divina nutre corpo e mente.'},
    {id:'c6', name:'Sabedoria Eterna', icon:'📖', row:2,col:2, cost:2, type:'passive', effect:'xp+30',     req:['c3'],  desc:'+30% XP. A sabedoria acumulada por séculos de devoção.'},
    {id:'c7', name:'Ressurreição',     icon:'⛪', row:3,col:0, cost:3, type:'passive', effect:'hp+60',     req:['c4'],  desc:'+60 HP máximo. O poder de se levantar infinitas vezes.'},
    {id:'c8', name:'Arcanjo',          icon:'🌟', row:3,col:1, cost:3, type:'passive', effect:'hp+40xp+30',req:['c5'],  desc:'+40 HP e +30% XP. Transcendeu a humanidade. Serve à luz eterna.'},
    {id:'c9', name:'Toque Divino',     icon:'✨', row:3,col:2, cost:3, type:'passive', effect:'xp+40hp+20',req:['c6','c7'], desc:'+40% XP e +20 HP. Cada toque sana, cada palavra instrui.'},
  ],
  druid: [
    {id:'d1', name:'Sintonia Natural', icon:'🌱', row:0,col:1, cost:1, type:'passive', effect:'hp+15dmg+10',req:[],     desc:'+15 HP e +10% dano. A natureza fortalece quem a respeita.'},
    {id:'d2', name:'Raízes Profundas', icon:'🌳', row:1,col:0, cost:1, type:'passive', effect:'hp+20',     req:['d1'],  desc:'+20 HP máximo. Enraizado como uma árvore milenar.'},
    {id:'d3', name:'Ventos da Floresta',icon:'🍃',row:1,col:2, cost:1, type:'passive', effect:'dmg+15',    req:['d1'],  desc:'+15% dano. Os ventos carregam a força de todas as criaturas.'},
    {id:'d4', name:'Pele de Urso',     icon:'🐻', row:2,col:0, cost:2, type:'passive', effect:'hp+35',     req:['d2'],  desc:'+35 HP máximo. Proteção da fera mais resistente da floresta.'},
    {id:'d5', name:'Equilíbrio',       icon:'☯️', row:2,col:1, cost:2, type:'passive', effect:'hp+20dmg+20',req:['d2','d3'], desc:'+20 HP e +20% dano. O equilíbrio entre defensiva e ataque.'},
    {id:'d6', name:'Forma Animal',     icon:'🐺', row:2,col:2, cost:2, type:'passive', effect:'dmg+30',    req:['d3'],  desc:'+30% dano. A forma animal libera o instinto mais puro.'},
    {id:'d7', name:'Espírito Ancestral',icon:'🌏',row:3,col:0, cost:3, type:'passive', effect:'hp+50',     req:['d4'],  desc:'+50 HP máximo. Guiado pelos espíritos de todos os druidas anteriores.'},
    {id:'d8', name:'Ciclo Eterno',     icon:'♻️', row:3,col:1, cost:3, type:'passive', effect:'hp+30dmg+25',req:['d5'], desc:'+30 HP e +25% dano. A vida sempre retorna. Sempre cresce.'},
    {id:'d9', name:'Voz da Terra',     icon:'🌍', row:3,col:2, cost:3, type:'passive', effect:'dmg+40',    req:['d6','d7'], desc:'+40% dano. A terra inteira fala através do druida lendário.'},
  ],
  paladin: [
    {id:'p1', name:'Juramento Sagrado',icon:'⚔️', row:0,col:1, cost:1, type:'passive', effect:'dmg+15',   req:[],      desc:'+15% dano. O juramento pronunciado diante da luz nunca quebra.'},
    {id:'p2', name:'Aura de Retidão',  icon:'🌟', row:1,col:0, cost:1, type:'passive', effect:'dmg+10hp+15',req:['p1'], desc:'+10% dano e +15 HP. A aura sagrada afasta o mal e fortalece o corpo.'},
    {id:'p3', name:'Golpe Sagrado',    icon:'✨', row:1,col:2, cost:1, type:'passive', effect:'dmg+20',    req:['p1'],  desc:'+20% dano. A luz divina amplifica cada golpe.'},
    {id:'p4', name:'Martírio',         icon:'💪', row:2,col:0, cost:2, type:'passive', effect:'dmg+25hp+20',req:['p2'], desc:'+25% dano e +20 HP. A dor vivida torna mais forte o coração.'},
    {id:'p5', name:'Escudo da Fé',     icon:'🛡️', row:2,col:1, cost:2, type:'passive', effect:'hp+40dmg+15',req:['p2','p3'], desc:'+40 HP e +15% dano. O escudo que bloqueia o mal em todas as formas.'},
    {id:'p6', name:'Julgamento',       icon:'⚖️', row:2,col:2, cost:2, type:'passive', effect:'dmg+30',    req:['p3'],  desc:'+30% dano. O julgamento divino não perdoa a fraqueza.'},
    {id:'p7', name:'Lâmina da Luz',    icon:'☀️', row:3,col:0, cost:3, type:'passive', effect:'dmg+35hp+25',req:['p4'], desc:'+35% dano e +25 HP. A lâmina que carrega a luz de mil sóis.'},
    {id:'p8', name:'Santo Imortal',    icon:'😇', row:3,col:1, cost:3, type:'passive', effect:'hp+60dmg+20',req:['p5'], desc:'+60 HP e +20% dano. Santificado pela luz — imortal na missão.'},
    {id:'p9', name:'Lâmina da Eternidade',icon:'🌌',row:3,col:2,cost:3,type:'passive', effect:'dmg+40',   req:['p6','p7'], desc:'+40% dano. A eternidade forjada em metal e fé inabalável.'},
  ],
  rogue: [
    {id:'r1', name:'Sombra',           icon:'🌑', row:0,col:1, cost:1, type:'passive', effect:'dmg+15gold+15',req:[],  desc:'+15% dano e +15% ouro. Na sombra, ninguém vê o que você leva.'},
    {id:'r2', name:'Ataque Furtivo',   icon:'🗡️', row:1,col:0, cost:1, type:'passive', effect:'dmg+20',    req:['r1'],  desc:'+20% dano. O golpe que o inimigo nunca viu chegar.'},
    {id:'r3', name:'Dedos Ágeis',      icon:'👐', row:1,col:2, cost:1, type:'passive', effect:'gold+25',   req:['r1'],  desc:'+25% ouro. Dedos treinados encontram o valor em qualquer bolso.'},
    {id:'r4', name:'Veneno Letal',     icon:'☠️', row:2,col:0, cost:2, type:'passive', effect:'dmg+30',    req:['r2'],  desc:'+30% dano. O veneno que nenhum antídoto reverte.'},
    {id:'r5', name:'Ladrão Mestre',    icon:'🎭', row:2,col:1, cost:2, type:'passive', effect:'dmg+20gold+25',req:['r2','r3'], desc:'+20% dano e +25% ouro. Arte e crime fundidos em perfeição.'},
    {id:'r6', name:'Invisibilidade',   icon:'👻', row:2,col:2, cost:2, type:'passive', effect:'gold+35',   req:['r3'],  desc:'+35% ouro. O que não existe não pode ser capturado.'},
    {id:'r7', name:'Morte Silenciosa', icon:'⚰️', row:3,col:0, cost:3, type:'passive', effect:'dmg+40',    req:['r4'],  desc:'+40% dano. O golpe que ninguém ouviu. Ninguém sobreviveu para contar.'},
    {id:'r8', name:'Phantom',          icon:'💀', row:3,col:1, cost:3, type:'passive', effect:'dmg+25gold+35',req:['r5'], desc:'+25% dano e +35% ouro. O phantom é lenda — e lendas são ricas.'},
    {id:'r9', name:'Riqueza das Sombras',icon:'🌟',row:3,col:2,cost:3, type:'passive', effect:'gold+50',  req:['r6','r7'], desc:'+50% ouro. As sombras guardam riquezas que a luz nunca verá.'},
  ],
  witch: [
    {id:'wt1', name:'Maldição Menor',  icon:'🌙', row:0,col:1, cost:1, type:'passive', effect:'xp+15cr+10',req:[],     desc:'+15% XP e +10% cristais. O primeiro feitiço sussurrado ao vento.'},
    {id:'wt2', name:'Pacto das Sombras',icon:'🕸️',row:1,col:0, cost:1, type:'passive', effect:'cr+20',    req:['wt1'], desc:'+20% cristais. Acordos feitos nas trevas rendem mais que quaisquer outros.'},
    {id:'wt3', name:'Poção de Poder',  icon:'⚗️', row:1,col:2, cost:1, type:'passive', effect:'xp+20',    req:['wt1'], desc:'+20% XP. A poção que acelera o processo de aprendizado sombrio.'},
    {id:'wt4', name:'Bruxaria Avançada',icon:'🔯',row:2,col:0, cost:2, type:'passive', effect:'cr+30xp+15',req:['wt2'],desc:'+30% cristais e +15% XP. Magia além do que os livros ensinam.'},
    {id:'wt5', name:'Olho do Caos',    icon:'👁️', row:2,col:1, cost:2, type:'passive', effect:'xp+25cr+20',req:['wt2','wt3'],desc:'+25% XP e +20% cristais. Ver o caos é controlá-lo.'},
    {id:'wt6', name:'Maldição Encadeada',icon:'⛓️',row:2,col:2,cost:2, type:'passive', effect:'xp+30',    req:['wt3'], desc:'+30% XP. A maldição que se expande e cobre tudo ao redor.'},
    {id:'wt7', name:'Bruxa Primordial',icon:'👁️‍🗨️',row:3,col:0,cost:3,type:'passive', effect:'cr+45',     req:['wt4'], desc:'+45% cristais. Poder anterior a toda civilização, anterior ao próprio tempo.'},
    {id:'wt8', name:'Caos Encarnado',  icon:'🌌', row:3,col:1, cost:3, type:'passive', effect:'xp+35cr+25',req:['wt5'],desc:'+35% XP e +25% cristais. O caos em forma pura, canalizado pela bruxa.'},
    {id:'wt9', name:'Pacto Eterno',    icon:'🌟', row:3,col:2, cost:3, type:'passive', effect:'cr+40xp+20',req:['wt6','wt7'],desc:'+40% cristais e +20% XP. O pacto que dura além da morte.'},
  ],
  amazon: [
    {id:'az1', name:'Grito de Batalha',icon:'⚡', row:0,col:1, cost:1, type:'passive', effect:'dmg+15',   req:[],      desc:'+15% dano. O grito que paralisa inimigos e libera aliados.'},
    {id:'az2', name:'Instinto de Caça',icon:'🦅', row:1,col:0, cost:1, type:'passive', effect:'dmg+20gold+10',req:['az1'],desc:'+20% dano e +10% ouro. O predador que nunca perde sua presa.'},
    {id:'az3', name:'Fúria Tribal',    icon:'🔥', row:1,col:2, cost:1, type:'passive', effect:'dmg+15hp+15',req:['az1'],desc:'+15% dano e +15 HP. A fúria da tribo correndo nas veias.'},
    {id:'az4', name:'Guerreira da Tribo',icon:'🌺',row:2,col:0,cost:2, type:'passive', effect:'dmg+30',    req:['az2'], desc:'+30% dano. Campeã incontestável da tribo, em batalha e além.'},
    {id:'az5', name:'Domínio do Campo',icon:'🌪️', row:2,col:1, cost:2, type:'passive', effect:'dmg+20hp+25',req:['az2','az3'],desc:'+20% dano e +25 HP. A amazona que controla todo campo de batalha.'},
    {id:'az6', name:'Flechas de Sangue',icon:'🩸',row:2,col:2, cost:2, type:'passive', effect:'dmg+25gold+20',req:['az3'],desc:'+25% dano e +20% ouro. Cada flecha imbuída com sangue da vitória.'},
    {id:'az7', name:'Rainha das Feras',icon:'🐯', row:3,col:0, cost:3, type:'passive', effect:'dmg+40',    req:['az4'], desc:'+40% dano. As feras da floresta se curvam diante de sua força.'},
    {id:'az8', name:'Tempestade Imortal',icon:'⚡🌩️',row:3,col:1,cost:3,type:'passive',effect:'dmg+30hp+40',req:['az5'],desc:'+30% dano e +40 HP. Imune à fraqueza, imune ao fracasso.'},
    {id:'az9', name:'Lenda Amazona',   icon:'👸', row:3,col:2, cost:3, type:'passive', effect:'dmg+35gold+35',req:['az6','az7'],desc:'+35% dano e +35% ouro. Canções cantadas por mil gerações sobre sua glória.'},
  ],
  vampire: [
    {id:'v1', name:'Sedução Sombria',  icon:'🩸', row:0,col:1, cost:1, type:'passive', effect:'dmg+15cr+10',req:[],    desc:'+15% dano e +10% cristais. O olhar que hipnotiza antes do bote.'},
    {id:'v2', name:'Drenagem Vital',   icon:'🧛‍♀️',row:1,col:0, cost:1, type:'passive', effect:'hp+20dmg+10',req:['v1'], desc:'+20 HP e +10% dano. A vida do inimigo se torna sua força.'},
    {id:'v3', name:'Toque da Morte',   icon:'💀', row:1,col:2, cost:1, type:'passive', effect:'dmg+20cr+15',req:['v1'],  desc:'+20% dano e +15% cristais. O toque que extrai mais que vida.'},
    {id:'v4', name:'Festim Eterno',    icon:'🍷', row:2,col:0, cost:2, type:'passive', effect:'hp+35dmg+15',req:['v2'],  desc:'+35 HP e +15% dano. A vampira que bebe de fontes infinitas.'},
    {id:'v5', name:'Banquete das Sombras',icon:'🌑',row:2,col:1,cost:2, type:'passive', effect:'dmg+25cr+20',req:['v2','v3'],desc:'+25% dano e +20% cristais. O banquete que dura a eternidade.'},
    {id:'v6', name:'Praga de Morcegos',icon:'🦇', row:2,col:2, cost:2, type:'passive', effect:'cr+30dmg+15',req:['v3'],  desc:'+30% cristais e +15% dano. Os morcegos servem sua rainha lealmente.'},
    {id:'v7', name:'Imortalidade',     icon:'♾️', row:3,col:0, cost:3, type:'passive', effect:'hp+60',     req:['v4'],  desc:'+60 HP máximo. A imortalidade vampírica manifestada em carne viva.'},
    {id:'v8', name:'Ancestral',        icon:'🧛‍♀️🌌',row:3,col:1,cost:3,type:'passive', effect:'dmg+35cr+25',req:['v5'],  desc:'+35% dano e +25% cristais. A vampira mais antiga. A mais poderosa.'},
    {id:'v9', name:'Sangue Eterno',    icon:'🌟', row:3,col:2, cost:3, type:'passive', effect:'cr+40hp+30',req:['v6','v7'],desc:'+40% cristais e +30 HP. O sangue que flui para sempre, eternamente.'},
  ],
  priestess: [
    {id:'pr1', name:'Graça Sagrada',   icon:'🌸', row:0,col:1, cost:1, type:'passive', effect:'hp+20xp+10',req:[],     desc:'+20 HP e +10% XP. A graça da deusa flui sobre a sacerdotisa devota.'},
    {id:'pr2', name:'Círculo de Cura', icon:'💗', row:1,col:0, cost:1, type:'passive', effect:'hp+25',     req:['pr1'], desc:'+25 HP máximo. O círculo sagrado que sana todas as feridas.'},
    {id:'pr3', name:'Sabedoria Divina',icon:'☀️', row:1,col:2, cost:1, type:'passive', effect:'xp+20cr+10',req:['pr1'], desc:'+20% XP e +10% cristais. A divindade compartilha seus segredos.'},
    {id:'pr4', name:'Bênção Total',    icon:'✨', row:2,col:0, cost:2, type:'passive', effect:'hp+40',     req:['pr2'], desc:'+40 HP máximo. A bênção mais completa que a deusa concede.'},
    {id:'pr5', name:'Orácula',         icon:'🔮', row:2,col:1, cost:2, type:'passive', effect:'hp+25xp+20',req:['pr2','pr3'],desc:'+25 HP e +20% XP. A visão divina guia cada passo com certeza.'},
    {id:'pr6', name:'Visão Etérea',    icon:'👁️', row:2,col:2, cost:2, type:'passive', effect:'xp+30cr+20',req:['pr3'], desc:'+30% XP e +20% cristais. Enxerga além do véu da realidade.'},
    {id:'pr7', name:'Deusa do Templo', icon:'👑', row:3,col:0, cost:3, type:'passive', effect:'hp+60',     req:['pr4'], desc:'+60 HP máximo. A deusa desceu ao plano mortal. O templo inteiro treme.'},
    {id:'pr8', name:'Transcendência',  icon:'🌌', row:3,col:1, cost:3, type:'passive', effect:'hp+40xp+30',req:['pr5'], desc:'+40 HP e +30% XP. Além da mortalidade. Além de qualquer limitação.'},
    {id:'pr9', name:'Luz Eterna',      icon:'🌟', row:3,col:2, cost:3, type:'passive', effect:'xp+40cr+30',req:['pr6','pr7'],desc:'+40% XP e +30% cristais. A luz que nunca se apaga, que nunca abandona.'},
  ],
  barbarian: [
    {id:'ba1', name:'Fúria Primária',  icon:'💢', row:0,col:1, cost:1, type:'passive', effect:'dmg+20',   req:[],      desc:'+20% dano. A raiva pura, sem filtro, sem controle, sem limite.'},
    {id:'ba2', name:'Sede de Sangue',  icon:'🩸', row:1,col:0, cost:1, type:'passive', effect:'dmg+25hp+10',req:['ba1'],desc:'+25% dano e +10 HP. Quanto mais sangue, mais forte o bárbaro fica.'},
    {id:'ba3', name:'Corpo Brutesco',  icon:'💪', row:1,col:2, cost:1, type:'passive', effect:'hp+25dmg+10',req:['ba1'],desc:'+25 HP e +10% dano. Um corpo forjado em sofrimento e superação.'},
    {id:'ba4', name:'Berserker',       icon:'🔥', row:2,col:0, cost:2, type:'passive', effect:'dmg+35',    req:['ba2'], desc:'+35% dano. O berserker que não para mesmo após a vitória.'},
    {id:'ba5', name:'Campeão Bárbaro', icon:'⚡', row:2,col:1, cost:2, type:'passive', effect:'dmg+25hp+30',req:['ba2','ba3'],desc:'+25% dano e +30 HP. Campeão de todas as tribos, temido por todos.'},
    {id:'ba6', name:'Montanha Viva',   icon:'🏔️', row:2,col:2, cost:2, type:'passive', effect:'hp+40',     req:['ba3'], desc:'+40 HP máximo. Inabalável como uma montanha. Imovível.'},
    {id:'ba7', name:'Senhor da Guerra',icon:'💀', row:3,col:0, cost:3, type:'passive', effect:'dmg+45',    req:['ba4'], desc:'+45% dano. O senhor da guerra que consome tudo em seu caminho.'},
    {id:'ba8', name:'Titã',            icon:'⚡💀',row:3,col:1, cost:3, type:'passive', effect:'dmg+35hp+45',req:['ba5'],desc:'+35% dano e +45 HP. O titã que faz a terra tremer com cada passo.'},
    {id:'ba9', name:'Apocalipse',      icon:'🌋', row:3,col:2, cost:3, type:'passive', effect:'dmg+50',    req:['ba6','ba7'],desc:'+50% dano. O fim de tudo, personificado em puro furor bárbaro.'},
  ],
};

// ── SKILL TREE PREFIX MAP ─────────────────────────────────────────
const SKILL_CLASS_MAP = {
  warrior:'w', mage:'m', archer:'a', bard:'b', cleric:'c', druid:'d',
  paladin:'p', rogue:'r', witch:'wt', amazon:'az', vampire:'v',
  priestess:'pr', barbarian:'ba'
};

// ── GET SKILLS FOR CURRENT CLASS ─────────────────────────────────
function getClassSkillTree(){
  const cls = S.playerClass;
  if(!cls || !SKILL_TREES[cls]) return [];
  return SKILL_TREES[cls];
}

// ── CHECK IF SKILL IS UNLOCKABLE ──────────────────────────────────
function canUnlockSkill(skill){
  if(!skill) return false;
  if((S.skillsUnlocked||[]).includes(skill.id)) return false; // already unlocked
  if((S.skillPts||0) < skill.cost) return false; // not enough points
  // Check all prerequisites are unlocked
  return skill.req.every(rid => (S.skillsUnlocked||[]).includes(rid));
}

// ── UNLOCK A SKILL ────────────────────────────────────────────────
function unlockSkill(skillId){
  const tree = getClassSkillTree();
  const skill = tree.find(s=>s.id===skillId);
  if(!skill){ notify('⚠️','Erro','Habilidade não encontrada.','nr'); return; }
  if((S.skillsUnlocked||[]).includes(skillId)){ notify('✨','Já desbloqueada!','Você já possui esta habilidade.','ng'); return; }
  if((S.skillPts||0) < skill.cost){ notify('⚠️','Pontos insuficientes',`Precisa de ${skill.cost} ponto${skill.cost>1?'s':''}.`,'nr'); return; }
  if(!skill.req.every(rid=>(S.skillsUnlocked||[]).includes(rid))){ notify('🔒','Bloqueada','Desbloqueie as habilidades anteriores primeiro.','nc'); return; }

  S.skillPts -= skill.cost;
  S.skillsUnlocked.push(skillId);
  applySkillEffect(skill);
  save();
  renderSkillTree();
  renderStatus();
  notify('✨','Habilidade Desbloqueada!',`${skill.icon} ${skill.name}! ${_skillEffectLabel(skill.effect)}`,'ng');
}

// ── APPLY SKILL PASSIVE EFFECT ────────────────────────────────────
function applySkillEffect(skill){
  const e = skill.effect;
  const parts = e.match(/([a-z]+)\+(\d+)/g)||[];
  parts.forEach(part=>{
    const [,type,val] = part.match(/([a-z]+)\+(\d+)/);
    const n = parseInt(val);
    if(type==='hp'){ S.mhp+=n; S.hp=Math.min(S.hp+n, S.mhp); }
    if(type==='dmg'){ /* applied via getSkillDmgBonus() */ }
    if(type==='xp'){  /* applied via getSkillXpBonus() */ }
    if(type==='gold'){ /* applied via getSkillGoldBonus() */ }
    if(type==='cr'){   /* applied via getSkillCrBonus() */ }
  });
}

// ── RECALCULATE SKILL HP BONUS (on load) ─────────────────────────
function recalcSkillHpBonus(){
  // Re-apply HP bonuses from unlocked skills (additive, stored in S.mhp)
  // Only add the difference if not already applied
  const tree = getClassSkillTree();
  // We don't re-apply on every load — HP bonus is stored in S.mhp already
}

// ── SKILL BONUS GETTERS ───────────────────────────────────────────
function getSkillDmgBonus(){
  const tree = getClassSkillTree();
  let bonus = 0;
  (S.skillsUnlocked||[]).forEach(id=>{
    const sk = tree.find(s=>s.id===id);
    if(!sk) return;
    const m = sk.effect.match(/dmg\+(\d+)/);
    if(m) bonus += parseInt(m[1]);
  });
  return 1 + bonus/100;
}
function getSkillXpBonus(){
  const tree = getClassSkillTree();
  let bonus = 0;
  (S.skillsUnlocked||[]).forEach(id=>{
    const sk = tree.find(s=>s.id===id);
    if(!sk) return;
    const m = sk.effect.match(/xp\+(\d+)/);
    if(m) bonus += parseInt(m[1]);
  });
  return 1 + bonus/100;
}
function getSkillGoldBonus(){
  const tree = getClassSkillTree();
  let bonus = 0;
  (S.skillsUnlocked||[]).forEach(id=>{
    const sk = tree.find(s=>s.id===id);
    if(!sk) return;
    const m = sk.effect.match(/gold\+(\d+)/);
    if(m) bonus += parseInt(m[1]);
  });
  return 1 + bonus/100;
}
function getSkillCrBonus(){
  const tree = getClassSkillTree();
  let bonus = 0;
  (S.skillsUnlocked||[]).forEach(id=>{
    const sk = tree.find(s=>s.id===id);
    if(!sk) return;
    const m = sk.effect.match(/cr\+(\d+)/);
    if(m) bonus += parseInt(m[1]);
  });
  return 1 + bonus/100;
}

// ── SKILL EFFECT LABEL HELPER ─────────────────────────────────────
function _skillEffectLabel(effect){
  const parts = effect.match(/([a-z]+)\+(\d+)/g)||[];
  return parts.map(p=>{
    const [,t,v] = p.match(/([a-z]+)\+(\d+)/);
    const labels={hp:`+${v} HP`,dmg:`+${v}% DMG`,xp:`+${v}% XP`,gold:`+${v}% Gold`,cr:`+${v}% CR`};
    return labels[t]||p;
  }).join(' · ');
}

// ── RENDER SKILL TREE ─────────────────────────────────────────────
function renderSkillTree(){
  const cont = document.getElementById('skill-tree-cont');
  const badge = document.getElementById('sk-pts-badge');
  if(badge) badge.textContent = S.skillPts||0;
  if(!cont) return;

  const cls = S.playerClass;
  if(!cls){
    cont.innerHTML=`<div style="text-align:center;padding:30px 0">
      <div style="font-size:36px;margin-bottom:8px">🔒</div>
      <div style="font-family:'Cinzel',serif;font-size:13px;color:var(--text3)">Selecione uma classe para acessar a Skill Tree</div>
    </div>`;
    return;
  }

  const tree = SKILL_TREES[cls];
  if(!tree){ cont.innerHTML='<div style="color:var(--text2);padding:10px">Skill tree não disponível para esta classe.</div>'; return; }

  const clsData = getClass();
  const clsColor = clsData?.color || '#c9a84c';

  // Count total dmg/xp/gold/cr bonuses from unlocked skills
  const totDmg  = Math.round((getSkillDmgBonus()-1)*100);
  const totXp   = Math.round((getSkillXpBonus()-1)*100);
  const totGold = Math.round((getSkillGoldBonus()-1)*100);
  const totCr   = Math.round((getSkillCrBonus()-1)*100);
  const hpBonus = (S.skillsUnlocked||[]).reduce((sum,id)=>{
    const sk=tree.find(s=>s.id===id);if(!sk)return sum;
    const m=sk.effect.match(/hp\+(\d+)/);return sum+(m?parseInt(m[1]):0);
  },0);

  const ROWS = 4, COLS = 3;
  // Map skills to grid positions
  const grid = {};
  tree.forEach(sk=>{ grid[`${sk.row}_${sk.col}`]=sk; });

  // Build SVG connection lines
  let svgLines='';
  tree.forEach(sk=>{
    sk.req.forEach(rid=>{
      const rs = tree.find(s=>s.id===rid);
      if(!rs) return;
      // Cell center: col*33% + 16.5%, row*25% + 12.5%
      const x1 = (rs.col/2)*100 + 50; // percent
      const y1 = (rs.row/3)*100 + (100/6);
      const x2 = (sk.col/2)*100 + 50;
      const y2 = (sk.row/3)*100 + (100/6);
      const unlocked = (S.skillsUnlocked||[]).includes(sk.id) && (S.skillsUnlocked||[]).includes(rid);
      const available = (S.skillsUnlocked||[]).includes(rid);
      const lineColor = unlocked ? clsColor : available ? 'rgba(201,168,76,.35)' : 'rgba(255,255,255,.08)';
      svgLines+=`<line x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%" stroke="${lineColor}" stroke-width="${unlocked?2.5:1.5}" stroke-dasharray="${unlocked?'none':'5,4'}" style="transition:stroke .4s"/>`;
    });
  });

  // Build node cells
  const cells = [];
  for(let row=0; row<ROWS; row++){
    for(let col=0; col<COLS; col++){
      const sk = grid[`${row}_${col}`];
      if(!sk){ cells.push(`<div></div>`); continue; }
      const unlocked = (S.skillsUnlocked||[]).includes(sk.id);
      const available = canUnlockSkill(sk);
      const effLabel = _skillEffectLabel(sk.effect);

      let state = 'locked';
      if(unlocked) state='unlocked';
      else if(available) state='available';

      cells.push(`
        <div class="sk-node sk-${state}" onclick="unlockSkill('${sk.id}')"
          title="${sk.name}${unlocked?' (Desbloqueada)':available?' — Clique para desbloquear':' (Bloqueada)'}">
          <div class="sk-node-inner" style="--cls-color:${clsColor}">
            <div class="sk-icon">${sk.icon}</div>
            <div class="sk-name">${sk.name}</div>
            <div class="sk-cost">${unlocked?'✓':available?`${sk.cost}pt${sk.cost>1?'s':''}`:'🔒'}</div>
          </div>
          <div class="sk-tooltip">
            <div class="sk-tip-name">${sk.icon} ${sk.name}</div>
            <div class="sk-tip-effect">${effLabel}</div>
            <div class="sk-tip-desc">${sk.desc}</div>
            ${!unlocked?`<div class="sk-tip-cost" style="color:${available?'var(--gold2)':'var(--text3)'}">Custo: ${sk.cost} ponto${sk.cost>1?'s':''} ${available?'(disponível)':'(bloqueada)'}</div>`:'<div class="sk-tip-cost" style="color:var(--green3)">✓ Desbloqueada</div>'}
          </div>
        </div>`);
    }
  }

  cont.innerHTML=`
    <div style="margin-bottom:10px">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:8px">
        <div style="font-family:'Cinzel',serif;font-size:10px;letter-spacing:.1em;color:var(--text3)">PONTOS DISPONÍVEIS</div>
        <div style="font-family:'Cinzel Decorative',serif;font-size:20px;color:${(S.skillPts||0)>0?'var(--gold3)':'var(--text2)'}">
          ${S.skillPts||0} <span style="font-size:12px;color:var(--text3)">pts</span>
        </div>
      </div>
      ${(totDmg||totXp||totGold||totCr||hpBonus)?`
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px">
        ${hpBonus?`<span class="sk-bonus-tag" style="color:var(--red3)">❤️ +${hpBonus} HP</span>`:''}
        ${totDmg?`<span class="sk-bonus-tag" style="color:var(--amber2)">⚔️ +${totDmg}% DMG</span>`:''}
        ${totXp?`<span class="sk-bonus-tag" style="color:var(--gold2)">⚡ +${totXp}% XP</span>`:''}
        ${totGold?`<span class="sk-bonus-tag" style="color:var(--gold)">🪙 +${totGold}% Gold</span>`:''}
        ${totCr?`<span class="sk-bonus-tag" style="color:var(--crystal)">💎 +${totCr}% CR</span>`:''}
      </div>`:''}
    </div>

    <div class="sk-graph-wrap">
      <svg class="sk-lines" viewBox="0 0 100 100" preserveAspectRatio="none">${svgLines}</svg>
      <div class="sk-grid">
        ${cells.join('')}
      </div>
    </div>
    <div style="margin-top:10px;font-size:9px;color:var(--text3);font-style:italic;text-align:center">Ganhe 1 ponto de habilidade por nível. Clique nos nós disponíveis para desbloquear.</div>
  `;
}

// ═══════════════════════════════════════════════════════════════
// INVENTORY SYSTEM (10 slot limit)
// ═══════════════════════════════════════════════════════════════
const INV_MAX = 10;
let selectedInvCell = null;

function getInventoryUsed(){ return (S.owned||[]).length; }
function isInventoryFull(){ return getInventoryUsed() >= INV_MAX; }

function renderInventory(){
  const grid = document.getElementById('inv-grid');
  const usedEl = document.getElementById('inv-used');
  const maxEl = document.getElementById('inv-max');
  const summary = document.getElementById('inv-power-summary');
  if(!grid) return;

  const used = getInventoryUsed();
  if(usedEl) usedEl.textContent = used;
  if(usedEl) usedEl.className = used>=INV_MAX ? 'inv-full' : '';
  if(maxEl) maxEl.textContent = INV_MAX;

  const cells = [];
  // Occupied cells
  (S.owned||[]).forEach(id=>{
    const eq = EDB.find(e=>e.id===id);
    if(!eq) return;
    const isEq = Object.values(S.eq).includes(id);
    const imgSrc = IMGS[eq.ik];
    const imgH = imgSrc ? `<img src="${imgSrc}" alt="${eq.nm}">` : '<span style="font-size:22px">⚔️</span>';
    const rColor = {common:'var(--green3)',uncommon:'var(--blue3)',rare:'var(--purple3)',epic:'var(--gold2)',legendary:'var(--red3)'}[eq.r]||'var(--text)';
    cells.push(`
      <div class="inv-cell occupied ${isEq?'equipped-cell':''}" onclick="selectInventoryItem('${id}')" title="${eq.nm}${isEq?' (Equipado)':''}">
        <div style="position:absolute;top:2px;right:2px;width:5px;height:5px;border-radius:50%;background:${rColor}"></div>
        ${isEq?'<div style="position:absolute;top:2px;left:2px;font-size:8px;color:var(--green3)">✓</div>':''}
        ${imgH}
        <div class="inv-cell-lbl">${eq.nm.split(' ')[0]}</div>
      </div>`);
  });
  // Empty cells
  for(let i=used; i<INV_MAX; i++){
    cells.push(`<div class="inv-cell"><span style="font-size:16px;opacity:.1">❓</span></div>`);
  }
  grid.innerHTML = cells.join('');

  // Power summary
  if(summary){
    const totAtk = eqAtk(), totDef = eqDef(), totPw = eqPow();
    const cls = getClass();
    summary.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:10px">
        <div style="text-align:center;background:rgba(0,0,0,.4);border:1px solid var(--border);border-radius:6px;padding:10px">
          <div style="font-family:'Cinzel',serif;font-size:9px;color:var(--red3)">ATAQUE</div>
          <div style="font-family:'Cinzel Decorative',serif;font-size:22px;color:var(--gold3)">${totAtk}</div>
        </div>
        <div style="text-align:center;background:rgba(0,0,0,.4);border:1px solid var(--border);border-radius:6px;padding:10px">
          <div style="font-family:'Cinzel',serif;font-size:9px;color:var(--blue3)">DEFESA</div>
          <div style="font-family:'Cinzel Decorative',serif;font-size:22px;color:var(--gold3)">${totDef}</div>
        </div>
        <div style="text-align:center;background:rgba(0,0,0,.4);border:1px solid var(--border);border-radius:6px;padding:10px">
          <div style="font-family:'Cinzel',serif;font-size:9px;color:var(--gold)">PODER</div>
          <div style="font-family:'Cinzel Decorative',serif;font-size:22px;color:var(--gold3)">+${totPw}%</div>
        </div>
      </div>
      ${cls?`<div style="display:flex;align-items:center;gap:8px;background:rgba(0,0,0,.3);border:1px solid var(--border);border-radius:6px;padding:8px 12px">
        <span style="font-size:20px">${cls.icon}</span>
        <div><div style="font-family:'Cinzel',serif;font-size:10px;color:${cls.color}">${cls.name} — Bônus Ativos</div>
        <div style="font-size:10px;color:var(--text2)">${cls.bonuses.dmgMult>1?`⚔️+${Math.round((cls.bonuses.dmgMult-1)*100)}% DMG `:''}${cls.bonuses.xpMult>1?`⚡+${Math.round((cls.bonuses.xpMult-1)*100)}% XP `:''}${cls.bonuses.goldMult>1?`🪙+${Math.round((cls.bonuses.goldMult-1)*100)}% Gold `:''}${cls.bonuses.crMult>1?`💎+${Math.round((cls.bonuses.crMult-1)*100)}% CR`:''}
        </div></div></div>`:'<div style="font-size:11px;color:var(--text2);font-style:italic">Nenhuma classe selecionada — vá à aba 🧙 Classe</div>'}
    `;
  }
}

function selectInventoryItem(id){
  const eq = EDB.find(e=>e.id===id); if(!eq) return;
  const inInventory = S.owned.includes(id);  // MUST be in owned
  const isEq = Object.values(S.eq).includes(id);
  const detail = document.getElementById('inv-detail');
  if(!detail) return;
  detail.style.display = 'block';

  const imgSrc = IMGS[eq.ik];
  const imgH = imgSrc ? `<img src="${imgSrc}" style="width:44px;height:44px;object-fit:contain;image-rendering:crisp-edges">` : '⚔️';
  if(eq.fx) FX_TIP_MAP[eq.id] = {
    name:  eq.fx.emoji + ' ' + eq.fx.label,
    desc:  getFxDescription(eq.fx),
    chance:'Chance: ' + Math.round(eq.fx.chance*100) + '% por missão' + (eq.fx.dot ? ' · DoT: ' + eq.fx.dotTurns + ' turnos' : ''),
    color: eq.fx.color
  };
  const fxH = eq.fx ? `<div style="margin-top:6px"><span class="fx-badge"
        style="border:1px solid ${eq.fx.color}40;color:${eq.fx.color}"
        data-fxid="${eq.id}"
        onmouseenter="showFxTip(event,this)"
        onmouseleave="hideFxTip()"
      >${eq.fx.emoji} ${eq.fx.label} <span style="color:var(--text3)">${Math.round(eq.fx.chance*100)}%</span></span></div>` : '';

  // Build action buttons — equip only allowed if confirmed in inventory
  let actionBtns = '';
  if(!inInventory){
    actionBtns = `<div style="font-size:10px;color:var(--red3);text-align:center;padding:6px">⚠ Este item não está no seu inventário.</div>`;
  } else if(isEq){
    actionBtns = `<span style="font-size:10px;color:var(--green3)">✓ Equipado atualmente</span>`;
  } else {
    actionBtns = `<button class="btn bsm bcr" onclick="equipItem('${id}');renderInventory();">⚔ Equipar</button>`;
    if(!eq.bossReward) actionBtns += `<button class="btn bsm bred" onclick="sellItem('${id}');renderInventory();">🪙 Vender</button>`;
  }

  detail.innerHTML = `
    <div style="display:flex;gap:10px;align-items:flex-start">
      ${imgH}
      <div style="flex:1">
        <div style="font-family:'Cinzel',serif;font-size:13px;color:var(--gold2);margin-bottom:2px">${eq.nm}</div>
        <div style="font-size:10px;color:var(--text2);margin-bottom:5px">${eq.desc}</div>
        <div style="font-size:10px;color:var(--text2)">⚔ ATK +${eq.atk} · 🛡 DEF +${eq.def} · 💥 Poder +${eq.pw}%</div>
        ${fxH}
      </div>
    </div>
    <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap">
      ${actionBtns}
      <button class="btn bsm" onclick="document.getElementById('inv-detail').style.display='none'">✕</button>
    </div>`;
}

// ═══════════════════════════════════════════════════════════════
// CRAFTING SYSTEM
// ═══════════════════════════════════════════════════════════════
let craftSlots = {a:null, b:null};

const RECIPES = [
  // special recipes
  {id:'r1', a:'w2', b:'n15', result:'craft_stormstaff', name:'Cajado da Tempestade Arcana', icon:'🌪️',
    desc:'Cajado do Aprendiz + Varinha da Tempestade = Cajado que dispara raios e golpes duplos.'},
  {id:'r2', a:'e0', b:'w1', result:'craft_bloodblade', name:'Espada de Sangue Cursado', icon:'🩸',
    desc:'Espada Enferrujada + Faca de Osso = Uma lâmina que sangra e envenena simultaneamente.'},
  {id:'r3', a:'n4', b:'e2', result:'craft_mirrorshield', name:'Escudo do Espelho de Runas', icon:'🪞',
    desc:'Broquel + Escudo de Madeira = Escudo com reflexo rúnico e high block.'},
  {id:'r4', a:'e3', b:'e4', result:'craft_swifthelm', name:'Elmo do Vento Veloz', icon:'💨',
    desc:'Capuz + Sandálias = Combinados em um Elmo que concede velocidade e foco.'},
  {id:'r5', a:'w14', b:'e9', result:'craft_godshammer', name:'Martelo do Deus da Guerra', icon:'⚡',
    desc:'Martelo Consagrado + Mjolnir = O martelo definitivo, com dano sagrado e raio.'},
];

// Craft items database extension (added at runtime)
const CRAFT_EDB = [
  {id:'craft_stormstaff', nm:'Cajado da Tempestade Arcana', slot:'weapon', ik:'icon_staff2', r:'epic',
   atk:38, def:10, pw:24, price:195, desc:'Criado por combinação: dispara raios e ataca duas vezes.',
   fx:{type:'lightning',chance:.45,label:'Tempestade + Golpe Duplo',emoji:'⛈️',color:'#f1c40f',dmgMult:2.2},
   isCrafted:true},
  {id:'craft_bloodblade', nm:'Espada de Sangue Cursado', slot:'weapon', ik:'icon_swordblood', r:'uncommon',
   atk:18, def:2, pw:9, price:48, desc:'Criada por combinação: sangra e envenena simultaneamente.',
   fx:{type:'bleed',chance:.4,label:'Sangue & Veneno',emoji:'🩸',color:'#8e2222',extraDmg:12,dot:true,dotTurns:3},
   isCrafted:true},
  {id:'craft_mirrorshield', nm:'Escudo do Espelho de Runas', slot:'offhand', ik:'icon_shield2', r:'uncommon',
   atk:0, def:22, pw:10, price:45, desc:'Criado por combinação: reflete golpes com energia rúnica.',
   fx:{type:'thorns',chance:.35,label:'Reflexo Rúnico',emoji:'🪞',color:'#5dade2',extraDmg:10},
   isCrafted:true},
  {id:'craft_swifthelm', nm:'Elmo do Vento Veloz', slot:'head', ik:'icon_helmet', r:'uncommon',
   atk:4, def:8, pw:7, price:40, desc:'Criado por combinação: velocidade e foco absolutos.',
   fx:{type:'swift',chance:.3,label:'Vento & Foco',emoji:'💨',color:'#3498db',dmgMult:1.6},
   isCrafted:true},
  {id:'craft_godshammer', nm:'Martelo do Deus da Guerra', slot:'weapon', ik:'icon_hammerheavy', r:'legendary',
   atk:58, def:12, pw:34, price:480, desc:'Criado por combinação: o martelo definitivo dos deuses.',
   fx:{type:'lightning',chance:.5,label:'Divino Trovão',emoji:'⚡',color:'#f1c40f',dmgMult:3.2},
   isCrafted:true},
];
// Push craft items into EDB at startup
CRAFT_EDB.forEach(item=>{ if(!EDB.find(e=>e.id===item.id)) EDB.push(item); });

function openCraftSlot(which){
  const avail = (S.owned||[])
    .map(id=>EDB.find(e=>e.id===id))
    .filter(eq=>eq && !eq.bossReward && !eq.isCrafted && !Object.values(S.eq).includes(eq.id))
    .filter(eq=>which==='a'?eq.id!==craftSlots.b:eq.id!==craftSlots.a);

  if(!avail.length){ notify('🎒','Inventário','Sem itens disponíveis para combinar.','nc'); return; }

  const ro={common:0,uncommon:1,rare:2,epic:3,legendary:4};
  const rm={common:'Comum',uncommon:'Incomum',rare:'Raro',epic:'Épico',legendary:'Lendário'};
  avail.sort((a,b)=>ro[a.r]-ro[b.r]);

  showMo(`Selecionar Item ${which.toUpperCase()}`, null,
    `<div style="max-height:300px;overflow-y:auto">${avail.map(eq=>{
      const imgSrc=IMGS[eq.ik]; const imgH=imgSrc?`<img src="${imgSrc}" style="width:32px;height:32px;object-fit:contain">` :'⚔️';
      return `<div onclick="setCraftSlot('${which}','${eq.id}');closeMo();" style="display:flex;align-items:center;gap:8px;padding:7px 10px;background:rgba(0,0,0,.4);border:1px solid rgba(255,255,255,.06);border-radius:6px;margin-bottom:5px;cursor:pointer;transition:border-color .2s" onmouseover="this.style.borderColor='var(--border2)'" onmouseout="this.style.borderColor='rgba(255,255,255,.06)'">${imgH}<div style="flex:1"><div style="font-family:'Cinzel',serif;font-size:11px">${eq.nm}</div><div style="font-size:10px;color:var(--text2)">${rm[eq.r]} · ATK+${eq.atk} DEF+${eq.def} PWR+${eq.pw}%</div></div></div>`;
    }).join('')}</div>`, []
  );
}

function setCraftSlot(which, id){
  craftSlots[which] = id;
  updateCraftUI();
}

function clearCraft(){
  craftSlots={a:null,b:null};
  updateCraftUI();
}

function updateCraftUI(){
  ['a','b'].forEach(sl=>{
    const el=document.getElementById(`craft-slot-${sl}`);
    const cnt=document.getElementById(`craft-slot-${sl}-content`);
    if(!el||!cnt) return;
    const id=craftSlots[sl];
    if(id){
      const eq=EDB.find(e=>e.id===id);
      const imgSrc=eq?IMGS[eq.ik]:null;
      const imgH=imgSrc?`<img src="${imgSrc}" style="width:40px;height:40px;object-fit:contain;image-rendering:crisp-edges">`:'⚔️';
      cnt.innerHTML=`${imgH}<div style="font-size:9px;color:var(--gold2);margin-top:3px;text-align:center">${eq?.nm||'?'}</div>`;
      el.classList.add('filled');
    } else {
      cnt.innerHTML='<span style="font-size:24px;opacity:.3">➕</span>';
      el.classList.remove('filled');
    }
  });

  const result=document.getElementById('craft-result');
  const btn=document.getElementById('craft-btn');
  const msg=document.getElementById('craft-msg');

  if(!craftSlots.a||!craftSlots.b){
    if(result) result.innerHTML='<span style="font-size:28px;opacity:.2">⚔️</span><div style="font-size:10px;color:var(--text3);margin-top:4px">Selecione 2 itens</div>';
    if(btn){ btn.disabled=true; btn.style.opacity='.4'; }
    if(msg) msg.textContent='';
    return;
  }

  const recipe = findRecipe(craftSlots.a, craftSlots.b);
  if(recipe){
    const ri = EDB.find(e=>e.id===recipe.result)||CRAFT_EDB.find(e=>e.id===recipe.result);
    if(result && ri){
      const imgSrc=IMGS[ri.ik];
      const imgH=imgSrc?`<img src="${imgSrc}" style="width:44px;height:44px;object-fit:contain;image-rendering:crisp-edges">`:'⚔️';
      result.innerHTML=`${imgH}<div style="font-family:'Cinzel',serif;font-size:10px;color:var(--gold2);margin-top:4px">${ri.nm}</div>`;
    }
    if(btn){ btn.disabled=false; btn.style.opacity='1'; }
    if(msg) msg.innerHTML=`<span style="color:var(--green3)">✓ Receita encontrada: ${recipe.name}</span>`;
  } else {
    const eqA=EDB.find(e=>e.id===craftSlots.a), eqB=EDB.find(e=>e.id===craftSlots.b);
    if(eqA&&eqB&&eqA.r===eqB.r){
      // Generic same-rarity craft
      if(result) result.innerHTML=`<span style="font-size:18px">⚗️</span><div style="font-size:9px;color:var(--gold2);margin-top:4px">Fusão Genérica</div>`;
      if(btn){ btn.disabled=false; btn.style.opacity='1'; }
      if(msg) msg.innerHTML=`<span style="color:var(--amber2)">⚠️ Fusão genérica — cria item aprimorado da raridade seguinte</span>`;
    } else {
      if(result) result.innerHTML='<span style="font-size:24px">❌</span><div style="font-size:10px;color:var(--red3);margin-top:4px">Incompatível</div>';
      if(btn){ btn.disabled=true; btn.style.opacity='.4'; }
      if(msg) msg.innerHTML='<span style="color:var(--red3)">Itens incompatíveis. Use raridades iguais ou siga uma receita.</span>';
    }
  }
}

function findRecipe(idA, idB){
  return RECIPES.find(r=>(r.a===idA&&r.b===idB)||(r.a===idB&&r.b===idA));
}

function doCraft(){
  const idA=craftSlots.a, idB=craftSlots.b;
  if(!idA||!idB) return;
  const eqA=EDB.find(e=>e.id===idA), eqB=EDB.find(e=>e.id===idB);
  if(!eqA||!eqB) return;

  const recipe=findRecipe(idA,idB);
  if(recipe){
    const existing=EDB.find(e=>e.id===recipe.result);
    if(S.owned.includes(recipe.result)){ notify('⚗️','Já criado!','Você já possui este item.','nc'); return; }
    // Consume source items
    S.owned=S.owned.filter(id=>id!==idA&&id!==idB);
    Object.keys(S.eq).forEach(sl=>{ if(S.eq[sl]===idA||S.eq[sl]===idB) S.eq[sl]=null; });
    // Add crafted item
    if(!EDB.find(e=>e.id===recipe.result)) EDB.push(CRAFT_EDB.find(e=>e.id===recipe.result));
    S.owned.push(recipe.result);
    S.eq[existing?.slot||EDB.find(e=>e.id===recipe.result)?.slot] = recipe.result;
    save(); clearCraft(); renderAll();
    notify('⚗️','Item Criado!',`${recipe.name} forjado com sucesso!`,'ng');
  } else {
    // Generic fusion: same rarity → upgrade
    const rarities=['common','uncommon','rare','epic','legendary'];
    const nextR=rarities[Math.min(rarities.indexOf(eqA.r)+1,rarities.length-1)];
    const poolNext=EDB.filter(e=>e.r===nextR&&e.slot===eqA.slot&&!S.owned.includes(e.id)&&!e.bossReward&&!e.isCrafted);
    if(!poolNext.length){ notify('⚗️','Sem resultado','Não há itens superiores neste slot para gerar.','nc'); return; }
    const result=poolNext[Math.floor(Math.random()*poolNext.length)];
    S.owned=S.owned.filter(id=>id!==idA&&id!==idB);
    Object.keys(S.eq).forEach(sl=>{ if(S.eq[sl]===idA||S.eq[sl]===idB) S.eq[sl]=null; });
    S.owned.push(result.id);
    S.eq[result.slot]=result.id;
    save(); clearCraft(); renderAll();
    notify('⚗️','Fusão!',`${eqA.nm} + ${eqB.nm} → ${result.nm}!`,'nc');
  }
}

function renderCrafting(){
  const list=document.getElementById('recipe-list'); if(!list) return;
  const rm={common:'Comum',uncommon:'Incomum',rare:'Raro',epic:'Épico',legendary:'Lendário'};
  list.innerHTML=RECIPES.map(r=>{
    const hasA=S.owned.includes(r.a), hasB=S.owned.includes(r.b);
    const canCraft=hasA&&hasB&&!S.owned.includes(r.result);
    const alreadyMade=S.owned.includes(r.result);
    const ri=EDB.find(e=>e.id===r.result)||CRAFT_EDB.find(e=>e.id===r.result);
    const eqA=EDB.find(e=>e.id===r.a), eqB=EDB.find(e=>e.id===r.b);
    return `<div class="recipe-card ${canCraft?'can-craft':''}" onclick="${canCraft?`setCraftSlot('a','${r.a}');setCraftSlot('b','${r.b}')`:''}" title="${canCraft?'Clique para usar esta receita':''}">
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
        <span style="font-size:16px">${r.icon}</span>
        <span style="font-family:'Cinzel',serif;font-size:11px;color:var(--gold2)">${r.name}</span>
        ${alreadyMade?'<span class="recipe-tag" style="background:rgba(39,174,96,.2);color:var(--green3);border:1px solid rgba(39,174,96,.3)">✓ Criado</span>':canCraft?'<span class="recipe-tag" style="background:rgba(0,212,255,.1);color:var(--crystal);border:1px solid rgba(0,212,255,.25)">Disponível</span>':''}
      </div>
      <div style="font-size:10px;color:var(--text2);margin-bottom:5px">${r.desc}</div>
      <div style="font-size:9px;color:var(--text3)">
        ${eqA?`<span style="${hasA?'color:var(--green3)':'color:var(--red3)'}">${hasA?'✓':'✗'} ${eqA.nm}</span>`:''}
        <span style="color:var(--text3)"> + </span>
        ${eqB?`<span style="${hasB?'color:var(--green3)':'color:var(--red3)'}">${hasB?'✓':'✗'} ${eqB.nm}</span>`:''}
      </div>
    </div>`;
  }).join('');
}

// ═══════════════════════════════════════════════════════════════
// TOOLTIP HELPER
// ═══════════════════════════════════════════════════════════════
const FX_DESCRIPTIONS = {
  bleed:'Causa dano imediato e aplica Sangramento (DoT). DoT = Damage over Time: o inimigo continua perdendo HP a cada missão completada pelos turnos restantes.',
  fire:'Aplica dano de Fogo imediato e ignição (DoT). DoT = o inimigo fica em chamas e perde HP nas próximas missões até o efeito cessar.',
  ice:'Projétil de gelo que causa dano extra e congela o inimigo, reduzindo sua eficiência.',
  lightning:'Dispara um raio que causa dano massivo multiplicado. Pode encadear com outros alvos.',
  poison:'Envenena o inimigo. O veneno é um DoT (Damage over Time): causa dano a cada missão completada pelos turnos definidos, independente de outros ataques.',
  shadow:'Ataque sombrio que causa dano massivo. Ignora parte da defesa do inimigo.',
  holy:'Luz divina que causa dano amplificado. Extra efetivo contra criaturas das trevas.',
  lifesteal:'Drena a vida do inimigo, convertendo parte do dano causado em HP para você.',
  stun:'Golpe que atordoa o inimigo, impedindo seu contra-ataque por um momento.',
  earthquake:'Abala o chão ao redor, causando dano de área amplificado.',
  thorns:'Reflete parte do dano recebido de volta ao atacante.',
  double_strike:'Golpeia duas vezes seguidas. O segundo ataque replica o dano do primeiro.',
  multishot:'Dispara múltiplas flechas/projéteis simultaneamente, causando dano extra.',
  triple_element:'Conjura fogo, gelo e raio simultaneamente num ataque devastador triplo.',
  swift:'Movimento ágil que aumenta a efetividade do próximo golpe.',
  focus:'Concentração total que amplifica o dano do próximo ataque.',
  tough:'Resistência que absorve parte do dano e ocasionalmente contra-ataca.',
  block:'Bloqueia completamente um ataque, impedindo qualquer dano.',
  fire_resist:'Reduz o dano recebido de ataques de fogo.',
};
function getFxDescription(fx){ return FX_DESCRIPTIONS[fx.type] || 'Efeito especial ativado por chance em cada missão.'; }

// ═══════════════════════════════════════════════════════════════
// HABIT TYPE SYSTEM (daily / weekly / unique)
// ═══════════════════════════════════════════════════════════════
function getHabitTypeLabel(tp){
  if(tp==='weekly') return '<span class="habit-type-badge badge-weekly">📆 Semanal</span>';
  if(tp==='unique') return '<span class="habit-type-badge badge-unique">⭐ Única</span>';
  return '<span class="habit-type-badge badge-daily">📅 Diária</span>';
}
function isHabitAvailable(h){
  if(!h.tp||h.tp==='daily') return true;
  if(h.tp==='unique') return !h.completed;
  if(h.tp==='weekly'){
    // Available if not done in the current week (uses WS() as key)
    return h.weekDone!==WS();
  }
  return true;
}

// PWA SETUP
function setupPWA(){
  const manifest={
    name:'Life RPG — Guerreiro Visionário',short_name:'Life RPG',
    description:'Transforme seus hábitos em aventura épica',
    start_url:'.',display:'standalone',
    background_color:'#07060d',theme_color:'#07060d',
    icons:[
      {src:"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%2307060d' rx='20'/><text y='.9em' font-size='80'>⚔️</text></svg>",
       sizes:'192x192',type:'image/svg+xml'},
      {src:"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%2307060d' rx='20'/><text y='.9em' font-size='80'>⚔️</text></svg>",
       sizes:'512x512',type:'image/svg+xml'},
    ]
  };
  const blob=new Blob([JSON.stringify(manifest)],{type:'application/manifest+json'});
  const url=URL.createObjectURL(blob);
  document.getElementById('pwa-manifest').href=url;
  if('serviceWorker' in navigator){
    const sw=`
      const CACHE='life-rpg-v11';
      const ASSETS=['/'];
      self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
      self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));
      self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k))))));
    `;
    const swBlob=new Blob([sw],{type:'application/javascript'});
    navigator.serviceWorker.register(URL.createObjectURL(swBlob)).catch(()=>{});
  }
}

// ═══════════════════════════════════════════════════════════════
// END NEW SYSTEMS
// ═══════════════════════════════════════════════════════════════


// ═══════════════════════════════════════════════════════════════
// PROFILE SYSTEM
// ═══════════════════════════════════════════════════════════════
function saveProfile(){
  const name = (document.getElementById('prof-name')?.value||'').trim()||'Herói';
  const age  = document.getElementById('prof-age')?.value||'';
  const sex  = document.getElementById('prof-sex')?.value||'';
  const weight = document.getElementById('prof-weight')?.value||'';
  const height = document.getElementById('prof-height')?.value||'';
  S.profile = {name,age,sex,weight,height};
  save(); renderAll();
  notify('👤','Perfil Salvo!',`Bem-vindo, ${name}!`,'ng');
}
function previewProfileName(val){
  const el = document.getElementById('hs-hero-name');
  if(el) el.textContent = val.trim()||'Herói';
}
function renderProfile(){
  const p = S.profile || {};
  const setVal = (id,v)=>{ const el=document.getElementById(id); if(el) el.value=v||''; };
  setVal('prof-name', p.name==='Herói'?'':p.name);
  setVal('prof-age', p.age);
  setVal('prof-sex', p.sex);
  setVal('prof-weight', p.weight);
  setVal('prof-height', p.height);
  const profImg = document.getElementById('prof-av-img');
  const profPh  = document.getElementById('prof-av-ph');
  if(profImg && profPh && S.avData){
    profImg.src=S.avData; profImg.style.display='block'; profPh.style.display='none';
  } else if(profImg && profPh){
    profImg.style.display='none'; profPh.style.display='flex';
  }
  const sum = document.getElementById('profile-summary');
  if(!sum) return;
  const rows = [
    ['⚔','Nome',p.name||'—'],
    ['🎂','Idade',p.age?`${p.age} anos`:'—'],
    ['⚧','Sexo',p.sex||'—'],
    ['⚖','Peso',p.weight?`${p.weight} kg`:'—'],
    ['📏','Altura',p.height?`${p.height} cm`:'—'],
  ];
  sum.innerHTML = rows.map(([ic,lb,val])=>`
    <div style="display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid rgba(255,255,255,.04)">
      <span style="font-size:16px;width:20px;text-align:center">${ic}</span>
      <span style="font-family:'Cinzel',serif;font-size:9px;letter-spacing:.08em;color:var(--text3);flex:1">${lb}</span>
      <span style="font-size:12px;color:var(--gold2)">${val}</span>
    </div>`).join('');
}
// ═══════════════════════════════════════════════════════════════
// END PROFILE SYSTEM
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// NAVIGATION SYSTEM — Bottom Bar + Category Pills
// ═══════════════════════════════════════════════════════════════
const NAV_CATS = {
  main:  { label:'🏰 Visão Geral', tabs:[
    {p:'dash',    icon:'🏰', label:'Painel'},
  ]},
  hero:  { label:'⚔️ Herói', tabs:[
    {p:'char',      icon:'🧙', label:'Personagem'},
    {p:'profile',   icon:'👤', label:'Perfil'},
    {p:'habits',    icon:'⚔️', label:'Missões'},
    {p:'dark',      icon:'💀', label:'Vícios'},
    {p:'attrs',     icon:'📊', label:'Atributos'},
    {p:'classe',    icon:'🏅', label:'Classe'},
    {p:'skilltree', icon:'✨', label:'Habilidades'},
    {p:'potions',   icon:'⚗️', label:'Poções'},
    {p:'calendar',  icon:'📅', label:'Calendário'},
  ]},
  combat:{ label:'🐉 Combate', tabs:[
    {p:'boss',    icon:'🐉', label:'Boss'},
    {p:'events',  icon:'👹', label:'Eventos'},
    {p:'arena',   icon:'⚔️', label:'Arena'},
  ]},
  forge: { label:'🔨 Arsenal', tabs:[
    {p:'smithy',    icon:'🔨', label:'Ferreiro'},
    {p:'inventory', icon:'🎒', label:'Inventário'},
    {p:'crafting',  icon:'⚗️', label:'Crafting'},
    {p:'tavern',    icon:'🍺', label:'Taberna'},
  ]},
  world: { label:'🗺️ Mundo', tabs:[
    {p:'quests',     icon:'🗺️', label:'Quests'},
    {p:'shop',       icon:'🏪', label:'Loja'},
    {p:'prog',       icon:'📈', label:'Progresso'},
    {p:'guilds',     icon:'🏰', label:'Guilda'},
    {p:'hallherois', icon:'🏛', label:'Hall'},
  ]},
};

let currentCat = 'main';

function switchCat(cat){
  const wasAlready = currentCat === cat;
  currentCat = cat;
  document.querySelectorAll('.nav-cat').forEach(el=>{
    el.classList.toggle('active', el.dataset.cat===cat);
  });
  // Passa skipActivateFirst=true quando já estava na categoria
  // para não sobrescrever a aba que o usuário acabou de clicar
  renderSubtabs(cat, wasAlready);
  if(!wasAlready){
    const first = NAV_CATS[cat]?.tabs[0];
    if(first) swT(first.p);
  }
  const lbl = document.getElementById('cat-label-text');
  if(lbl) lbl.textContent = NAV_CATS[cat]?.label || '';
}

function renderSubtabs(cat, skipActivateFirst){
  const wrap = document.getElementById('subtabs');
  if(!wrap) return;
  const tabs = NAV_CATS[cat]?.tabs || [];
  const subtabWrap = document.getElementById('subtab-wrap');
  if(tabs.length <= 1){
    if(subtabWrap) subtabWrap.style.display = 'none';
    return;
  }
  if(subtabWrap) subtabWrap.style.display = 'block';
  wrap.innerHTML = tabs.map(t=>`
    <div class="subtab" data-p="${t.p}" onclick="swT('${t.p}');setActiveSubtab('${t.p}')">
      ${t.icon} ${t.label}
    </div>`).join('');
  // Só ativa a primeira aba se não for uma reconstrução pós-clique
  if(!skipActivateFirst){
    const first = tabs[0];
    if(first) setActiveSubtab(first.p);
  }
}

function setActiveSubtab(p){
  document.querySelectorAll('.subtab').forEach(el=>{
    el.classList.toggle('active', el.dataset.p===p);
  });
  // Renders específicos só para abas chamadas diretamente (não via swT)
  if(p==='skilltree')  renderSkillTree();
  if(p==='hallherois') renderHall();
}

// ═══════════════════════════════════════════════════════════════
// RENDER POTIONS PAGE
// ═══════════════════════════════════════════════════════════════
function renderPotions(){
  const cont=document.getElementById('pot-cont'); if(!cont) return;
  if(typeof POTION_DB==='undefined'){ cont.innerHTML='<div style="color:var(--text3)">Sistema de poções carregando...</div>'; return; }

  cleanExpiredPotions();
  const now=Date.now();
  const rarLabel={common:'COMUM',rare:'RARA',epic:'ÉPICA',legendary:'LENDÁRIA'};
  const rarColor={common:'var(--text2)',rare:'#4fc3f7',epic:'#ce93d8',legendary:'#ffca28'};

  // ── Active potions banner
  let activeBanner='';
  if(S.activePotions&&S.activePotions.length){
    const tags=S.activePotions.map(ap=>{
      const pot=getPot(ap.id);if(!pot) return '';
      let timeStr='';
      if(ap.expiresAt){ const rem=Math.max(0,ap.expiresAt-now); const h=Math.floor(rem/3600000); const m=Math.floor((rem%3600000)/60000); timeStr=`${h}h${m}m`; }
      if(ap.usesLeft!==undefined) timeStr=`${ap.usesLeft} uso${ap.usesLeft!==1?'s':''}`;
      return `<div style="display:flex;align-items:center;gap:8px;background:rgba(0,0,0,.4);border:1px solid ${pot.color};border-radius:8px;padding:6px 10px">
        <img src="${pot.img}" style="width:28px;height:28px;object-fit:contain">
        <div>
          <div style="font-family:'Cinzel',serif;font-size:10px;color:${pot.color}">${pot.nm}</div>
          <div style="font-size:9px;color:var(--text3)">${timeStr?'⏱ '+timeStr:''}</div>
        </div>
      </div>`;
    }).join('');
    activeBanner=`<div class="card mb12" style="border-color:rgba(201,168,76,.3)">
      <div class="ct" style="color:var(--gold2)">⚡ Poções Ativas</div>
      <div style="display:flex;flex-wrap:wrap;gap:8px">${tags}</div>
    </div>`;
  }

  // ── Inventory
  const invKeys=Object.keys(S.potionInv||{}).filter(k=>(S.potionInv[k]||0)>0);
  let invHtml='';
  if(invKeys.length){
    invHtml=`<div class="card mb12" style="border-color:rgba(0,212,255,.2)">
      <div class="ct" style="color:var(--crystal)">🎒 Seu Inventário</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:10px">
        ${invKeys.map(id=>{
          const pot=getPot(id);if(!pot)return'';
          const cnt=S.potionInv[id];
          return `<div class="pot-card" style="--pot-color:${pot.color}" onclick="usePotion('${id}')">
            <div class="pot-img-wrap"><img src="${pot.img}" class="pot-img"><div class="pot-cnt">${cnt}</div></div>
            <div class="pot-nm">${pot.nm}</div>
            <div class="pot-desc">${pot.desc}</div>
            <div class="pot-use-btn">⚗️ Usar</div>
          </div>`;
        }).join('')}
      </div>
    </div>`;
  }

  // ── Shop
  const shopCards=POTION_DB.map(pot=>{
    const owned=S.potionInv?.[pot.id]||0;
    const canBuy=S.gold>=pot.cost;
    return `<div class="pot-card" style="--pot-color:${pot.color}">
      <div class="pot-img-wrap">
        <img src="${pot.img}" class="pot-img">
        ${owned?`<div class="pot-cnt">${owned}</div>`:''}
      </div>
      <div style="display:inline-block;font-family:'Cinzel',serif;font-size:7px;letter-spacing:.08em;color:${rarColor[pot.rarity]||'var(--text3)'};background:rgba(0,0,0,.5);border:1px solid ${rarColor[pot.rarity]};border-radius:8px;padding:1px 6px;margin-bottom:4px">${rarLabel[pot.rarity]}</div>
      <div class="pot-nm">${pot.nm}</div>
      <div class="pot-desc">${pot.desc}</div>
      <button class="pot-buy-btn" style="--pot-color:${pot.color};opacity:${canBuy?1:.45};cursor:${canBuy?'pointer':'not-allowed'}"
        onclick="${canBuy?`buyPotion('${pot.id}')`:'void(0)'}">
        🪙 ${pot.cost} ouro
      </button>
    </div>`;
  }).join('');

  cont.innerHTML=`
    ${activeBanner}
    ${invHtml}
    <div class="card">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;flex-wrap:wrap;gap:8px">
        <div>
          <div class="ct" style="margin-bottom:2px">🏪 Alquimista</div>
          <div style="font-size:10px;color:var(--text3);font-style:italic">Poções poderosas para turbinar sua jornada</div>
        </div>
        <div style="font-family:'Cinzel Decorative',serif;font-size:16px;color:var(--gold2)">🪙 ${S.gold}</div>
      </div>
      <div style="font-size:10px;color:var(--text3);margin-bottom:12px;background:rgba(201,168,76,.05);border:1px solid rgba(201,168,76,.15);border-radius:6px;padding:8px 10px">
        🎲 Poções também podem ser obtidas ao derrotar Bosses (40% de chance de drop)
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:10px">
        ${shopCards}
      </div>
    </div>`;
}
// ═══════════════════════════════════════════════════════════════
// END RENDER POTIONS
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// ELITE ITEMS — Smithy integration patch
// ═══════════════════════════════════════════════════════════════

// Intercept smithy filter to support 'elite' category
function patchSmithyEliteFilter(){
  const flt = document.getElementById('sm-flt');
  if(!flt || flt._elitePatchDone) return;
  flt._elitePatchDone = true;

  flt.addEventListener('click', e=>{
    const btn = e.target.closest('.sf-btn');
    if(!btn) return;
    const sc = btn.dataset.sc;
    if(sc !== 'elite') return;

    // Mark active
    flt.querySelectorAll('.sf-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');

    // Render elite-only items
    renderEliteSmithyGrid();
    e.stopImmediatePropagation();
  }, true);
}

function renderEliteSmithyGrid(){
  const grid = document.getElementById('sm-grid');
  if(!grid || typeof ELITE_ITEMS==='undefined') return;

  const SLOT_LABEL = {weapon:'⚔ Arma',armor:'🛡 Armadura',head:'⛑ Cabeça',
    feet:'👢 Pés',legs:'🩲 Pernas',hands:'🧤 Mãos',offhand:'🛡 Off-Hand'};

  grid.innerHTML = ELITE_ITEMS.map(item=>{
    const owned = S.owned.includes(item.id);
    const equipped = Object.values(S.eq||{}).includes(item.id);
    const canBuy = S.cr >= item.price;
    const imgSrc = (typeof ELITE_IMGS!=='undefined') ? ELITE_IMGS[item.ik] : '';

    const tierCls = item.tier==='epic' ? 'tier-epic' : 'tier-elite';
    const tierLabel = item.tier==='epic' ? '⚡ ÉPICO' : '🔸 ELITE';
    const elemBadge = item.element && item.element!=='none'
      ? `<span class="elem-badge" style="color:${item.elemColor||'#fff'};border:1px solid ${item.elemColor||'#fff'}33">
           ${item.elemEmoji} ${item.element.charAt(0).toUpperCase()+item.element.slice(1)} +${item.elemBonus}%
         </span>` : '';

    return `<div class="sm-item ${tierCls}" style="cursor:pointer" onclick="${owned?`equipItem('${item.id}')`:`forgeEliteItem('${item.id}')`}">
      <div style="position:relative;width:52px;height:52px;margin:0 auto 6px">
        ${imgSrc?`<img src="${imgSrc}" style="width:52px;height:52px;object-fit:contain;filter:drop-shadow(0 2px 8px rgba(0,0,0,.7))">`:
          `<span style="font-size:28px">⚔️</span>`}
        ${equipped?`<div style="position:absolute;top:-3px;right:-3px;background:var(--green3);border-radius:50%;width:14px;height:14px;display:flex;align-items:center;justify-content:center;font-size:8px">✓</div>`:''}
      </div>
      <div style="text-align:center">
        <div class="elite-badge ${tierCls}">${tierLabel}</div>
        <div style="font-family:'Cinzel',serif;font-size:9px;color:${item.tier==='epic'?'#ffd700':'#ff9f6b'};line-height:1.3;margin-bottom:2px">${item.nm}</div>
        <div style="font-size:8px;color:var(--text3);margin-bottom:3px">${SLOT_LABEL[item.slot]||item.slot}</div>
        ${elemBadge}
        <div style="display:flex;justify-content:center;gap:6px;margin:4px 0;flex-wrap:wrap">
          ${item.pw?`<span style="font-size:8px;color:var(--gold2)">⚡${item.pw}%</span>`:''}
          ${item.atk?`<span style="font-size:8px;color:var(--red3)">⚔${item.atk}</span>`:''}
          ${item.def?`<span style="font-size:8px;color:var(--blue3)">🛡${item.def}</span>`:''}
        </div>
        <div style="font-family:'Cinzel',serif;font-size:9px;color:${canBuy||owned?'var(--crystal)':'var(--text3)'};margin-top:3px">
          ${owned ? (equipped?'<span style="color:var(--green3)">Equipado</span>':'<span style="color:var(--green2)">✓ Usar</span>') : `💎 ${item.price}`}
        </div>
        ${!owned&&!canBuy?`<div style="font-size:7px;color:var(--red3);margin-top:1px">Precisa ${item.price-S.cr} 💎</div>`:''}
      </div>
    </div>`;
  }).join('');

  // Ensure own items in owned list is visible in el
  document.getElementById('sm-own') && renderOwnedElite();
}

function forgeEliteItem(id){
  const item = (typeof ELITE_ITEMS!=='undefined') ? ELITE_ITEMS.find(i=>i.id===id) : null;
  if(!item) return;
  if(S.owned.includes(id)){ equipItem(id); return; }
  if(S.cr < item.price){
    notify('💎','Cristais insuficientes',`Precisa de ${item.price}💎. Você tem ${S.cr}💎.`,'nc'); return;
  }
  confMo(`Forjar <strong>${item.nm}</strong>?`,
    `Custo: <strong style="color:var(--crystal)">${item.price}💎</strong><br>
     <em style="font-size:10px;color:var(--text3)">${item.lore||''}</em><br><br>
     Você tem ${S.cr}💎.`,
    ()=>{
      S.cr -= item.price;
      S.owned.push(id);
      S.eq[item.slot] = id;
      save(); renderEliteSmithyGrid(); renderStatus();
      notify('⚡',`${item.nm} forjado!`,`Equipado automaticamente! +${item.pw}% poder.`,'ng');
    }
  );
}

function renderOwnedElite(){
  // Add elite owned items to the existing owned section
  const own = document.getElementById('sm-own');
  if(!own||typeof ELITE_ITEMS==='undefined') return;
  const eliteOwned = ELITE_ITEMS.filter(i=>S.owned.includes(i.id));
  if(!eliteOwned.length) return;
  const existing = own.innerHTML;
  const eliteSection = `<div style="margin-top:8px;border-top:1px solid rgba(255,107,53,.2);padding-top:8px">
    <div style="font-family:'Cinzel',serif;font-size:8px;color:#ff9f6b;letter-spacing:.1em;margin-bottom:6px">⚡ ITENS ELITE</div>
    ${eliteOwned.map(i=>`<div style="display:flex;align-items:center;gap:8px;padding:4px 0">
      <img src="${ELITE_IMGS[i.ik]||''}" style="width:24px;height:24px;object-fit:contain">
      <span style="font-size:10px;color:${i.tier==='epic'?'#ffd700':'#ff9f6b'}">${i.nm}</span>
      ${i.elemEmoji?`<span style="font-size:9px;color:${i.elemColor}">${i.elemEmoji}</span>`:''}
    </div>`).join('')}
  </div>`;
  own.innerHTML = existing + eliteSection;
}

// Hook: patch smithy after each renderAll
const _origRenderAll = typeof renderAll==='function' ? renderAll : null;
document.addEventListener('DOMContentLoaded',()=>{
  patchSmithyEliteFilter();
  // Also add elite badge to normal items when rendered
});

// ═══════════════════════════════════════════════════════════════
// END ELITE SMITHY
// ═══════════════════════════════════════════════════════════════

const HALL_FIELDS_HERO = ['hf-who','hf-challenges','hf-food','hf-sleep','hf-train','hf-external','hf-prepare'];
const HALL_FIELDS_ME   = ['mf-influence','mf-challenges','mf-food','mf-sleep','mf-train','mf-external','mf-prepare'];

function saveHall(){
  if(!S.hall) S.hall = {};
  HALL_FIELDS_HERO.forEach(id=>{
    const el=document.getElementById(id);
    if(el) S.hall[id]=el.value;
  });
  HALL_FIELDS_ME.forEach(id=>{
    const el=document.getElementById(id);
    if(el) S.hall[id]=el.value;
  });
  save();
}

function renderHall(){
  // Load saved text values
  if(S.hall){
    [...HALL_FIELDS_HERO,...HALL_FIELDS_ME].forEach(id=>{
      const el=document.getElementById(id);
      if(el && S.hall[id]!==undefined){ el.value=S.hall[id]; autoResizeTA(el); }
    });
  }

  // Idol photo
  const idolImg = document.getElementById('idol-av-img');
  const idolPh  = document.getElementById('idol-av-ph');
  const idolEd  = document.getElementById('idol-av-ed');
  if(idolImg && S.hall?.idolImg){
    idolImg.src=S.hall.idolImg; idolImg.style.display='block';
    if(idolPh) idolPh.style.display='none';
    if(idolEd) idolEd.style.display='block';
  }

  // Hero name from hf-who (first line)
  const nameEl = document.getElementById('idol-name-display');
  if(nameEl && S.hall?.['hf-who']){
    const firstLine = S.hall['hf-who'].split('\n')[0].substring(0,40);
    nameEl.textContent = firstLine || '';
  }

  // Player photo (mirror from profile avatar)
  const meImg = document.getElementById('hall-me-img');
  const mePh  = document.getElementById('hall-me-ph');
  if(meImg && mePh){
    if(S.avData){
      meImg.src=S.avData; meImg.style.display='block'; mePh.style.display='none';
    } else {
      meImg.style.display='none'; mePh.style.display='flex';
    }
  }

  // Player name
  const meNameEl = document.getElementById('hall-me-name');
  if(meNameEl) meNameEl.textContent = S.profile?.name || 'Herói';
}

function handleIdolAv(e){
  const f=e.target.files[0]; if(!f) return;
  const r=new FileReader();
  r.onload=ev=>{
    if(!S.hall) S.hall={};
    S.hall.idolImg=ev.target.result;
    save();
    renderHall();
    notify('🌟','Foto do Ídolo!','Seu herói foi adicionado ao Hall!','ng');
  };
  r.readAsDataURL(f);
}

function autoResizeTA(el){
  el.style.height='auto';
  el.style.height=(el.scrollHeight)+'px';
}

// ═══════════════════════════════════════════════════════════════
// END HALL DOS HERÓIS
// ═══════════════════════════════════════════════════════════════

// Alert badge on events tab when event active
function updateNavAlerts(){
  const combatCat = document.querySelector('[data-cat="combat"]');
  if(combatCat) combatCat.classList.toggle('has-alert', !!S.activeEv);
}

// ═══════════════════════════════════════════════════════════════
// END NAVIGATION SYSTEM
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// GLOBAL FX TOOLTIP SYSTEM
// ═══════════════════════════════════════════════════════════════
function showFxTip(event, el){
  const tip = document.getElementById('fx-global-tip');
  if(!tip) return;

  const fxid = el.dataset.fxid || '';
  const data = FX_TIP_MAP[fxid] || {};
  const name   = data.name   || el.textContent.trim();
  const desc   = data.desc   || '';
  const chance = data.chance || '';
  const color  = data.color  || 'var(--gold)';

  document.getElementById('fgt-name').innerHTML   = `<span style="color:${color}">${name}</span>`;
  document.getElementById('fgt-desc').textContent  = desc;
  document.getElementById('fgt-chance').textContent = chance;
  tip.style.borderColor = color + '80';

  // Show tip so offsetHeight works
  tip.style.display = 'block';
  tip.style.opacity = '0';
  tip.classList.remove('visible');

  const TW = 240, TH = tip.offsetHeight || 120;
  const VW = window.innerWidth, VH = window.innerHeight;
  const rect = el.getBoundingClientRect();

  // Horizontal: centre over badge, clamp to viewport
  let left = rect.left + rect.width / 2 - TW / 2;
  left = Math.max(8, Math.min(left, VW - TW - 8));

  // Vertical: prefer above, fallback below
  let top, cls;
  if(rect.top - TH - 12 >= 8){
    top = rect.top - TH - 12;
    cls = 'tip-above';
  } else {
    top = rect.bottom + 12;
    cls = 'tip-below';
  }

  tip.className = cls;
  tip.style.left = left + 'px';
  tip.style.top  = top  + 'px';

  // Reposition arrow to match actual horizontal offset
  const arrowLeft = (rect.left + rect.width/2) - left;
  tip.style.setProperty('--arrow-left', arrowLeft + 'px');
  tip.querySelector('::after'); // trigger reflow
  const after = tip.style; // arrow handled via ::after in CSS

  requestAnimationFrame(()=>tip.classList.add('visible'));
}

function hideFxTip(){
  const tip = document.getElementById('fx-global-tip');
  if(!tip) return;
  tip.classList.remove('visible');
  setTimeout(()=>{ if(!tip.classList.contains('visible')) tip.style.display='none'; }, 180);
}

// Also hide on scroll (smithy panel scrolls)
window.addEventListener('scroll', hideFxTip, true);
// ═══════════════════════════════════════════════════════════════
// END GLOBAL FX TOOLTIP
// ═══════════════════════════════════════════════════════════════


// ═══════════════════════════════════════════════════════════════
// ITEM DETAIL MODAL
// ═══════════════════════════════════════════════════════════════
function openItemDetail(id){
  const eq = EDB.find(e=>e.id===id);
  if(!eq) return;

  const own   = S.owned.includes(id);
  const isEq  = Object.values(S.eq).includes(id);
  const isBoss= eq.bossReward===true;
  const rm    = {common:'Comum',uncommon:'Incomum',rare:'Raro',epic:'Épico',legendary:'Lendário'};
  const rc    = {common:'#27ae60',uncommon:'#3498db',rare:'#8e44ad',epic:'#e67e22',legendary:'#c9a84c'};
  const sn    = ({weapon:'Arma',offhand:'Escudo/Offhand',head:'Capacete',armor:'Armadura',legs:'Perneiras',feet:'Botas',hands:'Mãos/Anel'})[eq.slot]||eq.slot;
  const imgSrc= IMGS[eq.ik];
  const imgH  = imgSrc ? `<img src="${imgSrc}" style="width:64px;height:64px;object-fit:contain;image-rendering:crisp-edges;filter:drop-shadow(0 2px 12px rgba(0,0,0,.9))">` : '<span style="font-size:40px">⚔️</span>';

  // FX block
  let fxBlock = '';
  if(eq.fx){
    const fx = eq.fx;
    const dotInfo = fx.dot
      ? `<div style="margin-top:6px;background:rgba(192,57,43,.1);border:1px solid rgba(192,57,43,.25);border-radius:5px;padding:7px 10px">
          <div style="font-family:'Cinzel',serif;font-size:9px;color:#e74c3c;letter-spacing:.1em;margin-bottom:3px">⏳ DANO POR TEMPO (DoT)</div>
          <div style="font-size:10px;color:var(--text2);line-height:1.6">Este efeito aplica <strong style="color:#e74c3c">DoT (Damage over Time)</strong>: após proc, o inimigo continua perdendo HP a cada missão completada, durante <strong style="color:var(--gold2)">${fx.dotTurns}</strong> turno${fx.dotTurns!==1?'s':''} adiciona${fx.dotTurns!==1?'is':'l'}. O dano do DoT é calculado sobre o dano base do hit inicial.</div>
        </div>`
      : '';
    fxBlock = `
      <div style="background:rgba(0,0,0,.4);border:1px solid ${fx.color}30;border-radius:6px;padding:10px 12px;margin-top:10px">
        <div style="font-family:'Cinzel',serif;font-size:9px;letter-spacing:.12em;color:var(--text3);margin-bottom:7px">⚡ EFEITO ESPECIAL</div>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
          <span style="font-size:20px">${fx.emoji}</span>
          <div>
            <div style="font-family:'Cinzel',serif;font-size:12px;color:${fx.color}">${fx.label}</div>
            <div style="font-size:9px;color:var(--text3)">Chance de ativar: <strong style="color:${fx.color}">${Math.round(fx.chance*100)}%</strong> por missão</div>
          </div>
        </div>
        <div style="font-size:11px;color:var(--text2);line-height:1.6">${getFxDescription(fx)}</div>
        ${dotInfo}
      </div>`;
  }

  // Stats block
  const statsBlock = `
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-top:10px">
      <div style="text-align:center;background:rgba(0,0,0,.4);border:1px solid rgba(231,76,60,.2);border-radius:5px;padding:8px 4px">
        <div style="font-size:9px;color:var(--red3);font-family:'Cinzel',serif">ATK</div>
        <div style="font-family:'Cinzel Decorative',serif;font-size:18px;color:var(--gold3)">+${eq.atk}</div>
      </div>
      <div style="text-align:center;background:rgba(0,0,0,.4);border:1px solid rgba(52,152,219,.2);border-radius:5px;padding:8px 4px">
        <div style="font-size:9px;color:#3498db;font-family:'Cinzel',serif">DEF</div>
        <div style="font-family:'Cinzel Decorative',serif;font-size:18px;color:var(--gold3)">+${eq.def}</div>
      </div>
      <div style="text-align:center;background:rgba(0,0,0,.4);border:1px solid rgba(201,168,76,.2);border-radius:5px;padding:8px 4px">
        <div style="font-size:9px;color:var(--gold);font-family:'Cinzel',serif">PODER</div>
        <div style="font-family:'Cinzel Decorative',serif;font-size:18px;color:var(--gold3)">+${eq.pw}%</div>
      </div>
    </div>`;

  // Action button — ONLY show Equipar if item is in inventory (S.owned)
  let actionBtn = '';
  if(isBoss && !own){
    const boss = BOSSES[eq.bossIdx||0];
    actionBtn = `<div style="margin-top:12px;text-align:center;background:rgba(0,0,0,.3);border:1px solid rgba(192,57,43,.2);border-radius:6px;padding:10px">
      <div style="font-size:11px;color:var(--text2);font-style:italic">🐉 Derrote <strong style="color:var(--red3)">${boss?.nm||'o Boss'}</strong> para desbloquear</div>
    </div>`;
  } else if(own && isEq){
    actionBtn = `<div style="margin-top:12px;text-align:center;background:rgba(39,174,96,.08);border:1px solid rgba(39,174,96,.3);border-radius:6px;padding:10px;font-size:11px;color:var(--green3)">✓ Equipado atualmente</div>`;
  } else if(own){
    // Item is in inventory — show Equip button
    actionBtn = `<button class="btn" onclick="equipItem('${id}');swT('char');closeMo()" style="width:100%;margin-top:12px">⚔ Equipar</button>`;
  } else if(eq.isCrafted){
    // Crafted item not owned — must craft, cannot buy
    actionBtn = `<div style="margin-top:12px;background:rgba(0,212,255,.06);border:1px solid rgba(0,212,255,.25);border-radius:6px;padding:12px;text-align:center">
      <div style="font-size:14px;margin-bottom:4px">⚗️</div>
      <div style="font-family:'Cinzel',serif;font-size:10px;color:var(--crystal);margin-bottom:4px">Item de Crafting Exclusivo</div>
      <div style="font-size:10px;color:var(--text2);margin-bottom:8px">Este item só pode ser obtido combinando ingredientes na Mesa de Combinação.</div>
      <button class="btn bsm" onclick="swT('crafting');closeMo()" style="border-color:var(--crystal);color:var(--crystal)">⚗️ Ir para Crafting</button>
    </div>`;
  } else if(!isBoss){
    // Normal item — can be purchased
    const cant = S.cr < eq.price;
    const full = isInventoryFull();
    actionBtn = `<button class="btn bcr" onclick="buyEquip('${id}');closeMo()" style="width:100%;margin-top:12px" ${cant||full?'disabled style="width:100%;margin-top:12px;opacity:.5"':''}>
      ${full?'🎒 Inventário Cheio':cant?`💎 ${S.cr}/${eq.price} — Cristais insuficientes`:`⚗️ Forjar por ${eq.price} 💎`}
    </button>`;
  }

  showMo(null, null, `
    <div style="text-align:center;margin-bottom:10px">
      ${imgH}
      <div style="font-family:'Cinzel Decorative',serif;font-size:16px;color:var(--gold3);margin:8px 0 2px;line-height:1.2">${eq.nm}</div>
      <div style="display:flex;align-items:center;justify-content:center;gap:6px">
        <span style="font-family:'Cinzel',serif;font-size:9px;padding:2px 8px;border-radius:10px;background:${rc[eq.r]}22;color:${rc[eq.r]};border:1px solid ${rc[eq.r]}44">${rm[eq.r]}</span>
        <span style="font-size:10px;color:var(--text3)">${sn}</span>
      </div>
    </div>
    <div style="font-size:12px;color:var(--text2);text-align:center;font-style:italic;margin-bottom:8px;line-height:1.5">"${eq.desc}"</div>
    ${statsBlock}
    ${fxBlock}
    ${actionBtn}
  `, []);
}
// ═══════════════════════════════════════════════════════════════
// END ITEM DETAIL MODAL
// ═══════════════════════════════════════════════════════════════




// ═══════════════════════════════════════════════════════════════
// GUILD SYSTEM
// ═══════════════════════════════════════════════════════════════
const GUILDS = [
  {
    id:'g_warrior',
    name:'Guilda do Guerreiro',
    icon:'⚔️', color:'#e74c3c',
    tagline:'Forje o Corpo. Domine a Mente. Conquiste o Campo.',
    desc:'A Guilda do Guerreiro foi fundada nas ruínas de uma batalha que durou cem anos. Seus membros são aqueles que escolheram transformar o corpo em arma — não por ódio, mas por disciplina inabalável. Cada treino é um juramento renovado. Cada noite de sono reparador é uma batalha vencida. Cada gole de água é o ritual de um soldado que conhece o valor da preparação.',
    lore:'Diz a lenda que o primeiro Mestre da Guilda carregou uma espada de 40kg por 40 dias sem descanso para provar seu valor. Ao terminar, cravou a espada no chão e disse: "O maior inimigo sempre foi a própria fraqueza." Desde então, os Guerreiros usam como símbolo uma espada fincada — nunca apontada para o inimigo, sempre apontada para o chão, lembrando que a batalha mais dura é interna.',
    attrs:['vit'],
    ranks:[
      {pts:0,   label:'Recruta',    icon:'🥋', pct:0,
       bonus:'Sem bônus. Inicie missões de Vitalidade para subir de rank.',
       active:'Nenhum bônus ativo ainda.'},
      {pts:10,  label:'Escudeiro',  icon:'🛡️', pct:5,
       bonus:'+5% de dano base em todas as missões.',
       active:'+5% DMG em todas as missões'},
      {pts:25,  label:'Soldado',    icon:'⚔️', pct:10,
       bonus:'+10% de dano + missões de Vitalidade curam 2 HP ao completar.',
       active:'+10% DMG · Vida +2 HP/missão física'},
      {pts:50,  label:'Veterano',   icon:'🏹', pct:15,
       bonus:'+15% de dano + HP máximo permanente +15.',
       active:'+15% DMG · HP máx +15'},
      {pts:100, label:'Campeão',    icon:'🗡️', pct:25,
       bonus:'+25% de dano + missões físicas dão +10% gold.',
       active:'+25% DMG · +10% Gold físico'},
      {pts:200, label:'Lendário',   icon:'👑', pct:35,
       bonus:'+35% de dano total + cada missão física tem 10% de causar dano duplo ao Boss.',
       active:'+35% DMG · 10% Golpe Duplo físico'},
    ],
    habits:['Treino / Academia','Dormir 7h+','Beber 3L de água','Mobilidade / Alongamento'],
  },
  {
    id:'g_scholar',
    name:'Guilda do Sábio',
    icon:'📖', color:'#8e44ad',
    tagline:'O Conhecimento É a Magia Mais Poderosa.',
    desc:'A Guilda do Sábio existe desde os tempos em que magos perceberam que os feitiços mais devastadores não vinham de grimórios raros, mas de mentes treinadas. Seus membros acreditam que cada página lida, cada pensamento registrado, cada momento de silêncio contemplativo é um feitiço em preparação. A mente é o laboratório. A sabedoria, o ingrediente.',
    lore:'O Arquimago fundador deixou uma única frase gravada na porta da Guilda: "A memória é imortal. Enquanto você aprender, nada pode te matar de verdade." Conta-se que ele leu 10.000 livros antes de lançar seu primeiro feitiço. Quando finalmente o fez, ele reescreveu as leis da realidade. Os Sábios usam como símbolo um livro aberto com uma chama dentro — porque o conhecimento ilumina, mas também pode queimar.',
    attrs:['men','sab'],
    ranks:[
      {pts:0,   label:'Aprendiz',   icon:'📚', pct:0,
       bonus:'Sem bônus. Complete missões de Mente e Sabedoria para evoluir.',
       active:'Nenhum bônus ativo ainda.'},
      {pts:10,  label:'Estudante',  icon:'🧪', pct:10,
       bonus:'+10% XP de todas as fontes.',
       active:'+10% XP'},
      {pts:25,  label:'Erudito',    icon:'🧠', pct:20,
       bonus:'+20% XP + missões de Sabedoria/Mente geram +1 cristal bônus.',
       active:'+20% XP · +1 cristal/missão mental'},
      {pts:50,  label:'Mago',       icon:'🔮', pct:30,
       bonus:'+30% XP + efeitos mágicos (lightning/shadow/holy/ice) causam +20% dano.',
       active:'+30% XP · Efeitos mágicos +20%'},
      {pts:100, label:'Arquimago',  icon:'⚗️', pct:40,
       bonus:'+40% XP + cada level up gera +3 cristais automaticamente.',
       active:'+40% XP · +3 CR por level up'},
      {pts:200, label:'Oráculo',    icon:'🌌', pct:55,
       bonus:'+55% XP total. Missões mentais têm 15% de gerar cristais duplos.',
       active:'+55% XP · 15% cristais duplos'},
    ],
    habits:['Meditação','Journaling / Diário','Leitura 30min'],
  },
  {
    id:'g_merchant',
    name:'Guilda do Mercador',
    icon:'🪙', color:'#f39c12',
    tagline:'Toda Disciplina Tem Seu Preço. E Seu Recompensa.',
    desc:'A Guilda do Mercador nasceu da crença de que riqueza não é sorte — é consequência. Cada hábito saudável é um investimento que rende juros. Cada dia de consistência acumula capital. Seus membros tratam a vida como um negócio e sabem que a moeda mais valiosa é o tempo bem aproveitado. Eles não acumulam ouro por ganância. Acumulam por disciplina.',
    lore:'A fundadora foi uma comerciante que perdeu tudo em uma crise econômica. Em vez de desistir, ela criou um diário de hábitos e o seguiu por 500 dias sem falhar um único. Ao fim, era mais rica do que antes. Ela atribuiu o sucesso não à sorte, mas à consistência. "Toda manhã que você acorda e segue seu ritual, você faz um depósito no banco do destino. Um dia, ele paga tudo de volta com juros."',
    attrs:['ene','car'],
    ranks:[
      {pts:0,   label:'Ambulante',  icon:'🎒', pct:0,
       bonus:'Sem bônus. Complete missões de Energia e Carisma para crescer.',
       active:'Nenhum bônus ativo ainda.'},
      {pts:10,  label:'Vendedor',   icon:'🛒', pct:10,
       bonus:'+10% gold de todas as fontes.',
       active:'+10% Gold'},
      {pts:25,  label:'Comerciante',icon:'💰', pct:20,
       bonus:'+20% gold + cada quest aceita dá +1 cristal bônus ao completar.',
       active:'+20% Gold · +1 CR por quest'},
      {pts:50,  label:'Magnata',    icon:'🏦', pct:30,
       bonus:'+30% gold + itens vendidos na Taberna valem +20% mais.',
       active:'+30% Gold · Venda +20%'},
      {pts:100, label:'Barão',      icon:'💎', pct:45,
       bonus:'+45% gold + cristais ganhos em bosses dobram.',
       active:'+45% Gold · Cristais de boss ×2'},
      {pts:200, label:'Imperador',  icon:'👑', pct:60,
       bonus:'+60% gold total. Missões de Carisma geram gold extra igual ao nível atual.',
       active:'+60% Gold · Carisma gera +NV gold'},
    ],
    habits:['Seguir a Dieta','Beber 3L de água'],
  },
  {
    id:'g_shadow',
    name:'Guilda das Sombras',
    icon:'🌑', color:'#7f8c8d',
    tagline:'Nas Sombras, a Fraqueza Não Encontra Onde Pousar.',
    desc:'A Guilda das Sombras é a mais misteriosa e a mais antiga. Seus membros acreditam que a verdadeira força não está no que você faz, mas no que você resiste. Não fazer o que é fácil. Não ceder ao vício. Não dar à fraqueza nenhuma brecha. Eles operam nas margens — silenciosos, disciplinados, invisíveis para o caos que afeta outros.',
    lore:'Ninguém sabe quem fundou a Guilda das Sombras. Há apenas um texto fragmentado, encontrado em uma cripta selada: "O maior poder é a contenção. A chama que você não acende nunca precisa ser apagada. O vício que você não inicia nunca precisa ser vencido. Seja a sombra que não projeta. Seja o silêncio que não precisa falar." Os membros da Guilda usam como símbolo uma lua crescente sobre um campo vazio.',
    attrs:['dis'],
    ranks:[
      {pts:0,   label:'Anônimo',    icon:'🕶️', pct:0,
       bonus:'Sem bônus. Fortaleça sua Disciplina para emergir das sombras.',
       active:'Nenhum bônus ativo ainda.'},
      {pts:10,  label:'Iniciado',   icon:'🗡️', pct:5,
       bonus:'Vícios causam -5% menos dano recebido.',
       active:'Dano de vícios -5%'},
      {pts:25,  label:'Infiltrador',icon:'🥷', pct:15,
       bonus:'Vícios causam -15% dano + efeitos shadow e poison do equipamento +20%.',
       active:'Dano de vícios -15% · Shadow/Poison +20%'},
      {pts:50,  label:'Assassino',  icon:'🌑', pct:25,
       bonus:'-25% dano de vícios + 10% chance de negar completamente qualquer penalidade.',
       active:'Dano de vícios -25% · 10% Negação'},
      {pts:100, label:'Fantasma',   icon:'👻', pct:35,
       bonus:'-35% dano de vícios + ataques furtivos do Ladino têm chance dobrada.',
       active:'Dano de vícios -35% · Furtivo ×2'},
      {pts:200, label:'Sombra Eterna',icon:'💀', pct:50,
       bonus:'Vícios nunca causam mais de 3 HP. 20% chance de converter penalidade em XP.',
       active:'Vícios max 3 HP · 20% penalidade → XP'},
    ],
    habits:['Journaling / Diário','Meditação','Seguir a Dieta'],
  },
];

// ── GUILD STATE HELPERS ───────────────────────────────────────────
function getActiveGuild(){
  if(!S.activeGuild) return null;
  return GUILDS.find(g=>g.id===S.activeGuild)||null;
}
function setActiveGuild(id){
  S.activeGuild = id;
  save(); renderGuilds();
  const g = GUILDS.find(x=>x.id===id);
  if(g) notify(g.icon,'Guilda Ativa!',`${g.name} — bônus ativados!`,'ng');
}
function leaveGuild(){
  S.activeGuild = null;
  save(); renderGuilds();
  notify('🏰','Sem Guilda','Você saiu da guilda. Escolha uma nova a qualquer momento.','nc');
}

function getGuildPoints(g){
  return (S.habits||[])
    .filter(h=>g.attrs.includes(h.at))
    .reduce((sum,h)=>sum+(h.td||0),0);
}
function getGuildRank(g){
  const pts = getGuildPoints(g);
  let rank = g.ranks[0];
  for(const r of g.ranks) if(pts>=r.pts) rank=r;
  return rank;
}
function getGuildRankIdx(g){
  const pts = getGuildPoints(g);
  let idx=0;
  g.ranks.forEach((r,i)=>{ if(pts>=r.pts) idx=i; });
  return idx;
}

// ── GUILD BONUS GETTERS (only active guild applies) ───────────────
function getGuildDmgBonus(){
  const g=getActiveGuild(); if(!g||g.id!=='g_warrior') return 1;
  const r=getGuildRank(g); return 1+(r.pct/100);
}
function getGuildXpBonus(){
  const g=getActiveGuild(); if(!g||g.id!=='g_scholar') return 1;
  const r=getGuildRank(g); return 1+(r.pct/100);
}
function getGuildGoldBonus(){
  const g=getActiveGuild(); if(!g||g.id!=='g_merchant') return 1;
  const r=getGuildRank(g); return 1+(r.pct/100);
}
function getGuildViceDmgMult(){
  // Shadow guild reduces damage from vices
  const g=getActiveGuild(); if(!g||g.id!=='g_shadow') return 1;
  const r=getGuildRank(g);
  return Math.max(0.01, 1-(r.pct/100));
}

// ── OPEN GUILD DETAIL MODAL ───────────────────────────────────────
function openGuildDetail(id){
  const g=GUILDS.find(x=>x.id===id); if(!g) return;
  const pts=getGuildPoints(g);
  const rankIdx=getGuildRankIdx(g);
  const curRank=g.ranks[rankIdx];
  const nextRank=g.ranks[rankIdx+1]||null;
  const isActive=S.activeGuild===g.id;

  const ranksHtml = g.ranks.slice(1).map((r,i)=>{
    const realIdx=i+1;
    const unlocked=pts>=r.pts;
    const isCur=realIdx===rankIdx;
    return `<div style="display:flex;gap:10px;align-items:flex-start;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.05);opacity:${unlocked?1:.45}">
      <div style="flex-shrink:0;width:34px;height:34px;border-radius:50%;
        border:2px solid ${unlocked?g.color:'rgba(255,255,255,.1)'};
        background:${unlocked?g.color+'22':'rgba(0,0,0,.3)'};
        display:flex;align-items:center;justify-content:center;font-size:16px;
        position:relative">
        ${r.icon}
        ${isCur?`<div style="position:absolute;top:-3px;right:-3px;width:9px;height:9px;border-radius:50%;background:${g.color};border:2px solid var(--bg2)"></div>`:''}
      </div>
      <div style="flex:1">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:3px;flex-wrap:wrap">
          <span style="font-family:'Cinzel',serif;font-size:11px;color:${unlocked?g.color:'var(--text3)'}">${r.label}</span>
          <span style="font-size:8px;padding:1px 6px;border-radius:8px;
            background:${unlocked?g.color+'22':'rgba(0,0,0,.3)'};
            color:${unlocked?g.color:'var(--text3)'};
            border:1px solid ${unlocked?g.color+'44':'rgba(255,255,255,.06)'}">
            ${r.pts} pts${isCur?' · ATUAL':unlocked?' · ✓':''}
          </span>
          <span style="font-family:'Cinzel',serif;font-size:9px;color:${unlocked?'#2ecc71':'var(--text3)'}">+${r.pct}%</span>
        </div>
        <div style="font-size:10px;color:var(--text2);line-height:1.5">${r.bonus}</div>
      </div>
    </div>`;
  }).join('');

  const progressBar = nextRank
    ? `<div style="margin:10px 0">
        <div style="display:flex;justify-content:space-between;font-size:9px;color:var(--text3);margin-bottom:4px">
          <span>${curRank.icon} ${curRank.label} → ${nextRank.icon} ${nextRank.label}</span>
          <span>${pts}/${nextRank.pts} pts</span>
        </div>
        <div style="height:8px;background:rgba(0,0,0,.5);border-radius:4px;overflow:hidden;border:1px solid rgba(255,255,255,.05)">
          <div style="height:100%;background:${g.color};width:${Math.min(100,Math.round(pts/nextRank.pts*100))}%;transition:width .6s;border-radius:3px"></div>
        </div>
        <div style="font-size:9px;color:var(--text3);margin-top:3px;text-align:right">Faltam ${nextRank.pts-pts} pts para ${nextRank.label}</div>
      </div>`
    : `<div style="text-align:center;font-family:'Cinzel',serif;font-size:9px;color:${g.color};padding:8px 0">✦ RANK MÁXIMO — ${curRank.label} ✦</div>`;

  const actionBtn = isActive
    ? `<div style="display:flex;gap:8px;flex-wrap:wrap">
        <div style="flex:1;background:${g.color}22;border:1px solid ${g.color}60;border-radius:6px;padding:8px 12px;text-align:center">
          <div style="font-family:'Cinzel',serif;font-size:10px;color:${g.color};margin-bottom:2px">✓ Guilda Ativa</div>
          <div style="font-size:10px;color:var(--text2)">${curRank.active}</div>
        </div>
        <button class="btn bsm bred" onclick="leaveGuild();closeMo()" style="flex-shrink:0">Sair</button>
      </div>`
    : `<button class="btn" onclick="setActiveGuild('${id}');closeMo()" style="width:100%;border-color:${g.color};color:${g.color}">
        ${g.icon} Entrar na ${g.name}
      </button>`;

  showMo(null,null,`
    <div style="text-align:center;margin-bottom:14px">
      <div style="font-size:48px;margin-bottom:6px">${g.icon}</div>
      <div style="font-family:'Cinzel Decorative',serif;font-size:17px;color:${g.color};margin-bottom:3px">${g.name}</div>
      <div style="font-size:10px;color:var(--text3);font-style:italic;letter-spacing:.05em">"${g.tagline}"</div>
    </div>
    <div style="background:rgba(0,0,0,.35);border:1px solid ${g.color}25;border-radius:6px;padding:11px 13px;margin-bottom:10px">
      <div style="font-size:11px;color:var(--text2);line-height:1.7;margin-bottom:8px">${g.desc}</div>
      <div style="border-top:1px solid rgba(255,255,255,.06);padding-top:8px;font-size:10px;color:var(--text3);line-height:1.7;font-style:italic">${g.lore}</div>
    </div>
    ${progressBar}
    <div style="margin-bottom:10px">
      <div style="font-family:'Cinzel',serif;font-size:8px;letter-spacing:.15em;color:var(--text3);margin-bottom:6px">RANKS DA GUILDA</div>
      ${ranksHtml}
    </div>
    ${actionBtn}
  `,[]);
}

// ── RENDER GUILDS PANEL ────────────────────────────────────────────
function renderGuilds(){
  const list=document.getElementById('guild-list');
  const progress=document.getElementById('guild-progress');
  const banner=document.getElementById('guild-active-banner');
  if(!list) return;

  const activeG=getActiveGuild();

  // Active guild banner
  if(activeG){
    const rank=getGuildRank(activeG);
    const pts=getGuildPoints(activeG);
    const nextR=activeG.ranks.find(r=>pts<r.pts&&r.pts>0);
    const pct=nextR?Math.min(100,Math.round(pts/nextR.pts*100)):100;
    banner.innerHTML=`
      <div style="background:linear-gradient(135deg,rgba(0,0,0,.55),rgba(0,0,0,.3));border:2px solid ${activeG.color}55;border-radius:8px;padding:12px 14px">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
          <span style="font-size:30px">${rank.icon}</span>
          <div style="flex:1">
            <div style="font-family:'Cinzel',serif;font-size:10px;color:var(--text3);letter-spacing:.1em;text-transform:uppercase">GUILDA ATIVA</div>
            <div style="font-family:'Cinzel Decorative',serif;font-size:14px;color:${activeG.color}">${activeG.name}</div>
            <div style="font-size:9px;color:${activeG.color};opacity:.8">${rank.label} — ${rank.active}</div>
          </div>
          <button class="btn bsm" onclick="openGuildDetail('${activeG.id}')" style="font-size:8px">Ver</button>
        </div>
        ${nextR?`<div style="height:5px;background:rgba(0,0,0,.4);border-radius:3px;overflow:hidden">
          <div style="height:100%;background:${activeG.color};width:${pct}%;transition:width .6s;border-radius:3px"></div>
        </div><div style="font-size:8px;color:var(--text3);margin-top:3px">${pts}/${nextR.pts} pts para ${nextR.label}</div>`
        :`<div style="font-size:9px;color:${activeG.color};text-align:center">✦ RANK MÁXIMO ATINGIDO ✦</div>`}
      </div>`;
  } else {
    banner.innerHTML=`<div style="background:rgba(0,0,0,.3);border:1px dashed rgba(201,168,76,.2);border-radius:8px;padding:12px;text-align:center">
      <div style="font-size:24px;margin-bottom:4px">🏰</div>
      <div style="font-family:'Cinzel',serif;font-size:10px;color:var(--text3)">Sem guilda ativa. Clique em uma guilda para entrar.</div>
    </div>`;
  }

  // Guild cards — click opens detail modal
  list.innerHTML = GUILDS.map(g=>{
    const pts=getGuildPoints(g);
    const rank=getGuildRank(g);
    const rankIdx=getGuildRankIdx(g);
    const nextR=g.ranks[rankIdx+1]||null;
    const pct=nextR?Math.min(100,Math.round(pts/nextR.pts*100)):100;
    const isActive=S.activeGuild===g.id;
    const habitsIn=(S.habits||[]).filter(h=>g.attrs.includes(h.at));

    return `<div onclick="openGuildDetail('${g.id}')"
      style="background:${isActive?`linear-gradient(135deg,${g.color}12,rgba(0,0,0,.4))`:'rgba(0,0,0,.35)'};
             border:${isActive?`2px solid ${g.color}80`:`1px solid ${g.color}30`};
             border-radius:6px;padding:12px 14px;margin-bottom:8px;cursor:pointer;
             transition:all .2s;position:relative"
      onmouseover="this.style.borderColor='${g.color}'" onmouseout="this.style.borderColor='${isActive?g.color+'80':g.color+'30'}'">
      ${isActive?`<div style="position:absolute;top:8px;right:8px;font-family:'Cinzel',serif;font-size:7px;letter-spacing:.1em;color:${g.color};background:${g.color}22;border:1px solid ${g.color}55;border-radius:10px;padding:2px 7px">✓ ATIVA</div>`:''}
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
        <span style="font-size:24px">${g.icon}</span>
        <div style="flex:1">
          <div style="font-family:'Cinzel',serif;font-size:11px;color:${g.color}">${g.name}</div>
          <div style="font-size:9px;color:var(--text2);font-style:italic">${g.tagline}</div>
        </div>
        <div style="text-align:right;flex-shrink:0">
          <div style="font-size:10px;color:${g.color};font-family:'Cinzel',serif">${rank.icon} ${rank.label}</div>
          <div style="font-size:9px;color:${rank.pct>0?'#2ecc71':'var(--text3)'}">${rank.pct>0?'+'+rank.pct+'% bônus':'Sem bônus'}</div>
        </div>
      </div>
      <div style="height:4px;background:rgba(0,0,0,.4);border-radius:2px;overflow:hidden;margin-bottom:5px">
        <div style="height:100%;background:${g.color};width:${pct}%;transition:width .6s;border-radius:2px"></div>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:9px;color:var(--text3)">
        <span>${pts} pts${nextR?' / '+nextR.pts:' — MAX'}</span>
        <span>${habitsIn.length} hábito${habitsIn.length!==1?'s':''} vinculado${habitsIn.length!==1?'s':''}</span>
      </div>
    </div>`;
  }).join('');

  // Progress summary
  progress.innerHTML = GUILDS.map(g=>{
    const pts=getGuildPoints(g);
    const rank=getGuildRank(g);
    return `<div style="display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid rgba(255,255,255,.04)">
      <span style="font-size:18px;width:24px;text-align:center">${g.icon}</span>
      <div style="flex:1">
        <div style="display:flex;justify-content:space-between;margin-bottom:3px">
          <span style="font-family:'Cinzel',serif;font-size:9px;color:${g.color}">${g.name}</span>
          <span style="font-size:9px;color:${rank.pct>0?'#2ecc71':'var(--text3)'}">${rank.icon} ${rank.pct>0?'+'+rank.pct+'%':'—'}</span>
        </div>
        <div style="height:4px;background:rgba(0,0,0,.4);border-radius:2px;overflow:hidden">
          <div style="height:100%;background:${g.color};width:${Math.min(100,pts)}%;max-width:100%"></div>
        </div>
      </div>
      <span style="font-family:'Cinzel',serif;font-size:9px;color:var(--gold2);min-width:32px;text-align:right">${pts}pts</span>
    </div>`;
  }).join('');
}
// ═══════════════════════════════════════════════════════════════
// END GUILD SYSTEM
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// HABIT CALENDAR HEATMAP
// ═══════════════════════════════════════════════════════════════
let calYear = new Date().getFullYear();
let calMonth = new Date().getMonth();
const CAL_MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

function calNav(dir){
  calMonth += dir;
  if(calMonth < 0){ calMonth=11; calYear--; }
  if(calMonth > 11){ calMonth=0; calYear++; }
  renderCalendar();
}

function getCalData(){
  // Build a map: 'YYYY-MM-DD' → { count, xp, gold }
  const map = {};
  (S.hist||[]).forEach(entry=>{
    let key = null;

    // New format: entry.date = 'YYYY-MM-DD'
    if(entry.date){
      key = entry.date.substring(0,10);
    }
    // Legacy format: entry.day = 'Fri May 08 2026' (toDateString)
    else if(entry.day){
      const d = new Date(entry.day);
      if(!isNaN(d)){
        const y = d.getFullYear();
        const m = String(d.getMonth()+1).padStart(2,'0');
        const dd = String(d.getDate()).padStart(2,'0');
        key = `${y}-${m}-${dd}`;
      }
    }

    if(!key) return;

    // Support both old field names (dn/go) and new ones (done/gold)
    const count = entry.done ?? entry.dn ?? 0;
    const gold  = entry.gold ?? entry.go ?? 0;
    map[key] = { count, xp: entry.xp||0, gold };
  });

  // Also reflect today's in-progress missions
  const today = new Date().toISOString().substring(0,10);
  const doneToday = (S.habits||[]).filter(h=>h.dn).length;
  if(doneToday > 0){
    map[today] = { count: doneToday, xp: S.xpTd||0, gold: S.goTd||0, today:true };
  }
  return map;
}

function renderCalendar(){
  const grid = document.getElementById('cal-grid');
  const lbl  = document.getElementById('cal-month-label');
  const stats= document.getElementById('cal-stats');
  const rank = document.getElementById('cal-habits-rank');
  if(!grid) return;

  lbl.textContent = `${CAL_MONTHS[calMonth]} ${calYear}`;

  const data = getCalData();
  const daysInMonth = new Date(calYear, calMonth+1, 0).getDate();
  const firstDay    = new Date(calYear, calMonth, 1).getDay();
  const today = new Date().toISOString().substring(0,10);

  // Build cells
  let cells = '';
  // Empty cells before month start
  for(let i=0; i<firstDay; i++){
    cells += `<div style="height:32px;border-radius:3px;background:rgba(0,0,0,.2)"></div>`;
  }
  // Day cells
  let totalDone=0, activeDays=0, maxDay=0, bestDay='';
  for(let d=1; d<=daysInMonth; d++){
    const key = `${calYear}-${String(calMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const info = data[key] || {count:0};
    const count = info.count||0;
    totalDone += count;
    if(count>0) activeDays++;
    if(count>maxDay){ maxDay=count; bestDay=key; }

    const isToday = key===today;
    let bg, border='';
    if(count===0)      bg='rgba(201,168,76,.06)';
    else if(count<=2)  bg='rgba(201,168,76,.25)';
    else if(count<=4)  bg='rgba(201,168,76,.55)';
    else               bg='#c9a84c';

    if(isToday) border='outline:2px solid var(--crystal);outline-offset:1px;';

    const isFuture = key > today;

    cells += `<div
      onclick="showCalDay('${key}',${count})"
      title="${d} ${CAL_MONTHS[calMonth]}${count>0?' · '+count+' missões':''}"
      style="height:32px;border-radius:3px;background:${bg};${border}cursor:${count>0||isToday?'pointer':'default'};
             opacity:${isFuture?.3:1};transition:transform .1s;position:relative;display:flex;align-items:center;justify-content:center;"
      onmouseover="if(${count}>0||${isToday})this.style.transform='scale(1.1)'"
      onmouseout="this.style.transform='scale(1)'"
    ><span style="font-size:9px;color:${count>0?'rgba(0,0,0,.6)':'rgba(255,255,255,.2)'};font-family:monospace;user-select:none">${d}</span>${isToday?`<div style="position:absolute;bottom:2px;right:2px;width:4px;height:4px;border-radius:50%;background:var(--crystal)"></div>`:''}</div>`;
  }
  grid.innerHTML = cells;

  // Stats
  const streak = S.streak||0;
  const pct = activeDays > 0 ? Math.round(activeDays/daysInMonth*100) : 0;
  stats.innerHTML = [
    ['🗓', 'Dias Ativos', activeDays+'/'+daysInMonth],
    ['📈', 'Consistência', pct+'%'],
    ['🏆', 'Melhor Dia', maxDay>0?maxDay+' missões':'—'],
    ['🔥', 'Streak Atual', streak+'d'],
  ].map(([ic,lb,vl])=>`
    <div style="background:rgba(0,0,0,.4);border:1px solid var(--border);border-radius:6px;padding:8px 10px;text-align:center">
      <div style="font-size:16px">${ic}</div>
      <div style="font-family:'Cinzel',serif;font-size:8px;color:var(--text3);letter-spacing:.1em">${lb}</div>
      <div style="font-family:'Cinzel Decorative',serif;font-size:15px;color:var(--gold2)">${vl}</div>
    </div>`).join('');

  // Habits rank
  const sorted = [...(S.habits||[])].sort((a,b)=>b.td-a.td).slice(0,5);
  rank.innerHTML = sorted.length === 0
    ? '<div style="font-style:italic">Nenhum hábito ainda.</div>'
    : sorted.map((h,i)=>`
      <div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.04)">
        <span style="font-size:14px;min-width:18px;text-align:center">${['🥇','🥈','🥉','4️⃣','5️⃣'][i]}</span>
        <span style="flex:1">${h.ic} ${h.nm}</span>
        <span style="font-family:'Cinzel',serif;font-size:10px;color:var(--gold2)">${h.td}×</span>
      </div>`).join('');
}

function showCalDay(key, count){
  const detail = document.getElementById('cal-detail');
  if(!detail) return;
  const data = getCalData();
  const info = data[key]||{count:0,xp:0,gold:0};
  const [y,m,d] = key.split('-');
  const label = `${d} de ${CAL_MONTHS[parseInt(m)-1]} de ${y}`;
  if(count===0 && !info.today){
    detail.style.display='none'; return;
  }
  detail.style.display='block';
  detail.innerHTML = `
    <div style="font-family:'Cinzel',serif;font-size:11px;color:var(--gold2);margin-bottom:6px">📅 ${label}</div>
    <div style="display:flex;gap:14px;flex-wrap:wrap">
      <span>⚔ ${info.count||0} missões</span>
      ${info.xp?`<span>⚡ ${info.xp} XP</span>`:''}
      ${info.gold?`<span>🪙 ${info.gold} Gold</span>`:''}
      ${info.today?`<span style="color:var(--crystal)">📍 Hoje</span>`:''}
    </div>`;
}
// ═══════════════════════════════════════════════════════════════
// END CALENDAR
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// BOSS COMBAT ANIMATIONS
// ═══════════════════════════════════════════════════════════════
