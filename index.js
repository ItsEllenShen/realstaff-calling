const input = document.getElementById("numberInput");
const numberButtons = document.querySelectorAll(".number");
const enterButton = document.querySelector(".enter");
const deleteButton = document.querySelector(".delete");
const sound = document.getElementById("dingSound");
const ws = new WebSocket('wss://staff-calling.onrender.com');

let currentNumber = "";

ws.addEventListener('open', () => {
  console.log('WebSocket connection established for staff');
});

ws.addEventListener('error', (error) => {
  console.error('WebSocket error:', error);
});

ws.addEventListener('close', () => {
  console.log('WebSocket connection closed');
});

// 處理按鍵輸入數字
numberButtons.forEach(button => {
  button.addEventListener("click", () => {
    const value = button.dataset.value; // 取得按鈕的數字
    currentNumber += value; // 將數字加到 currentNumber
    input.value = currentNumber; // 更新輸入框顯示
  });
});

// 刪除最後一個數字
deleteButton.addEventListener("click", () => {
  currentNumber = currentNumber.slice(0, -1); // 刪除最後一個字元
  input.value = currentNumber; // 更新輸入框顯示
});

// 播放語音提示
const playVoice = (number) => {
  const message = `${number}號，可取餐`;
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.lang = "zh-TW"; // 設定語言為中文
  window.speechSynthesis.speak(utterance);
};

// 確認按鈕邏輯
enterButton.addEventListener("click", () => {
  const number = input.value;
  if (currentNumber) { // 確保欄位不是空的
    console.log(`Sending update to server: ${number}`);
    ws.send(JSON.stringify({ type: 'update', number })); // 發送更新至伺服器
    sound.play(); // 播放提示音效
    playVoice(number); // 播放語音提示
    currentNumber = ""; // 清空數字
    input.value = ""; // 清空輸入框
  } else {
    alert("請輸入取餐編號！");
  }
});
