
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
            let sets = [this.rows, this.columns, this.ninths]
            for (let i in sets) {
                for (let cell in sets[i]) {
                    let subset_index = null
                    let row_index = null
                    let col_index = null
                    if (i == 0) {
                        subset_index = row
                        row_index = row
                        col_index = cell
                    } else if (i == 1) {
                        subset_index = col
                        col_index = col
                        row_index = cell  
                    } else if (i == 2) {
                        subset_index = 3 * (Math.floor(row / 3) % 3) + (Math.floor(col / 3) % 3)  
                        row_index = (3 * Math.floor(subset_index / 3)) + Math.floor(cell / 3) 
                        col_index = (3 * (subset_index % 3)) + (cell % 3)
                    }
                    let subset = sets[i][subset_index]
                    if (Array.isArray(subset[cell]) && subset[cell].includes(new_value)) {
    
                        subset[cell] = subset[cell].filter(number => number != new_value);
                        
                        if (sets[i][cell].length == 1) {
                            //this.updateBoard(set[cell][0], i, cell);  
                            this.updateBoard(subset[cell][0], row_index, col_index);   //ERROR HERE !!! i and cell != row and col in all situations
                        } else {
                            this.updateBoard(subset[cell], row_index, col_index); 
                        }
                    }
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
                        this.updateBoard(new_array[0], row, col)
                    } else {
                        this.updateBoard(new_array, row, col)
                    } 
                }
            }
        }
    }


    bruteForceSolveBoard() {
        this.createNotes()

        // keep updating board until the board is full of numbers
        let iterations = 0
        while (!this.checkBoardFilled(this.rows)) {
            iterations += 1
            for (let row in this.rows) {
                for (let col in this.rows[row]) {
                    if (Array.isArray(this.rows[row][col]) && this.rows[row][col].length == 1) {
                        this.updateBoard(this.rows[row][col][0], row, col)
                    }
                }
            }
            //check for notes that contain the only number for a set
            

            if (iterations == 50) {
                break
            }
        }
        console.log(`while loop solving iterations: ${iterations}`)
    }

    solveBoard() {
        this.bruteForceSolveBoard()
        if (this.checkBoardFilled()) {
            return true
        } else {
            return false
        }
        
    }

    checkBoardFilled() {
        var isANumber = function(currentValue) {
            return typeof currentValue === 'number';
        };
        
        var isAllNumbers = function(currentArray) {
            return currentArray.every(isANumber);
        }

        return this.rows.every(isAllNumbers)
    }

}

class solveSudokuGame {
    constructor(starting_rows) {
        this.starting_board = new SudokuBoard(starting_rows);

        if (this.starting_board.solveBoard()) {
            this.solution_board = new SudokuBoard(this.starting_board.rows) 
        } else {
            this.solution_board = null;
        }
        
    }
}

class playSudokuGame {
    constructor(starting_rows) {
        this.player_board = new SudokuBoard(starting_rows)
        
        //this.solution_board = this.player_board.solveBoard() 
    }
}

