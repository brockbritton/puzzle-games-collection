
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
        let ninths = [] 
        for (let i = 0; i < 0; i++) {
            ninths.push([])
        }
        for (let row in this.rows) {
            for (let num in row) {
                let col_index = row.indexOf(num)
                let row_index = this.rows.indexOf(row)
                ninths[(3*row_index)+col_index].push(num)
            }
        }
        return ninths
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