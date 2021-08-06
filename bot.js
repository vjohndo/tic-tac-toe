// BOT SCRIPT ONLY...

function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }

    let max = arr[0];
    let maxIndex = 0;

    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}

function indexOfMin(arr) {
    if (arr.length === 0) {
        return -1;
    }

    let min = arr[0];
    let minIndex = 0;

    for (let i = 0; i < arr.length; i++) {
        if (arr[i] < min) {
            minIndex = i;
            min = arr[i];
        }    
    }
    return minIndex
}

// needs to score game for given game state.
const scoreGameFor = (marker, gameState) => {
    
    let whoWon = gameboardWinCheck(gameState);
    let opponent = (marker==="X")?"O":"X";

    // whoWon is a global variable
    if (whoWon === marker) {
        return 10;
    } else if (whoWon === opponent) {
        return -10;
    } else {
        return 0;
    }
}

const numMovesLeft = (gameState) => {
    let possibleMoves = 0;
    for (let x = 0; x < gameSize; x++) {
        for (let y = 0; y < gameSize; y++) {
            if (gameState[x][y] === "") {
                possibleMoves ++;
            }
        }
    }
    return possibleMoves
}

const populateAtEmptyIndex = (gameState, i ,marker) => {
    const possibleGameState = JSON.parse(JSON.stringify(gameState))
    
    for (let x = 0; x < gameSize; x++) {
        for (let y = 0; y < gameSize; y++) {
            if (possibleGameState[x][y] === "") {
                i--;
            }
            if (i < 0) {
                possibleGameState[x][y] = marker;
                return {
                        state: possibleGameState,
                        move: [x,y]
                    }
            }
        }
    }
}

const xBest = {
                move: null,
                score: null
            };
        
// Currently only works for "X", must therefore start on isOTurn = false.
const miniMax = (gameState, isOTurn = false) => {
    // for the GIVEN game state, is the game over.
    let isGameOver = Boolean(gameboardWinCheck(gameState))
    if (isGameOver) {
        return scoreGameFor("X",gameState);
    } 

    const possibleScores = [];
    const possibleMoves = [];
    
    let movesLeft = numMovesLeft(gameState);
    let mark = currentMark(isOTurn);

    for (let i = 0; i < movesLeft; i++) {
        let possibleGame = populateAtEmptyIndex(gameState,i,mark);
        
        possibleScores.push(miniMax(possibleGame.state,!isOTurn));
        possibleMoves.push(possibleGame.move);
    }

    xBest.score = possibleScores;

    // IF IT WAS THE PLAYER'S O's TURN RETURN MIN SCORE
    if (isOTurn) {
        let minIndex = indexOfMin(possibleScores);
        xBest.move = possibleMoves[minIndex];
        return possibleScores[minIndex];
    // IF IT WAS THE COMP'S TURN X's, RETURN MAX SCORE
    } else {
        let maxIndex = indexOfMax(possibleScores);
        xBest.move = possibleMoves[maxIndex];
        return possibleScores[maxIndex]
    }
}

const runMiniMax = () => {
    miniMax(gameState,isOTurn);
    console.log(xBest.move);
}

const markBoard = () => {
    miniMax(gameState,isOTurn)
    let arr = xBest.move
    const targetNode = document.querySelector(`.r${arr[0]}c${arr[1]}`);
    console.log(`.r${arr[0]}c${arr[1]}`)

    const rowChosen = targetNode.dataset.row;
    const colChosen = targetNode.dataset.col;

    movesMade ++;
    targetNode.textContent = currentMark(isOTurn);
    targetNode.classList.add(targetNode.textContent.toLowerCase());
    targetNode.style.userSelect = 'none'
    gameState[rowChosen][colChosen] = targetNode.textContent
    isOTurn = !isOTurn;

    isWinner = Boolean(gameboardWinCheck(gameState));
    if (isWinner) {
        gamelog.textContent = `Game has been won by ${currentMark(!isOTurn)}`
        whoWon = currentMark(!isOTurn);
        isGameOver = true;
        removeNodeEvents();
    } else if (movesMade === moveLimit) {
        gamelog.textContent = `It's a draw`
        isGameOver = true;
        removeNodeEvents()
    } else {
        gamelog.textContent = `Player's Turn: ${currentMark(isOTurn)}`;
    }
}

