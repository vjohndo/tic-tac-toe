const fastWinCheck = (rowChosen,colChosen) => {

    const target = gameState[rowChosen][colChosen]
    const winStates = {
        rowWin: true,
        colWin: true,
        mainDiagonalWin: true,
        antiDiagonalWin: true,
    }

    for (let i = 0; i < gameSize; i++) {
        if (gameState[i][colChosen-1] !== target) {
            winStates.rowWin = false;
        }
        if (gameState[rowChosen-1][i] !== target) {
            winStates.colWin = false;
        }
        if (gameState[i][i] !== target || gameState[i][i] === "") {
            winStates.mainDiagonalWin = false;
        }
        if (gameState[i][gameSize-i-1] !== target || gameState[i][gameSize-i-1] === "") {
            winStates.antiDiagonalWin = false;
        }
    }

    return (Object.values(winStates).includes(true)) ? true : false;
}