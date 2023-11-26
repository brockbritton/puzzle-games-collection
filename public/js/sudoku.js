


class SudokuBoard {
    constructor(rows_list) {
        this.rows = rows_list;
        this.buildColumns(); //this.columns
        this.buildBlocks(); //this.blocks
        this.all_ninths = [this.rows, this.columns, this.blocks];
        this.solve_sequence = [];
    }

    scanForValid() {
        for (let n = 0; n < this.all_ninths.length; n++) {
            for (let ninth_array of this.all_ninths[n]) {
                let ninth_dict = {
                    1:0,
                    2:0,
                    3:0,
                    4:0,
                    5:0,
                    6:0,
                    7:0,
                    8:0,
                    9:0,
                }
                for (let i = 0; i < ninth_array.length; i++) {
                    if (Number.isInteger(ninth_array[i])) {
                        ninth_dict[ninth_array[i]] += 1
                    }
                }

                //check the dict for values greater than 1
                for (let digit_count of Object.values(ninth_dict)) {
                    if (digit_count > 1) {
                        return false
                    }
                }
            }
            
        }
        return true
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

    buildBlocks() {
        let blocks = [] 
        for (let i = 0; i < 9; i++) {
            blocks.push([])
        }
        
        for (let row_index in this.rows) {
            for (let col_index in this.rows[row_index]) {
                blocks[(3 * (Math.floor(row_index / 3) % 3) + (Math.floor(col_index / 3) % 3))].push(this.rows[row_index][col_index])
            }
        }
        this.blocks = blocks
        
    }

    buildCellNotes() {
        for (let row in this.rows) {
            for (let col in this.rows[row]) {
                if (this.rows[row][col] == null) {
                    let new_array = []
                    for (let poss_num = 1; poss_num <= 9; poss_num++) {
                        if (!(this.rows[row].includes(poss_num) || this.columns[col].includes(poss_num) || this.blocks[3 * (Math.floor(row / 3) % 3) + (Math.floor(col / 3) % 3)].includes(poss_num))) {
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

    updateBoard(new_value, row, col) {
        //update the solve sequence 
        this.solve_sequence.push([new_value, row, col])
        
        //we should only update the row, column, and ninth that was changed
        this.rows[row][col] = new_value
        this.columns[col][row] = new_value
        this.blocks
            [3 * (Math.floor(row / 3) % 3) + (Math.floor(col / 3) % 3)]
            [(row % 3) + (col % 3) + ((row % 3) * 2)] = new_value;
        
        //the notes for each cell must also be updated
        if (typeof new_value === 'number') {
            let sets = [this.rows, this.columns, this.blocks]
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

    updateCellNotes(subset, set_iterator, subset_index, values) {
        //the subset in which to update, the iterator of sets, subset index, values to be removed from subset
        for (let cell in subset) {
            if (Array.isArray(subset[cell]) && !this.checkArraysEqual(subset[cell], values)) {
                for (let v in values) {
                    if (Array.isArray(subset[cell]) && subset[cell].includes(values[v])) {
                        subset[cell].splice(subset[cell].indexOf(values[v]), 1)
                        if (subset[cell].length == 1) {
                            let row_index = null
                            let col_index = null
                            if (set_iterator == 0) {
                                row_index = subset_index
                                col_index = cell
            
                            } else if (set_iterator == 1) {
                                row_index = cell
                                col_index = subset_index

                            } else if (set_iterator == 2) {
                                row_index = (3 * Math.floor(subset_index / 3)) + Math.floor(cell / 3) 
                                col_index = (3 * (subset_index % 3)) + (cell % 3)

                            }
                            this.updateBoard(subset[cell][0], row_index, col_index) 
                        }
                    }
                }
            }
        }
    }

    findNakedSingles() {
        for (let row in this.rows) {
            for (let col in this.rows[row]) {
                if (Array.isArray(this.rows[row][col]) && this.rows[row][col].length == 1) {
                    this.updateBoard(this.rows[row][col][0], row, col)
                }
            }
        }
    }

    findHiddenSingles() {
        let sets = [this.rows, this.columns, this.blocks]
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
        let sets = [this.rows, this.columns, this.blocks]
        for (let i in sets) {
            i = Number(i)
            //iterate through the subsets of each set
            for (let subset in sets[i]) {
                //iterate through the cells of each subset
                subset = Number(subset)
                let found_pairs = []
                for (let cell in sets[i][subset]) {
                    cell = Number(cell)
                    let found_already = false
                    for (let f in found_pairs) {
                        if (this.checkArraysEqual(found_pairs[f], sets[i][subset][cell])) {
                            found_already = true
                        } 
                    }
                    //if a cell is an array, and has a length of 2
                    if (Array.isArray(sets[i][subset][cell]) && sets[i][subset][cell].length == 2 && !found_already) {
                        let shared_rows = [];
                        let shared_columns = [];
                        let shared_blocks = [];
                        let subset_filter = [];
                        let forEach_cell_index = 0;
                        sets[i][subset].forEach(element => {
                            if (this.checkArraysEqual(element, sets[i][subset][cell])) {
                                subset_filter.push(element)
                                if (i == 0) {
                                    shared_rows.push(subset)
                                    shared_columns.push(forEach_cell_index)
                                    shared_blocks.push(3 * (Math.floor(subset / 3) % 3) + (Math.floor(forEach_cell_index / 3) % 3))
                                } else if (i == 1) {
                                    shared_rows.push(forEach_cell_index)
                                    shared_columns.push(subset)
                                    shared_blocks.push(3 * (Math.floor(forEach_cell_index / 3) % 3) + (Math.floor(subset / 3) % 3))
                                } else if (i == 2) {
                                    shared_rows.push((3 * Math.floor(subset / 3)) + Math.floor(forEach_cell_index / 3))
                                    shared_columns.push((3 * (subset % 3)) + (forEach_cell_index % 3))
                                    shared_blocks.push(subset)
                                }

                            }
                            forEach_cell_index += 1
                        });
                        let shared_subsets = [shared_rows, shared_columns, shared_blocks];
                        let shares_list = [];
                        if (subset_filter.length == 2) {
                            found_pairs.push(sets[i][subset][cell])
                            for (let s in shared_subsets) {
                                if (shared_subsets[s][0] === shared_subsets[s][1]) {
                                    shares_list.push(shared_subsets[s][0]);
                                } else {
                                    shares_list.push(-1);
                                }

                            }
                            for (let j = 0; j < shares_list.length; j++) {
                                if (shares_list[j] != -1) {
                                    //the subset in which to update, the iterator of sets, subset index, values to be removed from subset
                                    this.updateCellNotes(sets[j][shares_list[j]], j, shares_list[j], sets[i][subset][cell])
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    findHiddenPairs() {
        //where there are naked pairs hidden within other notes in those cells
    }

    tryANumber() {
        //recursive !!
        //find hidden/naked pairs, plug in the first value for one cell, then try to solve
        //if solveboard() comes back false, try the other value, 
        //if both numbers come back false, try to go back to the first function call.

    }

    solveBoard() {
        this.buildCellNotes()

        // keep updating board until the board is full of numbers
        let iterations = 0
        while (!this.checkBoardFilled()) {
            iterations += 1
            //check for cells with only one number 
            //that need to converted from array to number
            this.findNakedSingles()

            //check for notes that contain the only number for a set
            this.findHiddenSingles()

            //check if two notes in a set contain the same and only two numbers
            this.findNakedPairs()
            
            //to build
            //this.findHiddenPairs() 
            //this.findXWing()
            //this.findSwordfish()
            //this.findForcingChains()
            //this.findXYWing()
            //this.findUniqueRectangle()
            //this.tryANumber() !!!
            
            if (iterations == 10) {
                console.log("board partially solved")
                //keep as true for partial solutions
                return true  
            }
            
        }
        console.log("board fully solved")
        
        return true
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

    checkArraysEqual(a, b) {
        return Array.isArray(a) &&
            Array.isArray(b) &&
            a.length === b.length &&
            a.every((val, index) => val === b[index]);
    }
}

function toggleSudokuPlaySolve() { 
    const gamemode_toggle = document.getElementById("slider-toggle-sudoku")
    const play_settings_div = document.getElementById("play-settings-div")
    const solve_settings_div = document.getElementById("solve-settings-div")
    if (gamemode_toggle.checked) {
        solve_settings_div.style.display = "none"
        play_settings_div.style.display = "block"
    } else {
        solve_settings_div.style.display = "block"
        play_settings_div.style.display = "none"
    }
}

function build_sudoku_board() {
    const board = document.createElement("table");
    board.setAttribute('id','sudoku-board');
    
    for (let br = 0; br < 3; br++) {
        const row = document.createElement("tr");
        for (let bc = 0; bc < 3; bc++) {
            const cell = document.createElement("td");
            cell.classList.add("board-ninths");
            const cell_tbl = document.createElement("table");
            for (let cr = 1; cr <= 3; cr++) {
                const cell_row = document.createElement("tr");
                for (let cc = 1; cc <= 3; cc++) {
                    const num_cell = document.createElement("td");
                    num_cell.classList.add("board-cells");
                    num_cell.classList.add(`row${((br*3)+cr)-1}`)
                    num_cell.classList.add(`col${((bc*3)+cc)-1}`) 
                    num_cell.classList.add(`nin${(3*br)+bc}`)
                    num_cell.setAttribute('id', `${((br*3)+cr)-1}.${((bc*3)+cc)-1}.${(3*br)+bc}`)
                    num_cell.setAttribute("contenteditable", 'true')
                    num_cell.addEventListener('keydown', changeCellValue);
                    num_cell.innerHTML = "&#8203;" //so cell innerhtml is in the center of the cell
                    cell_row.appendChild(num_cell)
                }
                cell_tbl.appendChild(cell_row)
            }
            cell.appendChild(cell_tbl)
            row.appendChild(cell)
        }
        board.appendChild(row)
    }
    document.getElementById("sudoku-board-div").appendChild(board)

}


//Play Game Button
function play_sudoku() {
    let select_radio = null;
    var radios = document.getElementsByName('play-difficulty');   
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            select_radio = radios[i]
        }
    }
    if (select_radio != null) {
        const radio_label = document.querySelector(`label[for=${select_radio.id}]`);
        const par = document.getElementById("game-type-header");
        par.innerHTML = `Play Sudoku : ${radio_label.innerHTML}`
        update_board(available_games[select_radio.value], "game-play")
    } else {
        alert("please select a difficulty to play")
    }
}

//Solve Board Button
function solve_sudoku() {
    const starting_rows = get_board_values()
    const game_board = new SudokuBoard(starting_rows);
    if (game_board.scanForValid()) {
        update_board(starting_rows, "game-solve")
        if (game_board.solveBoard()) {
            update_board(game_board.rows, null)
            //console.log(game_board.solve_sequence)
        } else {
            alert("No Solution Found")
        }
    } else {
        alert("This Board is not Valid")
    }
}

//to fill in a random board from Solve Board Control
let board_index = 0
function fill_random_board() {
    const available_games = [home_display_game, easy_game1, medium_game1, hard_game1, hidden_pairs_test, expert_game1, evil_game1]
    const par = document.getElementById("game-type-header");
    par.innerHTML = `Solve Sudoku : Random`
    board_index += 1
    if (board_index == available_games.length) {
        board_index = 0
    }
    update_board(available_games[board_index], "game-solve") 
    //update_board(test_game, "game-solve") 
}

//Getting board values from 
function get_board_values() {

    // does not work for user input numbers
    let board_values = []
    for (let r = 0; r < 9; r++) {
        let row = []
        let cells = document.getElementsByClassName(`row${r}`);
        for (let i = 0; i < 9; i++) {
            if (isNaN(parseInt(cells[i].innerHTML))) {
                row.push(null)
            } else {
                row.push(parseInt(cells[i].innerHTML))
            }
        }
        board_values.push(row)
    }
    return board_values
}

function reset_sudoku_board_options() {
    update_board(null, null)

}

function update_board(board_array, type) {
    // type = "game" or null
    // board_array = board values
    for (let r = 0; r < 9; r++) {
        let cells = document.getElementsByClassName(`row${r}`);
        for (let i = 0; i < 9; i++) {
            if (board_array == null) {
                cells[i].innerHTML = "&#8203;";
                cells[i].style.fontWeight = 400
                cells[i].setAttribute("contenteditable", 'true');
                //cells[i].addEventListener('keydown', changeCellValue);
            } else {
                //if board array has numbers
                if (Array.isArray(board_array[r][i])) {
                    cells[i].innerHTML = ""
                    const subcell_tbl = document.createElement("table");
                    subcell_tbl.classList.add("subcell-array-table")
                    for (let cr = 1; cr <= 3; cr++) {
                        const subcell_row = document.createElement("tr");
                        for (let cc = 1; cc <= 3; cc++) {
                            const subcell_num = document.createElement("td");
                            subcell_num.classList.add("subcell-array-number")
                            if (board_array[r][i].includes((3*(cr-1)) +cc)) {
                                subcell_num.innerHTML = `${(3*(cr-1))+cc}`
                            } else {
                                subcell_num.innerHTML == "&#8203;"
                            }
                            subcell_row.appendChild(subcell_num)
                        }
                        subcell_tbl.appendChild(subcell_row)
                    }
                    cells[i].appendChild(subcell_tbl)
                } else {
                    cells[i].innerHTML = board_array[r][i]
                    if (cells[i].innerHTML == "") {
                        cells[i].innerHTML == "&#8203;"
                        cells[i].setAttribute("contenteditable", 'true');
                        cells[i].addEventListener('keydown', changeCellValue);
                    } else {
                        cells[i].setAttribute("contenteditable", 'false');
                    }
                }
                
            } 
        }
    }

    if (type != null) {
        update_cell_styles(type)
    } 
    
}

function update_cell_styles(type) {
    for (let r = 0; r < 9; r++) {
        let cells = document.getElementsByClassName(`row${r}`);
        for (let i = 0; i < 9; i++) {
            if (type == "reset") {
                cells[i].style.fontWeight = 400
                cells[i].style.color = "#000000"
                cells[i].setAttribute("contenteditable", 'true');
            } else if (typeof type == "string" && type.slice(0, 4) == "game") {
                if (cells[i].innerHTML == "") {
                    let game_type = type.slice(5)
                    cells[i].style.fontWeight = 400
                    cells[i].style.color = "#0096FF"
                    if (game_type == "play") {
                        cells[i].setAttribute("contenteditable", 'true');
                    } else if (game_type == "solve") {
                        cells[i].setAttribute("contenteditable", 'false');
                    }
                } else {
                    cells[i].style.fontWeight = 700
                    cells[i].style.color = "#000000"
                    cells[i].setAttribute("contenteditable", 'false');
                }
            }
        }
    }
}

function dev_fillin(req) {
    for (let r = 0; r < 9; r++) {
        let cells = document.getElementsByClassName(`row${r}`);
        for (let c = 0; c < 9; c++) {
            if (req == "row") {
                cells[c].innerHTML = `${r}.${c}`
            } else if (req == "col") {
                cells[c].innerHTML = `${c}.${r}`
            } else if (req == "ninth") {
                cells[c].innerHTML = `${3 * (Math.floor(r / 3) % 3) + (Math.floor(c / 3) % 3)}.${(r % 3) + (c % 3) + ((r % 3) * 2)}`
            } else if (req == "bnin") {
                let ninth_num = 3 * (Math.floor(r / 3) % 3) + (Math.floor(c / 3) % 3)
                let cell = (r % 3) + (c % 3) + ((r % 3) * 2)
                let row_num = (3 * Math.floor(ninth_num / 3)) + Math.floor(cell / 3) 
                let col_num = (3 * (ninth_num % 3)) + (cell % 3)
                cells[c].innerHTML = `${row_num}.${col_num}`
            }
        }
    }
}




function changeCellValue(event) {
    const cell = event.target
    //If the key is not a number 1-9, don't allow the input
    if (((event.which < 49) || (event.which > 57)) && (event.which != 8)) {
        event.preventDefault()
    } else if (cell.innerHTML.length != 0) {
        cell.innerHTML = "&#8203;"
    }
}
