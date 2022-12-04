
class CallerOrganizer {
    constructor() {
        this.caller = null;
        this.resetUIVisuals();
        let pot_table_cells = document.getElementsByClassName("cell_number_class");
        if (pot_table_cells.length == 0) {
            this.buildCalledNumbersTable()
        }
    }

    buildCalledNumbersTable() {
        const table_div = document.getElementById("called-number-table-div")
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
                cell.classList.add("cell_number_uncalled", "cell_number_class");
            }
        }
        table_div.appendChild(table)
    
    }

    resetUIVisuals() {
        //reset the slider and checkboxes - so a new game cannot be accidentally created
        const slider = document.getElementById("slider-checkbox")
        if (slider.checked) {
            slider.checked = false
        }
        const checkboxes = document.getElementsByClassName("select-column-checkbox");
        for (let i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].checked) {
                checkboxes[i].checked = false
            }
        }
        
        //clear the called number text
        let html_display = document.getElementById("html-call-display")
        html_display.innerHTML = "&#8203;"
        
        //reset the called numbers table
        const table_cells = document.getElementsByClassName("cell_number_class")
        for (let i = 0; i < table_cells.length; i++) {
            if (table_cells[i].classList.length > 2) {
                table_cells[i].classList.toggle("cell_number_called")
            }
        }
    }
    

    buildNewCaller() {
        const game_columns = this.collectColumns();
        if (game_columns.length > 0) {
            this.caller = new BingoCaller(game_columns)
        } else {
            alert("please select at least one column or toggle to all")
        }
        this.resetUIVisuals()
    
    }

    collectColumns() {
        const checkboxes = document.getElementsByClassName("select-column-checkbox");
        const slider = document.getElementById("slider-checkbox")
        if (slider.checked) {
            return [0, 1, 2, 3, 4];
        } else {
            let values = []; 
            for (let i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].checked) {
                    values.push(Number(checkboxes[i].value))
                }
            }
            return values
        }
    }

    checkCallNumber() {
        if (this.caller != null) {
            this.caller.callNumber()
        } else {
            alert("please start a new caller game first")
            let html_display = document.getElementById("html-call-display")
            html_display.innerHTML = "&#8203;" 
        }
    }

    toggleColumnsSelect() {
        const slider = document.getElementById("slider-checkbox")
        const checkboxes = document.getElementsByClassName("select-column-checkbox");
        for (let i = 0; i < checkboxes.length; i++) {
            if (slider.checked) {
                checkboxes[i].checked = true;
            } else {
                checkboxes[i].checked = false;
            }
        }
    }
}

class BingoCaller {
    constructor(column_values) {
        this.finished = false;
        this.past_calls = [];
        this.buildCallPool(column_values)
    }

    
    buildCallPool(columns) {
        this.call_pool = []
        for (let i = 0; i < columns.length; i++) {
            let start = columns[i] * 15
            for (let n = 1; n <= 15; n++) {
                this.call_pool.push(start + n)
            }
        }
    }

    callNumber() {
        if (this.call_pool.length > 0) {
            let random_index = Math.floor(Math.random() * (this.call_pool.length));
            let called_num = this.call_pool[random_index]
            this.call_pool.splice(random_index, 1)
            this.past_calls.push(called_num)

            let table_cell = document.getElementById(`cell${called_num}`)
            table_cell.classList.toggle("cell_number_called")

            const letters = ["B", "I", "N", "G", "O"]
            let html_display = document.getElementById("html-call-display")
            html_display.innerHTML = `${letters[Math.floor(called_num / 15.1)]} ${called_num}`
        } else {
            alert("all numbers for this game have been called")
            let html_display = document.getElementById("html-call-display")
            html_display.innerHTML = "&#8203;"
        }
        


    }
}