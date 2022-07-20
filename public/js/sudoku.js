
function build_sudoku_board() {
    const board = document.createElement("table");
    
    for (let br = 0; br < 3; br++) {
        const row = document.createElement("tr");
        for (let bc = 0; bc < 3; bc++) {
            const cell = document.createElement("td");
            cell.classList.add("boxes");
            const cell_tbl = document.createElement("table");
            for (let cr = 0; cr < 3; cr++) {
                const cell_row = document.createElement("tr");
                for (let cc = 0; cc < 3; cc++) {
                    const num_cell = document.createElement("td");
                    num_cell.classList.add("cells");
                    num_cell.innerHTML = `${br*cr}.${bc*cc}`;
                    cell_row.appendChild(num_cell)
                }
                cell_tbl.appendChild(cell_row)
            }
            cell.appendChild(cell_tbl)
            row.appendChild(cell)
        }
        board.appendChild(row)
    }
    
    document.getElementById("sudoku-board").appendChild(board)


}

function access_sudoku_cell(row, col) {

}