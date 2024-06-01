document.addEventListener('DOMContentLoaded', () => {

    const socket = io();

    const colorMessage = document.getElementById('color');
    const currentPlayerMessage = document.getElementById('currentPlayer');
    const resetButton = document.getElementById('reset');


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

    function checkWinner(){
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns; c++) {
                if (board[r][c].classList.contains(currentPlayer)) {
                    if (checkDirection(r, c, 1, 0) ||
                        checkDirection(r, c, 1, 1) ||
                        checkDirection(r, c, 0, 1) ||
                        checkDirection(r, c, 1, -1)) {
                        gameIsOver = true;
                        currentPlayerMessage.innerText = `${currentPlayer} wins!`;
                        return;
                    }
                }
            }
        }
    }


    function checkDirection(r, c, dr, dc) {
        let count = 1;
        let rr = r + dr;
        let cc = c + dc;
        while (rr >= 0 && rr < rows && cc >= 0 && cc < columns && board[rr][cc].classList.contains(currentPlayer)) {
            count++;
            rr += dr;
            cc += dc;
        }
        rr = r - dr;
        cc = c - dc;
        while (rr >= 0 && rr < rows && cc >= 0 && cc < columns && board[rr][cc].classList.contains(currentPlayer)) {
            count++;
            rr -= dr;
            cc -= dc;
        }
        return count >= 4;
    }   

    function resetGame(){
        currentPlayer = 'red';
        for(let r = 0; r < rows; r++){
            for(let c = 0; c < columns; c++){
                board[r][c].classList.remove('red', 'yellow');
                board[r][c].classList.add('empty');
            }
        }
    }


    function handleResetButton(){
        socket.emit('reset-game');
    }

    socket.on('player-left',(color, numPlayers)=>{
        resetGame();

        myColor = color;
        colorMessage.innerText = `You are ${color}`;

        if(numPlayers === 1){
            currentPlayerMessage.innerText = 'Waiting for opponent...';
            gameIsOver = true;
        }
        else{
            socket.emit('start-game');
        }
    });


    socket.on("resetting-the-game", () =>{
        resetGame();
        gameIsOver = false;
        currentPlayer = 'red';
        currentPlayerMessage.innerText = `Current Player: ${currentPlayer}`;
    });


    socket.on('update-board', (r, c)=>{
        board[r][c].classList.remove('empty');
        board[r][c].classList.add(currentPlayer);
        checkWinner();

        if(!gameIsOver){
            currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
            currentPlayerMessage.innerText = `Current Player: ${currentPlayer}`;
        }
        
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

    function displayResetButton(){
        if(myColor === 'spectator'){
            resetButton.style.display = 'none';
        }
        else{
            resetButton.style.display = 'block';
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
        currentPlayer = 'red';
        currentPlayerMessage.innerText = `Current Player: ${currentPlayer}`;
        gameIsOver = false;
        displayResetButton();
    });

    socket.on('player-joined', (color, numPlayer) =>{
        creatingPlayer(color, numPlayer);
    });

    resetButton.addEventListener('click', handleResetButton);


    createBoard();
});
