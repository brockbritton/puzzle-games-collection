
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

    findUniqueNoteValues() {
        let sets = [this.rows, this.columns, this.ninths]
        for (let i in sets) {
            for (let subset in sets[i]) {
                let existing_set_values = {
                    1: [],
                    2: [], 
                    3: [], 
                    4: [], 
                    5: [], 
                    6: [], 
                    7: [], 
                    8: [], 
                    9: []
                }
                //iterate through each cell in a set, and if theres an array, 
                //count up the note numbers in each cell
                for (let cell in sets[i][subset]) {
                    if (Array.isArray(sets[i][subset][cell])) {
                        //count up all note values in a set
                        for (let note_value in sets[i][subset][cell]) {
                            existing_set_values[sets[i][subset][cell][note_value]].push([i, subset, cell])
                        } 
                    } 
                }
                for (let key in existing_set_values) {
                    if (existing_set_values[key].length == 1) {
                        let row_index = null
                        let col_index = null
                        if (existing_set_values[key][0][0] == 0) {
                            row_index = existing_set_values[key][0][1]
                            col_index = existing_set_values[key][0][2]
                        } else if (existing_set_values[key][0][0] == 1) {
                            col_index = existing_set_values[key][0][1]
                            row_index = existing_set_values[key][0][2] 
                        } else if (existing_set_values[key][0][0] == 2) {
                            row_index = (3 * Math.floor(existing_set_values[key][0][1] / 3)) + Math.floor(existing_set_values[key][0][2] / 3) 
                            col_index = (3 * (existing_set_values[key][0][1] % 3)) + (existing_set_values[key][0][2] % 3)
                        }

                        this.updateBoard(Number(key), row_index, col_index);
                    }   
                }
            }
        }
    }

    findNakedPairs() {
        //let sets = [this.rows, this.columns, this.ninths]
        let sets = [this.columns]
        for (let i in sets) {
            //iterate through the subsets of each set
            for (let subset in sets[i]) {
                //iterate through the cells of each subset
                console.log(`subset: ${subset}`)
                for (let cell in sets[i][subset]) {
                    //if a cell is an array, and has a length of 2
                    
                    if (Array.isArray(sets[i][subset][cell]) && sets[i][subset][cell].length == 2) {
                        
                        
                        let shared_rows = [];
                        let shared_columns = [];
                        let shared_ninths = [];
                        let subset_filter = sets[i][subset].filter(value => value != sets[i][subset][cell])
                        if (subset == 6) {
                            console.log(`cell value: ${sets[i][subset][cell]}`)
                            console.log(`column:`)
                            console.log(sets[i][subset])
                            console.log(`filtered`)
                            console.log(subset_filter)
                            console.log(`count: ${subset_filter.length}`)
                            console.log("")
                        }
                        
                    
                    }
                }
            }
        }
    }

    findHiddenPairs() {
        //where there are naked pairs hidden within other notes in those cells
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
        while (!this.checkBoardFilled()) {
            iterations += 1
            for (let row in this.rows) {
                for (let col in this.rows[row]) {
                    if (Array.isArray(this.rows[row][col]) && this.rows[row][col].length == 1) {
                        this.updateBoard(this.rows[row][col][0], row, col)
                    }
                }
            }
            //check for notes that contain the only number for a set
            this.findUniqueNoteValues()

            //check if two notes in a set contain the same and only two numbers
            
            //this.findHiddenPairs() 
            
            if (iterations == 10) {
                break
            }
            
        }
        this.findNakedPairs()
        console.log(`while loop solving iterations: ${iterations}`)
    }

    solveBoard() {
        this.bruteForceSolveBoard()
        if (this.checkBoardFilled()) {
            return true
        } else {
            //return false 
            return true //dev
        }
        
    }

    checkBoardFilled() {
        const isANumber = function(currentValue) {
            return typeof currentValue === 'number';
        };
        
        const isAllNumbers = function(currentArray) {
            return currentArray.every(isANumber);
        }

        return this.rows.every(isAllNumbers)
    }

    checkAllSame(array) {
        const areTheSame = function(currentValue) {
            return array[0] === currentValue;
        };

        return array.every(areTheSame)
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

