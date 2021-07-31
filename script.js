let isO = true;
let gameboardState = []
let gameSize = 3;

// generate gameboard
const sizeButton = document.querySelector('#gameControls > button')
const generateGameboard = () => {
    gameboardState = []
    const sizeInput = document.querySelector('#gameControls > input')

    gameSize = sizeInput.value;
    let gameboard = document.getElementById('display');
    
    while (gameboard.firstChild) {
        // faster to remove last tree item than first
        gameboard.removeChild(gameboard.lastChild)
    }

    for (row = 1; row <= gameSize; row ++ ) {
        
        gameboardState.push([]);

        for (col = 1; col <= gameSize; col ++ ) {
            gameboardState[row-1].push("")
            const newNode =  document.createElement('div');
            newNode.classList.add(`coord`,`r${row}c${col}`);
            newNode.dataset.row = `${row}`
            newNode.dataset.col = `${col}`
            newNode.textContent = ``;
            gameboard.append(newNode);
        }   
    }
    
    let array = []
    for (i = 0; i < gameSize; i++) {
        array.push("1fr")
    }
    gameboard.style.gridTemplateColumns = array.join(' ');

    gameMechanics();
}
sizeButton.addEventListener('click', generateGameboard)

const checkWinCases = (rowChosen,colChosen) => {

    // check row
    let target = gameboardState[rowChosen-1][colChosen-1]
    let winStates = {
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
        if (gameboardState[i][gameSize-i-1] || gameboardState[i][gameSize-i-1] === "") {
            winStates.antiDiagonalWin = false;
        }
    }

    console.log(Object.values(winStates))
    // return (Object.values(winStates).includes(true)) ? true : false;

    if  {
        return true;
    } else {
        return false;
    }
}

// update nodes when clicked.
const gameMechanics = () => {
    const nodes = document.querySelectorAll('.coord')

    for (let node of nodes) {
        node.addEventListener('click', (event) => {
            const rowChosen = event.target.dataset.row;
            const colChosen = event.target.dataset.col;
            
            // Update mark
            if (!event.target.dataset.mark) {
                event.target.textContent = (isO) ? "O" : "X";
                event.target.dataset.mark = event.target.textContent
                gameboardState[rowChosen-1][colChosen-1] = event.target.textContent
                isO = !isO;
            }

            // Check if win
            console.log("is game win?", checkWinCases(rowChosen,colChosen), "for", event.target.textContent);
        })
    }
}

gameMechanics();