const sizeButton = document.querySelector('#gameControls > button')
const sizeInput = document.querySelector('#gameControls > input')
const gamelog = document.querySelector('#gamelog')
let isO = true;
let gameboardState = []
let gameSize = 3;
let moveLimit = 9;
let moves = 0;
let isWinner = false;

const initialiseVariables = () => {
    gameboardState = [];
    movesMade = 0;
    gamelog.textContent = `Player's Turn: ${(isO)?"O":"X"}`;
}

// generate gameboard
const generateGameboard = () => {
    initialiseVariables()
    
    gameSize = sizeInput.value;
    moveLimit = gameSize * gameSize;
    let gameboard = document.getElementById('display');
    
    while (gameboard.firstChild) {
        // faster to remove last tree item than first
        gameboard.removeChild(gameboard.lastChild)
    }

    // Create new nodes aka tiles for game board
    for (row = 1; row <= gameSize; row ++ ) {
        gameboardState.push([]);

        for (col = 1; col <= gameSize; col ++ ) {
            gameboardState[row-1].push("")
            const newNode =  document.createElement('div');
            newNode.classList.add(`coord`,`r${row}c${col}`);
            newNode.dataset.row = `${row}`
            newNode.dataset.col = `${col}`
            newNode.textContent = ``;
            newNode.style.height = `${900/gameSize}px`
            newNode.style.fontSize = `${900/gameSize*0.8}px` 
            gameboard.append(newNode);
        }   
    }
    
    // Update grid template columns
    let array = []
    for (i = 0; i < gameSize; i++) {
        array.push("1fr")
    }
    gameboard.style.gridTemplateColumns = array.join(' ');

    // Run game mechanics
    makeClickable();
}
const checkWinCases = (rowChosen,colChosen) => {

    const target = gameboardState[rowChosen-1][colChosen-1]
    const winStates = {
        rowWin: true,
        colWin: true,
        mainDiagonalWin: true,
        antiDiagonalWin: true,
    }

    for (let i = 0; i < gameSize; i++) {
        if (gameboardState[i][colChosen-1] !== target) {
            winStates.rowWin = false;
        }
        if (gameboardState[rowChosen-1][i] !== target) {
            winStates.colWin = false;
        }
        if (gameboardState[i][i] !== target || gameboardState[i][i] === "") {
            winStates.mainDiagonalWin = false;
        }
        if (gameboardState[i][gameSize-i-1] !== target || gameboardState[i][gameSize-i-1] === "") {
            winStates.antiDiagonalWin = false;
        }
    }

    return (Object.values(winStates).includes(true)) ? true : false;
}
const clickMechanics = (event) => {
    const rowChosen = event.target.dataset.row;
    const colChosen = event.target.dataset.col;
    console.log('is firing')

    // Update mark
    if (!event.target.textContent) {
        movesMade ++;
        event.target.textContent = (isO) ? "O" : "X";
        event.target.classList.add(event.target.textContent.toLowerCase());
        event.target.style.userSelect = 'none'
        gameboardState[rowChosen-1][colChosen-1] = event.target.textContent
        isO = !isO;

        // Check if win
        isWinner = (checkWinCases(rowChosen,colChosen));

        if (isWinner) {
            gamelog.textContent = `Game has been won by ${(!isO)?"O":"X"}`
            makeUnclickable()
        } else if (movesMade === moveLimit) {
            gamelog.textContent = `It's a draw`
            makeUnclickable()
        } else {
            gamelog.textContent = `Player's Turn: ${(isO)?"O":"X"}`;
        }
    }
}
const makeUnclickable = () => {
    const nodes = document.querySelectorAll('.coord')
        for (let node of nodes) {
            node.removeEventListener('click', clickMechanics)
        }
}
// update nodes when clicked.
const makeClickable = () => {
    // Go through each node, add in row/col data, text content and update gameboard
    const nodes = document.querySelectorAll('.coord')
    for (let node of nodes) {
        node.addEventListener('click', clickMechanics)
    }
}

generateGameboard();
gamelog.textContent = `Welome to Tic-Tac-Toe`
sizeButton.addEventListener('click', generateGameboard)
sizeInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      generateGameboard()
    }
});