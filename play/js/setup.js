// setup.js
import { Pawn, Rook, Knight, Bishop, Queen, King } from "./pieces.js";

export function placeStartingPieces(boardRef) {
    // pawns
    for(let a="a".charCodeAt(0); a<="h".charCodeAt(0); a++){
        const file = String.fromCharCode(a);
        new Pawn("w", `${file}2`, boardRef);
        new Pawn("b", `${file}7`, boardRef);
    }

    const pieceSetup = [
        { type: Rook, color: "w", positions: ["a1","h1"] },
        { type: Knight, color: "w", positions: ["b1","g1"] },
        { type: Bishop, color: "w", positions: ["c1","f1"] },
        { type: Queen, color: "w", positions: ["d1"] },
        { type: King, color: "w", positions: ["e1"] },
        { type: Rook, color: "b", positions: ["a8","h8"] },
        { type: Knight, color: "b", positions: ["b8","g8"] },
        { type: Bishop, color: "b", positions: ["c8","f8"] },
        { type: Queen, color: "b", positions: ["d8"] },
        { type: King, color: "b", positions: ["e8"] },
    ];

    for(const piece of pieceSetup){
        for(const pos of piece.positions){
            new piece.type(piece.color, pos, boardRef);
        }
    }
}
