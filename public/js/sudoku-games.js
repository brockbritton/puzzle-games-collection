
class SudokuBoard {
    constructor(rows_list) {
        this.rows = rows_list;
        this.updateColumns();
        this.updateNinths();
    }

    updateColumns() {
        let cols = [] 
        for (let i = 0; i < 0; i++) {
            cols.push([])
        }

        for (let row in this.rows) {
            for (let num in row) {
                let col_index = row.indexOf(num)
                cols[col_index].push(num)
            }
        }
        this.cols = cols
    }

    updateNinths() {
        let ninths = [] 
        for (let i = 0; i < 0; i++) {
            ninths.push([])
        }
        for (let row in this.rows) {
            for (let num in row) {
                let col_index = row.indexOf(num)
                let row_index = this.rows.indexOf(row)
                ninths[(3*row_index)+col_index].push(num)
            }
        }
        this.ninths = ninths
    }

    updateBoard(num, row, col) {
        this.rows[row][col] = num
        this.updateColumns()
        this.updateNinths()
    }

    checkBoardNumber(row, col) {
        return this.rows[row][col]
    }
}

class playSudokuGame {
    constructor(starting_rows, solved_rows) {
        this.playerBoard = SudokuBoard(starting_rows)
        this.solvedBoard = SudokuBoard(solved_rows)

    }
}

class solveSudokuGame {
    
}



const sudoku_to_play = {
    // 0 : [[starting], [solved]]
    1: [
        [["", "4", "", "", "", "7", "1", "", "8"],
        ["5", "3", "", "", "9", "", "", "7", ""],
        ["", "", "7", "1", "6", "3", "9", "4", ""],
        ["4", "", "6", "", "8", "", "7", "5", "1"],
        ["", "1", "", "4", "", "", "6", "9", ""],
        ["", "5", "3", "", "1", "", "", "", "2"],
        ["9", "6", "", "", "3", "", "", "1", ""],
        ["3", "7", "", "", "5", "1", "", "", ""],
        ["1", "", "", "2", "", "9", "3", "6", "7"]],
        []
    ]
}

const sudoku_to_solve = {
    1: [
        ["", "4", "", "", "", "7", "1", "", "8"],
        ["5", "3", "", "", "9", "", "", "7", ""],
        ["", "", "7", "1", "6", "3", "9", "4", ""],
        ["4", "", "6", "", "8", "", "7", "5", "1"],
        ["", "1", "", "4", "", "", "6", "9", ""],
        ["", "5", "3", "", "1", "", "", "", "2"],
        ["9", "6", "", "", "3", "", "", "1", ""],
        ["3", "7", "", "", "5", "1", "", "", ""],
        ["1", "", "", "2", "", "9", "3", "6", "7"]
        ]
}