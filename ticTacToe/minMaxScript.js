// import { getAvailableMoves, isWin } from 'http://192.168.1.71:8080/ticTacToe/boardScript.js';
import { getAvailableMoves, isWin } from './boardScript.js';

const minMax = (board, player, symbol, level = 'unbeatable') => {
    let playerSymbol;
    let computerSymbol;

    if (player === 'human') {
        playerSymbol = symbol;
        computerSymbol = symbol === 'X' ? 'O' : 'X'; 
    } else {
        playerSymbol = symbol === 'X' ? 'O' : 'X'; 
        computerSymbol = symbol; 
    }

    // get available moves
    const availableMoves = getAvailableMoves(board);

    // check win
    const isPlayerWin = isWin(board, playerSymbol);
    const isPlayerLoss = isWin(board, computerSymbol);

    if (level === 'unbeatable') {
        if (isPlayerWin){
            return { score: 1 };
        } else if (isPlayerLoss) {
            return { score: -1 };
        } else if (availableMoves.length === 0) {
            return { score: 0 };
        };
    } else {
        if (isPlayerWin){
            return { score: 0 };
        } else if (isPlayerLoss) {
            return { score: 0 };
        } else if (availableMoves.length === 0) {
            return { score: 0 };
        };
    };
    
    // store move scores
    const moves = [];

    // loop through available spots
    for (let k = 0; k < availableMoves.length; k++) {
        // create an object for each and store the index of that spot 
        let move = {};
        move.index = board[availableMoves[k]];

        // set the empty spot to the current player
        board[availableMoves[k]] = symbol;

        // collect the score resulted from calling minimax 
        // on the opponent of the current player
        if (player === 'computer') {
            let result = minMax(board, 'human', playerSymbol, level);
            move.score = result.score;
        } else {
            let result = minMax(board, 'computer', computerSymbol, level);
            move.score = result.score;
        };

        // reset the spot to empty
        board[availableMoves[k]] = move.index;

        // push the object to the array
        moves.push(move);
    };

    // if it is the computer's turn loop over the moves and choose the move with the highest score
    let bestMove;
    if (player === 'computer'){
        let bestScore = 10000;
        for (let l = 0; l < moves.length; l++) {
            if (moves[l].score < bestScore){
                bestScore = moves[l].score;
                bestMove = l;
            };
        };
    } else {
        // else loop over the moves and choose the move with the lowest score
        let bestScore = -10000;
        for (let l = 0; l < moves.length; l++){
            if (moves[l].score > bestScore){
                bestScore = moves[l].score;
                bestMove = l;
            };
        };
    };

    // return the chosen move (object) from the moves array
    return moves[bestMove];
};

export { minMax };