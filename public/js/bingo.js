
function toggle_column_select() {
    const slider = document.getElementById("slider-checkbox")
    const content = document.getElementById("column-select-div")
    if (slider.checked) {
        content.style.maxHeight = null;
    } else {
        content.style.maxHeight = content.scrollHeight + "px";
    }
}