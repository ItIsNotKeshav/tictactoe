// 'use strict';
// const express = require('express');
// const socketIO = require('socket.io');
// const PORT = process.env.PORT || 3000;
// const INDEX = '/index.html';
// const server = express()
//   .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
//   .listen(PORT, () => console.log(`Listening on ${PORT}`));
// const io = require("socket.io")(server,{
//   cors: {
//     origins: "*:*",
//     methods: ["GET", "POST"]
//   }
// });

"use strict";
const express = require("express");
const socketIO = require("socket.io");
const PORT = process.env.PORT || 3000;
const INDEX = "/index.html";
const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
const io = require("socket.io")(server, {
  cors: {
    origins: "http://localhost:5500",
    methods: ["GET", "POST"],
  },
});

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
function checkWinner() {
  return winningCombinations.some((combination) => {
    return combination.every((index) => {
      return gameStatus[index] === currentPlayer;
    });
  });
}

// Array to store connected players (sockets)
let players = [];
let gameStatus = Array(9).fill(null);
let turn = 0;
io.on("connection", (socket) => {
  console.log("A player connected");

  players.push(socket);

  if (players.length === 1) {
    socket.emit("message", "Waiting for opponent to join");
  }

  if (players.length === 2) {
    socket.emit("message", "Opponent joined");
    assignSymbols(players[0], players[1]);
  }

  socket.on("disconnect", () => {
    console.log("A player disconnected");
    players = players.filter((player) => player !== socket); // Remove the disconnected player from the players array
    players[0].emit("message", "The other player disconnected");
    gameStatus = Array(9).fill(null);
    turn = 0;
    io.emit("gameStatus", gameStatus);

    if (players.length === 1) {
      players[0].emit("message", "The other player disconnected");
    }
  });

  socket.on("makeMove", (data) => {
    const index = data[1];
    const symbol = data[0];
    turn = 1 - turn;
    if (gameStatus[index] === null) {
      gameStatus[index] = symbol;
      io.emit("gameStatus", gameStatus);
    }

    console.log(symbol, "made a move at index", index);
    console.log("Current game status:", gameStatus);

    // Send the move data to all other clients (except the sender)
    io.to(socket.id).emit("makeMove", data);
    players[turn].emit("turn", "Your turn");
    players[1 - turn].emit("turn", "Opponent's turn");

    // Send updated game state and history to all clients
  });

  socket.on("resetGame", () => {
    gameStatus = Array(9).fill(null);
    turn = 0;
    io.emit("gameStatus", gameStatus);
    console.log(gameStatus);
    assignSymbols(players[0], players[1]);
  });
});

function assignSymbols(player1, player2) {
  const firstPlayerSymbol = Math.random() > 0.5 ? "X" : "O";
  const secondPlayerSymbol = firstPlayerSymbol === "X" ? "O" : "X";

  if (firstPlayerSymbol === "X") {
    player1.emit("assignSymbol", {
      symbol: firstPlayerSymbol,
      message: "Your turn",
    });
    player2.emit("assignSymbol", {
      symbol: secondPlayerSymbol,
      message: "Opponent's turn",
    });
    turn = players.indexOf(player1); // Set turn to the index of player1
  } else {
    player2.emit("assignSymbol", {
      symbol: secondPlayerSymbol,
      message: "Your turn",
    });
    player1.emit("assignSymbol", {
      symbol: firstPlayerSymbol,
      message: "Opponent's turn",
    });
    turn = players.indexOf(player2); // Set turn to the index of player2
  }
}
