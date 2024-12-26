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

numberButtons.forEach(button => {
    button.addEventListener("click", () => {
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

enterButton.addEventListener("click", () => {
  const number = input.value;
    if (currentNumber) { // 確保欄位不是空的
        console.log(`Sending update to server: ${number}`);
        ws.send(JSON.stringify({ type: 'update', number}));
        sound.play();
        currentNumber = ""; // 清空數字
        input.value = ""; // 清空輸入框
    } else {
      alert("請輸入取餐編號！");
    }
  });
