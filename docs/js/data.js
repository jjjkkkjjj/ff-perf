require('jsgrid');
require('jsgrid/dist/jsgrid.min.css');
require('jsgrid/dist/jsgrid-theme.min.css');

const papa = require('papaparse');

// load csv
$('.icontxt#import').on('click', function(){
    $('.dumfbtn').click();
});
$('.dumfbtn').change(function(){
    const file = this.files[0];
    parseCSVAndUpdate_from_DOM(file);
});

/**
 * Parse CSV from a selected file and update contents
 * @param {File} file The File object from DOM
 */
function parseCSVAndUpdate_from_DOM(file){
    var reader = new FileReader();
    // async
    reader.onload = function(event) {
        var csv = papa.parse(event.target.result);  
        window.updateAll(csv);
    }

    // call above onload function asynchronously
    reader.readAsText(file);
}

/**
 * Parse CSV from path and update contents
 * @param {String} str The csv path
 */
function parseCSVAndUpdate_from_string(path){
    fetch(path)
        .then(response => response.text())
        .then(str => {
            // async
            var csv = papa.parse(str);
            window.updateAll(csv);
    });
}

/**
 * Update table from Object Array.
 * @param {Array} data The Object Array. The Object contains 'Date' and 'TRIMP'
 */
function updateTable(data){
    // update global variable
    window.data = data;
    $("#dattable").jsGrid({
        width: "100%",
        height: "auto",
    
        inserting: true,
        editing: true,
        sorting: true,
        paging: true,
    
        data: data,
    
        fields: [
            { name: "Date", type: "text", width: 150, align: "center", validate: "required" },
            { name: "TRIMP", type: "number", width: 50, align: "center", validate: "required" },
            { type: "control" }
        ]
    });
}
window.updateTable = updateTable;


/**
 * Call this function on loaded Dom
 */
$(window).ready(function() {
    parseCSVAndUpdate_from_string('assets/default.csv');
});