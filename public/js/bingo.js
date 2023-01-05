
function toggleBingoStates() {
    let caller_div = document.getElementById("bingo-caller-div")
    let player_div = document.getElementById("bingo-player-div")
    let bingo_toggle = document.getElementById("slider-toggle-bingo");
    if (bingo_toggle.checked) {
        caller_div.style.display = "flex";
        player_div.style.display = "none";
        curr_bingo_state = new CallerOrganizer();
    } else {
        caller_div.style.display = "none";
        player_div.style.display = "block";
        curr_bingo_state = new PlayerOrganizer();
    }
}

function buildCallerCalledNumbersTable() {
    const table_container = document.getElementById("called-number-table-div")
    const table = document.createElement("table");
    table.setAttribute("id", "called-nums-table");
    

    const col_headers = ["B", "I", "N", "G", "O"]
    let table_header_row = table.insertRow(0);
    for (let i = 0; i < col_headers.length; i++) {
        let column_th = document.createElement("th");
        column_th.innerHTML = col_headers[i]
        table_header_row.appendChild(column_th)
    }
    
    for (let r = 1; r <= 15; r++) {
        let table_row = table.insertRow(r);
        for (let d = 0; d < 5; d++) {
            let cell = table_row.insertCell(d)
            cell.innerHTML = (d * 15) + (r)
            cell.setAttribute("id", `cell${(d * 15) + (r)}`)
            cell.classList.add("cell_number_uncalled", "cell_number_class", "numbers-font");
        }
    }
    table_container.appendChild(table)

}

function buildPlayerCalledNumbersTable() {
    const table_container = document.getElementById("numbers-table-container")
    const table = document.createElement("table")
    table.setAttribute("id", "selectable-number-table")

    const header_letters = ["B", "I", "N", "G", "O"]
    for (let r = 0; r < 5; r++) {
        let table_row = table.insertRow(r)
        let header_cell = table_row.insertCell(0)
        header_cell.classList.add("horizontal-table-header-cell")
        header_cell.innerHTML = header_letters[r] 
        for (let i = 1; i < 16; i++) {
            let cell = table_row.insertCell(i)
            cell.classList.add("horizontal-table-cell", "numbers-font")
            cell.setAttribute("onclick", "curr_bingo_state.numberCellClicked(this)")
            cell.innerHTML = `${(15 * r) + i}`
        }
    }
    table_container.appendChild(table)

    const instructions_par = document.createElement("p");
    instructions_par.classList.add("bingo-table-captions")
    instructions_par.innerHTML = "when a number is called, click the corresponding cell. your board(s) below will be automatically updated."
    table_container.appendChild(instructions_par)
}

function buildCustomPatternSelectBoard() {
    const table_container = document.getElementById("create-custom-winning-pattern-div")
    const table = document.createElement("table")
    table.setAttribute("id", "custom-pattern-table")
    let header_letters = ["B", "I", "N", "G", "O"]
    let header_row = document.createElement("tr") 
    for (let h = 0; h < header_letters.length; h++) {
        let header_cell = document.createElement("th")
        header_cell.innerHTML = header_letters[h]
        header_row.appendChild(header_cell)
    }
    table.appendChild(header_row)

    for (let i = 0; i < 5; i++) {
        let board_row = document.createElement("tr")
        for (let j = 0; j < 5; j++) {
            let board_cell = document.createElement("td") 
            board_cell.classList.add("custom-wp-cells", "numbers-font")
            board_cell.onclick = function() { this.classList.toggle("custom-board-cell-highlight") };
            if (i == 2 && j == 2) {
                board_cell.innerHTML = "FREE"
                board_cell.setAttribute("id", "custom-pattern-free-space")
            } else {
                board_cell.innerHTML = "##"
            }
            
            board_row.appendChild(board_cell)
        }
        table.appendChild(board_row)
    }
    table_container.appendChild(table)
}

function buildCustomPatternDisplayBoard() {
    const table_container = document.getElementById("custom_wp_display")
    const table = document.createElement("table")
    table.setAttribute("id", "display-wp-table")

    for (let i = 0; i < 5; i++) {
        let board_row = document.createElement("tr")
        for (let j = 0; j < 5; j++) {
            let board_cell = document.createElement("td") 
            board_cell.classList.add("wp-display-cells", "numbers-font") 
            if (i == 2 && j == 2) {
                board_cell.innerHTML = "FREE"
                board_cell.setAttribute("id", "custom-pattern-free-space")
            } else {
                board_cell.innerHTML = "##"
            }
            
            board_row.appendChild(board_cell)
        }
        table.appendChild(board_row)
    }
    table_container.appendChild(table)

    let table_label = document.createElement("p")
    table_label.classList.add("bingo-table-captions")
    table_label.innerHTML = "to win, you must match this pattern"
    table_container.appendChild(table_label)
}

