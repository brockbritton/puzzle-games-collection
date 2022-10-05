
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
                this.updateNotes(sets[i], new_value)
            }
        }
    }

    updateNotes(set, new_value) {
        for (let cell in set) {
            if (Array.isArray(set[cell]) && set[cell].includes(new_value)) {
                set[cell] = set[cell].filter(number => number != new_value);
                
                if (set[cell].length == 1) {
                    //this.updateBoard(set[cell][0], i, cell);  
                    this.updateBoard(set[cell], i, cell);   //ERROR HERE !!! i and cell != row and col in all situations
                } else {
                    this.updateBoard(set[cell], i, cell); 
                }
            }
        } 
    }

    createNotes() {
        for (let row in this.rows) {
            for (let col in this.rows[row]) {
                if (this.rows[row][col] == null) {
                    let new_array = []
                    for (let poss_num = 1; poss_num <= 9; poss_num++) {
                        if (!(this.rows[row].includes(poss_num) || this.columns[col].includes(poss_num) || this.ninths[3 * (Math.floor(row / 3) % 3) + (Math.floor(col / 3) % 3)].includes(poss_num))) {
                            new_array.push(poss_num)
                        }
                    }
                    if (new_array.length == 1) {
                        //this.updateBoard(new_array[0], row, col)
                        this.updateBoard(new_array, row, col)
                    } else {
                        this.updateBoard(new_array, row, col)
                    } 
                    // causes bugs : else if (this.rows[row][col].length == 1) {
                      //this.updateBoard(this.rows[row][col][0], row, col)
                }
            }
        }
    }


    bruteForceSolveBoard() {
        this.createNotes()

        this.updateBoard(5, 0, 0) //num, row, col

        // keep updating board until the board is full of numbers
        //while (!this.checkBoardFilled(this.rows)) {}
        /*
        for (let row in this.rows) {
            for (let col in this.rows[row]) {
                if (Array.isArray(this.rows[row][col]) && this.rows[row][col].length == 1) {
                    this.updateBoard(this.rows[row][col][0], row, col)
                }
            }
        }
        */

        //check for notes that contain the only number for a set
        
        
    }

    solveBoard() {
        /*
        if (this.checkBoardFilled()) {
            return this.rows
        } else {
            this.bruteForceSolveBoard()
        }
        */
        this.bruteForceSolveBoard()
        return true
        
    }

    checkBoardFilled(board_array) {
        var isANumber2 = function(currentValue) {
            return typeof currentValue === 'number';
        };
        
        var isAllNumbers2 = function(currentArray) {
            return currentArray.every(isANumber2);
        }

        return this.rows.every(isAllNumbers2)
    }

}

class solveSudokuGame {
    constructor(starting_rows) {
        this.starting_board = new SudokuBoard(starting_rows);

        if (this.starting_board.solveBoard()) {
            this.solution_board = new SudokuBoard(this.starting_board.rows) 
        } else {
            alert("No Solution Found")
        }
        
    }
}

class playSudokuGame {
    constructor(starting_rows) {
        this.player_board = new SudokuBoard(starting_rows)
        
        //this.solution_board = this.player_board.solveBoard() 
    }
}

