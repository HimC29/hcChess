export function notnToArrIndex(notn) {
    const file = notn[0].toLowerCase();
    const rank = parseInt(notn[1]);
    if (!/^[a-h]$/.test(file) || isNaN(rank) || rank < 1 || rank > 8) {
        console.error("Invalid notation");
        return;
    }
    return [8 - rank, file.charCodeAt(0) - 97];
}

export function getPieceAt(square) {
    const idx = notnToArrIndex(square);
    return idx ? board[idx[0]][idx[1]] : null;
}

export function setPieceAt(square, piece) {
    const idx = notnToArrIndex(square);
    if(idx) board[idx[0]][idx[1]] = piece;
}