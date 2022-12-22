// import { minMax } from "http://192.168.1.71:8080/ticTacToe/minMaxScript.js";
// import { isWin, getAvailableMoves } from 'http://192.168.1.71:8080/ticTacToe/boardScript.js';
import { minMax } from "./minMaxScript.js";
import { isWin, getAvailableMoves } from './boardScript.js';

// // human
const humanPlayer = "X";
// // computer
const computerPlayer = "O";

// xCross and circle innerHtml
const xCross = '<img src="./resources/gameModels/ticTacToe/xCross.png" width="70" alt="X" />';
const circle = '<img src="/resources/gameModels/ticTacToe/circumference.png" width="70" alt="O" />';

// const board = ["O",1 ,"X","X",4 ,"X", 6 ,"O","O"];
// const board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
let gameStatus = '';
const newGame = () => {
    gameStatus = '';
    for (let k = 0; k < 9; k++) {
        document.getElementById(`cell${k}`).innerHTML = '';
    };

    const computerPlayer = document.getElementById('firstToPlay').value === 'human' ? 'second': 'first';
    if (computerPlayer === 'first') {
        const moves = [0, 2, 6, 8];
        const randomIdx = Math.floor(Math.random() * moves.length);
        // document.getElementById(`cell${moves[randomIdx]}`).innerHTML = '<img src="http://192.168.1.71:8080/resources/gameModels/ticTacToe/circumference.png" width="70" alt="O" />';
        document.getElementById(`cell${moves[randomIdx]}`).innerHTML = circle;
    };
};

const getBoardState = () => {
    let board = [];
    for (let k = 0; k < 9; k++) {
        // const cellValue = document.getElementById(`cell${k}`).textContent;
        const cellValue = document.getElementById(`cell${k}`).firstChild;
        if (!cellValue) {
            board.push(k);
        } else {
            board.push(cellValue.alt);
        };
    };

    return board;
};

const getGameDificulty = () => {
    const dificulty = document.getElementById('dificulty').value;
    return dificulty;
};

const computerPlay = () => {
    // get board state
    const board = getBoardState();

    // finding computer's next move
    const bestSpot = minMax(board, 'computer', computerPlayer, getGameDificulty());

    // update board state with computer's move
    // document.getElementById(`cell${bestSpot.index}`).innerHTML = '<p>O</p>';
    const cell = document.getElementById(`cell${bestSpot.index}`);
    if (cell) {
        // cell.innerHTML = '<img src="http://192.168.1.71:8080/resources/gameModels/ticTacToe/circumference.png" width="70" alt="O" />';
        cell.innerHTML = circle;
    };

    // log the results
    // console.log("index: " + bestSpot.index);
};

const cells = Array.from(document.getElementById('game').children);
cells.forEach(cell => {
    const computerPlayer = document.getElementById('firstToPlay').value === 'human' ? 'O': 'X';
    document.getElementById(cell.id).addEventListener('click', () => {
        if (!cell.innerHTML && gameStatus === '') {
            // document.getElementById(cell.id).innerHTML = '<p>X</p>'
            document.getElementById(cell.id).innerHTML = xCross;

            const checkWin = isWin(getBoardState(), 'X');
            
            if (checkWin) {
                gameStatus = 'win';
                document.getElementById('resultText').textContent = 'You won!';
                document.getElementById('container-result').style.zIndex = 1;
            } else {
                computerPlay();
                const checkLoss = isWin(getBoardState(), 'O');

                if (checkLoss) {
                    gameStatus = 'loss';
                    document.getElementById('resultText').textContent = 'You lost!';
                    document.getElementById('container-result').style.zIndex = 1;
                } else {
                    const moves = getAvailableMoves(getBoardState());
                    if (moves.length === 0) {
                        gameStatus = 'draw';
                        document.getElementById('resultText').textContent = "It's a draw!";
                        document.getElementById('container-result').style.zIndex = 1;
                    };
                };
            };
        };
    });
});

// hit new game button
document.getElementById('newGame').addEventListener('click', () => {
    newGame();
});

// hit the try again button
document.getElementById('reload').addEventListener('click', () => {
    newGame();
    document.getElementById('container-result').style.zIndex = -1;
    document.getElementById('resultText').textContent = 'You lost!';
});
