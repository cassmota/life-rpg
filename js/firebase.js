// ── firebase.js ──────────────────────────────────────────────────
// Autenticação Google + sincronização Firestore
// ─────────────────────────────────────────────────────────────────
"use strict";

import { initializeApp }          from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged }
                                   from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc }
                                   from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ── Suas credenciais Firebase ─────────────────────────────────────
const firebaseConfig = {
  apiKey:            "AIzaSyDZCdu9GDQdx0Wi9G8jxVaBhJ6bDjF9KO0",
  authDomain:        "life-rpg-fe049.firebaseapp.com",
  projectId:         "life-rpg-fe049",
  storageBucket:     "life-rpg-fe049.firebasestorage.app",
  messagingSenderId: "882458248525",
  appId:             "1:882458248525:web:c6709279d4b9b9847fe304"
};

// ── Inicialização ─────────────────────────────────────────────────
const firebaseApp = initializeApp(firebaseConfig);
const auth        = getAuth(firebaseApp);
const db          = getFirestore(firebaseApp);
const provider    = new GoogleAuthProvider();

// ── Estado global do usuário ──────────────────────────────────────
window.FB_USER    = null;   // usuário logado (ou null)
window.FB_READY   = false;  // true depois do primeiro onAuthStateChanged

// ─────────────────────────────────────────────────────────────────
// SAVE — grava S + uAch no Firestore
// Chamado a cada save() no engine.js (com debounce de 2s)
// ─────────────────────────────────────────────────────────────────
let _saveTimer = null;
window.cloudSave = (state, ach) => {
  if (!window.FB_USER) return;               // sem login → só localStorage
  clearTimeout(_saveTimer);
  _saveTimer = setTimeout(async () => {
    try {
      await setDoc(
        doc(db, "players", window.FB_USER.uid),
        { state: JSON.stringify(state), ach: JSON.stringify(ach), ts: Date.now() }
      );
    } catch (e) {
      console.warn("[Firebase] Erro ao salvar:", e.message);
    }
  }, 2000);
};

// ─────────────────────────────────────────────────────────────────
// LOAD — carrega dados do Firestore para o estado global S
// ─────────────────────────────────────────────────────────────────
window.cloudLoad = async (uid) => {
  try {
    const snap = await getDoc(doc(db, "players", uid));
    if (snap.exists()) {
      const data = snap.data();
      return {
        state: data.state ? JSON.parse(data.state) : null,
        ach:   data.ach   ? JSON.parse(data.ach)   : []
      };
    }
  } catch (e) {
    console.warn("[Firebase] Erro ao carregar:", e.message);
  }
  return null;
};

// ─────────────────────────────────────────────────────────────────
// LOGIN — abre popup Google
// ─────────────────────────────────────────────────────────────────
window.fbLogin = async () => {
  try {
    await signInWithPopup(auth, provider);
  } catch (e) {
    if (e.code !== "auth/popup-closed-by-user") {
      alert("Erro ao fazer login: " + e.message);
    }
  }
};

// ─────────────────────────────────────────────────────────────────
// LOGOUT
// ─────────────────────────────────────────────────────────────────
window.fbLogout = async () => {
  await signOut(auth);
  window.FB_USER = null;
  renderLoginBar();
  notify("👋", "Logout realizado", "Progresso salvo localmente.", "nc");
};

// ─────────────────────────────────────────────────────────────────
// AUTH STATE — detecta login/logout automático
// ─────────────────────────────────────────────────────────────────
onAuthStateChanged(auth, async (user) => {
  window.FB_READY = true;

  if (user) {
    window.FB_USER = user;
    renderLoginBar();

    // Tenta carregar dados da nuvem
    const cloud = await window.cloudLoad(user.uid);
    if (cloud && cloud.state) {
      // Mescla dados da nuvem com DEF() para garantir campos novos
      const def = DEF();
      const merged = { ...def, ...cloud.state };
      // Copia para o estado global S
      for (const k in merged) S[k] = merged[k];
      if (cloud.ach && cloud.ach.length > 0) {
        uAch = cloud.ach;
        localStorage.setItem("lrpgAch5", JSON.stringify(uAch));
      }
      // Persiste localmente também
      localStorage.setItem("lrpg6", JSON.stringify(S));
      // Re-renderiza com dados da nuvem
      if (typeof renderAll === "function") {
        checkBW();
        if (S.avData) applyAv(S.avData);
        renderAll();
      }
      notify("☁️", "Progresso carregado!", `Bem-vindo de volta, ${user.displayName?.split(" ")[0] || "Herói"}!`, "ng");
    } else {
      // Primeira vez — sobe dados locais para a nuvem
      window.cloudSave(S, uAch);
      notify("☁️", "Conta vinculada!", `Olá, ${user.displayName?.split(" ")[0] || "Herói"}! Progresso sincronizado.`, "ng");
    }
  } else {
    window.FB_USER = null;
    if (typeof renderLoginBar === "function") renderLoginBar();
  }
});

// ─────────────────────────────────────────────────────────────────
// BARRA DE LOGIN — renderiza o widget no topo da tela
// ─────────────────────────────────────────────────────────────────
window.renderLoginBar = () => {
  const bar = document.getElementById("fb-login-bar");
  if (!bar) return;

  if (window.FB_USER) {
    const u = window.FB_USER;
    bar.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px">
        ${u.photoURL
          ? `<img src="${u.photoURL}" style="width:22px;height:22px;border-radius:50%;border:1px solid rgba(201,168,76,.4)">`
          : `<span style="font-size:14px">👤</span>`}
        <span style="font-family:'Cinzel',serif;font-size:9px;color:var(--gold2);max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${u.displayName || u.email}</span>
        <span style="font-family:'Cinzel',serif;font-size:8px;color:rgba(39,174,96,.8)">☁ Sincronizado</span>
        <button onclick="fbLogout()" style="font-family:'Cinzel',serif;font-size:8px;background:rgba(192,57,43,.2);border:1px solid rgba(192,57,43,.3);color:rgba(192,57,43,.8);border-radius:4px;padding:2px 7px;cursor:pointer">Sair</button>
      </div>`;
  } else {
    bar.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px">
        <span style="font-family:'Cinzel',serif;font-size:9px;color:var(--text3)">☁ Salvo localmente</span>
        <button onclick="fbLogin()" style="font-family:'Cinzel',serif;font-size:9px;background:linear-gradient(135deg,rgba(201,168,76,.15),rgba(201,168,76,.05));border:1px solid rgba(201,168,76,.35);color:var(--gold2);border-radius:4px;padding:3px 10px;cursor:pointer;font-weight:600">
          🔑 Entrar com Google
        </button>
      </div>`;
  }
};

// Renderiza barra vazia enquanto Firebase carrega
window.renderLoginBar();
