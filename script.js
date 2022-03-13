// Grab global DOM elements
const resetButton = document.querySelector('#reset')
const botButton = document.querySelector('#bot')
const sizeInput = document.querySelector('#numInput')
const gamelog = document.querySelector('#gamelog')
const root = document.documentElement
const oRadio = document.querySelector('#oRadio')
const xRadio = document.querySelector('#xRadio')

// Inisialise game variables upon start of game
oRadio.checked = true;
let isOTurn = true;
let gameState = []
let gameSize = 3;
let moveLimit = 9;
let movesMade = 0;
let gameCheckResult = false;
let isGameOver = false;
let whoWon = "" 
let isBotOn = false;

// Event listeners for radio buttons to alternate and restart the game
const xStart = (event) => {
    oRadio.checked = false
    if (movesMade === 0 || isBotOn) {
        generateGameboard();
    }
    if (isBotOn && !isOTurn) {
        markBoard();
    }
}
const oStart = (event) => {
    xRadio.checked = false
    if (movesMade === 0 || isBotOn) {
        generateGameboard();
    }
}
xRadio.addEventListener('click',xStart);
oRadio.addEventListener('click',oStart);

// Allow bot to be toggled if game is not active. 
const toggleBot = () => {
    if (gameSize === 3) {
        if (movesMade === 0 || isGameOver) {
            isBotOn = !isBotOn;
            botButton.classList.toggle('botOn');
            if (isBotOn && !isOTurn) {
                // Delays the first placement by the bot for better experience.
                markBoard();
            }
        } else {
            gamelog.textContent = "Try again when game is finished or rest!";
        }
    }
}
botButton.addEventListener('click',toggleBot)

// Function for determining who if game is starting
const currentMark = (isOTurn) => (isOTurn)?"O":"X";

// Function to check if all elements in an array are the same
const arraySameCheck = (arr) => {
    return arr.every(x => Object.is(arr[0], x));
}

// Function that updates Bot Button class 
const updateBotButton = () => {
    if (gameSize !== 3 && isBotOn) {
        botButton.classList.remove('botOn');
        isBotOn = false;
    }
    if (gameSize === 3 && !isBotOn) {
        botButton.classList.add('botAvailable');
    } else {
        botButton.classList.remove('botAvailable');
    }
}

// Inisialise the games state variables upon start.
const initVariables = () => {
    isGameOver = false;
    isOTurn = oRadio.checked;
    whoWon = ""
    gameState = [];
    movesMade = 0;
    gamelog.textContent = `Player's Turn: ${currentMark(isOTurn)}`;
}

// Checks if there are any win cases
// Does this by pushing each row/col/diag to an array and checking if same
// Returns 'DRAW' 'X' 'O' for end game states, otherwise ''
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

// Function that removes all node events after game is over.
const removeNodeEvents = () => {
    const nodes = document.querySelectorAll('.coord')
        for (let node of nodes) {
            node.removeEventListener('click', nodeClicked);
            node.removeEventListener('mouseover', nodeMouseEnter);
            node.removeEventListener('mouseleave', nodeMouseLeave);
        }
}

// Function that removes clicks
const disablePlayerClick = () => {
    const nodes = document.querySelectorAll('.coord');
    for (let node of nodes) {
        if (!(node.classList.contains('o') || node.classList.contains('x'))) {
            node.removeEventListener('click', nodeClicked);
            node.removeEventListener('mouseover', nodeMouseEnter);
            node.removeEventListener('mouseleave', nodeMouseLeave);
        }
    }
}

const enablePlayerClick = () => {
    const nodes = document.querySelectorAll('.coord');
    for (let node of nodes) {
        if (!(node.classList.contains('o') || node.classList.contains('x'))) {
            node.addEventListener('click', nodeClicked);
            node.addEventListener('mouseover', nodeMouseEnter);
            node.addEventListener('mouseleave', nodeMouseLeave);
        }
    }
}

// Call back function for the adding in the hover effect
const nodeMouseEnter = (event) => {
    event.target.textContent = currentMark(isOTurn);
    event.target.classList.add(currentMark(isOTurn));
}

// Call back function for removing the hover effect after mouse leaves
const nodeMouseLeave = (event) => {
    event.target.textContent = "";
    event.target.classList.remove(currentMark(isOTurn));
}

// Removes hover features
const removeHoverState = (object) => {
    object.removeEventListener('mouseover', nodeMouseEnter);
    object.removeEventListener('mouseleave', nodeMouseLeave);
    object.classList.remove(currentMark(isOTurn));
}

// Check game result
const updateGameResult = () => {

    const botQuips = [
                    `BOT makes the best possible move`, 
                    `BOT refuses to lose`,
                    `BOT counters your move`,
                    `BOT uses the minimax decision rule`,
                    `BOT goes on the offence`,
                    `BOT uses "stategise" to make a move`,
                    `BOT seeks victory at all costs`,
                    `BOT responds to your challenge`,
                    `BOT is trying to defeat you`,
                    `BOT is in search of victory`,
                    `BOT is determined to win`,
                    `BOT plays a stylish move`,
                    `BOT tries to make a winning play`,
                    `BOT makes a move in response`,
                    `BOT sees through your play`,
                    `BOT uses all its might to move`,
                ]

    gameCheckResult = (gameboardWinCheck(gameState));
    if (gameCheckResult === "O" || gameCheckResult === "X") {
        gamelog.textContent = `WINNER IS ${currentMark(!isOTurn)}!`;
        whoWon = currentMark(!isOTurn);
        isGameOver = true;
        removeNodeEvents();
        if (isBotOn) {
            gamelog.textContent = `BOT WINS!`;
        }
    } else if (movesMade === moveLimit) {
        gamelog.textContent = `IT'S A DRAW`;
        isGameOver = true;
        removeNodeEvents();
    } else {
        gamelog.textContent = `Player's Turn: ${currentMark(isOTurn)}`;
        if (isBotOn) {
            gamelog.textContent = botQuips[Math.floor(botQuips.length * Math.random())]
        }
    }
}

// Call back function that runs if a node is clicked
const nodeClicked = (event) => {

    removeHoverState(event.target);

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

        disablePlayerClick();

        // Code that runs only when 
        if (!(isBotOn && !isOTurn && (movesMade < moveLimit))) {
            enablePlayerClick();
            updateGameResult();
        }        
    }
    if (isBotOn && !isOTurn && (movesMade < moveLimit)) {
        disablePlayerClick();
        setTimeout(markBoard,Math.floor(Math.random() * 300) + 200);
    } 
}

// As the gameboard is being generated, each node added with event listeners
const addNodeEvents = () => {
    const nodes = document.querySelectorAll('.coord')
    for (let node of nodes) {
        node.addEventListener('click', nodeClicked);
        node.addEventListener('mouseover', nodeMouseEnter);
        node.addEventListener('mouseleave', nodeMouseLeave);
    }
}

// Function to generate the game board
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

    // If the bot is on and it is X's turn run the bot.
    if (isBotOn && !isOTurn) {
        markBoard();
    };
}

// Generates first board on game start & make enter on num input work
(() => {
    generateGameboard();
    gamelog.textContent = "Click BOT 'X' button when board size is 3";
    resetButton.addEventListener('click', generateGameboard)
    sizeInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {generateGameboard()}
    });
})(window);