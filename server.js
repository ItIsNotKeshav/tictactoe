const io = require("socket.io")(3000, {
  cors: {
    origin: "http://127.0.0.1:5500",
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
    socket.emit("message", "The other player disconnected");
  });

  socket.on("makeMove", (data) => {
    const index = data[1];
    const symbol = data[0];
    turn = 1 - turn;
    gameStatus[index] = symbol;
    io.emit("gameStatus", gameStatus);
    // Update game status only for the current move

    console.log(symbol, "made a move at index", index);
    console.log("Current game status:", gameStatus);

    // Send the move data to all other clients (except the sender)
    io.to(socket.id).emit("makeMove", data);
    players[turn].emit("turn", "Your turn");
    players[1 - turn].emit("turn", "Opponent's turn");

    // Send updated game state and history to all clients
    
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
  } else {
    player2.emit("assignSymbol", {
      symbol: secondPlayerSymbol,
      message: "Your turn",
    });
    player1.emit("assignSymbol", {
      symbol: firstPlayerSymbol,
      message: "Opponent's turn",
    });
  }
}