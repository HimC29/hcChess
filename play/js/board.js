import { notnToArrIndex } from "./utils.js";

// board.js
const boardArray = Array.from({length:8}, () => Array(8).fill(0));

export const board = {
    data: boardArray,
    getPieceAt(square) {
        const [row, col] = notnToArrIndex(square);
        return this.data[row][col];
    },
    setPieceAt(square, piece) {
        const [row, col] = notnToArrIndex(square);
        this.data[row][col] = piece;
    }
};

export function createSquares() {
    const chessboard = document.querySelector(".chessboard");
    let counter = 0;
    for(let n=8; n>=1; n--) {
        counter++;
        for(let a="a".charCodeAt(0); a<="h".charCodeAt(0); a++) {
            counter++;
            const squareName = String.fromCharCode(a) + n;
            const squareColor = counter % 2 === 0 ? "lightSquare" : "darkSquare";
            const square = document.createElement("div");
            square.id = squareName;
            square.classList.add("squares", squareColor);
            chessboard.appendChild(square);
        }
    }
}
