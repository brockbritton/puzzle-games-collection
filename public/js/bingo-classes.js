
class CallerOrganizer {
    constructor() {
        this.caller = null;
        this.buildCalledNumbersTable()

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
    

    buildNewCaller(newCaller) {
        this.resetUIVisuals()
        this.caller = newCaller
    }

    resetUIVisuals() {
        //reset the slider and checkboxes - so a new game cannot be accidentally created
        //clear the called number text
        //reset the called numbers table
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

    call_number() {
        if (this.call_pool.length > 0) {
            let random_index = Math.floor(Math.random() * (this.call_pool.length));
            let called_num = this.call_pool[random_index]
            this.call_pool.splice(random_index, 1)
            this.past_calls.push(called_num)

            let table_cell = document.getElementById(`cell${called_num}`)
            table_cell.classList.toggle("cell_number_called")

            const letters = ["B", "I", "N", "G", "O"]
            let html_display = document.getElementById("html-call-display")
            html_display.innerHTML = `${letters[Math.floor(called_num / 15)]} ${called_num}`
        } else {
            alert("all numbers for this game have been called")
        }
        


    }
}