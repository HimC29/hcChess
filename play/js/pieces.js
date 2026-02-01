// pieces.js
import { notnToArrIndex } from "./utils.js";
import { board } from "./board.js";

export class Piece {
    constructor(color, type, position, board) {
        this.color = color;
        this.type = type;
        this.position = position;
        this.board = board;
        this.#updateArray();
    }
    #updateArray() {
        this.board.setPieceAt(this.position, this);
    }
}

export function renderPieces() {
    const squares = document.querySelectorAll(".squares");
    squares.forEach(e => {
        e.innerHTML = "";
    });
    for(let n=8; n>=1; n--) {
        for(let a="a".charCodeAt(0); a<="h".charCodeAt(0); a++) {
            const notn = String.fromCharCode(a) + n;
            const piece = board.getPieceAt(notn);
            if(!piece) continue;
            const square = document.getElementById(notn);        
            const icon = document.createElement("img");
            icon.classList.add(piece.type, "piece");
            icon.src = `../media/${piece.type}-${piece.color}.svg`;
            icon.draggable = false;
            square.appendChild(icon);
        }
    }
}

let selectedPiece = false;
let turn = "w";

/** Returns true if every square between startPos and endPos (exclusive) is empty. */
function pathIsClear(startPos, endPos) {
    const sFile = startPos[0].charCodeAt(0);
    const sRank = parseInt(startPos[1], 10);
    const eFile = endPos[0].charCodeAt(0);
    const eRank = parseInt(endPos[1], 10);
    const fileStep = eFile === sFile ? 0 : (eFile > sFile ? 1 : -1);
    const rankStep = eRank === sRank ? 0 : (eRank > sRank ? 1 : -1);
    const dist = Math.max(Math.abs(eFile - sFile), Math.abs(eRank - sRank));
    for (let i = 1; i < dist; i++) {
        const file = sFile + i * fileStep;
        const rank = sRank + i * rankStep;
        const notn = String.fromCharCode(file) + rank;
        if (board.getPieceAt(notn)) return false;
    }
    return true;
}

function isValidMove(piece, endPos) {
    const pieceAtEnd = board.getPieceAt(endPos);
    if(pieceAtEnd && pieceAtEnd.color === turn) {
        unselectPiece(selectedPiece);
        return false;
    }
    const endPosSliced = endPos.slice();
    const startPosSliced = piece.position.slice();
    const endFiles = endPosSliced[0];
    const endRanks = endPosSliced[1].codePointAt(0);
    const startFiles = startPosSliced[0];
    const startRanks = startPosSliced[1].codePointAt(0);
    switch(piece.type) {
        case "pawn":
            let rankStep;
            if(turn === "w") rankStep = 1;
            else if(turn === "b") rankStep = -1;

            const oneStepRank = parseInt(startRanks) + rankStep;
            const twoStepRank = parseInt(startRanks) + rankStep * 2; // only valid on first move
            const endRankNum = parseInt(endRanks);
            const isOneStep = endRankNum === oneStepRank;
            const isTwoStep = piece.firstMove && endRankNum === twoStepRank;

            // Diagonal move = capture only (one square diagonally forward, must have enemy piece)
            if(startFiles !== endFiles) {
                const fileDiff = Math.abs(endFiles.charCodeAt(0) - startFiles.charCodeAt(0));
                const isOneFile = fileDiff === 1;
                const isOneRankForward = endRankNum === oneStepRank;
                if(isOneFile && isOneRankForward && pieceAtEnd && pieceAtEnd.color !== turn) {
                    return true; // valid capture
                }
                unselectPiece(selectedPiece);
                return false;
            }

            // Straight move: 1 or 2 squares forward, destination must be empty
            if(!isOneStep && !isTwoStep) {
                unselectPiece(selectedPiece);
                return false;
            }
            if(isTwoStep) {
                const midNotn = startFiles + oneStepRank;
                if(board.getPieceAt(midNotn)) {
                    unselectPiece(selectedPiece);
                    return false;
                }
            }
            if(board.getPieceAt(endPos)) {
                unselectPiece(selectedPiece);
                return false;
            }
            return true;
        case "knight":
            const fileDiff = Math.abs(endFiles.charCodeAt(0) - startFiles.charCodeAt(0));
            const rankDiff = Math.abs(endRanks - startRanks);
            if(fileDiff === 2 && rankDiff === 1 || fileDiff === 1 && rankDiff === 2) {
                return true;
            }
            unselectPiece(selectedPiece);
            return false;
        case "bishop": {
            const bishopFileDiff = Math.abs(endFiles.charCodeAt(0) - startFiles.charCodeAt(0));
            const bishopRankDiff = Math.abs(parseInt(endRanks) - parseInt(startRanks));
            if (bishopFileDiff !== bishopRankDiff) {
                unselectPiece(selectedPiece);
                return false;
            }
            if (!pathIsClear(piece.position, endPos)) {
                unselectPiece(selectedPiece);
                return false;
            }
            return true;
        }
        case "rook": {
            const sameFile = startFiles === endFiles;
            const sameRank = startRanks === endRanks;
            if (!sameFile && !sameRank) {
                unselectPiece(selectedPiece);
                return false;
            }
            if (!pathIsClear(piece.position, endPos)) {
                unselectPiece(selectedPiece);
                return false;
            }
            return true;
        }
        case "queen": {
            const queenFileDiff = Math.abs(endFiles.charCodeAt(0) - startFiles.charCodeAt(0));
            const queenRankDiff = Math.abs(parseInt(endRanks) - parseInt(startRanks));
            if(queenFileDiff !== queenRankDiff) {
                unselectPiece(selectedPiece);
                return false;
            }
            return true;
        }
        case "king": {
            const kingFileDiff = Math.abs(endFiles.charCodeAt(0) - startFiles.charCodeAt(0));
            const kingRankDiff = Math.abs(parseInt(endRanks) - parseInt(startRanks));
            if(kingFileDiff !== kingRankDiff) {
                unselectPiece(selectedPiece);
                return false;
            }
            return true;
        }
        default:
            console.error("Unknown piece:", piece);
            unselectPiece(selectedPiece);
            return false;
    }
}

