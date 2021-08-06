const resetButton = document.querySelector('#reset')
const botButton = document.querySelector('#bot')
const sizeInput = document.querySelector('#textInput')
const gamelog = document.querySelector('#gamelog')
const root = document.documentElement
const oRadio = document.querySelector('#oRadio')
const xRadio = document.querySelector('#xRadio')

const xStart = (event) => {
        oRadio.checked = false
        generateGameboard();
}
const oStart = (event) => {
        xRadio.checked = false
        generateGameboard();
}
xRadio.addEventListener('click',xStart);
oRadio.addEventListener('click',oStart);

oRadio.checked = true;
let isOTurn = true;
let gameState = []
let gameSize = 3;
let moveLimit = 9;
let movesMade = 0;
let gameCheckResult = false;
let isGameOver = false;
let whoWon = "" // takes on "X","O",""
let isBotOn = false;

const toggleBot = () => {
    if (gameSize === 3) {
        if (movesMade === 0 || isGameOver) {
            isBotOn = !isBotOn;
            botButton.classList.toggle('botOn');
            if (isBotOn && !isOTurn) {
                setTimeout(markBoard(),500);
            }
        }
    }
}

botButton.addEventListener('click',toggleBot)


const currentMark = (isOTurn) => (isOTurn)?"O":"X";

const updateBotButton = () => {
    if (gameSize !== 3 && isBotOn) {
        botButton.classList.toggle('botOn');
    }
    if (gameSize === 3) {
        botButton.classList.add('botAvailable');
    } else {
        botButton.classList.remove('botAvailable');
    }
}

const initVariables = () => {
    isGameOver = false;
    isOTurn = oRadio.checked;
    whoWon = ""
    gameState = [];
    movesMade = 0;
    gamelog.textContent = `Player's Turn: ${currentMark(isOTurn)}`;
}

const arraySameCheck = (arr) => {
    return arr.every(x => Object.is(arr[0], x));
}

const gameboardWinCheck = (gameState) => {
    
    let mainDiagToCheck = [];
    let antiDiagToCheck = [];
    let isDraw = true;

    for (let x = 0; x < gameSize; x++) {
        mainDiagToCheck.push(gameState[x][x]);
        antiDiagToCheck.push(gameState[x][gameSize-x-1]);

        let rowToCheck = [];
        let colToCheck = [];
        for (let y = 0; y < gameSize; y++) {
            rowToCheck.push(gameState[x][y]);
            colToCheck.push(gameState[y][x]);
            if (gameState[x][y] === "") {
                isDraw = false;
            }
        }
        if (arraySameCheck(rowToCheck) && rowToCheck[0] !== "") {
            return rowToCheck[0];
        }
        if (arraySameCheck(colToCheck) && colToCheck[0] !== "") {
            return colToCheck[0];
        }
    }

    if (arraySameCheck(mainDiagToCheck) && mainDiagToCheck[0] !== "") {
        return mainDiagToCheck[0];
    } 
    if (arraySameCheck(antiDiagToCheck) && antiDiagToCheck[0] !== "") {
        return antiDiagToCheck[0];
    }
    if (isDraw) {
        return "DRAW"
    }
    return ""
}

const removeNodeEvents = () => {
    const nodes = document.querySelectorAll('.coord')
        for (let node of nodes) {
            node.removeEventListener('click', nodeClicked);
            node.removeEventListener('mouseover', nodeMouseEnter);
            node.removeEventListener('mouseleave', nodeMouseLeave);
        }
}

const nodeClicked = (event) => {

    event.target.removeEventListener('mouseover', nodeMouseEnter);
    event.target.removeEventListener('mouseleave', nodeMouseLeave);
    event.target.classList.remove(currentMark(isOTurn));

    const rowChosen = event.target.dataset.row;
    const colChosen = event.target.dataset.col;

    if (!event.target.classList.contains('x') && !event.target.classList.contains('o')) {
        event.target.textContent = ""

        movesMade ++;
        event.target.textContent = currentMark(isOTurn);
        event.target.classList.add(event.target.textContent.toLowerCase());
        event.target.style.userSelect = 'none'
        gameState[rowChosen][colChosen] = event.target.textContent;
        
        // GLOBAL GAME VARIABLE FLIPPED
        isOTurn = !isOTurn;

        gameCheckResult = (gameboardWinCheck(gameState));
        if (gameCheckResult === "O" || gameCheckResult === "X") {
            gamelog.textContent = `Game has been won by ${currentMark(!isOTurn)}`;
            whoWon = currentMark(!isOTurn);
            isGameOver = true;
            removeNodeEvents();
        } else if (movesMade === moveLimit) {
            gamelog.textContent = `It's a draw`;
            isGameOver = true;
            removeNodeEvents();
        } else {
            gamelog.textContent = `Player's Turn: ${currentMark(isOTurn)}`;
        }
    }
    if (isBotOn && !isOTurn && (movesMade < moveLimit)) {
        markBoard();
    } 
}

const nodeMouseEnter = (event) => {
    event.target.textContent = currentMark(isOTurn);
    event.target.classList.add(currentMark(isOTurn));
}

const nodeMouseLeave = (event) => {
    event.target.textContent = "";
    event.target.classList.remove(currentMark(isOTurn));
}


const addNodeEvents = () => {
    const nodes = document.querySelectorAll('.coord')
    for (let node of nodes) {
        node.addEventListener('click', nodeClicked);
        node.addEventListener('mouseover', nodeMouseEnter);
        node.addEventListener('mouseleave', nodeMouseLeave);
    }
}

const generateGameboard = () => {
    
    initVariables();
    
    gameSize = Number(sizeInput.value);
    moveLimit = gameSize * gameSize;

    updateBotButton();

    // Update CSS variable
    root.style.setProperty('--game-size', gameSize);

    // Clear any existing gameboard
    let gameboard = document.getElementById('display');
    while (gameboard.firstChild) {
        gameboard.removeChild(gameboard.lastChild)
    }

    // Create new nodes 
    for (row = 0; row < gameSize; row ++ ) {
        gameState.push([]);

        for (col = 0; col < gameSize; col ++ ) {
            gameState[row].push("")
            const newNode =  document.createElement('div');
            newNode.classList.add(`coord`,`r${row}c${col}`);
            newNode.dataset.row = `${row}`
            newNode.dataset.col = `${col}`
            newNode.textContent = ``;
            gameboard.append(newNode);
        }   
    }
    
    // Update grid template columns
    let array = []
    for (i = 0; i < gameSize; i++) {
        array.push("1fr")
    }
    gameboard.style.gridTemplateColumns = array.join(' ');

    // Make nodes clickable
    addNodeEvents();

    if (isBotOn && !isOTurn) {
        setTimeout(markBoard(),500);
    };
}

(() => {
    generateGameboard();
    gamelog.textContent = `Simulation On`
    resetButton.addEventListener('click', generateGameboard)
    sizeInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {generateGameboard()}
    });
})(window);

