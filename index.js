const input = document.getElementById("numberInput");
const numberButtons = document.querySelectorAll(".number");
const enterButton = document.querySelector(".enter");
const deleteButton = document.querySelector(".delete");
const enableVoiceButton = document.getElementById("enableVoice");
const sound = document.getElementById("dingSound");
const ws = new WebSocket('wss://staff-calling.onrender.com');

let currentNumber = "";
let isVoiceEnabled = false;

// 檢查是否支援語音
if (!('speechSynthesis' in window)) {
  alert("您的瀏覽器不支援語音提示功能。請使用最新的瀏覽器！");
}

let voices = [];
window.speechSynthesis.onvoiceschanged = function() {
  voices = window.speechSynthesis.getVoices();
  console.log("Available voices:", voices);  // 打印可用語音
};

ws.addEventListener('open', () => {
  console.log('WebSocket connection established for staff');
});

ws.addEventListener('error', (error) => {
  console.error('WebSocket error:', error);
});

ws.addEventListener('close', () => {
  console.log('WebSocket connection closed');
});

numberButtons.forEach(button => {
  button.addEventListener("touchstart", event => {
    event.preventDefault();
    const value = button.dataset.value; // 取得按鈕的數字
    currentNumber += value; // 將數字加到 currentNumber
    input.value = currentNumber; // 更新輸入框顯示
  });
});

deleteButton.addEventListener("touchstart", event => {
  event.preventDefault();
  currentNumber = currentNumber.slice(0, -1); // 刪除最後一個字元
  input.value = currentNumber; // 更新輸入框顯示
});

function playSound() {
  return new Promise(resolve => {
    sound.play();
    sound.onended = () => resolve();  // 當音效播放完畢時，解決Promise
  });
}

enterButton.addEventListener("touchstart", async event => {
  event.preventDefault();
  const number = input.value;

  if (currentNumber) { // 確保欄位不是空的
    console.log(`Sending update to server: ${number}`);
    ws.send(JSON.stringify({ type: 'update', number }));

    await playSound();

    // 確保語音已啟用
    if (isVoiceEnabled) {
      const utterance = new SpeechSynthesisUtterance(`${number}號，可取餐`);
      utterance.lang = "zh-TW";  // 設定語言

      // 確保有 "zh-TW" 語音可用
      const voice = voices.find(v => v.lang === "zh-TW");
      if (voice) {
        utterance.voice = voice;  // 設定語音
        console.log("Using voice:", voice);  // 顯示使用的語音
      } else {
        console.log("No zh-TW voice found");
      }

      // 播放語音
      window.speechSynthesis.speak(utterance);
    }

    currentNumber = ""; // 清空數字
    input.value = ""; // 清空輸入框
  } else {
    alert("請輸入取餐編號！");
  }
});

// 啟用語音功能
enableVoiceButton.addEventListener("touchstart", event => {
  event.preventDefault();
  const utterance = new SpeechSynthesisUtterance("語音功能已啟用");
  utterance.lang = "zh-TW";
  window.speechSynthesis.speak(utterance);

  isVoiceEnabled = true;
  enableVoiceButton.disabled = true; // 禁用按鈕，避免重複啟用
  enableVoiceButton.textContent = "語音提示已啟用";
  alert("語音提示功能已啟用！");
});
