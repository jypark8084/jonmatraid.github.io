// Firebase 초기화
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, orderBy, query, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

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
export async function addMember() {
    const nickname = document.getElementById('nickname').value;
    const level = parseInt(document.getElementById('level').value);

    if (nickname && !isNaN(level)) {
        try {
            await addDoc(collection(db, "members"), {
                nickname: nickname,
                level: level
            });
            alert('변경상황이 추가되었습니다.');
            loadMembers(); // 목록 새로고침
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    }
}

// 데이터 로드
export async function loadMembers() {
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
        levelRankingDiv.innerHTML += `
            <p>
                ${index + 1}. ${member.nickname} - ${member.level}
                <button onclick="deleteMember('${member.id}')">삭제</button>
                <button onclick="editMember('${member.id}', '${member.nickname}', ${member.level})">수정</button>
            </p>`;
    });
}

// 데이터 삭제
export async function deleteMember(memberId) {
    await deleteDoc(doc(db, "members", memberId));
    loadMembers(); // 목록 새로고침
    alert('회원이 삭제되었습니다.');
}

// 데이터 수정
export function editMember(memberId, nickname, level) {
    const newNickname = prompt("닉네임을 입력하세요:", nickname);
    const newLevel = prompt("레벨을 입력하세요:", level);
    
    if (newNickname && newLevel) {
        updateDoc(doc(db, "members", memberId), {
            nickname: newNickname,
            level: parseInt(newLevel)
        })
        .then(() => {
            loadMembers(); // 목록 새로고침
            alert('변경상황이 수정되었습니다.');
        })
        .catch((error) => {
            console.error("Error updating document: ", error);
        });
    }
}

// 유니온 레이드 딜량 추가
export async function addRaidResult() {
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
            alert('변경상황이 추가되었습니다.');
            loadRaidResults(); // 목록 새로고침
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    }
}

// 유니온 레이드 딜량 로드
export async function loadRaidResults() {
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
        damageRankingDiv.innerHTML += `
            <p>${index + 1}. ${result.nickname} - ${result.totalDamage}
            <button onclick="deleteRaidResult('${result.id}')">삭제</button>
            </p>`;
    });
}

// 데이터 초기화
export async function resetAllData() {
    await resetCollection("members");
    await resetCollection("raidResults");
    loadMembers(); // 목록 새로고침
    loadRaidResults(); // 목록 새로고침
    alert("모든 데이터가 초기화되었습니다.");
}

async function resetCollection(collectionName) {
    const querySnapshot = await getDocs(collection(db, collectionName));
    querySnapshot.forEach((doc) => {
        deleteDoc(doc.ref);
    });
}

// 데이터 삭제 (레이드 결과)
export async function deleteRaidResult(raidResultId) {
    await deleteDoc(doc(db, "raidResults", raidResultId));
    loadRaidResults(); // 목록 새로고침
    alert('딜량 결과가 삭제되었습니다.');
}

// DOMContentLoaded 이벤트 리스너
document.addEventListener('DOMContentLoaded', (event) => {
    loadMembers();
    loadRaidResults();
});
