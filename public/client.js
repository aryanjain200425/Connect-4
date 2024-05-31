document.addEventListener('DOMContentLoaded', () => {

    const socket = io();

    const colorMessage = document.getElementById('color');
    const currentPlayerMessage = document.getElementById('currentPlayer');


    const rows = 6;
    const columns = 7;
    const board = [];
    let currentPlayer = 'red';
    let gameIsOver = true;
    let myColor = '';

    function createBoard() {
        const boardElement = document.getElementById('board');
        for (let r = 0; r < rows; r++) {
            const row = [];
            for (let c = 0; c < columns; c++) {
                const cell = document.createElement('div');
                cell.classList.add('cell', 'empty');
                cell.dataset.row = r;
                cell.dataset.column = c;
                cell.addEventListener('click', handleClick);
                boardElement.appendChild(cell);
                row.push(cell);
            }
            board.push(row);
        }
    }


    socket.on('update-board', (r, c)=>{
        board[r][c].classList.remove('empty');
        board[r][c].classList.add(currentPlayer);
        currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
        currentPlayerMessage.innerText = `Current Player: ${currentPlayer}`;
    });

    function handleClick(event) {

        if (gameIsOver || currentPlayer !== myColor ) {
            return;
        }


        const column = event.target.dataset.column;
        for (let r = rows - 1; r >= 0; r--) {
            if (board[r][column].classList.contains('empty')) {
                socket.emit('move', r, column);
                break;
            }
        }
    }

    function creatingPlayer(color, numPlayers){
        myColor = color;
        colorMessage.innerText = `You are ${color}`;

        if(numPlayers === 1){
            currentPlayerMessage.innerText = 'Waiting for opponent...';
        }
        else{
            socket.emit('start-game');
        }
    }


    socket.on('starting-the-game', ()=>{
        currentPlayerMessage.innerText = 'Current Player: red';
        gameIsOver = false;
    });

    socket.on('player-joined', (color, numPlayer) =>{
        creatingPlayer(color, numPlayer);
    });


    createBoard();
});
