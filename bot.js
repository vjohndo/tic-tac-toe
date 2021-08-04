// index of min, tested.
function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}

// index of min, tested.
function indexOfMin(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var min = arr[0];
    var minIndex = 0;

    for (let i = 0; i < arr.length; i++) {
        if (arr[i] < min) {
            minIndex = i;
            min = arr[i];
        }    
    }
    return minIndex
}

// checks if all elements in array is the same, tested.
const checkArraySame = (arr) => {
    return arr.every(x => Object.is(arr[0], x));
}

// tested
const gameboardWinCheck = (gameboardState) => {
    
    // check diagonals
    let mainDiagToCheck = [];
    let antiDiagToCheck = [];
    for (let i = 0; i < gameSize; i++) {
        mainDiagToCheck.push(gameboardState[i][i]);
        antiDiagToCheck.push(gameboardState[i][gameSize-i-1]);
    }

    if (checkArraySame(mainDiagToCheck) && mainDiagToCheck[0] !== "") {
        return mainDiagToCheck[0];
    } 

    if (checkArraySame(antiDiagToCheck) && antiDiagToCheck[0] !== "") {
        return antiDiagToCheck[0];
    }

    // check all rows
    for (let x = 0; x < gameSize; x++) {
        let rowToCheck = [];
        for (let y = 0; y < gameSize; y++) {
            rowToCheck.push(gameboardState[x][y])
        }
        if (checkArraySame(rowToCheck) && rowToCheck[0] !== "") {
            return rowToCheck[0];
        }
    }

    // check all cols
    for (let y = 0; y < gameSize; y++) {
        let colToCheck = [];
        for (let x = 0; x < gameSize; x++) {
            colToCheck.push(gameboardState[x][y]);   
        }
        if (checkArraySame(colToCheck) && colToCheck[0] !== "") {
            return colToCheck[0];
        }
    }

    return ""
}

// tested, works in the perspective of "X"
const scoreGameX = (gameboardState) => {
    
    let whoWon = gameboardWinCheck(gameboardState)
    
    if (whoWon === "X") {
        return 10;
    } else if (whoWon === "O") {
        return -10;
    } else {
        return 0;
    }
}

// need to make a loop that goes through the array and and creates all possible game states. // tested
const numberOfMovesLeft = (gameboardState) => {
    let possibleMoves = 0;
    for (let x = 0; x < gameboardState.length; x++) {
        for (let y = 0; y < gameboardState.length; y++) {
            if (gameboardState[x][y] === "") {
                possibleMoves ++;
            }
        }
    }
    return possibleMoves
}

// MUST BE PASSED CHAR create a NEW function that given, adds a character at the nth empty section // tested
// array contains references to other objects, need to do a DEEP COPY.
const populateNthEmpty = (gameboardState, n, char) => {
    const newBoard = JSON.parse(JSON.stringify(gameboardState))
    for (let x = 0; x < newBoard.length; x++) {
        for (let y = 0; y < newBoard.length; y++) {
            if (newBoard[x][y] === "") {
                n--;
            }
            if (n <= 0) {
                newBoard[x][y] = char;
                return [newBoard, [x,y]]
            }
        }
    }
}

let xbest = { move: null}

const miniMax = (gameboardState, isNaughtsTurn = false) => {
    // IF THE GAME IS OVER, RETURN SCORE FOR X's PERSPECTIVE
    if (scoreGameX(gameboardState)) {
        return scoreGameX(gameboardState)
    } 

    // CREATE A MOVES LIST CONTRAINING MOVES CORRESPONDING TO THE SCORES
    // CREATE A SCORES LIST CONTAINING SCORES FOR POSSIBLE GAME STATES
    const algoScores = [];
    const algoMoves = [];
    

    // GET A NEW LIST OF GAME STATES
    let numberOfMoves = numberOfMovesLeft(gameboardState);
    let marker = (isNaughtsTurn) ? "O" : "X" ;
    

    // Need to run miniMax here again. 
    for (let n = 1; n <= numberOfMoves; n++) {
        let possibleGameState = populateNthEmpty(gameboardState,n,marker);
        
        // algoScores.push(scoreGameX(newGameState));
        let newGameState = possibleGameState[0];
        algoScores.push(miniMax(newGameState,!isNaughtsTurn));

        let newGameMove = possibleGameState[1];
        algoMoves.push(newGameMove);
    }

    // IF IT WAS THE PLAYER'S O's TURN RETURN MIN SCORE
    if (isNaughtsTurn) {
        let minIndex = indexOfMin(algoScores);
        return algoScores[minIndex];
    // IF IT WAS THE COMP'S TURN X's, RETURN MAX SCORE
    } else {
        let maxIndex = indexOfMax(algoScores);
        xbest.move = algoMoves[maxIndex];
        return algoScores[maxIndex]
    }
}

const markBoard = (arr) => {
    const targetNode = document.querySelector(`.r${arr[0]}c${arr[1]}`);

    const rowChosen = targetNode.dataset.row;
    const colChosen = targetNode.dataset.col;

    movesMade ++;
    targetNode.textContent = (isNaughtsTurn) ? "O" : "X";
    targetNode.classList.add(targetNode.textContent.toLowerCase());
    targetNode.style.userSelect = 'none'
    gameboardState[rowChosen-1][colChosen-1] = targetNode.textContent
    isNaughtsTurn = !isNaughtsTurn;

    // Check if win
    isWinner = (checkWinCases(rowChosen,colChosen));

    if (isWinner) {
        gamelog.textContent = `Game has been won by ${(!isNaughtsTurn)?"O":"X"}`
        whoWon = (!isNaughtsTurn)?"O":"X"
        makeUnclickable()
    } else if (movesMade === moveLimit) {
        gamelog.textContent = `It's a draw`
        whoWon = "draw"
        makeUnclickable()
    } else {
        gamelog.textContent = `Player's Turn: ${(isNaughtsTurn)?"O":"X"}`;
    }
}