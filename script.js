let currentPlayer = "X";
let gameStatus = ["", "", "", "", "", "", "", "", ""];

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

const messageElement = document.getElementById("message");
const cells = document.querySelectorAll(".cell");

function makeMove(cellIndex) {
    if (gameStatus[cellIndex] === "" && !checkWinner()) {
        gameStatus[cellIndex] = currentPlayer;
        const cell = cells[cellIndex];
        if (currentPlayer === 'X') {
            cell.innerHTML = '<img src="cross.svg" alt="Cross">';
        } else {
            cell.innerHTML = '<img src="circle.svg" alt="Circle">';
        }
        if (checkWinner()) {
            messageElement.textContent = `Player ${currentPlayer} wins!`;
        } else if (checkDraw()) {
            messageElement.textContent = "It's a draw!";
        } else {
            currentPlayer = currentPlayer === "X" ? "O" : "X";
            messageElement.textContent = `Player ${currentPlayer}'s Turn`;
        }
    }
}


function checkWinner() {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return gameStatus[index] === currentPlayer;
        });
    });
}

function checkDraw() {
    return gameStatus.every(cell => {
        return cell !== "";
    });
}

function resetGame() {
    currentPlayer = "X";
    gameStatus = ["", "", "", "", "", "", "", "", ""];
    cells.forEach(cell => {
        cell.textContent = "";
    });
    messageElement.textContent = "Player 1's Turn";
}
