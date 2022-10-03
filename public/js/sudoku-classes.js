
class SudokuBoard {
    constructor(rows_list) {
        this.rows = rows_list;
        this.buildColumns(); //this.columns
        this.buildNinths(); //this.ninths
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

    updateBoard(new_value, row, col) {
        //we should only update the row, column, and ninth that was changed
        this.rows[row][col] = new_value
        this.columns[col][row] = new_value
        this.ninths
            [3 * (Math.floor(row / 3) % 3) + (Math.floor(col / 3) % 3)]
            [(row % 3) + (col % 3) + ((row % 3) * 2)] = new_value;
        
        //the notes for each cell must also be updated
        if (typeof new_value === 'number') {
            let sets = [this.rows[row], this.columns[col], this.ninths[3 * (Math.floor(row / 3) % 3) + (Math.floor(col / 3) % 3)]]
            for (let i in sets) {
                for (let cell in sets[i]) {
                    if (Array.isArray(sets[i][cell]) && sets[i][cell].includes(new_value)) {
                        sets[i][cell] = sets[i][cell].filter(number => number != new_value);
                        
                        if (sets[i][cell].length == 1) {
                            this.updateBoard(sets[i][cell][0], i, cell); 
                        } else {
                            this.updateBoard(sets[i][cell], i, cell); 
                        }
                    }
                } 
            }
        }
    }

    checkBoardNumber(row, col) {
        return this.rows[row][col]
    }

    bruteForceSolveBoard() {
        for (let row in this.rows) {
            for (let col in this.rows[row]) {
                if (this.rows[row][col] == null) {
                    this.rows[row][col] = []
                    for (let poss_num = 1; poss_num <= 9; poss_num++) {
                        if (!(this.rows[row].includes(poss_num) || this.columns[col].includes(poss_num) || this.ninths[3 * (Math.floor(row / 3) % 3) + (Math.floor(col / 3) % 3)].includes(poss_num))) {
                            this.rows[row][col].push(poss_num)
                        }
                    }
                    if (this.rows[row][col].length == 0) {
                        return false
                    } else {
                        this.updateBoard(this.rows[row][col], row, col)
                    } 
                    // causes bugs : else if (this.rows[row][col].length == 1) {
                      //this.updateBoard(this.rows[row][col][0], row, col)
                }
            }
        }
        //more runs
        for (let row in this.rows) {
            for (let col in this.rows[row]) {
                if (Array.isArray(this.rows[row][col]) && this.rows[row][col].length == 1) {
                    this.rows[row][col]
                }
            }
        }
        return this.rows
        //check each row, col, and ninth
        //check each col
    }

    solveBoard() {
        return this.bruteForceSolveBoard()
    }

    checkBoardSolved() {
        
    }
}

class solveSudokuGame {
    constructor(starting_rows) {
        this.starting_board = new SudokuBoard(starting_rows);
        this.solution_board = new SudokuBoard(this.starting_board.solveBoard())
    }
}

class playSudokuGame {
    constructor(starting_rows) {
        this.player_board = new SudokuBoard(starting_rows)
        this.solution_board = this.player_board.solveBoard() 
    }
}

