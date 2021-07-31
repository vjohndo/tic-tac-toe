let isO = true;

// generate gameboard
const sizeButton = document.querySelector('#gameControls > button')

const generateGameboard = () => {
    const sizeInput = document.querySelector('#gameControls > input')

    let gameSize = sizeInput.value;
    let gameboard = document.getElementById('display');
    
    while (gameboard.firstChild) {
        // faster to remove last tree item than first
        gameboard.removeChild(gameboard.lastChild)
    }

    for (row = 1; row <= gameSize; row ++ ) {
        for (col = 1; col <= gameSize; col ++ ) {
            const newNode =  document.createElement('div');
            newNode.classList.add(`coord`,`r${row}c${col}`);
            newNode.textContent = `r${row}c${col}`;
            gameboard.append(newNode);
        }   
    }
    
    let array = []
    for (i = 0; i < gameSize; i++) {
        array.push("auto")
    }
    gameboard.style.gridTemplateColumns = array.join(' ');

    gameMechanics();
}
sizeButton.addEventListener('click', generateGameboard)

// update nodes when clicked.
const gameMechanics = () => {
    const nodes = document.querySelectorAll('.coord')

    for (let node of nodes) {
        node.addEventListener('click', (event) => {
            if (!event.target.dataset.mark) {
                event.target.textContent = (isO) ? "O" : "X";
                event.target.dataset.mark = event.target.textContent 
                isO = !isO;
                console.log('This works');
            }
        })
    }
}

gameMechanics();