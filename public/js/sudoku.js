
class SudokuBoard {
    constructor(rows_list) {
        this.rows = rows_list;
        this.cols = this.buildColumns();
        this.ninths = this.buildNinths();
    }

    buildColumns() {
        let cols = [] 
        for (let i = 0; i < 0; i++) {
            cols.push([])
        }

        for (let row in this.rows) {
            for (let num in row) {
                let col_index = row.indexOf(num)
                cols[col_index].push(num)
            }
        }
        return cols
    }

    buildNinths() {
        
    }
}




const sudoku_to_play = {
    // 0 : [[starting], [solved]]
    1: [
        [["", "4", "", "", "", "7", "1", "", "8"],
        ["5", "3", "", "", "9", "", "", "7", ""],
        ["", "", "7", "1", "6", "3", "9", "4", ""],
        ["4", "", "6", "", "8", "", "7", "5", "1"],
        ["", "1", "", "4", "", "", "6", "9", ""],
        ["", "5", "3", "", "1", "", "", "", "2"],
        ["9", "6", "", "", "3", "", "", "1", ""],
        ["3", "7", "", "", "5", "1", "", "", ""],
        ["1", "", "", "2", "", "9", "3", "6", "7"]],
        []
    ]
}

const sudoku_to_solve = {
    1: [
        ["", "4", "", "", "", "7", "1", "", "8"],
        ["5", "3", "", "", "9", "", "", "7", ""],
        ["", "", "7", "1", "6", "3", "9", "4", ""],
        ["4", "", "6", "", "8", "", "7", "5", "1"],
        ["", "1", "", "4", "", "", "6", "9", ""],
        ["", "5", "3", "", "1", "", "", "", "2"],
        ["9", "6", "", "", "3", "", "", "1", ""],
        ["3", "7", "", "", "5", "1", "", "", ""],
        ["1", "", "", "2", "", "9", "3", "6", "7"]
        ]
}




function build_sudoku_board() {
    const board = document.createElement("table");
    
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
                    num_cell.setAttribute("id",`${((br*3)+cr)-1}.${((bc*3)+cc)-1}`);
                    num_cell.setAttribute("contenteditable", 'false')
                    num_cell.addEventListener('keydown', changeCellValue);
                    num_cell.innerHTML = sudoku_to_solve[1][((br*3)+cr)-1][((bc*3)+cc)-1];
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

function changeCellValue(event) {
    const cell = event.target
    
    //If the key is not a number 1-9, 
    // don't allow the input
    if ((event.which < 49) || (event.which > 57)) {
        event.preventDefault()
    } else if (cell.innerHTML.length != 0) {
        cell.innerHTML = ""
    }
}