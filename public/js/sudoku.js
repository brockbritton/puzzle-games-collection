 
const available_games = {
    1 : easy_game1,
    2 : medium_game1,
    3 : hard_game1,
}


function build_sudoku_board() {
    const board = document.createElement("table");
    board.setAttribute('id','sudoku-board');
    
    for (let br = 0; br < 3; br++) {
        const row = document.createElement("tr");
        for (let bc = 0; bc < 3; bc++) {
            const cell = document.createElement("td");
            cell.classList.add("boxes");
            const cell_tbl = document.createElement("table");
            for (let cr = 1; cr <= 3; cr++) {
                const cell_row = document.createElement("tr");
                for (let cc = 1; cc <= 3; cc++) {
                    const num_cell = document.createElement("td");
                    num_cell.classList.add("cells");
                    num_cell.classList.add(`row${((br*3)+cr)-1}`)
                    num_cell.classList.add(`col${((bc*3)+cc)-1}`) 
                    num_cell.classList.add(`nin${(3*br)+bc}`)
                    num_cell.setAttribute('id', `${((br*3)+cr)-1}.${((bc*3)+cc)-1}.${(3*br)+bc}`)
                    num_cell.setAttribute("contenteditable", 'true')
                    num_cell.addEventListener('keydown', changeCellValue);
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
    let select_radio = get_checked_radio("sudoku-play-difficulty")
    if (select_radio != null) {
        console.log(`playing a level ${select_radio.value} game`)
        let radio_label = document.querySelector(`label[for=${select_radio.id}]`);
        let par = document.getElementById("game-type-header");
        par.innerHTML = `Play Sudoku : ${radio_label.innerHTML}`
        fill_in_board(available_games[select_radio.value])
        update_cell_styles("game")
    } else {
        alert("please select a difficulty to play a game")
    }
}

//Solve Board Button
function solve_a_game() {
    let select_radio = get_checked_radio("sudoku-solve-visual")
    if (select_radio != null) {
        let radio_label = document.querySelector(`label[for=${select_radio.id}]`);
        let par = document.getElementById("game-type-header");
        console.log(`Solving with ${radio_label.innerHTML}`)
        par.innerHTML = `Solve Sudoku : ${radio_label.innerHTML}`
        let rows_array = get_board_values();
        update_cell_styles("game")
        const solve_game = new solveSudokuGame(rows_array);
    } else {
        alert("please select a display option to solve a game")
    }
    
    

}

function get_checked_radio(id) {
    let radios = document.getElementsByName(id);
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            return radios[i]
        }
    }
    return null
}

//Clear Board Button
function clear_board_values() {
    update_cell_styles(null)
    fill_in_board(null)
    document.getElementById("game-type-header").innerHTML = "";
}

function fill_in_board(board_array) {
    for (let r = 0; r < 9; r++) {
        let cells = document.getElementsByClassName(`row${r}`);
        for (let i = 0; i < 9; i++) {
            if (board_array == null) {
                cells[i].innerHTML = "";
                cells[i].setAttribute("contenteditable", 'true');
                cells[i].addEventListener('keydown', changeCellValue);
            } else {
                cells[i].innerHTML = board_array[r][i]
                if (cells[i].innerHTML == "") {
                    cells[i].setAttribute("contenteditable", 'true');
                    cells[i].addEventListener('keydown', changeCellValue);
                } else {
                    cells[i].setAttribute("contenteditable", 'false');
                }
            } 
        }
    }
}

function dev_fillin(type) {
    for (let r = 0; r < 9; r++) {
        let cells = document.getElementsByClassName(`row${r}`);
        for (let c = 0; c < 9; c++) {
            if (type == "row") {
                cells[c].innerHTML = r
            } else if (type == "col") {
                cells[c].innerHTML = c
            } else if (type == "ninth") {
                cells[c].innerHTML = (3 * (Math.floor(r / 3) % 3) + (Math.floor(c / 3) % 3))
            }
            
        }
    }
}

function update_cell_styles(type) {
    for (let r = 0; r < 9; r++) {
        let cells = document.getElementsByClassName(`row${r}`);
        for (let i = 0; i < 9; i++) {
            if (cells[i].innerHTML != "") {
                if (type == null) {
                    cells[i].style.fontWeight = 400
                    cells[i].setAttribute("contenteditable", 'true');
                } else if (type == "game") {
                    cells[i].style.fontWeight = 700
                    cells[i].setAttribute("contenteditable", 'false');
                }
            }
        }
    }
}

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

function changeCellValue(event) {
    const cell = event.target
    //If the key is not a number 1-9, don't allow the input
    if (((event.which < 49) || (event.which > 57)) && (event.which != 8)) {
        event.preventDefault()
    } else if (cell.innerHTML.length != 0) {
        cell.innerHTML = ""
    }
}

function toggle_instructions() {
    var content = document.getElementById("sudoku-instructions-content")
    if (content.style.maxHeight){
        content.style.maxHeight = null;
    } else {
        content.style.maxHeight = content.scrollHeight + "px";
    } 
}; 