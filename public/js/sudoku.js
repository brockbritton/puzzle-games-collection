 
const available_games = {
    1 : easy_game1,
    2 : medium_game1,
    3 : hard_game1,
};

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
function play_a_game() {
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
function solve_a_game() {
    let rows_array = get_board_values();
    const solve_game = new solveSudokuGame(rows_array);
    if (solve_game.solution_board != null) {
        update_board(solve_game.solution_board.rows, null)
    } else {
        alert("no solution found. please make sure you have correctly input the board values.")
        console.log(solve_game.solution_board.rows)
    }
}

//to fill in a random board from Solve Board Control
function fill_random_board() {
    //put empty cells as no-space character
    const par = document.getElementById("game-type-header");
    par.innerHTML = `Solve Sudoku : Random`
    let rows_array = easy_game1
    update_board(rows_array, "game-solve") 
}

//Getting board values from 
function get_board_values() {
    const board_values = []
    for (let r = 0; r < 9; r++) {
        let row = []
        let cells = document.getElementsByClassName(`row${r}`);
        for (let i = 0; i < 9; i++) {
            if (cells[i].innerHTML == "") {
                row.push(null)
            } else {
                row.push(Number(cells[i].innerHTML))
            }
            
        }
        board_values.push(row)
    }
    return board_values
}

function reset_sudoku_board_options() {
    clear_board_values()
    //reset the gamemode dropdown
}




//Clear Board Button
function clear_board_values() {
    //clear the board numbers
    //update all cell styles to the basic non-bold text style
    update_board(null, "reset")
    
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
                cells[i].setAttribute("contenteditable", 'false');
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
                cells[i].setAttribute("contenteditable", 'false');
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
