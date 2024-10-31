// Firebase App을 불러옵니다.
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

// Firebase 설정
const firebaseConfig = {
    apiKey: "AIzaSyBU99g_FxKViKWgH4t9EqR4NjfO5FQ5nyQ",
    authDomain: "jonmatraid.firebaseapp.com",
    projectId: "jonmatraid",
    storageBucket: "jonmatraid.appspot.com",
    messagingSenderId: "922194069942",
    appId: "1:922194069942:web:db5675bde43f3750fa5917",
    measurementId: "G-BK4T3PRRTF"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 멤버 데이터 로드
async function loadMembers() {
    const memberList = document.getElementById("levelRanking");
    const q = query(collection(db, "members"), orderBy("level", "desc"));
    try {
        const querySnapshot = await getDocs(q);
        const members = [];
        querySnapshot.forEach((doc) => {
            members.push({ id: doc.id, ...doc.data() });
        });

        if (members.length > 0) {
            memberList.innerHTML = members.map(member => `<p>${member.nickname} - 레벨: ${member.level}</p>`).join('');
        } else {
            memberList.innerHTML = '<p>등록된 멤버가 없습니다.</p>';
        }
    } catch (error) {
        console.error("Error loading members: ", error);
    }
}

// 레이드 결과 데이터 로드
async function loadRaidResults() {
    const raidList = document.getElementById("damageRanking");
    const q = query(collection(db, "raidResults"), orderBy("totalDamage", "desc"));
    try {
        const querySnapshot = await getDocs(q);
        const raidResults = [];
        querySnapshot.forEach((doc) => {
            raidResults.push({ id: doc.id, ...doc.data() });
        });

        if (raidResults.length > 0) {
            raidList.innerHTML = raidResults.map(result => `<p>${result.nickname} - 딜량: ${result.totalDamage}</p>`).join('');
        } else {
            raidList.innerHTML = '<p>등록된 레이드 결과가 없습니다.</p>';
        }
    } catch (error) {
        console.error("Error loading raid results: ", error);
    }
}

// 페이지 로드 시 데이터 로드
window.onload = () => {
    loadMembers();
    loadRaidResults();
};

// 비밀번호 확인 함수
document.getElementById("loginButton").addEventListener("click", checkPassword);

function checkPassword() {
    const password = document.getElementById("passwordBox").value;
    if (password === "1990") { // 비밀번호를 여기에서 설정
        window.location.href = "index(1).html"; // 로그인 성공 시 이동
    } else {
        alert("비밀번호가 틀렸습니다.");
    }
}
