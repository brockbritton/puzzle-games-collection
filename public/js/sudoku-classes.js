
class SudokuBoard {
    constructor(rows_list) {
        this.rows = rows_list;
        this.buildColumns();
        this.buildNinths();
    }

    buildColumns() {
        let cols = [] 
        for (let i = 0; i < 9; i++) {
            cols.push([])
        }

        for (let row_index in this.rows) {
            for (let col_index in this.rows[row_index]) {
                cols[col_index].push(this.rows[row_index][col_index])
            }
        }
         
        this.columns = cols
    }

    buildNinths() {
        let ninths = [] 
        for (let i = 0; i < 9; i++) {
            ninths.push([])
        }
        
        for (let row_index in this.rows) {
            for (let col_index in this.rows[row_index]) {
                ninths[(3 * (Math.floor(row_index / 3) % 3) + (Math.floor(col_index / 3) % 3))].push(this.rows[row_index][col_index])
            }
        }
        this.ninths = ninths
        
    }

    updateNinth(row, col, num) {
        
    }

    updateBoard(num, row, col) {
        //we should only update the row, column, and ninth that was changed
        this.rows[row][col] = num
        this.columns[col][row] = num
        this.updateNinth(row, col, num)
    }

    checkBoardNumber(row, col) {
        return this.rows[row][col]
    }
}

class playSudokuGame {
    constructor(starting_rows, solved_rows) {
        this.playerBoard = new SudokuBoard(starting_rows)
        this.solvedBoard = new SudokuBoard(solved_rows)
    }
}

class solveSudokuGame {
    constructor(starting_rows) {
        this.board = new SudokuBoard(starting_rows);
        this.testData = false;
    }
}

const easy_game1 = [
    [null, 4, null, null, null, 7, 1, null, 8],
    [5, 3, null, null, 9, null, null, 7, null],
    [null, null, 7, 1, 6, 3, 9, 4, null],
    [4, null, 6, null, 8, null, 7, 5, 1],
    [null, 1, null, 4, null, null, 6, 9, null],
    [null, 5, 3, null, 1, null, null, null, 2],
    [9, 6, null, null, 3, null, null, 1, null],
    [3, 7, null, null, 5, 1, null, null, null],
    [1, null, null, 2, null, 9, 3, 6, 7]
]

