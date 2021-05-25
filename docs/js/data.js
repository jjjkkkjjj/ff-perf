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
    //$.get(file, function (data) {
    //    var csvdata = Papa.parse(data);
    //    console.log(csvdata);
    //});
    var reader = new FileReader();
    reader.onload = function(event) {
        var csv = papa.parse(event.target.result);  
        data = [];
        for (const line of csv.data){
            data.push({"Date": line[0], "TRIMP": line[1]});
        }
        // update table and graph
        window.updateAll(data);
    }
    reader.readAsText(file)

});

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


//========== show table ===========
// table data
var defaultdata = [
    { "Date": "2021/05/02", "TRIMP": 25},
    { "Date": "2021/05/03", "TRIMP": 45},
    { "Date": "2021/05/05", "TRIMP": 29},
];
$(window).ready(function() {
    window.updateAll(defaultdata);
});