// Firebase 초기화
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, getDocs, orderBy, query } from "firebase/firestore"; // Firestore 관련 함수 추가

const firebaseConfig = {
  apiKey: "AIzaSyBU99g_FxKViKWgH4t9EqR4NjfO5FQ5nyQ",
  authDomain: "jonmatraid.firebaseapp.com",
  projectId: "jonmatraid",
  storageBucket: "jonmatraid.appspot.com",
  messagingSenderId: "922194069942",
  appId: "1:922194069942:web:db5675bde43f3750fa5917",
  measurementId: "G-BK4T3PRRTF"
};

// Firebase 및 Firestore 초기화
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// 데이터 추가 함수
async function addMember() {
  const nickname = document.getElementById('nickname').value;
  const level = parseInt(document.getElementById('level').value);

  if (nickname && !isNaN(level)) {
    try {
      await addDoc(collection(db, "members"), {
        nickname: nickname,
        level: level
      });
      displayLevelRanking(); // 레벨 순위 표시 함수 호출
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  } else {
    alert("닉네임과 레벨을 입력하세요."); // 유효성 검사
  }
}

// 데이터 로드 함수
async function loadMembers() {
  const q = query(collection(db, "members"), orderBy("level", "desc"));
  const querySnapshot = await getDocs(q);
  const members = [];
  querySnapshot.forEach((doc) => {
    members.push({ id: doc.id, ...doc.data() });
  });
  displayLevelRanking(members); // 레벨 순위 표시 함수 호출
}

// 레벨 순위 표시 함수
function displayLevelRanking(members) {
  const levelRankingDiv = document.getElementById('levelRanking');
  levelRankingDiv.innerHTML = '<h4>레벨 순위표</h4>';
  members.forEach((member, index) => {
    levelRankingDiv.innerHTML += `<p>${index + 1}. ${member.nickname} - ${member.level}</p>`;
  });
}

// DOMContentLoaded 이벤트 리스너
document.addEventListener('DOMContentLoaded', (event) => {
  loadMembers(); // 페이지 로드 시 멤버 데이터 로드
});