function executeMove(piece, endPos) {
    if(!piece) return; 
    const pieceAtEnd = board.getPieceAt(endPos);
    if(pieceAtEnd && pieceAtEnd.color === turn) {
        unselectPiece(selectedPiece);
        selectPiece(pieceAtEnd);
    }
    if(!isValidMove(piece, endPos)) return;
    if(piece.color !== turn) return;

    unselectPiece(selectedPiece);
    board.setPieceAt(piece.position, 0);
    board.setPieceAt(endPos, piece);
    piece.position = endPos;
    if(piece.type === "pawn") piece.firstMove = false;
    renderPieces();
    turn = turn === "w" ? "b" : "w";
}

export function detectSquareClick() {
    const squares = document.querySelectorAll(".squares");
    squares.forEach(e => {
        e.addEventListener("click", () => {

            const squareIndex = notnToArrIndex(e.id);
            const squareData = board.data[squareIndex[0]][squareIndex[1]];

            if (!selectedPiece) {
                if (squareData && squareData.color === turn) selectPiece(squareData);
            } else {
                if (squareData && squareData.color === turn) {
                    selectPiece(squareData); // switch selection to this piece
                } else {
                    executeMove(selectedPiece, e.id);
                }
            }
        });
    });
}

function selectPiece(square){
    const squareEl = document.getElementById(square.position);
    document.querySelectorAll(".squares").forEach(e => {
        e.classList.remove("highlighted");
    });
    if(square.color != turn) return;
    squareEl.classList.add("highlighted");
    selectedPiece = square;
}
function unselectPiece(square) {
    if(!square) return;
    const squareEl = document.getElementById(square.position);
    if(!squareEl) return;
    squareEl.classList.remove("highlighted");
    selectedPiece = false;
}

export class Pawn extends Piece {
    constructor(color, pos, board){
        super(color, "pawn", pos, board);
        this.firstMove = true; // allows 2-square move once per pawn
    }
}
export class Knight extends Piece {
    constructor(color, pos, board) {
        super(color, "knight", pos, board);
    }
}
export class Bishop extends Piece {
    constructor(color, pos, board) {
        super(color, "bishop", pos, board);
    }
}
export class Rook extends Piece {
    constructor(color, pos, board) {
        super(color, "rook", pos, board);
    }
}
export class Queen extends Piece {
    constructor(color, pos, board) {
        super(color, "queen", pos, board);
    }
}
export class King extends Piece {
    constructor(color, pos, board) { 
    super(color, "king", pos, board);
    }
}
