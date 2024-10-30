// Firebase 초기화
import { initializeApp } from "firebase/app"; // Firebase 앱 초기화
import { getFirestore, collection, addDoc, getDocs, orderBy, query } from "firebase/firestore"; // Firestore 가져오기

const firebaseConfig = {
    apiKey: "AIzaSyBU99g_FxKViKWgH4t9EqR4NjfO5FQ5nyQ",
    authDomain: "jonmatraid.firebaseapp.com",
    projectId: "jonmatraid",
    storageBucket: "jonmatraid.appspot.com",
    messagingSenderId: "922194069942",
    appId: "1:922194069942:web:db5675bde43f3750fa5917",
    measurementId: "G-BK4T3PRRTF"
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Firestore 초기화

let members = []; // 멤버 리스트 저장
let raidResults = []; // 딜량 결과 저장

// 데이터 추가
async function addMember() {
    const nickname = document.getElementById('nickname').value;
    const level = parseInt(document.getElementById('level').value);

    if (nickname && !isNaN(level)) {
        try {
            await addDoc(collection(db, "members"), {
                nickname: nickname,
                level: level
            });
            displayLevelRanking();
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    }
}

// 데이터 로드
async function loadMembers() {
    const q = query(collection(db, "members"), orderBy("level", "desc"));
    const querySnapshot = await getDocs(q);
    members = [];
    querySnapshot.forEach((doc) => {
        members.push({ id: doc.id, ...doc.data() });
    });
    displayLevelRanking();
}

function displayLevelRanking() {
    const levelRankingDiv = document.getElementById('levelRanking');
    levelRankingDiv.innerHTML = '<h4>레벨 순위표</h4>';
    members.forEach((member, index) => {
        levelRankingDiv.innerHTML += `<p>${index + 1}. ${member.nickname} - ${member.level}</p>`;
    });
}

// 유니온 레이드 딜량 추가
async function addRaidResult() {
    const nickname = document.getElementById('raidNickname').value;
    const damage1 = parseInt(document.getElementById('damage1').value);
    const damage2 = parseInt(document.getElementById('damage2').value);
    const damage3 = parseInt(document.getElementById('damage3').value);

    if (nickname && !isNaN(damage1) && !isNaN(damage2) && !isNaN(damage3)) {
        const totalDamage = damage1 + damage2 + damage3;
        try {
            await addDoc(collection(db, "raidResults"), {
                nickname: nickname,
                totalDamage: totalDamage
            });
            displayRaidRanking();
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    }
}

// 유니온 레이드 딜량 로드
async function loadRaidResults() {
    const q = query(collection(db, "raidResults"), orderBy("totalDamage", "desc"));
    const querySnapshot = await getDocs(q);
    raidResults = [];
    querySnapshot.forEach((doc) => {
        raidResults.push({ id: doc.id, ...doc.data() });
    });
    displayRaidRanking();
}

function displayRaidRanking() {
    const damageRankingDiv = document.getElementById('damageRanking');
    damageRankingDiv.innerHTML = '<h4>딜량 순위표</h4>';
    raidResults.forEach((result, index) => {
        damageRankingDiv.innerHTML += `<p>${index + 1}. ${result.nickname} - ${result.totalDamage}</p>`;
    });
}

// 페이지 로드 시 데이터 표시
loadMembers();
loadRaidResults();
