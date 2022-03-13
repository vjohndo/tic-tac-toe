// BOT SCRIPT //

// Finds index of max value. Somewhat random chooses max if there are multiple of the same.
const indexOfMax = (arr) => {
    if (arr.length === 0) {
        return -1;
    }

    let max = arr[0];
    let maxIndex = 0;

    for (let i = 1; i < arr.length; i++) {
        let rand = Math.random();
        if (arr[i] === max && rand >= (0.65)) {
            maxIndex = i;
            max = arr[i];
        } else if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }
    return maxIndex;
}

// Finds index of min value. Somewhat random chooses max if there are multiple of the same.
const indexOfMin = (arr) => {
    if (arr.length === 0) {
        return -1;
    }

    let min = arr[0];
    let minIndex = 0;

    for (let i = 0; i < arr.length; i++) {
        let rand = Math.random();
        if (arr[i] === min && rand >= 0.5) {
            minIndex = i;
            min = arr[i];
        }
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

// calculates the number of moves for a given gamestate
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

// populates a gamesate at the ith empty index with marker
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

// object to hold X's best move
const xBest = {move: null};
        
// Minimax algorithm
const miniMax = (gameState, isOTurn = false) => {
    
    // for the GIVEN game state, if the game is over, return score for "X"
    let isGameOver = Boolean(gameboardWinCheck(gameState))
    if (isGameOver) {
        return scoreGameFor("X",gameState);
    } 

    const possibleScores = [];
    const possibleMoves = [];
    
    let movesLeft = numMovesLeft(gameState);
    let mark = currentMark(isOTurn);

    // For the remaning possible games, generate a new possible game state
    // As the game states may not be over, run miniMax on those games states, but flipping the turn
    // push scores and moves to above array
    for (let i = 0; i < movesLeft; i++) {
        let possibleGame = populateAtEmptyIndex(gameState,i,mark);
        
        possibleScores.push(miniMax(possibleGame.state,!isOTurn));
        possibleMoves.push(possibleGame.move);
    }

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

// Function to run in console for testing
const runMiniMax = () => {
    miniMax(gameState,isOTurn);
    console.log(xBest.move);
}

// Funtion that marks the board with bot's best move... could have refactored this with "node clicked"
const markBoard = () => {

    // Adds back clicks
    enablePlayerClick();
    
    miniMax(gameState,isOTurn);
    let arr = xBest.move;
    const targetNode = document.querySelector(`.r${arr[0]}c${arr[1]}`);

    removeHoverState(targetNode);

    const rowChosen = targetNode.dataset.row;
    const colChosen = targetNode.dataset.col;

    movesMade ++;
    targetNode.textContent = currentMark(isOTurn);
    targetNode.classList.add(targetNode.textContent.toLowerCase());
    targetNode.classList.add('bot');
    targetNode.style.userSelect = 'none'
    gameState[rowChosen][colChosen] = targetNode.textContent;
    isOTurn = !isOTurn;

    updateGameResult();
}