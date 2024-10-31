import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, orderBy, query, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBU99g_FxKViKWgH4t9EqR4NjfO5FQ5nyQ",
    authDomain: "jonmatraid.firebaseapp.com",
    projectId: "jonmatraid",
    storageBucket: "jonmatraid.appspot.com",
    messagingSenderId: "922194069942",
    appId: "1:922194069942:web:db5675bde43f3750fa5917",
    measurementId: "G-BK4T3PRRTF"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let members = [];
let raidResults = [];

// 레벨 순위 추가
export async function addMember() {
    const nickname = document.getElementById('nickname').value;
    const level = parseInt(document.getElementById('level').value);
    if (nickname && !isNaN(level)) {
        await addDoc(collection(db, "members"), { nickname, level });
        loadMembers();
        alert("레벨 순위에 추가되었습니다.");
    }
}

// 레이드 딜량 순위 추가
export async function addRaidResult() {
    const nickname = document.getElementById('raidNickname').value;
    const damage1 = parseInt(document.getElementById('damage1').value);
    const damage2 = parseInt(document.getElementById('damage2').value);
    const damage3 = parseInt(document.getElementById('damage3').value);
    if (nickname && !isNaN(damage1) && !isNaN(damage2) && !isNaN(damage3)) {
        const totalDamage = damage1 + damage2 + damage3;
        await addDoc(collection(db, "raidResults"), { nickname, totalDamage });
        loadRaidResults();
        alert("딜량 순위에 추가되었습니다.");
    }
}

// 레벨 순위 로드
export async function loadMembers() {
    const q = query(collection(db, "members"), orderBy("level", "desc"));
    const querySnapshot = await getDocs(q);
    members = [];
    querySnapshot.forEach((doc) => members.push({ id: doc.id, ...doc.data() }));
    displayLevelRanking();
}

// 레이드 딜량 로드
export async function loadRaidResults() {
    const q = query(collection(db, "raidResults"), orderBy("totalDamage", "desc"));
    const querySnapshot = await getDocs(q);
    raidResults = [];
    querySnapshot.forEach((doc) => raidResults.push({ id: doc.id, ...doc.data() }));
    displayRaidRanking();
}

// 레벨 순위 초기화
export async function resetMembers() {
    const querySnapshot = await getDocs(collection(db, "members"));
    const promises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(promises);
    members = [];
    displayLevelRanking();
    alert("레벨 순위가 초기화되었습니다.");
}

// 레이드 딜량 초기화
export async function resetRaidResults() {
    const querySnapshot = await getDocs(collection(db, "raidResults"));
    const promises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(promises);
    raidResults = [];
    displayRaidRanking();
    alert("딜량 순위가 초기화되었습니다.");
}

// 레벨 순위 표시
function displayLevelRanking() {
    const levelRankingDiv = document.getElementById('levelRanking');
    levelRankingDiv.innerHTML = '<h4>레벨 순위표</h4>';
    members.forEach((member, index) => {
        levelRankingDiv.innerHTML += `<p>${index + 1}. ${member.nickname} - ${member.level}</p>`;
    });
}

// 딜량 순위 표시
function displayRaidRanking() {
    const damageRankingDiv = document.getElementById('damageRanking');
    damageRankingDiv.innerHTML = '<h4>딜량 순위표</h4>';
    raidResults.forEach((result, index) => {
        damageRankingDiv.innerHTML += `<p>${index + 1}. ${result.nickname} - ${result.totalDamage}</p>`;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadMembers();
    loadRaidResults();
});
