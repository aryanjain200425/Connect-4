document.addEventListener('DOMContentLoaded', () => {
    const rows = 6;
    const columns = 7;
    const board = [];
    let currentPlayer = 'red';

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

    function handleClick(event) {
        const column = event.target.dataset.column;
        for (let r = rows - 1; r >= 0; r--) {
            if (board[r][column].classList.contains('empty')) {
                board[r][column].classList.remove('empty');
                board[r][column].classList.add(currentPlayer);
                currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
                break;
            }
        }
    }


    createBoard();
});
