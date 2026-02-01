// main.js
import { board, createSquares } from "./board.js";
import { placeStartingPieces } from "./setup.js";
import { detectSquareClick, renderPieces } from "./pieces.js";

createSquares();
placeStartingPieces(board);
renderPieces();
detectSquareClick();
console.log(board);
