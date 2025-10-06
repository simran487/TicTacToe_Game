const cells = document.querySelectorAll('.cell');
const result = document.getElementById('result');
const restartBtn = document.getElementById('restart');
const gameContainer = document.getElementById('game-container');
const gameSetup = document.getElementById('game-setup');
const friendBtn = document.getElementById('friend');
const computerBtn = document.getElementById('computer');

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let againstComputer = false;

// Winning conditions
const winningConditions = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

// Choose game mode
friendBtn.addEventListener('click', () => startGame(false));
computerBtn.addEventListener('click', () => startGame(true));

function startGame(computer) {
    againstComputer = computer;
    gameSetup.classList.add('hidden');
    gameContainer.classList.remove('hidden');
}

// Handle cell click
function handleCellClick(e){
    const index = e.target.getAttribute('data-index');
    if(board[index] !== "" || !gameActive) return;

    board[index] = currentPlayer;
    e.target.textContent = currentPlayer;
    checkResult();

    if(gameActive){
        currentPlayer = currentPlayer === "X" ? "O" : "X";

        // If playing against computer and it's O's turn
        if(againstComputer && currentPlayer === "O"){
            setTimeout(computerMove, 800); // AI thinks for 0.8s
        }
    }
}

// Smart computer move
function computerMove(){
    if(!gameActive) return;

    // 1. Win if possible
    let move = findBestMove("O");

    // 2. Block player
    if(move === null){
        move = findBestMove("X");
    }

    // 3. Take a corner
    if(move === null){
        const corners = [0,2,6,8].filter(i => board[i] === "");
        if(corners.length > 0) move = corners[Math.floor(Math.random()*corners.length)];
    }

    // 4. Pick random
    if(move === null){
        const empty = board.map((val,i)=> val === "" ? i : null).filter(val => val !== null);
        move = empty[Math.floor(Math.random()*empty.length)];
    }

    // Make the move
    board[move] = currentPlayer;
    cells[move].textContent = currentPlayer;

    checkResult();

    if(gameActive) currentPlayer = "X"; // back to player
}

// Function to find winning/blocking move
function findBestMove(player){
    for(let condition of winningConditions){
        const [a,b,c] = condition;
        const line = [board[a], board[b], board[c]];
        if(line.filter(x => x === player).length === 2 && line.includes("")){
            return condition[line.indexOf("")];
        }
    }
    return null;
}

// Check win/draw
function checkResult(){
    let roundWon = false;
    for(let condition of winningConditions){
        const [a,b,c] = condition;
        if(board[a] && board[a] === board[b] && board[a] === board[c]){
            roundWon = true;
            break;
        }
    }
    if(roundWon){
        result.textContent = `Player ${currentPlayer} Wins!`;
        gameActive = false;
        return;
    }
    if(!board.includes("")){
        result.textContent = "It's a Draw!";
        gameActive = false;
    }
}

// Restart game
function restartGame(){
    board = ["", "", "", "", "", "", "", "", ""];
    cells.forEach(cell => cell.textContent = "");
    result.textContent = "";
    currentPlayer = "X";
    gameActive = true;
    gameSetup.classList.remove('hidden');
    gameContainer.classList.add('hidden');
}

// Event listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', restartGame);
