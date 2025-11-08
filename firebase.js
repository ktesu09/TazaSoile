import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore, setDoc, doc, getDocs, collection } 
  from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "ВАШ_API_KEY",
  authDomain: "ВАШ_FIREBASE_PROJECT.firebaseapp.com",
  projectId: "ВАШ_PROJECT_ID",
  storageBucket: "ВАШ_BUCKET",
  messagingSenderId: "XXX",
  appId: "XXX"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function saveScore(name, score){
  await setDoc(doc(db, "users", name), {score});
}

async function getLeaderboard(){
  const snapshot = await getDocs(collection(db, "users"));
  const data = [];
  snapshot.forEach(doc => data.push({ name: doc.id, score: doc.data().score }));
  return data.sort((a,b)=>b.score - a.score);
}

export { db, saveScore, getLeaderboard };