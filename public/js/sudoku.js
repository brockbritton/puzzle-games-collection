

 

function empty_sudoku_board() {
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
                    //num_cell.innerHTML = sudoku_to_solve[1][((br*3)+cr)-1][((bc*3)+cc)-1];
                    num_cell.setAttribute("contenteditable", 'false')
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

function fill_in_board() {
    for (let r = 0; r < 9; r++) {
        let cells = document.getElementsByClassName(`row${r}`);
        for (let i = 0; i < 9; i++) {
            cells[i].innerHTML = board_values[r][i] //need actual values
            if (cells[i].innerHTML == "") {
                cells[i].setAttribute("contenteditable", 'true')
                cells[i].addEventListener('keydown', changeCellValue);
            } else {
                cells[i].setAttribute("contenteditable", 'false')
            }
        }
    }
    
    
    
}


function changeCellValue(event) {
    const cell = event.target
    
    //If the key is not a number 1-9, 
    // don't allow the input
    if (((event.which < 49) || (event.which > 57)) && (event.which != 8)) {
        event.preventDefault()
    } else if (cell.innerHTML.length != 0) {
        cell.innerHTML = ""
    }
}