// //import { WebSocketServer } from 'ws';
// let currentPlayer = "X";
// let gameStatus = ["", "", "", "", "", "", "", "", ""];

// const winningCombinations = [
//   [0, 1, 2],
//   [3, 4, 5],
//   [6, 7, 8],
//   [0, 3, 6],
//   [1, 4, 7],
//   [2, 5, 8],
//   [0, 4, 8],
//   [2, 4, 6],
// ];

// const messageElement = document.getElementById("message");
// 
// //const ws = new WebSocket("ws://localhost:8080");
// //ws.onmessage = function (event) {
// // Parse the game status from the server's message
// const data = JSON.parse(event.data);

// // Update the game status and the current player
// gameStatus = data.gameStatus;
// currentPlayer = data.currentPlayer;

// // Update the game's UI based on the new game status
// updateGameUI();

// function makeMove(cellIndex) {
//   if (gameStatus[cellIndex] === "" && !checkWinner()) {
//     gameStatus[cellIndex] = currentPlayer;
//     const move = { cellIndex, currentPlayer };
//     //ws.send(JSON.stringify(move)); // Send the move to the server
//     updateCellUI(cellIndex, currentPlayer);
//     if (checkWinner()) {
//       // Handle the end of the game
//     } else {
//       // Switch the current player
//       currentPlayer = currentPlayer === "X" ? "O" : "X";
//     }
//   }
// }

// function updateCellUI(cellIndex, player) {
//   const cell = cells[cellIndex];
//   if (player === "X") {
//     cell.innerHTML = '<img src="cross.svg" alt="Cross">';
//   } else {
//     cell.innerHTML = '<img src="circle.svg" alt="Circle">';
//   }
// }

// function updateGameUI() {
//   gameStatus.forEach((cell, index) => {
//     updateCellUI(index, cell);
//   });
// }

const socket = io("http://localhost:3000/socket.io/socket.io.js");

socket.on("connect", () => {
  console.log(socket.id);
});


socket.on("message", (message) => {
  updateMessage(message);
});

let symbol;
function updateMessage(message) {
  const messageElement = document.getElementById("message");
  messageElement.textContent = message;

  if (message === "Your turn") {
    symbol = 'X';
  } else {
    symbol = 'O';
  }
}

function makeMove(cellIndex) {
  data= [cellIndex, symbol];
  socket.emit("makeMove", data);
}

socket.on("assignSymbol", (data) => {
  console.log(data);
  currentPlayer = data.symbol;
  updateMessage(data.message);
});

