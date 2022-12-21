// get available moves
const getAvailableMoves = (board) => {
    return board.filter(cell => cell !== "O" && cell !== "X");
};

// check for win
const isWin = (board, playerSymbol) => {
    if (
        // horizontal wins
        (board[0] == playerSymbol && board[1] == playerSymbol && board[2] == playerSymbol) ||
        (board[3] == playerSymbol && board[4] == playerSymbol && board[5] == playerSymbol) ||
        (board[6] == playerSymbol && board[7] == playerSymbol && board[8] == playerSymbol) ||
        // vertical wins
        (board[0] == playerSymbol && board[3] == playerSymbol && board[6] == playerSymbol) ||
        (board[1] == playerSymbol && board[4] == playerSymbol && board[7] == playerSymbol) ||
        (board[2] == playerSymbol && board[5] == playerSymbol && board[8] == playerSymbol) ||
        // diagonal wins
        (board[0] == playerSymbol && board[4] == playerSymbol && board[8] == playerSymbol) ||
        (board[2] == playerSymbol && board[4] == playerSymbol && board[6] == playerSymbol)
        ) {
            return true;
        } else {
            return false;
    };
};

export { getAvailableMoves, isWin };