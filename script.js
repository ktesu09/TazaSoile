import { db, saveScore, getLeaderboard } from './firebase.js';

const lessons = [
  { word: "Сәлем", meaning: "Привет" },
  { word: "Рахмет", meaning: "Спасибо" },
  { word: "Кітап", meaning: "Книга" },
  { word: "Дос", meaning: "Друг" }
];

let currentLesson = 0;
let score = 0;
let badges = 0;
let username = '';

function register() {
  username = document.getElementById('username').value;
  if (!username) return alert("Есім енгізіңіз!");
  document.getElementById('register').classList.add('hidden');
  document.getElementById('lesson').classList.remove('hidden');
  loadLesson();
}

function loadLesson() {
  const lesson = lessons[currentLesson];
  const card = document.getElementById('lessonCard');
  card.innerHTML = `<strong>${lesson.word}</strong> — ${lesson.meaning}`;
  document.getElementById('speechInput').value = '';
}

// Проверка произношения (через Web Speech API)
function checkPronunciation() {
  const recognition = new webkitSpeechRecognition();
  recognition.lang = "kk-KZ";
  recognition.onresult = e => {
    const said = e.results[0][0].transcript;
    const lessonWord = lessons[currentLesson].word;
    if (said.toLowerCase() === lessonWord.toLowerCase()) {
      score += 10;
      badges += 1;
      alert("Жақсы айттыңыз! +10 ұпай 🎉");
    } else {
      alert(`Қайталап көріңіз. Ты айттың: ${said}`);
    }
    document.getElementById('score').textContent = score;
    document.getElementById('badges').textContent = badges;
    saveScore(username, score); // Firebase
  };
  recognition.start();
}

function nextLesson() {
  currentLesson++;
  if (currentLesson >= lessons.length) {
    alert("Сабақ аяқталды!");
    loadLeaderboard();
  } else {
    loadLesson();
  }
}

async function loadLeaderboard() {
  document.getElementById('lesson').classList.add('hidden');
  document.getElementById('leaderboard').classList.remove('hidden');
  const data = await getLeaderboard();
  const list = document.getElementById('ratingList');
  list.innerHTML = '';
  data.forEach(user => {
    const li = document.createElement('li');
    li.textContent = `${user.name}: ${user.score} ұпай`;
    list.appendChild(li);
  });
}