
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
        //how to determine what index of the given ninth to update
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